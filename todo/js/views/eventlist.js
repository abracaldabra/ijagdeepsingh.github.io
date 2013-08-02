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
      // Render events created by this app only
      var ep = model.get('extendedProperties');
      if (typeof(ep) === 'object' && typeof(ep.private) === 'object' && typeof(ep.private.status) === 'string') {
        var eventView = new EventView({
          model: model
        })
        this.$el.append(eventView.render().el)
      } else {
        todoApp.collections.events.remove(model)
      }
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