//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Mscl from '../../mscl/main/index';
import { createPage,ajax} from 'nc-lightapp-front';

var Page = createPage({

    billinfo:{
        billtype:'form',
        pagecode:"10140MSCLO_ORG",
        headcode:"marsaleclass",
    }

})(Mscl)
/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    //title:'',//"物料销售分类-销售组织",
    pageCode:"10140MSCLO_ORG",
    nodeType:"ORG_NODE",
	appcode:'10140MSCLO',
    appid:'0001Z01000000000B07A',
    refresh:'/uapbd/material/mscl_org/main/index.html',
    formId:"marsaleclass",
    billType:'mscl_org'
};





/**
 * 渲染页面
 */
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65