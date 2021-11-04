//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,toast,cacheTools} from 'nc-lightapp-front';
import Supplier from '../../supplier_base/main/index';
const {NCIcon,NCPopconfirm} = base;
/**
 * 供应商 集团节点
 * @author liupzhc
 *
 */
let config = {
    pagecode:"10140SUG_base",
    appid:'0001Z010000000002G43',
    appcode:'10140SUG',
    //oid:'0001Z81000000000CWIB',
    nodeType:'GROUP_NODE',
    billType:'supplier_grp',
    supbabillType:'supbankacc_grp',
    title:''/* 国际化处理： 供应商-集团*/
}
debugger;
const Supplier_Grp = createPage({
    initTemplate:{},
    billinfo:[
        {
            billtype: 'extcard', 
            pagecode: config.pagecode, 
            headcode: 'supplier_baseInfo_card',
            bodycode: ['suplinkman', 'supbankacc','supcountrytaxes','finance','purchase']
        },{
            billtype: 'card', 
            pagecode: config.pagecode, 
            headcode: 'accbasinfo',
            bodycode: 'bankaccsub'
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'linkman'//联系人form
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'createCust'//生成客户form
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'associcust'//关联客户form
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'supfinance_card'//财务信息form
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'supstock_card'//采购信息form
        },{
            billtype: 'grid',
            pagecode: config.pagecode,
            bodycode: 'supaddress'//供应商发货地址grid
        },{
            billtype: 'form',
            pagecode: config.pagecode,
            headcode: 'linkmanRefer'//联系人参照form
        }
        // ,{
        //     billtype: 'grid',
        //     pagecode: config.pagecode,
        //     bodycode: 'supcountrytaxes'//供应商国家税类grid
        // }
    ]
})(Supplier)
ReactDOM.render(<Supplier_Grp {...config}/>,document.querySelector("#app"));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65