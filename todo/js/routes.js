// Filename: routes.js
define([], function() {
  var Routes = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      "add": "add",
      "home": "home"
    },
    initialize: function() {
    },
    add: function() {
      if (typeof(todoApp) === "undefined") {
        this.navigate('home');
        return false;
      }
      $('#home').removeClass('active');
      $('#add').addClass('active');
      $('.app-view').hide();
      $('.add-event-view').show();
    },
    home: function() {
      $('#add').removeClass('active');
      $('#home').addClass('active');
      $('.add-event-view').hide();
      $('.app-view').show();
    }
  });

  return Routes;
});