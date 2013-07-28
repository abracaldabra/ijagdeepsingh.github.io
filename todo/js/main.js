//Filename: main.js
require.config({
  paths: {
    text: 'libs/text/text	',
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min'
  },
  shim: {
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'app': {
      deps: ['underscore', 'backbone']
    }
  }

});

require(['app', 'js/libs/flat-ui/radio.js'], function(App) {
  window.todoApp = new App();
});