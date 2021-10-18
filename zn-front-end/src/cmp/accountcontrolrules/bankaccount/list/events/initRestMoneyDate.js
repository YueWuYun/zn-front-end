/*nWjf/DbQ5IuWIqJbd0fG+Bn7Gi7nn5rolzDju0ST7QyPHJgj0sg00WdeCzH5y8WW*/
//此JS专门处理请求
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast} from 'nc-lightapp-front';

let searchId = 'search';
let tableId = 'pk_bankaccount_table';
let pageId = '36070BACR_L01';
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
    let buttontrue = ['Edit','Exsign','Refresh'];
    let buttonfalse = ['Save','Cancel'];
    props.button.setButtonVisible(buttonfalse,!flag);
    props.button.setButtonVisible(buttontrue,flag);
    if (!flag) {
        // 保存取消显示,编辑态
        props.search.setDisabledByField( searchId, 'pk_org', true);
        props.editTable.setStatus(tableId, 'edit', null);
        // props.button.setButtonDisabled(innerbutton,true);
        // props.button.setButtonVisible(innerbutton, false);
    }else{
        // 保存取消不显示,浏览态
        props.editTable.setStatus(tableId, 'browse', null);
        props.search.setDisabledByField( searchId, 'pk_org', false);
        // props.button.setButtonDisabled(innerbutton,false);
    }
}
export function setButtonDisable(props,flag){
    if (flag) {
        flag = true;
    }else{
        flag = false;
    }
    let buttonfalse = ['Edit','Exsign','Refresh'];
    props.button.setButtonDisabled(buttonfalse,flag);
}
export function setButtonDisablenew(props,type){
    props.button.setButtonDisabled(['Refresh'],false);
    if (type == 1) {
        props.button.setButtonDisabled(['Edit','Exsign'],true);
    }else if(type == 2){
        props.button.setButtonDisabled(['Edit'],true);
        props.button.setButtonDisabled(['Exsign'],false);
    }
    
}
// 设置账户可见性,此方法废弃
export function setAccountVisiable(props){
    let status = props.editTable.getStatus(tableId);
    // if (status == 'edit') {
    //     props.editTable.hideColByKey(tableId, 'pk_account.name');
    //     props.editTable.showColByKey(tableId, 'pk_account');
    // }else{
    //     props.editTable.showColByKey(tableId, 'pk_account.name');
    //     props.editTable.hideColByKey(tableId, 'pk_account');
    // }
}


export function onDelete(props, id, pktsmap, indexarr) {
    let json1 = this.state.json;
    // 没有可以删除的数据，直接返回
    if (!pktsmap || JSON.stringify(pktsmap)=='{}') {
        return;
    }
    ajax({
        url: '/nccloud/cmp/bankaccountbook/initrestmoneydeleteline.do',
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

    let data = props.editTable.getCacheDataById(this.tableId);
    this.props.editTable.setTableData(this.tableId, data,true);
    setButtonVisible(this.props,true);
    // 取消刷新列表
    // this.refreshHtml();
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