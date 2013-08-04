//Filename: views/addevent.js
define(['text!templates/addevent.html', 'text!templates/addmore.html', 'models/event', 'radio', 'moment'], function(addeventform, addmore, Event) {
  var AddEventView = Backbone.View.extend({
    el: $('.add-event-view'),
    // Cache the templates
    template: _.template(addeventform),
    addmore: _.template(addmore),
    events: {
      'click button#create-event': 'create',
      'click button#add-more': 'render'
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

      console.log(data.summary + ":" + data.priority + ":" + data.duration)
      this.$el.html('<div class="text-center"><i class="icon-spinner icon-spin icon-large"></i> Finding free time...</div>')

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
      data.timeMax.add('M', 3)

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
        self.$el.html('<div class="text-center"><i class="icon-spinner icon-spin icon-large"></i> Scheduling event...</div>')

        if (typeof(res.calendars) === "undefined") {
          // This calendar has no events
          console.log('No events found')
          self.scheduleEvent(data)
          return false
        } else {

          var busy = res.calendars[data.email].busy,
            l = busy.length
            // ========================== start
          var schedule = true,
            i = 0
          while (data.timeMax.diff(data.timeMin, 'm') > 0 && schedule) {

            // Step 1
            var start = new moment(busy[i].start),
              end = new moment(busy[i].end)

              if (start.isSame(data.timeMin)) {
                // Event running
                console.log('event running. set timeMin = end')
                data.timeMin = self.checkTimeConstraints(end, data.duration)
                // TODO
                if (i < l - 1) {
                  i++
                } else {
                  schedule = false
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
                  if (i < l - 1) {
                    i++
                  } else {
                    schedule = false
                  }
                }
              }

          }

          if (data.timeMax.diff(data.timeMin, 'm') > 0) {
            console.log('Busy events over. Schedule event now')
            self.scheduleEvent(data)
          } else {
            alert("You have no time in next three months for any event of this duration.")
          }

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
     * For ex. schedule events only between 9-12 to 1-6 and mon-fri
     *
     * @params moment time
     * @params number duration
     */
    checkTimeConstraints: function(time, duration) {
      time = this.checkDay(time)

      var h = time.hours(),
        m = time.minutes()
        time.seconds(0)
        time.milliseconds(0)

        if (h < 9) { // time is before 9
          // set time at 9:00
          time.hours(9)
          time.minutes(0)
          console.log('9- Set to 9:00')
          return time
        } else if (h >= 9 && h <= 11) { // time is between 9-12
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
        } else if (h === 12) { // time is between 12-1
          // set time at 1:00
          time.hours(13)
          time.minutes(0)
          console.log('12+ time. Set to 1:00')
          return time
        } else if (h >= 1 && h <= 17) { // time is between 1-6
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
        } else if (h > 17) { // time is after 6
          // set time next day at 9:00
          time.hours(33)
          time.minutes(0)
          console.log('18+ Next day 9:00.')
          return this.checkDay(time)
        }
    },
    /*
     * Check what day is today If sunday(0) or saturday(6)
     * set day to monday(1 || 7)
     *
     * @param moment time
     * @returns moment
     */
    checkDay: function(time) {
      if (time.days() === 6) {
        console.log('Saturday. Set to Monday 9am')
        time.days(8)
        time.hours(9)
        time.minutes(0)
      } else if (time.days() === 0) {
        console.log('Sunday. Set to Monday 9am')
        time.days(1)
        time.hours(9)
        time.minutes(0)
      }
      return time
    },
    /*
     * Schedule an event on Google calendar
     *
     * @params Object data
     */
    scheduleEvent: function(data) {
      var requestContent = {}, request, self = this
        console.log('Scheduled at: ' + data.timeMin.format())

        var options = {
          success: function(res) {
            console.log(res)
            var d = {
              date: self.getStartDate(res.start),
              time: self.getDuration(res.start, res.end)
            }
            self.$el.html(self.addmore(d))
            self.event = new Event(res)
            $('.app-view').html(todoApp.views.eventList.render().$el)
            todoApp.collections.events.add(self.event)
            todoApp.views.eventList.sort()
          }
      }

      var startTime = data.timeMin.format()
      var endTime = data.timeMin.add('m', data.duration).format()

      requestContent = {
        path: "calendar/v3/calendars/" + data.email + "/events",
        method: "POST",
        params: {
          fields: "id, start, end, summary, status, extendedProperties",
        },
        body: {
          summary: data.summary,
          "end": {
            "dateTime": endTime
          },
          "start": {
            "dateTime": startTime
          },
          extendedProperties: {
            private: {
              priority: data.priority,
              status: "Open"
            },
          }
        }
      }
      request = gapi.client.request(requestContent)
      Backbone.gapiRequest(request, 'create', this.model, options)

    },
    /*
     * Returns the start dateTime of an event
     *
     * @param Object start
     * @returns dateTime
     */
    getStartDate: function(start) {
      // Get date or dateTime from start object
      var date = new moment(start.dateTime)
      return date.format('ddd, MMM Do YY, h:mm a')
    },
    /*
     * Returns duration of an event
     *
     * @param Object start
     * @param Object end
     * @returns String
     */
    getDuration: function(start, end) {
      var startTime = new moment(start.dateTime),
        endTime = new moment(end.dateTime)
        return endTime.diff(startTime, 'minutes') + "M"

    }
  })

  return AddEventView
})