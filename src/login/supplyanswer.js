'use strict';
var supplyanswer = {
    config:{
        'action':[
            {'location':'/supplyanswer','action':'supplyanswer'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'supplyanswer',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/supplyrandnum',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getQuestion'
    ],
    getQuestion: function(args, callback){
        var me = this;
        if (!bui.context.get('question')) {
            me.back();    
        }
        else {
            me.model['reset_type'] = bui.context.get('reset_type');
            me.model['username'] = bui.context.get('username');
            me.model['question'] = String(bui.context.get('question'));
            me.model['question'] = me.model['question'].substr(1,me.model['question'].length);
        
            callback();
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
            reset_type = me.model['reset_type'],
            question = me.model['question'];
        
        if (reset_type == 'email') {
            _.find('#email').style.display = 'inline';
        }
        else {
            _.find('#security_question').style.display = 'inline';
            _.find('#question').innerHTML = _.xss(_.decode(question));
        }
        
        _.find('#next').onclick = _.fn(me.submitInfo,me);
        //_.find('#back').onclick = me.back;
        //_.find('#today_review').onclick = new Function("bui.redirect('/learn~date=today&type=review');")
        //_.find('#today_learn').onclick = new Function("bui.redirect('/learn~date=today&type=learn');")
        
        //_.find('#cancel').onclick=new Function("bui.redirect('/');"),
        //_.find("#save_package").onclick = _.fn(this.savePackage,this);
        

    },
    submitInfo: function(){
        var me = this;
        if (me.validate()) {
            _.showWaiting(_.find('#cancel'),'after',_.find('#next'));
            var params = me.getParamMap();
            params['reset_type'] = me.model['reset_type'];
            params['username'] = me.model['username'];
            
            Requester.post('/confirm/answer.action',params,_.fn(me.submitInfoCallback,me), me);
        }
    },
    submitInfoCallback: function(data){
        _.hideWaiting(_.find('#cancel'),_.find('#next'));
        var me = this;
        //更新本地数据
        if(data.success == 'true' && data.result.reset_type == 'username') {
            bui.redirect('/changepsw');
        }
    }
};

bui.Controller.addModule(supplyanswer);
bui.Action.derive(supplyanswer);

