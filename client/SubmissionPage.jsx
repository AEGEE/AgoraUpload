import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { Submission, SubmissionFiles } from '/lib/Submission.js';
import FilePreview from '/client/FilePreview.jsx';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import React, { Component } from 'react';
import { Link } from 'react-router';

// TODO: Show state of current submission
// TODO: Show preview

class AdminPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	onSubmit() {
		console.log('Re-Submitting', this.state);
		SubmissionFiles.insert(this.state.newFile, (err, fileObj) => {
			console.log('Uploaded:', fileObj);
			if (err) {
				console.error(err);
			} else {
				this.props.submission.reupload(fileObj._id);
				this.setState({
					newFile: undefined,
				});
			}
		});
	}

	render() {
		if (!this.props.ready) return (<div>Loading</div>);

		return (
			<div>
				<Helmet title={this.props.submission.title} />
				<Paper style={{padding: '20px'}}>
					<h1>{this.props.submission.title}</h1>
					<h3>local: {this.props.submission.local}</h3>
					<h3>version: {this.props.submission.version}</h3>
					<FilePreview code={this.props.submission.file} />
					<div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', maxWidth: '330px'}}>
						<RaisedButton primary={true}
							label="Submit new version"
							disabled={!this.state.newFile}
							onTouchTap={this.onSubmit.bind(this)}
						/>
						<RaisedButton secondary={true} label="select file" onTouchTap={() => {
							this.refs.file.click();
						}}/>
						<input
							ref='file'
							type='file'
							id='file-input'
							style={{display: 'none'}}
							onChange={(e) => {
								let file = e.currentTarget.files[0];
								this.setState({
									newFile: file
								});
							}}
						/>
					</div>
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
