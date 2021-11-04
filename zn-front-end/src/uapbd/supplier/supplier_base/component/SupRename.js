//tVlLn/hg3NcQ70uXJ7jtb8yG+RygRUSFJTmb46U2fjsjkd+vr/7BQOKpjzpuEuiC
import React, { Component } from 'react';
import { ajax, toast, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import { multiLevelManage, showFormulaSetting, validateFormulaSetting } from "../utils/SupplierUtils";
import confirmUtils from '../../../public/pubComponent/confirmUtil/confirmUtil';
import './Common.less'
/**
 * 供应商地址簿
 * @constructor
 */
export default class SupRename extends Component {
    constructor(props) {
        super(props);
        var me = this;
        this.state = {
            ...this.props,
            urls: {
                saveSupAddressUrl: '/nccloud/uapbd/suprename/save.do',
                querySupRenameURL: '/nccloud/uapbd/suprename/query.do'
            },
            buttonApps: {
                area: 'suprename',
                buttonLimit: 3,
                onButtonClick: this.onSupRenameButtonClick.bind(this),
            },
            table: {
                tableId: 'suprename',
                tableName: this.props.Lang['10140SUG-000234'],/* 国际化处理： 供应商更名记录*/
                action: {
                    onRowClick: this.onRowClick,
                    onSelected: this.onSelected,
                    onSelectedAll: this.onSelectedAll,
                    showIndex: true,
                    showCheck: true
                }
            },
            currentRecord: null,
            currentRowIndex: -1,
            browseBtns: ['renameEdit', 'renameRefresh'],
            editBtns: ['renameSave', 'renameCancel']
        };
        props.button.setButtonVisible(this.state.browseBtns, true);
        props.button.setButtonVisible(this.state.editBtns, false);
        props.button.setMainButton('renameAdd', true);
        this.gridId = 'suprename';
    }


    initData = () => {
        let meta = this.props.meta.getMeta();
        this.props.meta.setMeta(meta, this.loadCustRenameGrid.bind(this, this.props, () => {
            this.props.button.setButtonDisabled(['renameDelete'], true);
        }))
        this.updateButtons(this.props, 'browse');
    }


    //加载客户地址信息
    loadCustRenameGrid = (props, callback) => {
        ajax({
            url: this.state.urls.querySupRenameURL,
            data: { pk_supplier: this.state.pk_supplier },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.button.setButtonDisabled(['renameEdit'], false);
                        this.props.editTable.setTableData(this.gridId, data[this.gridId]);
                        callback && callback.call(this, data[this.gridId].rows);
                    } else {
                        this.props.button.setButtonDisabled(['renameEdit'], true);
                        this.props.editTable.setTableData(this.gridId, { rows: [] });
                        callback && callback.call(this, []);
                    }

                    this.props.button.setButtonDisabled(['renameDelete'], true);


                } else {
                    toast({ color: 'danger', 'title': this.props.Lang['10140SUG-000235'] });
                    /* 国际化处理： 查询出错！*/
                    this.props.editTable.setTableData(this.gridId, { rows: [] });

                }
            }
        });

    }

    onRowClick = (props, moduleId, record, index, e) => {
         
        this.state.currentRecord = record;
        this.setState(this.state);

    }
    onSelected = (props, moduleId, record, index, status) => {
         
        this.setState({currentRecord:record});
        props.editTable.selectAllRows(this.gridId, false);
        if(this.state.currentRowIndex == index){
            props.editTable.selectTableRows(this.gridId, index, status);
        } else {
            props.editTable.selectTableRows(this.gridId, index, true);
        }
        this.state.currentRowIndex = index;
        let gridcheckrows = props.editTable.getCheckedRows(this.gridId);
        
        this.props.button.setButtonDisabled(['renameDelete'], gridcheckrows.length === 0 || 
         !(record.values.source.value === '7' ||  record.values.source.value === '2') );//只有手动直接新增的数据或者申请单修改不的数据才可以删除
    }
    onSelectedAll = (props, moduleId, status, length) => {
        props.editTable.selectAllRows(this.gridId, false);
    }

    /**
     * 设置供应商主键 并加载供应商发货地址数据
     * @param pk_supplier
     */
    setPk_supplier = (pk_supplier) => {
        this.props.editTable.setTableData(this.state.table.tableId, { rows: [] });
        this.setState({ pk_supplier: pk_supplier }, () => {
            this.initData()
        })
    }
   



    updateButtons = (props, flag) => {
        props.button.setMainButton('renameAdd', flag === 'browse');
        props.button.setMainButton('renameSave', flag !== 'browse');
        props.button.setButtonVisible(this.state.browseBtns, flag === 'browse' ? true : false);
        props.button.setButtonVisible(this.state.editBtns, flag === 'edit' || flag === 'add' ? true : false);
        props.button.setButtonVisible([ 'renameDelete'], flag === 'browse');
        props.button.setButtonVisible([ 'renameAdd'],flag === 'edit' || flag === 'add' ? false : true);
        props.editTable.setStatus(this.gridId, flag);
    }

    getCurrentDate(_this) {
        var date = new Date();
        var seperator1 = "-";
        var zero_time = " 00:00:00";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + zero_time;
        return currentdate;
    }

    onSupRenameButtonClick = (props, id) => {
         debugger
        switch (id) {
            case'renameAdd':
                var curDate = this.getCurrentDate(this);
               
                let rowsNums = props.editTable.getNumberOfRows(this.gridId) ;
                let arr = [];
                for(var i= 0; i < rowsNums; i++){
                    arr.push(i);
                }
                props.editTable.addRow(this.gridId, undefined, true, undefined);
                this.updateButtons(props, 'edit');
                props.editTable.setEditableRowByIndex(this.gridId, arr, false);
                props.editTable.setValByKeyAndIndex(this.gridId,arr.length,'begindate',{value: curDate, display:curDate });
                break;
            case'renameEdit':
                let row = props.editTable.getCheckedRows(this.gridId);
                if(row.length == 0){
                    toast({'color': 'warning', 'title':this.props.Lang['10140SUG-000236']} );//请选择一行数据进行操作
                    return ;
                }
                let num = props.editTable.getNumberOfRows(this.gridId) ;
                num !== 0 && this.updateButtons(props, 'edit');
                let arr_edit = [];
                for(var i= 0; i < num; i++){
                    if(row[0].index == i) {
                        continue;
                    }
                    arr_edit.push(i);
                }
                //非选中行都不可以编辑
                props.editTable.setEditableRowByIndex(this.gridId, arr_edit, false);
                // index的生效日期不可以编辑
                if(this.state.currentRecord.values.source.value === '7' || this.state.currentRecord.values.source.value === '2') {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'begindate', true); //直接新增或者申请单修改的数据生效日期可以编辑
                }else {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'begindate', false);
                }
                if(this.state.currentRecord.values.source.value === '6'){
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'supname', false) ; //客商关联的数据名称不可以编辑
                } else {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'supname', true); 
                }
                break;
            case'renameDelete':
                let gridStatus = props.editTable.getStatus(this.gridId);
                let gridcheckrows = props.editTable.getCheckedRows(this.gridId);
                let deleteIndex = [];
                let deleteRows = [];
                if (gridcheckrows.length === 0) {
                    toast({'color': 'warning', 'title': this.props.Lang['10140SUG-000236']});
                    /* 国际化处理： 请选择一行数据进行操作*/
                    return;
                }
                gridcheckrows.map((obj) => {
                    deleteIndex.push(obj.index);
                    if(gridStatus != 'edit'){
                        //如果不是编辑态删除需要手动设置record的status
                        obj.data.status = 3;
                    }
                     deleteRows.push(obj.data);
                });
                gridStatus === 'edit' ?
                    props.editTable.deleteTableRowsByIndex(this.gridId, deleteIndex, false) :
                    confirmUtils.call(this, {
                        title: this.props.Lang['10140SUG-000170'], /* 国际化处理： 确认删除*/
                        content: this.props.Lang['10140SUG-000237'], /* 国际化处理： 确定删除该条记录？*/
                        beSureBtnName:this.props.Lang['beSureBtnName-001'],
                        cancelBtnName:this.props.Lang['cancelBtnName-001'],
                        beSureBtnClick: () => {
                            ajax({
                                url: this.state.urls.saveSupAddressUrl,
                                data: {
                                    gridmodel: {
                                        rows: deleteRows
                                    }
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        if (data) {
                                            this.loadCustRenameGrid(this.props);
                                            this.updateButtons(this.props, 'browse');
                                            toast({'color': 'success', 'title': this.props.Lang['10140SUG-000073']});
                                            /* 国际化处理： 删除成功！*/
                                        }
                                    }
                                }
                            });
                        }
                    });
                break;
            case'renameRefresh':
                this.loadCustRenameGrid(props, () => {
                    toast({
                        color: 'success',
                        title: this.props.Lang['10140SUG-000200']/* 国际化处理： 刷新成功！*/
                    })
                });
                break;
            case'renameSave':
                const me = this;
                let allgriddataBefore = props.editTable.getChangedRows(me.gridId);
                let flag = props.editTable.checkRequired(me.gridId, allgriddataBefore);
                if (!flag) {
                    return;
                }
                let allgriddata = [];
                allgriddataBefore.map((r) => {
                    allgriddata.push(r);
                });
                allgriddata.length === 0 || ajax({
                    url: me.state.urls.saveSupAddressUrl,
                    data: {
                        gridmodel: {rows: allgriddata},
                        userjson:  me.state.pk_supplier
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            if (data) {
                                me.updateButtons(this.props, 'browse');
                                me.loadCustRenameGrid(this.props, () => {
                                    toast({'color': 'success', 'title': this.props.Lang['10140SUG-000069']});
                                    /* 国际化处理： 保存成功！*/
                                });

                            }
                        }
                    }
                });
                if (allgriddata.length === 0) {
                    me.loadCustRenameGrid(this.props, () => {
                        me.updateButtons(this.props, 'browse');
                        toast({'color': 'success', 'title': this.props.Lang['10140SUG-000069']});
                        /* 国际化处理： 保存成功！*/
                    });
                }
                break;
            case'renameCancel':
                confirmUtils.call(this, {
                    title: this.props.Lang['10140SUG-000238'], /* 国际化处理： 确认取消*/
                    content: this.props.Lang['10140SUG-000239'], /* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: () => {
                        props.editTable.cancelEdit(this.gridId, () => {
                            props.editTable.filterEmptyRows(this.gridId);
                        });
                        this.updateButtons(props, 'browse');
                    }
                });
                break;
        }
    }

    render() {
        let { editTable, button } = this.props;
        const { createEditTable } = editTable;
        const { createButtonApp } = button;
        return (

            <div className="nc-single-table">
                <div className="nc-singleTable-header-area">
                    <div className="header-button-area">
                        {createButtonApp(this.state.buttonApps)}
                    </div>
                </div>
                <div className="nc-singleTable-table-area">
                    {createEditTable(this.state.tableId, this.state.table.action)}
                </div>
            </div>
        )
    }
}




//tVlLn/hg3NcQ70uXJ7jtb8yG+RygRUSFJTmb46U2fjsjkd+vr/7BQOKpjzpuEuiC