window.UrlSettingView = ObjectView.extend({

    events: {
        "change #url-selector": "urlChangeEventHandler"
    },

    urlChangeEventHandler: function (event) {
        var handler = this.model.handleUrlChanging;

        var objects = event.target.value.split(' ');
        var result = {
            url: objects[0],
            user: objects[1]
        };

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