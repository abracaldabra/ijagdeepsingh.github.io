//Filename: gapi.js
define(['config'], function(config) {
  var app;

  function ApiManager(_app) {
    app = _app;
    this.loadGapi();
  }

  _.extend(ApiManager.prototype, Backbone.Events);

  ApiManager.prototype.init = function() {
    // create copy of 'this' because we will edit this.checkAuth method later
    var self = this;
    // Load the Google Calendar api
    gapi.client.load('calendar', 'v3', function() { /* Loaded */
    });

    function handleClientLoad() {
      gapi.client.setApiKey(config.apiKey);
      window.setTimeout(checkAuth, 100);
    }

    // Authorize user with Google Calendar

    function checkAuth() {
      gapi.auth.authorize({
        client_id: config.clientId,
        scope: config.scopes,
        immediate: true
      }, handleAuthResult);
    }

    // Handle authorize user response

    function handleAuthResult(authResult) {
      var authTimeout;

      // If login successfull with no error
      if (authResult && !authResult.error) {
        // Schedule a check when the authentication token expires
        if (authResult.expires_in) {
          authTimeout = (authResult.expires_in - 5 * 60) * 1000;
          setTimeout(checkAuth, authTimeout);
        }
        // Hide loading view
        app.views.loading.$el.hide();
        // Hide login view
        app.views.auth.$el.hide();
        // trigger ready event
        self.trigger('ready');
      } else {
        // If error, show error view
        if (authResult && authResult.error) {
          // TODO: Load error login view
          console.error('Unable to sign in:', authResult.error);
        }
        // Hide loading view
        app.views.loading.$el.hide();
        // Otherwise just load login view
        app.views.auth.$el.show();
        console.log('Access denied or User not logged in');
      }
    }

    this.checkAuth = function() {
      gapi.auth.authorize({
        client_id: config.clientId,
        scope: config.scopes,
        immediate: false
      }, handleAuthResult);
    };

    handleClientLoad();
  };

  ApiManager.prototype.loadGapi = function() {
    var self = this;

    // Don't load gapi if it's already present
    if (typeof gapi !== 'undefined') {
      return this.init();
    }

    require(['https://apis.google.com/js/client.js?onload=define'], function() {
      // Poll until gapi is ready
      function checkGAPI() {
        if (gapi && gapi.client) {
          self.init();
        } else {
          setTimeout(checkGAPI, 100);
        }
      }

      checkGAPI();
    });
  };

  // TODO: create this for calendar api
  Backbone.sync = function(method, model, options) {
    var requestContent = {}, request;
    options || (options = {});

    console.log(method + ',' + model.url);

    switch (model.url) {
      case 'events':

        break;

      case 'userinfo':
        requestContent.path = 'oauth2/v3/' + model.url;
        request = gapi.client.request(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        return;
        break;
    }

    switch (method) {
      case 'create':
        requestContent['resource'] = model.toJSON();
        request = gapi.client.calendar[model.url].insert(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'update':
        requestContent['resource'] = model.toJSON();
        request = gapi.client.calendar[model.url].update(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'delete':
        requestContent.calendarId = todoApp.models.user.get('email');
        requestContent.eventId = model.get('id');
        //requestContent['resource'] = model.toJSON();
        request = gapi.client.calendar[model.url].delete(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'read':
        request = gapi.client.calendar[model.url].list(options.data);
        Backbone.gapiRequest(request, method, model, options);
        break;
    }
  };

  Backbone.gapiRequest = function(request, method, model, options) {
    var result;
    request.execute(function(res) {
      if (typeof(res) === 'undefined') {
        //TODO: no events view
        console.log('No events found');
      } else {
        if (res.error) {
          if (options.error)
            options.error(res);
        } else if (options.success) {
          if (res.items) {
            result = res.items;
          } else {
            result = res;
          }
          options.success(result);
        }
      }
    });
  };

  return ApiManager;
});