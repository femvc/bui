'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/combobox.js
 * desc:    组合框控件
 * author:  Baidu FE
 */

///import bui.Control;

/**
 * 组合框控件
 * 
 * @param {Object} options 控件初始化参数
 */
bui.ComboBox = function ( options ) {
    // 标识鼠标事件触发自动状态转换
    this.autoState = 0;    
    // 初始化参数
    this.initOptions(options);    // 类型声明，用于生成控件子dom的id和class
    
    // 类型声明，用于生成控件子dom的id和class
    this.type = 'combobox';
    
};

bui.ComboBox.prototype = {
    /**
     * 获取文本输入框的值
     *
     * @public
     * @return {string}
     */
    getValue: function() {
         var me = this,
             value = me.value != undefined ? me.value : me.main.value,
             option;
         if (me.main.tagName.toLowerCase()=='select') {
             if (me.main.options.length>0) {
                 option = me.main.options[me.main.selectedIndex];
                 value =  option.getAttribute('value') !== undefined ? option.value : option.text;
             }
         }
         return value;
    },

    /**
     * 设置文本输入框的值
     *
     * @public
     * @param {string} value
     */
    setValue: function(value) {
        //this.main.value = value;
        
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
        
    }
    
};

/*通过bui.Control派生bui.Button*/
bui.Control.derive(bui.ComboBox);

