'use strict';
/*
 * cb-web
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path:    ui/Table.js
 * desc:    表格控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-09-01 14:02:10 +0800 (周四, 01 九月 2011) $
 */

/**
 * 表格框控件
 *
 * @param {Object} options 控件初始化参数.
 */
bui.Table = function(options) {
    this.initOptions(options);
    this.type = 'table';

    /**
     * 选择行时用的关键字字段
     *
     * @public
     * @type {String}
     */
    this.keyField = this.keyField || null;
    /**
     * 多时用于存储选择项的map[用于通过keyField快速定位]和list[用于二次使用如作为新table的datasource]
     */
    this.selectedItemList = [];
    this.selectedItemMap = {};
    /**
     * 单选时用于存储当前选择项的keyField
     */
    this.preSelectIndex = null;

    this.noDataHtml = this.noDataHtml || '';
    this.setFields(this.fields);
};

bui.Table.prototype = {
    /**
     * dom表格起始的html模板
     *
     * @private
     */
    tplTablePrefix: '<table cellpadding="0" cellspacing="0" border="0" width="#{0}" control="#{1}">',

    /**
     * 将控件填充到容器元素
     *
     * @public
     * @param {HTMLElement} container 容器元素.
     */
    appendTo: function(container) {
        var div = document.createElement('div');
        container.appendChild(div);
        this.render(div);
    },

    /**
     * 绘制表格
     *
     * @public
     */
    render: function(main) {
        var me = this;

        me.main = main || me.main;
        main = me.main;

        if (!me._fields) {
            return;
        }

        // 如果未绘制过，初始化main元素
        if (!me.isRendered) {
            bui.Control.addClass(main, me.getClass());
        }

        me._width = me.getWidth();
        me.initColsWidth();
        main.style.width = me._width + 'px';

        me.renderHead();    // 绘制表格头
        me.renderBody();    // 绘制列表
        
        me.isRendered = true;
    },

    /**
     * 初始化列宽
     *
     * @private
     */
    initColsWidth: function() {
        var me = this,
            canExpand = [],
            leaveAverage,
            leftWidth,
            fields = me._fields,
            field,
            len = fields.length,
            offset,
            width,
            i, len;

        me.colsWidth = [];

        // 减去边框的宽度
        leftWidth = me._width - len - 2;

        // 读取列宽并保存
        for (i = 0; i < len; i++) {
            field = fields[i];
            width = parseInt(field.width, 10);
            leftWidth -= width;
            me.colsWidth.push(width);
            if (!field.stable) {
                canExpand.push(i);
            }
        }

        // 根据当前容器的宽度，计算可拉伸的每列宽度
        len = canExpand.length;
        leaveAverage = Math.floor(leftWidth / len);
        for (i = 0; i < len; i++) {
            offset = Math.abs(leftWidth) > Math.abs(leaveAverage)
                        ? leaveAverage
                        : leftWidth;

            leftWidth -= offset;
            me.colsWidth[canExpand[i]] += offset;
        }
    },

    /**
     * 获取表格所在区域宽度
     *
     * @private
     * @return {number}
     */
    getWidth: function() {
        if (this.width) {
            return this.width;
        }

        // FIXME 有可能算出的width为0
        var me = this,
            width = 0,
            rulerDiv = document.createElement('div'),
            parent = me.main.parentNode;
        if(parent) {
            parent.appendChild(rulerDiv);
            width = rulerDiv.offsetWidth;
            parent.removeChild(rulerDiv);
        }
        
        return width;
    },
    /**
     * 第一列的多选框
     *
     * @private
     */
    checkboxField: {
        width: 30,
        stable: true,
        select: true,
        title: function() {
            return '<input type="checkbox" id="'
                    + this.getId('selectAll') + '"'
                    + (this.allChecked?' checked="checked"':'')
                    + ' onclick="'
                    + "bui.Control.get('"+this.getId()+"','"+this.getAction().id+"').toggleSelectAll()"
                    + '" />';
        },

        content: function(item, index) {
            return '<input type="checkbox" id="'
                    + this.getId('multiSelect') + index + '"' 
                    + 'sid="' + item[this.keyField] + '"'
                    + 'index="' + index + '"'
                    + (this.selectedItemMap[item[this.keyField]]?' checked="checked"':'')
                    + ' onclick="' + 'bui.Control.get(\''+this.getId()+'\',\''+this.getAction().id+'\').rowCheckboxClick(event,\''+index+'\',\''+item[this.keyField]+'\')' + '" />';
        }
    },

    /**
     * 第一列的单选框
     *
     * @private
     */
    radioboxField: {
        width: 30,
        stable: true,
        title: '&nbsp;',
        select: true,
        content: function(item, index) {
            var id = this.getId('singleSelect');
            return '<input type="radio" id="'
                    + id + index + '"' 
                    + 'sid="' + item[this.keyField] + '"'
                    + 'index="' + index + '"'
                    + (this.preSelectIndex !== null && this.preSelectIndex == item[this.keyField]?' checked="checked"':'')
                    + ' name="' + id + '" onclick="'
                    + 'bui.Control.get(\''+this.getId()+'\',\''+this.getAction().id+'\').selectSingle(\''+index+'\',\''+item[this.keyField]+'\');'
                    + 'var e=arguments[0]||window.event;if(e.stopPropagation){e.stopPropagation();}else{e.cancelBubble=true;}" />';
        }
    },

    /**
     * 初始化表格的字段
     *
     * @protected
     * @param {Array} fields 字段数组.
     */
    setFields: function(fields) {
        if (!fields) {
            return;
        }

        // 避免刷新时重新注入
        var _fields = fields.slice(0),
            len = _fields.length;
        while (len--) {
            if (!_fields[len]) {
                _fields.splice(len, 1);
            }
        }
        this._fields = _fields;

        if (!this.select) {
            return;
        }

        switch (String(this.select).toLowerCase()) {
            case 'multi':
                _fields.unshift(this.checkboxField);
                break;
            case 'single':
                _fields.unshift(this.radioboxField);
                break;
        }
    },
    /**
     * 获取列表体容器素
     *
     * @public
     * @return {HTMLElement}
     */
    getBody: function() {
        return bui.g(this.getId('body'));
    },

    /**
     * 获取列表头容器元素
     *
     * @public
     * @return {HTMLElement}
     */
    getHead: function() {
        return bui.g(this.getId('head'));
    },

    /**
     * 获取checkbox选择列表格头部的checkbox表单
     *
     * @private
     * @return {HTMLElement}
     */
    getHeadCheckbox: function() {
        return bui.g(this.getId('selectAll'));
    },

    onselect: function(index){},

    /**
     * 行的checkbox点击时间处理函数
     *
     * @private
     */
    rowCheckboxClick: function(e, index, selectedItemId) {
        var me = this,
            i,
            len,
            list,
            idx,
            start = null,
            end = null,
            checked;

        e = window.event || e;
        if (me.selectMode != 'line') {
            if (me.lastClick && e.shiftKey){
                list = me.main.getElementsByTagName('INPUT');
                for (i=0,len=list.length;i<len;i++){
                    idx = list[i].getAttribute('index');
                    if (idx === index || idx === me.lastClick.index) {
                        start = start || list[i];
                        end = start == null ? null : list[i];
                    }
                }
            }
            if (start && start && start.checked == end.checked){
                checked = start.checked;
                start = start.getAttribute('index');
                end = end.getAttribute('index');
                for (i=0,len=list.length;i<len;i++){
                    idx = list[i].getAttribute('index');
                    if (idx !== null && parseInt(idx,10) >= parseInt(start ,10)&& parseInt(idx,10) <= parseInt(end,10)) {
                        list[i].checked = checked;
                        me.selectMulti(idx, list[i].getAttribute('sid'));
                    }
                }
            }
            else {
                me.selectMulti(index, selectedItemId);
            }
        } else {
            me.preSelectIndex = index;
        }
        me.lastClick = {'index': index, 'selectedItemId': selectedItemId};
    },

    /**
     * 根据checkbox是否全部选中，更新头部以及body的checkbox状态
     *
     * @private
     * @param {number} index 需要更新的body中checkbox行，不传则更新全部.
     */
    selectMulti: function(index, selectedItemId) {
        var me = this,
            row, input,
            cbIdPrefix = me.getId('multiSelect');

        if (me.onselect && me.onselect(index, selectedItemId) !==false ) {
            row = me.getRow(index);
            input = bui.g(cbIdPrefix + index);
            
            if(!input.checked){
                //删除对应项
                me.removeSelectedItem(selectedItemId, index);
            }else{
                //保存选择项
                me.addSelectedItem(selectedItemId, index);
            }
        }
                    
        if(me.afterselect) {
            me.afterselect();
        }
        
        me.refreshSelected();
    },

    /**
     * 单选选取
     *
     * @private
     * @param {number} index 选取的序号.
     */
    selectSingle: function(index, selectedItemId) {
        var me = this,
            selectedIndex = me.selectedIndex,
            i, len, list = me.datasource;

        if (me.onselect(index, selectedItemId) !== false) {
            if (selectedIndex != '' && me.selectedItemList.length == 1
                && String(parseInt(selectedIndex)) === String(selectedIndex).replace(/[ ]*/g,'')) {
                //这里本应该刷新列表,考虑到代价太大,只更新前一选择项,只是以后扩展可能会有隐患
                me.removeSelectedItem(me.selectedItemList[0][me.keyField], selectedIndex);
            }
            me.selectedIndex = index;
            //保存选择项
            if(selectedItemId){
                me.addSelectedItem(selectedItemId, index);
            }
            
            if(me.afterselect) {
                me.afterselect();
            }
        }
    },

    /**
     * 全选/不选 所有的checkbox表单
     *
     * @private
     */
    toggleSelectAll: function() {
        this.selectAll(this.getHeadCheckbox().checked);
    },

    /**
     * 更新所有checkbox的选择状态
     *
     * @private
     * @param {boolean} checked 是否选中.
     */
    selectAll: function(checked) {
        var me = this,
            inputs = me.getBody().getElementsByTagName('input'),
            len = inputs.length,
            i = 0,
            input, inputId, selectedItemId;
        if (me.onselect('all') !== false) {
            for (; i < len; i++) {
                input = inputs[i];
                inputId = input.id;
                if (input.getAttribute('type') == 'checkbox' && inputId && inputId.indexOf('multiSelect') > 0) {
                    inputs[i].checked = checked;
                    selectedItemId = input.getAttribute('sid');
                    if (checked) {
                        if(!me.selectedItemMap[selectedItemId]){
                            me.addSelectedItem(selectedItemId, input.getAttribute('index'));
                        }
                    } else {
                        if(me.selectedItemMap[selectedItemId]){
                            me.removeSelectedItem(selectedItemId, input.getAttribute('index'));
                        }
                    }
                }
            }
        }
        me.allChecked = checked;
        
        if(me.afterselect) {
            me.afterselect();
        }
    },
    
    /**
     * 选择功能 - 增加对应项
     *
     * @private
     */
    addSelectedItem: function(selectedItemId, index) {
        var me = this,
            selectedClass = me.getClass('row-selected'),
            i, len, list;
        if(index != undefined) index = parseInt(index);
        
        if(selectedItemId && String(selectedItemId).replace(/\s/g,'') != "undefined"){
            list = me.datasource;
            for(i=0,len=list.length;i<len;i++){
                if(list[i][me.keyField] == selectedItemId){
                    me.selectedItemList.unshift(list[i]);
                    me.selectedItemMap[selectedItemId] = 1;
                    break;
                }
            }
        }else{
            if(!me.selectedItemMap[index]){
                me.selectedItemList.unshift(index);
                me.selectedItemMap[index] = 1;
            }
        }
        if ( index !== undefined ){
            bui.Control.addClass(me.getRow(index), selectedClass);
        }
    },
    
    /**
     * 选择功能 - 删除对应项
     *
     * @private
     */
    removeSelectedItem: function(selectedItemId, index) {
        var me = this,
            selectedClass = me.getClass('row-selected'),
            i, len, list;
        if(index != undefined) index = parseInt(index);
        
        if(selectedItemId && String(selectedItemId).replace(/\s/g,'') != "undefined"){
            list = me.selectedItemList;
            for (i = 0,len = list.length; i < len; i++) {
                if (String(list[i][me.keyField]) === String(selectedItemId)) {
                    me.selectedItemList.splice(i, 1);
                    me.selectedItemMap[selectedItemId] = undefined;
                    break;
                }
            }
        }else{
            if(me.selectedItemMap[index]){
                list = me.selectedItemList;
                for (i = 0,len = list.length; i < len; i++) {
                    if (String(list[i]) === String(index)) {
                        me.selectedItemList.splice(i, 1);
                        me.selectedItemMap[index] = undefined;
                        break;
                    }
                }
            }
        }
        if ( index !== undefined ){
            bui.Control.removeClass(me.getRow(index), selectedClass);
        }
    },
    /**
     * 选择功能 - 刷新列表并检测是否已经全选
     *
     * @private
     */
    refreshSelected: function(){
        var me = this,
            i, len, list,
            row, input, inputId, 
            selectedClass = me.getClass('row-selected'),
            cbIdPrefix = me.getId('multiSelect'),
            allChecked = true,
            selectAll = me.getHeadCheckbox();
        
        list = me.getBody().getElementsByTagName('input');
        for (i=0,len=list.length; i < len; i++) {
            input = list[i];
            inputId = input.id;
            if (input.getAttribute('type') == 'checkbox' && inputId && inputId.indexOf(cbIdPrefix) >= 0 ) {
                row = me.getRow(input.getAttribute('index'));
                if (!input.checked) {
                    allChecked = false;
                    bui.Control.removeClass(row, selectedClass); // add speed
                } else {
                    bui.Control.addClass(row, selectedClass);
                }
            }
        }
        
        selectAll.checked = allChecked;
        me.allChecked = allChecked;
    },
    /**
     * 绘制表格头
     *
     * @private
     */
    renderHead: function() {
        var me = this,
            type = 'head',
            id = me.getId(type),
            head = bui.g(id);

        if (me.noTitle) {
            return;
        }

        if (!head) {
            head = document.createElement('div');
            head.id = me.getId(type);
            head.className = me.getClass(type);
            me.main.appendChild(head);
        }

        head.style.width = (me._width-1) + 'px';
        head.innerHTML = me.getHeadHtml();
    },
    /**
     * 获取表格头的html
     *
     * @private
     * @return {string}
     */
    getHeadHtml: function() {
        var me = this,
            fields = this._fields,
            len = fields.length,
            html = [],
            i, field, title,
            thCntrClass = me.getClass('thcntr'),
            thTextClass = me.getClass('thtext'),
            sortClass = me.getClass('thsort'),
            selClass = me.getClass('thsel'),
            tipClass = me.getClass('thhelp'),
            contentTpl = '<div class="#{0}">#{1}</div>#{2}',
            contentHtml,
            orderClass,
            sortIconHtml,
            sortable,
            currentSort,
            tipHtml;


        // 拼装html
        html.push('<div class="ui-table-head-row">');
        html.push(bui.Control.format(me.tplTablePrefix, me._width - 2, me.getId()));
        html.push('<tr>');
        for (i = 0; i < len; i++) {
            field = fields[i];
            title = field.title;
            sortable = (me.sortable && field.sortable);
            currentSort = (sortable
                            && field.field
                            && field.field == me.orderBy);

            // 计算排序图标样式
            sortIconHtml = '';
            orderClass = '';
            if (sortable) {
                if (currentSort) {
                    orderClass = ' ' + me.getClass('th' + me.order)
                                    + ' ' + me.getClass('thcntr-sort');
                }
                sortIconHtml = bui.Control.format(me.tplSortIcon,
                                        sortClass);
            }

            // 计算内容html
            // 如果通过function制定title，则不绘制排序小图标
            if ('function' == typeof title) {
                contentHtml = title.call(me);
                sortIconHtml = '';
            } else {
                contentHtml = title || '';
            }
            contentHtml = bui.Control.format(contentTpl,
                                        thTextClass,
                                        contentHtml,
                                        sortIconHtml);
            html.push('<th id="' + this.getTitleCellId(i) + '" index="' + i + '"',
                        sortAction(field, i),
                        ' style="width:' + me.colsWidth[i] + 'px">',
                        '<div class="' + thCntrClass + orderClass +
                        (field.select ? ' ' + selClass : '') + (field.thClass ? ' ' + field.thClass : '') + '">',
                        contentHtml,
                        tipHtml,
                        '</div></th>');
        }
        html.push('</tr></table></div>');
        return html.join('');

        /**
         * 获取表格排序的单元格预定义属性html
         *
         * @private
         * @internal
         * @return {string}
         */
        function sortAction(field, index) {
            if (me.sortable && field.sortable) {
                return bui.Control.format(
                        ' onmouseover="#{0}" onmouseout="#{1}" onclick="#{2}" sortable="1"',
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').titleOverHandler(this)",
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').titleOutHandler(this)",
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').titleClickHandler(this)"
                );
            }

            return '';
        }
    },

    /**
     * 获取表格头单元格的id
     *
     * @private
     * @param {number} index 单元格的序号.
     * @return {string}
     */
    getTitleCellId: function(index) {
        return this.getId('titleCell') + index;
    },



    tplSortIcon: '<div class="#{0}"></div>',
    tplTipIcon: '<div class="#{0}" #{1}></div>',

    /**
     * 表格头单元格鼠标移入的事件handler
     *
     * @private
     * @param {HTMLElement} cell 移出的单元格.
     */
    titleOverHandler: function(cell) {
        this.sortReady = 1;
        bui.Control.addClass(cell.firstChild, this.getClass('thcntr-hover'));
    },

    /**
     * 表格头单元格鼠标移出的事件handler
     *
     * @private
     * @param {HTMLElement} cell 移出的单元格.
     */
    titleOutHandler: function(cell) {
        this.sortReady = 0;
        bui.Control.removeClass(cell.firstChild, this.getClass('thcntr-hover'));
    },
    /**
     * 表格排序事件handler及默认排序方法
     *
     * @private
     * @param {String} field 排序列.
     * @param {String} order 升降序asc/desc.
     */
    onsort: function(field, order){},
    sort: function(field, order){
        var me = this;
        me.datasource.sort(function(a,b){
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
            return (order == 'asc' ?  m - n  : n - m);
        });
        me.sorted = true;
    },

    /**
     * 表格内容点击的事件handler
     *
     * @private
     * @param {Number} index 点击的行.
     */
    bodyClickHandler: function(cell) {},
    /**
     * 表格头单元格点击的事件handler
     *
     * @private
     * @param {HTMLElement} cell 点击的单元格.
     */
    titleClickHandler: function(cell) {
        if (this.sortReady) { // 避免拖拽触发排序行为
            var me = this,
                field = me._fields[cell.getAttribute('index')].field,
                orderBy = me.orderBy,
                order = me.order;

            if (orderBy == field) {
                order = (!order || order == 'asc') ? 'desc' : 'asc';
            } else {
                order = 'desc';
            }

            me.sorted = false;
            me.order = order;
            me.orderBy = field;
            if(me.onsort) {
                me.onsort(field, order);
            }
            if(!me.sorted) {
                me.sort(field, order);
            }
            
            //如果未定关键字段则每次排序都需要清空已选列表
            if(!me.keyField){
                this.selectedItemList = [];
                this.selectedItemMap = {};
            }
            if(me.onsortFinished) {
                me.onsortFinished(field, order);
            }
            
            me.renderHead();
            me.renderBody();
        }
    },

    /**
     * 重置表头样式
     *
     * @private
     */
    resetHeadStyle: function() {
        var ths = this.getHead().getElementsByTagName('th'),
            len = ths.length,
            th;

        while (len--) {
            th = ths[len];
            bui.Control.removeClass(th.firstChild, this.getClass('thcntr-sort'));
        }
    },

    /**
     * 绘制表格主体
     *
     * @private
     */
    renderBody: function() {
        var me = this,
            type = 'body',
            id = me.getId(type),
            list = bui.g(id),
            style;

        if (!list) {
            list = document.createElement('div');
            list.id = id;
            list.className = me.getClass(type);

            if (me.bodyHeight) {
                style = list.style;
                style.height = me.bodyHeight + 'px';
                style.overflowX = 'hidden';
                style.overflowY = 'auto';
            }
            me.main.appendChild(list);
        }

        list.style.width = (me._width-2) + 'px';
        list.innerHTML = me.getBodyHtml();
    },

    /**
     * 获取表格体的单元格id
     *
     * @protected
     * @param {number} rowIndex 当前行序号.
     * @param {number} fieldIndex 当前字段序号.
     * @return {string}
     */
    getBodyCellId: function(rowIndex, fieldIndex) {
        return this.getId('cell') + rowIndex + '_' + fieldIndex;
    },

    /**
     * 获取表格主体的html
     *
     * @private
     * @return {string}
     */
    getBodyHtml: function() {
        var data = this.datasource || [],
            dataLen = data.length,
            html = [],
            i, j, item, field;

        if (!dataLen) {
            return this.noDataHtml;
        }

        for (i = 0; i < dataLen; i++) {
            item = data[i];
            if (item) {
                html.push(this.getRowHtml(item, i));
            }
        }

        return html.join('');
    },

    tplRowPrefix: '<div id="#{0}" class="#{1}" onmouseover="#{2}" onmouseout="#{3}" onclick="#{4}">',

    /**
     * 获取表格行的html
     *
     * @protected
     * @param {Object} data 当前行的数据.
     * @param {number} index 当前行的序号.
     * @return {string}
     */
    getRowHtml: function(data, index) {
        var me = this,
            html = [],
            fields = me._fields,
            fieldLen = fields.length,
            field,
            colWidth,
            content,
            tdCntrClass = me.getClass('tdcntr'),
            tdBreakClass = me.getClass('tdbreak'),
            tdClass,
            contentHtml,
            i;

        html.push(bui.Control.format(me.tplRowPrefix,
                        me.getId('row') + index,
                        me.getClass('row') + (me.selectedItemMap[data[me.keyField]]?' '+me.getClass('row-selected'):''),
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').rowOverHandler("+index+")",
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').rowOutHandler("+index+")",
                        "bui.Control.get('"+me.getId()+"','"+me.getAction().id+"').rowClickHandler("+index+")"
            ),
            bui.Control.format(me.tplTablePrefix, me._width - 2, me.getId()));

        for (i = 0; i < fieldLen; i++) {
            field = fields[i];
            content = field.content;
            colWidth = me.colsWidth[i];
            tdClass = field.breakLine ? tdBreakClass : tdCntrClass;
            if (field.select) {
                tdClass += ' ' + me.getClass('tdsel');
            }


            contentHtml = '<div class="' + tdClass + '">';
            contentHtml += (field.breakLine ? '' : '<nobr>');
            contentHtml += (field.tdClass ? '<span class="'+field.tdClass+'">' : '');
            contentHtml += ('function' == typeof content ? content.call(me, data, index, i) : data[content]);
            contentHtml += (field.tdClass ? '</span>' : '');
            contentHtml += (field.breakLine ? '' : '</nobr>') + '</div>';

            html.push('<td id="' + me.getBodyCellId(index, i) + '"',
                    ' style="width:' + colWidth + 'px" control="' + me.getId(),
                    '" row="' + index + '" col="' + i + '">',
                    contentHtml,
                    '</td>');
        }
        html.push('</tr></table></div>');

        return html.join('');
    },
    /**
     * 表格行鼠标移上的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowOverHandler: function(index) {
        var row = this.getRow(index);
        if (row) {
            bui.Control.addClass(row, this.getClass('row-over'));
        }
    },

    /**
     * 表格行鼠标移出的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowOutHandler: function(index) {
        var row = this.getRow(index);
        if (row) {
            bui.Control.removeClass(row, this.getClass('row-over'));
        }
    },

    /**
     * 阻止行选，用于点击在行的其他元素，不希望被行选时。
     *
     * @public
     */
    preventLineSelect: function() {
        this.dontSelectLine = 1;
    },

    /**
     * 表格行鼠标点击的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowClickHandler: function(index) {
        if (this.selectMode == 'line') {
            if (this.dontSelectLine) {
                this.dontSelectLine = false;
                return;
            }

            var input;

            switch (this.select) {
                case 'multi':
                    input = bui.g(this.getId('multiSelect') + index);
                    // 如果点击的是checkbox，则不做checkbox反向处理
                    if (!this.preSelectIndex) {
                        input.checked = !input.checked;
                    }
                    this.selectMulti(index, input.getAttribute('sid'));
                    this.preSelectIndex = null;
                    break;
                case 'single':
                    input = bui.g(this.getId('singleSelect') + index);
                    input.checked = true;
                    this.selectSingle(index, input.getAttribute('sid'));
                    break;
            }
        }
        this.bodyClickHandler(index);
    },

    /**
     * 获取表格内容行的dom元素
     *
     * @private
     * @param {number} index 行号.
     * @return {HTMLElement}
     */
    getRow: function(index) {
        return bui.g(this.getId('row') + index);
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        var head = bui.g(this.getId('head'));

        if (head) {
            head.onmousemove = null;
            head.onmousedown = null;
        }

        bui.Control.prototype.dispose.call(this);
    }
};

/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.Table);
/* bui.Table 继承了 bui.Control */
bui.inherits(bui.Table, bui.Control);

