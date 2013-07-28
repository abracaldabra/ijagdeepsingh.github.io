//Filename: auth.js
define(['text!templates/auth.html'], function(authTemplate) {
  var AuthView = Backbone.View.extend({
    el: $('.auth-view'),
    template: _.template(authTemplate),
    initialize: function(_app) {
      this.app = _app;
    },
    render: function() {
      this.$el.html(this.template());
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