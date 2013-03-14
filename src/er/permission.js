'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    permission.js
 * desc:    权限管理器
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

/**
 * 权限管理器
 *
 * @desc 权限管理器为页面提供了是否允许访问的权限控制，也能通过isAllow方法判断是否拥有权限。.
 */
bui.Permission = {
    priorityList: {
        'expiration':{
            '/login':1,
            '/supplyusername':1,
            '/supplyrandnum':1,
            '/supplyanswer':1,
            '/changepsw':1,
            '/recharge':1   
        },
        'logout':{
            '/login':1,
            '/supplyusername':1,
            '/supplyrandnum':1,
            '/supplyanswer':1,
            '/changepsw':1,
            '/activate':1
        }
    },
    /**
     * 检查用户跳转的目标URL是否有权限, 没有权限强制跳转到指定地址
     *
     * @desc 
     */
    checkRouter: function(url){
        var loc = bui.Master.parseLocator(url)['location'];
        if (bui.context.get('logout') == 'true' && !bui.Permission.priorityList.logout[loc]){
            return '/login';
        }
        else if (bui.context.get('expiration') == 'true' && !bui.Permission.priorityList.expiration[loc]){
            return '/recharge';
        }
        else {
            return url;
        }
    },
    /**
     * 检查被请求的URL用户是否有权限
     *
     * @desc 
     */
    checkRequest: function(url, opt_options){
        //todo
        return 'permit'; //default 'permit'
    },
    /**
     * 更新用户权限状态
     *
     * @desc 
     */
    updateStatus: function(data){
        if (data && data.success == 'false' && data['status'] == 'logout'){
            bui.context.set('logout', 'true');
        }
        else if (bui.context.get('logout') != 'false') {
            bui.context.set('logout', 'false');
            //请求未处理完就发新请求容易导致死循环
            //Requester.post('/users/info.action','params=params',     cb.loadUserInfo);                
        }
        if (data && data.success == 'false' && data['status'] == 'expiration'){
            bui.context.set('expiration', 'true');
        }
        else if (bui.context.get('expiration') != 'false') {
            bui.context.set('expiration', 'false');
            //请求未处理完就发新请求容易导致死循环
            //Requester.post('/lists/query.action','params=params',    cb.loadUsersWordsList); 
        }

    }
};
