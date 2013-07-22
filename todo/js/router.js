// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/home/HomeView'
], function($, _, Backbone, HomeView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'errorlogin/:errorcode': 'errorLogin',
			'*actions' : 'defaultAction'

		}
	});

	var _init = function(){
		var app_router = new AppRouter;
		// Implements addNewEvent route
		app_router.on('route:errorLogin', function(errorcode){
			// TODO
			// Load home view
			var home = new HomeView();
			home.render();
			// Print error code
			console.log('Login error code : ' + errorcode);
		});

		// Implements defaultAction route
		app_router.on('route:defaultAction', function(actions){
			// Load home view
			var home = new HomeView();
			home.render();
			console.log('Home view : ' + actions);
		});
		Backbone.history.start();
	};

	return {
		// This will return an Object
		// which has a function init (copy of _init) 
		init: _init 
	};
});