'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    action.js
 * desc:    Action页面主要流程控制类
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

bui.Action = function(options){
    bui.EventDispatcher.call(this);
    /**
     * Action的页面主元素[容器]
     *
     * @public
     * @return {Map}
     */
    this.main  = null;
    /**
     * Action的模板名
     *
     * @public
     * @return {string}
     */
    this.view = null;
    /**
     * Action实例化时需要提前加载的model数据
     *
     * @public
     * @return {Map}
     */
    this.PARAM_MAP = {};
    /**
     * Action的数据模型
     *
     * @public
     * @return {Map}
     */
    this.model = new bui.BaseModel();
    /**
     * Action的顶层控件容器
     *
     * @public
     * @return {Map}
     */
    this.controlMap = {};
    //声明类型
    this.type = 'action';
    
    //保存参数
    if (options && options.id) {
        this.initOptions(options);
        //主要用new Action({id:XXX,view:XXX})时建立action的索引.
        //注: 如果不是new Action({})的方式创建, 则bui.Action.map[this.id]在bui.Action.derive()里会覆盖掉这里设置的值
        bui.Action.map[this.id] = this;
    }
};

bui.Action.prototype = {
    /**
     * 设置参数
     * 
     * @protected
     * @param {Object} options 参数集合
     * @private
     */
    initOptions: function ( options ) {
        for ( var k in options ) {
            this[ k ] = options[ k ];
        }
    },
    /**
     * 获取视图模板名
     * 
     * @protected
     * @return {String} target名字
     * @default 默认为action的id
     */
    getView: function(){
        var view = (this.view == null ? this.id : this.view);
        // 获取view
        if(typeof view === 'function'){
            view = view();
        }
        
        return String(view);
    },
    /**
     * Action的主要处理流程
     * 
     * @protected
     * @param {Object} argMap arg表.
     */
    enterAction : function(args){
        var me = this,
            que;
        //创建一个异步队列     
        que = bui.asyque();
        que.push(function(callback){var me = this;
            
            //开始执行Action的处理流程
            me.trigger('ENTER_ACTION', me);
            
            //默认创建一个DIV作为主元素
            if(!me.main && document && document.createElement){
                if (bui.g('main')) {
                    me.main = bui.g('main');
                }
                else{
                    me.main = document.createElement('DIV');
                    document.body.appendChild(me.main);
                }
            }
            me.main.action = me;    
            //保存通过URL传过来的参数
            me.args = args;
            
            //判断model是否存在，不存在则新建一个
            if (!me.model) {
                me.model = new bui.BaseModel();
            }
            
            me.trigger('LOAD_MODEL', me);
            var k;
            // 先将PARAM_MAP中的key/value装入model
            for(k in me.PARAM_MAP){ 
                if(k){ 
                    me.model.set(k, me.PARAM_MAP[k]); 
                }
            }
        
        callback&&callback();}, me);
        
        //初始化Model
        que.push(me.initModel,me);
        
        que.push(function(callback){var me = this;
        
            //触发MODEL_LOADED事件
            me.trigger('MODEL_LOADED', me);
            //触发LOAD_VIEW事件
            me.trigger('LOAD_VIEW', me);
        
        callback&&callback();}, me);
        
        //初始化View
        que.push(me.initView,me);
        
        que.push(function(callback){var me = this;
            //触发VIEW_LOADED事件
            me.trigger('VIEW_LOADED', me);
            
        callback&&callback();}, me);
        
        que.push(function(callback){var me = this;
            //渲染视图
            me.trigger('BEFORE_RENDER', me);
            me.render();
            if(!me.rendered && typeof bui !== 'undefined' && bui && bui.Template && me.main){
                var mainHTML = bui.Template.merge(bui.Template.getTarget(me.getView()), me.model.getData());
                me.main.innerHTML = mainHTML;
                me.rendered = true;
            }
            //渲染当前view中的控件
            bui.Control.init(me.main, me.model, me);
            me.trigger('AFTER_RENDER', me);
            
            //控件事件绑定
            me.initBehavior(me.controlMap);
            //me.checkAuthority();
            me.trigger('ACTION_READY', me);

            bui.Mask.hideLoading();
            bui.Master.checkNewRequest();
        
        callback&&callback();}, me);

        que.next();
    },
    /**
     * 初始化数据模型
     * 
     * @protected
     * @param {Object} argMap 初始化的参数.
     */
    initModel: function(callback){callback&&callback();},
    /**
     * 初始化视图[target的二次处理,如替换引用部分等]
     * 
     * @protected
     * @param {Object} argMap 初始化的参数.
     */
    initView: function(callback){callback&&callback();},
    
    /**
     * 绘制当前action的显示
     *
     * @protected
     * @param {HTMLElement} dom 绘制区域的dom元素.
     */
    render: function(){},
    
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap){},
    /**
     * 根据当前用户权限进行相应设置
     *
     */
    //checkAuthority: function(){},
    
    /**
     * 模型属性发生变化事件监听器
     *
     * @protected
     * @param {string} propertyName 属性名.
     * @param {Object} newValue 当前值.
     * @param {Object} oldValue 之前值.
     */
    onModelChanged: function(propertyName, newValue, oldValue) {},    
    /**
     * Action验证外部接口
     * 
     * @public
     */
    validate: function(){
        return bui.Control.prototype.validate.call(this);
    },
    /**
     * Action验证外部接口
     * 
     * @public
     */
    getParamMap: function(){
        return bui.Control.prototype.getParamMap.call(this);
    },
    /**
     * 验证并提交数据
     */
    validateAndSubmit: function() {
        
    },

    /**
     * 提交完成的事件处理函数,提示完成
     *
     * @private
     * @param {Object} data 提交的返回数据.
     */
    onsubmitfinished: function(data) {
        //cb.notice(data.message);
    },
    /**
     * 离开当前action，执行清理动作
     *
     * @protected
     */
        /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        var me = this,
            controlMap = me.controlMap,
            main = me.main,
            model = me.model;
        
        me.trigger('BEFORE_LEAVE', me);
        me.leave();
        
        // dispose子控件
        if (controlMap) {
            for (var k in controlMap) {
                controlMap[k].dispose();
                delete controlMap[k];
            }
        }
        me.controlMap = {};

        // 释放控件主区域的事件以及引用
        if (main) {
            main.onmouseover = null;
            main.onmouseout = null;
            main.onmousedown = null;
            main.onmouseup = null;
            
            if (main.innerHTML){
                main.innerHTML = '';
            }
            me.main = null;
        }
        
        if (model) {
            model.dispose();
            me.model = undefined;
        }
        
        me.rendered = null;
        me.trigger('LEAVE', me);
    },
    /**
     * 后退
     *
     * @protected
     */
    back: function() {
        bui.Master.back();
    },
    /**
     * 退出
     *
     * @public
     */
    leave: function() {}

};

bui.inherits(bui.Action, bui.EventDispatcher);
/**
 * Action的静态属性[索引Action]
 */
bui.Action.map = {};

/**
 * 通过Action类派生出action
 *
 * @param {Object} action 对象
 * @public
 */
bui.Action.derive = function(action){
    var me,
        i;
    //传进来的是function
    if (action.prototype) {
        bui.inherits(action, bui.Action);
        //实例化action
        action = new action();
    }
    //传进来的是一个单例object
    else {
        if(Object.prototype.toString.call(action) == '[object String]'){
            action = window[action];
        }
        
        me = new bui.Action();
        for (i in me) {
            if(action[i]==undefined) action[i] = me[i];
            
        }
    }
    
    //建立action的索引
    bui.Action.map[action.id] = action;
};

/**
 * 获取action
 * 获取控件用bui.Control.get(id, ctr||action)
 */
bui.Action.get = function(id){
    var map = bui.Action.map,
        action,
        i,
        cur;
    for (i in map) {
        if (map[i] && map[i].main && map[i].main.id == 'main') {
            cur = map[i];
        }
    }
    return (id !== undefined ? map[id] : cur);
};

