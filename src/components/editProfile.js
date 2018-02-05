import React, { Component } from 'react';
import firebase from 'firebase';
import {db} from '../firebase';
import '../styles/App.css';

class EditProfile extends Component {
	constructor(){
		super();
		this.state = {
			gender : null
		}
		this.saveToDatabase = this.saveToDatabase.bind(this);
		this.deactivateAccount = this.deactivateAccount.bind(this);
	}

	async componentDidMount(){
			await db.collection('users')
			  .where('uid','==',this.props.getUID())
			  .onSnapshot(async q =>  {
			  	if(q.docs.length > 0)
				{
			  		await this.setState({gender : q.docs[0].data().gender})
			  	}
			});
	}

	saveToDatabase(){
		db.collection('users')
			.where('uid','==',this.props.getUID())
			.onSnapshot(q => {
				if (q.docs.length > 0){
					db.collection('users')
					.doc(q.docs[0].id)
					.update({name : this.name.value,
						gender : this.gender.value})
				}
			});
	}

	deactivateAccount() {
		var user = firebase.auth().currentUser;
		//Delete user entry from authentication
		user.delete();

		//delete all notes created by the user
		db
			.collection('notes')
			.where('uid','==',this.props.getUID())
			.onSnapshot(col => {
				if(col.docs.length > 0)
				{
					db.collection('notes')
						.doc(col.docs[0].id)
						.delete();
				}
			});

		//delete user details in users document
		db.collection('users')
			.where('uid','==',this.props.getUID())
			.onSnapshot(q => {
				if(q.docs.length > 0)
				{
					db.collection('users')
						.doc(q.docs[0].id)
						.delete();
				}
			});
		//logout user
		this.props.logOut();
	}

	render(){
		return (
			<div>
			{ this.state && this.state.gender && 
			<div className="text-center paddingForEdit">
				<label className="paddingForEdit badPadding">
					Name 
				</label>
				<input  type="text" 
						ref = {(input) => this.name=input}
						defaultValue = {this.props.name}/>
				<label className="paddingForEdit" 
					   style={{display:"block"}}> 
					Gender 
				</label>
				<select className="paddingForEdit" 
						style={{display:"block",marginLeft:"10%"}}
						ref = {(input) => this.gender = input}
						defaultValue = {this.state.gender}>
					<option>Male</option>
					<option>Female</option>
					<option>Neutral</option>
					<option>None</option>
				</select>
				<button className="btn btn-success btnFull paddingForEdit"
						onClick={this.saveToDatabase}> Save</button>
				<button className="btn btn-danger btnFull paddingForEdit"
						onClick={this.deactivateAccount}> Deactivate Account</button>

			</div>
			}
			</div>
		);
	}
}

export default EditProfile;