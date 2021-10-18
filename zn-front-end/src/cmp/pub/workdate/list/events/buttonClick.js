/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, ajax, print } from 'nc-lightapp-front';
import beSureBtnClick from './beSureBtnClick';

let { NCPopconfirm, NCIcon, NCMessage } = base;
const { NCDatePicker } = base;

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

export default function buttonClick(props, id) {
    let pk_org = null;
    if(props.search.getSearchValByField(this.searchId,"pk_org")){
        pk_org = props.search.getSearchValByField(this.searchId,"pk_org").value.firstvalue
    }
    if(pk_org === null){
        NCMessage.create({content: '请选择资金组织并查询', color: 'danger', position: 'top'});
    }else{
        let {  modal, ncmodal } = this.props;       
        let record = {
            pk_org:pk_org
        }
        switch (id) {
            // 开始受理
            case 'startsettle':
                ajax({
                    url: '/nccloud/fts/workdate/startsettle.do',
                    data: {
                        pk_org: pk_org
                    },
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                // modal.show('startsettle');
                                ncmodal.show('startsettle',{
                                    content: "开始受理日期为" + data + "，是否确定？",
                                    color:'success',
                                    //点击确定按钮事件
                                    beSureBtnClick: beSureBtnClick.bind(this, props, 'startsettleConfirm', record)
                                });
                            }else{
                                // modal.show('firststartsettle');
                                ncmodal.show('firststartsettle',{
                                    // content: "开始受理日期为" + data + "，是否确定？",
                                    color:'success',
                                    //点击确定按钮事件
                                    beSureBtnClick: beSureBtnClick.bind(this, props, 'firststartsettleConfirm', record)
                                });
                            }
                        }
                    },
                });
                break;
            // 查询工作日志
            case 'queryworklog':
                modal.show('queryworklog',{
                    //点击确定按钮事件
                    beSureBtnClick: beSureBtnClick.bind(this, props, 'queryworklogConfirm', record)
                });
                break;
            // 打印
            case 'print':
                let printData= props.table.getCheckedRows(this.tableId);
                if(printData.length <= 0){
                    NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                    return;
                }
                let printpks=[];
                printData.forEach((item) => { 
                    printpks.push(item.data.values.pk_calendar.value);
                });
                print(
                    //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    'pdf',
                    '/nccloud/fts/workdatequery/workdatequeryprint.do',
                    {
                        printTemplateID: '1001Z61000000002L2DW',
                        //功能节点编码，即模板编码
                        funcode: appcode,
                        //模板节点标识
                        nodekey: 'nccloud',     
                        // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                        oids: printpks, 
                    }
                );  
                break;
            // 输出
            case 'output':
                let outputData= props.table.getCheckedRows(this.tableId);
                if(outputData.length <= 0){
                    NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                    return;
                }
                let outputpks=[];
                outputData.forEach((item) => { 
                    outputpks.push(item.data.values.pk_calendar.value);
                });
                this.setState({
                outputData: {
                    printTemplateID: '1001Z61000000002L2DW',
                    //功能节点编码，即模板编码
                    funcode: appcode,
                    //模板节点标识
                    nodekey: 'nccloud',
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: outputpks,
                    outputType: 'output'
                }
                },() => {
                    this.refs.printOutput.open();
                });
                break;
            // 刷新
            case 'refresh':
                let pageInfo = props.table.getTablePageInfo(this.tableId);
                if(props.search.getSearchValByField(this.searchId,"pk_org")){
                    pk_org = props.search.getSearchValByField(this.searchId,"pk_org").value.firstvalue
                }
                let data={
                    pk_org: pk_org,
                };
                ajax({
                    url: '/nccloud/fts/workdate/querylog.do',
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                            }else{
                                this.props.table.setAllTableData(this.tableId, {rows:[]});
                            }                    
                        }
                    }
                });
                break;
            default:
                break;
        }
    }
    
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/