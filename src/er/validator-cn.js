'use strict';
/*
 * BUI(Baidu UI Library)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    validator.js
 * desc:    验证器
 * author:  Baidu FE
 * date:    2012/01/01 [用python脚本自动维护]
 */

/**
 * 验证器
 */
bui.Validator = (function() {

    function parse(text, type) {
        if (type === 'int') {
            return parseInt(text, 10);
        } else if (type === 'float') {
            return parseFloat(text);
        } else if (type === 'date') {
            return bui.Validator.parseDate(text);
        } else {
            return text;
        }
    }

    var errorClass = 'validate-error',
        validClass = 'validate',
        iconClass = 'validate-icon',
        textClass = 'validate-text',
        suffix = 'validate',
        iconSuffix = 'validateIcon',
        textSuffix = 'validateText',

        errorMsg = {
            'SUCCESS': '',
            'ERROR_EMPTY': '不能为空',
            'ERROR_REGEX': '格式错误',
            'ERROR_INT': '格式不正确，请填写整数',
            'ERROR_NUMBER': '格式不正确，请填写数字',
            'ERROR_MIN': '不能小于#{0}',
            'ERROR_MIN_DATE': '不能早于#{0}',
            'ERROR_MAX': '不能大于#{0}',
            'ERROR_MAX_DATE': '不能晚于#{0}',
            'ERROR_GT': '必须大于#{0}',
            'ERROR_GT_DATE': '必须晚于#{0}',
            'ERROR_LT': '必须小于#{0}',
            'ERROR_LT_DATE': '必须早于#{0}',
            'ERROR_RANGE': '必须在#{0}到#{1}的范围内',
            'ERROR_LENGTH': '长度必须等于#{0}',
            'ERROR_MIN_LENGTH': '长度不能小于#{0}',
            'ERROR_MAX_LENGTH': '长度不能大于#{0}',
            'ERROR_LENGTH_RANGE': '长度必须在#{0}到#{1}的范围内',
            'ERROR_CALENDAR': '格式不正确，请按2010-01-01的格式输入',
            'ERROR_EXT': '后缀名不合法，只允许后缀名为#{0}',
            'ERROR_BACKEND': '#{0}'
        },

        /**
         * 验证规则集合
         *
         * @private
         */
        ruleMap = {
            'required': {
                preserveArgument: true,

                validate: function(text) {
                    if (!text || (Object.prototype.toString.call(text) == '[object String]' && String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '')) {
                        return 'ERROR_EMPTY';
                    }
                    return 'SUCCESS';
                }
            },

            'ext' : {
                preserveArgument: true,

                /**
                 * @param {string} text 需要检查的文本内容.
                 * @param {...*} var_args 合法的后缀名.
                 */
                validate: function(text, var_args) {
                  if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                    return 'ERROR_EMPTY';
                  }

                  var allowedExt = Array.prototype.slice.call(arguments, 1);
                  var dotIndex = text.lastIndexOf('.');
                  if (dotIndex == -1) {
                    return ['ERROR_EXT', allowedExt.join(',')];
                  }

                  var ext = text.substring(dotIndex + 1).toLowerCase();
                  for (var i = 0, j = allowedExt.length; i < j; i++) {
                    if (allowedExt[i].toLowerCase() == ext) {
                      return 'SUCCESS';
                    }
                  }

                  return ['ERROR_EXT', allowedExt.join(',')];
                }
            },

            'regex': {
                preserveArgument: true,

                validate: function(text, pattern, modifiers) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (!new RegExp(pattern, modifiers).test(text)) {
                        return 'ERROR_REGEX';
                    }
                    return 'SUCCESS';
                }
            },

            'int': {
                preserveArgument: true,

                validate: function(text) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (isNaN(text - 0) || text.indexOf('.') >= 0) {
                        return 'ERROR_INT';
                    }
                    return 'SUCCESS';
                }
            },

            'number': {
                preserveArgument: true,

                validate: function(text) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (isNaN(text - 0)) {
                        return 'ERROR_NUMBER';
                    }
                    return 'SUCCESS';
                }
            },

            'min': {
                preserveArgument: true,

                validate: function(text, minValue, type) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (parse(text, type) < parse(minValue, type)) {
                        return [type === 'date' ? 'ERROR_MIN_DATE' : 'ERROR_MIN', minValue];
                    }
                    return 'SUCCESS';
                }
            },

            'gt': {
                preserveArgument: true,

                validate: function(text, minValue, type) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (parse(text, type) <= parse(minValue, type)) {
                        return [type === 'date' ? 'ERROR_GT_DATE' : 'ERROR_GT', minValue];
                    }
                    return 'SUCCESS';
                }
            },

            'max': {
                preserveArgument: true,

                validate: function(text, maxValue, type) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (parse(text, type) > parse(maxValue, type)) {
                        return [type === 'date' ? 'ERROR_MAX_DATE' : 'ERROR_MAX', maxValue];
                    }
                    return 'SUCCESS';
                }
            },

            'lt': {
                preserveArgument: true,

                validate: function(text, maxValue, type) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (parse(text, type) >= parse(maxValue, type)) {
                        return [type === 'date' ? 'ERROR_LT_DATE' : 'ERROR_LT', maxValue];
                    }
                    return 'SUCCESS';
                }
            },

            'range': {
                preserveArgument: true,

                validate: function(text, minValue, maxValue, type) {
                    if (String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === '') {
                        return 'SUCCESS';
                    }
                    if (parse(text, type) - parse(maxValue, type) > 0 ||
                        parse(text, type) - parse(minValue, type) < 0) {
                        return ['ERROR_RANGE', minValue, maxValue];
                    }
                    return 'SUCCESS';
                }
            },

            'length': {
                preserveArgument: true,

                validate: function(text, length) {
                    if (text.length !== length) {
                        return ['ERROR_LENGTH', length];
                    }
                    return 'SUCCESS';
                }
            },

            'minLength': {
                preserveArgument: true,

                validate: function(text, minLength) {
                    if (text.length < minLength) {
                        return ['ERROR_MIN_LENGTH', minLength];
                    }
                    return 'SUCCESS';
                }
            },

            'maxLength': {
                preserveArgument: true,

                validate: function(text, maxLength) {
                    if (text.length > maxLength) {
                        return ['ERROR_MAX_LENGTH', maxLength];
                    }
                    return 'SUCCESS';
                }
            },

            'lengthRange': {
                preserveArgument: true,

                validate: function(text, minLength, maxLength) {
                    if (text.length < minLength || text.length > maxLength) {
                        return ['ERROR_LENGTH_RANGE', minLength, maxLength];
                    }
                    return 'SUCCESS';
                }
            },

            /****************************以上是通用验证规则************************/
            'username': {
                'validate': function(text) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (len < 3) {
                        return 2;
                    } else if (!(/[a-zA-Z\d_\.\-]/.test(text))) {
                        return 3;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '长度不能少于3位',
                    3: '只能包含小写字母、大写字母、阿拉伯数字、中划线和下划线'
                }
            },
            
            'name': {
                'validate': function(text) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (len > 100) {
                        return 2;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '的长度不能超过100'
                }
            },

            'email': {
                'validate': function(text) {
                    var len = text.length;
                    if (len == 0) {
                        return 1;
                    } else if (len > 64) {
                        return 2;
                    } else if (!/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/.test(text)) {
                        return 3;
                    }
                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '长度不能超过64',
                    3: '格式错误'
                }
            },
            'emailVerify': {
                'validate': function(text, text2) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (len > 64) {
                        return 2;
                    } else if (!/^.+@.+$/.test(text)) {
                        return 3;
                    } else if (text != text2) {
                        return 4;
                    }

                    return 0;
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '确认邮件不能为空',
                    2: '确认邮件长度不能超过64',
                    3: '确认邮件格式错误',
                    4: '您两次输入的邮件不一致，请重新输入'
                }
            },
            'phone': {
                'validate': function(text) {
                    var f = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(text);
                    if (text != '' && !f) {
                        return 1;
                    }
                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '格式错误，请按区号-电话号码格式填写'
                }
            },
            'fax': {
                'validate': function(text) {
                    var f = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(text);
                    if (text != '' && !f) {
                        return 1;
                    }
                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '格式错误，请按区号-电话号码格式填写'
                }
            },
            'position': {
                'validate': function(text) {
                    var len = text.length;
                    if (len > 64) {
                        return 1;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '的长度不能超过64'
                }
            },
            'mobile': {
                'validate': function(text) {
                    var f = /^[\d\-\(\)\[\] ]+$/.test(text);
                    if (text != '' && !f) {
                        return 1;
                    }

                    return 0;
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '手机号码格式错误'
                }
            },
            'adress': {
                'validate': function(text) {
                    var len = text.length;
                    if (text != '' && len > 1024) {
                        return 1;
                    }

                    return 0;
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '地址长度不得超过1024'
                }
            },

            'widthAndHeight': {
                'validate': function(text, text2, required) {
                    if (text === '' && text2 === '' && required === false) {
                        return 0;
                    }
                    var num = parseInt(text, 10);
                    if (num > 0 && num <= 10000) {
                        num = parseInt(text2, 10);
                        if (num > 0 && num <= 10000) {
                            return 0;
                        }
                    }

                    return 1;
                },

                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': '请填写1～10000的整数'
            },

            'slotWidthAndHeight': {
                'validate': function(text, text2) {
                    if (/^[0-9]{1,5}$/.test(text) && /^[0-9]{1,5}$/.test(text2)) {
                        var num = parseInt(text, 10);
                        if (num >= 0 && num <= 10000) {
                            num = parseInt(text2, 10);
                            if (num >= 0 && num <= 10000) {
                                return 0;
                            }
                        }
                    }

                    return 1;
                },

                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': '请填写0～10000的整数'
            },
            'description': {
                'validate': function(text) {
                    return (text.length <= 4000) ? 0 : 1;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': '的长度不能超过4000'
            },

            'notEmpty': {
                'validate': function(text) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空'
                }
            },

            'password': {
                'validate': function(text) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (len < 6) {
                        return 2;
                    } else if (!(/[a-z]/.test(text) && /[A-Z]/.test(text) && /\d/.test(text))) {
                        return 3;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '不能少于6位',
                    3: '必须包含小写字母、大写字母和阿拉伯数字三种字符'
                }
            },

            'passwordVerify': {
                'validate': function(text, text1) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (text != text1) {
                        return 2;
                    }

                    return 0;
                },

                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '密码不能为空',
                    2: '您两次输入的密码不一致，请重新输入'
                }
            },

            'rmtupload' : {
               'validate': function(text, control, required) {

                    var localPath = control.controlMap.localPath.getValue();
                    var len = localPath.length;
                    var s1 = localPath.substring(localPath.length - 4, localPath.length).toLowerCase();
                    var s2 = localPath.substring(localPath.length - 5, localPath.length - 4);


                    if (len === 0) {
                        if (required) {
                            return 1;
                        }
                    } else {
                        if (control.mediatype == 'media' &&
                           (s1 != '.jpg' && s1 != '.gif' && s1 != '.png' && s1 != '.swf' || s2 == '/')) {
                            return 3;
                        }
                        if (control.mediatype == 'image' &&
                            (s1 != '.jpg' && s1 != '.gif' && s1 != '.png' || s2 == '/')) {
                            return 4;
                        }
                        if (control.mediatype == 'flash' &&
                            (s1 != '.swf' || s2 == '/')) {
                            return 5;
                        }
                    }

                    return 0;
                },

                'notice': noticeInTailNoTitleUploader,
                'cancelNotice': cancelNoticeInTileUploader,
                'noticeText': {
                    1: '请上传',
                    2: '请填写1～10000的整数',
                    3: '只能上传gif、jpg、png格式的图片或swf格式的Flash',
                    4: '只能上传gif、jpg、png格式的图片',
                    5: '只能上传swf格式的Flash'
                }
            },
            'rmtlink' : {
                'validate': function(text, required, staticsv) {
                    var text = String(text).replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'');
                    var len = text.length;

                    if (len === 0) {
                        if (required) {
                            return 1;
                        } else {
                            if (staticsv) {
                                return 4;
                            }
                        }
                    } else if (len > 1000) {
                        return 2;
                    } else if (!cb.util.regexp.urlLoose.test(text)) {
                        return 3;
                    }
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '地址不能为空',
                    2: '地址不能超过1000个字符',
                    3: '地址格式错误',
                    4: '为空时不能统计点击量'
                }
            },
            'rmttext': {
                'validate': function(text, required) {
                    var len = text.length;
                    if (len === 0) {
                        if (required) {
                            return 1;
                        }

                    } else if (len > 100) {
                        return 2;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '不能超过100个字符'
                }
            },
            'rmtnumber': {
                'validate': function(text, required) {
                    var len = text.length;
                    if (len === 0) {
                        if (required) {
                            return 1;
                        }
                    } else if (!/^\-?(([1-9][0-9]*)|0)(\.[0-9]{1,2})?$/.test(text)) {
                        return 2;
                    }

                    return 0;
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '请填写数字, 最多两位小数'
                }
            },
            'rmturl' : {
                'validate': function(text, required) {
                    var len = text.length;
                    var s1 = text.substring(text.length - 4, text.length).toLowerCase();
                    var s2 = text.substring(text.length - 5, text.length - 4);
                    if (len === 0) {
                        if (required) {
                            return 1;
                        }
                    } else if (len > 1000) {
                        return 2;
                    } else if (!cb.util.regexp.urlLoose.test(text) || (s1 != '.jpg' && s1 != '.gif' && s1 != '.png' && s1 != '.swf') || s2 == '/') {
                        return 3;
                    }

                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: 'URL地址不能为空',
                    2: 'URL地址不能超过1000个字符',
                    3: '请输入后缀为"jpg","gif","png"或"swf"的URL地址'
                }
            },
            'link' : {
                'validate': function(text) {
                    var len = text.length;
                    if (len === 0) {
                        return 1;
                    } else if (len > 1000) {
                        return 2;
                    } else if (!cb.util.regexp.urlLoose.test(text)) {
                        return 3;
                    }
                },
                'notice': noticeInTail,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '不能为空',
                    2: '不能超过1000个字符',
                    3: '格式错误'
                }
            },
            'xmlValue' : {
                'validate': function(text) {
                    if (!cb.util.regexp.xmlValue.test(text)) {
                        return 1;
                    }
                },
                'noticeText': {
                    1: '不能含有：&lt; &gt; &amp; &#39; &quot;'
                }
            },
            'imgUrl' : {
                'validate': function(text) {
                    var len = text.length;
                    var s1 = text.substring(text.length - 4, text.length).toLowerCase();
                    var s2 = text.substring(text.length - 5, text.length - 4);
                    if (len === 0) {
                        return 1;
                    } else if (len > 1000) {
                        return 2;
                    } else if (!cb.util.regexp.urlLoose.test(text)) {
                        return 3;
                    } else if (s1 != '.jpg' && s1 != '.gif' && s1 != '.png' || s2 == '/') {
                        return 4;
                    }

                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '图片地址不能为空',
                    2: '图片地址不能超过1000个字符',
                    3: '图片地址格式错误',
                    4: '请输入后缀为"jpg","gif"或"png"的图片地址'
                }
            },
            'imgTitle' : {
                'validate': function(text) {
                    var len = text.length;
                    if (len > 30) {
                        return 1;
                    }
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '图片描述的长度不能超过30'
                }
            },
            'birthday' : {
                'validate': function(text) {
                    text = String(text).replace(/\s/g,'');
                    if (!(/^\d\d\d\d[-\.]\d\d[-\.]\d\d$/.test(text))) {
                        return 1;
                    }
                },
                'notice': noticeInTailNoTitle,
                'cancelNotice': cancelNoticeInTile,
                'noticeText': {
                    1: '日期格式错误,正确格式为2012-03-30'
                }
            },
            

            'backendError': {
                validate: function(text, control) {
                    return ['ERROR_BACKEND', control.errorMessage];
                },
                notice: noticeInTailNoTitle
            }
        };

    /**
     * 在父元素的末尾提示信息
     *
     * @private
     * @param {string} noticeText 错误信息.
     * @param {HTMLElement} input 控件元素.
     */
    function noticeInTail(noticeText, input, control) {
        showNoticeDom(input);
        var title = input.getAttribute('title') || '';
        getTextEl(input).innerHTML = title + noticeText;
    }

    /**
     * 在父元素的末尾提示信息
     *
     * @private
     * @param {string} noticeText 错误信息.
     * @param {HTMLElement} input 控件元素.
     */
    function noticeInTailNoTitle(noticeText, input, control) {
        showNoticeDom(input);
        getTextEl(input).innerHTML = noticeText;
    }

    /**
     * 在父元素的末尾提示信息
     *
     * @private
     * @param {number} errorCode 错误码.
     * @param {HTMLElement} input 控件元素.
     * @param {Object} control 触发提示的控件.
     */
    function noticeInTailNoTitleUploader(errorCode, input, control) {
        var noticeText = this.noticeText;
        if ('object' == typeof noticeText) {
            noticeText = noticeText[errorCode];
        }
        if (errorCode == 1 || errorCode >= 3) {
            if (control.controlMap.preWidth) {
                cancelNoticeInTile(control.controlMap.preWidth.main);
            } else {
                cancelNoticeInTile(input);
            }
            showNoticeDom(input);

            getTextEl(input).innerHTML = noticeText;

        } else if (errorCode == 2) {
            cancelNoticeInTile(input);
            showNoticeDom(control.controlMap.preWidth.main);
            getTextEl(control.controlMap.preWidth.main).innerHTML = noticeText;
        }
    }


    /**
     * 显示notice的dom元素
     *
     * @private
     * @param {HTMLElement} input 对应的input元素.
     */
    function showNoticeDom(input, notById) {
        var el = getEl(input, notById),
            father = input.parentNode;
        //向上两层,管理员角色验证需要
        if (input.id == 'ctrlcheckboxmanager' || input.id == 'ctrlcheckboxagent') {
            father = father.parentNode;
        }
        if (!el) {
            el = createNoticeElement(input);
            father.appendChild(el);
        }

        el.style.display = '';

        bui.Validator.addClass(father, errorClass);
    }

    /**
     * 创建notice元素
     *
     * @private
     * @param {HTMLElement} input 对应的input元素.
     * @return {HTMLElement}
     */
    function createNoticeElement(input) {
        var inputId = input.id,
            el = getEl(input),
            icon, text;

        if (!el) {
            el = document.createElement('div');
            el.id = inputId + suffix;
            el.className = validClass;

            icon = document.createElement('div');
            icon.id = inputId + iconSuffix;
            icon.className = iconClass;
            el.appendChild(icon);

            text = document.createElement('div');
            text.id = inputId + textSuffix;
            text.className = textClass;
            el.appendChild(text);
        }

        return el;
    }

    /**
     * 在父元素的末尾取消提示信息
     *
     * @private
     * @param {HTMLElement} input 控件元素.
     */
    function cancelNoticeInTile(input) {
        var el = getEl(input),
            father = input.parentNode;

        //向上两层,管理员角色验证需要
        if (input.id == 'ctrlcheckboxmanager' || input.id == 'ctrlcheckboxagent') {
            father = father.parentNode;
        }
        if (el) {
            el.style.display = 'none';
        }
        bui.Validator.removeClass(father, errorClass);
        
        if (father.lastChild.className && father.lastChild.className.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === 'validate') {
        father.removeChild(father.lastChild);
    }
    }
    /**
     * 在父元素的末尾取消提示信息
     *
     * @private
     * @param {HTMLElement} input 控件元素.
     */
    function cancelNoticeInTileUploader(input, control) {
        var el = getEl(input),
            father = input.parentNode;
            if (control.controlMap.preWidth) {
                var el2 = getEl(control.controlMap.preWidth.main);
                var father2 = control.controlMap.preWidth.main.parentNode;
            }

        if (el) {
            el.style.display = 'none';
        }
        if (el2) {
            el2.style.display = 'none';
        }
        bui.Validator.removeClass(father, errorClass);
        if (father2) {
            bui.Validator.removeClass(father2, errorClass);
        }
    }



    /**
     * 获取info区域的元素
     *
     * @private
     * @param {HTMLElement} input 对应的input元素.
     * @return {HTMLElement}
     */
    function getTextEl(input) {
        return bui.g(input.id + textSuffix);
    }

    /**
     * 获取提示元素
     *
     * @private
     * @param {HTMLElement} input 对应的input元素.
     * @return {HTMLElement}
     */
    function getEl(input) {
        return bui.g(input.id + suffix);
    }

    /**
     * 验证规则
     *
     * @private
     * @param {ui.Control} control 需要验证的控件.
     * @param {string} ruleName 验证规则的名称.
     */
    function applyRule(control, ruleName) {
        // 判断控件是否具有获取value的方法
        if (!control.getValue || !ruleName) {
            return true;
        }

        var ruleSeg = ruleName.split(','),
            text = control.getValue(true),
            rule = ruleMap[ruleSeg[0]],
            segLen = ruleSeg.length, i,
            args = [text], ctrl,
            error, errorText = '';

        // FIXME 采用control.isCheckBox()
        if (control.type == 'checkbox') {
            text = control.getChecked();
            args = [text];
        }

        if (segLen > 0) {
            for (i = 1; i < segLen; i++) {
                if (ruleSeg[i] == 'this') {
                    //pass control to validate function
                    args.push(control);
                } else {
                    ctrl = bui.Control.get(ruleSeg[i], control.getAction());
                    if (ctrl && ctrl.getValue && !ctrl.getState('disabled')) {
                        if (ctrl.type == 'checkbox' || ctrl.type == 'radiobox') {
                            args.push(ctrl.getChecked());
                        } else {
                            args.push(ctrl.getValue());
                        }
                    } else {
                        args.push(rule.preserveArgument ? ruleSeg[i] : null);
                    }
                }
            }
        }

        error = rule.validate.apply(rule, args);

        if (parseInt('0'+String(error).replace(/\s/g,''),10) !== 0) { //TODO:这种形式是要被历史遗弃的
            if ('object' == typeof rule.noticeText) {
                errorText = rule.noticeText[error];
            } else {
                errorText = rule.noticeText;
            }
        } else if (Object.prototype.toString.call(error) == '[object String]' && error !== '') {
            errorText = errorMsg[error];
        } else if (Object.prototype.toString.call(error)==='[object Array]') {
            error[0] = errorMsg[error[0]];
            errorText = bui.Validator.format(error[0], error.splice(1,error.length));
        }

        if (errorText) {
            rule.notice = rule.notice || noticeInTail;
            if (rule.notice === noticeInTailNoTitleUploader) {
                rule.notice(error, control.main, control);
            } else {
                rule.notice(errorText, control.main, control);
            }
        } else {
            rule.cancelNotice = rule.cancelNotice || cancelNoticeInTile;
            rule.cancelNotice(control.main, control);
        }
        return !errorText;
    }

