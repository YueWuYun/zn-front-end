//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import CurrinfoClass from '../../currinfo_base/main/index';
import { createPage,ajax} from 'nc-lightapp-front';


let config = {
    title:"10140CURT-000045",
    pageCode:"10140CURTG_adjustrate",
    nodeType:"GROUP_NODE",
    appcode:'10140CURTG',
    //appid:'0001Z010000000000O3S',
    refresh:'/uapbd/pubinfo/currinfo_grp/main/index.html',
    formId:"currinfo"
};

ReactDOM.render(<CurrinfoClass {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65