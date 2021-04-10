import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';
import { PlaylistList } from '../PlaylistList/PlaylistList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      removedTracks: [],
      userPlaylists: [],
      playlistId: null
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      })
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id),
      removedTracks: [...this.state.removedTracks, {uri: track.uri}]
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackURIs = Array.from(this.state.playlistTracks, track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistId, this.state.removedTracks).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        playlistId: null
      })
    }).then(() => {
      this.getUserPlaylists();
    })
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(spotifyResults => {
      this.setState({ searchResults: spotifyResults })
    })
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then(userPlaylists => {
      this.setState({ userPlaylists: userPlaylists })
    })
  }

  selectPlaylist(playlistId) {
    const playlist = this.state.userPlaylists.find( ({id}) => id === playlistId)
    Spotify.getPlaylistById(playlistId).then(tracks => {
      this.setState({ 
        playlistTracks: tracks,
        playlistName: playlist.name,
        playlistId: playlistId
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
            <PlaylistList
              playlists={this.state.userPlaylists}
              getUserPlaylists={this.getUserPlaylists}
              selectPlaylist={this.selectPlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;