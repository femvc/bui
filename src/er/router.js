'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    router.js
 * desc:    路由规则管理器
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
 
/** 
 * @fileoverview 在浏览器中，更改url“#”号后面的hash内容时，页面不会发生跳转重新请求。利用这个特点，可以在hash中记录历史和实现url敏感。
 * @author Baidu FE
 * @version 0.1 
 */


/**
 * Location变化监听器
 *
 * @namespace
 */
/** 
 * @引用依赖: 无
 * @对外接口: bui.Locator.findAction(loc) 根据loc返回对应的action
 * @对外接口: bui.Locator.init(modules) 根据传入的module初始化路由列表
 * @默认调用外部接口: 无
 */
///import bui;
bui.Router = {
    pathRules: [],
    /**
     * 根据location找到匹配的rule并返回对应的action
     *
     * @public
     * @param {String} loc 路径
     */
    findAction: function( loc ) {
        var me = this,
            pathRules = me.pathRules,
            i, len, matches, rule, props,
            action = null,
            actionClazz;
        //匹配所有符合表达式的路径
        for ( i=0,len=pathRules.length;i<len;i++ ) {
            rule = pathRules[ i ].location;
            if (rule && (rule instanceof RegExp) && ( matches = rule.exec( loc ) ) !== null ) {
                action = pathRules[ i ].action;
            }
        }
        //[优先]匹配单独具体路径
        for ( i=0,len=pathRules.length;i<len;i++ ) {
            rule = pathRules[ i ].location;
            if (rule && (typeof rule == 'string') && rule == loc ) {
                action = pathRules[ i ].action;
            }
        }
        
        if ( typeof action == 'string' ) {        
            action = bui.getObjectByName(action);
        }
        
        if (action instanceof Function) {
            action = new action();
            bui.Action.map[action.id] = action;
        }
        
        if ( !action || !action.enterAction ) { 
            throw new Error('Path "'+loc+'" not exist.'); 
        }
        
        return action;
    },
    /**
     * 设置rule
     *
     * @public
     * @param {String} rule 路径
     * @param {String} action 对应action
     */
    setRule: function ( rule, action ) {
        this.pathRules.push( {
            'location'  : rule,
            'action' : action
        } );
    },
    /**
     * 载入完成读取所有rule
     *
     * @protected
     * @param {String} rule 路径
     * @param {String} func 对应action
     */
    init: function ( modules ) {
        var me = this,
            i, len, j, len2,
            module, actions, actionConfig, 
            pathRules = {};
        if (!modules && bui && bui.Master && bui.Master.moduleContainer) {
            modules = bui.Master.moduleContainer;
        }
        if (modules && modules.length) {
            for ( i = 0, len = modules.length; i < len; i++) {
                module = modules[i];
                // 读取module的action配置
                actions = module.config.action;
                if (actions) {
                    for (j = 0, len2 = actions.length; j < len2; j++) {
                        actionConfig = actions[j];
                        
                        if ( actionConfig && actionConfig.location && actionConfig.action ) {
                            me.setRule( actionConfig.location, actionConfig.action );
                        }
                    }
                }
            }
        }
    },
    //错误处理
    error:function(msg){
        msg = 'error: ' + msg;
        if(window.console) {
            window.console.log(msg);
        }
        else throw Error(msg);
    }
};


