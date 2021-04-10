const spotifyClientId = process.env.REACT_APP_SPOT_ID;
const redirectURI = 'https://jammtron.surge.sh';

let accessToken;
let userID;

export const Spotify = {
    async getAccessToken() {
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
    async getCurrentUserId() {
        if (userID) {
            return userID
        }
        const headers = { Authorization: `Bearer ${accessToken}` }
        const response = await fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        });
        const jsonResponse = await response.json();
        return userID = jsonResponse.id;
    },
    async search(term) {
        await this.getAccessToken()
        const headers = { Authorization: `Bearer ${accessToken}` }
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: headers
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => (
            {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }
        ));
    },
    async savePlaylist(playlistName, URIs, id, removedTracks) {
        if (!playlistName || !URIs) {
            return;
        }
        await this.getAccessToken();
        await this.getCurrentUserId();
        if (id) {
            let playlistID = id;
            const headers = { Authorization: `Bearer ${accessToken}` };
            await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    name: playlistName
                })
            });
            if (removedTracks.length !== 0) {
                await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    method: 'DELETE',
                    headers: headers,
                    body: JSON.stringify({
                        tracks: removedTracks
                    })
                });
            };
            await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    uris: URIs
                })
            });
        } else {
            const headers = { Authorization: `Bearer ${accessToken}` };
            let playlistID;
            const response_1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: playlistName
                })
            });
            const jsonResponse_1 = await response_1.json();
            playlistID = jsonResponse_1.id;
            const response_2 = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    uris: URIs
                })
            });
            const jsonResponse_2 = await response_2.json();
            return playlistID = jsonResponse_2.snapshot_id;
        }
    },
    async getUserPlaylists() {
        await this.getAccessToken();
        await this.getCurrentUserId();
        const headers = { Authorization: `Bearer ${accessToken}` }
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers
        });
        const jsonResponse = await response.json();
        return jsonResponse.items.map(playlist => (
            {
                id: playlist.id,
                name: playlist.name
            }
        ));
    },
    async getPlaylistById(playlistId) {
        await this.getAccessToken();
        await this.getCurrentUserId();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
            headers: headers
        });
        const jsonResponse = await response.json();
        return jsonResponse.items.map(item => (
            {
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri
            }
        ));
    }
};