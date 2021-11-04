//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Account from '../../account/main/index.js';
import {ajax,createPage } from 'nc-lightapp-front';

var Page = createPage({
  billinfo:
    {
		billtype:'card',
		pagecode:'10140ACCB_main',
		headcode:'formAccount',
		bodycode:'formAccAss',//['agentstores','agentstores_childform1','agentstores_childform2']
  }

})(Account);
var config = {
  title: '',
  nodetype: 'glb',
  pagecode: '10140ACCB_main',
  appcode: '10140ACCB' ,
  //listNodeKey:'10140ACCB_LIST',//'会计科目列表_ncc',
  //cardNodeKey:'10140ACCB_CARD'//'会计科目卡片_ncc',
  listNodeKey:'listtemp',//'10140ACCB_LIST',//'会计科目列表_ncc',
  cardNodeKey:'cardtemp',//'10140ACCB_CARD'//'会计科目卡片_ncc',
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65