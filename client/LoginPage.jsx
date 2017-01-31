import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class LoginPage extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div>
				<Helmet title="Login" />
				Login Page
			</div>
		);
	}
}
