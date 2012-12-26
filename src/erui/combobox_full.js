'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ComboBox.js
 * desc:    组合框
 * author:  zhaolei,erik
 * date:    $Date: 2012-01-13 13:42:38 +0800 (周五, 13 一月 2012) $
 */


/**
 * 组合框控件
 *
 * @param {Object} options 参数.
 */
bui.ComboBox = function(options) {
    // 初始化事件
    this.initOptions(options);
    this.type = 'combobox';
    this.form = 1;

    this.emptyLabel = '<div class="' + this.getClass('cur-def') + '">请选择</div>';
    this.offsetSize = '-10000px';

    this.index = -1;
    this.maxItem = 10;
};

bui.ComboBox.prototype = {
    // 主体部分模板
    tplMain: '<div id="{0}" class="{1}" value="" style="width:{4}px"><nobr>{2}</nobr></div><div class="{3}"></div>',

    onselect: new Function(),

    /**
     * 获取主体部分HTML
     *
     * @return {string}
     */
    getMainHtml: function() {
        var me = this,
            ds = me.ds;

        return baidu.format(me.tplMain,
                            me.getId('cur'),
                            me.getClass('cur'),
                            me.emptyLabel,
                            me.getClass('btn'),
                            me.width - 20);
    },

    appendTo: function(container) {
        var main = document.createElement('div');
        container.appendChild(main);
        this.render(main);
    },

    /**
     * 绘制控件
     *
     * @param {HTMLElement} main 外部容器.
     */
    render: function(main) {
        var me = this;

        // FIXME: 有options和datasource两个东西容易出bug.
        this.options = this.datasource || this.options || [];

        ui.Base.render.call(me, main, true);
        if (me.main) {
            me.formName = me.main.getAttribute('name');
            me.main.style.width = me.width + 'px';
            me.main.innerHTML = me.getMainHtml();

            me.renderLayer();
            me.setReadOnly(!!me.readOnly);

        }

        if (baidu.lang.hasValue(me.value)) {
            me.setValue(me.value);
        }
    },

    /**
     * 绘制下拉列表
     *
     */
    renderLayer: function() {
        var me = this,
            layerId = me.getId('layer'),
            layer,
            len = me.options.length,
            maxItem = me.maxItem,
            itemHeight;

        layer = bui.g(layerId);
        if (!layer) {
            layer = document.createElement('div');
            layer.id = me.getId('layer');
            layer.className = me.getClass('layer');
            layer.style.top = me.offsetSize;
            layer.style.left = me.offsetSize;
            layer.style.width = me.width + 'px';
            layer.setAttribute('control', me.id);
            document.body.appendChild(layer);

            // 挂载全局事件管理器
            me.layerController = me.getLayerController();
            bui.on(document, 'click', me.layerController);
        }

        layer.innerHTML = me.getLayerHtml();

        if (len > maxItem) {
            itemHeight = baidu.dom.children(layer)[0].offsetHeight;
            layer.style.height = maxItem * (itemHeight + 1) + 'px';
        }


        // TODO:页面resize的时候需要调整浮动层的位置
    },

    // Layer中每个选项的模板
    tplItem: '<div id="{0}" {9} class="{1}" index="{2}" value="{3}" dis="{4}" cmd="select" onmouseover="{6}" onmouseout="{7}" style="width:{10}px">{8}<nobr class="{11}">{5}</nobr></div>',
    // Item中图标层的模板
    tplIcon: '<span class="{0}"></span>',
    // Item中强调部分的模板
    tplHighlight: '<span class="{0}"></span>',

    /**
     * 获取下拉列表层的HTML
     *
     * @return {string}
     */
    getLayerHtml: function() {
        var me = this,
            options = me.options,
            i = 0,
            len = options.length,
            html = [],
            basicClass = me.getClass('item'),
            itemClass,
            dis,
            item,
            strRef = me.getStrRef(),
            iconClass,
            iconHtml,
            highlightClass,
            titleTip;

        for (; i < len; i++) {
            itemClass = basicClass;
            dis = 0;
            item = options[i];
            iconHtml = '',
            highlightClass = '';

            // 初始化icon的HTML
            if (item.icon) {
                iconClass = me.getClass('icon-' + item.icon);
                iconHtml = baidu.format(me.tplIcon, iconClass);
            }

            if (item.highlight) {
                highlightClass = 'hot-right';
            }

            // 初始化基础样式
            if (item.style) {
                itemClass += ' ' + basicClass + '-' + item.style;
            }

            // 初始化不可选中的项
            if (item.disabled) {
                dis = 1;
                itemClass += ' ' + basicClass + '-disabled';
            }

            // 初始化选中样式
            if (item.value == me.value) {
                itemClass += ' ' + me.getClass('item-selected');
            }
            if (me.titleTip) {
                titleTip = 'title="' + item.text + iconHtml + '"';
            }

            html.push(
                baidu.format(me.tplItem,
                    me.getId('item') + i,
                    itemClass,
                    i,
                    item.value,
                    dis,
                    item.text,
                    strRef + '.itemOverHandler(this)',
                    strRef + '.itemOutHandler(this)',
                    iconHtml,
                    titleTip,
                    me.width - 12,
                    highlightClass
                    ));
        }

        return html.join('');
    },

    /**
     * 设置控件为readOnly
     *
     * @public
     * @param {Object} readOnly
     */
    setReadOnly: function(readOnly) {
        readOnly = !!readOnly;
        this.readOnly = readOnly;

        readOnly ? this.setState('readonly') : this.removeState('readonly');
    },

    /**
     * 捕获列表的事件
     *
     */
    getLayerController: function() {
        var me = this;

        return function(e) {
            if (me.getState('disabled')) {
                return;
            }

            e = e || window.event;
            var tar = e.target || e.srcElement;

            while (tar && tar.nodeType === 1) {
                var val = tar.getAttribute('control'),
                    index = tar.getAttribute('index'),
                    tarId = me.getId('item') + index;

                if (tar.getAttribute('cmd') == 'select' && tarId == tar.id) {
                    if (tar.getAttribute('dis') == 1) {
                        if (me.disabledItemTipId) {
                            baidu.show(me.disabledItemTipId);
                            window.setTimeout(function() {baidu.hide(me.disabledItemTipId);},3000);
                        }
                    } else {
                        me.hideLayer();
                        me.selectByIndex(parseInt(index, 10), true);
                    }
                    return;
                } else if (val == me.id) {
                    if (!me.readOnly && tar.id == me.getId()) {
                        me.toggleLayer();
                    }
                    return;
                }
                tar = tar.parentNode;
            }

            me.hideLayer();
        };
    },

    /**
     * 显示层
     *
     */
    showLayer: function() {
        var me = this,
            main = me.main,
            mainPos = baidu.dom.getPosition(main),
            layer = me.getLayer(),
            pageVHeight = baidu.page.getViewHeight(),
            layerVHeight = mainPos.top
                         + main.offsetHeight
                         + layer.offsetHeight
                         - baidu.page.getScrollTop(),
            layerTop;
        if (pageVHeight > layerVHeight) {
            layerTop = mainPos.top + main.offsetHeight;
        } else {
            layerTop = mainPos.top - layer.offsetHeight;
        }

        layer.style.top = layerTop + 'px';
        layer.style.left = mainPos.left + 'px';
        me.setState('active');
    },

    /**
     * 隐藏层
     *
     */
    hideLayer: function() {
        var me = this,
            layer = me.getLayer();
        if (layer) {
            layer.style.left = me.offsetSize;
            layer.style.top = me.offsetSize;
        }
        me.removeState('active');
    },

    /**
     * 开|关 层的展示
     *
     */
    toggleLayer: function() {
        var me = this;
        if (me.getLayer().style.left != me.offsetSize) {
            me.hideLayer();
        } else {
            me.showLayer();
        }
    },

    /**
     * 获取list部分的DOM元素
     *
     * @return {HTMLElement}
     */
    getLayer: function() {
        return bui.g(this.getId('layer'));
    },

    /**
     * 获取ComboBox当前选项部分的DOM元素
     *
     * @return {HTMLElement}
     */
    getCur: function() {
        return baidu.G(this.getId('cur'));
    },

    /**
     * 获取当前ComboBox选中的值
     *
     * @return {string}
     */
    getValue: function() {
        // FIX #854
        if (null == this.main) {
            return '';
        }
        if (baidu.lang.hasValue(this.value)) {
            return this.value;
        }
        return '';
    },

    /**
     * 设置数据来源
     *
     * @param {Array} datasource 列表数据源.
     */
    setDataSource: function(datasource) {
        this.options = datasource || this.options;
    },

    /**
     * 获取数据源
     *
     * @return {Array}
     */
    getDataSource: function() {
        return this.options || [];
    },

    /**
     * 根据值选择选项
     *
     * @param {string} value 值.
     */
    setValue: function(value) {
        var me = this,
            layer = me.getLayer(),
            items = layer.getElementsByTagName('div'),
            item;

        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i].getAttribute('value');
            if (item == value) {
                me.selectByIndex(i);
                return;
            }
        }

        me.value = '';
        me.index = -1;
        me.selectByIndex(-1);
    },

    /**
     * 根据索引选择选项
     *
     * @param {number} index 选项的索引序号.
     * @param {boolean} isDispatch 是否发送事件.
     */
    selectByIndex: function(index, isDispatch) {
        var selected = this.options[index],
            value;

        if (!selected) {
            value = null;
        } else {
            value = selected.value;
        }


        this.index = index;
        this.value = value;

        if (isDispatch === true && this.onselect(value, selected) === false) {
            return;
        }

        this.repaint();
    },

    /**
     * 重绘控件
     *
     */
    repaint: function() {
        var selected = this.options[this.index],
            word = selected ? selected.text : this.emptyLabel,
            el = this.getCur();

        el.title = baidu.string.stripTags(word);
        el.innerHTML = '<nobr>' + word + '</nobr>';

        this.repaintLayer();
    },

    /**
     * 重绘选项列表层
     *
     */
    repaintLayer: function() {
        var me = this,
            index = me.index,
            first = me.getLayer().firstChild,
            selectedClass = me.getClass('item-selected');

        while (first) {
            if (first.getAttribute('index') == index) {
                baidu.addClass(first, selectedClass);
                //me.getCur().innerHTML = first.innerHTML;
            } else {
                baidu.removeClass(first, selectedClass);
            }
            first = first.nextSibling;
        }
    },

    /**
     * 选项移上事件
     *
     * @param {HTMLElement} item 选项.
     */
    itemOverHandler: function(item) {
        if (item.getAttribute('dis') == 1) {
            return;
        }

        var index = item.getAttribute('index');
        baidu.addClass(this.getId('item') + index, this.getClass('item') + '-hover');
    },

    /**
     * 选项移开事件
     *
     * @param {HTMLElement} item 选项.
     */
    itemOutHandler: function(item) {
        var index = item.getAttribute('index');
        baidu.removeClass(this.getId('item') + index, this.getClass('item') + '-hover');
    },

    /**
     * 设置为disabled
     *
     * @public
     */
    disable: function(disabled) {
        this.hideLayer();
        if (disabled) {
            this.setState('disabled');
        } else {
            this.removeState('disabled');
        }
    },

    /**
     * 销毁控件
     *
     */
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
    dispose: function() {
        var me = this;
        me.layerController && baidu.un(document, 'click', me.layerController);
        baidu.dom.remove(me.getLayer());
        ui.Base.dispose.call(me);
    }
};

/*通过bui.Control派生bui.Button*/
bui.Control.derive(bui.ComboBox);
