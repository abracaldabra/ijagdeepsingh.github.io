//Filename: event.js
define(['text!templates/event.html'], function(template) {
  var EventView = Backbone.View.extend({
    tagName: 'li',
    className: 'event',
    // Cache the event templates
    template: _.template(template),
    events: {
      'click #edit-button': 'open',
      'click #delete-button': 'delete'
    },
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
      this.model.on('remove', this.remove, this);
      this.model.on('select', this.open, this);
    },
    render: function() {
      var $el = $(this.el);
      window.data = {};
      data.id = this.model.get('id');
      data.summary = this.model.get('summary');
      data.priority = this.model.get('description');
      data.start = this.model.get('start');
      data.end = this.model.get('end');
      data.status = this.getStatus(this.model.get('status'), data.end);
      data.date = this.getDate(data.start);
      data.time = this.getTime(data.start, data.end);

      // If event has no summary
      if (typeof(data.summary) === 'undefined') {
        data.summary = 'No title';
      }

      // If event has no priority set it to low
      if (typeof(data.priority) === 'undefined') {
        data.priority = 'low';
      }

      if (data.priority !== 'high') {
        if (data.priority !== 'medium') {
          if (data.priority !== 'low') {
            data.priority = 'none';
          }
        }
      }


      $el.html(this.template(data));

      return this;
    },
    getDate: function(start) {
      // Get date or dateTime from start object
      var date = new Date(start.date || start.dateTime);
      return date.toLocaleString();
    },
    getTime: function(start, end) {
      var startTime, endTime, minutes, hour, time = "";

      // Get date or dateTime from start and end objects
      startTime = new Date(start.date || start.dateTime);
      endTime = new Date(end.date || end.dateTime);

      // Convert the difference from miliseconds to minutes
      minutes = ((endTime - startTime) / (60000)); // event time in seconds

      if (minutes < 60) {
        time = ("" + minutes + "M");
      } else {
        h = (minutes / 60);
        minutes = (minutes % 60);
        if (minutes === 0) {
          time = ("" + h.toFixed() + "H");
        } else {
          time = ("" + h.toFixed() + "H " + minutes + "M");
        }
      }
      return time;
    },
    open: function(event) {
      console.log('open: ' + this.model.get('id'));
    },
    delete: function() {
      console.log('delete: ' + this.model.get('id'));
      if (confirm("Are you sure you want to delete this event ?")) {
        todoApp.collections.events.get(this.model).destroy();
      }
      return false;
    },
    // Return status of event open or complete
    getStatus: function(status, end) {
      var endTime, offset, currentTime;

      endTime = new Date(end.date || end.dateTime);
      currentTime = new Date();

      if ((endTime - currentTime) > 0) {
        return 'Open';
      } else {
        return 'Complete';
      }
      return 'Open';
    }
  });
  return EventView;
});