import React, { Component } from 'react';
import firebase from 'firebase';
import {db} from '../firebase';
import '../styles/App.css';

class SignUp extends Component{
  constructor(){
    super();
    this.userSignup = this.userSignup.bind(this);
  }

  async userSignup(e){
    e.preventDefault();
    if (this.name.value && this.email.value && this.password.value && this.repeatPassword.value){
      if (this.password.value === this.repeatPassword.value){
        await firebase.auth()
                      .createUserWithEmailAndPassword(this.email.value,this.password.value)
                      .catch((error) => {
                        if(error.code === "auth/email-already-in-use"){
                          alert("You are already signed up!");
                        }
                        else if(error.code === "auth/weak-password"){
                          alert("Error,password isn't long enough!");
                        }
                        else{
                          alert(error.code);
                        }
                        throw error;
        });

        firebase.auth().onAuthStateChanged(firebaseUser => {
          if(firebaseUser) {
            const newUser = db.collection('users').doc();
            newUser.set({
             name : this.name.value,
             uid : firebaseUser.uid,
             gender : 'None'
            });
            this.props.cookieSet(firebaseUser.uid,firebaseUser.email);
          }
        });
      } 
      else {
        alert("Password Mismatch");
      }
    } else {
      alert("Invalid Entries");
    }
  }

  render(){
		return(
			<div> 
        <input type="text" 
               placeholder="Full Name" 
               ref={(input) => this.name = input}/>
        <input type="email" 
               placeholder="Email" 
               ref={(input) => this.email = input}/>
        <input type="password" 
               placeholder="Password" 
               ref={(input) => this.password = input}/>
        <input type="password" 
               placeholder="Confirm Password" 
               ref={(input) => this.repeatPassword = input}/>
        <button className="submitIt" 
                onClick={this.userSignup}>
            Sign Up
        </button>
        <p> Already a member ? &nbsp; 
            <span onClick={this.props.newUser}
            		className="pointIt">
                Log In
            </span>
        </p>
      </div>
		);
	}
}

export default SignUp;