//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import CustClass from '../../custclass/main/index';
import { createPage,ajax} from 'nc-lightapp-front';

/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    title:"客户基本分类-全局",
    pageCode:"10140CCLB_custclass",
    nodeType:"GLOBE_NODE",
    appcode:'10140CCLB',
    appid:'0001Z010000000000O3S',
    billType:'custclass_glb',
    refresh:'/uapbd/customer/custclass_glb/main/index.html',
    formId:"custclass"
};


var CustClass_GLB = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140CCLB_custclass',
        headcode: 'custclass'
    }
})(CustClass);


/**
 * 渲染页面
 */
ReactDOM.render(<CustClass_GLB {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65