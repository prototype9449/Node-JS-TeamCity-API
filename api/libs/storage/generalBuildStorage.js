var baseStorage = require('./baseStorage').ObjectStorage;

var GeneralBuildStorage = function (maxCount) {
    this.__proto__ = new baseStorage("builds");
    this.maxCount = maxCount;
    var self = this;

    this.getBuilds = function (number) {
        return self.getObjects(number);
    };

    this.getBuildById = function (id) {
        return self.getById(id);
    };

    this.pushObjects = function (objects) {
        var indexes = new Array(objects.length);

        objects.forEach(function (object) {
            for (var i = 0; i < self.objects.length; i++) {
                if (self.objects[i].id == object.id) {
                    indexes[i] = object;
                }
            }
        });

        for (var i = 0; i < indexes.length; i++) {
            if (indexes[i]) {
                self.objects[i] = indexes[i];
            } else {
                self.objects.push(objects[i])
            }
        }

        self.objects.sort(function (first, second) {
            return second.id - first.id;
        });
        self.objects = self.objects.slice(0, self.maxCount);
    };

    this.getBuildHistoryById = function (id) {
        var mainBuild = self.clone(self.getObjectById(id, this));
        var result = {builds: []};
        if(!mainBuild.build) return result;

        self.objects.map(function (build) {

            if (build.build.configuration.id == mainBuild.build.configuration.id) {
                result.builds.push(build);
            }

        });
        return result;
    };

    this.getAgentHistoryById = function (id) {
        var buildsOfAgent = [];
        self.objects.map(function (build) {
            if (build.agent.id == id) {
                buildsOfAgent.push(build);
            }
        });

        return {builds: buildsOfAgent};
    };
};

module.exports.BuildStorage = GeneralBuildStorage;