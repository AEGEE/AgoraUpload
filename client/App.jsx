import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { MuiThemeProvider } from 'material-ui/styles';

export default class App extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<MuiThemeProvider>
				<div className='app'>
					<Helmet title='Agora Upload' />
					{this.props.children}
				</div>
			</MuiThemeProvider>
		);
	}
};
