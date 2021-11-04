//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createBankaccList, createBankaccForm } from './bankacc'
import Utils from '../../../public/utils';
import { createPage, ajax, base, toast, high, print, cardCache, promptBox, createPageIcon } from 'nc-lightapp-front';
const { NCBackBtn } = base;
// const { BillApprove } = high
const { NCAffix, NCPopconfirm, NCFormControl, NCAnchor, NCScrollElement, NCScrollLink, NCDiv } = base;
const { PrintOutput, NCUploader, ApproveDetail, ApprovalTrans } = high;
const { setDefData, getDefData, addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';

const formId = 'customerpf';                      //表头id
const tableId = 'bankaccsub';                  //子表id
const pageId = '10140CUSTPF_custpfcard';            //pagecode
const searchId = 'search';                  //查询区id
const appId = '10140CUSTPF';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/customer/CustApplyCardQuery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/customer/CustApplySave.do';             //新增保存
const updateUrl = '/nccloud/uapbd/customer/CustApplyUpdate.do';         //修改保存
const addUrl = '/nccloud/uapbd/customer/CustApplyAdd.do';				//新增
const enableUrl = '/nccloud/uapbd/supbanken/enableSupbankenCard.do' //启用
const commitUrl = '/nccloud/uapbd/customer/CustApplyCommit.do' //提交
const callbackUrl = '/nccloud/uapbd/customer/CustApplyCallback.do' //收回
// const approveUrl = '/nccloud/uapbd/supplierapply/approveSupplierApply.do' //审批
// const unApproveUrl = '/nccloud/uapbd/supplierapply/unapproveSupplierApply.do' //取消审批
const queryLinkmanUrl = '/nccloud/uapbd/customer/CustApplyQueryLinkman.do' //联系人查询
const saveLinkmanUrl = '/nccloud/uapbd/customer/CustApplySaveLinkman.do'	//联系人保存
const printUrl = '/nccloud/uapbd/customer/CustApplyCardPrint.do';                   //打印url
const deleteUrl = '/nccloud/uapbd/customer/CustApplyDelete.do';                 //删除url
const validUrl = '/nccloud/uapbd/customer/CustApplyValid.do';                 //删除url

const pk_item = 'pk_customerpf';             //单据主键--用于卡片查询刷新
const titleCode = 'billnumber';            //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions'
const tableIds = ['custapplybanks', 'custtaxtypes', 'custcontacts', 'finance', 'sale', 'creditctl', 'bankaccsub']

const addEditable = ['supcountrytaxes', 'suplinkman']
const editEditable = ['purchase', 'supcountrytaxes', 'suplinkman', 'finance']
// const cardUrl = '/uapbd/customer/custapply/card/index.html';
// const listUrl = '/uapbd/customer/custapply/list/index.html';
const cardUrl = '/card';
const listUrl = '/list';
const pagecode_list = '10140CUSTPF_custpflist';
const printFunCode = '10140CUSTPF';    //有打印模板的小应用编码
const printNodeKey = 'custpfcard';    //模板节点标识
const md_class_id = '6d6d4a15-d9bb-4b0c-9da3-80760872bf87'; //md_class 客户申请单 主键，传附件用，先写死
const dataSource = 'uapbd.customer.custapply.cache' //缓存区id
const eventItems = ['pk_org', 'destorg', 'pk_country', 'custprop']

function tableButtonClick(props, id, text, record, index, tableid) {
    switch (id) {
        case 'Spread'://展开
            props.cardTable.toggleRowView(tableid, record);
            break
        case 'Detail'://更多
            props.cardTable.openModel(tableid, 'edit', record, index);
            //e.stopPropagation();
            break
        case 'Delline'://删除
            props.cardTable.delRowsByIndex(tableid, index);
            break
        default:
            console.log(id, index);
            break;
    }
}

//切换页面状态
function toggleShow(props, onlyAdd = false) {
    let showBtn = props.getUrlParam('showBtn');
    let status = props.getUrlParam('status');
    status = status == 'add' || status == 'edit' ? 'edit' : 'browse'
    let flag = status === 'browse' ? false : true;

    if (showBtn && showBtn == 'false') {
        props.button.setButtonVisible(['Edit', 'Add', 'Delete', 'Refresh', 'Query', 'PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Back', 'Attment', 'ApproveInfo', 'Save', 'Cancel', 'AddLine', 'DelLine'], false);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    } else {
        if (onlyAdd) {
            props.button.setButtonVisible(['Edit', 'Save', 'Cancel', 'AddLine', 'DelLine', 'Delete', 'Refresh', 'Query', 'PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Back', 'Attment', 'ApproveInfo'], false);
            props.button.setButtonVisible(['Add'], true)
        }
        else {
            // 按钮的显示状态
            if (status == 'edit' || status == 'add') {
                props.button.setButtonVisible(['Edit', 'Add', 'Delete', 'Refresh', 'Query', 'PrintGrp', 'Print', 'Output', 'CommitGrp', 'Commit', 'Callback', 'Bankacc', 'Back', 'Attment', 'ApproveInfo'], false);
                props.button.setButtonVisible(['Save', 'Cancel', 'AddLine', 'DelLine'], true);
                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            } else {
                //返回按钮换成图标，不再用按钮，此处先隐藏
                props.button.setButtonVisible(['Save', 'Cancel', 'AddLine', 'DelLine', 'Back', 'Print', 'Commit'], false);
                props.button.setButtonVisible(['Edit', 'Add', 'Delete', 'Refresh', 'Query', 'PrintGrp', 'Output', 'CommitGrp', 'Callback', 'Bankacc', 'Attment', 'ApproveInfo'], true);
                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            }
            let billstate = props.form.getFormItemsValue(formId, 'approvestate').value;
            //'-1'自由态，'3' 提交态，'1' 审批通过
            if (billstate == '-1') {

                props.button.setButtonDisabled(['CommitGrp', 'Edit', 'Delete', 'Bankacc'], false);
                props.button.setButtonVisible(['Callback', 'ApproveInfo'], false);

            } else if (billstate == '3' || billstate == '1') {

                props.button.setButtonVisible(['Edit', 'Delete', 'Bankacc'], false);
                props.button.setButtonDisabled(['ApproveInfo'], false);
                props.button.setButtonDisabled(['CommitGrp'], true);
            } else {
                props.button.setButtonVisible(['CommitGrp', 'Callback', 'Edit', 'Delete', 'Bankacc'], false);
                props.button.setButtonDisabled('ApproveInfo', false);
            }
        }
    }
    //返回图标控制
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status === 'browse'
    });
    setTimeout(() => props.form.setFormStatus(formId, status), 1);
    setTimeout(() => props.form.setFormStatus('customer', status), 1)
    tableIds.forEach(item => {
        if (item != 'finance' && item != 'sale' && item != 'creditctl') {
            props.cardTable.setStatus(item, status);
        }
    })

    //添加浏览器窗口关闭监听事件
    if (status != 'add' && status != "edit") {
        window.onbeforeunload = null;
    } else {
        window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
            return '';
        };
    }
};

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            pk_org: '',
            title_code: '',
            totalcount: 0,
            applycount: 0,
            showBaseInfo: true,
            isList: true,
            showApprove: false,
            approveDetailShow: false,
            billid: null,
            billNumInitState: null,
            curOrg: '',
            json: {}
        }
        this.bankaccConfig = {
            tableId: 'custbank',
            formId1: 'accbasinfo',
            formId2: 'netbankinfo',
            cardTableId: 'bankaccsub',
            mainPk: this.props.getUrlParam('id'),
            bankaccModalChange: this.bankaccModalChange.bind(this)
        }

    }

    initTemplate = (props, callback) => {
        props.createUIDom(
            {
                pagecode: pageId//,//页面id
                // appid: appId//注册按钮的id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                        // let status = props.getUrlParam('status');
                        // if(status && status == 'add'){
                        // 	props.cardTable.addRow(tableId);
                        // }
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        toggleShow(props);
                    }
                    if (data.context) {
                        if (data.context.pk_org && data.context.org_Name) {
                            this.state.curOrg = {
                                refname: data.context.org_Name,
                                refpk: data.context.pk_org
                            }
                        }
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta(props, meta) {
        let status = props.getUrlParam('status');
        meta[formId].status = status;

        //账户基本信息的账号字段只能录入数字
        meta['accbasinfo'].items.find(item => item.attrcode == 'accnum').reg = new RegExp('^\\d*$');

        //供应商联系人参照处理
        meta['custcontacts'].items.find(item => item.attrcode == 'pk_linkman').form = props.form
        meta['custcontacts'].items.forEach(item => {
            if (item.attrcode.indexOf('pk_linkman') >= 0 && item.attrcode != 'pk_linkman.sex') {
                item.refcode = 'uapbd/refer/linkman/LinkmanFormRefer/index'
            }
        })
        meta['custcontacts_edit'].items.find(item => item.attrcode == 'pk_linkman').form = props.form
        meta['custcontacts_edit'].items.forEach(item => {
            if (item.attrcode.indexOf('pk_linkman') >= 0 && item.attrcode != 'pk_linkman.sex') {
                item.refcode = 'uapbd/refer/linkman/LinkmanFormRefer/index'
            }
        })

        //meta[tableId].status = status;
        meta[formId].items = meta[formId].items.map((item, key) => {
            if (item.attrcode == 'pk_org') {
                item.queryCondition = {
                    "AppCode": appId,
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                };
            }
            return item;
        })
        tableIds.forEach(item => {
            let porCol = {
                itemtype: 'customer',
                attrcode: 'opr',
                label: this.state.json['10140CUSTPF-000019'],/* 国际化处理： 操作*/
                visible: true,
                className: 'table-opr',
                width: 200,
                fixed: 'right',
                render: (text, record, index) => {
                    let status = props.cardTable.getStatus(item);
                    let tableBtnAry = status === 'browse' ? ['Spread'] : ['Detail'];

                    //银行账户币种子表字段少，不用展开和更多
                    if (item == tableId)
                        tableBtnAry = [];

                    if (!['finance', 'sale', 'creditctl'].includes(item) && !(status == 'browse')) {
                        tableBtnAry.push('Delline');
                    }

                    //银行账户子表不可编辑，通过银行账户按钮维护
                    if (item == 'custapplybanks') {
                        tableBtnAry = [];
                    }

                    return props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "table-opr-area",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index, item)
                        }
                    )
                }
            };
            meta[item].items.push(porCol);
        })

        return meta;
    }

    componentDidMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({ json, inlt }, () => {
                    this.initTemplate(this.props, () => {
                        this.props.form.setFormStatus(this.formId, 'edit')
                        let status = this.props.getUrlParam('status');
                        if (status != "add") {
                            let pk = this.props.getUrlParam('id')
                            this.getdata(pk, (vbillstatus) => {
                                let codeedit = this.props.getUrlParam("codeedit")
                                let vbillnumedit = this.props.getUrlParam("vbillnumedit")
                                //设置一下是否可编辑两个编码
                                if (status == 'edit') {
                                    this.props.form.setFormItemsDisabled(this.formId, { billnumber: !vbillnumedit })
                                    this.props.form.setFormItemsDisabled("customer", { code: !codeedit })
                                }

                                //初始化一下特殊子表的按钮状态
                                if (status == 'edit' || status == 'add') {
                                    this.updateSpeTableBtnStatus(vbillstatus, 'edit')
                                }
                                else {
                                    this.updateSpeTableBtnStatus(vbillstatus)
                                }

                            });
                        }
                        else {
                            this.setDefaultValue(undefined, () => {
                                this.props.form.setFormItemsValue(formId, { 'pk_org': { value: this.state.curOrg.refpk, display: this.state.curOrg.refname } });
                                this.afterEvent(this.props, formId, 'pk_org', this.state.curOrg)
                                this.updateSpeTableBtnStatus(-1, 'edit')
                            });
                        }
                    });
                })       // 保存json和inlt到页面state中并刷新页面
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: '10140CUSTPF', domainName: 'uapbd', callback })
    }

    setDefaultValue = (data, callback) => {
        if (data) {
            data.preBillCode = this.preBillCode
            data.preCustCode = this.preCustCode
            data.hasPreBillCode = this.hasPreBillCode
            data.hasPreCustCode = this.hasPreCustCode
        }
        ajax({
            url: addUrl,
            data,
            success: (res) => {
                if (res.data) {
                    Utils.filterEmptyData(res.data[this.formId][this.formId].rows[0].values);
                    Utils.filterEmptyData(res.data.customer.customer.rows[0].values);
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId][this.formId] });
                    this.props.form.setAllFormValue({ ['customer']: res.data.customer.customer });

                    // 对于目的组织，进行一下默认赋值，如果模板上没有的话
                    // if(!res.data[this.formId][this.formId].rows[0].values.destorg) {
                    //     this.props.form.setFormItemsValue(this.formId, {destorg: {value: '0'}})
                    // }

                    this.setItemsProperty(res);

                    this.preBillCode = res.data.preBillCode
                    this.preCustCode = res.data.preCustCode
                    this.hasPreBillCode = res.data.hasPreBillCode
                    this.hasPreCustCode = res.data.hasPreCustCode

                    let pk_org = res.data.customer.customer.rows[0].values.pk_org ? res.data.customer.customer.rows[0].values.pk_org.value : ''
                    //四个字段需要根据供应商基本信息的pk_org字段进行参照
                    let meta = this.props.meta.getMeta()
                    let needOrgItems = ['pk_areacl', 'pk_custclass', 'pk_customer_main', 'pk_supplier'];
                    needOrgItems.forEach(key => {
                        let tempItem = meta["customer"].items.find(item => item.attrcode == key)
                        tempItem.queryCondition = () => {
                            return {
                                pk_org: pk_org
                            }
                        }
                    })
                    this.props.meta.setMeta(meta)
                }
                callback && callback();
            },
            error: (res) => {
                toast({ color: 'danger', content: res.message });
                return;
            }
        })
    }

    setItemsProperty = (res) => {
        // 客户申请单信息
        let pfData = res.data[this.formId][this.formId].rows[0];
        // 客户基本信息
        let baseData = res.data['customer']['customer'].rows[0];

        // 申请组织
        let pk_org = pfData.values['pk_org'];
        // 单据号
        let billnumber = pfData.values['billnumber'];
        //目的组织
        let destorg = pfData.values['destorg'];
        // 客户类型
        let custprop = baseData.values['custprop'];

        //单据号为空可编辑
        // if(billnumber && billnumber.value != null){
        let billNumEditable = res.data.billnumberIsEditable == 'Y' ? true : false;
        this.props.form.setFormItemsDisabled(this.formId, { 'billnumber': !billNumEditable });

        let custCodeEditable = res.data.cstBillNumCanEdit == 'Y' ? true : false
        this.props.form.setFormItemsDisabled('customer', { code: !custCodeEditable });
        if (!billNumEditable) {
            if (this.state.billNumInitState == null) {
                this.state.billNumInitState = this.props.form.getFormItemsRequired(this.formId, 'billnumber');
            }
            this.props.form.setFormItemsRequired(this.formId, { 'billnumber': false });
        } else {
            if (this.state.billNumInitState != null) {
                this.props.form.setFormItemsRequired(this.formId, { 'billnumber': this.state.billNumInitState });
            }
        }
        // }

        //申请组织为空，客户类型 永远可编辑
        //申请组织不为空 且 目的组织为 本组织，客户类型 不可编辑
        if (pk_org && destorg) {
            let custpropFlag = (pk_org.value != null && destorg.value == '0') ? true : false;
            this.props.form.setFormItemsDisabled('customer', { 'custprop': custpropFlag });
        }

        //客户类型默认为外部单位，则不可编辑，同时对应业务单元不可编辑;
        //客户类型为内部单位，则可编辑，对应业务单元可编辑必填,对应业务单元参照支持业务单元和利润中心
        if (custprop) {
            let financeorgFlag = custprop.value == '1' ? true : false;
            this.props.form.setFormItemsRequired('customer', { 'pk_financeorg': financeorgFlag });
            this.props.form.setFormItemsDisabled('customer', { 'pk_financeorg': !financeorgFlag });

            let meta = this.props.meta.getMeta();
            if (meta && meta != null && meta['customer'] != null) {
                meta['customer'].items = meta['customer'].items.map((item) => {

                    if (item.attrcode == 'pk_financeorg') {
                        item.queryCondition = {
                            "AppCode": appId,
                            TreeRefActionExt: 'nccloud.web.uapbd.customer.custapply.ref.BusinessUnitTreeRefExt'
                        };
                    }
                    return item;
                })
                this.props.meta.setMeta(meta);
            }
        }
    }

    pfProcess(url, content) {
        let finalData = {
            pks: [this.props.getUrlParam('id')],
            content
        }
        ajax({
            url,
            data: finalData,
            success: res => {

                if (url == commitUrl) {
                    if (res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                        this.setState({
                            compositedata: res.data,
                            compositedisplay: true
                        });
                    } else {
                        toast({ color: 'success', content: this.state.json['10140CUSTPF-000020'] });/* 国际化处理： 提交成功*/
                        this.setState({
                            compositedata: null,
                            compositedisplay: false
                        });
                        this.getdata(this.props.getUrlParam('id'), (vbillstatus) => {
                            this.updateSpeTableBtnStatus(vbillstatus)
                        });
                    }
                }
                else if (url == callbackUrl) {
                    toast({ content: this.state.json['10140CUSTPF-000021'], color: 'success' });/* 国际化处理： 单据已成功收回*/
                    this.getdata(this.props.getUrlParam('id'), (vbillstatus) => {
                        this.updateSpeTableBtnStatus(vbillstatus)
                    });
                }
            }
        })
    }


    getAssginUsedr = (value) => {
        this.pfProcess(commitUrl, value);
    }

    turnOff = () => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    }

    buttonClick = (props, id) => {

        let _this = this;
        switch (id) {
            case 'Add':
                props.form.EmptyAllFormValue('customer')
                props.form.EmptyAllFormValue(this.formId)
                props.form.setFormStatus('customer', 'add')
                props.form.setFormStatus(this.formId, 'add')
                tableIds.forEach(item => {
                    setTimeout(() => props.cardTable.setTableData(item, { rows: [] }), 1)
                })
                //'supbankacc','supcountrytaxes','suplinkman','finance'
                // setTimeout(() => props.cardTable.setTableData('suplinkman',{rows:[]}),1)
                // setTimeout(() => props.cardTable.setTableData('purchase',{rows:[]}),1)
                // setTimeout(() => props.cardTable.setTableData('supbankacc',{rows:[]}),1)
                // setTimeout(() => props.cardTable.setTableData('supcountrytaxes',{rows:[]}),1)
                // setTimeout(() => props.cardTable.setTableData('finance',{rows:[]}),1)
                // // tableIds.forEach(item => {
                // // 	props.cardTable.setTableData(item,{rows:[]})
                // // })
                // props.form.setFormStatus(this.formId,'edit')
                // props.form.setFormStatus('supplier_baseInfo','edit')
                // addEditable.forEach(item => {
                // 	props.cardTable.setStatus(item,'edit')
                // })

                // props.button.setButtonVisible(['Save','Cancel'],true)

                // props.pushTo(cardUrl, {
                //     pagecode: pageId,
                //     appcode: appId,
                //     status: 'add'
                // })
                props.setUrlParam({
                    pagecode: pageId,
                    appcode: appId,
                    status: 'add'
                });
                this.setDefaultValue(undefined, () => {
                    this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: this.state.curOrg.refpk, display: this.state.curOrg.refname } });
                    this.afterEvent(props, formId, 'pk_org', this.state.curOrg);
                    toggleShow(props)
                    this.updateSpeTableBtnStatus(-1, 'edit')
                });
                break;
            case 'Edit':
                this.valid(props, 'edit', this.edit.bind(this, props));
                break;
            case 'Delete':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140CUSTPF-000022'],/* 国际化处理： 确认删除*/
                    content: this.state.json['10140CUSTPF-000023'],/* 国际化处理： 是否确认要删除？*/
                    beSureBtnClick: this.delConfirm.bind(this)
                })
                break;
            case 'Save':
                this.saveClick(props)
                break;
            case 'Enable':
                let formData = props.form.getAllFormValue(this.formId);
                let finalData = {
                    isEnable: true,
                    list: []
                }
                let dataObj = {
                    pk_bankaccbas: formData.rows[0].values.pk_bankaccbas.value,
                    pk_custbank: formData.rows[0].values.pk_custbank.value,
                    pk_cust: formData.rows[0].values.pk_cust.value
                }
                finalData.list.push(dataObj)
                ajax({
                    url: enableUrl,
                    data: finalData,
                    success: res => {
                        this.getdata(dataObj.pk_custbank, dataObj.pk_bankaccbas, dataObj.pk_cust)
                        toast({ color: 'success', title: this.state.json['10140CUSTPF-000024'] })/* 国际化处理： 启用成功！*/
                    }

                })
                break
            case 'Disable':
                formData = props.form.getAllFormValue(this.formId);
                finalData = {
                    isEnable: false,
                    list: []
                }
                dataObj = {
                    pk_bankaccbas: formData.rows[0].values.pk_bankaccbas.value,
                    pk_custbank: formData.rows[0].values.pk_custbank.value,
                    pk_cust: formData.rows[0].values.pk_cust.value
                }
                finalData.list.push(dataObj)
                ajax({
                    url: enableUrl,
                    data: finalData,
                    success: res => {
                        this.getdata(dataObj.pk_custbank, dataObj.pk_bankaccbas, dataObj.pk_cust)
                        toast({ color: 'success', title: this.state.json['10140CUSTPF-000025'] })/* 国际化处理： 停用成功！*/
                    }

                })
                break;
            case 'Back':
                props.pushTo(listUrl, {
                    pagecode: pagecode_list,
                    appcode: appId,
                    status: 'browse'
                })
                break;
            case 'Refresh':
                this.refresh(props);
                break;
            case 'CommitGrp':
                this.pfProcess(commitUrl);
                break;
            case 'Commit':
                this.pfProcess(commitUrl);
                break;
            case 'Callback':
                this.pfProcess(callbackUrl);
                break;
            case 'Approve':
                //this.pfProcess(approveUrl)
                this.showApprove()
                break;
            case 'UnApprove':
                this.pfProcess(unApproveUrl)
                break;
            case 'Cancel':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140CUSTPF-000027'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10140CUSTPF-000028'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: this.Cancel.bind(this, props)
                })
                break;
            case 'Bankacc':
                props.modal.show('bankaccList');
                break;
            case 'PrintGrp':
                this.onPrint();
                break;
            case 'Print':
                this.onPrint();
                break;
            case 'Output':
                this.onOutput();
                break;
            case 'Attment':
                this.Attment();
                break;
            case 'ApproveInfo':
                this.setState({
                    approveDetailShow: true,
                    billid: props.form.getFormItemsValue(formId, pk_item).value
                });
                break;
            case 'FinanEdit':
                this.speTableEdit('finance')
                break
            case 'SaleEdit':
                this.speTableEdit('sale')
                break
            case 'CreditEdit':
                this.speTableEdit('creditctl')
                break
            case 'FinanSave':
                finalData = {}
                let mainFormData = props.form.getAllFormValue(this.formId)
                let baseInfoData = props.form.getAllFormValue('customer')
                finalData.CustomerPfVO = mainFormData
                finalData.CustomerVO = baseInfoData
                //保存每个子表信息
                tableIds.forEach(item => {
                    if (!(item == 'bankaccsub')) {
                        finalData[item] = props.cardTable.getAllData(item);
                    }
                })

                ajax({
                    url: updateUrl,
                    data: finalData,
                    success: (res) => {
                        props.pushTo('/card', {
                            pagecode: pageId,
                            status: 'browse',
                            id: res.data
                        })
                        this.bankaccConfig.mainPk = res.data
                        let vBillStatus = this.getdata(res.data)
                        this.updateSpeTableBtnStatus()
                        //特殊设置一下返回按钮的可见性
                        this.setState({
                            backVisible: true
                        })

                        this.props.cardTable.setStatus('finance', 'browse');
                        this.finanTableStatus = 'browse'
                    }
                })
                break
            case 'SaleSave':
                finalData = {}
                mainFormData = props.form.getAllFormValue(this.formId)
                baseInfoData = props.form.getAllFormValue('customer')
                finalData.CustomerPfVO = mainFormData
                finalData.CustomerVO = baseInfoData
                tableIds.forEach(item => {
                    if (!(item == 'bankaccsub')) {
                        finalData[item] = props.cardTable.getAllData(item);
                    }
                })

                ajax({
                    url: updateUrl,
                    data: finalData,
                    success: (res) => {
                        props.pushTo('/card', {
                            pagecode: pageId,
                            status: 'browse',
                            id: res.data
                        })
                        this.bankaccConfig.mainPk = res.data
                        let vBillStatus = this.getdata(res.data)
                        this.updateSpeTableBtnStatus()
                        //特殊设置一下返回按钮的可见性
                        this.setState({
                            backVisible: true
                        })

                        this.props.cardTable.setStatus('sale', 'browse');
                        this.finanTableStatus = 'browse'
                    }
                })
                break
            case 'CreditSave':
                finalData = {}
                mainFormData = props.form.getAllFormValue(this.formId)
                baseInfoData = props.form.getAllFormValue('customer')
                finalData.CustomerPfVO = mainFormData
                finalData.CustomerVO = baseInfoData
                tableIds.forEach(item => {
                    if (!(item == 'bankaccsub')) {
                        finalData[item] = props.cardTable.getAllData(item);
                    }
                })

                ajax({
                    url: updateUrl,
                    data: finalData,
                    success: (res) => {
                        props.pushTo('/card', {
                            pagecode: pageId,
                            status: 'browse',
                            id: res.data
                        })
                        this.bankaccConfig.mainPk = res.data
                        let vBillStatus = this.getdata(res.data)
                        this.updateSpeTableBtnStatus()
                        //特殊设置一下返回按钮的可见性
                        this.setState({
                            backVisible: true
                        })

                        this.props.cardTable.setStatus('creditctl', 'browse');
                    }
                })
                break
            case 'FinanCancel':
                this.props.cardTable.resetTableData('finance');
                this.props.cardTable.setStatus('finance', 'browse')
                this.updateSpeTableBtnStatus()
                break
            case 'SaleCancel':
                this.props.cardTable.resetTableData('sale');
                this.props.cardTable.setStatus('purchase', 'browse')
                this.updateSpeTableBtnStatus()
                break
            case 'CreditCancel':
                this.props.cardTable.resetTableData('creditctl');
                this.props.cardTable.setStatus('purchase', 'browse')
                this.updateSpeTableBtnStatus()
                break
            case 'FinanceRefresh':
                this.getdata(this.props.getUrlParam('id'), null, ['fiance'])
                break;
            case 'SaleRefresh':
                this.getdata(this.props.getUrlParam('id'), null, ['sale'])
                break;
            case 'CreditctlRefresh':
                this.getdata(this.props.getUrlParam('id'), null, ['creditctl'])
                break;
            default:
                break
        }
    }

    updateSpeTableBtnStatus(vBillStatus = -1, mainFormStatus = 'browse', speTableStatus = { finance: 'browse', sale: "browse", "creditctl": "browse" }) {
        let speTableIds = ['finance', 'sale', 'creditctl']
        let speTableBtnPre = ['Finan', 'Sale', "Credit"]	//财务信息和采购信息按钮前缀
        let speTableRefreshBtn = ['FinanceRefresh', 'SaleRefresh', 'CreditctlRefresh'];
        let speBtnObj = {}
        speTableIds.forEach((item, index) => {
            let tableStatus = speTableStatus[item]
            if (mainFormStatus == 'edit' || mainFormStatus == 'add' || vBillStatus != -1) {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[speTableRefreshBtn[index]] = false
            }
            else if (tableStatus == 'edit' || tableStatus == 'add') {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = false
                speBtnObj[`${speTableBtnPre[index]}Save`] = true
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = true
                speBtnObj[speTableRefreshBtn[index]] = false
            }
            else {
                speBtnObj[`${speTableBtnPre[index]}Edit`] = true
                speBtnObj[`${speTableBtnPre[index]}Save`] = false
                speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
                speBtnObj[speTableRefreshBtn[index]] = true
            }
        })
        this.props.button.setButtonVisible(speBtnObj);
    }

    speTableEdit(currTableId) {
        let speTableIds = ['finance', 'sale', 'creditctl'];
        let speTableNames = [this.state.json['10140CUSTPF-000049'], this.state.json['10140CUSTPF-000050'], this.state.json['10140CUSTPF-000051']]
        let hasWarning = false
        let speTableStatus = {}
        speTableIds.forEach((item, index) => {
            if (currTableId != item) {
                speTableStatus[item] = 'browse'
                if (this.props.cardTable.getStatus(item) == 'edit' && !hasWarning) {
                    toast({ color: 'warning', content: speTableNames[index] })
                    hasWarning = true
                    return;
                }
            }
            else {
                speTableStatus[item] = 'edit'
            }
        })

        if (hasWarning) {
            return;
        }
        this.props.cardTable.setStatus(currTableId, 'edit');
        this.updateSpeTableBtnStatus(-1, "browse", speTableStatus)
    }

    closeApprove = () => {
        this.setState({
            approveDetailShow: false
        })
    }

    edit = (props) => {
        props.setUrlParam({
            pagecode: pageId,
            appcode: appId,
            status: 'edit',
            id: props.getUrlParam('id')
        });
        toggleShow(props)
        this.updateSpeTableBtnStatus(-1, 'edit')
    }

    valid = (props, action, callback) => {

        let pk = props.form.getFormItemsValue(formId, pk_item).value;
        let data = { pk, action };

        ajax({
            url: validUrl,
            data,
            success: res => {
                if (res && res.data) {
                    this.props.form.setFormItemsDisabled(this.formId, { 'billnumber': !res.data.vbillnumedit });
                    this.props.form.setFormItemsDisabled('customer', { code: !res.data.codeedit });
                    callback && callback();
                }
            }
        })
    }

    Cancel = (props) => {

        // let pk = props.getUrlParam('id')==undefined?getDefData('preid',dataSource):this.props.getUrlParam('id');
        //缓存区最后一条
        let pk = getCurrentLastId(dataSource);
        this.getdata(pk, (vbillstatus) => {
            this.updateSpeTableBtnStatus(vbillstatus)
        })
        props.form.setFormStatus(this.formId, 'browse')
        props.form.setFormStatus('customer', 'browse')
        tableIds.forEach(item => {
            props.cardTable.setStatus(item, 'browse')
        })
        // props.pushTo(cardUrl, {
        //     pagecode: pageId,
        //     appcode: appId,
        //     status: 'browse'
        // })
        props.setUrlParam({
            pagecode: pageId,
            appcode: appId,
            status: 'browse'
        });
        toggleShow(props, pk == '' || pk == null ? true : false)
        this.setDefaultValue({ status: "cancel" });
        // props.form.cancel([this.formId,'customer'])
        // tableIds.forEach(item => {
        // 	props.cardTable.resetTableData(item)
        // })
    }

    //附件管理
    Attment = () => {
        this.state.showlogoUploader = true;
        this.setState(this.state);
    }
    //关闭附件窗口
    onHideUploader = () => {
        this.state.showlogoUploader = false;
        this.setState(this.state);
    }
    //打印
    onPrint = () => {

        let allData = this.props.form.getAllFormValue(formId);

        if (allData.length === 0) {
            toast({ content: this.state.json['10140CUSTPF-000029'], color: 'warning' });/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        pks.push(allData.rows[0].values[pk_item].value);

        print(
            'pdf',
            printUrl,
            {
                funcode: printFunCode,//功能节点编码
                nodekey: printNodeKey,//模板节点编码
                oids: pks
            }
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.form.getAllFormValue(formId);

        if (allData.length === 0) {
            toast({ content: this.state.json['10140CUSTPF-000029'], color: 'warning' });/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        pks.push(allData.rows[0].values[pk_item].value);

        this.setState({
            ids: pks
        }, this.refs.printOutput.open());
    }

    refresh = (props) => {
        // props.pushTo(cardUrl, {
        //     pagecode: pageId,
        //     appcode: appId,
        //     status:props.getUrlParam('status'),
        //     [pk_item]:props.getUrlParam(pk_item)
        // })
        props.setUrlParam({
            pagecode: pageId,
            appcode: appId,
            status: props.getUrlParam('status'),
            id: props.getUrlParam('id')
        })
        this.getdata(props.getUrlParam('id'), () => {
            toast({ title: this.state.json['10140CUSTPF-000026'], color: 'success' });/* 国际化处理： 刷新成功！*/
        });
    }

    addLineClick = (tableid) => {
        if (tableid == 'custcontacts') {
            this.props.cardTable.addRow(tableid);
            // this.props.modal.show('linkman')
            // this.props.form.setFormStatus('Linkman','edit')
            // this.props.form.EmptyAllFormValue('Linkman')
        } else {

            this.props.cardTable.addRow(tableid);
        }
    }

    pageInfoClick = (props, pk) => {

        let data = {
            "pk": pk,
            "pageid": pageId
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) => {
                if (res.data.head) {
                    debugger;
                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
                if (res.data.body) {
                    props.editTable.setTableData(tableId, res.data.body[tableId]);
                }
                toggleShow(props);
            }
        });
    }


    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {

        if (eventItems.includes(key)) {

            let data = {};

            let customerpf = this.props.form.getAllFormValue('customerpf');
            let customer = this.props.form.getAllFormValue('customer');

            data.CustomerPfVO = customerpf;
            data.CustomerVO = customer;
            data.key = key;
            data.status = this.props.getUrlParam('status');

            if (key == 'pk_org') {
                props.meta.getMeta()['customer'].items.forEach(item => {

                    if (['pk_custclass', 'pk_areacl', 'pk_customer_main', 'pk_supplier'].includes(item.attrcode)) {
                        item.queryCondition = {
                            'pk_org': value.value
                        };
                    }

                    // if(item.attrcode != 'pk_custclass') {
                    //     item.queryCondition = {
                    //         'pk_org':value.value
                    //     };
                    // }else if(item.attrcode != 'pk_areacl'){
                    //     item.queryCondition = {
                    //         'pk_org':value.value
                    //     };
                    // }else if(item.attrcode != 'pk_customer_main'){
                    //     item.queryCondition = {
                    //         'pk_org':value.value
                    //     };
                    // }else if(item.attrcode != 'pk_supplier'){
                    //     item.queryCondition = {
                    //         'pk_org':value.value
                    //     };
                    // }
                })
            }

            //目的组织为本组织时
            if (key == 'destorg') {
                let disableFlag = value.value == '0' ? true : false;
                this.props.form.setFormItemsDisabled('customer', { 'custprop': disableFlag, 'pk_financeorg': disableFlag });
            }
            if (key == 'custprop') {
                //客户类型为内部单位，对应业务单元必填
                let disableFlag = value.value == '1' ? true : false;
                this.props.form.setFormItemsRequired('customer', { 'pk_financeorg': disableFlag });
            }
            // data = {
            //     custAndCustApplyForm:data
            // }
            this.setDefaultValue(data);
        }
    }

    getTableHead = (tableId) => {
        let { createButtonApp, createButton } = this.props.button
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        //buttonLimit: 5,
                        onButtonClick: this.addLineClick.bind(this, tableId)
                        //popContainer: document.querySelector('.header-button-area')
                    })}
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}

                </div>
            </div>
        )
    }

    getTableHeadSpe(tableId) {
        let { createButtonApp } = this.props.button
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons" style={{ padding: '0px' }}>
                    {createButtonApp({
                        area: `${tableId}-action`,//按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })}
                </div>
            </div>
        )
    }

    //通过单据id查询单据信息
    getdata = (pk, callback, speTables = []) => {
        let data = { pk };
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                let retBillStatus = -1
                if (res.data) {
                    if (res.data.head) {
                        let formData = {
                            [this.formId]: res.data.head[this.formId],
                            "customer": res.data['customer']['customer']
                        }
                        this.props.form.setAllFormValue(formData)
                        retBillStatus = res.data.head[this.formId].rows[0].values.approvestate.value
                    }
                    if (res.data.bodys) {
                        // this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        // let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
                        // let arr = this.props.cardTable.getAllRows(this.tableId);
                        // let applycount = 0;
                        // // arr.map((item)=>{
                        // // 	applycount += parseInt(item.values.pk_project.value);
                        // // })
                        // this.setState({applycount});
                        // this.setState({totalcount});
                        //特殊赋值，为了应对三个特殊子表的刷新操作：财务，采购，信用控制域
                        if (speTables.length > 0) {
                            res.data.bodys.forEach((item, index) => {
                                speTables.forEach((tableId) => {
                                    if (item.hasOwnProperty(tableId)) {
                                        this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                                    }
                                })
                            })
                            return;
                        }

                        res.data.bodys.forEach((item, index) => {
                            tableIds.forEach((tableId) => {
                                if (item.hasOwnProperty(tableId)) {
                                    this.props.cardTable.setTableData(tableId, res.data.bodys[index][tableId])
                                }
                            })
                        })
                        // for(let tableId in tableIds) {
                        // 	if(res.data.body.hasOwnProperty(tableId)) {
                        // 		this.props.cardTable.setTableData(tableId,res.data.body[tableId])
                        // 	}
                        // }
                    }
                }
                else {
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.form.EmptyAllFormValue('customer');
                }
                toggleShow(this.props, pk == '' || pk == null ? true : false);
                this.setState(this.state);

                if (callback && typeof callback == 'function') {
                    callback(retBillStatus)
                }
            }
        });
    }

    onCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
        if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
            let setObj = {}
            setObj.value = record.values.pk_region.value
            setObj.display = record.values.pk_region.display
            props.cardTable.setValByKeyAndIndex(this.tableId, index, 'pk_region.name', setObj)
            record.values.pk_region.display = value.refcode
        }
    }

    //保存单据
    saveClick = (props) => {
        let url = saveUrl;//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存
        }
        let finalData = {}
        if (!props.form.isCheckNow(this.formId)) {
            return;
        }
        if (!props.cardTable.checkTableRequired()) {
            return;
        }
        let ismobilecoopertive = props.form.getAllFormValue('customer').rows[0].values.ismobilecoopertive
        if(ismobilecoopertive && ismobilecoopertive.value){
            let custlinkmans = props.cardTable.getAllRows('custcontacts');
            let index = true;
            if(custlinkmans && custlinkmans.length > 0){
                for(let custlinkman of custlinkmans){
                    if(custlinkman.status != 3){
						index = false;
					}
                    let cell = custlinkman.values['pk_linkman.cell'];
                    if(!cell.value){
                       toast({title:this.state.json['10140CUSTPF-000055'],color:'warning'})
                        return; 
                    }
                }
                if(index){
					toast({title:this.state.json['10140CUSTPF-000054'],color:'warning'})
                        return; 
				}
            } else{
                toast({title:this.state.json['10140CUSTPF-000054'],color:'warning'})
                return;
            }
        }
        let mainFormData = props.form.getAllFormValue(this.formId)
        let baseInfoData = props.form.getAllFormValue('customer')
        finalData.CustomerPfVO = mainFormData
        finalData.CustomerVO = baseInfoData
        //保存每个子表信息
        tableIds.forEach(item => {
            if (!(item == 'bankaccsub')) {
                finalData[item] = props.cardTable.getAllData(item);
            }
        })

        //供应商基本信息校验
        let baseInfoMeta = this.props.meta.getMeta()
        baseInfoMeta = baseInfoMeta.customer.items
        let emtpyNesItems = []
        baseInfoMeta.forEach(item => {
            if (item.required == true) {
                if (baseInfoData.rows[0].values[item.attrcode].value == null || baseInfoData.rows[0].values[item.attrcode].value == '') {
                    emtpyNesItems.push(item.label)
                }
            }
        })

        let afterInsertToastInfo = null
        if (emtpyNesItems.length > 0) {
            afterInsertToastInfo = `${this.state.json['10140CUSTPF-000053']}[${emtpyNesItems.join('],[')}]`/* 国际化处理： 供应商基本信息校验失败,详细信息如下,下列字段值不能为空*/
            mainFormData.rows[0].values.memo.value = afterInsertToastInfo
        }
        else {
            // 所有信息都已经录入，清除异常信息字段
            mainFormData.rows[0].values.memo.value = null
        }

        finalData.preCustCode = this.preCustCode
        finalData.hasPreCustCode = this.hasPreCustCode

        ajax({
            url: url,
            data: finalData,
            success: (res) => {
                let pk = res.data;
                props.setUrlParam({
                    pagecode: pageId,
                    appcode: appId,
                    status: 'browse',
                    id: pk
                });
                setDefData('preid', dataSource, pk);
                this.getdata(pk, (vbillstatus) => {
                    this.updateSpeTableBtnStatus(vbillstatus, 'browse')
                });

                //业务参数设置当中允许违反规则校验并且必输项未填的话，成功保存之后需要在界面上展示一下提示信息
                if (afterInsertToastInfo) {
                    toast({ color: 'warning', content: afterInsertToastInfo })
                }
                else {
                    toast({ color: 'success', title: this.state.json['10140CUSTPF-000030'] })/* 国际化处理： 保存成功！*/
                }
            }
        })
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: deleteUrl,
            data: {
                deleteinfo: [
                    {
                        pk_org: this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
                        id: this.props.getUrlParam('id') == null ? this.props.form.getFormItemsValue(this.formId, pk_item).value : this.props.getUrlParam('id'),
                        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                    }
                ]
            },
            success: (res) => {
                if (res) {
                    this.props.pushTo(listUrl, {
                        pagecode: pagecode_list,
                        appcode: appId,
                        status: 'browse'
                    });
                }

            }
        });
    };

    modelSave = (tableid) => {
        this.props.cardTable.closeModel(tableid);
        this.saveClick(this.props);
    }

    showApprove() {
        this.setState({
            showApprove: true
        })
    }

    closeApprove() {
        this.setState({
            showApprove: false
        })
    }

    bankaccClick(props, id) {
        switch (id) {
            case 'BankAdd':
                this.setState({
                    isList: false
                })
                break;
        }
    }

    bankaccModalChange(info) {
        let isList = info.isList
        delete info.isList
        if (isList) {
            this.bankaccConfig = {
                tableId: 'custbank',
                formId1: 'accbasinfo',
                formId2: 'netbankinfo',
                cardTableId: 'bankaccsub',
                mainPk: this.props.getUrlParam('id'),
                bankaccModalChange: this.bankaccModalChange.bind(this),
                ...info
            }
            this.props.modal.close('bankaccList')
            this.props.modal.show('bankaccForm')
        }
        else {
            this.bankaccConfig = {
                tableId: 'custbank',
                formId1: 'accbasinfo',
                formId2: 'netbankinfo',
                cardTableId: 'bankaccsub',
                mainPk: this.props.getUrlParam('id'),
                bankaccModalChange: this.bankaccModalChange.bind(this)
            }
            this.props.modal.close('bankaccForm')
            this.props.modal.show('bankaccList')
        }

    }

    linkmanClose(props) {
        let allRows = props.cardTable.getAllRows('custcontacts')
        allRows.forEach(item => {
            if (item.status == 2) {
                item.values.forEach(value => {
                    value.display = value.value
                })
            }
        })
    }

    cardTableDoubleClick(props, record, index) {

        let currStatus = props.form.getFormStatus(this.formId)
        if (currStatus == 'edit') {
            let pk = record.values.pk_linkman.value
            ajax({
                url: queryLinkmanUrl,
                data: { pk },
                success: res => {
                    props.modal.show('linkman')
                    props.form.setAllFormValue({ Linkman: res.data.Linkman })
                    props.form.setFormStatus('Linkman', 'edit')
                }
            })
        }
    }

    linkmanSaveClick() {
        let linkmanData = this.props.form.getAllFormValue('Linkman')
        let finalData = {
            model: linkmanData
        }
        let allOtherKeys = ['pk_suplinkman', 'pk_linkman', 'opr', 'isdefault', 'ts', 'def1', 'def2', 'def3', 'def4', 'def5', 'def6', 'def7', 'def8', 'def9', 'def10']
        let allShowKeys = ['name', 'sex', 'vjob', 'phone', 'cell']
        let allRows = this.props.cardTable.getAllRows('custcontacts')
        ajax({
            url: saveLinkmanUrl,
            data: finalData,
            success: (res) => {
                let addResult = false
                let pk_linkman = res.data
                allRows.forEach(item => {
                    if (item.values.pk_linkman.value == pk_linkman) {
                        allShowKeys.forEach(key => {
                            item.values[`pk_linkman.${key}`].display = linkmanData.rows[0].values[key].value
                        })
                        item.values.pk_linkman.value = pk_linkman
                        addResult = true
                    }
                })
                if (!addResult) {
                    let value = {}
                    allShowKeys.forEach(key => {
                        value[`pk_linkman.${key}`] = {
                            value: linkmanData.rows[0].values[key].value,
                            display: linkmanData.rows[0].values[key].value
                        }
                        if (key == 'sex') {
                            let sexValue = linkmanData.rows[0].values[key].value
                            value[`pk_linkman.${key}`].display = sexValue && sexValue == '1' ? this.state.json['10140CUSTPF-000031'] : this.state.json['10140CUSTPF-000032']/* 国际化处理： 男,女*/
                        }
                    })
                    value.pk_linkman = {
                        value: pk_linkman,
                        display: linkmanData.rows[0].values['name'].value
                    }
                    let newRow = {
                        rowid: pk_linkman,
                        status: 2,
                        values: value
                    }
                    allRows.push(newRow)
                }
                this.props.cardTable.setTableData('custcontacts', { rows: allRows })
            }
        })

    }

    onLinkmanBeforeEvent(props, moduleId, key, value, index, record, status) {
        let meta = props.meta.getMeta()
        if (status == 'model') {
            moduleId = 'custcontacts_edit'
        }
        if (record.values.pk_linkman.value) {
            this.editLinkmanPk = record.values.pk_linkman.value
            meta[moduleId].items.find(item => item.attrcode == 'pk_linkman').queryCondition = () => {
                return {
                    pk_linkman: record.values.pk_linkman.value
                }
            }
        }
        else {
            meta[moduleId].items.find(item => item.attrcode == 'pk_linkman').queryCondition = () => {
                return {}
            }
            this.editLinkmanPk = null
        }
        this.linkmanIndex = index
        meta[moduleId].items.find(item => item.attrcode == 'pk_linkman').onAfterEdit = this.onLinkmanAfterEdit.bind(this)
        return true
    }

    /**
	 * 根据联系人参照返回的数据构建供应商了联系人表格的行数据，并更新到表格上
	 * 
	 * @param {*} savedData 
	 */
    onLinkmanAfterEdit(savedData) {
        let allShowKeys = ['name', 'sex', 'vjob', 'phone', 'cell']
        let allRows = this.props.cardTable.getAllRows('custcontacts')
        let pk_linkman = savedData.linkmanRefer.rows[0].values.pk_linkman.value
        allRows.forEach((item, index) => {
            let itemPkLinkman = item.values.pk_linkman.value
            if (itemPkLinkman == pk_linkman || ((itemPkLinkman == null || itemPkLinkman == '') && index == this.linkmanIndex)) {
                allShowKeys.forEach((key) => {
                    //性别需要进行一下特殊处理
                    if (key == 'sex') {
                        item.values[`pk_linkman.${key}`].value = savedData.linkmanRefer.rows[0].values[key].value
                        if (savedData.linkmanRefer.rows[0].values[key].value) {
                            item.values[`pk_linkman.${key}`].display = savedData.linkmanRefer.rows[0].values[key].value == 1 ? this.state.json['10140CUSTPF-000031'] : this.state.json['10140CUSTPF-000032']/* 国际化处理： 男,女*/
                        }
                    }
                    else {
                        if (key == "name") {
                            item.values[`pk_linkman`].value = savedData.linkmanRefer.rows[0].values[key].value
                            item.values[`pk_linkman`].display = savedData.linkmanRefer.rows[0].values[key].value
                            //下面这段代码是为了修正一个奇怪的问题：如果不把isEdit删掉的话，那么列表界面上联系人字段出不来
                            delete item.values[`pk_linkman`].isEdit
                        }
                        else {
                            item.values[`pk_linkman.${key}`].value = savedData.linkmanRefer.rows[0].values[key].value
                            item.values[`pk_linkman.${key}`].display = savedData.linkmanRefer.rows[0].values[key].value
                        }
                    }
                })
                item.values.pk_linkman.value = pk_linkman
                //item.values.pk_custlinkman.value = pk_linkman
            }
        })

        this.props.cardTable.setTableData('custcontacts', { rows: allRows })
    }

    resetDeptAndPsnRef(props, moduleId, key, value, index, record, status) {
        //修正一下专管部门和专管业务员的参照的查询条件
        let meta = this.props.meta.getMeta();
        let realModuleId = status == 'model' ? `${moduleId}_edit` : moduleId;
        if (moduleId == 'finance') {
            meta[realModuleId].items.find(item => item.attrcode == 'pk_respdept1').queryCondition = () => {
                return {
                    pk_org: record.values.pk_org.value
                }
            }

            meta['finance'].items.find(item => item.attrcode == 'pk_resppsn1').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if (record && record.values && record.values.pk_respdept1 && record.values.pk_respdept1.value && record.values.pk_respdept1.value != '') {
                    paramObj.pk_dept = record.values.pk_respdept1.value
                }
                return paramObj;
            }

            meta['finance_edit'].items.find(item => item.attrcode == 'pk_resppsn1').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if (record && record.values && record.values.pk_respdept1 && record.values.pk_respdept1.value && record.values.pk_respdept1.value != '') {
                    paramObj.pk_dept = record.values.pk_respdept1.value
                }
                return paramObj;
            }
        }

        if (moduleId == 'sale') {
            meta[realModuleId].items.find(item => item.attrcode == 'respdept').queryCondition = () => {
                return {
                    pk_org: record.values.pk_org.value
                }
            }

            meta['sale'].items.find(item => item.attrcode == 'respperson').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if (record && record.values && record.values.respdept && record.values.respdept.value && record.values.respdept.value != '') {
                    paramObj.pk_dept = record.values.respdept.value
                }
                return paramObj;
            }

            meta['sale_edit'].items.find(item => item.attrcode == 'respperson').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if (record && record.values && record.values.respdept && record.values.respdept.value && record.values.respdept.value != '') {
                    paramObj.pk_dept = record.values.respdept.value
                }
                return paramObj;
            }
        }
        this.props.meta.setMeta(meta)

        return true;

    }

    onSpeCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
        if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
            //重新设置一下专管部门
            if (key == 'pk_resppsn1' && moduleId == 'finance') {
                this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_respdept1', { value: value.values.pk_dept.value, display: value.values.deptname.values });
            }
            else if (key == 'respperson' && moduleId == 'sale') {
                this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'respdept', { value: value.values.pk_dept.value, display: value.values.deptname.values })
            }
        }
    }

    /**
     * 返回按钮操作
     */
    onReturnClick() {
        this.props.pushTo(listUrl, {
            pagecode: pagecode_list,
            appcode: appId,
            status: 'browse'
        })
    }

    render() {
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo } = this.props;
        const { createCardPagination } = cardPagination;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp, createButton } = button;
        let { createModal } = modal;
        let status = this.props.getUrlParam('status');

        let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

        let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"
        return (
            <div className='nc-bill-card'>
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title: this.state.json['10140CUSTPF-000001'],
                                    backBtnClick: this.onReturnClick.bind(this),
                                    initShowBackBtn: status == 'browse'
                                })}
                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                {/*{buttons.map( (v) =>{*/}
                                {/*return (createButton(v.btncode, {*/}
                                {/*name: v.btnname,*/}
                                {/*onButtonClick: this.buttonClick.bind(this),*/}
                                {/*buttonColor: this.getButtonNames(v.btncode)*/}
                                {/*}))*/}
                                {/*})}*/}
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: dataSource
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    {/*//子表导航树*/}
                    <NCAnchor>
                        <NCScrollLink
                            to={this.formId}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custapplybanks'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000003']/* 国际化处理： 客户银行帐号*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custcontacts'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000005']/* 国际化处理： 客户联系人*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'custtaxtypes'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000004']/* 国际化处理： 客户国家税类*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'finance'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000006']/* 国际化处理： 财务信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'sale'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000007']/* 国际化处理： 销售信息*/}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'creditctl'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                            <p>{this.state.json['10140CUSTPF-000008']/* 国际化处理： 信用控制信息*/}</p>
                        </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name={this.formId}>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {
                                onAfterEvent: this.afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>

                    <NCScrollElement name={this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid="custbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
                                    <span
                                        className={`toggle-form-icon iconfont ${iconItem}`}
                                        onClick={() => {
                                            let show = !this.state.showBaseInfo
                                            this.setState({
                                                showBaseInfo: show
                                            });
                                        }}
                                    />
                                    <span className="name">{this.state.json['10140CUSTPF-000000']/* 国际化处理： 客户基本信息*/}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm('customer', {
                                        onAfterEvent: this.afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>
                </div>

                <div className="nc-bill-bottom-area">
                    <NCScrollElement name={'custapplybanks'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custapplybanks", {

                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custcontacts'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custcontacts", {
                                modelSave: this.modelSave.bind(this,'finance'),
                                tableHead: this.getTableHead.bind(this, 'custcontacts'),
                                onBeforeEvent: this.onLinkmanBeforeEvent.bind(this),
                                //onRowDoubleClick: this.cardTableDoubleClick.bind(this),
                                modelClose: this.linkmanClose.bind(this)
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custtaxtypes'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("custtaxtypes", {
                                modelSave: this.modelSave.bind(this,'finance'),
                                tableHead: this.getTableHead.bind(this, 'custtaxtypes')
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'finance'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("finance", {
                                tableHead: this.getTableHeadSpe.bind(this, 'finance'),
                                // modelSave: this.modelSave.bind(this,'finance')
                                onBeforeEvent: this.resetDeptAndPsnRef.bind(this),
                                onAfterEvent: this.onSpeCardTableAfterEvent.bind(this),
                                hideAdd: true,
                                hideDel: true,
                                hideModelSave: true
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'sale'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("sale", {
                                tableHead: this.getTableHeadSpe.bind(this, 'sale'),
                                onBeforeEvent: this.resetDeptAndPsnRef.bind(this),
                                onAfterEvent: this.onSpeCardTableAfterEvent.bind(this),
                                // modelSave: this.modelSave.bind(this,'sale')
                                hideAdd: true,
                                hideDel: true,
                                hideModelSave: true
                            })}
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'creditctl'}>
                        <div className="nc-bill-table-area">
                            {/*{this.getTableHead('creditctl')}*/}
                            {createCardTable("creditctl", {
                                tableHead: this.getTableHeadSpe.bind(this, 'creditctl'),
                                // modelSave: this.modelSave.bind(this,'creditctl')
                                hideAdd: true,
                                hideDel: true,
                                hideModelSave: true
                            })}
                        </div>
                    </NCScrollElement>

                    {createModal('delete', {
                        title: this.state.json['10140CUSTPF-000016'],/* 国际化处理： 注意*/
                        content: this.state.json['10140CUSTPF-000017'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })}
                    {createBankaccList(Object.assign({ json: this.state.json }, this.props), this.bankaccConfig)}
                    {createBankaccForm(Object.assign({ json: this.state.json }, this.props), this.bankaccConfig)}
                    {createModal('linkman', {
                        title: this.state.json['10140CUSTPF-000033'],/* 国际化处理： 联系人*/
                        content: (createForm('Linkman', {

                        })),
                        beSureBtnClick: this.linkmanSaveClick.bind(this)
                    })}
                </div>
                {/*<BillApprove*/}
                {/*show = {this.state.show}*/}
                {/*close = {this.closeApprove.bind(this)}*/}
                {/*billType = '10GY'*/}
                {/*billid = {this.bankaccConfig.mainPk}*/}
                {/*/>*/}
                <PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
                        funcode: printFunCode,//功能节点编码
                        nodekey: printNodeKey,//模板节点编码
                        oids: this.state.ids,
                        outputType: 'output'
                    }}
                />
                {/*附件管理*/}
                {this.state.showlogoUploader && <NCUploader
                    // billId={cacheTools.get('pk_org')}
                    billId={'uapbd/6d6d4a15-d9bb-4b0c-9da3-80760872bf87/' + this.props.getUrlParam('id')}
                    //{'upbd/'+cacheTools.get('orgunit_pk_org')}
                    //billNo={'001'}
                    //target={target}
                    placement={'bottom_right'}
                    multiple={false}
                    // beforeUpload={this.beforeUpload}
                    onHide={this.onHideUploader.bind(this)}
                />}
                {this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['10140CUSTPF-000034']}/* 国际化处理： 指派*/
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={this.turnOff.bind(this)}
                /> : ""}
                <ApproveDetail
                    show={this.state.approveDetailShow}
                    close={this.closeApprove.bind(this)}
                    billtype='10KH'
                    billid={this.state.billid}
                />
            </div>

        );
    }
}

Card = createPage({
    //initTemplate: initTemplate
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65