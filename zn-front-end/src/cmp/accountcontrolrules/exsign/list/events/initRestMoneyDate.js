/*nWjf/DbQ5IuWIqJbd0fG+Bn7Gi7nn5rolzDju0ST7QyPHJgj0sg00WdeCzH5y8WW*/
//此JS专门处理请求
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast} from 'nc-lightapp-front';
import initTemplate from './initTemplate';

let tableId = 'exsign_table';
let pageId = '36070BAES_L01';
export function getData(serval) {
    let pageInfo = this.props.editTable.getTablePageInfo(this.tableId);
    let data = {
        conditions: serval,
        pageInfo: pageInfo,
        pagecode: pageId,
        queryAreaCode: "",  //查询区编码
        oid: '1001A81000000001RROD',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        queryType: 'simple'
    };
    ajax({
        url: '/nccloud/cmp/bankaccountbook/initrestmoneyquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    // this.props.editTable.setAllTableData(this.tableId, data[this.tableId]);
                    this.props.editTable.setTableData(this.tableId, data[this.tableId], false)
                } else {
                    // this.props.editTable.setAllTableData(this.tableId, { rows: [] });
                    this.props.editTable.setTableData(this.tableId, { rows: [] }, false)
                }

            }
        }
    });
};
export function setButtonVisible(props,flag) {
    // let buttontrue = ['Edit','Cancel','Refresh','Save','Exsign'];
    let buttontrue = ['Add',,'Refresh'];
    let buttonfalse = ['Save','Cancel'];
    props.button.setButtonVisible(buttonfalse,!flag);
    props.button.setButtonVisible(buttontrue,flag);
    if (!flag) {
        // 保存取消显示,编辑态
        props.editTable.setStatus(tableId, 'edit', null);
        // props.button.setButtonDisabled(innerbutton,true);
        // props.button.setButtonVisible(innerbutton, false);
    }else{
        // 保存取消不显示,浏览态
        props.editTable.setStatus(tableId, 'browse', null);
        // props.button.setButtonDisabled(innerbutton,false);
    }
}
export function setButtonDisable(props,flag){
    if (flag) {
        flag = true;
    }else{
        flag = false;
    }
    let buttonfalse = ['addLine','audit','antiaudit','print','deleteLine','getin','refresh'];
    props.button.setButtonDisabled(buttonfalse,flag);
}



export function onDelete(props, id, pktsmap, indexarr) {
    let json1 = this.state.json;
    // 没有可以删除的数据，直接返回
    if (!pktsmap || JSON.stringify(pktsmap)=='{}') {
        return;
    }
    ajax({
        url: '/nccloud/cmp/exsign/initrestmoneydeleteline.do',
        data: {
            pktsmap:pktsmap,
        },
        success: function (res) {
            let { success, data } = res;
            if (success) {
                toast({ color: 'success', content: json1['360701OB-000026'] });/* 国际化处理： 删除成功*/
                props.editTable.deleteTableRowsByIndex(tableId, indexarr,true);//直接删除table中的行列
                //props.cardTable.delRowsByIndex(tableId, indexarr);
            } else{
                toast({ color: 'warning', content: json1['360701OB-000027'] });/* 国际化处理： 删除失败，请稍后再试！*/
            }
        }
    });
}
export function onCancel(props) {

    // let data = props.editTable.getCacheDataById(this.tableId);
    // this.props.editTable.setTableData(this.tableId, data,true);
    // let number = props.editTable.getNumberOfRows(this.tableId);
    // props.editTable.deleteTableRowsByIndex(this.tableId, number-1,true) ;
    // let data = props.editTable.getCacheDataById(this.tableId);
    // this.props.editTable.setTableData(this.tableId, data,true);
    // setButtonVisible(this.props,true);
    setButtonVisible(props,true);
    // 取消刷新列表
    initTemplate.bind(this,props);
    this.refreshHtml();
    
    // initTemplate.call(this,this.props);
}

export const constData = {
    // 定义一些常量，用于在js中使用，避免每个地方都定义一个
    // 还未完成
    pagecode: '360701OB_L01',
    moduleid : '360701OB',
    refresh:'refresh',
    deleteLine : 'deleteLine',
    save : 'save',
    addLine : 'addLine',
    audit : 'audit',
    antiaudit : 'antiaudit',
    getin : 'getin',
    print : 'print',
    cancel : 'cancel',

}




/*nWjf/DbQ5IuWIqJbd0fG+Bn7Gi7nn5rolzDju0ST7QyPHJgj0sg00WdeCzH5y8WW*/