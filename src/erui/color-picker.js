'use strict';
/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ColorPicker.js
 * desc:    日历月份显示单元
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 21:45:10 +0800 (五, 06 五月 2011) $
 */

/*
goog.require('bui.Control');
goog.provide('bui.ColorPicker');
*/

/**
 * 基本颜色选择器
 * @constructor
 * @extends {bui.Control}
 * @param {Object} options 控件初始化参数.
 */
bui.ColorPicker = function(options) {
    this.initOptions(options);
    this.type = 'colorPicker';
};

bui.ColorPicker.prototype = /** @lends {bui.ColorPicker.prototype} */ {
    /**
     * 拾色器的模板
     * @private
     */
    tplPickerBody: '<div id="#{0}" class="#{1}">#{2}</div>',
    colors: ('ff8080,ffff80,80ff80,00ff80,80ffff,0080f0,ff80c0,ff80ff,ff0000,ffff00,80ff00,00ff40,00ffff,0080c0,8080c0,ff00ff,804040,ff8040,00ff00,008080,004080,8080ff,800040,ff0080,800000,ff8000,008000,008040,0000ff,0000a0,800080,8000ff,400000,804000,004000,004040,000080,000040,400040,400080,000000,808000,808040,808080,408080,c0c0c0,400040,FFFFFF').split(','),
    tplColorCell: '<a href="javascript:;" id="#{0}" style="#{1}" a="a" class="#{2}" onclick="#{3}"></a>',

    gridSize: 8,

    /**
     * 选择某色块单元
     *
     * @param colorHex：hex色值，如“FFFFFF”
     */
    choose: function(colorHex) {
        var me = this;
        if (this.onselect(colorHex)) {
            me.paintSelected(colorHex);
        }
    },

    /**
     * 绘制当前选择颜色
     *
     * @param colorHex
     */
    paintSelected: function(colorHex) {
        var me = this,
            selectedClass = me.getClass('selected'),
            item;

        if (me.color) {
            item = me.g(me.getItemId(me.color));
            item && baidu.removeClass(item, selectedClass);
        }

        if (colorHex) {
            me.color = colorHex;
            item = me.g(me.getItemId(colorHex));
            item && baidu.addClass(item, selectedClass);
        }
    },

    /**
     * 获取色块的html
     *
     */
    getColorCellHtml: function(colorHex) {
        var me = this;
        return bui.Control.format(me.tplColorCell,
            me.getId(colorHex),
            'background-color:#' + colorHex,
            me.getClass('color'),
            "bui.Control.get('" + me.id + "').choose('" + colorHex + "');"
        );
    },
    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     * @this {bui.ColorPicker}
     */
    getColorPickerHtml: function() {
        var me = this,
            html = ['<table border="0" cellpadding="0" cellspacing="5" class="' +
                    me.getClass('main') + '">'],
            index = 0,
            tIndex,
            tLen = this.gridSize,
            cLen = this.colors.length;
        while (index < cLen) {
            html.push('<tr>');
            for (tIndex = 0; tIndex < tLen; tIndex++) {
                html.push('<td>', me.getColorCellHtml(me.colors[index]), '</td>');
                index++;
            }
            html.push('</tr>');
        }
        html.push('</table>');
        return html.join('');
    },

    /**
     * 绘制控件
     *
     * @param opt_main: 挂载dom
     */
    render: function(opt_main) {
        var me = this;
        if (opt_main && opt_main.tagName !== 'DIV') {
           return;
        }
        me.main = opt_main || me.main;
        me.main.innerHTML = me.getColorPickerHtml();

    },

    /**
     * 对外接口，执行色块选择时需要的操作
     *
     *
     */
    onselect: function() {},
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

/*通过bui.Control派生*/
bui.Control.derive(bui.ColorPicker);
