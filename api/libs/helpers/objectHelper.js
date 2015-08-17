function ObjectHelper(name, getObjects, config) {
    this.htmlGenerator = require('./../htmlGenerator');
    this.config = config;
    this.getObjects = getObjects;
    this.count = 0;
    this.objectsFromMemory = null;
    this.name = name;

    this.generateNewObjects = function (callback, number) {
        var dataFromStorage = this.getObjects(number);
        var objectsFromStorage = dataFromStorage[this.name];
        if (!objectsFromStorage) return;

        var newObjects = [];
        if (this.objectsFromMemory) {
            var stringObjectsFromMemory = this.objectsFromMemory.map(function (item) {
                return JSON.stringify(item)
            });
            var stringObjectsFromStorage = objectsFromStorage.map(function (item) {
                return JSON.stringify(item)
            });


            var addToArrayById = function () {
                return function (array, item) {
                    var flag = {
                        add: true,
                        index: -1
                    };
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == item.id) {
                            flag.add = false;
                            flag.index = i;
                        }
                    }
                    if (flag.add) {
                        array.unshift(item);
                    } else {
                        array[flag.index] = item;
                    }
                }
            }();

            for (var i = 0; i < objectsFromStorage.length; i++) {
                if (stringObjectsFromMemory.indexOf(stringObjectsFromStorage[i]) == -1) {
                    addToArrayById(newObjects,objectsFromStorage[i])
                    addToArrayById(this.objectsFromMemory,objectsFromStorage[i])
                }
            }
        }
        else {
            newObjects = objectsFromStorage;
            this.objectsFromMemory = newObjects;
        }

        newObjects.sort(function (item1, item2) {
            return item2.id - item1.id;
        });
        this.objectsFromMemory.sort(function (item1, item2) {
            return item2.id - item1.id;
        });

        if (number)
            this.objectsFromMemory.splice(number, this.objectsFromMemory.length);

        var templatePath = this.config.options.pageHtmlTemplatePath;
        var result = {};
        result[this.name] = newObjects;
        this.htmlGenerator.generateHtmlFromJson(result, templatePath, callback);
    };
}

module.exports = ObjectHelper;
