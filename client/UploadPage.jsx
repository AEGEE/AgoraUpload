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
import UploadProgress from '/client/UploadProgress.jsx';
import Login from '/client/Login.jsx';
import { Submission, SubmissionFiles } from '/lib/Submission.js';

class UploadPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			ready: false,
			timeslot: "DEFAULT",
		};

		this.handleSubmit = this._handleSubmit.bind(this);
	}

	_handleSubmit() {
		this.setState({
			error: '',
		});

		let files = this.refs.file.files;
		if (!files.length) {
			this.setState({error: 'No file uploaded.'});
			return;
		}

		SubmissionFiles.insert(files[0], (err, fileObj) => {
			console.log('Inserted file:', err, fileObj);
			if (err) {
				let error = SubmissionFiles.lastError;
				if (!error) error = err;
				this.setState({error: 'Error while uploading file: ' + error});
				return;
			}

			console.log("Refs:", this.refs, this.refs.title);

			let fileId = fileObj._id;

			let timeslot = this.state.timeslot;
			if (timeslot == "DEFAULT") timeslot = null;

			Meteor.call('submit', {
				file: fileObj._id,
				title: this.state.title,
				body: this.state.body,
				timeslot: timeslot,
				name: this.state.name,
				email: this.state.email,
				notes: this.state.notes,
				public_password: this.state.public_password,
			}, (error, result) => {
				if (error) {
					console.error("Error:", error);
					this.setState({error: error.reason ? error.reason : error.error});
					// Meteor.clearInterval(interval);
				} else {
					this.setState({lastSubmissionId: result});
				}
			});
		});
	}

	componentWillMount() {
		Meteor.call('getData', (err, data) => {
			if (err) {
				console.error(err);
				this.setState({
					error: 'Something went wrong while fetching the bodies. Please notify the IT responsible if this problem persists.',
					ready: true,
				});
				return;
			}
			console.log('Data received:', data);
			this.setState({
				bodies: data.bodies,
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
		if (this.state.lastSubmissionId) {
			uploadPanel = (
				<UploadProgress
					submission={this.state.lastSubmissionId}
					onReset={() => {this.setState({lastSubmissionId: null})}}
				>
				</UploadProgress>
			);
		} else {
			let bodies = [];
			if (this.state.bodies) {
				for (let code in this.state.bodies) {
					let name = this.state.bodies[code];
					bodies.push(
						<MenuItem value={code} primaryText={name} key={code}/>
					);
				}
			}

			let timeslots = [(
				<MenuItem value="DEFAULT" primaryText="I'm not sure" key="DEFAULT" />
			)];
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
						floatingLabelText="body"
						style={{width: '100%'}}
						value={this.state.body}
						onChange={(event, index, value) => {
							this.setState({body: value});
						}}
					>
						{bodies}
					</SelectField>
					<TextField
						style={{width: '100%'}}
						onChange={(e, v) => { this.setState({title: v.trim()}); }}
						floatingLabelText="Document Title"
					/>
					<SelectField
						onChange={(event, index, value) => {
							this.setState({timeslot: value});
						}}
						style={{width: '100%'}}
						value={this.state.timeslot}
						floatingLabelText="Time Slot"
					>
						{timeslots}
					</SelectField>
					<TextField
						style={{width: '100%'}}
						defaultValue={this.state.name}
						onChange={(e, v) => { this.setState({name: v.trim()}); }}
						floatingLabelText="Your name"
					/>
					<TextField
						style={{width: '100%'}}
						defaultValue={this.state.email}
						onChange={(e, v) => { this.setState({email: v.trim()}); }}
						floatingLabelText="Your email"
					/>
					<div
						style={{margin: '20px 0', width: '100%'}}>
						The IT-Responsible or chair team can use this email to get in contact with you if there are any questions about your submission.
					</div>
					<div style={{margin: '20px 0', width: '100%'}}>
						You will get a link where you can access this file after uploading. You can also upload new versions here.
					</div>

					<TextField
						style={{width: '100%'}}
						onChange={(e, v) => { this.setState({notes: v.trim()}); }}
						floatingLabelText="Notes to IT"
					/>
					<TextField
						style={{width: '100%'}}
						onChange={(e, v) => { this.setState({public_password: v.trim()}); }}
						floatingLabelText="Upload Password"
					/>
					<div style={{margin: '20px 0', width: '100%'}}>
						<RaisedButton label="Add file" onTouchTap={() => {
							this.refs.file.click();
						}}/>
						<input ref='file' type='file' id='file-input' style={{display: 'none'}} />
						<br />
						{this.state.filename ? (<div>selected: <i>{this.state.filename}</i></div>) : null}
					</div>

					<div style={{color: 'red', fontWeight: 'bold'}}>
						{this.state.error}
					</div>

					<RaisedButton primary={true} label="submit" onTouchTap={this.handleSubmit} />
				</div>
			);
		}

		return (
			<div>
				<Helmet title="Agora Enschede Upload" />
				<Paper style={{padding: '20px', margin: '30px'}}>
					<div>
						<h1>Agora Enschede Upload</h1>
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
