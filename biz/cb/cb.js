'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    demo.js
 * desc:    BUI是一个富客户端应用的前端MVC框架[源于ER框架]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
//业务模块全局对象
var cb = {};

/**
* 
* 读取用户单词列表
*/
cb.loadUsersWordsList = function(data){
    if (!bui.context.get('user_name')) bui.context.set('user_name','user');
    if (data.success == 'true'){
        var usersWordsLists = data.result;
        bui.context.set('usersWordsLists', _.array.buildIndex(_.array.sortBy(usersWordsLists,'list_id','desc')));
        bui.context.set('sysWordsLists', data.syslist);
    }
    if (bui.context.get('user_name') && cb.loadUserInfo.callback) {
        cb.loadUserInfo.callback();
        cb.loadUserInfo.callback = null;
    }
};
/**
* 
* 读取用户名
* 
* @type {callback}
*/
cb.loadUserInfo = function(data){
    if (!bui.context.get('sysWordsLists')) bui.context.set('sysWordsLists', []);
    if (data.success == 'true'){
        bui.context.set('user_id',data.result.user_id);
        bui.context.set('user_name',data.result.username);
        bui.context.set('userInfo',_.clone(data.result));
    }
    
    if (bui.context.get('sysWordsLists') && cb.loadUserInfo.callback) {
        cb.loadUserInfo.callback();
        cb.loadUserInfo.callback = null;
    }
};

function str2img2(str) {
    var src = 'common/img/yinbiao/';
    var lenStr = str.length;
    var rsString    = "";
    for (var i=0;i<lenStr;i++) {
        var theChar   = str.substr(i,1);
        if (theChar == " ") {
            rsString += " ";
        } else if (theChar == "&"||theChar == "]"||theChar == "[") {
        
        } else if (theChar == "-") {
            rsString += "<img src=\""+src+"zhonggangxian.png\" border=\"0\" />";
        } else if (theChar == "]") {
            rsString += "<img src=\""+src+"fangkh-y.gif\" border=\"0\" />";
        } else if (theChar == "[") {
            rsString += "<img src=\""+src+"fangkh-z.gif\" border=\"0\" />";
        } else if (theChar == "_") {
            rsString += "<img src=\""+src+"/xiahuaxian.png\" border=\"0\" />";
        } else if (theChar == ".") {
            rsString += "<img src=\""+src+"dian.png\" border=\"0\" />";
        } else if (theChar == ",") {
            rsString += "<img src=\""+src+"douhao.gif\" border=\"0\" />";
        } else if (theChar == ";") {
            rsString += "<img src=\""+src+"fenhao.gif\" border=\"0\" />";
        } else if (theChar == "`") {
            rsString += "<img src=\""+src+"5.png\" border=\"0\" />";
        } else if (theChar == ":") {
            rsString += "<img src=\""+src+"maohao.png\" border=\"0\" />";
        } else if (theChar == "\\") {
            rsString += "<img src=\""+src+"xiexian.png\" border=\"0\" />";
        } else if (theChar == "/") {
            rsString += "<img src=\""+src+"fanxiexian.png\" border=\"0\" />";
        } else if (theChar == "?") {
            rsString += "<img src=\""+src+"wenhao.png\" border=\"0\" />";
        } else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(theChar)!=-1) {
            rsString += "<img src=\""+src+theChar+theChar+".png\" border=\"0\" />";
        } else{
            rsString += "<img src=\""+src+theChar+".png\" border=\"0\" />";
        }
    }

    rsString = '<img src="'+src+'fangkh-z.gif" alt="" />' + rsString + '<img src="'+src+'fangkh-y.gif" alt="" />';
    return rsString;
}    


bui.Locator.DEFAULT_INDEX = '/login';

/*默认为未登录状态*/
bui.context.set('logout', 'false');

bui.beforeinit = function(callback){
    //cb.loadUserInfo.callback = callback;
    callback();
    //Requester.post('/users/info.action','params=params',     cb.loadUserInfo); 
    //Requester.post('/lists/query.action','params=params',    cb.loadUsersWordsList); 
};
