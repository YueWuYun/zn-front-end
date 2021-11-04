//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Fundplanitem from '../../fundplanitem/main';
import {ajax,createPage } from 'nc-lightapp-front';
/**
 * 资金项目计划-全局
 */
var config = {
    title:'10140FPB-001000',
    pagecode:'10140FPB_glb',
    appcode:'10140FPB',
    billType:'fundplanglb',
    nodetype:'GLOUB_NODE',
    formId:'head',
    isGlbGrp:'0'
};

var Page = createPage({
  billinfo:[{
    billtype: 'form',
    pagecode: config.pagecode,
    headcode: 'head'
}]
})(Fundplanitem);

ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65