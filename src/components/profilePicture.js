import React, { Component } from 'react';
import '../styles/App.css';
import {Modal} from 'react-bootstrap';

class ProfilePicture extends Component {

	render() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.closeNote}
	                      className="modalTest">
	                <Modal.Header closeButton>
	                  <Modal.Title>Profile Picture:</Modal.Title>
	                </Modal.Header>
	                <Modal.Body>
	                	<input type="file" 
	                		   onChange={(event)=> this.props.uploadsTheFile(event.target.files[0])}/>
				    </Modal.Body>
	        </Modal>
		)
	}
}

export default ProfilePicture;