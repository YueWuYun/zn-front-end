//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Paramsys from '../../sysparam/main/SysParam';
import { createPage, base,ajax, high } from 'nc-lightapp-front';

var Page = createPage({})(Paramsys);

var config = {
  title: 'SYSPARAM-001000',
  pkorg : '',  
  isSys : false,
  isGlb : true,
  funcode : '10140BUZIPARA_GLOBAL',
  nodetype: 'glb',
  pagecode: '10140BUZIPARA_GLOBAL_list',
  appcode: '10140BUZIPARA_GLOBAL',
  appid: '0001Z010000000000R0H'  // 10140BUZIPARA_GLOBAL
};

ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65