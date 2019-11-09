import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';

let bodies;
let timeslots = [];
Meteor.startup(() => {
	console.log("Server started");

	if (Meteor.isServer) {
		// Re-create admin user so we're sure username and password are correct
		console.log("Creating admin user");
		let settings = JSON.parse(Assets.getText('settings.json'));
		Meteor.users.remove({});

		Accounts.config({
			forbidClientAccountCreation: true,
			loginExpirationInDays: 7,
		});

		Accounts.createUser({
			username: settings.username,
			password: settings.password,
			email: settings.email,
		});
		timeslots = settings.timeslots;
	}

	// Fetch up-to-date bodies
	console.log("Fetching bodies");
	HTTP.get("https://my.aegee.eu/services/oms-core-elixir/api/bodies", {}, (err, response) => {
		if (err) {
			console.error("Error getting bodies data:", err);
		} else {
			bodies = {}
			let data = JSON.parse(response.content);
			for (let body of data.data) {
				bodies[body.legacy_key] = body.name;
			}
			// console.log('Bodies set to', bodies);
		}
	});
});

Meteor.methods({getData() {
	if (!bodies) throw new Error('bodies data was not loaded yet');
	return {
		bodies: bodies,
		timeslots: timeslots,
	};
}});
