//Filename: OAuthModel.js
define([
	'jquery', 
	'underscore', 
	'backbone'
], function($, _, Backbone){
	// jQuery, Underscore, Backbone
	var OAuthModel = Backbone.Model.extend({
		defaults{
			access_token: ,
			expires_at: ,
			expires_in: ,
			issued_at: 
		},

		initialize: function(token){
			this.access_token = token.access_token;
			this.expires_at = token.expires_at;
			this.expires_in = token.expires_in;
			this.issued_at = token.issued_at;
		}
	});

	return OAuthModel;
});