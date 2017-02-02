Description
===========
This is a simple upload tool that is aimed towards use during AEGEE events to submit presentations and/or videos that are to be presented during the (statutory) event. It provides an upload interface (unprotected), a way to access a submission directly through a known URL, and an admin backend which shows *all* submissions.

Note: Everyone with a submission URL can change the current version of the submission!

Installation
============
To install, follow these steps:
 - Clone this repository to a local directory
 - `cd` into the directory you cloned this in
 - Copy `private/settings.example.json` to `private/settings.json` and change settings to what you want
 - Run `$ meteor npm install`
 - Run `$ meteor`
 - Assuming you're using the default port, you can now access it from `localhost:3000`

Configuration
=============
Configuration happens in private/settings.json. Here, you can configure the following fields:
- username: admin username. Is applied on server start.
- password: admin password. Is applied on server start.
- email: admin email. Is applied on server start. New uploads will be notified here. (Does not work yet)
- timeslots: A key -> array structure of which timeslots are on which days.
- uploadpath: A path, relative from the root project directory, where uploads will be stored. Needs write access by the application.

Running
=======
After initial installation, you can simply start the app again by running `meteor` from the directory of the application.

TODO
=====

- [ ] Write a readme
	- [x] Installation
	- [x] Running
	- [x] Configuration
	- [ ] Screenshots
- [ ] Change name and/or local
- [ ] Admin page
	- [ ] Customizable sorting
	- [ ] Searching
		- [ ] Search by title
		- [ ] Search/Filter by day
		- [ ] Search/Filter by timeslot
		- [ ] Search/Filter by local
- [ ] Thumbnails for non-image types on admin list
- [ ] Send emails on submission (with the direct URLs)

Done
====
- [x] Time slots
- [x] Set up basic project
- [x] Default upload page
- [x] Actually upload files
- [x] Add admin interface
- [x] Allow access to submission page with direct url
- [x] Add admin login
- [x] Upload new versions
- [x] Fix login reactiveness
- [x] Add preview
  - [x] Image
  - [x] PDF
  - [x] Video
- [x] Download
- [x] Add file restrictions
