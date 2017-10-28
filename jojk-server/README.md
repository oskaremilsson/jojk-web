# This is the JoJk-projects auth server.

##### This simple authserer does three things:
1. Creates a authtoken for firebase - the UID is the same as the Spotify-login-name.
2. /code?oauthcode: gets the OAuth code from client and excanges it into a Spotify authtoken.
3. /refresh?refreshcode: Refresh the Spotify authtoken.

The server needs (atleast) the following installed packages to run:
[Firefase Admin SDK](https://github.com/firebase/firebase-admin-python)
[PyJWT](https://github.com/jpadilla/pyjwt)

#### config.json
```json
{
    "host": "example.com",
    "port": 8080,
    "allow-origin": "https://example.com",
    "spotify_client": "clientID",
    "spotify_secret": "secretID",
    "spotify_redirectURL": "https://example.com/auth",
    "firebase_cred_file": "cred/credfile.json",
    "use_ssl": true,
    "pem_file": "server.pem"
}
```