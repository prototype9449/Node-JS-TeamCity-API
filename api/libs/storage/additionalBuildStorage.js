var baseStorage = require('./baseStorage').ObjectStorage;

var AdditionalBuildStorage = function () {
    this.__proto__ = new baseStorage("additionalBuilds");
    var self = this;

    this.pushBuilds = function (builds) {
        self.pushObjects(builds);
    };

    this.getAdditionalBuilds = function (number) {
        return self.get(number);
    };

    this.getBuildById = function (id) {
        return self.getById(id);
    };
};

module.exports.AdditionalBuildStorage = AdditionalBuildStorage;