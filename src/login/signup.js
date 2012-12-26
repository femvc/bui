'use strict';
var signup = {
    config:{
        'action':[
            {'location':'/signup','action':'signup'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'signup',
    /**
     * 初始化数据模型
     */
    model: {
    },
    BACK_LOCATION: '/signup',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        //'getPlanList'
    ],
    getPlanList: function(args, callback){
        var me = this;
        
        me.getPlanListCallback.callback = callback;
        Requester.get('/plan/list.action','',_.fn(me.getPlanListCallback,this),this);
    },
    getPlanListCallback: function(data){
        var me = this,
            i,len,list,
            planList = data.result;
        if(planList && planList.length){
            planList = planList.concat([]);
            _.array.sortBy(planList,'date');
            
            list = me.model['learnHistory'];
            for(i=0,len=planList.length;i<len;i++){
                if(planList[i]['today'] == '1'){
                    list.push(planList[i]);
                    list = me.model['learnPlan'];
                }
                list.push(planList[i]);
                me.model['learnt_words'] += parseInt(planList[i]['learnt'],10);
                me.model['left_words'] += parseInt(planList[i]['learn'],10);
                
                planList[i]['use_time'] = parseInt(planList[i]['use_time'],10);
                if(planList[i]['use_time']>59){
                    planList[i]['use_time'] = '<span class="field_minute">' 
                        + (planList[i]['use_time']-planList[i]['use_time']%60)/60 
                        + 'm </span><span class="field_second">'
                        + planList[i]['use_time']%60 + 's</span>';
                }else{
                    planList[i]['use_time'] = '<span class="field_minute">&nbsp;</span><span class="field_second">' + planList[i]['use_time']+'s</span>';
                }
            }

            _.array.buildIndex(me.model['learnHistory']);
            _.array.buildIndex(me.model['learnPlan']);
            
        }
        if(me.getPlanListCallback.callback){
            me.getPlanListCallback.callback();
            me.getPlanListCallback.callback = undefined;
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

    },
    save: function(){
        hideError(_.find('#daily_count'));
        var daily_count = parseInt('0'+_.find('#daily_count').value,10);
        if(this.controlMap['daily_count'].validate()){
            if(daily_count<1000 && daily_count> 0){
                
            }else{
                showError(_.find('#daily_count'),'Should between 1-1000');
                _.find('#daily_count').value = _.trim(_.find('#daily_count').value)==''?0:_.find('#daily_count').value;
            }
        }
    }
};

bui.Controller.addModule(signup);
bui.Action.derive(signup);

