//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import OrgSysPage from '../../reportcbs_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    // nodeName: this.state.json['10100CRSB-000055'],/* 国际化处理： 报表合并体系-集团*/
    nodeType: 'GROPE_NODE',
    nodePageCode: "10100RCSG_list",
    appId:'0001Z010000000000O3B',
    appCode:'10100RCSG'
}
let RepPage =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'form', 
        pagecode:  config.nodePageCode,  
        headcode: 'sysForm',
    },{
        billtype: 'form', 
        pagecode:  config.nodePageCode,  
        headcode: 'reportorg_form'
    },{
        billtype: 'form', 
        pagecode:  config.nodePageCode,  
        headcode: 'memberForm'
    }]
})(OrgSysPage);

ReactDOM.render(<RepPage {...config}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65