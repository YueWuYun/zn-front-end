//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import StatMember from '../../reportms_base/stat'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    nodeName: '报表组织体系-全局',
    nodeType: 'GLOBE_NODE',
    statPageCode: "10100RSSB_stat",
    appId:'0001Z010000000001RK0',
    appCode:'10100RSSB'
}
let StatMemberPage =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'form', 
        pagecode:  config.statPageCode,  
        headcode: 'orgForm'
    }]
})(StatMember);

ReactDOM.render(<StatMemberPage {...config}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65