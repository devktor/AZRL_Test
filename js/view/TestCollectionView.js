TestCollectionView = Backbone.View.extend({

    el:".page",

    render:function(){

        var select = this.$el.find("select[name=test]");
        var subViews = [];

        this.model.each(function(test, index){
            var name = test.get("name");
            console.log("got test: ",index," name: ",name);
            select.append("<option value=\""+index+"\">"+test.get("name")+"</option>")
            var view  = new TestView({model:test});
            subViews.push(view);
            view.hide();
            view.render();
        });

        var activeView = subViews[0];
        activeView.show();

        select.change(function(){
            activeView.hide();
            activeView = subViews[select.val()];
            activeView.show()
        });

    }



});
