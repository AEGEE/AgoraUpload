import { createContainer } from 'meteor/react-meteor-data';
import { SubmissionFiles } from '/lib/Submission.js';

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import PDF from 'react-pdfjs';

class FilePreview extends Component {
	render() {
		if (!this.props.ready) return (<div>Preview loading...</div>);

		console.log(this.props.file);
		let file = this.props.file;

		if (file.isImage()) {
			preview = (
				<img src={file.url()} style={{width: '100%'}}/>
			);
		} else if (file.isVideo()) {
			preview = (
				<video src={file.url()} style={{width: '100%'}} controls/>
			);
		} else {
			let extension = file.getExtension();
			console.log('Extension', extension);
			if (extension == 'pdf') {
				preview = (
					<div>
						<PDF
							file={file.url()}
							style={{width: '100%', margin: '10px'}}
						/>
						One page preview
					</div>
				);
			} else {
				preview = (
					<div>No preview available</div>
				);
			}
		}

		return (
			<div>
				{preview}
				<RaisedButton label="Download" primary={true} />
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
