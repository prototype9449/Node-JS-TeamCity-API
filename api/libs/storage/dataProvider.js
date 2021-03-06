var globalHelper = require('./../config/globalHelper');

function DataProvider(storages) {
    this.storages = storages;
    this.interval = {};
    this.time = globalHelper.timeTickPullingData;

    this.saveElements = function (storageDetails) {
        var connection = storageDetails.getOptions();
        storageDetails.generateObjects(connection).then(function (data) {
            if(data)
                storageDetails.storage.pushObjects(data);
        });
    };

    this.start = function () {
        var self = this;
        this.interval = setInterval(function send() {
            for (var id in self.storages) {
                self.saveElements(self.storages[id]);
            }
        }, this.time);
    };

    this.stop = function() {
        clearInterval(this.interval);
    };
}

module.exports = DataProvider;