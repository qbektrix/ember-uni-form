App.HandlesValidationErrorsForInputs = Ember.Mixin.create({

  errors: [],
  showError: false,

  syncErrors: function () {
    if (this.get('isDestroyed')) return;
    this.set('errors', this.get('parentModel.errors.' + this.get('name')));
  },

  observeErrors: function () {
    if (!this.get('parentModel')) return;
    this.get('parentModel').addObserver('errors.' + this.get('name'), this, this.syncErrors);
  }.on('didInsertElement'),

  errorVisibilityForModel: function () {
    var parentModel = this.get('parentModel');
    if (this.get('showError')) {
      parentModel.trigger('shouldShowValidationError', this.get('name'));
    } else {
      parentModel.trigger('shouldDismissValidationError', this.get('name'));
    }
  }.observes('showError', 'name')

});