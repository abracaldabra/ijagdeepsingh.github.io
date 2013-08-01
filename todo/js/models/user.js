//Filename: event.js
define([], function() {
  var User = Backbone.Model.extend({
    url: 'userinfo',
  })
  return User
})