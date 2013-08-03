//Filename: models/user.js
define(['text!templates/nav.html'], function(navTemplate) {
  var NavView = Backbone.View.extend({
    el: $('#nav'),
    // Cache the templates
    template: _.template(navTemplate),
    initialize: function() {},
    render: function() {
      this.$el.html(this.template())
      return this
    }
  })

  return NavView
})