window.NewConnectionPanelView = ObjectView.extend({

    events: {
        "submit  #connection-form": "connectionSubmitEventHandler"
    },

    connectionSubmitEventHandler: function (e) {
        e.preventDefault();
        $(this).trigger('reset');

        var object = {};
        var arrayData = $(this.el).find('#connection-form').serializeArray();
        arrayData.map(function(value){
            object[value.name] = value.value;
        });

        var handler = this.model.settings.handleConnectionSubmit;
        if (handler)
            handler.call(this.model.settings, object);
    },

    render: function () {
        var html = this.template();
        if (!html)  return this;

        $(this.el).html(html);

        return this;
    }
});