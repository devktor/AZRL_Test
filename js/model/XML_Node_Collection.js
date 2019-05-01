XML_Node_Collection = Backbone.Collection.extend({


    shuffle:function(){
        this.reset(Backbone.Collection.prototype.shuffle.call(this), {silent:true});
    },

    parse:function(xml){
        var items = GetXMLNode(xml, this.nodeName).toArray();
        var result = [];
        for(var i in items){
            var model = new this.model;
            model.fromXML(items[i].outerHTML);
            result.push(model);
        }
        return result;
    },

    fromXML:function(xml){
        var data = this.parse(xml);
        this.add(data);
    }


})
