'use strict';

var cur_time = new Object();
cur_time.div = $("cur_time");
cur_time.ajax = new AJAX();
cur_time.getCurTime = function(){
    cur_time.ajax.parseResults=function() {
        /*alert(cur_time.ajax.xmlHttp.responseText);*/
        if(!cur_time.div) cur_time.div=$("cur_time");
        cur_time.div.innerHTML = cur_time.ajax.xmlHttp.responseText;
        cur_time.timer = window.setTimeout(cur_time.getCurTime,50000);
    }
    cur_time.ajax.doRequestUsingPOST("cur_time.php?");
    
};
cur_time.timer = window.setTimeout(cur_time.getCurTime,50000);


var curlist="";
var cur_tr = new Object();

/*************page load function end****************/
function btn_click(type,args)
{
    switch(type){
    case 'sj': /*速记*/
        if(!curlist) {window.alert('Please select a list.');break;}
        window.location.href = 'learn_word_sj.htm'+'?list_id=' + curlist;
        break;
    case 'px':/*拼写*/
        if(!curlist) {window.alert('Please select a list.');break;}
        window.location.href = 'learn_word_px.htm'+'?list_id=' + curlist;
        break;

    case 'qddr':/*确定导入*/
        $("list_action").value="add";
        document.forms[0].submit();
        break;
    case 'yl':/*导入预览*/
        document.forms[0].submit();
        break;
    case 'cxdc': /*查询单词*/
        /*$("word").outerHTML="";*/
        $("mean").outerHTML="";
        $("audio").outerHTML="";
        $("list_action").value="qury";
        document.forms[0].submit();
        break;
    case 'tjsc': /*添加生词*/
        $("list_action").value="add";
        document.forms[0].submit();
        break;
    case 'fhdcgl':/*返回单词管理*/
        window.location.href="panel_manage_word.php?list_id="+$("list_id").value;
        break;
    case 'fhdclb':/*返回单词列表*/
        window.location.href="panel_manage_list.php";
        break;
    case 'fhisWordFromString':/*返回单词导入*/
        //document.forms[0].action = "panel_from_file.php";
        //document.forms[0].submit();
        window.location.href="panel_from_file.php?list_id="+$("list_id").value;
        break;
    case 'kclx': /*选择课程类型*/
        document.forms[0].submit();
        break;
    case 'wbgs': /*选择课程类型*/
        if($("input_type").value==3)
            $('sep_symbol_div').style.display="inline";
        else $('sep_symbol_div').style.display="none";
        break;
    case 'goto_tjdc': /*选择课程类型*/
        window.location.href=args[0]+"?"+args[1];
        break;
    case 'goto_xgdc': /*选择课程类型*/
        window.location.href=args[0]+"?"+args[1];
        break;
    case 'act_xgdc': /*选择课程类型*/
        $("list_action").value="change";
        document.forms[0].submit();
        break;
    case 'refresh': /*选择课程类型*/
        $("list_action").value="refresh";
        $("word").outerHTML="";
        $("mean").outerHTML="";
        $("audio").outerHTML="";
        document.forms[0].submit();
        break;
    case 'act_dcdel': /*删除单词*/
        var len = Rows.length;
        if(len>0)
        {
            var str = "[" + Rows[0].sn +"] " + Rows[0].list_name;
            for(var i=1;i<len;i++) str += ",[" + Rows[i].sn +"] " + Rows[i].list_name;
            if(window.confirm("Are you sure you want to delete the word: "+str+" ?"))
            {
                window.location.href =args[0]+"?list_action=del&list_id="+$("list_id").value+"&word_id="+curlist;
            }
        }
        else 
        {
            window.alert("Please select a word.");
        }
        break;
    case 'lbcsjldel': /*删除列表测试记录*/
        var len = Rows.length;
        if(len>0)
        {
            var str = "[" + Rows[0].sn +"] " + Rows[0].list_name;
            for(var i=1;i<len;i++) str += ",[" + Rows[i].sn +"] " + Rows[i].list_name;
            if(window.confirm("Are you sure you want to delete the record: "+str+" ?"))
            {
                window.location.href ="panel_test_history.php?list_action=del&test_id="+curlist;
            }
        }
        else window.alert("Please select a list.");
        break;
    case 'lbxxjldel': /*删除列表学习记录*/
        var len = Rows.length;
        if(len>0)
        {
            var str = "[" + Rows[0].sn +"] " + Rows[0].list_name;
            for(var i=1;i<len;i++) str += ",[" + Rows[i].sn +"] " + Rows[i].list_name;
            if(window.confirm("Are you sure you want to delete the record: "+str+" ?"))
            {
                window.location.href ="learnHistory.action?action_type=del&learn_id="+curlist;
            }
        }
        else window.alert("Please select a list.");
        break;
    case 'act_lbdel': /*删除列表*/
        var len = Rows.length;
        if(len>0)
        {
            var str = "[" + Rows[0].sn +"] " + Rows[0].list_name;
            for(var i=1;i<len;i++) str += ",[" + Rows[i].sn +"] " + Rows[i].list_name;
            if(window.confirm("Are you sure you want to delete the list: "+str+" ?"))
            {
                window.location.href ="panel_manage_list.php?list_action=del&list_id="+curlist;
            }
        }
        else window.alert("Please select a list.");
        break;
    case 'jrscb': /*添加生词*/
        $("list_action").value="add";
        document.forms[0].submit();
        break;
    case 'fhsy': /*返回首页*/
        window.location.href="index.action";
        break;
    case 'fhcsls': /*返回测试历史*/
        window.location.href="panel_test_history.php?"+curlist;
        break;
    case 'fhxxls': /*返回学习历史*/
        window.location.href="panel_learn_history.php?"+curlist;
        break;
    case 'fhxxjh': /*返回学习历史*/
        window.location.href="panel_plan.php";
        break;
    case 'xxxx':
        
        break;
    default:
        break;
    }
}


