import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';
import { Submission, SubmissionFiles } from '/lib/Submission.js';

import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import PageLoading from '/client/loader.jsx';
import Submissions from '/lib/Submission.js';

class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	componentWillMount() {
		Tracker.autorun(() => {
			if (Meteor.loggingIn()) return;
			if (!Meteor.userId()) browserHistory.push('/');
		});

		Meteor.call('getData', (err, data) => {
			if (err) {
				console.error(err);
				this.setState({
					error: 'Something went wrong while fetching the locals. Please notify the IT responsible if this problem persists.',
				});
				return;
			}
			console.log('Locals: ', data);
			this.setState({
				locals: data.locals,
			});
		});
	}

	render() {
		if (!this.props.ready && !(this.state.locals || this.state.error)) return (<PageLoading />);
		if (this.state.error) {
			return (
				<Paper style={{padding: '20px'}}>
					<div style={{color: 'red'}}>
						{this.state.error}
					</div>
				</Paper>
			);
		}

		let submissions = [];
		this.props.submissions.forEach((submission) => {
			let icon;
			let file = SubmissionFiles.findOne(submission.file);
			if (file.isImage()) {
				icon = (<Avatar src={file.url()} />);
			}

			let date = submission.updatedAt;
			let dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

			let localString = this.state.locals[submission.local];

			submissions.push(
				<ListItem
					key={submission._id}
					primaryText={submission.title}
					secondaryText={'v'+submission.version + ', ' + localString + ', ' + dateString}
					rightAvatar={icon}
					style={{textDecoration: 'none'}}
					onTouchTap={() => {
						browserHistory.push('/submission/' + submission._id);
					}}
				/>
			);
		});
		return (
			<div>
				<Helmet title="Admin" />
				<Paper style={{padding: '20px'}}>
					<h1>All Submissions</h1>
					<List>
						{submissions}
					</List>
				</Paper>
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
		ready: submissionHandle.ready() && submissionFilesHandle.ready() && !Meteor.loggingIn(),
	};
}, AdminPage);
