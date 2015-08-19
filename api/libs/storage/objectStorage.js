var ObjectStorage = function () {
    this.agents = [];
    this.builds = [];
    var self = this;

    var clone = function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    };

    this.pushAgents = function (agents) {
        self.agents = agents;
    };

    this.pushBuilds = function (builds) {
        self.builds = [].concat(builds,self.builds);
    };

    var getSpliceArray = function (array, number) {
        if (!number) return array;

        if (array.length > number) {
            return array.slice(0, number);
        }
    };

    this.getAgents = function (number) {
        var result = getSpliceArray(self.agents, number);
        return {agents: result};
    };

    this.getBuilds = function (number) {
        var result = getSpliceArray(self.builds, number);
        return {builds: result};
    };

    function getObjectById(id, objectType) {
        var object;

        self[objectType].map(function (item) {
            if (item.id == id) {
                object = item;
            }
        });
        if (!object) {
            throw new Error('There is not that id');
        }

        return object;
    }

    this.getBuildById = function (id) {
        return {build: [clone(getObjectById(id, 'builds'))]};
    };

    this.getBuildHistoryById = function (id) {
        var mainBuild = clone(getObjectById(id, 'builds'));
        var buildsOfConfiguration = [];
        self.builds.map(function (build) {
            if (build.build.configuration.id == mainBuild.build.configuration.id) {
                buildsOfConfiguration.push(build);
            }

        });
        return {builds: buildsOfConfiguration};
    };

    this.getAgentById = function (id) {
        return {agent: [clone(getObjectById(id, 'agents'))]};
    };

    this.getAgentHistoryById = function (id) {
        var buildsOfAgent = [];
        self.builds.map(function (build) {
            if (build.agent.id == id) {
                buildsOfAgent.push(build);
            }
        });

        return {builds: buildsOfAgent};
    };
};

module.exports.ObjectStorage = ObjectStorage;