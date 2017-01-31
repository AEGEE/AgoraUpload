import { Class } from 'meteor/jagi:astronomy';

const Submissions = new Mongo.Collection('submissions');
export Submission = Class.create({
	name: 'Submission',
	collection: Submissions,
});

export SubmissionFiles = new FS.Collection("submissions", {
	stores: [
		new FS.Store.FileSystem("submissions", {path: "/../uploads"}),
	],
});

// TODO: Set allowed filetypes, max upload size?

if (Meteor.isServer) {
	Submissions.allow({
		'insert': () => { return true; },
	});
}
