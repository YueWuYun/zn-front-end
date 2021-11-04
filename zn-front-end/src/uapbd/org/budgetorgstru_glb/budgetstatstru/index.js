//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import StatMember from '../../budgetorgstru_base/budgetstatstru'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage} from 'nc-lightapp-front';
let config = {
    nodeName: '预算组织体系-全局',
    nodeType: 'GLOBE_NODE',
    statPageCode: "10100BOSB_stat",
    appId:'0001Z010000000000O3R',
    appCode:'10100BOSB'
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