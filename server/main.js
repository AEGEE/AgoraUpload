import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';

let locals;
let timeslots = [];
Meteor.startup(() => {
	console.log("Server started");

	if (Meteor.isServer) {
		// Re-create admin user so we're sure username and password are correct
		console.log("Creating admin user");
		let settings = JSON.parse(Assets.getText('settings.json'));
		Meteor.users.remove({});
		Accounts.createUser({
			username: settings.username,
			password: settings.password,
			email: settings.email,
		});
		timeslots = settings.timeslots;
	}

	// Fetch up-to-date locals
	console.log("Fetching locals");
	HTTP.get("https://130.89.148.25/locals.json", {}, (err, json) => {
		console.log("Got data, now parse:", err, json);
		data = JSON.parse(json);
	});

	locals = {
		'ENS': 'AEGEE-Enschede',
		'CD': 'Comite Directeur',
	};
});

Meteor.methods({getData() {
	if (!locals) throw new Error('Locals data was not loaded yet');
	return {
		locals: locals,
		timeslots: timeslots,
	};
}});
