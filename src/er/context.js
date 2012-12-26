'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    context.js
 * desc:    客户端状态保持器Seesion
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

bui.context = {
    context: {},
    get: function (k){
        return this.context[k];
    },
    set: function(k,v){
        if(k){
            this.context[k] = v;
        }
        return v;
    }
};

    
   