/**
 * 对目标字符串进行格式化
 * 
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象或多个字符串
 *             
 * @returns {string} 格式化后的字符串
 */
function format(source, opts) {
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
};

    return {
        'applyRule':applyRule,
        'format':format
    }
    /**
     * 验证器
     *
     * @param {ui.Control} control 需要验证的控件.
     * @param {string|Array.<string>} ruleNames 验证规则的名称或名称数组.
     *
    return function(control, ruleNames) {
        if (Object.prototype.toString.call(ruleNames) === '[object Array]') {
            for (var i = 0; i < ruleNames.length; i++) {
                if (!applyRule(control, ruleNames[i])) {
                    return false;
                }
            }
            return true;
        }
        return applyRule(control, /** @type {string} *(ruleNames));
    };*/
})();

/**
 * 在父元素的末尾提示错误信息
 *
 * @param {DomElement} ele dom元素.
 * @param {String} errorMsg 提示信息.
 */
function showError(ele, errorMsg) {
    var parent = ele.parentNode;
    bui.Validator.addClass(parent, 'validate-error');
    if (parent.lastChild.className && parent.lastChild.className.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === 'validate') {
        parent.removeChild(parent.lastChild);
    }
    if (!parent.lastChild.className || parent.lastChild.className.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') !== 'validate') {
        var errorNode = document.createElement('div');
        bui.Validator.addClass(errorNode, 'validate');
        errorNode.innerHTML = bui.Validator.format('<div class="validate-icon"></div><div class="validate-text">#{0}</div>', errorMsg);
        parent.appendChild(errorNode);
    }
}
/**
 * 隐藏错误提示
 *
 * @param {DomElement} ele dom元素.
 */
