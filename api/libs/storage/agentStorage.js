var baseStorage = require('./baseStorage').ObjectStorage;

var AgentStorage = function (buildProvider) {
    this.buildProvider = buildProvider;
    this.__proto__ = new baseStorage("agents");
    var self = this;

    var getRunningBuildByAgent = function (agentId, buildProvider) {
        for (var i = 0; i < buildProvider.objects.length; i++) {
            if (buildProvider.objects[i].build.status == 'running' && buildProvider.objects[i].agent.id == agentId) {
                return buildProvider.objects[i];
            }
        }
    };

    this.pushObjects = function(agents){
        this.objects = agents;
    };

    this.getAgents = function (number) {
        var agents = self.getSpliceArray(self.objects, number);
        if (!agents) return {agents: []};

        var resultAgents = [];
        for (var i = 0; i < agents.length; i++) {
            var agent = self.clone(agents[i]);
            var currentRunningBuild = getRunningBuildByAgent(agent.id, self.buildProvider);
            if (currentRunningBuild) {
                agent.currentTask = currentRunningBuild.build.configuration.name;
            } else {
                agent.currentTask = 'empty';
            }
            resultAgents.push(agent);
        }
        return {agents: resultAgents};
    };

    this.getAgentById = function (id) {
        var objects = self.getById(id);
        var agent = objects.agents[0];
        var currentRunningBuild = getRunningBuildByAgent(agent.id, self.buildProvider);
        if (currentRunningBuild) {
            agent.currentTask = currentRunningBuild.build.configuration.name;
        } else {
            agent.currentTask = 'empty';
        }
        return objects;
    };

};

module.exports.AgentStorage = AgentStorage;