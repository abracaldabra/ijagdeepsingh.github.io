// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'add': 'addNewEvent',

			// Default
			'*actions': 'defaultAction'
		}
	});

	var init = function(){
		var app_router = new AppRouter;
		
		// Implements addNewEvent route
		app_router.on('addNewEvent', function(){
			// TODO
			console.log('you are in addNewEvent');
		});

		// Implements defaultAction route
		app_router.on('defaultAction', function(){
			// We have no matching route
			console.log('No route:', actions);
		});
		Backbone.history.start();
	};
	return {
		init: init
	};
});