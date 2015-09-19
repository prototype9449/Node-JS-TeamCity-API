window.NewConnectionPanelView = ObjectView.extend({

    events: {
        "submit  #connection-form": "connectionSubmitEventHandler"
    },

    connectionSubmitEventHandler: function (e) {
        e.preventDefault();
        $(this).trigger('reset');

        var handler = this.model.handleConnectionSubmit;
        if (handler)
            handler.call(this.model, this.model.get('object'));
    },

    render: function () {
        var html = this.template();
        if (!html)  return this;

        $(this.el).html(html);
        this.rivets = rivets.bind($(this.el).find("#connection-form"), {object: this.model.get('object')});

        return this;
    }
});