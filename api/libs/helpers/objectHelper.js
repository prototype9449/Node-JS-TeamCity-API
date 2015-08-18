function ObjectHelper(name, getObjects) {
    this.getObjects = getObjects;
    this.count = 0;
    this.objectsFromMemory = null;
    this.name = name;

    var selectNewObjects = function (self, objectsFromStorage) {
        var newObjects = [];
        if (self.objectsFromMemory) {
            var stringObjectsFromMemory = self.objectsFromMemory.map(function (item) {
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
                    addToArrayById(newObjects, objectsFromStorage[i]);
                    addToArrayById(self.objectsFromMemory, objectsFromStorage[i])
                }
            }
        }
        else {
            newObjects = objectsFromStorage;
            self.objectsFromMemory = newObjects;
        }
        return newObjects;
    };

    this.generateNewObjects = function (callback, number) {
        var dataFromStorage = this.getObjects(number);
        var objectsFromStorage = dataFromStorage[this.name];
        if (!objectsFromStorage) return;

        var newObjects = selectNewObjects(this, objectsFromStorage);

        if (newObjects.sort)
            newObjects.sort(function (item1, item2) {
                return item2.id - item1.id;
            });
        if (this.objectsFromMemory.sort)
            this.objectsFromMemory.sort(function (item1, item2) {
                return item2.id - item1.id;
            });
        if(!newObjects.length) return;

        if (number)
            this.objectsFromMemory.splice(number, this.objectsFromMemory.length);

        callback(newObjects);
    };
}

module.exports = ObjectHelper;
