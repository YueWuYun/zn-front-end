//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, cacheTools, high, promptBox, cardCache, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
// import SaleOrgTreeRef from '../../../refer/org/SaleOrgTreeRef'
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef'
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
let { setDefData, getDefData } = cardCache;
const { NCCheckbox, NCDiv, EmptyAreaTip } = base;
const { PrintOutput, ExcelImport } = high;



/****************默认参数  开始***********************/
let formId = "head";//卡片组件Id
const urls = {
    loadTreeDataUrl: "/nccloud/uapbd/custsaleclass/loadtreedata.do",
    queryTemplet: '/nccloud/platform/templet/querypage.do',
    addCardUrl: "/nccloud/uapbd/custsaleclass/addcard.do",
    queryCardUrl: "/nccloud/uapbd/custsaleclass/querycard.do",
    enablestateUrl: "/nccloud/uapbd/custsaleclass/enablestate.do",
    deleteUrl: '/nccloud/uapbd/custsaleclass/deltreenode.do',
    printUrl: '/nccloud/uapbd/custsaleclass/print.do',
    rollbackCodeUrl: '/nccloud/uapbd/custsaleclass/rollbackCode.do',
    saveUrl: '/nccloud/uapbd/custsaleclass/savenode.do'
};
let pageCode = "10140CSCLG_custsaleclass";//默认集团
/***************默认参数  结束********************/

/**
 * 客户销售分类
 */
