function TeamCityHelper(configName) {
    this.generator = require('./htmlGenerator');
    this.config = require('./config').get(configName);
    this.currentData = {};
}

TeamCityHelper.prototype.getNew = function (callback) {
    var options = this.config.connection;
    var instance = this;

    instance.generator.generatorHelper.getJson(options, function (jsonData) {
        //TODO разобрать json и оставить только новое
        instance.currentData = jsonData;

        var templatePath = instance.config.options.pageHtmlTemplatePath;
        instance.generator.generatorHelper.generateHtmlFromJson(jsonData, templatePath, function (htmlData) {
            callback(htmlData);
        });
    });
};

TeamCityHelper.prototype.getUpdate = function (callback) {
    //TODO найти изменения в отправленнных уже и отравить в callback
};

exports.teamCityHelper = TeamCityHelper;