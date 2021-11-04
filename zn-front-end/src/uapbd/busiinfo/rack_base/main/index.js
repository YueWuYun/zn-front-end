//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
import StorDoc from '../../../refer/stordoc/StorDocDefaulteGridRef/index';//仓库
import StockOrg from '../../../refer/org/StockOrgGridRef/index';//库存组织
import ClassTree from '../components/ClassTree';
import deepClone from '../../../public/utils/deepClone';
const { NCDiv, EmptyAreaTip } = base;
const { ExcelImport } = high;

const { NCCheckbox, NCMessage: Message, NCModal, NCButton, NCRow, NCCol } = base;
const { Header, Body } = NCModal;
const { PrintOutput } = high;
import Utils from '../../../public/utils/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';

// 数组拓展删除 数组中 指定的项
Array.prototype.arrRemoveAppoint = function (item) {
    if (!this.includes(item)) {
        return;
    }
    let thatIndex = this.indexOf(item);
    return this.splice(thatIndex, 1);
}

/****************默认参数  开始***********************/
let formId = 'head';//卡片组件Id
let urls = {
    loadTreeDataUrl: "/nccloud/uapbd/rack/RackLoadTreeData.do",
    queryCardUrl: "/nccloud/uapbd/rack/RackLoadFormData.do",
    enablestateUrl: "/nccloud/uapbd/rack/RackEDableAction.do",
    addCardUrl: "/nccloud/uapbd/rack/RackAddAction.do",
    deleteUrl: '/nccloud/uapbd/rack/RackDeleteAction.do',
    saveUrl: '/nccloud/uapbd/rack/RackSaveAction.do',
    validateUrl: '/nccloud/uapbd/rack/RackManageModeAction.do',
    editUrl: '/nccloud/uapbd/rack/RackEditAction.do',
    cancelUrl: '/nccloud/uapbd/rack/RackCancel.do',
    printUrl: '/nccloud/uapbd/rack/RackPrint.do',
    quickDefineUrl: '/nccloud/uapbd/rack/RackQuickDefineAction.do',
    checkOrgUrl: '/nccloud/uapbd/rack/OrgCheckAction.do'//检查是否是库存组织
};
let pageCode = "10140RACK_card";//默认集团
/***************默认参数  结束********************/

/**
 * 客户基本分类
 */
class Rack_Base extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {

        super(props)

