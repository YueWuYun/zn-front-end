//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Mccl from '../../mccl/main/index';
import { createPage,ajax} from 'nc-lightapp-front';
var Page = createPage({

    billinfo:{
        billtype:'form',
        pagecode:"10140MCCLG_marcostclass",
        headcode:"marcostclass",
    }

})(Mccl)
/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    //title:"物料成本分类-集团",
    pageCode:"10140MCCLG_marcostclass",
    nodeType:"GROUP_NODE",
    appid:'0001Z01000000000B05J',
	appcode:'10140MCCLG',
    refresh:'/uapbd/material/mccl_grp/main/index.html',
    formId:"marcostclass",
    billType:'marcostclass_grp'
};




/**
 * 渲染页面
 */
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65