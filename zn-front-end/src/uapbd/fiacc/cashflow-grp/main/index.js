//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cashflow from '../../cashflow/main/Cashflow';
import {ajax,createPage } from 'nc-lightapp-front';
var config = {
  title: "10140CASHFLOW-002000",
  nodetype: 'grp',
  pagecode: '10140CFPG_main',
  appid: '0001Z01000000000GYMY',
  appcode: '10140CFPG',
  billType:'cashflow_grp'
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