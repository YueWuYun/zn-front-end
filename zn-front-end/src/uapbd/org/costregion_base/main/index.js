//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {
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
import BatchTable from '../../costregion_glb/component/BatchTable';
import Transfer from '../../../public/excomponents/Transfer';
import Utils from '../../../public/utils';
import createUIDom from "../../../public/utils/BDCreateUIDom";

import '../../../public/uapbdstyle/uapbd_style_common.less'

import './index.less'

let gridId = 'costregion';
let searchId = 'costregion_search';
let pagecode = '10100COSTR_costregion';
let oids = [];
let funcode = '10100COSTR';
let nodecodeList = 'costRegionListPrint';
let nodecodeEdit = 'costRegionEditorPrint';
let stepname = '';
let saveContinue = false;//判断是否批量新增的保存新增
let oid = '';
let uiStatus = 'browse';
let businessInfo = getBusinessInfo();//用作高级查询获取当前用户信息，暂时还没有适配
let allpks = [];
const { PrintOutput } = high;
const { NCCheckbox, NCStep, NCRadio, NCTabs, NCBackBtn, NCAffix, NCRefreshBtn, NCDiv } = base;
const NCSteps = NCStep.NCSteps;
let userOrg = {};
let lastTableRow = {};
let tableAdd = '';//点击新增标记
let searchOnClick = '';
let refreshOnClick = '';
let cardDelete = '';
let cardRefresh = '';//卡片刷新按钮标记
let cardOldPk = '';//卡片复制的源ID，用于复制取消时回显
let ajaxurl = {
    queryPage: '/nccloud/uapbd/costregion/query.do',
    add: '/nccloud/uapbd/costregion/add.do',
    saveAdd: '/nccloud/uapbd/costregion/save.do',
    delete: '/nccloud/uapbd/costregion/delete.do',
    enable: '/nccloud/uapbd/costregion/enable.do',
    LoadOrgTree: '/nccloud/uapbd/costregion/queryFinance.do',
    LoadStockTree: '/nccloud/uapbd/costregion/queryStock.do',
    disable: '/nccloud/uapbd/costregion/disable.do',
    queryCostregionByFinance: '/nccloud/uapbd/costregion/queryCostregionByFinance.do',
    queryCostregionByStock: '/nccloud/uapbd/costregion/queryCostregionByStock.do',
    CostregionSaveByFinance: '/nccloud/uapbd/costregion/CostregionSaveByFinance.do',
    print: '/nccloud/uapbd/costregion/print.do',
    queryPermission: '/nccloud/uapbd/costregion/queryPermission.do',
    queryRelstockorgs: '/nccloud/uapbd/costregion/queryRelstockorgs.do',
    queryRelstockstorages: '/nccloud/uapbd/costregion/queryRelstockstorages.do',
    queryByPks: '/nccloud/uapbd/costregion/queryByPks.do',
    queryCostregionByPk: '/nccloud/uapbd/costregion/querycostregionByPk.do',
    queryCostregionForm: '/nccloud/uapbd/costregion/queryForm.do',
    getjurisdiction:'/nccloud/uapbd/costregion/getjurisdiction.do'
};


/**
 * 成本域
 * author zhj
 */
class CostregionEditTable extends Component {


    constructor(props) {
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
            pageInfo: { pageIndex: 0, pageSize: 10 },
            showReturn: true
        };

