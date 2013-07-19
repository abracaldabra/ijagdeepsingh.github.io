//Filename: OAuthButton.js
define([
	'jquery', 
	'underscore', 
	'backbone',
	'config'
], function($, _, Backbone, config){
	// jQuery, Underscore, Backbone
	var OAuthButton = Backbone.View.extend({
		el: $('.oauth-button'),
		initialize: function(){
			this.render();
		},
		render: function(a){
			$(this.el).hide();
			$(this.el).html('<button class="btn btn-large btn-block btn-danger" id="auth">Sign in with Google</button>');
			$(this.el).fadeIn('slow');			
		},
		events: {
			'click button#auth': 'authorize'
		},
		authorize: function(event){
			window.location = this.getUrl();
	        //window.location = this.getUrl();
	       
		},
		getUrl: function(){
			return config.oauth_url 
			 + '?&state=' + encodeURIComponent(config.state)
			 + '&client_id=' + encodeURIComponent(config.client_id)
			 + '&scope=' + encodeURIComponent(config.scope)
			 + '&redirect_uri=' + encodeURIComponent(config.redirect_uri)
			 + '&response_type=' + encodeURIComponent(config.response_type)
			 + '&approval_prompt=' + encodeURIComponent(config.approval_prompt);
		}
	});

	return OAuthButton;
});