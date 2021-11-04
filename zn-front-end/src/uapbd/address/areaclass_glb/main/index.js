//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AreaClassFun from '../../areaclass_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    //在base中直接使用
    //nodeName:"地区分类-全局",
    nodeType:"GLOBE_NODE",
    pageCode:'10140ARCLB_card',
    appCode:'10140ARCLB',
    appID:'0001Z01000000000157Z',
    billType:'areaclass_glb'
}
let AreaClassFunGLB =  createPage({
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
ReactDOM.render(<AreaClassFunGLB  {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65