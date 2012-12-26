'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    demo.js
 * desc:    BUI是一个富客户端应用的前端MVC框架[源于ER框架]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

/**  
 * 异步框架对象构造函数 
 * 
 * @property {Array} que 保存回调队列
 * @id 唯一标识
 *
 * @constructor
 */
bui.asyque = function(){
    if(!this.constructor || this.constructor != bui.asyque){
        return(new bui.asyque());
    }
    this.que=[];
    this.id=Math.random();
};

/**  
 * push 添加需要异步执行的函数
 * 
 * @param {Function} fn 需要异步执行的函数
 * @return {this} 返回主体以便于后续操作
 */
bui.asyque.prototype.push = function(fn, target){
    var me = this,
        _fn = target?bui.fn(fn,target):fn,
        callback = bui.fn(me.next,me);
    fn = function(){
        _fn(callback);
    };
    me.que.push(fn);
    return me;
};

/**  
 * next 开始执行异步队列
 * 
 * @param {Function} callback 嵌套时的回调函数，其实就是bui.asyque.prototype.next
 * @return {void} 
 */
bui.asyque.prototype.next = function(callback){
    callback&&callback();
    
    if (this.que.length>0) {
        var fn = this.que.shift();
        fn();
    }
};

/**  
 * Javascript简单异步框架 
 * 
 * @property {Array} que 保存回调队列  
 * @method {Function} push 添加需要异步执行的函数
 * @method {Function} next 开始执行异步队列
 * @comment 异步队列中的函数需要实现callback的接口
 *
 * @example
     function doit() {
        alert('a');
        
        var que1 = new bui.asyque();
        que1.push(a);
        que1.push(d); 
        window.setTimeout(function(){
            que1.next();
        },400);
    }

     function a(callback) {
        alert('a');
        
        var que2 = new bui.asyque();
        que2.push(b).push(c).push(callback); 
        
        window.setTimeout(function(){
            que2.next();
        },400);
    }
    function b(callback) {
        alert('b');
        callback&&callback();
    }
    function c(callback) {
        alert('c');
        callback&&callback();
    }
 */ 