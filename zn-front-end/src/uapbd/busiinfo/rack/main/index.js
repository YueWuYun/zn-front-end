//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Rack_Base from '../../rack_base/main/index';
import { createPage,ajax} from 'nc-lightapp-front';

/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    //title:"货位",
    pageCode:"10140RACK_card",
	appcode:'10140RACK',
    nodeType:"ORG_NODE",
    appid:'0001Z010000000000O4Y',
    refresh:'uapbd/busiinfo/rack/main/index.html',
    formId:"head"
};


/**
 * 渲染页面
 */
ReactDOM.render(<Rack_Base {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65