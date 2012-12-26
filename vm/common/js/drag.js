'use strict';

var isIE = (document.all) ? true : false;

var isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6);


function Each(list, fun){
    for (var i = 0, len = list.length; i < len; i++) { fun(list[i], i); }
};

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

Function.prototype.bind = function(object) {
  var __method = this, args = Array.apply(null, arguments); args.shift();
  return function() {
    return __method.apply(object, args);
  }
}

var OverLay = Class.create();
OverLay.prototype = {
  initialize: function(overlay, options) {
    this.Lay = $(overlay);//覆盖层
    
    //ie6设置覆盖层大小程序
    this._size =  function(){};
    
    this.SetOptions(options);
    
    this.Color = this.options.Color;
    this.Opacity = parseInt(this.options.Opacity);
    this.zIndex = parseInt(this.options.zIndex);
    
    this.Set();
  },
  //设置默认属性
  SetOptions: function(options) {
    this.options = {//默认值
        Color:        "#fff",//背景色
        Opacity:    50,//透明度(0-100)
        zIndex:        1000//层叠顺序
    };
    Object.extend(this.options, options || {});
  },
  //创建
  Set: function() {
    this.Lay.style.display = "none";
    this.Lay.style.zIndex = this.zIndex;
    this.Lay.style.left = this.Lay.style.top = 0;
    
    if(isIE6){
        this.Lay.style.position = "absolute";
        this._size = function(){
            this.Lay.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
            this.Lay.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
        }.bind(this);
        //遮盖select
        this.Lay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe>'
    } else {
        this.Lay.style.position = "fixed";
        this.Lay.style.width = this.Lay.style.height = "100%";
    }
  },
  //显示
  Show: function() {
    //设置样式
    this.Lay.style.backgroundColor = this.Color;
    //设置透明度
    if(isIE){
        this.Lay.style.filter = "alpha(opacity:" + this.Opacity + ")";
    } else {
        this.Lay.style.opacity = this.Opacity / 100;
    }
    //兼容ie6
    if(isIE6){ this._size(); window.attachEvent("onresize", this._size); }
    
    this.Lay.style.display = "block";
  },
  //关闭
  Close: function() {
    this.Lay.style.display = "none";
    if(isIE6){ window.detachEvent("onresize", this._size); }
  }
};



var LightBox = Class.create();
LightBox.prototype = {
  initialize: function(box, overlay, options) {
    
    this.Box = $(box);//显示层
    
    this.OverLay = new OverLay(overlay, options);//覆盖层
    
    this.SetOptions(options);
    
    this.Fixed = !!this.options.Fixed;
    this.Over = !!this.options.Over;
    this.Center = !!this.options.Center;
    this.onShow = this.options.onShow;
    
    this.Box.style.zIndex = this.OverLay.zIndex + 1;
    this.Box.style.display = "none";
    
    //兼容ie6用的属性
    if(isIE6){ this._top = this._left = 0; this._select = []; this._fixed = this.SetFix.bind(this); }
  },
  //设置默认属性
  SetOptions: function(options) {
    this.options = {//默认值
        Fixed:        false,//是否固定定位
        Over:        true,//是否显示覆盖层
        Center:        false,//是否居中
        onShow:        function(){}//显示时执行
    };
    Object.extend(this.options, options || {});
  },
  //兼容ie6的固定定位程序
  SetFix: function(){
    var iTop =  document.documentElement.scrollTop - this._top + this.Box.offsetTop, iLeft = document.documentElement.scrollLeft - this._left + this.Box.offsetLeft;
    //居中时需要修正
    if(this.Center){ iTop += this.Box.offsetHeight / 2; iLeft += this.Box.offsetWidth / 2; }
    
    this.Box.style.top = iTop + "px"; this.Box.style.left = iLeft + "px";
    
    this._top = document.documentElement.scrollTop; this._left = document.documentElement.scrollLeft;
  },
  //显示
  Show: function(options) {
    //固定定位
    if(this.Fixed){
        if(isIE6){
            //兼容ie6
            this.Box.style.position = "absolute";
            this._top = document.documentElement.scrollTop; this._left = document.documentElement.scrollLeft;
            window.attachEvent("onscroll", this._fixed);
        } else {
            this.Box.style.position = "fixed";
        }
    } else {
        this.Box.style.position = "absolute";
    }
    //覆盖层
    if(this.Over){
        //显示覆盖层，覆盖层自带select隐藏
        this.OverLay.Show();
    } else {
        //ie6需要把不在Box上的select隐藏
        if(isIE6){
            this._select = [];
            var oThis = this;
            Each(document.getElementsByTagName("select"), function(o){
                if(oThis.Box.contains ? !oThis.Box.contains(o) : !(oThis.Box.compareDocumentPosition(o) & 16)){
                    o.style.visibility = "hidden"; oThis._select.push(o);
                }
            })
        }
    }
    
    this.Box.style.display = "block";
    
    //居中
    if(this.Center){
        this.Box.style.top = this.Box.style.left = "50%";
        //显示后才能获取
        var iTop = - this.Box.offsetHeight / 2, iLeft = - this.Box.offsetWidth / 2;
        //ie6或不是固定定位要修正
        if(!this.Fixed || isIE6){ iTop += document.documentElement.scrollTop; iLeft += document.documentElement.scrollLeft; }
        this.Box.style.marginTop =  iTop + "px"; this.Box.style.marginLeft = iLeft + "px";
    }
    
    this.onShow();
  },
  //关闭
  Close: function() {
    this.Box.style.display = "none";
    this.OverLay.Close();
    if(isIE6){ window.detachEvent("onscroll", this._fixed); Each(this._select, function(o){ o.style.visibility = "visible"; }); }
  }
};


