import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
    getTracks() {
        this.props.tracks.map((track) => {
            return <Track track={track} id={track.id} />
        })
    }
    
    render() {
        return (
            <div className="TrackList">
                {this.getTracks}
            </div>
        )
    }
};