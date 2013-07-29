//Filename: EventList.js
define(['models/event'], function(Event) {
  var EventList = Backbone.Collection.extend({
    model: Event,
    url: 'events'
  })

  return EventList
})