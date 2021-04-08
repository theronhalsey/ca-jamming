const spotifyClientId = process.env.REACT_APP_SPOT_ID;
const redirectURI = 'http://localhost:3000/';

let accessToken;

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpirationTime = window.location.href.match(/expires_in=([^&]*)/);
        if (urlAccessToken && urlExpirationTime) {
            accessToken = urlAccessToken[1];
            const expiresIn = Number(urlExpirationTime[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        };
    },
    search(term) {
        this.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => (
                {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album,
                    uri: track.uri
                }
            ))
        })
    },
    savePlaylist(playlistName, URIs) {
        if (!playlistName || !URIs) {
            return;
        }
        this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userID;
        let playlistID;
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: playlistName
                })
            }).then(response => {
                return response.json()
            }).then(jsonResponse => {
                playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        uris: URIs
                    })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    return playlistID = jsonResponse.snapshot_id;
                })
            })
        })
    }
};