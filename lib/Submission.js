import { Class } from 'meteor/jagi:astronomy';

const Submissions = new Mongo.Collection('submissions');

function getFileName(submission) {
	return '['+submission.timeslot+']['+submission.body+'] ' + submission.title;
}

const maxLengthValidation = {
	type: 'maxLength',
	param: 50,
	resolveError({param, name}) {
		return name + " can be at most 50 characters long";
	},
};

const emailValidation = {
	type: 'email'
};

export const Submission = Class.create({
	name: 'Submission',
	collection: Submissions,
	fields: {
		file: String,
		title: {
			type: String,
			validators: [maxLengthValidation],
		},
		version: Number,
		body: {
			type: String,
			validators: [maxLengthValidation],
		},
		name: {
			type: String,
			validators: [maxLengthValidation],
		},
		email: {
			type: String,
			validators: [maxLengthValidation, emailValidation],
		},
		notes: {
			type: String,
			optional: true,
			validators: [maxLengthValidation],
		},
		timeslot: {
			type: String,
			optional: true,
		},
		updatedAt: Date,
	},
	meteorMethods: {
		reupload(fileId) {
			console.log("Change: ", this.file, this.title, this.version, this.body, this.updatedAt);
			console.log('To: ', file, this.version + 1, new Date());

			let file = SubmissionFiles.findOne(fileId);
			if (!file) {
				console.error("Attempting to create submission with non-existing file:", fileId);
				return false;
			}
			file.name(getFileName(this));

			this.version = this.version + 1;
			this.file = fileId;
			this.updatedAt = new Date();
			this.save();
		}
	},
});

if (Meteor.isServer) {
	Meteor.methods({
		submit(data) {
			console.log('Creating submission with data:', data);

			let file = SubmissionFiles.findOne(data.file);
			if (!file) {
				throw new Meteor.Error("Attempting to create submission with non-existing file:" + data.file);
				return false;
			}

			let submission = new Submission();
			submission.file = data.file;
			submission.title = data.title;
			submission.name = data.name;
			submission.email = data.email;
			submission.version = 1;
			submission.body = data.body;
			submission.updatedAt = new Date();
			submission.timeslot = data.timeslot;
			submission.notes = data.notes;

			file.name(getFileName(submission));
			submission.save();
			return submission._id;
		},
	});
}

let uploadPath = "uploads";
if (Meteor.isServer) {
	let settings = JSON.parse(Assets.getText('settings.json'));
	uploadPath = settings.upload;
}

export const SubmissionFiles = new FS.Collection("submissions", {
	stores: [
		new FS.Store.FileSystem("submissions", {path: uploadPath}),
	],
	transformRead: function(fileObj, readStream, writeStream) {
		console.log('Transform Read:', fileObj);
		readStream.pipe(writeStream);
	},
	filter: {
		allow: {
			contentTypes: [
				'video/mp4', 'video/webm', 'video/ogg',
				'audio/*',
				'image/*',
				'application/*',
			],
		},
		onInvalid: function(message) {
			if (Meteor.isClient) {
				SubmissionFiles.lastError = message;
			} else {
				console.error('error uploading:', message);
			}
		},
	},
});
// TODO: Set allowed filetypes, max upload size?

SubmissionFiles.allow({
	insert() {
		return true;
	},
	update() { return true; },
	download() { return true; },
});

if (Meteor.isServer) {
	Meteor.publish('submission', (code) => {
		return Submission.find({_id: code});
	});

	Meteor.publish('submissions', () => {
		// TODO: Enable user check once admin login is implemented
		// if (!Meteor.user()) { this.ready(); return; }
		return Submission.find();
	});

	Meteor.publish('file', (code) => {
		return SubmissionFiles.find(code);
	});

	Meteor.publish('files', () => {
		// TODO: Enable user check once admin login is implemented
		// if (!Meteor.user()) { this.ready(); return; }
		return SubmissionFiles.find();
	});
}
