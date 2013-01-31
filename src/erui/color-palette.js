'use strict';
/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ColorPalette.js
 * desc:    选色板控件
 * author:  lixiang05
 * date:    $Date: 2011-06-06 21:45:10 +0800 (一, 06 六月 2011) $
 */

/*
goog.require('bui.Control');

goog.include('css/ui-colorPalette.css');

goog.provide('bui.ColorPalette');
*/

/**
 * 选色板控件
 * @constructor
 * @extends {bui.Control}
 * @param {Object} options 控件初始化参数.
 */
bui.ColorPalette = function(options) {
    this.initOptions(options);
    this.type = 'colorPalette';
    this.hex = this.color || 'FFFFFF';
    this.hue = 360;
    this.saturation = 100;
    this.brightness = 100;
    this.sliderDotY = 0;
    this.padDotY = 0;
    this.padDotX = this.sliderLength;
};



bui.ColorPalette.prototype = /** @lends {bui.ColorPalette.prototype} */ {
    /**
     * 拾色板的模板
     * @private
     */
    tplPaletteBody: '<div id="#{0}" class="#{1}">#{2}#{3}#{4}#{5}</div>',
    tplPad: '<div id="#{0}" class="#{1}"><div id="#{2}" class="#{3}"></div>#{4}</div>',
    tplSlider: '<div id="#{0}" class="#{1}"></div>',
    tplColorPicker: '<div id="#{0}" class="#{1}"></div>',
    tplPadDot: '<div id="#{0}" hhhh class="#{1}" onmousedown="#{2}"></div>',
    tplColorValueShow: '<div id="#{0}" class="#{1}">' +
                     '<div id="#{2}" class="#{3}">' +
                       '<div id="#{4}" class="#{5}"></div>' +
                       '<div id="#{6}" class="#{7}"></div>' +
                     '</div>' +
                     '#{8}' +
                   '</div>',
    tplHexRgbHsb: '<div id="#{0}" class="#{1}">' +
                    '<span id="#{2}" class="#{3}"></span>' +
                    '<span id="#{4}" class="#{5}"></span>' +
                    '<span id="#{6}" class="#{7}"></span>' +
                    '<span id="#{8}" class="#{9}"></span>' +
                    '<span id="#{10}" class="#{11}"></span>' +
                    '<span id="#{12}" class="#{13}"></span>' +
                  '</div>',
    sliderLength: 256,
    coverImgSrc: '',
    sliderImgSrc: '',

    /**
     * 获取选择板主html
     *
     * @returns
     */
    getPaletteHtml: function() {
        var me = this;
        return bui.Control.format(me.tplPaletteBody,
            me.getId(),
            me.getClass(),
            me._getPadString(),
            me._getSliderString(),
            me._getColorPickerString(),
            me._getHexHBSShowString()
        );
    },

    /**
     * 绘制色板背景图
     *
     * @private
     */
    _setColorImgs: function() {
        var me = this,
            cover = me._getCover(),
            sbody = me._getSliderBody();
        me._setBackgroundImg(cover, me.coverImgSrc);
        me._setBackgroundImg(sbody, me.sliderImgSrc);
    },

    /**
     * 绘制色板实色背景图
     *
     * @private
     */
    _setBackgroundImg: function(cover, imgSrc) {
        if (!imgSrc) {
            return;
        }
        cover.backgroundImage ='url(' + imgSrc + ')';
    },

    /**
     * 绘制色板透明背景图
     *
     * @private
     */
    _setFilterImg: function(cover, imgSrc) {
        if (!imgSrc) {
            return;
        }
        cover.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + imgSrc + '", sizingMethod="crop")';
    },

    /**
     * 获取色板html
     *
     * @private
     */
    _getPadString: function() {
        var me = this;
        return bui.Control.format(me.tplPad,
            me.getId('pad'),
            me.getClass('pad'),
            me.getId('cover'),
            me.getClass('cover'),
            me._getPadDotString()
        );
    },

    /**
     * 获取选色锚点html
     *
     * @private
     */
    _getPadDotString: function() {
        var me = this;
        return bui.Control.format(me.tplPadDot,
            me.getId('padDot'),
            me.getClass('padDot'),
            'kkkkkk'//me.getStrCall('_onPadDotMouseDown')
        );
    },

    /**
     * 获取选择滑块html
     *
     * @private
     */
    _getSliderString: function() {
        var me = this;
        return bui.Control.format(me.tplSlider,
                me.getId('sliderMain'),
                me.getClass('sliderMain')
        );
    },

    /**
     * 获取简单取色器控件模板
     */
    _getColorPickerString: function() {
        var me = this;
        return bui.Control.format(me.tplColorPicker,
                me.getId('colorPickerMain'),
                me.getClass('colorPickerMain')
        );
    },

    /**
     * 获取色值显示区html
     *
     * @returns
     */
    _getHexHBSShowString: function() {
        var me = this;
        return bui.Control.format(me.tplColorValueShow,
            me.getId('colorShow'),
            me.getClass('colorShow'),
            me.getId('colorHexThumb'),
            me.getClass('colorHexThumb'),
            me.getId('colorThumb'),
            me.getClass('colorThumb'),
            me.getId('colorHexValue'),
            me.getClass('colorHexValue'),
            me._getRGBHSBString()
        );
    },

    /**
     * 获取RGB，HSB色值显示区html
     *
     * @returns
     */
    _getRGBHSBString: function() {
        var me = this;
        return bui.Control.format(me.tplHexRgbHsb,
            me.getId('colorHSBRGBShow'),
            me.getClass('colorHSBRGBShow'),
            me.getId('rgbR'),
            me.getClass('rgbR'),
            me.getId('rgbG'),
            me.getClass('rgbG'),
            me.getId('rgbB'),
            me.getClass('rgbB'),
            me.getId('HbsH'),
            me.getClass('HbsH'),
            me.getId('HbsB'),
            me.getClass('HbsB'),
            me.getId('HbsS'),
            me.getClass('HbsS')
        );
    },

    /**
     * 创建滑块
     *
     * @private
     */
    _createSlider: function() {
        var me = this,
            body = me._getSliderMain();
        var slider = bui.Control.create('Slider', {
            id: me.getId('slider'),
            main: body,
            layout: 'vertical',
            min: 0,
            max: me.sliderLength,
            value: me.sliderDotY,
            onslide: function() {
                me.synColorBySlider(this.value);
            },
            onslideclick: function() {
                me.synColorBySlider(this.value);
            }
        });
        me.controlMap[slider.id] = slider;
        //this.addChild(slider);
        //slider.render(body);
        //slider.main = body;
        //this.addChild(slider);
        //slider.appendTo(body);

    },

    /**
     * 创建基本色彩选择器
     *
     * @private
     */
    _createColorPicker: function() {
        var me = this,
            body = me._getColorPickerMain();
        var colorPicker = bui.Control.create('ColorPicker', {
            id: me.getId('colorPicker'),
            main: body,
            color: me.hex,
            onselect: function(colorHex) {
               me.hex = me._CutHex(colorHex);
               me.repaintColor(colorHex);
            }
        });
        me.controlMap[colorPicker.id] = colorPicker;
        
    },

    /**
     * 色板锚点击事件
     *
     * @private
     */
    _onPadDotMouseDown: function() {
        var me = this,
            pad = me._getPad(),
            position = bui.Slider.getPosition(pad);
        me.padTop = position.top;
        me.padLeft = position.left;
        me._movePadDotHandler = bui.fn('_onPadDotMouseMove', me);
        me._upPadDotHandler = bui.fn('_onPadDotMouseUp', me);
        bui.on(document, 'mousemove', me._movePadDotHandler);
        bui.on(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 色板锚移动事件
     *
     * @private
     */
    _onPadDotMouseMove: function(target) {
        target = target || event;
        var me = this,
            p = bui.Slider.getMousePosition(target),
            x = p.left,//baidu.event.getPageX(target),
            y = p.top;//baidu.event.getPageY(target);
        me.padDotY = me._adjustValue(me.sliderLength, y - me.padTop);
        me.padDotX = me._adjustValue(me.sliderLength, x - me.padLeft);

        me.saturation = parseInt(100 * me.padDotX / 256, 10);
        me.brightness = parseInt(100 * (256 - me.padDotY) / 256, 10);

        var hex = me._HSBToHex({
            h: me.hue,
            s: me.saturation,
            b: me.brightness
        });
        me.hex = hex;
        var rgbArray = me._HexToRGB(me.hex);
        me.red = rgbArray[0];
        me.green = rgbArray[1];
        me.blue = rgbArray[2];

        me.setPadDot(me.padDotY, me.padDotX);
        me._updateShowColor();
    },

    /**
     * 确定色板选择点位置
     *
     * @private
     * @param [padTop, padLeft]: 选择点的绝对定位top， left
     */
    setPadDot: function(padTop, padLeft) {
        var me = this,
            padDot = me._getPadDot();
        padDot.style.top = padTop + 'px';
        padDot.style.left = padLeft + 'px';
    },

    /**
     * 更新色值信息
     *
     * @private
     */
    _updateShowColor: function() {
        var me = this,
            thumb = me.g(this.getId('colorThumb')),
            colorHex = me.g(me.getId('colorHexValue')),
            colorRGBR = me.g(me.getId('rgbR')),
            colorRGBG = me.g(me.getId('rgbG')),
            colorRGBB = me.g(me.getId('rgbB')),
            colorHBSH = me.g(me.getId('HbsH')),
            colorHBSB = me.g(me.getId('HbsB')),
            colorHBSS = me.g(me.getId('HbsS'));
        thumb.style.backgroundColor = me._getHex();
        colorHex.innerHTML = (me._getHex()).toUpperCase();
        colorRGBR.innerHTML = me.red;
        colorRGBG.innerHTML = me.green;
        colorRGBB.innerHTML = me.blue;
        colorHBSH.innerHTML = me.hue;
        colorHBSB.innerHTML = me.saturation;
        colorHBSS.innerHTML = me.brightness;
    },


    /**
     * 调整色值
     *
     * @private
     */
    _adjustValue: function(sliderLength, padDotPos) {
        return Math.max(0, Math.min(sliderLength, padDotPos));
    },

    /**
     * 色板锚鼠标抬起事件
     *
     * @private
     */
    _onPadDotMouseUp: function() {
        var me = this;
        if (!me._movePadDotHandler) {
            return;
        }
        bui.un(document, 'mousemove', me._movePadDotHandler);
        bui.un(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 色板点击事件
     *
     * @private
     */
    _onPadClick: function(target) {
        var me = this,
            pad = me._getPad(),
            pos = bui.Slider.getPosition(pad);
        me.padTop = pos.top;
        me.padLeft = pos.left;
        me._onPadDotMouseMove(target);
    },

    /**
     * 获取Slider控件外框
     *
     * @private
     */
    _getSliderMain: function() {
        var me = this;
        return me.g(me.getId('sliderMain'));
    },

    /**
     * 获取colorPicker控件外框
     *
     * @private
     */
    _getColorPickerMain: function() {
        var me = this;
        return me.g(me.getId('colorPickerMain'));
    },

    /**
     * 获取colorPicker控件主体
     *
     * @private
     */
    _getSliderBody: function() {
        return this.controlMap[this.getId('slider')].main;
    },

    /**
     * 获取slider滑块html
     *
     * @private
     */
    _getSliderDot: function() {
        return this.controlMap[this.getId('slider')].getThumb();
    },

    /**
     * 获取选色板html
     *
     * @private
     */
    _getPad: function() {
        var me = this;
        return me.g(me.getId('pad'));
    },

    /**
     * 获取选色点html
     *
     * @private
     */
    _getPadDot: function() {
        var me = this;
        return me.g(me.getId('padDot'));
    },

    /**
     * 获取选色板蒙版html
     *
     * @private
     */
    _getCover: function() {
        var me = this;
        return me.g(me.getId('cover'));
    },

    /**
     * 根据滑块位置计算色值
     *
     * @private
     * @param int sliderDotY 滑块距Slider顶部距离.
     */
    synColorBySlider: function(sliderDotY) {
        var me = this,
            pad = me._getPad();
        me.sliderDotY = sliderDotY;
        me.hue = parseInt(360 * (me.sliderLength - sliderDotY) / me.sliderLength, 10);
        var hex = me._HSBToHex({
            h: me.hue,
            s: me.saturation,
            b: me.brightness
        });
        me.hex = hex;

        var rgbArray = me._HexToRGB(me.hex);
        me.red = rgbArray[0];
        me.green = rgbArray[1];
        me.blue = rgbArray[2];

        pad.style.backgroundColor = '#' + me._HSBToHex({
            h: me.hue,
            s: 100,
            b: 100
        });

        //TODO 提供给外部的接口
        me._updateShowColor();
    },

    /**
     * 提供给外部使用的接口
     *
     * @public
     */
    afterSetSliderDot: function(hex, hsbObj) {},

    /**
     * 绘制控件
     * @this {bui.ColorPalette}
     */
    render: function(opt_main) {
        var me = this;
        var main = opt_main || this.main;
        if (main && main.tagName !== 'DIV') {
            return;
        }
        me.initColor(me.color);

        me.main.innerHTML = me.getPaletteHtml();
        /* pad板初始化 */
        me.initPad();
        me._padClickHandler = bui.fn('_onPadClick', me);
        me._getPad().onclick = me._padClickHandler;

        me._createSlider();
        me._setColorImgs();
        me.initSliderDot();
        me.synColorBySlider(me.sliderDotY);
        //me.setPadDot(me.padDotY, me.padDotX);
        //me._saveColor();
        //me.initColor(me.color);
        me._createColorPicker();
        me._updateShowColor();

    },
    initPad: function() {
        var me = this;
        var pad = me._getPad('pad');
        pad.style.backgroundColor = '#' + me._HSBToHex({
            h: me.hue,
            s: 100,
            b: 100
        });
        me.setPadDot(me.padDotX, me.padDotY);
    },
    initSliderDot: function() {
        var me = this;
        var sliderDot = me._getSliderDot();
        sliderDot.style.top = me.sliderDotY + 'px';
    },
    /**
     * 通过外部传入的hex值更新控件各部分显示和状态
     *
     */
    initColor: function(hex) {
        var me = this,
            hbsArray = me._HexToHSB(hex),
            dotPos = me._HexToPodTL(hex),
            pad = me._getPad();
        me.hex = hex;
        me.hue = hbsArray[0];
        me.brightness = hbsArray[1];
        me.saturation = hbsArray[2];
        me.sliderDotY = Math.round(me.sliderLength - (me.hue * me.sliderLength / 360));
        me.padDotY = dotPos[0];
        me.padDotX = dotPos[1];

        var rgbArray = me._HexToRGB(me.hex);
        me.red = rgbArray[0];
        me.green = rgbArray[1];
        me.blue = rgbArray[2];
        //me._saveColor();
    },

    repaintColor: function(hex) {
        var me = this;
        me.initColor(hex);
        me.initPad();
        me._setColorImgs();
        me.initSliderDot();
        me._updateShowColor();
    },
    _saveColor: function() {
        var me = this;
        me.savedColorHex = me.hex;
        me.savedColorPosition = {
            sliderDotY: me.sliderDotY,
            padDotY: me.padDotY,
            padDotX: me.padDotX
        };
    },

    getColor: function() {
        return this.hex;
    },

    _getHex: function() {
        var hex = this.hex;
        if (hex.charAt(0) != '#') {
          return '#' + hex;
        }
        return hex;
    },

    /**
     * 工具方法，HSB => RGB
     *
     * @private
     */
    _HSBToRGB: function(hsbArray) {
        var c = {},
            j = Math.round(hsbArray.h),
            g = Math.round(hsbArray.s * 255 / 100),//对比度值
            b = Math.round(hsbArray.b * 255 / 100);//亮度值
        //对比度为零，则r，g, b相同，且都等于亮度值
        if (g == 0) {
            c.r = c.g = c.b = b;
        } else {
            var k = b,
                f = (255 - g) * b / 255,
                d = (k - f) * (j % 60) / 60;
            if (j == 360) {
                j = 0;
            }
            if (j < 60) {
                c.r = k;
                c.b = f;
                c.g = f + d;
            } else {
                if (j < 120) {
                    c.g = k;
                    c.b = f;
                    c.r = k - d;
                } else {
                    if (j < 180) {
                        c.g = k;
                        c.r = f;
                        c.b = f + d;
                    } else {
                        if (j < 240) {
                            c.b = k;
                            c.r = f;
                            c.g = k - d;
                        } else {
                            if (j < 300) {
                                c.b = k;
                                c.g = f;
                                c.r = f + d;
                            } else {
                                if (j < 360) {
                                    c.r = k;
                                    c.g = f;
                                    c.b = k - d;
                                } else {
                                    c.r = 0;
                                    c.g = 0;
                                    c.b = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            r: Math.round(c.r),
            g: Math.round(c.g),
            b: Math.round(c.b)
        };
    },
    _RGBToHex: function(a) {
        return  [
            ('0'+a.r.toString(16)).slice(-2), 
            ('0'+a.g.toString(16)).slice(-2), 
            ('0'+a.b.toString(16)).slice(-2)
        ].join('');
    },
    _HSBToHex: function(a) {
        var b = this;
        return b._RGBToHex(b._HSBToRGB(a));
    },

    _HexToRGB: function(hex) {
        var me = this,
            cutHex = me._CutHex(hex);
        var r = parseInt(cutHex.substring(0, 2), 16);
        var g = parseInt(cutHex.substring(2, 4), 16);
        var b = parseInt(cutHex.substring(4, 6), 16);
        return [r, g, b];
    },

    _RGBToHSB: function(r, g, b) {
        var me = this;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var middle, i = 2, hexArray = [r, g, b];
        var h, s, rem, d;
        while (i >= 0) {
            if (hexArray[i] <= max && hexArray[i] >= min) {
               middle = hexArray[i];
               break;
            } else {
               i--;
            }
        }

        var l = Math.round(max * 100 / 255); //亮度以RGB最大值为计算基准
        if (max == min) {
            h = me.hue;
            s = 0;
        } else {
            //对比度只与最大最小色值的色差有关
            s = Math.round((max - min) / max * 100);
            d = max - min;
//            if ((max == r && min == b) || (max == g && min == r) || (max == b && min == g)) {
//                rem = Math.round(60 * (100 * middle / 255 - min) / (max - min));
//                switch(max){
//                    case r: h = rem; break;
//                    case g: h = 120 + rem; break;
//                    case b: h = 240 + rem; break;
//                }
//            }
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h = Math.round(60 * h);
        }

        return [h, s, l];
    },

    _HexToHSB: function(hex) {
        var me = this,
            rgbArray = [],
            hbsArray = [];
        rgbArray = me._HexToRGB(hex);
        hbsArray = me._RGBToHSB(rgbArray[0], rgbArray[1], rgbArray[2]);
        return hbsArray;
    },

    _HSBToPodTL: function(s, b) {
        var padLeft = 256 * s / 100,
            padTop = 256 - (256 * b / 100);
        return [padLeft, padTop];
    },

    _HexToPodTL: function(hex) {
       var me = this,
           hbsArray = [],
           padPosArray = [];
       hbsArray = me._HexToHSB(hex);
       padPosArray = me._HSBToPodTL(hbsArray[1], hbsArray[2]);
       return padPosArray;
    },

    _CutHex: function(hex) {
       var clen = hex.length,
           cutHex = hex,
           newHexArray = [];
       if (hex.charAt(0) == '#') {
           cutHex = hex.substring(1, clen + 1);
       }

       if (cutHex.length != 3 && cutHex.length != 6) {
           return 'FFFFFF';
       }

       if (cutHex.length == 3) {
           return [cutHex.charAt(0), cutHex.charAt(0),
                   cutHex.charAt(1), cutHex.charAt(1),
                   cutHex.charAt(2), cutHex.charAt(2)].join('');
       }
       return cutHex;
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
    }


};

/*通过bui.Control派生*/
//bui.Control.derive(bui.ColorPalette);
/* bui.ColorPalette 继承了 bui.Control */
bui.inherits(bui.ColorPalette, bui.Control);