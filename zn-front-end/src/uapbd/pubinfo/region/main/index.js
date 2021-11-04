//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, cacheTools, high, promptBox, getMultiLang, createPageIcon, formDownload } from 'nc-lightapp-front';
import CountryExDefaultGridRef from '../../../refer/pubinfo/CountryExDefaultGridRef'
import createUIDom from '../../../public/utils/BDCreateUIDom'
import { excelImportconfig } from '../util/ExcelInputParamUtil'
const { NCMenu, NCDropdown, NCCheckbox, NCPopconfirm, NCMessage, NCCol, NCRow, NCButton, NCTooltip, NCDiv, EmptyAreaTip } = base;
const { NCMenuGroup } = NCMenu;
const { Item } = NCMenu;
const { PrintOutput } = high;
const { ExcelImport } = high;

require("./index.less");



/****************默认参数  开始***********************/
let formId = "head";//卡片组件Id
const urls = {
    loadTreeDataUrl: "/nccloud/uapbd/region/loadtreedata.do",
    queryTemplet: '/nccloud/platform/templet/querypage.do',
    addCardUrl: "/nccloud/uapbd/region/addcard.do",
    queryCardUrl: "/nccloud/uapbd/region/querycard.do",
    enablestateUrl: "/nccloud/uapbd/region/enablestate.do",
    deleteUrl: '/nccloud/uapbd/region/deltreenode.do',
    printUrl: '/nccloud/uapbd/region/print.do',
    checkUrl: '/nccloud/uapbd/region/regioncheck.do',
    saveUrl: '/nccloud/uapbd/region/savenode.do'
};
let pageCode = "10140REG_region";
let listmeta;//单据模板json数据
/***************默认参数  结束********************/

/**
 * 客户销售分类
 */
