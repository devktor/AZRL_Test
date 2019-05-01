QuestionCollection = XML_Node_Collection.extend({

    model: Question,
    nodeName: "question",
    cursor: -1,

    getCursor:function(){
        return this.cursor;
    },

    getNext:function(){
        this.cursor ++;
        if(this.cursor >= this.length) this.cursor = 0;
        console.log("getting question at ",this.cursor, " total size ",this.length);
        return this.at(this.cursor);
    }
});
