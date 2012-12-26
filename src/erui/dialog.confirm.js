'use strict';
/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: Dialog.confirm.js 4338 2011-03-24 02:51:57Z liyubei $
 *
 **************************************************************************/



/**
 * confirm dialog
 */
ui.Dialog.confirm = (function() {
    var isInit = false,
        isButtonInit = false,
        dialog,
        okBtn,
        cancelBtn;


    /**
     * 获取按钮点击的处理函数
     *
     * @private
     * @param {Function} eventHandler 用户定义的按钮点击函数.
     * @return {Functioin}
     */
    function getBtnClickHandler(eventHandler) {
        return function() {
            var isFunc = (typeof eventHandler == 'function');
            if ((isFunc && eventHandler() !== false) || !isFunc) {
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
     * @config {Function} oncancel 点击取消按钮的行为，默认为关闭提示框
     */
    function show(args) {
        if (!args) {
            return;
        }

        var title = args.title || '',
            content = args.content || '',
            oncancel = args.oncancel,
            type = args.type || 'warning',
            tpl = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';
            onok = args.onok;


        if (isInit) {
            dialog.show();
            dialog.setTitle(title);
            dialog.getBody().innerHTML = baidu.format(tpl, type, content);

            if (!isButtonInit) {
                var foot = dialog.getFoot();
                okBtn.appendTo(foot);
                cancelBtn.appendTo(foot);
                isButtonInit = true;
            }

            okBtn.onclick = getBtnClickHandler(onok);
            cancelBtn.onclick = getBtnClickHandler(oncancel);

            baidu.g('ctrlbutton__DialogConfirmOklabel').innerHTML = args.okText || ui.Dialog.lang.ok;
            baidu.g('ctrlbutton__DialogConfirmCancellabel').innerHTML = args.cancelText || ui.Dialog.lang.cancel;
            baidu.g('ctrlbutton__DialogConfirmOklabel').style.width = args.okWidth || '40px';
            baidu.g('ctrlbutton__DialogConfirmCancellabel').style.width = args.cancelWidth || '40px';
            if (args.isShowCloseBtn === false) {
                baidu.g('ctrldialog__DialogConfirmclose').style.display = 'none';
            }
        }
        return dialog;
    }

    show.init = function() {

        dialog = ui.util.create('Dialog',
                                  {
                                      id: '__DialogConfirm',
                                      closeButton: true,
                                      title: '',
                                      width: 350
                                  });

        okBtn = ui.util.create('Button',
                                  {
                                      id: '__DialogConfirmOk',
                                      content: ui.Dialog.lang.ok
                                  });

        cancelBtn = ui.util.create('Button',
                                  {
                                      id: '__DialogConfirmCancel',
                                      content: ui.Dialog.lang.cancel
                                  });
        isInit = true;
    };

    return show;
})();

baidu.on(window, 'load', ui.Dialog.confirm.init);