class RegionClass extends Component {
    constructor(props) {
        super(props)
        this.config = Object.assign({
            title: '10140REG-000000',/* 国际化处理： 行政区划*/
            treeId: 'regionTree',
            formId: formId,
            pageCode: '10140REG_region',
            nodeType: 'GROUP_NODE',
            isGlbGrp: '0',
            urls: urls
        }, props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key": "~",
            "title": this.config.title,
            "id": "~",
            "innercode": "~",
            "pid": "",
            "refname": this.config.title,
            "refpk": "~"
        };



        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartRegion = this.onStartRegion.bind(this);
        this.onStopRegion = this.onStopRegion.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty: true,
            disabledSearch: false,
            checked: false,//判断 显示停用按钮是否选中
            ids: [],
            json: {},
            disabledShowOff: false,//禁用复选框
            curCountry: '',//国家地区
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            conflictDataList: []
        }
        this.initTemplate(props, () => {
            this.getTreeData()
        })

    }


    /**
 * 单据模板
 * @param props
 */
    initTemplate = (props, callback) => {

        createUIDom(props)(
            {
                pagecode: pageCode
            },
            {
                moduleId: "10140REG", domainName: 'uapbd'
            },
            (data, langData) => {
                let _this = this;
                if (langData) {
                    this.state.json = langData
                }
                if (data) {
                    console.log(data);
                    // add by fengyaof 
                    // 初始化隐藏导入按钮
                    props.button.setButtonVisible('import_group', false);
                    // 导入前冲突校验按钮
                    let excelImportConfig1 = excelImportconfig(props, "uapbd", "region", true, "",
                        {
                            "appcode": "10140REG", "pagecode": "10140REG_region",
                            "pk_country": "0001Z010000000079UJJ",
                            "not_show_conflict": "0"
                        },
                        (data, ErrorList) => {
                            console.log('成功上传，校验冲突')
                            _this.state.conflictDataList = ErrorList;
                            console.log(2222)
                            console.log(_this.state.conflictDataList)
                            setTimeout(() => {
                                this.props.modal.show("showConflictData")
                            }, 200)
                        }
                    )
                    props.button.setUploadConfig('import', excelImportConfig1)

                    // 直接导入，强制更新
                    let excelImportConfig2 = excelImportconfig(props, "uapbd", "region", true, "",
                        {
                            "appcode": "10140REG", "pagecode": "10140REG_region",
                            "pk_country": "0001Z010000000079UJJ",
                            "not_show_conflict": "1"
                        },
                        (data, ErrorList) => {
                            console.log('成功上传,直接导入')
                            this.onRefresh();
                        }
                    )
                    props.button.setUploadConfig('import_direct', excelImportConfig2)
                    // add by fengyaof 

                    listmeta = data.template;
                    listmeta = this.modifierMeta(listmeta, props)
                    props.meta.setMeta(listmeta);
                    data.button && props.button.setButtons(data.button);
                    props.button.setDisabled({
                        print: true,
                        output: true
                    });
                    callback && callback()
                }
            }
        )
    }

    /**
 * 更新元数据 设置参照
 * @param meta
 * @param props
 * @returns {*}
 */
    modifierMeta = (meta, props) => {
        // props.renderItem('form',formId,'parent_id',refer('parent_id'));
        // props.renderItem('form',formId,'pk_group',refer('pk_group'));
        return meta;

    }

    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
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
        return data;
    }


    /**
     * 设置树节点的显示与隐藏
     * @param data
     * @returns {*}
     */
    dealTreeDataAboutShowOrHide = (data) => {
        let showDataList = [];
        let _this = this;
        let addShowDataObj = function (node) {
            let delIconIsShow = true;
            let editIconIsShow = true;
            if ((node.isvisible && node.isvisible == 5) || (node.refpk == _this.root.refpk)) {
                delIconIsShow = false;
                editIconIsShow = false;
            } else {
                delIconIsShow = true;
                editIconIsShow = true;
            }
            let visibleData = {
                key: node.refpk,
                value: {
                    delIcon: delIconIsShow,
                    editIcon: editIconIsShow,
                    addIcon: true
                }
            };
            showDataList.push(visibleData)
        };
        let deleteDataChildrenProp = function (node) {
            addShowDataObj(node);
            if (!node.children || node.children.length == 0) {

            } else {
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach((e) => {
            addShowDataObj(e);
            deleteDataChildrenProp(e);
        });
        return showDataList;
    }


    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    getTreeData = () => {

        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let requestParam = {
            checked: this.state.checked,
            pk_country: this.state.curCountry.refpk
        };

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    let data = [Object.assign({ ...this.root }, { title: this.state.json[this.root.title], refname: this.state.json[this.root.refname] }, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    //设置tree中的编辑、删除、添加的显示与隐藏
                    // console.log(this.dealTreeDataAboutShowOrHide(data))
                    this.props.syncTree.setIconVisible(this.config.treeId, this.dealTreeDataAboutShowOrHide(data))
                }
            }
        });
        //修改按钮状态
        this.initButtonStatus();

    }

    componentWillMount() {
        // let callback = (json) => {
        // 	this.setState({json})
        // 	}
        // getMultiLang({moduleId: '10140REG', domainName: 'uapbd',callback})
    }

    componentDidUpdate() {
        let formStatus = this.props.form.getFormStatus(this.config.formId)
        if (formStatus != 'add' && formStatus != 'edit') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus() {
        //设置保存按钮不显示
        this.props.button.setButtonVisible('save', false);
        this.props.button.setButtonVisible('saveAdd', false);
        this.props.button.setButtonVisible('cancel', false);
        this.props.button.setButtonVisible('print', true);
        this.props.button.setButtonVisible('output', true);
        this.props.button.setButtonVisible('refresh', true);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk) {

        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if (status == 'edit') {
            return;
        }

        if (refpk == this.root.refpk) {
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsDisabled(this.config.formId, { 'enablestate': true });
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: { pk_region: refpk, isGlbGrp: this.config.isGlbGrp },
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
                    let headData = result.data.head.rows[0].values;
                    if (headData.hasOwnProperty('enablestate')) {
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if (enablestateValue == '2') {
                            result.data.head.rows[0].values.enablestate.value = true;
                        } else {
                            result.data.head.rows[0].values.enablestate.value = false;
                        }
                    }

                    if (headData.pk_father.value == this.root.refpk) {
                        result.data.head.rows[0].values.pk_father.display = '';
                        result.data.head.rows[0].values.pk_father.value = '';
                    }
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({ head: result.data.head });
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });

                }
            }
        });
    }

    onBeforerFormEvent(props, moduleId, key, value, index) {
        switch (key) {
            case "pk_father":
                let meta = props.meta.getMeta()
                meta["head"].items.map((obj) => {
                    if (obj.attrcode == 'pk_father') {
                        obj.queryCondition = function () {
                            return {
                                "pk_country": index.pk_country.value
                            }
                        }
                    }
                })
                props.meta.setMeta(meta)
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
                    let content = value.value ? this.state.json['10140REG-000001'] : this.state.json['10140REG-000002'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    toast({ content: content, color: 'warning' });//默认top
                    return;
                }
                let requestParam = { pk_region: selectedTreeNode.refpk, enablestate: value.value ? '2' : '1' };

                ajax({
                    data: requestParam,
                    url: '/nccloud/uapbd/region/regionenablecheck.do',
                    success: (res) => {
                        promptBox({
                            color: "warning",
                            title: value.value ? this.state.json['10140REG-000027'] : this.state.json['10140REG-000028'],
                            content: value.value ? this.state.json['10140REG-000004'] : this.state.json['10140REG-000005'],/* 国际化处理： 确认启用该数据？,确认停用该数据？*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: this.config.urls.enablestateUrl,
                                    data: requestParam,
                                    success: (result) => {
                                        /****
                                         * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                         * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                         */
                                        // let checked = this.state.checked;
                                        //
                                        // if(value.value){
                                        //     //启用成功，设置表单数据
                                        //     props.form.setAllFormValue(result.data);
                                        // }
                                        // if(!checked){
                                        //     props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                                        //     //不显示停用数据时，需要删除该节点
                                        //     props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                                        //     props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项可用
                                        // }
                                        toast({ title: value.value ? this.state.json['10140REG-000006'] : this.state.json['10140REG-000007'], color: 'success' });/* 国际化处理： 启用成功！,停用成功！*/

                                    }
                                });
                            },
                            cancelBtnClick: () => {

                                //props.form.setFormItemsValue(this.config.formId,{enablestate:true});
                                props.form.setFormItemsValue(this.config.formId, { enablestate: { value: !value.value, display: !value.value } });
                                return;
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 新增
     */
    onAddRegion(selectNode) {

        if (!this.state.curCountry.refpk) {
            toast({ content: this.state.json['10140REG-000008'], color: 'warning' });//默认top/* 国际化处理： 请选择国家地区*/
            return;
        }
        this.setState({ curSelectedNode: selectNode });
        let requestParam = { pk_country: this.state.curCountry.refpk, pk_father: selectNode ? selectNode.refpk : this.root.refpk };
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
                    this.props.form.setFormStatus(this.config.formId, 'edit');
                    let headData = result.data.head.rows[0].values;
                    if (headData.pk_father.value == this.root.refpk) {
                        result.data.head.rows[0].values.pk_father.display = '';
                        result.data.head.rows[0].values.pk_father.value = '';
                    }
                    //设置新增默认值
                    this.props.form.setAllFormValue({ head: result.data.head });
                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });

                    this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                    this.setState({
                        disabledSearch: true,
                        disabledShowOff: true
                    });
                    this.changeButtonStatus(selectNode, 'add');

                }
            }
        })

        this.appendInputTip();

    }

    /**
     * 编辑
     */
    onEditRegion(selectedTreeNode) {
        this.setState({ curSelectedNode: selectedTreeNode });
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

            toast({ content: this.state.json['10140REG-000009'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;

        }
        // if(this.config.nodeType==='ORG_NODE' && selectedTreeNode.nodeData.isGroup){
        //     NCMessage.create({content: '业务单元不能操作集团级数据', color: 'warning'});//默认top
        //     return;
        // }
        /***ajax请求***/
        ajax({
            url: this.config.urls.checkUrl,
            data: { pk_region: selectedTreeNode.refpk, isGlbGrp: this.config.isGlbGrp },
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

                    let headData = result.data.head.rows[0].values;
                    if (headData.pk_father.value == this.root.refpk) {
                        result.data.head.rows[0].values.pk_father.display = '';
                        result.data.head.rows[0].values.pk_father.value = '';
                    }
                    //设置表单数据
                    this.props.form.setAllFormValue({ head: result.data.head });
                    this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });//设置表单项不可用
                    //设置表单状态为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'edit');
                    this.changeButtonStatus(selectedTreeNode, 'edit');
                    this.setState({
                        disabledSearch: true,
                        disabledShowOff: true
                    });

                }
            }
        });


        this.appendInputTip();

    }

    /**
     * 保存
     */
    onSaveRegion() {


        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if (!selectedTreeNode) {
            selectedTreeNode = this.state.curSelectedNode;
        }
        // if(!selectedTreeNode){
        //     alert('请选中节点');
        //     return;
        // }


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


        /**
         * 表单校验区域
         */



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
        if (formData.rows[0].values.hasOwnProperty('pk_region')) {

            pk = formData.rows[0].values.pk_region.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

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
                        console.log(result)
                        if (result.data.message) {
                            toast({ title: result.data.message, color: 'error' });
                            return;
                        }
                        //设置表单浏览态  
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        if (!result.data.tree[0].children || result.data.tree[0].children.length == 0) {
                            delete result.data.tree[0].children;
                        }
                        if (nonPk) {

                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.tree[0]);
                        } else {

                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId, result.data.tree[0]);
                        }
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.tree[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.tree[0].refpk);

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
                        let headData = result.data.form[this.config.formId].rows[0].values;
                        if (headData.pk_father.value == this.root.refpk) {
                            result.data.head.rows[0].values.pk_father.display = '';
                            result.data.head.rows[0].values.pk_father.value = '';
                        }
                        this.props.form.setAllFormValue({ [this.config.formId]: result.data.form[this.config.formId] });

                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                        //清空自定已选中项
                        this.setState({ curSelectedNode: null, disabledSearch: false, disabledShowOff: false });
                        //toast({content:"保存成功！",title:"提示"});
                        toast({ title: this.state.json['10140REG-000010'], color: 'success' });/* 国际化处理： 保存成功！*/
                        this.changeButtonStatus(selectedTreeNode, 'save');

                        // 隐藏问号
                        this.removeInputTip();
                    }

                }
            });
        }, { [this.config.formId]: 'form' }, 'form');


    }

    /**
     * 保存新增
     */
    onSaveAddRegion() {

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
            pageid: '10140REG_region'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;

        if (formData.rows[0].values.hasOwnProperty('pk_region')) {

            pk = formData.rows[0].values.pk_region.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

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
                        if (!result.data.tree[0].children || result.data.tree[0].children.length == 0) {
                            delete result.data.tree[0].children;
                        }
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.tree[0]);
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.tree[0].pid);

                        //判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
                        if (!selectedTreeNode) {
                            this.props.syncTree.setNodeSelected(this.config.treeId, result.data.tree[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                        }

                        //重新设置整棵树不可用
                        this.props.syncTree.setNodeDisable(this.config.treeId, true);

                        //判断是否有选中节点
                        if (!selectedTreeNode) {
                            //如果没有默认加载根节点下面
                            requestParam = {
                                pk_country: this.state.curCountry.refpk,
                                pk_father: this.root.refpk
                            };
                        } else {
                            requestParam = {
                                pk_country: this.state.curCountry.refpk,
                                pk_father: selectedTreeNode.refpk
                            };
                        }
                        //ajax请求
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {

                                    //清空表单数据
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    //新增成功，设置表单默认值
                                    let headData = result.data.head.rows[0].values;
                                    if (headData.pk_father.value == this.root.refpk) {
                                        result.data.head.rows[0].values.pk_father.display = '';
                                        result.data.head.rows[0].values.pk_father.value = '';
                                    }
                                    this.props.form.setAllFormValue({ head: result.data.head });
                                    //设置表单为编辑态
                                    this.props.form.setFormStatus(this.config.formId, 'edit');
                                    //toast({content:"保存成功！",title:"提示"});
                                    toast({ title: this.state.json['10140REG-000010'], color: 'success' });/* 国际化处理： 保存成功！*/
                                    this.changeButtonStatus(selectedTreeNode, 'saveAdd');

                                    // 隐藏问号
                                    this.removeInputTip();
                                }
                            }

                        })
                    }

                    //控制树上搜索框不能编辑
                    this.setState({
                        disabledSearch: true,
                        disabledShowOff: true
                    });
                }
            });
        }, { [this.config.formId]: 'form' }, 'form');


    }

    /**
     * 删除
     */
    onDeleteRegion(selectedTreeNode) {

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

            toast({ content: this.state.json['10140REG-000011'], color: 'warning' });//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;

        }
        // if(this.config.nodeType==='ORG_NODE' && selectedTreeNode.nodeData.isGroup){
        //     NCMessage.create({content: '业务单元不能操作集团级数据', color: 'warning'});//默认top
        //     return;
        // }
        if (selectedTreeNode.refpk == this.root.refpk) {
            toast({ content: this.state.json['10140REG-000012'], color: 'warning' });//默认top/* 国际化处理： 根节点不能删除*/
            return;

        }
        let message = this.state.json['10140REG-000013']/* 国际化处理： 确认要删除所选数据吗？*/
        if (selectedTreeNode.hasOwnProperty('children') && selectedTreeNode.children != null && selectedTreeNode.children.length > 0) {
            toast({ content: this.state.json['10140REG-000014'], color: 'warning' });//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
            return;
        }
        promptBox({
            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140REG-000015'],/* 国际化处理： 确认删除*/
            content: message,
            beSureBtnClick: () => {

                requestParam = {
                    pk_region: selectedTreeNode.refpk
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
                            toast({ title: this.state.json['10140REG-000016'], color: 'success' });/* 国际化处理： 删除成功！*/
                            //删除成功提示
                            // Message.create({content: '删除成功！', color: 'success'});//默认top
                            this.changeButtonStatus(selectedTreeNode, 'del');
                        }

                    }
                })
            }
        });


    }

    /**
     * 取消
     */
    onCancelRegion() {

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
        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });//设置表单项不可用
        if (selectedTreeNode && selectedTreeNode.refpk != '~') {
            //查询节点信息
            ajax({
                url: this.config.urls.queryCardUrl,
                data: { pk_region: selectedTreeNode.refpk, isGlbGrp: this.config.isGlbGrp },
                success: (result) => {

                    if (result.success) {

                        this.props.form.setAllFormValue({ head: result.data.head });


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
        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
        this.changeButtonStatus(selectedTreeNode, 'cancel');
        //控制树上搜索框不能编辑
        this.setState({
            disabledSearch: false,
            disabledShowOff: false
        });
        // 隐藏问号
        this.removeInputTip();
    }

    /**
     * 启用
     */
    onStartRegion() {
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

            toast({ content: this.state.json['10140REG-000001'], color: 'warning' });//默认top/* 国际化处理： 请选中需要启用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '2') {
            toast({ content: this.state.json['10140REG-000017'], color: 'warning' });//默认top/* 国际化处理： 该数据已启用，无需多次启用*/
            return;
        }
        requestParam = {
            pk_region: formData.rows[0].values.pk_region.value,
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
                // this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                // this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                // this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
            }
        });

    }

    /**
     * 停用
     */
    onStopRegion() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if (!selectedTreeNode) {

            toast({ content: this.state.json['10140REG-000002'], color: 'warning' });//默认top/* 国际化处理： 请选中需要停用的树节点*/
        } else if (formData.rows[0].values.enablestate.value == '1') {
            toast({ content: this.state.json['10140REG-000018'], color: 'warning' });//默认top/* 国际化处理： 该数据已停用，无需多次停用*/
            return;
        }
        requestParam = {
            pk_region: formData.rows[0].values.pk_region.value,
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
                    //this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                    // this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                    // this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                }
            }
        });
        //this.changeButtonStatus('stop');
    }

    /*****button group end*****/

    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    // onClickSearchBtn(props,val){
    //     let url = "/uapbd/eps/main/list/index.html";
    //     //获得查询区域条件
    //     // let data = props.search.getAllSearchData("epsQryTemp");
    //     let param = {};
    //     if(val!=null){
    //         val.map((e)=>{
    //             
    //             param[e.field] = e.value.firstvalue;
    //         });
    //     }


    //     props.linkTo(
    //         url,param
    //     );
    // }

    /**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if (key == 'start') {
            this.onStartRegion();
        } else if (key == 'stop') {
            this.onStopRegion();
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
        // let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        let treeNodeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        if (treeNodeData) {
            let pks = this.getTreeAllPks(treeNodeData);
            if (!pks || pks.length === 0) {
                this.props.button.setDisabled({
                    print: true,
                    output: true
                });
            } else {
                this.props.button.setDisabled({
                    print: false,
                    output: false
                });
            }
        }
        switch (id) {
            case 'add':
            //this.props.form.setFormItemsValue(formId, { 'enablestate': { value: true, display:'已启用'} });
            case 'saveAdd':
                //this.props.button.setButtonVisible('add',false);
                //this.props.button.setButtonVisible('edit',false);
                //this.props.button.setButtonVisible('del',false);
                // this.props.button.setButtonVisible('stop',false);
                //this.props.form.setFormItemsValue(formId, { 'enablestate': { value: true, display:'已启用'} });
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveAdd', true);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setButtonVisible('print', false);
                this.props.button.setButtonVisible('import_group', false);
                this.props.button.setButtonVisible('output', false);
                this.props.button.setButtonVisible('refresh', false);
                this.props.button.setDisabled({
                    save: false,
                    saveAdd: false,
                    cancel: false
                });
                //设置树不可用
                // this.props.syncTree.setNodeDisable(this.config.treeId,true);
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, true);
                break;
            case 'edit':
                // this.props.button.setButtonVisible('add',false);
                // this.props.button.setButtonVisible('edit',false);
                // this.props.button.setButtonVisible('del',false);
                //this.props.button.setButtonVisible('stop',false);
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setButtonVisible('print', false);
                this.props.button.setButtonVisible('import_group', false);
                this.props.button.setButtonVisible('output', false);
                this.props.button.setButtonVisible('refresh', false);
                this.props.button.setDisabled({
                    save: false,
                    cancel: false
                });
                // this.props.syncTree.setNodeDisable(this.config.treeId,true);
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, true);
                break;
            case 'del':
                // this.props.button.setButtonVisible('add',true);
                // this.props.button.setButtonVisible('edit',true);
                // this.props.button.setButtonVisible('del',true);
                //this.props.button.setButtonVisible('stop',true);
                this.props.button.setButtonVisible('save', false);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('cancel', false);
                // this.props.button.setDisabled({
                //     add:false,
                //     edit:false,
                //     del:false,
                // });
                break;
            case 'save':
            case 'cancel':
                // this.props.button.setButtonVisible('add',true);
                // this.props.button.setButtonVisible('edit',true);
                // this.props.button.setButtonVisible('del',true);
                //this.props.button.setButtonVisible('stop',true);
                this.props.button.setButtonVisible('save', false);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('print', true);
                this.props.button.setButtonVisible('output', true);
                this.props.button.setButtonVisible('refresh', true);
                this.props.button.setButtonVisible('cancel', false);
                if (this.state.curCountry.refpk == '0001Z010000000079UJJ') {
                    this.props.button.setButtonVisible('import_group', true);
                } else {
                    this.props.button.setButtonVisible('import_group', false);
                }
            // if(!selectedTreeNode){
            //     //无选中节点，按钮不可用
            //     this.props.button.setDisabled({
            //         add:true,
            //         edit:true,
            //         del:true,
            //     });
            // }else if(selectedTreeNode.refpk ==this.root.refpk){
            //     //选中根节点，只有新增可用
            //     this.props.button.setDisabled({
            //         add:false,
            //         edit:true,
            //         del:true,
            //     });
            // }else{
            //     //选中非根节点，显示状态的按钮都可用
            //     this.props.button.setDisabled({
            //         add:false,
            //         edit:false,
            //         del:false,
            //     });
            // }
            // this.props.syncTree.setNodeDisable(this.config.treeId,true);
            // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, false);
            default:
                break;
        }
    }


    /**
     * 同步树：新增回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onAddNodeCallBack(data, pk, node) {
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        let requestParam = {};//请求参数对象

        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk

            requestParam['pid'] = selectNode.refpk;
        } else {
            //不存在选中节点，设置父节点为根节点refpk
            requestParam['pid'] = this.root.refpk;
        }

        ajax({
            url: this.config.urls.addCardUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                    this.props.form.setAllFormValue(result.data);//设置新增默认值
                    this.props.form.setFormStatus(this.config.formId, 'edit');//设置表单为编辑态
                    this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                }
            }
        })



    }

    /**
     * 编辑回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onEditNodeCallBack(data, pk, node) {
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        let requestParam = {};//请求参数对象

        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk
            requestParam['pk_region'] = selectNode.refpk;
        } else {
            toast({ content: this.state.json['10140REG-000009'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }
        ajax({
            url: this.config.urls.queryCardUrl,
            data: requestParam,
            success: (result) => {
                this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                this.props.form.setAllFormValue(result.data);//设置新增默认值
                this.props.form.setFormStatus(this.config.formId, 'edit');//设置表单为编辑态
                this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
            }
        })
    }

    /**
     * 删除回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onDelNodeCallBack(data, pk, node) {
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        let requestParam = {};//请求参数对象

        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk

            requestParam['pk_region'] = selectNode.refpk;
        } else {
            toast({ content: this.state.json['10140REG-000011'], color: 'warning' });//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;
        }

        ajax({
            url: this.config.urls.deleteUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    // this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                    // this.props.form.setAllFormValue(result.data);//设置新增默认值
                    // this.props.form.setFormStatus(this.config.formId, 'edit');//设置表单为编辑态
                    // this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                    //删除成功事件
                    this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
                }

            }
        })
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key) {
        //设置
        // if(key === this.root.refpk){
        //     let obj = {
        //         delIcon:false, //false:隐藏； true:显示; 默认都为true显示
        //         editIcon:false,
        //         addIcon:true
        //     };
        //     this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        // }else{
        //     let obj = {
        //         delIcon:true, //false:隐藏； true:显示; 默认都为true显示
        //         editIcon:true,
        //         addIcon:true
        //     };
        //     this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        // }

    }

    onRefresh() {
        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let requestParam = {
            checked: this.state.checked,
            pk_country: this.state.curCountry.refpk
        };

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {

                    let data = [Object.assign({ ...this.root }, { title: this.state.json[this.root.title], refname: this.state.json[this.root.refname] }, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    toast({ title: this.state.json['10140REG-000019'], color: 'success' });/* 国际化处理： 刷新成功！*/
                    //设置tree中的编辑、删除、添加的显示与隐藏
                    // console.log(this.dealTreeDataAboutShowOrHide(data))
                    this.props.syncTree.setIconVisible(this.config.treeId, this.dealTreeDataAboutShowOrHide(data))
                }
            }
        });
    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked) {
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if (!selectNode) {
            toast({ content: this.state.json['10140REG-000020'], color: 'warning' });//默认top/* 国际化处理： 请选中树节点*/
        }
        requestParam['pk_region'] = selectNode.refpk;
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
    // onCheckBoxChange(){
    //     let checked = !this.state.checked;
    //     let requestParam = {
    //       checked:this.state.checked,
    //       pk_country:this.state.curCountry.refpk
    //     };
    //     ajax({
    //         url:this.config.urls.loadTreeDataUrl,
    //         data:requestParam,
    //         success:(result)=>{
    //             if(result.success){
    //                 var data = [Object.assign( {...this.root} , {children : result.data} )],
    //                     initLeaf = function(node){
    //                         if(!node.children || node.children.length == 0) {

    //                             delete node.children;
    //                         }
    //                         else{
    //                             node.isLeaf = false;
    //                             node.children.forEach( (e) => {
    //                                 initLeaf(e);
    //                             } );
    //                         }
    //                     };

    //                 data.forEach( (e) => {
    //                     initLeaf(e);
    //                 });

    //                 //同步树 加载全部数据
    //                 this.props.syncTree.setSyncTreeData(this.config.treeId , data);
    //                 //展开节点  设置默认展开项
    //                 this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
    //             }

    //         }
    //     })
    // }

    onCheckBoxChange() {
        if (this.state.disabledShowOff) {
            return;
        }
        this.state.checked = !this.state.checked;
        let requestParam = {
            checked: this.state.checked,
            pk_country: this.state.curCountry.refpk,
        };
        ajax({
            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    var data = [Object.assign({ ...this.root }, { title: this.state.json[this.root.title], refname: this.state.json[this.root.refname] }, { children: result.data })],
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

                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, data);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    //设置tree中的编辑、删除、添加的显示与隐藏
                    // console.log(this.dealTreeDataAboutShowOrHide(data))
                    this.props.syncTree.setIconVisible(this.config.treeId, this.dealTreeDataAboutShowOrHide(data))
                }

            }
        })
    }

    /**
     * checkbox 选中事件
     */
    onCheckBoxClick() {

        this.setState({ checked: !this.state.checked });
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
    }

    onButtonClick(props, id) {
        switch (id) {
            case 'refresh':
                this.onRefresh.call(this);
                break;
            case 'save':
                this.onSaveRegion.call(this);
                break;
            case 'saveAdd':
                this.onSaveAddRegion.call(this);
                break;
            case 'cancel':
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140REG-000021'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10140REG-000022'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: () => { this.onCancelRegion() }
                })
                //this.onCancelRegion.call(this);
                break;
            case 'print':
                let treeNodeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
                if (treeNodeData) {
                    let pks = this.getTreeAllPks(treeNodeData);
                    print(
                        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                        urls.printUrl,
                        {
                            //billtype:'',  //单据类型
                            funcode: '10140REG',      //功能节点编码，即模板编码
                            // nodekey:'assprinttem',     //模板节点标识
                            oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        }
                    )
                };
                break;
            case 'output':
                this.onOutput();
                break;
            case 'export'://输出
                // this.setState({},()=>{
                //     this.props.modal.show("exportFileModal")
                // })
                this.getExportTemplete();
                break;
            case 'export2'://导出XLSX模板
                this.getExportTemplete('2');
                break;
            case 'export1'://导出XLS模板
                this.getExportTemplete('1');
                break;
            case 'export0'://导出CSV模板
                this.getExportTemplete('0');
                break;
            case 'import':
                console.log(5555);
                break;
            default:
                break;
        }
    }


    getExportTemplete = (fileTyp) => {
        let _this = this;
        const { exportTreeUrl, appcode, pagecode, referVO = {} } = this.props;
        ajax({
            url: exportTreeUrl || "/nccloud/uapdr/trade/schemeTreeToTreeQuery.do",
            data: {
                moduleName: 'uapbd',
                billType: 'region',
                appcode: "10140REG",
                pagecode: "10140REG_region",
                params: referVO,
                ignoreTemplate: referVO.referVO || false
            },
            success: res => {
                if (res.data) {
                    this.setState({
                        leftTreeData: res.data.leftdata || [],
                        rightTreeData: res.data.rightdata || [],
                        treeValue: res.data,
                        fileTypeArr: res.data.billType || []
                    });

                    this.downloadTempleteExcel(fileTyp);
                }
            }
        });
    }

    appendInputTip = () => {
        setTimeout(() => {
            // 增加友情提示文案
            console.log('appendInputTip');
            let parentForm = document.getElementsByClassName('lightapp-component-form');
            // 找到行政区划标签<span>
            let firstNode = parentForm[0].childNodes[0].childNodes[1];
            firstNode.style = 'width: 33.33333%;position: relative;'
            // 动态添加div
            var tipDiv = document.createElement("img");
            tipDiv.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAHmSURBVEhL5ZVPq0FRFMXf1/QhTIwYSJGUIpkpJVGMJBJKSUkGklKKgYQQA4T8zXqt887Fffe6T69n9H6l7ln3OuvsffY+5wNv5p8Y7Pd7bDYb8Tufz1J9jacGnKxYLMLhcMDlciEcDiMYDMJut8Pr9aLVauF0Osmvn6MxuF6v4s9utxvNZhPH41G+ubNer5HNZuHz+TCdTqWqj8qAk1erVUSjUZGWnxiNRvD7/RiPx1LRojLodDqIxWI4HA5SgXiu1+tIpVLIZDLo9XpiIQqcPBQKYbVaSUXNzWC73SISiWA+n0vlKxXMu8lkgs1mg8ViEc/5fF5l0mg0UCgUVJrCzaDdbiOXy6k+qtVqMJvNIjJyuVxEJNwfmitwcUzrcrmUyh1hwEkZfr/fF6LCbrfDcDhUmZZKJXg8HlFljzCqbrcrR3eEASslmUxisVgIUQ+WJAuAaYrH45oSZZr4/js3A4b+fVUKnCyRSIj8c0Mf06PA1RsaGEUwmUxgtVpRqVR0N5IYRvBsDxRmsxmcTicGg4FUtBjuAdGrokfYD6wiPX6sIqLXBwpMHc+kdDotFTUv9QHR62TCcblc1k3hy51MuIK3nkWEJq+epoFAwLB3iMZA4dl9wDGP6V/fB3q85Ub7K95sAHwCfjmMikSgJvcAAAAASUVORK5CYII=');
            tipDiv.setAttribute('id', 'regionWenHao');
            tipDiv.setAttribute('style', 'width: 20px;height: 20px;position: absolute;top: 5px;right: -14px;z-index: 101;');


            var helpImg = document.createElement("img");
            helpImg.setAttribute('src', 'data:image/png;base64,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')
            helpImg.setAttribute('id', 'helpImg');
            helpImg.setAttribute('style', 'width: 220px;height: 55px;position: absolute;top: -38px;right: -36px;display:none;');

            var helpText = document.createElement("div");
            helpText.setAttribute('style', 'color:#555555;width: 180px;height: 55px;position: absolute;top: -30px;right: -20px;font-size:10px;display:none;');
            helpText.setAttribute('id', 'helpText');
            helpText.innerText = this.state.json['10140REG-000031']

            var parentDiv = document.createElement("div");
            parentDiv.setAttribute('style', 'color: red;position: absolute;top: 0;right: 0;z-index: 100;');
            parentDiv.setAttribute('id', 'parentDiv');
            parentDiv.appendChild(tipDiv)
            parentDiv.appendChild(helpImg)
            parentDiv.appendChild(helpText)

            firstNode.appendChild(parentDiv);
            document.getElementById('regionWenHao').addEventListener("click", function () {
                //alert('请注意预留编码，尽量避免与民政部数据产生冲突。如：130609后新增130620，预留出130610等编码。');
            });
            document.getElementById('regionWenHao').addEventListener("mouseenter", function () {
                // alert('请注意预留编码，尽量避免与民政部数据产生冲突。如：130609后新增130620，预留出130610等编码。');
                document.getElementById('helpImg').setAttribute('style', 'width: 220px;height: 55px;position: absolute;top: -38px;right: -36px;');
                document.getElementById('helpText').setAttribute('style', 'color:#555555;width: 180px;height: 55px;position: absolute;top: -30px;right: -20px;font-size:10px;');
            });
            document.getElementById('regionWenHao').addEventListener("mouseleave", function () {
                // alert('请注意预留编码，尽量避免与民政部数据产生冲突。如：130609后新增130620，预留出130610等编码。');
                document.getElementById('helpImg').setAttribute('style', 'width: 220px;height: 55px;position: absolute;top: -38px;right: -36px;display:none;');
                document.getElementById('helpText').setAttribute('style', 'color:#555555;width: 180px;height: 55px;position: absolute;top: -30px;right: -20px;font-size:10px;display:none;');
            });
            //   console.log(parentForm);
            //   console.log(firstNode);
        }, 100)
    }

    removeInputTip = () => {
        let parentForm = document.getElementsByClassName('lightapp-component-form');
        // 找到行政区划标签<span>
        let firstNode = parentForm[0].childNodes[0].childNodes[1];
        let tipWindow = document.getElementById('parentDiv');
        if (tipWindow) {
            firstNode.removeChild(tipWindow);
        }
    }

    downloadTempleteExcel = (fileTyp) => {
        const { exportTreeUrl, appcode, pagecode, referVO = {} } = this.props;
        let _this = this;
        let exportDatas = "";
        if (this.props.selectedPKS && this.props.selectedPKS.length > 0) {
            this.props.selectedPKS.map((item, index) => {
                exportDatas = exportDatas + item + ";";
            });
        }
        // console.log('3343434')
        // console.log(this.state.rightTreeData)
        let rightTreeDatas = this.getrecusionUtil(this.state.rightTreeData);

        let data = {
            moduleName: 'uapbd',
            billType: 'region',
            appcode: "10140REG",
            pagecode: "10140REG_region",
            rightdata: rightTreeDatas,
            exportDatas: exportDatas,
            ignoreTemplate: referVO.ignoreTemplate || false,
            fileTyp: fileTyp
        };
        formDownload({
            params: data,
            url: "/nccloud/uapdr/trade/excelexport.do",
            enctype: 2,
        });
        this.props.modal.close(this.props.moduleId || "exportFileModal");
    };

    getrecusionUtil = (rightTreeData) => {
        let exportdata = '';
        if (rightTreeData && rightTreeData.length > 0) {
            rightTreeData.map((item, index) => {
                // debugger
                exportdata += item.id + "<>" + item.name + ",[[";
                let childrens = '';
                if (item.children) {
                    if (item.children && item.children.length > 0) {
                        item.children.map((item, index) => {
                            // debugger
                            childrens = childrens + item.id + "<>" + item.name + "$$";

                        })

                    }
                }
                exportdata += childrens + ";";
            })

        }

        return exportdata;
    }

    //输出
    onOutput = () => {

        let allNodeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        if (allNodeData.length === 0) {
            toast({ content: this.state.json['10140REG-000023'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks1 = this.getTreeAllPks(allNodeData);
        this.setState({
            ids: pks1
        }, this.refs.printOutput.open());
    }

    getTreeAllPks = (treeData) => {
        let result = new Array();
        const loop = (treeData) => {
            treeData.forEach(data => {
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

    onCountryChange(value) {
        if (value && value.refpk) {
            this.setState({ cardEmpty: false })
        } else {
            this.setState({ cardEmpty: true })
        }
        let meta = this.props.meta.getMeta();
        meta[formId].items.map((item) => {
            if (item.attrcode == 'pk_father') {
                item.queryCondition = () => {
                    return {
                        "pk_country": value.refpk
                    }
                }
            }
        });
        this.props.meta.setMeta(meta);

        this.setState({
            curCountry: value
        });
        setTimeout(() => {
            this.loadRegionTreeData(),
                this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });
        }, 10); //选中后开始加载部门数据
        // 如果选择的是中国
        if (value.refpk == '0001Z010000000079UJJ') {
            this.props.button.setButtonVisible('import_group', true);
        } else {
            this.props.button.setButtonVisible('import_group', false);
        }
    }

    loadRegionTreeData() {

        ajax({
            loading: true,
            url: this.config.urls.loadTreeDataUrl,
            data: {
                checked: this.state.checked,
                pk_country: this.state.curCountry.refpk
            }, //参数带上选中的行政组织
            success: (result) => {
                if (result.success) {
                    if (result.data) {
                        this.props.button.setDisabled({
                            print: false,
                            output: false
                        });
                    } else {
                        this.props.button.setDisabled({
                            print: true,
                            output: true
                        });
                    }
                    let data = [Object.assign({ ...this.root }, { title: this.state.json[this.root.title], refname: this.state.json[this.root.refname] }, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    //设置tree中的编辑、删除、添加的显示与隐藏
                    // console.log(this.dealTreeDataAboutShowOrHide(data))
                    this.props.syncTree.setIconVisible(this.config.treeId, this.dealTreeDataAboutShowOrHide(data))
                }
            }
        });
    }

    modalContent() {
        let res = [];
        console.log(333)
        console.log(this.state.conflictDataList)
        let content = [];
        content.push(
            <li>待导入的数据与当前系统的行政区划，出现编码相同名称不同的情况，请检查是否需要修改！</li>
        )
        content.push(
            <li>执行【直接导入】后将进行更新任务，这部分数据会被覆盖。</li>
        )
        content.push(this.state.conflictDataList.map((item, index) => {
            return (
                <li>{item}</li>
            )
        })
        )
        res.push(
            <ul class="groupOperationMsg">{[...content]}</ul>
        )
        return (
            res
        )
    };

    lookImportLogBtnClick = () => {
        console.log('lookImportLogBtnClick');
        this.props.openTo("/uap/excelimport/importListTable/main/index.html", { appcode: "10140IMPLOG", pagecode: "10140IMPLOG_LOG" });
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
        const { createBillHeadInfo } = BillHeadInfo;
        const { cardEmpty } = this.state;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createSyncTree } = syncTree;
        let { createModal } = modal;
        let { createAsyncTree } = asyncTree;//创建异步树，需要引入这个
        this.conflictDataList = [];

        const menu1 = (
            <NCMenu
                onSelect={this.onMoreSelect.bind(this)}>
                <Item key="start">{this.state.json['10140REG-000027']/* 国际化处理： 启用*/}</Item>
                <Item key="stop">{this.state.json['10140REG-000028']/* 国际化处理： 停用*/}</Item>
            </NCMenu>
        );
        return (

            <div>
                {createModal('modal', { noFooter: false })}
                {createModal('importModal', { noFooter: false, rightBtnName: '', leftBtnName: '确定' })}
                {createModal('showConflictData', {
                    title: '冲突数据提示',
                    noFooter: false,
                    rightBtnName: '查看导入日志',
                    cancelBtnClick: this.lookImportLogBtnClick,
                    leftBtnName: '确定',
                    content: this.modalContent()
                })}
                {/* 头部 header*/}
                <div className="nc-bill-tree-card">
                    <NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                        {/* 标题 title*/}
                        <div className='title'>
                            {createBillHeadInfo(
                                {
                                    title: this.state.json['10140REG-000000']/* 国际化处理： 行政区划*/,
                                    backBtnClick: () => { },
                                    initShowBackBtn: false
                                }
                            )}
                        </div>

                        <div className="search-box" style={{ width: 200 }}>
                            <span style={{ marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red' }}>
                                <span style={{ position: 'absolute', left: 3 }}>*</span>
                            </span>
                            {CountryExDefaultGridRef({
                                fieldid: "countryexgrid",
                                onChange: this.onCountryChange.bind(this),
                                value: this.state.curCountry,
                                //disabled: status && status == 'edit'
                                disabled: this.state.disabledSearch
                            })}
                        </div>
                        <span className="showOff">
                            <NCCheckbox

                                defaultChecked={false}
                                checked={this.state.checked}
                                //disabled = {this.state.showoffDisable}
                                onChange={this.onCheckBoxChange.bind(this)}
                                disabled={this.state.disabledShowOff}
                                //onClick={this.onCheckBoxClick.bind(this)}
                                size="lg"
                            >
                                {this.state.json['10140REG-000029']/* 国际化处理： 显示停用*/}
                            </NCCheckbox>
                        </span>
                        {/* 按钮组 btn-group*/}
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'head',
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.btn-group')

                            })}
                            {/* { createButton('save', {name: '保存',buttonColor:'main-button',style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onSaveRegion.bind(this) })}
                            { createButton('saveAdd', {name: '保存新增',buttonColor:'secondary-button',style:{height:'32px','line-height':'33px',width:'80px','font-size':'13px','font-family':'PingFangHk'}, onButtonClick: this.onSaveAddRegion.bind(this) })}
                            { createButton('cancel', {name: this.state.json['10140REG-000026'],buttonColor:'secondary-button', style:{height:'32px','line-height':'33px',width:'68px','font-size':'13px','font-family':'PingFangHk'},onButtonClick: this.onCancelRegion.bind(this) })} */}

                        </div>
                    </NCDiv>
                </div>
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
                                    clickEditIconEve: this.onEditRegion.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddRegion.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteRegion.bind(this), // 删除点击 回调
                                    showModal: false

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div style={{ height: '100%' }}>
                                <EmptyAreaTip
                                    desc={this.state.json['10140REG-000030']}
                                    show={cardEmpty} />
                                <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                    {createForm(this.config.formId, {
                                        cancelPSwitch: true,
                                        onBeforeEvent: this.onBeforerFormEvent.bind(this),
                                        onAfterEvent: this.onAfterFormEvent.bind(this)

                                    })
                                    }
                                </div>
                            </div>}     //右侧区域dom

                        defLeftWid='20%'      // 默认左侧区域宽度，px/百分百
                    />
                    <PrintOutput
                        ref='printOutput'
                        url={urls.printUrl}
                        data={{
                            funcode: '10140REG',      //功能节点编码，即模板编码
                            // nodekey:'',     //模板节点标识
                            oids: this.state.ids,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                            outputType: "output"
                        }}
                    //callback={this.onSubmit}
                    >
                    </PrintOutput>
                    <div>
                        <ExcelImport
                            {...Object.assign(this.props)}
                            moduleName='uapbd'//模块名
                            billType='region'//单据类型
                            appcode="10140REG"
                            pagecode="10140REG_region"
                        />
                    </div>
                </div>

            </div>

        )
    }
}


/**
 * 设置表单启用状态属性可以编辑
 * @param props
 */
const setFormEnableStateProp = (props) => {
    //获得元数据
    let meta = props.meta.getMeta();
    formId = props.config.formId ? props.config.formId : formId;
    //判断元数据中有我的表单元数据
    if (Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(formId)) {
        //获得表单元数据
        let formMeta = props.meta.getMeta()[formId];
        //判断表单元数据有属性
        if (formMeta.hasOwnProperty("items")) {
            //获得属性
            let items = formMeta.items;
            if (Object.prototype.toString.call(items).slice(8, -1) === 'Array') {
                items.map((item) => {
                    //查找enablestate属性
                    if (item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate') {
                        //设置enablestate属性不可用
                        props.form.setFormItemsDisabled(formId, { enablestate: true });
                    }
                });
            }
        }
    }
}



/**
 * 创建页面
 */
RegionClass = createPage({
    billinfo: {
        billtype: 'form',
        pagecode: pageCode,
        headcode: formId
    },
    //initTemplate: initTemplate,
    //mutiLangCode: '10140REG'
})(RegionClass)

ReactDOM.render(<RegionClass />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65