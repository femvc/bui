'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/button.js
 * desc:    按钮控件
 * author:  Baidu FE
 */

///import bui.Control;

/**
 * 按钮控件
 * 
 * @param {Object} options 控件初始化参数
 */
bui.Radio = function ( options ) {
    // 标识鼠标事件触发自动状态转换
    this.autoState = 0;    
    // 初始化参数
    this.initOptions(options);
    
    // 类型声明，用于生成控件子dom的id和class
    this.type = 'radio';

    
    

};

bui.Radio.prototype = {
    /**
     * 获取文本输入框的值
     *
     * @public
     * @return {string}
     */
    getValue: function() {
            return this.main.value;
    },

    /**
     * 设置文本输入框的值
     *
     * @public
     * @param {string} value
     */
    setValue: function(value) {
        this.main.value = value;
        if (value) {
            this.getFocusHandler()();
        } else {
            this.getBlurHandler()();
        }
    },

    /**
     * 设置输入控件的title提示
     *
     * @public
     * @param {string} title
     */
    setTitle: function(title) {
        this.main.setAttribute('title', title);
    },

    /**
     * 将文本框设置为不可写
     *
     * @public
     */
    disable: function(disabled) {
        if (typeof disabled === 'undefined') {
            disabled = true;
        }
        if (disabled) {
            this.main.disabled = 'disabled';
            this.setState('disabled');
        } else {
            this.main.removeAttribute('disabled');
            this.removeState('disabled');
        }
    },
    /**
     * 默认的onclick事件执行函数
     * 不做任何事，容错
     * @public
     */
    onclick: new Function(),
    
    /**
     * 渲染控件
     * 
     * @public
     */
    render: function () {
        // 初始化状态事件
        main.onclick = this.getHandlerClick();
    },
    
    /**
     * 获取按钮点击的事件处理程序
     * 
     * @private
     * @return {function}
     */
    getHandlerClick: function() {
        var me = this;
        return function ( e ) {
            if ( !me.isDisabled() ) {
                me.onclick();
            }
        };
    }
    
};

/*通过bui.Control派生bui.Button*/
bui.Control.derive(bui.Radio);

