'use strict';

//--------------------------------------------------------------
// #Subject: 
// #Description: 
// #Creation Date: 
// #Generator: EditPlus2.12
//-------------------------------------------------------------------------------------------------------------------------------


window.$ = function(sid) { 
    var obj = null;
    if(!!sid&&typeof(sid)=="string")
    {
        try {
            obj = bui.g(sid);
        }
        catch(e) {}    
    }
    return obj;
};


    //formatdate
    Date.prototype.format = function(format)
    {
        var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) 
        {
            format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(var k in o)
        {
            if(new RegExp("("+ k +")").test(format))
            {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    };
    /*var dd = new Date(2008,5-1,21);*/
    /*alert(dd.format("yyyy.MM.dd hh:mm:ss"));*/
function DateTime(str)
{
    /****2008.02.02 10:10:10********/
    var reg = /^(\d\d\d\d)[\.-\/\\]?(\d{1,2})[\.-\/\\]?(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if(r===null){return false; }
    r[2]=r[2]-1;   
    var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);   
    if(d.getFullYear()!=r[1]){ return false; }   
    if(d.getMonth()!=r[2]){ return false; }     
    if(d.getDate()!=r[3]){ return false; }    
    if(d.getHours()!=r[4]){ return false; }    
    if(d.getMinutes()!=r[5]){ return false; }  
    if(d.getSeconds()!=r[6]){ return false; }   
    return d;
}

    function str2img2(str) 
    {
        var src = 'image/yinbiao/';
        var lenStr = str.length;
        var rsString    = "";
        for (var i=0;i<lenStr;i++) {
            var theChar   = str.substr(i,1);
            if (theChar == " ") {
                rsString += " ";
            } else if (theChar == "&"||theChar == "]"||theChar == "[") {
            
            } else if (theChar == "-") {
                rsString += "<img src=\""+src+"zhonggangxian.png\" border=\"0\" />";
            } else if (theChar == "]") {
                rsString += "<img src=\""+src+"fangkh-y.gif\" border=\"0\" />";
            } else if (theChar == "[") {
                rsString += "<img src=\""+src+"fangkh-z.gif\" border=\"0\" />";
            } else if (theChar == "_") {
                rsString += "<img src=\""+src+"/xiahuaxian.png\" border=\"0\" />";
            } else if (theChar == ".") {
                rsString += "<img src=\""+src+"dian.png\" border=\"0\" />";
            } else if (theChar == ",") {
                rsString += "<img src=\""+src+"douhao.gif\" border=\"0\" />";
            } else if (theChar == ";") {
                rsString += "<img src=\""+src+"fenhao.gif\" border=\"0\" />";
            } else if (theChar == "`") {
                rsString += "<img src=\""+src+"5.png\" border=\"0\" />";
            } else if (theChar == ":") {
                rsString += "<img src=\""+src+"maohao.png\" border=\"0\" />";
            } else if (theChar == "\\") {
                rsString += "<img src=\""+src+"xiexian.png\" border=\"0\" />";
            } else if (theChar == "/") {
                rsString += "<img src=\""+src+"fanxiexian.png\" border=\"0\" />";
            } else if (theChar == "?") {
                rsString += "<img src=\""+src+"wenhao.png\" border=\"0\" />";
            } else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(theChar)!=-1) {
                rsString += "<img src=\""+src+theChar+theChar+".png\" border=\"0\" />";
            } else{
                rsString += "<img src=\""+src+theChar+".png\" border=\"0\" />";
            }
        }

        rsString = '<img src="'+src+'fangkh-z.gif" alt="" />' + rsString + '<img src="'+src+'fangkh-y.gif" alt="" />';
        return rsString;
    }

    function getrandnumarray(count,maxnum)
    {
        var numarray = [];
        var i = 0,j=0,k,num,len;
        for(i=0;i<count;i++)
        {
            k=true;
            num = Math.floor(Math.random()*(maxnum-1))+1;
            len = numarray.length;
            for(j=0;j<len;j++)
            {
                if(numarray[j] == num) { k=false; }
            }
            if(k) { numarray[i]= num; }
            else { i--; }
        }
        return numarray;
    }

function js2php_time(t,sign) //true js2php;false php2js
{
    return t;
}

String.prototype.trim = function () {  var ob;ob=123;return this.replace(/^\s+/ig, "").replace(/\s+$/ig, ""); };

var _Objectclone=Object.prototype.toString;   
Object.prototype.toString=function(str) 
{ 
    if(str=="clone")
    {   
         var tmp=new Object();
         for(ob in this){ tmp[ob]=this[ob]; }
         return tmp;
    }
    else
    {    return _Objectclone.apply(this, arguments); }
};

Array.prototype.del=function(n) {  
  if(typeof(n)!="number"||n<0)  
  {  return this; }
  else 
  {  return this.slice(0,n).concat(this.slice(n+1,this.length)); }
}; 


function lang_mouseover(obj,type)
{
    if(type=='over')
    {
    try{if(!!obj.timer) { window.clearTimeout(obj.timer);}}catch(e){}
    obj.style.display='block';
    }
    else if(type=='out')
    {
    obj.timer = window.setTimeout(function(){obj.style.display='none';},500);
    }
}

function getResult(s){
    if(s.length < 1)  return 0;
    var ls = 1;
    if (s.match(/[a-z]/g)||s.match(/[A-Z]/g))  ls++;
    if (s.match(/[a-z]/g)&&s.match(/[A-Z]/g))  ls++;
    if (s.match(/[0-9]/ig))  ls++;
     if (s.match(/(.[^a-z0-9])/ig))     ls+=1;
    if (s.length < 4 && ls > 0)  ls--;
    if (s.length > 7 ) ls++;
    if (s.length > 11 ) ls++;
    if (s.length > 15 ) ls++;
    if(ls>5) ls=5;
    return ls;
}

function refresh_rand()
{
    var src="/5iremember/randnum.jsp?act=init&rand="+Math.random()*1000000;
    //alert(src);
    bui.g("rand_img").src = src;
}