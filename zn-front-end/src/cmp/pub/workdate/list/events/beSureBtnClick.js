/*WrbLUtJ8+de1MOubvwoPqrc5tgsnyZ0+nNwmfN/5mJTeXsqIiyirxD3HkisWze2X*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, ajax , toast} from 'nc-lightapp-front';

let { NCPopconfirm, NCIcon, NCMessage } = base;
const { NCDatePicker } = base;

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode 
} from '../../cons/constant.js';

export default function beSureBtnClick(props, id, record) {
    switch (id) {
        // 查询工作日志确认
        case 'queryworklogConfirm':
            if(this.state.startdate === null){
                NCMessage.create({content: '请选择开始日期', color: 'danger', position: 'top'});
            }else if(this.state.enddate === null){
                NCMessage.create({content: '请选择结束日期', color: 'danger', position: 'top'});
            }else{
                ajax({
                    url: '/nccloud/fts/workdate/querylog.do',
                    data: {
                        pk_org: record.pk_org,
                        startdate: this.state.startdate,
                        enddate: this.state.enddate,
                    },
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                props.table.setAllTableData(list_table_id, data[list_table_id]);
                            }else{
                                props.table.setAllTableData(list_table_id, {rows:[]});
                            }
                        }
                    }
                });
            }
            break;
        // 第一次受理日期确认
        case 'firststartsettleConfirm':
            if(this.state.startworkdate === null){
                NCMessage.create({content: '第一次办理请选择日期', color: 'danger', position: 'top'});
            }else{
                ajax({
                    url: '/nccloud/fts/workdate/startsettleConfirm.do',
                    data: {
                        pk_org: record.pk_org,
                        startworkdate: this.state.startworkdate,
                    },
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                toast({ color: 'success', content: '开始受理成功' });
                                this.props.table.setAllTableData(list_table_id, data[list_table_id]);
                            }else{
                                this.props.table.setAllTableData(list_table_id, {rows:[]});
                            }
                        }
                    }
                });
            }
            break;
        // 开始受理确认
        case 'startsettleConfirm':
            ajax({
                url: '/nccloud/fts/workdate/startsettleConfirm.do',
                data: {
                    pk_org: record.pk_org,
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            toast({ color: 'success', content: '开始受理成功' });
                            this.props.table.setAllTableData(list_table_id, data[list_table_id]);
                        }else{
                            this.props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                    }
                }
            });
            break;
        // 结束受理
        case 'endsettleConfirm':
            ajax({
                url: '/nccloud/fts/workdate/endsettleConfirm.do',
                data: {
                    pk_org: record.pk_org && record.pk_org.value,
                    pk_calendar:record.pk_calendar && record.pk_calendar.value,
                    ts: record.ts && record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            toast({ color: 'success', content: '结束受理成功' });
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        }else{
                            props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                    }
                }
            });
            break;
        // 恢复受理确认
        case 'unendsettleConfirm':
            ajax({
                url: '/nccloud/fts/workdate/unendsettleConfirm.do',
                data: {
                    pk_org: record.pk_org && record.pk_org.value,
                    pk_calendar:record.pk_calendar && record.pk_calendar.value,
                    ts: record.ts && record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            toast({ color: 'success', content: '恢复受理成功' });
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        }else{
                            props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                    }
                }
            });
            break;
        // 日结确认
        case 'dailybalConfirm':
            ajax({
                url: '/nccloud/fts/workdate/dailybalConfirm.do',
                data: {
                    pk_org: record.pk_org && record.pk_org.value,
                    pk_calendar:record.pk_calendar && record.pk_calendar.value,
                    ts: record.ts && record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            toast({ color: 'success', content: '日结成功' });
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        }else{
                            props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                    }
                }
            });
            break;
        // 取消日结确认
        case 'canceldailybalConfirm':
            ajax({
                url: '/nccloud/fts/workdate/canceldailybalConfirm.do',
                data: {
                    pk_org: record.pk_org && record.pk_org.value,
                    pk_calendar:record.pk_calendar && record.pk_calendar.value,
                    ts: record.ts && record.ts.value
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            toast({ color: 'success', content: '取消日结成功' });
                            props.table.setAllTableData(list_table_id, data[list_table_id]);
                        }else{
                            props.table.setAllTableData(list_table_id, {rows:[]});
                        }
                    }
                }
            });
            break;
    }
}

/*WrbLUtJ8+de1MOubvwoPqrc5tgsnyZ0+nNwmfN/5mJTeXsqIiyirxD3HkisWze2X*/