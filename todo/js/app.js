//Filename: app.js
define([
	'jquery', 
	'underscore', 
	'backbone', 
	'router'
], function($, _, Backbone, Router){
	var App = function(){
		// Check token and verify
		var	token = this.checkToken(),
				varifytoken = this.verifyToken(token, this);
		// Initialize route module
		Router.init();
	}

	App.prototype = {
		views: {},
		collections: {},
		checkToken: function(){
			if(typeof(Storage)!=="undefined"){
				// Retrieve the token object from storage
				var token = JSON.parse(window.localStorage.getItem('access_token'));
				if(token !== null){
					// Token available
					return token.access_token;
				} else{
					window.location.href = 'http://' + window.location.host + '/todo/login.html'
				}
			} else {
				console.error('Local storage not available');
			}
		},
		sessionExpired: function(){
			console.log('sessionExpired');
			this.clearStorage();
			window.location = 'http://' + window.location.host + '/todo/login.html'
		},
		verifyToken: function(token, app){
			if(token){
				$.ajax({
					url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token,
					dataType: 'json',
					statusCode: {
						// Invalid token found
				    400: function(response) {
				      console.log('Token invalid');
				      window.location = 'http://' + window.location.host + '/todo/login.html'
				    },
				    // Valid token found
				    200: function(response) {
				    	app.clearTimeout();
				    	var timeoutId = window.setTimeout(app.sessionExpired, response.expires_in * 1000);
				    	window.localStorage.setItem('timeout_id', timeoutId);
				    	console.log("Timeout set, id: " + timeoutId + ' time: ' + response.expires_in);
				    }
				  }
				});
			}
		},
		clearStorage: function(){
			this.clearTimeout();
			window.localStorage.clear();
		},
		// This will clearTimeout and remove timeout_id from localStorage
		clearTimeout: function(){
			var timeoutId = window.localStorage.getItem('timeout_id');
			window.clearTimeout(timeoutId);
			window.localStorage.removeItem('timeout_id');
		}
	}

	return App;
});