/*****************InputTip.js start*****************************/
function InputTip(objid)
{
    this.str=null;/*搜索字符串*/
    this.sugbox=null;/*搜索提示框*/
    this.visble = false;/*提示列表是否已经显示*/

    var inputbox=bui.g(objid);
    if(this.inputbox==null) this.inputbox=inputbox; /*搜索输入框*/
    inputbox=this.inputbox;

    this.objwidth="400px";/*inputbox.offsetWidth;*/
    this.objheight="500px";/*inputbox.offsetHeight;*/
    this.yposition=inputbox.offsetTop+40;
    this.xposition=inputbox.offsetLeft+10;
    
    inputbox.parentobj=this;

    inputbox.onkeyup=function()
    {/*根据输入动态改变提示*/
        var parentobj=inputbox.parentobj;
        if(parentobj.onkeyup!=null) parentobj.onkeyup(this);
        parentobj.str=this.value.trim();
        switch(window.event.keyCode)
        {
            case 8:/*Enter*/
                $("audio").value="";
                $("mean").value="";
                parentobj.loaddata();
                break;
            case 13:/*Enter*/
                if(parentobj.visble&&!!parentobj.sugbox.curSelectedItem){this.value = parentobj.sugbox.curSelectedItem.value;
                }
                parentobj.hidesug();
                quryWord($("quryWord"));
                break;
            case 38:/*up*/
                if(parentobj.visble){
                if(parentobj.sugbox) 
                {parentobj.sugbox.moveup();} 
                }else 
                {parentobj.loaddata();}
                break;
            case 40:/*down*/
                if(parentobj.visble){if(parentobj.sugbox) {parentobj.sugbox.movedown();}}
                 else parentobj.loaddata();
                break;
            default:
                parentobj.loaddata();
                break;
        }
    };
    inputbox.onblur=function()
    {
        if(this.parentobj.onblur!=null) this.parentobj.onblur(this);
        if(this.parentobj.sugbox){ if(this.parentobj.sugbox.closeble) 
            this.parentobj.hidesug();}
        /*return true;*/
    };
    if(this.container==null) 
    {
        var container=document.createElement("DIV");
        container.className = "icibaSugContainer";
        this.inputbox.parentElement.appendChild(container); 
        this.container=container; 
        /*container是用于显示提示框的DIV容器*/
    };
    this.loaddata=function()
    {
        if(this.str=="") {
            if(this.sugbox) this.sugbox.closeble = true;
            this.hidesug();
        }
        else    {
            this.showsug();
            if(!this.sugbox)
            {
                var sugbox=new Inputsugbox(this);
                this.sugbox=sugbox;
            }
            else
                this.sugbox.init();
        }
    };
    this.showsug = function()
    {
        //this.container.innerHTML="";
        /*this.container.style.display="block";*/
        this.visble = true;
    };
    this.hidesug = function()
    {
        //this.container.innerHTML="";
        this.container.style.display="none";
        this.visble = false;
    };
/**/
    return this;
}

