window.AgentPageView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('AgentPageView has been created');
        this.template = _.template(tpl.get('fullAgentInfo'));

        this.agentView = {};
        this.buildHistoryView = {};
    },

    render: function () {
        var renderPanel = function (view) {
            view.render();
            view.delegateEvents();
        };
        $(this.el).html(this.template());

        this.agentView = new ObjectListItemView({model: this.model.agent, router: this.options.router});
        this.agentViewPanel = this.$('#Agent-panel');
        this.agentViewPanel.prepend(this.agentView.render().el);
        this.agentView.delegateEvents();

        this.buildHistoryView = new ObjectListView({model: this.model.buildList, router: this.options.router});
        this.buildHistoryView.$el = this.$('#history-table-panel');
        renderPanel(this.buildHistoryView);

        return this;
    }
});
