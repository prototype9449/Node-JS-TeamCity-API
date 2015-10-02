window.ObjectsCollection = Backbone.Collection.extend({
    maxElem: null,
    initialize: function (models, options) {
        this.modelProvider = options.modelProvider;
        this.maxElem = options.maxElem || this.maxElem;
    },

    model: function (attrs, options) {
        return new options.collection.modelProvider(attrs, options);
    },

    comparator: function (build) {
        return (-build.get("id"));
    },

    add: function (model) {
        this.addElement(this, model);
        if (this.maxElem)
            if (this.length > this.maxElem)
                this.removeOldElements();
    },

    addElement: function (self, model) {
        var duplicate = self.find(function (modelFromStorage) {
            return modelFromStorage.id == model.id;
        });

        if (duplicate) {
            var index = self.indexOf(duplicate);
            self.models[index].set(model);
        }
        else {
            Backbone.Collection.prototype.add.call(self, model);
        }
    },

    removeOldElements: function () {
        var oldElement = this.min(function (build) {
            return build.get("id");
        });

        this.remove(oldElement);
    }
});