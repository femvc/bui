'use strict';
var activate = {
    config:{
        'action':[
            {'location':'/activate','action':'activate'}
        ]
    },
    /**
     * Action索引ID
     */
    id: 'activate',
    /**
     * 初始化数据模型
     */
    model: {
        packageListFields: [
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
                content: function(item) {
                    var str = '';
                    if(item['syslist'] != '0') str = '<span class="field_syspackage" title="'+bui.lang['System_Package']+'">['+item['list_name']+']</span>';
                    else str = item['list_name'];
                    return str;
                }
            },
            {
                width: 80,
                title: bui.lang['Word_Count'],
                sortable: true,
                field: 'list_length',
                content: function(item) {return '<span style="">'+item['list_length']+'</span>';}
            }
        ]
    },
    BACK_LOCATION: '/activate',
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    CONTEXT_INITER_LIST: [
        'getWordsList'
    ],
    getWordsList: function(args, callback){
        var me = this;
        
        me.getWordsListCallback.callback = callback;
        Requester.post('/lists/query.action','',_.fn(me.getWordsListCallback,this),this);
    },
    getWordsListCallback: function(data){
        var me = this;
        
        if (data.success == 'true'){
            bui.context.set('usersWordsLists', data.result);
            bui.context.set('sysWordsLists', _.array.buildIndex(data.syslist));
        }
        
        if (me.getWordsListCallback.callback) {
            me.getWordsListCallback.callback();
            me.getWordsListCallback.callback = undefined;
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
            i,
            len,
            syslist = {},
            selectedItemMap = {},    
            selectedList = [],
            sysWordsLists = bui.context.get('sysWordsLists'),
            usersWordsLists = bui.context.get('usersWordsLists');
                
        //_.g('back').onclick = _.fn(me.back,me);
        _.g('cancel').onclick = new Function("bui.redirect('/activate',{'enforce':1});");
        _.g('save').onclick = _.fn(this.save,this);
        me.controlMap['username'].main.onfocus = _.fn(me.inputUsername,me);
        me.controlMap['username'].main.onkeyup = _.fn(me.inputUsername,me);
        me.controlMap['username'].main.onblur = _.fn(me.checkUsername,me);
        me.controlMap['password_new'].main.onkeyup = _.fn(changepsw.checkPasswordStrength,me);
        me.controlMap['password_new'].main.onblur = _.fn(me.checkPassword,me);
        me.controlMap['password_confirm'].main.onblur = _.fn(me.checkPasswordConfirm,me);

        for (i in usersWordsLists) {
            if (i && usersWordsLists[i].syslist != '0') {
                syslist[usersWordsLists[i].syslist] = 1;
            }
        }
        for (i=0,len=sysWordsLists.length; i<len; i++) {
            if (sysWordsLists[i] && syslist[sysWordsLists[i]['list_id']]) {
                selectedItemMap[sysWordsLists[i]['list_id']] = '1';
                selectedList.push(sysWordsLists[i]);
            }
        }
        
        me.controlMap['packageList'].selectedItemMap = selectedItemMap;
        me.controlMap['packageList'].selectedItemList = selectedList;
        
        me.controlMap['packageList'].render();
    },
    /**
     * 检查用户名是否已存在
     *
     * @private
     */
    inputUsername: function(){
        var me = this;
        _.hideWaiting(me.controlMap['username'].main);
        _.hideMessage(me.controlMap['username'].main);
    },
    checkUsername: function(){
        var me = this,
            username = String(me.controlMap['username'].getValue());
        if (username && username == me.controlMap['username'].old) {
            _.showMessage(me.controlMap['username'].main,'after',' OK');
        }
        else if (username.length>0 && me.controlMap['username'].validate()) {
            _.hideMessage(me.controlMap['username'].main);
            _.showWaiting(me.controlMap['username'].main,'after');
            Requester.post('/confirm/username.action','username='+username,_.fn(me.checkUsernameCallback,this),this);
        }
    },
    checkUsernameCallback: function(data){
        var me = this;
        _.hideWaiting(me.controlMap['username'].main);
        if(data.split(':')[0] == 'success' && data.split(':')[1] == String(me.controlMap['username'].getValue())){
            _.hideMessage(me.controlMap['username'].main);
            _.showMessage(me.controlMap['username'].main,'after',' OK');
            
            me.controlMap['username'].old = String(data.split(':')[1]);
        }
        if(data.split(':')[0] == 'exist' && data.split(':')[1] == String(me.controlMap['username'].getValue())){
            _.showMessage(me.controlMap['username'].main,'after',' <span style="color:red">Registered</span>');
        }
    },
    /**
     * 检查用户名是否已存在
     *
     * @private
     */
    checkPassword: function(){
        var me = this,
            input = me.controlMap['password_new'];
        if (input.validate()) {
            _.showMessage(input.main,'after',' OK');
        }
        else {
            _.hideMessage(input.main);
        }
    },    
    checkPasswordConfirm: function(){
        var me = this,
            input = me.controlMap['password_confirm'];
        if (input.validate()) {
            _.showMessage(input.main,'after',' OK');
        }
        else {
            _.hideMessage(input.main);
        }
    },  
    /**
     * 保存已选列表
     *
     * @private
     */
    save: function(){
        var me = this,
            params = [],
            listid = [],
            i,
            len,
            list;
        
        if (me.validate()) {
            var params = me.getParamMap();
            
            list = me.controlMap['packageList'].selectedItemList;
            for (i=0,len=list.length;i<len;i++){
                listid.push(list[i]['list_id']); 
            }
            
            params['list_id'] = listid.join(',');
            
            _.hideMessage(_.find("#cancel"));
            _.showWaiting(_.find("#cancel"),'after',_.g('save'));
            Requester.post('/users/save.action',params,_.fn(me.saveCallback,this),this);
        }
    },
    /**
     * 保存回调函数
     *
     * @private
     */
    saveCallback: function(data){
        var me = this;
        if(data.success && data.success == 'true'){
            bui.context.set('userInfo',null);
            bui.redirect('/step01');
        }
    }
};

bui.Controller.addModule(activate);
bui.Action.derive(activate);


