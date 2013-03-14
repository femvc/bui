'use strict';
var userpoints = {
    config:{
        'action':[
            {'location':'/userpoints','action':'userpoints'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'userpoints',
    BACK_LOCATION: '/userpoints',
    /**
     * 初始化数据模型
     */
    model: {
        listFields: [
            {
                width: 25,
                title: bui.lang['No1'],
                sortable: true,
                field: 'index',
                content: function(item) {return item['index'];}
            },
            {
                width: 160,
                title: bui.lang['List_Name'],
                sortable: true,
                field: 'list_name',
                content: function(item) {return item['list_name'];}
            },
            {
                width: 41,
                title: bui.lang['Status'],
                sortable: true,
                field: 'list_status',
                content: function(item) {return '<center>'+(item['list_status']=='1'?'<img class="icon_liststatus" src="common/img/icon_learnt.gif" alt="Learnt">':'<img class="icon_liststatus" src="common/img/icon_new.gif" alt="New">')+'</center>';}
            },
            {
                width: 110,
                title: bui.lang['Last_Modify'],
                sortable: true,
                field: 'last_modify',
                content: function(item) {return '<center>'+_.formatDate(_.parseDate((item['last_modify'])))+'</center>';}
            }
        ]
    },
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getPointsList'
    ],
    getPointsList: function(args, callback){
        var me = this;
        
        me.getPointsListCallback.callback = callback;
        Requester.post('mockup/points-table.json','',_.fn(me.getPointsListCallback,this),this);
    },
    getPointsListCallback: function(data){
        var me = this;
        
        if (data.success == 'true'){
            var usersPointsLists = data.result;
            bui.context.set('usersPointsLists', _.array.buildIndex(_.array.sortBy(usersPointsLists,'list_id','desc')));
        }
        
        if (me.getPointsListCallback.callback) {
            me.getPointsListCallback.callback();
            me.getPointsListCallback.callback = undefined;
        }
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
        
        //_.g('cancel').onclick=new Function("bui.redirect('/');"),
        //_.find("#save_package").onclick = _.fn(this.savePackage,this);

    },
    saveuserpoints: function(){
        hideError(_.g('daily_count'));
        var daily_count = parseInt('0'+_.g('daily_count').value,10);
        if(this.controlMap['daily_count'].validate()){
            if(daily_count<1000 && daily_count> 0){
                
            }else{
                showError(_.g('daily_count'),'Should between 1-1000');
                _.g('daily_count').value = _.trim(_.g('daily_count').value)==''?0:_.g('daily_count').value;
            }
        }
    }
};

bui.Master.addModule(userpoints);
//派生自 bui.Action
bui.Action.derive(userpoints);
//bui.derive(userpoints, bui.Action);

