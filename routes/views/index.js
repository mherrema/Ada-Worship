var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		songs: [],
		artists: [],
	};

	// Load the songs
	view.on('init', function(next) {

			if (req.user && !req.user.isAuditionUser) {
				req.user.isNotAuditionUser = true;

				var Song = keystone.list('Song');

				Song.model.find()
					.where('state', 'published')
					.sort('-publishedDate')
					.populate('artist')
					.limit(6)
					.exec(function(err, songs) {
						locals.data.songs = songs;
						next(err);
					});

				}
				else{
					next("User not authorized");
				}
			});



	// Render the view
	view.render('index');
};
