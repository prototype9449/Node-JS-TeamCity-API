window.SettingsPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('SettingsPageView has been created');
        this.template = _.template(tpl.get('settingsPage'));

        this.settingsView = {};
    },

    render: function () {
        $(this.el).html(this.template());

        this.settingsView = new ObjectView({model : this.model.settings, router: this.options.router});
        this.$('#settings-info').html(this.settingsView.render().el);
        this.settingsView.delegateEvents();

        return this;
    }
});
