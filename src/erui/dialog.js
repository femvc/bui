'use strict';
/*
 * cb-web
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path:    ui/Dialog.js
 * desc:    对话框控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-10-25 18:10:03 +0800 (周二, 25 十月 2011) $
 */

/**
 * 对话框控件
 *
 * @param {Object} options 控件初始化参数.
 */
bui.Dialog = function(options) {
    this.initOptions(options);
    this.type = 'dialog';
    this.top = this.top || 137;

    //[重要!!]在这里创建HTMLElement是因为main为null是不会进入render
    if (!this.main){
        this.main = document.createElement('DIV');
    }
    //判断是否属于某个Action
    if(this.parentAction && this.parentAction.main){
        this.parentAction.main.appendChild(this.main);
    }else{
        // 如果不属于Action则挂载到body
        document.body.appendChild(main);
    }
    
    this.controlMap = {};
};

bui.Dialog.prototype = {
    /**
     * 对话框主体的html模板
     * @private
     */
    tplBody: '<div class="#{1}" id="#{0}" #{2}>#{3}</div>',
    /**
     * 对话框尾部的html模板
     * @private
     */
    tplFoot: '<div class="#{1}" id="#{0}" #{2}>#{3}</div>',

    /**
     * 对话框头部的html模板
     * @private
     */
    tplHead: '<div id="#{0}" class="#{1}"><div class="ui-dialog-icon"></div><div id="#{2}" class="#{3}">#{4}</div>#{5}</div>',

    /**
     * 关闭按钮的html模板
     * @private
     */
    tplClose: '<div class="#{0}" id="#{1}" onclick="#{2}"  onmouseover="#{3}" onmouseout="#{4}">&nbsp;</div>',

    /**
     * 显示对话框
     *
     * @public
     */
    show: function() {
        var main = this.getDOM();
        if (!main) {
            this.render();
        }
        bui.Mask.show();
        main.style.display = 'block';
    },

    /**
     * 隐藏对话框
     *
     * @public
     */
    hide: function() {
        var main = this.getDOM();
        main.style.display = 'none';
        bui.Mask.hide();
        this.onclose();
    },

    /**
     * 设置标题文字
     *
     * @param {string} html 要设置的文字，支持html.
     */
    setTitle: function(html) {
        var el = bui.g(this.getId('title'));
        if (el) {
            el.innerHTML = html;
        }
        this.title = html;
    },

    /**
     * 设置内容
     *
     * @param {string} content 要设置的内容，支持html.
     */
    setContent: function(content) {
        var body = this.getBody();
        if (body) {
            body.innerHTML = content;
        }
    },
    /**
     * 设置底部内容
     *
     * @param {string} content 要设置的内容，支持html.
     */
    setFoot: function(content) {
        var foot = this.getFoot();
        if (foot) {
            foot.innerHTML = content;
        }
    },
    
    close: function() {
        this.hide();
    },

    onclose: new Function(),

    /**
     * 绘制对话框
     *
     * @public
     */
    render: function(options) {
        var me = this,
            main = me.main;
        
        me.initOptions(options);
        
        bui.Control.addClass(main, me.getClass());

        // 设置样式
        if (me.width) {
            main.style.width = me.width + 'px';
            main.style.marginLeft = (-me.width/2) + 'px';
        }
        main.style.display = 'none';
        bui.Mask.show();
        main.style.display = 'block';
        
        // 写入结构
        main.innerHTML = me.getHeadHtml()
                       + me.getBodyHtml();

        // hideFooter则不显示foot
        if (!me.hideFooter) {
            main.innerHTML += me.getFootHtml();
        }

        //渲染对话框
        bui.Control.init(me.main,(me.parentAction||{}).model,me.getAction());
    },

    /**
     * 获取对话框头部的html
     *
     * @private
     * @return {string}
     */
    getHeadHtml: function() {
        var me = this,
            head = 'head',
            title = 'title',
            close = 'close';

        return bui.Control.format(me.tplHead,
                            me.getId(head),
                            me.getClass(head),
                            me.getId(title),
                            me.getClass(title),
                            me.title,
                            (me.closeButton === false ? '' :
                                bui.Control.format(me.tplClose,
                                         me.getClass(close),
                                         me.getId(close),
                                         "bui.Control.get('"+me.id+"','"+me.getAction().id+"').close()",
                                         me.getStrCall('closeOver'),
                                         me.getStrCall('closeOut')))
                            );
    },

    /**
     * 获取对话框主体的html
     *
     * @private
     * @param {string type 类型，body|foot
     * @return {string}
     */
    getBodyHtml: function() {
        var me = this;
        return bui.Control.format(me.tplBody,
                            me.getId('body'),
                            me.getClass('body'),
                            'style=""',
                            bui.Template.merge(bui.Template.getTarget(me.contentView),(me.parentAction||{}).model));
    },
    /**
     * 获取对话框底部的html
     *
     * @private
     * @param {string type 类型，body|foot
     * @return {string}
     */
    getFootHtml: function() {
        var me = this;
        return bui.Control.format(me.tplFoot,
                            me.getId('foot'),
                            me.getClass('foot'),
                            'style=""',
                            bui.Template.merge(bui.Template.getTarget(me.footView),(me.parentAction||{}).model));
    },
    /**
     * 获取对话框主体的dom元素
     *
     * @public
     * @return {HTMLElement}
     */
    getBody: function() {
        return bui.g(this.getBodyId());
    },

    getBodyId: function() {
        return this.getId('body');
    },

    /**
     * 获取对话框腿部的dom元素
     *
     * @public
     * @return {HTMLElement}
     */
    getFoot: function() {
        return bui.g(this.getId('foot'));
    },

    /**
     * 获取对话框dom元素
     *
     * @public
     * @return {HTMLElement}
     */
    getDOM: function() {
        return bui.g(this.getId());
    },

    /**
     * 获取close按钮元素
     *
     * @private
     * @return {HTMLElement}
     */
    getClose: function() {
        return bui.g(this.getId('close'));
    },

    /**
     * 鼠标移上close按钮的handler
     *
     * @private
     */
    closeOver: function() {
        bui.Control.addClass(this.getClose(),
                       this.getClass('close-hover'));
    },

    /**
     * 鼠标移出close按钮的handler
     *
     * @private
     */
    closeOut: function() {
        bui.Control.removeClass(this.getClose(),
                          this.getClass('close-hover'));
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        if (this.main) {
            this.main.innerHTML = '';
            var parentNode = this.main.parentNode;
            if(parentNode){
                parentNode.removeChild(this.main);
            }
            this.main = undefined;
        }
    }
};

/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.Dialog);
/* bui.Dialog 继承了 bui.Control */
bui.inherits(bui.Dialog, bui.Control);