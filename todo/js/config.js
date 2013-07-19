define([], function() {
  var config = {
    'oauth_url': 'https://accounts.google.com/o/oauth2/auth',
    'state': '/todo/',
  	'client_id': '34741868873.apps.googleusercontent.com',
  	'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  	'redirect_uri': 'http://jagdeep.me/todo/auth.html',
  	'response_type': 'token', // token or code
    'approval_prompt': 'force' // force or auto
  };
 
   _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  return config;
});