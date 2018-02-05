import React, { Component } from 'react';
import Cookie from 'universal-cookie';
import {db} from '../firebase';
import '../styles/App.css';
import ViewNote from './viewNote';

class SharedList extends Component{
	constructor(){
		super();
		this.state = {
			documents : [],
			sharedNotes : [],
			openDoc : false,
			title : null,
			noteBody: null,				//to open the shared doc
			showModal : false,
			edit: null
		}
		this.openDocument = this.openDocument.bind(this);
		this.closeNote = this.closeNote.bind(this);
	}

  	closeNote(){
		this.setState({openDoc : false,title: null,noteBody: null,showModal:false});
	}

	componentDidMount(){
		db
			.collection('shares')
			.where('sharedTo','==',new Cookie().get('email'))
			.onSnapshot((query) => {
				this.setState({sharedNotes: []})
				query.docChanges.forEach(change => {
					if (change.type === "added"){
						this.setState({documents: [...this.state.documents,change.doc]})
					}
					else if (change.type === "removed") 
	  	  			{
						let docId = change.doc.data().noteID;
						let documents = this.state.documents;
						documents.map((doc,index) => {
							if(doc.noteID === docId){
								documents.splice(index,1)
							}
							return null
						})
						this.setState({
							documents : documents
						})
	  	  			}
				});
				this.state.documents.map(sharedWithMe => {
					db
						.collection('notes')
						.doc(sharedWithMe.data().noteID)
						.get()
						.then((q) => {
							if (q.exists){
								this.setState({
									sharedNotes : [...this.state.sharedNotes,q.data()]
								})
							}
						}
						);
					return null;
				})
			});
	}

	async openDocument(e){
		e.preventDefault();
		await this.setState({
			openDoc:true,
			docID:e.target.id,
			showModal: true
			});

		await this.state.sharedNotes.map(doc => {
			if(doc.id === this.state.docID){
				 this.setState({
					title : doc.noteTitle,
					noteBody : doc.notes
				});
			}
			return null;
		});

		this.state.documents.map(async (doc) => {
			if(this.state.docID === doc.data().noteID)
			{
				await this.setState({edit : doc.data().write});
			}
		})
	}

	render(){
		return(
			<div className="noteList">
				{this.state && this.state.sharedNotes && 
					this.state.sharedNotes.map((document) => {
						return(
						<div className='userDocument' 
						     id={document.id} 
						     key={document.id}
							 onClick={this.openDocument}>
							<h4 onClick={this.openDocument}
								id={document.id}>
								{document.noteTitle}
							</h4>
							{this.state.documents && 
								this.state.documents.map((doc,index) => {
									return(
										<div key={index}>
											{(doc.data().noteID === document.id) &&
												<h6 style={{textDecoration:'underline'}}
													id={document.id}>
													Shared by: {doc.data().sharedBy}
												</h6>
											}
										</div>
									);
								})
							}
							
							<p onClick={this.openDocument}
							   id={document.id}>
								{document.notes}
							</p>
						</div>
					)})
				}

				{this.state && this.state.openDoc && this.state.title 
					&& this.state.noteBody &&
					<ViewNote showModal = {this.state.showModal}
							  noteID = {this.state.docID}
							  closeNote = {this.closeNote}
							  title = {this.state.title}
							  noteBody = {this.state.noteBody} 
							  shared = {true}
							  edit = {this.state.edit}/>
				}
				
			</div>
		);
	}
}

export default SharedList;