//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cashflow from '../../cashflow/main/Cashflow';
import {ajax,createPage } from 'nc-lightapp-front';
var config = {
  title: "10140CASHFLOW-001000",//'现金流量项目-全局',
  nodetype: 'glb',
  pagecode: '10140CFPB_main',
  appcode: '10140CFPB',
  billType:'cashflow_glo'
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