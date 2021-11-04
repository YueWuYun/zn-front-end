//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WCRPanel from '../../workcalendarrule_base/main/';
import { createPage, base, ajax ,NCCreateSearch,toast} from 'nc-lightapp-front';
/**
 * 工作日历规则-业务单元
 */

let config = {
    title: '工作日历规则-业务单元',
    pageCode: '10140WCRO_main',
    appcode: '10140WCRO',
    nodeType: 'org',
};

let WCRPanel_ORG = createPage({
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
ReactDOM.render(<WCRPanel_ORG config={config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65