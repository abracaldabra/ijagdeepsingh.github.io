//Filename: config.js
define([], function() {
  var config = {
  	'clientId': '34741868873',
    'apiKey': 'AIzaSyC7n5Clr6K0JYnqBWmrNv5x0w-dDwYX0eg',
  	'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  	};
 
   _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  return config;
});