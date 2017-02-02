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

import PageLoading from '/client/loader.jsx';
import Login from '/client/Login.jsx';
import { Submission, SubmissionFiles } from '/lib/Submission.js';

export default class UploadPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			ready: false,
		};

		this.handleSubmit = this._handleSubmit.bind(this);
	}

	_handleSubmit() {
		let files = this.refs.file.files;
		if (!files.length) {
			this.setState({error: 'No file uploaded.'});
			return;
		}

		SubmissionFiles.insert(files[0], (err, fileObj) => {
			console.log('Inserted file:', err, fileObj);
			if (err) {
				this.setState({error: 'Error while uploading file: ' + err});
				return;
			}

			console.log("Refs:", this.refs, this.refs.title);

			Meteor.call('submit', {
				file: fileObj._id,
				title: this.state.title,
				local: this.state.local,
				timeslot: this.state.timeslot,
				email: this.state.email,
			});
		});
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
			console.log('Locals: ', data);
			this.setState({
				locals: data,
				ready: true,
			});
		});
	}

	componentDidUpdate() {
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
		if (!this.state.ready) return (<PageLoading />);

		let locals = [];
		if (this.state.locals) {
			for (let code in this.state.locals) {
				let name = this.state.locals[code];
				locals.push(
					<MenuItem value={code} primaryText={name} key={code}/>
				);
			}
		}

		return (
			<div>
				<Helmet title="Upload" />
				<Paper style={{padding: '20px', margin: '30px'}}>
					<div>
						<h1>Upload</h1>
						<div style={{color: 'red', fontWeight: 'bold'}}>
							{this.state.error}
						</div>
						<SelectField
							floatingLabelText="Local"
							value={this.state.local}
							onChange={(event, index, value) => {
								this.setState({local: value});
							}}
						>
							{locals}
						</SelectField>
						<TextField
							onChange={(e, v) => { this.setState({title: v}); }}
							floatingLabelText="Document Title"
						/>
						<TextField
							onChange={(e, v) => { this.setState({timeslot: v}); }}
							floatingLabelText="Time Slot"
							disabled={true}
						/>
						<TextField
							onChange={(e, v) => { this.setState({email: v}); }}
							floatingLabelText="Your email"
						/>
						<div>
							A confirmation, along with a link where you can submit new versions, will be sent to you on this address.
						</div>

						<div style={{margin: '20px 0'}}>
							<RaisedButton label="select file" onTouchTap={() => {
								this.refs.file.click();
							}}/>
							<input ref='file' type='file' id='file-input' style={{display: 'none'}} />
							<br />
							{this.state.filename ? (<div>selected: <i>{this.state.filename}</i></div>) : null}
						</div>
						<RaisedButton primary={true} label="submit" onTouchTap={this.handleSubmit} />
					</div>
				</Paper>
				<Paper style={{padding: '20px', margin: '30px'}}>
					<h2>Login as admin</h2>
					{Meteor.userId() ? (
						<Link to="/admin">
							<RaisedButton primary={true} label="Go to submissions" />
						</Link>
					) : (
						<Login />
					)}
				</Paper>
			</div>
		);
	}
}

// export default createContainer((props) => {
// }, UploadPage);
