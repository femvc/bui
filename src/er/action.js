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

///import bui;
bui.Action = function(){
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
    this.model = {};
    /**
     * Action的顶层控件容器
     *
     * @public
     * @return {Map}
     */
    this.controlMap = {};
};

bui.Action.prototype = {
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
            //创建一个异步队列    
            que = bui.asyque();
        
        me.args = args;
        
        //默认创建一个DIV作为主元素
        que.push(function(callback){
            if(!me.main && document && document.createElement){
                if(bui.g('main')) {
                    me.main = bui.g('main');
                }else{
                    me.main = document.createElement('DIV');
                    document.body.appendChild(me.main);
                }
            }
            me.main.action = me;
            
            callback&&callback();
        });
        
        //action的enter接口,使用者自己的实现,默认为空函数
        que.push(me.enter,me);
        
        que.push(function(callback){
            var k;
            // 先将PARAM_MAP中的key/value装入model
            for(k in me.PARAM_MAP){ if(k){ me.model[k] = me.PARAM_MAP[k]; }}
            //初始化Model
            for(k in me.args){ if(k){ me.model[k] = me.args[k]; }}
            
            callback&&callback();
        });
        
        que.push(me.initContext,me);
        que.push(me.initModel,me);
        //初始化View
        que.push(me.initView,me);
        //渲染视图
        que.push(me.beforeRender,me);
        que.push(me.render,me);
        
        que.push(function(callback){
            if(!me.rendered && typeof bui !== 'undefined' && bui && bui.Template && me.main){
                var mainHTML = bui.Template.merge(bui.Template.getTarget(me.getView()), me.model);
                me.main.innerHTML = mainHTML;
                me.rendered = true;
            }
            //渲染当前view中的控件
            bui.Control.init(me.main, me.model, me);
            
            callback&&callback();
        });
        
        que.push(me.afterRender,me);
        
        //控件事件绑定
        que.push(function(callback){
            me.initBehavior(me.controlMap);
            me.checkAuthority();
            me.onready();

            bui.Mask.hideLoading();
            bui.Controller.checkNewRequest();

            callback&&callback();
        });

        que.next();
    },
    /**
     * 进入Action后的预处理函数[支持异步]
     *
     * @prtected
     * @param {Object} argMap 初始化的参数[通过url传过来的参数].
     * @param {Function} callback 初始化完成的回调函数.
     */
    initContext: function(callback) {
        var me = this,
            getters = me['CONTEXT_INITER_LIST'],
            i = -1,
            len = getters ? getters.length : 0;

        // 开始初始化action指定的context
        repeatCallback();
        /**
         * Context初始化的回调函数
         * @private
         */
        function repeatCallback() {
            i++;

            if (i < len) {
                me[getters[i]].call(me, me.args, repeatCallback);
            } else {
                callback.call(me);
            }
        }
    }, 
    /**
     * 进入action时的外部接口
     *
     * @public
     * @param {Object} argMap 通过url传过来的参数表.
     */
    enter : function(callback){callback&&callback();},
   
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
     * 渲染开始事件接口
     *
     * @protected
     */    
    beforeRender: function(callback){callback&&callback();},
    
    /**
     * 渲染结束事件接口
     *
     * @protected
     */
    afterRender: function(callback){callback&&callback();},
    
    /**
     * 绘制当前action的显示
     *
     * @protected
     * @param {HTMLElement} dom 绘制区域的dom元素.
     */
    render: function(callback){callback&&callback();},
    
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
    checkAuthority: function(){},
    /**
     * Action初始化完毕事件接口.
     */
    onready: function(){},
    
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
            main = me.main;

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

        me.rendered = null;
    },
    /**
     * 后退
     *
     * @protected
     */
    back: function() {
        bui.Controller.back();
    }
};
/**
 * Action的静态属性
 */
bui.Action.map = {};
/**
 * 继承Action
 */
bui.Action.derive = function(action){
    var me,i;
    
    if(Object.prototype.toString.call(action) == '[object String]'){
        action = window[action];
    }
    if(action.id){
        bui.Action.map[action.id] = action;
    }
    
    me = new bui.Action();
    for(i in me){
        if(action[i]==undefined) action[i] = me[i];
    }
    
    return action;
};
/**
 * 获取action
 * 获取控件用bui.Control.get(ids,ctr||action)
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



