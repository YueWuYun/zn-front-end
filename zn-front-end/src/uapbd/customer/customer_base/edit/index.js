//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ajax, base, toast, cardCache, high,createPageIcon} from 'nc-lightapp-front';

let {setDefData, getDefData} = cardCache;
const {NCAffix, NCAnchor, NCScrollElement, NCScrollLink,NCDiv} = base;
const {NCUploader} = high;
import {
    buttonClick, subtable2Click,
    subtable3Click, subtable4Click, subtable5Click,
    subtable6Click, subGrid2RowClick, customerBaseinfoAfterEvent,
    modalAfterEvent, pageInfoClick, subGridBeforeEvent, subGridAfterEvent,
    oprButtonClick, grid4OprButtonClick, grid5OprButtonClick, grid6OprButtonClick
} from './events'
import BatchEditStepModal from '../batchEdit/BatchEditStepModal';
import BatchEditModal from '../batchEdit/BatchEditModal';
import AssignStepModal from '../distribStep/AssignStepModal';//分配向导modal
import AssignModal from '../distribStep/AssignModal';//分配modal
import ImportTempletDlg from '../../../public/pubComponent/datatemplet/importTempletDlg';//调用模板
import CheckCustByOrg from '../checkCustByOrg/index'//按组织查看客户
import CheckOrgCust from '../checkOrgCust/index';//查看组织档案
import GenerateCust from '../generateCust/index';
import CorrelationCust from '../correlationCust/index';
import checkAssignOrg from '../checkAssignOrg';
import OldDialog from '../Utils/OldDialog'; //客户删除弹窗;
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import Utils from '../../../public/utils';
import '../main/index.less'

class CustomerBaseCard extends Component {
    constructor(props) {
        super(props);
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        this.modifierMeta = this.modifierMeta.bind(this);
        this.buttontoggleShow = this.buttontoggleShow.bind(this);
        this.state = {
            loadLang: false,
            pk_org: '',
            title_code: '',
            sub1totalcount: 0,
            sub2totalcount: 0,
            sub3totalcount: 0,
            sub4totalcount: 0,
            sub5totalcount: 0,
            sub6totalcount: 0,
            currentOrg: '',
            showUploader: false,
            showSubGrid: true,
            subGridStatus: false,
            json: {},
            x: '',
            linkmanIsBeEdit: false,
            allFinancePk: [],
            allSaleInfoPk: [],
            allCrtlPk: []
        }
        let tempParam = {
            pagecode: props.config.pagecode
        }, langParam = {
            moduleId: '10140CUST', domainName: 'uapbd'
        }
        this.loadTempAndLang(props, tempParam, langParam, (tempdata, mutiJson, inlt) => {
            this.resetStateAfterLoadLang(mutiJson, inlt, tempdata, (data) => {
                if (data) {
                    let meta = tempdata.template;
                    if (data.template) {
                        meta = this.modifierMeta(props, meta)
                    }
                    if (data.button) {
                        let button = data.button;
                        button && props.button.setPopContent(['subGrid4Del', 'subGrid5Del', 'subG6Del'], this.state.json['10140CUST-000143']);
                        props.button.setButtons(button);
                        this.buttontoggleShow(this.props);
                    }
                    props.meta.setMeta(meta, () => {
                        this.importTempletDlg.loadTempData(this.initCardData);
                    });
                }
            });
        });
    }

