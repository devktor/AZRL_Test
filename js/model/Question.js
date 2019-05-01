Question = Backbone.Model.extend({


    fromXML:function(xml){
        this.set(this.parse(xml));
    },

    parse:function(xml){
        var node = GetXMLNode(xml, "question");
        var data = {picture:node.find("picture").text(), text:node.find(">text").text(), answers: new AnswerCollection()};
        data.answers.fromXML(node.find("answer"));
        return data;
    }
});
