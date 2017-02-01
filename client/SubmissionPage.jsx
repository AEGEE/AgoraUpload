import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { Submission } from '/lib/Submission.js';
import FilePreview from '/client/FilePreview.jsx';

import Paper from 'material-ui/Paper';

import React, { Component } from 'react';
import { Link } from 'react-router';

// TODO: Show state of current submission
// TODO: Show preview

class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		if (!this.props.ready) return (<div>Loading</div>);

		return (
			<div>
				<Helmet title={this.props.submission.title} />
				<Paper style={{padding: '20px'}}>
					<h1>{this.props.submission.title}</h1>
					<FilePreview code={this.props.submission.file} />
				</Paper>
			</div>
		);
	}
}

export default createContainer((props) => {
	let code = props.routeParams.code;
	let submissionHandle = Meteor.subscribe('submission', code);
	let submission = Submission.findOne(code);
	return {
		ready: submissionHandle.ready && submission,
		submission: submission,
	};
}, AdminPage);
