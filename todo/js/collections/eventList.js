//Filename: EventList.js
define(['models/event'], function(Event) {
  var EventList = Backbone.Collection.extend({
    model: Event,
    url: 'events',
    comparator: function(model) {
      return model.get('start').dateTime;
    }
  })

  return EventList
})