class CustsaleClass extends Component {
    constructor(props) {
        super(props)
        this.config = Object.assign({
            treeId: "custsaleclassTree",
            formId: formId,
            pageCode: pageCode,
            nodeType: 'GROUP_NODE',
            urls: urls
        }, props.config);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty: true,
            disabledSearch: false,
            showoffDisable: true,
            codeedit: true,
            pks: [],
            json: {},
            checked: false,//判断 显示停用按钮是否选中
            curOrg: '',//客户销售分类-财务组织节点，选中的组织主键
            curSelectedNode: null //直接点击树节点操作按钮时 用于记录selectedNode
        }
        //自定义根节点
        this.root = {
            "isleaf": false,
            "key": "~",
            "title": "",
            "id": "~",
            "innercode": "~",
            "pid": "",
            "refname": "",
            "refpk": "~"
        };
        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartEps = this.onStartEps.bind(this);
        this.onStopEps = this.onStopEps.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.initTemplate(props);
    }


    //初始化单据模板
    initTemplate = (props, callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode: props.config.pageCode//页面id
                // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140CSCLG', domainName: 'uapbd'
            },
            (data, langData) => { //(data, langData)
                if (langData) {
                    this.state.json = langData
                    if (props.config.nodeType == 'GROUP_NODE') {
                        props.config.title = this.state.json['10140CSCLG-000034']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 客户销售分类*/
                    } else {
                        props.config.title = this.state.json['10140CSCLG-000035']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 客户销售分类*/

                    }
                }
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        let excelimportconfig = excelImportconfig(props, 'uapbd', props.config.billType, true, '', { appcode: props.config.appcode, pagecode: props.config.pageCode }, () => {
                            this.onRefresh();
                        });
                        props.button.setUploadConfig("import", excelimportconfig);
                        props.button.setButtons(button);
                    }
                    that.onRefresh();
                    callback && callback();
                }
            }
        )
    }


    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        //为了打印左边所有树节点
        let allpks = [];
        let deleteDataChildrenProp = function (node) {
            if (!('~' == node.refpk || node.refpk == undefined)) {
                allpks.push(node.refpk);
            }
            node.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
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
            e.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            deleteDataChildrenProp(e);
        });
        cacheTools.set('allpks', allpks);
        return data;
    }

    componentDidUpdate() {
        //form如果是编辑态，关闭浏览器需要给你提示
        let formstatus = this.props.form.getFormStatus(this.config.formId);

        if (formstatus == 'browse' || formstatus == undefined) {
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
        //修改按钮状态
        this.initButtonStatus();

    }

    onRefresh() {
        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let that = this;
        let requestParam = {
            checked: that.state.checked,
            pkorg: that.state.curOrg.refpk
        };
        //默认设置停启用不可以编辑
        that.props.form.setFormItemsDisabled(that.config.formId, { 'enablestate': true });
        /*************
         * ajax请求 加载树数据
         *************/
        ajax({
            url: that.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                //根节点名字更新
                that.root.title = this.state.json['10140CSCLG-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 客户销售分类*/
                that.root.refname = this.state.json['10140CSCLG-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 客户销售分类*/
                if (result.success) {
                    if (result.data) {
                        if (that.config.nodeType == "ORG_NODE" || (result.data.length && result.data.length > 0)) {
                            that.setState({ cardEmpty: false })
                        }
                        let data = [Object.assign({ ...that.root }, { children: result.data })];
                        //同步树  加载全部数据
                        that.props.syncTree.setSyncTreeData(that.config.treeId, that.dealTreeData(data));
                        if (that.state.curOrg.refpk != undefined) {
                            that.props.syncTree.openNodeByPk(that.config.treeId, that.root.refpk);
                            //设置默认中第一行
                            //that.props.syncTree.setNodeSelected(that.config.treeId, result.data[0].refpk);
                            // if(result.data[0].refpk!=='root'){
                            //     that.onSelectTree( result.data[0].refpk);
                            // }
                        }
                        if (that.config.nodeType === 'ORG_NODE' && that.state.curOrg.refpk == undefined) {
                            that.props.syncTree.setNodeDisable(that.config.treeId, true);//编辑时设置整棵树不可用
                            that.props.button.setButtonDisabled(['print', 'export'], true);
                        }
                        if (that.config.nodeType === 'GROUP_NODE') {
                            //that.props.syncTree.setNodeDisable(that.config.treeId,false);//编辑时设置整棵树不可用
                            //展开节点  设置默认展开项
                            that.props.syncTree.openNodeByPk(that.config.treeId, that.root.refpk);
                        }

                        if (that.config.nodeType === 'ORG_NODE' && that.state.curOrg.refpk != undefined) {
                            that.props.button.setButtonDisabled(['print', 'export', 'refresh'], false);
                            that.props.syncTree.setNodeDisable(that.config.treeId, false);//编辑时设置整棵树可用
                        }
                    } else {
                        if (that.config.nodeType != "ORG_NODE") {
                            that.setState({ cardEmpty: true })
                        }
                        let data = [{ ...that.root }];
                        that.props.syncTree.setSyncTreeData(that.config.treeId, data);
                    }
                    if (getDefData('custsaleclass_btnopr', that.props.config.datasource) == 'refresh') {
                        toast({ title: this.state.json['10140CSCLG-000001'], color: "success" });/* 国际化处理： 刷新成功！*/
                        setDefData('custsaleclass_btnopr', that.props.config.datasource, 'browse');
                    }
                }
                //浏览态，显示停用都可以勾选
                that.setState({
                    showoffDisable: false
                });
                that.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });
                //设置为浏览态
                that.props.form.setFormStatus(this.config.formId, "browse");
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
        this.props.button.setButtonVisible('saveadd', false);
        this.props.button.setButtonVisible('cancel', false);
        this.props.button.setButtonVisible('print', true);
        this.props.button.setButtonVisible('refresh', true);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk) {

        if ('~' == refpk) {
            this.props.button.setButtonDisabled(['print', 'export'], true);
        } else {
            this.props.button.setButtonDisabled(['print', 'export'], false);
        }
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if (status == 'edit') {
            return;
        }


        if (refpk == this.root.refpk) {
            //清空表单
            this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });
            this.props.form.EmptyAllFormValue(this.config.formId);
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: { pk_custsaleclass: refpk, isGlbGrp: this.config.isGlbGrp },
            success: (result) => {

                if (result.success) {

                    //查询时执行显示公式前端适配
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            result.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [this.config.formId]: "form"
                            }
                        );
                    }

                    //表单数据
                    let headData = result.data.form.head.rows[0].values;
                    if (headData.enablestate) {
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if (enablestateValue == '2') {
                            result.data.form.head.rows[0].values.enablestate.value = true;
                        } else {
                            result.data.form.head.rows[0].values.enablestate.value = false;
                        }
                    }

                    if (headData.pk_father.display == this.root.refpk) {
                        result.data.form.head.rows[0].values.pk_father.display = '';
                        result.data.form.head.rows[0].values.pk_father.value = '';
                    }
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({ head: result.data.form.head });
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': false });
                    //设置打印按钮可用
                    this.props.button.setButtonDisabled(['print', 'export'], false);
                }
            }
        });
    }


    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onBeforeFormEvent(props, moduleId, key, value, index) {

        switch (key) {
            case "enablestate":
                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

                if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode && selectedTreeNode.nodeData.isGroup) {
                    toast({ content: this.state.json['10140CSCLG-000002'], color: 'warning' });//默认top/* 国际化处理： 业务单元不能操作集团级数据！*/
                    return false;
                }

                if (this.config.nodeType === 'GROUP_NODE' && selectedTreeNode && !selectedTreeNode.nodeData.isGroup) {
                    toast({ content: this.state.json['10140CSCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 集团不能操作业务单元级数据！*/
                    return false;
                }
                return true;
                break;
            default:
                return true;
                break;
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
                    let content = value.value ? this.state.json['10140CSCLG-000004'] : this.state.json['10140CSCLG-000005'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点！*/
                    toast({ content: content, color: 'warning' });//默认top
                    return;
                }
                let requestParam = { pk_custsaleclass: selectedTreeNode.refpk, enablestate: value.value ? '2' : '1' };

                promptBox({
                    color: 'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: value.value ? this.state.json['10140CSCLG-000006'] : this.state.json['10140CSCLG-000036'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn: false,
                    content: value.value ? this.state.json['10140CSCLG-000007'] : this.state.json['10140CSCLG-000008'],/* 国际化处理： 您确定要启用所选数据吗？,您确定要停用所选数据及其所有下级数据吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: this.config.urls.enablestateUrl,
                            data: requestParam,
                            success: (result) => {
                                toast({ color: 'success', title: value.value ? this.state.json['10140CSCLG-000009'] : this.state.json['10140CSCLG-000010'] });/* 国际化处理： 启用成功！,停用成功！*/
                            },
                            error: (result) => {
                                if (value.value) {
                                    props.form.setFormItemsValue(this.config.formId, { enablestate: { value: false, display: null } });
                                } else {
                                    props.form.setFormItemsValue(this.config.formId, { enablestate: { value: true, display: null } });
                                }
                                toast({ content: result.message, color: 'warning' });
                            }
                        });
                    }
                })
                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 新增
     */
    onAddEps(selectNode) {
        let that = this;
        if (this.config.nodeType === 'ORG_NODE' && !this.state.curOrg.refpk) {
            toast({ content: this.state.json['10140CSCLG-000011'], color: 'warning' });//默认top/* 国际化处理： 请选择销售组织！*/
            return;
        }
        let requestParam = { pk_org: this.state.curOrg.refpk, nodeType: this.config.nodeType, pk_father: selectNode ? selectNode.refpk : this.root.refpk };
        ajax({
            url: this.config.urls.addCardUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);

                    //查询时执行显示公式前端适配
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            result.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [this.config.formId]: "form"
                            }
                        );
                    }

                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'add');
                    Utils.filterEmptyData(result.data.form.head.rows[0].values);
                    //设置新增默认值
                    this.props.form.setAllFormValue({ head: result.data.form.head });
                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });
                    if (this.config.nodeType === 'ORG_NODE') {
                        that.props.form.setFormItemsValue(that.config.formId, { 'pk_org': { value: that.state.curOrg.refpk, display: that.state.curOrg.refname } });
                    }

                    //所属组织不能编辑
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'pk_org': true });//设置表单项不可用
                    if (!result.data.isCodeEdit) {
                        //设置单据编码不可以编辑
                        this.props.form.setFormItemsDisabled(this.config.formId, { 'code': true });
                    }

                    this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                    //控制树上搜索框不能编辑
                    this.setState({
                        curSelectedNode: selectNode,
                        disabledSearch: true,
                        showoffDisable: true,
                        cardEmpty: false
                    });
                    this.changeButtonStatus(selectNode, 'add');
                }
            }
        })
    }

    /**
     * 编辑
     */
    onEditEps(selectedTreeNode) {
        /**************************************************
         *
         * 编辑：
         *      1、构造请求参数
         *      2、ajax请求，后台查询需要编辑的对象
         *      3、回调，设置表单数据为编辑的对象
         *
         * 编辑状态下：
         *      只有 保存  取消 按钮 显示
         *
         *
         **************************************************/
        /****未选中提示***/
        if (!selectedTreeNode) {

            toast({ content: this.state.json['10140CSCLG-000012'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点！*/
            return;

        }
        if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000002'], color: 'warning' });//默认top/* 国际化处理： 业务单元不能操作集团级数据！*/
            return;
        }
        if (this.config.nodeType === 'GROUP_NODE' && !selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 集团不能操作业务单元级数据！*/
            return;
        }
        /***ajax请求***/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: { pk_custsaleclass: selectedTreeNode.refpk, isGlbGrp: this.config.isGlbGrp },
            success: (result) => {

                if (result.success) {

                    //查询时执行显示公式前端适配
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            result.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [this.config.formId]: "form"
                            }
                        );
                    }

                    this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用

                    //设置表单数据
                    this.props.form.setAllFormValue({ head: result.data.form.head });
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });//设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'code': !result.data.isCodeEdit });//设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { 'pk_org': true });//设置表单项不可用
                    //设置表单状态为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'edit');

                    this.changeButtonStatus(selectedTreeNode, 'edit');
                    //控制树上搜索框不能编辑
                    this.setState({
                        curSelectedNode: selectedTreeNode,
                        disabledSearch: true,
                        showoffDisable: true
                    });
                }
            }
        });
    }

    /**
     * 保存
     */
    onSaveEps(callback) {
        //必填项校验
        let memberFlag = this.props.form.isCheckNow(this.config.formId);
        if (!memberFlag) {
            return;
        }
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if (!selectedTreeNode) {
            selectedTreeNode = this.state.curSelectedNode;
        }
        let requestParam = {};
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
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        /****
         * 构造参数
         * @type {string}
         */
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        // formData.rows[0].values.eps_code.value = selectedTreeNode.nodeData.pcode + formData.rows["0"].values.eps_code.value;
        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };
        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        if (formData.rows[0].values.pk_custsaleclass) {

            pk = formData.rows[0].values.pk_custsaleclass.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (pk == null || pk == '') {
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }

        //校验公式
        this.props.validateToSave(requestParam, () => {
            //ajax请求
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        if (!result.data[0].children || result.data[0].children.length == 0) {
                            delete result.data[0].children;
                        }
                        if (nonPk) {
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId, result.data);
                        } else {
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId, result.data[0]);
                        }
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': false });
                        //清空自定已选中项   控制树上搜索框不能编辑
                        this.setState({ curSelectedNode: null, disabledSearch: false, showoffDisable: false });
                        toast({ title: this.state.json['10140CSCLG-000013'], color: 'success' });//默认top/* 国际化处理： 保存成功！*/
                        this.changeButtonStatus(selectedTreeNode, 'save');
                        callback && callback();
                    }
                }
            });
        }, { [this.config.formId]: 'form' }, 'form');
    }

    /**
     * 保存新增
     */
    onSaveAddEps() {
        //必填项校验
        let memberFlag = this.props.form.isCheckNow(this.config.formId);
        let that = this;
        if (!memberFlag) {
            return;
        }

        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        let requestParam = {};
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
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: '10140EPSG'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;

        if (formData.rows[0].values.pk_custsaleclass) {

            pk = formData.rows[0].values.pk_custsaleclass.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (pk == null || pk == '') {
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点

        }

        //校验公式
        this.props.validateToSave(requestParam, () => {
            /***ajax请求***/
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    /**********
                     *
                     * 这里的代码可以精简，临时先这样，逻辑思路是一样的
                     *
                     *
                     *********/
                    if (result.success) {
                        //设置表单为浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        if (!result.data[0].children || result.data[0].children.length == 0) {
                            delete result.data[0].children;
                        }
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(this.config.treeId, result.data);
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);

                        //判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
                        if (!selectedTreeNode) {
                            this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                        }

                        //重新设置整棵树不可用
                        this.props.syncTree.setNodeDisable(this.config.treeId, true);

                        // //判断是否有选中节点
                        // if (!selectedTreeNode) {
                        //     //如果没有默认加载根节点下面
                        //     requestParam = {
                        //         pk_father:this.root.refpk
                        //     };
                        // } else {
                        //     requestParam = {
                        //         pk_father:selectedTreeNode.refpk
                        //     };
                        // }
                        requestParam = {
                            pk_father: this.props.form.getFormItemsValue('head', 'pk_father').value
                        };
                        //ajax请求
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {

                                    //清空表单数据
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    //新增成功，设置表单默认值
                                    this.props.form.setAllFormValue({ head: result.data.form.head });
                                    if (this.config.nodeType === 'ORG_NODE') {
                                        this.props.form.setFormItemsValue(this.config.formId, { 'pk_org': { value: this.state.curOrg.refpk, display: this.state.curOrg.refname } });
                                    }
                                    //设置表单为编辑态
                                    this.props.form.setFormStatus(this.config.formId, 'edit');
                                    this.changeButtonStatus(selectedTreeNode, 'saveAdd');
                                }
                            }
                        })
                    }
                    //控制树上搜索框不能编辑
                    this.setState({
                        disabledSearch: true,
                        showoffDisable: true
                    });
                }
            });
        }, { [this.config.formId]: 'form' }, 'form');


    }

    /**
     * 删除
     */
    onDeleteEps(selectedTreeNode) {

        let requestParam = {};
        /*******************************************
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
         *******************************************/
        if (!selectedTreeNode) {

            toast({ content: this.state.json['10140CSCLG-000014'], color: 'warning' });//默认top/* 国际化处理： 请选中需要删除的节点！*/
            return;

        }
        if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000002'], color: 'warning' });//默认top/* 国际化处理： 业务单元不能操作集团级数据！*/
            return;
        }
        if (this.config.nodeType === 'GROUP_NODE' && !selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 集团不能操作业务单元级数据！*/
            return;
        }
        if (selectedTreeNode.refpk == this.root.refpk) {
            toast({ content: this.state.json['10140CSCLG-000015'], color: 'warning' });//默认top/* 国际化处理： 根节点不能删除！*/
            return;

        }
        let message = this.state.json['10140CSCLG-000016']/* 国际化处理： 确认要删除所选数据吗？*/
        if (selectedTreeNode.children && selectedTreeNode.children.length > 0) {
            toast({ content: this.state.json['10140CSCLG-000017'], color: 'warning' });//默认top/* 国际化处理： 数据已被引用，不能删除！*/
            return;
        }
        let code = this.props.form.getFormItemsValue(this.config.formId, 'code').value;

        // promptBox({
        //     color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        //     title: this.state.json['10140CSCLG-000018'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
        //     noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
        //     content: message,
        //     beSureBtnClick: () =>{

        promptBox({
            color: 'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140CSCLG-000019'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn: false,
            content: this.state.json['10140CSCLG-000020'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
            beSureBtnClick: () => {
                requestParam = {
                    pk_custsaleclass: selectedTreeNode.refpk
                }
                let pid = selectedTreeNode.pid;

                ajax({
                    url: this.config.urls.deleteUrl,
                    data: requestParam,
                    success: (result) => {
                        if (result.success) {

                            this.props.form.EmptyAllFormValue(this.config.formId);
                            //调用异步树的接口，删除该树节点
                            this.props.syncTree.delNodeSuceess(this.config.treeId, selectedTreeNode.refpk);
                            if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0)) {
                                this.setState({ cardEmpty: true })
                            }
                            toast({ color: 'success', title: this.state.json['10140CSCLG-000021'] });/* 国际化处理： 删除成功！*/
                            //删除成功提示
                            // Message.create({content: '删除成功！', color: 'success'});//默认top
                            this.changeButtonStatus(selectedTreeNode, 'del');
                        }

                    }
                })
            }
        })
        //     }   
        // })
        //编码回收
        ajax({
            url: this.config.urls.rollbackCodeUrl,
            data: {
                code: code,
                pk_prg: this.state.curOrg,
                nodetype: this.config.nodeType
            }, //参数带上选中的行政组织
            success: (result) => {
                if (result.success) {

                }
            }
        });
    }

    /**
     * 取消
     */
    onCancelEps() {

        //同步树 取消的逻辑
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        /**********************************************************
         *
         * 取消：
         *      1、重新根据选中的树节点查询表单对象
         *      2、回调，设置表单对象
         *      3、设置按钮状态
         *
         **********************************************************/
        this.props.form.EmptyAllFormValue(this.config.formId);
        this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });//设置表单项不可用
        if (selectedTreeNode && selectedTreeNode.refpk != '~') {
            //查询节点信息
            ajax({
                url: this.config.urls.queryCardUrl,
                data: { pk_custsaleclass: selectedTreeNode.refpk, isGlbGrp: this.config.isGlbGrp },
                success: (result) => {

                    if (result.success) {

                        this.props.form.setAllFormValue({ head: result.data.form.head });
                        this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': false });

                    }
                }
            });
        } else {
            //没有选中项  清空所有数据
            this.props.form.EmptyAllFormValue(this.config.formId);
        }
        this.props.form.setFormStatus(this.config.formId, 'browse');
        //设置树可用
        this.props.syncTree.setNodeDisable(this.config.treeId, false);
        //设置按钮状态
        this.changeButtonStatus(selectedTreeNode, 'cancel');
        //控制树上搜索框不能编辑

        if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0)) {
            this.setState({ cardEmpty: true })
        }
        this.setState({
            disabledSearch: false,
            showoffDisable: false
        });
    }

    /**
     * 启用
     */
    onStartEps() {
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

        if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000002'], color: 'warning' });//默认top/* 国际化处理： 业务单元不能操作集团级数据！*/
            return;
        }
        if (this.config.nodeType === 'GROUP_NODE' && !selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 集团不能操作业务单元级数据！*/
            return;
        }
        if (!selectedTreeNode) {

            toast({ content: this.state.json['10140CSCLG-000022'], color: 'warning' });//默认top/* 国际化处理： 请选中需要启用的树节点！*/
        } else if (formData.rows[0].values.enablestate.value == '2') {
            toast({ content: this.state.json['10140CSCLG-000023'], color: 'warning' });//默认top/* 国际化处理： 该数据已启用，无需多次启用！*/
            return;
        }
        requestParam = {
            pk_custsaleclass: formData.rows[0].values.pk_custsaleclass.value,
            enablestate: '2'
        }
        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (result) => {
                //启用成功，设置表单数据
                this.props.form.setAllFormValue({ head: result.data.head });
                //关闭 展开，可以做一个refreshTreeNode方法
                this.refreshTreeNode(this.config.treeId, selectedTreeNode.pid);
                this.changeButtonStatus('start');
            }
        });
    }

    /**
     * 停用
     */
    onStopEps() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};
        if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000002'], color: 'warning' });//默认top/* 国际化处理： 业务单元不能操作集团级数据！*/
            return;
        }
        if (this.config.nodeType === 'GROUP_NODE' && !selectedTreeNode.nodeData.isGroup) {
            toast({ content: this.state.json['10140CSCLG-000003'], color: 'warning' });//默认top/* 国际化处理： 集团不能操作业务单元级数据！*/
            return;
        }

        if (!selectedTreeNode) {

            toast({ content: this.state.json['10140CSCLG-000005'], color: 'warning' });//默认top/* 国际化处理： 请选中需要停用的树节点！*/
        } else if (formData.rows[0].values.enablestate.value == '1') {
            toast({ content: this.state.json['10140CSCLG-000024'], color: 'warning' });//默认top/* 国际化处理： 该数据已停用，无需多次停用！*/
            return;
        }
        requestParam = {
            pk_custsaleclass: formData.rows[0].values.pk_custsaleclass.value,
            enablestate: '1'
        }

        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (res) => {
                if (res.success) {

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.refreshTreeNode(this.config.treeId, selectedTreeNode.pid);
                    this.changeButtonStatus('stop');
                }
            }
        });

    }

    /*****button group end*****/

    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props, val) {
        let url = "/uapbd/eps/main/list/index.html";
        //获得查询区域条件
        // let data = props.search.getAllSearchData("epsQryTemp");
        let param = {
            pagecode: props.config.pageCode
        };
        if (val != null) {
            val.map((e) => {

                param[e.field] = e.value.firstvalue;
            });
        }


        props.linkTo(
            url, param
        );
    }

    /**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if (key == 'start') {
            this.onStartEps();
        } else if (key == 'stop') {
            this.onStopEps();
        }

    }

    /**
     * 更多选项，切换选项时触发事件
     * @param visible
     */
    onVisibleChange(visible) {
    }

    /**
     * 更多按钮占位事件
     */
    onMore() {
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode, id) {
        switch (id) {
            case 'add':
            case 'saveadd':
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveadd', true);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setButtonVisible(['refresh', 'print', 'export', 'import'], false);
                break;
            case 'edit':
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveadd', false);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setButtonVisible(['print', 'export', 'import'], false);
                this.props.button.setButtonVisible('refresh', false);
                break;
            case 'delete':
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible('save', false);
                this.props.button.setButtonVisible('saveadd', false);
                this.props.button.setButtonVisible('cancel', false);
                this.props.button.setButtonVisible(['print', 'refresh', 'export', 'import'], true);
                this.props.button.setButtonDisabled(['print', 'refresh', 'export', 'import'], false);
            default:
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key) {
        let selectedTreeNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, key);//获得树节点选中项
        let obj = {};
        //设置
        if (key === this.root.refpk || (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup)) {
            obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }
        if (this.config.nodeType === 'GROUP_NODE' && !selectedTreeNode.nodeData.isGroup) {
            obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }
        //设置
        if (key === this.root.refpk) {
            obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }

    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked) {
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if (!selectNode) {
            toast({ content: this.state.json['10140CSCLG-000025'], color: 'warning' });//默认top/* 国际化处理： 请选中树节点！*/
        }
        requestParam['pk_custsaleclass'] = selectNode.refpk;
        requestParam['enablestate'] = checked ? '2' : '1';
        ajax({
            url: this.config.urls.enablestateUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        this.props.form.setAllFormValue({ head: result.data.head });
                    } else {
                        //如果不是选中那就清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
                    }
                }
                this.refreshTreeNode(this.config.treeId, selectNode.pid);

            }
        });
    }

    /**
     * checkbox change 事件
     */
    onCheckShowDisable(checked) {
        this.setState(
            { checked: !this.state.checked },
            () => {
                this.onRefresh();
            }
        );
    }


    /**
     * 财务组织参照 选中事件
     */
    onOrgChange(value) {
        if (value && value.refpk) {
            this.setState({ cardEmpty: false })
        } else {
            this.setState({ cardEmpty: true })
        }
        this.setState({
            curOrg: value
        }, () => {
            this.onRefresh()
        });
    }

    buttonClick(props, id) {
        switch (id) {
            case 'save':
                //保存
                this.onSaveEps();
                break;
            case 'saveadd':
                //保存新增
                this.onSaveAddEps();
                break;
            case 'cancel':
                //取消
                //需要先回收编码
                promptBox({
                    color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140CSCLG-000037'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn: false,
                    content: this.state.json['10140CSCLG-000026'],/* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () => {
                        let pk_custsaleclass = this.props.form.getFormItemsValue(this.config.formId, 'pk_custsaleclass').value;
                        let code = this.props.form.getFormItemsValue(this.config.formId, 'code').value;
                        if (pk_custsaleclass || !code) {
                            this.onCancelEps();
                            return;
                        }
                        ajax({
                            url: this.config.urls.rollbackCodeUrl,
                            data: {
                                code: code,
                                pk_prg: this.state.curOrg,
                                nodetype: this.config.nodeType
                            }, //参数带上选中的行政组织
                            success: (result) => {
                                if (result.success) {

                                }
                            }
                        });
                        this.onCancelEps();
                    }
                })
                break;
            case 'refresh':
                //刷新  
                let selectedtreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                setDefData('custsaleclass_btnopr', props.config.datasource, 'refresh');
                this.onRefresh();
                if (selectedtreeNode) {
                    this.onSelectTree(selectedtreeNode.refpk);
                }
                break;
            case 'print':
                let selectedprintNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                if (!selectedprintNode) {

                    toast({ content: this.state.json['10140CSCLG-000027'], color: 'warning' });//默认top/* 国际化处理： 请选中对应的树节点！*/
                    return;

                }
                let pks = cacheTools.get('allpks');
                if (pks.length <= 0) {
                    toast({ content: this.state.json['10140CSCLG-000028'], color: 'warning' });/* 国际化处理： 没有要打印的数据！*/
                    return;
                }
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    urls.printUrl,
                    {
                        //billtype:'',  //单据类型
                        funcode: props.config.appcode,      //功能节点编码，即模板编码
                        nodekey: 'custsaleclass',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }, false
                );
                break;
            case 'export':
                let selectedprintNode1 = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                if (!selectedprintNode1) {

                    toast({ content: this.state.json['10140CSCLG-000027'], color: 'warning' });//默认top/* 国际化处理： 请选中对应的树节点！*/
                    return;

                }
                let pks1 = cacheTools.get('allpks');
                if (pks1.length <= 0) {
                    toast({ content: this.state.json['10140CSCLG-000029'], color: 'warning' });/* 国际化处理： 没有要输出的数据！*/
                    return;
                }
                this.setState({
                    pks: pks1
                }, this.refs.printOutput.open());
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     urls.printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: '10140CSCLG',      //功能节点编码，即模板编码
                //         //nodekey:'',     //模板节点标识
                //         // nodekey:'assprinttem',  
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            case 'export2':
                this.setState(this.state, () => {
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }

    addClickCall = () => {
        this.onAddEps(this.root)
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
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const { asyncTree, button, syncTree, modal, DragWidthCom, treeTable, form, BillHeadInfo } = this.props;
        const { createTreeTable } = treeTable;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createSyncTree } = syncTree;
        let { createModal } = modal;
        let { createAsyncTree } = asyncTree;//创建异步树，需要引入这个
        const { createBillHeadInfo } = BillHeadInfo; //新加 返回图标和按钮
        const { cardEmpty } = this.state;
        return (

            <div className='nc-bill-tree-card'>
                {createModal('modal', { noFooter: false })}
                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className='header'>
                        {/* 应测试部要求，非要改成平台的createBillHeadInfo */}
                        {createBillHeadInfo(
                            {
                                title: this.props.config.title,
                                initShowBackBtn: false,
                                backBtnClick: () => { }
                            }
                        )}
                        {/* 标题 title*/}
                        {/* {createPageIcon()} */}
                        {/* <div className="title" fieldid ={this.props.config.title+'_title'}>{this.props.config.title}</div>             */}
                        {this.config.nodeType === 'ORG_NODE' ? (
                            <div className="orgref" style={{ marginLeft: 20 }}>
                                {BusinessUnitTreeRef({
                                    fieldid: "businessunit",
                                    onChange: this.onOrgChange.bind(this),
                                    value: this.state.curOrg,
                                    disabled: this.state.disabledSearch,
                                    queryCondition: () => {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            AppCode: this.props.config.appcode
                                        }
                                    },

                                    refName: this.state.json['10140CSCLG-000030'],/* 国际化处理： 组织*/
                                    placeholder: this.state.json['10140CSCLG-000030']/* 国际化处理： 组织*/
                                })}
                            </div>
                        ) : ('')
                        }
                        <span className="showOff">
                            <NCCheckbox
                                checked={this.state.checked}
                                onChange={this.onCheckShowDisable.bind(this)}
                                disabled={this.state.showoffDisable}
                            >{this.state.json['10140CSCLG-000033']/*国际化处理： 显示停用*/}</NCCheckbox>
                        </span>
                        {/* 按钮组 btn-group*/}
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'header-button-area',//按钮注册中的按钮区域
                                //buttonLimit: 5, 
                                onButtonClick: this.buttonClick.bind(this)
                                //popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: this.config.treeId,
                                    disabledSearch: this.state.disabledSearch,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditEps.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddEps.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteEps.bind(this), // 删除点击 回调
                                    searchType: 'filtration',//树节点过滤方式修改
                                    showModal: false

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div style={{ height: '100%' }}>
                                {this.config.nodeType != 'ORG_NODE' ? <EmptyAreaTip
                                    type="btn"
                                    desc={this.state.json['10140CSCLG-000038']}
                                    onClick={this.addClickCall}
                                    show={cardEmpty} /> : <EmptyAreaTip
                                        desc={this.state.json['10140CSCLG-000039']}
                                        show={cardEmpty} />}
                                <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                    {createForm(this.config.formId, {
                                        cancelPSwitch: true,
                                        onAfterEvent: this.onAfterFormEvent.bind(this),
                                        onBeforeEvent: this.onBeforeFormEvent.bind(this)
                                    })
                                    }
                                </div>
                            </div>}     //右侧区域dom

                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百 
                    />
                    <PrintOutput
                        ref='printOutput'
                        url={urls.printUrl}
                        data={{
                            funcode: '10140CSCLG',      //功能节点编码，即模板编码
                            nodekey: 'custsaleclass',     //模板节点标识
                            oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
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

            </div>

        )
    }
}


/**
 * 创建页面
 */
export default CustsaleClass = createPage({
    billinfo: [{
        billtype: 'form',
        pagecode: pageCode,
        headcode: formId
    }],
    //initTemplate: initTemplate,
    mutiLangCode: '10140CSCLG'
})(CustsaleClass)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65