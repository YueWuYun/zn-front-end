//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    ajax,
    base,
    toast,
    getBusinessInfo,
    cardCache,
    high,
    createPageIcon,
    excelImportconfig
} from 'nc-lightapp-front';

const { setDefData, getDefData } = cardCache;
const { NCUploader } = high;
import { buttonClick, onClickSearchBtn, oprButtonClick } from './events';
import manageModePlugIn from '../../../public/utils/ManageModeUtils';
import DeleteDialogWapper from '../../../supplier/supplier_base/component/DeleteDialogWapper';
//import OldDialog from '../Utils/OldDialog'; //客户删除弹窗;
import Utils from '../../../public/utils/index';

const { ExcelImport } = high;
const { queryToastFunc } = Utils;
const { NCCheckbox } = base;
const { NCDiv } = base;
import AssignModal from '../distribStep/AssignModal';//分配
import BatchEditModal from '../batchEdit/BatchEditModal';//批改
import AssignStepModal from '../distribStep/AssignStepModal';//分配向导modal
import BatchEditStepModal from '../batchEdit/BatchEditStepModal';//批改向导
import CheckCustByOrg from "../checkCustByOrg";//客户按组织查看
import CheckOrgCust from "../checkOrgCust";//查看组织客户
import GenerateCust from "../generateCust/index";//生成供应商
import CorrelationCust from "../correlationCust/index";//关联供应商
import checkAssignOrg from '../checkAssignOrg/index';
import './index.less'

//已分配组织查询
/**
 * author zhenmx
 *
 */
class CustomerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allpks:[],
            billType: props.config.billType,
            pageInfo: { pageIndex: 0, pageSize: 10 },//保存列表分页信息
            searchValue: '',//忘了是啥
            checkValue: 'false',//忘了是啥
            oprCustomer: '',//选中行客户pk
            deleteRecord: {},
            currentOrg: '',
            context: {
                NODE_TYPE: this.props.config.NODE_TYPE,
                PermissionOrgIDs: []
            },//前端上下文信息 pk_org,pk_org_v,org_name,org_vname等等
            showUploader: false, //附件管理
            loadLang: false,
            json: {},
            x: {}
        }
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        let tempParam = {
            pagecode: props.config.pagecode
        }, langParam = {
            moduleId: '10140CUST', domainName: 'uapbd'
        }
        this.loadTempAndLang(props, tempParam, langParam, (tempdata, mutiJson, inlt) => {
            this.resetStateAfterLoadLang(mutiJson, inlt, tempdata, (data) => {
                let meta = data.template;
                this.config.oid = meta[props.config.searchId].oid;
                //先前这里在state里面放置了pk_org，
                // 后面不知道多少地方用到就先不改了。以后都从this.state.context里面取
                let buttonAry = [];
                data.button.map((obj) => {
                    if (obj.hasOwnProperty('area')
                        && obj.hasOwnProperty('key')
                        && obj.area === 'currency-opr-col') {
                        buttonAry.push(obj.key);
                    }
                });
                meta = this.modifierMeta(props, meta, buttonAry);
                props.button.setUploadConfig("import", excelImportconfig(
                    props,
                    'uapbd',
                    this.state.billType,
                    true, '',
                    {
                        'appcode': this.props.config.appcode,
                        'pagecode': this.props.config.importTemplate
                    }, () => {
                        this.loadGridData(this.getLoadParmData(this.props), this.setInitializeBtns)
                    }));
                let billtype = 'custaddress';
                if ('10140CUG' === this.props.config.appcode) {
                    billtype = 'custaddress';

                } else if ('10140CUB' === this.props.config.appcode) {
                    billtype = 'custaddress_glb';

                } else if ('10140CUO' === this.props.config.appcode) {
                    billtype = 'custaddress_org';

                }

                props.button.setUploadConfig("importcustadd", excelImportconfig(
                    props,
                    'uapbd',
                    billtype,
                    true, '',
                    {
                        'appcode': this.props.config.appcode,
                        'pagecode': this.props.config.importTemplate
                    }, () => {
                        this.loadGridData(this.getLoadParmData(this.props), this.setInitializeBtns)
                    }));

                props.button.setUploadConfig("bammodalimport", excelImportconfig(
                    props,
                    'uapbd',
                    'custbank',
                    true,
                    '',
                    {
                        'appcode': this.props.config.appcode,
                        'pagecode': this.props.config.importTemplate
                    }, () => {
                        //  this.browseList()
                    }));
                data.button && props.button.setButtons(data.button);
                /* 国际化处理： 确认删除该信息吗？*/
                props.meta.setMeta(meta, () => {
                    this.initialization();
                });
            })
        });
        // loadNCCResource.call(this,{
        //     props: props,
        //     pagecode: props.config.pagecode,
        //     moduleId: '10140CUST',
        //     domainName: 'uapbd',
        //     listeners:{
        //         success:()=>{},
        //         error:()=>{}
        //     },
        //     referObjs: [{
        //         name: 'PsnRefer',
        //         url: 'uapbd/refer/org/BusiRoleDeptTreeRef/index.js',
        //     }, {
        //         name: 'DeptRefer',
        //         url: 'uapbd/refer/org/BusiRoleDeptTreeRef/index.js',
        //     }],
        //     callback: (data) => {
        //         let {template, refer} = data;
        //         refer.PsnRefer({
        //             onchange: () => {
        //             }
        //         });
        //         this.refer = refer;
        //         let meta = template;
        //         this.config.oid = meta[props.config.searchId].oid;
        //         //先前这里在state里面放置了pk_org，
        //         // 后面不知道多少地方用到就先不改了。以后都从this.state.context里面取
        //         let buttonAry = [];
        //         data.button.map((obj) => {
        //             if (obj.hasOwnProperty('area')
        //                 && obj.hasOwnProperty('key')
        //                 && obj.area === 'currency-opr-col') {
        //                 buttonAry.push(obj.key);
        //             }
        //         });
        //         meta = this.modifierMeta(props, meta, buttonAry)
        //         props.button.setUploadConfig("import", excelImportconfig(
        //             props,
        //             'uapbd',
        //             this.props.config.billType,
        //             true,
        //             '',
        //             {
        //                 'appcode': this.props.config.appcode,
        //                 'pagecode': this.props.config.importTemplate
        //             },
        //             () => {
        //                 this.loadGridData(this.getLoadParmData(this.props), this.setInitializeBtns)
        //             }));
        //
        //         props.button.setUploadConfig("bammodalimport", excelImportconfig(
        //             props,
        //             'uapbd',
        //             'custbank',
        //             true,
        //             '',
        //             {
        //                 'appcode': this.props.config.appcode,
        //                 'pagecode': this.props.config.importTemplate
        //             },
        //             () => {
        //                 //this.browseList() 这方法是哪复制过来的？
        //             }));
        //         data.button && props.button.setButtons(data.button);
        //         /* 国际化处理： 确认删除该信息吗？*/
        //         props.meta.setMeta(meta, () => {
        //             this.initialization();
        //         });
        //     }
        // })
    }

    componentDidMount = () => {
        this.setInitializeBtns();
        this.props.button.setButtonDisabled(['btnPrint', 'output'], true);
    }
    setInitializeBtns = () => {
        this.props.button.setButtonDisabled([
            'batchedit', 'btnBatchEdit', 'btnListDel', 'btnBatchGenerateSup',
            'btnDistrib', 'distrib', 'undistrib', 'checkByOrg',
            'btnEnable', 'listEnable', 'listDisable', 'btnFreeze',
            'listFreeze', 'listUnFreeze'], true);
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
        props.MultiInit.getMultiLang(Object.assign(langParam, { callback: langCallback }));
    }
    resetStateAfterLoadLang = (mutiJson, inlt, tempdata, callback) => {
        let context = tempdata.context;
        this.state.context = context;
        this.state.currentOrg = context.pk_org;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this, tempdata))
    }
    modifierMeta = (props, meta, buttonAry) => {
        let { gridId, searchId, searchId_modal_batchEdit, searchId_modal, associateSup, custAddress, NODE_TYPE } = props.config;
        meta[gridId].status = 'browse';
        //bug fix for NCCLOUD-160346  子组件内表单不显示问题
        meta['custBatchEditForm'].areaVisible = true
        //添加form区域解构
        meta['formrelation'] = Object.assign({
            'accbasinfo': ['netbankinfo']
        }, meta['formrelation']);
        //客户节点列表查询区客户基本分类需要加上左上角业务单元过滤
        let pk_custClass_item = meta[searchId]['items'].find(item => item.attrcode === 'pk_custclass');
        if (!!pk_custClass_item) {
            pk_custClass_item.isShowUnit = true;
            pk_custClass_item.isShowDisabledData = true;
            pk_custClass_item.unitPropsExtend = { isShowDisabledData: true }
        }
        //客户向导分配查询区 客户基本分类参照
        let pk_custclassitem_searchId =
            meta[searchId_modal]['items'].find(item => item['attrcode'] === 'pk_custclass');
        if (!!pk_custclassitem_searchId) {
            pk_custclassitem_searchId.isShowUnit = true;
            pk_custclassitem_searchId.isShowDisabledData = true;
            pk_custclassitem_searchId.unitPropsExtend = { isShowDisabledData: true }
        }
        //客户向导批改 查询区客户基本分类参照
        let pk_custclassitem_searchId_modal_batchEdit =
            meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_custclass');
        if (!!pk_custclassitem_searchId_modal_batchEdit) {
            pk_custclassitem_searchId_modal_batchEdit.isShowUnit = true;
            pk_custclassitem_searchId_modal_batchEdit.isShowDisabledData = true;
            pk_custclassitem_searchId_modal_batchEdit.unitPropsExtend = { isShowDisabledData: true }
        }
        //客户向导分配批改 所属组织参照
        let orgmetaitem_batchedit = meta[searchId_modal]['items'].find(item => item['attrcode'] === 'pk_org');
        if (!!orgmetaitem_batchedit) {
            orgmetaitem_batchedit.isShowDisabledData = true;
        }
        //客户向导批改 所属组织参照
        let orgmetaitem_assign = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_org');
        if (!!orgmetaitem_assign) {
            orgmetaitem_assign.isShowDisabledData = true;
        }
        //客户  向导分配查询区  对应业务单元参照扩展条件
        let businessUnititembatch = meta[searchId_modal]['items'].find(item => item['attrcode'] === 'pk_financeorg');
        businessUnititembatch.queryCondition = () => {
            return {
                TreeRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
            }
        }
        //客户   向导批改查询区 对应业务单元参照扩展条件
        let businessUnititemassign = meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_financeorg');
        businessUnititemassign.queryCondition = () => {
            return {
                TreeRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
            }
        }
        //客户 列表查询区   对应业务单元参照扩展条件
        let businessUnititemsearch = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_financeorg');
        businessUnititemsearch.queryCondition = () => {
            return {
                TreeRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
            }
        }
        if (NODE_TYPE === 'ORG_NODE') {
            //业务单元节点 查询组织 pk_org_assign参照主组织权限过滤
            let pk_org_assign_item = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org_assign');
            if (!!pk_org_assign_item) {
                pk_org_assign_item.isShowDisabledData = true;
                pk_org_assign_item.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
            //业务单元节点 所属组织 pk_org参照主组织权限过滤
            let pk_orgitem = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org');
            if (!!pk_orgitem) {
                pk_orgitem.isShowDisabledData = true;
                pk_orgitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
            //客户批改 查询模板查询组织 添加主组织参照过滤
            let modalitem =
                meta[searchId_modal_batchEdit]['items'].find(item => item['attrcode'] === 'pk_org_assign');
            if (!!modalitem) {
                modalitem.isShowDisabledData = true;
                modalitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
            //客户批改查询区所属组织
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
            //集团节点 客户主查询区 添加主组织参照权限过滤
            let pk_orgitem = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org');
            if (!!pk_orgitem) {
                pk_orgitem.isShowDisabledData = true;
                pk_orgitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }
            //查看组织档案查询取所属组织 参照过滤
            let { searchId_modal_orgdoc } = props.config;
            let pk_org_search_item =
                meta[searchId_modal_orgdoc]['items'].find(item => item['attrcode'] === 'pk_org');
            if (!!pk_org_search_item) {
                pk_org_search_item.isShowDisabledData = true;
                pk_org_search_item.queryCondition = () => {
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.rateschema.action.PrimaryOrgSQLBuilderData'
                    }
                }
            }
            //客户查看组织档案 查询区客户基本分类参照
            let pk_custclassitem_searchId_modal_orgdoc =
                meta[searchId_modal_orgdoc]['items'].find(item => item['attrcode'] === 'pk_custclass');
            if (!!pk_custclassitem_searchId_modal_orgdoc) {
                pk_custclassitem_searchId_modal_orgdoc.isShowUnit = true;
                pk_custclassitem_searchId_modal_orgdoc.isShowDisabledData = true;
                pk_custclassitem_searchId_modal_orgdoc.unitPropsExtend = { isShowDisabledData: true }
            }
            //客户 查看组织档案查询区 对应业务单元参照扩展条件
            let businessUnititemorgdoc = meta[searchId_modal_orgdoc]['items'].find(item => item['attrcode'] === 'pk_financeorg');
            businessUnititemorgdoc.queryCondition = () => {
                return {
                    TreeRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustSearchAreaBusinessUnitExtendRef'
                }
            }
        } else if (NODE_TYPE === 'GLOBE_NODE') {
            let pk_orgitem = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org');
            if (!!pk_orgitem) {
                pk_orgitem.isShowDisabledData = true;
                pk_orgitem.queryCondition = () => {
                    return {
                        AppCode: props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder'
                    }
                }
            }

        }

        //客户编码添加超链接
        meta[gridId].items = meta[gridId].items.map((item) => {
            //item.width = '120px';
            if (item.attrcode === 'code') {
                item.render = (text, record) => {
                    return (
                        <span
                            style={{ color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                setDefData('id', this.config.datasource, record['pk_customer'].value);
                                let url = props.config.pushCardUrl;
                                props.pushTo(url, {
                                    status: 'browse',
                                    id: record['pk_customer'].value,
                                    pagecode: props.config.pagecodecard,
                                    appcode: props.config.appcode
                                });
                            }}
                        >
                            {record && record['code'] && record['code'].value}
                        </span>
                    );
                };
            }
            return item;
        });
        //添加操作列
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140CUST-000105'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: '230px',
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                //管控模式操作列按钮显示过滤
                let newbuttonAry = [];
                let rem = manageModePlugIn.call(this,
                    props.config.NODE_TYPE,
                    record.pk_org.value,
                    record.pk_group.value,
                    this.state.context.PermissionOrgIDs,
                    getBusinessInfo().groupId);
                return props.button.createOprationButton(rem.editFlag ? buttonAry : newbuttonAry, {
                    area: 'currency-opr-col',
                    buttonLimit: 3,
                    onButtonClick: oprButtonClick.bind(this, record, index)
                });
            }
        });
        return meta;
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
                renderContentTitle: () => {
                    return this.state.json['10140CUST-000107']
                },
                renderDialogContent: () => {
                    return this.state.json['10140CUST-000123']
                    // (
                    // [<h4 class="u-modal-title delete-style"><span class="iconfont icon-zhuyi1 warning"></span>删除</h4>,
                    // <div class="u-modal-body" tabindex="0">{this.state.json['10140CUST-000123']}</div>]
                    /* 国际化处理： 后台删除,删除可能等待很长的时间,可以点击,按钮,调用后台任务执行*/
                    // )

                    //<p
                    //style={{margin: '20px 20px 20px 20px'}}>{this.state.json['10140CUST-000123']}</p>;
                    /* 国际化处理： 后台删除,删除可能等待很长的时间,可以点击,按钮,调用后台任务执行*/
                }
            },
            footer: {
                renderSelfDefBtns: true,
                selfDefBtn: {
                    renderCancel: true,
                    buttonItem: [
                        {
                            name: this.state.json['10140CUST-000109'],
                            id: 'delete',
                            fieldid: 'del',
                            onClick: () => {/* 国际化处理： 删除*/
                                this.onMainTableOperateDelClick('syncDelete')
                            },
                            style: { backgroundColor: '#eee', color: '#666' }
                        },
                        {
                            name: this.state.json['10140CUST-000108'],
                            id: 'asyncDelete',
                            fieldid: 'backdel',
                            onClick: () => {/* 国际化处理： 后台删除*/
                                this.onMainTableOperateDelClick('asyncDelete')
                            },
                            style: { backgroundColor: '#E14C46', color: '#fff' }
                        },
                    ]
                }
            }
        }
    }
    onMainTableOperateDelClick = (isAsyncDel) => {
        let rowsdata = this.state.deleteRecord;
        let deleteIndex = [];
        let pks = [];
        rowsdata && rowsdata.map((r) => {
            deleteIndex.push(r.index);
            pks.push(r.data.values.pk_customer.value);
        });
        ajax({
            url: '/nccloud/uapbd/customer/deleteCustomer.do',
            data: {
                pks: pks,
                actionName: isAsyncDel
            },
            success: (res) => {
                if (res.success && isAsyncDel !== 'asyncDelete') {
                    this.props.table.deleteTableRowsByIndex(this.props.config.gridId, deleteIndex, true);
                    this.DeleteDialog.closeDialog();//关弹窗
                    this.loadGridData(this.getLoadParmData(this.props), () => {
                        toast({ color: 'success', content: this.state.json['10140CUST-000036'] });
                        /* 国际化处理： 删除成功！*/
                    });

                }
            }
        })
        if (isAsyncDel === 'asyncDelete') {
            this.props.table.deleteTableRowsByIndex(this.props.config.gridId, deleteIndex, true);
            this.DeleteDialog.closeDialog();//关弹窗
            this.loadGridData(this.getLoadParmData(this.props), () => {
                toast({ color: 'success', content: this.state.json['10140CUST-000110'] });
                /* 国际化处理： 数据已停用并执行后台删除任务，稍后请在删除查询方案中查询结果*/
            });
        }
    }
    initialization = () => {
        //客户-全局/业务单元节点 查看组织档案不显示
        this.config.NODE_TYPE === 'GROUP_NODE' || this.props.button.setButtonVisible('btnCheckOrgbase', false);
        let searchVal = getDefData('searchVal', this.config.datasource);
        //集团节点，所属组织默认值
        if (this.config.NODE_TYPE === 'GROUP_NODE') {
            let businessInfo = getBusinessInfo();
            this.props.search.setSearchValByField(this.config.searchId, 'pk_org', { value: businessInfo.groupId, display: businessInfo.groupName });
        }
        if (searchVal !== 'undefined' && searchVal && searchVal.conditions) {
            this.props.search.setSearchValue(this.config.searchId, searchVal);
            this.loadGridData(this.getLoadParmData(this.props), () => {
                // queryToastFunc()(param);
                this.setInitializeBtns();
            });
        } else {

        }
    }
    //获取loadGridData的参数
    getLoadParmData = (props) => {
        let checkflag = getDefData('checkflag', this.config.datasource);
        let searchVal = getDefData('searchVal', this.config.datasource);
        let pageInfo = props.table.getTablePageInfo(props.config.gridId);
        let cachepageInfo = getDefData('pageInfo', this.config.datasource);
        //当第一次缓存或者分页信息不等于10的时候，才会更新分页缓存信息
        (cachepageInfo == undefined || pageInfo.pageSize != 10) ? setDefData('pageInfo', this.config.datasource, pageInfo) : '';
        //如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用
        let paramdata = {
            pageInfo: (cachepageInfo == undefined || pageInfo.pageSize != 10) ? pageInfo : cachepageInfo,
            appcode: props.config.appcode,
            custcondition: {
                conditions: [{
                    field: 'NODE_TYPE',
                    value: {
                        firstvalue: props.config.NODE_TYPE
                    },
                    oprtyp: ''
                }]
            },
            queryAreaCode: props.config.searchId,
            querycondition: searchVal,
            oid: props.config.oid,
            querytype: 'tree',
            userdefObj: {
                areacode: props.config.gridId
            }
        };
        if (!checkflag) {
            paramdata.custcondition.conditions.push({
                field: 'enablestate',
                display: this.state.json['10140CUST-000145'], /* 国际化处理： 启用状态*/
                oprtype: '=',
                value: { firstvalue: '2', secondvalue: null }
            });
        }
        return paramdata;
    }
    //根据参数加载主列表列表页数据
    loadGridData = (paramData, callback) => {
        const _this = this;
        const { gridId, datasource, appcode, pagecode } = _this.config;
        const { table } = _this.props;
        const { setAllTableData } = table;
        let requestParam, requestUrl;
        if (paramData instanceof Array) {
            requestParam = {
                pkcustList: paramData,
                appcode: appcode,
                areacode: gridId,
                pagecode: pagecode
            }
            requestUrl = '/nccloud/uapbd/customer/querycustomerbypage.do';
        } else {
            requestParam = paramData;
            requestUrl = '/nccloud/uapbd/customer/querycustomer.do';
            if (!paramData.querycondition) {
                //如果获取查询区条件为undifined直接返回
                return;
            }
        }
        ajax({
            url: requestUrl,
            data: requestParam,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (res.hasOwnProperty('data') && data) {
                        _this.setState({allpks:data['customer_list'].allpks});
                        _this.props.button.setButtonDisabled(['btnPrint', 'output'], false);
                        _this.setInitializeBtns();
                        _this.setState({
                            context: {
                                PermissionOrgIDs: data.userjson && data.userjson.split(', ') || _this.state.context.PermissionOrgIDs
                            }
                        }, () => {
                            setAllTableData(gridId, data[gridId]);
                            data[gridId]['allpks'] && setDefData('allpks', datasource, data[gridId]['allpks']);
                            _this.props.ViewModel.setData(_this.config.datasource, {
                                simpleTable: {
                                    allpks: data[gridId]['allpks']
                                }
                            });
                            data.userjson && setDefData('PermissionOrgIDs', datasource, data.userjson.split(', '));
                        });
                        callback && callback.call(this, data[gridId]['allpks']);
                    } else {
                        _this.setState({allpks:[]});
                        _this.props.button.setButtonDisabled(['btnPrint', 'output', 'btnListDel', 'btnBatchGenerateSup'], true);
                        setAllTableData(gridId, { rows: [] });
                        callback && callback.call(this, []);
                    }
                }
            }
        })
    }
    //分页信息点击事件
    onClickPageInfo = (props, config, pks) => {
        let pageInfo = props.table.getTablePageInfo(props.config.gridId);
        let cachepageInfo = getDefData('pageInfo', this.config.datasource);
        //当第一次缓存或者分页信息不等于10的时候，才会更新分页缓存信息
        (cachepageInfo == undefined || pageInfo.pageSize != 10) ? setDefData('pageInfo', this.config.datasource, pageInfo) : '';

        this.loadGridData(pks, this.setInitializeBtns);
    }
    //显示停用按钮点击事件
    onCheckShowDisable(checked) {
        let searchData = this.props.search.getAllSearchData(this.props.config.searchId);
        setDefData('searchVal', this.config.datasource, searchData);
        //如果没有勾选显示停用，查询条件里面的enablestate = '2'只显示启用
        if (typeof (searchData) !== 'undefined' && searchData && searchData.conditions) {
            setDefData('checkflag', this.config.datasource, checked);
            this.loadGridData(this.getLoadParmData(this.props), this.setInitializeBtns);
        } else {
            return;
        }
    }
    //表格行选中改变事件
    onSelectedChange = (props) => {
    }
    //表格双击行事件
    onRowDoubleClick = (record, index, props) => {
        let url = props.config.pushCardUrl;
        setDefData('id', this.config.datasource, record.pk_customer.value);
        props.pushTo(url, {
            status: 'browse',
            id: record.pk_customer.value,
            pagecode: props.config.pagecodecard,
            appcode: props.config.appcode
        });

    }
    beforeAddCopy = (props, callback) => {
        ajax({
            url: '/nccloud/uapbd/customer/baseAction.do',
            data: {
                actionName: 'beforeAddCopy'
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data && data.hasOwnProperty('message')) {
                        toast({ color: 'danger', content: data.message });
                    } else {
                        callback.call(this);
                    }
                }
            }
        });
    }
    //关闭附件管理

    onHideUploader = () => {
        this.state.showUploader = false;
        this.setState(this.state);
    }
    //行checkbox选中事件
    onSelected = (props, moduleId, record, index, status) => {
        //此处控制按钮的隐藏显示及启用状态
        let tableData = props.table.getCheckedRows(moduleId);
        let length = tableData.length;//获取列表页选择数据的行数
        this.props.button.setButtonDisabled(['btnListDel',
            'batchedit', 'btnBatchEdit',
            'btnDistrib', 'distrib', 'undistrib',
            'checkByOrg', 'btnBatchGenerateSup'], length === 0);
        //如果选中的是一条 停启用只有一个可以使用 冻结解冻只有一个可以使用
        this.props.button.setButtonDisabled(['btnEnable', 'listEnable'], length === 0 || (length === 1 && tableData[0].data.values.enablestate.value === '2'));
        this.props.button.setButtonDisabled(['listDisable'], length === 0 || (length === 1 && tableData[0].data.values.enablestate.value !== '2'));
        this.props.button.setButtonDisabled(['btnFreeze', 'listFreeze'], length === 0 || (length === 1 && tableData[0].data.values.frozenflag.value));
        this.props.button.setButtonDisabled(['listUnFreeze'], length === 0 || (length === 1 && !tableData[0].data.values.frozenflag.value));
        this.props.button.setButtonDisabled(['btnBatchGenerateSup'], length === 0 || (length === 1 && tableData[0].data.values.issupplier.value));
        this.setState(this.state);//平台提供的api设置按钮禁用状态好像不及时更新，故此处手动设置

    }
    onSelectedAll = (props, moduleId, status, length) => {
        this.props.button.setButtonDisabled(['btnListDel',
            'batchedit', 'btnBatchEdit',
            'btnDistrib', 'distrib', 'undistrib', 'btnBatchGenerateSup'], !status);
        this.setState(this.state);
    }
    renderPage = () => {
        const { table, button, search, modal, BillHeadInfo } = this.props;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createModal } = modal;
        const { createBillHeadInfo } = BillHeadInfo;
        const { createSimpleTable } = table;
        return (
            <div className="nc-single-table">
                {createModal('checkOrgbase', {
                    hasCloseBtn: true,
                    noFooter: true,
                    title: this.state.json['10140CUST-000114'], /* 国际化处理： 查看组织级客户*/
                    size: 'max',
                    content: <CheckOrgCust {...this.props}{...{ json: this.state.json }} />,
                    closeModalEve: () => {
                        this.props.table.setAllTableData(this.props.config.customer_list_checkbyorg, { rows: [] });
                        this.props.table.setAllTableData('assignOrgtable', { rows: [] });

                    }
                })}
                {createModal('checkByOrg', {
                    hasCloseBtn: true,
                    noFooter: true,
                    title: this.state.json['10140CUST-000115'], /* 国际化处理： 客户按组织查看*/
                    size: 'max',
                    content: <CheckCustByOrg {...this.props}{...{ json: this.state.json }}
                        ref={(item => this.checkCustByOrg = item)} />,
                    closeModalEve: () => {
                        this.props.table.setAllTableData(this.checkCustByOrg.state.currentGridId, { rows: [] });
                    }
                })}
                {createModal('custBankacc', {
                    hasCloseBtn: true,
                    userControl: true,
                })}
                {createModal('custAddress', {
                    hasCloseBtn: true,
                    userControl: true,

                })}
                {createModal('custRename', {
                    hasCloseBtn: true,
                    userControl: true,

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
                {createModal('checkAssignOrgModal', {
                    hasCloseBtn: true,
                    title: this.state.json['10140CUST-000119'], /* 国际化处理： 已分配组织查询*/
                    size: 'lg',
                    noFooter: true,
                    content: checkAssignOrg.call(this, this.props)
                })}
                {/* 头部 header */}
                <AssignStepModal
                    ref={(item => this.assignStepModal = item)}
                    {...this.props}
                    {...{
                        loadGridData: this.loadGridData,
                        getRequestParam: this.getLoadParmData,
                        json: this.state.json
                    }
                    }
                />
                <AssignModal
                    ref={(item => this.assignModal = item)}
                    {...this.props}
                    {...{
                        loadGridData: this.loadGridData,
                        getRequestParam: this.getLoadParmData,
                        json: this.state.json
                    }}
                />
                <BatchEditModal
                    ref={(item => this.batchEditModal = item)}
                    {...this.props}
                    {...{ loadGridData: this.loadGridData, getRequestParam: this.getLoadParmData, json: this.state.json }}
                />
                <BatchEditStepModal
                    ref={(item => this.batchEditStepModal = item)}
                    {...this.props}
                    {...{ loadGridData: this.loadGridData, getRequestParam: this.getLoadParmData, json: this.state.json }}
                />
                {ReactDOM.createPortal(<DeleteDialogWapper
                    {...this.getDialogConfig.call(this)} Lang={this.state.json} ref={(DeleteDialog) => {
                        this.DeleteDialog = DeleteDialog;
                    }} />, document.body)}
                <NCDiv className="nc-singleTable-header-area" areaCode={NCDiv.config.HEADER}>
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10140CUST-000111'] : this.config.NODE_TYPE === 'GROUP_NODE' ? this.state.json['10140CUST-000112'] : this.state.json['10140CUST-000113'],
                            initShowBackBtn: false
                        }
                        )}
                        {/* 显示停用  showOff*/}
                        <div className="title-search-detail">
                            <span className="showOff">
                                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                    checked={getDefData('checkflag', this.config.datasource)}>{this.state.json['10140CUST-000028']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                            </span>
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 8,
                            onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </NCDiv>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: onClickSearchBtn.bind(this),
                        oid: this.config.oid
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.props.config.gridId, {
                        handlePageInfoChange: this.onClickPageInfo.bind(this),
                        selectedChange: this.onSelectedChange.bind(this),
                        onRowDoubleClick: this.onRowDoubleClick.bind(this),
                        onSelected: this.onSelected.bind(this),
                        onSelectedAll: this.onSelectedAll.bind(this),
                        datasource: this.config.datasource,
                        showIndex: true,
                        showCheck: true
                    })}
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
                <ExcelImport
                    {...this.props}
                    moduleName='uapbd'//模块名
                    billType={this.state.billType}//单据类型
                    selectedPKS={[]}
                    appcode={this.props.config.appcode}
                    pagecode={this.props.config.importTemplate}
                />
            </div>
        )
    }

    render() {
        return (<div>{this.state.loadLang ? this.renderPage() : <div />}</div>)
    }
}

export default CustomerTable;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65