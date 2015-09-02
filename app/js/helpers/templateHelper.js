tpl = {
    templates: {},

    loadTemplates: function (templateDetails, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = templateDetails[index].name;
            var path = templateDetails[index].path;
            console.log('Loading template: ' + name);
            $.get(path + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < templateDetails.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        };

        loadTemplate(0);
    },

    get: function (name) {
        return this.templates[name];
    }
};