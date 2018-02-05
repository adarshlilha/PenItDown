import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import SignUp from './components/signUp';
import LogIn from './components/logIn';
import Notes from './components/notes';
import './styles/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loginUser : true,      // To toggle between login and signup page
      cookies : null         // has the uid of logged in user
    };
    this.newUser = this.newUser.bind(this);
    this.cookieSet = this.cookieSet.bind(this);
    this.cookieGet = this.cookieGet.bind(this);
  }
  
  // To toggle between login and signup page
  newUser() {
    this.setState({loginUser : !this.state.loginUser});
  }
  // Setting the cookies - user uid
  cookieSet(uid,email) {
    const cookie = new Cookies();
    cookie.set('uid',uid,{path : '/'});
    cookie.set('email',email,{path : '/'});
    this.setState({cookies : cookie.get('uid')});
  }
  // Getting the already set cookie - for new tab
  cookieGet() {
    const cookie = new Cookies();
    this.setState({cookies : cookie.get('uid')});
  }

  componentDidMount() {
    this.cookieGet();
  }

  render() {
    return (
        <div className="wholePage">
           { this.state && this.state.cookies
           ? <Notes cookieGet={this.cookieGet} />
           : <div className="App text-center">
              <header>
                <h1 className="title">Pen it Down</h1>
              </header>
              <form className="center">
              { this.state.loginUser 
              ? <LogIn
                  newUser = {this.newUser} 
                  cookieSet = {this.cookieSet}/>
              : <SignUp
                  newUser = {this.newUser} 
                  cookieSet = {this.cookieSet}/>
              }
              </form>
            </div>
          }
        </div>
    );
  }
}

export default App;