    loadTempAndLang = (props, tempParam, langParam, callback) => {
        let temp, lang, inlt;
        props.createUIDom(tempParam, (data) => {
            temp = data;
            if (!!lang) {
                callback && callback(temp, lang, inlt);
            }
        });
        let langCallback = (multiJson, json, inlt) => {
            lang = multiJson;
            inlt = inlt;
            if (!!temp) {
                callback && callback(temp, lang, inlt);
            }
        }
        props.MultiInit.getMultiLang(Object.assign(langParam, {callback: langCallback}));
    }
    resetStateAfterLoadLang = (mutiJson, inlt, tempdata, callback) => {
        let context = tempdata.context;
        this.state.currentOrg = context.pk_org;
        //查询数据模板协调参数
        this.props.config.pk_curOrg = context.pk_org;
        this.props.config.nodeType = this.props.config.NODE_TYPE;
        this.props.config.json = mutiJson;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.state.ncAnchorobj = {
            formId: mutiJson['10140CUST-000097'],
            subGrid1: mutiJson['10140CUST-000098'],
            subGrid2: mutiJson['10140CUST-000099'],
            subGrid3: mutiJson['10140CUST-000100'],
            subGrid4: mutiJson['10140CUST-000101'],
            subGrid5: mutiJson['10140CUST-000102'],
            subGrid6: mutiJson['10140CUST-000103']
        };
        this.setState(this.state, callback.call(this, tempdata))
    }
    buttontoggleShow = (props, btnname,callback) => {
        let status = props.getUrlParam('status') || 'browse';
        let formId = props.config.formId;
        let subGrid2 = props.config.subGrid2;
        let subGrid3 = props.config.subGrid3;
        //按钮的显示状态
        props.button.setButtonVisible([
                'btnAdd'],
            status === 'browse');
        props.button.setButtonVisible([
                'btnSave', 'btnCancel', 'subGrid2Add',
                'subGrid3Add'],
            (status === 'edit' || status === 'add') && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'btnSaveTmp', 'btnSaveAdd'
            ],
            (status === 'add') && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'subG4ModalSave', 'subG4ModalCancel',
                'subG5ModalSave', 'subG5ModalCancel',
                'subG6ModalCancel', 'subG6ModalSave'],
            status !== 'browse' && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'btnEdit', 'btnDelete',
                'btnCopy', 'batchEdit', 'btnBatchEdit',
                'btnGuideEdit', 'btnRefrensh'],
            status === 'browse' && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'btnQuery', 'distribute', 'btnDistrib',
                'btnCancelDis', 'btnGuideDis', 'btnCheckOrg',
                'btnBankAcc'],
            status === 'browse' && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'btnAddress', 'freeze', 'btnFreeze',
                'btnUnFreeze', 'enable', 'btnEnable',
                'btnDisable'],
            status === 'browse' && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'btnAssist', 'btnGenerate', 'btnCorrelation',
                'btnAttachment', 'btnCheckByOrg', 'btnCheckOrgBase',
                'btnCheckApply'],
            status === 'browse' && btnname !== 'btncancel');
        props.button.setButtonVisible([
                'print', 'btnOutput', 'headerMoreBtn'],
            status === 'browse' && btnname !== 'btncancel');
        props.form.setFormStatus(formId, status === 'browse' ? 'browse' : 'edit');
        //银行账户子表不维护
        props.cardTable.setStatus(subGrid2, status === 'browse' ? 'browse' : 'edit');
        // props.cardTable.setStatus(subGrid2, 'browse');
        props.cardTable.setStatus(subGrid3, status === 'browse' ? 'browse' : 'edit');
        //返回按钮
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: status === 'browse'
        });
        this.setState({showSubGrid: status === 'browse' && btnname !== 'btncancel'},()=>{
            callback && callback.call(this)
        });
    }

    modifierMeta = (props, meta) => {
        let status = props.getUrlParam('status') || 'browse';
        let {formId, subGrid1, subGrid2, subGrid3, subGrid4, subGrid5, subGrid6, searchId_modal, searchId_modal_batchEdit, associateSup, custAddress, NODE_TYPE} = props.config;
        if (NODE_TYPE === 'ORG_NODE') {
            //业务单元节点客户新增所属组织参照数据过滤
            let pk_orgitem = meta[formId]['items'].find(item => item['attrcode'] === 'pk_org');
            //容错处理
            if (!!pk_orgitem) {
                pk_orgitem.refName = this.state.json['10140CUST-000104'];
                /* 国际化处理： 组织*/
                pk_orgitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
            //客户批改模态框查询模板 查询组织 添加主组织参照过滤
            let pk_org_assignitem = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_org_assign');
            if (!!pk_org_assignitem) {
                pk_org_assignitem.isShowDisabledData = true;
                pk_org_assignitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
            //客户批改模态框查询模板 所属组织 添加主组织参照过滤
            let pk_orgitem_edit = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_org');
            if (!!pk_orgitem_edit) {
                pk_orgitem_edit.isShowDisabledData = true;
                pk_orgitem_edit.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
        } else if (NODE_TYPE === 'GROUP_NODE') {

        } else {
            // 全局节点客户基本信息上级客户参照
            let pk_fatherCustomerItem = meta['cust_share']['items'].find(item => item['attrcode'] === 'pk_customer_main');
            if (!!pk_fatherCustomerItem) {
                pk_fatherCustomerItem.queryCondition = () => {
                    return {
                        pk_org: 'GLOBLE00000000000000'
                    }
                }
            }
            //客户全局节点客户基本分类参照
            let pk_custclassitem = meta['cust_share']['items'].find(item => item['attrcode'] === 'pk_custclass');
            if (!!pk_custclassitem) {
                pk_custclassitem.queryCondition = () => {
                    return {
                        pk_org: 'GLOBLE00000000000000'
                    }
                }
            }

        }
        //客户向导分配查询区客户基本分类参照
        let pk_custclassitem_searchId =
            meta[searchId_modal]['items'].find(item => item['attrcode'] === 'pk_custclass');
        if (!!pk_custclassitem_searchId) {
            pk_custclassitem_searchId.isShowUnit = true;
            pk_custclassitem_searchId.isShowDisabledData = true;
            pk_custclassitem_searchId.unitPropsExtend = { isShowDisabledData : true}
        }
        //客户向导批改查询区客户基本分类参照
        let pk_custclassitem_searchId_modal_batchEdit =
            meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_custclass');
        if (!!pk_custclassitem_searchId_modal_batchEdit) {
            pk_custclassitem_searchId_modal_batchEdit.isShowUnit = true;
            pk_custclassitem_searchId_modal_batchEdit.isShowDisabledData = true;
            pk_custclassitem_searchId_modal_batchEdit.unitPropsExtend = { isShowDisabledData : true}
        }
        //客户  向导分配查询区  对应业务单元参照扩展条件
        let businessUnititembatch = meta[searchId_modal]['items'].find(item => item['attrcode'] === 'pk_financeorg');
        businessUnititembatch.queryCondition = ()=>{
            return{
                TreeRefActionExt:'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
            }
        }
        //客户   向导批改查询区 对应业务单元参照扩展条件
        let businessUnititemassign = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_financeorg');
        businessUnititemassign.queryCondition = ()=>{
            return{
                TreeRefActionExt:'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
            }
        }
        //客户向导批改查询区所属组织参照
        let orgitem = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_org');
        if (!!orgitem) {
            orgitem.isShowDisabledData = true;
        }
        //客户基本信息对应业务单元参照
        let pk_financeorg_item = meta['cust_share']['items'].find(item => item['attrcode'] === 'pk_financeorg');
        if (!!pk_financeorg_item) {
            pk_financeorg_item.queryCondition = () => {
                return {
                    TreeRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CorrespondingOrgSqlBuilder'
                }
            }
        }
        let searchpkorgitem = meta[props.config.searchId_modal]['items'].find(item => item['attrcode'] === 'pk_org');
        if (!!searchpkorgitem) {
            searchpkorgitem.isShowDisabledData = true;
        }
        //销售信息子表卡片 两个字段加正则校验
        meta['custsalecard_1']['items'].map((item) => {
            if (item.attrcode === 'prepaidratio') {
                item.reg = new RegExp('^(?:0|[1-9][0-9]?|100)$');
                item.errorMessage = this.state.json['10140CUST-000184'];

            }
            if (item.attrcode === 'stockpriceratio') {
                item.reg = new RegExp('^(?:0|[1-9][0-9]?|100)$');
                item.errorMessage = this.state.json['10140CUST-000184'];
            }
        });
        //bug fix for NCCLOUD-160346  子组件内表单不显示问题
        meta['custBatchEditForm'].areaVisible=true
        meta[formId].status = status;
        meta[subGrid1].status = status;
        meta[subGrid2].status = status;
        meta[subGrid3].status = status;
        //构造分区域form表单subTableOprBtnEvent
        meta['formrelation'] = Object.assign({
            'accbasinfo': ['netbankinfo'],
            'customer_simpleinfo': ['custcreditctlcard_1'],
            'custfinancecardcustomer': ['custfinancecard_1'],
            'custsalecustomerinfo': ['custsalecard_1']
        }, meta['formrelation']);
        //客户银行账户列表操作列
        meta[subGrid2].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '160px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                let buttonAry = props.cardTable.getStatus(subGrid2) === 'browse' ? ['sub2oprExtend'] : ['sub2oprExtend', 'sub2oprDelete']
                return props.button.createOprationButton(buttonAry, {
                    area: 'currency-opr-col-2',
                    buttonLimit: 2,
                    onButtonClick: oprButtonClick.bind(this, record, index)
                });

            }
        });
        //客户国家税类操作列 操作列取消展开按钮
        meta[subGrid3].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '160px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                let buttonAry = props.cardTable.getStatus(subGrid3) === 'browse' ? [] : ['sub3oprDelete']
                return props.button.createOprationButton(buttonAry, {
                    area: 'currency-opr-col-3',
                    buttonLimit: 2,
                    onButtonClick: oprButtonClick.bind(this, record, index)
                });
            }
        });
        meta[subGrid4].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '160px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                return props.button.createOprationButton(['subGrid4Edit', 'subGrid4Del'], {
                    area: 'currency-opr-col-4',
                    buttonLimit: 2,
                    onButtonClick: grid4OprButtonClick.bind(this, record, index)
                });
            }
        });
        meta[subGrid5].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '160px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                return props.button.createOprationButton(['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr'], {
                    area: 'currency-opr-col-5',
                    buttonLimit: 3,
                    onButtonClick: grid5OprButtonClick.bind(this, record, index)
                });
            }
        });
        meta[subGrid6].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: '160px',
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                return props.button.createOprationButton(['subG6Edit', 'subG6Del'], {
                    area: 'currency-opr-col-6',
                    buttonLimit: 2,
                    onButtonClick: grid6OprButtonClick.bind(this, record, index)
                });
            }
        });
        return meta;
    }
    initCardData = () => {
        let me = this;
        let pk = me.props.getUrlParam('id') || this.props.getUrlParam('cid');
        let status = me.props.getUrlParam('status') || 'browse';
        let copyFlag = me.props.getUrlParam('copyFlag');
        if (pk && pk !== 'undefined' && (status === 'browse' || status === 'edit')) {
            //修改或者查询浏览态卡片
            me.getdata(pk, this.buttontoggleShow.bind(me, me.props,'',this.toogleBtnState.bind(this)));
        } else {
            if (copyFlag === 'copy' && status === 'add') {
                //复制卡片
                me.getCopyData(pk, this.buttontoggleShow.bind(me, me.props));
            } else {
                //如果有默认模板新增加载的是默认模板的数据
                if (Object.keys(me.importTempletDlg.state.defaultExtBillcard).length !== 0) {
                    me.importTempletDlg.setDefaultTemp(this.buttontoggleShow.bind(me, me.props))();

                } else {
                    //没有默认模板加载默认数据
                    me.setDefaultValue(this.buttontoggleShow.bind(me, me.props))
                }
            }

        }
    }

    componentDidMount() {


    }

    componentDidUpdate() {
        let formStatus = this.props.form.getFormStatus(this.props.config.formId);
        if (formStatus === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    //
    showEnablestateBtns = (props) => {
        let {formId} = props.config;
        let formItemArr = props.form.getFormItemsValue(formId, ['enablestate', 'frozenflag', 'isfreecust', 'issupplier', 'pk_customerpf']);
        props.button.setButtonDisabled(['btnCheckApply'], !!!formItemArr[4].value);
        props.button.setButtonDisabled(['btnGenerate'], formItemArr[3].value || formItemArr[2].value);
    }
    //
    modifierMetaAgain = (props, data) => {
        let {formId, formId_share, NODE_TYPE} = props.config;
        //除了业务单元节点的新增和复制，其余情况所属组织都不可编辑
        props.form.setFormItemsDisabled(formId, {
            'pk_org': !!!(NODE_TYPE === 'ORG_NODE' && (props.getUrlParam('copyFlag') === 'copy' || props.getUrlParam('status') === 'add')),
            'code': props.getUrlParam('status') === 'add' && data['userjson'] == 'diseditable' ? true : false,
            'issupplier': true,
            'pk_financeorg': data&&data.head&&data.head.customer&&(data.head.customer.rows[0].values.custprop.value !=1 ) //NCCLOUD-168504 复制内部客户，复制的数据对应业务单元不可编辑。0-外部客户 1-内部客户

        });
        props.form.setFormItemsRequired(formId_share, {'pk_financeorg': false});
        this.showEnablestateBtns(props);
    }
    //卡片新增设置默认数据
    setDefaultValue = (callback) => {
        ajax({
            url: '/nccloud/uapbd/customer/baseAction.do',
            data: {
                'NODE_TYPE': this.config.NODE_TYPE,
                'actionName': 'btnAdd',
                'pagecode': this.config.pagecode,
                'currentOrg': this.state.currentOrg
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (data.head) {
                            data.head.userjson && setDefData('PermissionOrgIDs', this.config.datasource, data.head.userjson.split(', '));
                            this.props.form.EmptyAllFormValue(this.config.formId)
                            this.props.form.setFormStatus(this.config.formId,'add')
                            Utils.filterEmptyData(data.head[this.config.formId].rows[0].values);
                            this.props.form.setAllFormValue({[this.config.formId]: data.head[this.config.formId]});
                            this.modifierMetaAgain(this.props, data);
                        }
                        this.props.cardTable.setTableData(this.config.subGrid2, {rows: []});
                        this.props.cardTable.setTableData(this.config.subGrid3, {rows: []});
                    }
                }
                callback && callback.call(this);
            }
        });
    }
    getCopyData = (pk, callback) => {
        let data = {
            pk_customer: pk || getDefData('id', this.config.datasource),
            NODE_TYPE: this.config.NODE_TYPE,
            actionName: 'btnCopy',
            pagecode: this.config.pagecode
        };
        ajax({
            url: '/nccloud/uapbd/customer/baseAction.do',
            data,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        let {head, bodys} = data;
                        if (head) {
                            this.props.form.setAllFormValue({[this.config.formId]: head[this.config.formId]});
                            this.modifierMetaAgain(this.props, data);
                        }
                        if (bodys.hasOwnProperty(this.config.subGrid3)) {
                            this.props.cardTable.setTableData(this.config.subGrid3, bodys[this.config.subGrid3]);
                        }
                        this.props.cardTable.setTableData(this.config.subGrid2, {rows: []});
                    }
                    callback && callback.call(this);
                }

            }
        });
    }

    //通过单据id查询单据信息
    getdata = (pk, callback) => {
        let data = {
            pk: pk || getDefData('id', this.config.datasource),
            NODE_TYPE: this.config.NODE_TYPE
        };
        pk && ajax({
            url: '/nccloud/uapbd/customer/queryCusomerCard.do',
            data,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        let {head, bodys} = data;
                        if (head) {
                            head[this.config.formId]['allpks'] = getDefData('allpks', this.config.datasource);
                            this.props.form.setAllFormValue({[this.config.formId]: head[this.config.formId]});
                            this.modifierMetaAgain(this.props, data);
                        }
                        if (bodys) {
                            if (bodys.hasOwnProperty(this.config.subGrid1)) {
                                this.setState({
                                    sub1totalcount: bodys[this.config.subGrid1]['rows'].length
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid1, {
                                        areacode:bodys[this.config.subGrid1].areacode,
                                        rows:bodys[this.config.subGrid1].rows
                                    });
                                });

                            } else {
                                this.props.cardTable.setTableData(this.config.subGrid1, {rows: []});
                                this.setState({
                                    sub1totalcount:0
                                });
                            }
                            if (bodys.hasOwnProperty(this.config.subGrid2)) {
                                this.setState({
                                    sub2totalcount: bodys[this.config.subGrid2]['rows'].length
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid2, bodys[this.config.subGrid2]);
                                });

                            } else {
                                this.props.cardTable.setTableData(this.config.subGrid2, {rows: []});
                                this.setState({
                                    sub2totalcount:0
                                });
                            }
                            if (bodys.hasOwnProperty(this.config.subGrid3)) {
                                this.setState({
                                    sub3totalcount: bodys[this.config.subGrid3]['rows'].length
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid3, bodys[this.config.subGrid3]);
                                });
                            } else {
                                this.props.cardTable.setTableData(this.config.subGrid3, {rows: []});
                                this.setState({
                                    sub3totalcount:0
                                });
                            }

                            if (bodys.hasOwnProperty(this.config.subGrid4)
                                && bodys[this.config.subGrid4].rows.length > 0) {
                                this.setState({
                                    sub4totalcount: bodys[this.config.subGrid4]['rows'].length,
                                    allFinancePk: bodys[this.config.subGrid4]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid4, bodys[this.config.subGrid4]);
                                    this.props.button.setButtonVisible([
                                        'subGrid4Edit',
                                        'subGrid4Del',
                                        'subGrid4Ref',
                                        'subGrid4Pri'], true);

                                });
                            } else {
                                //如果客户财务信息没有查询到数据，肩部按钮不显示
                                this.props.cardTable.setTableData(this.config.subGrid4, {rows: []});
                                this.props.button.setButtonVisible([
                                    'subGrid4Edit',
                                    'subGrid4Del',
                                    'subGrid4Ref',
                                    'subGrid4Pri'], false);
                                this.setState({
                                    sub4totalcount:0
                                });
                            }
                            if (bodys.hasOwnProperty(this.config.subGrid5) &&
                                bodys[this.config.subGrid5].rows.length > 0) {
                                this.setState({
                                    sub5totalcount: bodys[this.config.subGrid5]['rows'].length,
                                    allSaleInfoPk: bodys[this.config.subGrid5]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid5, bodys[this.config.subGrid5]);
                                    this.props.button.setButtonVisible([
                                        'subGrid5Addr',
                                        'subGrid5Edit',
                                        'subGrid5Del',
                                        'subGrid5Ref',
                                        'subGrid5Print'], true);
                                });

                            } else {
                                //如果客户销售信息没有查询到数据，肩部按钮不显示
                                this.props.cardTable.setTableData(this.config.subGrid5, {rows: []});
                                this.props.button.setButtonVisible([
                                    'subGrid5Addr',
                                    'subGrid5Edit',
                                    'subGrid5Del',
                                    'subGrid5Ref',
                                    'subGrid5Print',
                                ], false);
                                this.setState({
                                    sub5totalcount:0
                                });
                            }
                            if (bodys.hasOwnProperty(this.config.subGrid6)
                                && bodys[this.config.subGrid6].rows.length > 0) {
                                this.setState({
                                    sub6totalcount: bodys[this.config.subGrid6]['rows'].length,
                                    allCrtlPk: bodys[this.config.subGrid6]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(this.config.subGrid6, bodys[this.config.subGrid6]);
                                    this.props.button.setButtonVisible([
                                        'subG6Edit',
                                        'subG6Del',
                                        'subG6Ref',
                                        'subG6Pri'], true);
                                })
                            } else {
                                //如果客户信用控制信息没有查询到数据，肩部按钮不显示
                                this.props.cardTable.setTableData(this.config.subGrid6, {rows: []});
                                this.props.button.setButtonVisible([
                                    'subG6Edit',
                                    'subG6Del',
                                    'subG6Ref',
                                    'subG6Pri'], false);
                                this.setState({
                                    sub6totalcount:0
                                });
                            }
                            this.props.button.setButtonDisabled(['subGrid4Del', 'subGrid5Del', 'subG6Del'], true);
                            this.setState(this.state);
                        }
                       callback && callback.call(this);
                    } else {
                        this.cleanBillCard(() => {
                            this.buttontoggleShow(this.props, 'btncancel');
                        });
                    }
                }
            }
        });
        (pk || getDefData('id', this.config.datasource)) || this.cleanBillCard(() => {
            this.buttontoggleShow(this.props, 'btncancel');
        });

    }
    /**
     * 客户保存
     * @param gridId
     * @param props
     */
    modelSave = (gridId, props, callback) => {
        let {formId, pagecode, subGrid1,subGrid2, subGrid3} = props.config;
        gridId && props.cardTable.closeModel(gridId);

        props.cardTable.filterEmptyRows(subGrid3, ['pk_country', 'pk_taxes'], 'include');
        //过滤子表空行
        if (!(props.form.isCheckNow(formId) && props.cardTable.checkTableRequired(subGrid3)))
            return;
        let extspecilAggBill = props.createExtCardData(pagecode, formId, [subGrid1,subGrid2, subGrid3]);

        let ismobilecoopertive = extspecilAggBill.head.customer.rows[0].values.ismobilecoopertive
        if(ismobilecoopertive && ismobilecoopertive.value){
            let custlinkmans = extspecilAggBill.bodys.custcontacts.rows;
            let index = true;
            if(custlinkmans && custlinkmans.length > 0){
                for(let custlinkman of custlinkmans){
                    if(custlinkman.status != 3){
						index = false;
					}
                    let cell = custlinkman.values['pk_linkman.cell'];
                    if(!cell.value){
                       toast({title:this.state.json['10140CUST-000190'],color:'warning'})
                        return; 
                    }
                }
                if(index){
					toast({title:this.state.json['10140CUST-000189'],color:'warning'})
                        return; 
				}
            } else{
                toast({title:this.state.json['10140CUST-000189'],color:'warning'})
                return;
            }
        }


        props.validateToSave(extspecilAggBill, () => {
            ajax({
                url: '/nccloud/uapbd/customer/saveCustomer.do',
                data: {
                    'extspecilAggBill': extspecilAggBill,
                    'checkFlag': false,
                    'step': 'one',
                    'pagecode': props.config.pagecode
                },
                success: (res) => {
                    let {success, data} = res;
                    let {message, supplierVO} = data;
                    if (success) {
                        if (data) {
                            if (message) {
                                confirmUtil.call(this, {
                                    title: this.state.json['10140CUST-000025'], /* 国际化处理： 询问*/
                                    content: message,
                                    beSureBtnClick: () => {
                                        ajax({
                                            url: '/nccloud/uapbd/customer/saveCustomer.do',
                                            data: {
                                                'extspecilAggBill': extspecilAggBill,
                                                'checkFlag': true,
                                                'supplierVO': supplierVO,
                                                'step': 'two_yes',
                                                'pagecode': props.config.pagecode
                                            },
                                            success: (res) => {
                                                let {data} = res;
                                                callback.call(this, data);
                                            }
                                        });
                                    },
                                    cancelBtnClick: () => {
                                        ajax({
                                            url: '/nccloud/uapbd/customer/saveCustomer.do',
                                            data: {
                                                'extspecilAggBill': extspecilAggBill,
                                                'checkFlag': true,
                                                'step': 'two_no',
                                                'pagecode': props.config.pagecode
                                            },
                                            success: (res) => {
                                                let {data} = res;
                                                callback.call(this, data);

                                            }
                                        });
                                    }
                                })
                            } else {
                                callback.call(this, data);
                                this.toogleBtnState();
                                toast({color: 'success', title: this.state.json['10140CUST-000037']});
                                /* 国际化处理： 保存成功！*/
                            }

                        }
                    }
                }
            });

        }, {[formId]: 'form', [subGrid2]: 'cardTable', [subGrid3]: 'cardTable'}, 'card');
    }
    setCardData = (props, data) => {
        let {formId, subGrid1, subGrid2, subGrid3, subGrid4, subGrid5, subGrid6, appcode} = props.config;
        let pk_customer = '';
        if (data.hasOwnProperty('head') && data.head && data.head[formId]) {
            props.form.setAllFormValue({[formId]: data.head[formId]});
            //保存后返回的主键放到cardPagination，和cardCatche里面
            pk_customer = data.head[formId].rows[0].values['pk_customer'].value;
            props.cardPagination.setCardPaginationId({id: pk_customer, status: 1});
            setDefData('id', this.config.datasource, pk_customer);
        }
        //客户银行账户子表
        if (data.bodys && data.bodys[subGrid1]) {
            props.cardTable.setTableData(subGrid1, data.bodys[subGrid1]);
        }
        //客户联系人
        if (data.bodys && data.bodys[subGrid2]) {
            props.cardTable.setTableData(subGrid2, data.bodys[subGrid2]);
        } else {
            props.cardTable.setTableData(subGrid2, {rows: []});
        }
        //客户国家税类
        if (data.bodys && data.bodys[subGrid3]) {
            props.cardTable.setTableData(subGrid3, data.bodys[subGrid3]);
        } else {
            props.cardTable.setTableData(subGrid3, {rows: []});
        }
        //财务信息
        if (data.bodys && data.bodys[subGrid4]) {
            props.cardTable.setTableData(subGrid4, data.bodys[subGrid4]);
        }else{
            this.props.cardTable.setTableData(this.config.subGrid4, {rows: []});
            this.props.button.setButtonVisible([
                'subGrid4Edit',
                'subGrid4Del',
                'subGrid4Ref',
                'subGrid4Pri'], false);
        }
        //销售信息
        if (data.bodys && data.bodys[subGrid5]) {
            props.cardTable.setTableData(subGrid5, data.bodys[subGrid5]);
        }else{
            //如果客户销售信息没有查询到数据，肩部按钮不显示
            this.props.cardTable.setTableData(this.config.subGrid5, {rows: []});
            this.props.button.setButtonVisible([
                'subGrid5Addr',
                'subGrid5Edit',
                'subGrid5Del',
                'subGrid5Ref',
                'subGrid5Print',
            ], false);
        }
        //信用控制信息
        if (data.bodys && data.bodys[subGrid6]) {
            props.cardTable.setTableData(subGrid6, data.bodys[subGrid6]);
        }else{
            //如果客户信用控制信息没有查询到数据，肩部按钮不显示
            this.props.cardTable.setTableData(this.config.subGrid6, {rows: []});
            this.props.button.setButtonVisible([
                'subG6Edit',
                'subG6Del',
                'subG6Ref',
                'subG6Pri'], false);
        }
        props.setUrlParam({
            status: 'browse',
            id: pk_customer,
            appcode: appcode
        });
        this.buttontoggleShow(props);
    }

    onClickSearchBtn = () => {

    }
    //获取列表肩部信息
    getSubTable1Head = () => {
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ? <div><span
                        className="definition-search-title nc-theme-common-font-c">{this.state.json['10140CUST-000120']} | {this.state.json['10140CUST-000121']}：</span>{/* 国际化处理： 详细信息,总计*/}
                        <span
                            className="count nc-theme-common-font-c">{this.state.sub1totalcount}</span><span className="nc-theme-common-font-c">{this.state.json['10140CUST-000122']}</span>{/* 国际化处理： 条*/}
                    </div> : ''}
                </div>
            </div>
        )
    }
    getSubTable2Head = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ? <div><span
                        className="definition-search-title nc-theme-common-font-c">{this.state.json['10140CUST-000120']} | {this.state.json['10140CUST-000121']}：</span>{/* 国际化处理： 详细信息,总计*/}
                        <span
                            className='count nc-theme-common-font-c'>{this.state.sub2totalcount}</span><span className="nc-theme-common-font-c">{this.state.json['10140CUST-000122']}</span>{/* 国际化处理： 条*/}
                    </div> : ''}
                </div>
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons-2',//按钮注册中的按钮区域
                        onButtonClick: subtable2Click.bind(this)
                    })}
                </div>
            </div>
        )
    }
    getSubTable3Head = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ? <div><span
                        className="definition-search-title nc-theme-common-font-c">{this.state.json['10140CUST-000120']}| {this.state.json['10140CUST-000121']}：</span>{/* 国际化处理： 详细信息,总计*/}
                        <span
                            className="count nc-theme-common-font-c">{this.state.sub3totalcount}</span><span className="nc-theme-common-font-c">{this.state.json['10140CUST-000122']}</span>{/* 国际化处理： 条*/}
                    </div> : ''}
                </div>
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons-3',//按钮注册中的按钮区域
                        onButtonClick: subtable3Click.bind(this)
                    })}
                </div>
            </div>
        )
    }
    getSubTable4Head = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'shoulder-4',//按钮注册中的按钮区域
                        onButtonClick: subtable4Click.bind(this, 'shoulder'),
                        popContainer: document.querySelector('.nc-bill-table-area')
                    })}
                </div>
            </div>
        )
    }
    getSubTable5Head = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'shoulder-5',//按钮注册中的按钮区域
                        onButtonClick: subtable5Click.bind(this, 'shoulder'),
                        popContainer: document.querySelector('.nc-bill-table-area')
                    })}
                </div>
            </div>
        )
    }
    getSubTable6Head = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'shoulder-6',//按钮注册中的按钮区域
                        onButtonClick: subtable6Click.bind(this, 'shoulder'),
                        popContainer: document.querySelector('.nc-bill-table-area')
                    })}
                </div>
            </div>
        )
    }

    //客户财务信息卡片
    createCustFinanceForm = () => {
        const {form, button} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        return (
            <div>
                <div style={{float: 'right'}}>
                    <div className="definition-icons">
                        {createButtonApp({
                            area: 'definition-icons-4',//按钮注册中的按钮区域
                            onButtonClick: subtable4Click.bind(this, 'modal'),
                            popContainer: document.querySelector('.nc-bill-card')
                        })}
                        {/*去掉子表卡片分页*/}
                        {/*{this.state.subGridStatus ?*/}
                            {/*<NCPagination*/}
                                {/*first*/}
                                {/*last*/}
                                {/*prev*/}
                                {/*next*/}
                                {/*boundaryLinks*/}
                                {/*maxButtons={1}*/}
                                {/*items={this.state.allFinancePk.length}*/}
                                {/*onSelect={this.handleSubPageClick.bind(this)} /> : ''}*/}
                    </div>
                </div>
                <div className="nc-bill-form-area customer-nc-bill-form-area nc-theme-gray-area-bgc">
                    {createForm(this.config.custfinanceForm, {
                        expandArr: ['custfinancecard_1'],
                        onAfterEvent: modalAfterEvent.bind(this)
                    })}
                </div>
            </div>
        )
    }
    //客户销售信息卡片
    createCustSaleForm = () => {
        const {form, button} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        return (
            <div>
                <div style={{float: 'right'}}>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'definition-icons-5',//按钮注册中的按钮区域
                            onButtonClick: subtable5Click.bind(this, 'modal'),
                            popContainer: document.querySelector('.nc-bill-card')
                        })}
                        { /*去掉子表卡片分页*/}
                        {/*{this.state.subGridStatus ?*/}
                            {/*<NCPagination*/}
                                {/*first*/}
                                {/*last*/}
                                {/*prev*/}
                                {/*next*/}
                                {/*boundaryLinks*/}
                                {/*maxButtons={1}*/}
                                {/*items={this.state.allSaleInfoPk.length}*/}
                                {/*onSelect={this.handleSubPageClick.bind(this)} /> : ''}*/}
                    </div>
                </div>
                <div className="nc-bill-form-area customer-nc-bill-form-area nc-theme-gray-area-bgc">
                    {createForm(this.config.custsaleForm, {
                        expandArr: ['custsalecard_1'],
                        onAfterEvent: modalAfterEvent.bind(this)
                    })}
                </div>
            </div>
        )


    }
    //客户信用控制卡片
    createCustCreditctlForm = () => {
        const {form, button} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        return (
            <div>
                    <div className="header-button-area" style={{float: 'right'}}>
                        {createButtonApp({
                            area: 'definition-icons-6',//按钮注册中的按钮区域
                            onButtonClick: subtable6Click.bind(this, 'modal'),
                            popContainer: document.querySelector('.nc-bill-card')
                        })}
                        {/*去掉子表卡片分页*/}
                        {/*{this.state.subGridStatus ?*/}
                            {/*<NCPagination*/}
                                {/*first*/}
                                {/*last*/}
                                {/*prev*/}
                                {/*next*/}
                                {/*boundaryLinks*/}
                                {/*maxButtons={1}*/}
                                {/*items={this.state.allCrtlPk.length}*/}
                                {/*onSelect={this.handleSubPageClick.bind(this)} /> : ''}*/}
                    </div>
                <div className="nc-bill-form-area customer-nc-bill-form-area nc-theme-gray-area-bgc">
                    {createForm(this.config.creditctlForm, {
                        expandArr: ['custcreditctlcard_1'],
                        onAfterEvent: modalAfterEvent.bind(this)
                    })}
                </div>
            </div>
        )
    }
    //联系人模态框
    createLinkmanForm = () => {
        const {form} = this.props;
        const {createForm} = form;
        return (
            <div>
                <div className="nc-bill-form-area customer-nc-bill-form-area nc-theme-gray-area-bgc">
                    {createForm(this.config.linkman, {
                        onAfterEvent: modalAfterEvent.bind(this)
                    })}
                </div>

            </div>
        )
    }
    cardTableDoubleClick = (moduleId, props, record, index) => {
        this.setState({subGridStatus: true}, () => {
            if (moduleId === this.config.subGrid4) {
                let editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
                let browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
                props.form.setFormStatus(props.config.custfinanceForm, 'browse');
                //设置按钮显示隐藏
                props.button.setButtonVisible(browseStatusBtns, true);
                props.button.setButtonVisible(editStatusBtns, false);
                props.button.setButtonDisabled(['subGrid4Del'], false);
                this.loadSubGridData(
                    'modal',
                    props.config.subGrid4,
                    props.config.custfinanceForm,
                    props.config.pagecode,
                    'querySubFormOrGrid',
                    editStatusBtns,
                    browseStatusBtns,
                    record.values.pk_custfinance.value, () => {
                        props.modal.show('custFinanceModal');
                    }
                );
            } else if (moduleId === this.config.subGrid5) {
                let editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
                let browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
                props.form.setFormStatus(props.config.custsaleForm, 'browse');
                //设置按钮显示隐藏
                props.button.setButtonVisible(browseStatusBtns, true);
                props.button.setButtonVisible(editStatusBtns, false);
                props.button.setButtonDisabled(['subGrid5Del'], false);
                this.loadSubGridData(
                    'modal',
                    props.config.subGrid5,
                    props.config.custsaleForm,
                    props.config.pagecode,
                    'querySubFormOrGrid',
                    editStatusBtns,
                    browseStatusBtns,
                    record.values.pk_custsale.value, () => {
                        props.modal.show('custSaleModal');
                    }
                );
            } else if (moduleId === this.config.subGrid6) {
                let editStatusBtns = ['subG6ModalSave', 'subG6ModalCancel'];
                let browseStatusBtns = ['subG6Edit', 'subG6Del', 'subG6Ref', 'subG6Pri'];
                props.form.setFormStatus(props.config.creditctlForm, 'browse');
                //设置按钮显示隐藏
                props.button.setButtonVisible(browseStatusBtns, true);
                props.button.setButtonVisible(editStatusBtns, false);
                props.button.setButtonDisabled(['subG6Del'], false);
                this.loadSubGridData(
                    'modal',
                    props.config.subGrid6,
                    props.config.creditctlForm,
                    props.config.pagecode,
                    'querySubFormOrGrid',
                    editStatusBtns,
                    browseStatusBtns,
                    record.values.pk_custcreditctl.value, () => {
                        //真是日了狗 好好的模板客户信用控制域所属组织翻译不出来 现在特殊处理
                        let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer', 'pk_org']);
                        props.form.setFormItemsValue(props.config.creditctlForm, {'pk_customer.pk_org': formItemArr[1]});
                        //
                        props.modal.show('custCreditctlModal');
                    }
                );
            } else {
                return;
            }
        });
    }
    cardTableOnselected = (props, moduleId, record, index, status) => {
        let checkedRows = props.cardTable.getCheckedRows(moduleId);
        if (moduleId === props.config.subGrid4) {
            props.button.setButtonDisabled(['subGrid4Del'], checkedRows.length === 0);
        } else if (moduleId === props.config.subGrid5) {
            props.button.setButtonDisabled(['subGrid5Del'], checkedRows.length === 0);
        } else {
            props.button.setButtonDisabled(['subG6Del'], checkedRows.length === 0);
        }
    }
    cardTableOnselectedAll = (props, moduleId, status, length) => {
        if (moduleId === props.config.subGrid4) {
            props.button.setButtonDisabled(['subGrid4Del'], !status);
        } else if (moduleId === props.config.subGrid5) {
            props.button.setButtonDisabled(['subGrid5Del'], !status);
        } else {
            props.button.setButtonDisabled(['subG6Del'], !status);
        }
    }
    /**
     * 加载子表（财务信息，销售信息，信用控制信息）列表以及卡片数据，
     * 根据传入的参数不同去判断是列表肩部刷新还是模态框刷新还是删除后的重新加载数据
     *
     * */
    loadSubGridData = (areaFlag, subgridId, areacode, pagecode, actionName, editBtns, brwoseBtns, pk_customer, callback) => {
        ajax({
            url: '/nccloud/uapbd/custsubinfo/subGridAction.do',
            data: {
                pk: pk_customer,
                actionName: actionName,
                pagecode: pagecode,
                areacode: areacode,
                subGridId: subgridId,
                areaFlag: areaFlag
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    //请求成功
                    if (data) {
                        //返回data不为空
                        if (data.hasOwnProperty('message') && data.message) {
                            //提示异常信息
                            toast({'color': 'dager', 'content': data.message});
                        } else if (data.hasOwnProperty(subgridId)) {
                            if (subgridId === 'cust_finance') {
                                this.setState({
                                    allFinancePk: data[subgridId]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(subgridId, data[subgridId]);
                                    this.props.button.setButtonVisible(brwoseBtns, true);
                                    this.props.button.setButtonVisible(editBtns, false);
                                });
                            } else if (subgridId === 'cust_sale') {
                                this.setState({
                                    allSaleInfoPk: data[subgridId]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(subgridId, data[subgridId]);
                                    this.props.button.setButtonVisible(brwoseBtns, true);
                                    this.props.button.setButtonVisible(editBtns, false);
                                });
                            } else {
                                this.setState({
                                    allCrtlPk: data[subgridId]['allpks']
                                }, () => {
                                    this.props.cardTable.setTableData(subgridId, data[subgridId]);
                                    this.props.button.setButtonVisible(brwoseBtns, true);
                                    this.props.button.setButtonVisible(editBtns, false);
                                });

                            }
                        } else if (data.hasOwnProperty(areacode)) {
                            this.props.form.setAllFormValue({
                                [areacode]: data[areacode]
                            });
                            //真是日了狗 好好的模板客户信用控制域所属组织翻译不出来 现在特殊处理
                            let formItemArr = this.props.form.getFormItemsValue(this.config.formId, ['pk_customer', 'pk_org']);
                            this.props.form.setFormItemsValue(areacode, {'pk_customer.pk_org': formItemArr[1]});
                            //
                            this.props.button.setButtonVisible(brwoseBtns, true);
                            this.props.button.setButtonVisible(editBtns, false);
                        }
                    } else {
                        //返回数据为空 设置按钮不显示
                        let nulldata = {
                            rows: []
                        }
                        this.props.cardTable.setTableData(subgridId, nulldata);
                        this.props.button.setButtonVisible(brwoseBtns, false);
                        this.props.button.setButtonVisible(editBtns, false);
                    }
                    if (areaFlag === 'shoulder') {
                        if (subgridId === 'cust_finance') {
                            this.props.button.setButtonDisabled(['subGrid4Del'], true);
                        } else if (subgridId === 'cust_sale') {
                            this.props.button.setButtonDisabled(['subGrid5Del'], true);
                        } else {
                            this.props.button.setButtonDisabled(['subG6Del'], true);
                        }
                    } else {
                        if (subgridId === 'cust_finance') {
                            this.props.button.setButtonDisabled(['subGrid4Del'], false);
                        } else if (subgridId === 'cust_sale') {
                            this.props.button.setButtonDisabled(['subGrid5Del'], false);
                        } else {
                            this.props.button.setButtonDisabled(['subG6Del'], false);
                        }
                    }
                    callback && callback.call(this);
                }
            }
        });
    }
    /**
     * 子表信息(财务信息，销售信息，信用控制)模态框保存事件
     *
     **/
    SubModalSave = (subGridId, modalId, modalFormId, editBtns, browseBtns, callback) => {
        let modalformdata = this.props.form.getAllFormValue(modalFormId);
        let formItemArr = this.props.form.getFormItemsValue(this.config.formId, ['pk_customer', 'pk_org']);
        modalformdata.areacode = modalFormId;
        if (!(this.props.form.isCheckNow(modalFormId)))
            return;
        ajax({
            url: '/nccloud/uapbd/custsubinfo/custSubSave.do',
            data: {
                pageid: this.config.pagecode,
                model: modalformdata,
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (data.hasOwnProperty('message') && data.message) {
                            toast({'color': 'danger', 'content': data.message});
                        } else {
                            toast({'color': 'success', 'content': this.state.json['10140CUST-000106']});
                            /* 国际化处理： 修改成功！*/
                            //修改成功关闭模态框
                            //this.props.modal.close(modalId);
                            //修改成功不关闭模态框 刷新模态框数据
                            this.props.form.setAllFormValue({
                                [modalFormId]: data[modalFormId]
                            });
                            //真是日了狗 好好的模板客户信用控制域所属组织翻译不出来 现在特殊处理
                            this.props.form.setFormItemsValue(modalFormId, {'pk_customer.pk_org': formItemArr[1]});
                            //
                            this.setState({subGridStatus: true}, () => {
                                this.props.button.setButtonVisible(browseBtns, true);
                                this.props.button.setButtonVisible(editBtns, false);
                                this.props.form.setFormStatus(modalFormId, 'browse');
                                callback && callback.call(this);
                            });
                        }
                    }
                }
            }
        });
    }

    /**
     *打开或关闭分配向导模态框
     *
     * */
    closeAssignModal = (flag) => {
        this.state.myModalshow = flag;
        this.setState(this.state);
    }
    /**
     * 返回按钮处理事件
     * */
    handleReturnBtn = () => {
        this.props.pushTo('/list', {
            status: 'browse',
            pagecode:this.props.config.pagecodelist,
            appcode: this.props.config.appcode

        });
    }
    onHideUploader = () => {
        this.state.showUploader = false;
        this.setState(this.state);
    }

    //客户基本信息表单编辑前事件
    customerBaseinfoBeforeEvent(props, moduleId, key, value, data) {
        //给客户基本分类和上级客户参照添加组织过滤条件
        let meta = props.meta.getMeta();
        let pk_org = props.form.getFormItemsValue(moduleId, 'pk_org');
        if (pk_org != null && pk_org != undefined) {
            if (key === 'pk_custclass') {
                let custClassItem = meta['cust_share'].items.find(item => item.attrcode === 'pk_custclass');
                custClassItem.queryCondition = () => {
                    return {
                        pk_org: pk_org.value
                    }
                }
            }
            if (key === 'pk_customer_main') {
                let mainCustClassItem = meta['cust_share'].items.find(item => item.attrcode === 'pk_customer_main');
                mainCustClassItem.queryCondition = () => {
                    return {
                        pk_org: pk_org.value
                    }
                }
            }
        }
        props.meta.setMeta(meta);
        return true;
    }

    getDialogConfig = () => {
        return {
            showFooter: true,
            style: {
                dialogWidth: '400px',
                dialogHeight: '200px'
            },
            header: {
                dialogTitle: this.state.json['10140CUST-000107']/* 国际化处理： 确认删除?*/
            },
            body: {
                renderDialogContent: () => {
                    return [<h4 class="u-modal-title delete-style"><span class="iconfont icon-zhuyi1 warning"></span>删除</h4>,
                    <div class="u-modal-body" tabindex="0">{this.state.json['10140CUST-000123']}</div>]
                    /* 国际化处理： 后台删除,删除可能等待很长的时间,可以点击,按钮,调用后台任务执行*/
                }
            },
            footer: {
                renderSelfDefBtns: true,
                selfDefBtn: {
                    renderCancel: true,
                    buttonItem: [
                        {
                            name: this.state.json['10140CUST-000109'], action: () => {/* 国际化处理： 删除*/
                                this.onMainTableOperateDelClick('syncDelete')
                            }, style: {backgroundColor: '#eee', color: '#666'}
                        },
                        {
                            name: this.state.json['10140CUST-000108'], action: () => {/* 国际化处理： 后台删除*/
                                this.onMainTableOperateDelClick('asyncDelete')
                            }, style: {backgroundColor: '#E14C46', color: '#fff'}
                        },
                    ]
                }
            }
        }
    }
    onMainTableOperateDelClick = (isAsyncDel) => {
        let formItemsValue = this.props.form.getFormItemsValue(this.props.config.formId, 'pk_customer');
        ajax({
            url: '/nccloud/uapbd/customer/deleteCustomer.do',
            data: {
                pks: [formItemsValue.value],
                actionName: isAsyncDel
            },
            success: (res) => {
                if (res.success && isAsyncDel !== 'asyncDelete') {
                    //获取删除后的pk
                    let nextpk = this.props.cardPagination.getNextCardPaginationId({
                        id: formItemsValue.value,
                        status: 3
                    });
                    //设置删除了的pkstatus为3
                    this.props.cardPagination.setCardPaginationId({id: formItemsValue.value, status: 3});
                    this.props.setUrlParam({id: nextpk});
                    this.DeleteDialog.closeDialog();//关弹窗
                    this.getdata(nextpk, () => {
                        toast({color: 'success', content: this.state.json['10140CUST-000036']});
                        /* 国际化处理： 删除成功！*/
                    });
                }
            }
        })
        if (isAsyncDel === 'asyncDelete') {
            //获取删除后的pk
            let nextpk = this.props.cardPagination.getNextCardPaginationId({id: formItemsValue.value, status: 3});
            //设置删除了的pkstatus为3
            this.props.cardPagination.setCardPaginationId({id: formItemsValue.value, status: 3});
            this.props.setUrlParam({id: nextpk});
            this.DeleteDialog.closeDialog();//关弹窗
            this.getdata(nextpk, () => {
                toast({color: 'success', content: this.state.json['10140CUST-000110']});
                /* 国际化处理： 数据已停用并执行后台删除任务，稍后请在删除查询方案中查询结果*/
            });
        }
    }
    cleanBillCard = (callback) => {
        this.props.setUrlParam({status: 'browse'});
        this.props.form.EmptyAllFormValue(this.props.config.formId);
        this.props.cardTable.setTableData(this.props.config.subGrid1, {rows: []});
        this.props.cardTable.setTableData(this.props.config.subGrid2, {rows: []});
        this.props.cardTable.setTableData(this.props.config.subGrid3, {rows: []});
        this.props.cardTable.setTableData(this.props.config.subGrid4, {rows: []});
        this.props.cardTable.setTableData(this.props.config.subGrid5, {rows: []});
        this.props.cardTable.setTableData(this.props.config.subGrid6, {rows: []});
        callback && callback.call(this);
    }
    /**
     * 整单保存
     *
     */
    billcardWholeSave = () => {
        this.modelSave(this.props.config.subGrid3, this.props, (data) => {
            this.setCardData(this.props, data);
        });
    }
    /**
     * 整单保存
     *
     */
    handleSubPageClick =(eventKey)=>{
        console.log(eventKey)
    }

    toogleBtnState = ()=>{
        let status = this.props.form.getFormStatus(this.props.config.formId) || 'browse';
        let formItemArr = this.props.form.getFormItemsValue(this.config.formId, ['enablestate', 'frozenflag']);
        this.props.button.setButtonVisible(['freeze'], !formItemArr[1].value && status == 'browse');
        this.props.button.setButtonVisible(['btnUnFreeze'], formItemArr[1].value && status == 'browse');
        this.props.button.setButtonVisible(['enable'], formItemArr[0].value !== '2' && status == 'browse');
        this.props.button.setButtonVisible(['btnDisable'], formItemArr[0].value === '2' && status == 'browse');
    }

    renderPage = () => {
        let {cardTable, form, button, modal, cardPagination, BillHeadInfo} = this.props;
        const {createCardPagination} = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;
        let {createForm} = form;
        let {createCardTable} = cardTable;
        let {createButtonApp} = button;
        let {createModal} = modal;
        let status = this.props.form.getFormStatus(this.props.config.formId) || 'browse';
        return (
            <div id='nc-bill-extCard' className="nc-bill-extCard">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv className='nc-bill-header-area' areaCode={NCDiv.config.HEADER}>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                        title:this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10140CUST-000111'] : this.config.NODE_TYPE === 'GROUP_NODE' ? this.state.json['10140CUST-000112'] : this.state.json['10140CUST-000113'],
                                        backBtnClick: this.handleReturnBtn.bind(this)
                                    }
                                )}
                            </div>
                            {/*分页 */}
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    buttonLimit: 8,
                                    onButtonClick: buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                            {this.state.showSubGrid ? <div className='header-button-cardPagination'>
                                {createCardPagination({
                                    handlePageInfoChange: pageInfoClick.bind(this),
                                    dataSource: this.config.datasource,
                                    urlPkname: 'id'
                                })}
                            </div> : ''}
                    </NCDiv>
                    </NCAffix>
                    <div style={{display: this.state.showSubGrid ? '' : 'none'}}>
                        <NCAnchor>
                            <NCScrollLink
                                to={this.config.formId}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}>
                                <p>{this.state.ncAnchorobj.formId}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid1}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}>
                                <p>{this.state.ncAnchorobj.subGrid1}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid2}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}>
                                <p>{this.state.ncAnchorobj.subGrid2}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid3}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}>
                                <p>{this.state.ncAnchorobj.subGrid3}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid4}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}>
                                <p>{this.state.ncAnchorobj.subGrid4}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid5}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}
                            ><p>{this.state.ncAnchorobj.subGrid5}</p>
                            </NCScrollLink>
                            <NCScrollLink
                                to={this.config.subGrid6}
                                spy={true}
                                smooth={true}
                                duration={300}
                                offset={-100}
                            ><p>{this.state.ncAnchorobj.subGrid6}</p>
                            </NCScrollLink>
                        </NCAnchor>
                    </div>
                    <div className="nc-bill-form-area customer-nc-bill-form-area nc-theme-gray-area-bgc" >
                        <NCScrollElement name={this.config.formId}>
                            {createForm(this.config.formId, {
                                //设置客户基本信息区域展开
                                expandArr: [this.config.formId_share],
                                onAfterEvent: customerBaseinfoAfterEvent.bind(this),
                                onBeforeEvent: this.customerBaseinfoBeforeEvent.bind(this)
                            })}
                        </NCScrollElement>
                    </div>
                    <AssignStepModal
                        ref={(item => this.assignStepModal = item)}
                        {...{loadCardData: this.getdata, json: this.state.json}}
                        {...this.props} />
                    <AssignModal
                        ref={(item => this.assignModal = item)}
                        {...{loadSubGridData: this.loadSubGridData, json: this.state.json}}
                        {...this.props} />
                    <BatchEditModal
                        ref={(item => this.batchEditModal = item)}
                        {...this.props}
                        {...{
                            loadCardData: this.getdata,
                            json: this.state.json
                        }} />
                    <BatchEditStepModal
                        ref={(item => this.batchEditStepModal = item)}
                        {...this.props}
                        {...{loadCardData: this.getdata, json: this.state.json}} />
                    <ImportTempletDlg
                        ref={(item => this.importTempletDlg = item)}
                        {...this.props}
                        {...{json: this.state.json}}
                    />
                    {ReactDOM.createPortal(<OldDialog
                        {...this.getDialogConfig.call(this)} ref={(DeleteDialog) => {
                        this.DeleteDialog = DeleteDialog;
                    }}/>, document.body)}
                    {createModal('checkOrgbase', {
                        hasCloseBtn: true,
                        noFooter: true,
                        title: this.state.json['10140CUST-000114'], /* 国际化处理： 查看组织级客户*/
                        size: 'max',
                        content: <CheckOrgCust {...this.props} {...{loadGridData: '', json: this.state.json}} />,
                        closeModalEve: () => {
                            this.props.table.setAllTableData(this.props.config.customer_list_checkbyorg, {rows: []});
                            this.props.table.setAllTableData('assignOrgtable', {rows: []});

                        }
                    })}
                    {createModal('checkByOrg', {
                        hasCloseBtn: true,
                        noFooter: true,
                        title: this.state.json['10140CUST-000115'], /* 国际化处理： 客户按组织查看*/
                        size: 'max',
                        content: <CheckCustByOrg {...this.props} {...{json: this.state.json}}
                                                 ref={(item => this.checkCustByOrg = item)}/>,
                        closeModalEve: () => {
                            this.props.table.setAllTableData(this.checkCustByOrg.state.currentGridId, {rows: []});
                        }
                    })}
                    {createModal('custBankacc', {
                        hasCloseBtn: true,
                    })}
                    {createModal('custAddress', {
                        noFooter: true,
                        title: this.state.json['10140CUST-000080'], /* 国际化处理： 客户收货地址this.state.json['10140CUST-000080']*/
                        size: 'lg',
                        zIndex:211,
                        userControl: true,
                        closeModalEve: () => {
                            //自动关闭按钮好像不好用了，野路子方法为了防止点击X就关闭模态框
                            this.props.modal.show('custAddress');
                            //为了防止点击X就关闭模态框
                            this.props.editTable.getStatus('custAddress') !== 'browse' && confirmUtil({
                                title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                                content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                                beSureBtnClick: () => {
                                    this.props.editTable.setStatus('custAddress', 'browse');
                                    this.props.modal.close('custAddress');
                                }
                            });
                            this.props.editTable.getStatus('custAddress') !== 'browse' || this.props.modal.close('custAddress');
                        }
                    })}
                    {createModal('custRename', {
                        noFooter: true,
                        title: this.state.json['10140CUST-0010001'], /* 国际化处理： 客户更名记录*/
                        size: 'lg',
                        zIndex:211,
                        userControl: true,
                        closeModalEve: () => {
                            //自动关闭按钮好像不好用了，野路子方法为了防止点击X就关闭模态框
                            this.props.modal.show('custRename');
                            //为了防止点击X就关闭模态框
                            this.props.editTable.getStatus('custrename') !== 'browse' && confirmUtil({
                                title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                                content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                                beSureBtnClick: () => {
                                    this.props.editTable.setStatus('custrename', 'browse');
                                    this.props.modal.close('custRename');
                                }
                            });
                            this.props.editTable.getStatus('custrename') !== 'browse' || this.props.modal.close('custRename');
                        }
                    })}
                    {createModal('oprGenerate', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000116'], /* 国际化处理： 生成供应商*/
                        size: 'lg',
                        content: GenerateCust.call(this, this.props),
                        userControl: true
                    })}
                    {createModal('oprCorrelation', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000117'], /* 国际化处理： 关联供应商*/
                        size: 'lg',
                        content: CorrelationCust.call(this, this.props),
                        userControl: true,
                    })}
                    {createModal('custFinanceModal', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000101'], /* 国际化处理： 客户财务信息*/
                        size: 'lg',
                        zIndex:200,
                        content: this.createCustFinanceForm.call(this),
                        noFooter: true,
                        userControl: false,
                        closeModalEve: () => {
                            this.setState({subGridStatus: false}, () => {
                                let editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
                                let browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
                                //关闭模态框按钮切换
                                this.props.modal.close('custFinanceModal');
                                this.props.button.setButtonVisible(browseStatusBtns, true);
                                this.props.button.setButtonVisible(editStatusBtns, false);
                                this.loadSubGridData(
                                    'shoulder',
                                    this.props.config.subGrid4,
                                    this.props.config.custfinanceForm,
                                    this.props.config.pagecode,
                                    'querySubFormOrGrid',
                                    editStatusBtns,
                                    browseStatusBtns,
                                    this.props.getUrlParam('id')
                                );
                            })
                        }
                    })}
                    {createModal('custSaleModal', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000102'], /* 国际化处理： 客户销售信息*/
                        size: 'lg',
                        zIndex:200,
                        content: this.createCustSaleForm.call(this),
                        noFooter: true,
                        userControl: false,
                        closeModalEve: () => {
                            this.setState({subGridStatus: false}, () => {
                                //关闭模态框按钮切换
                                let editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
                                let browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
                                this.props.modal.close('custSaleModal');
                                this.props.button.setButtonVisible(browseStatusBtns, true);
                                this.props.button.setButtonVisible(editStatusBtns, false);
                                this.loadSubGridData(
                                    'shoulder',
                                    this.props.config.subGrid5,
                                    this.props.config.custsaleForm,
                                    this.props.config.pagecode,
                                    'querySubFormOrGrid',
                                    editStatusBtns,
                                    browseStatusBtns,
                                    this.props.getUrlParam('id'))
                            })
                        }
                    })}
                    {createModal('custCreditctlModal', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000103'], /* 国际化处理： 客户信用控制*/
                        size: 'lg',
                        zIndex:200,
                        content: this.createCustCreditctlForm.call(this),
                        noFooter: true,
                        userControl: false,
                        closeModalEve: () => {
                            this.setState({subGridStatus: false}, () => {
                                let editStatusBtns = ['subG6ModalSave', 'subG6ModalCancel'];
                                let browseStatusBtns = ['subG6Edit', 'subG6Del', 'subG6Ref', 'subG6Pri'];
                                //关闭模态框按钮切换
                                this.props.modal.close('custCreditctlModal');
                                this.props.button.setButtonVisible(browseStatusBtns, true);
                                this.props.button.setButtonVisible(editStatusBtns, false);
                                this.loadSubGridData(
                                    'shoulder',
                                    this.props.config.subGrid6,
                                    this.props.config.creditctlForm,
                                    this.props.config.pagecode,
                                    'querySubFormOrGrid',
                                    editStatusBtns,
                                    browseStatusBtns,
                                    this.props.getUrlParam('id')
                                )
                            })
                        }
                    })}
                    {createModal('linkmanModal', {
                        hasCloseBtn:true,
                        title:this.state.json['10140CUST-000118'], /* 国际化处理： 联系人*/
                        size:'lg',
                        zIndex:211,
                        content:this.createLinkmanForm.call(this)

                    })}
                    {createModal('checkAssignOrgModal', {
                        hasCloseBtn: true,
                        title: this.state.json['10140CUST-000119'], /* 国际化处理： 已分配组织查询*/
                        size: 'lg',
                        content: checkAssignOrg.call(this, this.props),
                        noFooter: true
                    })}
                </div>
                <div className="nc-bill-bottom-area nc-bill-tableTab-area-add-style nc-theme-gray-area-bgc nc-bill-bottom-area-my-use" style={{marginTop: 10}}>
                        <div className="nc-bill-table-area"  style={{display: this.state.showSubGrid ? '' : 'none'}}>
                            <NCScrollElement name={this.config.subGrid1}>
                                {createCardTable(this.config.subGrid1, {
                                    tableHead: this.getSubTable1Head.bind(this),
                                    //  modelSave: this.modelSave.bind(this),
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-bill-table-area">
                            <NCScrollElement name={this.config.subGrid2}>
                                {createCardTable(this.config.subGrid2, {
                                    tableHead: this.getSubTable2Head.bind(this),
                                    // modelSave: this.modelSave.bind(this, this.config.subGrid2),
                                    onRowDoubleClick: subGrid2RowClick.bind(this),
                                    onBeforeEvent: subGridBeforeEvent.bind(this),
                                    onAfterEvent: subGridAfterEvent.bind(this),
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-bill-table-area">
                            <NCScrollElement name={this.config.subGrid3}>
                                {createCardTable(this.config.subGrid3, {
                                    tableHead: this.getSubTable3Head.bind(this),
                                    modelSave: this.billcardWholeSave.bind(this),
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-bill-table-area" style={{display: this.state.showSubGrid ? '' : 'none'}}>
                            <NCScrollElement name={this.config.subGrid4}>
                                {createCardTable(this.config.subGrid4, {
                                    tableHead: this.getSubTable4Head.bind(this),
                                    //modelSave: this.modelSave.bind(this),
                                    onRowDoubleClick: this.cardTableDoubleClick.bind(this, this.config.subGrid4),
                                    onSelected: this.cardTableOnselected.bind(this),
                                    onSelectedAll: this.cardTableOnselectedAll,
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-bill-table-area" style={{display: this.state.showSubGrid ? '' : 'none'}}>
                            <NCScrollElement name={this.config.subGrid5}>
                                {createCardTable(this.config.subGrid5, {
                                    tableHead: this.getSubTable5Head.bind(this),
                                    // modelSave: this.modelSave.bind(this),
                                    onRowDoubleClick: this.cardTableDoubleClick.bind(this, this.config.subGrid5),
                                    onSelected: this.cardTableOnselected.bind(this),
                                    onSelectedAll: this.cardTableOnselectedAll,
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-bill-table-area" style={{display: this.state.showSubGrid ? '' : 'none'}}>
                            <NCScrollElement name={this.config.subGrid6}>
                                {createCardTable(this.config.subGrid6, {
                                    tableHead: this.getSubTable6Head.bind(this),
                                    // modelSave: this.modelSave.bind(this),
                                    onRowDoubleClick: this.cardTableDoubleClick.bind(this, this.config.subGrid6),
                                    onSelected: this.cardTableOnselected.bind(this),
                                    onSelectedAll: this.cardTableOnselectedAll,
                                    showIndex: true,
                                    showCheck: true,
                                    hideColSet: () => {
                                        return false;
                                    },
                                    hideSwitch: () => {
                                        return false;
                                    }
                                })}
                            </NCScrollElement>
                        </div>
                        <div className="nc-faith-demo-div2">
                            {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                            {this.state.showUploader && <NCUploader
                                billId={'uapbd/e4f48eaf-5567-4383-a370-a59cb3e8a451/' + getDefData('id', this.config.datasource)}
                                placement={'bottom_right'}
                                multiple={true}
                                onHide={this.onHideUploader.bind(this)}
                            />}
                        </div>
                    </div>
            </div>
        );
    }

    render() {
        return (<div>{this.state.loadLang ? this.renderPage() : <div/>}</div>)
    }
}

export default CustomerBaseCard;



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65