/*ChildTipTable对象用于显示返回的前十条搜索提示结果*/
function Inputsugbox(parentobj)
{
    this.closeble=true; /*closeble搜索提示框是否可以被隐藏,当其处于活动时,是不能被隐藏的*/    
    this.parentobj=parentobj;
    
    this.table=null;  //显示提示结果的table对象
    this.childrens=null;//存放搜索结果
    this.curSelectedItem = null;//选中项
    this.mouse = false;

    this.onmouseover=function(obj)
    {
        if(this.parentobj.onmouseover!=null) this.parentobj.onmouseover();
        if(obj!=null)
        {
            obj.className="icibaSugItemMouseOver";
            this.closeble=false;
        }
    };
    this.onmouseout=function(obj)
    {
        if(this.parentobj.onmouseout!=null) this.parentobj.onmouseout();
        if(obj!=null)
        {
            obj.className="icibaSugItemMouseOut";
            this.closeble=true;
        }
    };
    this.onclick=function(obj)
    {
        if(this.parentobj.onclick!=null) this.parentobj.onclick();
        if(obj!=null)
        {
            this.parentobj.str=obj.value;
            this.parentobj.inputbox.value=this.parentobj.str;
            this.closeble=true;
            this.parentobj.hidesug();
            quryWord($("quryWord"));
        }
    };
    this.init = function()
    {
        //alert("OK");
        //alert(this.table);
        getresultarray(parentobj);
    };
    this.buildhtml = function (){
        if(this.table==null)
        {
            var table=document.createElement("DIV");
            //table.border=0;table.cellSpacing=0;table.cellPadding=0;
            table.className="icibaSugSubContainer1";//"icibaSugContainer";//
            this.table=table;
            var str = this.parentobj.str;
            var preItem=null,nextItem=null;
            var tr,td,list_id=0;
            
            for(var i=0;i<this.resultArray.length;i++)
            {
                tr = document.createElement("DIV");
                table.appendChild(tr);
                tr.className = "icibaSugItemMouseOut";
                
                tr.innerHTML="<div class=\"icibaSugItemWords\">"
                    +this.resultArray[i].replace(eval("/^(" + str +  ")/ig"),"<span class=\"icibaSugItemPartHighLight\">$1</span>")
                    +"</div>";

                tr.parentobj=this;
                tr.onmouseover=function(){if(this.parentobj.focusItem!=null) this.parentobj.focusItem(this);}
                tr.onmouseout=function(){if(this.parentobj.blurItem!=null) this.parentobj.blurItem(this);}
                tr.onclick=function(){if(this.parentobj.onclick!=null) this.parentobj.onclick(this);}

                tr.list_id = list_id++;
                tr.value = this.resultArray[i];
                if(!preItem)
                {
                    preItem=tr;
                    this.firstChild = tr;
                }
                else
                {
                    tr.preItem = preItem;
                    tr.preItem.nextItem = tr;
                    preItem=tr;
                }
                this.parentobj.container.appendChild(table);
            }
        }
        else
        {
            //alert(this.table.innerHTML);
            this.curSelectedItem=null;
            var ftr,len=this.resultArray.length;
            for(var i=0;i<10;i++)
            {    
                ftr=this.table.childNodes(i);
                ftr.style.display="none";
                ftr.innerHTML="";
                if(i<len)
                {
                    str = this.parentobj.str;
                    ftr.style.display="block";
                    ftr.value = this.resultArray[i];
                    ftr.className = "icibaSugItemMouseOut";
                    ftr.innerHTML="<div class=\"icibaSugItemWords\">"
                    +this.resultArray[i].replace(eval("/^(" + str +  ")/ig"),"<span class=\"icibaSugItemPartHighLight\">$1</span>")
                    +"</div>";
                }
            }
        };
        this.parentobj.container.style.display = "block";
    };
        /*this.curSelectedItem = this.firstChild;*/

    this.moveup=function()
    {
        this.mouse = true;
        if(!this.curSelectedItem) 
        {
            this.curSelectedItem = this.firstChild;
            this.focusItem(this.firstChild);
        }
        else 
        {
             if(this.curSelectedItem.preItem&&this.curSelectedItem.preItem.style.display=="block")
            {
                this.blurItem(this.curSelectedItem);
                this.focusItem(this.curSelectedItem.preItem);
            }
        };
        
    };
    this.movedown=function()
    {
        this.mouse = true;
        if(!this.curSelectedItem) 
        {
            this.curSelectedItem = this.firstChild;
            this.focusItem(this.firstChild);
        }
        else 
        {
             if(this.curSelectedItem.nextItem&&this.curSelectedItem.nextItem.style.display=="block")
            {
                this.blurItem(this.curSelectedItem);
                this.focusItem(this.curSelectedItem.nextItem);
            }
        };
        
    };
    this.focusItem=function(obj)
    {
        if(this.parentobj.focusItem!=null) this.parentobj.focusItem();
        if(this.curSelectedItem)
        {
            this.curSelectedItem.className="icibaSugItemMouseOut";
        }
        if(obj!=null)
        {
            obj.className="icibaSugItemMouseOver";
            this.closeble=false;
            this.curSelectedItem = obj;
            if(this.mouse){parentobj.inputbox.value = parentobj.sugbox.curSelectedItem.value;this.mouse=false;}
        }
    }
    this.blurItem=function(obj)
    {
        if(this.parentobj.focusItem!=null) this.parentobj.focusItem();
        if(obj!=null)
        {
            obj.className="icibaSugItemMouseOut";
            this.closeble=true;
        }
    }
}

