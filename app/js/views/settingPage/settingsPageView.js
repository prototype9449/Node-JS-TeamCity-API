window.SettingsPageView = Backbone.View.extend({

    tagName: 'div',

    events: {
        'click #hide-new-connection-button': 'toggleState'
    },
    toggleState : function()
    {
        $(this.newConnectionView.el).parent().toggle();
    },

    initialize: function () {
        console.log('SettingsPageView has been created');
        this.template = _.template(tpl.get('settingsPage'));

        this.settingsView = {};
        this.currentUrlView = {};
        this.newConnectionView = {};
    },

    render: function () {
        $(this.el).html(this.template());

        this.newConnectionView = new NewConnectionPanelView({model : this.model.connectionSetting, router: this.options.router});
        this.$('#new-teamcity-connection-settings-panel').html(this.newConnectionView.render().el);
        this.newConnectionView.delegateEvents();
        $(this.newConnectionView.el).parent().hide();

        this.settingsView = new SettingPanelView({model : this.model.settings, router: this.options.router});
        this.$('#settings-panel').html(this.settingsView.render().el);
        this.settingsView.delegateEvents();

        this.currentUrlView = new UrlSettingView({model : this.model.urlSettings, router: this.options.router});
        this.$('#setting-selected-url-panel').html(this.currentUrlView.render().el);
        this.currentUrlView.delegateEvents();

        return this;
    }
});
