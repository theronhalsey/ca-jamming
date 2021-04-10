import React from 'react';
import './PlaylistListItem.css';

export class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);
        this.selectPlaylist = this.selectPlaylist.bind(this);
    }

    selectPlaylist() {
        this.props.select(this.props.id)
    }

    render() {
        return (
            <div className="PlaylistListItem">
                <h3 className="PlaylistName" onClick={this.selectPlaylist} id={this.props.id}>{this.props.name}</h3>
            </div>
        )
    }
}