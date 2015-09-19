window.NewConnectionPanelView = ObjectView.extend({

    events: {
        "submit  #connection-form": "connectionSubmitEventHandler"
    },

    connectionSubmitEventHandler: function (e) {
        e.preventDefault();

        var handler = this.model.handleConnectionSubmit;
        if (handler)
            handler.call(this.model);
    },

    render: function () {
        var html = this.template();
        if (!html)  return this;

        $(this.el).html(html);
        this.rivets = rivets.bind($(this.el).find("#connection-form"), {object: this.model.get('object')});

        return this;
    }
});