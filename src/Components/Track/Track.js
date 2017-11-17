import React from 'react';
import './Track.css'


class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(event) {
    this.props.onAdd(this.props.track)
  }

  removeTrack(event){
    this.props.onRemove(this.props.track)
  }

  renderAction() {
       if (!this.props.onRemove) {
           return <a className = 'Track-action' onClick = { this.removeTrack } > - < /a>
       } else {
           return <a className = 'Track-action' onClick = { this.addTrack } > + < /a>;
       }
   }

   render() {
    return (
      <div className='Track'>
        <div className='Track-information'>
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
          { this.props.onAdd ?
            <a className='Track-action' onClick={this.addTrack}>+</a>
            :
            <a className='Track-action' onClick={this.removeTrack}>-</a>
          }
      </div>
    );
  }
}

export default Track;
