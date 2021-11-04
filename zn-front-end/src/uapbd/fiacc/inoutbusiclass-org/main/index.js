//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inoutbusiclass from '../../inoutbusiclass/main/Inoutbusiclass';
import {ajax,createPage } from 'nc-lightapp-front';

var config = {
  title: 'INOUTBUSICLASS-003000',//'收支项目-组织',
  nodetype: 'org',
  pagecode: '10140IOIO_main',
  appid: '0001Z01000000000ICUF',
  appcode: '10140IOIO',
  billType: 'inoutbusiclass_org'
};
var Page = createPage({
  billinfo:[{
    billtype: 'form',
    pagecode: config.pagecode,
    headcode: 'inoutBusiClass'
}]
})(Inoutbusiclass);

ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65