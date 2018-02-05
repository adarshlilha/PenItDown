import React, { Component } from 'react';
import {db} from '../firebase';
import ViewNote from './viewNote';

class NoteList extends Component{
	constructor(){
		super();
		this.state = {
			documents : [],
			openDoc : false,
			docID : null,
			title : null,
			noteBody : null,
			showModal : null
		};
		this.openDocument = this.openDocument.bind(this);
		this.closeNote = this.closeNote.bind(this);
	}

	componentDidMount() {
		db
			.collection('notes')
			.where('uid','==',this.props.getUID())
			.onSnapshot(col => {		
				this.setState({documents : col.docs});
			});
	}

	async openDocument(e){
		e.preventDefault();
		await this.setState({openDoc : true,
			docID : e.target.id,
			showModal: true
		});
		await this.state.documents.map(doc => {
			if(doc.data().id === this.state.docID){
				 this.setState({
					title : doc.data().noteTitle,
					noteBody : doc.data().notes
				});
			}
			return null;
		});
	}

	closeNote(){
		this.setState({openDoc : false,title: null,noteBody: null,showModal: false});
	}

 	render() {
		return (
			<div className="noteList">
				{this.state && this.state.openDoc && this.state.title && this.state.noteBody &&
					<ViewNote showModal = {this.state.showModal}
							  noteID = {this.state.docID}
							  closeNote = {this.closeNote}
							  title = {this.state.title}
							  noteBody = {this.state.noteBody} 
							  shared = {false}
							  edit = {true}/>
				}
				{this.state && this.state.documents.map((document,index) =>{	
					return (
						<div className='userDocument' 
							 id={document.data().id} 
							 onClick={this.openDocument}
							 key={index}>
							<h5 id={document.data().id} 
							 	onClick={this.openDocument}>
							 {document.data().noteTitle}</h5>
							<p id={document.data().id} 
							   onClick={this.openDocument}>
							 {document.data().notes}</p>
						</div>
					)
				})
			}
			</div>	
		)
	}
}	

export default NoteList;