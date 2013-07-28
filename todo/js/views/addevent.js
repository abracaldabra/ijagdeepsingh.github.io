//Filename: views/addevent.js
define(['text!templates/addevent.html'], function(template) {
  var AddEventView = Backbone.View.extend({
    el: $('.add-event-view'),
    // Cache the templates
    template: _.template(template),
    events: {
      'click button#create-event': 'create'
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    create: function() {
      // Check if summary is empty
      if ($('#summary').val() === "") {
        $('#summary').parent().addClass('error');
        $('#summary').focus();
        return false;
      }
      // Clear previous error
      if ($('#summary').parent().hasClass('error')) {
        $('#summary').parent().removeClass('error');
      }
      // Get all inputs
      var summary, priority, time;
      summary = $('#summary').val();
      priority = $('input[name=priority]:checked').val();
      time = $('input[name=time]:checked').val();
      console.log(summary + ":" + priority + ":" + time);

      // Now get free/busy time


    }
  });
  return AddEventView;
});