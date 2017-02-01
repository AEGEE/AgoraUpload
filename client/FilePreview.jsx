import { createContainer } from 'meteor/react-meteor-data';
import { SubmissionFiles } from '/lib/Submission.js';

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

class FilePreview extends Component {
	render() {
		if (!this.props.ready) return (<div>Preview loading...</div>);

		console.log(this.props.file);
		let file = this.props.file;

		if (file.isImage()) {
			preview = (
				<img src={file.url()} style={{width: '100%'}}/>
			);
		} else {
			preview = (
				<div>No preview available</div>
			);
		}

		return (
			<div>
				{preview}
				<RaisedButton label="Download" />
				<div>
					<RaisedButton label="Submit new version" disabled={true} />
					<RaisedButton label="select file" onTouchTap={() => {
						this.refs.file.click();
					}}/>
					<input ref='file' type='file' id='file-input' style={{display: 'none'}} />
				</div>
			</div>
		);
	}
}

export default createContainer((props) => {
	let code = props.code;
	let fileHandle = Meteor.subscribe('file', code);
	let file = SubmissionFiles.findOne(code);
	return {
		ready: fileHandle.ready && file,
		file: file,
	};
}, FilePreview);
