//Filename: HomeView.js
define([
	'jquery', 
	'underscore', 
	'backbone'
], function($, _, Backbone){
	// jQuery, Underscore, Backbone
	var HomeView = Backbone.View.extend({
		el: $('.home'),
		initialize: function(){
			this.render();
		},
		render: function(){
			$(this.el).html('<p>You are signed in with google.com</p>');			
		},
		events: {
			'click button#auth': 'authorize'
		},
		authorize: function(event){
		    
		}
	});

	return HomeView;
});