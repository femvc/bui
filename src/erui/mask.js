'use strict';
/*
 * cb-web
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path:    ui/mask.js
 * desc:    页面遮盖控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-03-17 13:37:05 +0800 (周四, 17 三月 2011) $
 */

/**
 * 页面遮盖控件
 * 全局页面只需要一个遮盖层，所以为单例
 */
bui.Mask = (function() {
    var id = 'ui-mask',
        clazz = 'ui-mask',
        privateId;

    /**
     * 遮盖层初始化
     *
     * @private
     */
    function init() {
        var el = document.createElement('div');
        el.id = id;
        el.className = clazz;
        document.body.appendChild(el);
        return el;
    }

    /**
     * 重新绘制遮盖层的位置
     *
     * @private
     * @param {HTMLElement} mask 遮盖层元素.
     */
    function repaintMask(mask) {
        var width = Math.max(
                        document.documentElement.clientWidth,
                        Math.max(
                            document.body.scrollWidth,
                            document.documentElement.scrollWidth)),
            height = Math.max(
                        document.documentElement.clientHeight,
                        Math.max(
                            document.body.scrollHeight,
                            document.documentElement.scrollHeight));

        mask.style.width = width + 'px';
        mask.style.height = height + 'px';
    }

    /**
     * 页面大小发生变化的事件处理器
     *
     * @private
     */
    function resizeHandler() {
        repaintMask(getMask());
    }

    /**
     * 获取遮盖层dom元素
     *
     * @private
     * @return {HTMLElement} 获取到的Mask元素节点.
     */
    function getMask() {
        var mask = bui.g(id);
        if (!mask) {
            init();
        }
        return bui.g(id);
    }
    /**
     * 获取遮盖层dom元素
     *
     * @private
     * @return {HTMLElement} 获取到的Mask元素节点.
     */
    function getLoading() {
        var loading = bui.g('loadingDiv');
        if (!loading){
            loading = document.createElement('DIV');
            document.body.appendChild(loading);
            loading.className = 'loading_div';
            loading.id = 'loadingDiv';
            loading.innerHTML = bui.Template.merge(bui.Template.getTarget('loadingDiv'),bui.lang);
        }
        
        return loading;
    }
    
    return {
        /**
         * 显示遮盖层
         */
        'show': function(id) {
            privateId = privateId || id;

            var mask = getMask();
            repaintMask(mask);
            mask.style.display = 'block';
            
            if (window.addEventListener) {
                window.addEventListener('resize', resizeHandler, false);
            } else if (window.attachEvent) {
                window.attachEvent('on' + 'resize', resizeHandler);
               //此处使用回调函数call()，让 this指向elem
            }
        },

        /**
         * 隐藏遮盖层
         */
        'hide': function(id) {
            if (!privateId || id == privateId) {
                getMask().style.display = 'none';
                if (window.removeEventListener) {
                     window.removeEventListener('resize', resizeHandler, false);
                }
                if (window.detachEvent) {
                    window.detachEvent('on' + 'resize', resizeHandler);
                }
                privateId = null;
            }
        },
        showLoading: function(){
            var me = this;
            me.show();
            getLoading().style.display = 'block';
        },
        hideLoading: function(){
            var me = this;
            if (me.timer){
                window.clearTimeout(me.timer);
                me.timer = null;
            }
            me.hide();
            getLoading().style.display = 'none';
        }
    };
})();

