//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
import OrgSelect from "../component/org";
const { PrintOutput, ExcelImport } = high;
import CustClassTree from "../component/custclasstree";
const { NCCheckbox, NCMessage: Message, NCDiv, EmptyAreaTip } = base;
import Utils from '../../../public/utils/index';

/****************默认参数  开始***********************/
let formId = 'custclass';//卡片组件Id
let urls = {
    loadTreeDataUrl: "/nccloud/uapbd/custclass/loadcustclasstreedata.do",
    queryCardUrl: "/nccloud/uapbd/custclass/querycustclasscard.do",
    enablestateUrl: "/nccloud/uapbd/custclass/enablestate.do",
    addCardUrl: "/nccloud/uapbd/custclass/addcustclasscard.do",
    deleteUrl: '/nccloud/uapbd/custclass/deletecustclass.do',
    saveUrl: '/nccloud/uapbd/custclass/savecustclass.do',
    validateUrl: '/nccloud/uapbd/custclass/validate.do',
    editUrl: '/nccloud/uapbd/custclass/editcustclass.do',
    cancelUrl: '/nccloud/uapbd/custclass/cancel.do',
    printUrl: '/nccloud/uapbd/custclass/printCustClass.do',
    rollbackUrl: '/nccloud/uapbd/custclass/rollbackCode.do'
};
let pageCode = "10140CCLG_custclass";//默认集团
/***************默认参数  结束********************/
/**
 * 全局主键
 * @type {string}
 */
const PK_GLOBE = 'GLOBLE00000000000000';
/**
 * 客户基本分类
 */
export default class CustClass extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {

        super(props)

