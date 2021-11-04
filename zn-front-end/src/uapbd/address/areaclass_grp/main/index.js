//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../areaclass_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    //在base中直接引用
    //nodeName:"地区分类-集团",
    nodeType:"GROPE_NODE",
    pageCode:'10140ARCLG_card',
    appCode:'10140ARCLG',
    appID:'0001Z010000000001581',
    billType:'areaclass_grp'
}
let AreaClassFunGRP =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'form', 
        pagecode:  config.pageCode,  
        headcode: 'areaclassForm',
    }]
})(AreaClassFun);
/**
 * 渲染页面
 */
ReactDOM.render(<AreaClassFunGRP  {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65