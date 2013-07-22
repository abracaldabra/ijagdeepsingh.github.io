//Filename: app.js
define([], function() {
	var AppView = Backbone.View.extend({
		el: $('.app-view'),
		initialize: function() {
		},
		render: function() {
			this.$el.html('Logged in');
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

	return AppView;
});