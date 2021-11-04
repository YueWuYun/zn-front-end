//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage} from 'nc-lightapp-front';
import SupplierClass from '../../supplierclass/main/index';

/**
 * liupzhc 供应商基本分类 全局节点
 *
 */

let config = {
    nodeType:'GLOBE_NODE',
    //title:'',
    pageCode:'10140SCLB_supplierclass',
    appcode:'10140SCLB',
    appid:'0001Z010000000001WPB',//'0001Z010000000001WPE',//'0001Z010000000001WPF',
    formId:'supplierclass',
    billType:'supplierclass_glb'
}

const SupplierClass_GLB = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140SCLB_supplierclass',
        headcode: 'supplierclass'
    }
})(SupplierClass);
ReactDOM.render(<SupplierClass_GLB config={config}/>,document.querySelector("#app"));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65