//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inoutbusiclass from '../../inoutbusiclass/main/Inoutbusiclass';
import {ajax,createPage } from 'nc-lightapp-front';
var config = {
  title: 'INOUTBUSICLASS-001000', //"收支项目-全局"
  nodetype: 'glb',
  pagecode: '10140IOIB_main',
  appid: '0001Z01000000000ICU9',
  appcode: '10140IOIB',
  billType: 'inoutbusiclass_glb'
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