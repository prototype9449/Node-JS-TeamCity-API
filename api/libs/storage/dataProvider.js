
function DataProvider(storages, time) {
    this.storages = storages;
    this.interval = {};
    this.time = time || 5000;

    this.saveElements = function (storageDetails) {
        var connection = storageDetails.getOptions();
        storageDetails.getObjecs(connection, function (data) {
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