//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Paramsys from '../../sysparam/main/SysParam';
import { createPage, base,ajax, high } from 'nc-lightapp-front';

var Page = createPage({})(Paramsys);
var config = {
  title: 'SYSPARAM-002000',
  pkorg : '',
  isSys : false,
  isGlb : false,
  funcode : '10140BUZIPARA_GROUP',
  nodetype: 'grp',
  pagecode: '10140BUZIPARA_GROUP_list',
  appid: '0001Z010000000000R0I',  // 10140BUZIPARA_GLOBAL
  appcode: '10140BUZIPARA_GROUP'
};



ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65