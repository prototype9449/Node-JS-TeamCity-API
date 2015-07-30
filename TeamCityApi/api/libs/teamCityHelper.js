function TeamCityHelper(configName) {
    this.generator = require('./htmlGenerator');
    this.config = require('./config').get(configName);
    this.currentData = {};
}

TeamCityHelper.prototype.getNew = function (callback) {
    var options = this.config.connection;
    var templatePath = this.config.options.pageHtmlTemplatePath;

    this.generator.generateHtml(options, templatePath, function (newData) {

        callback(newData);
        if (this.currentData && !this.compare(newData)) {
            //TODO в callback отправить только новое
        }
    });
};

TeamCityHelper.prototype.getUpdate = function (callback) {
    //TODO найти изменения в отправленнных уже и отравить в callback
};

exports.teamCityHelper = TeamCityHelper;