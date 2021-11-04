//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import JobEditTable from  '../../../org/job_base/main/index';
/**
 * author zhenmx
 *
 */
const config = {
    NODE_TYPE:'GLOBE_NODE',
    gridId:'grid10100JOBB',
    searchId:'10100Job',
    nodeKey:'JobGlbPrint',
    datasource:'uapbd_jobglb_mainlist'
};
let JobglbTable = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        headcode:config.gridId
    },
    initTemplate: null
})(JobEditTable);
ReactDOM.render(<JobglbTable {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65