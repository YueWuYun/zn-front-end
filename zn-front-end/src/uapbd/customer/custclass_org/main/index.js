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
    title:"客户基本分类-业务单元",
    pageCode:"10140CCLO_custclass",
    nodeType:"ORG_NODE",
    appcode:'10140CCLO',
    billType:'custclass_org',
    appid:'0001Z010000000000O4G',
    refresh:'/uapbd/customer/custclass_org/main/index.html',
    formId:"custclass"
};



var CustClass_Org = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140CCLO_custclass',
        headcode: 'custclass'
    }
})(CustClass);


/**
 * 渲染页面
 */
ReactDOM.render(<CustClass_Org {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65