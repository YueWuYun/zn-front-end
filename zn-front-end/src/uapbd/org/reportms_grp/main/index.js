//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import OrgSysPage from '../../reportms_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    // nodeName: this.state.json['10100RSSB-000055'],/* 国际化处理： 报表组织体系-集团*/
    nodeType: 'GROUP_NODE',
    nodePageCode: "10100RSSG_list",
    appId:'0001Z010000000001RK3',
    appCode:'10100RSSG'
}
let RepmPage =  createPage({
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
ReactDOM.render(<RepmPage {...config}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65