function quryWord(obj){
    var word=$("word").value;
    if(word.trim().length==0) return;
    if(!obj.ajax)
    obj.ajax = new AJAX();
    obj.ajax.parseResults=function() {
        var resultArray;
        var reText = this.xmlHttp.responseText;
        reText = reText.replace(/[\n\r]/g,"")
        reText = reText.replace(/%%/g,"$");
        reText = reText.replace(/%/g,"");
        if(reText=="") return;
        resultArray = reText.split("$");
        //alert(xmlHttp.responseText);
        $("word").value = resultArray[0];
        $("audio").value = resultArray[2];
        $("mean").value = resultArray[1];
    }
    obj.ajax.doRequestUsingPOST("MiniDict.servlet?word="+word);
    //doRequestUsingPOST("panel_dic.php?word="+word+"&lang=en2ch&action=sug");
}

function getresultarray(obj)
{//得到前十条搜索提示
    var word=obj.str;
    if(word.length==0) return;
    if(!obj.ajax)
    obj.ajax = new AJAX();
    obj.ajax.parseResults=function() {
        var resultArray;
        var reText = this.xmlHttp.responseText;
        reText = reText.replace(/%%/g,"$");
        reText = reText.replace(/%/g,"");
        if(reText=="") return;
        resultArray = reText.split("$");
        //alert(xmlHttp.responseText);
        myInputTip.sugbox.resultArray = resultArray;
        
        myInputTip.sugbox.buildhtml();
    }
    obj.ajax.doRequestUsingPOST("MiniDict.servlet?word="+word+"&lang=en2ch&action_type=sug");
    //doRequestUsingPOST("panel_dic.php?word="+word+"&lang=en2ch&action=sug");
}
/***************AJAX start******************/

