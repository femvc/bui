'use strict';
var userinfo = {
    config:{
        'action':[
            {'location':'/userinfo','action':'userinfo'},
            {'location':'/','action':'userinfo'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'userinfo',
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
        'getUserBaseInfo'
    ],
    getUserBaseInfo: function(args, callback){
        var me = this;
        
        me.getUserBaseInfoCallback.callback = callback;
        Requester.get('/users/info.action','',_.fn(me.getUserBaseInfoCallback,this),this);
    },
    getUserBaseInfoCallback: function(data){
        var me = this,
            i,len,list,
            result = data.result;
        if (data.success == 'true'){
            me.model['username'] = bui.context.get('username') || result['username'];
            me.model['birthday'] = result['birthday'];
            me.model['email'] = result['email'];
            me.model['introduction'] = result['introduction'];
             
            me.model['gender'] = result['gender'];
            me.model['marry_status'] = result['marry_status'];
            me.model['work_status'] = result['work_status'];
             
            me.model['expiration'] = result['expiration'];
            me.model['wizard'] = result['wizard'];

            me.model['oldInfo'] = result;
        }
        if(me.getUserBaseInfoCallback.callback){
            me.getUserBaseInfoCallback.callback();
            me.getUserBaseInfoCallback.callback = undefined;
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
        _.find("#username").innerHTML = me.model['username'];
        
        _.find("#gender").selectedIndex = parseInt(me.model['gender'],10);
        _.find("#work_status").selectedIndex = parseInt(me.model['work_status'],10);
        _.find("#marry_status").selectedIndex = parseInt(me.model['marry_status'],10);
        
        _.find('#wizard').checked = me.model['wizard'] == '0' ? true : false;
        _.find('#save').onclick = _.fn(me.saveInfo,me);
        _.find('#expired_until').innerHTML = me.model['expiration'];
    },
    saveInfo: function(){
        var me = this,
            i,
            oldInfo = me.model['oldInfo'],
            newInfo = {},
            modify = false;
        if (me.validate()) {
            var params = me.getParamMap();
            params['gender'] = _.find("#gender").selectedIndex;
            params['work_status'] = _.find("#work_status").selectedIndex;
            params['marry_status'] = _.find("#marry_status").selectedIndex;
            params['wizard'] = _.find("#wizard").checked ? '0' : '1';
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
                Requester.post('/users/baseinfo.action',newInfo,_.fn(me.saveInfoCallback,me), me);
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

bui.Controller.addModule(userinfo);
bui.Action.derive(userinfo);

