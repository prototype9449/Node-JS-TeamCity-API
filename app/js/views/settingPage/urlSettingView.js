window.UrlSettingView = ObjectView.extend({

    events: {
        "change #url-selector": "urlChangeEventHandler"
    },

    urlChangeEventHandler: function (e) {
        e.preventDefault();

        var handler = this.model.handleUrlChanging;

        if (handler)
            handler.call(this.model);
    },

    renderChange: function () {
        var html = this.template(this.model.get("object"));
        if (!html)  return this;

        $(this.el).html(html);
        $(this.el).find('.selectpicker').selectpicker();

        this.rivets = rivets.bind($(this.el).find("#url-selector"), {currentUrl: this.model.get('currentUrl')});

        return this;
    }
});