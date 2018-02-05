import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import {db} from '../firebase';
import Header from './header';
import SideBar from './sidebar';
import ViewNote from './viewNote.js';
import NoteList from './NoteList';
import SharedList from './sharedList';
import Footer from './footer';

class Notes extends Component {
	constructor() {
		super();
		this.state = {
			newNote : false,
			noteID : null,
			showModal:false
		}
		this.addNewNote = this.addNewNote.bind(this);
		this.getUID = this.getUID.bind(this);
		this.closeNote = this.closeNote.bind(this);
	}

	addNewNote() {
		if(!this.state.newNote){
			const notes = db.collection('notes').doc();
			this.setState({newNote : true, noteID : notes.id,showModal:true});
			  notes.set({
			  	id : notes.id,
			  	noteTitle : "Untitled",
			  	notes : "Enter Text",
			  	uid : this.getUID()
			  })
		}
	}

	closeNote(){
		this.setState({newNote : false,showModal : false});
	}

	getUID(){
		const cookie = new Cookies();
		let uid = cookie.get('uid');
		return uid;
	}

	render() {
		return (
				<div className="wholePage">
					<SideBar cookieGet = {this.props.cookieGet} 
							 getUID = {this.getUID}/>
					<div className="mainContent">
						<Header addNewNote={this.addNewNote}/>
						<div>
						{this.state && this.state.newNote &&
							<ViewNote noteID = {this.state.noteID}
									 closeNote = {this.closeNote}
							  		 showModal = {this.state.showModal}
							  		 shared = {false}
							  		 edit = {true}/>
						}
						<h4 className="myPens">My Pens :</h4>
						<NoteList getUID = {this.getUID}
								  closeNote = {this.closeNote}
								  style = {{overflow : 'scroll'}}
								/>
						<h4 style={{clear:'both'}}
							className="myPens">Shared Pens :</h4>
						<SharedList />
						</div>
					</div>
					<Footer />
				</div>
			)
	}
}

export default Notes;