var generateObjects = require('./../providers/objectProvider').generateObjects;
var jsondiff = require('jsondiffpatch');

function ObjectHelper(name, getObjects, config) {
    this.htmlGenerator = require('./../htmlGenerator');
    this.config = config;
    this.getObjects = getObjects;
    this.count = 0;
    this.data = null;
    this.name = name;


    this.getNew = function (callback, number) {
        console.time('getNew');
        var instance = this;
        var htmlGenerator = instance.htmlGenerator;

        var jsonData = instance.getObjects();
        if(!jsonData) return;

        var objects = jsonData[instance.name];

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
        console.timeEnd('getNew');
        htmlGenerator.generateHtmlFromJson(result, templatePath, callback);
    };

    this.getUpdate = function (callback, number) {
        console.time('getUpdate');

        var instance = this;
        var htmlGenerator = instance.htmlGenerator;

        var jsonData = this.getObjects();
        if(!jsonData) return;

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
        console.timeEnd('getUpdate');
        htmlGenerator.generateHtmlFromJson(result, templatePath, callback);
    };
}

module.exports = ObjectHelper;
