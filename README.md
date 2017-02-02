Installation
============
To install, follow these steps:
 - Clone this repository to a local directory
 - `cd` into the directory you cloned this in
 - Copy `private/settings.example.json` to `private/settings.json` and change settings to what you want
 - Run `$ meteor npm install`
 - Run `$ meteor`
 - Assuming you're using the default port, you can now access it from `localhost:3000`

Running
=======
After initial installation, you can simply start the app again by running `meteor` from the directory of the application.

TODO
=====

- [ ] Write a readme
	- [x] Installation
	- [x] Running
	- [ ] Configuration(?)
	- [ ] Screenshots
- [ ] Add time slots (in settings.json)
- [ ] Admin page
	- [ ] Customizable sorting
	- [ ] Searching
- [ ] Thumbnails for non-image types on admin list
- [ ] Send emails on submission (with the direct URLs)

Done
====
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
