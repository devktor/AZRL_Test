
Test = Backbone.Model.extend({

    initialize:function(options){
        this.url = options.url;
    },

    isEmpty:function(){
        return !this.has("questions");
    },

    fromXML:function(xml){
        this.set(this.parse(xml));
    },

    fetch:function(options){
        options = options || {};
        options.dataType = "xml";
//        this.url = url;
        Backbone.Model.prototype.fetch.call(this, options);
    },

    parse:function(xml){
        xml = ParseXML(xml);
        var questions = new QuestionCollection;
        questions.fromXML(xml.find("questions"));
        return {questions: questions, result: new TestResult(questions)};
    }
})
