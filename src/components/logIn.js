import React, { Component } from 'react';
import firebase from 'firebase';

class LogIn extends Component{
	constructor(){
	    super();
	    this.userLogin = this.userLogin.bind(this);
	  }

 	async userLogin(e){
 		e.preventDefault();
 		if(this.email.value && this.password.value) {
 			await firebase.auth()
 						  .signInWithEmailAndPassword(this.email.value,this.password.value)
 						  .catch(error => {
 						  	alert(error);
 						  	throw error;
 						  });
 			firebase.auth().onAuthStateChanged(firebaseUser => {
 				this.props.cookieSet(firebaseUser.uid,firebaseUser.email);
 			});
 		}
 	}

	render(){
		return (
			<div>
	            <input type="email" 
	                   placeholder="Email" 
	                   ref={input => this.email = input}/>
	            <input type="password" 
	                   placeholder="Password" 
	                   ref={input => this.password = input}/>
	            <button className="submitIt" 
	                    onClick={this.userLogin}>
	              Log In
	            </button>
	            <p> No Account ?&nbsp; 
	                <span onClick={this.props.newUser}
	                	  className="pointIt">
	                    Sign Up
	                </span>
	            </p>
        	</div>
		);
	}
}

export default LogIn;