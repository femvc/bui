'use strict';
var supplyrandnum = {
    config:{
        'action':[
            {'location':'/supplyrandnum','action':'supplyrandnum'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'supplyrandnum',
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
        'checkType'
    ],
    checkType: function(args, callback){
        var me = this,
            reset_type = 'username';
        if (!args['type'] || (args['type'] != 'email' && args['type'] != 'mobile')){
            reset_type = 'username'
        }
        else if (args['type'] == 'email'){
            reset_type = 'email';
        }
        else if (args['type'] == 'mobile'){
            reset_type = 'mobile';
        }
        me.model['reset_type'] = reset_type;
        
        callback();
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
        _.find('#resetTypeTitle').innerHTML = bui.lang['Please_input_'+me.model['reset_type']];
        _.find('#resetType').innerHTML = bui.lang[me.model['reset_type']];
        controlMap['username'].rule = me.model['reset_type'];
        
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
            me.model['username'] = params['username'];
            
            Requester.post('/confirm/reset.action',params,_.fn(me.submitInfoCallback,me), me);
        }
    },
    submitInfoCallback: function(data){
        _.hideWaiting(_.find('#cancel'),_.find('#next'));
        var me = this;
        //更新本地数据
        if(data.success == 'true') {
            bui.context.set('username', data.result.username);
            bui.context.set('reset_type', String(data.result.reset_type).toLowerCase());
            bui.context.set('question', data.result.question);
            
            bui.redirect('#/supplyanswer~reset_type='+String(data.result.reset_type).toLowerCase()+'&username='+me.model['username']);
        }
    }
};

bui.Controller.addModule(supplyrandnum);
bui.Action.derive(supplyrandnum);

