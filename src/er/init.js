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

//载入语言文件
YAML.fromURL('locales/zh-CN.yml', function(data) {
    var i, lang = bui.lang;
    for(i in data){
        if( i != null ){
            lang[i] = data[i];
        }
    }
});
                                        

/**
 * 预处理程序
 * 
 * @private
 */
bui.init = function(){
    var que = new bui.asyque();
    
    /**
     * before事件外部接口
     * 
     * @public
     */
    if (bui.beforeinit) {
        que.push(bui.beforeinit);
    }
    /**
     * 载入预定义模板文件
     * 
     * @private
     */
    if (bui.Template && bui.Template.loadTemplate && bui.config && bui.config.TEMPLATE_LIST) {
        que.push(function(callback){
            bui.Template.loadTemplate();
            bui.Template.onload = callback;
        });
    }
    
    que.push(bui.Template.finishLoad);
    /**
     * afterinit事件外部接口，在bui.Template.finishLoad之后执行
     * 
     * @public
     */
    if (bui.afterinit) {
        que.push(bui.afterinit);
    }
    
    que.next();
}

bui.afterinit = function(callback){
    //Todo
    callback();
};

/**
 * 模板载入完毕之后,初始化路由列表,启动location侦听
 * 
 * @private
 */
bui.Template.finishLoad = function(callback){
    callback&&callback();

    //防止onload再次执行
    if (bui.config) {
        bui.config.loadedCount = -100000;
        delete bui.config.loadedCount;
    }
    
    //2.初始化路由列表
    if ( bui.Router && bui.Router.init){
        bui.Router.init();
    }
    //3.启动location侦听
    if ( bui.Locator && bui.Locator.init){
        //默认首次进入的路径
        bui.Locator.init();
    }
};
