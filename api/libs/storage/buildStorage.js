var baseStorage = require('./baseStorage').ObjectStorage;
var Enumerable = require('../linq/linq.min');
require("../linq/extensions/linq.qunit")({'Enumerable': Enumerable});

var BuildStorage = function () {
    this.__proto__ = new baseStorage("builds");
    var self = this;

    this.pushBuilds = function (builds) {
        var buildIds = Enumerable.from(builds).select('$.id').toArray();
        buildIds.sort(function (id1, id2) {
            return id2 - id1;
        });
        var queryBuildsForChange = Enumerable.from(self.objects).where(function (item) {
            return buildIds.indexOf(item.id) != -1
        });

        var buildIdsForChange = queryBuildsForChange.select('$.id').toArray();
        var buildsForChange = queryBuildsForChange.toArray();
        var buildsForAdding = Enumerable.from(builds).where(function (item) {
            return buildIdsForChange.indexOf(item.id) == -1
        }).toArray();
        var notChangedBuilds = Enumerable.from(self.objects).where(function (item) {
            return buildIds.indexOf(item.id) == -1
        }).toArray();

        for (var i = 0; i < buildsForChange.length; i++) {
            var index = buildIds.indexOf(buildsForChange[i].id);
            buildsForChange[i] = builds[index];
        }

        var resultBuilds = [].concat(buildsForAdding, buildsForChange, notChangedBuilds);

        resultBuilds.sort(function (item1, item2) {
            return item2.id - item1.id;
        });
        self.objects = resultBuilds;
    };

    this.getBuilds = function (number) {
        return self.get(number);
    };

    this.getBuildById = function (id) {
        return self.getById(id);
    };

    this.getBuildHistoryById = function (id) {
        var mainBuild = self.clone(self.getObjectById(id, this));
        var buildsOfConfiguration = [];
        self.objects.map(function (build) {
            if (build.build.configuration.id == mainBuild.build.configuration.id) {
                buildsOfConfiguration.push(build);
            }

        });
        return {builds: buildsOfConfiguration};
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

module.exports.BuildStorage = BuildStorage;