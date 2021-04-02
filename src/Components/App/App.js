import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: 'Search Results',
      playlistName: 'Playlist Name',
      playlistTracks: [
        {
          name: 'Song 1',
          artist: 'Artist 1',
          album: 'Album 1',
          id: 1
        },
        {
          name: 'Song 2',
          artist: 'Artist 2',
          album: 'Album 2',
          id: 2
        },
        {
          name: 'Song 3',
          artist: 'Artist 3',
          album: 'Album 3',
          id: 3
        }
      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
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
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default App;
