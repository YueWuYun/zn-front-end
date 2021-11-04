//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Material from '../../material_base/main/index'

export default class Materialorglist extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        var config ={
            title:'10140MATERIAL-000076',//'物料-业务单元',
            node_type:'ORG_NODE',//'ORG_NODE','GROUP_NODE'
            appid : '0001Z010000000005Y15',
            pagecode : '10140MAO_base_list',
            pagecodecard : '10140MAO_base_card',
            billType : 'material_org',
            pagecode_card : '10140MAO_base_card',
            appcode : '10140MAO',
            datasource : 'uapbd.material.material.org',
            print : {
                funcode : '10140MAO',
                nodekey : 'materialbaselist_ncc'
            },
            pagecodeValues : {
                'cardpagecode' : '10140MAO_base_card',
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
                'list_pagecode' : '10140MAG_base_list'
            }
        };
        return (
            <Material {...{config:config}}/>
        )
    }
}

//ReactDOM.render(<Material {...{config:config}}/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65