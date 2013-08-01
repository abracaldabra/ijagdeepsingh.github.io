//Filename: views/addevent.js
define(['text!templates/addevent.html', 'radio', 'moment'], function(template) {
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
      var data = {}, request, requestContent = {}, options = {}, self = this

      if (!this.validate())
        return false

      // Get all inputs
      data.summary = $('#summary').val()
      data.priority = $('input[name=priority]:checked').val()
      data.duration = $('input[name=time]:checked').val()

      // Get email from user model
      data.email = todoApp.models.user.get('email')

      // Create timeMin and timeMax moments
      data.timeMin = self.checkTimeConstraints(moment(), data.duration)
      data.timeMin.seconds(0)
      data.timeMin.milliseconds(0)
      console.log(data.timeMin.format())

      data.timeMax = new moment()
      data.timeMax.seconds(0)
      data.timeMax.milliseconds(0)
      data.timeMax.add('M', 1)

      // Based on priority schedule task from day 2 or 7
      // Add 2 days in timeMin if medium, add 7 if low
      if (data.priority === "low")
        data.timeMin.add('d', 7)
      else if (data.priority === "medium")
        data.timeMin.add('d', 2)

      requestContent.timeMin = data.timeMin.format()
      requestContent.timeMax = data.timeMax.format()
      requestContent.fields = 'timeMin, timeMax, calendars'
      requestContent.items = [{
          id: data.email
        }]

      // Callback for http request
      options.success = function(res) {
        if (typeof(res.calendars) === "undefined") {
          // This calendar has no events
          console.log('No events found')
          self.scheduleEvent(data)
          return false
        } else {

          busy = res.calendars[data.email].busy,
                  l = busy.length
          // ========================== start
          var schedule = true, i = 0
          while (data.timeMax.diff(data.timeMin, 'm') > 0 && schedule) {

            // Step 1
            var start = new moment(busy[i].start),
                    end = new moment(busy[i].end)

            if (start.isSame(data.timeMin)) {
              // Event running
              console.log('event running. set timeMin = end')
              data.timeMin = self.checkTimeConstraints(end, data.duration)
              // TODO
              if (i < l) {
                i++
              }
            } else {
              // Step 2
              // Event in future
              // Check if time remaining is greater than event duration
              if (start.diff(data.timeMin, 'm') >= data.duration) {
                // We have time for event
                // Schedule it now
                console.log('We have time schedule event now')
                self.scheduleEvent(data)
                schedule = false
                return false
              } else {
                // Step 3
                // We dont have time for event
                // Set timeMin = end
                console.log('we dont have time. set timeMin = end')
                data.timeMin = self.checkTimeConstraints(end, data.duration)
                // TODO
                if (i < l) {
                  i++
                }
              }
            }

          }

          console.log('nothing found')
          // ========================== end

        }
      }

      request = gapi.client.calendar.freebusy.query(requestContent)
      Backbone.gapiRequest(request, 'read', this.model, options)

    },
    /*
     * Check if summary is added
     *
     * @returns false
     */
    validate: function() {
      // Check if summary is empty
      if ($('#summary').val() === "") {
        $('#summary').parent().addClass('error')
        $('#summary').focus()
        return false
      } else if ($('#summary').parent().hasClass('error')) {
        $('#summary').parent().removeClass('error')
      }
      return true
    },
    /*
     * Checks the validation of time and duraction of event
     * according to time constraints
     * For ex. schedule events only between 9-12 to 1-6
     *
     * @params moment time
     * @params number duration
     */
    checkTimeConstraints: function(time, duration) {
      var h = time.hours(),
              m = time.minutes()
      time.seconds(0)
      time.milliseconds(0)

      if (h < 9) {                            // time is before 9
        // set time at 9:00
        time.hours(9)
        time.minutes(0)
        console.log('9- Set to 9:00')
        return time
      } else if (h >= 9 && h <= 11) {         // time is between 9-12
        // if time is 11+ then check
        // if time is available for event
        if (h === 11) {
          if (((60 - m) - duration) >= 0) {
            // Yes we have time for event
            console.log('11+ have time')
            return time
          } else {
            // Not enough time for event
            // Set time to 1:00
            time.hours(13)
            time.minutes(0)
            console.log('11+ No time. Set to 1:00')
            return time
          }
        } else {
          // We have time for event
          console.log('9+ have time')
          return time
        }
      } else if (h === 12) {                  // time is between 12-1
        // set time at 1:00
        time.hours(13)
        time.minutes(0)
        console.log('12+ time. Set to 1:00')
        return time
      } else if (h >= 1 && h <= 17) {         // time is between 1-6
        // if time is 17+ then check
        // if time is available for event
        if (h === 17) {
          if (((60 - m) - duration) >= 0) {
            // Yes we have time for event
            console.log('17+ have time.')
            return time
          } else {
            // Not enough time for event
            // Next day
            time.hours(33)
            time.minutes(0)
            console.log('17+ no time. Set to 9:00 next day.')
            return time
          }
        } else {
          // Yo we have enough time
          console.log('1+ have time')
          return time
        }
      } else if (h > 17) {                    // time is after 6
        // set time next day at 9:00
        time.hours(33)
        time.minutes(0)
        console.log('18+ Next day 9:00.')
        return time
      }
    },
    /*
     * Schedule an event on Google calendar
     *
     * @params Object data
     */
    scheduleEvent: function(data) {
      console.log('Scheduled at: ' + data.timeMin.format())
    }
  })

  return AddEventView
})