export default Submissions = new FS.Collection("submissions", {
	stores: [
		new FS.Store.FileSystem("submissions", {path: "/../uploads"}),
	],
});

if (Meteor.isServer) {
	Submissions.allow({
		'insert': () => { return true; },
	});
}
