import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import renderRoutes from './Routes.jsx';

import '/lib/Submission.js';

Meteor.startup(() => {
	injectTapEventPlugin();
	render(renderRoutes(), document.getElementById('app-render-target'));
});
