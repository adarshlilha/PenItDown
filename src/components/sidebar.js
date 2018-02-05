import React, { Component } from 'react';
import {db} from '../firebase';
import Icon from './icon';
import FolderNavigation from './folderNavigation';

class SideBar extends Component {
	constructor(){
		super();
		this.state = {
			fullName : null,
			showSideNav: false
		}
	}

	async getUID(){
		await db.collection('users')
			.where('uid','==',this.props.getUID())
			.onSnapshot((query) => {
				if (query.docs.length > 0)
					this.setState({fullName : query.docs[0].data().name})
			});
	}

	componentDidMount() {
		this.getUID();
	}

	displayMenu = () => {
		this.hamburger.classList.toggle('is-active');
		document.querySelector('.sideBarSizeDef').style.width = "230px";
		this.setState({showSideNav: true});
	}

	closeMenu = () => {
		this.hamburger.classList.toggle('is-active');
		document.querySelector('.sideBarSizeDef').style.width = "0px";
		this.setState({showSideNav: false});
	}

	render() {
		return (
			<div>
				<div className="hamburger hamburger--spin" onClick={(this.state.showSideNav) ? this.closeMenu : this.displayMenu}
				ref={(hamburger) => this.hamburger = hamburger}>
					<div className="hamburger-box">
						<div className="hamburger-inner">
						</div>
					</div>
				</div>
				<div className="sideBarSizeDef">
					<Icon cookieGet={this.props.cookieGet}
						name = {this.state.fullName}
						getUID = {this.props.getUID}/>
					<p className="nameOfUser"> Hi, {this.state.fullName}!</p>
					<FolderNavigation getUID = {this.props.getUID}/>
				</div>
			</div>
		);
	}

}

export default SideBar;