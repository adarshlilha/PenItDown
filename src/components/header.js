import React, { Component } from 'react';
import '../styles/App.css';

class Header extends Component {
	render() {
		return (
			<div className="col-lg-10 col-md-10 col-sm-9 headerDiv">
				<h2 className="text-center headerStyle"> Pen It Down </h2>
				<button className="fa fa-plus-square-o navBtn addDocBtn"
				onClick={this.props.addNewNote}></button>
			</div>
		);
	}
}

export default Header;