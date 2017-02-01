import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';
import { Submission, SubmissionFiles } from '/lib/Submission.js';

import React, { Component } from 'react';
import { Link } from 'react-router';

import Submissions from '/lib/Submission.js';

// TODO: Disallow page when not logged in
class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		if (!this.props.ready) return (<div>Loading...</div>);
		let submissions = [];
		this.props.submissions.forEach((submission) => {
			submissions.push(
				<div key={submission._id}>
					<h3>{submission.title}</h3>
					<div>Version {submission.version}</div>
					<div>File Preview</div>
				</div>
			);
		});
		return (
			<div>
				<Helmet title="Admin" />
				Admin Page (shows all submissions)
				{submissions}
			</div>
		);
	}
}

export default createContainer((props) => {
	let submissionHandle = Meteor.subscribe('submissions');
	let submissionFilesHandle = Meteor.subscribe('files');

	let submissions = Submission.find().fetch();
	let files = SubmissionFiles.find().fetch();

	return {
		submissions: submissions,
		files: files,
		ready: submissionHandle.ready() && submissionFilesHandle.ready(),
	};
}, AdminPage);
