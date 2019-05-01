

Answer = Backbone.Model.extend({

    fromXML:function(xml){
        this.set(this.parse(xml));
    },

    parse:function(xml){
        var node = GetXMLNode(xml, "answer")
        return {text: node.text(), correct:node.attr("type")=="correct"}
    }

});
