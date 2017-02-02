import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Login extends Component {
	constructor(props, context) {
		super(props, context);
		this.login = this._login.bind(this);
		this.state = {};
	}

	_login() {
		if (!this.state.username) {
			this.setState({usernameError: 'Username required'});
		} else if (!this.state.password) {
			this.setState({passwordError: 'Password required'});
		} else {
			Meteor.loginWithPassword(this.state.username, this.state.password, (err) => {
				console.error("Error: ", err);
				if (err) this.setState({error: err.reason});
			});
		}
	}

	onChange(f, e, v) {
		let state = {
			error: undefined,
			usernameError: undefined,
			passwordError: undefined,
		};
		state[f] = v;
		this.setState(state);
	}

	render() {
		return (
			<div>
				<TextField
					floatingLabelText='username'
					errorText={this.state.usernameError}
					onChange={this.onChange.bind(this, 'username')}
				/>
				<TextField
					floatingLabelText='password'
					type='password'
					errorText={this.state.passwordError}
					onChange={this.onChange.bind(this, 'password')}
				/>
				<div style={{color: 'red'}}>{this.state.error}</div>
				<RaisedButton primary={true} label='login' onTouchTap={this.login}/>
			</div>
		);
	}
}
