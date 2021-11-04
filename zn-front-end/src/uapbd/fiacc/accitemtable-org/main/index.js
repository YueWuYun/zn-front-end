//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Accitemtable from '../../accitemtable/main/Accitemtable';
import {ajax,createPage } from 'nc-lightapp-front';

var Page = createPage({
  billinfo:[{
    billtype: 'extcard', 
    pagecode: 'accchart_org_main', 
    headcode: 'accchart',
    bodycode: ['accchart_book', 'accchart_rule','accchart_policy']
  },{
      billtype: 'extcard', 
      pagecode: 'accchart_org_main', 
      headcode: 'ctrlrule', 
      bodycode: ['ctrlrule_account','ctrlrule_org','ctrlrule_rule']
  }]
})(Accitemtable);
var config = {
  title: 'ACCCHART-003000',
  nodetype: 'org',
  pagecode: 'accchart_org_main',
  appcode: '10140ACCCHARTORG'
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65