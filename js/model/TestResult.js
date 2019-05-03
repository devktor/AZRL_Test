TestResult = Backbone.Model.extend({

  defaults: {
        correct: 0,
        wrong: 0,
        answers: 0
    },

    responseMap : {},

    initialize:function(questions){
        this.questions = questions;
    },

    reset:function(){
        this.responseMap = {};
        this.set({
            correct: 0,
            wrong: 0,
            answers: 0
        });
    },

    addResponse:function(questionIndex, responses, callback){
        var question = this.questions.at(questionIndex);
        if(!question) return;
        var answers = question.get("answers");
        var _this = this;
        var result = [];
        
        var wrong = false;
        answers.each(function(answer, index){
            var isCorrect = answer.get("correct");
            var response = responses[index];
            var responseResult =  (isCorrect && response) || (!isCorrect && !response);
            if(!responseResult) wrong = true;

            result.push(responseResult);
            if(callback instanceof Function) callback(index, responseResult);

        });
        if(this.responseMap[questionIndex] == undefined){
            var updates = {correct: this.get("correct"), wrong:this.get("wrong"), answers:this.get("answers")}
            updates.answers ++;
            if(wrong) updates.wrong ++; 
            else updates.correct++;
            this.responseMap[questionIndex] = !wrong;
            this.set(updates);
        }
        return result;
    },

    getSuccessRate:function(){
        var correct = this.get("correct");
        if(!correct) return 0;
        var wrong = this.get("wrong");

        return Math.round(correct * 1000 / (correct + wrong))/10;
    },


    getProgress:function(){
        return  Math.round(this.get("answers") * 1000 / this.questions.length )/10;
    }

})