function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};

function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else { 
        oTarget["on" + sEventType] = null;
    }
};

if(!isIE){
    HTMLElement.prototype.__defineGetter__("currentStyle", function () {
        return this.ownerDocument.defaultView.getComputedStyle(this, null);
    });
}

//拖放程序
var Drag = Class.create();
Drag.prototype = {
  //拖放对象,触发对象
  initialize: function(obj, drag, options) {
    var oThis = this;
    
    this._obj = $(obj);//拖放对象
    this.Drag = $(drag);//触发对象
    this._x = this._y = 0;//记录鼠标相对拖放对象的位置
    //事件对象(用于移除事件)
    this._fM = function(e){ oThis.Move(window.event || e); }
    this._fS = function(){ oThis.Stop(); }
    
    this.SetOptions(options);
    
    this.Limit = !!this.options.Limit;
    this.mxLeft = parseInt(this.options.mxLeft);
    this.mxRight = parseInt(this.options.mxRight);
    this.mxTop = parseInt(this.options.mxTop);
    this.mxBottom = parseInt(this.options.mxBottom);
    this.mxContainer = this.options.mxContainer;
    
    this.onMove = this.options.onMove;
    this.Lock = !!this.options.Lock;
    
    this._obj.style.position = "absolute";
    addEventHandler(this.Drag, "mousedown", function(e){ oThis.Start(window.event || e); });
  },
  //设置默认属性
  SetOptions: function(options) {
    this.options = {//默认值
        Limit:            false,//是否设置限制(为true时下面参数有用,可以是负数)
        mxLeft:            0,//左边限制
        mxRight:        0,//右边限制
        mxTop:            0,//上边限制
        mxBottom:        0,//下边限制
        mxContainer:    null,//指定限制在容器内
        onMove:            function(){},//移动时执行
        Lock:            false//是否锁定
    };
    Object.extend(this.options, options || {});
  },
  //准备拖动
  Start: function(oEvent) {
    if(this.Lock){ return; }
    //记录鼠标相对拖放对象的位置
    this._x = oEvent.clientX - this._obj.offsetLeft;
    this._y = oEvent.clientY - this._obj.offsetTop;
    //mousemove时移动 mouseup时停止
    addEventHandler(document, "mousemove", this._fM);
    addEventHandler(document, "mouseup", this._fS);
    //使鼠标移到窗口外也能释放
    if(isIE){
        addEventHandler(this.Drag, "losecapture", this._fS);
        this.Drag.setCapture();
    }else{
        addEventHandler(window, "blur", this._fS);
    }
  },
  //拖动
  Move: function(oEvent) {
    //判断是否锁定
    if(this.Lock){ this.Stop(); return; }
    //清除选择(ie设置捕获后默认带这个)
    window.getSelection && window.getSelection().removeAllRanges();
    //当前鼠标位置减去相对拖放对象的位置得到offset位置
    var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
    //设置范围限制
    if(this.Limit){
        //如果设置了容器,因为容器大小可能会变化所以每次都要设
        if(!!this.mxContainer){
            this.mxLeft = this.mxTop = 0;
            this.mxRight = this.mxContainer.clientWidth;
            this.mxBottom = this.mxContainer.clientHeight;
        }
        //获取超出长度
        var iRight = iLeft + this._obj.offsetWidth - this.mxRight, iBottom = iTop + this._obj.offsetHeight - this.mxBottom;
        //这里是先设置右边下边再设置左边上边,可能会不准确
        if(iRight > 0) iLeft -= iRight;
        if(iBottom > 0) iTop -= iBottom;
        if(this.mxLeft > iLeft) iLeft = this.mxLeft;
        if(this.mxTop > iTop) iTop = this.mxTop;
    }
    //设置位置
    //由于offset是把margin也算进去的所以要减去
    this._obj.style.left = iLeft - (parseInt(this._obj.currentStyle.marginLeft) || 0) + "px";
    this._obj.style.top = iTop - (parseInt(this._obj.currentStyle.marginTop) || 0) + "px";    
    //附加程序
    this.onMove();
  },
  //停止拖动
  Stop: function() {
    //移除事件
    removeEventHandler(document, "mousemove", this._fM);
    removeEventHandler(document, "mouseup", this._fS);
    if(isIE){
        removeEventHandler(this.Drag, "losecapture", this._fS);
        this.Drag.releaseCapture();
    }else{
        removeEventHandler(window, "blur", this._fS);
    }
  }
};
