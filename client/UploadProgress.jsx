import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { Submission, SubmissionFiles } from '/lib/Submission.js';

import RaisedButton from 'material-ui/RaisedButton';

import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

class UploadProgress extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		if (!this.props.ready || !this.props.submission) return (<div>Loading</div>);

		if (this.props.submission.uploaded) {
			let url = location.protocol + '//' + location.host + '/submission/' + this.props.submission._id;
			return (
				<div>
					Success! You can access your submission at <a target='#' href={url} style={{wordBreak: 'break-word'}}>{url}</a>.<br />
					<b>Save this address!</b> This is the only way to upload a new version later, or to see what
					you have uploaded!
					<RaisedButton
						label="Upload another"
						style={{marginTop: '20px'}}
						onTouchTap={this.props.onReset}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<b>Uploading...</b><br />
					Do not close the page! This page will automatically update once the file is done uploading.<br/>
					Depending on your internet connection, this may take several minutes.
				</div>
			);
		}
	}
}

export default createContainer((props) => {
	console.log('Container for:', props);

	let submissionHandle = Meteor.subscribe('submission', props.submission);
	let submission = Submission.findOne(props.submission);
	return {
		ready: submissionHandle.ready,
		submission: submission,
	};
}, UploadProgress);
