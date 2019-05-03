TestCollection = Backbone.Collection.extend({

    model: Test,

    add:function(name, url){
        test = new Test({name: name, url:url});
        test.url = url;
        Backbone.Collection.prototype.add.call(this, test);
    },


    fetchAll:function(){
        this.each(function(test){
            test.fetch({error:function(obj, err){console.log("failed to fetch: "+test.get("name"), err)}});
        });
    }

});
