//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cashflow from '../../cashflow/main/Cashflow';
import {ajax,createPage } from 'nc-lightapp-front';
var config = {
  title: "10140CASHFLOW-003000",
  nodetype: 'org',
  pagecode: '10140CFPO_main',
 // appid: '0001Z01000000000GYN1'
  appcode: '10140CFPO',
  nodetypename: '全局',
  billType:'cashflow_forg'
};
var Page = createPage({
  billinfo:[{
    billtype: 'form',
    pagecode: config.pagecode,
    headcode: 'cashflow'
},{
    billtype: 'form',
    pagecode: config.pagecode,
    headcode: 'cfadjitemset'
}]
})(Cashflow);

ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65