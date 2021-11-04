//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast, cardCache, high, getBusinessInfo,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const {getDefData, setDefData} = cardCache;
import {
    onClickButton, onClickSearchBtn, onRowChecked, oprButtonClick, onSelectedAll,
    searchAfterEdit, onRowDoubleClick, onSelectedChange, onTableAfterEdit
} from './events';
import AccountGrantModal from '../AccountGrant/AccountGrantModal';
import Utils from '../../../public/utils/index'
import manageModePlugIn from "../../../public/utils/ManageModeUtils";
import './index.less'
const {NCCheckbox,NCDiv} = base;
const {ExcelImport} = high;
let ajaxurl = {
    queryGrid: '/nccloud/uapbd/bankacc/queryGridData.do',
    queryGridByPage: '/nccloud/uapbd/bankacc/queryGridDataByPage.do',
    queryCard: '/nccloud/uapbd/bankacc/queryCardData.do',
    saveAdd: '/nccloud/uapbd/jobglb/addsave.do',
    delete: '/nccloud/uapbd/jobglb/delete.do',
    enable: '/nccloud/uapbd/jobglb/enable.do',
    disable: '/nccloud/uapbd/jobglb/disable.do'
}
/**
 * author zhenmx
 *
 */
class BankAccountBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadLang:false,
            searchValue: '',
            changeValue: '',
            currentOrg: '',
            context: {
                NODE_TYPE: props.config.NODE_TYPE,
                pk_org: '',
                pk_org_v: '',
                org_Name: '',
                org_v_Name: '',
                mdid: '',
                PermissionOrgIDs: []
            },//放当前上下文信息
            json:{},
            x:''
        }
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        let tempParam = {
            pagecode: props.config.pagecode,//页面id
        }, langParam = {
            moduleId: "10140BANKACC", domainName: 'uapbd'
        }
        this.loadTempAndLang(props,tempParam,langParam,(tempdata, mutiJson, inlt)=>{
            this.resetStateAfterLoadLang(mutiJson,inlt,tempdata,(data) => {
                if (data) {
                    let meta = data.template;
                    let buttonAry = [];
                    data.button.map((obj) => {
                        if (obj.hasOwnProperty('area') && obj.hasOwnProperty('key') && obj.area === 'currency-opr-col') {
                            buttonAry.push(obj.key);
                        }
                    });
                    this.config.oid = meta[props.config.searchId].oid;
                    meta = this.modifierMeta(props, meta, buttonAry)
                    props.meta.setMeta(meta, () => {
                        this.initialization();
                    });
                    data.button && props.button.setButtons(data.button);
                    data.button && props.button.setPopContent(['oprDelete'], this.state.json['10140BANKACC-000085']);
                    let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.appcode,pagecode: props.config.pagecode_card},()=>{
                        let display = props.search.getSearchValByField("bankaccount_search",'pk_org').display;
                        if(display==""){
                            return;
                        }
                        this.loadGridData(this.getLoadDataParam(this.props))
                    });
                    props.button.setUploadConfig("import",excelimportconfig);
                    props.button.setButtons(data.button);
                }
            })
        })
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
        props.MultiInit.getMultiLang(Object.assign(langParam,{callback:langCallback}));
    }
    resetStateAfterLoadLang = (mutiJson,inlt,tempdata,callback) => {
        this.state.context = tempdata.context;
        this.state.currentOrg = tempdata.context.pk_org;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this,tempdata))
    }

    componentDidMount() {
        this.props.button.setButtonDisabled(
            ['btnPrint', 'output',], true);
    }
    modifierMeta = (props, meta, buttonAry) => {
        let {searchId, gridId, bankaccuse, formId} = props.config;
        meta[gridId].showindex = true;
        meta[gridId].status = 'browse';//设置表格状态
        //添加主组织参照权限过滤
            let pk_orgitem = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org');
            pk_orgitem.queryCondition = () => {
                return {
                    AppCode: props.config.appcode,
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            };
            pk_orgitem.isMultiSelectedEnabled = true;
            pk_orgitem.isShowDisabledData = true;
        

        //添加超链接
        meta[gridId].items = meta[gridId].items.map((item, key) => {
            //item.width = '100px';
            if (item.attrcode === 'accnum') {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                setDefData('id', this.config.datasource, record['pk_bankaccbas'].value);
                                let editurl = '/card';
                                props.pushTo(editurl, {
                                    status: 'browse',
                                    pagecode:this.props.config.pagecode_card,
                                    id: record.pk_bankaccbas.value,
                                    appcode: props.config.appcode
                                });
                            }}
                        >
						{record && record['accnum'] && record['accnum'].value}
					</span>
                    );
                };
            }
            return item;
        });

        //添加操作列
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140BANKACC-000069'],
            itemtype: 'customer',
            width: 200,
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
                //end
                //停启用只能显示一个
                let copybtnarr = Object.assign([], buttonAry);
                if (record.enablestate.value === true) {
                    let i = copybtnarr.findIndex((v) => {
                        return v === 'oprEnable';
                    })
                    copybtnarr.splice(i, 1);
                }
                if (record.enablestate.value !== true) {
                    let i = copybtnarr.findIndex((v) => {
                        return v === 'oprDisable';
                    })
                    copybtnarr.splice(i, 1);
                }
                //
                return props.button.createOprationButton(rem.editFlag ? copybtnarr : newbuttonAry, {
                    area: 'currency-opr-col',
                    buttonLimit: 3,
                    onButtonClick: oprButtonClick.bind(this, record, index,)
                });
            }
        });
        return meta;
    }

    initializeButtons = ()=>{
        this.props.button.setButtonDisabled(
            ['btnDel', 'btnUpgrade', 'btnAdjust', 'btnCancellAcc',
                'btnAuthorization', 'authorization', 'usufruct', 'unAuthorization', 'listEnable', 'listDisable'], true);
    }
    initialization = () => {
        let searchVal = getDefData('searchVal', this.config.datasource);
        if (searchVal !== 'undefined' && searchVal && searchVal.conditions) {
            this.props.search.setSearchValue(this.config.searchId, searchVal);
            this.loadGridData(this.getLoadDataParam(this.props),this.initializeButtons)
        } else {
            searchVal = {
                conditions: [],
                logic: 'and'
            }
            searchVal.conditions.push({
                field: this.config.NODE_TYPE === 'ORG_NODE' ? 'pk_group' : 'pk_org',
                value: {
                    firstvalue: getBusinessInfo().groupId,
                    secondvalue: ''
                },
                oprtype: '=',
                display: getBusinessInfo().groupName
            });
            this.props.search.setSearchValue(this.config.searchId, searchVal);
            //财务组织节点查询区 所属集团不可用
            this.props.search.setDisabledByField(this.config.searchId, 'pk_group',this.config.NODE_TYPE === 'ORG_NODE');
            this.initializeButtons.call(this);
        }
    }
    //获取请求参数
    getLoadDataParam = (props) => {
        let checkflag = getDefData('checkflag', this.config.datasource)
        let searchVal = getDefData('searchVal', this.config.datasource)
        let pageInfo = props.table.getTablePageInfo(props.config.gridId);
        let paramdata = {
            pageInfo: pageInfo,
            custcondition: {
                conditions: [{
                    field: 'NODE_TYPE',
                    value: {
                        firstvalue: props.config.NODE_TYPE
                    },
                    oprtype: '='
                }]
            },
            queryAreaCode: props.config.searchId,
            pageCode: props.config.pagecode,
            querycondition: searchVal,
            oid: props.config.oid,
            querytype: 'tree',
            appcode: props.config.appcode
        }
        //如果没有勾选显示停用，查询条件里面的enablestate =1 2  只显示启用和未启用
        if (!checkflag) {
            paramdata.custcondition.conditions.push({
                display: this.state.json['10140BANKACC-000086'], /* 国际化处理： 启用状态*/
                field: 'enablestate',
                oprtype: 'in',
                value: {firstvalue: '2', secondvalue: '1'}
            });
        }
        return paramdata;

    }


