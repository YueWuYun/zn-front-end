//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast, getBusinessInfo} from 'nc-lightapp-front';
import Utils from '../../../public/utils/index';

const {queryToastFunc} = Utils;
import confirmUtils from '../../../public/pubComponent/confirmUtil/confirmUtil';

/**客户更名记录 */
export default class CustRename extends Component {


    constructor(props) {
        super(props);
        this.state = {
            browseBtns: ['renameEdit', 'renameRefresh'],
            editBtns: ['renameSave', 'renameCancel'],
            currentRecord: null,
            currentRowIndex: -1,
            currentCustPk: props.currentCustPk,
            json: props.json
        }
        props.button.setButtonVisible(this.state.browseBtns, true);
        props.button.setButtonVisible(this.state.editBtns, false);
        props.button.setMainButton('renameAdd', true);
        this.gridId = props.config.custRename;
    }
    componentDidMount() {
        this.initData()
    }
    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    initData =() => {
        let meta = this.props.meta.getMeta();
        this.props.meta.setMeta(meta, this.loadCustRenameGrid.bind(this, this.props, () => {
            this.props.button.setButtonDisabled(['renameDel'], true);
        }))
        this.updateButtons(this.props,'browse');
    }

    updateButtons = (props, flag) => {
        props.button.setMainButton('renameAdd', flag === 'browse');
        props.button.setMainButton('renameSave', flag !== 'browse');
        props.button.setButtonVisible(this.state.browseBtns, flag === 'browse' ? true : false);
        props.button.setButtonVisible(this.state.editBtns, flag === 'edit' || flag === 'add' ? true : false);
        props.button.setButtonVisible([ 'renameDel'], flag === 'browse');
        props.button.setButtonVisible([ 'renameAdd'],flag === 'edit' || flag === 'add' ? false : true);
        props.editTable.setStatus(this.gridId, flag);
    }
    //加载客户地址信息
    loadCustRenameGrid = (props, callback) => {
        ajax({
            url: '/nccloud/uapbd/custrename/custrenamequery.do',
            data: {
                pk: this.state.currentCustPk,
                pagecode: props.config.pagecode,
                areacode: 'custrename'
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        this.props.button.setButtonDisabled(['renameEdit'], false);
                        this.props.editTable.setTableData(this.gridId, data[this.gridId]);
                        callback && callback.call(this, data[this.gridId].rows);
                    } else {
                        this.props.button.setButtonDisabled(['renameEdit'], true);
                        this.props.editTable.setTableData(this.gridId, {rows: []});
                        callback && callback.call(this, []);
                    }

                    this.props.button.setButtonDisabled(['renameDel'], true);


                } else {
                    toast({color: 'danger', 'title': this.state.json['10140CUST-000033']});
                    /* 国际化处理： 查询出错！*/
                    this.props.editTable.setTableData(this.gridId, {rows: []});

                }
            }
        });

    }

    //客户更名模态框按钮事件（写出了java代码的感觉。。。）
    custRenameModalBtn = (props, id) => {
         
        switch (id) {
            case'renameAdd':
                let rowsNums = props.editTable.getNumberOfRows(this.gridId) ;
                let arr = [];
                for(var i= 0; i < rowsNums; i++){
                    arr.push(i);
                }
                props.editTable.addRow(this.gridId, undefined, true, undefined);
                this.updateButtons(props, 'edit');
                props.editTable.setEditableRowByIndex(this.gridId, arr, false);
                break;
            case'renameEdit':
                let row = props.editTable.getCheckedRows(this.gridId);
                if(row.length == 0){
                    toast({'color': 'warning', 'title':'请选择一行数据进行操作'} );//this.state.json['10140CUST-000019']}
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
                if(this.state.currentRecord.values.source.value === '6') {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'begindate', true); //直接新增的数据生效日期可以编辑
                }else {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'begindate', false);
                }
                if(this.state.currentRecord.values.source.value === '5'){
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'custname', false) ; //客商关联的数据名称不可以编辑
                } else {
                    props.editTable.setEditableRowKeyByIndex(this.gridId, row[0].index, 'custname', true); 
                }
                break;
            case'renameDel':
                let gridStatus = props.editTable.getStatus(this.gridId);
                let gridcheckrows = props.editTable.getCheckedRows(this.gridId);
                let deleteIndex = [];
                let deleteRows = [];
                let cantdeleRows = [];
                let cantdeleteIndex = [];
                if (gridcheckrows.length === 0) {
                    toast({'color': 'warning', 'title': this.state.json['10140CUST-000019']});
                    /* 国际化处理： 请选择数据操作！*/
                    return;
                }
                gridcheckrows.map((obj) => {
                    if (this.props.actionName === 'subGrid5Addr' &&
                        (obj.data.values.pk_org.value === obj.data.values.pk_group.value ||
                            obj.data.values.pk_org.value === getBusinessInfo().groupId)) {
                        cantdeleteIndex.push(obj.index + 1);
                    } else {
                        deleteIndex.push(obj.index);
                       if(gridStatus != 'edit'){
                           //如果不是编辑态删除需要手动设置record的status
                           obj.data.status = 3;
                       }
                        deleteRows.push(obj.data);
                    }
                });
                if (cantdeleteIndex.length !== 0) {
                    toast({
                        color: 'warning',
                        content: this.state.json['10140CUST-000182'] + cantdeleteIndex + this.state.json['10140CUST-000183']
                    });
                    return;
                }
                gridStatus === 'edit' ?
                    props.editTable.deleteTableRowsByIndex(this.gridId, deleteIndex, false) :
                    confirmUtils.call(this, {
                        title: this.state.json['10140CUST-000034'], /* 国际化处理： 确认删除*/
                        content: this.state.json['10140CUST-000035'], /* 国际化处理： 确定删除该条记录？*/
                        beSureBtnClick: () => {
                            ajax({
                                url: '/nccloud/uapbd/custrename/custrenamesave.do',
                                data: {
                                    pageid: props.config.pagecode,
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
                                            toast({'color': 'success', 'title': this.state.json['10140CUST-000036']});
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
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
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
                    url: '/nccloud/uapbd/custrename/custrenamesave.do',
                    data: {
                        pageid: props.config.pagecode,
                        gridmodel: {rows: allgriddata},
                        userjson: me.state.currentCustPk
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            if (data) {
                                me.updateButtons(this.props, 'browse');
                                me.loadCustRenameGrid(this.props, () => {
                                    toast({'color': 'success', 'title': this.state.json['10140CUST-000037']});
                                    /* 国际化处理： 保存成功！*/
                                });

                            }
                        }
                    }
                });
                if (allgriddata.length === 0) {
                    me.loadCustRenameGrid(this.props, () => {
                        me.updateButtons(this.props, 'browse');
                        toast({'color': 'success', 'title': this.state.json['10140CUST-000037']});
                        /* 国际化处理： 保存成功！*/
                    });
                }
                break;
            case'renameCancel':
                confirmUtils.call(this, {
                    title: this.state.json['10140CUST-000038'], /* 国际化处理： 确认取消*/
                    content: this.state.json['10140CUST-000039'], /* 国际化处理： 是否确认要取消？*/
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
        
        this.props.button.setButtonDisabled(['renameDel'], gridcheckrows.length === 0 ||  record.values.source.value !== '6');//只有手动直接新增的数据才可以删除
    }
    onSelectedAll = (props, moduleId, status, length) => {
        props.editTable.selectAllRows(this.gridId, false);
    }

    render() {
        const {button, editTable} = this.props;
        const {createButtonApp} = button;
        const {createEditTable} = editTable;
        return (
            <div className="">
                <div className="">
                    <div>
                        <div className="header-button-area" id="RenameModal-button-area"
                             style={{textAlign: 'right', marginBottom: '8px'}}>
                            {createButtonApp({
                                area: 'RenameModal-button-area',
                                onButtonClick: this.custRenameModalBtn,
                                popContainer: document.querySelector('#header-button-area')
                            })}
                        </div>
                    </div>
                    {/* 列表区 */}
                    <div className="nc-singleTable-table-area">
                        {createEditTable(this.gridId, {
                            // onBeforeEvent: this.onBeforeEvent,
                            // onAfterEvent: this.onAfterEvent,
                            onRowClick: this.onRowClick,
                            onSelectedAll: this.onSelectedAll,
                            onSelected: this.onSelected,
                            showIndex: true,
                            showCheck: true
                        })}
                    </div>
                </div>
            </div>
        );
    }
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65