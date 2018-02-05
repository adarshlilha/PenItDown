import React, { Component } from 'react';
import '../styles/App.css';

class Files extends Component {

	render() {
		return (
			//a loop over folders(check CommentList.js)
			
				<li className="fileTitle">{this.props.title}</li>
		
		);
	}

}

export default Files;