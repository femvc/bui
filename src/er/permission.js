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
        
    },
    /**
     * 检查用户跳转的目标URL是否有权限, 没有权限强制跳转到指定地址
     *
     * @desc 
     */
    checkRouter: function(url){
        return url;
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
        

    }
};
