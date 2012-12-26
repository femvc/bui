'use strict';
var usercontact = {
    config:{
        'action':[
            {'location':'/usercontact','action':'usercontact'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'usercontact',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/usercontact',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getUserContact'
    ],
    getUserContact: function(args, callback){
        var me = this;
        
        me.getUserContactCallback.callback = callback;
        Requester.get('mockup/userscontact.json','',_.fn(me.getUserContactCallback,this),this);
    },
    getUserContactCallback: function(data){
        var me = this,
            i,len,list,
            result = data.result;
        if (data.success == 'true'){
            me.model['real_name'] = result['real_name'];
            me.model['address'] = result['address'];
            me.model['mobile'] = result['mobile'];

            me.model['oldInfo'] = result;
        }
        if(me.getUserContactCallback.callback){
            me.getUserContactCallback.callback();
            me.getUserContactCallback.callback = undefined;
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
        
        //_.find('#back').onclick = me.back;
        //_.find('#today_review').onclick = new Function("bui.redirect('/learn~date=today&type=review');")
        //_.find('#today_learn').onclick = new Function("bui.redirect('/learn~date=today&type=learn');")
        
        //_.find('#cancel').onclick=new Function("bui.redirect('/');"),
        //_.find("#save_package").onclick = _.fn(this.savePackage,this);

        _.find('#save').onclick = _.fn(me.saveInfo,me);
    },
    saveInfo: function(){
        var me = this,
            i,
            oldInfo = me.model['oldInfo'],
            newInfo = {},
            modify = false;
        if (me.validate()) {
            var params = me.getParamMap();
            for (i in params) {
                if (i){
                    if (String(params[i]) != String(oldInfo[i])) {
                        newInfo[i] = params[i];
                        modify = true;
                    }
                }
            }
            if (modify) {
                _.hideMessage(_.find("#save"));
                _.showWaiting(_.find('#save'),'after');
                //服务器端校验出错演示
                //Requester.post('mockup/userscontact.json',newInfo,_.fn(me.saveInfoCallback,me), me);
                Requester.post('mockup/userscontact-error.json',newInfo,_.fn(me.saveInfoCallback,me), me);
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
        }
        this.model['oldInfo'] = data.result;
    }
};

bui.Controller.addModule(usercontact);
bui.Action.derive(usercontact);


