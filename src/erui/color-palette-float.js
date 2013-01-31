'use strict';
/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MultiCalendar.js
 * desc:    多日期选择器
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-03 16:51:44 +0800 (二, 03 五月 2011) $
 *
 */

/**
 * 漂浮样式颜色选择器
 * @constructor
 * @extends {bui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
bui.FloatColorPalette = function(options) {
    this.initOptions(options);    // 类型声明，用于生成控件子dom的id和class
    this.form = 1;
    // 类型声明，用于生成控件子dom的id和class
    this.type = 'floatcolorpalette';


    // 创建子控件对象：日历部件与按钮
    var id = this.id;


    // 声明按钮文字
    this.okStr = '确定';
    this.cancelStr = '取消';


    // 偏向大小
    this.offsetSize = '-10000px';


};

bui.FloatColorPalette.prototype = {
    /**
     * 主显示区域的模板
     * @private
     */
    tplMain: '<div id="#{0}" class="#{1}"></div>#<input type="text" id="#{2}" class="#{3}" value="#{4}" maxlength="6" readonly="readonly">',

    /**
     * 获取取消按钮的点击handler
     *
     * @private
     * @return {Function}
     */
    getCancelHandler: function() {
        var me = this;
        return function() {
            me.hideLayer();
        };
    },

    /**
     * 获取确定按钮的点击handler
     *
     * @private
     * @return {Function}
     */
    getOkHandler: function() {
        var me = this;
        return function() {
            var colorPalette = me.controlMap[me.id + 'colorPalette'];
            var value = colorPalette.getColor();

            if (me.onselect(value) !== false) {
                me.cvalue = value;
                me.value = value;
                bui.g(me.getId('input')).value = value.toUpperCase();
                me.repaintMain();
                me.hideLayer();
            }
        };
    },

    onselect: function() {},

    /**
     * 重新绘制main区域
     *
     * @private
     */
    repaintMain: function() {
        var me = this, 
            showGrid = bui.g(me.getId('point'));
        showGrid.style.backgroundColor = '#' + this.value;
    },

    /**
     * 绘制控件
     *
     * @public
     * @param {HTMLElement} main 控件元素.
     */
    render: function(opt_main) {
        var me = this,
            main = opt_main || me.main;

        me.formName = main.getAttribute('name');

        if (main && main.tagName !== 'DIV') {
            return;
        }

        me.cvalue = me.value;
        if (!(/^[0-9a-fA-F]{3,3}([0-9a-fA-F]{3,3})?$/.test(me.value))) {
            me.value = 'ffffff';
        }

        me.main.innerHTML = me.getMainHtml();
        me.repaintMain();
        me.renderLayer();


        //绑定事件
        //bui.g(me.getId('input')).onkeyup = bui.fn(me._onInputChange, me);
    },

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        var me = this,
            input = 'input',
            color = me.getValue();
        return bui.Control.format(me.tplMain,
                            me.getId('point'),
                            me.getClass('point'),
                            me.getId(input),
                            me.getClass(input),
                            color);
    },
    _onInputChange: function() {
        var me = this,
            input = bui.g(me.getId('input'));
        var newValue = input.value;

        me.cvalue = newValue;
        if (!(/^[0-9a-fA-F]{3,3}([0-9a-fA-F]{3,3})?$/.test(newValue))) {
            newValue = 'ffffff';
        }
        if (newValue.length == 3) {
           newValue = [newValue.charAt(0), newValue.charAt(0),
                       newValue.charAt(1), newValue.charAt(1),
                       newValue.charAt(2), newValue.charAt(2)].join('');
        }

        me.value = newValue;
        me.repaintMain();
        if (bui.g(me.getId('layer'))) {
            me.repaintLayer();
        }

    },
    /**
     * 绘制浮动层
     *
     * @private
     */
    renderLayer: function() {
        var me = this, id = me.id,
            layerId = me.getId('layer'),
            layer = bui.g(layerId),
            value = me.value,
            foot, btn,
            okButton = bui.Control.create('Button', {'id': id + 'ok',content:'ok'}),
            cancelButton = bui.Control.create('Button', {'id': id + 'cancel',content:'cancel'});


        cancelButton.onclick = this.getCancelHandler();
        okButton.onclick = this.getOkHandler();
        if (layer) {
            me.repaintLayer();
            return;
        }
        // 初始化浮动层div属性
        layer = document.createElement('div');
        layer.className = me.getClass('layer');
        layer.id = layerId;
        layer.style.left = me.offsetSize;
        layer.style.top = me.offsetSize;
        layer.setAttribute('control', me.id);

        // 绘制浮动层的腿部
        foot = document.createElement('div');
        foot.className = me.getClass('foot');
        foot.id = me.getId('foot');

        foot.appendChild(okButton.main);
        foot.appendChild(cancelButton.main);
        me.controlMap[okButton.id] = okButton;
        me.controlMap[cancelButton.id] = cancelButton;


        // 将浮动层+到页面中
        document.body.appendChild(layer);

        // 绘制浮动层内的选色板部件
        me.renderColorPaletteView();

        // 将腿部加到浮动层中
        layer.appendChild(foot);

        //this.addChild(okButton);
        //this.addChild(cancelButton);

        // 挂载浮动层的全局点击关闭
        me.layerController = me.getLayerController();
        bui.on(document, 'click', me.layerController);
    },


    /**
     * 获取浮动层关闭器
     *
     * @private
     * @return {Function}
     */
    getLayerController: function() {
        var me = this;
        return function(e) {
            e = e || window.event;
            var tar = e.target || e.srcElement;
            while (tar && tar.nodeType === 1) {
                if (tar.id == me.getId('point')) {
                    me.toggleLayer();
                    return;
                } else if (tar.id == me.getId('input')) {
                    return;
                } else if (tar.id == me.getId('layer')) {
                    return;
                }
                tar = tar.parentNode;
            }
            me.hideLayer();
        };
    },

    /**
     * 显示|隐藏 浮动层
     *
     * @private
     */
    toggleLayer: function() {
        var me = this;
        if (this.getLayer().style.left != this.offsetSize) {
            me.hideLayer();
        } else {
            me.showLayer();
        }
    },

    /**
     * 隐藏浮动层
     *
     * @private
     */
    hideLayer: function() {
        var layer = this.getLayer();
        layer.style.left = this.offsetSize;
        layer.style.top = this.offsetSize;
        this.removeState('active');
    },

    /**
     * 显示浮动层
     *
     * @private
     */
    showLayer: function() {
        var me = this,
            main = me.main,
            pos = bui.Slider.getPosition(main),
            pageWidth = 800,//baidu.page.getWidth(),
            layer = me.getLayer(),
            value = me.value,
            layerLeft;

        // 创建临时存储变量
        me.tempValue = value;
        // 更新浮动层显示颜色
        me.view = value;
        me.repaintLayer();
        if (pageWidth < (pos.left + layer.offsetWidth)) {
            layerLeft = pos.left + main.offsetWidth - layer.offsetWidth + 'px';
        } else {
            layerLeft = pos.left + 'px';
        }
        layer.style.left = layerLeft;
        layer.style.top = pos.top + main.offsetHeight + 'px';
        this.setState('active');
    },

    /**
     * 获取浮动层元素
     *
     * @private
     * @return {HTMLElement}
     */
    getLayer: function() {
        var me = this;
        return bui.g(me.getId('layer'));
    },

    /**
     * 重新绘制layer
     *
     * @private
     */
    repaintLayer: function() {
        var me = this;
        var colorPat = me.controlMap[me.id + 'colorPalette'];
        if (colorPat) {
            colorPat.repaintColor(me.value);
        } else {
           return false;
        }
    },

    /**
     * 绘制浮动层内的选色板部件
     *
     * @private
     */
    renderColorPaletteView: function() {
        var me = this,
            id = me.id,
            view = me.view,
            colorPaletteView = bui.Control.create('ColorPalette', {
                'id': id + 'colorPalette',
                'color': me.value
            });

        colorPaletteView.onselect = me.getSelectHandler();

        bui.g(me.getId('layer')).appendChild(colorPaletteView.main);
        me.controlMap[colorPaletteView.id] = colorPaletteView;
        // 重新绘制日历部件
        bui.g(me.getId('layer')).appendChild(colorPaletteView.main);
    },

    /**
     * 获取日历选择的事件handler
     *
     * @private
     * @return {Function}
     */
    getSelectHandler: function() {
        var me = this;
        return function(value) {
            me.tempValue = value;
        };
    },
    /**
     * 获取当前选取的颜色
     *
     * @public
     * @return {string}
     */
    getValue: function() {
        return this.cvalue;
    },

    /**
     * 设置当前选取的颜色
     *
     * @public
     * @param {Date} date 选取的日期.
     */
    setValue: function(color) {
        this.cvalue = color;
        if (!(/^[0-9a-fA-F]{3,3}([0-9a-fA-F]{3,3})?$/.test(color))) {
            color = 'ffffff';
        }
        this.value = color;
        this.repaintMain();
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        document.body.removeChild(bui.g(this.getId('layer')));
        
        bui.un(document, 'click', this.layerController);
        bui.Control.prototype.dispose.call(this);
    },
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
    },
    /**
     * 表单验证接口
     *
     * @public
     */
    validate: function() {
        if (!this['rule']) {
            return true;
        }
        return bui.util.validate(this, this['rule']);
    },
    /**
     * 设置为disabled
     *
     * @public
     */
    disable: function(disabled) {
        if (disabled) {
            this.setState('disabled');
        } else {
            this.removeState('disabled');
        }
    }
};

/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.FloatColorPalette);
/* bui.FloatColorPalette 继承了 bui.Control */
bui.inherits(bui.FloatColorPalette, bui.Control);