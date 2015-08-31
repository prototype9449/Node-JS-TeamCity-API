var Enumerable = require('../linq/linq.min');
require("../linq/extensions/linq.qunit")({'Enumerable': Enumerable});

var ObjectStorage = function (name) {
    this.objects = [];
    this.name = name;

    this.clone = function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    };

    this.getObjectById= function(id, self) {
        var object = {};

        self.objects.map(function (item) {
            if (item.id == id) {
                object = item;
            }
        });
        if (!object) {
            throw new Error('There is not that id');
        }

        return object;
    };

    this.getSpliceArray = function (array, number) {
        if (!number) return array;

        if (array.length > number) {
            return array.slice(0, number);
        } else {
            return array;
        }
    };

    this.pushObjects = function (objects) {
        var self = this;
        var objectIds = Enumerable.from(objects).select('$.id').toArray();
        objectIds.sort(function (id1, id2) {
            return id2 - id1;
        });
        var queryBuildsForChange = Enumerable.from(self.objects).where(function (item) {
            return objectIds.indexOf(item.id) != -1
        });

        var objectIdsForChange = queryBuildsForChange.select('$.id').toArray();
        var objectsForChange = queryBuildsForChange.toArray();
        var objectsForAdding = Enumerable.from(objects).where(function (item) {
            return objectIdsForChange.indexOf(item.id) == -1
        }).toArray();
        var notChangedObjects = Enumerable.from(self.objects).where(function (item) {
            return objectIds.indexOf(item.id) == -1
        }).toArray();

        for (var i = 0; i < objectsForChange.length; i++) {
            var index = objectIds.indexOf(objectsForChange[i].id);
            objectsForChange[i] = objects[index];
        }

        var resultObjects = [].concat(objectsForAdding, objectsForChange, notChangedObjects);

        resultObjects.sort(function (item1, item2) {
            return item2.id - item1.id;
        });
        self.objects = resultObjects;
    };

    this.get = function (number) {
        var result = {};
        result[this.name] = this.getSpliceArray(this.objects, number);

        return result;
    };

    this.getById = function (id) {
        var result = {};
        result[this.name] = [this.clone(this.getObjectById(id, this))];

        return result;
    };
};

module.exports.ObjectStorage = ObjectStorage;