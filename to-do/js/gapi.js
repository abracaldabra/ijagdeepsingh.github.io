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
    gapi.client.load('calendar', 'v3', function() { /* Loaded */ });

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
        // Hide login view
        app.views.auth.$el.hide();
        // Show app view
        app.views.app.$el.show();
        self.trigger('ready');
      } else {
        // If error, show error view
        if (authResult && authResult.error) {
          // TODO: Load error login view
          console.error('Unable to sign in:', authResult.error);
        }
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

    switch (model.url) {
      case 'tasks':
        requestContent.task = model.get('id');
        requestContent.tasklist = model.get('tasklist');
        break;

      case 'tasklists':
        requestContent.tasklist = model.get('id');
        break;
    }

    switch (method) {
      case 'create':
        requestContent['resource'] = model.toJSON();
        request = gapi.client.tasks[model.url].insert(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'update':
        requestContent['resource'] = model.toJSON();
        request = gapi.client.tasks[model.url].update(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'delete':
        requestContent['resource'] = model.toJSON();
        request = gapi.client.tasks[model.url].delete(requestContent);
        Backbone.gapiRequest(request, method, model, options);
        break;

      case 'read':
        request = gapi.client.tasks[model.url].list(options.data);
        Backbone.gapiRequest(request, method, model, options);
        break;
    }
  };

  Backbone.gapiRequest = function(request, method, model, options) {
    var result;
    request.execute(function(res) {
      if (res.error) {
        if (options.error) options.error(res);
      } else if (options.success) {
        if (res.items) {
          result = res.items;
        } else {
          result = res;
        }
        options.success(result);
      }
    });
  };

  return ApiManager;
});