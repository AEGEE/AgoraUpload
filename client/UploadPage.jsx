import { Meteor } from 'meteor/meteor';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import React, { Component } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { Submission, SubmissionFiles } from '/imports/Submission.js';

export default class UploadPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			ready: false,
		};

		this.handleSubmit = this._handleSubmit.bind(this);
	}

	_handleSubmit() {
	}

	componentWillMount() {
		Meteor.call('getLocals', (err, data) => {
			if (err) {
				console.error(err);
				this.setState({
					error: 'Something went wrong while fetching the locals. Please notify the IT responsible if this problem persists.',
					ready: true,
				});
				return;
			}
			this.setState({
				locals: data,
				ready: true,
			});
		});
	}

	componentDidMount() {
		console.log('Mounted');
	}

	componentDidUpdate() {
		console.log('Updated');
		// TODO: Is this called on first mount as well?
		if (this.refs.file) {
			this.refs.file.onchange = (e) => {
				let file = e.currentTarget.files[0];
				console.log("Selected file: ", file);
				this.setState({
					filename: file.name
				});
			}
		}
	}

	render() {
		if (!this.state.ready) return (<div>Loading</div>);

		let page;
		if (this.state.error) {
			page = (<div>{this.state.error}</div>);
		} else {
			let locals = [];
			if (this.state.locals) {
				for (let code in this.state.locals) {
					let name = this.state.locals[code];
					locals.push(
						<MenuItem value={code} primaryText={name} key={code}/>
					);
				}
			}
			page = (
				<div>
					<h1>Upload</h1>
					<SelectField
						ref="local"
						floatingLabelText="Local"
						value={this.state.selectedLocal}
						onChange={(event, index, value) => {
							this.setState({selectedLocal: value});
						}}
					>
						{locals}
					</SelectField>
					<TextField ref="title" floatingLabelText="Document Title" />
					<TextField ref="timeslot" floatingLabelText="Time Slot" disabled={true} />
					<TextField ref="email" floatingLabelText="Your email" />

					<div>
						<label htmlFor='file-input'>
							<RaisedButton label="upload"/>
						</label>
						<input ref='file' type='file' id='file-input' />
						<br />
						{this.state.filename ? (<div>{this.state.filename}</div>) : null}
					</div>

					<div>A confirmation, along with a link where you can submit new versions, will be sent to you.</div>
					<RaisedButton primary={true} label="submit" onTouchTap={this.handleSubmit} />
				</div>
			);
		}

		return (
			<div>
				<Helmet title="Upload" />
				<Paper style={{padding: '20px', margin: '30px'}}>
					{page}
				</Paper>
				<Paper style={{padding: '20px', margin: '30px'}}>
					<h2>Login as admin</h2>
					<RaisedButton primary={true} label="Nah, that doesn't work yet, just go to the admin page" />
				</Paper>
			</div>
		);
	}
}

// export default createContainer((props) => {
// }, UploadPage);
