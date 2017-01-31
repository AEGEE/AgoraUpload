import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import Submissions from '/imports/Submission.js';

import React, { Component } from 'react';
import { Link } from 'react-router';

class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div>
				<Helmet title="Admin" />
				Login Page
			</div>
		);
	}
}

export default createContainer((props) => {
	return;
}, AdminPage);
