//Filename: views/addevent.js
define(['text!templates/addevent.html', 'radio'], function(template) {
  var AddEventView = Backbone.View.extend({
    el: $('.add-event-view'),
    // Cache the templates
    template: _.template(template),
    events: {
      'click button#create-event': 'create'
    },
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(this.template())
      return this
    },
    create: function() {
      var summary, priority, time, request, requestContent = {}, options = {}, dmin, dmax, email

      this.validate()

      // Get all inputs
      summary = $('#summary').val()
      priority = $('input[name=priority]:checked').val()
      time = $('input[name=time]:checked').val()

      console.log(summary + ":" + priority + ":" + time)

      email = todoApp.models.user.get('email')

      dmin = new moment()
      dmax = new moment()
      dmax.add('d', 30)
      if (priority === "low")
        dmin.add('d', 7)
      else if (priority === "medium")
        dmin.add('d', 2)


      requestContent.timeMin = dmin.format()
      requestContent.timeMax = dmax.format()
      requestContent.items = [{
          id: email
        }]
      requestContent.fields = 'timeMin, timeMax, calendars'

      options.success = function(res) {
        console.log(res)
      }
      request = gapi.client.calendar.freebusy.query(requestContent)
      Backbone.gapiRequest(request, 'read', this.model, options);

    },
    // Check validation
    validate: function() {
      // Check if summary is empty
      if ($('#summary').val() === "") {
        $('#summary').parent().addClass('error')
        $('#summary').focus()
        return false
      }
      // Clear previous error
      if ($('#summary').parent().hasClass('error')) {
        $('#summary').parent().removeClass('error')
      }
    }
  })
  return AddEventView
})