'use strict';
var changepsw = {
    config:{
        'action':[
            {'location':'/changepsw','action':'changepsw'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'changepsw',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/userinfo',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getChangepsw'
    ],
    getChangepsw: function(args, callback){
        var me = this;
        
        //me.getChangepswCallback.callback = callback;
        //Requester.get('/confirm/status.action','',_.fn(me.getChangepswCallback,this),this);
        callback();
    },
    getChangepswCallback: function(data){
        var me = this,
            i,len,list,
            result = data.result;
        if (data.success == 'true'){
            me.model['resetpsw'] = result['status'];
        }
        if(me.getChangepswCallback.callback){
            me.getChangepswCallback.callback();
            me.getChangepswCallback.callback = undefined;
        }
    },
    initModel: function(callback){
        var me = this;
        
        callback&&callback();
    },
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap) {
        var me = this;
        
        //_.g('back').onclick = me.back;
        //_.g('today_review').onclick = new Function("bui.redirect('/learn~date=today&type=review');")
        //_.g('today_learn').onclick = new Function("bui.redirect('/learn~date=today&type=learn');")
        
        //_.find("#save_package").onclick = _.fn(this.savePackage,this);
        _.g('cancel').onclick = me.back;
        if (String(me.model['resetpsw']) != 'resetpsw' ) {
            _.g('old').style.display = '';
        }
        else {
            me.controlMap['password_old'].disable(true);
        }
        _.g('save').onclick = _.fn(me.savePassword,me);
        me.controlMap['password_new'].main.onkeyup = _.fn(me.checkPasswordStrength,me);
    },
    savePassword: function(){
        var me = this,
            i,
            oldInfo = me.model['oldInfo'];
        if (me.validate()) {
            var params = me.getParamMap();

            _.hideMessage(_.find("#save"));
            _.showWaiting(_.g('save'),'after');
            Requester.post('/password/save.action',params,_.fn(me.savePasswordCallback,me), me);

        }
    },
    savePasswordCallback: function(data){
        _.hideWaiting(_.g('save'));
        if (data.success == 'true') {
            _.showMessage(_.find("#save"),'after',' Save success! ');
            this.controlMap['password_old'].setValue('');
            this.controlMap['password_new'].setValue('');
            this.controlMap['password_confirm'].setValue('');
            _.g('old').style.display = '';
            this.controlMap['password_old'].disable(false);
        }
        this.model['oldInfo'] = data.result;
    },
    checkPasswordStrength: function(){
        var s = this.controlMap['password_new'].getValue();
        var ls = 0;
        if(s.length > 0) {
            ls++;
            if (s.match(/[a-z]/g)||s.match(/[A-Z]/g))  ls++;
            if (s.match(/[a-z]/g)&&s.match(/[A-Z]/g))  ls++;
            if (s.match(/[0-9]/ig))  ls++;
            if (s.match(/(.[^a-z0-9])/ig))     ls+=1;
            if (s.length < 4 && ls > 0)  ls--;
            if (s.length > 7 ) ls++;
            if (s.length > 11 ) ls++;
            if (s.length > 15 ) ls++;
            if(ls>5) ls=5;
        }
        
        _.g('password_strength').className="grade0" + ls;
    }
};

bui.Controller.addModule(changepsw);
bui.Action.derive(changepsw);