//加载列表数据
    loadGridData = (paramData, callback) => {
        const _this = this;
        const {gridId, datasource, appcode, pagecode} = _this.config;
        const {table} = _this.props;
        const {setAllTableData} = table;

        let requestParam, requestUrl;
        if (paramData instanceof Array) {
            requestParam = {
                pk_bankaccbas: paramData,
                appcode: appcode,
                areacode: gridId,
                pagecode: pagecode
            }
            requestUrl = ajaxurl.queryGridByPage;
        } else {
            requestParam = paramData;
            requestUrl = ajaxurl.queryGrid;

        }
        ajax({
            url: requestUrl,
            data: requestParam,
            success: function (res) {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        //只要查询到数据 打印按钮可用
                        _this.props.button.setButtonDisabled(
                            ['btnPrint', 'output',], false);
                        _this.setState({
                            context:{
                                PermissionOrgIDs:data.userjson && data.userjson.split(', ') || _this.state.context.PermissionOrgIDs
                            }
                        }, () => {
                            //表格数据启用状态 123 转化true false
                            data[gridId].rows = Utils.convertGridEnablestate(data[gridId].rows);
                            setAllTableData(gridId, data[gridId]);
                            data[gridId]['allpks'] && setDefData('allpks', datasource, data[gridId]['allpks']);

                            _this.props.ViewModel.setData(_this.config.datasource, {
                                simpleTable: {
                                    allpks: data[gridId]['allpks']
                                }
                            });
                            data.userjson && setDefData('PermissionOrgIDs', datasource, data.userjson.split(', '));

                            callback && callback.call(this, data[gridId]['allpks']);
                        });
                    } else {
                        _this.props.button.setButtonDisabled(
                            ['btnPrint', 'output',], true);
                        setAllTableData(gridId, {rows: []});
                        callback && callback.call(this, []);
                    }
                }
            }
        })
    }

    //
    onOrgChange(val) {
        this.state.curOrg = val;
        this.setState(this.state.curOrg);
    }

