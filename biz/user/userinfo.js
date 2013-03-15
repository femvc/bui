'use strict';
var user = {
    //注: bui.Action.addModule只用到了action属性，不会使用到除此外的任何其他属性!!
    action: [
        {'location':'/userinfo','action':'user.Info'},
        {'location':'/','action':'user.Info'}
    ]
};

bui.Action.addModule(user);

user.Info = function(){
    bui.Action.call(this);
    /**
     * Action索引ID
     * 
     * @comment 主要用于控件中通过onclick="bui.Control.get('listTable','login');
     */
    this.id = 'userinfo';
    /**
     * 初始化数据模型
     */
    this.model = new bui.BaseModel({
    });
    this.BACK_LOCATION = '/userinfo';

};
    
user.Info.prototype = {
    
    getUserBaseInfo: function(callback){
        var me = this;
        
        me.getUserBaseInfoCallback.callback = callback;
        Requester.get('/users/info.action','',_.fn(me.getUserBaseInfoCallback,this),this);
    },
    getUserBaseInfoCallback: function(data){
        var me = this,
            i,len,list,
            result = data.result;
        if (data.success == 'true'){
            me.model.set('username'     , bui.context.get('username') || result['username']);
            me.model.set('birthday'     , result['birthday']);
            me.model.set('email'        , result['email']);
            me.model.set('introduction' , result['introduction']);
             
            me.model.set('gender'       , result['gender']);
            me.model.set('marry_status' , result['marry_status']);
            me.model.set('work_status'  , result['work_status']);
             
            me.model.set('expiration'   , result['expiration']);
            me.model.set('wizard'       , result['wizard']);

            me.model.set('oldInfo'      , result);
        }
        if(me.getUserBaseInfoCallback.callback){
            me.getUserBaseInfoCallback.callback();
            me.getUserBaseInfoCallback.callback = undefined;
        }
    },
    initModel: function(callback){
        var me = this,
            k;
        //初始化Model
        for(k in me.args){ 
            if(k){ 
                me.model.set(k, me.args[k]); 
            }
        }
        //callback&&callback();
        me.getUserBaseInfo(callback);
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
        //_.find("#username").innerHTML = me.model.get('username');
        
        _.find("#gender").selectedIndex = parseInt(me.model.get('gender'),10);
        _.find("#work_status").selectedIndex = parseInt(me.model.get('work_status'),10);
        _.find("#marry_status").selectedIndex = parseInt(me.model.get('marry_status'),10);
        
        _.find('#wizard').checked = me.model.get('wizard') == '0' ? true : false;
        _.find('#save').onclick = _.fn(me.saveInfo,me);
        _.find('#expired_until').innerHTML = me.model.get('expiration');
    },
    saveInfo: function(){
        var me = this,
            i,
            oldInfo = me.model.get('oldInfo'),
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
        this.model.set('oldInfo', data.result);
    }
};

bui.inherits(user.Info, bui.Action);

