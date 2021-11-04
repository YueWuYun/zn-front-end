//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WCRPanel from '../../workcalendarrule_base/main/';
import { createPage, base, ajax ,NCCreateSearch,toast} from 'nc-lightapp-front';
/**
 * 工作日历规则-全局
 */


let config = {
    title: '工作日历规则-全局',
    pageCode: '10140WCRB_main',
    appcode: '10140WCRB',
    nodeType: 'glb',
};
let WCRPanel_GLB = createPage({
    billinfo:[{
        billtype: 'form',
        pagecode: config.pageCode,
        headcode: 'headform'
    },{
        billtype: 'form',
        pagecode: config.pageCode,
        headcode: 'createmodel'
    }]
    // initTemplate: []
})(WCRPanel)



/**
 * 渲染页面
 */
ReactDOM.render(<WCRPanel_GLB config={config} />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65