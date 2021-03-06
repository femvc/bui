'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    mockup.js
 * desc:    前端构造测试数据
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

bui.Mockup = {
    find: function(url) {
        return !!bui.Mockup.maps[url];
    },
    get: function(url, opt_options){
        var result = null,
            target = bui.Mockup.maps[url];
        
        //mockup是函数
        if (Object.prototype.toString.call(target)==='[object Function]') {
            target(url, opt_options);
        }
        //mockup是数组
        else if (Object.prototype.toString.call(target)==='[object Array]') {
            if (target.length>0) {
                opt_options['onsuccess'](target[(new Date()).getTime()%target.length])
            }
            else {
                opt_options['onsuccess'](target);
            }
        }
        //mockup是对象
        else if (Object.prototype.toString.call(target)==='[object Object]') {
            opt_options['onsuccess'](target);
        }
        //mockup不是字符串
        else if (typeof target != 'string') {
            opt_options['onsuccess'](target);
        }
        //mockup是字符串(url)的话直接返回
        else {
            result = target;
        }
        
        return result;
    },
    set: function(url, target){
        bui.Mockup.maps[url] = target;
    },
    remove: function(url){
        bui.Mockup.maps[url] = undefined;
    },
    clear: function(){
        bui.Mockup.maps = {};
    }
};
bui.Mockup.maps = {};

bui.Mockup.set('/book/list.action',  'mockup/book!list.json');
