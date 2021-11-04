//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage} from 'nc-lightapp-front';
import SupplierClass from '../../supplierclass/main/index';

/**
 * liupzhc 供应商基本分类业务单元节点
 *
 */


let config = {
    nodeType:'ORG_NODE',
    //title:'',
    pageCode:'10140SCLO_supplierclass',
    appid:'0001Z010000000001WPF',//'0001Z010000000001WPE',//'0001Z010000000001WPF',
    appcode:'10140SCLO',
    formId:'supplierclass',
    billType:'supplierclass_org'
}

const SupplierClass_ORG = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140SCLO_supplierclass',
        headcode: 'supplierclass'
    }
})(SupplierClass);
ReactDOM.render(<SupplierClass_ORG config={config}/>,document.querySelector("#app"));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65