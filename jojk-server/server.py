#!/usr/bin/env python3
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from urlparse import urlparse, parse_qs
import re
import urllib
import json
import base64
import requests
import jwt
import os
import firebase_admin
from firebase_admin import credentials, auth
import ssl

CONFIG = {}

class Server(BaseHTTPRequestHandler):
    """
        Docstring
    """
    def _set_headers(self, content):
        self.send_response(200)
        self.send_header('Content-type', content)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    @staticmethod
    def qs_to_dict(qstr):
        """
            Return dict from query
        """
        final_dict = dict()
        for item in qstr.split("&"):
            final_dict[item.split("=")[0]] = item.split("=")[1]
        return final_dict
    
    @staticmethod
    def getUsername(accessToken):
        try: 
            headers = {'Authorization': 'Bearer %s' % (accessToken)}
            res = requests.get('https://api.spotify.com/v1/me', headers=headers)
            return json.loads(res.text)
        except Exception:
            return 'Failed'

    def get_token(self, code):
        """
            Get token
        """
        try:
            global CONFIG
            url     = 'https://accounts.spotify.com/api/token'
            payload = { 'grant_type' : 'authorization_code',
                        'code' : code,
                        'redirect_uri' : CONFIG['spotify_redirectURL'],
                        'client_id' : CONFIG['spotify_client'],
                        'client_secret' : CONFIG['spotify_secret']
                        }
            headers = {}
            res = requests.post(url, data=payload, headers=headers)
            
            data = json.loads(res.text)
            refresh_token = data.get('refresh_token')
            encoded = jwt.encode({'refresh_token': refresh_token}, CONFIG['spotify_secret'], algorithm='HS256')
            
            user = self.getUsername(data['access_token'])

            data['refresh_token'] = encoded
            data['firebase_token'] = auth.create_custom_token(user['id'])

            return json.dumps(data)
        except Exception, e:
            return 'Failed'
    def refresh_token(self, token):
        """
            Refresh token
        """
        try:
            global CONFIG

            decoded = jwt.decode(token[0], CLIENT_SECRET, algorithms=['HS256'])
            token = decoded.get('refresh_token')
            url     = 'https://accounts.spotify.com/api/token'
            payload = { 'grant_type' : 'refresh_token',
                        'refresh_token' : token,
                        'client_id' : CONFIG['spotify_client'],
                        'client_secret' : CONFIG['spotify_secret']
                        }
            headers = {}
            res = requests.post(url, data=payload, headers=headers)
            data = json.loads(res.text)

            return json.dumps(data)
        except Exception:
            print Exception
            return 'Failed'

    def do_GET(self):
        """
            Get
        """
        params = parse_qs(urlparse(self.path).query)
        if params.get('code'):
            self._set_headers('application/json')
            self.wfile.write(self.get_token(params['code']))
        elif params.get('refresh'):
            self._set_headers('application/json')
            self.wfile.write(self.refresh_token(params['refresh']))
        else:
            path = os.path.abspath(__file__)
            file_name = os.path.basename(__file__)
            path = path.replace(file_name, "")
            f = open(path + "index.html")
            self._set_headers('text/html')
            self.wfile.write(f.read())
        
def run(server_class=HTTPServer, handler_class=Server):
    global CONFIG

    path = os.path.abspath(__file__)
    file_name = os.path.basename(__file__)
    path = path.replace(file_name, "")

    with open('%sconfig.json' % (path), 'r') as f:
        CONFIG = json.load(f)
    
    cred = credentials.Certificate('%s%s' % (path, CONFIG['firebase_cred_file']))
    firebase = firebase_admin.initialize_app(cred)

    server_address = (CONFIG['host'], CONFIG['port'])
    httpd = server_class(server_address, handler_class)

    httpd.socket = ssl.wrap_socket (httpd.socket, certfile='%sserver.pem'  % (path), server_side=True)
    print 'Starting httpd...'

    httpd.serve_forever()

if __name__ == "__main__":
    run()
