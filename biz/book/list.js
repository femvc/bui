'use strict';
var book = {
    action: [
        {'location':'/booklist','action':'book.List'},
        {'location':'/bookinfo','action':'book.Info'},
        {'location':'/bookcart','action':'book.Cart'},
        {'location':'/','action':'helloworld'},
        {'location':'/2','action':'helloworld2'}
    ]
};

bui.Action.addModule(book);

book.List = function(){
    bui.Action.call(this);
    /**
     * Action索引ID
     * 
     * @comment 主要用于控件中通过onclick="bui.Control.get('listTable','login');
     */
    this.id = 'booklist';
    this.view = 'booklist';
    /**
     * 初始化数据模型
     */
    this.model = new bui.BaseModel({});
    
};
    
book.List.prototype = {
    getBookList: function(callback){
        var me = this;
        
        me.getBookListCallback.callback = callback;
        Requester.get('/book/list.action','',_.fn(me.getBookListCallback,this),this);
    },
    getBookListCallback: function(data){
        var me = this,
            i,len,
            result = data.result,
            list = result['booklist'],
            allbook = {};
        if (data.success == 'true'){
            bui.context.set('allbook', result['booklist']);
        }
        me.model.set('bookListDatasource', _.array.buildIndex(_.array.sortBy(result['booklist'],'name','asc')));
        if(me.getBookListCallback.callback){
            me.getBookListCallback.callback();
            me.getBookListCallback.callback = undefined;
        }
    },
    initModel: function(callback){
        bui.context.set('cart', bui.context.get('cart')||{});
        
        var me = this;
        me.model.set('bookListFields',[
            {
                width: 3,
                title: '序号',
                sortable: true,
                field: 'index',
                content: function(item) {return item['index'];}
            },
            {
                width: 40,
                title: '书名',
                sortable: true,
                field: 'name',
                content: function(item) {
                    return item['name'];
                }
            },
            {
                width: 20,
                title: 'ISBN',
                sortable: true,
                field: 'isbn',
                content: function(item) {
                    return item['isbn'];
                }
            },
            {
                width: 20,
                title: '作者',
                sortable: true,
                field: 'author',
                content: function(item) {
                    return item['author'];
                }
            },
            {
                width: 20,
                title: '价格',
                sortable: true,
                field: 'price',
                content: function(item) {
                    return item['price'];
                }
            },
            {
                width: 40,
                title: '操作',
                sortable: true,
                field: 'operation',
                content: function(item) {
                    var cart = bui.context.get('cart'),
                        str = '<a href="#/bookinfo~isbn='+item['isbn']
                        + '">查看</a> <a onclick="bui.Action.get().buy(\''+item['isbn']+'\',this)" href="javascript:">'
                        + (cart[item['isbn']]?'已选择':'购买')+'</a>';
                    return str;
                }
            }
        ]);
        
        if (!bui.context.get('allbook')) {
            me.getBookList(callback);
        }
        else {
            me.model.set('bookListDatasource', _.array.buildIndex(_.array.sortBy(bui.context.get('allbook'),'name','asc')));
        
            callback&&callback();
        }
        
    },
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap) {
        var me = this;
        
        
    },
    /**
     * 将图书添加到购物车
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    buy: function(isbn, obj){
        var cart = bui.context.get('cart');
        cart[isbn] = isbn;
        bui.context.set('cart', cart);
        obj.innerHTML = '已选择';
    }
};

bui.inherits(book.List, bui.Action);



book.Cart = function(){
    bui.Action.call(this);
    /**
     * Action索引ID
     * 
     * @comment 主要用于控件中通过onclick="bui.Control.get('listTable','login');
     */
    this.id = 'bookcart';
    this.view = 'bookcart';
    /**
     * 初始化数据模型
     */
    this.model = new bui.BaseModel({});

};
    
