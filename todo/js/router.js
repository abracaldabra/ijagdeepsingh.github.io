// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/oauth/OAuthButton'
], function($, _, Backbone, OAuthButton){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'errorlogin/:errorcode': 'errorLogin',
			'*actions' : 'defaultAction'

		}
	});

	var init = function(){
		var app_router = new AppRouter;
		
		// Implements addNewEvent route
		app_router.on('route:errorLogin', function(errorcode){
			// TODO
			// Load home view
			var button = new OAuthButton();
			button.render();
			// Print error code
			console.log('Login error code : ' + errorcode);
		});

		// Implements defaultAction route
		app_router.on('route:defaultAction', function(actions){
			// Load home view
			var button = new OAuthButton();
			button.render();
			console.log('Home view : ' + actions);
		});
		Backbone.history.start();
	};

	return {
		init: init
	};
});