        this.config = Object.assign({ pageTitle: this.state.json['10100COSTR-000052'] }, props.config);
        this.getSecondContent = this.getSecondContent.bind(this);
        // this.filterRefer = this.filterRefer.bind(this);
        this.showDelOrNot = this.showDelOrNot.bind(this);
        this.initTemplate(this.props);
    }

    initTemplate = (props) => {
        props.createUIDom(
            { pagecode: pagecode },
            (data) => {
                let meta = data.template;
                meta = this.modifierMeta(props, meta);
                let ccontext = data.context || {};
                if (ccontext.pk_org) {
                    userOrg.value = {};
                    userOrg.value.refpk = ccontext.pk_org;
                    userOrg.value.refname = ccontext.org_Name;
                }
                props.meta.setMeta(meta);
                oid = meta.costregion_search.oid;
                data.button && props.button.setButtons(data.button);
                props.button.setPopContent('delLine', this.state.json === undefined ? "" : this.state.json['10100COSTR-000009'])
                /* 国际化处理： 确认要删除该条吗？*/
                this.gridStatusChange(props);
            });
    };

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                // this.initTemplate.call(this, this.props, json, inlt);// 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }

        }
            ;
        this.props.MultiInit.getMultiLang({ moduleId: '10100COSTR', domainName: 'uapbd', callback })
    }


    componentDidMount() {
        //设置按钮状态
        this.props.button.setButtonVisible({
            'btnSave': false,
            'btnCancel': false,
            'cardsee': false,
            'see': false,
            'cardprint1': false,
            'print1': false,
            'return': false
        });
        this.props.button.setButtonDisabled(['copy', 'btnDel', 'print', 'out'], true);
        this.props.button.setMainButton(['cardAdd', 'btnAdd'], true);

    }

    componentDidUpdate() {
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
        me.state.checkValue === true ? type = null : type = { checkValue: false };
        if (searchOnClick || refreshOnClick) {
            pageInfos = { pageIndex: 0, pageSize: 10 }
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
                let { success, data } = res;
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
                        let returnData = { rows: [] };
                        if (data['costregion'] !== undefined) {
                            returnData = data['costregion'];
                        } else if (data['relstockorgs'] !== undefined) {
                            returnData = data['relstockorgs'];
                        } else if (data['relstockstorages'] !== undefined) {
                            returnData = data['relstockstorages'];
                        }
                        returnData.rows = Utils.convertGridEnablestate(returnData.rows);
                        if (returnData.rows.length > 0) {
                            me.props.button.setButtonDisabled(['print', 'out'], false);
                        }
                        me.props.editTable.setTableData(gridId, returnData);
                        if (searchOnClick === 'true') {
                            let { inlt } = me.state;
                            toast({
                                color: 'success',
                                title: me.state.json === undefined ? "" : me.state.json['10100COSTR-000010'], /* 国际化处理： 已成功！*/
                                content: inlt && inlt.get('10100COSTR-000011', { count: returnData.pageInfo.total })
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
            }
        })
    };

    showDelOrNot() {
        if (this.props.editTable.getNumberOfRows(gridId) === 0) {
            this.props.button.setButtonDisabled('btnDel', true);
        } else {
            this.props.button.setButtonDisabled('btnDel', false);
        }
    };

    //按钮点击事件
    onClickButton(props, id) {
        //获取选中行数据
        let rowsdata = props.editTable.getCheckedRows(gridId);
        switch (id) {
            //点击新增
            case 'btnAdd':
                this.setPageInfo();
                this.showAddPage();
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
            // 卡片页刷新
            case 'cardrefresh':
                cardRefresh = 'true';
                this.queryCard();
                break;
            //点击取消(暂时没有用到)
            case 'btnCancel':
                promptBox({
                    color: 'warning',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000055'], /* 国际化处理： 取消*/
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000015'], /* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: () => {
                        props.editTable.setStatus(gridId, 'browse');
                        uiStatus = 'browse';
                        props.editTable.cancelEdit(gridId);
                        // document.getElementById("showReturn").style.display = '';
                        this.state.showReturn = true;
                        this.setState(this.state)
                    },
                    cancelBtnClick: () => {
                        return;
                    }
                }
                );

                break;
            //点击列表打印
            case 'print':
                this.print();
                break;
            //点击列表下拉打印
            case 'print1':
                this.print();
                break;
            //点击卡片页面的打印
            case 'cardprint':
                this.cardPrint();
                break;
            //点击卡片页面的输出
            case 'cardout':
                this.cardOut();
                break;
            //点击列表页面的输出
            case 'out':
                let outdata = this.props.editTable.getAllRows(gridId);
                if (outdata.length > 0) {
                    oids = [];
                    (outdata.forEach((e) => {
                        oids.push(e.values.pk_costregion.value);
                    }))
                } else {
                    toast({
                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000016'],
                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001']
                    });
                    /* 国际化处理： 没有需要输出的数据！,提示*/
                    return;
                }
                //初次setstate无法赋值成功，采取这种方法-xieshj3
                new Promise((resolve) => {
                    this.setState({
                        pks: oids,
                        nodekey: nodecodeList
                    }, () => {
                        resolve();
                    });
                }).then(() => {
                    this.refs.printOutput.open()
                })

                break;
            //点击卡片页面取消
            case 'cardCancel':
                promptBox({
                    color: 'warning',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000055'], /* 国际化处理： 取消*/
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000015'], /* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: () => {
                        props.form.cancel('costregionForm');
                        uiStatus = 'browse';//判断是否关闭页面时弹出框提示
                        props.form.setFormStatus('costregionForm', 'browse');
                        props.cardTable.resetTableData('relstockorgs');
                        props.cardTable.resetTableData('relstockstorages');
                        // document.getElementById("showReturn").style.display = '';//设置返回箭头显示
                        this.state.showReturn = true;
                        this.setState(this.state)
                        props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine', 'btnSave', 'saveAndAdd', 'cardCancel'], false);
                        props.button.setButtonVisible(['cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardprint', 'cardrefresh'], true);
                        document.getElementById("cardPagination").style.display = '';//显示卡片下一条上一条按钮
                        // document.getElementById("refreshCard").style.display = '';
                        if (cardOldPk !== '') {
                            this.queryCard(cardOldPk.value);

                            cardOldPk = '';
                        } else if (tableAdd === 'true') {//新增状态取消时需要显示列表的最后一行数据
                            if (lastTableRow.rowid) {
                                props.form.setAllFormValue({ 'costregionForm': { rows: [lastTableRow] } });
                                props.form.setFormItemsDisabled('costregionForm', { 'enablestate': false });
                                props.cardPagination.setCardPaginationId({
                                    id: lastTableRow.values.pk_costregion.value,
                                    status: 1
                                });
                            }
                            else {
                                props.button.setButtonVisible(['cardEdit', 'cardDel', 'cardCopy', 'cardprint', 'cardrefresh'], false);
                                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                                props.form.setFormItemsDisabled('costregionForm', { 'enablestate': true });
                            }

                            tableAdd = '';
                            lastTableRow = {};
                        } else {
                            props.form.setFormItemsDisabled('costregionForm', { 'enablestate': false });
                        }
                        cardDelete = '';
                    },
                    cancelBtnClick: () => {
                        return;
                    }
                });
                break;
            //点击保存
            case 'btnSave':
                this.savecard();
                break;
            //点击卡片页面保存新增
            case 'saveAndAdd':
                this.savecardAndAdd();
                break;
            //点击删除
            case 'btnDel':
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
            //点击按财务组织批量新增
            case "batchAddByFinanceOrg":
                this.showFinanceOrg();
                break;
            //点击卡片页面子表新增行按钮
            case 'orgAddLine':
                this.addLine('relstockorgs');
                break;
            //点击卡片页面子表删除行按钮
            case 'orgDelLine':
                this.delLine('relstockorgs');
                break;
            //点击卡片页面子表新增行按钮
            case 'orageAddLine':
                this.addLine('relstockstorages');
                break;
            //点击卡片页面子表删除行按钮
            case 'orageDelLine':
                this.delLine('relstockstorages');
                break;
            //点击按库存组织批量新增
            case "batchAddByStockOrg":
                this.showStockOrg();
                break;
            //点击批量新增的上一步
            case "Prev":
                let me = this;
                let current = this.state.currentStep - 1;
                if (current < 0) current = 0;
                this.state.currentStep = current;
                this.setState(this.state, () => {
                    if (current === 0) {
                        this.firstStepOrgValue.reset(this.state.allTreeData);
                        this.state.rightTreeData.forEach(node => {
                            this.firstStepOrgValue.state.treeWapper.moveRight(node.key);
                        });
                        if (stepname === 'finance') {
                            this.firstStepOrgValue.state.treeWapper.setRootTitle(this.state.json === undefined ? "" : this.state.json['10100COSTR-000018']);
                            /* 国际化处理： 财务组织*/
                        } else if (stepname === 'stock') {
                            this.firstStepOrgValue.state.treeWapper.setRootTitle(this.state.json === undefined ? "" : this.state.json['10100COSTR-000019']);
                            /* 国际化处理： 库存组织*/
                        }
                    }
                    this.updatestepModalButtonStatus(current);
                    if (current === 1) {
                        // this.BatchTable.editTable.setTableData('costregion', {rows:[]});
                        me.BatchTable.editTable.setTableData('costregion', this.state.secondData);
                        me.BatchTable.editTable.setStatus('costregion', 'browse');
                    }
                });


                break;
            //点击批量新增的下一步
            case "Next":
                let _this = this;
                if (_this.state.currentStep === 0) {
                    if (_this.firstStepOrgValue.getData().length === 0) {
                        if (stepname === 'finance') {
                            toast({
                                color: 'warning',
                                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000020']
                            });
                            /* 国际化处理： 请选择财务组织!*/
                            return;
                        } else if (stepname === 'stock') {
                            toast({
                                color: 'warning',
                                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000021']
                            });
                            /* 国际化处理： 请选择库存组织!*/
                            return;
                        }
                    } else {
                        this.state.rightTreeData = _this.firstStepOrgValue.getData();
                        //this.setState(this.state);
                    }
                } else if (_this.state.currentStep === 1) {
                    if (!_this.BatchTable.editTable.getCheckedRows('costregion') || _this.BatchTable.editTable.getCheckedRows('costregion').length === 0) {
                        toast({
                            color: 'warning',
                            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000022']
                        });
                        /* 国际化处理： 请选择创建成本域!*/
                        return;
                    }
                }
                current = _this.state.currentStep + 1;
                if (current > 2) current = 2;
                _this.state.currentStep = current;
                _this.setState(_this.state, () => {
                    // this.setState(me.state);
                    if (current === 1) {
                        this.props.modal.show('stepModal', {
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000023']/* 国际化处理： 选择创建成本域*/
                        });
                        if (stepname === 'finance') {
                            let orgData = [];
                            _this.convertToTable(_this.state.rightTreeData, orgData);
                            let pks = "";
                            orgData.forEach((data) => {
                                pks += data.id + ",";
                            });
                            ajax({
                                url: ajaxurl.queryCostregionByFinance,
                                data: { pk: pks },
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) {
                                        if (res.hasOwnProperty('data')) {
                                            _this.state.secondData = data.costregion;
                                            _this.BatchTable.editTable.setTableData('costregion', data.costregion);
                                            _this.setState({
                                                secondData: _this.state.secondData
                                            });
                                        } else {
                                            _this.BatchTable.editTable.setTableData('costregion', { rows: [] });

                                        }
                                    }
                                }
                            });
                        } else if (stepname === 'stock') {
                            let orgData = [];
                            _this.convertToTable(_this.state.rightTreeData, orgData);

                            let pks = "";
                            orgData.forEach((data) => {
                                pks += data.id + ",";
                            });
                            ajax({
                                url: ajaxurl.queryCostregionByStock,
                                data: { pk: pks },
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) {
                                        if (res.hasOwnProperty('data')) {

                                            if (res.hasOwnProperty('data')) {
                                                _this.state.secondData = data.costregion;

                                                _this.BatchTable.editTable.setTableData('costregion', data.costregion);
                                                _this.setState({
                                                    secondData: _this.state.secondData
                                                })

                                            } else {
                                                _this.BatchTable.editTable.setTableData('costregion', { rows: [] });

                                            }
                                        }
                                    }
                                }
                            });
                        }

                    }

                    //第三步
                    if (current === 2) {
                        this.props.modal.show('stepModal', {
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000024']/* 国际化处理： 编辑选择成本域*/
                        });
                        let thirdTablData = _this.BatchTable.editTable.getCheckedRows('costregion');
                        if (thirdTablData.length > 0) {
                            thirdTablData.map(e => {
                                e.values = e.data.values;
                                return e;
                            })
                        }
                        _this.BatchTable.editTable.setTableData('costregion', {
                            areacode: 'costregion',
                            rows: thirdTablData
                        });
                        for (var i = 0; i < thirdTablData.length; i++) {
                            _this.BatchTable.editTable.setCheckboxDisabled('costregion', i, false);
                        }
                        _this.BatchTable.editTable.setStatus('costregion', 'edit');
                    }
                    _this.updatestepModalButtonStatus(current);
                });

                break;
            //点击批量新增的完成
            case "Finish":
                saveContinue = false;
                this.saveBatch();
                break;
            //点击批量新增的完成并继续
            case "goon":
                saveContinue = true;
                this.saveBatch();
                break;
            //点击批量新增的取消按钮
            case "CancelStep":
                promptBox({
                    color: 'warning',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000055'], /* 国际化处理： 取消*/
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000015'], /* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: () => {
                        this.props.modal.close('stepModal');
                        uiStatus = 'browse';
                    },
                    cancelBtnClick: () => {
                        return;
                    }
                });
                break;
            //点击卡片页面的返回
            case "return":
                this.state.borowseMode = true;
                console.log(this.state.pageInfo);
                this.setState(this.state, () => {
                    this.loadGridData();
                });
                // document.getElementById("browse").style.display = '';
                // document.getElementById("edit").style.display = 'none';

                break;
            //点击列表界面的复制
            case "copy":
                this.setPageInfo();
                this.copy();
                break;
            //卡片页面新增
            case "cardAdd":
                this.showAddPage();
                this.props.button.setButtonVisible(['cardAdd', 'cardEdit', 'cardDel', 'cardCopy'], false);
                break;
            //卡片页面按财务组织批量新增
            case "cardBatchAddByFina":
                this.showFinanceOrg();
                break;
            //卡片页面按库存组织批量新增
            case "cardBatchAddByCos":
                this.showStockOrg();
                break;
            //卡片页面编辑
            case "cardEdit":
                this.showCardEdit();
                break;
            //卡片页面复制
            case "cardCopy":
                this.copyCard();
                // this.props.form.setFormItemsDisabled('costregionForm', {'layertype': false});
                cardOldPk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion');
                this.props.form.setFormItemsValue('costregionForm', { 'pk_costregion': { value: null, display: null } });
                this.props.cardTable.setTableData('relstockstorages', { rows: [] });
                this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                break;
            //卡片页面删除
            case "cardDel":
                let pk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value;
                cardDelete = 'true';
                //pk 为空将不调用后台,解决连续删除报错问题 add by luominf 2019.12.20
                if (pk) {
                    this.deleteFun(pk);
                }
                break;
            default:
                break;
        }
    };

    setPageInfo() {
        this.state.pageInfo = this.props.editTable.getTablePageInfo(gridId);
        this.setState(this.state);
    }

    modifierMeta(props, meta) {
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
        meta['costregionForm'].items.map((item) => {
            if (item.attrcode === 'pk_org') {

                item.queryCondition = () => {
                    return {
                        AppCode: '10100COSTR',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                };
            }
        });
        meta['relstockorgs'].items.map((item) => {
            if (item.attrcode === 'pk_stockorg.code') {
                item.isMultiSelectedEnabled = true;
            }
        });
        meta['relstockstorages'].items.map((item) => {
            if (item.attrcode === 'pk_stockorg.code') {
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode === 'pk_storage.code') {
                item.isMultiSelectedEnabled = true;
            }
        });
        meta['costregion_search'].items.map((item) => {
            if (item.attrcode === 'relstockstorages.pk_storage') {
                item.isShowUnit = true;
                item.isShowDisabledData = true;
            }

        });
        return meta;
    };


    onLineButton(props, id, text, record, index) {
        this.setPageInfo();
        switch (id) {
            case 'delLine':
                let pk = record.values.pk_costregion.value;
                ajax({
                    url: ajaxurl.queryPermission,
                    data: { 'pk': pk, 'operateCode': 'edit' },
                    success: (res) => {

                        ajax({
                            url: ajaxurl.delete,
                            data: { 'pk': pk },
                            success: (res) => {

                                let { success, data } = res;
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


                    },
                    error: (res) => {
                        toast({
                            content: res.message,
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                            color: 'danger'
                        });
                        /* 国际化处理： 提示*/
                    }
                });
                break;
            case 'editLine':
                ajax({
                    url: ajaxurl.queryPermission,
                    data: { 'pk': record.values.pk_costregion.value, 'operateCode': 'edit' },
                    success: (res) => {

                        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {//显示公式
                            this.props.dealFormulamsg(
                                res.formulamsg,  //参数一：返回的公式对象
                                {                //参数二：界面使用的表格类型
                                    "costregionForm": "form",
                                    "relstockorgs": "cardTable",
                                    "relstockstorages": "cardTable"
                                }
                            );
                        }
                        this.getLastRow();
                        let data = { rows: [record] };
                        this.state.borowseMode = false;
                        let jinPromise = new Promise((resolve) => {
                            this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                            cacheTools.set('allpks', allpks);
                            // this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                            resolve();
                        });
                        let lineButton = [];
                        this.state.showReturn = false;
                        props.button.setButtonsVisible(['cardprint', 'saveAndAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardAdd', 'cardrefresh'], false);
                        // this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd'], true);
                        // update by yufwm 编辑 卡片页 去掉 保存新增 按钮
                        this.props.button.setButtonVisible(['btnSave', 'cardCancel'], true);
                        this.setState(this.state, () => {
                            // document.getElementById("showReturn").style.display = 'none';
                            document.getElementById("cardPagination").style.display = 'none';
                            // document.getElementById("refreshCard").style.display = 'none';
                            this.props.cardPagination.setCardPaginationId({
                                id: record.values.pk_costregion.value,
                                status: 1
                            });

                            uiStatus = 'edit';

                            props.form.setFormStatus('costregionForm', 'edit');
                            jinPromise.then(props.cardTable.setTableData('relstockstorages', { rows: [] }));

                            props.cardTable.setStatus('relstockorgs', 'edit');
                            props.cardTable.setStatus('relstockstorages', 'edit');
                            if (data.rows[0].values.layertype.value !== '0') {
                                if (data.rows[0].values.layertype.value === '1') {
                                    lineButton.push('orgAddLine', 'orgDelLine');
                                    this.props.button.setButtonDisabled('orgDelLine', true);
                                } else {
                                    lineButton.push('orageAddLine', 'orageDelLine');
                                    this.props.button.setButtonDisabled('orageDelLine', true);
                                }
                            } else {
                                props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
                            }
                            lineButton.length > 0 && props.button.setButtonsVisible(lineButton, true);
                            props.form.setFormItemsDisabled('costregionForm', { 'layertype': true });
                            this.queryCard(record.values.pk_costregion.value);

                        });
                    },
                    error: (res) => {
                        toast({
                            content: res.message,
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                            color: 'danger'
                        });
                        /* 国际化处理： 提示*/
                    }
                });
                break;

        }
    }

    gridStatusChange(props) {
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

    deleteFun(pks) {
        ajax({
            url: ajaxurl.queryPermission,
            data: { 'pk': pks, 'operateCode': 'edit' },
            success: (res) => {
                promptBox({
                    color: 'warning',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000006'], /* 国际化处理： 删除*/
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000002'], /* 国际化处理： 确定删除所选数据吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: ajaxurl.delete,
                            data: { 'pk': pks },
                            success: (res) => {

                                let { success, data } = res;
                                if (success) {
                                    toast({
                                        color: 'success',
                                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000025']
                                    });

                                    /* 国际化处理： 删除成功！*/
                                    if (cardDelete === 'true') {
                                        let newid;

                                        this.setState(this.state, () => {
                                            setTimeout(() => {
                                                this.props.cardPagination.setCardPaginationId({ id: pks, status: 3 });
                                                setTimeout(() => {
                                                    newid = this.props.cardPagination.getNextCardPaginationId({
                                                        id: pks,
                                                        status: 3
                                                    });
                                                    if (!newid) {
                                                        setTimeout(() => {
                                                            this.props.form.EmptyAllFormValue('costregionForm');
                                                            setTimeout(() => {
                                                                this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                                                                setTimeout(() => {
                                                                    this.props.cardTable.setTableData('relstockstorages', { rows: [] });
                                                                    setTimeout(() => {
                                                                        // this.updateButtonStatus({isCard:true})
                                                                        // update by yufwm 删除完成 空白页 新增按钮放开
                                                                        this.updateButtonStatus({ isCard: true, isNull: true })
                                                                    });

                                                                });
                                                            });
                                                        });
                                                    } else {
                                                        this.queryCard(newid);
                                                    }
                                                    if (this.state.borowseMode) {
                                                        // 如果是列表界面删除成功，那么重新加载一遍数据
                                                        this.loadGridData();
                                                    }
                                                });
                                            });
                                        });
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

            },
            error: (res) => {
                toast({
                    content: res.message,
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                    color: 'danger'
                });
                /* 国际化处理： 提示*/
            }
        });
    }
    //更新按钮状态
    updateButtonStatus = (param = {}) => {
        let { callback, isCard, isDouble = false, isNull } = param;
        if (isCard) {
            let pk = !isDouble ? this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value : true;
            let buttonDisabled = {
                'cardAdd': !pk,
                'cardBatchAddByFina': !pk,
                'cardBatchAddByCos': !pk,
                'cardEdit': !pk,
                'cardDel': !pk,
                'cardCopy': !pk,
                'cardprint': !pk,
                'cardrefresh': !pk,
                cardout: !pk
            }
            // update by yufwm 删除完成 空白页 新增按钮放开
            if (isNull) {
                buttonDisabled.cardAdd = false;
                buttonDisabled.cardBatchAddByFina = false;
                buttonDisabled.cardBatchAddByCos = false;
            }
            setTimeout(() => {
                this.props.button.setButtonDisabled(buttonDisabled);
                this.setState(this.state, () => {
                    callback && callback();
                })
            })
        }
    }
    showCardEdit() {
        let pk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value;
        let enableState = this.props.form.getFormItemsValue('costregionForm', 'enablestate');
        ajax({
            url: ajaxurl.queryPermission,
            data: { 'pk': pk, 'operateCode': 'edit' },
            success: (res) => {
                this.copyCard(true);
                switch (enableState.display) {
                    case '未启用':
                        enableState.value = '0';
                        break;
                    case '已启用':
                        enableState.value = '1';
                        break;
                    case '已停用':
                        enableState.value = '2';
                        break;
                }
                //卡片复制中有设置启用状态为未启用状态的操作，当编辑当前数据时，需要设置为当前数据的状态
                this.props.form.setFormItemsValue('costregionForm', {
                    'enablestate': {
                        value: enableState.value,
                        display: enableState.display
                    }
                });
                // if (enableState) {
                this.props.button.setButtonVisible(['saveAndAdd'], false);
                this.props.form.setFormItemsDisabled('costregionForm', { 'layertype': true });
                // } else {
                //     this.props.form.setFormItemsDisabled('costregionForm', {'layertype': false});
                // }
            },
            error: (res) => {
                toast({
                    content: res.message,
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                    color: 'danger'
                });
                /* 国际化处理： 提示*/
            }
        });
    }


    copyCard(isEdit) {
        // document.getElementById("showReturn").style.display = 'none';
        this.state.showReturn = false;
        document.getElementById("cardPagination").style.display = 'none';
        // document.getElementById("refreshCard").style.display = 'none';
        this.props.form.setFormStatus('costregionForm', 'edit');
        this.props.cardTable.setStatus('relstockorgs', 'edit');
        this.props.cardTable.setStatus('relstockstorages', 'edit');
        this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine', 'cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], false);
        // update by yufwm 卡片页 修改  去掉 新增保存 按钮
        // this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd'], true);
        isEdit ? this.props.button.setButtonVisible(['btnSave', 'cardCancel'], true) : this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd'], true);
        let type = this.props.form.getFormItemsValue('costregionForm', 'layertype');
        this.props.form.setFormItemsValue('costregionForm', { 'enablestate': { value: 1, display: '未启用' } });
        if (type.value !== '0') {

            if (type.value === '1') {
                this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine'], true);
                this.props.button.setButtonDisabled(['orgAddLine'], false);
                this.props.button.setButtonDisabled(['orgDelLine'], true);
            } else {
                this.props.button.setButtonVisible(['orageAddLine', 'orageDelLine'], true);
                this.props.button.setButtonDisabled(['orageAddLine'], false);
                this.props.button.setButtonDisabled(['orageDelLine'], true);
            }
        } else {
            //this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
            this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine', 'cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], false);
        }
        this.setState(this.state, () => {
            this.props.form.setFormItemsDisabled('costregionForm', { 'layertype': false });
            this.props.form.setFormItemsDisabled('costregionForm', { 'enablestate': true });
        })
    }

    getLastRow() {
        let rownum = this.props.editTable.getNumberOfRows(gridId);
        if (rownum > 0) {
            let allRows = this.props.editTable.getAllRows(gridId);
            lastTableRow = allRows[rownum - 1];
        } else {
            lastTableRow = {};
        }
    }

    //展示新增卡片
    showAddPage() {
        this.getLastRow();
        tableAdd = 'true';
        this.state.borowseMode = false;
        uiStatus = 'edit';
        let jinPromise = new Promise((resolve) => {
            this.props.cardTable.setTableData('relstockorgs', { rows: [] });
            resolve();
        });
        this.state.showReturn = false;
        this.setState(this.state, () => {
            // document.getElementById("showReturn").style.display = 'none';
            // document.getElementById("refreshCard").style.display = 'none';
            // setTimeout(()=>{
            document.getElementById("cardPagination").style.display = 'none';
            cacheTools.set('allpks', allpks);
            // },20);
            this.props.form.setFormStatus('costregionForm', 'edit');
            this.props.form.EmptyAllFormValue('costregionForm');
            this.props.form.setFormItemsRequired('costregionForm', { 'name': true, 'code': true, 'pk_org': true });
            this.props.form.setFormItemsValue('costregionForm', {
                'layertype': {
                    value: '0',
                    display: this.state.json === undefined ? "" : this.state.json['10100COSTR-000018']
                }
            });
            this.props.form.setFormItemsValue('costregionForm', {
                'enablestate': {
                    value: '1',
                    display: '未启用'
                }
            });

            /* 国际化处理： 财务组织*/
            this.props.form.setFormItemsDisabled('costregionForm', { 'layertype': false, 'enablestate': true });
            if (userOrg.value) {
                this.props.form.setFormItemsValue('costregionForm', {
                    'pk_org': {
                        value: userOrg.value.refpk,
                        display: userOrg.value.refname
                    }
                })
            }
            jinPromise.then(this.props.cardTable.setTableData('relstockstorages', { rows: [] }));
            this.props.cardTable.setStatus('relstockstorages', 'edit');
            this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine', 'cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], false);
            // this.props.button.setButtonVisible(['cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy'], false);
            this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd'], true);
        });
    }

    //保存卡片
    savecard() {
        let vodata = this.props.createExtCardData('10100COSTR_costregion', 'costregionForm', ['relstockorgs', 'relstockstorages']);
        switch (vodata.head.costregionForm.rows[0].values.enablestate.value) {
            case true:
                vodata.head.costregionForm.rows[0].values.enablestate.value = '2';
                break;
            case false:
                vodata.head.costregionForm.rows[0].values.enablestate.value = '3';
                break;
        }
        if (tableAdd === 'true' || vodata.head.costregionForm.rows[0].values.enablestate.display === '未启用') {
            vodata.head.costregionForm.rows[0].values.enablestate.value = '1';
        }

        //平台改变 跟着相应改变  后期看看 会不会改回来
        if (vodata.bodys.relstockorgs.rows === false) {
            vodata.bodys.relstockorgs.rows = [];
        }
        if (vodata.bodys.relstockstorages.rows === false) {
            vodata.bodys.relstockstorages.rows = [];
        }
        let child;
        if (vodata.head.costregionForm.rows[0].values.layertype.value === '1') {
            this.props.cardTable.filterEmptyRows('relstockorgs');
            child = this.props.cardTable.getAllData('relstockorgs');
            this.filtEmpty(child);
            if (child.rows.length === 0) {
                toast({
                    color: 'danger',
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000028']
                });
                /* 国际化处理： 请输入库存组织信息*/
                return;
            }
            vodata.bodys.relstockorgs.rows = child.rows;
        }
        if (vodata.head.costregionForm.rows[0].values.layertype.value === '2') {
            this.props.cardTable.filterEmptyRows('relstockstorages');
            child = this.props.cardTable.getAllData('relstockstorages');
            this.filtEmpty(child);
            if (child.rows.length === 0) {
                toast({
                    color: 'danger',
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000029']
                });
                /* 国际化处理： 请输入库存组织及仓库信息*/
                return;
            }
            vodata.bodys.relstockstorages.rows = child.rows;
        }
        //适配平台一主多子转换类
        vodata.head.costregionForm.rows[0].values.relstockstorages = null;
        vodata.head.costregionForm.rows[0].values.relstockorgs = null;
        this.props.validateToSave(vodata, callback => {
            ajax({
                url: ajaxurl.saveAdd,
                data: vodata,
                async: false,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        // setTimeout(()=>{
                        data.costregionForm.rows = Utils.convertGridEnablestate(data.costregionForm.rows);
                        this.props.form.setAllFormValue({ 'costregionForm': data.costregionForm });
                        this.props.form.setFormStatus('costregionForm', 'browse');
                        this.props.cardTable.setStatus('relstockorgs', 'browse');
                        this.props.cardTable.setStatus('relstockstorages', 'browse');
                        toast({
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000030'],
                            color: 'success'
                        });
                        /* 国际化处理： 保存成功！*/
                        this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd', 'orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
                        this.props.button.setButtonVisible(['cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], true);
                        this.props.form.setFormItemsDisabled('costregionForm', { 'enablestate': false });
                        // document.getElementById("showReturn").style.display = '';
                        this.state.showReturn = true;
                        this.props.button.setButtonDisabled(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], true);
                        uiStatus = 'browse';
                        this.setState(this.state, () => {
                            this.props.cardPagination.setCardPaginationId({
                                id: data.costregionForm.rows[0].values.pk_costregion.value,
                                status: 2
                            });
                            document.getElementById("cardPagination").style.display = '';
                            // document.getElementById("refreshCard").style.display = '';
                        });

                        tableAdd = '';
                        // });

                    } else {
                        toast({
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000031'],
                            color: 'danger'
                        });
                        /* 国际化处理： 保存失败！*/
                    }
                }
            });

        }, { 'costregionForm': 'form', 'relstockorgs': 'cardTable', 'relstockstorages': 'cardTable' }, 'extcard')

    }


    filtEmpty(child) {

        if (child.rows.length > 0) {
            let again = false;
            for (let i = 0; i < child.rows.length; i++) {
                let value = child.rows[i].values.pk_stockorg.value;
                if (value === '') {
                    child.rows.splice(i, 1);
                    again = true;
                    break;
                }
            }
            if (again === true) {
                this.filtEmpty(child);
            }
        }
        return child;

    }


    //保存新增
    savecardAndAdd() {
        tableAdd = 'true';
        this.props.cardTable.filterEmptyRows('relstockorgs');
        this.props.cardTable.filterEmptyRows('relstockstorages');
        uiStatus = 'edit';
        let vodata = this.props.createExtCardData('10100COSTR_costregion', 'costregionForm', ['relstockorgs', 'relstockstorages']);
        switch (vodata.head.costregionForm.rows[0].values.enablestate.value) {
            case true:
                vodata.head.costregionForm.rows[0].values.enablestate.value = '2';
                break;
            case false:
                vodata.head.costregionForm.rows[0].values.enablestate.value = '3';
                break;
        }
        if (tableAdd === 'true' || vodata.head.costregionForm.rows[0].values.enablestate.display === '未启用') {
            vodata.head.costregionForm.rows[0].values.enablestate.value = '1';
        }
        //适配平台一主多子转换类
        vodata.head.costregionForm.rows[0].values.relstockstorages = null;
        vodata.head.costregionForm.rows[0].values.relstockorgs = null;
        ajax({
            url: ajaxurl.saveAdd,
            data: vodata,
            async: false,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    toast({
                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000030'],
                        color: 'success'
                    });
                    /* 国际化处理： 保存成功！*/
                    this.props.form.EmptyAllFormValue('costregionForm');
                    let jinPromise = new Promise((resolve) => {
                        this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                        resolve();
                    });
                    jinPromise.then(this.props.cardTable.setTableData('relstockstorages', { rows: [] }));
                    this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
                    this.props.form.setFormItemsDisabled('costregionForm', { 'layertype': false });
                    this.setState(this.state, () => {
                        this.props.cardPagination.setCardPaginationId({
                            id: data.costregionForm.rows[0].values.pk_costregion.value,
                            status: 2
                        });
                        document.getElementById("cardPagination").style.display = 'none';
                    });

                } else {
                    toast({
                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000031'],
                        color: 'danger'
                    });
                    /* 国际化处理： 保存失败！*/
                }
            }
        });
    }

    //打印
    print() {
        let data = this.props.editTable.getAllRows(gridId);
        if (data.length > 0) {
            oids = [];
            (data.forEach((e) => {
                oids.push(e.values.pk_costregion.value);
            }))
        } else {
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
                oids: oids
            }
        );


    }

    //卡片打印
    cardPrint() {
        let oid = [];
        let pk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value;
        if (pk === null) {
            toast({
                color: 'warning',
                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000033']
            });
            /* 国际化处理： 没有需打印的数据*/
            return;
        }
        oid.push(pk);
        print(
            'pdf',
            ajaxurl.print,
            {
                funcode: funcode,
                nodekey: nodecodeEdit,
                oids: oid
            }
        );
    }

    //卡片输出
    cardOut() {
        let oid = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value;
        if (oid === null) {
            toast({
                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000016'],
                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001']
            });
            /* 国际化处理： 没有需要输出的数据！,提示*/
            return;
        }
        //传字符串报错
        let oids = [oid];
        new Promise((resolve) => {
            this.setState({
                pks: oids,
                nodekey: nodecodeEdit
            }, () => {
                resolve();
            });
        }).then(() => {
            this.refs.printOutput.open()
        })
    }

    //复制
    copy() {
        this.state.borowseMode = false;
        let data = this.props.editTable.getCheckedRows('costregion');
        data[0].data.values.pk_costregion.value = '';
        data[0].data.values.enablestate.value = '1';
        data[0].data.values.enablestate.display = '未启用';
        uiStatus = 'edit';
        cacheTools.set('allpks', allpks);
        this.getLastRow();
        this.state.showReturn = false;
        this.props.button.setButtonVisible(['cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], false);
        this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd'], true);
        this.setState(this.state, () => {

            // document.getElementById("showReturn").style.display = 'none';
            this.props.form.EmptyAllFormValue('costregionForm');
            let jinPromise = new Promise((resolve) => {
                this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                document.getElementById("cardPagination").style.display = 'none';
                // document.getElementById("refreshCard").style.display = 'none';
                resolve();
            });
            jinPromise.then(this.props.cardTable.setTableData('relstockstorages', { rows: [] }));
            this.props.form.setFormStatus('costregionForm', 'edit');
            this.props.cardTable.setStatus('relstockorgs', 'edit');
            this.props.cardTable.setStatus('relstockstorages', 'edit');
            this.props.form.setAllFormValue({ 'costregionForm': { rows: [data[0].data] } });
            cardOldPk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion');
            let relstockstorages = data[0].data.values.relstockstorages.value;
            if (data[0].data.values.layertype.value !== '0') {
                if (data[0].data.values.layertype.value === '1') {
                    this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine',], true);
                    this.props.button.setButtonDisabled(['orgAddLine'], false);
                    this.props.button.setButtonDisabled(['orgDelLine'], true);
                    this.props.button.setButtonVisible(['orageAddLine', 'orageDelLine',], false);
                } else {
                    this.props.button.setButtonVisible(['orageAddLine', 'orageDelLine',], true);
                    this.props.button.setButtonDisabled(['orageAddLine'], false);
                    this.props.button.setButtonDisabled(['orageDelLine'], true);
                    this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine',], false);
                }
            }

            if (relstockstorages !== undefined && relstockstorages !== null && relstockstorages.length > 0) {
                ajax({
                    url: ajaxurl.queryRelstockstorages,
                    data: data[0].data.values.pk_costregion,
                    async: false,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if (res.hasOwnProperty('data')) {
                                setTimeout(() => {
                                    this.props.cardTable.setTableData('relstockstorages', data.relstockstorages);

                                }, 0);

                            } else {
                                this.props.cardTable.setTableData('relstockstorages', { rows: [] });

                            }
                        }
                    }
                });
            }
            let relstockorgs = data[0].data.values.relstockorgs.value;
            if (relstockorgs !== undefined && relstockorgs !== null && relstockorgs.length > 0) {
                ajax({
                    url: ajaxurl.queryRelstockorgs,
                    data: data[0].data.values.pk_costregion,
                    async: false,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if (res.hasOwnProperty('data')) {
                                setTimeout(() => {
                                    this.props.cardTable.setTableData('relstockorgs', data.relstockorgs)
                                }, 0);
                            } else {
                                this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                            }
                        }
                    }
                });

            }
            this.props.form.setFormItemsDisabled('costregionForm', { 'enablestate': true });

        });

    }

    //批量新增能保存
    saveBatch() {
        let saveData = [];
        let checkData = [];
        if (this.state.currentStep === 1) {
            checkData = this.BatchTable.editTable.getCheckedRows('costregion');
            if (checkData.length === 0) {
                // toast({content: "请选择需要保存的数据", title: '提示', color: 'danger'});
                return;
            }
            checkData.forEach((data) => {
                saveData.push(data.data);
            });

        } else if (this.state.currentStep === 2) {
            checkData = this.BatchTable.editTable.getAllRows('costregion');
            checkData.forEach((data) => {

                //平台提供的删除是假删除，把数据的status标记为3
                if (data.status !== '3') {
                    saveData.push(data);
                }
            });
        }

        let stepModalSaveDdata = {
            pageid: "10100COSTR_costregionbatchadd",
            model: {
                areaType: "table",
                rows: saveData,
                areacode: "costregion",
            }
        };
        this.BatchTable.validateToSave({ ...stepModalSaveDdata }, callback => {
            ajax({
                url: ajaxurl.CostregionSaveByFinance,
                data: { ...stepModalSaveDdata },
                async: false,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success, data } = res;
                    if (success) {
                        this.props.modal.close('stepModal');
                        toast({
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000030'],
                            color: 'success'
                        });
                        /* 国际化处理： 保存成功！*/
                        uiStatus = 'browse';
                        // debugger;
                        // data.map(function (item,index) {
                        //     this.props.editTable.addRow();
                        // });
                        if (saveContinue) {
                            if (stepname === 'finance') {
                                this.showFinanceOrg();
                            } else if (stepname === 'stock') {
                                this.showStockOrg();
                            }
                        }
                    }
                },
                error: (res) => {
                    toast({ color: 'danger', content: res.message });
                }
            });
        }, { 'costregion': 'editTable' }, 'grid')
    }

    //展示批量新增财务组织树
    showFinanceOrg() {
        uiStatus = 'edit';
        stepname = 'finance';
        this.props.modal.show('stepModal', {
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000034']/* 国际化处理： 选择财务组织*/
        });
        this.updatestepModalButtonStatus(0);
        let businessInfo = getBusinessInfo();
        ajax({
            url: ajaxurl.LoadOrgTree,
            data: {
                //userid: businessInfo.userId,
                appcode: funcode,
                // groupId: businessInfo.groupId
            },
            success: (res) => {
                let { data } = res;
                this.state.currentStep = 0;
                this.state.oprType = '0';
                this.state.allTreeData = data && data.financeOrgVOs ? data.financeOrgVOs : [];
                this.setState(
                    this.state, () => {
                        this.firstStepOrgValue.reset(data && data.financeOrgVOs ? data.financeOrgVOs : []);
                        this.firstStepOrgValue.state.treeWapper.setRootTitle(this.state.json === undefined ? "" : this.state.json['10100COSTR-000018']);
                        /* 国际化处理： 财务组织*/
                        this.firstStepOrgValue.setMoveType('0');
                    });
            }
        });
    }

    //展示批量新增库存组织树
    showStockOrg() {
        uiStatus = 'edit';
        stepname = 'stock';
        this.props.modal.show('stepModal', {
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000035']/* 国际化处理： 选择库存组织*/
        });
        this.updatestepModalButtonStatus(0);

        ajax({
            url: ajaxurl.LoadStockTree,
            data: {},
            success: (res) => {
                let { success, data } = res;
                this.state.currentStep = 0;
                this.state.oprType = '0';
                this.state.allTreeData = data && data.stockVOs ? data.stockVOs : [];
                this.setState(
                    this.state, () => {
                        this.firstStepOrgValue.reset(data && data.stockVOs ? data.stockVOs : []);
                        this.firstStepOrgValue.state.treeWapper.setRootTitle(this.state.json === undefined ? "" : this.state.json['10100COSTR-000019']);
                        /* 国际化处理： 库存组织*/
                        this.firstStepOrgValue.setMoveType('0');
                    });
            }
        });
    }

    //调节批量添加窗口按钮显示
    updatestepModalButtonStatus = (current) => {
        if (current === 0) {
            this.props.button.setDisabled({
                Prev: true,
                Next: false,
                Finish: true,
                CancelStep: false
            });
            this.props.button.setButtonVisible('Next', true);
            this.props.button.setButtonVisible('goon', false);
        } else if (current === 1) {
            this.props.button.setDisabled({
                Prev: false,
                Next: false,
                Finish: false,
                CancelStep: false
            });
            this.props.button.setButtonVisible('Next', true);
            this.props.button.setButtonVisible('goon', false);
        } else {
            this.props.button.setDisabled({
                Prev: false,
                Next: true,
                Finish: false,
                CancelStep: false
            });
            this.props.button.setButtonVisible('Next', false);
            this.props.button.setButtonVisible('goon', true);
        }

    };

    //查询区按钮点击事件
    onClickSearchBtn(props, data) {
        //校验通过后，条件查询请求
        searchOnClick = 'true';
        this.loadGridData();
    }


    //显示停用按钮点击事件
    onCheckShowDisable() {
        // this.state.checkValue = checked;
        this.setState({
            checkValue: !this.state.checkValue
        }, () => {
            this.loadGridData();
        })
    }

    //模态框编辑后事件
    onTableModelAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        // props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        switch (key) {
            //如果启用状态修改
            case 'enablestate':
                //点击的停用启用的时候 获取到的record的enablestate是和点击后的值 所以拿到record的时候要反置一下
                // record.values.enablestate.value = !record.values.enablestate.value;
                if (value) {//如果是启用
                    ajax({
                        url: ajaxurl.queryPermission,
                        data: { 'pk': record.values.pk_costregion.value, 'operateCode': 'enable' },
                        success: (res) => {
                            ajax({
                                url: ajaxurl.enable,
                                data: { pk: record.values.pk_costregion.value },
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) {
                                        if (data === 'success') {
                                            toast({
                                                color: 'success',
                                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000036']
                                            });
                                            /* 国际化处理： 启用成功！*/
                                            // this.loadGridData();
                                            props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: value })
                                        }
                                    }
                                },
                                error: (res) => {
                                    toast({
                                        color: 'danger',
                                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000037'] + res
                                    });
                                    /* 国际化处理： 启用失败,失败信息：*/
                                    props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: !value })
                                }
                            });
                        },
                        error: (res) => {
                            toast({
                                content: res.message,
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                                color: 'danger'
                            });
                            /* 国际化处理： 提示*/
                            props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: !value })
                        }
                    })

                } else {//如果是停用
                    ajax({
                        url: ajaxurl.queryPermission,
                        data: { 'pk': record.values.pk_costregion.value, 'operateCode': 'disable' },
                        success: (res) => {
                            ajax({
                                url: ajaxurl.disable,
                                data: { pk: record.values.pk_costregion.value },
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) {
                                        toast({
                                            color: 'success',
                                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000038']
                                        });
                                        /* 国际化处理： 停用成功！*/
                                        props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: value })
                                        // this.loadGridData();
                                    }
                                },
                                error: (res) => {
                                    toast({
                                        color: 'danger',
                                        content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000039'] + res
                                    });
                                    /* 国际化处理： 停用失败,失败信息：*/
                                    props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: !value })
                                    // this.loadGridData();
                                }
                            });
                        },
                        error: (res) => {
                            toast({
                                content: res.message,
                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                                color: 'danger'
                            });
                            props.editTable.setValByKeyAndIndex(gridId, index, 'enablestate', { value: !value })

                            /* 国际化处理： 提示*/
                        }
                    });
                }
                break;
        }
    }

    //列表页面双击
    onRowDoubleClick(record, e) {
        this.setPageInfo();
        let data = { rows: [record] };
        this.state.borowseMode = false;
        cacheTools.set('allpks', allpks);
        this.state.showReturn = true;
        this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd', 'orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
        this.props.button.setButtonVisible(['cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy', 'cardrefresh'], true);
        this.setState(this.state, () => {
            // document.getElementById("showReturn").style.display = '';
            this.updateButtonStatus({
                isCard: true, isDouble: true, callback: () => {
                    this.props.form.setFormStatus('costregionForm', 'browse');
                    this.props.cardTable.setStatus('relstockorgs', 'browse');
                    this.props.cardTable.setStatus('relstockstorages', 'browse');
                    this.queryCard(data.rows[0].values.pk_costregion.value);

                    //this.props.button.setButtonVisible(['btnSave', 'cardCancel', 'saveAndAdd', 'orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
                    //this.props.button.setButtonVisible(['cardprint', 'cardAdd', 'cardEdit', 'cardDel', 'cardCopy'], true);
                    this.props.form.setFormItemsDisabled('costregionForm', { 'enablestate': false });
                    this.props.cardPagination.setCardPaginationId({ id: record.values.pk_costregion.value, status: 1 });
                }
            })
        });


    }

    queryRelstockstorages(pk) {
        ajax({
            url: ajaxurl.queryRelstockstorages,
            data: { pk: pk },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {//显示公式
                        this.props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "relstockstorages": "cardTable"
                            }
                        );
                    }
                    if (data.relstockstorages) {
                        setTimeout(() => {
                            this.props.cardTable.setTableData('relstockstorages', data.relstockstorages);
                        }, 0);

                    } else {
                        this.props.cardTable.setTableData('relstockstorages', { rows: [] });

                    }
                }
            }
        });
    }

    queryRelstockorgs(pk) {
        ajax({
            url: ajaxurl.queryRelstockorgs,
            data: { pk: pk },
            async: false,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {//显示公式
                        this.props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "relstockorgs": "cardTable"
                            }
                        );
                    }

                    if (data.relstockorgs) {
                        setTimeout(() => {
                            this.props.cardTable.setTableData('relstockorgs', data.relstockorgs)
                        }, 0);
                    } else {
                        this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                    }
                }
            }
        });
    }

    //表格状态改变监听事件
    gridStatusChange() {
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
     *
     * 新增修改参照改变时间
     */

    onRefAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        if (value.length === 0) {//修改时删除所选的参照

            switch (moduleId) {
                case 'relstockorgs':
                    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg.name', { value: '', display: '' });
                    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg', { value: '', display: '' });
                    break;
                case 'relstockstorages':
                    if (key === 'pk_stockorg.code') {
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg.name', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg', { value: '', display: '' });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.name', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.code', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage', { value: '', display: '' });
                    } else if (key === 'pk_storage.code') {
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.name', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage', { value: '', display: '' });
                    }

                    break;
            }
            return;
        }
        if (value.length === 2 && value[0].display !== undefined) {//修改时修改参照
            switch (moduleId) {
                case 'relstockorgs':

                    record.values['pk_stockorg.code'].display = value[1].refcode;
                    record.values['pk_stockorg.code'].value = value[1].refcode;
                    record.values['pk_stockorg'].value = value[1].refpk;
                    record.values['pk_stockorg.name'].value = value[1].refname;
                    //编辑取消完成之后再次编辑名称显不出来，手动赋值
                    // props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg.name', { value:value[0].refname, display:value[0].refname});
                    // props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg', { value:value[0].refpk, display:value[0].refpk});
                    break;
                case 'relstockstorages':
                    if (key === 'pk_stockorg.code') {
                        record.values['pk_stockorg.code'].display = value[1].refcode;
                        record.values['pk_stockorg.code'].value = value[1].refcode;
                        record.values['pk_stockorg'].value = value[1].refpk;
                        record.values['pk_stockorg.name'].display = value[1].refname;
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.code', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.name', {
                            value: '',
                            display: ''
                        });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage', { value: '', display: '' });
                    } else if (key === 'pk_storage.code') {
                        record.values['pk_storage.code'].display = value[1].refcode;
                        record.values['pk_storage.code'].value = value[1].refcode;
                        record.values['pk_storage'].value = value[1].refpk;
                        record.values['pk_storage.name'].display = value[1].refname;
                        //手动赋值（modified by qiaojie）
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage.name', { value: value[1].refname, display: value[1].refname });
                        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_storage', { value: value[1].refpk, display: value[1].refpk });
                    }

                    break;
            }
            return;
        }
        // props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）){
        switch (moduleId) {
            case 'relstockorgs':

                if (key.length != null) {
                    record.values['pk_stockorg.code'].display = value[0].refcode;
                    record.values['pk_stockorg.code'].value = value[0].refcode;
                    record.values['pk_stockorg'].value = value[0].refpk;
                    record.values['pk_stockorg.name'].value = value[0].refname;
                    //编辑取消完成之后再次编辑名称显不出来，手动赋值
                    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg.name', {
                        value: value[0].refname,
                        display: value[0].refname
                    });
                    props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_stockorg', {
                        value: value[0].refpk,
                        display: value[0].refpk
                    });
                    if (value.length > 1) {
                        for (let j = index + 1; j < index + value.length; j++) {
                            let refcode = value[j - index].refcode;
                            let refok = value[j - index].refpk;
                            let refname = value[j - index].refname;
                            props.cardTable.addRow(moduleId, j, {
                                'pk_stockorg.code': {
                                    display: refcode,
                                    value: refcode
                                },
                                'pk_stockorg': { display: refok, value: refok },
                                'pk_stockorg.name': { display: refname, value: refname }
                            }, false);
                        }
                    }
                }
                break;
            case 'relstockstorages':
                if (key === 'pk_stockorg.code') {
                    record.values['pk_stockorg.code'].display = value[0].refcode;
                    record.values['pk_stockorg.code'].value = value[0].refcode;
                    record.values['pk_stockorg'].value = value[0].refpk;
                    record.values['pk_stockorg.name'].display = value[0].refname;
                    record.values['pk_stockorg.name'].value = value[0].refname;
                    if (value.length > 1) {
                        for (let j = index + 1; j < index + value.length; j++) {
                            let refcode = value[j - index].refcode;
                            let refpk = value[j - index].refpk;
                            let refname = value[j - index].refname;
                            props.cardTable.addRow(moduleId, j, {
                                'pk_stockorg.code': { display: refcode, value: refcode },
                                'pk_stockorg': { display: refpk, value: refpk },
                                'pk_stockorg.name': { display: refname, value: refname },
                                'pk_storage.code': { itemtype: 'refer' },
                                'pk_storage': { itemtype: 'input' },
                                'pk_storage.name': { itemtype: 'input' },
                            }, false);
                        }
                    }

                }
                if (key === 'pk_storage.code') {
                    record.values['pk_storage.code'].display = value[0].refcode;
                    record.values['pk_storage.code'].value = value[0].refcode;
                    record.values['pk_storage'].value = value[0].refpk;
                    record.values['pk_storage.name'].display = value[0].refname;
                    record.values['pk_storage.name'].value = value[0].refname;
                    if (value.length > 1) {
                        for (let j = index + 1; j < index + value.length; j++) {
                            let refcode = value[j - index].refcode;
                            let refok = value[j - index].refpk;
                            let refname = value[j - index].refname;
                            props.cardTable.addRow(moduleId, j, {
                                'pk_stockorg.code': {
                                    display: record.values['pk_stockorg.code'].value,
                                    value: record.values['pk_stockorg.code'].value
                                },
                                'pk_stockorg': {
                                    display: record.values['pk_stockorg'].value,
                                    value: record.values['pk_stockorg'].value
                                },
                                'pk_stockorg.name': {
                                    display: record.values['pk_stockorg.name'].display,
                                    value: record.values['pk_stockorg.name'].display
                                },
                                'pk_storage.code': { display: refcode, value: refcode },
                                'pk_storage': { display: refok, value: refok },
                                'pk_storage.name': { display: refname, value: refname },
                            }, false);
                        }
                    }
                }
                break;
        }

    }

    //设置参照过滤
    bodyBeforeEvent(props, moduleId, key, value, index, record) {
        debugger;
        let meta = props.meta.getMeta();
        meta[moduleId].items.find((item) => item.attrcode === 'pk_org').queryCondition = () => {
            let pk_org = record.values.materiel.value;
            return {
                pk_org: pk_org
            };
        };
        props.meta.setMeta(meta);
        return true;
    }


    /**
     * 组织批量新增成本域模态框中的分步内容
     */
    getSteps() {
        let firstTitle = this.state.json === undefined ? "" : this.state.json['10100COSTR-000034'];
        /* 国际化处理： 选择财务组织*/
        if (stepname === 'stock') {
            firstTitle = this.state.json === undefined ? "" : this.state.json['10100COSTR-000035'];
            /* 国际化处理： 选择库存组织*/
        }
        let { button } = this.props;
        let { createButtonApp } = button;
        const { createButton } = button;


        const steps = [{
            title: firstTitle,
            content: this.getFirstContent(),
        }, {
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000023'], /* 国际化处理： 选择创建成本域*/
            content: this.getSecondContent(),
        }, {
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000024'], /* 国际化处理： 编辑选择成本域*/
            content: this.getLastContent(),
        }];
        return (
            < div>
                < NCSteps
                    current={this.state.currentStep}
                    style={{ marginBottom: 10 }}>
                    {
                        steps.map(item => < NCStep
                            key={item.title
                            }
                            title={item.title
                            }
                        />)}
                </NCSteps>
                {
                    steps[this.state.currentStep].content
                }
                {
                    this.state.currentStep === 0 &&
                    < div
                        className="steps-radio"
                        style={
                            {
                                display: 'flex', justifyContent:
                                    'center'
                            }
                        }>
                        <
                            NCRadio.NCRadioGroup
                            name="oprType"
                            selectedValue={this.state.oprType
                            }
                            onChange={this.handleOprTypeChange.bind(this)
                            }>
                            <
                                NCRadio
                                value="0"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000048']
                                    /* 国际化处理： 包含所有下级*/
                                }
                            </NCRadio>
                            < NCRadio
                                value="1"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000049']
                                    /* 国际化处理： 仅自己*/
                                }
                            </NCRadio>
                            < NCRadio
                                value="2"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000050']
                                    /* 国际化处理： 仅直接下级*/
                                }
                            </NCRadio>
                            < NCRadio
                                value="3"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000051']
                                    /* 国际化处理： 仅末级*/
                                }
                            </NCRadio>
                        </NCRadio.NCRadioGroup>
                    </div>}
            </div>);
    }


    /**
     * 列表区checkbox选中/非选中事件
     */
    selectedChange(props, moduleId, newVal, oldVal) {
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


    /**
     * 批量新增包含下级赋值
     */
    handleOprTypeChange(value) {
        this.setState({
            oprType: value
        });
        this.firstStepOrgValue.setMoveType(value);
        if (this.state.currentStep > 0) {
            this.secondStepOrgValue.setMoveType(value);
        }
    }

    /**
     * 获取分步中的第一步的页面内容
     */
    getFirstContent = () => {
        return (
            < div
                id="org_transfer"
                className="steps-content">
                < Transfer
                    ref={(item) => {
                        this.firstStepOrgValue = item
                    }}
                    showSearch={true}
                    lang={
                        {
                            leftTreeName: this.state.json === undefined ? "" : this.state.json['10100COSTR-000056']/* 国际化处理： 待选择数据*/,
                            rightTreeName:
                                this.state.json === undefined ? "" : this.state.json['10100COSTR-000057']

                        }
                    }
                />
            </div>);
    };

    /**
     * 获取分步中的第二步的页面内容
     */
    getSecondContent = () => {

        return (
            < div className="steps-content-table">
                < BatchTable
                    config={{ showCheck: true, showIndex: true }}
                    ref={(BatchTable) => this.BatchTable = BatchTable
                    } />
            </div>);
        //第一次进入时不回加载序号，需要重新加载一次。
        setTimeout(() => {
            this.setState({})
        }, 0)
    };

    /**
     * 将树数据转换为表数据，提供给第三步生成表格数据使用
     */
    convertToTable = (orgTree, data) => {
        orgTree.forEach((item, index) => {
            data.push(item);
            if (item.children && item.children.length > 0) {
                this.convertToTable(item.children, data);
            }
        })
    };


    /**
     * 获取分步中的第三步的页面内容
     */
    getLastContent = () => {
        return (
            < div
                className="steps-content-table">
                < BatchTable
                    config={
                        {}
                    }
                    ref={(BatchTable) => this.BatchTable = BatchTable}
                />
            </div>

        )
            ;
    };

    //新增行
    addLine(tableid) {
        // let type = this.props.form.getFormItemsValue('costregionForm', 'layertype').value;
        // if (type !== '') {
        //     if (type === '1' ) {
        this.props.cardTable.addRow(tableid);
        //     } else if (type === '2') {
        //         this.props.cardTable.addRow('relstockstorages');
        //     }
        // }


    }

    //删除行
    delLine(tableid) {
        let rows = this.props.cardTable.getCheckedRows(tableid);
        if (rows[0] === undefined) {
            toast({
                color: 'danger',
                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000040']
            });
            /* 国际化处理： 请选择数据操作*/
        }
        let ids = [];
        // rows.forEach((e)=>{ids.push(e.data.rowid)});
        rows.forEach((e) => {
            ids.push(e.index)
        });
        this.props.cardTable.delRowsByIndex(tableid, ids);
        if (tableid === 'relstockstorages') {
            this.props.button.setButtonDisabled('orageDelLine', true);
        } else if (tableid === 'relstockorgs') {
            this.props.button.setButtonDisabled('orgDelLine', true);
        }

    }

    //根据主表数据的变化设置子表增行删行按钮的状态
    onTabChange(value) {
        let { tab } = this.state;
        tab.activeKey = value;
        this.setState(this.state, () => {
            let type = this.props.form.getFormItemsValue('costregionForm', 'layertype').value;
            let satus = this.props.form.getFormStatus('costregionForm');
            if (type !== '0') {
                if (satus === 'edit') {
                    this.props.button.setButtonVisible(['addline', 'delline'], true);
                    switch (value) {
                        case 'relstockorgs':
                            if (this.state.type === '1' || type === '1')
                                this.props.button.setButtonDisabled(['addline'], false);

                            else if (this.state.type === '2' || type === '2')
                                this.props.button.setButtonDisabled(['addline'], true);
                            break;
                        case 'relstockstorages':
                            if (this.state.type === '1' || type === '1')
                                this.props.button.setButtonDisabled(['addline'], true);
                            else if (this.state.type === '2' || type === '2')
                                this.props.button.setButtonDisabled(['addline'], false);
                            break;

                    }
                }
            }

        });


    }

    //主表编辑完成事件
    afterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {
        if (key === 'layertype') {
            let type = value.value;
            if (type !== '') {
                if (type === '1') {
                    this.props.cardTable.setTableData('relstockstorages', { rows: [] });
                }
                if (type === '2') {
                    this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                }
                if (type === '0') {
					if(value.value !== undefined){
                        let pk_org =this.props.form.getFormItemsValue('costregionForm', 'pk_org').value;
                        if(pk_org!== undefined){
                            ajax({
                                url: ajaxurl.getjurisdiction,
                                data: {pk: pk_org},
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        if(data){
                                            toast({
                                                color: 'danger',
                                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000058']
                                            });
                                            /*该财务组织下存在启用了产品成本、标准成本核算、成本估算的财务核算账簿，该财务成本域“对应层级”不能为财务组织*/
                                            // this.loadGridData();
                                        }else{
                                            this.props.cardTable.setTableData('relstockstorages', {rows: []});
                                            this.props.cardTable.setTableData('relstockstorages', {rows: []});
                                        }
                                    }
                                },
                                error:(res) =>{
                                    toast({
                                        color: 'danger',
                                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000058']+res
                                    });
                                }
                            })
                        }
                    }                }

            }
            if (value.value !== '0' && value.value !== undefined) {
                this.state.type = value.value;
                let button = [];
                let disbutton = [];
                if (value.value === '1') {
                    button.push('orgAddLine', 'orgDelLine');
                    disbutton.push('orageAddLine', 'orageDelLine');
                    this.props.button.setButtonDisabled(['orgAddLine'], false);
                    this.props.button.setButtonDisabled(['orgDelLine'], true);
                } else {
                    button.push('orageAddLine', 'orageDelLine');
                    disbutton.push('orgAddLine', 'orgDelLine');
                    this.props.button.setButtonDisabled(['orageAddLine'], false);
                    this.props.button.setButtonDisabled(['orageDelLine'], true);
                }
                this.setState(this.state, () => {
                    this.props.button.setButtonVisible(button, true);
                    this.props.button.setButtonVisible(disbutton, false);
                });
            } else {
                this.state.type = value.value;
                this.setState(this.state, () => {
                    this.props.button.setButtonVisible(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], false);
                });
                this.props.button.setButtonDisabled(['orgAddLine', 'orgDelLine', 'orageAddLine', 'orageDelLine'], true);
            }
        }
        if (key === 'enablestate') {
            let pk = props.form.getFormItemsValue('costregionForm', 'pk_costregion');
            let oldvalue = changedrows.value;
            let olddisplay = changedrows.display;
            if (value.value === true) {//改之后的值是true，要启用
                ajax({
                    url: ajaxurl.queryPermission,
                    data: { 'pk': pk.value, 'operateCode': 'enable' },
                    success: (res) => {
                        promptBox({
                            color: 'warning',
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'], /* 国际化处理： 提示*/
                            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000041'], /* 国际化处理： 确定启用？*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.enable,
                                    data: { pk: pk.value },
                                    success: (res) => {
                                        let { success, data } = res;
                                        if (success) {
                                            if (data === 'success') {
                                                toast({
                                                    color: 'success',
                                                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000036']
                                                });
                                                /* 国际化处理： 启用成功！*/
                                            }
                                        }
                                    },
                                    error: (res) => {
                                        toast({
                                            color: 'danger',
                                            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000037'] + res
                                        });
                                        /* 国际化处理： 启用失败,失败信息：*/
                                        props.form.setFormItemsValue('costregionForm', {
                                            'enablestate': {
                                                value: oldvalue,
                                                display: olddisplay
                                            }
                                        })
                                        // this.loadGridData();
                                    }
                                });
                            },
                            cancelBtnClick: () => {
                                props.form.setFormItemsValue('costregionForm', {
                                    'enablestate': {
                                        value: oldvalue,
                                        display: olddisplay
                                    }
                                })
                            }
                        });
                    },
                    error: (res) => {
                        toast({
                            content: res.message,
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                            color: 'danger'
                        });
                        /* 国际化处理： 提示*/
                        props.form.setFormItemsValue('costregionForm', {
                            'enablestate': {
                                value: oldvalue,
                                display: olddisplay
                            }
                        })
                    }
                })

            } else {//改之后的值是false，要停用
                ajax({
                    url: ajaxurl.queryPermission,
                    data: { 'pk': pk.value, 'operateCode': 'disable' },
                    success: (res) => {
                        promptBox({
                            color: 'warning',
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'], /* 国际化处理： 提示*/
                            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000042'], /* 国际化处理： 确定停用？*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.disable,
                                    data: { pk: pk.value },
                                    success: (res) => {
                                        let { success, data } = res;
                                        if (success) {
                                            toast({
                                                color: 'success',
                                                title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000038']
                                            });
                                            /* 国际化处理： 停用成功！*/
                                            // this.loadGridData();
                                        }
                                    },
                                    error: (res) => {
                                        toast({
                                            color: 'danger',
                                            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000039'] + res
                                        });
                                        /* 国际化处理： 停用失败,失败信息：*/
                                        props.form.setFormItemsValue('costregionForm', {
                                            'enablestate': {
                                                value: oldvalue,
                                                display: olddisplay
                                            }
                                        })
                                        // this.loadGridData();
                                    }
                                });

                            },
                            cancelBtnClick: () => {
                                props.form.setFormItemsValue('costregionForm', {
                                    'enablestate': {
                                        value: oldvalue,
                                        display: olddisplay
                                    }
                                })
                            }
                        });
                    },
                    error: (res) => {
                        toast({
                            content: res.message,
                            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'],
                            color: 'danger'
                        });
                        /* 国际化处理： 提示*/
                        props.form.setFormItemsValue('costregionForm', {
                            'enablestate': {
                                value: oldvalue,
                                display: olddisplay
                            }
                        })
                    }
                });
                // if(value===true){
                //
                // }
                // debugger;
            }
        }
        if (key === 'pk_org' && changedrows !== null && changedrows.display !== value.display) {
            let orgnum = this.props.cardTable.getAllRows('relstockorgs').length;
            let argnum = this.props.cardTable.getAllRows('relstockstorages').length;
            if (orgnum > 0 || argnum > 0) {
                promptBox({
                    color: 'warning',
                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'], /* 国际化处理： 提示*/
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000043'], /* 国际化处理： 修改财务组织将清空库存信息，确认修改么？*/
                    beSureBtnClick: () => {
                        setTimeout(() => {
                            this.props.cardTable.setTableData('relstockorgs', { rows: [] });
                            this.props.cardTable.setTableData('relstockstorages', { rows: [] });
                        }, 0)
                    },
                    cancelBtnClick: () => {
                        return;
                    }
                });
            }
            if(value.value !== undefined){
                let layertype =this.props.form.getFormItemsValue('costregionForm', 'layertype').value;
                if(layertype==0){
                    ajax({
                        url: ajaxurl.getjurisdiction,
                        data: {pk: value.value},
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if(data){
                                    toast({
                                        color: 'danger',
                                        title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000058']
                                    });
                                    /*该财务组织下存在启用了产品成本、标准成本核算、成本估算的财务核算账簿，该财务成本域“对应层级”不能为财务组织*/
                                    // this.loadGridData();
                                }
                            }
                        }
                    })
                }
            }
        }
    };


    //分页信息点击事件
    onClickPageInfo(props, config, pks) {
        this.loadGridData(pks, 'queryByPks');
    }


    //参照过滤
    // filterRefer(sourceorg) {
    //     let me = this;
    //     let meta = me.props.meta.getMeta();
    //     debugger;
    //     meta['relstockorgs'].items.find((item) => item.attrcode === 'pk_stockorg').queryCondition = {pk_org: sourceorg.value};
    //     meta['relstockstorages'].items.find((item) => item.attrcode === 'pk_stockorg').queryCondition = {pk_org: sourceorg.value};
    //     me.props.meta.setMeta(meta);
    // }

    //设置按钮在子表的标题上
    getOrgTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        return (
            < div
                className="shoulder-definition-area">
                < div
                    className="btn-group">
                    {
                        createButtonApp({
                            area: 'org-area',
                            buttonLimit: 3,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.org-area')
                        })
                    }
                </div>
            </div>
        )
    };

    getOrageTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        return (
            < div
                className="shoulder-definition-area">
                < div
                    className="btn-group">
                    {
                        createButtonApp({
                            area: 'orage-area',
                            buttonLimit: 3,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.orage-area')
                        })
                    }
                </div>
            </div>
        )
    };

    // cardRefresh (currentid) {
    //     cardRefresh = 'true';
    //     this.queryCard(currentid);
    // }


    queryCard(currentid) {
        let pk;
        if (currentid) {
            pk = currentid;
        } else {
            pk = this.props.form.getFormItemsValue('costregionForm', 'pk_costregion').value;
        }
        if (pk) {
            ajax({
                url: ajaxurl.queryCostregionForm,
                data: { pk: pk },
                success: (res => {
                    let { success, data } = res;
                    if (success) {

                        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {//显示公式
                            this.props.dealFormulamsg(
                                res.formulamsg,  //参数一：返回的公式对象
                                {                //参数二：界面使用的表格类型
                                    "costregionForm": "form",
                                    "relstockorgs": "cardTable",
                                    "relstockstorages": "cardTable"
                                }
                            );
                        }
                        if (data && data.costregionForm ) {
                            data.costregionForm.rows = Utils.convertGridEnablestate(data.costregionForm.rows);
                            this.props.form.setAllFormValue({ 'costregionForm': data.costregionForm });
                            let pk_costregion = data.costregionForm.rows[0].values.pk_costregion.value;
                            let stockorgs = data.costregionForm.rows[0].values.relstockorgs.value;
                            let stockstorages = data.costregionForm.rows[0].values.relstockstorages.value;
                            if (stockorgs && stockorgs.length > 0) {
                                this.queryRelstockorgs(pk_costregion);
                            } else {
                                this.props.cardTable.setTableData('relstockorgs', { rows: [] })
                            }
                            if (stockstorages && stockstorages.length > 0) {
                                // setTimeout(()=>{
                                this.queryRelstockstorages(pk_costregion);
                                // },1000);
                            } else {
                                this.props.cardTable.setTableData('relstockstorages', { rows: [] })
                            }
                            if (cardRefresh === 'true') {
                                toast({
                                    color: 'success',
                                    title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000054']
                                });
                                cardRefresh = '';
                            }
                        }
                    }
                })

            });
        }
    }


    //表格编辑前时间
    beforeFormEvent(props, moduleId, key, value, data) {//props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值
        if (key === 'pk_org') {
            let meta = props.meta.getMeta();
            meta['costregionForm'].items.map((item) => {
                if (item.attrcode === 'pk_org') {
                    item.queryCondition = () => {
                        return {
                            // AppCode: '10100COSTR',
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        };
                    };
                }
            });
            props.meta.setMeta(meta);
            return true;
        }
    }

    //表格修改联动
    filterStock(props, moduleId, key, index, value, record) {
        let pk_org = props.form.getFormItemsValue('costregionForm', 'pk_org');
        //没有选择财务组织时，不能选择子表数据
        if (pk_org.value === null) {
            toast({
                color: 'warning',
                content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000044']
            });
            /* 国际化处理： 请选择财务组织后再选择库存组织数据!*/
            return;
        }
        let meta = props.meta.getMeta();
        //没有选择库存信息时，不能选择仓库信息
        if (moduleId === 'relstockstorages' && key === 'pk_storage.code') {
            let pk_stockorg = record.values.pk_stockorg.value;
            if (pk_stockorg === "" || pk_stockorg === null) {
                toast({
                    color: 'warning',
                    content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000045']
                });
                /* 国际化处理： 请选择库存组织后再选择仓库数据!*/
                return;
            }
            meta[moduleId].items.find((item) => item.attrcode === 'pk_storage.code').queryCondition = () => {//pk_stockorg.code
                return {
                    pk_org: pk_stockorg
                };
            };
        }
        //添加仓库参照过滤
        if (key === 'pk_stockorg.code') {
            meta[moduleId].items.find((item) => item.attrcode === 'pk_stockorg.code').queryCondition = () => {//pk_stockorg.code
                let pk_org = props.form.getFormItemsValue('costregionForm', 'pk_org').value;
                return {
                    pk_org: pk_org,
                    GridRefActionExt: 'nccloud.web.org.costregion.action.RefCondStockOrg'
                };
            };
        }

        props.meta.setMeta(meta);
        return true;

    }

    //批量新增点击取消
    cancelModalEve() {
        promptBox({
            color: 'warning',
            title: this.state.json === undefined ? "" : this.state.json['10100COSTR-000001'], /* 国际化处理： 提示*/
            content: this.state.json === undefined ? "" : this.state.json['10100COSTR-000046'], /* 国际化处理： 确定关闭？*/
            beSureBtnClick: () => {
                this.props.modal.close('stepModal');
                uiStatus = 'browse';
            },
            cancelBtnClick: () => {
                return;
            }
        });
    }
    ;

    //批量新增点击关闭
    closeModalEve() {
        uiStatus = 'browse';
    }

    pageInfoClick(props, pk) {
        ajax({
            url: ajaxurl.queryByPks,
            data: { pks: [pk] },
            success: function (res) {
                let { success, data } = res;
                let returnData = { rows: [] };
                debugger;
                if (success) {
                    let jinPromise = new Promise((resolve) => {
                        props.cardTable.setTableData('relstockorgs', { rows: [] });
                        resolve();
                    });
                    returnData.rows = Utils.convertGridEnablestate(data.costregion.rows);

                    jinPromise.then(props.cardTable.setTableData('relstockstorages', { rows: [] }));


                    props.form.setAllFormValue({ 'costregionForm': returnData });

                    let relstockstorages = returnData.rows[0].values.relstockstorages.value;

                    if (relstockstorages !== undefined && relstockstorages !== null && relstockstorages.length > 0) {
                        ajax({
                            url: ajaxurl.queryRelstockstorages,
                            data: { pk: returnData.rows[0].values.pk_costregion.value },
                            async: false,
                            success: (res) => {
                                let { success, data } = res;
                                if (success) {
                                    if (res.hasOwnProperty('data')) {
                                        setTimeout(() => {
                                            props.cardTable.setTableData('relstockstorages', data.relstockstorages);
                                        }, 0);
                                    } else {
                                        props.cardTable.setTableData('relstockstorages', { rows: [] });
                                    }
                                }
                            }
                        });
                    }
                    let relstockorgs = returnData.rows[0].values.relstockorgs.value;
                    if (relstockorgs !== undefined && relstockorgs !== null && relstockorgs.length > 0) {
                        ajax({
                            url: ajaxurl.queryRelstockorgs,
                            data: returnData.rows[0].values.pk_costregion,
                            async: false,
                            success: (res) => {
                                let { success, data } = res;
                                if (success) {
                                    if (res.hasOwnProperty('data')) {
                                        setTimeout(() => {
                                            props.cardTable.setTableData('relstockorgs', data.relstockorgs)
                                        }, 0);
                                    } else {
                                        props.cardTable.setTableData('relstockorgs', { rows: [] });
                                    }
                                }
                            }
                        });

                    }


                }
            }
        })
    }
    ;

    showDelLine(props, moduleId, newVal, oldVal) {//props, moduleId(区域id), newVal(被选中的行数), oldVal(旧的被选中的行数)
        if (newVal > 0) {
            if (moduleId === 'relstockorgs') {
                props.button.setButtonDisabled(['orgDelLine'], false);
            } else if (moduleId === 'relstockstorages') {
                props.button.setButtonDisabled(['orageDelLine'], false);
            }

        }
    }


    render() {
        const { cardTable, editTable, button, search, modal, form, cardPagination, BillHeadInfo } = this.props;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createModal } = modal;
        const { createEditTable } = editTable;
        const { createCardTable } = cardTable;
        const { createForm } = form;
        const that = this;
        const { createCardPagination } = cardPagination;
        const { createBillHeadInfo } = BillHeadInfo;

        var drawCard = () => {
            return (
                <div className="nc-bill-extCard"
                    id={'edit'}>
                    <div className="nc-bill-top-area">
                        <NCAffix>
                            <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                                <div>
                                    {/* <span>
                                    <NCBackBtn id='showReturn'
                                        onClick={this.onClickButton.bind(this, this.props, 'return')}></NCBackBtn>
                                    </span>
                                </div>
                                <div className='header-title-search-area' fieldid = {this.state.json['10100COSTR-000052']+'_title'}>
                                    {createPageIcon()}
                                    <h2
                                        style={{fontWeight:'bolder'}}
                                        className="title-search-detail"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000052']
                                        /* 国际化处理： 成本域
                                    }</h2> */}
                                    {createBillHeadInfo({
                                        title: this.state.json['10100COSTR-000052']/* 国际化处理： 成本域*/,
                                        initShowBackBtn: this.state.showReturn,
                                        backBtnClick: this.onClickButton.bind(this, this.props, 'return')
                                    })}
                                </div>
                                <div className="header-button-area">
                                    {
                                        createButtonApp({
                                            area: 'card-area',
                                            buttonLimit: 3,
                                            onButtonClick: this.onClickButton.bind(this),
                                            popContainer: document.querySelector('.card-area')
                                        })
                                    }
                                    {/* <NCRefreshBtn
                                        id='refreshCard'
                                        className='u-button'
                                        onClick={this.cardRefresh.bind(this)
                                        }>
                                    </NCRefreshBtn> */}
                                    <div id='cardPagination'>
                                        {createCardPagination({
                                            handlePageInfoChange: this.pageInfoClick.bind(this),
                                            // dataSource: dataSource
                                        })
                                        }
                                    </div>
                                </div>
                            </NCDiv>
                        </NCAffix>
                        <div className="nc-bill-form-area nc-btn-list nc-bill-form-area-white">
                            {createForm('costregionForm', {
                                onAfterEvent: this.afterEvent.bind(this),
                                cancelPSwitch: true
                                // onBeforeEvent: this.beforeFormEvent.bind(this)
                            }
                            )}
                        </div>
                    </div>
                    <div className="nc-bill-bottom-area" style={{ marginTop: 6, background: '#f6f6f6' }}>
                        <div className="nc-bill-tableTab-area">
                            {createCardTable("relstockorgs",
                                {
                                    onAfterEvent: this.onRefAfterEdit.bind(this),
                                    onBeforeEvent: this.filterStock.bind(this),
                                    tableHead: this.getOrgTableHead.bind(this),
                                    selectedChange: this.showDelLine.bind(this),
                                    isAddRow: true,
                                    showCheck: true,
                                    showIndex: true
                                }
                            )}
                        </div>
                        <div className="nc-bill-tableTab-area">
                            {createCardTable("relstockstorages",
                                {
                                    onBeforeEvent: this.filterStock.bind(this),
                                    onAfterEvent: this.onRefAfterEdit.bind(this),
                                    tableHead: this.getOrageTableHead.bind(this),
                                    selectedChange: this.showDelLine.bind(this),
                                    isAddRow: true,
                                    showCheck: true,
                                    showIndex: true
                                }
                            )}
                        </div>
                    </div>
                </div>
            );
        };
        var drawList = () => {
            return (

                < div className="nc-bill-list" id={'browse'} style={{ position: 'relative' }}>
                    {/* 头部 header */}
                    <div>
                        < NCAffix>
                            < NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
                                {/* 标题 title */}
                                < div className="header-title-search-area" >
                                    {/* {createPageIcon()} */}
                                    {/* < h2
                                        className="title-search-detail"> {this.state.json === undefined ? "" : this.state.json['10100COSTR-000052']/* 国际化处理： 成本域}</h2> */}
                                    {/* 显示停用  showOff*/}
                                    {createBillHeadInfo({
                                        title: this.state.json['10100COSTR-000052']/* 国际化处理： 成本域*/,
                                        initShowBackBtn: false
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
                                onRowDoubleClick: this.onRowDoubleClick.bind(this),
                                selectedChange: this.selectedChange.bind(this),
                                showCheck: true,
                                showIndex: true,
                                showPagination: true,
                                cancelPSwitch: true,
                                adaptionHeight: true
                            })
                        }
                    </div>
                </div>);
        };
        return (
            < div>
                {
                    !this.state.borowseMode ? drawCard() : drawList()
                }

                {
                    createModal('stepModal', {
                        // title: this.state.modelTitle || '请选择财务组织',										//标题
                        content: this.getSteps.call(this),							//内容
                        noFooter: false,
                        className: 'batch-add',
                        cancelBtnClick: this.cancelModalEve.bind(this),
                        closeModalEve: this.closeModalEve.bind(this), //关闭按钮事件回调
                        userControl: true,
                        showCustomBtns: true,
                        closeByClickBackDrop: false,
                        customBtns: < div>
                            {
                                createButtonApp({
                                    area: 'steps_area',
                                    buttonLimit: 4,
                                    onButtonClick: this.onClickButton.bind(this),
                                    popContainer:
                                        document.querySelector('.steps-action')

                                })
                            }
                        </div>
                    })
                }
                <PrintOutput ref='printOutput' url={ajaxurl.print}
                    data={
                        {
                            funcode: '10100COSTR',
                            oids: this.state.pks,
                            outputType: 'output',
                            nodekey: this.state.nodekey
                        }
                    }
                >

                </PrintOutput>

            </div>
        )
    }
}


CostregionEditTable = createPage({

    billinfo: [
        {
            billtype: 'grid',
            pagecode: '10100COSTR_costregion',
            bodycode: 'costregion'
        }, {
            billtype: 'form',
            pagecode: '10100COSTR_costregion',
            headcode: 'costregionForm'
        },
        {
            billtype: 'grid',
            pagecode: '10100COSTR_costregion',
            bodycode: 'relstockorgs'
        },
        {
            billtype: 'grid',
            pagecode: '10100COSTR_costregion',
            bodycode: 'relstockstorages'
        }
    ],
    initTemplate: (props) => {
    }


})(CostregionEditTable);
export {
    CostregionEditTable
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65