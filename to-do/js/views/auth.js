//Filename: auth.js
define([], function() {
	var AuthView = Backbone.View.extend({
		el: $('.auth-view'),

		initialize: function(_app) {
			this.app = _app;
		},

		render: function() {
			this.$el.html('<button class="btn btn-large btn-block btn-danger" id="auth-btn">Sign in with Google</button>');
			this.$el.hide();
			return this;
		},

		events: {
			'click button#auth-btn': 'authorize'
		},

		authorize: function(event) {
			this.app.apiManager.checkAuth();
		}
	});

	return AuthView;
});