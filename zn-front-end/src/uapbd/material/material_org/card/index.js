//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Material from '../../material_base/card/index'

export default class Materialorgcard extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        var config ={
            title:'10140MATERIAL-000076',//'物料-业务单元',
            node_type:'ORG_NODE',//'ORG_NODE','GROUP_NODE'
            appid : '0001Z010000000005Y15',
            pagecode : '10140MAO_base_card',
            pagecodelist : '10140MAO_base_list',
            appcode : '10140MAO',
            datasource : 'uapbd.material.material.org',
            dataTemplet_funcode:'10140MAO_NCC',
            print : {
                funcode : '10140MAO',
                nodekey : 'materialbasecard_ncc'
            },
            printlist:{
                fi : {
                    funcode : '10140MAO',
                    nodekey : 'materialfilist_ncc'
                },
                pfc : {
                    funcode : '10140MAO',
                    nodekey : 'materialpfclist_ncc'
                },
                pu : {
                    funcode : '10140MAO',
                    nodekey : 'materialpulist_ncc'
                },
                sale : {
                    funcode : '10140MAO',
                    nodekey : 'materialsalelist_ncc'
                },
                stock : {
                    funcode : '10140MAO',
                    nodekey : 'materialstocklist_ncc'
                },
                plan : {
                    funcode : '10140MAO',
                    nodekey : 'materialplanlist_ncc'
                },
                prod : {
                    funcode : '10140MAO',
                    nodekey : 'materialprodlist_ncc'
                },
                cost : {
                    funcode : '10140MAO',
                    nodekey : 'materialcostlist_ncc'
                },
                pfccinfo : {
                    funcode : '10140MAO',
                    nodekey : 'materialpfcclist_ncc'
                }
            },
            printcard:{
                fi : {
                    funcode : '10140MAO',
                    nodekey : 'materialficard_ncc'
                },
                pfc : {
                    funcode : '10140MAO',
                    nodekey : 'materialpfccard_ncc'
                },
                pu : {
                    funcode : '10140MAO',
                    nodekey : 'materialpucard_ncc'
                },
                sale : {
                    funcode : '10140MAO',
                    nodekey : 'materialsalecard_ncc'
                },
                stock : {
                    funcode : '10140MAO',
                    nodekey : 'materialstockcard_ncc'
                },
                plan : {
                    funcode : '10140MAO',
                    nodekey : 'materialplancard_ncc'
                },
                prod : {
                    funcode : '10140MAO',
                    nodekey : 'materialprodcard_ncc'
                },
                cost : {
                    funcode : '10140MAO',
                    nodekey : 'materialcostcard_ncc'
                },
                pfccinfo : {
                    funcode : '10140MAO',
                    nodekey : 'materialpfcccard_ncc'
                }
            },
            printUrls : {
                fi : "/nccloud/uapbd/material/printMaterialfi.do",
                pfc : "/nccloud/uapbd/material/printMaterialpfc.do",
                pu : "/nccloud/uapbd/material/printMaterialpu.do",
                sale : "/nccloud/uapbd/material/printMaterialsale.do",
                stock : "/nccloud/uapbd/material/printMaterialstock.do",
                plan : "/nccloud/uapbd/material/printMaterialplan.do",
                prod : "/nccloud/uapbd/material/printMaterialprod.do",
                cost : "/nccloud/uapbd/material/printMaterialcost.do",
                pfccinfo : "/nccloud/uapbd/material/printMaterialpfcc.do"
            },
            pagecodeValues : {
                'fi' : 'fi_card',
                'pfc' : 'pfc_card',
                'pu' : 'pu_card',
                'sale' : 'sale_card',
                'stock' : 'stock_card',
                'plan' : 'plan_card',
                'prod' : 'prod_card',
                'cost' : 'cost_card',
                'pfccinfo' : 'profitcost_card',
                'asstframe' : 'asstframe',
                'fi_list' : 'fi_list',
                'pfc_list' : 'pfc_list',
                'pu_list' : 'pu_list',
                'sale_list' : 'sale_list',
                'stock_list' : 'stock_list',
                'plan_list' : 'plan_list',
                'prod_list' : 'prod_list',
                'cost_list' : 'cost_list',
                'pfccinfo_list' : 'profitcost_list',
                'assign' : 'assign',
                'assignstatus' : '10140MASTAT_marorg',
                'list_pagecode' : '10140MAO_base_list'
            }
        };

        return (
            <Material {...{config:config}}/>
        )
    }
}

//ReactDOM.render(<Material {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65