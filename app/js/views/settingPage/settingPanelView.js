window.SettingPanelView = ObjectView.extend({

    events: {
        "submit  #settings-form": "settingSubmitEventHandler"
    },

    settingSubmitEventHandler: function (e) {
        e.preventDefault();

        var arrayData = $(this.el).find('#settings-form').serializeArray();
        var urlData = $('#url-selector').val().split(' ');
        var key = {
            url: urlData[0],
            userName: urlData[1]
        };
        var agentFixBuilds = arrayData.map(function (value) {
            return {
                agentName: value.name,
                buildTypeId: value.value
            }
        });

        var result = {
            url: key.url,
            userName: key.userName,
            agentFixBuilds: agentFixBuilds
        };

        var handler = this.model.handleSettingSubmit;
        if (handler)
            handler.call(this.model, result);
    },

    renderChange: function () {
        var html = this.template(this.model.get("object"));
        if (!html)  return this;

        $(this.el).html(html);
        $(this.el).find('.selectpicker').selectpicker();

        return this;
    }
});