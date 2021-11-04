//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, high, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
import deepClone from '../../../public/utils/deepClone';
import './index.less';

import groupTreeRef from '../../../../uap/refer/riart/groupTreeRef';
import BusinessUnitTreeRef from '../../../../uapbd/refer/org/BusinessUnitTreeRef';

const { NCDiv, NCButton } = base;

const URLS = {
    FactorChartInitAction: '/nccloud/uapbd/factor/FactorChartInitAction.do',
    FactorChartQueryAction: '/nccloud/uapbd/factor/FactorChartQueryAction.do',
    FactorChartAddAction: '/nccloud/uapbd/factor/FactorChartAddAction.do',
    FactorChartEditEveAction: '/nccloud/uapbd/factor/FactorChartEditEveAction.do',
    FactorChartSaveAction: '/nccloud/uapbd/factor/FactorChartSaveAction.do',
    FactorChartDelAction: '/nccloud/uapbd/factor/FactorChartDelAction.do'
};
const AREACODES = { factorchart: 'factorchart', facctrlgroup: 'facctrlgroup', facctrlorg: 'facctrlorg' };//要素表  可细化集团  可细化组织
const treeId = 'factorchartTree';
const EMPTY_FN = function () { };

/**
 * 要素表 全局、集团、组织
 */
class FactorChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editStatus: false,     //是否编辑态
            buttonDis: false,      //是否可点击
            json: {},             //多语json
            unitTreeRef: {        //参照-业务单元
                value: undefined,
                fieldid: 'refunitTree',
                queryCondition: () => {
                    return {
                        AppCode: this.props.config.appcode,
                        TreeRefActionExt: 'nccloud.web.uapbd.factor.util.BusinessUnitTreeRefExt'
                    };
                },
                onChange: (val) => {
                    let { leftTree, rightCard, unitTreeRef } = this.state;
                    unitTreeRef.value = val;
                    rightCard.data = undefined;
                    this.setState(this.state, () => {
                        this.loadLeftTree(() => {
                            this.loadRightCardData((data) => {
                                this.fillRightCardData(data, () => {
                                    this.updateBtnStatus();
                                });
                            });
                        });
                    });
                }
            },
            leftTree: {},
            rightCard: {}
        };
        //自定义根节点
        this.root = {
        };
        this.initstate();
    }

    initstate() {
        this.state.json = this.props.json;
        this.root = {
            isleaf: false,
            key: '~',
            title: this.state.json['10140ETB-000105'],//'要素表'
            id: '~',
            innercode: '~',
            pid: '',
            refname: this.state.json['10140ETB-000105'],//'要素表'
            refpk: '~'
        };
        let leftTree = {
            treeAttr: {
                treeId: treeId,
                needEdit: true, //不启用编辑
                showLine: true, //显示连线
                needSearch: false, //是否需要搜索框
                showModal: false,
                defaultExpandedKeys:['~'],
                expandedKeys:['~'],
                onSelectEve: (refpk) => { //选择
                    let { leftTree, rightCard } = this.state;
                    if (refpk == this.root.refpk) { //根节点处理
                        leftTree.curSelectedNode = undefined;
                        rightCard.reset();
                        this.setState(this.state, () => {
                            this.updateBtnStatus();
                        });
                        return;
                    }
                    leftTree.curSelectedNode = this.props.syncTree.getSelectNode(treeId);
                    this.setState(this.state, () => {
                        this.loadRightCardData((data) => {
                            this.fillRightCardData(data, () => {
                                this.updateBtnStatus();
                            });
                        });
                    });
                },
                clickAddIconEve: (selectNode) => { ////新增点击 回调
                    let { config } = this.props;
                    let { unitTreeRef } = this.state;
                    let pk_org = unitTreeRef.value ? unitTreeRef.value.refpk : '';
                    if (config.appcode === '10140ETO' && !pk_org) {
                        toast({ color: 'warning', title: this.state.json['10140ETB-000028'], content: this.state.json['10140ETB-000106'] });//'提示'  '请先设置业务单元'
                        return;
                    }
                    let requestParam = {
                        appCode: config.appcode,
                        pageCode: config.pageCode,
                        pk_org: pk_org,
                        pid: selectNode ? selectNode.refpk : this.root.refpk
                    };
                    ajax({
                        url: URLS.FactorChartAddAction,
                        data: requestParam,
                        success: (result) => {
                            let { success, data } = result;
                            if (!success) return;
                            let { leftTree, rightCard } = this.state;
                            rightCard.reset();
                            leftTree.setStatus('add');
                            rightCard.setStatus('add', () => {
                                //去掉空属性最后赋值
                                Utils.filterEmptyData(data.factorchart[AREACODES.factorchart].rows[0].values);
                                rightCard.setData(data);
                                this.setState(this.state, () => {
                                    this.state.rightCard.factorchartform.itemSettings();
                                    this.updateBtnStatus();
                                });
                            });
                        }
                    })
                },
                clickEditIconEve: (selectedTreeNode) => { //编辑点击 回调
                    this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
                    let { leftTree, rightCard } = this.state;
                    leftTree.curSelectedNode = selectedTreeNode;
                    rightCard.reset();
                    leftTree.setStatus('edit');
                    rightCard.setStatus('edit', () => {
                        this.setState(this.state, () => {
                            this.loadRightCardData((data) => {
                                this.fillRightCardData(data, () => {
                                    this.state.rightCard.factorchartform.itemSettings();
                                    this.updateBtnStatus();
                                    let isorgctrl = this.props.form.getFormItemsValue(AREACODES.factorchart, 'isorgctrl');
                                    //设定增行删行按钮
                                    if (isorgctrl && isorgctrl.value) {
                                        rightCard.facctrlorg.editStatus = isorgctrl.value ? false : true;
                                        rightCard.facctrlorg.buttonDis = isorgctrl.value ? false : true;
                                        rightCard.facctrlorg.reset();
                                        this.props.button.setButtonDisabled({ delline_org_btn: !rightCard.facctrlorg.buttonDis, delline_org: !rightCard.facctrlorg.buttonDis});
                                    }
                                });
                            });
                        });
                    });
                },
                clickDelIconEve: (selectedTreeNode) => { // 删除点击 回调
                    promptBox({
                        color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.state.json['10140ETB-000008'],//'确认删除'
                        content: this.state.json['10140ETB-000010'],//'您确定要删除所选数据吗?'
                        beSureBtnClick: () => {
                            ajax({
                                url: URLS.FactorChartDelAction,
                                data: { pk_factorchart: selectedTreeNode.refpk, ts: selectedTreeNode.nodeData.ts },
                                success: (result) => {
                                    let { success, data } = result;
                                    if (!success) return;
                                    //将当前树节点从选中当前节点中移除
                                    // this.state.leftTree.curSelectedNode = null;
                                    this.refresh(() => { toast({ color: 'success', title: this.state.json['10140ETB-000031'] }); });//'删除成功！'
                                }
                            })
                        }
                    });
                },
                onMouseEnterEve: (key, node) => { // 鼠标进入树节点事件
                    let { config, syncTree } = this.props;
                    let pk_org = this.state.unitTreeRef.value ? this.state.unitTreeRef.value.refpk : '';
                    let appcode = config.appcode;//if(config.appcode==='10140ETO') return '';
                    let obj = {};
                    if ((key != '~' && appcode === '10140ETB' && node.nodeData['isGlb'])
                        || (key != '~' && appcode === '10140ETG' && node.nodeData['isGrp'] && node.nodeData['fcvo'].pk_group != 'GLOBLE00000000000000')
                        || (key != '~' && appcode === '10140ETO' && node.nodeData['fcvo'].pk_org == pk_org)) {
                        obj = { delIcon: true, editIcon: true, addIcon: true };
                    } else {
                        obj = { delIcon: false, editIcon: false, addIcon: true };
                    }
                    syncTree.hideIcon(treeId, key, obj);
                },
            },
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            addSelNodeId: {},      //新增时选中的树节点
            setStatus: (status) => {
                this.props.syncTree.setNodeDisable(treeId, status != 'browse' ? true : false);
            }
        };

        let rightCard = {
            data: undefined,
            factorchartform: {//要素表表单
                formAttr: {
                    expandArr: ['audit'],//审计信息区域
                    onBeforeEvent: (props, moduleId, key, value, data) => {
                        //props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值)
                        let values = props.form.getFormItemsValue(AREACODES.factorchart, ['pk_factorsystem']);
                        let { unitTreeRef } = this.state;
                        let pk_org = unitTreeRef.value ? unitTreeRef.value.refpk : '';
                        switch (key) {
                            case 'pk_fatherchart':
                                let meta = props.meta.getMeta();
                                let pk_fatherchart = meta[AREACODES.factorchart].items.find((item) => item.attrcode == 'pk_fatherchart');
                                if (!pk_fatherchart.queryCondition || pk_fatherchart.queryCondition.pk_elementsystem != values[0].value) {
                                    pk_fatherchart.queryCondition = {
                                        AppCode: props.config.appcode,
                                        pkOrg: pk_org,
                                        pk_elementsystem: values[0].value,
                                        canbenotend: true,
                                        TreeRefActionExt: 'nccloud.web.uapbd.factor.util.FactorChartTreeRefExtForFc'
                                    };
                                    props.meta.setMeta(meta);
                                }
                                break;
                            default:
                                break;
                        }
                        return true;
                    },
                    onAfterEvent: (props, moduleId, key, value, oldValue) => {
                        let { leftTree, rightCard } = this.state;
                        let { form, cardTable, config } = props;
                        switch (key) {
                            case 'pk_factorsystem':
                                //要素体系编辑后,将上级要素表置空,否则可能会造成上级要素表的要素体系和当前所选要素体系不一致
                                form.setFormItemsValue(AREACODES.factorchart, { 'pk_fatherchart': { display: '', value: '' } });
                                break;
                            case 'ispolicychart':
                                if (value.value) {
                                    config.appcode == '10140ETB' && form.setFormItemsDisabled(AREACODES.factorchart, { 'pk_policy': false });
                                    if (config.appcode == '10140ETG') {
                                        let businessInfo = getBusinessInfo();
                                        form.setFormItemsValue(AREACODES.factorchart, { 'pk_policy': { display: businessInfo.groupName, value: businessInfo.groupId } });
                                    }
                                } else {
                                    form.setFormItemsDisabled(AREACODES.factorchart, { 'pk_policy': true });
                                    form.setFormItemsValue(AREACODES.factorchart, { 'pk_policy': { display: '', value: '' } });
                                }
                                break;
                            case 'isorgctrl':
                                rightCard.facctrlorg.editStatus = value.value ? false : true;
                                rightCard.facctrlorg.buttonDis = value.value ? false : true;
                                rightCard.facctrlorg.reset();
                                this.props.button.setButtonDisabled({ delline_org_btn: !rightCard.facctrlorg.buttonDis, delline_org: !rightCard.facctrlorg.buttonDis});
                                break;
                            default:
                                break;
                        }
                    }
                },
                itemSettings: () => {//根据form数据设置关联属性的可编辑性、是否必输等
                    let { form, config, meta } = this.props;
                    let obj = form.getFormItemsValue(AREACODES.factorchart, ['ispolicychart', 'pk_factorchart']);
                    let ispolicychart = obj[0].value;//政策性要素表
                    let pk_factorchart = obj[1].value;//主键
                    if (config.appcode == '10140ETB') {
                        form.setFormItemsVisible(AREACODES.factorchart, { 'isorgctrl': false });
                        form.setFormItemsDisabled(AREACODES.factorchart, { 'pk_policy': (ispolicychart ? false : true) });
                    } else if (config.appcode == '10140ETG') {
                        form.setFormItemsDisabled(AREACODES.factorchart, { 'pk_policy': true });
                    } else {
                        form.setFormItemsVisible(AREACODES.factorchart, { 'isorgctrl': false, 'ispolicychart': false, 'pk_policy': false });
                    }
                    form.setFormItemsDisabled(AREACODES.factorchart, { 'pk_factorsystem': (pk_factorchart ? true : false), pk_fatherchart: (pk_factorchart ? true : false) });
                    // let me = meta.getMeta();
                    // let pk_fatherchart = me[AREACODES.factorchart].items.find((item) => item.attrcode == 'pk_fatherchart');
                    // pk_fatherchart.required = pk_factorchart ? false : true;
                    // meta.setMeta(me);
                },
                reset: () => {
                    this.props.form.EmptyAllFormValue(AREACODES.factorchart);
                }
            },
            groupTreeRef: {//集团参照
                value: undefined,
                isMultiSelectedEnabled: true,
                fieldid: 'refgrouptree',
                onChange: (val) => {
                    let { groupTreeRef, facctrlgroup } = this.state.rightCard;
                    if (val && val.length > 0) {
                        groupTreeRef.value = val;
                        this.setState(this.state, () => { facctrlgroup.addline() });
                    }
                }
            },
            facctrlgroup: {//可细化集团
                tableAttr: {
                    onRowClick: (props, moduleId, record, index, e) => { },
                    showIndex: true,
                    hideSwitch: false
                },
                addline: () => {
                    let { groupTreeRef } = this.state.rightCard;
                    let facctrlgroupdata = this.props.cardTable.getAllData(AREACODES.facctrlgroup);
                    let groupSet = new Set();
                    facctrlgroupdata && facctrlgroupdata.rows.length > 0 && facctrlgroupdata.rows.forEach(dat => { dat.status != '3' && groupSet.add(dat.values.ctrlgroup.value); });
                    let rows = (facctrlgroupdata && facctrlgroupdata.rows.length > 0) ? deepClone(facctrlgroupdata.rows) : [];
                    groupTreeRef.value.forEach(data => {
                        let len = groupSet.size;
                        groupSet.add(data.refpk);
                        groupSet.size > len && rows.push({ values: { ['ctrlgroup.code']: { value: data.refcode }, ['ctrlgroup.name']: { value: data.refname }, ctrlgroup: { value: data.refpk }, status: { value: 2 } } });
                    });
                    this.props.cardTable.setTableData(AREACODES.facctrlgroup, { rows: rows });
                    //新增后需清空参照内容，否则删除后再新增无效
                    groupTreeRef.value = undefined;
                    this.setState(this.state);
                },
                delline: () => {
                    let { cardTable } = this.props;
                    let selines = cardTable.getCheckedRows(AREACODES.facctrlgroup);
                    let delIndexs = [];
                    selines && selines.forEach(linedata => delIndexs.push(linedata.index));
                    delIndexs.length > 0 && cardTable.delRowsByIndex(AREACODES.facctrlgroup, delIndexs);
                },
                reset: () => {
                    let { cardTable, config } = this.props;
                    // config.appcode == '10140ETB' && cardTable.setTableData(AREACODES.facctrlgroup, { rows: [] });
                    //删除所有已选
                    if (config.appcode == '10140ETB') {
                        cardTable.selectAllRows(AREACODES.facctrlorg, true);
                        let selines = cardTable.getCheckedRows(AREACODES.facctrlgroup);
                        let delIndexs = [];
                        selines && selines.forEach(linedata => delIndexs.push(linedata.index));
                        delIndexs.length > 0 && cardTable.delRowsByIndex(AREACODES.facctrlgroup, delIndexs);
                        cardTable.selectAllRows(AREACODES.facctrlorg, false);
                    }
                }
            },
            businessUnitTreeRef: {//组织参照
                value: undefined,
                isMultiSelectedEnabled: true,
                onChange: (val) => {
                    let { businessUnitTreeRef, facctrlorg } = this.state.rightCard;
                    if (val && val.length > 0) {
                        businessUnitTreeRef.value = val;
                        this.setState(this.state, () => { facctrlorg.addline() });
                    }
                }
            },
            facctrlorg: {//可细化组织
                editStatus: undefined,//控制表头按钮显示与隐藏  isorgctrl 允许被组织细化 Y-清空表格
                buttonDis: undefined,//控制表头按钮是否可编辑  isorgctrl 允许被组织细化 Y-清空表格
                tableAttr: {
                    onRowClick: (props, moduleId, record, index, e) => { },
                    showIndex: true,
                    hideSwitch: false
                },
                addline: () => {
                    let { businessUnitTreeRef } = this.state.rightCard;
                    let facctrlorgdata = this.props.cardTable.getAllData(AREACODES.facctrlorg);
                    let orgSet = new Set();
                    facctrlorgdata && facctrlorgdata.rows.length > 0 && facctrlorgdata.rows.forEach(dat => { dat.status != '3' && orgSet.add(dat.values.pk_org.value); });
                    let rows = (facctrlorgdata && facctrlorgdata.rows.length > 0) ? deepClone(facctrlorgdata.rows) : [];
                    businessUnitTreeRef.value.forEach(data => {
                        let len = orgSet.size;
                        orgSet.add(data.refpk);
                        orgSet.size > len && rows.push({ values: { ['pk_org.code']: { value: data.refcode }, ['pk_org.name']: { value: data.refname }, pk_org: { display: data.refname, value: data.refpk }, status: { value: 2 } } });
                    });
                    this.props.cardTable.setTableData(AREACODES.facctrlorg, { rows: rows });
                    //新增后需清空参照内容，否则删除后再新增无效
                    businessUnitTreeRef.value = undefined;
                    this.setState(this.state);
                },
                delline: () => {
                    let { cardTable } = this.props;
                    let selines = cardTable.getCheckedRows(AREACODES.facctrlorg);
                    let delIndexs = [];
                    selines && selines.forEach(linedata => delIndexs.push(linedata.index));
                    delIndexs.length > 0 && cardTable.delRowsByIndex(AREACODES.facctrlorg, delIndexs);
                },
                reset: () => {
                    let { cardTable, config } = this.props;
                    //  && cardTable.setTableData(AREACODES.facctrlorg, {rows: []});
                    if (config.appcode == '10140ETG') {
                        //删除所有已选
                        let { cardTable } = this.props;
                        cardTable.selectAllRows(AREACODES.facctrlorg, true);
                        let selines = cardTable.getCheckedRows(AREACODES.facctrlorg);
                        let delIndexs = [];
                        selines && selines.forEach(linedata => delIndexs.push(linedata.index));
                        delIndexs.length > 0 && cardTable.delRowsByIndex(AREACODES.facctrlorg, delIndexs);
                        cardTable.selectAllRows(AREACODES.facctrlorg, false);
                    }
                }
            },
            setData: (data = {}) => {
                let dataCopy = deepClone(data);
                let { form, cardTable, config } = this.props;
                let { factorchart, facctrlgroup, facctrlorg } = dataCopy;
                //要素表 表头
                let formdata = factorchart ? factorchart[AREACODES.factorchart] : undefined;
                formdata && form.setAllFormValue({ [AREACODES.factorchart]: formdata ? formdata : { rows: [] } });
                //可细化集团
                let facctrlgroupData = facctrlgroup ? facctrlgroup[AREACODES.facctrlgroup] : undefined;
                config.appcode == '10140ETB' && cardTable.setTableData(AREACODES.facctrlgroup, facctrlgroupData ? facctrlgroupData : { rows: [] });
                //可细化组织
                let facctrlorgData = facctrlorg ? facctrlorg[AREACODES.facctrlorg] : undefined;
                config.appcode == '10140ETG' && cardTable.setTableData(AREACODES.facctrlorg, facctrlorgData ? facctrlorgData : { rows: [] });
                //审计信息
                formdata && form.setAllFormValue({ ['audit']: formdata ? formdata : { rows: [] } });
            },
            setStatus: (status, callback = EMPTY_FN) => {
                let { form, cardTable, config } = this.props;
                form.setFormStatus(AREACODES.factorchart, status);
                config.appcode == '10140ETB' && cardTable.setStatus(AREACODES.facctrlgroup, status == 'browse' ? status : 'edit', EMPTY_FN);
                config.appcode == '10140ETG' && cardTable.setStatus(AREACODES.facctrlorg, status == 'browse' ? status : 'edit', EMPTY_FN);
                this.state.editStatus = status == 'browse' ? false : true;
                this.state.rightCard.facctrlorg.editStatus = status == 'browse' ? false : true;
                callback();
            },
            reset: () => {
                let { factorchartform, facctrlgroup, facctrlorg } = this.state.rightCard;
                factorchartform.reset();
                facctrlgroup.reset();
                facctrlorg.reset();
            }
        };
        this.props.button.setButtonDisabled({ delline_org_btn: true, delline_org: true});
        this.state.leftTree = leftTree;
        this.state.rightCard = rightCard;
        this.setState({
            ...this.state,
            leftTree: leftTree,
            rightCard: rightCard
        });


    }

    componentDidMount() {
        this.loadLeftTree(() => {
            this.updateBtnStatus();
        });
    }

    onButtonClick(props, id) {
        switch (id) {
            case 'refreshfc':
                this.refresh(() => { toast({ color: 'success', title: this.state.json['10140ETB-000017'] }); });//'刷新成功！'
                break;
            case 'savefc':
                this.save((data) => {
                    this.saveAfterEve(data, () => {
                        this.refresh(() => { toast({ color: 'success', title: this.state.json['10140ETB-000018'] }); });//'保存成功！'
                    });
                });
                break;
            case 'cancelfc':
                this.cancel();
                break;
            case 'delline_org_btn':
            case 'delline_org':
                this.state.rightCard.facctrlorg.delline();
                break;
            case 'addline_group_btn':
            case 'delline_group':
                this.state.rightCard.facctrlgroup.delline();
                break;
            default:
                break;
        }
    }

    refresh(callback = EMPTY_FN) {
        this.loadLeftTree(() => {
            this.loadRightCardData((data) => {
                this.fillRightCardData(data, () => {
                    callback();
                    this.updateBtnStatus();
                });
            });
        });
    }

    save(callback = EMPTY_FN) {
        let { form, cardTable, config } = this.props;
        let { rightCard } = this.state;
        if (!form.isCheckNow(AREACODES.factorchart)) return;

        let factorchartData = form.getAllFormValue(AREACODES.factorchart);
        let facctrlgroupData = config.appcode === '10140ETB' ? cardTable.getAllData(AREACODES.facctrlgroup) : { rows: [] };
        let facctrlorgData = config.appcode === '10140ETG' ? cardTable.getAllData(AREACODES.facctrlorg) : { rows: [] };
        let dataParam = {
            formData: {
                'pageid': config.pageCode,
                'model': { 'rows': factorchartData.rows }
            },
            groupcardmodel: {
                'pageinfo': null,
                'rows': facctrlgroupData.rows
            },
            orgcardmodel: {
                'pageinfo': null,
                'rows': facctrlorgData.rows
            },
            exdata: {
                pageCode: config.pageCode,
                appCode: config.appcode,
                pk_policy: config.appcode != '10140ETO' ? form.getFormItemsValue(AREACODES.factorchart, 'pk_policy').value : ''
            }
        };
        let saveajax = () => {
            if(dataParam && dataParam.formData && dataParam.formData.model.rows[0].values.ispolicychart && dataParam.formData.model.rows[0].values.ispolicychart.value){
                if(dataParam.formData.model.rows[0].values.pk_policy && dataParam.formData.model.rows[0].values.pk_policy.value&& dataParam.formData.model.rows[0].values.pk_policy.value.length>0 ){

                }else{
                    toast({ color: 'warning', title:this.state.json['10140ETB-000117'] });// '关联的集团不能为空'
                    return;
                }
            }
            ajax({
                url: URLS.FactorChartSaveAction,
                data: dataParam,
                success: (res) => {
                    let { success, data } = res;
                    if (!success) return;
                    callback(data);
                }
            });
        };
        let validateParams = { 'model': factorchartData, "pageid": config.pageCode };
        let cardTableAreacode = config.appcode == '10140ETB' ? AREACODES.facctrlgroup : config.appcode == '10140ETG' ? AREACODES.facctrlorg : '';
        this.props.validateToSave(validateParams, () => {
            config.appcode == '10140ETO' && saveajax();
            config.appcode != '10140ETO' && this.props.validateToSave(this.props.createMasterChildData(config.pageCode, AREACODES.factorchart, cardTableAreacode),
                () => { saveajax(); },
                { [cardTableAreacode]: 'cardTable', }, 'card');
        }, { [AREACODES.factorchart]: 'form' }, 'form');
    }

    saveAfterEve(data, callback = EMPTY_FN) {
        let { leftTree, rightCard } = this.state;
        leftTree.setStatus('browse');
        rightCard.setStatus('browse');
        leftTree.curSelectedNode = { refpk: data.chartvo.pk_factorchart };
        this.setState(this.state, () => { callback(); });
    }

    cancel() {
        promptBox({
            color: 'warning',   // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140ETB-000020'],//]'确认取消'
            content: this.state.json['10140ETB-000021'],//'是否确定要取消？'
            beSureBtnClick: () => {
                let { leftTree, rightCard } = this.state;
                rightCard.setStatus('browse');
                leftTree.setStatus('browse');
                this.setState(this.state, () => {
                    this.fillRightCardData(rightCard.data, () => {
                        this.updateBtnStatus();//更新按钮状态
                    });
                });
            }
        });
    }

    loadLeftTree(callback = EMPTY_FN) {
        ajax({
            url: URLS.FactorChartInitAction,
            data: { appcode: this.props.config.appcode, pk_org: this.state.unitTreeRef.value ? this.state.unitTreeRef.value.refpk : '' },
            success: (result) => {
                let { success, data } = result;
                if (!success) return;
                let treedata = [Object.assign({ ...this.root }, { children: data.treenode })];
                //同步树  加载全部数据
                this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(treedata));

                let { curSelectedNode } = this.state.leftTree;
                if (!curSelectedNode || !curSelectedNode.refpk) {
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                } else {
                    //当前是否有选中节点,若有则选择当前节点
                    this.props.syncTree.setNodeSelected(treeId, curSelectedNode.refpk);
                    //当前选中节点是否被删除，若被删除则需清空
                    let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
                    this.state.leftTree.curSelectedNode = selectedTreeNode ? selectedTreeNode : undefined;
                    if( !selectedTreeNode){
                        let { rightCard } = this.state;
                        rightCard.data = {};
                    }
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                    this.props.syncTree.openNodeByPk(treeId, selectedTreeNode ? selectedTreeNode.pid : this.root.refpk);
                }
                this.setState(this.state, () => {
                    callback();
                });
            }
        });
    }

    dealTreeData(data) {
        let loopTreeData = (node) => {
            if (!node.children || node.children.length == 0) {
                delete node.children;
            } else {
                node.isLeaf = false;
                node.children.forEach(e => { loopTreeData(e); });
            }
        };
        data.forEach((e) => {
            e.iconBox = { editIcon: false, addIcon: false, delIcon: false };
            loopTreeData(e);
        });
        return data;
    };

    loadRightCardData(callback = EMPTY_FN) {
        let { curSelectedNode } = this.state.leftTree;
        if (!curSelectedNode || !curSelectedNode.refpk) { callback(); return; }
        ajax({
            url: URLS.FactorChartQueryAction,
            data: {
                pk_factorchart: curSelectedNode.refpk,
                appcode: this.props.config.appcode
            },
            success: (result) => {
                let { success, data } = result;
                if (!success) return;
                this.dealDisplayFm(result);
                this.state.rightCard.data = data;
                this.setState(this.state, () => {
                    callback(data);
                });
            }
        });
    }

    /** 处理显示公式 */
    dealDisplayFm(result) {
        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
            let { appcode } = this.props;
            let obj = appcode == '10140ETO' ? { [AREACODES.factorchart]: "form" }
                : appcode == '10140ETB' ? { [AREACODES.factorchart]: "form", [AREACODES.facctrlgroup]: 'cardTable' }
                    : { [AREACODES.factorchart]: "form", [AREACODES.facctrlorg]: 'cardTable' };
            this.props.dealFormulamsg(result.formulamsg, obj);
        }
    }

    fillRightCardData(data = {}, callback = EMPTY_FN) {
        let { leftTree, rightCard } = this.state;
        rightCard.reset();
        rightCard.setData(data);
        this.setState(this.state, () => { callback(); });
    }

    updateBtnStatus() {
        let { editStatus } = this.state;
        this.props.button.setButtonsVisible({ 'savefc': editStatus, 'cancelfc': editStatus, 'refreshfc': !editStatus });
        this.props.button.setButtonDisabled({ delline_org_btn: !editStatus,delline_org: !editStatus,addline_group_btn: !editStatus ,delline_group: !editStatus});
    }

    render() {
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const { asyncTree, syncTree, form, button, modal, search, DragWidthCom, cardTable, config } = this.props;
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个
        const { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;  //模态框

        let { editStatus, buttonDis, unitTreeRef, leftTree, rightCard } = this.state;

        //画列表参照区域
        let renderRef = () => {
            return (
                <div classname="header-search-def" style={{ display: 'flex' }}>
                    <div className="search-box" style={{ width: 140, position: 'relative' }}>
                        <span style={{ color: 'red', position: 'absolute', left: 3, top: 8, zIndex: 1 }}>{unitTreeRef.value && unitTreeRef.value.refpk ? '' : '*'}</span>
                        {BusinessUnitTreeRef(Object.assign({ disabled: editStatus }, unitTreeRef))}
                    </div>
                </div>);
        };
        let leftDom = () => {
            return <div className="tree-area factoryline"> {createSyncTree(Object.assign({}, leftTree.treeAttr))} </div>;
        };
        let rightDom = () => {
            //子表
            let cardtable = () => {
                if (config.appcode === '10140ETO') return '';
                //可细化集团表头按钮
                let rederFacctrlgroupHead = () => {
                    if (!editStatus) {
                        return (
                            <div className="shoulder-definition-area factorSpeBtn">
                                {/* <div className="definition-icons"> */}
                                    {groupTreeRef(Object.assign({ clickContainer: <NCButton disabled={!buttonDis} fieldid="addline_group">{this.state.json['10140ETB-000054']}</NCButton> }, rightCard.groupTreeRef))}{/**增行 */}
                                    {createButtonApp({ area: 'facctrlgroup-area', onButtonClick: this.onButtonClick.bind(this) })}
                                {/* </div> */}
                            </div>
                        );
                    }
                    return (
                        <div className="shoulder-definition-area factorSpeBtn">
                            {/* <div className="definition-icons"> */}
                                {groupTreeRef(Object.assign({ clickContainer: <NCButton disabled={buttonDis} fieldid="addline_group">{this.state.json['10140ETB-000054']}</NCButton> }, rightCard.groupTreeRef))}{/**增行 */}
                                {createButtonApp({ area: 'facctrlgroup-area', onButtonClick: this.onButtonClick.bind(this) })}
                            {/* </div> */}
                        </div>
                    );
                };
                //可细化组织表头按钮
                let rederFacctrlorgHead = () => {
                    if (!editStatus || !rightCard.facctrlorg.editStatus) {
                        return (
                            <div className="shoulder-definition-area  factorSpeBtn">
                                {/* <div className="definition-icons"> */}
                                    {BusinessUnitTreeRef(Object.assign({ clickContainer: <NCButton disabled={!buttonDis} fieldid="addline_org">{this.state.json['10140ETB-000054']}</NCButton> }, rightCard.businessUnitTreeRef))}
                                    {createButtonApp({ area: 'facctrlorg-area', onButtonClick: this.onButtonClick.bind(this) })}
                                {/* </div> */}
                            </div>
                        );
                    }
                    return (
                        <div className="shoulder-definition-area  factorSpeBtn">
                            {/* <div className="definition-icons"> */}
                                {BusinessUnitTreeRef(Object.assign({ clickContainer: <NCButton disabled={buttonDis} fieldid="addline_org">{this.state.json['10140ETB-000054']}</NCButton> }, rightCard.businessUnitTreeRef))}
                                {createButtonApp({ area: 'facctrlorg-area', onButtonClick: this.onButtonClick.bind(this) })}
                            {/* </div> */}
                        </div>
                    );
                };
                return (
                    <div className="nc-bill-table-area">
                        {config.appcode === '10140ETB' && createCardTable(AREACODES.facctrlgroup, Object.assign({ tableHead: rederFacctrlgroupHead.bind(this), showCheck: editStatus }, rightCard.facctrlgroup.tableAttr))}
                        {config.appcode === '10140ETG' && createCardTable(AREACODES.facctrlorg, Object.assign({ tableHead: rederFacctrlorgHead.bind(this), showCheck: editStatus }, rightCard.facctrlorg.tableAttr))}
                    </div>);
            };
            return (
                <div>
                    <div className="card-area"> {createForm(AREACODES.factorchart, Object.assign({}, rightCard.factorchartform.formAttr))} </div>
                    {cardtable()}
                </div>
            );
        };

        return (
            <div className="factorchart nc-bill-tree-card">
                {/* 头部 header*/}
                <NCDiv className="header" AREACODES={NCDiv.config.HEADER}> {config.appcode === '10140ETO' ? renderRef() : ''} <div className=" btn-group"> {createButtonApp({ area: 'factorchart-area', buttonLimit: 3, onButtonClick: this.onButtonClick.bind(this) })} </div> </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card"> <DragWidthCom leftDom={leftDom()} rightDom={rightDom()} defLeftWid='25%' /> </div>
            </div>
        );
    }
}

export default FactorChart;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65