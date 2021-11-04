//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ajax, base,high, print, toast, output,cacheTools,promptBox,excelImportconfig} from 'nc-lightapp-front';
import DeleteDialogWapper from '../component/DeleteDialogWapper';
import DialogWapper from '../component/DialogWapper';
import AttachmentMng from '../component/AttachmentMng'; //附件管理
import SupOrgBrowse from '../component/SupOrgBrowse'; //按组织查看
import SupBrowseOrgDoc from '../component/SupBrowseOrgDoc'; //查看组织档案
import QueryHasAssignOrg from '../component/QueryHasAssignOrg'; //已分配组织查询
import OrgSelect from '../assign/QuickAssign'; //组织选择（分配使用）
import AssignStepDialog from '../assign/AssignStepDialog'; //向导分配
import BatchUpdateWarzid from '../batchedit/BatchUpdateWarzidPage'; //重构后的向导批改
import SupTemplate from '../../../public/pubComponent/datatemplet/importTempletDlg';
import {
    getCurCardStatus,onCardButtonClick,onCardTableButtonClick,onFinanceOrPurchaseCardButtonClick,
    onFinanceTableButtonClick,onStockTableButtonClick,setCardButtonStatus,setCardStatus,setFinanceCardBtnStatus,onFinanceOrStockDelete,
    querySupFinanceOrStockTableData,deleteFinanceOrStock
} from '../component/SupCardButtonAction';
import {onMainTableButtonClick,onMainTableOprButtonClick,setMainTablePageButton} from '../component/SupMainTableBtnAction';
import {
    convertForm2GridData,dealRefTemplateItems,getCurParam,getDialogConfig,hasOperateAuth,resetTableRows,resizeForm,
    setCodeAndDeleteStatusFieldLink,updateFormItemDisable,updateFormItemRequire,setFinanceAndStockReferCondition,showAddressBookDialog,
    showFormulaSetting,validateFormulaSetting,filterEmptyData
} from '../utils/SupplierUtils';
import SyncLoadComp from '../utils/SyncLoadComp';
import './index.less';
const EMPTY_FUNC = ()=>{};
const {PrintOutput,ExcelImport}=high;
const {NCCheckbox,NCScrollLink,NCScrollElement,NCAnchor,NCAffix,NCPopconfirm,NCDiv} = base;
const dataSource ='supplier.base.datasource';
/**
 * 供应商
 * @author liupzhc
 * @type {{targetOrgName: string}}
 */
/**
 * 常量属性
 * @type {{PK_SUPPLIER: string, PK_SUPFINANCE: string, PK_SUPSTOCK: string, FINANCE: string, PURCHASE: string, SUPFINANCE_CARD: string, SUPSTOCK_CARD: string}}
 */
const constProp = {
    PK_SUPPLIER:'pk_supplier', //供应商主键
    PK_SUPFINANCE:'pk_supfinance',//供应商财务信息主键
    PK_SUPSTOCK:'pk_supstock',//供应商采购信息主键
    PK_FINANCEORG:'pk_financeorg',//供应商财务组织主键
    FINANCE:'finance',//财务信息列表id
    PURCHASE:'purchase',//采购信息列表id
    SUPFINANCE_CARD:'supfinance_card',//财务信息卡片id
    SUPSTOCK_CARD:'supstock_card',//采购信息卡片id
    SUP_BASE_CARD:'supplier_baseInfo_card'//供应商基本信息卡片区域编码
};
const referUrls = {
    BusiUnitRefer:'uapbd/refer/org/BusinessUnitTreeRef/index'//业务单元参照
};
/**
 * 页面状态
 * @type {{BROWSE: string, EDIT: string}}
 */
const statusProp = {BROWSE:'browse',EDIT:'edit'};
//全局组织pk
const PK_GLOBE = 'GLOBLE00000000000000';
/**
 * 创建页面参数
 * @param pagecode
 * @param appcode
 * @returns {*}
 */
