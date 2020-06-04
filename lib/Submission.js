import { Class } from 'meteor/jagi:astronomy';

const Submissions = new Mongo.Collection('submissions');

function getFileName(sub) {
	let timeslot = sub.timeslot ? sub.timeslot : 'unknown';
	return '['+timeslot+']['+sub.body+'] ' + sub.title.replace(/\/|\\/g, '-');
}

const maxLengthValidation = {
	type: 'maxLength',
	param: 80,
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
		uploaded: Boolean,
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
			console.log('Filename at first:', file.name(), file.extension());
			file.name(getFileName(this) + '.' + file.extension());
			console.log('Filename after setting:', file.name(), file.extension());

			this.version = this.version + 1;
			this.file = fileId;
			this.updatedAt = new Date();
			this.save();
		}
	},
});

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
				'application/pdf',
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
	insert() { return true; },
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

	let settings = JSON.parse(Assets.getText('settings.json'));

	Meteor.startup(() => {
		SubmissionFiles.on('stored', Meteor.bindEnvironment(function(uploadedFile, storeName) {
			console.log('Uploaded a file:', uploadedFile._id, storeName);
			let submission = Submission.findOne({file: uploadedFile._id});
			if (submission) {
				submission.uploaded = true;
				submission.save(function(error, data) {
					if (error) {
						console.error("Error setting 'uploaded' field:", error);
					} else {
						console.log("Data:", data);
					}
				});
			} else {
				console.error('Could not find a submission for uploaded file', uploadedFile);
			}
		}));
	});

	Meteor.methods({
		submit(data) {
			console.log('Uploading:', data);

			let file = SubmissionFiles.findOne(data.file);
			if (!file) {
				throw new Meteor.Error("Attempting to create submission with non-existing file:" + data.file);
				return false;
			}

			let uploadPassword = data.public_password;
			if (!uploadPassword || (uploadPassword != settings.upload_password)) {
				console.log('File:', file);
				console.log('File2:', file.isUploaded());
				SubmissionFiles.remove(file._id);
				// file.remove();
				throw new Meteor.Error("Incorrect upload password");
				return false;
			}

			console.log('Creating submission');

			let submission = new Submission();
			submission.file = data.file;
			submission.title = data.title ? data.title.substring(0,100) : null;
			submission.name = data.name ? data.name.substring(0,100) : null;
			submission.email = data.email ? data.email.substring(0,100) : null;
			submission.version = 1;
			submission.body = data.body ? data.body.substring(0,100) : null;
			submission.updatedAt = new Date();
			submission.timeslot = data.timeslot ? data.timeslot.substring(0,100) : null;
			submission.notes = data.notes ? data.notes.substring(0,1000) : null;
			submission.uploaded = false;

			try {
				console.log("Saving");
				submission.save();
			} catch (e) {
				console.error("Error thrown while saving:", e);
				SubmissionFiles.remove(file._id);
				// file.remove();
				throw e;
				return false;
			}
			file.name(getFileName(submission) + '.' + file.extension());
			console.log("Saved");

			// file.on('stored', Meteor.bindEnvironment(function(uploadedFile, storeName) {
			// 	console.log('File uploaded:', uploadedFile._id, file._id, storeName);
			// }));

			// let wrappedValidation = Meteor.wrapAsync(function(cb) {
			// 	console.log('Async Validator called');
			// 	submission.validate(function(err) {
			// 		if (err) {
			// 			console.error("Error while validating:", err);
			// 			file.remove();
			// 			cb(err);
			// 		} else {
			// 			console.log('Submission approved');
			// 			file.name(getFileName(submission) + '.' + file.extension());
			// 			submission.save();
			// 			cb(null, submission._id);
			// 		}
			// 	});
			// });
			return submission._id;
		},
	});
}
