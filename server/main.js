import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import http from 'http';

let locals;
Meteor.startup(() => {
	console.log("Server started");

	if (Meteor.isServer) {
		// Re-create admin user so we're sure username and password are correct
		console.log("Creating admin user");
		let credentials = JSON.parse(Assets.getText('settings.json'));
		Meteor.users.remove({});
		Accounts.createUser({
			username: credentials.username,
			password: credentials.password,
			email: credentials.email,
		});
	}

	// Fetch up-to-date locals
	console.log("Fetching locals");
	Meteor.http.call("GET",  "https://locals.aegee.org/locals.json", (json) => {
		data = JSON.parse(json);
		console.log("Got data, now parse:", data);
	});

	locals = {
		'ENS': 'AEGEE-Enschede',
		'CD': 'Comite Directeur',
	};
});

Meteor.methods({getLocals() {
	if (!locals) throw new Error('Locals data was not loaded yet');
	return locals;
}});
