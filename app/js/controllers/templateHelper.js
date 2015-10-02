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


var getClassesByStatus = function(status) {
    switch (status) {
        case 'running':
            return "arrow-processing-icon";
        case 'failure':
            return "glyphicon glyphicon-remove-circle";
        case 'success':
            return "glyphicon glyphicon-ok-circle";
        case 'cancelled':
            return "glyphicon glyphicon-ban-circle";
        default:
           return "";
    }
};


var getNewConnectionStatus = function(status) {
    switch (status) {
        case 'running':
            return "Option sending!";
        case 'failure':
            return "Wrong!";
        case 'success':
            return "Option sent successfully!";
        default:
            return "";
    }
};

var getNewConnectionClass = function(status) {
    switch (status) {
        case 'running':
            return "status-panel-running";
        case 'failure':
            return "status-panel-error";
        case 'success':
            return "status-panel-success";
        default:
            return "";
    }
};

