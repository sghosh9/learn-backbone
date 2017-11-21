$(function () {
  var Service = Backbone.Model.extend({
    defaults: {
      title: 'My service',
      price: 100,
      checked: false
    },
    toggle: function() {
      console.log('Service.toggle');
      this.set('checked', !this.get('checked'));
    }
  });
  var ServiceList = Backbone.Collection.extend({
    model: Service,
    getChecked: function() {
      console.log('ServiceList.getChecked');
      return this.where({checked:true});
    }
  });

  var services = new ServiceList([
    new Service({title: 'Drupal', price: 550}),
    new Service({title: 'CSS', price: 900}),
    new Service({title: 'Git', price: 275}),
  ]);

  var ServiceView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click': 'toggleService'
    },
    initialize: function() {
      console.log('ServiceView.initialize');
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      console.log('ServiceView.render');
      console.log(this.$el);
      this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '"/> ' + this.model.get('title') + ' <span>' + this.model.get('price') + '/-</span>');
      this.$('input').prop('checked', this.model.get('checked'));
      return this;
    },
    toggleService: function() {
      console.log('ServiceView.toggleService');
      this.model.toggle();
    }
  });

  var App = Backbone.View.extend({
    el: $('#main'),
    initialize: function() {
      console.log('app.initialize');
      this.total = $('#total span');
      this.list = $('#services');
      this.listenTo(services, 'change', this.render);
      services.each(function(service) {
        var view = new ServiceView({model: service});
        this.list.append(view.render().el);
      }, this);
      console.log(this.list);
    },
    render: function() {
      console.log('app.render');
      var total = 0;
      console.log(services.getChecked());
      _.each(services.getChecked(), function(elem) {
        total += elem.get('price');
      });
      this.total.text(total + '/-');
      return this;
    },
  });

  new App;
});
