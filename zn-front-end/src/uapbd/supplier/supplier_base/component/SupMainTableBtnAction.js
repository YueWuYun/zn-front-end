//2gkMNm3LJuVMLZd7N4h61wLM96owEOD0acXenuyP8VuZwhVFCvIV3zb1SwFkE1jSmfx8J3+F83X7
//zyfZD2LEHg==
import {
    editSupBaseInfo,
    deleteSupBaseInfo,
    copySupBaseInfo,
    openSupBankAcc,
    openSupAddressBook,
    openSupRenameBook,
    approveSupBaseInfo,
    freezeSupBaseInfo,
    openSupCreateCust,
    disabledCustCodeItem,
    openSupAssociateCust,
    queryHasAssignOrg,
    supplierAssign,
    setBillEnableState,
    openBatchEditModal, querySupplierApply,
    multiLevelManage, beforeEdit,
    openBrowseOrgDocDialog,
    openOrgBrowseDialog,
    validateAddOrCopy,
    addOrgAssignField,
    removeOrgAssignField,
    onBatchCreateCustomer,
    beforeBatchUpdateValidate,
    openBusiPortrait
} from '../utils/SupplierUtils';
import {toast} from 'nc-lightapp-front';

/***
 *  review code
 *  @date  2019-06-20
 * 
 */


/*******************************
 * 是否执行多级管控校验
 *******************************/
var isExecuteMultiLevelManage = function(btncode){
    var exceptBtns = ['Refresh','OrgBrowse','BrowseOrgDoc','QueryHasAssignOrg','Print','Output'];
    return !exceptBtns.includes(btncode);
}


/**
 * 主列表按钮点击事件
 * @param props
 * @param id
 */
