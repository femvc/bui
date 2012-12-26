'use strict';
//   __  __    ______    ______   __    __   ______    __  __    ____                     _____      
//  /\ \/\ \  /\  _  \  /\__  _\ /\ \  /\ \ /\  _  \  /\ \/\ \  /\  _`\         /'\_/`\  /\  ___\    
//  \ \ \_\ \ \ \ \_\ \ \/_/\ \/ \ `\`\\/'/ \ \ \_\ \ \ \ `\\ \ \ \ \_\_\      /\      \ \ \ \___ 
//   \ \  _  \ \ \  __ \   \ \ \  `\ `\ /'   \ \  __ \ \ \ , ` \ \ \ \___      \ \ \_/\_\ \ \ \ __\  
//    \ \ \ \ \ \ \ \/\ \   \_\ \__ `\ \ \    \ \ \/\ \ \ \ \`\ \ \ \ \/, \  __ \ \ \\ \ \ \ \ \____
//     \ \_\ \_\ \ \_\ \_\  /\_____\  \ \_\    \ \_\ \_\ \ \_\ \_\ \ \____/ /\_\ \ \_\\ \_\ \ \_____/
//      \/_/\/_/  \/_/\/_/  \/_____/   \/_/     \/_/\/_/  \/_/\/_/  \/___/  \/_/  \/_/ \/_/  \/____/ 
//                                                                                         
// 
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    bui.js
 * desc:    BUI是一个富客户端应用的前端MVC框架[源于ER框架]
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */
 /**
 * 
 * 使用window.bui定义可能会导致速度下降约7倍
 */
var bui = {};

bui.lang = {};


bui.g = function(id) {
    return document.getElementById(id);
};
/** 
 *事件绑定与解绑 
 */ 
bui.on = function(elem, eventName, handler) { 
    if (elem.addEventListener) { 
        elem.addEventListener(eventName, handler, false); 
    } else if (elem.attachEvent) { 
        elem.attachEvent('on' + eventName, function(){handler.call(elem)}); 
       //此处使用回调函数call()，让 this指向elem 
    } 
};
bui.un = function(elem, eventName, handler) { 
    if (elem.removeEventListener) { 
         elem.removeEventListener(eventName, handler, false); 
    } 
    if (elem.detachEvent) { 
        elem.detachEvent('on' + eventName, handler); 
    } 
};

/** 
 * 为对象绑定方法和作用域
 * @param {Function|String} handler 要绑定的函数，或者一个在作用域下可用的函
数名
 * @param {Object} obj 执行运行时this，如果不传入则运行时this为函数本身
 * @param {args* 0..n} args 函数执行时附加到执行时函数前面的参数
 *
 * @returns {Function} 封装后的函数
 */
bui.fn = function(func, scope){
    if(Object.prototype.toString.call(func)==='[object String]'){func=scope[func];}
    if(Object.prototype.toString.call(func)!=='[object Function]'){ throw 'Error "bui.fn()": "func" is null';}
    var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var fn = '[object String]' == Object.prototype.toString.call(func) ? scope[func] : func,
            args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
        return fn.apply(scope || fn, args);
    };
};

