/*nWjf/DbQ5IuWIqJbd0fG+Bn7Gi7nn5rolzDju0ST7QyPHJgj0sg00WdeCzH5y8WW*/
//此JS专门处理请求
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast} from 'nc-lightapp-front';
import { SHOW_MODE } from '../../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;

// export function getData(serval) {
    // let pageInfo = this.props.editTable.getTablePageInfo(this.formId);
    // let data = {
    //     conditions: serval,
    //     pageInfo: pageInfo,
    //     pagecode: LIST_PAGECODE,
    //     queryAreaCode: "",  //查询区编码
    //     oid: '1001A81000000001RROD',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    //     queryType: 'simple'
    // };
    // ajax({
    //     url: '/nccloud/cmp/bankaccountbook/initrestmoneyquery.do',
    //     data: data,
    //     success: (res) => {
    //         let { success, data } = res;
    //         if (success) {
    //             if (data) {
    //                 // this.props.editTable.setAllTableData(this.formId, data[this.formId]);
    //                 this.props.editTable.setTableData(this.formId, data[this.formId], false)
    //             } else {
    //                 // this.props.editTable.setAllTableData(this.formId, { rows: [] });
    //                 this.props.editTable.setTableData(this.formId, { rows: [] }, false)
    //             }

    //         }
    //     }
    // });
// };
export function setButtonVisible(props,flag) {
    let btnflag = false;
    props.button.setButtonVisible([
        SAVE_BTN,
        EDIT_BTN,
        CANCEL_BTN
    ],btnflag);
    // let pkorg = props.search.getAllSearchData(SEARCH_CODE);
    let search_org_value = props.search.getSearchValByField(SEARCH_CODE, 'pk_org');//所选组织
    if (search_org_value && search_org_value.value.firstvalue) {
		search_org_value = search_org_value.value.firstvalue;
	} else {
		search_org_value = null;
	}
    if(search_org_value == null){
        props.button.setButtonDisabled(EDIT_BTN, true);
    }else{
        props.button.setButtonDisabled(EDIT_BTN, false);
    }
    if (!flag) {
        // 保存取消显示,编辑态
        props.search.setDisabledByField( SEARCH_CODE, 'pk_org', true);
        props.editTable.setStatus(FORM_BBC_01, 'edit', null);
        props.button.setButtonVisible([
            SAVE_BTN,
            CANCEL_BTN
        ],!btnflag);
    }else{
        // 保存取消不显示,浏览态
        props.editTable.setStatus(FORM_BBC_01, 'browse', null);
        props.search.setDisabledByField( SEARCH_CODE, 'pk_org', false);
        props.button.setButtonVisible([
            EDIT_BTN,
        ],!btnflag);
    }
}

export function onCancel(props) {

    // let data = props.form.getCacheDataById(this.formId);
    // this.props.editTable.setTableData(this.formId, data,true);
    let data = props.form.getAllFormValue(this.formId);
    this.props.form.setAllFormValue({ [this.formId]: data });
    this.props.form.setFormStatus(this.formId, 'browse');
    setButtonVisible(this.props,true);
    // 取消刷新列表
    this.refreshHtml();
}

export const constData = {
    // 定义一些常量，用于在js中使用，避免每个地方都定义一个
    // 还未完成
    pagecode: LIST_PAGECODE,
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