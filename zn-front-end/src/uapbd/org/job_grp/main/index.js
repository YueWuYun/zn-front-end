//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import JobEditTable from  '../../job_base/main/index';
/**
 * author zhenmx
 *
 */
const config = {
    NODE_TYPE:'GROUP_NODE',
    gridId:'grid10100JOBG',
    searchId:'10100Job',
    nodeKey:'JobGlbPrint',
    datasource:'uapbd_jobgrp_mainlist'
};
let JobGrpTable = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        headcode:config.gridId
    },
    initTemplate: null
})(JobEditTable);
ReactDOM.render(<JobGrpTable {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65