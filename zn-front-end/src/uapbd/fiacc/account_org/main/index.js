//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Account from '../../account/main/index.js';
import {ajax,createPage } from 'nc-lightapp-front';

var Page = createPage({
  billinfo:
  {
  billtype:'card',
  pagecode:'10140ACCO_main',
  headcode:'formAccount',
  bodycode:'formAccAss',//['agentstores','agentstores_childform1','agentstores_childform2']
}
})(Account);
var config = {
  title: '',
  nodetype: 'org',
  pagecode: '10140ACCO_main',
  appcode: '10140ACCO' ,
//  listNodeKey:'10140ACCO_LIST',//'会计科目列表-组织_ncc',
//  cardNodeKey:'10140ACCO_CARD'//'会计科目卡片-组织_ncc',
  listNodeKey:'listtemp',//'10140ACCB_LIST',//'会计科目列表_ncc',
  cardNodeKey:'cardtemp',//'10140ACCB_CARD'//'会计科目卡片_ncc',
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65