export const onMainTableButtonClick = function (props, id) {
    let records = this.props.table.getCheckedRows(this.state.table.mainTable.id);//列表选中行
    if (isExecuteMultiLevelManage(id) && !multiLevelManage.call(this, records, id)) {
        return;
    }
    switch (id) {
        case 'Add'://列表新增
            this.props.form.setFormItemsRequired('suplinkman', { 'pk_linkman.cell': false });
            this.props.form.setFormItemsRequired('linkman', { 'cell': false });
            validateAddOrCopy.call(this, () => {
                editSupBaseInfo.call(this, {
                    openCard: true,
                    status: 'add',
                    selectedRecords: [],
                    dirtyRecords: (records && records.length > 0) ? records : []
                })
            })
            break;
        case 'Edit'://列表修改
            (records && records.length == 1) ?
                beforeEdit.call(this, {
                    openCard: true,
                    status: 'edit',
                    selectedRecords: records,
                    dirtyRecords: records
                }, editSupBaseInfo.bind(this))
                : toast({ content: this.Lang['10140SUG-000108'], color: 'warning' });/* 国际化处理： 请选择一条记录*/
            break;
        case 'Delete'://列表删除
            (records && records.length >= 1) ?
                deleteSupBaseInfo.call(this, { selectedRecords: records, dirtyRecords: records, openDeleteDialog: true }):
                toast({ content: this.Lang['10140SUG-000109'], color: 'warning' });/* 国际化处理： 请选择要删除的单据！*/
            break;
        case 'Copy'://列表复制
            (records && records.length == 1) ?
                validateAddOrCopy.call(this, () => {
                    copySupBaseInfo.call(this, {
                        selectedRecords: records,
                        dirtyRecords: records,
                        status: 'add',
                        openCard: true
                    })
                }) :
                toast({ content: this.Lang['10140SUG-000110'], color: 'warning' });/* 国际化处理： 请选择一张单据进行复制！*/
            break;
        case 'Refresh'://列表刷新
            this.onSearch({isClickSearch:false, isRefreshList:true},this.setTableData);
            break;
        case 'BankAccount'://银行账户
            (records && records.length == 1) ? openSupBankAcc.call(this, { selectedRecords: records, dirtyRecords: records, openDialog: true }) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000090'], color: 'warning' });/* 国际化处理： 提示,请选中一张单据！*/
            break;
        case 'Approve'://核准
        case 'Menu_Approve':
        case 'UnApprove':
            (records && records.length >= 1) ?
                approveSupBaseInfo.call(this, { selectedRecords: records, dirtyRecords: records }, { approve: (id == 'Approve' || id == 'Menu_Approve') }, this.disabledApproveButtons, false) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/
            break;
        case 'Freeze'://冻结
        case 'Menu_Freeze':
        case 'UnFreeze'://解冻
            (records && records.length >= 1) ?
                freezeSupBaseInfo.call(this, { selectedRecords: records, dirtyRecords: records, openDialog: this.props.nodeType != 'ORG_NODE' }, { freeze: (id == 'Freeze' || id == 'Menu_Freeze') }) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/
            break;
        case 'Enable':
        case 'Disable':
            (records && records.length >= 1) ?
                setBillEnableState.call(this, { selectedRecords: records, dirtyRecords: records }, { enable: id == 'Enable' }, false) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/
            break;
        case 'OrgBrowse'://按组织查询
            openOrgBrowseDialog.call(this);
            break;
        case 'BrowseOrgDoc'://查看组织档案
            openBrowseOrgDocDialog.call(this);
            break;
        case 'QueryHasAssignOrg':
            (records && records.length == 1) ?
                queryHasAssignOrg.call(this, { selectedRecords: records, dirtyRecords: records, openDialog: true }) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000090'], color: 'warning' });/* 国际化处理： 提示,请选中一张单据！*/
            break;
        case 'Assign':
        case 'Menu_Assign':
            (records && records.length > 0) ?
                supplierAssign.call(this, { selectedRecords: records, dirtyRecords: records, openDialog: true }, true) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/
            break;
        case 'CancelAssign':
            (records && records.length > 0) ?
                supplierAssign.call(this, { selectedRecords: records, dirtyRecords: records, openDialog: true }, false) :
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/
            break;
        case 'AssignWizard':
            this.setState({ assignStepClick: true }, () => {
                removeOrgAssignField.call(this, () => {
                    this.AssignStepDialog.show();
                })
            });
            break;
        case 'Print':
        case 'Menu_Print':
        case 'Output':
            //三铃集团（MISUZU）要求 选中后输出选中的,无选中时输出全部的
            let {table,allpks} = this.state;
            let checkedDatas = this.props.table.getCheckedRows(table.mainTable.id);
            let pks = (checkedDatas == null || checkedDatas.length == 0)?allpks:checkedDatas.map((record)=>{
                return record.data.values['pk_supplier'].value;
             })
             if(pks.length>16000){
                toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000231'], color: 'warning' });/* 国际化处理： 打印数据不能超过16000条！*/
                return;
            }
            // let pks = this.props.table.getAllTableData(this.state.table.mainTable.id).rows.map(record => {
            //     return record.values['pk_supplier'].value;
            // });
            this.executePrint(
                {
                    isPrint: (id == 'Print' || id == 'Menu_Print'),
                    url: this.Urls.printSupBaseUrl,
                    nodeKey:'supplierlist',
                    pks: pks,
                    isMainPrint:true
                });
            break;
        case 'BatchUpdate':
            (records && records.length > 0) ? this.setState({ openDialog: true }, () => {
                beforeBatchUpdateValidate.call(this, records, openBatchEditModal);
            }) : toast({ title: this.Lang['10140SUG-000045'], content: this.Lang['10140SUG-000111'], color: 'warning' });/* 国际化处理： 提示,未选中单据！*/

            break;
        case 'BatchUpdateWizard':
            this.setState({ batchUpdateStepClick: true }, () => {
                addOrgAssignField.call(this, () => { this.BatchUpdateWarzid.show() });
            })

            // this.BatchStepEdit.show();
            break;
        case 'BatchCreateCust':
            onBatchCreateCustomer.call(this, records);
            break;
            case 'Export':
            this.setState({
                billType:this.props.billType

            }, () => {
                this.props.modal.show('supplierExcel');
            });
            break;
        case 'exportsuppadd':
            let billtype = 'supplieraddress';
            if ('10140SUG' === this.props.appcode) {
                billtype = 'supplieraddress';

            } else if ('10140SUO' === this.props.appcode) {
                billtype = 'supplieraddress_org';

            } else if ('10140SUB' === this.props.appcode) {
                billtype = 'supplieraddress_glb';
            }
            this.setState({
                billType: billtype

            }, () => {
                this.props.modal.show('supplierExcel');
            });
            break;



    }
    if (records && records.length == 1) {
        let pk_supplier = null;
        if (records[0].hasOwnProperty('data')) {
            pk_supplier = records[0].data.values['pk_supplier'].value;
        } else if (records[0].hasOwnProperty('values')) {
            pk_supplier = records[0].values['pk_supplier'].value;
        } else {
            pk_supplier = records[0]['pk_supplier'].value;
        }
        this.props.cardPagination.setCardPaginationId({ id: pk_supplier, status: 1 });
    }

}


