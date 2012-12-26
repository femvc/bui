'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/label.js
 * desc:    标签显示控件
 * author:  Baidu FE
 * date:    $Date: 2011-05-20 10:30:37 +0800 (周五, 20 五月 2011) $
 */

/**
 * 标签显示控件
 *
 * @param {Object} options 控件初始化参数.
 */
bui.Label = function(options) {
    // 初始化参数
    this.initOptions(options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'label';
};

bui.Label.prototype = {
    /**
     * 渲染控件
     *
     * @param {Object} main 控件挂载的DOM.
     */
    render: function(main) {
        var me = this;
        //me.main = main;
        if (me.main && me.text !== undefined) {
            me.main.innerHTML = me.text;
        }
    },
    /**
     * 设置文字
     *
     * @param {Object} main 控件挂载的DOM.
     */
    setValue: function(txt) {
        var me = this;
        //me.main = main;
        if (me.main) {
            txt = String(txt);
            me.main.innerHTML = txt;
            me.value = txt;
            me.text = txt;
        }
    },
    /**
     * 获取value
     *
     * @param {Object} main 控件挂载的DOM.
     */
    getValue: function() {
        //me.main = main;
        return (this.value || this.text);
    }
};

/*通过bui.Control派生bui.Button*/
bui.Control.derive(bui.Label);
