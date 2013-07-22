// Filename: routes.js
define([
	'views/app'
], function(AppView) {
	var Routes = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'*actions': 'defaultAction'
		},

		initialize: function() {

		},
		defaultAction: function() {
			var app = new AppView();
			app.render();
		}
	});

	return Routes
});