        //默认集团
        this.config = Object.assign({
            title: '',//this.state.json['10140RACK-000000'],/* 国际化处理： 货位*/
            treeId: "ClassTree",
            formId: "head",
            pageCode: "10140RACK_card",
            nodeType: 'ORG_NODE',
            refresh: 'uapbd/busiinfo/rack/main/index.html',
            primaryKey: 'pk_rack',
            urls: urls,
            actions: {
                TreeNodeAdd: 'TreeNodeAdd',
                TreeNodeEdit: 'TreeNodeEdit',
                TreeNodeDel: 'TreeNodeDel',
                Refresh: 'Refresh',
                Save: 'Save',
                Cancel: 'Cancel',
                SaveAdd: 'SaveAdd',
                print: 'Print',
                output: 'Output',
                QuickDef: 'QuickDef',//快速定义按钮；
                import: 'import',
                Export: 'export',
            },//表单所有动作
        }, props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key": "~",
            "title": '',
            "id": "~",
            "innercode": "~",
            "pid": "",
            "refname": '',
            "refpk": "~",
            "nodeData": { isLeaf: false },//增加一个属性用来标识是否时叶子节点；
        };

        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartClass = this.onStartClass.bind(this);
        this.onStopClass = this.onStopClass.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.setTreeStatus = this.setTreeStatus.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);
        this.checkHasChildren = this.checkHasChildren.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty: true,
            expandedKeys: ['~'],
            checked: false,//判断 显示停用按钮是否选中
            disabledShowOff: false,//禁用复选框
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            codeRule: undefined,//当前编码规则的占位符；//在查询左树的时候把这个值拿到；
            templateModified: false,//当组织改变的时候置为false，当第一次点开模态框时候，templateModified变为true;
            templateAttrArrays: undefined,//当组织改变的时候置为undefined,第一次打开模态框时，记录下所有的attrcode值；
            tree: {
                needEdit: true,
                showLine: false,
                needSearch: false,
                showModal: false,
            },
            disabledSearch: false,//搜索框是否禁用
            printPks: [],//默认为空数组，当点击打印按钮的时侯，对这个东西赋值
            oldParent: '',//原父节点
            isAdd: false,//新增标志  默认false
            refOrg: {
                value: undefined,
                fieldid: 'refOrg',
                onChange: (value) => {
                    this.state.refOrg.value = value;
                    this.state.refStordoc.value = undefined;
                    this.state.templateModified = false;
                    this.state.templateAttrArrays = undefined;
                    this.setState(this.state);
                },
                queryCondition: function () {
                    return {
                        AppCode: '10140RACK',
                        GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                    }
                }

            },
            refStordoc: {
                value: undefined,
                fieldid: 'refStordoc',
                isShowDisabledData: false,
                isShowUnit: false,
                isMultiSelectedEnabled: false,
                unitProps: undefined,
                onChange: this.onOrgChange.bind(this),

                queryCondition: () => {
                    return {
                        pk_org: this.state.refOrg.value.refpk,
                        GridRefActionExt: "nccloud.web.uapbd.rack.action.StordocRefExt",
                    }
                }

            },

            showModal: false,  //控制的是快速定义模态框；
            json: {},
            inlt: null,
        }
        this.initTemplate(this.props,
            () => {
                this.config.title = this.state.json['10140RACK-000000'];
                this.root.title = this.config.title;
                this.root.refname = this.config.title;
                this.initData.call(this);
                //修改按钮状态
                this.initButtonStatus();
            })

    }

    /**
     * 单据模板
     * @param props
     */
    initTemplate = (props, callback) => {
        /**
         * 页面初始设置button状态
         * @param props
         */
        createUIDom(props)(
            { pagecode: this.config.pageCode },//appid:config.appid},//,appcode:config.appcode},
            {
                moduleId: "10140RACK", domainName: 'uapbd'
            },
            (data, langData, inlt) => {
                if (langData) {
                    this.state.json = langData
                    if (inlt) {
                        this.state.inlt = inlt
                    }
                }
                if (data.template) {
                    this.setVolumeUnit(props, data.template);
                    //props.meta.setMeta(data.template);
                    //setFormEnableStateProp(props);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                    let excelimportconfig = excelImportconfig(props, 'uapbd', 'rack_org', true, '', { appcode: '10140RACK', pagecode: "10140RACK_card" }, () => { this.onRefreshClass() });
                    props.button.setUploadConfig("import", excelimportconfig);
                    //this.initButtonStatus(props);
                }
                let ccontext = data.context || {};
                if (ccontext.pk_org) {
                    this.state.refOrg.value = {};
                    ajax({
                        url: urls.checkOrgUrl,
                        data: { "mainorg": ccontext.pk_org },
                        success: (res) => {
                            console.log(res);
                            if (res.success && "Y" == res.data) {
                                this.state.refOrg.value.refpk = ccontext.pk_org;
                                this.state.refOrg.value.refname = ccontext.org_Name;
                            }
                            this.setState(this.state);
                            callback && callback();
                            return
                        }
                    });
                }
                this.setState(this.state);
                callback && callback();
            }
        );


    }

    /**
     * 初始化元数据以后，发送一个请求，用来查询当前登陆集团的“货位容积”的单位，修改一下；
     */

    setVolumeUnit = (props, template) => {
        ajax({
            url: "/nccloud/uapbd/rack/RackGetVolumeUnit.do",
            data: { 'inplace': '~' },
            success: (result) => {
                if (result.success) {
                    props.meta.setMeta(template);
                    this.setFormEnableStateProp(props, result.data);
                }
            }
        })

    }
    /**
     * 初始元数据后 设置enablestate不可编辑
     */
    setFormEnableStateProp = (props, voluemeUnit) => {
        //获得元数据
        let meta = props.meta.getMeta();
        //判断元数据中有我的表单元数据
        if (Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(this.config.formId)) {
            //获得表单元数据
            let formMeta = props.meta.getMeta()[this.config.formId];
            //判断表单元数据有属性
            if (formMeta.hasOwnProperty("items")) {
                //获得属性
                let items = formMeta.items;
                if (Object.prototype.toString.call(items).slice(8, -1) === 'Array') {
                    items.map((item) => {
                        //查找enablestate属性
                        if (item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate') {
                            //设置enablestate属性不可用
                            props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                        } else if (item.hasOwnProperty("attrcode") && item.attrcode == 'volume') {
                            item.label = item.label + voluemeUnit;
                        }
                    });
                }
            }
        }
    }

    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
            node.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true,
            };
            node.isleaf = node.nodeData.isLeaf;//从服务端拿出来的数据
            if (!node.children || node.children.length == 0 || node.isleaf) {
                delete node.children;
            }
            else {
                //node.isLeaf = false;
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach((e) => {
            e.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true,
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    /*
    componentWillMount(){
        this.setVolumeUnit.call(this);
    }
    */


    componentDidUpdate() {//fix--增加编辑态离开按钮提醒20180925 added  by liusenc 
        //form如果是编辑态，关闭浏览器需要给你提示
        let formstatus = this.props.form.getFormStatus(this.config.formId);


        if ((formstatus == undefined || formstatus == 'browse')) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount() {

        this.initData.call(this);
        //修改按钮状态
        this.initButtonStatus();

    }
    initData() {
        let isRefAllSelect =
            (
                !this.state.refStordoc.value || this.state.refStordoc.value === null || this.state.refStordoc.value === '' || !this.state.refStordoc.value.hasOwnProperty('refpk') ||
                !this.state.refOrg.value || this.state.refOrg.value === null || this.state.refOrg.value === '' || !this.state.refOrg.value.hasOwnProperty('refpk')
            );

        //是业务单元节点
        if (isRefAllSelect) {
            this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData([Object.assign({ ...this.root })]));
            this.props.syncTree.setNodeDisable(this.config.treeId, true);
            //禁用
            //this.state.disabledShowOff = true;
            this.setState(this.state);
        } else {//此时意味着数据已经选中了；
            this.loadTreeData();
        }

    }
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value) { //选择行政组织钩子
        if (value) {
            this.state.cardEmpty = false;
        }
        this.state.refStordoc.value = value;
        //this.state.disabledShowOff = false;
        this.setState(this.state, () => {
            this.initData();
        });
    }

    /**
     * 加载树节点数据
     */
    loadTreeData() {

        /*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string,nodeType:string}}
         *****************************************************************/
        let requestParam = {
            isShowOff: this.state.checked,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk,//当前选择的组织pk
            nodeType: this.config.nodeType,
            primaryKey: '~',
        };

        /*****************************************************************
         * ajax请求 加载树数据
         * @param url:请求树数据url,data: requestParam, success:回调
         *****************************************************************/
        ajax({

            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    let data = [Object.assign({ ...this.root }, { children: result.data.treeData })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);

                    this.setTreeStatus();
                    //禁用
                    //this.state.disabledShowOff = false;
                    this.state.codeRule = result.data.codeRule;
                    this.onSelectTree(this.root.refpk);
                    this.setState(this.state);
                }
            }
        });
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus() {

        this.props.button.setButtonsVisible({
            Refresh: true,
            Save: false,
            SaveAdd: false,
            Cancel: false,
            Print: true,
            Output: true,
            QuickDef: true,
        })


        //设置保存新增按钮不显示

        this.props.button.setDisabled({
            'Refresh': false,
            'Print': true,
            'Output': true,
            'QuickDef': false
        });

    }

    /**
     * 设置树的状态
     */
    setTreeStatus() {
        this.props.syncTree.setNodeDisable(this.config.treeId, false);
        if (this.config.nodeType == 'ORG_NODE') {
            if (!this.state.refStordoc.value || this.state.refStordoc.value == undefined) {
                this.props.syncTree.setNodeDisable(this.config.treeId, true);//业务单元，没有组织情况下，设置整棵树不可用
            } else {
                this.props.syncTree.setNodeDisable(this.config.treeId, false);
            }
        }
    }

    /*
    处理编码规则数据；对表单数据的编码规则字段进行赋值；
    */
    setCodeRule(data) {
        data.rows[0].values.coderule = { value: this.state.codeRule, display: this.state.codeRule };
        return data;
    }
    dealloadtreedata(olddata, newdata) {
        var adddata = new Array();
        var editdata = new Array();
        var deldata = new Array();

        for (var i = 0; i < olddata.length; i++) {
            var flag = true;
            for (var j = 0; j < newdata.length; j++) {
                if (olddata[i].refpk == newdata[j].refpk) {
                    editdata.push(newdata[j]);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                deldata.push(olddata[i].refpk);
            }
        }
        if (editdata.length != newdata.length) {
            for (var i = 0; i < newdata.length; i++) {
                var flag = true;
                for (var j = 0; j < editdata.length; j++) {
                    if (newdata[i].refpk == editdata[j].refpk) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    adddata.push(newdata[i]);
                }
            }
        }
        let resultdata = {
            adddata: adddata,
            editdata: editdata,
            deldata: deldata
        };
        return resultdata;
    }

    //选择完库存组织（实际已经有了编码规则，）选中完仓库以后，把编码规则可以显示出来，现在处理的方案是，加载左树数据的时候搞到编码规则；
    onTreeExpand(expandedKeys, info) {
        //在这里判断一下是否选中了库存组织和仓库，若未曾选中，直接返回；
        if (!this.state.refOrg.value || !this.state.refStordoc.value) {
            return;
        }
        if (info.expanded) {
            /******************************************************
             * ajax 请求选择的树节点数据,因为是异步树，所以在这里在请求一下异步树的数据；
             ******************************************************/
            let requestParam = {
                isShowOff: this.state.checked,
                primaryKey: info.node.props.refpk,
                pk_curOrg: this.state.refOrg.value.refpk,
                pk_stordoc: this.state.refStordoc.value.refpk,
                nodeType: this.config.nodeType
            };
            ajax({
                url: this.config.urls.loadTreeDataUrl,
                data: requestParam,
                success: function (res) {
                    if (res.success) {
                        if (res.data && res.data.treeData) {//说明有数据；
                            let selectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, info.node.props.refpk);
                            if (selectedNode != null && selectedNode.children != null) {
                                var resultdata = this.dealloadtreedata(selectedNode.children, res.data.treeData);

                                resultdata.deldata.forEach((deltree) => {
                                    this.props.syncTree.delNodeSuceess(this.config.treeId, deltree);
                                });
                                this.props.syncTree.addNodeSuccess(this.config.treeId, this.dealTreeData(resultdata.adddata));
                                this.props.syncTree.editNodeSuccess(this.config.treeId, this.dealTreeData(resultdata.editdata));
                            } else {
                                this.props.syncTree.addNodeSuccess(this.config.treeId, this.dealTreeData(res.data.treeData));
                            }
                            this.state.curSelectedNode = selectedNode;
                            this.setState(this.state);
                        }
                    }

                }.bind(this),
            });
        }
    }

    onDoubleClick(checkedKeys, info) {
        info.expanded = !this.state.expandedKeys.includes(checkedKeys);
        this.state.expandedKeys.includes(checkedKeys) ? this.state.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.expandedKeys.push(checkedKeys);
        this.setState(this.state);
        this.onTreeExpand(this.state.expandedKeys, info);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk) {
        if (this.checkTreeNodeIsDisabled(this.props.syncTree.getSyncTreeValue(this.config.treeId, refpk))) {
            return;
        }
        /******************************************************
         * 获得表单状态
         ******************************************************/
        let status = this.props.form.getFormStatus(this.config.formId);
        /******************************************************
         * 编辑态  树节点操作无效
         ******************************************************/
        if (status == 'edit') {
            return;
        }
        /******************************************************
         * 判断点击的是否是根节点
         ******************************************************/
        if (refpk == this.root.refpk) {
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsValue(this.config.formId, { 'coderule': { value: this.state.codeRule, display: this.state.codeRule } })
            this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
            //查出来了数据，把输出和打印按钮放出来；
            this.props.button.setDisabled({

                'Print': true,
                'Output': true,

            });
            return;
        }
        /******************************************************
         * 请求参数
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         ******************************************************/
        let requestParam = {
            isShowOff: this.state.checked,
            primaryKey: refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk,
            nodeType: this.config.nodeType
        };
        /******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: requestParam,
            success: function (result) {
                if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                    this.props.dealFormulamsg(result.formulamsg,
                        {
                            "head": "form",
                        })
                }

                if (result.success) {

                    /*
                                        if(result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')){
                    
                                            var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                            if(!!enablestateObj){
                                                result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                            }
                    
                                        }
                                        */


                    if (result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')) {

                        var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'], 'form');
                        if (!!enablestateObj) {
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                        }

                    }

                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    //设置一下编码规则字段；
                    let cdata = this.setCodeRule(result.data[this.config.formId]);
                    this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });

                    /************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
                    let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点

                    this.state.curSelectedNode = selectedTreeNode;
                    this.setState(this.state);
                    this.changeButtonStatus(selectedTreeNode, 'select');
                }
            }.bind(this),
        });

    }



    /**
     * 新增
     * @param selectNode
     */
    onAddClass(selectNode) {
        if (this.checkTreeNodeIsDisabled(selectNode)) {
            return;
        }
        //校验，是否选中组织参照；是否选中仓库参照；父级档案是否禁用；是否未最末级货位在java段校验；
        if (this.state.refOrg.value === undefined) {

            toast({ color: 'warning', content: this.state.json['10140RACK-000001'] });/* 国际化处理： 库存组织为空，不能增加货位！*/
            return;
        }
        if (this.state.refStordoc.value === undefined) {
            toast({ color: 'warning', content: this.state.json['10140RACK-000002'] });/* 国际化处理： 仓库为空，不能增加货位！*/
            return;
        }
        /******************************************************
         * 设置当前选中节点
         ******************************************************/
        this.state.curSelectedNode = selectNode;
        this.setState(this.state);

        /******************************************************
         * 父键
         * @type {string}
         ******************************************************/
        let parent_id = this.root.refpk;
        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk
            parent_id = this.state.curSelectedNode.refpk;
        }

        /******************************************************
         * 请求参数对象
         ******************************************************/
        let requestParam = {
            parent_id: parent_id,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk,
            nodeType: this.config.nodeType,
        };
        /******************************************************
         * 记录原父节点pk,移动树节点时使用
         ******************************************************/
        this.setState({ oldParent: requestParam.parent_id });
        ajax({
            url: this.config.urls.addCardUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'edit');
                    //表单数据
                    let headData = result.data[this.config.formId].rows[0].values;
                    if (headData.hasOwnProperty('enablestate')) {
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        /*
                        if(enablestateValue == '2'){
                            result.data[this.config.formId].rows[0].values.enablestate.value = true;
                            result.data[this.config.formId].rows[0].values.enablestate.display = true;
                        }else{
                            result.data[this.config.formId].rows[0].values.enablestate.value = false;
                            result.data[this.config.formId].rows[0].values.enablestate.display = false;
                        }
                        */
                        /*
                        var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                        if(!!enablestateObj){
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                        }
                        */
                    }

                    //设置新增默认值
                    //设置一下编码规则字段；
                    let cdata = this.setCodeRule(result.data[this.config.formId]);
                    this.props.form.setAllFormValue({ [this.config.formId]: cdata });

                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });

                    this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                    //新增成功，设置按钮状态
                    this.changeButtonStatus(selectNode, this.config.actions.TreeNodeAdd);

                    /*******************************
                     * 回调成功后  设置新增标志
                     * @type {boolean}
                     *******************************/
                    this.state.isAdd = true;
                    this.state.disabledShowOff = true;
                    this.setState(this.state);

                }
            }
        })



    }

    /**
     * 编辑：
     *      1、构造请求参数
     *      2、ajax请求，后台查询需要编辑的对象
     *      3、回调，设置表单数据为编辑的对象
     *
     * 编辑状态下：
     *      只有 保存  取消 按钮 显示
     * @param selectedTreeNode
     */
    onEditClass(selectedTreeNode) {
        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        /******************************************************
         * 设置当前选中节点
         ******************************************************/
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        /**************************************************
         * 未选中提示
         **************************************************/
        if (!this.state.curSelectedNode) {
            Message.create({ content: this.state.json['10140RACK-000003'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }
        /**************************************************
         * 请求参数对象
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         **************************************************/
        let requestParam = {
            primaryKey: this.state.curSelectedNode.refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk,
            nodeType: this.config.nodeType,
            //增加已个参数，用来做数据权限的处理；资源实体在后台，实体的pk上面已经穿过了
            mdOperateCode: 'edit',
        };
        /**************************************************
         * 记录父节点pk 移动树节点时使用
         **************************************************/
        this.setState({ oldParent: this.state.curSelectedNode.pid, isAdd: false });
        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (res) => {
                if (res.success && res.data) {
                    ajax({
                        url: this.config.urls.editUrl,
                        data: requestParam,
                        success: (result) => {

                            if (result.success) {
                                this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用

                                /*
                                if(Utils.checkHasProps(this.props.meta.getMeta(),this.config.formId,'enablestate')){
                                    if(result.data[this.config.formId].rows[0].values.enablestate.value == '2'){
                                        result.data[this.config.formId].rows[0].values.enablestate.value = true;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = true;
                                    }else{
                                        result.data[this.config.formId].rows[0].values.enablestate.value = false;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = false;
                                    }
                                }
                                */

                                /*
                                 var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                 if(!!enablestateObj){
                                     result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                 }
                                 */
                                //设置表单数据
                                //设置一下编码规则字段；
                                let cdata = this.setCodeRule(result.data[this.config.formId]);
                                this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });//设置表单项不可用
                                //设置表单状态为编辑态
                                this.props.form.setFormStatus(this.config.formId, 'edit');
                                this.changeButtonStatus(this.state.curSelectedNode, this.config.actions.TreeNodeEdit);
                                this.state.isAdd = false;
                                this.state.disabledShowOff = true;
                                this.setState(this.state);
                            }
                        }
                    });
                }
            }
        })

    }

    checkHasChildren(tree, pk) {
        if (!tree) {
            tree = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        }
        let i = tree.length;
        while (i--) {
            let data = tree[i];
            if (data.refpk === pk) {
                if (data.hasOwnProperty('children') && data.children.length === 0) {
                    delete data.children;
                    data.isleaf = true;
                }
                return true;
            } else {
                if (data.hasOwnProperty('children')) {
                    let res = this.checkHasChildren(data.children, pk);
                    if (res) {
                        return false
                    }
                }
            }
        }
    }

    /**************************************************
     *
     * 保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     *
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     *
     **************************************************/
    onSaveClass() {
        //在这里做一下表单非空项目校验
        if (!this.props.form.isCheckNow(this.config.formId)) {
            return;
        }
        /**************************************************************
         * 获得表单数据
         **************************************************************/
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        /**************************************************************
         *  请求参数对象
         **************************************************************/

        if (formData.rows[0].values.hasOwnProperty('enablestate')) {
            var enablestateObj = Utils.convertEnableState(formData.rows[0].values['enablestate'], 'db');
            if (!!enablestateObj) {
                formData.rows[0].values['enablestate'] = enablestateObj;
            }

        }

        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.config.nodeType,
            pk_stordoc: this.state.refStordoc.value.refpk || "",
            pk_curOrg: this.state.refOrg.value.refpk || "",
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = false;
        if (formData.rows[0].values.hasOwnProperty(this.config.primaryKey)) {
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value) ? false : true;
        }
        this.props.validateToSave({ "model": formData, "pageid": this.config.pageCode }, () => {
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {

                        /**************************************************************
                         *  设置树可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        /**************************************************************
                         * 去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                         **************************************************************/
                        if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         * 是否是移动节点
                         **************************************************************/
                        let isMove = false;
                        if (result.data.treeNodeData[0].pid != this.state.oldParent) {
                            isMove = true;
                        }
                        /**************************************************************
                         * 判断是新增还是编辑
                         **************************************************************/
                        if (nonPk) {
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treeNodeData[0]);
                        } else {
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId, result.data.treeNodeData[0]);
                        }
                        /**************************************************************
                         * 移动树节点  并且检查原父节点没有子节点时去除'>'符号
                         **************************************************************/
                        if (isMove) {
                            this.props.syncTree.moveNode(this.config.treeId, result.data.treeNodeData[0].refpk, result.data.treeNodeData[0].pid)
                            //this.checkHasChildren(null,this.state.oldParent);
                        }
                        /**************************************************************
                         * 展开当前树节点
                         **************************************************************/
                        //暂时关掉这个，因为可能牵涉到改变了code，导致子节点也改了code，如果不再次打开的话，可能会有数据过时20180807修改
                        //this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        this.props.syncTree.closeNodeByPk(this.config.treeId, result.data.treeNodeData[0].refpk);
                        /**************************************************************
                         * 设置新增节点为选中节点
                         **************************************************************/
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
                        /**************************************************************
                         * 设置表单为浏览态
                         **************************************************************/
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        /**************************************************************
                         * 清空表单数据
                         **************************************************************/
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        /**************************************************************
                         * 重置表单数据为当前选中节点的表单数据
                         **************************************************************/
                        result.data.curFormData[this.config.formId].rows[0].values['enablestate'] =
                            Utils.convertEnableState(result.data.curFormData[this.config.formId].rows[0].values['enablestate'], 'form');
                        //设置一下编码规则字段；
                        let cdata = this.setCodeRule(result.data.curFormData[this.config.formId]);
                        this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                        /**************************************************************
                         * 设置enablestate属性为可用状态
                         **************************************************************/
                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                        /**************************************************************
                         * 设置按钮状态
                         **************************************************************/
                        this.changeButtonStatus(this.state.curSelectedNode, this.config.actions['Save']);
                        toast({ title: this.state.json['10140RACK-000004'], color: 'success' });/* 国际化处理： 保存成功！*/
                        /**************************************************************
                         * 清空选中节点的缓存
                         **************************************************************/
                        this.setState({ curSelectedNode: null });
                        this.state.disabledShowOff = false;
                        this.setState(this.state);
                    }

                }
            });
        }, { 'head': 'form' }, 'form')


    }

    /**************************************************
     *
     * 新增保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     *
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     *
     **************************************************/
    onSaveAddClass() {
        //在这里做一下表单非空项目校验
        if (!this.props.form.isCheckNow(this.config.formId)) {
            return;
        }
        let selectedTreeNode = this.state.curSelectedNode;
        let requestParam = {};
        /**************************************************************
         *  获得表单数据
         **************************************************************/
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        if (formData.rows[0].values.hasOwnProperty('enablestate')) {

            var enablestateObj = Utils.convertEnableState(formData.rows[0].values['enablestate'], 'db');
            if (!!enablestateObj) {
                formData.rows[0].values['enablestate'] = enablestateObj;
            }

        }
        /**************************************************************
         *  请求参数对象
         **************************************************************/
        requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.config.nodeType,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (formData.rows[0].values.hasOwnProperty(this.config.primaryKey)) {
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value) ? false : true;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        /**************************************************************
         *  ajax请求
         **************************************************************/
        this.props.validateToSave({ "model": formData, "pageid": this.config.pageCode }, () => {
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        /**************************************************************
                         *  设置表单为浏览态
                         **************************************************************/
                        this.props.form.setFormStatus(this.config.formId, 'browse');

                        /**************************************************************
                         *  去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                         **************************************************************/
                        if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         *  新增回调后添加
                         **************************************************************/
                        this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treeNodeData[0]);
                        /**************************************************************
                         *  展开当前节点的父节点
                         **************************************************************/
                        //暂时关掉这个，因为可能牵涉到改变了code，导致子节点也改了code，如果不再次打开的话，可能会有数据过时20180807修改
                        //this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        this.props.syncTree.closeNodeByPk(this.config.treeId, result.data.treeNodeData[0].refpk);

                        /**************************************************************
                         *  如果选中节点丢失，重置当前选中节点 保障性操作
                         **************************************************************/
                        if (!selectedTreeNode) {
                            this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                            this.setState({ curSelectedNode: selectedTreeNode });
                        }
                        /**************************************************************
                         *  重新设置整棵树不可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId, true);

                        /**************************************************************
                         * 请求参数对象
                         **************************************************************/
                        let requestParam = {
                            parent_id: this.state.curSelectedNode.refpk,
                            nodeType: this.config.nodeType,
                            pk_curOrg: this.state.refOrg.value.refpk,
                            pk_stordoc: this.state.refStordoc.value.refpk
                        };
                        /**************************************************************
                         * 记录原父节点pk 移动时使用
                         **************************************************************/
                        this.setState({ oldParent: requestParam.parent_id, isAdd: true });
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {

                                    /**************************************************************
                                     * 清空表单数据
                                     **************************************************************/
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    /**************************************************************
                                     * 重置表单数据
                                     **************************************************************/
                                    //表单数据
                                    /*
                                let headData = result.data[this.config.formId].rows[0].values;
                                if(headData.hasOwnProperty('enablestate')){
                                    let enablestateValue = headData.enablestate.value;
                                    //根据表单项enablestate的值修改开关状态
                                    if(enablestateValue == '2'){
                                        result.data[this.config.formId].rows[0].values.enablestate.value = true;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = true;
                                    }else{
                                        result.data[this.config.formId].rows[0].values.enablestate.value = false;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = false;
                                    }
                                }
                                */
                                    /*
                                     var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                     if(!!enablestateObj){
                                         result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                     }
                                     */
                                    //设置一下编码规则字段；
                                    let cdata = this.setCodeRule(result.data[this.config.formId]);
                                    this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                                    /**************************************************************
                                     * 设置表单为编辑态
                                     **************************************************************/
                                    this.props.form.setFormStatus(this.config.formId, 'edit');
                                    /**************************************************************
                                     * 重新设置按钮状态
                                     **************************************************************/
                                    this.changeButtonStatus(selectedTreeNode, this.config.actions['SaveAdd']);
                                    /**************************************************************
                                     * 回调成功后  设置新增标志
                                     * @type {boolean}
                                     **************************************************************/
                                    this.state.isAdd = true;
                                    this.setState(this.state);
                                }
                            }

                        })
                    }


                }
            });
        }, { 'head': 'form' }, 'form')


    }

    /**
     *
     * 删除：
     *      1、根据选中的树节点做出相应的提示
     *      2、弹出删除确认提示
     *      3、构造请求参数
     *      4、ajax请求，后台执行删除
     *      5、回调，执行前台删除动作
     *
     * 删除状态下：
     *      清空表单对象数据，按钮全成Disabled状态
     *
     * @param selectedTreeNode
     */
    onDeleteClass(selectedTreeNode) {
        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        /**************************************************************
         * 保障性操作
         **************************************************************/
        if (!selectedTreeNode) {
            Message.create({ content: this.state.json['10140RACK-000005'], color: 'warning' });/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        /**************************************************************
         * 根节点不能删除
         **************************************************************/
        if (selectedTreeNode.refpk == this.root.refpk) {
            Message.create({ content: this.state.json['10140RACK-000006'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        /**************************************************************
         * 设置当前选中节点
         **************************************************************/
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        /**************************************************************
         * 请求参数对象
         **************************************************************/
        let requestParam = {
            primaryKey: selectedTreeNode.refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            pk_stordoc: this.state.refStordoc.value.refpk,
            ts: selectedTreeNode.nodeData.ts,
            nodeType: this.config.nodeType,
            //增加已个参数，用来做数据权限的处理；资源实体在后台，实体的pk上面已经穿过了
            mdOperateCode: 'delete',
        };
        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (result) => {
                /**************************************************************
                 * 先校验有无删除权限，能删除在做下一步操作
                 **************************************************************/
                if (result.success && result.data) {
                    promptBox({
                        title: this.state.json['10140RACK-000007'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140RACK-000008'],/* 国际化处理： 您确定要删除所选数据吗?*/
                        color: 'warning',
                        beSureBtnClick: () => {
                            promptBox({
                                title: this.state.json['10140RACK-000007'],/* 国际化处理： 确认删除*/
                                content: this.state.json['10140RACK-000009'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
                                color: 'warning',
                                beSureBtnClick: () => {
                                    ajax({
                                        url: this.config.urls.deleteUrl,
                                        data: requestParam,
                                        success: (result) => {
                                            if (result.success) {
                                                /**************************************************************
                                                 * 清空表单数据
                                                 **************************************************************/
                                                this.props.form.EmptyAllFormValue(this.config.formId);
                                                /**************************************************************
                                                 * 删除树节点
                                                 **************************************************************/
                                                this.props.syncTree.delNodeSuceess(this.config.treeId, selectedTreeNode.refpk);
                                                /**************************************************************
                                                 * 删除成功提示
                                                 **************************************************************/
                                                toast({ title: this.state.json['10140RACK-000010'], color: 'success' });/* 国际化处理： 删除成功！*/
                                                /**************************************************************
                                                 * 重新设置按钮状态
                                                 **************************************************************/
                                                this.changeButtonStatus(selectedTreeNode, this.config.actions.TreeNodeDel);
                                            }

                                        }
                                    })
                                }
                            });
                        }
                    });
                }

            }
        });

    }

    /**********************************************************
     *
     * 取消：
     *      1、重新根据选中的树节点查询表单对象
     *      2、回调，设置表单对象
     *      3、设置按钮状态
     *
     **********************************************************/
    onCancelClass() {
        promptBox({
            title: this.state.json['10140RACK-000011'],/* 国际化处理： 确认取消*/
            content: this.state.json['10140RACK-000012'],/* 国际化处理： 是否确认要取消?*/
            color: 'warning',
            beSureBtnClick: () => {
                /**********************************************************
                 * 获得选中的树节点
                 **********************************************************/
                // let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                /**********************************************************
                 * 没有选中节点 以当前操作的节点作为选中节点
                 **********************************************************/
                let selectedTreeNode = this.state.curSelectedNode;
                /**********************************************************
                 * 清空表单数据
                 **********************************************************/
                this.props.form.EmptyAllFormValue(this.config.formId);
                /**********************************************************
                 * 设置表单项enablestate不可用
                 **********************************************************/
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                /**********************************************************
                 * 请求参数对象
                 * @type {{pk_curOrg: *, primaryKey: *, nodeType: *, isAdd: boolean}}
                 **********************************************************/
                let requestParam = {
                    pk_curOrg: this.state.refOrg.value.refpk,
                    pk_stordoc: this.state.refStordoc.value.refpk,
                    primaryKey: selectedTreeNode.refpk,
                    nodeType: this.config.nodeType,
                    isAdd: this.state.isAdd,
                };
                if (selectedTreeNode) {
                    if (selectedTreeNode.refpk == '~') {
                        /**********************************************************
                         * 设置树节点选中项
                         **********************************************************/
                        this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
                        /**********************************************************
                         * 设置表单状态
                         **********************************************************/
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        /**********************************************************
                         * 设置树可用
                         **********************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        /**********************************************************
                         * 设置enablestate可用
                         **********************************************************/
                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                        /**********************************************************
                         * 设置按钮状态
                         **********************************************************/
                        this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
                    } else {
                        //查询节点信息
                        ajax({
                            url: this.config.urls.cancelUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {
                                    /**********************************************************
                                     * 重置表单数据
                                     **********************************************************/
                                    //设置一下编码规则字段；
                                    let cdata = this.setCodeRule(result.data[this.config.formId]);
                                    this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                                    /**********************************************************
                                     * 设置树节点选中项
                                     **********************************************************/
                                    this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
                                    /**********************************************************
                                     * 设置表单状态
                                     **********************************************************/
                                    this.props.form.setFormStatus(this.config.formId, 'browse');
                                    /**********************************************************
                                     * 设置树可用
                                     **********************************************************/
                                    this.props.syncTree.setNodeDisable(this.config.treeId, false);
                                    /**********************************************************
                                     * 设置enablestate可用
                                     **********************************************************/
                                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                                    /**********************************************************
                                     * 设置按钮状态
                                     **********************************************************/
                                    this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
                                }
                            }
                        });
                    }
                    this.state.disabledShowOff = false;
                    this.setState(this.state);

                }
            }
        });
    }

    /**
     * 启用
     */
    onStartClass() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};
        /**************************************************
         *
         * 启用/停用
         *      1、判断选中树节点的状态，做出相应的提示
         *      2、构造请求参数
         *      3、ajax请求，后台执行更新
         *
         * 启用/停用状态下：
         *      按钮的可见性和可操作性不变
         *
         *
         **************************************************/

        if (!selectedTreeNode) {

            Message.create({ content: this.state.json['10140RACK-000013'], color: 'warning' });//默认top/* 国际化处理： 请选中需要启用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '2') {
            Message.create({ content: this.state.json['10140RACK-000014'], color: 'warning' });//默认top/* 国际化处理： 该数据已启用，无需多次启用*/
            return;
        }
        requestParam = {
            primaryKey: formData.rows[0].values[this.config.primaryKey].value,
            enablestate: '2',
            pk_stordoc: this.state.refStordoc.value.refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            nodeType: this.config.nodeType
        };
        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (result) => {
                //启用成功，设置表单数据
                //设置一下编码规则字段；
                let cdata = this.setCodeRule(result.data[this.config.formId]);
                this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                this.changeButtonStatus('', 'Start');
            }
        });

    }

    /**
     * 停用
     */
    onStopClass() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if (!selectedTreeNode) {

            Message.create({ content: this.state.json['10140RACK-000015'], color: 'warning' });//默认top/* 国际化处理： 请选中需要停用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '1') {
            Message.create({ content: this.state.json['10140RACK-000016'], color: 'warning' });//默认top/* 国际化处理： 该数据已停用，无需多次停用*/
            return;
        }
        requestParam = {
            primaryKey: formData.rows[0].values[this.config.primaryKey].value,
            enablestate: '1',
            pk_stordoc: this.state.refStordoc.value.refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            nodeType: this.config.nodeType
        }

        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (res) => {
                if (res.success) {

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.changeButtonStatus('', 'Stop');
                }
            }
        });

    }

    /*****button group end*****/

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode, id) {

        switch (id) {
            case this.config.actions.TreeNodeAdd:
            case this.config.actions.SaveAdd:
                this.props.button.setButtonsVisible({
                    Refresh: false,
                    Save: true,
                    SaveAdd: true,
                    Cancel: true,
                    Print: false,
                    Output: false,
                    QuickDef: false,
                    import: false,
                })

                this.props.button.setDisabled({
                    'Refresh': true,
                    'Save': false,
                    'SaveAdd': false,
                    'Cancel': false,
                    'Print': true,
                    'Output': true,
                    'QuickDef': true,
                });
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                this.state.disabledSearch = true;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case this.config.actions.TreeNodeEdit:
                this.props.button.setButtonsVisible({
                    Refresh: false,
                    Save: true,
                    SaveAdd: false,
                    Cancel: true,
                    Print: false,
                    Output: false,
                    QuickDef: false,
                    import: false,
                })

                this.props.button.setDisabled({
                    'Refresh': true,
                    'Save': false,
                    'SaveAdd': true,
                    'Cancel': false,
                    'Print': true,
                    'Output': true,
                    'QuickDef': true,
                });
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                this.state.disabledSearch = true;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case this.config.actions.TreeNodeDel:
                this.props.button.setButtonsVisible({
                    Refresh: true,
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                    Print: true,
                    Output: true,
                    QuickDef: true,
                    import: true,
                })

                //--this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                this.props.button.setDisabled({
                    'Refresh': false,
                    'Save': true,
                    'SaveAdd': true,
                    'Cancel': true,
                    'Print': true,
                    'Output': true,
                    'QuickDef': false,
                });
                break;
            case this.config.actions.Save:
                this.props.button.setButtonsVisible({
                    Refresh: true,
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                    Print: true,
                    Output: true,
                    QuickDef: true,
                    import: true,
                })

                this.props.button.setDisabled({
                    'Refresh': false,
                    'Save': true,
                    'SaveAdd': true,
                    'Cancel': true,
                    'Print': false,
                    'Output': false,
                    'QuickDef': false
                });
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                this.state.disabledSearch = false;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case this.config.actions.Cancel:
                this.props.button.setButtonsVisible({
                    Refresh: true,
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                    Print: true,
                    Output: true,
                    QuickDef: true,
                    import: true,
                })

                this.props.button.setDisabled({
                    'Refresh': false,
                    'Save': true,
                    'SaveAdd': true,
                    'Cancel': true,
                    'Print': true,
                    'Output': true,
                    'QuickDef': false
                });
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                this.state.disabledSearch = false;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case 'Refresh':
                this.props.button.setButtonsVisible({
                    Refresh: true,
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                    Print: true,
                    Output: true,
                    QuickDef: true,
                    import: true,
                })

                this.props.button.setDisabled({
                    'Refresh': false,
                    'Save': true,
                    'SaveAdd': true,
                    'Cancel': true,
                    'Print': true,
                    'Output': true,
                    'QuickDef': false,
                });
                break;
            case 'Start':
            case 'Stop':
            case 'select':
                this.props.button.setButtonsVisible({
                    Refresh: true,
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                    Print: true,
                    Output: true,
                    QuickDef: true,
                    import: true,
                })

                this.props.button.setDisabled({
                    'Refresh': false,
                    'Save': true,
                    'SaveAdd': true,
                    'Cancel': true,
                    'Print': false,
                    'Output': false,
                    'QuickDef': false
                });
                break;
            default:
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key) {
        //设置
        if (key === this.root.refpk) {
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }

    }

    /**
     * checkbox change 事件
     */
    onCheckBoxChange() {
        if (this.state.disabledShowOff) {
            return;
        }
        this.state.checked = !this.state.checked;
        this.setState(this.state);
        //如果是组织级节点，且并未选中组织值，那么直接返回
        if (this.config.nodeType === 'ORG_NODE') {
            if (this.state.refStordoc.value === '' || this.state.refStordoc.value === undefined || !this.state.refStordoc.value.hasOwnProperty('refpk')) {
                return;
            }
        }
        let requestParam = {
            isShowOff: this.state.checked,
            pk_stordoc: this.state.refStordoc.value.refpk,
            pk_curOrg: this.state.refOrg.value.refpk,
            nodeType: this.config.nodeType,
            primaryKey: '~',
        };
        ajax({
            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.changeButtonStatus('', 'Refresh');
                    var data = [Object.assign({ ...this.root }, { children: result.data.treeData })],
                        initLeaf = function (node) {
                            if (!node.children || node.children.length == 0) {
                                ;
                                delete node.children;
                            }
                            else {
                                node.isLeaf = false;
                                node.children.forEach((e) => {
                                    initLeaf(e);
                                });
                            }
                        };

                    data.forEach((e) => {
                        initLeaf(e);
                    });
                    this.state.codeRule = result.data.codeRule;
                    this.setState(this.state);
                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                }

            }
        })
    }

    /**
     * checkbox 选中事件
     */

    onCheckBoxClick() {
        if (!this.state.disabledShowOff) {
            //this.setState({checked:!this.state.checked});
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
        }

    }


    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index) {

        switch (key) {
            case "enablestate":

                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

                if (!selectedTreeNode) {
                    let content = value.value ? this.state.json['10140RACK-000013'] : this.state.json['10140RACK-000015'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    Message.create({ content: content, color: 'warning' });//默认top
                    return;
                }
                let ctvalue = value.value;//这个用来给取消按钮使用的；
                let requestParam = {
                    primaryKey: selectedTreeNode.refpk,
                    enablestate: value.value,
                    pk_stordoc: this.state.refStordoc.value.refpk,
                    pk_curOrg: this.state.refOrg.value.refpk,
                    ts: selectedTreeNode.nodeData.ts,
                    nodeType: this.config.nodeType,
                    mdOperateCode: value.value ? 'enable' : 'disable', //这里用来做数据权限的控制；
                };

                promptBox({
                    color: "warning",
                    title: this.state.json['10140RACK-000017'],/* 国际化处理： 提示*/
                    color: 'warning',
                    content: value.value ? this.state.json['10140RACK-000018'] : this.state.json['10140RACK-000019'],/* 国际化处理： 确认启用该数据？,确认停用该数据？*/
                    beSureBtnClick: () => {

                        ajax({
                            url: this.config.urls.validateUrl,
                            data: requestParam,
                            success: (res) => {
                                if (res.success && res.data) {
                                    ajax({
                                        url: this.config.urls.enablestateUrl,
                                        data: requestParam,
                                        success: (result) => {
                                            /****
                                             * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                             * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                             */


                                            this.props.syncTree.setNodeDisable(this.config.treeId, false);
                                            /**************************************************************
                                             * 设置表单为浏览态
                                             **************************************************************/
                                            this.props.form.setFormStatus(this.config.formId, 'browse');
                                            /**************************************************************
                                             * 清空表单数据
                                             **************************************************************/
                                            this.props.form.EmptyAllFormValue(this.config.formId);
                                            /**************************************************************
                                             * 重置表单数据为当前选中节点的表单数据
                                             **************************************************************/
                                            if (result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')) {
                                                var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'], 'form');
                                                if (!!enablestateObj) {
                                                    result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                                }
                                            }
                                            //设置一下编码规则字段；
                                            let cdata = this.setCodeRule(result.data[this.config.formId]);
                                            this.props.form.setAllFormValue({ [this.config.formId]: cdata });
                                            /**************************************************************
                                             * 设置enablestate属性为可用状态
                                             **************************************************************/
                                            //this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                                            /**************************************************************
                                             * 设置按钮状态
                                             **************************************************************/
                                            this.changeButtonStatus(this.state.curSelectedNode, this.config.actions['Save']);
                                            /**************************************************************
                                             * 清空选中节点的缓存
                                             **************************************************************/
                                            this.setState({ curSelectedNode: null });
                                            this.state.disabledShowOff = false;
                                            this.setState(this.state, () => {
                                                this.loadTreeData.call(this);
                                            });

                                            toast({ title: value.value ? this.state.json['10140RACK-000020'] : this.state.json['10140RACK-000021'], color: 'success' });/* 国际化处理： 启用成功！,停用成功！*/
                                        }
                                    });
                                }
                            }
                        })
                    },
                    cancelBtnClick: () => {
                        props.form.setFormItemsValue(this.config.formId, { enablestate: { display: null, value: !ctvalue } });
                        return;
                    }
                });



                break;
            case "inpriority":
                if (value.value) {
                    if (!/^\d+$/.test(value.value)) {
                        props.form.setFormItemsValue(this.config.formId, { inpriority: { display: "0", value: "0" } });
                        toast({ title: this.state.json['10140RACK-000032'] + ":" + value.value, color: 'warning' });/* 国际化处理： 入库优先级只能输入整数0至9999*/
                    }
                }
                break;
            case "outpriority":
                if (value.value) {
                    if (!/^\d+$/.test(value.value)) {
                        props.form.setFormItemsValue(this.config.formId, { outpriority: { display: "0", value: "0" } });
                        toast({ title: this.state.json['10140RACK-000033'] + ":" + value.value, color: 'warning' });/* 国际化处理： 出库优先级只能输入整数0至9999 */
                    }
                }
                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 刷新
     */
    onRefreshClass() {
        //this.state.checked = false;
        this.state.curSelectedNode = null;
        //this.state.refOrg.value = undefined;
        //this.state.refStordoc.value = undefined;
        this.state.oldParent = '';
        this.state.isAdd = false;
        this.setState(this.state, () => {
            this.initData.call(this);
            // this.OrgSelect.clearSelectedOrg();
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            this.changeButtonStatus('', 'Refresh');
            toast({ color: 'success', title: this.state.json['10140RACK-000022'] });/* 国际化处理： 刷新成功！*/
        });
    }
    onButtonClick(props, id) {
        switch (id) {
            case this.config.actions.Refresh:
                this.onRefreshClass.call(this);
                break;
            case this.config.actions.Save:
                this.onSaveClass.call(this);
                break;
            case this.config.actions.SaveAdd:
                this.onSaveAddClass.call(this);
                break;
            case this.config.actions.Cancel:
                this.onCancelClass.call(this);
                break;
            case this.config.actions.print:
                this.onPrint('print');
                break;
            case this.config.actions.output:
                this.onPrint('output');
                break;
            case this.config.actions.QuickDef:
                this.onQuickDef();
                break;
            case this.config.actions.Export:
                this.props.modal.show('exportFileModal');
                break;
            default: break;
        }
    }
    onQuickDef() {
        /*点击了模态框按钮，需要做下面的事情：
            1，校验是否勾选了组织和仓库参照；
            2，根据编码规则生成一下模态框的单据模板，setState一下，重新执行一下render方法，
            3，显示一下模态框；
        */
        //校验，是否选中组织参照；是否选中仓库参照；父级档案是否禁用；是否未最末级货位在java段校验；
        if (this.state.refOrg.value === undefined) {

            toast({ color: 'warning', content: this.state.json['10140RACK-000023'] });/* 国际化处理： 所属库存组织为空，不能定义货位！*/
            return;
        }
        if (this.state.refStordoc.value === undefined) {
            toast({ color: 'warning', content: this.state.json['10140RACK-000024'] });/* 国际化处理： 所属仓库为空，不能定义货位！*/

            return;
        }
        this.dealModalTemplate();

    }
    codeUtilsParseCodeRule(coderule) {
        if (coderule === '') {
            return [];
        }
        let codeArrys = coderule.split('-');
        let retIntArrs = [];
        codeArrys.forEach((ele) => {
            let pInt = ele.length;
            retIntArrs.push(pInt);
        })
        return retIntArrs;
    }
    dealModalTemplate() {//根据编码规则处理一下模态框使用到的单据模板

        if (!this.state.templateModified) {//如果未初始化过，那么初始化一下；
            let citems = this.props.meta.getMeta()['quickhead'].items;//单据模板中的模态框模板；
            //没有清模板里的数据，在这处理
            if (citems.length > 2) {
                citems.splice(2, citems.length - 2);
            }
            let ruleArray = this.codeUtilsParseCodeRule(this.state.codeRule);
            let attrArrays = [];
            citems[0].maxlength = ruleArray[0].toString();
            citems[1].maxlength = ruleArray[0].toString();
            let index = 1;
            for (; index < ruleArray.length; index++) {
                let cNametem = deepClone(citems[0]);
                //cNametem.label = this.state.json['10140RACK-000025']+(index+1)+this.state.json['10140RACK-000026'];
                cNametem.label = cNametem.label.replace(/\d+/g, (index + 1));
                cNametem.attrcode = "dimName_" + (index + 1);
                cNametem.required = false;
                cNametem.maxlength = ruleArray[index].toString();
                citems.push(cNametem);
                let cNumtem = deepClone(citems[1]);
                //cNumtem.label = this.state.json['10140RACK-000025']+(index+1)+this.state.json['10140RACK-000027'];
                cNumtem.label = cNumtem.label.replace(/\d+/g, (index + 1));
                cNumtem.attrcode = "dimNum_" + (index + 1);
                cNumtem.required = false;
                cNumtem.maxlength = ruleArray[index].toString();
                citems.push(cNumtem);
            }
            /*
            for(;index<ruleArray.length;index++){
                let cNametem = {
                    attrcode:"dimName_"+(index+1),
                    colnum:"1",
                    color:"#6E6E77",
                    isrevise:false,
                    itemtype:"input",
                    label:this.state.json['10140RACK-000025']+(index+1)+this.state.json['10140RACK-000026'],// 国际化处理： 第,维名称
                    maxlength:ruleArray[index].toString(),
                    required:false,
                    visible:true,
                };
                citems.push(cNametem);
                let cNumtem = {
                    attrcode:"dimNum_"+(index+1),
                    colnum:"1",
                    color:"#6E6E77",
                    isrevise:false,
                    itemtype:"number",
                    label:this.state.json['10140RACK-000025']+(index+1)+this.state.json['10140RACK-000027'],// 国际化处理： 第,维最大数目
                    maxlength:ruleArray[index].toString(),
                    required:false,
                    visible:true,                    
                };
                citems.push(cNumtem);
            }
            */
            citems.forEach((ele) => {
                attrArrays.push(ele.attrcode);//这个是生成模板中的所有数据；
            });
            this.state.templateAttrArrays = attrArrays;
            this.state.templateModified = true;
        }
        this.state.showModal = true;
        this.setState(this.state, () => {
            this.props.form.setFormStatus('quickhead', 'edit');

        })
    }
    /*
    onPrint(modal){
        let cpk = this.props.form.getFormItemsValue(this.config.formId,'pk_rack').value;
        if(cpk === null){
            return;
        }

        let pks = [];
        pks.push(cpk);
        print(
            'pdf',
             urls.printUrl,
             {
                 billtype:'',
                 funcode:'10140RACK',
                 nodekey:'nccloud',
                 oids:pks,
                 outputtype:modal,
             }
        )
    }
    */
    onPrint(modal) {
        let cpk = this.props.form.getFormItemsValue(this.config.formId, 'pk_rack').value;
        if (cpk === null || cpk === undefined) {
            return;
        }
        let pks = [];
        pks.push(cpk);
        /*
        let allD1 = this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children;
        let pks = [];
        if(allD1 === undefined){
            return;
        }
        allD1.forEach((item,index)=>{
            pks.push(item.id);
        });
 
        */
        this.state.printPks = pks;
        if (pks.length === 0) {
            return;
        }
        if ("print" === modal) {//打印
            print(
                'pdf',
                urls.printUrl,
                {
                    //billtype:'',
                    funcode: '10140RACK',
                    //nodekey:'nccloud',
                    nodekey: 'packprint',//增加nodekey
                    oids: pks,
                }
            )
        } else if ('output' === modal) {
            this.setState(this.state,
                this.refs.printOutput.open());
        }

    }


    checkTreeNodeIsDisabled(node) {
        return !!node.disabled;
    }

    onQuickDefineSave() {//快速货位定义模态框保存操作;关闭模态框，清空表数据，发送ajax请求后台；校验放在java端做复用老代码；
        /*         let quickFormData = this.props.form.getAllFormValue('quickhead');
                let valueArray = [];//偶数为name，奇数为num；
                this.state.templateAttrArrays.forEach((ele)=>{
                    let cdata = quickFormData.rows[0].values[ele].value;
                    let tdata = (cdata === null || cdata === undefined || (cdata+"").trim() === "") ? "~" : cdata+"";
                    valueArray.push(tdata);
                }) */
        let valueArray = [];//偶数为name，奇数为num；
        let i = 0;
        this.state.templateAttrArrays.forEach((ele) => {
            let cdata = this.props.form.getFormItemsValue('quickhead', ele);
            //console.log(cdata);
            let tdata = "~";
            if (i % 2 === 0) {//为name;
                let cidata = "";
                for (var objMeta in cdata) {
                    //console.log(objMeta+":"+cdata[objMeta]);
                    if (cdata[objMeta] && cdata[objMeta].value) {
                        cidata = cidata + cdata[objMeta].value;
                    }
                    cidata = cidata + ",";
                }
                if (cidata !== ",,,") {//三个不全为空；那么就将
                    tdata = cidata.substring(0, cidata.length - 1);
                }

            } else {//为num
                if (cdata.value) {
                    tdata = cdata.value;
                }
            }

            valueArray.push(tdata);
            i = i + 1;
        })
        ajax({
            loading: true,
            url: urls.quickDefineUrl,
            data: {
                pk_curOrg: this.state.refOrg.value.refpk,
                pk_stordoc: this.state.refStordoc.value.refpk,//当前选择的组织pk
                'quickDefine': valueArray
            },
            success: (res) => {
                //清空表数据，关闭模态框；
                this.props.form.EmptyAllFormValue('quickhead');
                this.state.showModal = false;
                this.setState(this.state, () => {
                    toast({ color: 'success', content: this.state.json['10140RACK-000034'] });/* 国际化处理： 后台执行快速执行任务!*/
                });
            }
        });

    }
    onCloseCancelModal() {//关闭模态框，清空表数据，

        this.props.form.EmptyAllFormValue('quickhead');
        this.state.showModal = false;
        this.setState(this.state);
    }
    onBeforeEvent(props, moduleId, key, value, index) {
        let cpk_org = this.state.refOrg.value.refpk;
        if ("pk_stordoc" === key || "pk_psndoc" === key) {//操作了所属仓库参照；
            let meta = props.meta.getMeta();
            meta.head.items.map((ele) => {
                if (ele.attrcode === "pk_stordoc") {
                    ele.queryCondition = function () {
                        return {
                            pk_org: cpk_org,
                            GridRefActionExt: "nccloud.web.uapbd.rack.action.StordocRefExt",
                        }
                    }
                } else if (ele.attrcode === "pk_psndoc") {
                    ele.queryCondition = function () {
                        return {
                            pk_org: cpk_org,
                        }
                    }
                }
            })
            props.meta.setMeta(meta);
        }
        return true;
    }
    /**
     * 渲染
     * @returns {*}
     */
    render() {
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const { syncTree, form, button, ncmodal, DragWidthCom, BillHeadInfo } = this.props;

        const { createSyncTree } = syncTree;//创建同步树 需要引入这个

        const { createForm } = form;//创建表单，需要引入这个

        const { createButtonApp } = button;
        const { createBillHeadInfo } = BillHeadInfo;

        const { cardEmpty } = this.state;

        let { createModal } = ncmodal;  //模态框

        /**
         * 树参数
         **/
        let TreeParam = {
            treeId: this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            onMouseEnterEve: this.onMouseEnterEve.bind(this),
            clickAddIconEve: this.onAddClass.bind(this), //新增点击 回调
            clickEditIconEve: this.onEditClass.bind(this), //编辑点击 回调
            clickDelIconEve: this.onDeleteClass.bind(this), // 删除点击 回调
            showModal: this.state.tree.showModal,
            onTreeExpand: this.onTreeExpand.bind(this),
            onDoubleClick: this.onDoubleClick.bind(this),
            disabledSearch: this.state.disabledSearch//这个用来做是否禁用搜索框的控制；
        };
        let createContent = () => {
            return (
                /*             <div style={{display:'flex',width:700}}>
                                <div className="modalContent">
                                    {this.props.form.createForm('quickhead',{})}
                                </div>
                            </div> */
                <div className="modalContent">
                    {this.props.form.createForm('quickhead', {})}
                </div>

            )
        }
        return (
            <div className="nc-bill-tree-card">
                <NCModal
                    show={this.state.showModal}
                    size="lg"
                >
                    <NCModal.Header>
                        <NCModal.Title>{this.state.json['10140RACK-000028']}</NCModal.Title>{/* 国际化处理： 快速货位定义*/}
                    </NCModal.Header>
                    <Body>
                        {createContent()}
                    </Body>
                    <NCModal.Footer>
                        <NCButton onClick={this.onQuickDefineSave.bind(this)} colors="primary">{this.state.json['10140RACK-000029']}</NCButton>{/* 国际化处理： 确定*/}
                        <NCButton onClick={this.onCloseCancelModal.bind(this)}>{this.state.json['10140RACK-000030']}</NCButton>{/* 国际化处理： 取消*/}
                    </NCModal.Footer>
                </NCModal>
                <PrintOutput
                    ref='printOutput'
                    url={urls.printUrl}
                    data={{
                        funcode: '10140RACK',
                        oids: this.state.printPks,
                        outputType: "output",
                        nodekey: 'packprint',//增加nodekey
                    }}
                >
                </PrintOutput>
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName='uapbd'//模块名
                    billType='rack_org'//单据类型
                    selectedPKS={[]}
                    exportTreeUrl={"/nccloud/uapbd/rack/RackExportSetVolumeUnit.do"}
                    appcode='10140RACK'
                    pagecode="10140RACK_card"
                />
                {createModal('modal', { noFooter: false })}
                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="header">

                    {/* 标题 title*/}

                    {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                    {/*{this.renderOrgSearchArea.bind(this)}*/}
                    <div className='header-title-search-area'>
                        {createBillHeadInfo({
                            title: (this.config.title),
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="search-box">
                        <span style={{ marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red' }}>
                            <span style={{ position: 'absolute', left: 3 }}>*</span>
                        </span>
                        {StockOrg({ ...this.state.refOrg, disabled: (this.props.form.getFormStatus(this.config.formId) && (this.props.form.getFormStatus(this.config.formId) == 'edit')) })}
                    </div>

                    <div className="search-box">
                        <span style={{ marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red' }}>
                            <span style={{ position: 'absolute', left: 3 }}>*</span>
                        </span>
                        {StorDoc({ ...this.state.refStordoc, disabled: (this.props.form.getFormStatus(this.config.formId) && (this.props.form.getFormStatus(this.config.formId) == 'edit')) })}
                    </div>
                    <span className="showOff">
                        <NCCheckbox
                            disabled={this.state.disabledShowOff}
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            onClick={this.onCheckBoxClick.bind(this)}
                            size="lg"
                        >
                            {this.state.json['10140RACK-000031']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
                    </span>


                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: "card_head",
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            //popContainer: document.querySelector('.'+this.config.formId)

                        })}

                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card" fieldid='treeId'>
                    <DragWidthCom
                        // 左树区域
                        leftDom={
                            //<div style={{width:'100%',height:800,overFlow: 'auto',paddingBottom: 200}}>

                            <ClassTree treeConfig={TreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree} />

                        }
                        // 右卡片区域
                        rightDom={
                            <div style={{ height: '100%' }}><EmptyAreaTip desc={this.state.json['10140RACK-000035']} show={cardEmpty} />
                                <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                    {createForm(this.config.formId, {
                                        onAfterEvent: this.onAfterFormEvent.bind(this),
                                        onBeforeEvent: this.onBeforeEvent.bind(this),
                                        cancelPSwitch: true
                                    })}
                                </div>
                            </div>
                        }

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='280px'
                    />
                </div>

            </div>

        )
    }
}

export default Rack_Base = createPage({
    billinfo: {
        billtype: 'form',
        pagecode: "10140RACK_card",
        headcode: "head",
    }
})(Rack_Base)














//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65