        //默认集团
        this.config = Object.assign({
            title: '',
            treeId: "custClassTree",
            formId: "custclass",
            pageCode: "10140CCLG_custclass",
            nodeType: 'GROUP_NODE',
            refresh: 'uapbd/customer/custclass_grp/main/index.html',
            primaryKey: 'pk_custclass',
            urls: urls,
            actions: {
                TreeNodeAdd: 'TreeNodeAdd',
                TreeNodeEdit: 'TreeNodeEdit',
                TreeNodeDel: 'TreeNodeDel',
                Refresh: 'Refresh',
                Save: 'Save',
                Cancel: 'Cancel',
                SaveAdd: 'SaveAdd'
            },//表单所有动作
        }, props.config);

        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartCustClass = this.onStartCustClass.bind(this);
        this.onStopCustClass = this.onStopCustClass.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.setTreeStatus = this.setTreeStatus.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);
        this.checkHasChildren = this.checkHasChildren.bind(this);
        this.onCancelCustClassPrompt = this.onCancelCustClassPrompt.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty: true,
            pks: [],
            checked: false,//判断 显示停用按钮是否选中
            disabledShowOff: false,//禁用复选框
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            curOrg: '',//当前组织
            tree: {
                needEdit: true,
                showLine: false,
                needSearch: true,
                showModal: false,
            },
            oldParent: '',//原父节点
            isAdd: false,//新增标志  默认false
            disabledSearch: false,
            status: 'browse',
            json: {}
        }

        let callback = (json, status, inlt) => {
            this.state.json = json;//多语对象
            /* 国际化处理： 客户基本分类-全局,客户基本分类-集团,客户基本分类-业务单元*/
            this.config.title = this.props.config.nodeType == 'GLOBE_NODE' ? this.state.json['10140CCLG-000000'] : this.props.config.nodeType == 'GROUP_NODE' ? this.state.json['10140CCLG-000001'] : this.state.json['10140CCLG-000002'];/* 国际化处理： 客户基本分类-全局,客户基本分类-集团,客户基本分类-业务单元*/
            this.state.title = this.props.config.nodeType == 'GLOBE_NODE' ? this.state.json['10140CCLG-000000'] : this.props.config.nodeType == 'GROUP_NODE' ? this.state.json['10140CCLG-000001'] : this.state.json['10140CCLG-000002'];/* 国际化处理： 客户基本分类-全局,客户基本分类-集团,客户基本分类-业务单元*/
            //自定义根节点
            this.root = {
                "isleaf": false,
                "key": "~",
                "title": this.state.title,
                "id": "~",
                "innercode": "~",
                "pid": "",
                "refname": this.state.title,
                "refpk": "~"
            };
            this.initTemplate(props, () => {
                this.initData.call(this);
            });
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({ moduleId: '10140CCLG', domainName: 'uapbd', callback });
    }


    /**
     * 初始单据模板
     * @param props
     */
    initTemplate = (props, callback) => {

        /**
         * 页面初始设置button状态
         * @param props
         */
        const initButtonStatus = (props) => {
            //设置保存按钮不显示
            props.button.setButtonVisible('Save', false);
            //设置取消按钮不显示
            props.button.setButtonVisible('Cancel', false);
            //设置保存新增按钮不显示
            props.button.setButtonVisible('SaveAdd', false);
        }
        /**
         * 初始元数据后 设置enablestate不可编辑
         */
        const setFormEnableStateProp = (props) => {
            //获得元数据
            let meta = props.meta.getMeta();
            //判断元数据中有我的表单元数据
            if (Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(props.config.formId)) {
                //获得表单元数据
                let formMeta = props.meta.getMeta()[props.config.formId];
                //判断表单元数据有属性
                if (formMeta.hasOwnProperty("items")) {
                    //获得属性
                    let items = formMeta.items;
                    if (Object.prototype.toString.call(items).slice(8, -1) === 'Array') {
                        items.map((item) => {
                            //查找enablestate属性
                            if (item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate') {
                                //设置enablestate属性不可用
                                props.form.setFormItemsDisabled(props.config.formId, { enablestate: true });
                            }
                        });
                    }
                }
            }
        }

        props.createUIDom(
            { pagecode: props.config.pageCode },
            (data) => {
                //页面模板
                if (data.template) {
                    data.template[props.config.formId].items.forEach((temp) => {
                        //上级客户分类参照条件
                        if (temp.attrcode == 'parent_id') {
                            temp.refcode = "uapbd/refer/customer/CustClassDefaultTreeRef/index.js";
                            temp.queryCondition = () => {
                                return {
                                    pk_org: this.props.config.nodeType == 'GLOBE_NODE' ? PK_GLOBE : (this.props.config.nodeType == 'ORG_NODE' ? this.state.curOrg.refpk : null),
                                };
                            }
                        }
                    });
                    props.meta.setMeta(data.template);
                    //设置表单停启用开关状态
                    setFormEnableStateProp(props);
                }
                //按钮
                if (data.button) {
                    let excelimportconfig = excelImportconfig(props, 'uapbd', props.config.billType, true, '', { appcode: props.config.appcode, pagecode: props.config.pageCode }, () => {
                        this.onRefreshCustClass.call(this);
                    });
                    props.button.setUploadConfig("import", excelimportconfig);
                    props.button.setButtons(data.button);
                    //初始按钮状态
                    initButtonStatus(props);
                }
                //业务单元加载个性化设置的组织
                if (props.config.nodeType == 'ORG_NODE' && data.context && data.context.pk_org) {
                    this.setState({ curOrg: { refname: data.context.org_Name, refpk: data.context.pk_org } }, () => {
                        this.OrgSelect.onOrgChange(this.state.curOrg);
                    });
                }
                callback && callback();
            }
        );
    }

    componentDidUpdate() {
        if (this.state.status != 'browse') {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                // ajax({
                //     url:this.config.urls.rollbackUrl,
                //     data:{pk_curOrg:this.state.curOrg.refpk,nodeType:this.config.nodeType},
                //     success:(res)=>{
                //         return '';
                //     }
                // })
                return '';
            };
        } else {

            window.onbeforeunload = null;
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
                addIcon: false,
                editIcon: false,
                delIcon: false
            };
            if (!node.children || node.children.length == 0) {

                delete node.children;
            }
            else {
                node.isLeaf = false;
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach((e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount() {
        //this.initData.call(this);
        //修改按钮状态
        // this.initButtonStatus();

    }
    initData() {
        if (this.config.nodeType != 'ORG_NODE') {
            ///不是业务单元节点，直接加载树节点数据
            this.loadTreeData();
        } else {
            //是业务单元节点
            if (!this.state.curOrg || this.state.curOrg == '' || !this.state.curOrg.hasOwnProperty('refpk')) {
                this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData([Object.assign(this.root)]));
                this.props.syncTree.setNodeDisable(this.config.treeId, true);
                this.props.button.setButtonDisabled(['Print', 'Menu_Print', 'Menu_Output', 'Refresh'], true);
                //禁用
                this.state.disabledShowOff = true;
                this.state.disabledSearch = true;
                this.setState(this.state)
            }
        }
        ;
    }
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value) { //选择行政组织钩子
        this.state.curOrg = value;
        this.setReferMeta.call(this);
        this.state.disabledShowOff = !value || value == '' || !value.hasOwnProperty("refpk");
        if (value && value.refpk) {
            this.state.cardEmpty = false
        } else {
            this.state.cardEmpty = true
        }
        this.setState(this.state, () => {
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
            this.state.disabledShowOff ? this.initData() : this.loadTreeData();
            this.props.button.setButtonDisabled(['Refresh'], false);
            this.props.meta.getMeta()[this.props.config.formId].items.find(temp => {
                //上级客户分类参照条件
                if (temp.attrcode == 'parent_id') {
                    temp.refcode = "uapbd/refer/customer/CustClassDefaultTreeRef/index.js";
                    temp.queryCondition = () => {
                        return {
                            pk_org: value && value.refpk
                        };
                    }
                    return true;
                }
            })

        });
    }

    setReferMeta() {
        if (this.props.meta.getMeta() && this.props.meta.getMeta().hasOwnProperty(this.config.formId)) {
            this.props.meta.getMeta()[this.config.formId].items.map((temp) => {
                if (temp.attrcode == 'parent_id') {
                    temp.refcode = "uapbd/refer/customer/CustClassDefaultTreeRef/index.js";
                    if (this.config.nodeType == "ORG_NODE") {
                        temp.queryCondition = () => {
                            return {
                                nodeType: this.config.nodeType,
                                pk_org: this.state.curOrg.refpk,
                            };
                        }
                    }
                }
            })
        }
    }
    /**
     * 加载树节点数据
     */
    loadTreeData(callback) {
        debugger
        /*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string,nodeType:string}}
         *****************************************************************/
        let requestParam = {
            isShowOff: this.state.checked,
            pk_curOrg: this.state.curOrg.refpk,//当前选择的组织pk
            nodeType: this.config.nodeType
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
                    if (result.data && result.data.length > 0) {
                        this.setState({ cardEmpty: false })
                    } else {
                        if (this.config.nodeType != 'ORG_NODE') {
                            this.setState({ cardEmpty: true })
                        }
                    }
                    let data = [Object.assign(this.root, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    //根据有无数据 设置按钮的可用性
                    this.props.button.setButtonDisabled(['Print', 'Menu_Print', 'Menu_Output'], !(result.data && result.data.length > 0));
                    //加载完数据之后默认选中第一个节点
                    if (result.data && result.data.length > 0) {
                        //选中第一个节点
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].key)
                        //加载数据
                        this.onSelectTree(result.data[0].key)
                    }
                    this.setTreeStatus();
                    //禁用
                    this.setState({ disabledShowOff: false }, () => {
                        callback && callback();
                    });
                }
            }
        });
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus() {
        //设置保存按钮不显示
        this.props.button.setButtonVisible('save', false);
        //设置取消按钮不显示
        this.props.button.setButtonVisible('cancel', false);
        //设置保存新增按钮不显示
        this.props.button.setButtonVisible('saveAdd', false);
        this.props.button.setButtonVisible('refresh', true);
    }

    /**
     * 设置树的状态
     */
    setTreeStatus() {
        this.props.syncTree.setNodeDisable(this.config.treeId, false);
        this.setState({ disabledSearch: false });
        if (this.config.nodeType == 'ORG_NODE') {
            if (!this.state.curOrg || this.state.curOrg == '') {
                this.props.syncTree.setNodeDisable(this.config.treeId, true);//业务单元，没有组织情况下，设置整棵树不可用
                this.setState({ disabledSearch: true });
            } else {
                this.props.syncTree.setNodeDisable(this.config.treeId, false);
                this.setState({ disabledSearch: false });
            }
        }
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
        this.setPrintButtonStatus(refpk == this.root.refpk)
        /******************************************************
         * 判断点击的是否是根节点
         ******************************************************/
        if (refpk == this.root.refpk) {
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
            return;
        }
        /******************************************************
         * 请求参数
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         ******************************************************/
        let requestParam = {
            isShowOff: this.state.checked,
            primaryKey: refpk,
            pk_curOrg: this.state.curOrg.refpk,
            nodeType: this.config.nodeType
        };
        /******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: requestParam,
            success: (result) => {

                if (result.success) {
                    //显示公式
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                [this.config.formId]: 'form'
                            }
                        );
                    }
                    if (result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')) {
                        debugger
                        var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'], 'form');
                        if (!!enablestateObj) {
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                        }

                    }

                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });

                    /************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
                    let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                    this.state.curSelectedNode = selectedTreeNode;
                    this.setState(this.state);
                }
            }
        });
    }
    setPrintButtonStatus = (flag) => {
        this.props.button.setButtonDisabled(['Print', 'Menu_Print', 'Menu_Output'], flag);
    }
    /**
     * 新增
     * @param selectNode
     */
    onAddCustClass(selectNode) {
        if (this.checkTreeNodeIsDisabled(selectNode)) {
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
            pk_curOrg: this.state.curOrg.refpk,
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
                    //显示公式
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                [this.config.formId]: 'form'
                            }
                        );
                    }
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'add');

                    /*******************************
                    * 回调成功后  设置新增标志
                    * @type {boolean}
                    *******************************/
                    this.state.isAdd = true;
                    this.state.disabledShowOff = true;
                    this.state.disabledSearch = true;
                    this.state.status = 'add';
                    this.state.cardEmpty = false;
                    this.setState(this.state, () => {
                        //表单数据
                        // let headData = result.data[this.config.formId].rows[0].values;
                        // if(headData.hasOwnProperty('enablestate')){
                        //     let enablestateValue = headData.enablestate.value;
                        //     //根据表单项enablestate的值修改开关状态
                        //     if(enablestateValue == '2'){
                        //         result.data[this.config.formId].rows[0].values.enablestate.value = true;
                        //         result.data[this.config.formId].rows[0].values.enablestate.display = true;
                        //     }else{
                        //         result.data[this.config.formId].rows[0].values.enablestate.value = false;
                        //         result.data[this.config.formId].rows[0].values.enablestate.display = false;
                        //     }
                        // }

                        //设置新增默认值
                        this.props.form.setAllFormValue({ [this.config.formId]: this.filterEmptyData(result.data[this.config.formId].rows[0].values, this.state.status) });

                        //设置表单项不可用
                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                        this.setCustClassCodeEditStatus(result.data.userjson == 'Y')
                        this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                        //新增成功，设置按钮状态
                        this.changeButtonStatus(selectNode, this.config.actions.TreeNodeAdd);
                    });
                }
            }
        })
    }
    filterEmptyData = (data, status) => {
        const isObject = function (param) {
            return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
        }
        if (!isObject(data) || status != 'add') {
            return { rows: [{ values: data }] };
        }
        let filterData = new Object();
        Object.keys(data).forEach(key => {
            data[key] && (data[key].value || data[key].display) && Object.assign(filterData, { [key]: data[key] });
        })
        return { rows: [{ values: filterData }] };
    }
    setCustClassCodeEditStatus = (flag) => {
        this.props.form.setFormItemsDisabled(this.config.formId, { 'code': flag });
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
    onEditCustClass(selectedTreeNode) {
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
            Message.create({ content: this.state.json['10140CCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }
        /**************************************************
         * 请求参数对象
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         **************************************************/
        let requestParam = {
            primaryKey: this.state.curSelectedNode.refpk,
            pk_curOrg: this.state.curOrg.refpk,
            nodeType: this.config.nodeType
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
                                //显示公式
                                if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                    this.props.dealFormulamsg(
                                        result.formulamsg,
                                        {
                                            [this.config.formId]: 'form'
                                        }
                                    );
                                }
                                this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                                //  //编辑时改为123
                                // var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'db');
                                // result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                //设置表单数据
                                this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
                                //设置表单项不可用
                                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                                //设置表单状态为编辑态
                                this.props.form.setFormStatus(this.config.formId, 'edit');
                                this.changeButtonStatus(this.state.curSelectedNode, this.config.actions.TreeNodeEdit);
                                this.setState({ isAdd: false, disabledShowOff: true, disabledSearch: true, status: 'edit' });
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
                if (data.hasOwnProperty('children') && data['children'] != null && data.children.length === 0) {
                    delete data.children;
                    data.isleaf = true;
                }
                return true;
            } else {
                if (data.hasOwnProperty('children') && data['children'] != null) {
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
    onSaveCustClass() {
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
            debugger
            var enablestateObj = Utils.convertEnableState(formData.rows[0].values['enablestate'], 'db');
            if (!!enablestateObj) {
                formData.rows[0].values['enablestate'] = enablestateObj;
            }

        }

        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.config.nodeType,
            pk_curOrg: this.state.curOrg.refpk || "",
        };
        let data = {
            model: formData,
            pageid: this.config.pageCode
        }
        this.props.validateToSave(data, () => {
            /**************************************************************
             *  没有主键  false时就是有主键  即编辑 即刷新父节点
             **************************************************************/
            let nonPk = !(!!formData.rows[0].values[this.config.primaryKey].value);
            // if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            //     nonPk = (!!formData.rows[0].values[this.config.primaryKey].value)? false:true;
            // }
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        //显示公式
                        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.config.formId]: 'form'
                                }
                            );
                        }
                        /**************************************************************
                         * 去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                         **************************************************************/
                        if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         * 是否是移动节点
                         **************************************************************/
                        let isMove = result.data.treeNodeData[0].pid != this.state.oldParent;
                        // if(result.data.treeNodeData[0].pid!=this.state.oldParent){
                        //     isMove = true;
                        // }
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
                            this.checkHasChildren(null, this.state.oldParent);
                        }
                        /**************************************************************
                         * 展开当前树节点
                         **************************************************************/
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
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
                        this.props.form.setAllFormValue({ [this.config.formId]: result.data.curFormData[this.config.formId] });
                        /**************************************************************
                         * 设置enablestate属性为可用状态
                         **************************************************************/

                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                        /**************************************************************
                         * 设置按钮状态
                         **************************************************************/
                        this.changeButtonStatus(this.state.curSelectedNode, this.config.actions['Save']);
                        /**************************************************************
                         *  设置树可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        /**************************************************************
                         * 清空选中节点的缓存
                         **************************************************************/
                        this.setState({ curSelectedNode: null, disabledShowOff: false, disabledSearch: false, status: 'browse' }, () => {
                            toast({ title: this.state.json['10140CCLG-000004'], color: 'success' });/* 国际化处理： 保存成功！*/
                        });
                    }
                }
            });
        }, { [this.config.formId]: 'form' }, 'form');
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
    onSaveAddCustClass() {
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
            debugger
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
            pk_curOrg: this.state.curOrg.refpk
        };
        let data = {
            model: formData,
            pageid: this.config.pageCode
        }
        this.props.validateToSave(data, () => {

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
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);

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
                            pk_curOrg: this.state.curOrg.refpk
                        };
                        /**************************************************************
                         * 记录原父节点pk 移动时使用
                         **************************************************************/
                        this.setState({ oldParent: requestParam.parent_id, isAdd: true, disabledSearch: true });
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {
                                    //显示公式
                                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                        this.props.dealFormulamsg(
                                            result.formulamsg,
                                            {
                                                [this.config.formId]: 'form'
                                            }
                                        );
                                    }
                                    /**************************************************************
                                     * 清空表单数据
                                     **************************************************************/
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    /**************************************************************
                                     * 设置表单为编辑态
                                     **************************************************************/
                                    this.props.form.setFormStatus(this.config.formId, 'add');
                                    /**************************************************************
                                     * 回调成功后  设置新增标志
                                     * @type {boolean}
                                     **************************************************************/
                                    this.state.isAdd = true;
                                    this.state.status = 'add';
                                    this.setState(this.state, () => {
                                        /**************************************************************
                                         * 重置表单数据
                                         **************************************************************/
                                        //表单数据
                                        let headData = result.data[this.config.formId].rows[0].values;
                                        if (headData.hasOwnProperty('enablestate')) {
                                            let enablestateValue = headData.enablestate.value;
                                            //根据表单项enablestate的值修改开关状态
                                            // if(enablestateValue == '2'){
                                            //     result.data[this.config.formId].rows[0].values.enablestate.value = true;
                                            //     result.data[this.config.formId].rows[0].values.enablestate.display = true;
                                            // }else{
                                            //     result.data[this.config.formId].rows[0].values.enablestate.value = false;
                                            //     result.data[this.config.formId].rows[0].values.enablestate.display = false;
                                            // }
                                        }
                                        this.props.form.setAllFormValue({ [this.config.formId]: this.filterEmptyData(result.data[this.config.formId].rows[0].values, this.state.status) });
                                        /**************************************************************
                                         * 设置编码项是否可编辑
                                         **************************************************************/
                                        this.setCustClassCodeEditStatus(result.data.userjson == 'Y')

                                        /**************************************************************
                                         * 重新设置按钮状态
                                         **************************************************************/
                                        this.changeButtonStatus(selectedTreeNode, this.config.actions['SaveAdd']);
                                    });



                                }
                            }

                        })
                    }


                }
            });
        }, { [this.config.formId]: 'form' }, 'form');
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
    onDeleteCustClass(selectedTreeNode) {
        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        /**************************************************************
         * 保障性操作
         **************************************************************/
        if (!selectedTreeNode) {
            Message.create({ content: this.state.json['10140CCLG-000005'], color: 'warning' });/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        /**************************************************************
         * 根节点不能删除
         **************************************************************/
        if (selectedTreeNode.refpk == this.root.refpk) {
            Message.create({ content: this.state.json['10140CCLG-000006'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
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
            pk_curOrg: this.state.curOrg.refpk,
            ts: selectedTreeNode.nodeData.ts,
            nodeType: this.config.nodeType
        };
        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (result) => {
                /**************************************************************
                 * 先校验有无删除权限，能删除在做下一步操作
                 **************************************************************/
                if (result.success && result.data) {
                    // promptBox({
                    //     title: this.state.json['10140CCLG-000007'],/* 国际化处理： 确认删除*/
                    //     content: this.state.json['10140CCLG-000008'],/* 国际化处理： 您确定要删除所选数据吗?*/
                    //     beSureBtnClick: ()=>{
                    promptBox({
                        title: this.state.json['10140CCLG-000007'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140CCLG-000009'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
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
                                         * 删除后设置启用停用不可用
                                         **************************************************************/
                                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                                        /**************************************************************
                                         * 删除成功提示
                                         **************************************************************/
                                        if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0)) {
                                            this.setState({ cardEmpty: true })
                                        }
                                        toast({ title: this.state.json['10140CCLG-000010'], color: 'success' });/* 国际化处理： 删除成功！*/
                                        /**************************************************************
                                         * 重新设置按钮状态
                                         **************************************************************/
                                        this.changeButtonStatus(selectedTreeNode, this.config.actions.TreeNodeDel);
                                    }

                                }
                            })
                        }
                    });
                    //     }
                    // });
                }

            }
        });

    }
    onCancelCustClassPrompt = (callback) => {
        promptBox({
            title: this.state.json['10140CCLG-000011'],/* 国际化处理： 确认取消*/
            content: this.state.json['10140CCLG-000012'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: function () {
                callback && callback();
            }.bind(this)
        })
    }
    /**********************************************************
     *
     * 取消：
     *      1、重新根据选中的树节点查询表单对象
     *      2、回调，设置表单对象
     *      3、设置按钮状态
     *
     **********************************************************/
    onCancelCustClass = () => {

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
            pk_curOrg: this.state.curOrg.refpk,
            primaryKey: selectedTreeNode.refpk,
            nodeType: this.config.nodeType,
            isAdd: this.state.isAdd,
        };
        if (selectedTreeNode) {
            if (selectedTreeNode.refpk == '~') {
                ajax({
                    url: this.config.urls.rollbackUrl,
                    data: requestParam,
                    success: (res) => {
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
                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
                        /**********************************************************
                         * 设置按钮状态
                         **********************************************************/
                        this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
                    }
                })
            } else {
                //查询节点信息
                ajax({
                    url: this.config.urls.cancelUrl,
                    data: requestParam,
                    success: (result) => {
                        if (result.success) {
                            //显示公式
                            if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                this.props.dealFormulamsg(
                                    result.formulamsg,
                                    {
                                        [this.config.formId]: 'form'
                                    }
                                );
                            }
                            //取消时  启用状态改为 true/false
                            var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'], 'form');
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                            /**********************************************************
                             * 重置表单数据
                             **********************************************************/
                            this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
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
            if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue("custClassTree")[0].children || this.props.syncTree.getSyncTreeValue("custClassTree")[0].children.length === 0)) {
                this.state.cardEmpty = true;
            }
            this.setState({ disabledSearch: false, disabledShowOff: false, status: 'browse' });

        }

    }

    /**
     * 启用
     */
    onStartCustClass() {
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

            Message.create({ content: this.state.json['10140CCLG-000013'], color: 'warning' });//默认top/* 国际化处理： 请选中需要启用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '2') {
            Message.create({ content: this.state.json['10140CCLG-000014'], color: 'warning' });//默认top/* 国际化处理： 该数据已启用，无需多次启用*/
            return;
        }
        requestParam = {
            primaryKey: formData.rows[0].values[this.config.primaryKey].value,
            enablestate: '2',
            pk_curOrg: this.state.curOrg.refpk,
            nodeType: this.config.nodeType
        };
        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (result) => {
                //启用成功，设置表单数据
                this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
                //关闭 展开，可以做一个refreshTreeNode方法
                // this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                this.changeButtonStatus('Start');
            }
        });

    }

    /**
     * 停用
     */
    onStopCustClass() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if (!selectedTreeNode) {

            Message.create({ content: this.state.json['10140CCLG-000015'], color: 'warning' });//默认top/* 国际化处理： 请选中需要停用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '1') {
            Message.create({ content: this.state.json['10140CCLG-000016'], color: 'warning' });//默认top/* 国际化处理： 该数据已停用，无需多次停用*/
            return;
        }
        requestParam = {
            primaryKey: formData.rows[0].values[this.config.primaryKey].value,
            enablestate: '1',
            pk_curOrg: this.state.curOrg.refpk,
            nodeType: this.config.nodeType
        }

        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (res) => {
                if (res.success) {

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.changeButtonStatus('Stop');
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
        debugger
        switch (id) {
            case this.config.actions.TreeNodeAdd:
            case this.config.actions.SaveAdd:
                this.props.button.setButtonVisible('Refresh', false);
                this.props.button.setButtonVisible('Save', true);
                this.props.button.setButtonVisible('SaveAdd', true);
                this.props.button.setButtonVisible('Cancel', true);
                this.props.button.setButtonVisible('Print', false);
                this.props.button.setButtonVisible('export', false);
                this.props.button.setButtonVisible('import', false);
                this.props.button.setDisabled({
                    save: false,
                    saveAdd: false,
                    cancel: false
                });

                break;
            case this.config.actions.TreeNodeEdit:
                this.props.button.setButtonVisible('Refresh', false);
                this.props.button.setButtonVisible('Save', true);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', true);
                this.props.button.setButtonVisible('Print', false);
                this.props.button.setButtonVisible('export', false);
                this.props.button.setButtonVisible('import', false);
                this.props.button.setDisabled({
                    save: false,
                    cancel: false
                });
                break;
            case this.config.actions.TreeNodeDel:
                this.props.button.setButtonVisible('Refresh', true);
                this.props.button.setButtonVisible('Save', false);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', false);
                this.props.button.setButtonVisible('Print', true);
                this.props.button.setButtonVisible('import', true);
                this.props.button.setButtonVisible('export', true);
                break;
            case this.config.actions.Save:
            case this.config.actions.Cancel:
                this.props.button.setButtonVisible('Refresh', true);
                this.props.button.setButtonVisible('Save', false);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', false);
                this.props.button.setButtonVisible('Print', true);
                this.props.button.setButtonVisible('import', true);
                this.props.button.setButtonVisible('export', true);

            default:
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key, node) {

        let obj = {
            delIcon: false, //false:隐藏； true:显示; 默认都为true显示
            editIcon: false,
            addIcon: true
        }
        if (key == this.root.refpk) {
            obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
        } else {
            let { isGlobeData, isGroupData, isOrgData } = node.nodeData;
            //态low态low态low态low态low态low
            switch (this.config.nodeType) {
                case 'GLOBE_NODE'://全局节点
                    if (isGlobeData) {//全局数据
                        obj = {
                            delIcon: true,
                            editIcon: true,
                            addIcon: true
                        }
                    } else if (isGroupData || isOrgData) {//非全局数据
                        obj = {
                            delIcon: false,
                            editIcon: false,
                            addIcon: false
                        }
                    }
                    break;
                case 'GROUP_NODE':
                    if (isGroupData) {
                        obj = {
                            delIcon: true,
                            editIcon: true,
                            addIcon: true
                        }
                    } else if (isGlobeData) {
                        obj = {
                            delIcon: false,
                            editIcon: false,
                            addIcon: true
                        }
                    }
                    break;
                case 'ORG_NODE':
                    if (isOrgData) {
                        obj = {
                            delIcon: true,
                            editIcon: true,
                            addIcon: true
                        }
                    } else {
                        obj = {
                            delIcon: false,
                            editIcon: false,
                            addIcon: true
                        }
                    }
                    break;
            }
        }
        this.props.syncTree.hideIcon(this.config.treeId, key, obj);

    }

    /**
     * checkbox change 事件
     */
    onCheckBoxChange() {
        if (this.state.disabledShowOff) {
            return;
        }
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
        this.setState({ checked: !this.state.checked }, () => {
            let requestParam = {
                isShowOff: this.state.checked,
                pk_curOrg: this.state.curOrg.refpk,
                nodeType: this.config.nodeType,
            };
            ajax({
                url: this.config.urls.loadTreeDataUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        var data = [Object.assign({ ...this.root }, { children: result.data })],
                            initLeaf = function (node) {
                                node.iconBox = {
                                    addIcon: false,
                                    editIcon: false,
                                    delIcon: false
                                };
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

                        //同步树 加载全部数据
                        this.props.syncTree.setSyncTreeData(this.config.treeId, data);
                        //展开节点  设置默认展开项
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                        if (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0) {
                            this.setState({ cardEmpty: true })
                        } else {
                            this.setState({ cardEmpty: false })
                        }
                    }

                }
            })
        });

    }

    /**
     * 编辑前事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param data
     * @returns {boolean}
     */
    onBeforeFormEvent = (props, moduleId, key, value, data) => {
        if (this.state.isAdd) {
            return true;
        }
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        return this.checkCurNodeEnableStateAuth.call(this, selectedTreeNode);
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
                let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);

                if (!selectedTreeNode) {
                    let content = value.value ? this.state.json['10140CCLG-000013'] : this.state.json['10140CCLG-000015'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    Message.create({ content: content, color: 'warning' });//默认top
                    return;
                }
                let requestParam = {
                    primaryKey: selectedTreeNode.refpk,
                    enablestate: value.value ? '2' : '1',
                    pk_curOrg: this.state.curOrg.refpk,
                    ts: selectedTreeNode.nodeData.ts,
                    nodeType: this.config.nodeType
                };
                // if(!this.checkCurNodeEnableStateAuth(selectedTreeNode)){
                //     props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                //     return;
                // }
                promptBox({
                    color: "warning",
                    title: this.state.json['10140CCLG-000017'],/* 国际化处理： 提示*/
                    content: value.value ? this.state.json['10140CCLG-000018'] : this.state.json['10140CCLG-000019'],/* 国际化处理： 是否确认要启用？,您确定要停用所选数据及其所有下级数据吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: this.config.urls.enablestateUrl,
                            data: requestParam,
                            success: (result) => {
                                // !value.value ? props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk):null;
                                /****
                                 * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                 * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                 */
                                toast({ title: value.value ? this.state.json['10140CCLG-000020'] : this.state.json['10140CCLG-000021'], color: 'success' });/* 国际化处理： 启用成功！,停用成功！*/
                            }
                        });
                    },
                    cancelBtnClick: () => {
                        props.form.setFormItemsValue(this.config.formId, { enablestate: { value: !value.value, display: !value.value } });
                        return;
                    }
                });
                break;
            default:
                break;
        }
    }
    checkCurNodeEnableStateAuth = (node) => {
        if (node.refpk == 'root' || node.refpk == '~') {
            return true;
        }
        if (!node.nodeData.isGlobeData && this.config.nodeType == 'GLOBE_NODE') {
            toast({ content: this.state.json['10140CCLG-000022'], color: 'warning' });/* 国际化处理： 全局只能维护全局的数据！*/
            return false;
        } else if (!node.nodeData.isGroupData && this.config.nodeType == 'GROUP_NODE') {
            toast({ content: this.state.json['10140CCLG-000023'], color: 'warning' });/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
            return false;
        } else if (!node.nodeData.isOrgData && this.config.nodeType == 'ORG_NODE') {
            toast({ content: this.state.json['10140CCLG-000024'], color: 'warning' });/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
            return false;
        }
        return true;
    }
    /**
     * 刷新
     */
    onRefreshCustClass() {
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
        this.loadTreeData(() => {
            toast({ title: this.state.json['10140CCLG-000025'], color: 'success' });/* 国际化处理： 刷新成功！*/
        });
    }
    onButtonClick(props, id) {
        debugger
        switch (id) {
            case this.config.actions.Refresh:
                this.onRefreshCustClass.call(this);
                break;
            case this.config.actions.Save:
                this.onSaveCustClass.call(this);
                break;
            case this.config.actions.SaveAdd:
                this.onSaveAddCustClass.call(this);
                break;
            case this.config.actions.Cancel:
                this.onCancelCustClassPrompt(this.onCancelCustClass);
                break;
            case 'Print':
                this.printAndOutput('print');
                break;
            case 'Menu_Print':
                this.printAndOutput('print');
                break;
            case 'Menu_Output':
                this.printAndOutput('output');
                break;
            case 'export':
                this.setState(this.state, () => {
                    this.props.modal.show('exportFileModal');
                });
                break;
            default: break;
        }
    }
    /**
     * 通过 查询 pub_print_template表 只能查询appcode为10140CCLB的打印模板所以，这里funcode写成定值了
     *  @2018-07-16
     * @param flag
     */
    printAndOutput = (flag) => {
        let treeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        if (treeData) {
            let pks = this.getTreeAllPks(treeData);
            if (!pks || pks.length === 0) {
                toast({ content: this.state.json['10140CCLG-000026'], color: "warning" });/* 国际化处理： 没有打印的数据！*/
                return;
            }
            if (flag === 'print') {
                print('pdf', this.config.urls.printUrl,
                    {
                        //billtype:'',        //没有就不传，不能传空字符
                        funcode: '10140CCLB',
                        nodekey: '10140CCLB',  //需要与数据库保持一致
                        oids: pks,
                        // outputType:flag
                    });
            } else {
                this.setState({
                    pks: pks
                }, this.refs.printOutput.open());
            }
        }
    }

    addClickCall = () => {
        // 新增按钮触发左侧树新增逻辑 
        // this.setState({
        //     cardEmpty: false
        // });
        this.onAddCustClass(this.root)
    }

    getTreeAllPks = (treeData) => {
        let result = new Array();
        const loop = (treeDatas) => {
            treeDatas && treeDatas.forEach(data => {
                if (data.refpk != '~') {
                    result.push(data.refpk);
                }
                if (data.hasOwnProperty('children') && data.children && data.children.length > 0) {
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }
    checkTreeNodeIsDisabled(node) {
        return !!node.disabled;
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
        const { createBillHeadInfo } = BillHeadInfo; //新加 返回图标和按钮
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个

        const { createForm } = form;//创建表单，需要引入这个

        const { createButtonApp } = button;

        const { cardEmpty } = this.state;

        let { createModal } = ncmodal;  //模态框

        /**
         * 组织选择区 参数
         **/
        let orgParam = {
            curOrg: this.state.curOrg,
            onOrgChange: this.onOrgChange.bind(this),
            status: this.state.status,
            queryCondition: {
                'AppCode': '10140CCLO',
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        };
        /**
         * 树参数
         **/
        let custTreeParam = {
            treeId: this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            onMouseEnterEve: this.onMouseEnterEve.bind(this),
            clickAddIconEve: this.onAddCustClass.bind(this), //新增点击 回调
            clickEditIconEve: this.onEditCustClass.bind(this), //编辑点击 回调
            clickDelIconEve: this.onDeleteCustClass.bind(this), // 删除点击 回调
            showModal: this.state.tree.showModal,
            disabledSearch: this.state.disabledSearch
        };
        return (
            <div className="nc-bill-tree-card">

                {createModal('modal', {
                    noFooter: false,
                    //rightBtnName : '关闭', //左侧按钮名称,默认关闭
                    leftBtnName: this.state.json['10140CCLG-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 确定*/
                })}
                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="header">
                        {createBillHeadInfo(
                            {
                                title: this.state.title,
                                initShowBackBtn: false,
                                backBtnClick: () => { }
                            }
                        )}
                        {/* {createPageIcon()} */}
                        {/* 标题 title*/}
                        {/* <div className="title" fieldid ={this.state.title+'_title'}>{this.state.title}</div> */}
                        {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                        {/*{this.renderOrgSearchArea.bind(this)}*/}
                        {this.config.nodeType == 'ORG_NODE' &&
                            <div className="search-box" style={{ width: 200 }}>
                                {/*组织选择区域*/}
                                <OrgSelect fieldid={'orgunit'} config={orgParam} ref={(OrgSelect) => { this.OrgSelect = OrgSelect; }} />
                            </div>
                        }
                        <span className="showOff">
                            <NCCheckbox
                                disabled={this.state.disabledShowOff}
                                defaultChecked={false}
                                checked={this.state.checked}
                                onChange={this.onCheckBoxChange.bind(this)}
                                // onClick={this.onCheckBoxClick.bind(this)}
                                size="lg"
                            >
                                {this.state.json['10140CCLG-000028']/* 国际化处理： 显示停用*/}
                            </NCCheckbox>
                        </span>
                        {/* 按钮组 btn-group*/}
                        <div className=" btn-group">
                            {createButtonApp({
                                area: this.config.formId,
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.' + this.config.formId)

                            })}
                            {/*{ createButton('refresh', {name: '刷新',buttonColor:'main-button',style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onRefreshCustClass.bind(this) })}*/}
                            {/*{ createButton('save', {name: '保存',buttonColor:'main-button',style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onSaveCustClass.bind(this) })}*/}
                            {/*{ createButton('saveAdd', {name: '保存新增',buttonColor:'secondary-button',style:{height:'32px','line-height':'33px',width:'80px','font-size':'13px','font-family':'PingFangHk'}, onButtonClick: this.onSaveAddCustClass.bind(this) })}*/}
                            {/*{ createButton('cancel', {name: '取消',buttonColor:'secondary-button', style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onCancelCustClass.bind(this) })}*/}

                        </div>
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom

                        // 左树区域
                        leftDom={<CustClassTree treeConfig={custTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree} />}

                        // 右卡片区域
                        rightDom={<div style={{ height: '100%' }}>
                            {this.config.nodeType != 'ORG_NODE' ? <EmptyAreaTip
                                type="btn"
                                desc={this.state.json['10140CCLG-000029']}
                                onClick={this.addClickCall}
                                show={cardEmpty} /> : <EmptyAreaTip
                                    desc={this.state.json['10140CCLG-000030']}
                                    show={cardEmpty} />}
                            <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                {createForm(this.config.formId, {
                                    onAfterEvent: this.onAfterFormEvent.bind(this),
                                    onBeforeEvent: this.onBeforeFormEvent,
                                    cancelPSwitch: true
                                })}
                            </div>
                        </div>}

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='280px'
                        leftMinWid='300px'
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={this.config.urls.printUrl}
                    data={{
                        funcode: '10140CCLB',
                        nodekey: '10140CCLB',  //需要与数据库保持一致
                        oids: this.state.pks,
                        outputType: "output"
                    }}
                //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName='uapbd'//模块名
                    billType={this.props.config.billType}//单据类型
                    selectedPKS={[]}
                    appcode={this.props.config.appcode}
                    pagecode={this.props.config.pageCode}
                />
            </div>

        )
    }
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65