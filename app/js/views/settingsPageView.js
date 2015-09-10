window.SettingsPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('SettingsPageView has been created');
        this.template = _.template(tpl.get('settingsPage'));

        this.settingsView = {};
        this.currentUrlView = {};
    },

    render: function () {
        $(this.el).html(this.template());
        this.bindEventToButton();

        this.settingsView = new ObjectView({model : this.model.settings, router: this.options.router});
        this.$('#settings-info').html(this.settingsView.render().el);
        this.settingsView.delegateEvents();

        this.currentUrlView = new ObjectView({model : this.model.currentUrl, router: this.options.router});
        this.$('#setting-selected-url-panel').html(this.currentUrlView.render().el);
        this.currentUrlView.delegateEvents();

        return this;
    },

    bindEventToButton : function() {
        var self = this;
        $(this.el).find('#connection-form').submit(function(event){
            var object = {};
            $(this).find('input').each(function(index, value){
                object[($(value).attr('name'))] = $(value).val();
            });
            self.options.router.socket.emit('new authentication', object);
            event.preventDefault();
        });
    }
});
