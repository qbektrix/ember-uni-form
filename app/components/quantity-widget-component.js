
var DEFAULT_MIN = 1;
var DEFAULT_MAX = 3;
var SHOW_MESSAGE_DURATION = 1500;

App.QuantityWidgetComponent = Ember.Component.extend({

  tagName: 'div',
  classNames: [ 'quantity-widget' ],
  classNameBindings: [ 'isDirty', 'isMin', 'isMax', 'isRemoved' ],
  attributeBindings: [ 'name:data-icon' ],
  quantityDidChange: 'quantityDidChange',
  showRemoveControl: false,
  quantityString: 'Qty. %@',

  initial: Ember.computed.oneWay('quantity'),
  quantity: DEFAULT_MIN,
  max: DEFAULT_MAX,
  min: DEFAULT_MIN,

  trackedActions: {
    increment: true,
    decrement: true
  },

  actions: {
    plusIcon: function () {
      this.send('increment');
    },

    minusIcon: function () {
      this.send('decrement');
    },

    removeIcon: function () {
      this.set('quantity', 0);
    },

    increment: function () {
      this.clearMessage();
      if (this.get('isMax')) return this.setMessage('%@ max'.fmt(this.get('quantity')));
      this.incrementProperty('quantity');
    },

    decrement: function () {
      this.clearMessage();
      if (this.get('isMin') && !this.get('showRemoveControl')) return;
      this.decrementProperty('quantity');
    }
  },

  clearMessage: function () {
    Ember.run.cancel(this.clearMessageTimer);
    this.set('showMessage', false);
  },

  isDirty: function () {
    return this.get('initial') !== this.get('quantity');
  }.property('quantity'),

  isMin: function () {
    return this.get('quantity') <= this.get('min');
  }.property('quantity'),

  isMax: function () {
    return this.get('quantity') >= this.get('max');
  }.property('quantity'),

  isRemoved: function () {
    return this.get('quantity') === 0;
  }.property('quantity'),

  setMessage: function (msg) {
    this.set('message', msg);
    this.set('showMessage', true);
    this.clearMessageTimer = Ember.run.later(this, function () {
      this.set('showMessage', false);
    }, SHOW_MESSAGE_DURATION);
  },

  onQuantityChange: function () {
    this.sendAction('quantityDidChange', this.get('trackedModel'), this.get('quantity'));
  }.observes('quantity'),

  showRemove: function () {
    return (this.get('showRemoveControl') && this.get('isMin'));
  }.property('isMin', 'quantity'),

  quantityText: function () {
    return this.get('quantityString').fmt(this.get('quantity'));
  }.property('quantityString', 'quantity')


});
