//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CustMaterial from '../../custmaterial/main/index';
import { createPage, ajax, base,high,toast ,cacheTools,getBusinessInfo,promptBox} from 'nc-lightapp-front';


let params = {
    nodeType:'GROUP_NODE',
    searchId:'10140CMG',
    pageCode:'10140CMG_custmater',
    tablemater:'custmater',
    tablesub:'subcustom',
    appid:'0001Z010000000001NG0',
    funcode:'10140CMG',
    billType:'custmaterial_grp',
    oid:'0001Z01000000000AHCV'
};

let CustmaterialGrp = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: params.pageCode,
        bodycode: [params.tablemater,params.tablesub]
    },
    initTemplate: ()=>{},
    mutiLangCode:'10140CMG'
})(CustMaterial);

ReactDOM.render(<CustmaterialGrp {...{config:params}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65