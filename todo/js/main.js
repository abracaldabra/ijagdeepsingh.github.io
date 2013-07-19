//Filename: main.js
require.config({
	paths: {
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
		}
	}

});

require(['app'], function(App){
	window.todo = new App();
});