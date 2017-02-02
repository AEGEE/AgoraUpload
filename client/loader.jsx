import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import CircularProgress from 'material-ui/CircularProgress';

export default class PageLoading extends Component {
	render() {
		return (
			<div style={{textAlign: 'center', marginTop: '100px'}}>
				<CircularProgress size={80} thickness={6} />
			</div>
		);
	}
}