function AJAX()
{
    this.xmlHttp=null;
    this.createXMLHttpRequest = function() {
        if (window.ActiveXObject) {
            this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            this.xmlHttp = new XMLHttpRequest();
        }
    };
    this.doRequestUsingPOST = function(str) {
        this.createXMLHttpRequest();
        var url = str +"&" + new Date().getTime();
        this.xmlHttp.open("POST", url, true);
        this.xmlHttp.onreadystatechange = this.handleStateChange;
        this.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        this.xmlHttp.send(null);
    };
    var parentobj = this;
    this.handleStateChange = function() {
        if(parentobj.xmlHttp.readyState == 4) {
            if(parentobj.xmlHttp.status == 200) {
                parentobj.parseResults();
            }
        }
    };
    this.parseResults=function() {
    }
}

/***********************AJAX end*****************************************/



/**********************cookie***********************************/
function setCookie(sName, sValue, oExpires, sPath, sDomain, bSecure) {
    var sCookie = sName + "=" + encodeURIComponent(sValue);

    if (oExpires) {
        sCookie += "; expires=" + oExpires.toGMTString();
    }

    if (sPath) {
        sCookie += "; path=" + sPath;
    }

    if (sDomain) {
        sCookie += "; domain=" + sDomain;
    }

    if (bSecure) {
        sCookie += "; secure";
    }

    document.cookie = sCookie;
}
                
function getCookie(sName) {

    var sRE = "(?:; )?" + sName + "=([^;]*);?";
    var oRE = new RegExp(sRE);
    
    if (oRE.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
    } else {
        return null;
    }

}                

function deleteCookie(sName, sPath, sDomain) {
    var sCookie = sName + "=; expires=" + (new Date(0)).toGMTString();
    if (sPath) {
        sCookie += "; path=" + sPath;
    }

    if (sDomain) {
        sCookie += "; domain=" + sDomain;
    }
    
    document.cookie = sCookie;
}

function clearHistory()
{
    if(window.confirm("Are you sure you want to clear the history?"))
    deleteCookie("history_str");
    deleteCookie("history_index");
    //window.location.href = "javascript:window.location.href=window.location.href";
}

function readHistory()
{
    var cur_word,history_list,sn,str,word,words,len,list_iner,is_exist,cur_word,txt,date;
    cur_word = $("cur_word").value;
    history_list = $("history_list");
    
    str = getCookie("history_str");
    if(!str) str="";
    words = str.split("$");

    //检查历史数组元素
    len = words.length-1;
    for(i=len;i>=0;i--)
    {
        if(words[i].length<1) words = words.del(i);
        else 
        {
            word = unescape(words[i]);
            if(cur_word.trim() == word.trim()) {is_exist = true;}
        }
    }
    if(cur_word.length>0&&!is_exist)
        words.push(escape(cur_word));

    //生成列表
    list_iner = "";
    len = words.length-1;
    for(i=len;i>=0;i--)
    {
        word = unescape(words[i]);
        if(cur_word.trim() == word.trim()) {sn = i;}
        txt = word;
        if(word.length>17)    txt = word.substring(0,16) + "...";
        list_iner += "<li><a title=\"" + word + "\" href=\"panel_dict.php?word=" + word + "\">" + txt + "</a></li>";
    }
    history_list.innerHTML = list_iner;
    
/*    if(sn>len||len==-1||(sn==len&&len>0)) 
    {
        sn = words.length-1;
        $("nextBtn").src = "/image/btn_history_next0.gif";
        $("nextBtn").parentElement.removeAttribute('href');
    }
    if(sn<=0||len==-1)
    {
        sn = 0;
        $("preBtn").src = "/image/btn_history_back0.gif";
        $("preBtn").parentElement.removeAttribute('href');
    }*/
    date = new Date();
    date.setTime(date.getTime()+3600*60*600000);
    setCookie("history_index",sn,date);
    history_str = words.join("$");
    setCookie("history_str", history_str,date);
}

function preHistory()
{
    window.history.back();
}

