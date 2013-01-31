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
bui.Button = function ( options ) {
    // 标识鼠标事件触发自动状态转换
    this.autoState = 1;    
    // 初始化参数
    this.initOptions(options);    // 类型声明，用于生成控件子dom的id和class
 
    // 类型声明，用于生成控件子dom的id和class
    this.type = 'button';
    
};

bui.Button.prototype = {
    /**
     * button的html模板
     *
     * @private
     */
    tplButton: '<button type="button" id="#{2}" class="#{1}">#{0}</button>',
    
    /**
     * 默认的onclick事件执行函数
     * 不做任何事，容错
     * @public
     */
    onclick: new Function(),
    
    /**
     * 获取button主区域的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        var me = this;
        
        return bui.Control.format(
            me.tplButton,
            me.content || '&nbsp;',
            me.getClass( 'label' ),
            me.getId( 'label' )
        );
    },

    /**
     * 设置是否为Active状态
     * 
     * @public
     * @param {boolean} active active状态
     */
    setActive: function ( active ) {
        var state = 'active';

        if ( active ) {
            this.setState( state );
        } else {
            this.removeState( state );
        }
    },
    
    /**
     * 渲染控件
     * 
     * @public
     */
    render: function () {
        var me   = this;
        var main = me.main;
        var innerDiv;
        
        if ( !me.isRendered ) {
            innerDiv = main.firstChild;
            if (!me.content 
                && innerDiv 
                && innerDiv.tagName != 'DIV'
            ) {
                me.content = main.innerHTML;
            }
            
            main.innerHTML = me.getMainHtml();

            // 初始化状态事件
            main.onclick = me.getHandlerClick();

            me.isRendered = true;
        }

        // 设定宽度
        me.width && (main.style.width = me.width + 'px');
        
        // 设置disabled
        me.setDisabled( me.disabled );
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
    },
    
    /**
     * 设置按钮的显示文字
     * 
     * @public
     * @param {string} content 按钮的显示文字
     */
    setContent: function ( content ) {
        bui.g( this.getId( 'label' ) ).innerHTML = content;
    },
    /**
     * 设置按钮的显示文字
     * 
     * @public
     * @param {string} content 按钮的显示文字
     */
    showWaiting: function(){
        
    }
};

/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.Button);
/* bui.Button 继承了 bui.Control */
bui.inherits(bui.Button, bui.Control);


