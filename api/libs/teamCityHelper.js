function TeamCityHelper(configName) {
    this.generator = require('./htmlGenerator');
    this.config = require('./config').get(configName);
    this.currentData = null;
    this.previousData = null;
}

TeamCityHelper.prototype.getNew = function (callback) {
    var options = this.config.connection;
    var instance = this;

    instance.generator.generatorHelper.getJson(options, function (jsonData) {
        var templatePath = instance.config.options.pageHtmlTemplatePath;
        instance.generator.generatorHelper.generateHtmlFromJson(jsonData, templatePath, callback);
    });
};

TeamCityHelper.prototype.getUpdate = function (callback) {
    var options = this.config.connection;
    var instance = this;

    instance.generator.generatorHelper.getJson(options, function (jsonData) {
        //TODO разобрать json и оставить только новое
        if(instance.currentData == null){
            instance.currentData = jsonData;
            //var temp = JSON.stringify(jsonData);
            var templatePath = instance.config.options.pageHtmlTemplatePath;
            instance.generator.generatorHelper.generateHtmlFromJson(jsonData, templatePath, function (htmlData) {
                callback(htmlData);
            });
        }
        else{
            instance.previousData = instance.currentData;

            if(instance.currentData.build != undefined){
                for(var i = 0; i < jsonData.build.length; i++){
                    if(i % 3 == 0){
                        var jsonItem = jsonData.build[i];
                        var randomState = Math.floor(Math.random() * (125 - 30 + 1) + 30);
                        jsonItem.state = randomState;
                    }
                }
                instance.currentData = jsonData;
                console.log("(instance.previousData) != null");
                var newBuildsInfo = [];
                if(instance.currentData != instance.previousData){
                    console.log("instance.currentData != instance.previousData");
                    for(var j = 0; j < instance.currentData.build.length; j++){
                        if(instance.currentData.build[j].state != instance.previousData.build[j].state){
                            console.log(instance.currentData.build[j].state + " | " + instance.previousData.build[j].state);
                            newBuildsInfo.push(instance.currentData.build[j]);
                        }
                    }
                }
                var newBuildsInfoJson = {"count": newBuildsInfo.length,"href":"/rest/agents","build": newBuildsInfo};
                var templatePath = instance.config.options.pageHtmlTemplatePath;
                instance.generator.generatorHelper.generateHtmlFromJson(newBuildsInfoJson, templatePath, callback);
            }
        }
    });
};

module.exports = TeamCityHelper;