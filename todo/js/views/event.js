//Filename: event.js
define(['text!templates/event.html', 'moment'], function(template) {
  var EventView = Backbone.View.extend({
    tagName: 'li',
    className: 'event',
    // Cache the template
    template: _.template(template),
    events: {
      'click #delete-button': 'deleteEvent'
    },
    initialize: function() {
      this.model.on('change', this.render, this)
      this.model.on('destroy', this.remove, this)
      this.model.on('remove', this.remove, this)
    },
    render: function() {
      var $el = $(this.el)
      data = {}
      data.id = this.model.get('id')
      data.summary = this.model.get('summary')
      data.extendedProperties = this.model.get('extendedProperties')
      data.start = this.model.get('start')
      data.end = this.model.get('end')
      data.status = this.getStatus(data.end)
      data.date = this.getStartDate(data.start)
      data.time = this.getDuration(data.start, data.end)

      // If event has no summary
      if (typeof(data.summary) === 'undefined') {
        data.summary = 'No title'
      }

      // Check if event has extended properties
      if (typeof(data.extendedProperties) === 'object') {
        data.priority = data.extendedProperties.private.priority
        data.status = this.getStatus(data.end, data.extendedProperties.private.status)
      }
      // Check if event has no priority
      if (data.priority !== 'high' && data.priority !== 'medium' && data.priority !== 'low') {
        data.priority = 'none'
      }

      $el.html(this.template(data))
      return this
    },
    /*
     * Returns the start dateTime of an event
     *
     * @param Object start
     * @returns dateTime
     */
    getStartDate: function(start) {
      // Get date or dateTime from start object
      var date = new moment(start.date || start.dateTime)
      return date.format('MMM Do YY, h:mm a')
    },
    /*
     * Returns duration of an event
     *
     * @param Object start
     * @param Object end
     * @returns String
     */
    getDuration: function(start, end) {
      var startTime = new moment(start.date || start.dateTime),
              endTime = new moment(end.date || end.dateTime)
      return endTime.diff(startTime, 'minutes') + "M"

    },
    /*
     * Delete an event
     */
    deleteEvent: function() {
      console.log('delete: ' + this.model.get('id'))
      if (confirm("Are you sure you want to delete this event ?")) {
        todoApp.collections.events.get(this.model).destroy()
      }
      return false
    },
    /*
     * Return status of event open or complete
     *
     * @returns String
     */
    getStatus: function(end, status) {
      if (status === "Completed")
        return "Complete"
      var currentTime = new moment()
      return (currentTime.isBefore(end.date || end.dateTime)) ? "Open" : "Complete"
    }
  })
  return EventView
})