function nextHistory()
{
    window.history.forward();
}
function showHistory()
{
    var i,main_body,htm_str,k;
    
    str = getCookie("history_str");
    if(!str) str="";
    words = str.split("$");

    //检查历史数组元素
    len = words.length-1;
    for(i=len;i>=0;i--)
    {
        if(words[i].length<1) words = words.del(i);
    }

    //生成列表
    k = 0;
    htm_str = [];
    htm_str[k++] = "<table cellspacing=\"0\" cellpadding=\"0\" id=\"restore_table\">";
    htm_str[k++] = "<tbody>";
    htm_str[k++] = "<tr class=\"tr_width\">";
    htm_str[k++] = "    <td style=\"width: 35px\"></td>";
    htm_str[k++] = "    <td style=\"width: 167px\"></td>";
    htm_str[k++] = "    <td style=\"width: 135px\"></td>";
    htm_str[k++] = "    <td style=\"width: 25px\" ></td>";
    htm_str[k++] = "    <td style=\"width: 25px\" ></td>";
    htm_str[k++] = "    <td style=\"width: 12px\" ></td>";
    htm_str[k++] = "</tr>";
    htm_str[k++] = "</tbody>";
    htm_str[k++] = "<tbody>";



    len = words.length;
    for(i=0;i<len;i++)
    {
        str = words[i];
        word = unescape(str);
        txt = word;
        if(word.length>30)    txt = word.substring(0,29) + "...";
        
        htm_str[k++] = "<tr onclick=\"onfocusit(this,event)\" onselectstart=\"return false\" class=\"tr_1\">";
        htm_str[k++] = "    <td value=\""+(i+1)+"\">"+(i+1)+"</td>";
        htm_str[k++] = "    <td value=\""+word+"\"><a href=\"panel_dict.php?word="+word+"\" title=\""+word+"\">"+txt+"</a></td>";
        htm_str[k++] = "    <td value=\"1230080587\">2008-12-24 09:03</td>";
        htm_str[k++] = "    <td><a href=\"javascript:addNotebook('"+str+"');\"><img alt=\"Add to My Notebook\" src=\"image/btn_myword_add.gif\" /></a></td>";
        htm_str[k++] = "    <td><a href=\"javascript:delHistory('"+str+"');\"><img src=\"image/icon_del.gif\" alt=\"Delete\" /></a></td>";
        htm_str[k++] = "    <td>&nbsp;</td>";
        htm_str[k++] = "</tr>";

    }

    htm_str[k++] = "</tbody>";
    htm_str[k++] = "</table>";
    //$("main_body").innerHTML = htm_str;
    $("listtable").innerHTML = htm_str.join("");
    $("loading").style.display="none";
    $("history_table").style.display="block";
}
function exportToTxt()
{
    var str = getCookie("history_str");
    if(!str) str="";
    window.location.href = "panel_exportToTxt.php?str="+str;
}
function addAllToNotebook()
{
    var str = getCookie("history_str");
    if(!str) str="";
    deleteCookie("history_str");
    deleteCookie("history_index");
    window.location.href = "panel_add_to_notebook.php?words="+str;
}

function addNotebook(w)
{
    delHistory(w);
    window.location.href = "panel_add_to_notebook.php?words="+str;
}
function delHistory(w)
{
    if(w.toString().length<1) return;
    var cur_word,history_list,sn,str,word,words,len,list_iner,is_exist,cur_word,txt,date;
    cur_word = w;
    
    str = getCookie("history_str");
    if(!str) str="";
    words = str.split("$");

    //检查历史数组元素
    len = words.length-1;
    for(i=len;i>=0;i--)
    {
        if(words[i]==cur_word) {words[i]="";}
        if(words[i].length<1) words = words.del(i);
    }
    
    date = new Date();
    date.setTime(date.getTime()+3600*60*600000);
    setCookie("history_index",0,date);
    history_str = words.join("$");
    setCookie("history_str", history_str,date);
    window.location.href = window.location.href;
}
/*********************cookie end******************************/
/*********************loading start****************************/


/*********************loading end****************************/
/*********************login start****************************/

function login(frm)
{
    var user_name,user_password,date;
    user_name = $('user_name').value;
    
    user_name = user_name.trim();
    date = new Date();
    date.setTime(date.getTime()+2*3600*60*600000);
    setCookie("user_name", user_name,date);
    
    return true;
}

/*********************login end****************************/