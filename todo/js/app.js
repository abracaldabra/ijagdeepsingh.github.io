//Filename: app.js
define([
	'jquery', 
	'underscore', 
	'backbone', 
	'router'
], function($, _, Backbone, Router){
	var init = function(){
		//init router module
		Router.init();
	}
	return {
		init: init
	};
});