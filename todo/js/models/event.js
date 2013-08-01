//Filename: event.js
define([], function() {
  window.Event = Backbone.Model.extend({
    url: 'events'
  })
  return Event
})