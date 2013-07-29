//Filename: models/user.js
define(['text!templates/user.html'], function(userTemplate) {
  var UserView = Backbone.View.extend({
    el: $('.user-view'),
    // Cache the templates
    template: _.template(userTemplate),
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()))
      return this
    }
  })

  return UserView
})