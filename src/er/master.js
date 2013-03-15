'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    master.js
 * desc:    控制器负责控制action跳转[包括多个action共存的情况]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
/** 
 * @引用依赖: 无
 * @对外接口: bui.Master.forward(url) 根据loc跳转到对应的action
 * @默认调用外部接口: action.enterAction() 进入指定action
 */
///import bui;
bui.Master = {
    historyList:[],
    newRequest: null,
    ready: true,
    checkNewRequest: function () {
        var me = this,
            url = me.newRequest;
        me.ready = true;
        if (url){
            me.newRequest = null;
            me.forward(url);
        }
    },
    //仅供redirect时调用,必须保证url对应的action是有效的,跳转过程中不操作url,不推荐外部直接调用!!!
    forward: function( url ) {
        var me = this,
            result, loc, args,
            action = null,
            preAction = null;
        
        if (bui.Permission && bui.Permission.checkRouter) {
            loc = bui.Permission.checkRouter(url);
            if( url != loc) {
                bui.redirect(loc); //action尚未开始渲染因此可以跳转!
                return ;
            }
        }
        
        //Action渲染过程中禁止跳转，否则容易造成死循环，缓存新请求。
        if (me.ready == false) { me.newRequest = url; }
        if (me.ready == true ) {
            result = me.parseLocator(url);
            loc  = result['location'];
            args = result['query'];
            
            // 首先销毁当前action的实例
            if(me.historyList[me.historyList.length-1]){
                me.disposeAction(me.parseLocator(me.historyList[me.historyList.length-1])['location']);
            }
            
            // 找到匹配的路径规则(该过程中会创建action实例)
            
            action = me.getActionInstance( me.findActionName(loc) ); /* me.getActionInstance参数可以接收'变量名'|'单例'|'Action子类' */
            
            if (action && action.enterAction) {
                //Action渲染过程中禁止跳转，否则容易造成死循环。
                me.ready = false;
                //时间不长则无需显示等待中
                //bui.Mask.timer = window.setTimeout('bui.Mask.showLoading()',300);
                bui.Mask.showLoading();
                
                me.historyList.push(url);
                action.enterAction(args);
            }
        }
    },
    back: function(){
        var me = this,
            result, loc,
            action = null;
        
        //有历史记录
        if ( me.historyList.length > 1 ){
            //当前action
            result = me.parseLocator(me.historyList.pop());
            loc  = result['location'];
            
            me.disposeAction(loc);
            
            me.ready = true;
            //后退一步
            bui.redirect(me.historyList.pop());
        }
        //无历史记录
        else {
            //当前action
            result = me.parseLocator(me.historyList[me.historyList.length-1]);
            loc  = result['location'];
            
            //跳转到指定后退location
            loc = me.disposeAction(loc);
            if (loc) {
                bui.redirect(loc);
            }
        }
    },
    /**
     * 根据loc找到action
     *
     * @private
     * @param {string} loc
     * @result {string} actionName
     */
    findActionName: function(loc) {
        var me = this,
            action = bui.Router.findAction(loc);
        if ( !action ) { 
            // 找不到对应Action
            if (window.console && window.console.error) {
                window.console.error('Path "'+loc+'" not exist.');
            }
            // 找不到则返回404
            if (loc !== '/404') {
                action = me.findActionName( '/404' );
            }
        }
        return action; 
    },
   /**
     * 根据loc找到action
     *
     * @private
     * @param {string} loc
     */
    disposeAction: function(loc) {
        var action = bui.Action.getByActionName(this.findActionName( loc )),/* bui.Action.getByActionName参数可以接收'变量名'|'单例'|'Action子类' */
            defaultBack = (action && action.BACK_LOCATION) ? action.BACK_LOCATION : null;
        
        if(action && action.dispose) {
            action.dispose();
        }
        
        return defaultBack;
    },
    /**
     * 返回对应action的实例
     *
     * @private
     * @param {Function||Object} action
     */
    getActionInstance: function(action) {
        if ( typeof action == 'string' ) {        
            action = bui.getObjectByName(action);
        }
        
        if (action instanceof Function) {
            action = bui.Action.getByActionName(action) || new action();
        }
        
        return action;
    },
    /**
     * 解析获取到的location字符串
     *
     * @private
     * @param {Object} loc
     */
    parseLocator: function(url) {
        url = url == null ? '' : String(url);
        var pair = url.match(/^([^~]+)(~(.*))?$/),
            loc = '', args = '',
            i, len, list, v;
        if (pair) {
            loc = pair[1];
            args = (pair.length == 4 ? pair[3] : '')||'';
        }
        
        list = args.split('&');
        args = {};
        for(i=0, len=list.length;i<len;i++){
            v = list[i].split('=');
            v.push('');
            args[v[0]] = v[1];            
        }

        return {'location':loc,'query':args};
    },
    /**
     * 初始化控制器,包括路由器和定位器locator
     *
     * @protected
     * @param {String} rule 路径
     * @param {String} func 对应action
     */
    init: function () {
        var me = this;
    }
};
