//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {
    output,
    createPage,
    createPageIcon,
    ajax,
    base,
    toast,
    high,
    print,
    getBusinessInfo,
    promptBox,
    getMultiLang,
    cacheTools
} from 'nc-lightapp-front';
import Utils from '../../../public/utils';
const {queryToastFunc, convertGridEnablestateToShow,convertGridEnablestateToSave} = Utils;
import createUIDom from "../../../public/utils/BDCreateUIDom";

import '../../../public/uapbdstyle/uapbd_style_common.less'

import './index.less'

let gridId = 'pfcc_list';
let searchId = 'pfcc_query';
let pagecode = '10100PCCOSTR_pccostr';
let oids = [];
let funcode = '10100PCCOSTR';
let nodecodeList = 'costRegionListPrint';
let stepname = '';
let saveContinue = false;//判断是否批量新增的保存新增
let oid = '';
let uiStatus = 'browse';
let businessInfo = getBusinessInfo();//用作高级查询获取当前用户信息，暂时还没有适配
let allpks = [];
const {Output} = high;
const {NCCheckbox, NCStep, NCRadio, NCTabs, NCBackBtn, NCAffix, NCRefreshBtn,NCDiv } = base;
const NCSteps = NCStep.NCSteps;
let userOrg = {};
let lastTableRow = {};
let tableAdd = '';//点击新增标记
let searchOnClick = '';
let refreshOnClick = '';
let cardDelete = '';
let cardRefresh = '';//卡片刷新按钮标记
let cardOldPk='';//卡片复制的源ID，用于复制取消时回显
let ajaxurl = {
    queryPage: '/nccloud/uapbd/profitcostregion/query.do',
    add: '/nccloud/uapbd/costregion/add.do',
    saveAdd: '/nccloud/uapbd/profitcostregion/save.do',
    delete: '/nccloud/uapbd/profitcostregion/delete.do',
    enable: '/nccloud/uapbd/profitcostregion/enable.do',
    disable: '/nccloud/uapbd/profitcostregion/disable.do',
    LoadOrgTree: '/nccloud/uapbd/costregion/queryFinance.do',
    LoadStockTree: '/nccloud/uapbd/costregion/queryStock.do',
    queryCostregionByFinance: '/nccloud/uapbd/costregion/queryCostregionByFinance.do',
    queryCostregionByStock: '/nccloud/uapbd/costregion/queryCostregionByStock.do',
    CostregionSaveByFinance: '/nccloud/uapbd/costregion/CostregionSaveByFinance.do',
    print: '/nccloud/uapbd/costregion/print.do',
    queryPermission: '/nccloud/uapbd/costregion/queryPermission.do',
    queryRelstockorgs: '/nccloud/uapbd/costregion/queryRelstockorgs.do',
    queryRelstockstorages: '/nccloud/uapbd/costregion/queryRelstockstorages.do',
    queryByPks: '/nccloud/uapbd/costregion/queryByPks.do',
    queryCostregionByPk: '/nccloud/uapbd/costregion/querycostregionByPk.do',
    queryCostregionForm: '/nccloud/uapbd/costregion/queryForm.do'
};


/**
 * 利润中心成本域
 * author zhj
 */
class ProfitcentercostTable extends Component {


    constructor (props) {
        super(props);

        this.state = {
            searchValue: '',
            checkValue: false,
            currentStep: 0,
            firstStepOrgValue: {},
            secondStepOrgValue: {},
            thirdTableData: [],
            type: '',
            pks: [],
            tab: {
                activeKey: 'relstockorgs',
                // onChange: this.onTabChange.bind(this)
            },
            dataSource: [{}],
            costRegionPkOrg: '',//库存组织对应的财务组织名称ID，方便后台保存
            secondData: {},
            nodekey: '',
            borowseMode: true,
            allTreeData: [],
            rightTreeData: [],
            modelTitle: '',
            json: {},
            inlt: null,
            renderCardPagination: true,
            pageInfo: {pageIndex: 0, pageSize: 10},
            showReturn :true
        };

        this.config = Object.assign({pageTitle: this.state.json['10100COSTR-000052']}, props.config);
        //this.getSecondContent = this.getSecondContent.bind(this);
        // this.filterRefer = this.filterRefer.bind(this);
        this.showDelOrNot = this.showDelOrNot.bind(this);
        this.initTemplate(this.props);
    }

