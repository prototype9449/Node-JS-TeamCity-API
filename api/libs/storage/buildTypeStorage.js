var baseStorage = require('./baseStorage').ObjectStorage;

var BuildTypeStorage = function () {
    this.__proto__ = new baseStorage("buildTypes");
    var self = this;

    this.getBuildTypes = function (number) {
        return self.getObjects(number);
    };

    this.pushObjects = function(buildTypes){
        self.objects = buildTypes;
    };

    this.getBuildTypeById = function (id) {
        return self.getById(id);
    };
};

module.exports.BuildTypeStorage = BuildTypeStorage;