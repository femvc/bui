'use strict';
/*
 * cb-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    bui/EventDispatcher.js
 * desc:    事件派发器
 * author:  yuanhongliang
 * date:    $Date: 2011-02-18 23:59:09 +0800 (Fri, 18 Feb 2011) $
 */

/**
 * 事件派发器，需要实现事件的类从此类继承
 */
bui.EventDispatcher = function() {
    this._listeners = [];
};
bui.EventDispatcher.prototype = {
    /**
     * 添加监听器
     *
     * @public
     * @param {String} eventType 事件类型.
     * @param {Function} listener 监听器.
     */
    on: function(eventType, listener) {
        if (!this._listeners[eventType]) {
            this._listeners[eventType] = [];
        }
        this._listeners[eventType].push(listener);
    },

    /**
     * 移除监听器
     *
     * @public
     * @param {String} eventType 事件类型.
     * @param {Function} listener 监听器.
     */
    off: function(eventType, listener) {
        if (!this._listeners[eventType]) {
            return;
        }
        for (var i = this._listeners[eventType].length - 1; i >= 0; i--) {
            if (this._listeners[eventType][i] === listener) {
                this._listeners[eventType].splice(i, 1);
                break;
            }
        }
        if (listener === undefined) {
            this._listeners[eventType] = [];
        }
    },
    /**
     * 清除所有监听器
     *
     * @public
     */
    clear: function() {
        this._listeners = [];
    },
    /**
     * 触发事件
     *
     * @public
     * @param {String} eventType 事件类型.
     */
    trigger: function(eventType) {
        if (!this._listeners[eventType]) {
            return;
        }
        var i, args = [];
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (var i = 0; i < this._listeners[eventType].length; i++) {
            this._listeners[eventType][i].apply(this, args);
        }
    }
};

