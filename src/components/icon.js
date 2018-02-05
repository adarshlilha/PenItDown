import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import EditProfile from './editProfile';
import {storage} from '../firebase';
import ProfilePicture from './profilePicture';

class Icon extends Component {
	constructor() {
		super();
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.logOut = this.logOut.bind(this);
		this.editProfile = this.editProfile.bind(this);
		this.state = {
			editProfile : false,
			photoURL:null,
			profile:null,
			showModal:null
		};
		this.openProfilePicture = this.openProfilePicture.bind(this);
		this.closeNote=this.closeNote.bind(this);
		this.uploadsTheFile=this.uploadsTheFile.bind(this);
	}

	openProfilePicture() {
		this.setState({profile : true,
						showModal:true});
	}

	toggleDropDown(e) {
		e.preventDefault();
		var dropDown = document.querySelector(".dropDownIcon");
		dropDown.classList.toggle("hidden");
	}

	logOut(){
		const cookie = new Cookies();
    	cookie.remove('uid','email');
    	this.props.cookieGet();
	}

	editProfile() {
		this.setState({editProfile : !this.state.editProfile});
	}

	async uploadsTheFile(file) {
		await storage.ref('/profile').child(this.props.getUID()).put(file,{contentType:file.type});
		this.showProfilePicture();
	}

	closeNote(){
		this.setState({showModal: false,
						profile:false});
	}

	showProfilePicture() {
		storage.ref('/profile')
			   .child(this.props.getUID())
			   .getDownloadURL()
			   .then(photoURL =>
			   		this.setState({photoURL})
			   	)
	}

	componentDidMount() {
		this.showProfilePicture();
	}

	render() {
		return (
			<div className="text-center sideBarIcon">
				<img src={this.state.photoURL ? this.state.photoURL : "http://via.placeholder.com/300" }
					 className="userImg" 
					 alt="User Avatar"
					 onClick={this.openProfilePicture}/>
				{this.state && this.state.profile &&
					<ProfilePicture showModal={this.state.showModal}
									closeNote={this.closeNote}
									uploadsTheFile={this.uploadsTheFile}
									/>
				}
				<button className="fa fa-angle-down dropdownBtn"
						onClick={this.toggleDropDown}> </button>
				<ul className="dropDownIcon hidden">
					<li className="listItem"
					    onClick={this.editProfile}> Edit Profile </li>
					    {this.state && this.state.editProfile && 
					    	<EditProfile name={this.props.name}
					    	getUID = {this.props.getUID}
					    	logOut = {this.logOut} 
					    	editProfile = {this.editProfile} />
					    }
					<li className="listItem lastItem" onClick={this.logOut} >Log Out </li>
				</ul>
			</div>
		);
	}
}

export default Icon;