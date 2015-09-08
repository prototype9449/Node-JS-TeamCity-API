var config = require('./nconfSetting');
var ConfigManager = require('./ConfigManager');

var additionalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOption = config.additional().get('additionalOptions');
        return this.clone(generalOption);
    },

    getOneBuildByBuildTypeIdOptions: function (id) {
        var generalOption = config.additional().get('additionalOptions');
        var buildPaths = config.get('buildOptions');
        var buildOptions = this.clone(generalOption);
        buildOptions.connection.url += buildPaths.relativeUrlOneBuildByBuildTypeId.replace('_buildTypeId_', id);

        return buildOptions;
    },

    getBuildTypesOptions: function () {
        var generalOption = config.get('additionalOptions');
        var buildTypesPaths = config.get('buildTypeOptions');

        var buildOptions = this.clone(generalOption);
        buildOptions.connection.url += buildTypesPaths.relativeUrl;

        return buildOptions;
    }
};

module.exports = additionalConnectionOptionHelper;