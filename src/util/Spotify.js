const clientId = '21b05b95dc0049a9b5ff4fa258f7c3bb'
const redirectURI = 'https://fortunate-north.surge.sh/callback'
let accessToken;

// Module that interacts with the Spotify API
const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }

    const tokenFound = window.location.href.match(/access_token=([^&]*)/);
    const expireTime = window.location.href.match(/expires_in=([^&]*)/);

    if(tokenFound && expireTime) {
      accessToken = tokenFound[1];

      const tokenExpires = Number(expireTime[1]);

      window.setTimeout(() => accessToken = '', tokenExpires * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;

    } else {
      const accessUrl =  `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`

      window.location = accessUrl;

    }
  }, // end of getAccessToken method


  search(userSearchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${userSearchTerm}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
          return response.json();
      }).then(jsonResponse => {
        if(!jsonResponse.tracks) {
          return [];
        }
          // console.log(jsonResponse);
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));//end of map
        }); // end of then jsonResponse.tracks
  }, //end of search method

  savePlaylist(playlistName, arrayTrackURIs) {
    if(!playlistName || !arrayTrackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer: ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())

    .then(jsonResponse => {
      console.log('This is the json from the first fetch');
      console.log(jsonResponse);
      userId = jsonResponse.id;
      console.log(userId);
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ name: playlistName })
            })
          })

    .then(response => response.json())

    .then(jsonResponse => {
      const playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: arrayTrackURIs })
            });
      }); //end of last then()
    }// end of savePlaylist
}// end of Spotify module


export default Spotify;
