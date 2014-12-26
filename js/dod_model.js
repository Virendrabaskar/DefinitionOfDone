var app = {};

var model  = Backbone.Model.extend({
    initialize : function(){
    },
    defaults : {
        task_title : "P3-XYZ",
        task_dod   :  {
            "Requirement Understand" : false,
            "Prepare Unit Test Cases" : false,
            "Design"   : false,
            "Coding"    : false,
            "Testing" : false ,
            "Fix Bugs"  : false,
            "Peer Review" : false,
            "Work on Review Comments" : false,
            "Code Commit" : false,
            "Benchmark and Store Report" : false,
            "Lead Review" : false
         }
    },
    getTitle : function() {
        return this.get("task_title");
    },
    getDOD : function() {
        return this.get("task_dod");
    },
    setTitle : function(title){
        this.save({ task_title : title });
    },
    setDOD : function(dod){
        this.save(dod);
    }

});

var collection = Backbone.Collection.extend({
    model   : model,
    localStorage : new Backbone.LocalStorage("dod-data")
});

app.collection = new collection;


