//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Mccl from '../../mccl/main/index';
import { createPage,ajax} from 'nc-lightapp-front';

var Page = createPage({

    billinfo:{
        billtype:'form',
        pagecode:"10140MCCLO_marcostclass",
        headcode:"marcostclass",
    }

})(Mccl)
/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    //title:"物料成本分类-业务单元",
    pageCode:"10140MCCLO_marcostclass",
	appcode:'10140MCCLO',
    nodeType:"ORG_NODE",
    appid:'0001Z01000000000B062',
    refresh:'/uapbd/material/mccl_org/main/index.html',
    formId:"marcostclass",
    billType:'marcostclass_org'
};




/**
 * 渲染页面
 */
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65