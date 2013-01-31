'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    events.js
 * desc:    全局通用事件
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

///import bui;
bui.events = {
  // 浏览器事件
  LOAD: 'load',
  CLICK: 'click',
  DBCLICK: 'dbclick',
  MOUSE_OVER: 'mouseover',
  MOUSE_OUT: 'mouseout',
  ENTER: 'enter',
  OPEN: 'open',

  // 自定义的事件
  ITEM_CLICK: 'itemclick',
  VIEWAREA_CHANGE: 'viewareachange',
  BEFORE_CHANGE: 'beforechange',
  BEFORE_QUEUE: 'beforequeue',
  AFTER_QUEUE: 'afterqueue',
  BEFORE_UPLOAD: 'beforeupload',
  AFTER_UPLOAD: 'afterupload',
  UPLOAD_SUCCESS: 'uploadsuccess',
  UPLOAD_FAILURE: 'uploadfailure',
  AFTER_DELETE: 'afterdelete',
  AFTER_RENDER: 'afterrender',
  AFTER_COLUMN_RESIZE: 'aftercolumnresize',
  AFTER_SELECT: 'afterselect',
  AFTER_SHOW: 'aftershow',
  AFTER_HIDE: 'afterhide'
};


