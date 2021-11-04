//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { listCreate, listRefresh } from './listOperator';
import { ajax, cardCache, toast,print } from 'nc-lightapp-front';
import {CARD, DATASOURCE, LIST, LIST_BUTTON, PRIMARTKEY, REQUESTURL, SEARCHCACHE} from '../../constant';
import {cardCreate} from "../../card/events";
import CostcenterGRP from "../../../costcentergrp/main";
import React from "react";
import Version from "../../version";
import VersionCARD from "../../card";
import {pkname} from "../../../../fiacc/costcompstruc/list/constants";
import { buttonVisibilityControl } from './buttonVisibilityControl';

//列表头部按钮操作
export function buttonClick(props, id, text, record, index) {
	switch (id) {
		//新增
		case LIST_BUTTON.create:
            props.setUrlParam({
                status: 'edit'
            });
            buttonVisibilityControl(props);
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();

            let datas=  props.editTable.getAllData(LIST.table_id);
            let length = datas.rows.length;
                datas={
                    pk_group:"",
                    vname:{ value:"初始版本"},
                    vno:{ value:`${year}${month<10?`0${month}`:`${month}`}${date}`},
                    vstartdate:{ value:`${year}${`-`}${month<10?`0${month}`:`${month}`}${`-`}${date}`},
                    venddate:{ value:"9999-12-12"},
                };
                props.editTable.addRow(LIST.table_id,length,true,datas);
			break;

		case LIST_BUTTON.refresh:
			listRefresh(props);
			break;

        //头部 版本化
        case LIST_BUTTON.vcard:
            let pageInfo = props.editTable.getTablePageInfo(LIST.table_id);
            props.search.clearSearchArea( LIST.search_id );
            let checkedRows = props.editTable.getCheckedRows(LIST.table_id);
            if(checkedRows.length<1){
                return;
            }
            let codevalue = checkedRows[0].data.values["code"];
            props.search.setSearchValByField( LIST.search_id,"code", {value:codevalue.value,display:''});
            let queryInfo = props.search.getQueryInfo(LIST.search_id);
            queryInfo.pageInfo = pageInfo;
            queryInfo.pageCode = LIST.page_code;
            ajax({
                url: REQUESTURL.queryList,
                data: queryInfo,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        props.modal.show('version',{
                            title : "版本化",/* 国际化处理： 成本中心组*/
                            content : <Version json={""} config={data}/>
                        });
                    }
                }
            });
            break;

        //头部 保存
        case LIST_BUTTON.Save:

            let tableData = props.editTable.getChangedRows(LIST.table_id);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
            if(tableData.length<1){
                return;
            }
            let data = {
                pageid:LIST.page_code,
                model : {
                    areaType: "table",
                    areacode:LIST.table_id,
                    pageinfo: null,
                    rows: []
                }
            };
            data.model.rows = tableData;

            ajax({
                    url: REQUESTURL.save,
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            toast({ color: 'success', content: props.json['36660FMC-000004'] });/* 国际化处理： 保存成功*/
                        }
                    }
                });

            props.editTable.setStatus(LIST.table_id, 'browse');
            props.setUrlParam({
                status: 'browse'
            });
            buttonVisibilityControl(props);
            break;
        case LIST_BUTTON.cancel:
            props.editTable.cancelEdit(LIST.table_id);
            props.setUrlParam({
                status: 'browse'
            });
            buttonVisibilityControl(props);
            break;
        case LIST_BUTTON.print:
            // let pks = [this.state.pk_psnbankacc];
            // let param = {
            //     funcode: this.appId,
            //     nodekey: 'psnbankacccard',  //模板节点标识
            //     oids: pks
            // };
            // print(
            //     'pdf',
            //     this.ajaxurl['cardPrint'],
            //     param
            // );
        default:
            break;
    }
}
//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS