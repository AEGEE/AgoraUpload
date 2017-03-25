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

class UploadPage extends Component {
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
			}, (error, result) => {
				if (error) {
					this.setState({error: error.reason});
				} else {
					this.setState({directLink: result});
				}
			});
		});
	}

	componentWillMount() {
		Meteor.call('getData', (err, data) => {
			if (err) {
				console.error(err);
				this.setState({
					error: 'Something went wrong while fetching the locals. Please notify the IT responsible if this problem persists.',
					ready: true,
				});
				return;
			}
			console.log('Body: ', data);
			this.setState({
				locals: data.locals,
				timeslots: data.timeslots,
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

		let uploadPanel;
		if (this.state.directLink) {
			let url = location.protocol + '//' + location.host + '/submission/' + this.state.directLink;
			uploadPanel = (
				<div>
					Success! You can access your submission at <a target='#' href={url} style={{wordBreak: 'break-word'}}>{url}</a>.<br />
					<b>Save this address!</b> This is the only way to upload a new version later, or to see what
					you have uploaded!
					<RaisedButton
						label="Upload another"
						style={{marginTop: '20px'}}
						onTouchTap={() => {
							this.setState({directLink: undefined});
						}}
					/>
				</div>
			);
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

			let timeslots = [];
			if (this.state.timeslots) {
				for (let date in this.state.timeslots) {
					for (let slot of this.state.timeslots[date]) {
						let slotString = date + ' ' + slot;
						timeslots.push(
							<MenuItem value={slotString} primaryText={slotString} key={slotString} />
						);
					}
				}
			}

			uploadPanel = (
				<div>
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
					<SelectField
						onChange={(event, index, value) => {
							this.setState({timeslot: value});
						}}
						value={this.state.timeslot}
						floatingLabelText="Time Slot"
					>
						{timeslots}
					</SelectField>
					<TextField
						onChange={(e, v) => { this.setState({email: v}); }}
						floatingLabelText="Your email"
					/>
					<div style={{margin: '20px 0'}}>
						The IT-Responsible or chair team can use this email to get in contact with you if there are any questions about your submission.
					</div>
					<div style={{margin: '20px 0'}}>
						You will get a link where you can access this file after uploading. You can also upload new versions here.
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
			);
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
						{uploadPanel}
					</div>
				</Paper>
				<Paper style={{padding: '20px', margin: '30px'}}>
					<h2>Login as admin</h2>
					{this.props.user ? (
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

export default createContainer((props) => {
	return {
		user: Meteor.user(),
	}
}, UploadPage);
