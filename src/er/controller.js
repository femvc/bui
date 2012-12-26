'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    controller.js
 * desc:    控制器负责控制action跳转[包括多个action共存的情况]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
/** 
 * @引用依赖: 无
 * @对外接口: bui.Controller.forward(url) 根据loc跳转到对应的action
 * @默认调用外部接口: bui.Router.findAction( loc ) 根据loc返回对应的action
 * @默认调用外部接口: action.enterAction() 进入指定action
 */
///import bui;
bui.Controller = {
    historyList:[],
    newRequest: null,
    ready: true,
    moduleContainer: [],
    checkNewRequest: function () {
        var me = this;
        me.ready = true;
        if (me.newRequest){
            me.forward(me.newRequest);
        }
    },
    //仅供redirect时调用,跳转到指定url对应的action,不操作url,不推荐外部直接调用!!!
    forward: function( url ) {
        var me = this,
            result, loc, args,
            action = null,
            preAction = null;
        
        if (bui.Permission && bui.Permission.checkRouter) {
            loc = bui.Permission.checkRouter(url);
            if( url != loc) {
                bui.redirect(loc);
                return '';
            }
        }
        
        if (me.ready == false) { me.newRequest = url; }
        if (me.ready == true ) {
            me.ready = false;
            
            result = me.parseLocator(url);
            loc  = result['location'];
            args = result['query'];
            
            //找到匹配的路径规则
            if ( bui.Router && bui.Router.findAction){
                action = bui.Router.findAction( loc );
            }
            
            if(action && action.enterAction) {
                //时间不长则无需显示等待中
                //bui.Mask.timer = window.setTimeout('bui.Mask.showLoading()',300);
                bui.Mask.showLoading();
                
                if(me.historyList[me.historyList.length-1]){
                    preAction = bui.Router.findAction( me.parseLocator(me.historyList[me.historyList.length-1])['location'] );
                    if(preAction && preAction.dispose) {
                        preAction.dispose();
                    }
                }
                me.historyList.push(url);
                action.enterAction(args);
            }
            //Action渲染过程中禁止跳转
            else {
                me.ready = true;
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
            
            action = bui.Router.findAction( loc );
            if(action && action.dispose) {
                action.dispose();
            }
            bui.Controller.ready = true;
            //后退一步
            bui.redirect(me.historyList.pop());
        }
        //无历史记录
        else {
            //当前action
            result = me.parseLocator(me.historyList[me.historyList.length-1]);
            loc  = result['location'];
            
            action = bui.Router.findAction( loc );
            if(action && action.dispose && action.BACK_LOCATION) {
                action.dispose();
                //跳转到指定后退location
                bui.redirect(action.BACK_LOCATION);
            }
        }
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
     * 添加模块
     *
     * @public
     * @param {Object} module 注册的模块.
     */
    addModule: function(module) {
        this.moduleContainer.push(module);
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
