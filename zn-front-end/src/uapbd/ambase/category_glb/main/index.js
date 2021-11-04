//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {AmCategoryTable} from '../../category/main';
import { createPage, base ,ajax,toast,print,high,promptBox} from 'nc-lightapp-front';
import {initTemplate} from '../../category/initTemplate/index';

import {config} from '../../category/config/index';
const {formId,treeId,bodyvosId,ajaxurl} =config;


/**
 * author zhaochxs
 *
 */

let params = {
    NODE_TYPE:'GLOBE_NODE',
    appid:'0001Z910000000001WVC',
    linkto:'/uapbd/ambase/category_glb/main/index.html',
    funcode:'10141505',
    pageCodeForm:'10141505_form',
    pageCodeList:'10141505_list',
    oid:'1001Z91000000000IJAP'
}

let CategoryGlb = createPage({
    billinfo:{
        billtype: 'card',
        pagecode: params.pageCodeForm,
        headcode: 'head',
        bodycode: bodyvosId
    },
    initTemplate: (props) => {}
})(AmCategoryTable)

ReactDOM.render(<CategoryGlb {...{config:params}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65