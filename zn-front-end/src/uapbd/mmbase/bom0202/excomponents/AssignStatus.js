//7Xgw5KfeOXaYA8mGoOfrSRa0seM0lFtQQSEvrqbx441p3xcZtzwFWsYip4zNvmkd
import React, { Component } from 'react';
import {ajax, base } from 'nc-lightapp-front';

import './AssignStatus.less';
function modifierMeta(props,callback){
    let pk_material = props.AssignStatusConfig.pk_material;
    ajax({
        url : "/nccloud/uapbd/material/queryAssignStatus.do",
        data : {pk_material : pk_material},
        success : (res) => {
            let{success,data} = res;
            let meta = props.meta.getMeta();
            let _marog_meta = meta['assignstatus'];
            Object.keys(data.tabMap).forEach((item)=>{
                _marog_meta.items.forEach((i,index) => {
                    if(i.attrcode === item){
                        _marog_meta.items[index].label = data.tabMap[item];
                    }
                });
            });
            props.meta.addMeta(meta);
            setTimeout(() => {
                var cb = callback || function(){};
                cb(res);
            }, 10);
        }
    });
    
}

const tableid = 'assignstatus';


class AssignStatus extends Component {
    constructor(props) {
        super(props);
        this.config = props.AssignStatusConfig;
        this.state = {
            material_code : '',
            material_name : ''
        }
        this.props.button.setDisabled({
            AssignStatus_enable : true,
            AssignStatus_disable : true
        });
        modifierMeta(props,this.getData);
    }

    getData = (res) => {
        let {data} = res;
        this.setState({
            material_code:data.material.code,
            material_name:data.material.name
        });
        if(data.grid){
            let tableData = data.grid.assignstatus;
            if(tableData.rows){
                let relationMap = data.relationMap;
                tableData.rows.forEach((item,index)=>{
                    let pk_marorg = item.values['pk_marorg'].value;
                    if(relationMap[pk_marorg]){
                        let atrrMap = relationMap[pk_marorg].atrrMap;
                        Object.keys(atrrMap).forEach((it)=>{
                            if(it !== 'pk_material'){
                                tableData.rows[index].values[it] = {value:true,display:'是'};
                            }
                        });
                    }
                });
            }
            this.props.editTable.setTableData('assignstatus',tableData);
        }

    }

    onButtonClick = (props,id) => {
        switch(id){
            case 'AssignStatus_enable':
                let checkedData = this.props.editTable.getClickRowIndex(tableid);
                if(checkedData.length < 1) return;
                let rows = [];
                let row = {
                    rowId : checkedData.record.rowid,
                    status : '2',
                    values : checkedData.record.values
                };
                rows.push(row);
                ajax({
                    url : '/nccloud/uapbd/material/assignStatusEnable.do',
                    data : {
                        pageid : '10140MASTAT_marorg',
                        model : {
                            areaType : 'table',
                            pageinfo : null,
                            rows : rows
                        }
                    },
                    success : (res) => {
                        modifierMeta(this.props,this.getData);
                        this.props.button.setDisabled({
                            AssignStatus_enable : true,
                            AssignStatus_disable : true
                        });
                    }
                });
                break;
            case 'AssignStatus_disable':
                checkedData = this.props.editTable.getClickRowIndex(tableid);
                if(checkedData.length < 1) return;
                rows = [];
                row = {
                    rowId : checkedData.record.rowid,
                    status : '2',
                    values : checkedData.record.values
                };
                rows.push(row);
                ajax({
                    url : '/nccloud/uapbd/material/assignStatusDisable.do',
                    data : {
                        pageid : '10140MASTAT_marorg',
                        model : {
                            areaType : 'table',
                            pageinfo : null,
                            rows : rows
                        }
                    },
                    success : (res) => {
                        modifierMeta(this.props,this.getData);
                        this.props.button.setDisabled({
                            AssignStatus_enable : true,
                            AssignStatus_disable : true
                        });
                    }
                });
                break;
        }
    }

    selectedChange = (props, moduleId, record, index,e) => {
        //props, moduleId(区域id), record（行数据）, index（当前index）,e (事件对象)
        let selectedData = this.props.editTable.getClickRowIndex(tableid);
        if(selectedData.length < 1){
            this.props.button.setDisabled({
                AssignStatus_enable : true,
                AssignStatus_disable : true
            });
        }else{
            let enablestate = selectedData.record.values.enablestate.value;
        if(enablestate === '2'){
            this.props.button.setDisabled({
                AssignStatus_enable : true,
                AssignStatus_disable : false
            });
        }else{
            this.props.button.setDisabled({
                AssignStatus_enable : false,
                AssignStatus_disable : true
            });
        }
        }
    }


    render () {
        let {editTable} = this.props;
        let { createEditTable } = editTable;
        let {NCInput,NCCol,NCRow} = base;
        return (
            <div>
                <div className="header-button-area" style={{display: 'flex',justifyContent: 'right'}}>
                    <div>
                        {this.props.button.createButtonApp({
                                area: 'AssignStatus',
                                buttonLimit: 3, 
                                onButtonClick: this.onButtonClick, 
                                popContainer: document.querySelector('.header-button-area')
        
                        })}
                    </div>
                </div>
                <div className="top-area">
                    <NCRow md={12} xs={12} sm={12}>
                        <NCCol md={2} xs={2} sm={2} className="formLabel top-label">
                            {this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000073')/* 国际化处理： 物料编码*/}
                        </NCCol>
                        <NCCol md={4} xs={4} sm={4} className="formLabel top-label" style={{'textAlign':'left'}}>
                            {this.state.material_code}
                        </NCCol>
                        <NCCol md={2} xs={2} sm={2} className="formLabel top-label">
                            {this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000072')/* 国际化处理： 物料名称*/}
                        </NCCol>
                        <NCCol md={4} xs={4} sm={4} className="formLabel top-label" style={{'textAlign':'left'}}>
                            {this.state.material_name}
                        </NCCol>
                    </NCRow>
                </div>
                <div>
                    {createEditTable(tableid, {//列表区
                        useFixedHeader:true,    
                        showIndex:true,
                        showCheck:false,
                        onRowClick : this.selectedChange
                    })}
                </div>
            </div>
        );
    }
}

export default AssignStatus;
//7Xgw5KfeOXaYA8mGoOfrSRa0seM0lFtQQSEvrqbx441p3xcZtzwFWsYip4zNvmkd