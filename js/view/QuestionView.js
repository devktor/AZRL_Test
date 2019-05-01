QuestionView = Backbone.View.extend({

    el:"#question",

    initialize:function(options){
        this.template = _.template($("#question_tpl").html());
    },

    render:function(){
        this.$el.html(this.template());
    }
});
