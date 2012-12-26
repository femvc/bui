'use strict';
/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: Dialog.alert.js 4338 2011-03-24 02:51:57Z liyubei $
 *
 **************************************************************************/



/**
 * alert dialog
 */
ui.Dialog.alert = (function() {
    var isInit = false,
        isButtonInit = false,
        dialog,
        button;

    /**
     * 获取按钮点击的处理函数
     *
     * @private
     * @param {Function} onok 用户定义的确定按钮点击函数.
     * @return {Function}
     */
    function getBtnClickHandler(onok) {
        return function() {
            var isFunc = (typeof onok == 'function');
            if ((isFunc && onok() !== false) || !isFunc) {
                dialog.hide();
            }
        };
    }

    /**
     * 显示alert
     *
     * @public
     * @param {Object} args alert对话框的参数.
     * @config {string} title 显示标题
     * @config {string} content 显示的文字内容
     * @config {Function} onok 点击确定按钮的行为，默认为关闭提示框
     */
    function show(args) {
        if (!args) {
            return;
        }

        var title = args.title || '',
            content = args.content || '',
            onok = args.onok,
            type = args.type || 'warning',
            tpl = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';

        if (isInit) {
            dialog.show();
            dialog.setTitle(title);
            dialog.getBody().innerHTML = baidu.format(tpl, type, content);

            if (!isButtonInit) {
                button.appendTo(dialog.getFoot());
                isButtonInit = true;
            }

            button.onclick = getBtnClickHandler(onok);
        }
    }

    show.init = function() {
        dialog = ui.util.create('Dialog',
                                  {
                                      id: '__DialogAlert',
                                      closeButton: false,
                                      title: '',
                                      width: 350
                                  });

        button = ui.util.create('Button',
                                  {
                                      id: '__DialogAlertOk',
                                      content: ui.Dialog.lang.ok
                                  });

        isInit = true;
    };

    return show;
})();

baidu.on(window, 'load', ui.Dialog.alert.init);


/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
