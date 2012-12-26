'use strict';
var recharge = {
    config:{
        'action':[
            {'location':'/recharge','action':'recharge'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'recharge',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/recharge',
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
        _.find('#recharge').onclick = _.fn(me.saveInfo,me);
    },
    saveInfo: function(){
        var me = this;
        if (me.validate()) {
            var params = me.getParamMap();

            _.hideMessage(_.find("#recharge"));
            _.showWaiting(_.find('#recharge'),'after');
            Requester.post('/login/recharge.action',params,_.fn(me.saveInfoCallback,me), me);
        }
    },
    saveInfoCallback: function(data){
        _.hideWaiting(_.find('#recharge'));
        if (data.success == 'true') {
            _.showMessage(_.find("#recharge"),'after',' Save success! ');
            bui.redirect('/userinfo');
        }
    }
};

bui.Controller.addModule(recharge);
bui.Action.derive(recharge);

