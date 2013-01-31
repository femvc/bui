'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/form.js
 * desc:    按钮控件
 * author:  Baidu FE
 */

/*
 * cb-web
 * Copyright 2012 cb-web. All rights reserved.
 *
 * path:    bui/Form.js
 * desc:    按钮控件
 * author:  erik
 */

///import bui.Control;

/**
 * 按钮控件
 * 
 * @param {Object} options 控件初始化参数
 */
bui.Form = function ( options ) {
    // 标识鼠标事件触发自动状态转换
    this.autoState = 0;    
    // 初始化参数
    this.initOptions(options);    // 类型声明，用于生成控件子dom的id和class
    
    this.type = 'button';
};

bui.Form.prototype = {
    
    /**
     * 渲染控件
     * 
     * @public
     */
    render: function (main) {
        var me = this;
        //渲染对话框
        
    }
};

/*通过bui.Control派生bui.Form*/
//bui.Control.derive(bui.Form);
/* bui.Form 继承了 bui.Control */
bui.inherits(bui.Form, bui.Control);
