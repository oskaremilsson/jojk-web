![jojk_pres](https://oskaremilsson.se/files/images/jojk_muckup.jpg)
# JoJk.

[Go to jojk.it](https://jojk.it)
### What is jojk?
JoJk is a hobby project, based on the same idea as an old school project of mine. An app that uses the Spotify API to let users explore the now playing of the region(s).

JoJk. was first created somewhere in the beginning of 2016 as a smaller schoolproject at Linneaus University. At the time it was a native Android app where users in the same town shared now playing. This way, people could find music that's actually playing right now. 

This time around, ReactJS is used for the client, Firebase is used as backend and a little bit of python is used as authserver to handle the tokens for Spotify and Firebase.

### How does it work?
- A user connects JoJk. with the Spotify-account
- A profile is being created on JoJk. with the same name as Spotify-id (oh well, a base64 version of it)
- JoJk. finds the user with geolocation
- The user plays a track
- After 1/3 of the tracks length, the track is emitted the region
- The track is being displayed on the regions 'Billboard'

### Features
- Share and explore now playing with current region
- Explore other regions shared tracks
- Preview a track (most tracks)
- Add tracks to Spotify-playlist
- Explore Artist of a track
- Explore the Album/EP/Single of a track
- Explore Playlist user listened to (if it is a public playlist)
- Explore the profile of who listened to the track
- Profile
-- See the top 10 tracks and Artists of a user
-- Soon™ a list of users public playlists
- Links to open stuff directly in Spotify
- Control Spotify playback


### Images
Note that images may not be up to date with features noted above.
#### Loginscreen
![login](https://oskaremilsson.se/files/images/jojk/login.png)

#### Region Billboard-view
![billboard](https://oskaremilsson.se/files/images/jojk/billboard.png)

#### Menu
![menu](https://oskaremilsson.se/files/images/jojk/menu.png)

#### Playlist-view
![playlist](https://oskaremilsson.se/files/images/jojk/playlist.png)

#### Artist-view
![artist](https://oskaremilsson.se/files/images/jojk/artist.png)

#### Album-view
![album](https://oskaremilsson.se/files/images/jojk/album.png)

#### Profile-view
![profile](https://oskaremilsson.se/files/images/jojk/profile.png)

#### Mockup desktop version
![imac](https://oskaremilsson.se/files/images/jojk/imac.jpg)

Project started: ~ 18 September 2017