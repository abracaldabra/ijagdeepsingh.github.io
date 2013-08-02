//Filename: eventlist.js
define(['views/event'], function(EventView) {
  var EventListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-tabs nav-stacked eventlist',
    initialize: function() {
      this.collection.on('add', this.renderEvent, this)
    },
    render: function() {
      var $el = $(this.el),
              self = this

      return this
    },
    renderEvent: function(model) {
      var eventView = new EventView({
        model: model
      })
      this.$el.append(eventView.render().el)
    },
    sort: function() {
      var self = this
      self.$el.html('');
      self.collection.each(function(model) {
        self.renderEvent(model)
      })
    }
  })

  return EventListView
})