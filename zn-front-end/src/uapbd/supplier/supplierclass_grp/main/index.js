//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage} from 'nc-lightapp-front';
import SupplierClass from '../../supplierclass/main/index';

/**
 * liupzhc 供应商基本分类 集团节点
 *
 */

let config = {
    nodeType:'GROUP_NODE',
    //title:'',
    pageCode:'10140SCLG_supplierclass',
    appid:'0001Z010000000001WPE',//'0001Z010000000001WPE',//'0001Z010000000001WPF',
    appcode:'10140SCLG',
    formId:'supplierclass',
    billType:'supplierclass_grp'
}

const SupplierClass_GRP = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140SCLG_supplierclass',
        headcode: 'supplierclass'
    }
})(SupplierClass);
ReactDOM.render(<SupplierClass_GRP config={config}/>,document.querySelector("#app"));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65