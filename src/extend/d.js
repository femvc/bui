'use strict'; 
var _={ 
    /* 
     *get something from deep hash 
     *  hash:target hash 
     *  arr:path array, 
     *  example: 
     *  _.get({a:{b:{c:1}}},['a','b']) => {c:1}; 
     *      _.get({a:{b:{c:1}}},['a','b','c']) => 1; 
     *      _.get({a:{b:{c:1}}},['a','b','c','d']) => undefined; 
     */ 
    get:function(hash,path){ 
        if(!path) return hash; 
        else if(typeof path=='string') return hash[path]; 
        else{ 
            for(var i=0,l=path.length;i<l;) 
                if(!hash || (hash=hash[path[i++]])===undefined )return; 
            return hash; 
        } 
    }, 
    /** 
     *set/unset a value to deep hash 
     *example: 
     *   _.set({a:{b:{c:1}}},['a','b','c'],2) => {a:{b:{c:2}}} 
     *   _.set({a:{b:{c:1}}},['a','b','c']) => {a:{b:{}}} 
     */ 
    set:function(hash,path,value){ 
        if(typeof path!='string'){ 
            var v,i=0,m,last=path.length-1; 
            for(;i<last;){ 
                v=path[i++]; 
                if(hash[v]&&((m=typeof hash[v])=='object' || m=='function')) hash=hash[v]; 
                else hash=hash[v]={}; 
            } 
            path=path[last]; 
        } 
        if(value===undefined){ 
            if(hash.hasOwnProperty && hash.hasOwnProperty(path)) 
                delete hash[path]; 
            else hash[path]=undefined; 
        }else 
            return hash[path]=value; 
    }, 
     
    /**each function for hash 
     *fun: fun to exec, if return false, stop the $iterator 
     *scope: 'this' pointer; 
     */ 
    each:function(hash,fun,scope){ 
        scope = scope||hash; 
        for(var i in hash) 
            if(false===fun.call(scope, hash[i], i, hash)) 
                break; 
        return hash; 
    }, 
     
    toArr:function(value, flag){ 
        if(!value)return []; 
        var arr=[]; 
        //hash 
        if(typeof flag == 'boolean') 
            for(var i in value) 
                arr[arr.length]=flag?i:value[i]; 
        //other like arguments 
        else{ 
            if(typeof value=='string') 
                arr=value.split(flag||','); 
            else 
                for(var i=0,l=value.length; i<l; ++i) 
                    arr[i]=value[i]; 
        } 
        return arr; 
    }, 
    toUTF8:function(str){ 
        return str.replace(/[^\x00-\xff]/ig, function(a,b) { 
            return '\\u' + ((b=a.charCodeAt())<16?'000':b<256?'00':b<4096?'0':'')+b.toString(16) 
        }) 
    }, 
    fromUTF8:function(str){ 
        return str.replace(/\\u([0-9a-f]{3})([0-9a-f])/ig,function(a,b,c){return String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))}) 
    }, 
    urlEncode:function(hash){ 
        var a=[],i,o; 
        for(i in hash) 
            if(_.isDefined(o=hash[i])) 
                a.push(encodeURIComponent(i)+'='+encodeURIComponent(typeof o=='string'?o:_.serialize(o))); 
        return a.join('&'); 
    }, 
    urlDecode:function(str, key){ 
        if(!str)return key?'':{}; 
        var arr,hash={},a=str.split('&'),o; 
        for(var i=0,l=a.length;i<l;i++){ 
            o=a[i]; 
            arr=o.split('='); 
            try{ 
                hash[decodeURIComponent(arr[0])]=decodeURIComponent(arr[1]); 
            }catch(e){ 
                hash[arr[0]]=arr[1]; 
            } 
        } 
        return key?hash[key]:hash; 
    }, 
     
    // type detection 
    isDefined:function(target)  {return target!==undefined}, 
    isUndefined:function(target) { return target === undefined;}, 
    isNull:function(target)  {return target===null}, 
    isSet:function(target)   {return target!==undefined && target!==null}, 
    isObject:function(target)   {return !!target  && (typeof target == 'object' || typeof target == 'function')}, 
    isBoolean:function(target)  {return typeof target == 'boolean'}, 
    isNumber:function(target)  {return typeof target == 'number' && isFinite(target)}, 
    isFinite:function(target)  {return (target||target===0) && isFinite(target)}, 
    isDate:function(target)  {return Object.prototype.toString.call(target)==='[object Date]' && isFinite(+target)}, 
    isFunction:function(target)   {return Object.prototype.toString.call(target)==='[object Function]'}, 
    isArray:function(target)   {return Object.prototype.toString.call(target)==='[object Array]'}, 
    isReg:function(target)   {return Object.prototype.toString.call(target)==='[object RegExp]'}, 
    isString:function(target)   {return typeof target == "string"}, 
    isArguments:function(target)   {return !!(target && target.callee && target.callee.arguments===target)}, 
    isWindow:function(target){ return target && typeof target === 'object' && 'setInterval' in target;}, 
    isHTMLElement:function(target){var d = document.createElement('DIV');try{d.appendChild(target.cloneNode(true));return target.nodeType==1 ? true : false;}catch(e){return target==window || target==document;}}, 
 
    //for handling String 
    str:{ 
        startWith:function(str,sStr){ 
            return str.indexOf(sStr) === 0; 
        }, 
        endWith:function (str,eStr) { 
            var l=str.length-eStr.length; 
            return l>=0 && str.lastIndexOf(eStr) === l; 
        }, 
        repeat:function(str,times){ 
            return new Array(times+1).join(str); 
        }, 
        initial:function(str){ 
            return str.charAt(0).toUpperCase() + str.substring(1); 
        }, 
        trim:function(str){ 
            return str.replace(/^[\s\xa0]+|[\s\xa0]+$/ig, ''); 
        }, 
        ltrim:function(str){ 
            return str.replace(/^[\s\xa0]+/,''); 
        }, 
        rtrim:function(str){ 
            return str.replace(/[\s\xa0]+$/,''); 
        }, 
    /* 
            blen : function(s){ 
                var _t=s.match(/[^\x00-\xff]/ig); 
                return s.length+(null===_t?0:_t.length); 
            }, 
    */ 
        //Dependency: linb.Dom 
        toDom:function(str){ 
            var docFragment = document.createDocumentFragment (), 
                  p = document.createElement('div'); 
            p.innerHTML = str; 
            while(p.firstChild&&docFragment.appendChild(p.firstChild)){} 
            return docFragment; 
        } 
    }, 
    trim:function(str){ 
        return str.replace(/^[\s\xa0]+|[\s\xa0]+$/ig, ''); 
    }, 
    //for handling Array 
    arr:{ 
        subIndexOf:function(arr,key,value){ 
            if(value===undefined)return -1; 
            for(var i=0, l=arr.length; i<l; i++) 
                if(arr[i] && arr[i][key] === value) 
                    return i; 
            return -1; 
        }, 
        removeFrom:function(arr, index,length){ 
            arr.splice(index, length || 1); 
            return arr; 
        }, 
        removeValue:function(arr, value){ 
            for(var l=arr.length,i=l-1; i>=0; i--) 
                if(arr[i]===value) 
                    arr.splice(i,1); 
            return arr; 
        }, 
        remove:function(arr, from, to) { 
            to = (to===undefined||to<from?from+1:to+1); 
            if(from>-1){ 
                arr = arr.slice(0,from).concat( 
                    arr.slice(to,arr.length) 
                ); 
            } 
            return arr; 
        }, 
        /* 
         insert something to array 
         arr: any 
         index:default is length-1 
         flag: is add array 
 
         For example: 
         [1,2].insertAny(3) 
            will return [1,2,3] 
         [1,2].insertAny(3,0) 
            will return [3,1,2] 
         [1,2].insertAny([3,4]) 
            will return [1,2,3,4] 
         [1,2].insertAny([3,4],3,true) 
            will return [1,2,[3,4]] 
        */ 
        insertAny:function (arr, target,index, flag) { 
            var l=arr.length; 
            flag=target.constructor!=Array || flag; 
            if(index===0){ 
                if(flag) 
                    arr.unshift(target); 
                else 
                    arr.unshift.apply(arr, target); 
            }else{ 
                var a; 
                if(!index || index<0 || index>l)index=l; 
                if(index!=l) 
                    a=arr.splice(index,l-index); 
                if(flag) 
                    arr[arr.length]=target; 
                else 
                    arr.push.apply(arr, target); 
                if(a) 
                    arr.push.apply(arr, a); 
            } 
            return index; 
        }, 
        indexOf:function(arr, value) { 
            for(var i=0, l=arr.length; i<l; i++) 
                if(arr[i] === value) 
                    return i; 
            return -1; 
        }, 
        /* 
        fun: fun to apply 
        desc: true - max to min , or min to max 
        atarget: for this 
        */ 
        each:function(arr,fun,scope,desc){ 
            var i, l, a=arr; 
            if(!a)return a; 
            if(a.constructor!=Array){ 
                if((a=a._nodes) || a.constructor!=Array) 
                    throw new Error('errNotArray'); 
                if(desc===undefined) 
                    desc=1; 
            } 
            l=a.length; 
            scope = scope||arr; 
            if(!desc){ 
                for(i=0; i<l; i++) 
                    if(fun.call(scope, a[i], i, a)===false) 
                        break; 
            }else 
                for(i=l-1; i>=0; i--) 
                    if(fun.call(scope, a[i], i, a)===false) 
                        break; 
            return arr; 
        }, 
        removeDuplicate:function(arr,subKey){ 
            var l=arr.length,a=arr.concat(); 
            var i,j,k,notExist; 
            arr.length=0; 
            if(subKey!==undefined) arr.push(subKey); 
            for(i=0;i<l;i++){ 
                notExist = true; 
                for(j=arr.length-1;j>=0;j--){ 
                    if(arr[j] == a[i])  notExist= false; 
                } 
                if(notExist) arr.push(a[i]);  
            } 
            if(subKey!==undefined) arr.shift(); 
            return arr; 
        } 
    }, 
    css:{ 
        addStyle:function(name, value){ 
            var tempStyle = _.css.tempStyle; 
            if(!tempStyle){ 
                var s = document.createElement("STYLE"); 
                s.type = "text/css"; 
                var head = document.getElementsByTagName("HEAD")[0]; 
                head.appendChild(s); 
                _.css.tempStyle = s; 
                tempStyle = _.css.tempStyle; 
            } 
             
            var sheet = tempStyle.sheet ? tempStyle.sheet : tempStyle.styleSheet; 
             
            var isIE = /MSIE/i.test(navigator.userAgent) && !window.opera; 
            if(isIE){ 
                sheet.addRule(name, value); 
            }else{ 
                sheet.insertRule(name + " { " + value + " }",sheet.cssRules.length); 
            } 
        }, 
        delStyle:function(index){ 
            var tempStyle = _.css.tempStyle; 
            if(!tempStyle){ 
                var s = document.createElement("STYLE"); 
                s.type = "text/css"; 
                var head = document.getElementsByTagName("HEAD")[0]; 
                head.appendChild(s); 
                _.css.tempStyle = s; 
                tempStyle = _.css.tempStyle; 
            } 
             
            var sheet = tempStyle.sheet ? tempStyle.sheet : tempStyle.styleSheet; 
             
            var isIE = /MSIE/i.test(navigator.userAgent) && !window.opera; 
            if(isIE){ 
                if(!sheet.rules || sheet.rules.length<1) return; 
                else if(index === undefined) sheet.removeRule(sheet.rules.length-1);  
                else if(sheet.rules.length>parseInt(index)) sheet.removeRule(parseInt(index)); 
            }else{ 
                if(!sheet.cssRules || sheet.cssRules.length<1) return; 
                else if(index === undefined) sheet.deleteRule(sheet.cssRules.length-1);  
                else if(sheet.cssRules.length>parseInt(index)) sheet.deleteRule(parseInt(index)); 
            } 
             
        } 
    }, 
    enumKeys:function(target,self){ 
        // non-object or array return empty array 
        if(!_.isObject(target) || _.isArray(target))return []; 
 
        for(var i in target){ 
            if('prototype'==i || 'constructor' == i) 
                continue; 
            try{ 
                if(/^[\w_]+$/.test(i)){ 
                    self._buildItem(i); 
                } 
            }catch(ee){} 
        } 
    }, 
    /** 
     *事件绑定与解绑 
     */ 
    bind:function(elem, eventName, handler) { 
        if (elem.addEventListener) { 
            elem.addEventListener(eventName, handler, false); 
        } else if (elem.attachEvent) { 
            elem.attachEvent('on' + eventName, function(){handler.call(elem)}); 
           //此处使用回调函数call()，让 this指向elem 
        } 
    }, 
    unbind:function(elem, eventName, handler) { 
        if (elem.removeEventListener) { 
             elem.removeEventListener(eventName, handler, false); 
        } 
        if (elem.detachEvent) { 
            elem.detachEvent('on' + eventName, handler); 
        } 
    }, 
    textSize:function(text,fontSize) { 
        var span = document.createElement("span"); 
        span.style.position='absolute'; 
        span.style.left='-1000px'; 
        span.style.visibility = "hidden"; 
        if(!!fontSize) span.style.fontSize = fontSize; 
        document.body.appendChild(span); 
        var result = {}; 
        if (typeof span.textContent != "undefined") 
            span.textContent = text; 
        else span.innerText = text; 
        result.width = span.offsetWidth; 
        result.height = span.offsetHeight; 
        span.parentNode.removeChild(span); 
        return result; 
    }, 
    addStop:function(event) { 
        if (!event.stop) event.stop = function(){ 
            if (this.preventDefault) {this.preventDefault(); this.stopPropagation();} 
            else {this.returnValue = false; this.cancelBubble = true;} 
        }; 
        return event; 
    }, 
    getElementsByClassName:function(searchClass, node,tag) {  
        if(document.getElementsByClassName){  
            var nodes =  (node || document).getElementsByClassName(searchClass),result = nodes; 
            if(tag!=undefined){ 
                result = []; 
                for(var i=0 ;node = nodes[i++];){ 
                    if(tag !== "*" && node.tagName === tag.toUpperCase()){ 
                        result.push(node); 
                    }else{ 
                        result.push(node); 
                    } 
                } 
            } 
            return result; 
        }else{  
            node = node || document;  
            tag = tag || "*";  
            var classes = searchClass.split(" "),  
            elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),  
            patterns = [],  
            returnElements = [],  
            current,  
            match;  
            var i = classes.length;  
            while(--i >= 0){  
                patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));  
            }  
            var j = elements.length;  
            while(--j >= 0){  
                current = elements[j];  
                match = false;  
                for(var k=0, kl=patterns.length; k<kl; k++){  
                    match = patterns[k].test(current.className);  
                    if (!match)  break;  
                }  
                if (match)  returnElements.push(current);   
            }  
            return returnElements;  
        }  
    }, 
    g:function(id){return _.find('#'+id);},
    find:function(elem,parentElem){ 
        //选择器#ID/.CLASS/TagName 
        if(_.isString(elem)&&elem.length>0){ 
            if(parentElem==undefined || !_.isHTMLElement(parentElem)) parentElem = document; 
            elem = elem.replace(/^\s+/ig, ""); 
            if(elem.length<1) return null; 
            if(elem.indexOf("#")==0){ return parentElem.getElementById(elem.substr(1,elem.length));} 
            else if(/^\./g.test(elem))   { return _.getElementsByClassName(_.trim(elem.replace(/\./ig," ")),parentElem);} 
            else if(_.trim(elem).replace(/[a-zA-Z0-9]/ig,'').length==0){  
                return parentElem.getElementsByTagName(_.trim(elem)); 
            } 
 
        }         
    }, 
    createDiv:function(parent,node){ 
        var div = document.createElement('DIV'); 
        parent = parent || document.body; 
        if(node) parent.insertBefore(div,node); 
        else parent.appendChild(div); 
         
        return div; 
    }, 
    /** 
    * 清除选中的文字 
    */ 
    clearSelect:function(){ 
        if (document.selection && document.selection.empty) { 
            document.selection.empty(); 
        } 
        else if(window.getSelection) { 
            var sel=window.getSelection(); 
            if(sel && sel.removeAllRanges) 
            sel.removeAllRanges() ; 
        } 
    }, 
    /** 
    * 对特殊字符和换行符编码 
    */ 
    /**
    * 对特殊字符和换行符编码//.replace(/%/ig,"%-")
    */
    encode:function(str){
        return String(str).replace(/%/ig,"%25").replace(/[ ]/ig,"%20").replace(/&/ig,"%26").replace(/;/ig,"%3B").replace(/=/ig,"%3D").replace(/\+/ig,"%2B").replace(/</ig,"%3C").replace(/>/ig,"%3E").replace(/\,/ig,"%2C").replace(/\"/ig,"%22").replace(/\'/ig,"%27").replace(/\#/ig,"%23").replace(/\//ig,"%2F").replace(/\\/ig,"%5C").replace(/\n/ig,"%0A").replace(/\r/ig,"%0D");
    },
    rencode:function(str){
        return String(str).replace(/aa/ig,"aa").replace(/[ ]/ig,"%20").replace(/&/ig,"%26").replace(/;/ig,"%3B").replace(/=/ig,"%3D").replace(/\+/ig,"%2B").replace(/</ig,"%3C").replace(/>/ig,"%3E").replace(/\,/ig,"%2C").replace(/\"/ig,"%22").replace(/\'/ig,"%27").replace(/\#/ig,"%23").replace(/\//ig,"%2F").replace(/\\/ig,"%5C").replace(/\n/ig,"%0A").replace(/\r/ig,"%0D");
    },
    decode:function(str){
                               return String(str).replace(/%20/ig," ").replace(/%26/ig,"&").replace(/%3B/ig,";").replace(/%3D/ig,"=").replace(/%2B/ig,"+").replace(/%3C/ig,"<").replace(/%3E/ig,">").replace(/%2C/ig,",").replace(/%22/ig,'\\\"').replace(/%27/ig,"\\\'").replace(/%23/ig,'#').replace(/%2F/ig,"/").replace(/%5C/ig,"\\").replace(/%0A/ig,"\n").replace(/%0D/ig,"\r").replace(/%25/ig,"%");//.replace(/%-/ig,"%");
    },
    xss:function(str){ 
        return String(str).replace(/\</ig,"&lt;").replace(/\>/ig,"&gt;"); 
    }, 
     
    /** 
    * 动态载入JS&CSS Satrt 
    */ 
    loadjs:function(url, onload) { 
        var _loadJS = arguments.callee; 
        if (typeof document.getElementsByTagName != 'undefined' 
                && document.getElementsByTagName('body')[0] != null || document.body != null) { 
            //write ready function here 
            var domscript = document.createElement('script'); 
            domscript.src = url; 
            if ( !! onload) { 
                domscript.afterLoad = onload; 
                domscript.onreadystatechange = function() { 
                    if (domscript.readyState == "loaded" || domscript.readyState == "complete") { 
                        domscript.afterLoad(); 
                    } 
                } 
                domscript.onload = function() { 
                    if ( !! domscript.afterLoad) domscript.afterLoad(); 
                } 
            } 
            document.getElementsByTagName('head')[0].appendChild(domscript); 
        } else window.setTimeout(function() {_loadJS(url, onload)},1); 
    }, 
    loadcss:function(url, onload) { 
        var _loadcss = arguments.callee; 
        if (typeof document.getElementsByTagName != 'undefined' 
                && document.getElementsByTagName('body')[0] != null || document.body != null) { 
            //write ready function here 
            var html_doc = document.getElementsByTagName('head')[0]; 
            var domcss = document.createElement('link'); 
            domcss.setAttribute('rel', 'stylesheet'); 
            domcss.setAttribute('type', 'text/css'); 
            domcss.setAttribute('href', url); 
            document.getElementsByTagName('head')[0].appendChild(domcss); 
            domcss.id = 'dynamiccss' + Math.random().toString().replace(".",""); 
            //Firefox不支持css的onload或onreadystatechange 
            if ( !! onload) { 
                domcss.afterLoad = onload; 
                domcss.onreadystatechange = function() { 
                    if (domcss.readyState == "loaded" || domcss.readyState == "complete") { 
                        domcss.afterLoad(); 
                    } 
                } 
            } 
            if (!document.all) { 
                domcss.poll = function() { 
                    try { 
                        var sheets = document.styleSheets; 
                        for (var j = 0, k = sheets.length; j < k; j++) { 
                            if (sheets[j].ownerNode.id == domcss.id) { 
                                sheets[j].cssRules; 
                            } 
                        } 
                        if ( !! domcss.afterLoad) domcss.afterLoad(); 
                    } catch(e) { 
                        window.setTimeout(domcss.poll, 50); 
                    } 
                } 
                window.setTimeout(domcss.poll, 50); 
            } 
        } else window.setTimeout(function() {_loadcss(url, onload)},1); 
    }, 
 
    /** 
    * location 方法 
    * @param 键值 
    */ 
    'location':function(k){ 
        var i,len,v,param={},list = window.location.search.replace(/^\?/,'').split('&'); 
        for(i in list ){ 
            v = list[i].split('='); 
            param[v[0]]= v[1]; 
        } 
        if(k==undefined) return  param; 
        else return param[k]; 
    }, 
    /** 
     * 对目标字符串进行格式化 
     *  
     * @param {string} source 目标字符串 
     * @param {Object|string...} opts 提供相应数据的对象或多个字符串 
     *              
     * @returns {string} 格式化后的字符串 
     */ 
    format: function (source, opts) { 
        source = String(source); 
        var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString; 
        if(data.length){ 
            data = (data.length == 1 ?  
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */ 
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)  
                : data); 
            return source.replace(/#\{(.+?)\}/g, function (match, key){ 
                var replacer = data[key]; 
                // chrome 下 typeof /a/ == 'function' 
                if('[object Function]' == toString.call(replacer)){ 
                    replacer = replacer(key); 
                } 
                return ('undefined' == typeof replacer ? '' : replacer); 
            }); 
        } 
        return source; 
    }, 
    addClass:function (element, className) { 
        this.removeClass(element, className); 
        element.className = (element.className +' '+ className).replace(/(\s)+/ig," "); 
        return element; 
    }, 
    removeClass:function(element, className) { 
        var list = className.split(/\s+/), 
            str = element.className; 
        var i,len,k,v; 
        for (i=0,len=list.length; i < len; i++){ 
             str = (" "+str.replace(/(\s)/ig,"  ")+" ").replace(new RegExp(" "+list[i]+" ","g")," "); 
        } 
        str = str.replace(/(\s)+/ig," "); 
        element.className = str; 
        return element; 
    }, 
    /**  
     * 为对象绑定方法和作用域 
     * @param {Function|String} handler 要绑定的函数，或者一个在作用域下可用的函数名 
     * @param {Object} obj 执行运行时this，如果不传入则运行时this为函数本身 
     * @param {args* 0..n} args 函数执行时附加到执行时函数前面的参数 
     * 
     * @returns {Function} 封装后的函数 
     */ 
    fn: function(func, scope){ 
        if(Object.prototype.toString.call(func)==='[object String]'){func=scope[func];}
        if(Object.prototype.toString.call(func)!=='[object Function]'){ throw 'Error "_.fn()": "func" is null';}
        var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null; 
        return function () { 
            var fn = '[object String]' == Object.prototype.toString.call(func) ? scope[func] : func, 
                args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments; 
            return fn.apply(scope || fn, args); 
        }; 
    }, 
    /** 
     * 对一个object进行深度拷贝 
     *  
     * @author berg 
     * @name _.clone 
     * @function 
     * @grammar _.clone(source) 
     * @param {Object} source 需要进行拷贝的对象 
     * @remark 
     * 对于Object来说，只拷贝自身成员，不拷贝prototype成员 
     * @meta standard 
     *              
     * @returns {Object} 拷贝后的新对象 
     */ 
    clone: function (source) { 
        var result = source, i, len; 
        if (!source 
            || source instanceof Number 
            || source instanceof String 
            || source instanceof Boolean) { 
            return result; 
        } else if (_.isArray(source)) { 
            result = []; 
            var resultLen = 0; 
            for (i = 0, len = source.length; i < len; i++) { 
                result[resultLen++] = _.clone(source[i]); 
            } 
        } else if (_.isObject(source)) { 
            result = {}; 
            for (i in source) { 
                if (source.hasOwnProperty(i)) { 
                    result[i] = _.clone(source[i]); 
                } 
            } 
        } 
        return result; 
    }, 
    contain: function (source, key) { 
        var result = 0, 
            i, 
            len; 
        if (_.isArray(source)) { 
            for (i = 0, len = source.length; i < len; i++) { 
                if (source[i] == key){ 
                    result++; 
                } 
            } 
        } 
        return result; 
    }, 
    formatDate: function(date,fmt) {      
        if(!date) date = new Date(); 
        fmt = fmt||'yyyy-MM-dd HH:mm'; 
        var o = {      
        "M+" : date.getMonth()+1, //月份      
        "d+" : date.getDate(), //日      
        "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时      
        "H+" : date.getHours(), //小时      
        "m+" : date.getMinutes(), //分      
        "s+" : date.getSeconds(), //秒      
        "q+" : Math.floor((date.getMonth()+3)/3), //季度      
        "S" : date.getMilliseconds() //毫秒      
        };      
        var week = {      
        "0" : "/u65e5",      
        "1" : "/u4e00",      
        "2" : "/u4e8c",      
        "3" : "/u4e09",      
        "4" : "/u56db",      
        "5" : "/u4e94",      
        "6" : "/u516d"     
        };      
        if(/(y+)/.test(fmt)){      
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));      
        }      
        if(/(E+)/.test(fmt)){      
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);      
        }      
        for(var k in o){      
            if(new RegExp("("+ k +")").test(fmt)){      
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));      
            }      
        }      
        return fmt;      
    },   
    /*  
      将String类型解析为Date类型.  
      parseDate('2006-1-1') return new Date(2006,0,1)  
      parseDate(' 2006-1-1 ') return new Date(2006,0,1)  
      parseDate('2006-1-1 15:14:16') return new Date(2006,0,1,15,14,16)  
      parseDate(' 2006-1-1 15:14:16 ') return new Date(2006,0,1,15,14,16);  
      parseDate('不正确的格式') retrun null  
    */   
    parseDate: function(str){   
        str = String(str).replace(/^[\s\xa0]+|[\s\xa0]+$/ig, ''); 
        var results = null; 
         
        //秒数 #9744242680 
        results = str.match(/^ *(\d{10}) *$/);   
        if(results && results.length>0)   
          return new Date(parseInt(str)*1000);    
         
        //毫秒数 #9744242682765 
        results = str.match(/^ *(\d{13}) *$/);   
        if(results && results.length>0)   
          return new Date(parseInt(str));    
         
        //20110608 
        results = str.match(/^ *(\d{4})(\d{2})(\d{2}) *$/);   
        if(results && results.length>3)   
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]));    
         
        //20110608 1010 
        results = str.match(/^ *(\d{4})(\d{2})(\d{2}) +(\d{2})(\d{2}) *$/);   
        if(results && results.length>6)   
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]));    
         
        //2011-06-08 
        results = str.match(/^ *(\d{4})[\._\-\/\\](\d{1,2})[\._\-\/\\](\d{1,2}) *$/);   
        if(results && results.length>3)   
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]));    
         
        //2011-06-08 10:10 
        results = str.match(/^ *(\d{4})[\._\-\/\\](\d{1,2})[\._\-\/\\](\d{1,2}) +(\d{1,2}):(\d{1,2}) *$/);   
        if(results && results.length>6)   
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]));    
         
        //2011-06-08 10:10:10 
        results = str.match(/^ *(\d{4})[\._\-\/\\](\d{1,2})[\._\-\/\\](\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);   
        if(results && results.length>6)   
          return new Date(parseInt(results[1]),parseInt(results[2]) -1,parseInt(results[3]),parseInt(results[4]),parseInt(results[5]),parseInt(results[6]));    
         
        return null;   
    }, 
    array: { 
       /** 
        * addIndex 对象列表增加索引 
        * @param Array 
        * @start 1 
        */ 
        buildIndex: function(datasource,start){
            var i,len; 
            start = start || 0;
            if(_.isArray(datasource)){ 
                for (i=0,len=datasource.length; i<len; i++) { 
                    if(_.isObject(datasource[i])){ 
                        datasource[i]['index'] = i+1+start;
                    } 
                } 
            } 
            return datasource; 
        }, 
        sortBy: function(list, field, order){ 
            if(_.isArray(list)){ 
                list.sort(function(a,b){ 
                    var m , n; 
                    m = String(a[field]).toLowerCase(); 
                    n = String(b[field]).toLowerCase(); 
                     
                    if(String(parseInt('0'+m, 10)) == m && String(parseInt('0'+n, 10)) == n){ 
                        m = parseInt(m, 10); 
                        n = parseInt(n, 10); 
                    }else{ 
                        if(m > n) { m = 1; n = -m;} 
                        else if(m < n ) { m = -1; n = -m; } 
                        else {m = 1; n = m;} 
                    } 
                    return (order == 'desc' ?  n - m : m - n ); 
                }) 
            } 
            return list; 
        } 
    }, 
    /** 
    * showWaiting 添加等待文字 
    * 
    * @elem {Element} 定位元素 
    * @after {bool} 在定位元素前或后,默认前 
    * @elem {button} 需置灰的按钮 
    */ 
    showWaiting: function(elem, after, button){ 
        var w = null; 
        if(!elem || !_.isHTMLElement(elem) || !elem.parentNode || !elem.parentNode.waiting){ 
            w = document.createElement("SPAN"); 
            w.className = 'waiting-ajax'; 
        }else w = elem.parentNode.waiting; 
         
        w.style.display = 'none'; 
         
        if(w) w.innerHTML = ' <img src="common/img/waiting.gif" alt="Waiting" />'; 
         
        if(elem && _.isHTMLElement(elem) && elem.parentNode){ 
            if(!elem.parentNode.waiting){ 
                elem.parentNode.waiting = w; 
            } 
            if(button === undefined) { 
                button = elem; 
            } 
            if(button && String(button.type).toLowerCase() === 'button'){ 
                button.disabled = 'disabled'; 
            } 
             
            if(elem.parentNode){ 
                elem.parentNode.waiting = w; 
                elem.parentNode.appendChild(w); 
                if(after) elem.parentNode.insertBefore(w,elem.nextSibling); 
                else elem.parentNode.insertBefore(w,elem); 
            } 
        } 
         
        w.style.display = 'inline'; 
         
        return w; 
    }, 
    hideWaiting: function(elem, button){ 
        if(elem && _.isHTMLElement(elem)){ 
            if(button === undefined) { 
                button = elem; 
            } 
            if(button && String(button.type).toLowerCase() === 'button'){ 
                button.disabled = false; 
                /*delete elem.disabled; /*注释掉是因为IE6下报错*/ 
            } 
            if(elem.parentNode && elem.parentNode.waiting && _.isHTMLElement(elem.parentNode.waiting)){ 
                elem.parentNode.waiting.innerHTML=''; 
            } 
        } 
    }, 
    /** 
    * showMessage 添加提示消息 
    * @elem Element 
    */ 
    showMessage: function(elem, after, custom){ 
        var w = null; 
        if(!elem || !_.isHTMLElement(elem) || !elem.parentNode || !elem.parentNode.message){ 
            w = document.createElement("SPAN"); 
            w.className = 'message'; 
        }else w = elem.parentNode.message; 
         
        w.style.display = 'none'; 
         
        if(w) w.innerHTML = custom; 
         
        if(elem && _.isHTMLElement(elem) && elem.parentNode){ 
            if(elem.parentNode){ 
                elem.parentNode.message = w; 
                elem.parentNode.appendChild(w); 
                if(after == 'after'){ 
                    elem.parentNode.insertBefore(w,elem.nextSibling); 
                } 
                else { 
                    elem.parentNode.insertBefore(w,elem); 
                }   
            } 
        } 
         
        w.style.display = 'inline'; 
         
        return w; 
    }, 
    hideMessage: function(elem){ 
        if(elem && _.isHTMLElement(elem)){ 
            if(elem.parentNode && elem.parentNode.message && _.isHTMLElement(elem.parentNode.message)){ 
                elem.parentNode.message.innerHTML=''; 
            } 
        } 
    }, 
    /** 
     * 移除JSON字符串中多余的逗号如{'a':[',],}',],} 
     * 
     * @param {string} JSON字符串 
     * @return {string} 处理后的JSON字符串 
     */ 
    removeJSONExtComma: function(str) { 
        var i, 
            j, 
            len, 
            list, 
            c, 
            notValue = null, 
            preQuot = null, 
            lineNum; 
 
        list = String(str).split(''); 
        for (i = 0, len = list.length; i < len; i++) { 
            c = list[i]; 
            //单引或双引 
            if (/^[\'\"]$/.test(c)) { 
                if (notValue === null && preQuot === null) { 
                    notValue = false; 
                    preQuot = i; 
                    continue; 
                } 
                //值 
                if (!notValue) { 
                    //前面反斜杠个数 
                    lineNum = 0; 
                    for (j = i - 1; j > -1; j--) { 
                        if (list[j] === '\\') {lineNum++;} 
                        else { j = -1; } 
                    } 
                    //个数为偶数且和开始引号相同 
                    //结束引号 
                    if (lineNum % 2 === 0) { 
                        if (list[preQuot] === c) { 
                            notValue = true; 
                            preQuot = -1; 
                        } 
                    } 
                } 
                //非值 
                else { 
                    //开始引号 
                    if (preQuot == -1) { 
                        preQuot = i; 
                        notValue = false; 
                    } 
                    //结束引号 
                    else if (list[preQuot] === c) { 
                        notValue = true; 
                        preQuot = -1; 
                    } 
                } 
            } 
            //逗号 
            else if (c === ']' || c === '}') { 
                //非值 
                if (notValue) { 
                    for (j = i - 1; j > -1; j--) { 
                        if (/^[\t\r\n\s ]+$/.test(list[j])) {continue;} 
                        else { if (list[j] === ',') list[j] = ''; break; } 
                    } 
                } 
            } 
        } 
        return list.join(''); 
    } 
} 
 
/** 
* 获取事件对象event 
*/ 
function getEvent(){ 
     if(window.event)    {return window.event;} 
     func=getEvent.caller; 
     while(func!=null){ 
         var arg0=func.arguments[0]; 
         if(arg0){ 
             if((arg0.constructor==Event || arg0.constructor ==MouseEvent 
                || arg0.constructor==KeyboardEvent) 
                ||(typeof(arg0)=="object" && arg0.preventDefault 
                && arg0.stopPropagation)){ 
                 return arg0; 
             } 
         } 
         func=func.caller; 
     } 
     return null; 
} 
 
