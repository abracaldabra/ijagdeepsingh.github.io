//Filename: main.js
require.config({
  paths: {
    text: 'libs/text/text',
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    moment: 'libs/moment/moment.min',
    radio: 'libs/flat-ui/radio'
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
    },
    'radio': {
      deps: ['jquery']
    }
  }

})

require(['app'], function(App) {
  window.todoApp = new App()
})