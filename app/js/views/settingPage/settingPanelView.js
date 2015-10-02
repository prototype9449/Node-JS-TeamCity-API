window.SettingPanelView = ObjectView.extend({

    events: {
        "submit  #settings-form": "settingSubmitEventHandler"
    },

    settingSubmitEventHandler: function (e) {
        e.preventDefault();

        var handler = this.model.handleSettingSubmit;

        if (handler)
            handler.call(this.model);
    },

    renderChange: function () {
        var model = this.model.getModel();
        var html = this.template(model);
        if (!html)  return this;

        $(this.el).html(html);
        $(this.el).find('.selectpicker').selectpicker();

        this.rivets = rivets.bind($(this.el).find("#settings-form"), {currentSetting: this.model.get('currentSetting')});

        return this;
    }
});