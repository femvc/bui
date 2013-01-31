'use strict';
/*
 * cb-web
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path:    ui/MultiSelect.js
 * desc:    复合选择控件
 * author:  wanghaiyang
 * date:    $Date: 2011/12/19 $
 */


bui.MultiSelect = (function() {
    // 语言
    var lang = {
        'codeAdd' : 'Add&nbsp;&gt;&gt;',
        'codeAdded' : 'Added',
        'codeAddAll' : 'Add All&gt;&gt;',
        'codeRemove' : '&lt;&lt;&nbsp;Remove',
        'codeRemoveAll' : '&lt;&lt;Remove All',
        'sourceTableTitle': 'Source List',
        'selectedTableTitle': 'Selected List'
    };
    // 配置, 需初始化
    var config = {};

    var multiSelect = function(options) {
        // 初始化参数
        this.initOptions(options);

        this.selectedItemList = [];
        this.selectedItemMap = {};

        this.model = {};
        this.initModel(options);
    };

    multiSelect.prototype = {
        initModel: function(options) {
            // 根据传入的参数初始化控件
            var me = this,
                i;
            //备选项唯一标识关键字,如adPositionId
            me.keyField = options.keyField || 'id';

            //读取传入的文字标题配置项[后面的fields中可能会用到]
            if (options.langMap) {
                for (i in options.langMap) {
                    lang[i] = options.langMap[i];
                }
            }

            //列表的表头字段
            me.model['sourceListFields'] = options.sourceListFields.concat(me.getSourceOptionField(me.id));
            me.model['selectedListFields'] = options.selectedListFields.concat(me.getSelectedOptionField(me.id));
            //已选数据列表数据源
            me.selectedItemList = options.selectedItemList || [];
            me.model['selectedItemList'] = me.selectedItemList;
            me.model['sourceListDatasource'] = options.sourceListDatasource;

        },
        /**
         * 添加,全部添加 列字段
         *
         * @private
         * @param {Object} list 列表.
         */
        getSourceOptionField: function(nodeId) {
            var me = this;
            return {
                        title: function() {
                            return '<span class="multi-select" '
                                    + ' onclick="' + 'bui.Control.get(\''+me.id+'\',\''+this.getAction().id+'\').selectAll()">'
                                    + lang.codeAddAll + '</span>';
                        },
                        width: 80,
                        stable: true,
                        content: function(item) {
                            return '<span class="multi-select" '
                                        + 'id="' + me.id + item[me.keyField] + '" '
                                        + 'onclick="bui.Control.get(\''+me.id+'\',\''+this.getAction().id+'\').addSelected(\'' + item[me.keyField] + '\')">'
                                        + lang.codeAdd + '</span>';
                        }
                    };
        },
        /**
         * 删除,全部删除 列字段
         *
         * @private
         * @param {Object} list 列表.
         */
        getSelectedOptionField: function(nodeId) {
            var me = this;
            return {
                        title: function() {
                            return '<span class="multi-select" '
                                        + 'onclick="bui.Control.get(\''+me.id+'\',\''+this.getAction().id+'\').removeAll()">'
                                        + lang.codeRemoveAll + '</span>';
                        },
                        width: 80,
                        content: function(item) {
                            return ('<span class="multi-select" onclick="'
                                + 'bui.Control.get(\''+me.id+'\',\''+this.getAction().id+'\').removeSelected(\'' + item[me.keyField] + '\')">'
                                + lang.codeRemove + '</span>');
                        }
                    };
        },
        /**
         * 当改变广告位列表选中状态的时候
         *
         * @param {Array} list 列表.
         */
        onselectedlistchange: new Function(),

        /**
         * 渲染控件
         *
         * @param {Object} main 控件挂载的DOM.
         */
        render: function(main) {
            var me = this;
            me.main.innerHTML = bui.Template.merge(bui.Template.getTarget('MultiSelectWrap'),lang);

            //渲染对话框
            bui.Control.init(me.main,me.model,me.getAction());
            me.updateSelectedView();
        },
        /**
         * 删除选中的广告位
         *
         * @private
         * @param {number} id 广告位id.
         * @param {boolean} forbidUpdateView 是否禁止更新视图.
         */
        removeSelected: function(id, forbidUpdateView) {
            var me = this;
            if (me.selectedItemMap[id]) {
                me.selectedItemMap[id] = undefined;
            }

            var list = me.selectedItemList,
                i = 0,
                len = list.length;

            for (; i < len; i++) {
                if (list[i][me.keyField] === id) {
                    list.splice(i, 1);
                    break;
                }
            }
            me.onselectedlistchange(list);
            if (! forbidUpdateView) {
                me.updateSelectedView();
            }
        },
        /**
         * 添加选中的广告位
         *
         * @private
         * @param {number} id 广告位id.
         */
        addSelected: function(id, forbidUpdateView) {
            var me = this,
                map = this.selectedItemMap,
                data = this.controlMap['sourceListTable'].datasource,
                i, item, len = data.length;

            if (map[id]) {
                return;
            }

            for (i = 0; i < len; i++) {
                item = data[i];
                if (item[me.keyField] === id) {
                    break;
                }
                item = null;
            }

            if (item) {
                this.selectedItemList.push(item);
                // 调用接口
                this.onselectedlistchange(this.selectedItemList);
                map[id] = 1;
                if (! forbidUpdateView) {
                    this.updateSelectedView();
                }
            }
        },
        /**
         * 选择当前列表的所有广告位
         *
         * @private
         */
        selectAll: function() {
            var me = this,
                data = this.controlMap['sourceListTable'].datasource,
                i = 0,
                len = data.length;

            for (i = 0; i < len; i++) {
                this.addSelected(data[i][me.keyField], true);
            }

            this.updateSelectedView();
        },
        /**
         * 移除当前选中的所有广告位
         *
         * @private
         */
        removeAll: function() {
            var me = this,
                data = this.selectedItemList,
                len = data.length;

            while (len--) {
                this.removeSelected(data[len][me.keyField], true);
            }

            this.updateSelectedView();
        },

        /**
         * 更新选中广告位的显示
         *
         * @private
         */
        updateSelectedView: function() {
            var me = this,
                controlMap = me.controlMap,
                sourceListTable = controlMap['sourceListTable'],
                selectedList = controlMap['selectedListTable'],
                data = sourceListTable.datasource || [],
                map = {},
                list = me.selectedItemList,
                listLen = list.length,
                selectClass = 'multi-selected',
                item,
                rowDom,
                selectDom,
                i, len;

            for (i = 0, len = list.length; i < len; i++) {
                map[list[i][me.keyField]] = 1;
            }
            me.selectedItemMap = map;

            //显示已选择的条数.注释掉的原因:改为外部实现
            //controlMap['labelSelectedCount'].main.innerHTML = listLen;

            sourceListTable.render();

            len = data.length;
            while (len--) {
                item = data[len];
                rowDom = sourceListTable.getRow(len);
                selectDom = bui.g(me.getId(item[me.keyField]));
                if (map[item[me.keyField]]) {
                    bui.Control.addClass(rowDom, selectClass);
                    selectDom.innerHTML = lang.codeAdded;
                } else {
                    bui.Control.removeClass(rowDom, selectClass);
                    selectDom.innerHTML = lang.codeAdd;
                }
            }

            selectedList.datasource = list;
            selectedList.render();

        },

        /**
         * 获取选取的列表
         *
         * @public
         */
        getValue: function() {
            return this.selectedItemList;
        },
        /**
         * 数据校验接口
         */
        validate: new Function(),
        updateSourceListTable: function(data) {
                var me = this,
                    sourceListInfo = me.controlMap[me.id + 'sourceListInfo'];
                me.controlMap[me.id + 'sourceListTable'].datasource = page.result;
                me.updateSelectedView();
        },
        getExtraParam: function() {
            return 'status=1';
        }
    };

    return multiSelect;
})();

/*通过bui.Control派生bui.Button*/
//bui.Control.derive(bui.MultiSelect);
/* bui.Label 继承了 bui.Control */
bui.inherits(bui.Label, bui.Control);