const createUIDomParam = function(pagecode, appcode){
    var param  = {pagecode:pagecode};
    return window.location.href.startsWith('http://localhost:3006') ? {...param, appcode: appcode} : param;
};
export default class Supplier extends Component{
    constructor(props){
        super(props);
        /**
         * 请求初始参数
         * @param callback : 1、获得envParam,2、处理元数据项 3、设置按钮状态
         */
        var initEnvParam = (callback) => {    //init
            ajax({
                url:'/nccloud/uapbd/supplier/envParamUrl.do',
                data: {
                    nodeType:this.props.nodeType || 'GLOBE_NODE',
                    pk_curOrg:'',
                },
                success:(res)=>{
                    callback &&  callback(res.data || {});
                }
            });
        }
        /**
         * 处理元数据项
         * @param meta
         */
        var dealMetaItems = (meta) => {
            const addOperateField = (meta) =>{
                meta['supplier_baseInfo'].items.push(this.state.table.mainTable.operator);//基本信息列表操作列
                meta['finance'].items.push(this.state.card.table.finance.field);//财务信息列表操作列
                meta['purchase'].items.push(this.state.card.table.purchase.field);//采购信息列表操作列
            };
            dealRefTemplateItems.call(this,meta);//处理参照
            setCodeAndDeleteStatusFieldLink.call(this,meta);//设置编码和删除状态链接
            addOperateField(meta);//添加操作列
            //设置供应商银行账户 基本信息和网银信息的formrelation关系
            meta.formrelation = new Object();
            meta.formrelation['accbasinfo'] = ['netbankinfo'];
            this.setOrgAssignToCache();
        };
        //初始state
        this.state = {loadLang:false,envParam:undefined,/*初始参数*/indivOrg:undefined,billType:this.props.billType};
        //创建供应商页面
        this.initLoad({
            //模板参数
            tempParam:{...createUIDomParam(this.props.pagecode, this.props.appcode)},
            //多语参数
            langParam:{moduleId: '10140SUG',domainName: 'uapbd'}
            },({data,lang}={})=>{
                var afterInitLoad = ()=>{
                    this.Lang = lang;//多语资源
                    //回调中先设置state,再处理initEnvParam回调
                    initEnvParam((param) => {
                        //获得个性化参数
                        this.state.envParam = this.getInitEnvParamObj(data.context,param.org);
                        //个性化设置的org
                        this.state.indivOrg = data.context;
                        const companyDrawUrl = '/iuapmdm_fr/enterprise.html#/';
                        this.state.busiPortraitUrl = companyDrawUrl || param.busiPortraitUrl;
                        //重置state
                        this.resetStateAfterLoadLang(()=>{
                            this.props.meta.setMeta(data.template,()=>{
                                //处理元数据
                                dealMetaItems(data.template);
                                //设置查询区默认值
                                !this.state.openCard && this.setSearchAreaOrgDefaultValue();
                                //使用NCTable,适配模板
                                this.meta2TableFieldAdapter('custsupbankacc');
                                //适配供应商供货目录联查供应商
                                this.props.getUrlParam('id') && this.setState({openCard:true,directOpenCard:true,relateQueryId:this.props.getUrlParam('id')},()=>{
                                    setCardButtonStatus.call(this,'browse');
                                    this.state.relateQueryId && this.initPageData(this.setCardValue,this.setCardStatus);
                                });
                            });
                                   //初始页面 设置按钮状态
                                   debugger
                                   this.props.button.setButtons(data.button || [],()=>{
                                    let excelimportconfig = excelImportconfig(props,'uapbd',this.props.billType,true,'',{'appcode':this.props.appcode , 'pagecode':this.props.pagecode},()=>{
                                        this.onSearch({isClickSearch:false,isRefreshList:false,checagepage:true},this.setTableData);
                                    });
                                    props.button.setUploadConfig("Import",excelimportconfig);
                                    let billtype = 'supplieraddress';
                                    if('10140SUG' === this.props.appcode){
                                        billtype = 'supplieraddress';
         
                                    }else if('10140SUO' === this.props.appcode){
                                        billtype = 'supplieraddress_org';
        
                                    }else if('10140SUB' === this.props.appcode){
                                        billtype = 'supplieraddress_glb';
                                    }
                                    let excelimportaddconfig = excelImportconfig(props,'uapbd',billtype,true,'',{'appcode':this.props.appcode , 'pagecode':this.props.pagecode},()=>{
                                        this.onSearch({isClickSearch:false,isRefreshList:false,checagepage:true},this.setTableData);
                                    });
                                    props.button.setUploadConfig("importsuppadd",excelimportaddconfig);
                                    setMainTablePageButton.call(this,true);
                                });
                        })
                    });
                };
                SyncLoadComp.call(this,{
                    props:this.props,
                    urlsArr:Object.values(referUrls),
                    success:()=>{afterInitLoad()},
                    fail:()=>{afterInitLoad()}
                })
                
            });
    }
    Urls = {
        addOrCopyValidateUrl:'/nccloud/uapbd/supplier/validateAddOrCopy.do',
        addUrl:'/nccloud/uapbd/supplier/addSupplier.do',
        editUrl:'/nccloud/uapbd/supplier/editSupplier.do',
        saveUrl:'/nccloud/uapbd/supplier/saveSupplier.do',
        saveAddUrl:'/nccloud/uapbd/supplier/saveAddSupplier.do',
        cancelUrl:'/nccloud/uapbd/supplier/cancelSupplier.do',
        delLineUrl:'/nccloud/uapbd/supplier/delLineUrl.do',
        saveLinkmanUrl:'/nccloud/uapbd/supplier/saveLinkman.do',
        enableSupplierUrl:'/nccloud/uapbd/supplier/enableSupplier.do',
        queryLinkmanUrl:'/nccloud/uapbd/supplier/queryLinkman.do',
        queryCardUrl:'/nccloud/uapbd/supplier/querycard.do',
        delSupplier:'/nccloud/uapbd/supplier/deleteSupplier.do',
        copySupplierUrl:'/nccloud/uapbd/supplier/copySupplier.do',
        approveSupplierUrl:'/nccloud/uapbd/supplier/approveSupplier.do',
        freezeSupplierUrl:'/nccloud/uapbd/supplier/freezeSupplier.do',
        createCustUrl:'/nccloud/uapbd/supplier/createCust.do',
        saveCreateCustUrl:'/nccloud/uapbd/supplier/saveCreateCust.do',
        cancelCreateCustUrl:'/nccloud/uapbd/supplier/cancalCreateCust.do',
        associateCustUrl:'/nccloud/uapbd/supplier/associateCust.do',
        saveAssociateCustUrl:'/nccloud/uapbd/supplier/saveAssociateCust.do',
        queryHasAssignOrgUrl:'/nccloud/uapbd/supplier/qryHasAssignedOrg.do',
        assignUrl:'/nccloud/uapbd/supplier/supAssign.do',
        cancelAssignUrl:'/nccloud/uapbd/supplier/cancelAssign.do',
        queryFinanceInfoUrl:'/nccloud/uapbd/supplier/queryFinanceInfo.do',
        queryStockInfoUrl:'/nccloud/uapbd/supplier/queryStockInfo.do',
        delFinanceInfoUrl:'/nccloud/uapbd/supplier/delSupFinanceInfo.do',
        delStockInfoUrl:'/nccloud/uapbd/supplier/delSupStockInfo.do',
        saveFinanceInfoUrl:'/nccloud/uapbd/supplier/saveFinanceInfo.do',
        saveStockInfoUrl:'/nccloud/uapbd/supplier/saveStockInfo.do',
        onFinancPayFreezeUrl:'/nccloud/uapbd/supplier/financePayFreeze.do',
        onFinanceTicketFreezeUrl:'/nccloud/uapbd/supplier/financeTicketFreeze.do',
        querySupFinanceTableUrl:'/nccloud/uapbd/supplier/querySupFinanceTable.do',
        querySupStockTableUrl:'/nccloud/uapbd/supplier/querySupStockTable.do',
        supStockFreezeUrl:'/nccloud/uapbd/supplier/supStockFreeze.do',
        printSupBaseUrl:'/nccloud/uapbd/supplier/printSupplier.do',
        printSupFinanceUrl:'/nccloud/uapbd/supplier/printFinance.do',
        printSupStockUrl:'/nccloud/uapbd/supplier/printStock.do',
        beforeSaveValidateUrl:'/nccloud/uapbd/supplier/beforeSaveValidate.do',
        quickBatchUpdateUrl:'/nccloud/uapbd/supplier/quickBatchUpdate.do',
        batchUpdateWarzidUrl:'/nccloud/uapbd/supplier/batchUpdateWarzid.do',
        rollbackCodeUrl:'/nccloud/uapbd/supplier/rollbackCode.do',
        beforeEditUrl:'/nccloud/uapbd/supplier/beforeEdit.do',
        beforeSupStockEditUrl:'/nccloud/uapbd/supplier/beforeSupStockEdit.do',
        batchCreateCustUrl:'/nccloud/uapbd/supplier/batchCreateCust.do',
        beforeEditSupValidateUrl:'/nccloud/uapbd/supplier/beforeEditSupValidate.do'
    };
    //多语对象
    Lang = {};
    inlt = null;
    /**
     * 初始化页面
     * 
     * @Param {tempParam,langParam,...otherLoad}
     *      tempParam：模板参数配置
     *      langParam：多语参数配置
     *      otherLoad：对象数组 每个对象要求都是Promise对象，如：[new Promise((resolve)=>{resolve(true)})]
     * @Param callback  加载成功后回调
     */
    initLoad = ({tempParam,langParam,...otherLoad }={},callback = ()=>{})=>{
        //模板
        let loadTemp = new Promise((resolve)=>{
                this.props.createUIDom(tempParam,(data)=>{
                    resolve(data); 
                });
            });
        //多语
        let loadLang = new Promise((resolve)=>{
                this.props.MultiInit.getMultiLang(Object.assign(langParam,{callback:(json, status, inlt)=>{
                    this.inlt = inlt;
                    resolve(json);
                 }})); 
             });
        Promise.all([loadTemp,loadLang,...otherLoad]).then((res)=>{
            let [data,lang,...others] = res;
            callback({data,lang,...others});
        }).catch((error)=>{
            throw new Error(error);
        });
        // let temp,lang;//模板 、多语
        // this.props.createUIDom(tempParam,(data)=>{
        //         temp = data;
        //         if(!!lang){
        //             callback && callback(temp,lang);
        //         } 
        // });
        // this.props.MultiInit.getMultiLang(Object.assign(langParam,{callback:(json, status, inlt)=>{
        //     lang = json;
        //     this.inlt = inlt;
        //     if(!!temp){
        //         callback && callback(temp,lang); 
        //     }
        // }}));   
    }
    /**
     * 加载多语之后  重置state
     */
    resetStateAfterLoadLang = (callback)=>{
        this.state = Object.assign({
            pageInfo:null,//记录列表分页信息
            loadLang:true,//加载多语
            envParam:undefined,//初始参数
            openCard:false,//打开卡片参数
            openDialog:false,
            openDeleteDialog:false,
            batchUpdateStepClick:false,//向导批改参数
            assignStepClick:false,//向导分配参数
            loadSupBank:false,//加载银行账户组件
            queryInfo:{logic:"and",conditions:[]},//缓存的查询条件
            newQueryInfo:{logic:"and",conditions:[]},
            directOpenCard:false,
            relateQueryId:null,
            allpks:[],
            busiPortraitUrl:null,//企业画像url
            orgAssignCacheField:{},
            supplierMain:{code:'',name:''},
            selectedRecords:undefined,//列表到卡片所有操作都依赖该对象属性
            dirtyRecords:undefined,//列表到卡片操作辅助属性（在selectedRecords失效时，用这个）
            dblClkRecord:undefined,//卡片 两个关联关系的子表编辑时需要这个对象属性
            queryRecords:[],//表格数据
            status:'browse',
            otherParam:undefined,//其他参数（如在userjson中传递的参数）
            //冻结时业务单元参照的参数
            freezeOrgParam:{
                onChange:this.onBusinessUnitChange.bind(this),
                value:null,
                isMultiSelectedEnabled:true,
                fieldid:'businessunittreeref',
                popWindowClassName:'businessunit-zindex',
                isShowUnit:false,
                queryCondition:{
                    TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.FreezeBusinessUnitRefSqlBuilder'
                }
            },
            //列表
            table:{
                //显示停用配置
                showOff:{
                    checked: undefined,
                    disabled: false,
                    onChange: (val) => {
                        this.state.table.showOff.checked = val;
                        this.setState(this.state, () => {
                            this.onSearch({checagepage:true},this.setTableData);
                        });
                    },
                    name: this.Lang['10140SUG-000114']/* 国际化处理： 显示停用*/
                },
                //主页面按钮配置
                buttonConfig: {
                    area: 'supplier_baseInfo',
                    buttonLimit: 3,
                    onButtonClick: this.onMainTableButtonClick,
                },
                //主页面查询区配置
                search: {
                    id: 'supplierquery',
                    clickSearchBtn: () => {
                        this.onSearch({isClickSearch:true,isRefreshList:false},this.setTableData);
                    },
                    clickAdvBtnEve:()=>{this.setSearchAreaOrgDefaultValue()},
                    url:'/nccloud/uapbd/supplier/querySupplierBaseInfo.do'
                },
                //主列表配置
                mainTable:{
                    id: 'supplier_baseInfo',
                    showCheck:true,
                    showIndex:true,
                    onSelected:this.onMainTableChecked.bind(this,this.disabledApproveButtons),
                    onRowClick:this.onMainTableRecordClick,
                    onRowDoubleClick:this.onMainTableDoubleClick,
                    onSelectedAll:this.onMainTableSelectedAll,
                    handlePageInfoChange:this.onMainTablePageInfoClick,
                    operator:{
                        attrcode: 'opr',
                        itemtype:'customer',
                        label: this.Lang['10140SUG-000035'],/* 国际化处理： 操作*/
                        width: 200,
                        className : 'table-opr',
                        fixed: 'right',
                        visible: true,
                        render: (text, record, index) => {
                            let btnKeyArr = new Array();
                            //添加操作列按钮
                            let buttonArray = this.props.button.getButtons().filter(button=>{
                                if( button.area == 'supplier_baseInfo_opr'){return button}
                            })
                            //过滤操作列启用停用按钮
                            for(let button of buttonArray){
                                if(button.key == 'OprEnable'  && record['enablestate'].value == '2'){
                                    continue;
                                }else if(button.key == 'OprDisable'  && record['enablestate'].value != '2'){
                                    continue;
                                }else if(button.key == 'ApplyQuery' && !record['pk_supplier_pf'].value){
                                    continue;
                                // }else if(button.key == 'CreateCust' && !record['iscustomer'].value){
                                //     continue;
                                }else {
                                    btnKeyArr.push(button.key)
                                }
                            }
                            let hasAuth = hasOperateAuth.call(this,[record]);
                            return this.props.button.createOprationButton(hasAuth?btnKeyArr:[], {
                                area: 'supplier_baseInfo_opr',
                                buttonLimit: 3,
                                onButtonClick:this.onMainTableOprBtnClick.bind(this,record,index)
                            });
                        }
                    }
                }
            },
            //卡片
            card:{
                //卡片按钮配置
                buttonConfig:{
                   area: constProp.SUP_BASE_CARD,
                   buttonLimit: 3,
                   onButtonClick: this.onCardButtonClick,
                   popContainer: document.querySelector('.supplier_baseInfo_card')
                },
                //卡片表单配置
                form:{
                    formName:this.Lang['10140SUG-000135'],/* 国际化处理： 基本信息*/
                    formId:constProp.SUP_BASE_CARD,
                    primaryKey:'pk_supplier',
                    action:{
                        onAfterEvent: this.onAfterCardFormEditEvent.bind(this)
                    }
                },
                //卡片列表配置
                table:{
                    //卡片所有子表areacode 数组
                    tableIds:['suplinkman','supcountrytaxes','supbankacc','finance','purchase'],
                    suplinkman:{
                        tableName:this.Lang['10140SUG-000136'],/* 国际化处理： 联系人*/
                        tableId:'suplinkman',
                        relate:'agg',
                        property:{
                            tableHead: this.addCardTableButton.bind(this,'suplinkman') || EMPTY_FUNC,
                            modelSave: this.modelSave.bind(this,'suplinkman') || EMPTY_FUNC,
                            onBeforeEvent: this.onSupLinkmanTableBeforeEdit,
                            showIndex:true,
                            hideSwitch:()=>{return false}
                        },
                        btnApp:{
                            area: 'card_table',
                            buttonLimit: 3,
                            onButtonClick: onCardTableButtonClick.bind(this,'suplinkman'),
                            popContainer: document.querySelector('.card_table')
                        },
                        field:{
                            attrcode: 'opr',
                            label: this.Lang['10140SUG-000035'],/* 国际化处理： 操作*/
                            visible: true,
                            className:'table-opr',
                            width:200,
                            itemtype:'customer',
                            fixed:'right',
                            render: (text, record, index) => {
                                return (
                                    <span fieldid="opr">
                                    { (this.state.status =='edit' || this.state.status == 'add') && 
                                        <span
                                            className="row-edit-option"
                                            style={{'margin-right':'6px'}}
                                            onClick={()=>{this.onCardTableOperatEvent('suplinkman','edit',text,record,index)}}>
                                            {this.Lang['10140SUG-000131']/* 国际化处理： 修改*/}
                                            {/* <span className="split-line" style={{'margin-left':'6px'}}>|</span> */}
                                        </span>}
                                    { (this.state.status =='edit' || this.state.status == 'add') && 
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{this.onCardTableOperatEvent('suplinkman','delete',text,record,index)}}>
                                            {this.Lang['10140SUG-000209']/* 国际化处理： 删行*/}
                                        </span>

                                    }
                                    </span>
                                )
                            }
                        }
                    },
                    supcountrytaxes:{
                        tableName:this.Lang['10140SUG-000137'],/* 国际化处理： 国家税类*/
                        tableId:'supcountrytaxes',
                        relate:'agg',
                        property:{
                            tableHead: this.addCardTableButton.bind(this,'supcountrytaxes') || EMPTY_FUNC,
                            modelSave: this.modelSave.bind(this,'supcountrytaxes') || EMPTY_FUNC,
                            showIndex:true,
                            hideSwitch:()=>{return false}
                        },
                        btnApp:{
                            area: 'card_table',
                            buttonLimit: 3,
                            onButtonClick: onCardTableButtonClick.bind(this,'supcountrytaxes'),
                            popContainer: document.querySelector('.card_table')
                        },
                        field:{
                            attrcode: 'opr',
                            label: this.Lang['10140SUG-000035'],/* 国际化处理： 操作*/
                            visible: true,
                            className:'table-opr',
                            width:200,
                            itemtype:'customer',
                            fixed:'right',
                            render: (text, record, index) => {
                                return (
                                    <span  fieldid="opr">
                                     { (this.state.status =='edit' || this.state.status == 'add') && 
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.status=='add' || this.state.status=='edit') && this.onCardTableOperatEvent('supcountrytaxes','delete',text,record,index)}}>
                                            {this.Lang['10140SUG-000209']/* 国际化处理： 删行*/}
                                        </span>
                                    }
                                    </span>
                                    
                                )
                            }
                        }
                    },
                    supbankacc:{
                        tableName:this.Lang['10140SUG-000138'],/* 国际化处理： 银行账户*/
                        tableId:'supbankacc',
                        relate:'inci',
                        property:{
                            tableHead: this.addCardTableButton.bind(this,'supbankacc') || EMPTY_FUNC,
                            modelSave: this.modelSave.bind(this,'supbankacc') || EMPTY_FUNC,
                            showIndex:true,
                            hideSwitch:()=>{return false}
                        },
                    },
                    finance:{
                        tableName:this.Lang['10140SUG-000112'],/* 国际化处理： 财务信息*/
                        tableId:'finance',
                        relate:'inci',
                        property:{
                            tableHead: this.addCardTableButton.bind(this,'finance') || EMPTY_FUNC,
                            modelSave: this.modelSave.bind(this,'finance') || EMPTY_FUNC,
                            showIndex:true,
                            showCheck:true,
                            onSelected:this.onFinanceOrPurchaseTableSelected.bind(this,'finance'),
                            onSelectedAll:this.onFinanceOrPurchaseTableSelectedAll.bind(this,'finance'),
                            hideSwitch:()=>{return false},
                            onRowDoubleClick:this.onRowDoubleClick.bind(this,'finance',statusProp.BROWSE)
                        },
                        btnApp:{
                            area: 'supfinance_table',
                            buttonLimit: 3,
                            onButtonClick: onFinanceTableButtonClick.bind(this),
                            popContainer: document.querySelector('.supfinance_table')
                        },
                        field:{
                            attrcode: 'opr',
                            label: this.Lang['10140SUG-000035'],/* 国际化处理： 操作*/
                            visible: true,
                            className:'table-opr',
                            width:200,
                            itemtype:'customer',
                            fixed:'right',
                            // <span
                            //                 className="row-edit-option"
                            //                 onClick={()=>{(this.state.status!='add' && this.state.status!='edit') && this.onCardTableOperatEvent('finance','delete',text,record,index)}}>
                            //                 {this.Lang['10140SUG-000120']/* 国际化处理： 删行*/}
                            //             </span> 
                            render: (text, record, index) => {
                                return (
                                    <span  fieldid="opr">
                                    {
                                        (this.state.status !='edit' && this.state.status != 'add') &&
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.status!='add' && this.state.status !='edit') && this.onCardTableOperatEvent('finance','edit',text,record,index)}}>
                                            {this.Lang['10140SUG-000208']/* 国际化处理： 修改*/}
                                        </span>
                                    }
                                    {
                                        (this.state.status !='edit' && this.state.status != 'add') &&

                                        <NCPopconfirm 
                                            trigger="click" 
                                            placement="top" 
                                            content={this.Lang['10140SUG-000072']}
                                            onClose = {()=>{this.onCardTableOperatEvent('finance','delete',text,record,index)}}>
                                           <span>{this.Lang['10140SUG-000120']}</span> 
                                        </NCPopconfirm>
                                    }
                                    </span>
                                )
                            }
                        }
                    },
                    purchase:{
                        tableName:this.Lang['10140SUG-000113'],/* 国际化处理： 采购信息*/
                        tableId:'purchase',
                        relate:'inci',
                        property:{
                            tableHead: this.addCardTableButton.bind(this,'purchase') || EMPTY_FUNC,
                            modelSave: this.modelSave.bind(this,'purchase') || EMPTY_FUNC,
                            showIndex:true,
                            showCheck:true,
                            onSelected:this.onFinanceOrPurchaseTableSelected.bind(this,'purchase'),
                            onSelectedAll:this.onFinanceOrPurchaseTableSelectedAll.bind(this,'purchase'),
                            hideSwitch:()=>{return false},
                            onRowDoubleClick:this.onRowDoubleClick.bind(this,'purchase',statusProp.BROWSE)
                        },
                        btnApp:{
                            area: 'supstock_table',
                            buttonLimit: 3,
                            onButtonClick: onStockTableButtonClick.bind(this),
                            popContainer: document.querySelector('.supstock_table')
                        },
                        field:{
                            attrcode: 'opr',
                            label: this.Lang['10140SUG-000035'],/* 国际化处理： 操作*/
                            visible: true,
                            className:'table-opr',
                            width:200,
                            itemtype:'customer',
                            fixed:'right',
                            //(this.state.status!='add' && this.state.status !='edit') && this.onCardTableOperatEvent('purchase','delete',text,record,index)
                            // <span
                            //                     className="row-edit-option"
                            //                     onClick={()=>{}}>
                            //                     {this.Lang['10140SUG-000120']/* 国际化处理： 删除*/}
                            //                 </span>
                            render: (text, record, index) => {
                                return (
                                    <span  fieldid="opr">
                                    {
                                        (this.state.status !='edit' && this.state.status != 'add') &&
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.status!='add' && this.state.status !='edit') && this.onCardTableOperatEvent('purchase','edit',text,record,index)}}>
                                            {this.Lang['10140SUG-000208']/* 国际化处理： 修改*/}
                                        </span>
                                    }
                                    {
                                        (this.state.status !='edit' && this.state.status != 'add') &&
                                        <NCPopconfirm 
                                            trigger="click" 
                                            placement="top" 
                                            content={this.Lang['10140SUG-000072']}
                                            onClose = {()=>{this.onCardTableOperatEvent('purchase','delete',text,record,index)}}>
                                           <span>{this.Lang['10140SUG-000120']}</span> 
                                        </NCPopconfirm>
                                        
                                    }
                                    {
                                        (this.state.status !='edit' && this.state.status != 'add') &&
                                        <span
                                            //="DeleteLine"
                                            //fieldname={this.Lang['10140SUG-000207']/* 国际化处理： 地址簿*/}
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.status!='add' && this.state.status !='edit') && this.onCardTableOperatEvent('purchase','address',text,record,index)}}>
                                            {this.Lang['10140SUG-000207']/* 国际化处理： 地址簿*/}
                                        </span>
                                    }
                                    </span>
                                )
                            }
                        }
                        
                    }
                }

            },
            //弹窗需要的配置
            dialog:{
                linkman:{
                    formName:this.Lang['10140SUG-000136'],/* 国际化处理： 联系人*/
                    formId:'linkman',
                    targetId:'suplinkman'
                },
                supbankacc:{
                    tableId:'custsupbankacc',
                    tableName:this.Lang['10140SUG-000139'],/* 国际化处理： 供应商银行账户*/
                    targetId:'supbankacc',
                    pk_supplier:null,
                },
                supaddress:{
                    tableId:'supaddress',
                    tableName:this.Lang['10140SUG-000065'],/* 国际化处理： 供应商发货地址*/
                    pk_supplier:null,
                },
                suprename:{
                    tableId:'suprename',
                    tableName:'供应商更名记录',/* 国际化处理： 供应商发货地址this.Lang['10140SUG-000065']*/
                    pk_supplier:null,
                }
            },
            //打印配置
            printNodeKey:null,
            printUrl:null,
            printPks:null,
        },{envParam:this.state.envParam,indivOrg:this.state.indivOrg,busiPortraitUrl:this.state.busiPortraitUrl});
        this.setState(this.state,callback);
    }
    /**
     * 由于业务单元节点  向导批改带有查询组织 向导分配不带查询组织，所以这里做一下适配
     */
    setOrgAssignToCache = ()=>{
        if(this.props.nodeType == 'ORG_NODE'){
            let assignSearchItems = this.props.meta.getMeta()['assignsupplierquery'].items;
            if(assignSearchItems[0].attrcode == 'pk_org_assign'){
                this.state.orgAssignCacheField = assignSearchItems[0];
                assignSearchItems.splice(0,1);
                this.setState(this.state,()=>{
                    this.props.meta.setMeta(this.props.meta.getMeta());
                });
            }
        }
    }
    componentDidUpdate(){
        //编辑态关闭浏览器页签 提示
        if(this.state.status == 'edit' ||this.state.status == 'add'){
            window.onbeforeunload = () => {
                return '';
            };
        }else{
            window.onbeforeunload = null;
        }
    }
    /**********************************main table ↓**********************************/
    /**
     * 主列表 分页区点击事件
     */
    onMainTablePageInfoClick = (props,config,pks)=>{
        let pageInfo = this.props.table.getTablePageInfo(this.state.table.mainTable.id);

        this.setState({pageInfo:pageInfo},()=>{this.onSearch({checagepage:true},this.setTableData)});
    }
    /**
     * 获得初始环境信息
     * @param context
     * @param param
     * @returns {*}
     */
    getInitEnvParamObj = (context,param)=>{
        //是业务单元节点:走个性化，不是业务单元节点：走初始化的参数
        return this.props.nodeType == 'ORG_NODE'?context:{
            pk_org:param.pk_org,
            pk_group:param.pk_group,
            org_Name:param.name
        };
    }
    /**
     * 设置查询区默认值
     */
    setSearchAreaOrgDefaultValue = ()=>{
        let envParam = this.state.envParam,indivOrg = this.state.indivOrg;
        //基本信息查询区
        this.props.meta.getMeta()['supplierquery'].items.filter(item=>{
            let data = {value:envParam.pk_org,display:envParam.org_Name};
            (item.attrcode.endsWith("pk_org_assign") || item.attrcode.endsWith("pk_org")) && this.props.search.setSearchValByField('supplierquery',item.attrcode, data);
        })
        this.props.meta.setMeta(this.props.meta.getMeta());
    }
    /**
     * 自定义表格field适配
     * @param metaId
     */
    meta2TableFieldAdapter = (metaId)=>{
        this.props.meta.getMeta()[metaId].items.forEach(item=>{
            item.title = item.label;
            item.dataIndex = item.attrcode;
            item.key = item.attrcode;
            item.width = 100;
        })
    }
    /**
     * 查询列表
     * @param {isClickSearch(是否点击查询按钮),isRefreshList(是否点击刷新按钮),isCardReturn(是否点击返回按钮)}
     * @param callback
     */
    onSearch = ({isClickSearch,isRefreshList,isCardReturn,checagepage}={},callback=()=>{}) => {
        let {queryInfo,table,envParam} = this.state;
        let searchInfo = this.props.search.getQueryInfo(table.search.id,false);
        let {querycondition} = searchInfo;
        //查询前校验
        this.validate({isClickSearch,isRefreshList,isCardReturn,conditions:querycondition.conditions},()=>{
             //获得当前的分页信息
            let pageInfo = this.getPageInfo(!checagepage,this.state.pageInfo || this.props.table.getTablePageInfo(this.state.table.mainTable.id));
            //点击查询按钮==>记录查询条件
            this.recordSearchInfo({isClickSearch,condition:querycondition},()=>{
                //重置查询区查询条件，保证是最新的条件状态,但是只有点击查询按钮时用最新的查询条件去查询
                this.resetQueryCondition(()=>{
                    let {queryInfo} = this.state;
                    //构造查询参数
                    var param  = {
                        formatInfo:{
                            pageInfo:pageInfo,
                            ...Object.assign({},searchInfo,{querycondition:queryInfo})
                        },
                        showOff:!!table.showOff.checked || false,
                        nodeType:this.props.nodeType,
                        pk_curOrg:envParam.pk_org
                    };
                    //执行查询
                    querycondition.conditions.length>0 && this.query({param,isClickSearch,isRefreshList,checagepage},callback)
                    this.asyncPageInfo();
                });
            })
        });
    }
    /**
     * 记录查询信息
     */
    recordSearchInfo = ({isClickSearch,condition} = {},callback = ()=>{})=>{
        let {queryInfo} = this.state;
        this.setState({newQueryInfo:condition,queryInfo:isClickSearch?condition:queryInfo},callback);
    }
    /**
     * 查询前校验
     */
    validate = ({isClickSearch,isRefreshList,isCardReturn,conditions}={},callback=()=>{})=>{
        //只获取查询条件
        if(isRefreshList && (!conditions || conditions.length == 0)){
            toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
            return;
        }
        if(!conditions || conditions.length == 0){
            return;
        }
        callback();
    }
    /**
     * 获得列表分页信息
     */
    getPageInfo = (flag,info)=>{
        let pageInfo = {
            pageIndex:flag?0:info.pageIndex,
            pageSize:info.pageSize || 10
        }
        return pageInfo;
    }
    /**
     * 同步列表分页信息
     */
    asyncPageInfo = (callback=()=>{})=>{
        let {pageInfo,table} = this.state;
        let newPageInfo = this.props.table.getTablePageInfo(table.mainTable.id);
        if(pageInfo && parseInt(pageInfo.pageIndex)!=parseInt(newPageInfo.pageIndex) && parseInt(pageInfo.pageSize)!=parseInt(newPageInfo.pageSize)){
            this.setState({pageInfo:newPageInfo},callback);
        }
    }
    //同步查询条件
    asyncQueryCondition = (isAsync,callback = ()=>{})=>{
        let {newQueryInfo,queryInfo} = this.state;
        this.setState({queryInfo:isAsync?newQueryInfo:queryInfo},()=>{
            callback();
        });
    }
    /**
     * 重置查询条件
     * @param needReset 是否需要重置
     * @param callback 执行列表查询方法
     *  
     */
    resetQueryCondition = (callback = ()=>{})=>{
        let {newQueryInfo,table} = this.state;
        //NCCLOUD-170132  当列表查询区必输项为空时，卡片界面点击返回按钮报错，故添加判断条件
        if(newQueryInfo && newQueryInfo.conditions){
            //设置查询条件
            this.props.search.setSearchValue(table.search.id,newQueryInfo.conditions);   
            setTimeout(()=>{
                callback();
            },0);
        }
    }
    /**
     * 主列表查询
     */
    query = ({param,isClickSearch,isRefreshList,checagepage}={},callback = ()=>{})=>{
        if(isClickSearch||isRefreshList||checagepage){
            ajax({
                url:this.state.table.search.url,
                data:param,
                success:(res)=>{
                    //显示公式设置
                    showFormulaSetting.call(this,res,{[this.state.table.mainTable.id]:'simpleTable'});
                    res.success && this.setState({allpks:res.data?res.data['supplier_baseInfo'].allpks:[]},()=>{
                        callback(res.data,setMainTablePageButton.bind(this,false),isClickSearch,isRefreshList);
                    });
                }
            });
        }
        
    }
    /**
     * 设置主列表数据
     * @param data
     * @param callback
     */
    setTableData =(data,callback,isClickSearch,isRefreshList)=>{
        if(data&&data.supplier_baseInfo){
            cacheTools.set('allpks',data.supplier_baseInfo.allpks);
        }
        
        this.props.table.setAllTableData(this.state.table.mainTable.id,!!data?data[this.state.table.mainTable.id]:{rows:[]});
        this.setState({queryRecords:!!data?data[this.state.table.mainTable.id].rows:[]},()=>{
            this.props.button.setButtonDisabled(['Print','Menu_Output','Output'],!(data && data[this.state.table.mainTable.id].rows.length>0));
            if(isClickSearch){//是点击查询按钮
                if(data && data[this.state.table.mainTable.id] && data[this.state.table.mainTable.id].allpks.length>0){
                    toast({content:this.inlt && this.inlt.get('10140SUG-000132',{count:data[this.state.table.mainTable.id].allpks.length}),color:'success'});/* 国际化处理： 查询成功，共 ${} 条*/
                }else{
                    toast({content:this.Lang['10140SUG-000066'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据*/
                }
            }
            isRefreshList && toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
            setMainTablePageButton.call(this,false);
        })
    }

    cachePageInfo = (callback = ()=>{})=>{
        // let {openCard} = this.state;
        // let tablePageInfo = this.props.table.getTablePageInfo(this.state.table.mainTable.id) || this.state.pageInfo;
        // let pageInfo = tablePageInfo?tablePageInfo:null;
        this.setState(this.state,callback);
    }
    /**
     * 初始页面数据
     * @param setCardValue
     * @param setCardStatus
     * @param url
     * @param isCancel
     */
    initPageData =(setCardValue,setCardStatus,url,isCancel,isCardRefresh,isDelete)=>{
        let {status,dirtyRecords,envParam,card} = this.state;
        let {pagecode,nodeType,pk_supplier,directOpenCard} = this.props;
        this.cachePageInfo(()=>{
            let param,tsMap = new Map,{relateQueryId} = this.state;
            //重置列宽
            resizeForm.call(this,constProp.SUP_BASE_CARD);
            param = relateQueryId && status!='add'?
                    {pk_supplier:[relateQueryId]}:
                    getCurParam.call(this,'pk_supplier',!!isCancel?dirtyRecords:null);
            ajax({
                url:url?url:(param && !!param['pk_supplier'][0])?this.Urls.queryCardUrl:this.Urls.addUrl,
                data:{
                    pk_supplier:param ? param['pk_supplier'][0]:null,
                    tsMap:param?param['tsMap']:null,
                    pageCode:pagecode,
                    nodeType:nodeType,
                    pk_curOrg:envParam.pk_org,
                    status:status,//！！！新增取消时回滚单据号
                },
                success:(res)=>{
                    var tables = new Object();
                    this.state.card.table.tableIds.forEach(tableId=>{
                        tables[tableId] = 'cardTable';
                    })
                    //显示公式设置
                    showFormulaSetting.call(this,res,{
                        [card.form.formId]:'form',
                        ...tables
                    })
                     //回调 表单表格赋值
                    res.success && setCardValue && setCardValue({data:res.data,isCardRefresh,isDelete},setCardStatus);
                    directOpenCard && pk_supplier && this.resetCurPageNodeTypeWhenDirectOpenCard(res.data)
                }
            })
        })
    }
    /**
     * 供应商供货目录联查供应商时，无法知道当前节点类型，在该方法中重置
     */
    resetCurPageNodeTypeWhenDirectOpenCard = (data)=>{
        let cardData = data && data.hasOwnProperty("card")?data.card:data;

        let formItemsValue = cardData.head[this.state.card.form.formId].rows[0].values;

        this.props.nodeType = formItemsValue['pk_group'].value == formItemsValue['pk_org'].value?'GROUP_NODE':formItemsValue['pk_org'].value == PK_GLOBE?'GLOBE_NODE':'ORG_NODE';
    }

    /**
     * 设置卡片数据
     * @param data
     * @param callback 预留的回调
     */
    setCardValue = ({data = {},isCardRefresh,isDelete} = {},callback=()=>{})=>{
        let {status,card} = this.state;
        let cardData = data.hasOwnProperty("card")?data.card:data;
        let formvalues = cardData.head[card.form.formId].rows[0].values || [];
        let formData = filterEmptyData(formvalues,status);
        cardData && this.props.form.setAllFormValue({[card.form.formId]:formData});
        //设置表格数据
        setTimeout(card.table.tableIds.forEach((key)=>{
            this.props.cardTable.setTableData(card.table[key].tableId, cardData.bodys[key]?{rows:cardData.bodys[key].rows}:{rows:[]});
        }),0);
        //根据编码规则定义 设置code是否可编辑
        updateFormItemDisable.call(this,{
            areaId:constProp.SUP_BASE_CARD,
            data:{code:cardData.head.userjson == 'Y'}
        },()=>{
            // //没有财务和采购信息时 隐藏按钮
            this.setState({
                selectedRecords:[cardData.head[card.form.formId].rows[0].values]
            },()=>{
                //回调 表单表格设置状态
                callback({status,isCardRefresh,isDelete},setCardButtonStatus);
            });
        });
    }
    /**
     * 设置卡片状态
     * @param status
     * @param callback
     */
    setCardStatus =({status,isCardRefresh,isDelete} = {},callback)=>{
        let curStatus = getCurCardStatus(status);
        //设置表单编辑态
        this.props.form.setFormStatus(this.state.card.form.formId, curStatus);
        //聚合关系的表格编辑态
        this.state.card.table.tableIds.forEach((key)=>{
            this.state.card.table[key].relate == 'agg' && this.props.cardTable.setStatus(this.state.card.table[key].tableId,curStatus);
        })
        !isDelete && (callback ? callback.call(this):setCardButtonStatus.call(this));//设置卡片按钮状态
        isCardRefresh && toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
        this.setState(this.state,()=>{
            let formData = this.props.form.getAllFormValue(this.state.card.form.formId);
            var supstateFlag = formData.rows[0].values['supprop'].value =='1'
            var supstateName = formData.rows[0].values['supprop'].display != '';

            updateFormItemDisable.call(this,{
                areaId:constProp.SUP_BASE_CARD,
                data:{'pk_financeorg':supstateName && !supstateFlag}
            },()=>{
                updateFormItemRequire.call(this,{
                    areaId:constProp.SUP_BASE_CARD,
                    data:{'pk_financeorg':supstateName && supstateFlag}
                },()=>{
                    !supstateFlag && this.props.form.setFormItemsValue(constProp.SUP_BASE_CARD,{'pk_financeorg':{display:'',value:''}});
                })
            });
            // this.props.form.setFormItemsDisabled(constProp.SUP_BASE_CARD,{'pk_financeorg':supstateName && !supstateFlag});
            // this.props.form.setFormItemsRequired(constProp.SUP_BASE_CARD,{'pk_financeorg':supstateName && supstateFlag});
            // !supstateFlag && this.props.form.setFormItemsValue(constProp.SUP_BASE_CARD,{'pk_financeorg':{display:'',value:''}});
        })
    }
    /**
     * 主列表行点击事件
     * @param props
     * @param moduleId
     * @param record
     * @param index
     */
    onMainTableRecordClick = (props, moduleId, record, index)=>{
        this.props.button.setButtonVisible('CreateCust',!record['iscustomer'].value);
    }
    /**
     * 主列表按钮点击事件
     * @param props
     * @param id
     */
    onMainTableButtonClick = (props,id)=>{
        onMainTableButtonClick.call(this,props,id);
    }
    /**
     * 主列表操作列按钮点击事件
     * @param record
     * @param index
     * @param props
     * @param key
     */
    onMainTableOprBtnClick = (record,index, props, key)=>{
        onMainTableOprButtonClick.call(this,record,index, props, key);
    }
    /**
     * 主列表行checked事件
     * @param callback
     * @param props
     * @param moduleId
     * @param record
     */
    onMainTableChecked = (callback,props, moduleId, record,index, status)=>{
        let checkedRows = props.table.getCheckedRows(moduleId);//获得选中行集合
        this.setState({selectedRecords:checkedRows},()=>{
            if(!status && (!checkedRows ||checkedRows.length==0)){
                callback && callback('cancel');
                this.disabledEnableButtons('cancel');
            }else{
                let row = checkedRows.find(row=>{
                    return row.data && row.data.values && row.data.values['supstate'].value == '1'
                })
                let enableRow = checkedRows.find(row=>{
                    return row.data && row.data.values && row.data.values['enablestate'].value == '2'
                })
                callback && callback(!!row);
                this.disabledEnableButtons(!!enableRow);
            }
            setMainTablePageButton.call(this,false);
        })
    }
    /**
     * 设置停启用按钮的禁用状态
     * @param flag
     */
    disabledEnableButtons = (flag)=>{
        if(flag=='cancel'){
            this.props.button.setButtonDisabled({Disable:false,Enable:false});
        }else{
            this.props.button.setButtonDisabled({Disable:!flag,Enable:!!flag});
        }
    }
    /**
     * 是否禁用核准按钮
     * @param flag
     */
    disabledApproveButtons = (flag)=>{
        if(flag=='cancel'){
            this.props.button.setButtonDisabled({UnApprove:false,Approve:false});
            
        }else{
            this.props.button.setButtonDisabled({UnApprove:!flag,Approve:!!flag});
        }
    }
    displayEnablestate = (flag)=>{
        let {selectedRecords} = this.state;
        let record = selectedRecords[0].values?selectedRecords[0].values:selectedRecords[0];
        let data = record.data?record.data.values:record;
        this.props.button.setButtonVisible({
            Card_Enable:!!data['pk_supplier'].value?!flag:false,
            Card_Disable:!!data['pk_supplier'].value?flag:false
        });
    }
    displayApproveButtons = (flag,addCancel) =>{
        let {selectedRecords} = this.state;
        let record = selectedRecords[0].values?selectedRecords[0].values:selectedRecords[0];
        let data = record.data?record.data.values:record;
        this.props.button.setButtonVisible({
            Card_Approve:!!data['pk_supplier'].value?!flag:false,
            Card_UnApprove:!!data['pk_supplier'].value?flag:false
        });
    }
    /**
     * 主表格行双击事件
     * @param record
     * @param index
     * @param props
     * @param e
     */
    onMainTableDoubleClick = (record,index, props, e)=>{
        let me = this;
        setCardButtonStatus.call(this,'browse');
        let queryInfo = me.props.search.getAllSearchData(this.state.table.search.id,false);//缓存查询信息
        setTimeout(
            this.setState({
                selectedRecords:[record],
                dirtyRecords:[record],
                status:'browse',
                queryInfo:queryInfo,
                openCard:!this.state.openCard
            },()=>{
                this.props.cardPagination.setCardPaginationId({id:record['pk_supplier'].value,status:1});
                this.initPageData(this.setCardValue,this.setCardStatus);
                resizeForm.call(this,constProp.SUP_BASE_CARD);
            }),0)
       
    }
    onMainTableSelectedAll = (props, moduleId, status, length)=>{
        setMainTablePageButton.call(this,false);
    }
    /**
     * 显示删除状态原因
     *  点击 删除状态超链接时触发
     */
    showDeleteStateCause = (record)=>{
        ajax({
            url:'/nccloud/uapbd/supplier/deletestate.do',
            data:{pk_supplier:record['pk_supplier'].value,deletestate:record['deletestate'].value},
            success:(res)=>{
                promptBox({
                    color:'warning',
                    title:this.Lang['10140SUG-000143'],/* 国际化处理： 错误信息*/
                    content:res.data,
                })
            }
        })
    }
    /**********************************main table ↑**********************************/
    /**********************************card ↓**********************************/
    /**
     * 卡片子表编辑或删除操作按钮事件
     * @param key
     * @param text
     * @param record
     * @param index
     */
    onCardTableOperatEvent = (key,flag,text,record,index)=>{
        switch(flag){
            case 'edit':
                (key == 'purchase' || key == 'finance') ? 
                    this.onRowDoubleClick(key,'edit',this.props,record,null):
                    this.setState({openDialog:true},()=>{
                        ajax({
                            url:this.Urls.queryLinkmanUrl,
                            data:{pk_linkman:record.values['pk_linkman'].value,nodeType:this.props.nodeType,pk_curOrg:this.state.envParam.pk_org},
                            success:(res)=>{
                                if(res.success){
                                    this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'LinkmanDialog'),{Lang:this.Lang}),()=>{
                                        this.props.form.setAllFormValue({linkman:res.data['linkman']});
                                        this.props.form.setFormStatus('linkman', 'edit'); //设置表单编辑态
                                    });
                                }
                            }
                        });
                    })
                break;
            case 'delete':
                if(key =='purchase' || key == 'finance'){
                    this.setState({
                        dblClkRecord:record
                    },()=>{
                        deleteFinanceOrStock.call(this,false,key);
                        //onFinanceOrStockDelete.call(this,false,key);
                    });
                }else{
                    this.props.cardTable.delRowsByIndex(key,index);
                }
                break;
            case 'address':
                this.setState({openDialog:true},()=>{
                    showAddressBookDialog.call(this,record.values['pk_supplier'].value,{pk_supstock:record.values['pk_supstock'].value,baseInfoAddress:false,orgId:record.values['pk_org'].value});
                })
                break;
        }
    }
    /**
     * 卡片form编辑后事件
     */
    onAfterCardFormEditEvent =(props, moduleId, key, value, index)=>{
        switch(key){
            case 'supprop':
                /**
                 * 内部单位时，财务组织项可以编辑
                 */
                updateFormItemDisable.call(this,{
                    areaId:constProp.SUP_BASE_CARD,
                    data:{'pk_financeorg':!(value.value=='1'),'isfreecust':value.value=='1'}
                },()=>{
                    updateFormItemRequire.call(this,{
                        areaId:constProp.SUP_BASE_CARD,
                        data:{'pk_financeorg':value.value=='1'}
                    },()=>{
                        //外部单位 清空 财务组织的值
                        !(value.value == '1') && this.props.form.setFormItemsValue(constProp.SUP_BASE_CARD,{'pk_financeorg':{}});
                        value.value == '1' && this.props.form.setFormItemsValue(constProp.SUP_BASE_CARD,{'isfreecust':{}});
                    })
                });
                break;
            case 'pk_org':
                let formData = this.props.form.getAllFormValue(moduleId);
                if(value){
                    let pk_org = value.value;
                    let meta = this.props.meta.getMeta();
                    meta['supplier_baseInfo_card'].items.map(item=>{
                        if(item.attrcode === 'pk_supplierclass'){
                            item.queryCondition = {
                                pk_org : pk_org
                            }
                        }
                    });
                    props.meta.setMeta(meta);
                }
                
                /**
                 * 业务单元节点 所属组织参照编辑后 重置卡片信息
                 * 如果有编码规则，带出编码
                 */
                if(this.props.nodeType == 'ORG_NODE' && (!formData.rows[0].values['code'].value || formData.rows[0].values['code'].value.length == 0)){
                    this.state.envParam.pk_org = value.value;
                    this.setState(this.state,()=>{
                        this.initPageData(this.setCardValue,this.setCardStatus);
                    })
                }
                break;
            case 'pk_supplier_main'://编辑后事件
            this.state.supplierMain.code = value.refcode || value.code;
            this.state.supplierMain.name = value.refname||value.display;
            this.setState(this.state);
            // value && value.value && ajax({
            //     url:'/nccloud/uapbd/supplier/supplierMainChange.do',
            //     data:{pk_supplier:value.value,refcode:value.refcode || value.code,refname:value.refname||value.display}})
            break;
                
        }
    }
    /**
     * 供应商联系人表格编辑前事件
     */
    onSupLinkmanTableBeforeEdit = (props, moduleId, key, value,  index, record,status)=>{
        //只有'是否默认'字段 允许编辑
        return key == 'isdefault';
    }
    /**
     * 卡片form按钮事件
     * @param props
     * @param id
     */
    onCardButtonClick = (props,id)=>{
        onCardButtonClick.call(this,props,id)
    }
    /**
     * 表格行双击事件
     * @param moduleId
     * @param props
     * @param record
     * @param index
     */
    onRowDoubleClick = (moduleId,status,props, record, index)=>{
        if(this.state.status == 'add' || this.state.status == 'edit'){
            //卡片编辑态，聚合关系子表不能操作
            return;
        }
        this.setState({dblClkRecord:record},()=>{
            let param = {
                dialogTitle:moduleId == constProp.FINANCE?this.Lang['10140SUG-000112']:this.Lang['10140SUG-000113'],/* 国际化处理： 财务信息,采购信息*/
                dialogWidth:'50%',
                dialogHeight:'60%',
                dialogZIndex:'100',
                showFooter:false,//显示底部按钮区
                showDefaultBtn:false,//显示默认按钮
                listener:{
                    renderContentArea:this.renderContentArea.bind(this,moduleId),
                    onAfterShow:
                        moduleId==constProp.FINANCE?
                        this.onFinanceDialogAfterShow.bind(this,setFinanceCardBtnStatus.bind(this),null,status?status:statusProp.BROWSE):
                        this.onStockDialogAfterShow.bind(this,setFinanceCardBtnStatus.bind(this),null,status?status:statusProp.BROWSE),
                    onBeforeCancelClick:(callback)=>{querySupFinanceOrStockTableData.call(this,moduleId,true);callback && callback();},
                    onAfterCancelClick:this.onAfterDialogClose,
                }
            };
            setFinanceAndStockReferCondition.call(this,moduleId==constProp.FINANCE?'supfinance_card':'supstock_card',record.hasOwnProperty('data')?record.data.values:record.values);
            this.setState({openDialog:true},()=>{
                this.Dialog.showDialog(Object.assign(param,{Lang:this.Lang}));
            })
        });
    }
    onFinanceOrPurchaseTableSelected = (tableId,props, moduleId, record, index, status)=>{
        this.setFinanceOrPurchaseTableButton(tableId);
    }
    onFinanceOrPurchaseTableSelectedAll = (tableId,props, moduleId, status, length)=>{
        this.setFinanceOrPurchaseTableButton(tableId);
    }
    setFinanceOrPurchaseTableButton = (tableId)=>{
        let selectedRecords = this.props.cardTable.getCheckedRows(tableId);
        // let flag = tableId =='finance'?(selectedRecords.length>1?false:(selectedRecords[0].data.values['payfreezeflag'].value == true ? true:false)):true;
        debugger;
        this.props.button.setButtonDisabled({
            Finance_Table_Delete:!(tableId == 'finance' && selectedRecords && selectedRecords.length>0),
            Finance_Table_PayFreeze:tableId =='finance'?(selectedRecords.length>1?false:(selectedRecords[0] ? (selectedRecords[0].data.values['payfreezeflag'].value == true ? true:false):true)):true,
            Finance_Table_PayUnFreeze:tableId =='finance'?(selectedRecords.length>1?false:(selectedRecords[0] && selectedRecords[0].data.values['payfreezeflag'].value == true?false:true)):true,
            Finance_Table_TicketFreeze:tableId =='finance'?(selectedRecords.length>1?false:(selectedRecords[0] ? (selectedRecords[0].data.values['makeoutfreezeflag'].value == true ? true:false):true)):true,
            Finance_Table_TicketUnFreeze:tableId =='finance'?(selectedRecords.length>1?false:(selectedRecords[0] && selectedRecords[0].data.values['makeoutfreezeflag'].value == true?false:true)):true,
            Stock_Table_Delete:!(tableId == 'purchase' && selectedRecords && selectedRecords.length>0),
            Stock_Table_OrderFreeze:tableId =='purchase'?(selectedRecords.length>1?false:(selectedRecords[0] ? (selectedRecords[0].data.values['orderfreezeflag'].value == true ? true:false):true)):true,
            Stock_Table_OrderUnFreeze:tableId =='purchase'?(selectedRecords.length>1?false:(selectedRecords[0] && selectedRecords[0].data.values['orderfreezeflag'].value == true?false:true)):true
        });
    }
    /**
     * 财务信息 采购信息 编辑卡片渲染内容
     * @param moduleId
     * @returns {*}
     */
    renderContentArea = (moduleId)=>{
        const {form,button} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        let formId = moduleId=='finance'?constProp.SUPFINANCE_CARD:constProp.SUPSTOCK_CARD;
        return (
                <div className="nc-bill-top-area">
                    <div className="nc-bill-header-area">
                        <div className="header-button-area">
                            {createButtonApp({
                                area:constProp.SUPFINANCE_CARD,
                                buttonLimit: 3,
                                onButtonClick: onFinanceOrPurchaseCardButtonClick.bind(this,moduleId),
                                popContainer: document.querySelector('.'+constProp.SUPFINANCE_CARD)
                            })}
                        </div>
                    </div>
                    <div className="nc-bill-form-area">
                        {createForm(formId,{
                            onAfterEvent:this.onAfterFinanceOrStockFormEvent
                            }
                        )}
                    </div>
                </div>
        );
    }
    /**
     * 财务信息或采购信息表单编辑后事件
     */
    onAfterFinanceOrStockFormEvent = (props, moduleId, key, value,oldValue)=>{
        let template = this.props.meta.getMeta();
        let record = this.state.dblClkRecord;//子表选中项
        //获得 列表信息的
        let pk_org = record.hasOwnProperty('data')?record.data.values['pk_org'].value:record.values['pk_org'].value;
        template[moduleId].items.find(
            item=>{
                if((key == 'pk_respdept' || key == 'respdept') && (item.attrcode == 'pk_respdept' || item.attrcode == 'respdept')){
                    template[moduleId].items.find(i=>{
                        //专管部门选完 给专管业务员参照左树设置过滤条件
                        if(i.attrcode == 'pk_resppsn' || i.attrcode == 'respperson'){
                            i.queryCondition = value.refpk?{
                                pk_dept:value.refpk,
                                pk_org:pk_org
                            }:{
                                pk_org:pk_org
                            } 

                            if(value.refpk !=oldValue.refpk){
                                //选完专管部门  如果和老的专管部门不一致，就清空专管业务员
                                this.props.form.setFormItemsValue(moduleId,{[i.attrcode]:{}});
                            }
                        }
                    });
                }
                if((key == 'pk_resppsn' || key == 'respperson') && (item.attrcode == 'pk_resppsn' || item.attrcode == 'respperson')){
                    //选完专管业务员  给专管部门赋值
                    let attrcode = item.attrcode == 'pk_resppsn'?'pk_respdept':'respdept',
                        deptValueObj = value.refpk?{display:value.values.deptname.value,value:value.values.pk_dept.value}:{};
                    this.props.form.setFormItemsValue(moduleId,{[attrcode]:deptValueObj});
                }
            })
            this.props.meta.setMeta(template);
    }
    /**
     * 财务信息打开弹出框后事件
     */
    onFinanceDialogAfterShow = (setBtnStatus,callback,status,isRefresh)=>{
        setBtnStatus && setBtnStatus.call(this,status);//设置按钮状态
        let formId = constProp.SUPFINANCE_CARD;
        let supParam = getCurParam.call(this,constProp.PK_SUPPLIER);
        let finParam = getCurParam.call(this,constProp.PK_SUPFINANCE,this.state.dblClkRecord);
        ajax({
            url:this.Urls.queryFinanceInfoUrl,
            data:{pk_supplier:supParam[constProp.PK_SUPPLIER][0],pk_supfinance:finParam[constProp.PK_SUPFINANCE][0]},
            success:(res)=>{
                showFormulaSetting.call(this,res,{[formId]:'form'});
                res.success && this.props.form.setAllFormValue({[formId]:res.data?res.data[formId]:{rows:[]}});
                //有回调执行回调，没有回调执行setCardStatus
                (callback && typeof callback==='function') ? callback.call(this,formId,status): setCardStatus.call(this,formId,status);
                isRefresh && toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
            }
        })
    }
    /**
     * 采购信息打开弹出框后事件
     * @param setBtnStatus
     */
    onStockDialogAfterShow = (setBtnStatus,callback,status,isRefresh)=>{
        setBtnStatus && setBtnStatus.call(this,status);//设置按钮状态
        let param = getCurParam.call(this,constProp.PK_SUPPLIER);//获得请求参数
        let supstock = getCurParam.call(this,constProp.PK_SUPSTOCK,this.state.dblClkRecord);
        ajax({
            url:this.Urls.queryStockInfoUrl,
            data:{pk_supplier:param[constProp.PK_SUPPLIER][0],pk_supstock:supstock[constProp.PK_SUPSTOCK][0],nodeType:this.props.nodeType},
            success:(res)=>{
                showFormulaSetting.call(this,res,{[constProp.SUPSTOCK_CARD]:'form'});
                res.success && this.props.form.setAllFormValue({[constProp.SUPSTOCK_CARD]:res.data?res.data[constProp.SUPSTOCK_CARD]:{rows:[]}});
                (callback && typeof callback==='function') ? callback.call(this,constProp.SUPSTOCK_CARD,status): setCardStatus.call(this,constProp.SUPSTOCK_CARD,status);
                isRefresh && toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
            }
        })
    }
    /**
     * 渲染卡片子表
     * @returns {any[]}
     */
    renderSubTables(addCardTableButton,modelSave,addCardTableOperateField){
        addCardTableOperateField && addCardTableOperateField();
        const {createCardTable} = this.props.cardTable;
        return this.state.card.table.tableIds.map((key)=>{
            return(
                    <div className="nc-bill-table-area">
                        <NCScrollElement name={this.state.card.table[key].tableId}>
                            {createCardTable(key,this.state.card.table[key].property)}
                        </NCScrollElement>
                    </div> 
            );
        })
    }
    modelSave = ()=>{}
    /**
     * 添加卡片子表肩部按钮
     * @param key
     * @returns {*}
     */
    addCardTableButton = (key)=>{
        let { createButtonApp} = this.props.button;
        return ( <div className="shoulder-definition-area">
            <div className="definition-icons">
                {this.state.card.table[key].btnApp && createButtonApp(this.state.card.table[key].btnApp)}
            </div>
        </div>);
    }
    /**
     * 添加卡片子表操作列
     */
    addCardTableOperateField =()=>{
        let meta = this.props.meta.getMeta();//获得元数据
        //迭代为元数据添加操作列
        Object.keys(this.state.card.table).forEach((key)=>{
            this.state.card.table[key].field &&
            meta[key] && meta[key].hasOwnProperty('items') &&
            !meta[key].items.find((item)=>item.attrcode=='opr') && meta[key].items.push(this.state.card.table[key].field);
        });
    }
    /**
     * 卡片分页导航事件
     */
    handleCardPagination = (props,pk)=>{
        if(!pk){return;}
        this.props.cardPagination.setCardPaginationId({id:pk,status:1})
        ajax({
            url:this.Urls.queryCardUrl,
            data:{
                pk_supplier:pk,
                pageCode:this.props.pagecode,
                nodeType:this.props.nodeType,
                pk_curOrg:this.state.envParam.pk_org,
                status:this.state.status,//！！！新增取消时回滚单据号
            },
            success:(res)=>{
                if(res.success){
                    this.setState({
                        selectedRecords:[res.data.head[constProp.SUP_BASE_CARD].rows[0].values],
                        dirtyRecords:[res.data.head[constProp.SUP_BASE_CARD].rows[0].values]},()=>{
                        this.setCardValue({data:res.data},()=>{
                            //回调 表单表格设置状态
                            this.setCardStatus({status:'browse'},setCardButtonStatus);
                        });
                    })
                }
            }
        })
    }
    /**
     * 企业地址打开参照编辑后保存事件
     * @param data
     * @param fullname
     */
    onCompanyAddressAfterSave = (data,fullname)=>{
        this.props.form.setFormItemsValue(constProp.SUP_BASE_CARD,{'corpaddress':{display:fullname,value:data['pk_address']}});
    }
    /**
     * 主列表 操作列删除 弹窗回调事件
     * @param isAsyncDel
     */
    onMainTableOperateDelClick=(isAsyncDel)=>{
        let param = getCurParam.call(this,'pk_supplier');
        let nextPk = this.state.openCard?this.props.cardPagination.getNextCardPaginationId ({id:param.pk_supplier[0],status:'1'}):null;
        this.doDelete({...param,isAsyncDel:isAsyncDel,nodeType:this.props.nodeType,pk_curOrg:this.state.envParam.pk_org},
            isAsyncDel?()=>{
                this.deleteTableRecordByIndex(param);
                //this.afterDeletePrompt(isAsyncDel);
            }:null,(res)=>{
                if(res.success){
                    this.deleteAfterEvent({...param,nextPk:nextPk},isAsyncDel?()=>{}:this.deleteTableRecordByIndex);//删除后事件
                    !isAsyncDel && this.afterDeletePrompt(isAsyncDel);
                }
            }
        );
    }
    doDelete = (param,beforeCallback,afterCallback)=>{
        beforeCallback && beforeCallback();
        ajax({
            url:this.Urls.delSupplier,
            data:param,
            success:(res)=>{
                afterCallback && afterCallback(res);
            }
        })
    }
    afterDeletePrompt = (isAsyncDel)=>{
        this.DeleteDialog.closeDialog();//关弹窗
        this.setState({openDeleteDialog:false},()=>{
            ///* 国际化处理： 数据已停用并执行后台删除任务，稍后请在删除查询方案中查询结果！*/ or /* 国际化处理： 删除成功！*/
            toast({ color: 'success', content: isAsyncDel?(this.Lang['10140SUG-000148']+this.Lang['10140SUG-000149']):this.Lang['10140SUG-000073']});
        });
    }
    /**
     * 删除表格行
     * @param param
     */
    deleteTableRecordByIndex = (param)=>{
        param.pk_supplier && param.pk_supplier.forEach(pk=>{
            this.props.cardPagination.setCardPaginationId({id:pk,status:'3'});
        })
        param.indexs && setTimeout(()=>{
            // let newIndexs = param.indexs.reverse();
            param.indexs.forEach(index=>{//迭代按index删除record
                this.props.table.deleteTableRowsByIndex(this.state.table.mainTable.id,index);
            });
        },0);
    }
    /**
     * 删除后事件
     * @param param
     * update by yufwm 2020/03/13 后台删除 弹窗关闭
     * update by yufwm 2020-03-13 删除后查询列表数据 不提示查询信息
     */
    deleteAfterEvent = (param,deleteTableRecordByIndex)=>{
        //在列表上删除行
        // deleteTableRecordByIndex && deleteTableRecordByIndex(param);
        let mainTableData = {rows:this.state.queryRecords}
        let tableData = mainTableData || this.props.table.getAllTableData(this.state.table.mainTable.id);
        if(this.state.openCard){
            let record = null;
            if(!!tableData && tableData.rows.length>0 && param.nextPk){
                record = tableData.rows.find(row=>{if(param.nextPk == row.values['pk_supplier'].value){return row}else{return tableData[tableData.rows.length-1];}});
            }
            //在卡片上 需要重新加载卡片信息
            this.setState({selectedRecords:record?[record]:null,dirtyRecords:record?[record]:null},()=>{
                this.initPageData(this.setCardValue,this.setCardStatus,null,null,null,!record);
                setTimeout(()=>{
                    !record && setCardButtonStatus.call(this,'add_cancel',true);
                    !record && this.props.button.setButtonVisible({
                        Card_Enable:false,
                        Card_Disable:false,
                        Card_Approve:false,
                        Card_UnApprove:false 
                    });
                },0);
            })
        }else{
            // update by yufwm 2020-03-13 删除后查询列表数据 不提示查询信息
            this.onSearch({checagepage:true},this.setTableData);
        }
        // update by yufwm 2020/03/13
        // 后台删除 弹窗关闭
        this.setState({openDeleteDialog:false});
    }
    /**
     * 冻结解冻业务单元选择
     * @param value
     */
    onBusinessUnitChange = (value)=>{
        this.state.freezeOrgParam.value = value;
        this.setState(this.state);
    }
    /**
     * 冻结解冻弹出框 内容
     * @returns {*}
     * update by yufwm 2020-03-13 给 BusiUnitRefer参照添加 固定宽度
     */
    freezeOrgSelect = ()=>{
        let {freezeOrgParam} = this.state,{BusiUnitRefer} =referUrls;
       return(
            <div className="sup-freeze-div" style={{display: 'flex'}}>
                <div style={{display: 'flex',alignItems: 'center'}}>
                    <div className="ncc-hr-font" style={{marginRight: 10,width: 150,'text-align':'right'}}>{this.Lang['10140SUG-000130']}</div>
                </div>
                <div style={{display: 'flex',alignItems: 'center',width:'300px'}}>
                    {window[BusiUnitRefer].default({...freezeOrgParam})}
                    {/* <BusinessUnitTreeRef {...this.state.freezeOrgParam}/> */}
                </div>
            </div>
       );
    }
    /**
     * 冻结解冻窗口关闭回调事件
     */
    onFreezeDialogClose = (callback)=>{
        let param = getCurParam.call(this,'pk_supplier');
        let orgs = (this.state.freezeOrgParam && this.state.freezeOrgParam.value && this.state.freezeOrgParam.value.length>0)?this.state.freezeOrgParam.value.map(org=>{
            return org.refpk;
        }):[];
        ajax({
            url:this.Urls.freezeSupplierUrl,
            data:Object.assign(
                param,
                {freezeOrgs:orgs},
                {freeze:this.state.otherParam.freeze},
                {nodeType:this.props.nodeType,pk_curOrg:this.state.envParam.pk_org}),
            success:(res)=>{
                this.state.freezeOrgParam.value = {};
                this.setState(this.state,()=>{
                    //回调中关闭窗口
                    callback && callback();
                    toast({title:this.state.otherParam.freeze?this.Lang['10140SUG-000150']:this.Lang['10140SUG-000151'],color:'success'});/* 国际化处理： 冻结成功！,解冻成功！*/
                })
            }
        })
    }
    /**
     * dialog关闭后事件
     */
    onAfterDialogClose = (callback)=>{
        this.setState({openDialog:false},callback);
    }
    /**
     * 生成客户弹窗内容
     */
    createCustContent = ()=>{
        const onAfterCreateCustEvent = function(){}
        const {form} = this.props;
        const {createForm} = form;
        return createForm('createCust',{onAfterEvent: onAfterCreateCustEvent.bind(this)});
    }
    /**
     * 生成客户确认按钮点击前 事件
     */
    onCreateCustSureBtnClick = (callback,destroyHotKeys)=>{
        destroyHotKeys(true,()=>{
            if(!this.props.form.isCheckNow('createCust')){
                destroyHotKeys(false);
                return;
            }
            let custData = this.props.form.getAllFormValue('createCust');
            custData.status = '2';
            custData.areacode = 'createCust';
            let param = getCurParam.call(this,'pk_supplier',this.state.selectedRecords);
            let data = {
                model:custData,
                pageid:this.props.pagecode
            };
            validateFormulaSetting.call(this,data,()=>{
                ajax({
                    url:this.Urls.saveCreateCustUrl,
                    data:{form:data,tsMap:param.tsMap},
                    success:(res)=>{
                        destroyHotKeys(false,()=>{
                            this.onAfterDialogClose(()=>{
                                toast({title:this.Lang['10140SUG-000069'],color:'success'});
                                this.state.openCard?this.initPageData(this.setCardValue,this.setCardStatus):this.onSearch({checagepage:true},this.setTableData)
                            })
                        })
                    },
                    error:(e)=>{destroyHotKeys(false,()=>{
                        toast({title:e.message,color:'error'});
                        throw new Error(e);
                    })}
                })
            },{'creatCust':'form'},'form');
        })
    }
    /**
     * 生成客户取消按钮点击事件
     * @param callback
     */
    onCreateCustCancelBtnClick = (callback,destroyHotKeys)=>{
        destroyHotKeys(true,()=>{
            promptBox({
                color:'warning',
                title:this.Lang['10140SUG-000077'],/* 国际化处理： 询问*/
                content:this.Lang['10140SUG-000068'],/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick:()=>{
                    destroyHotKeys(false,()=>{
                        this.Dialog.closeDialog(this.onAfterDialogClose);
                    });
                },
                cancelBtnClick:()=>{destroyHotKeys(false);}
            })
        })
    }
    /**
     * 生成客户弹窗关闭后事件
     */
    onAfterCreateCustClose = ()=>{
        this.setState({openCreateCust:false});
    }
    /**
     * 创建 关联客户内容
     * @returns {*}
     */
    associateCustContent = ()=>{
        const onAfterFormEvent = function(){}
        const {form} = this.props;
        const {createForm} = form;
        return createForm('associcust',{onAfterEvent: onAfterFormEvent.bind(this)});
    }
    /**
     * 关联客户确认按钮点击事件
     */
    onAssociateCustSureClick = (callback,destroyHotKeys)=>{
        var me = this;
        if(!!me.state.otherParam ){
            //存在已关联的客户信息
            let customer = eval('('+me.state.otherParam+')');//JSON.parse(me.state.otherParam.customer);
            if(customer && customer.hasOwnProperty('customer')){
                customer = customer.customer;
            }
            //修改交互方式，由原来的dialog方式改成目前的promptBox的方式 
            destroyHotKeys(true,()=>{
                promptBox({
                    color:'warning',
                    title:this.Lang['10140SUG-000077'],/* 国际化处理： 询问*/
                    content:this.inlt && this.inlt.get('10140SUG-000153',{custCode:customer.code,custName:customer.name}),/* 国际化处理： 当前供应商已经关联编码[{${customer.code}]名称[${customer.name}]的客户，是否取消已有客商关系，重新建立客商关系？,当前供应商已经关联编码,名称,的客户,是否取消已有客商关系,重新建立客商关系*/
                    beSureBtnClick:()=>{
                        //关联客户点击确认按钮事件
                        this.onAssociateCustPrompSureBtnClick(callback,destroyHotKeys); 
                    },
                    cancelBtnClick:()=>{destroyHotKeys(false);}
                })
            })
        }else{
            //不存在已关联客户信息
            destroyHotKeys(true,()=>{this.onAssociateCustPrompSureBtnClick(callback,destroyHotKeys);});
        }
    }
    /**
     *  关联客户取消按钮 点击事件
     */
    onAssociateCustCancelBtnClick = (callback,destroyHotKeys)=>{
        destroyHotKeys(true,()=>{
            promptBox({
                color:'warning',
                title:this.Lang['10140SUG-000067'],/* 国际化处理： 确认取消*/
                content:this.Lang['10140SUG-000068'],/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick:()=>{
                    destroyHotKeys(false,()=>{
                        this.Dialog.closeDialog(this.onAfterDialogClose);
                    });
                },
                cancelBtnClick:()=>{
                    destroyHotKeys(false);
                }
            })

        })
    }
    /**
     * 关联客户确认时 提示框中确认按钮点击事件
     */
    onAssociateCustPrompSureBtnClick = (callback,destroyHotKeys)=>{
        if(!this.props.form.isCheckNow('associcust')){
            destroyHotKeys(false);
            return;
        }
        let associateData = this.props.form.getAllFormValue("associcust");
        associateData.areacode = 'associcust';
        let data = {
            form:{
                model:associateData,
                pageid:this.props.pagecode
            },
            inCard:this.state.openCard
        };
        validateFormulaSetting.call(this,data,()=>{
            ajax({
                url:this.Urls.saveAssociateCustUrl,
                data,
                success:(res)=>{
                    if(res.success){
                        destroyHotKeys(false,()=>{
                            this.Dialog.closeDialog(()=>{
                                this.onAfterDialogClose(()=>{
                                    this.state.openCard?res.data&&this.setState({selectedRecords:[res.data.supplier_baseInfo_card.rows[0].values]},()=>{
                                        this.initPageData(this.setCardValue,this.setCardStatus);
                                    }):this.onSearch({checagepage:true},this.setTableData);
                                });
                            });
                            
                            toast({title:this.Lang['10140SUG-000163'],color:'success'});/* 国际化处理： 操作成功！*/
                        })
                    }
                },
                error:(e)=>{destroyHotKeys(false,()=>{
                    //不知道平章这里怎么弄得导致后端抛异常的提示框弹不出来，只能前端再提示了
                    toast({content:e.message,color:'danger'});
                });}
            })
        },{'associcust':'form'},'form');
    }
    /**
     * 按组织查看 弹出框内容
     * @returns {*}
     */
    orgBrowseContent = ()=>{
        return(<div style={{width:'100%'}}><SupOrgBrowse {...Object.assign(this.props,{Lang:this.Lang,inlt:this.inlt})} ref={(SupOrgBrowse)=>{this.SupOrgBrowse = SupOrgBrowse;}}/></div>)
    }
    /**
     * 按组织查看关闭窗口时 清空数据
     */
    clearOrgBrowseData = (callback)=>{
        this.SupOrgBrowse.initOrgBrowsePage(callback);
    }
    /**
     * 查看组织档案 弹出框内容
     * @returns {*}
     */
    browseOrgDocContent = ()=>{
        return(<SupBrowseOrgDoc {...Object.assign(this.props,{envParam:this.state.envParam},{Lang:this.Lang,inlt:this.inlt})} ref={(SupBrowseOrgDoc)=>{this.SupBrowseOrgDoc = SupBrowseOrgDoc;}}/>)
    }
    /**
     * 查看组织档案  弹窗关闭前 清空数据
     */
    onBeforeBrowseOrgDocDialogClose = (callback)=>{
        this.SupBrowseOrgDoc.clearHasAssignTableData(()=>{
            //清空表格数据
            this.props.table.setAllTableData('browse_org_supplier',{rows:[]});
            //清空查询区
            this.props.search.clearSearchArea('browse_org_supplierquery');
            callback && callback();
        })
    }
    /**
     * 已分配组织查询内容区
     * @returns {*}
     */
    queryHasAssignOrgContent = ()=>{
        return (<QueryHasAssignOrg {...Object.assign(this.props,{selectedRecords:this.state.selectedRecords},{Lang:this.Lang,inlt:this.inlt})} ref={(HasAssignOrg)=>{this.HasAssignOrg = HasAssignOrg;}}/>)
    }
    /**
     * 分配 内容
     * @returns {*}
     */
    assignContent = ()=>{
        return(<OrgSelect {...Object.assign(this.props,{Lang:this.Lang,inlt:this.inlt})} ref={( item )=> this.orgSelect = item}/>)
    }
    /**
     * 供应商分配确定前事件
     * @param callback
     */
    onSupFastAssignBeforeSureClick = (callback)=>{
        this.assignSupplier(true,callback);
    }
    /**
     * 供应商取消分配确定前事件
     * @param callback
     */
    onSupFastCancelAssignBeforeSureClick = (callback)=>{
        this.assignSupplier(false,callback);
    }
    /**
     * 分配供应商
     * @param assign
     * @param callback
     */
    assignSupplier = (assign,callback)=>{
        let targetOrgs = this.orgSelect.getData();
        let param = getCurParam.call(this,'pk_supplier');
        targetOrgs?ajax({
            url:assign?this.Urls.assignUrl:this.Urls.cancelAssignUrl,
            data:Object.assign(param,{targetIds:targetOrgs},{isFastAssign:true}),
            success:(res)=>{
                this.orgSelect.clearData();//清空分配的数据
                this.state.openCard && this.initPageData(this.setCardValue,this.setCardStatus);
                res.success && toast({content:assign?this.Lang['10140SUG-000023']:this.Lang['10140SUG-000133'],color:'success'});/* 国际化处理： 分配成功！,取消分配成功！*/
                res.success && callback && callback(res);
            }
        }):toast({content:this.Lang['10140SUG-000134'],color:'warning'});/* 国际化处理： 没有指定操作的目标组织！*/
    }
    /**
     * 批改完成事件
     * @param callback
     * update by yufwm 2020-03-17 url 编写错误 修改
     */
    onBatchUpdateFinish = (callback = ()=>{})=>{
        let me = this;
        let param = me.BatchUpdateComp.getBatchUpdateData();
        !!param && ajax({
            url:this.Urls.quickBatchUpdateUrl,
            data:param,
            success:(res)=>{
                //批改后刷新表单或表格
                me.state.openCard?me.initPageData(me.setCardValue,me.setCardStatus): me.onSearch({checagepage:true},me.setTableData);
                //批改后清空批改信息
                me.BatchUpdateComp.cleanBatchUpdateData();
                //批改后关闭批改弹窗
                callback && callback();
                res.success && toast({title:this.Lang['10140SUG-000161'],color:'success'});/* 国际化处理： 批改成功！,批改成功*/
            }
        })
    }
    /**
     * 批改弹出框取消事件
     */
    onBatchUpdateCancelClick = (callback)=>{
        this.BatchUpdateComp.cleanBatchUpdateData(callback);
    }
    /**
     * 供应商联系人弹出维护后关闭事件
     */
    onSupBankaccDialogClose = ()=>{
        this.SupBankAcc.setCardStatus(false);
        this.setState(this.state);
    }
    /**
     * 银行账户关闭后事件
     */
    onAfterBankaccClose = ()=>{
        this.setState({openBankacc:false});
    }
    /**
     * 供应商银行账户关闭事件
     * @param callback
     */
    onSupBankClickClose = (callback)=>{
        this.SupBankAcc.setCardStatus(false);
        callback && callback();
    }
    /**
     * 联系人dialog关闭后事件
     */
    onLinkmanDialogClose = (callback)=>{
        let {formId,targetId} = this.state.dialog.linkman;
        if(!this.props.form.isCheckNow(formId)){
            return;
        }

        let formData = this.props.form.getAllFormValue(formId);
        // 根据平台返回的状态判定是新增还是修正
        let linkEditStatus = formData.rows[0].status
        let isAdd = linkEditStatus == 2
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        var data = {
            model: formData,
            pageid: this.props.pagecode,
        };
        //验证公式
        validateFormulaSetting.call(this,data,()=>{
            ajax({
                url:this.Urls.saveLinkmanUrl,
                data: data,
                success:(res)=>{
                    callback && callback();//关闭弹窗
                    this.setState({openDialog:false},()=>{
                        let rowNumber = this.props.cardTable.getNumberOfRows(targetId);
                        //1 更新 2 新增
                        !isAdd?
                            resetTableRows.call(this,targetId,convertForm2GridData.call(this,res.data[formId].rows[0].values,targetId)):
                            this.props.cardTable.addRow(targetId, rowNumber, convertForm2GridData.call(this,res.data[formId].rows[0].values,targetId));
                        this.props.cardTable.setStatus(targetId,'edit');
                    });
                }
            });
        },{[formId]:'form'},'form');
    }
    /**********************************dialog ↑**********************************/
    //渲染卡片楼层
    renderAnchor =()=>{
        //渲染楼层
        const renderAnchorItems = (items)=> {
            return items.map((item)=>{
                return (<NCScrollLink
                    to={item.formId || item.tableId}
                    spy={true}
                    smooth={true}
                    duration={300}
                    offset={-100}>
                    <p>{item.formName || item.tableName}</p>
                </NCScrollLink>)
            })
        };
        //获得楼层项
        const getAnchorItems = ()=>{
            let anchorItems = new Array();
            anchorItems.push(this.state.card.form);
            for(let anchorItemId of this.state.card.table.tableIds){
                anchorItems.push(this.state.card.table[anchorItemId]);
            }
            return anchorItems;
        };
        return (renderAnchorItems(getAnchorItems()));
    }
    
    /***************************************common area******************************************/
    /**
     * 执行打印
     * @param url
     * @param nodeKey
     * @param pks
     */
    executePrint = ({isPrint,url,nodeKey,pks,isMainPrint}={})=>{
        var tableorder = isMainPrint && this.props.table.getSortParam("supplier_baseInfo");
        var userJson = isMainPrint && 
        {userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`};
        !!isPrint?print('pdf',url,
        Object.assign({
            funcode:this.props.appcode,
            appcode:this.props.appcode,
            nodekey:nodeKey,
            oids:pks},isMainPrint?userJson:{})):
        output({data: 
            Object.assign({
                funcode:this.props.appcode,
                nodekey:nodeKey,
                oids: pks,
                outputType: "output"
            },isMainPrint?userJson:{}), url: url});
    }
    /***************************************common area******************************************/
    /**
     * 渲染输出组件
     */
    drawOutputComp = ()=>{
        return(
            <PrintOutput
                ref='printOutput'
                url={this.state.printUrl}
                data={{
                    funcode:this.props.appcode,//应用的appcode
                    nodekey:this.state.printNodeKey,  //需要与数据库保持一致
                    oids: this.state.printPks,//打印的数据主键集合
                    outputType: "output"
                }}
            >
            </PrintOutput>
        )
    }
    /**
     * 渲染供应商列表
     */
    drawSupplierTable = ()=>{
        const {table,button ,search,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        const { NCCreateSearch } = search;
        const { createSimpleTable } = table;
        let { createButtonApp} = button;
        var me = this;
        let title = this.props.nodeType == 'GLOBE_NODE'?this.Lang['10140SUG-000186']:(this.props.nodeType=='GROUP_NODE'?this.Lang['10140SUG-000187']:this.Lang['10140SUG-000188']);
        return(
            <div className="nc-single-table" style={{display:this.state.openCard?'none':'block'}}>
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                    {/* <div className="nc-singleTable-header-area" > */}
                        <div className="header-title-search-area">
                            {createBillHeadInfo({title:title,initShowBackBtn:false})}
                            <div className="title-search-detail">
                                {!this.state.openCard &&
                                <span className='showOff'>
                                        <NCCheckbox {...this.state.table.showOff}>{this.state.table.showOff.name}</NCCheckbox>
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="header-button-area">
                            {createButtonApp(this.state.table.buttonConfig)}
                        </div>
                    {/* </div> */}
                </NCDiv>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(me.state.table.search.id, me.state.table.search)}
                </div>
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(me.state.table.mainTable.id, Object.assign({}, me.state.table.mainTable, {
                        dataSource
                    }))}
                </div>
            </div>
        )
    }
    /**
     * 渲染卡片分页组件
     */
    isRenderCardPagination = ()=>{
        let {openCard,status,selectedRecords} = this.state;

        return openCard && (status == 'browse'
            || status == 'edit_cancel'
            || (selectedRecords && selectedRecords.length>0 && status == 'add_cancel'));
        // if(openCard && (status == 'browse'
        //     || status == 'edit_cancel'
        //     || (selectedRecords && selectedRecords.length>0 && status == 'add_cancel'))){

        //     return true;
        // }
        // return false;
    }
    /**
     * 渲染供应商卡片
     */
    drawSupplierCard = ()=>{
        const {button ,form,cardPagination, BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        const {createCardPagination} = cardPagination;
        const {createForm} = form;
        let { createButtonApp} = button;
        let title = this.props.nodeType == 'GLOBE_NODE'?this.Lang['10140SUG-000186']:(this.props.nodeType=='GROUP_NODE'?this.Lang['10140SUG-000187']:this.Lang['10140SUG-000188']);
        let browseStatus = this.state.openCard && (this.state.status =='browse' || this.state.status == 'edit_cancel' || this.state.status =='add_cancel');
        return(
            <div  className='nc-bill-extCard'  style={{display:this.state.openCard?'block':'none'}}>
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            {/* 应测试部要求，为了自动化测试必须替换成平台的createBillHeadInfo */}
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                        title:this.props.nodeType == 'GLOBE_NODE'?this.Lang['10140SUG-000186']:(this.props.nodeType=='GROUP_NODE'?this.Lang['10140SUG-000187']:this.Lang['10140SUG-000188']),
                                        backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                                        showBackBtn:browseStatus,
                                        initShowBackBtn:browseStatus
                                    }
                                )}
                            </div>
                            <div className="header-button-area">
                                {createButtonApp(this.state.card.buttonConfig)}
                            </div>
                            {this.isRenderCardPagination()?
                                <div className='header-cardPagination-area'>
                                    {createCardPagination({	
                                        handlePageInfoChange: this.handleCardPagination,
                                        dataSource:dataSource})}
                                </div>
                                :null
                                
                            }
                        {/* </div> */}
                        </NCDiv>
                    </NCAffix>
                    {/*渲染楼层*/}
                    <NCAnchor>
                        {this.renderAnchor()}
                    </NCAnchor>
                    {/*渲染表单区域*/}
                    <div className="nc-bill-form-area">
                        <NCScrollElement name={this.state.card.form.formId}>
                            {createForm(this.state.card.form.formId, this.state.card.form.action)}
                        </NCScrollElement>
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                {this.renderSubTables(this.addCardTableButton,this.modelSave,this.addCardTableOperateField)}
                </div>
            </div>
        )
    }
    /**
     * 渲染供应商整个页面
     */
    renderPage = ()=>{
        const {ncmodal} = this.props;
        const {createModal} = ncmodal;
        return (
            <div style={{width:'100%',height:'100%'}}>
                {createModal('modal')}
                {/* 主卡片 */}
                {this.state.openCard && this.drawSupplierCard()}
                {/* 主列表 */}
                {!this.state.openCard && this.drawSupplierTable()}
                <AttachmentMng  {...{Lang:this.Lang}} ref={(Attachment)=>{this.Attachment=Attachment;}}/>
                {/* 模板按钮 */}
                {this.state.openCard && this.state.envParam && <SupTemplate {...Object.assign(this.props,{
                    config:{
                        loadData:true,
                        appcode:this.props.appcode,
                        pagecode:this.props.pagecode,
                        formId:this.state.card.form.formId,
                        subGrid2:this.state.card.table.suplinkman.tableId,
                        subGrid3:this.state.card.table.supcountrytaxes.tableId,
                        pk_curOrg:this.state.envParam.pk_org,
                        nodeType:this.props.nodeType
                    }},{json:this.Lang})} ref={(SupTemplate)=>{this.SupTemplate=SupTemplate;}}/>}
                {/* 向导批改 */}
                {this.state.batchUpdateStepClick && <BatchUpdateWarzid ref={(BatchUpdateWarzid)=>{this.BatchUpdateWarzid=BatchUpdateWarzid}} {...Object.assign(this.props,{envParam:this.state.envParam,Lang:this.Lang},{listener:{onBeforeSureClick:(callback)=>{callback && callback();let me = this;me.state.openCard?me.initPageData(me.setCardValue,me.setCardStatus): me.onSearch({checagepage:true},me.setTableData)}}})}/>}
                 {/* 向导分配 */}
                {this.state.assignStepClick && <AssignStepDialog {...Object.assign(this.props,{envParam:this.state.envParam,Lang:this.Lang})} ref={(AssignStepDialog)=>{this.AssignStepDialog=AssignStepDialog;}}/>}
                
                {ReactDOM.createPortal(this.state.openDialog?<DialogWapper Lang={this.Lang} ref={(Dialog)=>{this.Dialog=Dialog;}}/>:null,document.body)}
                {/* 删除Dialog*/}
                {this.state.openDeleteDialog && ReactDOM.createPortal(<DeleteDialogWapper {...Object.assign(getDialogConfig.call(this,'DeleteDialog'),{Lang:this.Lang})} ref={(DeleteDialog)=>{this.DeleteDialog=DeleteDialog;}}/>,document.body)}
                 {/* 打印输出 */}
                {this.drawOutputComp()}
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    moduleId = 'supplierExcel'
                    billType = {this.state.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.props.appcode}
                    pagecode={this.props.pagecode}
                />
                </div>
        )
    }
    render(){
        return(<div>{this.state.loadLang?this.renderPage():<div/>}</div>);
    }
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65