//分页信息点击事件
    onClickPageInfo(props, config, pks) {
        this.loadGridData(pks)
    }

//显示停用按钮点击事件
    onCheckShowDisable(checked) {
        let searchData = this.props.search.getAllSearchData(this.props.config.searchId);
        setDefData('searchVal', this.config.datasource, searchData);
        //如果没有勾选显示停用，查询条件里面的enablestate = '2'只显示启用
        if (typeof (searchData) !== 'undefined' && searchData && searchData.conditions) {
            setDefData('checkflag', this.config.datasource, checked);
            this.loadGridData(this.getLoadDataParam(this.props),this.initializeButtons);
        } else {
            return;
        }

    }

//表格状态改变监听事件
    gridStatusChange() {
        let gridStatus = this.props.table.getStatus(this.props.config.gridId);
        gridStatus === 'browse' ? this.props.button.setButtonsVisible({}) : this.props.button.setButtonsVisible({})
    }

    //核算归属组织模态框编辑后事件
    modalafterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {
    }


    //核算归属组织模态框
    adjustForm = () => {
        const {form} = this.props;
        const {createForm} = form;
        return (
            <div>
                <div className="nc-bill-form-area">
                    {createForm(this.config.formId, {
                        onAfterEvent: this.modalafterEvent.bind(this)
                    })}
                </div>
            </div>
        )

    }

    renderPage() {
        const {table, button, search, modal,BillHeadInfo} = this.props;
        const {createButtonApp} = button;
        const {NCCreateSearch} = search;
        const {createModal} = modal;
        const {createSimpleTable} = table;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <AccountGrantModal ref={(item => this.accountGrantModal = item)}
                                   {...this.props}
                                   {...{json:this.state.json}}/>
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                    {/* 标题 title */}
                    <div  className="header-title-search-area">
                        <div className="title-search-detail">
                            {createBillHeadInfo({ 
                                title:this.config.NODE_TYPE === 'GROUP_NODE' ?
                                this.state.json['10140BANKACC-000072'] : this.state.json['10140BANKACC-000073'],
                                initShowBackBtn:false
                            })}
                        </div>
                        {/* 显示停用  showOff*/}
                        <div className="title-search-detail">
                            <span className="showOff">
				            <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                        checked={getDefData('checkflag', this.config.datasource)}>{this.state.json['10140BANKACC-000087']}</NCCheckbox>
                            </span>
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 5,
                            onButtonClick: onClickButton.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: onClickSearchBtn.bind(this),
                        onAfterEvent: searchAfterEdit.bind(this),
                        oid: this.config.oid
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.props.config.gridId, {
                        handlePageInfoChange: this.onClickPageInfo.bind(this),
                        onAfterEvent: onTableAfterEdit.bind(this),
                        selectedChange: onSelectedChange.bind(this),
                        onSelected: onRowChecked.bind(this),
                        onSelectedAll: onSelectedAll.bind(this),
                        onRowDoubleClick: onRowDoubleClick.bind(this),
                        datasource: this.config.datasource,
                        showIndex: true,
                        showCheck: true
                    })}</div>
                {createModal('checkOrg', {
                    hasCloseBtn: true,
                })}
                {createModal('adjustForm', {
                    'hasCloseBtn': true,
                    'title': this.state.json['10140BANKACC-000074'],
                    'content': this.adjustForm(),
                    'size': 'lg',
                    'userControl': true
                })}
                <ExcelImport
                {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.config.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.config.appcode}
                    pagecode={this.config.pagecode_card}
                 />
            </div>
        )
    }
    render(){
        return (
            <div>{this.state.loadLang ? this.renderPage() : <div/>}</div>
        )
    }
}
export  default  BankAccountBase

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65