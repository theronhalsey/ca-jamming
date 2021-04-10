import React from 'react';
import './PlaylistList.css';
import { PlaylistListItem } from '../PlaylistListItem/PlaylistListItem';

export class PlaylistList extends React.Component {
    componentDidMount() {
        this.props.getUserPlaylists()
    }
    render() {
        return (
            <div>
                <div className="PlaylistList">
                    <h3 className="PlaylistList-heading">Saved Playlists</h3>
                    {this.props.playlists.map(playlist => {
                        return <PlaylistListItem key={playlist.id} id={playlist.id} name={playlist.name} select={this.props.selectPlaylist} />
                    })}
                </div>
            </div>
        )
    }
}