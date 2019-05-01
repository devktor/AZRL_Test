TestView = Backbone.View.extend({

    el:".quizz",

    initialize:function(){
        _(this).bindAll("render", "renderNextQuestion", "shuffle", "checkAnswers");
        this.questionBox = this.$el.find(".question");
        this.controls = this.$el.find(".controls");
        this.questionTemplate = _.template($("#question_tpl").html());
        this.answerTemplate = _.template($("#answer_tpl").html());
        this.controls.find("input[name=next]").click(this.renderNextQuestion);
        this.controls.find("input[name=shuffle]").click(this.shuffle);
        this.controls.find("input[name=submit]").click(this.checkAnswers);

        this.statsBox = this.$el.find(".stats");
        this.correctAnswers  = this.statsBox.find(".correctAnswers span");
        this.wrongAnswers = this.statsBox.find(".wrongAnswers span");
        this.successRate = this.statsBox.find(".successRate span");
        this.progress = this.statsBox.find(".progress span");

        this.renderLoader();
        this.model.on("update",this.render);
        
    },

    render:function(){
        if(this.model.isEmpty()){
            console.log("waiting for the update....");
            this.model.once("change",this.render);
        }else{
            console.log("rendering test...");
            this.renderNextQuestion();
        }
    },

    renderStats:function(){
        var result = this.model.get("result");
        this.correctAnswers.html(result.get("correct"));
        this.wrongAnswers.html(result.get("wrong"));
        this.successRate.html(result.getSuccessRate());
        this.progress.html(result.getProgress());
    },

    renderLoader:function(){
        this.controls.hide();
        this.questionBox.html("loading....");
    },

    renderNextQuestion:function(){
        var questions = this.model.get("questions")
        if(questions && questions.length){
            this.renderQuestion(questions.getNext());
        }else{
            this.questionBox.html("");
        }
    },

    renderQuestion:function(question){
        this.controls.show();
        var picture = question.get("picture");
        if(picture) picture = "xml/"+picture;
        this.questionBox.html(this.questionTemplate({text:question.get("text"), picture: picture}));
        this.renderAnswers(question.get("answers"));
    },

    renderAnswers:function(answers){
        answers.shuffle();
        var answersBox = this.$el.find(".answers");
        var answerTemplate = this.answerTemplate;
        answersBox.html("");
        answers.each(function(answer, index){
            answersBox.append(answerTemplate({index: index, answer:answer}));
        });
    },
    shuffle:function(){
        var questions = this.model.get("questions");
        if(questions){
            questions.shuffle();
            this.renderNextQuestion();
        }
    },
    checkAnswers:function(){
        var model = this.model;
        var questions = this.model.get("questions");
        var result = this.model.get("result");
        if(!questions) return;

        var questionIndex = questions.getCursor();


        var responses = [];
        var inputs = this.$el.find("input[name=answer]");

        inputs.each(function(i, input){
            responses.push($(input).is(':checked'));
        });

        var wrong = false;
        result.addResponse(questionIndex, responses, function(i, correct){
            var div = $(inputs[i]).parent();
            if(!correct){
                div.addClass("wrong");
                wrong = true;
            }else{
                div.removeClass("wrong");
            }
        });


        if(!wrong) this.renderNextQuestion();
        this.renderStats();
    }
});
