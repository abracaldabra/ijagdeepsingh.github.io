//Filename: app.js
define([
  'gapi',
  'routes',
  'views/auth',
  'views/loading',
  'views/user',
  'views/nav',
  'views/addevent',
  'views/eventlist',
  'collections/eventList',
  'models/calendar',
  'models/user',
  'moment'
],
        function(ApiManager, Routes, AuthView, LoadingView, UserView, NavView, AddEventView, EventListView, EventList, Calendar, User, moment) {
          var App = function() {

            this.routes = new Routes()
            Backbone.history.start()

            // Load loading view
            this.views.loading = new LoadingView()
            this.views.loading.render()

            // Create nav view
            this.views.nav = new NavView()

            // Create model to store user's information
            this.models.user = new User()

            // Create collection of event model
            this.collections.events = new EventList()

            // Create eventListView with eventList collection
            this.views.eventList = new EventListView({
              collection: this.collections.events
            })

            // Create auth view
            this.views.auth = new AuthView(this)
            this.views.auth.render()

            this.connectGapi()
          }

          App.prototype = {
            views: {},
            models: {},
            collections: {},
            connectGapi: function() {
              var self = this
              this.apiManager = new ApiManager(this)
              this.apiManager.on('ready', function() {
                // Loading user information starts
                $('.app-view').html('<div class="text-center"><i class="icon-spinner icon-spin icon-large"></i> Loading user information...</div>')
                self.models.user.fetch({
                  success: function(model, res, req) {
                    self.views.user = new UserView({
                      model: self.models.user
                    })

                    // render add new event view
                    self.views.addEvent = new AddEventView()
                    self.views.addEvent.$el.hide()

                    // Show nav view
                    self.views.nav.render()

                    // Loading events starts
                    self.fetchEvents()

                  }
                })
              })
            },
            fetchEvents: function() {
              var self = this
              $('.app-view').html('<div class="text-center"><i class="icon-spinner icon-spin icon-large"></i> Loading events...</div>')
              self.collections.events.fetch({
                success: function(collection, res, req) {
                  if (!todoApp.collections.events.size()) {
                    // Show no event error
                    $('.app-view').html('<div class="alert alert-error"><strong>Oh snap!</strong> No events found. <a href="#/add"><span class="fui-plus"></span> Add new events</a></div>')
                  } else {
                    $('.app-view').html(self.views.eventList.render().$el)
                  }
                },
                error: function(msg) {
                  $('.app-view').html('<div class="alert alert-error"><strong>Oh snap!</strong> No events found. <a href="#/add"><span class="fui-plus"></span> Add new events</a></div>')
                },
                data: {
                  calendarId: self.models.user.get('email'),
                  orderBy: 'startTime',
                  singleEvents: true,
                  timeMin: moment().format(),
                  fields: 'items(id, start, end, summary, status, description, extendedProperties)'
                }
              })
            }
          }

          return App
        })