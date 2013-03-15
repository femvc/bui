'use strict';

var login = {
    action: [
        {'location':'/login','action': 'login.Signin'}
    ]
};

login.Signin = function(){
    bui.Action.call(this);
    /**
     * Action索引ID
     * 
     * @comment 主要用于控件中通过onclick="bui.Control.get('listTable','login');
     */
    this.id = 'login';
    /**
     * 初始化数据模型
     */
    this.view = 'login';
    /**
     * 初始化数据模型
     */
    this.model = new bui.BaseModel();
    this.BACK_LOCATION = '/login';
    /**
     * 用于同步[顺序执行]那些需要在页面载入前发出的有依赖关系的异步请求,
     * 执行过程中会阻塞页面初始化,因此不能太多!!
     * 如需有很多异步请求,建议使用类似模板加载时的状态计数的方式同步发出
     */
    this.CONTEXT_INITER_LIST = [
        'userLogout'
    ];
    
};

login.Signin.prototype = {
    userLogout: function(args, callback){
        var me = this;
        
        if (String(args['type']).toLowerCase() == 'exit'){
            bui.context.set('userInfo', null);
            Requester.get('/login/out.action','',new Function(),this);
        }
        callback();
    },
    initModel: function(callback){
        var me = this;
        me.model.set('userName','9999');
        callback&&callback();
    },
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap) {
        var me = this;
        
        //me.controlMap['username'].main.value = me.model['u'] || '';// ? username.value : 'Account ID/User Name';
        //me.controlMap['password'].main.value = me.model['p'] || '';// ? username.value : 'Account ID/User Name';
        
        
        //username.onfocus = me.onfocus;
        //username.onblur = me.onblur;
        //username.onblur();
        
        _.find('#login').onclick = _.fn(me.userLogin,me);
        _.find('#rand_num').onkeyup = _.fn(me.submit,me);
        _.find('#password').onkeyup = _.fn(me.submit,me);
    },
    submit: function(e){
        var e = e || window.event;
        if(e.keyCode == 13){
            this.userLogin();
        }
    },
    userLogin: function(){
        var me = this,
            params = {},
            str,
            args,
            paramstr,
            md5,
            i;
        if (me.validate()) {
            args = me.getParamMap()
            //str.push('&username=');
            //str.push(args['username']);
            //str.push('&password=');
            //str.push(args['password']);
            //str.push('&rand_num=');
            //str.push(args['rand_num']);
            
            //paramstr = _.encode(str.join(''));
            //paramstr = Base64.encode(paramstr);
            //md5 = String(MD5.encode(paramstr)).toUpperCase();
            //paramstr = paramstr.split('');
            //paramstr.reverse();
            
            //Requester.post('/login/sign.action','result=' + md5 + _.encode(paramstr.join('')),_.fn(me.userLoginCallback,me), me);
            params = args;
            str = '';
            for (i in params) {
                if (!!i) {
                    str += '&' + i + '=' + _.encode(params[i]);
                }
            }
            Requester.post('/login/sign.action',str,_.fn(me.userLoginCallback,me), me);
            
        }
    },
    userLoginCallback: function(data){
        _.hideWaiting(_.find('#login'));
        if (data.success == 'true') {
            bui.context.set('username',_.find('#username').value);
            //Requester.post('/users/info.action','params=params', cb.loadUserInfo); 
            bui.redirect('/');
        }
        else {
            //bui.Mask.hideLoading();
        }
    },
    onfocus: function(){
        var username = this;
        if (username.value == 'Account ID/User Name') {
            username.value = '';
            username.style.color = '#000000';
        }
    },
    onblur: function(){
        var username = this;
        if (username.value == '' || username.value == 'Account ID/User Name') {
            username.style.color = '#dddddd';
            username.value = 'Account ID/User Name';
        }
    }
};

bui.Action.addModule(login);
//派生自 bui.Action
//bui.Action.derive(login.Signin);
//bui.derive(login, bui.Action);
bui.inherits(login.Signin, bui.Action);
