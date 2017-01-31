import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

// import { createContainer } from 'meteor/react-meteor-data';

import React, { Component } from 'react';
import { Link } from 'react-router';

import Submissions from '/imports/Submission.js';

export default class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div>
				<Helmet title="Admin" />
				Admin Page (shows all submissions)
			</div>
		);
	}
}
