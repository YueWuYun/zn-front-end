//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import CurrinfoClass from '../../currinfo_base/main/index';
import { createPage,ajax} from 'nc-lightapp-front';

const schemeeditor = '10140CURT_extratescheme';
let config = {
    title:"10140CURT-000005",
    pageCode:"10140CURT_adjustrate",
    nodeType:"GLOBE_NODE",
    appcode:'10140CURT',
    //appid:'0001Z010000000000O3S',
    refresh:'/uapbd/pubinfo/currinfo_glb/main/index.html',
    pk_org:'GLOBLE00000000000000',
    formId:"currinfo"
};
ReactDOM.render(<CurrinfoClass {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65