    initTemplate = (props) => {
        props.createUIDom(
            {pagecode: pagecode},
            (data) => {
                let meta = data.template;
                // //目前参照不可用，后面放开
                meta['pfcc_list'].items.forEach((item)=>{
                    if(item.attrcode=='pk_org'){
                        item.refcode='uapbd/refer/fiacc/profitcenter/index.js'; 
                    }
                })
                meta = this.modifierMeta(props, meta);
                let ccontext = data.context || {};
                if (ccontext.pk_org) {
                    userOrg.value = {};
                    userOrg.value.refpk = ccontext.pk_org;
                    userOrg.value.refname = ccontext.org_Name;
                }
                props.meta.setMeta(meta);
                oid = meta.pfcc_query.oid;
                data.button && props.button.setButtons(data.button);
                props.button.setPopContent('delLine', this.state.json === undefined ? "" : this.state.json['10100COSTR-000009'])
                /* 国际化处理： 确认要删除该条吗？*/
                this.gridStatusChange(props);
                this.toggleShow('browse');
            });
    };

    componentWillMount () {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
                if (status) {
                    this.initTemplate.call(this, this.props, json, inlt);// 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                    this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
                } else {
                    console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
                }

            }
        ;
        this.props.MultiInit.getMultiLang({moduleId: '10100COSTR', domainName: 'uapbd', callback})
    }


    componentDidMount () {
        //设置按钮状态
        this.props.button.setButtonVisible({
            'save': false,
            'cancel': false
        });
        this.props.button.setButtonDisabled(['copy', 'btnDel', 'print', 'out'], true);
        this.props.button.setMainButton(['cardAdd', 'btnAdd'], true);

    }

    componentDidUpdate () {
        if (!uiStatus || uiStatus === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = function () {
                return '';
            }
        }
    }

    /**
     * 加载列表数据
     */
    loadGridData = (pks, queryUrl) => {
        uiStatus = 'browse';
        let qryUrl = queryUrl === undefined ? 'queryPage' : queryUrl;
        let me = this;
        let type = '';
        let pageInfos = {}
        //获取查询区数据
        let searchData = me.props.search.getAllSearchData(searchId);
        //获取启用 和 未启用/停用状态
        me.state.checkValue === true ? type = null : type = {checkValue: false};
        if (searchOnClick || refreshOnClick) {
            pageInfos = {pageIndex: 0, pageSize: 10}
        } else {
            pageInfos = me.state.pageInfo
        }
        let paramData = {
            pks: pks,
            querycondition: searchData,
            pageInfo: pageInfos,
            pageCode: pagecode,
            oid: oid,
            queryAreaCode: searchId,
            querytype: 'tree',
            userdefObj: type
        };
        ajax({
            url: ajaxurl[qryUrl],
            data: paramData,
            success: function (res) {
                let {success, data} = res;
                if (success) {
                    if (res.data != null) {
                        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {//显示公式
                            me.props.dealFormulamsg(
                                res.formulamsg,  //参数一：返回的公式对象
                                {                //参数二：界面使用的表格类型
                                    "costregion": "editTable"
                                }
                            );
                        }
                        // let returnData = data['costregion'];
                        let returnData = {rows: []};
                        if (data['pfcc_list'] !== undefined) {
                            returnData = data['pfcc_list'];
                        } 
                        returnData.rows = Utils.convertGridEnablestate(returnData.rows);
                        if (returnData.rows.length > 0) {
                            me.props.button.setButtonDisabled(['print', 'out'], false);
                        }
                        me.props.editTable.setTableData(gridId, returnData);
                        if (searchOnClick === 'true') {
                            let {inlt} = me.state;
                            toast({
                                color: 'success',
                                title: me.state.json === undefined ? "" : me.state.json['10100COSTR-000010'], /* 国际化处理： 已成功！*/
                                content: inlt && inlt.get('10100COSTR-000011', {count: returnData.pageInfo.total})
                            });
                            searchOnClick = '';
                        }
                        allpks = returnData.allpks;
                    } else {

                        let nulldata = {
                            rows: []
                        };
                        me.props.editTable.setTableData(gridId, nulldata);

                        me.props.button.setButtonDisabled(['print', 'out'], true);
                        if (searchOnClick === 'true') {
                            toast({
                                color: 'warning',
                                title: me.state.json === undefined ? "" : me.state.json['10100COSTR-000013'],
                                content: me.state.json === undefined ? "" : me.state.json['10100COSTR-000014']
                            });
                            /* 国际化处理： 请注意！,未查询到符合条件的数据！*/
                            searchOnClick = '';
                        }
                    }
                }
                me.toggleShow('browse');
            }
        })
    };

    showDelOrNot () {
        if (this.props.editTable.getNumberOfRows(gridId) === 0) {
            this.props.button.setButtonDisabled('btnDel', true);
        } else {
            this.props.button.setButtonDisabled('btnDel', false);
        }
    };

    //按钮点击事件
    onClickButton (props, id) {
        //获取选中行数据
        let rowsdata = props.editTable.getCheckedRows(gridId);
        switch (id) {
            //点击新增
            case 'add':
                let rows = props.editTable.getAllRows(gridId);
                let index = 0;
                if(rows){
                    index = rows.length;
                }
                props.editTable.addRow(gridId,index);
                props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value:1, display:this.state.json['10100PFCCOSTR-000002'], isEdit:false })
                this.toggleShow("edit");
                break;
            //点击刷新
            case 'refresh':
                refreshOnClick = 'true';
                this.loadGridData();
                toast({
                    color: 'success',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000054']
                });
                refreshOnClick = '';
                /* 国际化处理： 刷新成功*/
                break;
            //修改
            case 'edit':
                this.toggleShow("edit");
                break;
            //取消
            case 'cancel':
                refreshOnClick = 'true';
                this.loadGridData();
                refreshOnClick = '';
                this.toggleShow("browse");
                break;
            case 'enable':
                let enable_pks = '';
                let enable_flag = false;
                let enable_name = '';
                if (rowsdata.length !== 0) {
                    if (rowsdata.length > 1) {
                        rowsdata.forEach((e) => {
                            if(e.data.values.enablestate.value){
                                if(enable_name==''){
                                    enable_name = e.data.values.name.value;
                                }else{
                                    enable_name = enable_name+"、"+e.data.values.name.value;
                                }
                                enable_flag=true;
                            }
                            enable_pks += e.data.values.pk_costregion.value + ",";
                        });
                    } else {
                        if(rowsdata[0].data.values.enablestate.value){
                            enable_name =rowsdata[0].data.values.name.value;
                            enable_flag=true;
                        }
                        enable_pks = rowsdata[0].data.values.pk_costregion.value;
                    }

                } else {
                    toast({
                        color: 'danger',
                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000017']
                    });
                    /* 国际化处理： 请选择1条数据操作*/
                    return;
                }
                if(!enable_flag){
                    this.enablefunction(enable_pks);
                }else{
                    toast({
                        color: 'danger',
                        content: this.state.json === undefined ? "" : this.state.json['10100PFCCOSTR-000004']+enable_name
                    });
                }
                break;
            case 'disable':
                let disable_pks = '';
                let disable_flag = false;
                let disable_name = '';
                if (rowsdata.length !== 0) {
                    if (rowsdata.length > 1) {
                        rowsdata.forEach((e) => {
                            if(e.data.values.enablestate&&!e.data.values.enablestate.value){
                                if(disable_name==''){
                                    disable_name =e.data.values.name.value
                                }else{
                                    disable_name = disable_name +"、"+e.data.values.name.value
                                }
                                disable_flag=true;
                            }
                            disable_pks += e.data.values.pk_costregion.value + ",";
                        });
                    } else {
                        if(rowsdata[0].data.values.enablestate&&!rowsdata[0].data.values.enablestate.value){
                            disable_name=rowsdata[0].data.values.name.value;
                            disable_flag=true;
                        }
                        disable_pks = rowsdata[0].data.values.pk_costregion.value;
                    }

                } else {
                    toast({
                        color: 'danger',
                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000017']
                    });
                    /* 国际化处理： 请选择1条数据操作*/
                    return;
                }
                if(!disable_flag){
                    this.disablefunction(disable_pks);
                }else{
                    toast({
                        color: 'danger',
                        content: this.state.json === undefined ? "" : this.state.json['10100PFCCOSTR-000006']+disable_name
                    });
                }
                break;
            //点击列表打印
            case 'printBtn':
                this.print();
                break;
            //点击列表页面的输出
            case 'outBtn':
                if (allpks) {
                    
                } else {
                    toast({
                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000016'],
                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001']
                    });
                    /* 国际化处理： 没有需要输出的数据！,提示*/
                    return;
                }

                output({data: 
                    Object.assign({
                        funcode:this.config.printcard.plan.funcode,
                        nodekey:this.config.printcard.plan.nodekey,
                        oids: allpks,
                        outputType: "output"
                    },{}), url: props.config.printUrls['plan']});
                break;
            
            //点击保存
            case 'save':
                this.savedata(props);
                break;
            //点击删除
            case 'delete':
                let pks = '';
                if (rowsdata.length !== 0) {
                    if (rowsdata.length > 1) {
                        rowsdata.forEach((e) => {
                            pks += e.data.values.pk_costregion.value + ",";
                        });
                    } else {
                        pks = rowsdata[0].data.values.pk_costregion.value;
                    }

                } else {
                    toast({
                        color: 'danger',
                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000017']
                    });
                    /* 国际化处理： 请选择1条数据操作*/
                    return;
                }

                this.deleteFun(pks);
                break;
           
            default:
                break;
        }
    };
    //切换页面状态
    toggleShow = (status) =>{
    let flag = status === 'browse' ? false : true;
    if(!flag){
        this.props.button.setPopContent('Delline',this.state.json['10140CBCN-000014']);/* 国际化处理： 确定要删除吗？*/
    }else{
        this.props.button.setPopContent('Delline','');
    }
    if(status === 'browse'){
        this.props.button.setButtonVisible(['add','edit','delete','refresh','enable','disable','enable_blank','delLine','printBtn','print_blank','outBtn'],true);
        this.props.button.setButtonVisible(['save','cancel'],false);
        this.props.button.setMainButton('add',true);
    }
    if(status === 'edit'){
        this.props.button.setButtonVisible(['add','cancel','','save'],true);
        this.props.button.setButtonVisible(['edit','delete','refresh','enable','disable','enable_blank','delLine','printBtn','print_blank','outBtn'],false);
        this.props.button.setMainButton('add',false);
    }
    // this.props.button.setButtonVisible(['add','save'],true);
    // this.props.button.setButtonVisible(['save','delete','cancel'],!flag);
    // this.props.button.setButtonVisible(['Edit','Refresh','Print','Output','Import'],!flag);
    this.props.button.setMainButton('add',!flag);
    if(status === 'browse'){//设置浏览态打印按钮是否可用
        if(this.props.editTable.getNumberOfRows(gridId)>0){
            this.props.button.setDisabled({
                printBtn: false,
                outBtn : false,
                enable : false,
                disable: false,
            });
        }else{
            this.props.button.setDisabled({
                printBtn: true,
                outBtn : true,
                enable : true,
                disable: true,
            });
        }
    }
    this.props.editTable.setStatus(gridId, status==='browse'?"browse" :"edit");
}
    setPageInfo () {
        this.state.pageInfo = this.props.editTable.getTablePageInfo(gridId);
        this.setState(this.state);
    }

    modifierMeta (props, meta) {
        meta[gridId].showindex = true;
        meta[gridId].status = 'browse';
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json === undefined ? "" : this.state.json['10100COSTR-000000'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: 168,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                return (
                    props.button.createOprationButton(
                        ['editLine', 'delLine'],
                        {
                            area: "line",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.onLineButton.call(this, props, id, text, record, index)
                        }
                    )
                )
            }

        });
        meta['pfcc_list'].items.map((item) => {
            if (item.attrcode === 'pk_org') {

                item.queryCondition = () => {
                    return {
                        AppCode: '10100PCCOSTR',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                };
            }
        });
        return meta;
    };

    //启用
    enablefunction(enable_pks){
        promptBox({
            color: 'warning',
            title: this.state.json === undefined ? "" : this.state.json['10100PFCCOSTR-000003'], /* 国际化处理： 启用*/
            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000041'], /* 国际化处理： 确定启用？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxurl.enable,
                    data: {'pk': enable_pks},
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            toast({
                                color: 'success',
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000036']/* 国际化处理： 启用成功！*/
                            });

                            // 如果是列表界面删除成功，那么重新加载一遍数据
                            this.loadGridData();

                        }
                    },
                    error: (res) =>{
                        toast({
                            color: 'danger',
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000037']+res
                        });
                        /* 国际化处理： 删除失败！*/
                    }
                });
            },
            cancelBtnClick: () => {
                return;
            }
        });
    }
    //停用
    disablefunction(disable_pks){
        promptBox({
            color: 'warning',
            title: this.state.json === undefined ? "" : this.state.json['10100PFCCOSTR-000005'], /* 国际化处理： 停用*/
            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000042'], /* 国际化处理： 确定停用？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxurl.disable,
                    data: {'pk': disable_pks},
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            toast({
                                color: 'success',
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000038']/* 国际化处理： 停用成功！*/
                            });

                            // 如果是列表界面删除成功，那么重新加载一遍数据
                            this.loadGridData();

                        }
                    },
                    error: (res) =>{
                        toast({
                            color: 'danger',
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000039']+res
                        });
                        /* 国际化处理： 停用失败！*/
                    }
                });
            },
            cancelBtnClick: () => {
                return;
            }
        });
    }


    deleteFun (pks) {
        promptBox({
            color: 'warning',
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000006'], /* 国际化处理： 删除*/
            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000002'], /* 国际化处理： 确定删除所选数据吗？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxurl.delete,
                    data: {'pk': pks},
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            toast({
                                color: 'success',
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000025']
                            });

                            /* 国际化处理： 删除成功！*/
                            if (cardDelete === 'true') {
                                let newid;

                                this.setState(this.state, () => {
                                    this.props.cardPagination.setCardPaginationId({id: pks,status:3});
                                    newid = this.props.cardPagination.getNextCardPaginationId({
                                        id: pks,
                                        status: 3
                                    });
                                    
                                });

                                if(!newid){
                                    this.props.form.EmptyAllFormValue('costregionForm');
                                    this.props.cardTable.setTableData('relstockorgs', {rows: []});
                                    this.props.cardTable.setTableData('relstockstorages', {rows: []});
                                }else{
                                    this.queryCard(newid);
                                }
                            }

                            if(this.state.borowseMode) {
                                // 如果是列表界面删除成功，那么重新加载一遍数据
                                this.loadGridData();
                            }

                        } else {
                            toast({
                                color: 'danger',
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000026']
                            });
                            /* 国际化处理： 删除失败！*/
                        }

                    }
                });
            },
            cancelBtnClick: () => {
                return;
            }

        });
    }
    
    onLineButton (props, id, text, record, index) {
        this.setPageInfo();
        switch (id) {
            case 'delLine':
                let pk = record.values.pk_costregion.value;
                if(pk&&pk!=""&&pk!=null){
                    ajax({
                        url: ajaxurl.delete,
                        data: {'pk': pk},
                        success: (res) => {

                            let {success, data} = res;
                            if (success) {
                                toast({
                                    color: 'success',
                                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000025']
                                });
                                /* 国际化处理： 删除成功！*/
                                this.loadGridData();
                            } else {
                                toast({
                                    color: 'danger',
                                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000026']
                                });
                                /* 国际化处理： 删除失败！*/
                            }

                        }
                    });
                }
                else{
                    props.editTable.deleteTableRowsByIndex(gridId,index);
                }
                break;
        }
    }

    gridStatusChange (props) {
        let gridStatus = props.editTable.getStatus(gridId);
        gridStatus === 'browse' ? props.button.setButtonsVisible({
            'btnSave': true,
            'btnCancel': false,
            'btnAdd': true,
            'btnEdit': true
        }) : props.button.setButtonsVisible({
            'btnAdd': true,
            'btnEdit': false,
            'btnSave': true,
            'btnCancel': true,
        })
    };
    //保存
    savedata (props) {
        props.editTable.filterEmptyRows(gridId);
        let changedRows = props.editTable.getChangedRows(gridId);
        //必输项校验
        if(!props.editTable.checkRequired(gridId, props.editTable.getAllData(gridId).rows)){
            return;
       }
        changedRows = convertGridEnablestateToSave(changedRows);
    //    if (changedRows.length == 0 && this.state.rollbackcodeObj.length == 0) {
    //     props.editTable.setStatus(gridId, 'browse');
    //     this.gridStatusChange();
    //     toast({title: this.state.json['10100COSTR-000030'], color: 'success'});
    //     /* 国际化处理： 保存成功！*/
    //      this.loadGridData();
    //     return;
    //     }

        //定义ajax回传grid参数结构
        let paramdata = {
            'pageid': pagecode,
            'gridModel': {
                'pageinfo': {},
                'areacode': gridId,
                'rows': changedRows
            }
        }
        ajax({
            url: ajaxurl.saveAdd,
            data: paramdata,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    props.editTable.setStatus(gridId, 'browse');
                    this.gridStatusChange();
                    toast({title: this.state.json['10100COSTR-000030'], color: 'success'});
                    /* 国际化处理： 保存成功！*/
                    this.loadGridData();
                }
            }
        });
        
    }
  
    //打印
    print () {
        if(allpks){

        }
         else {
            toast({
                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000032'],
                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                color: 'warning'
            })
            /* 国际化处理： 没有需要打印的数据！,提示*/
            return;
        }
        print(
            'pdf',
            ajaxurl.print,
            {
                billtype: '',
                funcode: funcode,
                nodekey: nodecodeList,
                oids: allpks
            }
        );


    }
    //查询区按钮点击事件
    onClickSearchBtn (props, data) {
        //校验通过后，条件查询请求
        searchOnClick = 'true';
        this.loadGridData();
    }


    //显示停用按钮点击事件
    onCheckShowDisable () {
        // this.state.checkValue = checked;
        this.setState({
            checkValue: !this.state.checkValue
        }, () => {
            this.loadGridData();
        })
    }

    //模态框编辑后事件
    onTableModelAfterEdit (props, moduleId, key, value, changedrows, index, record) {
        // props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        switch (key) {
            case 'pk_org':
                if(value&&value!=""&&value!=null){
                    props.editTable.setValByKeyAndIndex(gridId, index, 'code', { value:value.refcode, display:value.refcode, isEdit:false })
                    props.editTable.setValByKeyAndIndex(gridId, index, 'name', { value:value.refname, display:value.refname, isEdit:false })

                }else{
                    props.editTable.setValByKeyAndIndex(gridId, index, 'code', { value:null, display:null, isEdit:false })
                    props.editTable.setValByKeyAndIndex(gridId, index, 'name', { value:null, display:null, isEdit:false })
                }
                break;
        }
    }


    //表格状态改变监听事件
    gridStatusChange () {
        let gridStatus = this.props.editTable.getStatus(gridId);
        gridStatus === 'browse' ? this.props.button.setButtonVisible({
            'btnSave': false,
            'btnCancel': false,
            'btnAdd': true,
            'btnDel': true
        }) : this.props.button.setButtonVisible({
            'btnAdd': true,
            'btnDel': false,
            'btnSave': true,
            'btnCancel': true,
        })
    }
    /**
     * 列表区checkbox选中/非选中事件
     */
    selectedChange (props, moduleId, newVal, oldVal) {
        this.setState(() => {
            if (newVal === 0) {
                this.props.button.setButtonDisabled(['copy', 'btnDel'], true);
            } else if (newVal === 1) {
                this.props.button.setButtonDisabled(['copy', 'btnDel'], false);
            } else {
                this.props.button.setButtonDisabled('btnDel', false);
                this.props.button.setButtonDisabled('copy', true);
            }
        });
    }

    //新增行
    addLine (tableid) {
        this.props.cardTable.addRow(tableid);
    }

    //主表编辑完成事件
    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {
        
    };

    //分页信息点击事件
    onClickPageInfo (props, config, pks) {
        this.loadGridData(pks, 'queryByPks');
    }

    render () {
        const {cardTable, editTable, button, search, modal, form, cardPagination,BillHeadInfo} = this.props;
        const {createButtonApp} = button;
        const {NCCreateSearch} = search;
        const {createModal} = modal;
        const {createEditTable} = editTable;
        const {createCardTable} = cardTable;
        const {createForm} = form;
        const that = this;
        const {createCardPagination} = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;

        var drawList = () => {
            return (

                < div className="nc-bill-list" id={'browse'} style={{position: 'relative'}}>
                    {/* 头部 header */}
                    <div>
                        < NCAffix>
                            < NCDiv  areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area" >
                                {/* 标题 title */}
                                < div className="header-title-search-area" >
                                    
                                    {/* < h2
                                        className="title-search-detail"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000052']/* 国际化处理： 成本域}</h2> */}
                                    {/* 显示停用  showOff*/}
                                    {createBillHeadInfo({
                                        title:this.state.json['10100PFCCOSTR-000001']/* 国际化处理： 利润中心成本域*/,
                                        initShowBackBtn:false
                                    })}
                                    <div className="title-search-detail">
                                        < span className='showOff'>
                                            < NCCheckbox checked={this.state.checkValue}
                                                         onChange={this.onCheckShowDisable.bind(this)}>
                                        {that.state.json === undefined ? "" : that.state.json['10100COSTR-000053']/* 国际化处理： 显示停用*/}
                                            </NCCheckbox>
                                        </span>
                                    </div>
                                </div>
                                {/* 按钮区  btn-group */
                                }
                                <div className="header-button-area">
                                    {
                                        createButtonApp({
                                            area: 'header-button-area',
                                            buttonLimit: 3,
                                            onButtonClick: this.onClickButton.bind(this),
                                            popContainer: document.querySelector('.header-button-area')
                                        })
                                    }
                                </div>
                            </NCDiv>
                        </NCAffix>
                    </div>
                    < div
                        className="nc-bill-search-area">
                        {
                            NCCreateSearch(searchId, {
                                clickSearchBtn: this.onClickSearchBtn.bind(this)
                            })
                        }
                    </div>
                    {/* 列表区 */}
                    <div className="nc-singleTable-table-area">

                        {
                            createEditTable(gridId, {
                                handlePageInfoChange: this.onClickPageInfo.bind(this),
                                onAfterEvent: this.onTableModelAfterEdit.bind(this),
                                selectedChange: this.selectedChange.bind(this),
                                showCheck: true,
                                showIndex: true,
                                showPagination: true,
                                cancelPSwitch: true,
                                adaptionHeight:true
                            })
                        }
                    </div>
                </div>);
        };
        return (
            < div>
                {
                    drawList()
                }
            </div>
        )
    }
}


ProfitcentercostTable = createPage({

    billinfo: [
        {
            billtype: 'pfcc_list',
            pagecode: '10100PCCOSTR_pccostr',
            bodycode: 'costregion'
        }
    ],
    initTemplate: (props) => {
    }


})(ProfitcentercostTable);
export {
    ProfitcentercostTable
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65