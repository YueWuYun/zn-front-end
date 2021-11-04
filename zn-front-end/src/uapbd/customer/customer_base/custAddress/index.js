//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast, getBusinessInfo} from 'nc-lightapp-front';
import Utils from '../../../public/utils/index';

const {queryToastFunc} = Utils;
import confirmUtils from '../../../public/pubComponent/confirmUtil/confirmUtil';

export default class CustAddress extends Component {


    constructor(props) {
        super(props);
        this.state = {
            browseBtns: ['addModalEdit', 'addModalRef'],
            editBtns: ['addModalSave', 'addModalCancel'],
            linkmanRefer: {
                refcode: 'uapbd/refer/customer/RefLinkmanComp/index',
                linkmanReferId: '10140LM',
                form: props.form,
                pagecode: props.config.pagecode,
                json: props.json,
                onAfterSave: this.onLinkmanReferAfterSave.bind(this),
                showHistory:false
            },
            AddressRefer: {
                refcode: 'uapbd/refer/customer/RefAddressComp/index',
                AddressReferId: 'custAddressRef',
                form: props.form,
                meta: props.meta,
                pagecode: props.config.pagecode,
                json: props.json,
                onAfterSave: this.onAddressAfterSave.bind(this),
                showHistory:false
            },
            currentRecord: null,
            currentRowIndex: '',
            currentOrg: props.currentOrg,
            currentCustPk: props.currentCustPk,
            json: props.json,
            defaultAddData:null
        }
        props.button.setButtonVisible(this.state.browseBtns, true);
        props.button.setButtonVisible(this.state.editBtns, false);
        props.button.setMainButton('addModalAdd', true);
        this.gridId = props.config.custAddress;
    }
    componentDidMount() {
       this.setLinkmanReferParam();
    }
    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    /**
     * 设置联系人参照参数
     */
    setLinkmanReferParam = () => {
        let meta = this.props.meta.getMeta();
        meta['custAddress'].items.map((item) => {
            if (item.attrcode == 'pk_linkman') {
                Object.assign(item, this.state.linkmanRefer);
            }
            //update by zhenmx 注释掉自己做的地址簿参照 改用公共地址簿参照
            // if (item.attrcode == 'pk_address') {
            //     Object.assign(item, this.state.AddressRefer);
            // }
        });
        this.props.meta.setMeta(meta, this.loadCustAddressGrid.bind(this, this.props, () => {
            this.props.button.setButtonDisabled(['addModalDel'], true);
        }))
    }
    /**
     * 地址簿参照点击确定后事件
     * @param data
     */
    onAddressAfterSave = (data, addfullname) => {

        if (!!this.state.currentRecord.values.pk_customer.value) {
            this.state.currentRecord.status = '1';
        } else {
            this.state.currentRecord.status = '2';
        }
        this.state.currentRecord.values.pk_address = {
            value: data.pk_address,
            display: addfullname
        };

        this.setState(this.state);
    }
    /**
     * 联系人参照点击确定后事件
     * @param data
     */
    onLinkmanReferAfterSave = (data) => {
        let status;
        if (!data) {
            return;
        }
        if (!!this.state.currentRecord.values.pk_customer.value) {
            status = '1';
        } else {
            status = '2';
        }
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman', {
            value: data['10140LM'].rows[0].values['pk_linkman'].value,
            display: data['10140LM'].rows[0].values['name'].value
        });
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman.cell', data['10140LM'].rows[0].values['cell']);
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman.email', data['10140LM'].rows[0].values['email']);
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman.phone', data['10140LM'].rows[0].values['phone']);
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman.address', data['10140LM'].rows[0].values['address']);
        this.props.editTable.setValByKeyAndIndex(this.gridId, this.state.currentRowIndex, 'pk_linkman.postcode', data['10140LM'].rows[0].values['postcode']);
        this.setState({
            currentRecord: {
                status: status,
                values: {
                    pk_linkman: data['10140LM'].rows[0].values['pk_linkman'],
                    ['pk_linkman.cell']: data['10140LM'].rows[0].values['cell'],
                    ['pk_linkman.email']: data['10140LM'].rows[0].values['email'],
                    ['pk_linkman.phone']: data['10140LM'].rows[0].values['phone'],
                    ['pk_linkman.address']: data['10140LM'].rows[0].values['address'],
                    ['pk_linkman.postcode']: data['10140LM'].rows[0].values['postcode']
                }
            }
        });
    }
    updateButtons = (props, flag) => {
        props.button.setMainButton('addModalAdd', flag === 'browse');
        props.button.setMainButton('addModalSave', flag !== 'browse');
        props.button.setButtonVisible(this.state.browseBtns, flag === 'browse' ? true : false);
        props.button.setButtonVisible(this.state.editBtns, flag === 'edit' || flag === 'add' ? true : false);
        props.button.setButtonVisible(['addModalAdd', 'addModalDel'], true);
        props.editTable.setStatus(this.gridId, flag);
    }
    //加载客户地址信息
    loadCustAddressGrid = (props, callback) => {
        ajax({
            url: '/nccloud/uapbd/custAddress/CustAddQuery.do',
            data: {
                pk: this.state.currentCustPk,
                pagecode: props.config.pagecode,
                areacode: 'custAddress',
                pk_saleorg: this.props.pk_saleorg,
                actionName: this.props.actionName
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        this.props.button.setButtonDisabled(['addModalEdit'], false);
                        this.props.editTable.setTableData(this.gridId, data[this.gridId]);
                        callback && callback.call(this, data[this.gridId].rows);
                    } else {
                        this.props.button.setButtonDisabled(['addModalEdit'], true);
                        this.props.editTable.setTableData(this.gridId, {rows: []});
                        callback && callback.call(this, []);
                    }

                    this.props.button.setButtonDisabled(['addModalDel'], true);


                } else {
                    toast({color: 'danger', 'title': this.state.json['10140CUST-000033']});
                    /* 国际化处理： 查询出错！*/
                    this.props.editTable.setTableData(this.gridId, {rows: []});

                }
            }
        });

    }

    //地址簿模态框按钮事件
    custAddressModalBtn = (props, id) => {
        switch (id) {
            case'addModalAdd':
                this.onAddCustAddress(props, (data) => {
                    props.editTable.addRow('custAddress', undefined, true, data[this.gridId]['rows'][0]['values']);
                });
                this.updateButtons(props, 'edit');
                break;
            case'addModalEdit':
                let addrows = props.editTable.getAllRows(this.gridId, false);
                addrows.length !== 0 && this.updateButtons(props, 'edit');
                break;
            case'addModalDel':
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
                                url: '/nccloud/uapbd/custAddress/CustAddSave.do',
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
                                            this.loadCustAddressGrid(this.props);
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
            case'addModalRef':
                this.loadCustAddressGrid(props, () => {
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    })
                });
                break;
            case'addModalSave':
                const me = this;
                let allgriddata = [];
                let allgriddataBefore = props.editTable.getChangedRows(me.gridId);
                allgriddataBefore.length !== 0
                //当地址簿为空的时候断定不为空行
                allgriddataBefore.map((r) => {
                    if (!!r.values.pk_address.value) {
                        allgriddata.push(r);
                    }
                });
                allgriddata.length === 0 || ajax({
                    url: '/nccloud/uapbd/custAddress/CustAddSave.do',
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
                                me.loadCustAddressGrid(this.props, () => {
                                    toast({'color': 'success', 'title': this.state.json['10140CUST-000037']});
                                    /* 国际化处理： 保存成功！*/
                                });

                            }
                        }
                    }
                });
                if (allgriddata.length === 0) {
                    me.loadCustAddressGrid(this.props, () => {
                        me.updateButtons(this.props, 'browse');
                        toast({'color': 'success', 'title': this.state.json['10140CUST-000037']});
                        /* 国际化处理： 保存成功！*/
                    });
                }
                break;
            case'addModalCancel':
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
    //表格编辑前事件
    onBeforeEvent = (props, moduleId, item, index, value, record) => {

        if (this.props.actionName === 'subGrid5Addr' && (
            record.values.pk_org.value === record.values.pk_group.value ||
            record.values.pk_org.value === getBusinessInfo().groupId)) {
            toast({
                color: 'warning',
                content: this.state.json['10140CUST-000181']
            });
            return false;
        }

        this.state.currentRecord = record;
        this.state.currentRowIndex = index;
        let meta = props.meta.getMeta();
        let key = item.attrcode;
        switch (key) {
            case'pk_addressdoc':
                let pk_addressdocitem = meta[moduleId]['items'].find(item => item.attrcode === 'pk_addressdoc');
                pk_addressdocitem.queryCondition = () => {
                    return {
                        pk_areacl: record.values.pk_areacl.value
                    }
                }
                return true;
            default:
                return true;
        }
        props.meta.setMeta(meta);
    }
    onAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        let meta = props.meta.getMeta();
        switch (key) {
            case'pk_address':
                let currentitem = meta[moduleId]['items'].find(item => item.attrcode == 'pk_address');
                currentitem.queryCondition = {
                    pk_address: record.values.pk_address.value
                }
                props.meta.setMeta(meta);
                break;
            case'isdefault':
                if (value) {
                    let alltabledata = props.editTable.getAllData(moduleId);
                    alltabledata.rows.map((r, i) => {
                        if (index !== i) {
                            props.editTable.setValByKeyAndIndex(moduleId, i, 'isdefault', {value: false});
                        } else {
                            return;
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    onAddCustAddress = (props, callback) => {
        // 新增预加载数据只请求一次，如果state中defaultAddData 为空
        // 发起请求，把请求结果存到state里面，节省请求次数
       !!this.state.defaultAddData || ajax({
            url: '/nccloud/uapbd/custAddress/AddCustAddress.do',
            data: {
                nodetype: props.config.NODE_TYPE,
                pagecode: props.config.pagecode,
                areacode: this.gridId,
                pk_saleorg: this.props.pk_saleorg,
                actionName: this.props.actionName
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    this.setState({
                        defaultAddData: data
                    },()=>{
                        callback && callback.call(this, data);
                    });

                }
            }
        });
        !!this.state.defaultAddData && callback && callback.call(this,this.state.defaultAddData)
    }
    onRowClick = (props, moduleId, record, index, e) => {
        this.state.currentRecord = record;
        this.setState(this.state);

    }
    onSelected = (props, moduleId, record, index, status) => {
        let gridcheckrows = props.editTable.getCheckedRows(this.gridId);
        this.props.button.setButtonDisabled(['addModalDel'], gridcheckrows.length === 0);
    }
    onSelectedAll = (props, moduleId, status, length) => {
        if (length > 0) {
            this.props.button.setButtonDisabled(['addModalDel'], !status);
        } else {
            return;
        }
    }
    addRowCallback = () => {
        this.onAddCustAddress(this.props, (data) => {
            this.props.editTable.updateDataByIndexs(this.gridId, [{
                index: this.props.editTable.getAllRows(this.gridId).length-1,
                data: {status: '1', values: data[this.gridId]['rows'][0]['values']}
            }]);
        });
    }

    render() {
        const {button, editTable} = this.props;
        const {createButtonApp} = button;
        const {createEditTable} = editTable;
        return (
            <div className="">
                <div className="">
                    <div>
                        <div className="header-button-area" id="AddressModal-button-area"
                             style={{textAlign: 'right', marginBottom: '8px'}}>
                            {createButtonApp({
                                area: 'AddressModal-button-area',
                                onButtonClick: this.custAddressModalBtn,
                                popContainer: document.querySelector('#header-button-area')
                            })}
                        </div>
                    </div>
                    {/* 列表区 */}
                    <div className="nc-singleTable-table-area">
                        {createEditTable(this.gridId, {
                            onBeforeEvent: this.onBeforeEvent,
                            onAfterEvent: this.onAfterEvent,
                            onRowClick: this.onRowClick,
                            onSelectedAll: this.onSelectedAll,
                            onSelected: this.onSelected,
                            showIndex: true,
                            showCheck: true,
                            isAddRow: true,
                            addRowCallback: this.addRowCallback.bind(this)
                        })}
                    </div>
                </div>
            </div>
        );
    }
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65