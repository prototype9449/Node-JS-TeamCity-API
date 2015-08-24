var Enumerable = require('../linq/linq.min');
require("../linq/extensions/linq.qunit")({'Enumerable': Enumerable});

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
        var buildIds = Enumerable.from(builds).select('$.id').toArray();
        buildIds .sort(function(id1, id2) { return id2 - id1;});
        var queryBuildsForChange = Enumerable.from(self.builds).where(function(item) { return buildIds.indexOf(item.id) != -1});

        var buildIdsForChange = queryBuildsForChange.select('$.id').toArray();
        var buildsForChange = queryBuildsForChange.toArray();
        var buildsForAdding = Enumerable.from(builds).where(function(item) { return buildIdsForChange.indexOf(item.id) == -1}).toArray();
        var notChangedBuilds = Enumerable.from(self.builds).where(function(item) { return buildIds.indexOf(item.id) == -1}).toArray();

        for(var i = 0; i < buildsForChange.length; i++){
            var index = buildIds.indexOf(buildsForChange[i].id);
            buildsForChange[i] = builds[index];
        }

        var resultBuilds = [].concat(buildsForAdding, buildsForChange, notChangedBuilds);

        resultBuilds.sort(function(item1, item2) { return item2.id - item1.id;});
        self.builds = resultBuilds;
    };

    var getSpliceArray = function (array, number) {
        if (!number) return array;

        if (array.length > number) {
            return array.slice(0, number);
        } else {
            return array;
        }
    };

    var getRunningBuildByAgent = function (agentId, self) {
        for (var i = 0; i < self.builds.length; i++) {
            if (self.builds[i].build.state == 'running' && self.builds[i].agent.id == agentId) {
                return self.builds[i];
            }
        }
    };

    this.getAgents = function (number) {
        var agents = getSpliceArray(self.agents, number);
        if (!agents) return {agents: []};

        var resultAgents = [];
        for (var i = 0; i < agents.length; i++) {
            var agent = clone(agents[i]);
            var currentRunningBuild = getRunningBuildByAgent(agent.id, self);
            if (currentRunningBuild) {
                agent.currentTask = currentRunningBuild.build.configuration.name;
            } else {
                agent.currentTask = 'empty';
            }
            resultAgents.push(agent);
        }
        return {agents: resultAgents};
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
        var agent = clone(getObjectById(id, 'agents'));

        return {agent: [agent]};
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