book.Cart.prototype = {
    
    initModel: function(callback){
        bui.context.set('cart', bui.context.get('cart')||{});
        
        var me = this,
            cart = bui.context.get('cart'),
            allbook = bui.context.get('allbook')||[],
            booklist = [],
            i,len;
        
        for (i=0,len=allbook.length; i<len; i++) {
            if (cart[allbook[i].isbn]) {
                booklist.push(allbook[i]);
            }
        }

        me.model.set('bookListDatasource', _.array.buildIndex(_.array.sortBy(booklist,'name','desc')));
        
        me.model.set('bookListFields',[
            {
                width: 3,
                title: '序号',
                sortable: true,
                field: 'index',
                content: function(item) {return item['index'];}
            },
            {
                width: 40,
                title: '书名',
                sortable: true,
                field: 'name',
                content: function(item) {
                    return item['name'];
                }
            },
            {
                width: 20,
                title: 'ISBN',
                sortable: true,
                field: 'isbn',
                content: function(item) {
                    return item['isbn'];
                }
            },
            {
                width: 20,
                title: '作者',
                sortable: true,
                field: 'author',
                content: function(item) {
                    return item['author'];
                }
            },
            {
                width: 20,
                title: '价格',
                sortable: true,
                field: 'price',
                content: function(item) {
                    return item['price'];
                }
            },
            {
                width: 40,
                title: '操作',
                sortable: true,
                field: 'operation',
                content: function(item) {
                    var str = '<a href="#/bookinfo~isbn='+item['isbn']
                        + '">查看</a> <a onclick="bui.Action.get().remove(\''+item['isbn']+'\',this)" href="javascript:">移除</a>';
                    return str;
                }
            }
        ]);
        
        callback&&callback();
    },
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap) {
        var me = this;
        
    },
    /**
     * 将图书移除购物车
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    remove: function(isbn, obj){
        var me = bui.Action.get(),
            cart = bui.context.get('cart');
        cart[isbn] = null;
        bui.context.set('cart', cart);
        me.initModel();
        me.controlMap['bookListTable'].datasource = me.model.get('bookListDatasource');
        me.controlMap['bookListTable'].render();
    }
};

bui.inherits(book.Cart, bui.Action);


book.Info = function(){
    bui.Action.call(this);
    /**
     * Action索引ID
     * 
     * @comment 主要用于控件中通过onclick="bui.Control.get('listTable','login');
     */
    this.id = 'bookinfo';
    this.view = 'bookinfo';
    /**
     * 初始化数据模型
     */
    this.model = new bui.BaseModel({});

};
    
book.Info.prototype = {
    
    initModel: function(callback){
        bui.context.set('cart', bui.context.get('cart')||{});
        
        var que = bui.asyque();
        
        que.push(function(callback){
            if (!bui.context.get('allbook')) {
                this.getBookList(callback);
            }
            else {
                callback();
            }
        }, this);
        que.push(function(callback){
            var me = this,
                isbn = me.args['isbn'],
                allbook = bui.context.get('allbook')||[],
                cart = bui.context.get('cart')||{},
                book,
                i,len;

            if (isbn) {
                for (i=0,len=allbook.length; i<len; i++) {
                    if (isbn == allbook[i].isbn) {
                        book = allbook[i];
                        break;
                    }
                }
                me.model.set('name', book.name);
                me.model.set('isbn', book.isbn);
                me.model.set('author', book.author);
                me.model.set('price', book.price);
                me.model.set('ordered', cart[book.isbn]?'已选择':'购买');
            }
            
            callback&&callback();
        }, this);
        que.push(callback);
        que.next();
    },
    /**
     * 初始化列表行为
     *
     * @param {Object} controlMap 当前主内容区域绘制的控件集合.
     */
    initBehavior: function(controlMap) {
        var me = this;
        
    }
};

bui.inherits(book.Info, book.List);


// 新建一个Action类
var helloworld = function(){
    // 调用基类的构造函数
    bui.Action.call(this);
    // Action索引ID
    this.id = 'helloworld';
    // 初始化数据模型
    this.model = new bui.BaseModel();
};
// 扩展Action
helloworld.prototype = {
    // 获取View视图HTML
    getView: function(){
        return 'Hello ${username}!';
    },
    // 初始化数据模型
    initModel: function(callback){
        var me = this;
        me.model.set('username','world')
        callback&&callback();
    },
    // 绑定事件
    initBehavior: function(controlMap) {
        var me = this;
        me.on('LEAVE', function(){
            window.alert('See you tomarrow,hello world.');
        });
    }
};

bui.inherits(helloworld, bui.Action);

// 新建一个Action类
var helloworld2 = function(){
    // 调用基类的构造函数
    bui.Action.call(this);
    // Action索引ID
    this.id = 'helloworld';
    // 初始化数据模型
    this.model = new bui.BaseModel();
};
// 扩展Action
helloworld2.prototype = {
    // 获取View视图HTML
    getView: function(){
        return 'Hello ${username}!002!';
    },
    // 初始化数据模型
    initModel: function(callback){
        var me = this;
        me.model.set('username','world')
        callback&&callback();
    },
    // 绑定事件
    initBehavior: function(controlMap) {
        var me = this;
        me.on('LEAVE', function(){
            window.alert('See you tomarrow.helloworld2');
        });
    }
};
bui.Action.derive(helloworld2);