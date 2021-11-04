//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CustMaterial from '../../custmaterial/main/index';
import {initTemplate} from "../../custmaterial/util";
import { createPage, ajax, base,high,toast ,cacheTools,getBusinessInfo,promptBox} from 'nc-lightapp-front';


let params = {
    searchId:'10140CMG',
    nodeType:'ORG_NODE',
    tablemater:'custmater',
    tablesub:'subcustom',
    appid:'0001Z010000000001NG3',
    funcode:'10140CMO',
    pageCode:'10140CMO_custmater',
    billType:'custmaterial_org',
    oid:'0001Z01000000000AHCV'
};

let CustmaterialOrg = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: params.pageCode,
        bodycode: [params.tablemater,params.tablesub]
    },
    initTemplate: ()=>{},
    mutiLangCode:'10140CMG'
})(CustMaterial);

ReactDOM.render(<CustmaterialOrg {...{config:params}}/>, document.querySelector('#app'));


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65