'use strict';
/*
 * cb-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    er/basemodel.js
 * desc:    数据模型基类
 * author:  wanghaiyang
 * date:    $Date: 2013-02-01 00:36:03 +0800 (Fri, 18 Feb 2011) $
 */

/**
 * 所有数据模型的基类
 */
bui.BaseModel = function(data) {
    bui.EventDispatcher.call(this);
    
    var _model = {};
    /**
     * 设置新的值，如果两个值不同，就会触发PropertyChangedEvent.
     * 
     * @param {string|object} propertyName 需要设置的属性或数据对象.
     * @param {*} value 属性的值.
     * @comment 接受`"key", value` 和 `{key: value}`两种的方式赋值.
     */
    this.set = function(propertyName, newValue) {
        var attr,
            attrs,
            changes = [],
            oldValue, 
            newValue,
            id,
            ids,
            className = Object.prototype.toString.call(propertyName);
        
        if ((className !== '[object Object]' && className !== '[object String]') || 
            (className === '[object Object]' && newValue !== undefined)) {
            return this.trigger('SET_ERROR', propertyName, newValue);
        }
        
        if (className == '[object String]') {
            attrs = {};
            attrs[propertyName] = newValue;
        }
        else {
            attrs = propertyName;
        }
        
        for (attr in attrs) {
            if (!Object.prototype.hasOwnProperty.call(attrs, attr)) {
                changes.push([attr, undefined, bui.clone(attrs[attr])]);
                _model[attr] = newValue;
            }
            else if (!bui.isEqual(_model[attr], attrs[attr])){
                changes.push([attr, bui.clone(_model[attr]), bui.clone(attrs[attr])]);
                _model[attr] = attrs[attr];
            }
        }
        
        // Trigger all relevant attribute changes.
        for (var i = 0, len = changes.length; i < len; i++) {
            this.trigger('change:' + changes[i][0], changes[i][1], changes[i][2]);
        }
        if (changes.length) {
            this.trigger('change');
        }
    };

    /**
     * 获取指定属性值
     * 
     * @param {string} propertyName 属性名.
     * @return {*} 属性的值.
     */
    this.get = function(propertyName) {
        return bui.clone(_model[propertyName]);
    };
    /**
     * 获取所有的属性值
     * 
     * @return {hashmap} 所有的属性值.
     */
    this.getData = function(){
        return bui.clone(_model);
    };
    /**
     * 移除指定属性值
     * 
     * @param {string} propertyName 属性名.
     * @return {*} 属性的值.
     */
    this.remove = function(propertyName) {
        var value = _model[propertyName];
        this.set(propertyName, undefined);
        delete _model[propertyName];
        return value;
    };
    /**
     * 销毁Model
     * 
     * @return {void}
     */
    this.dispose = function(){
        this._listeners = undefined;
        _model = undefined;
    };
    
    bui.extend(_model, data);
};

bui.inherits(bui.BaseModel, bui.EventDispatcher);