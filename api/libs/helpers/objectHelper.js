function ObjectHelper(name, getObjects, config) {
    this.htmlGenerator = require('./../htmlGenerator');
    this.config = config;
    this.getObjects = getObjects;
    this.count = 0;
    this.objects = null;
    this.name = name;

    this.generateNewObjects = function (callback, number) {
        var dataFromStorage = this.getObjects(number);
        var objectsFromStorage = dataFromStorage[this.name];
        if (!objectsFromStorage) return;

        var newObjects = [];
        if (this.objects) {
            var stringObjects = this.objects.map(function (item) {
                return JSON.stringify(item)
            });
            var stringObjectsFromStorage = objectsFromStorage.map(function (item) {
                return JSON.stringify(item)
            });

            for (var i = 0; i < objectsFromStorage.length; i++) {
                if (stringObjects.indexOf(stringObjectsFromStorage[i]) == -1) {
                    newObjects.push(objectsFromStorage[i]);
                    this.objects.unshift(objectsFromStorage[i]);
                }
            }
        }
        else {
            newObjects = objectsFromStorage;
            this.objects = newObjects;
        }

        newObjects.sort(function (item1, item2) {
            return item2.id - item1.id;
        });
        this.objects.sort(function (item1, item2) {
            return item2.id - item1.id;
        });

        if (number)
            this.objects.splice(number, this.objects.length);

        var templatePath = this.config.options.pageHtmlTemplatePath;
        var result = {};
        result[this.name] = newObjects;
        this.htmlGenerator.generateHtmlFromJson(result, templatePath, callback);
    };
}

module.exports = ObjectHelper;
