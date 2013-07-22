//Filename: app.js
define([
  'gapi',
  'routes',
  'views/app', 
  'views/auth'
],

function(ApiManager, Routes, AppView, AuthView) {
  var App = function() {
    this.routes = new Routes();

    this.views.app = new AppView();
    this.views.app.render();
    this.views.auth = new AuthView(this);
    this.views.auth.render();

    this.connectGapi();
  };

  App.prototype = {
    views: {},
    collections: {},
    connectGapi: function() {
      var self = this;
      this.apiManager = new ApiManager(this);
      this.apiManager.on('ready', function() {
        console.log('app ready');
      });
    }
  };

  return App;
});