'use strict';
var useraccount = {
    action: [
        {'location':'/useraccount','action':'useraccount'}
    ],
    /**
     * Action索引ID
     */
    id: 'useraccount',
    /**
     * 初始化数据模型
     */
    model: new bui.BaseModel({
    }),
    BACK_LOCATION: '/useraccount',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getUserAccount'
    ],
    getUserAccount: function(args, callback){
        var me = this;
        
        me.getUserAccountCallback.callback = callback;
        Requester.get('mockup/accountinfo.json','',_.fn(me.getUserAccountCallback,this),this);
    },
    getUserAccountCallback: function(data){
        var me = this,
            i,len,list,
            result = data.result;
        if (data.success == 'true'){
            me.model.set('question', result['question']);

            me.model.set('oldInfo', result);
        }
        if(me.getUserAccountCallback.callback){
            me.getUserAccountCallback.callback();
            me.getUserAccountCallback.callback = undefined;
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
        var me = this,
            question = ('0'+String(me.model.get('question'))),
            type = parseInt(question.substr(0,2), 10),
            custom = question.substr(2,question.length);
        
        //_.find('#back').onclick = me.back;
        //_.find('#today_review').onclick = new Function("bui.redirect('/learn~date=today&type=review');")
        //_.find('#today_learn').onclick = new Function("bui.redirect('/learn~date=today&type=learn');")
        
        //_.find('#cancel').onclick=new Function("bui.redirect('/');"),
        //_.find("#save_package").onclick = _.fn(this.savePackage,this);
        
        _.find("#type").selectedIndex = type;
        _.find("#custom").value = custom;
        
        me.showCustom();
        
        _.find("#type").onchange = _.fn(me.showCustom,me);
        _.find('#save').onclick = _.fn(me.saveInfo,me);
    },
    saveInfo: function(){
        var me = this,
            i,
            oldInfo = me.model.get('oldInfo'),
            newInfo = {};
        if (me.validate()) {
            var params = me.getParamMap();
            
            if (params['question'] != oldInfo['question']) {
                _.hideMessage(_.find("#save"));
                _.showWaiting(_.find('#save'),'after');
                Requester.post('/users/account.action',params,_.fn(me.saveInfoCallback,me), me);
            }
            else {
                _.showMessage(_.find("#save"),'after',' Not modify! ');
            }
        }
    },
    saveInfoCallback: function(data){
        _.hideWaiting(_.find('#save'));
        if (data.success == 'true') {
            _.showMessage(_.find("#save"),'after',' Save success! ');
            _.find("#answer").value = '';
        }
        this.model.set('oldInfo', data.result);
    },
    showCustom: function () {
        var me = this,
            custom = document.getElementById('custom_question'),
            t = document.getElementById('type');
        if (t.selectedIndex == t.options.length-1){
            custom.style.display='';
            me.controlMap['custom'].rule = 'minLength,6';
        }
        else {
            custom.style.display='none';
            custom.value = t.selectedIndex == 0 ? '': t.selectedIndex;
            me.controlMap['custom'].rule = '';
        } 
    }
};

bui.Action.addModule(useraccount);
//派生自 bui.Action
bui.Action.derive(useraccount);
//bui.derive(useraccount, bui.Action);