/**
 * 主列表操作列按钮点击事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export const onMainTableOprButtonClick = function (record, index, props, key) {
    if (!multiLevelManage.call(this, [record], key)) {
        return;
    }
    this.props.cardPagination.setCardPaginationId({ id: record['pk_supplier'].value, status: 1 })
    switch (key) {
        case 'Edit'://操作列修改
            let ismobilecoopertive = this.props.form.getAllFormValue('supplier_baseInfo_card').rows[0].values['ismobilecoopertive'].value;
            if (ismobilecoopertive) {
                this.props.form.setFormItemsRequired('suplinkman', { 'pk_linkman.cell': true });
                this.props.form.setFormItemsRequired('linkman', { 'cell': true });
            } else {
                this.props.form.setFormItemsRequired('suplinkman', { 'pk_linkman.cell': false });
                this.props.form.setFormItemsRequired('linkman', { 'cell': false });
            }
            beforeEdit.call(this, {
                selectedRecords: [record],
                dirtyRecords: [record],
                status: 'edit',
                openCard: true,
            }, editSupBaseInfo.bind(this));
            break
        case 'DeleteLine'://操作列删除
            record.index = index;
            deleteSupBaseInfo.call(this, { selectedRecords: [record], dirtyRecords: [record], openDeleteDialog: true })
            break;
        case 'Copy'://操作列复制
            record.index = index;
            validateAddOrCopy.call(this, () => {
                copySupBaseInfo.call(this, {
                    selectedRecords: [record],
                    dirtyRecords: [record],
                    status: 'add',
                    openCard: true
                });
            });

            break;
        case 'BankAccount'://银行账户
            openSupBankAcc.call(this, { selectedRecords: [record], dirtyRecords: [record], openDialog: true });
            break;
        case 'AddressBook'://操作列发货地址
            openSupAddressBook.call(this, { selectedRecords: [record], dirtyRecords: [record], openDialog: true });
            break;
        case 'SupRename'://操作供应商更名
            openSupRenameBook.call(this, { selectedRecords: [record], dirtyRecords: [record], openDialog: true });
            break;
        case 'CreateCust'://操作列生成客户
            if(record.iscustomer.value){
                toast({ content: this.Lang['10140SUG-000232'], color: 'warning' });
                return;
            }
            openSupCreateCust.call(this, { selectedRecords: [record], dirtyRecords: [record], openDialog: true }, disabledCustCodeItem.bind(this))
            break;
        case 'AssociateCust'://操作列关联客户
            if(record.iscustomer.value){
                toast({ content: this.Lang['10140SUG-000233'], color: 'warning' });
                return;
            }
            if (record['supprop'].value == '1') {
                //内部单位不能进行关联客户操作
                toast({ content: this.Lang['10140SUG-000089'], color: 'warning' });/* 国际化处理： 内部客商不能进行关联操作。*/
                return;
            }
            openSupAssociateCust.call(this, { selectedRecords: [record], dirtyRecords: [record], openDialog: true }, disabledCustCodeItem.bind(this))
            break;
        case 'Accessory':
            //this.Attachment.showAttachMng({mdid:this.state.envParam.mdid,pk_supplier:record['pk_supplier'].value});
            this.Attachment.showAttachMng({ mdid: '720dcc7c-ff19-48f4-b9c5-b90906682f45', pk_supplier: record['pk_supplier'].value });
            break;
        case 'ApplyQuery':
            record['pk_supplier_pf'].value && querySupplierApply.call(this, record['pk_supplier_pf'].value);
            break;
        case 'OprEnable':
        case 'OprDisable':
            setBillEnableState.call(this, { selectedRecords: [record], dirtyRecords: [record] }, { enable: key == 'OprEnable' }, false);
            break;
        case 'BusiPortrait':
            openBusiPortrait.call(this, { name: record['name'].value, taxpayerid: record['taxpayerid'].value });
            break;

    }
}
/**
 * 设置主列表页面按钮
 * @param {*} isInit 是否是初始页面  默认为false 
 */
export const setMainTablePageButton = function (isInit = false, callback) {
    let checkedRows = checkedRows || this.props.table.getCheckedRows(this.state.table.mainTable.id);
    let dataNum = isInit ? this.state.queryRecords.length : checkedRows.length;
    //设置【查看组织档案】按钮显隐 只有集团节点才能查看组织档案
    this.props.button.setButtonsVisible({
        Add: true, Edit: true, Delete: true, Copy: true, BatchUpdate: true, Refresh: true, Assign: true, BankAccount: true, AddressBook: true, Approve: true, Freeze: true,
        AssistFun: true, Associate: true, Enable: true, BatchCreateCust: true, OrgBrowse: true, BrowseOrgDoc: true, Print: true,
        BrowseOrgDoc: this.props.nodeType == 'GROUP_NODE'
    })
    /**
     * 初始页面 设置
     *  【删除】,【批改】,【分配】,【取消分配】,【已分配组织查询】,【核准/取消核准】,【批量生成客户】,【冻结/解冻】,【启用/停用】 按钮禁用
     */
    this.props.button.setButtonDisabled(['Delete', 'BatchUpdate', 'Assign', 'CancelAssign', 'QueryHasAssignOrg', 'Approve', 'BatchCreateCust', 'UnApprove', 'Freeze', 'UnFreeze', 'Enable', 'Disable'], dataNum == 0);
    this.props.button.setButtonDisabled(['Print', 'Menu_Output', 'Output'], isInit && dataNum == 0);
    //状态为核准的数据
    let supstateRow = checkedRows.find(record => { if (record.data.values['supstate'].value == '1') { return record; } });
    (!isInit && checkedRows.length > 0) && this.props.button.setButtonDisabled({
        Approve: !!supstateRow,
        UnApprove: !supstateRow,
        Enable: checkedRows.length > 1 ? false : (checkedRows[0].data.values['enablestate'].value == '2' ? true : false),
        Disable: checkedRows.length > 1 ? false : (checkedRows[0].data.values['enablestate'].value == '2' ? false : true),
        BatchCreateCust: !checkedRows.find(record => { return !record.data.values['iscustomer'].value; })
    });
    callback && callback();
}

//2gkMNm3LJuVMLZd7N4h61wLM96owEOD0acXenuyP8VuZwhVFCvIV3zb1SwFkE1jSmfx8J3+F83X7
//zyfZD2LEHg==