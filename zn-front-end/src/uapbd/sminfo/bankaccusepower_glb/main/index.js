//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import SingleTable from '../../bankaccusepower_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

let config = {
    nodeName: '银行账户授权情况查询-集团',
    nodeType: 'GROUP_NODE',
    tableid:"head",
    pageCode:'10140BAQG_list',
    appcode:'10140BAQG',
    appid:'0001Z010000000000PBY',
    searchid : '1014180802'
}

ReactDOM.render(<SingleTable {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65