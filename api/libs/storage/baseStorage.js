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

    this.push = function (objects) {
        this.objects = objects;
    };

    this.get = function (number) {
        var result = {};
        result[this.name] = this.getSpliceArray(this.objects, number);

        return result;
    };

    this.getById = function (id) {
        var result = this.clone(this.getObjectById(id, this));

        return result;
    };
};

module.exports.ObjectStorage = ObjectStorage;