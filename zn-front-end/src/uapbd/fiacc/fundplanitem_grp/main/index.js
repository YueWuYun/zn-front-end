//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Fundplanitem from '../../fundplanitem/main';
import {ajax,createPage } from 'nc-lightapp-front';
/**
 * 资金项目计划-集团
 */
var config = {
    title:'10140FPB-002000',
    pagecode:'10140FPG_grp',
    appcode:'10140FPG',
    billType:'fundplangrp',
    nodetype:'GROUP_NODE',
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