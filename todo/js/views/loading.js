//Filename: loading.js
define([], function() {
  var LoadingView = Backbone.View.extend({
    el: $('.loading-view'),
    initialize: function() {
    },
    render: function() {
      this.$el.html('<i class="icon-spinner icon-spin icon-large"></i> Checking login...');
      return this;
    }
  });

  return LoadingView;
});