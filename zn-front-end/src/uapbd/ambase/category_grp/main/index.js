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
    NODE_TYPE:'GROUP_NODE',
    appid:'0001Z910000000001WWE',
    linkto:'/uapbd/ambase/category_grp/main/index.html',
    funcode:'10141510',
    pageCodeForm:'10141510_form',
    pageCodeList:'10141510_list',
    oid:'1001Z91000000000LK8H'
}

let CategoryGrp = createPage({
    billinfo:{
        billtype: 'card',
        pagecode: params.pageCodeForm,
        headcode: 'head',
        bodycode: bodyvosId
    },
    initTemplate: (props) => {}
})(AmCategoryTable)

ReactDOM.render(<CategoryGrp {...{config:params}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65