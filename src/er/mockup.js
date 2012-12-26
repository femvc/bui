'use strict';
var mockup = {};

mockup['managelist.action'] = [
{index: '1',list_id:'3',list_name:'20100208 003',list_status:'0',list_length:'1',in_package:'1',last_modify:'2010-02-09 22:14'},
{index: '2',list_id:'4',list_name:'20100208 004',list_status:'0',list_length:'1',in_package:'1',last_modify:'2010-02-09 23:40'},
{index: '3',list_id:'5',list_name:'20100210 1823',list_status:'1',list_length:'13',in_package:'1',last_modify:'2010-02-21 23:22'},
{index: '4',list_id:'6',list_name:'20100211',list_status:'0',list_length:'1',in_package:'1',last_modify:'2010-02-10 22:26'},
{index: '5',list_id:'7',list_name:'20100211 002',list_status:'0',list_length:'1',in_package:'1',last_modify:'2010-02-22 16:53'},
{index: '6',list_id:'8',list_name:'20100211 003',list_status:'0',list_length:'1',in_package:'1',last_modify:'2010-02-10 23:21'},
{index: '7',list_id:'10',list_name:'789',list_status:'0',list_length:'1',in_package:'0',last_modify:'2010-02-11 01:40'},
{index: '8',list_id:'11',list_name:'20100211 1742',list_status:'1',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:42'},
{index: '9',list_id:'12',list_name:'20100211 1745',list_status:'1',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:44'},
{index:'10',list_id:'13',list_name:'20100211 1746',list_status:'0',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:45'},
{index:'11',list_id:'14',list_name:'20100211 1747',list_status:'0',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:46'},
{index:'12',list_id:'15',list_name:'20100211 1748',list_status:'1',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:47'},
{index:'13',list_id:'16',list_name:'20100211 006',list_status:'0',list_length:'0',in_package:'0',last_modify:'2010-02-11 01:57'},
{index:'14',list_id:'17',list_name:'456',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-08 20:59'},
{index:'15',list_id:'18',list_name:'list_name_new',list_status:'1',list_length:'0',in_package:'0',last_modify:'2011-03-08 21:00'},
{index:'16',list_id:'19',list_name:'list_name_new',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-08 21:00'},
{index:'17',list_id:'20',list_name:'list_name_new',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-24 03:36'},
{index:'18',list_id:'21',list_name:'list_name_new',list_status:'1',list_length:'0',in_package:'0',last_modify:'2011-03-24 03:36'},
{index:'19',list_id:'22',list_name:'list_name_new',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-24 03:37'},
{index:'20',list_id:'23',list_name:'list_name_new',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-24 03:37'},
{index:'21',list_id:'24',list_name:'list_name_new',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-03-24 03:37'},
{index:'22',list_id:'25',list_name:'20110409',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-04-08 23:35'},
{index:'23',list_id:'27',list_name:'CET6',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-04-11 03:54'},
{index:'24',list_id:'28',list_name:'IELTS',list_status:'0',list_length:'0',in_package:'0',last_modify:'2011-04-11 03:55'}
];

mockup['managelist.action?type=add&listname=1111'] = {'listname':1111};

mockup['listwords.action?list_id=1'] = [
{index: '1',word_id:'100000001',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '2',word_id:'100000002',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '3',word_id:'100000003',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '4',word_id:'100000004',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '5',word_id:'100000005',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '6',word_id:'100000006',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '7',word_id:'100000007',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '8',word_id:'100000008',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index: '9',word_id:'100000009',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'},
{index:'10',word_id:'100000010',word:'nice',mean:'adj.好',create_time:'2011-04-11 03:55',phonetic:'nice',audio:'/audio/nice.dat'}
];

mockup['queryword.action?word=nice'] = {word:'miaoyun',mean:'n.爱人',phonetic:'[]',audio:'/audio/honey.dat'};
 
mockup['queryword.action?type=autotip&word=nice'] = [
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'},
{word:'nice',mean:'adj.好',phonetic:'nice',audio:'/audio/nice.dat'}
];
 
 
 
 
 
 
 
 
 
 
