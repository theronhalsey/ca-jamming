import React from 'react';
import './Track.css';

export class Track extends React.Component {

    renderAction() {
        return isRemoval ? '+' : '-';
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.artist}</p>
                </div>
                <button className="Track-action">{this.renderAction}</button>
            </div>
        )
    }
};