function hideError(ele) {
    var parent = ele.parentNode;
    if (parent.lastChild.className && parent.lastChild.className.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,'') === 'validate') {
        parent.removeChild(parent.lastChild);
    }
    bui.Validator.removeClass(ele.parentNode, 'validate-error');
}


/**
 * 为目标元素添加className
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
 * @remark
 * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
 *     
 *                 
 * @returns {HTMLElement} 目标元素
 */
bui.Validator.addClass = function (element, className) {
    bui.Control.removeClass(element, className);
    element.className = (element.className +' '+ className).replace(/(\s)+/ig," ");
    return element;
};
bui.Validator.removeClass = function(element, className) {
    var list = className.split(/\s+/),
        str = element.className;
    var i,len,k,v;
    for (i=0,len=list.length; i < len; i++){
         str = (" "+str.replace(/(\s)/ig,"  ")+" ").replace(new RegExp(" "+list[i]+" ","g")," ");
    }
    str = str.replace(/(\s)+/ig," ");
    element.className = str;
    return element;
};
bui.Validator.parseDate = function (source) {
    var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
    if ('string' == typeof source) {
        if (reg.test(source) || isNaN(Date.parse(source))) {
            var d = source.split(/ |T/),
                d1 = d.length > 1 
                        ? d[1].split(/[^\d]/) 
                        : [0, 0, 0],
                d0 = d[0].split(/[^\d]/);
            return new Date(d0[0] - 0, 
                            d0[1] - 1, 
                            d0[2] - 0, 
                            d1[0] - 0, 
                            d1[1] - 0, 
                            d1[2] - 0);
        } else {
            return new Date(source);
        }
    }
    
    return new Date();
};
/**
 * 对目标字符串进行格式化
 * 
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象或多个字符串
 *             
 * @returns {string} 格式化后的字符串
 */
bui.Control.format = function (source, opts) {
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
};