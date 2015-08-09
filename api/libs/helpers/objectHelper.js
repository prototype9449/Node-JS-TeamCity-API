function ObjectHelper(name, config) {
    this.generator = require('./../htmlGenerator');
    this.config = config;
    this.count = 0;
    this.data = null;
    this.name = name;
}

ObjectHelper.prototype.getNew = function (callback) {
    var options = this.config.connection;
    var instance = this;

    instance.generator.getJson(options, function (data) {
        var objects = data[instance.name];

        if (instance.count === objects.length)
            return;
        var i = instance.count;
        instance.count = objects.length;
        if (instance.data === null)
            instance.data = objects;
        var jsonObjects = [];
        for (i; i < objects.length; i++) {
            var currentObject = objects[i];
            jsonObjects.push(currentObject);
        }
        var templatePath = instance.config.options.pageHtmlTemplatePath;
        var result = {};
        result[instance.name] = jsonObjects;
        instance.generator.generateHtmlFromJson(result, templatePath, callback);
    });
};

ObjectHelper.prototype.getUpdate = function (callback) {
    var jsondiff = require('jsondiffpatch');
    var options = this.config.connection;
    var instance = this;

    instance.generator.getJson(options, function (jsonData) {
            var objects = jsonData[instance.name];
            if (instance.count === 0)
                return;

            var jsonObjects = [];
            for (var i = 0; i < instance.count; i++) {
                var newObject = objects[i];
                var oldObject = instance.data[i];
                var delta = jsondiff.diff(oldObject, newObject);
                if (delta != null)
                    jsonObjects.push(newObject);
            }

            instance.data = objects;
            if (jsonObjects.length === 0)
                return;
            var templatePath = instance.config.options.pageHtmlTemplatePath;
            var result = {};
            result[instance.name] = jsonObjects;
            instance.generator.generateHtmlFromJson(result, templatePath, callback);
        }
    );
};

function objectHelperProvider(name, config) {
    return new ObjectHelper(name, config);
}

module.exports = objectHelperProvider;