'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/button.js
 * desc:    按钮控件
 * author:  Baidu FE
 */

/*
goog.require('ui.Control');
goog.provide('ui.Slider');
*/
/**
 * 滑动条控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
bui.Slider = function(options) {
    // 初始化参数
    this.initOptions(options);

    this.handlers = {};

    this.type = 'slider';
    this.range = this.range || [this.min, this.max];
};

bui.Slider.prototype = /** @lends {ui.Slider.prototype} */ {
    /**
     * 主显示区域的模板
     * @private
     */

    layout: 'horizontal',
    tplBody: '<div id="#{0}" class="#{1}" style="position:relative;height:100%;width:100%;" onclick="#{3}">#{2}</div>',
    tplThumb: '<div id="#{0}" class="#{1}" style="position:absolute;"></div>',
    tplProgressbar: "<div id='#{0}' class='#{1}' style='position:absolute; left:0px; top:0px;'>#{2}</div>",
    tplProgBody: '<div id="#{0}" class="#{1}">#{2}</div>',
    tplProgBar: '<div id="#{0}" class="#{1}"></div>',

    value: 0,
    min: 0,
    max: 100,
    disabled: false,
    _dragOpt: {},
    _axis: {
        horizontal: {
            mousePos: 'x',
            pos: 'left',
            size: 'width',
            clientSize: 'clientWidth',
            offsetSize: 'offsetWidth'
        },
        vertical: {
            mousePos: 'y',
            pos: 'top',
            size: 'height',
            clientSize: 'clientHeight',
            offsetSize: 'offsetHeight'
        }
    },
    init: function() {
        //this.main = this.main || document.createElement('DIV');
        //this.render();
    },
    getHtml: function() {
        var me = this;
        return bui.Control.format(me.tplBody,
            me.getId('body'),
            me.getClass('body'),
            bui.Control.format(me.tplThumb,
                me.getId('thumb'),
                me.getClass('thumb')
            ),
            "bui.Control.get('" + me.id + "')._mouseDown(event);"
        );
    },

    _mouseDown: function(e) {
        var me = this,
            mousePos = bui.Slider.getMousePosition(e),
            body = me.g(me.getId('body')),
            bodyPos = bui.Slider.getPosition(body),
            thumb = me.getThumb(),
            target = e;//baidu.event.getTarget(e);
        //if (target == thumb || baidu.dom.contains(thumb, target) || me.disabled) {
        //    return
        //}
        me._calcValue(mousePos.top - bodyPos.top - thumb.offsetHeight / 2);
        me.update();
        me.onslideclick();
    },

    render: function(opt_main) {
        var me = this;
        me.main = opt_main || me.main;
        

        me.main.innerHTML = me.getHtml();

        me._createThumb();
    },

    /**
     * 可拖拽标针
     *
     * @private
     */
    _createThumb: function() {
        var me = this,
            draggable;

        //拖拽参数
        me._dragOpt = {
            ondragend: function() {
               //me.slidedstop();
            },
            ondragstart: function() {
                //me.slidestart();
            },
            ondrag: function() {
                var axisType = me._axis[me.layout],
                    pos = me.getThumb().style[axisType.pos];
                me._calcValue(parseInt(pos));
                me.onslide();
            },
            range: [0, 0, 0, 0]
        };

        //更新拖拽范围
        me._updateDragRange();

        //设置标针可拖拽
        //draggable = baidu.dom.draggable(me.getThumb(), me._dragOpt);
    },

    /**
     * 设置拖拽范围
     *
     * @param g
     */
    _updateDragRange: function(newRange) {
        var me = this,
            layout = me._axis[me.layout],
            range = newRange || me.range,
            opt_range = me._dragOpt.range,
            thumb = me.getThumb();
        range = [Math.max(Math.min(range[0], me.max), me.min), Math.max(Math.min(range[1], me.max), me.min)];
        if (me.layout.toLowerCase() == 'horizontal') {
            opt_range[1] = me._parseValue(range[1], 'fix') + thumb[layout.offsetSize];
            opt_range[3] = me._parseValue(range[0], 'fix');
            opt_range[2] = thumb.clientHeight;
        } else {
            opt_range[0] = me._parseValue(range[0], 'fix');
            opt_range[2] = me._parseValue(range[1], 'fix') + thumb[layout.offsetSize];
            opt_range[1] = thumb.clientWidth;
        }
    },

    update: function() {
        var me = this,
            layout = me._axis[me.layout],
            thumb;
        me._updateDragRange();
        me._adjustValue();
        thumb = me.getThumb();
        thumb.style[layout.pos] = me._parseValue(me.value, 'pix') + 'px';
        me.onslide();
    },

    _adjustValue: function() {
        var me = this,
            range = me.range;
        me.value = Math.max(Math.min(me.value, range[1]), range[0]);
    },
    _calcValue: function(value) {
        var me = this;
        me.value = me._parseValue(value, 'value');
        me._adjustValue();
    },
    _parseValue: function(value, type) {
        var me = this,
            layout = me._axis[me.layout],
            body = me.g(me.getId() + 'body'),
            len = body[layout.clientSize] - me.getThumb()[layout.offsetSize];
        if (type == 'value') {
            value = (me.max - me.min) / len * value + me.min;
        } else {
            value = Math.round(len / (me.max - me.min) * (value - me.min));
        }
        return value;
    },
    getValue: function() {
        return this.value;
    },
    getTarget: function() {
        var me = this;
	    return me.g(me.targetId);
    },
    getThumb: function() {
        var me = this;
	    return me.g(me.getId('thumb'));
    },
    onslide: function() {},
    onslideclick: function() {},
    /**
     * 将控件填充到容器元素
     *
     * @public
     * @param {HTMLElement} container 容器元素.
     */
    appendTo: function(wrap) {
        if (this.main) {
            return;
        }
        var main = document.createElement('div');
        wrap.appendChild(main);
        this.render(main);
    }
};

/*
 * 获取目标元素元素相对于整个文档左上角的位置
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {Object}
 *   {
 *       left:xx,//{integer} 页面距离页面左上角的水平偏移量
 *       top:xx //{integer} 页面距离页面坐上角的垂直偏移量
 *   }
 */
bui.Slider.getPosition = function(obj) {
    var pos = {'left': 0, 'top': 0};

    if (obj == null)
    return null;
    
    var mendingObj = obj;
    var mendingLeft = mendingObj.offsetLeft;
    var mendingTop = mendingObj.offsetTop;
    
    while (mendingObj != null && mendingObj.offsetParent != null && mendingObj.offsetParent.tagName != "BODY") {
        mendingLeft = mendingLeft + mendingObj.offsetParent.offsetLeft;
        mendingTop = mendingTop + mendingObj.offsetParent.offsetTop;
        mendingObj = mendingObj.offsetParent;
    }
    pos.left = mendingLeft;
    pos.top = mendingTop;

    
    return pos;
};

bui.Slider.getMousePosition = function(ev) {
    if(ev.pageX || ev.pageY){
    return {left:ev.pageX, top:ev.pageY};
    }
    return {
        left:ev.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) - document.body.clientLeft,
        top:ev.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)  - document.body.clientTop        
    };
}



/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.Slider);
/* bui.Slider 继承了 bui.Control */
bui.inherits(bui.Slider, bui.Control);