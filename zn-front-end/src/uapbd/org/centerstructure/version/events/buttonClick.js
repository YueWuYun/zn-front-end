//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { listCreate, listRefresh } from './listOperator';
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import {CARD, DATASOURCE, LIST, LIST_BUTTON, PRIMARTKEY, CARD_BUTTON, REQUESTURL} from '../../constant';
import {cardCreate} from "../../card/events";
import CostcenterGRP from "../../../costcentergrp/main";
import React from "react";
import {listDelete} from "../../list/events/listOperator";
import {buttonVisibilityControl} from "../events/buttonVisibilityControl";

//列表头部按钮操作
export function buttonClick(props, id, text, record, index) {
	switch (id) {
		//新增
		case CARD_BUTTON.addrow:
            let num = props.editTable.getNumberOfRows(CARD.version_table); //获取列表总行数
            let datas=  props.editTable.getAllData(CARD.version_table);
            let values = datas.rows[datas.rows.length-1].values;
            values[PRIMARTKEY.head_id].value=null;
            values["vname"].value=null;
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            values["vno"].value=`${year}${month<10?`0${month}`:`${month}`}${date}`;
            values["vstartdate"].value=`${year}${`-`}${month<10?`0${month}`:`${month}`}${`-`}${date}`;
            values["venddate"].value="9999-12-12";
            props.editTable.addRow(CARD.version_table,num,true,values);
            props.setUrlParam({
                status: 'edit'
            });
            buttonVisibilityControl(props);
			break;
        //删除
		case CARD_BUTTON.delrow:
            let checkedRows=  props.editTable.getAllData(CARD.version_table);
            let pk=checkedRows.rows[checkedRows.rows.length-1].values[PRIMARTKEY.head_id].value;
            ajax({
                url: REQUESTURL.delete,
                data: { pks: [pk] },
                success: (res) => {
                    if (res.success) { //成功
                        props.editTable.deleteTableRowsByIndex(CARD.version_table, checkedRows.rows.length-1);
                        toast({ color: 'success', content: props.json['10100CCS-000005'] });/* 国际化处理： 删除成功*/
                    } else { //失败
                        toast({ color: 'warning', content: props.json['10100CCS-000009'] });/* 国际化处理： 删除失败*/
                    }
                }
            });

			break;

        //修改
        case CARD_BUTTON.updaterow:
            props.setUrlParam({
                status: 'edit'
            });
            buttonVisibilityControl(props);
            let allRows = props.editTable.getAllRows(CARD.version_table);
            for (let i = 0; i < allRows.length; i++) {
                props.editTable.setEditableRowByRowId(CARD.version_table, allRows[i].rowid, false);
            }
            let checkedRows1=  props.editTable.getAllData(CARD.version_table);
            let rowids=checkedRows1.rows[checkedRows1.rows.length-1].rowid;
            props.editTable.setEditableByKey(CARD.version_table, rowids,'vname', true);
            props.editTable.setEditableByKey(CARD.version_table, rowids, 'vstartdate', true);
            break;

        //保存
        case CARD_BUTTON.saverow:
            let tableData = props.editTable.getChangedRows(CARD.version_table);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
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
                        props.setUrlParam({
                            status: 'browse'
                        });
                        buttonVisibilityControl(props);
                    }
                }
            });
            // props.editTable.setStatus(CARD.version_table, 'browse');

            break;
        default:
            break;


    }
}
//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS