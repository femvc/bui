'use strict';
/***********************table shift&ctr and sort start***************************/

    var Rows = new Array(); //所有选中的行对象
    var ShiftStartRow = ""; //Shift多选时存储开始行对象
   
    //选行主函数
    function onfocusit(obj,evt)
    {
        if(evt)
        {var event=evt;} 
        var iRow=obj;
        while(iRow.tagName!='TR')
        {
            iRow=iRow.parentNode;
        }
        
        date = new Date();
        date.setTime(date.getTime()+3600*60*600000);
        setCookie("cur_tr",iRow.rowIndex,date);
                
        //Ctrl多选
        if(event.ctrlKey&&iRow.parentNode.parentNode.getAttribute('multiple')=="1")
        {
            var j=-1;
            for(i=0;i<Rows.length;i++)
            {
                if(iRow==Rows[i])
                {
                    j=i;
                    break;
                }
            }
            if(j!=-1)
            {
                for(i=j;i<Rows.length-1;i++)
                {
                    Rows[i]=Rows[i+1];
                }
                Rows.length=Rows.length-1;
            }
            else
            {
                Rows[Rows.length]=iRow;
            }
            ShiftStartRow=iRow;
        }//Shift多选
        else if(event.shiftKey&&iRow.parentNode.parentNode.getAttribute('multiple')=="1")
        {
            if(ShiftStartRow!="")
            {
                var StartIndex=ShiftStartRow.rowIndex;
                var EndIndex=iRow.rowIndex;
                var oTable=iRow.parentNode;
                Rows.length=0;
                if(StartIndex < EndIndex)
                {
                    for(var i=StartIndex-1;i<EndIndex;i++)
                    {
                        Rows.push(oTable.rows[i]);
                    }
                }
                if(StartIndex >= EndIndex)
                {
                    for(var i=EndIndex-1;i<StartIndex;i++)
                    {
                        Rows.push(oTable.rows[i]);
                    } 
                }
            }
        }
        else
        {
            Rows.length=1;
            Rows[0]=iRow;
            ShiftStartRow=iRow;
        }
        changeColor(iRow); 
        getArgs(Rows);/*处理选中内容*/
    }
    
    //选中行变色
    function changeColor(obj)
    {
        for(var i=0;i<obj.parentNode.rows.length;i++)
        {
            obj.parentNode.rows[i].className = "tr_1";
            /*obj.parentNode.rows(i).style.background="transparent";*/
        }
        for(i=0;i<Rows.length;i++)
        {
            //alert(Rows[i].innerHTML);
            //alert(Rows.length);
            Rows[i].className = "tr_2"; 
        }
    }
    
    //删除行
    function DeleteRow()
    {
        if(Rows.length==0)
        {
            alert("请选择要删除的行!");
            return false;
        }
        var oFragment = document.createDocumentFragment();
        for(i=0;i<Rows.length;i++)
        {
            oFragment.appendChild(Rows[i]);
            Rows[i].className = "tr_1";
            /*Rows[i].style.backgroundColor="transparent";*/
            /*Rows[i].parentNode.deleteRow(Rows[i].rowIndex);*/
        }
        Rows.length=0;
        $("del_table").tBodies[1].appendChild(oFragment);
    }

     //恢复行
    function RestoreRow()
    {
        if(Rows.length==0)
        {
            alert("请选择要删除的行!");
            return false;
        }
        var oFragment = document.createDocumentFragment();
        for(i=0;i<Rows.length;i++)
        {
            oFragment.appendChild(Rows[i]);
            Rows[i].className = "tr_1";
            /*Rows[i].style.backgroundColor="transparent";*/
            /*Rows[i].parentNode.deleteRow(Rows[i].rowIndex);*/
        }
        Rows.length=0;
        $("restore_table").tBodies[1].appendChild(oFragment);
    }   
    function returnfalse()
    {
        return false;
    }

///****************表格排序start***************/
            
            function convert(sValue, sDataType) {
                switch(sDataType) {
                    case "int":
                        return parseInt(sValue);
                    case "float":
                        return parseFloat(sValue);
                    case "date":
                        return new Date(Date.parse(sValue));
                    default:
                        return sValue.toString().toLowerCase();
                
                }
            }
        
            function generateCompareTRs(iCol, sDataType) {
        
                return  function compareTRs(oTR1, oTR2) {
                            var vValue1, vValue2;
        
                            if (oTR1.cells[iCol].getAttribute("value")) {
                                vValue1 = convert(oTR1.cells[iCol].getAttribute("value"),
                                              sDataType);
                                vValue2 = convert(oTR2.cells[iCol].getAttribute("value"),
                                              sDataType);
                            } else {
                                vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue,
                                              sDataType);
                                vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue,
                                              sDataType);
                            }
                            if(parseInt(vValue1).toString().trim()==vValue1.toString().trim()&&parseInt(vValue2).toString().trim()==vValue2.toString().trim())
                            {
                                vValue1 = parseInt(vValue1);
                                vValue2 = parseInt(vValue2);
                            }
                            if (vValue1 < vValue2) {
                                return -1;
                            } else if (vValue1 > vValue2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        };
            }
           
            function sortTable(sTableID, iCol, sDataType) {
                var oTable = bui.g(sTableID);
                var oTBody = oTable.tBodies[1];
                var colDataRows = oTBody.rows;
                var aTRs = new Array;
        
                for (var i=0; i < colDataRows.length; i++) {
                    aTRs[i] = colDataRows[i];
                }
        
                if (oTable.sortCol == iCol) {
                    aTRs.reverse();
                } else {
                    aTRs.sort(generateCompareTRs(iCol, sDataType));
                }
        
                var oFragment = document.createDocumentFragment();
                for (var i=0; i < aTRs.length; i++) {
                    oFragment.appendChild(aTRs[i]);
                }
       
                oTBody.appendChild(oFragment);
                oTable.sortCol = iCol;
            }
        /****************表格排序end***************/
function getArgs()
{
    var Rs = Rows;
    var len=Rs.length;
    
    if(len<1) return;
    var str =Rs[0].getAttribute('sid');
    for(var i=1;i<len;i++) str += "," + Rs[i].getAttribute('sid');
    curlist = str;
}

/***********************table shift&ctr and sort end*************************/
