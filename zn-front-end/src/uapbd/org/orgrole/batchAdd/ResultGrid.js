//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl,NCPagination  } = base;
import Table from '../../../public/excomponents/Table.js';

var EMPTY_FN = function(){};
class ResultGrid extends Component {
    constructor(props) {
        super(props);
        this.main = props.main;
        this.state = {
            json:{},
            table: {
                columns:[{
                    title: props.main.state.json['10100PSRC-000059'], /* 国际化处理： 业务组织编码*/
                    dataIndex: 'code',
                    render:( val,record) => {
                        return record.getData().org.nodeData.code;
                    }
                },{
                    title: props.main.state.json['10100PSRC-000060'], /* 国际化处理： 业务组织名称*/
                    dataIndex: 'name',
                    render: (val,record) => {
                        return record.getData().org.name;
                    }
                },{
                    title: props.main.state.json['10100PSRC-000061'],/* 国际化处理： 业务场景*/
                    dataIndex: 'name',
                    render: (val,record) => {
                        return ''.concat (record.getData().cols.map( col => col.function_name))
                    }
                }],
                checkedModel:{}
            }
        };
    }


    rest(){}

    getData(){
       return  ( this.table. getCheckedRecords() || [] ).map( d =>{
           return d.getData();
       });
 
    }

    onInit(){
        var colSelectComp = this.main.state.comp['comp0'],
            orgSelectComp = this.main.state.comp['comp1'],
            colDatas = colSelectComp.getData() || [],
            orgDatas = orgSelectComp.getData() || [];

        var datas = orgDatas.map( orgData => {
            return {
                org: orgData,
                cols: colDatas.map( colData => colData.getData())
            };
        });
        this.table.loadData(datas);
    }
    render() {
        return (
            <div>
                <Table {...this.state.table}  ref={(table) => this.table = table}/>
            </div>
        )
    }
}
export default ResultGrid;
//QCLNW5kO2W4qKMHdM5+3LTr3OFJwWaOfX+rHERc4usL+6alsMSXznYwbxwekqEZb