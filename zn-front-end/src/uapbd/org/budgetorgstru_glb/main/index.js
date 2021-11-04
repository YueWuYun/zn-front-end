//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import OrgSysPage from '../../budgetorgstru_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    nodeName: '预算组织体系-全局',
    nodeType: 'GLOBE_NODE',
    nodePageCode: "10100BOSB_list",
    appId:'0001Z010000000000O3R',
    appCode:'10100BOSB'
}
let BudPage =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'form', 
        pagecode:  config.nodePageCode,  
        headcode: 'sysForm',
    },{
        billtype: 'form', 
        pagecode:  config.nodePageCode,  
        headcode: 'orgForm'
    }]
})(OrgSysPage);

ReactDOM.render(<BudPage {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65