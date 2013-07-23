'use strict';

App.Focusable = Ember.Mixin.create({
    focused: false,
    focusIn: function(event) {
        return this.set('focused',true)
    },
    focusOut: function(event) {
        return this.set('focused',false)
    }
});

App.AsyncValidation = Ember.Mixin.create({
    valid: function() {
        var value,
        _this = this;

        if (this.get('focused')) {
            this.set('code', '');
            return this.set('message', '');
        } else {
            value = this.get('value');
            return this.validate(value, function(code, message) {
                if (value === _this.get('value') && !_this.get('focused')) {
                    _this.set('code', code);
                    return _this.set('message', message);
                }
            });
        }
    }.observes('focused'),
    validate: function(value, next) {
        return next('',"")
    }
});

App.TextField = Ember.View.extend(App.Focusable, App.AsyncValidation, {
    classNames: ['control-group'],
    type: 'text',
    value: '',
    placeholder: '',
    code: '',
    classNameBindings: ['code'],
    message: '',
    template: Ember.Handlebars.compile("<div class=\"controls\" >\n{{view Ember.TextField\nplaceholderBinding = \"view.placeholder\"\nvalueBinding = \"view.value\"\ntypeBinding = \"view.type\"\n  }}\n <span class=\"help-inline\">{{view.message}}</span>\n</div>")
});

App.ValidateTextField = App.TextField.extend({
    validate: function(value, status) {
        if (value.length === 0) {
            return status('error', "Please enter a value.");
        } else {
            return status('success', "Ok.");
        }
    }
});

App.HostUrlField = App.TextField.extend({
    placeholder: "IP Address",
    validate: function(value, status) {
        if (value.length === 0) {
            return status('error', "Please enter a valid url");
        } else {
            status('loading',"One moment while we check the adress.");
            console.log(value);
            var client = new XenAPI('','',value);
            return client.init(function(error, result) {
                if(error) {
                    status('error',"Host could not be found");
                } else {
                    status('success',"Found XENAPI instance!");
                }
            });
        }
    }
});
