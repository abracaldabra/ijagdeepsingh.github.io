// Filename: routes.js
define([], function() {
  var Routes = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      "add": "add",
      "todo": "todo"
    },
    initialize: function() {
    },
    add: function() {
      if (typeof(todoApp) === "undefined") {
        this.navigate('todo')
        return false
      }
      $('#todo').removeClass('active')
      $('#add').addClass('active')
      $('.app-view').hide()
      $('.add-event-view').show()
    },
    todo: function() {
      $('#add').removeClass('active')
      $('#todo').addClass('active')
      $('.add-event-view').hide()
      $('.app-view').show()
    }
  })

  return Routes
})