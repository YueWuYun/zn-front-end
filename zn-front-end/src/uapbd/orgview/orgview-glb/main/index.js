//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import OrgView from '../../orgview/main/Orgview';
// import {ajax,createPage} from 'nc-lightapp-front';

// var config = {
//     title: '组织结构图-全局',
//     nodetype: 'glb'
// };

// ajax({
//     url: '/nccloud/platform/templet/querypage.do',
//     data: {
//       pagecode: 'orgview'
//     },
//     success: function(res) {
//       let meta = res.data;
//       config.meta = meta;
//       config.pagecode = 'orgview';
//       var View = createPage( {...{config:config}} )(OrgView)
//       ReactDOM.render(<View {...{config:config}}/>, document.querySelector('#app'));
//     }
// });

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Orgview from '../../orgview/main/Orgview';
import {ajax,createPage} from 'nc-lightapp-front';

var Page = createPage({})(Orgview);
var config = {
  title: 'ORGVIEW-001000',
  nodetype: 'glb',
  pagecode: 'orgview_glb_main',
  appcode: '10102GLORGV'
};
ReactDOM.render(<Page {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65