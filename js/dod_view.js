$(function(){

    var appview = Backbone.View.extend({
        el: $("#content"),
        template: _.template($('#list-template').html()),
        initialize: function(){
            this.task_name = $("#task-name >input");
            this.task_span = $("#task-name >h3");
            this.check_list = $("#check-lists >ul");
            this.sub_task_name = $("#check-lists >input");
            this.listenTo(app.collection, "add", this.onCreate);
            this.listenTo(app.collection, "change", this.onCreate);
            this.sub_task_name.hide();
            this.error_pane = $(".error");
            this.error_pane.hide();
            app.collection.fetch();
        },
        events: {
            "keydown #task-name>input"     :  "changeFocus",
            "blur #task-name>input"        :  "createTitle",
            "dblclick #task-name>h3"       :  "editTask",
            "click  #check-list"           :  "statusUpdate",
            "keydown #check-lists>input"   :  "changeFocus",
            "blur #check-lists>input"      :  "createTask",
            "click  #clear"                :  "clearTask",
        },
        changeFocus : function(event){
            this.error_pane.hide();
            if (event.keyCode != 13) return;
            if (!event.target.value) return;
            if (event.target.name == "task_name" ){
                this.createTitle();
            }else{
                this.createTask();
            }
        },
        createTitle : function(event){
            if(!this.task_name.val()) return;
            if( !this.goodText(this.task_name.val()) ){
                this.error_pane.show();
                return;
            }
            if(app.collection.length != 0){
                if ( this.task_name.val() != this.model.getTitle()){
                    this.model.setTitle(this.task_name.val());
                }else{
                    this.task_name.hide();
                    this.task_span.show();
                    this.sub_task_name.show();
                }
            }else{
                app.collection.create({task_title : this.task_name.val()});
            }
        },
        editTask:function(event){
            this.task_name.val(this.model.getTitle());
            this.task_name.show();
            this.sub_task_name.hide();
            this.task_span.hide();
        },
        statusUpdate : function(event){
            var task_dod = this.model.getDOD();
            task_dod[event.target.name] = !task_dod[event.target.name];
            this.model.setDOD(task_dod);
        },
        goodText : function(text){
            var pattern = /^(\w{1,30}\s?\-?)+$/;
            return pattern.test(text);
        },
        createTask: function(event){
            if(!this.sub_task_name.val()) return;
            if( !this.goodText(this.sub_task_name.val()) ){
                this.error_pane.show();
                return;
            }
            var task_dod = this.model.getDOD();
            task_dod[this.sub_task_name.val()] = false;
            this.model.setDOD(task_dod);
            this.sub_task_name.val("");
            $("#check-list").focus();
        },
        clearTask: function(event){
            var task_dod = this.model.getDOD();
            delete task_dod[event.target.name];
            this.model.setDOD(task_dod);
            this.render();
        },
        onCreate : function(new_model){
            this.model = new_model;
            this.render();   
        },
        customSort : function(data){
            var x = {};
            var y = {} ;
            _.each(data.task_dod,function(val,key){
                if(val){
                    x[key]=val;
                }else{
                    y[key]=val;
                }
            });
            data.task_dod = _.extend(y,x);
            return data;
        },
        render: function(){
            this.error_pane.hide();
            if(app.collection.length != 0){
                var taskName = this.model.getTitle();
                this.task_span.html(taskName);
                var data = this.customSort(this.model.toJSON());  
                this.check_list.html(this.template(data));
                this.task_name.hide();
                this.task_span.show();
                this.sub_task_name.show();
            }else{
                this.task_name.show();
                this.task_span.hide();
                this.sub_task_name.hide();
            }
        }
    });

    app.view = new appview;  

});
