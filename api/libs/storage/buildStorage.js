var baseStorage = require('./baseStorage').ObjectStorage;

var GeneralBuildStorage = function () {
    this.__proto__ = new baseStorage("generalBuilds");
    var self = this;

    this.pushBuilds = function (builds) {
        self.pushObjects(builds);
    };

    this.getGeneralBuilds = function (number) {
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

module.exports.GeneralBuildStorage = GeneralBuildStorage;