import React,{Component} from 'react';
import {Modal,Button} from 'react-bootstrap';
import Cookie from 'universal-cookie';
import {db} from '../firebase';

class ViewNote extends Component{
	constructor() {
		super();
		this.state = {
			edit : false,
			note : '',
			title : '',
			body : '',
			share : false,
		    isSharingSuccessful:false,
		    result_length : 0,
		    alreadyShared:false
		}
		this.editNote = this.editNote.bind(this);
		this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
		this.deleteNote = this.deleteNote.bind(this);
		this.changeShareState = this.changeShareState.bind(this);
		this.shareIt = this.shareIt.bind(this);
	}

	editNote() {
		this.setState({edit:true});
	}

	// componentDidMount(){
	// 	firebase.auth().onAuthStateChanged((user) => {
  	// 		if (user) {
  	//   			console.log(user);
	//   		}
	// 	});
	// }

	handleTextAreaChange(e) {
		e.preventDefault();
		const noteDoc = db.collection('notes').doc(this.props.noteID);
		if (e.target.name === "noteTitle"){
			noteDoc
				.update({noteTitle : this.noteTitle.value});
		}
		else if(e.target.name === "notes"){
			noteDoc
				.update({notes : this.notes.value});
		}
	}

	deleteNote(e){
		e.preventDefault();
		db
			.collection('notes')
			.doc(this.props.noteID)
			.delete();
		this.props.closeNote();

		db
			.collection('shares')
			.where('noteID','==',this.props.noteID)
			.onSnapshot(col => {
				if(col.docs.length > 0)
				{
					db.collection('shares')
						.doc(col.docs[0].id)
						.delete();
				}
			});
	}

	changeShareState(){
		this.setState({
			share : true,
			isSharingSuccessful : false,
			alreadyShared:false
		});
	}

	shareIt(){
		if (this.shareWith.value === "" || this.shareWith.value === new Cookie().get('email')){
			alert("Enter a valid email to share to!");
			return;
		}
		
		db.collection('shares')
		  .where('sharedTo','==',this.shareWith.value)
		  .where('noteID','==',this.props.noteID)
		  .get()
		  .then((query) => {
		  	
		  		this.setState({
		  			result_length : query.docs.length
		  		},() => {
		  			if (this.state.result_length === 0){
						db.collection('shares')
							.doc()
							.set({
								noteID : this.props.noteID,
								sharedBy : new Cookie().get('email'),
								sharedTo : this.shareWith.value,
								write : this.write.checked
							});
						this.setState({isSharingSuccessful : true});
					}
					else {
						this.setState({alreadyShared : true});
					}
		  		});
		  		return;
		  	
		  });
	}

	render() {
		return (
			<div>
				<Modal show={this.props.showModal} onHide={this.props.closeNote}
	                      className="modalTest">
	                <Modal.Header closeButton>
	                  <Modal.Title>Note</Modal.Title>
	                </Modal.Header>
	                <Modal.Body>
	                	{this.state && !this.state.edit &&
	                	<div>
			                <h4>{this.props.title || "Untitled"} </h4>
			                <p>{this.props.noteBody || "Enter Text"}</p>
			            </div>
		            	}
		            	{this.state && this.state.edit &&
		            	<div>
		            		<input type="text" 
								   placeholder="Note's Title"
								   name = "noteTitle"
								   className = "noteTitleSection"
								   ref={(input) => this.noteTitle = input}
								   onChange = {this.handleTextAreaChange}
								   defaultValue = {this.props.title || "Untitled"}/>

							<textarea cols="60"
							 		  rows="10"
							 		  name = "notes"
							 		  placeholder="Give some text" 
							 		  className = "textAreaSection"
							 		  onChange={this.handleTextAreaChange}
							 		  ref={(input) => this.notes=input}
							 		  defaultValue = {this.props.noteBody || "Enter Text"}> 
							</textarea>
		            	</div>
		            	}
		            	{this.state && this.state.share && 
		            		(!this.state.isSharingSuccessful || this.state.alreadyShared) &&
							<div>
								<input type = "email" 
									   placeholder = "Email of Receiver"
									   ref={(shareWith) => this.shareWith = shareWith}
									   onClick={this.changeShareState}/>
								<input type="checkbox" 
									   name="write" 
									   value="Write" 
									   ref={(el) =>this.write = el}/> Can the person edit this pen?
								<button onClick={this.shareIt}
									    className="shareBtn">Go Share!</button>
							</div>
						}
						{this.state && this.state.isSharingSuccessful &&
							<p> Note shared! </p>
						}
						{this.state && this.state.alreadyShared &&
							<p> Note already shared! </p>
						}

						
	                </Modal.Body>
	                <Modal.Footer>
	                  {this.props.edit &&
	                  <Button onClick={this.editNote}>Edit </Button>
	              	  }
	                  <Button onClick={this.props.closeNote}>Close</Button>
	                  {!this.props.shared &&
	                  	<Button onClick={this.deleteNote} className="fa fa-trash"></Button>
	                  }
	                  {!this.props.shared &&
	                  	<Button onClick={this.changeShareState} className="fa fa-share-alt"></Button>
	                  }	
	              	  
	                </Modal.Footer>
	            </Modal>
            </div>
		);
	}

}

export default ViewNote;