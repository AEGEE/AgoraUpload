import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import App from './App.jsx';

import UploadPage from './UploadPage.jsx';
import SubmissionPage from './SubmissionPage.jsx';
import LoginPage from './LoginPage.jsx';
import AdminPage from './AdminPage.jsx';

export default renderRoutes = function() {
	return (
		<Router history={browserHistory}>
			<Route component={App}>
				<Route path="/" component={UploadPage} />
				<Route path="/login" component={LoginPage} />
				<Route path="/admin" component={AdminPage} />
			</Route>
		</Router>
	);
};
