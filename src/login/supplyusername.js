'use strict';
var supplyusername = {
    config:{
        'action':[
            {'location':'/supplyusername','action':'supplyusername'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'supplyusername',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/supplyusername',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
    ],
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

    }
};

bui.Controller.addModule(supplyusername);
bui.Action.derive(supplyusername);

