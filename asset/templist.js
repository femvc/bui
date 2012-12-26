'use strict';

bui.config = {
    TEMPLATE_LIST: [
        'vm/panel_login.htm',
        'vm/panel_userinfo.htm',
        'vm/panel_userpoints.htm',
        'vm/panel_usercontact.htm',
        'vm/panel_useraccount.htm',
        'vm/panel_accountgetpsw.htm',
        'vm/panel_accountgetpswresult.htm',
        'vm/panel_accountactivate.htm',
        'vm/panel_signup.htm',
        'vm/panel_supplyusername.htm',
        'vm/panel_supplyrandnum.htm',
        'vm/panel_supplyanswer.htm',
        'vm/panel_changepsw.htm'/*
        
        //注:main.html里也需要改一下!!!!!*/
    ],
    /**
     * 用于同步所有异步请求
     */
    loadedCount: 0
};
