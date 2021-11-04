//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { print } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import { createPage, base, ajax, NCCreateSearch, toast, high, promptBox,createPageIcon } from 'nc-lightapp-front';
const { NCMenu: Menu, NCDropdown: Dropdown, NCCheckbox: Checkbox, NCPopconfirm: Popconfirm,NCDiv } = base;
const { NCMenuGroup } = Menu;
const { Item } = Menu;
const { PrintOutput } = high

let treeId = 'jobtypeTree';//树组件Id
let formId = 'jobtype';//卡片组件Id
let searchAreaId = 'epsQryTemp';//查询区组件Id
//let nodeTitle = '职务类别-全局';//节点标题
let urlArray = {
    loadTreeDataUrl: "/nccloud/uapbd/jobtype/queryJobtypeTree.do",
    queryTempletUrl: "/nccloud/platform/templet/querypage.do",
    queryCardUrl: "/nccloud/uapbd/jobtype/queryJobtypeCard.do",
    saveCardUrl: '/nccloud/uapbd/jobtype/saveJobtype.do',
    enablestateUrl: "/nccloud/uapbd/jobtype/enableJobtype.do",
    addCardUrl: "/nccloud/uapbd/jobtype/addJobtype.do",
    delTreeNodeUrl: '/nccloud/uapbd/jobtype/deleteJobtype.do',
    printUrl: '/nccloud/uapbd/jobtype/printJobtype.do',
    delCheckUrl: '/nccloud/uapbd/jobtype/checkJobtypeDel.do'
};
let pageCode = "10100JTB_jobtype";
let primaryKey = 'pk_jobtype'

/**
 * 职务类别-全局
 */
class JobType extends Component {
    constructor(props) {
        super(props)
        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        //显示停用复选框的状态标志
        this.state = {
            checked: false,
            disabledSearch: false,
            isDisabled: false,
            count: 0,
            json: {}
        }
        //自定义根节点
        this.root = {
            "isleaf": false,
            "key": "root",
            "title": this.state.json['10100JTB-000000'],/* 国际化处理： 职务类别*/
            "id": "root",
            "innercode": "root",
            "pid": "",
            "refname": this.state.json['10100JTB-000000'],/* 国际化处理： 职务类别*/
            "refpk": "~"
        };

    }

    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        //应测试要求：职务类别集团节点当中，全局的数据不能有删除以及修改按钮
        let noEditDelData = []

        let deleteDataChildrenProp = node => {
            if (node.id != 'root' && node.nodeData.pk_org == 'GLOBLE00000000000000' && this.props.nodeType != 'global') {
                noEditDelData.push({
                    key: node.key,
                    value: {
                        editIcon: false,
                        delIcon: false
                    }
                })
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
            deleteDataChildrenProp(e);
        });

        return noEditDelData;
    }

    initTemplate = (props) => {
        props.createUIDom(
            {
                pagecode: this.props.pageCode//页面id
                // appid: appId,//注册按钮的id
                // appcode: '10100JTB'
            },
            data => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button, () => {
                            this.initButtonStatus(props)
                            this.setState({ count: this.state.count + 1 })
                        });
                    }
                }
            }
        )

    }

    modifierMeta(props, meta) {
        if (this.props.relFunCode == '10100JTB') {
            //设置查询区职务类别参照只能选择全局的职务类别
            meta[formId].items.find(item => item.attrcode == 'father_pk').queryCondition = () => {
                return {
                    pk_org: 'GLOBLE00000000000000'
                }
            }
        }
        return meta;

    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({ json, inlt }, () => {
                    this.initTemplate(this.props)
                })       // 保存json和inlt到页面state中并刷新页面
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: this.props.relFunCode, domainName: 'uapbd', callback })

        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let requestParam = { checked: this.state.checked, nodeType: this.props.nodeType };

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url: urlArray.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.root.refname = this.state.json['10100JTB-000000']
                    this.root.title = this.state.json['10100JTB-000000']
                    let data = [Object.assign({ ...this.root }, { children: result.data })];
                    //同步树  加载全部数据
                    let noEditDelData = this.dealTreeData(data)
                    this.props.syncTree.setSyncTreeData(treeId, data)
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                    if(data[0].children && Array.isArray(data[0].children) && data[0].children.length > 0) {
                        this.props.syncTree.setNodeSelected(treeId, data[0].children[0].refpk)
                        this.onSelectTree(data[0].children[0].refpk)
                    }

                    this.props.syncTree.setIconVisible(treeId, noEditDelData)
                    //修改按钮状态
                    this.initButtonStatus();
                    this.props.form.setFormStatus(formId, 'browse')
                }
            }
        });

    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus() {
        this.props.button.setButtonVisible(['Save', '', 'SaveAdd', 'Cancel'], false);
        this.props.button.setButtonDisabled({ Print: true, Output: true })
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk, callback) {

        //记录一下选中节点的refPK,为打印做准备
        this.refPk = refpk
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(formId);
        if (status == 'edit') {
            return;
        }

        if (refpk == '~') {
            //清空表单
            this.props.form.EmptyAllFormValue(formId);
            this.props.button.setButtonDisabled({ Print: true, Output: true });
			this.props.form.setFormItemsDisabled(formId, { 'enablestate': true });
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        let data = {}
        data[primaryKey] = refpk
        data['nodeType'] = this.props.nodeType
        ajax({
            url: urlArray.queryCardUrl,
            data,
            success: (result) => {

                if (result.success) {
                    //表单数据
                    let headData = result.data[formId].rows[0].values;
                    if (headData.hasOwnProperty('enablestate')) {
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if (enablestateValue == '2') {
                            result.data[formId].rows[0].values.enablestate.value = true;
                        } else {
                            result.data[formId].rows[0].values.enablestate.value = false;
                        }
                    }
                    // 
                    // if(headData.pk_parent.display == 'root'){
                    //     result.data.head.rows[0].values.pk_parent.display = '';
                    //     result.data.head.rows[0].values.pk_parent.value='';
                    // }
                    //清空表单
                    this.props.form.EmptyAllFormValue(formId);
                    //设置表单为所选树节点数据
                    let formData = {}
                    formData[formId] = result.data[formId]
                    this.props.form.setAllFormValue(formData);
                    //设置表单项enablestate可用
                    //this.props.form.setFormItemsDisabled(formId,{enablestate:false});
                    //modified wh 20180713
                    //集团节点，全局级数据的停启用按钮不可编辑，置灰处理
                    this._judgeEnableEditable(result.data[formId].rows[0].values.pk_org.value)
                    this.props.button.setButtonDisabled({ Print: false, Output: false })

                    if(result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            result.formulamsg,{
                                [formId]: 'form'
                            }
                        )
                    }

                    if(callback && typeof callback == 'function') {
                        callback()
                    }

                }
            }
        });
    }

    _judgeEnableEditable(pk_org) {
        let enableEditable = false
        if(this.props.nodeType == 'group' && pk_org == 'GLOBLE00000000000000') {
            enableEditable = true
        }
        this.props.form.setFormItemsDisabled(formId, { enablestate: enableEditable });
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
                let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);

                if (!selectedTreeNode || selectedTreeNode.refpk == '~') {
                    let content = value.value ? this.state.json['10100JTB-000001'] : this.state.json['10100JTB-000002'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    toast({ content: content, color: 'warning' })
                    return;
                }
                let requestParam = { enablestate: value.value ? '2' : '1' };
                requestParam[primaryKey] = selectedTreeNode.refpk
                let pk_org = selectedTreeNode.nodeData.pk_org

                // 先发一发Ajax校验，看是否能够停启用
                requestParam.check = 'Y'
                ajax({
                    url: urlArray.enablestateUrl,
                    data: requestParam,
                    success: (result) => {
                        requestParam.check = 'N'
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100JTB-000003'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                            content: value.value ? this.state.json['10100JTB-000004'] : this.state.json['10100JTB-000005'],             // 提示内容,非必输/* 国际化处理： 确认启用该数据？,您确定要停用所选数据及其所有下级数据吗？*/
                            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                            beSureBtnName: this.state.json['10100JTB-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                            cancelBtnName: this.state.json['10100JTB-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                            beSureBtnClick: () => {
                                if (!this.judgeOperateWithToast(pk_org)) {
                                    props.form.setFormItemsValue(formId, { 'enablestate': { value: !value.value } });
                                    return
                                }
                                ajax({
                                    url: urlArray.enablestateUrl,
                                    data: requestParam,
                                    success: (result) => {
                                        toast({ content: value.value ? this.state.json['10100JTB-000008'] : this.state.json['10100JTB-000009'] });/* 国际化处理： 启用成功,停用成功,提示*/
        
                                    },
                                    error: (res) => {
                                        props.form.setFormItemsValue(formId, { 'enablestate': { value: !value.value } });
                                        toast({ color: 'danger', content: res.message });
                                    }
                                });
                            },
                            cancelBtnClick: () => {
                                //modified wh 20180716
                                props.form.setFormItemsValue(formId, { 'enablestate': { value: !value.value } });
                            },
                            closeBtnClick: () => {
                                //modified wh 20180716
                                props.form.setFormItemsValue(formId, { 'enablestate': { value: !value.value } });
                            }
                        })
                    },
                    error: (res) => {
                        props.form.setFormItemsValue(formId, { 'enablestate': { value: !value.value } });
                        toast({ color: 'danger', content: res.message });
                    }
                });
                break;
            default:
                break;
        }
        //some code
    }

    componentDidUpdate() {
        let formStatus = this.props.form.getFormStatus(formId);
        if (formStatus != 'add' && formStatus != "edit") {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    onBeforeFormEvent(props, moduleId, key, value, data) {
        let formStatus = this.props.form.getFormStatus(formId)
        if (formStatus != 'edit' && !data.pk_jobtype.value) {
            return false
        }

        return true;
    }

    /**
     * 
     */
    onAddJobType(selectNode) {

        let requestParam = {};//请求参数对象

        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk

            requestParam['pk_parent'] = selectNode.refpk;
        } else {
            //不存在选中节点，设置父节点为根节点refpk
            requestParam['pk_parent'] = this.root.refpk;
        }

        requestParam.nodeType = this.props.nodeType

        ajax({
            url: urlArray.addCardUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(formId, 'add');
                    this.setState(this.state, () => {
                        Utils.filterEmptyData(result.data[formId].rows[0].values);
                        //设置新增默认值
                        this.props.form.setAllFormValue({ [formId]: result.data[formId] });
                        //设置表单项不可用
                        this.props.form.setFormItemsDisabled(formId, { enablestate: true });

                        this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用
                        this.changeButtonStatus(selectNode, 'add');
                        this.props.form.setFormStatus(formId, 'edit')
                    })
                }
            }
        })
    }

    judgeOperateWithToast(pk_group) {
        let returnResult = this.canOperate(pk_group)
        if (!returnResult) {
            let toastInfo = { color: 'warning', content: this.props.nodeType == 'global' ? this.state.json['10100JTB-000010'] : this.state.json['10100JTB-000011'] }/* 国际化处理： 全局节点只能维护全局的数据！,集团节点只能维护当前登录集团的数据！*/
            toast(toastInfo)
        }

        return returnResult
    }

    canOperate(pk_group) {
        return (this.props.nodeType == 'global' && pk_group == 'GLOBLE00000000000000') || (this.props.nodeType == 'group' && pk_group != 'GLOBLE00000000000000')
    }

    /**
     * 编辑
     */
    onEditJobType(selectedTreeNode) {
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
        let NCMessage = base.NCMessage
        if (!selectedTreeNode) {

            Message.create({ content: this.state.json['10100JTB-000012'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;

        }
        let pk_org = selectedTreeNode.nodeData.pk_org
        if (!this.judgeOperateWithToast(pk_org)) {
            return
        }

        /***ajax请求***/
        let data = {}
        data[primaryKey] = selectedTreeNode.refpk
        data.nodeType = this.props.nodeType
        data.checkPermission = true
        ajax({
            url: urlArray.queryCardUrl,
            data,
            success: (result) => {

                if (result.success) {
                    let permissionInfo = JSON.parse(result.data.userjson)
                    if (permissionInfo.hasPerm) {
                        this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用

                        //设置表单数据
                        this.props.form.setAllFormValue({ [formId]: result.data[formId] });
                        this.props.form.setFormItemsDisabled(formId, { enablestate: true });//设置表单项不可用
                        //设置表单状态为编辑态
                        this.props.form.setFormStatus(formId, 'edit');
                        this.changeButtonStatus(selectedTreeNode, 'edit');
                    }
                    else {
                        toast({ color: 'warning', content: this.state.json['10100JTB-000013'] })/* 国际化处理： 您没有对此数据执行该操作的权限!*/
                    }
                }
            }
        });

    }

    /**
     * 保存
     */
    onSaveJobType() {


        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
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
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息


        /**
         * 表单校验区域
         */



        /****
         * 构造参数
         * @type {string}
         */
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        // formData.rows[0].values.eps_code.value = selectedTreeNode.nodeData.pcode + formData.rows["0"].values.eps_code.value;
        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.props.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        if (formData.rows[0].values.hasOwnProperty(primaryKey)) {

            pk = formData.rows[0].values[primaryKey].value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (pk == null || pk == '') {
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }
        //ajax请求
        this.props.validateToSave(requestParam, () => {
            ajax({
                url: urlArray.saveCardUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        //设置表单浏览态
    
                        this.props.form.setFormStatus(formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(treeId, false);
                        if (!result.data[0].children || result.data[0].children.length == 0) {
                            delete result.data[0].children;
                        }
    
                        result.data.forEach(item => {
                            item.iconBox = {
                                addIcon: true,
                                editIcon: true,
                                delIcon: true
                            }
                        })
                        if (nonPk) {
    
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(treeId, result.data);
                        } else {
    
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(treeId, result.data[0]);
                        }
                        //展开树节点
                        this.props.syncTree.openNodeByPk(treeId, result.data[0].pid);
    
                        this.props.syncTree.setNodeSelected(treeId, result.data[0].refpk);
                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(formId, { enablestate: false });
                        this.changeButtonStatus(selectedTreeNode, 'save');
    
                        //修正一个BUG：上面的setNodeSelected不会重新走树节点选中的回调，所以导致
                        //新增保存后form当中获取不到主键，停启用不能使用。此处手动设置一下
                        this.props.form.setFormItemsValue(formId, { 'pk_jobtype': { value: result.data[0].refpk, display: "" } })
                        this.onSelectTree(result.data[0].refpk, () => {
                            toast({ title: this.state.json['10100JTB-000029'], color: "success" });/* 国际化处理： 保存成功*/
                        })
                    }
    
                }
            });
        }, {[formId]: "form"})

    }

    /**
     * 保存新增保存新增
     */
    onSaveAddJobType() {

        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
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
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.props.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;

        if (formData.rows[0].values.hasOwnProperty('pk_eps')) {

            pk = formData.rows[0].values.pk_eps.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (pk == null || pk == '') {
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点

        }

        /***ajax请求***/
        ajax({
            url: urlArray.saveCardUrl,
            data: requestParam,
            //modified wh 20180713 
            async: false,
            success: (result) => {
                /**********
                 *
                 * 这里的代码可以精简，临时先这样，逻辑思路是一样的
                 *
                 *
                 *********/
                if (result.success) {
                    //设置表单为浏览态
                    this.props.form.setFormStatus(formId, 'browse');
                    if (!result.data[0].children || result.data[0].children.length == 0) {
                        delete result.data[0].children;
                    }
                    //add wh 20180713
                    result.data.forEach(item => {
                        item.iconBox = {
                            addIcon: true,
                            editIcon: true,
                            delIcon: true
                        }
                    })
                    //add end
                    //新增回调后添加
                    this.props.syncTree.addNodeSuccess(treeId, result.data);
                    this.props.syncTree.openNodeByPk(treeId, result.data[0].pid);

                    //判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
                    if (!selectedTreeNode) {
                        this.props.syncTree.setNodeSelected(treeId, result.data[0].pid);
                        selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
                    }

                    //重新设置整棵树不可用
                    this.props.syncTree.setNodeDisable(treeId, true);

                    //判断是否有选中节点
                    if (!selectedTreeNode) {
                        //如果没有默认加载根节点下面
                        requestParam = {
                            pk_parent: this.root.refpk
                        };
                    } else {
                        requestParam = {
                            pk_parent: selectedTreeNode.refpk
                        };
                    }

                    requestParam.nodeType = this.props.nodeType
                    toast({ title: this.state.json['10100JTB-000029'], color: "success" });/* 国际化处理： 保存成功*/
                    //ajax请求
                    ajax({
                        url: "/nccloud/uapbd/jobtype/addJobtype.do",
                        data: requestParam,
                        //modified wh 20180713
                        //async: false,
                        //注释掉async，因为会影响表单上职务类别概要的清空 modified by wangying16 for NCCLOUD-95821 2018/12/12
                        success: (result) => {
                            if (result.success) {

                                //清空表单数据
                                this.props.form.EmptyAllFormValue(formId);
                                this.props.form.setFormStatus(formId, 'add')
                                //新增成功，设置表单默认值
                                this.setState(this.state, () => {
                                    Utils.filterEmptyData(result.data[formId].rows[0].values);
                                    this.props.form.setAllFormValue({ [formId]: result.data[formId] });
                                    this.props.form.setFormStatus(formId, 'edit')
                                })
                            }
                        }

                    })
                }


            }
        });
        this.changeButtonStatus(selectedTreeNode, 'saveAdd');

    }

    /**
     * 删除
     */
    onDeleteJobType(selectedTreeNode) {

        let requestParam = {};

        //做个过滤条件，全局只能维护全局数据，集团只能维护集团数据
        let pk_org = selectedTreeNode.nodeData.pk_org
        if (!this.judgeOperateWithToast(pk_org)) {
            return
        }

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

            Message.create({ content: this.state.json['10100JTB-000014'], color: 'warning' });//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;

        }
        if (selectedTreeNode.refpk == this.root.refpk) {
            Message.create({ content: this.state.json['10100JTB-000015'], color: 'warning' });//默认top/* 国际化处理： 根节点不能删除*/
            return;

        }
        let message = this.state.json['10100JTB-000016']/* 国际化处理： 确认要删除所选数据吗？*/

        //删除前校验一下数据权限
        ajax({
            url: urlArray.delCheckUrl,
            data: {
                [primaryKey]: selectedTreeNode.refpk
            },
            success: res => {
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10100JTB-000017'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                    content: message,             // 提示内容,非必输
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['10100JTB-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.state.json['10100JTB-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: () => {

                        requestParam = {}

                        requestParam[primaryKey] = selectedTreeNode.refpk
                        let pid = selectedTreeNode.pid;
                        ajax({
                            url: urlArray.delTreeNodeUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {

                                    this.props.form.EmptyAllFormValue(formId);
                                    //调用异步树的接口，删除该树节点
                                    this.props.asyncTree.delTreeData(treeId, selectedTreeNode.refpk);
                                    toast({ content: this.state.json['10100JTB-000018'] });/* 国际化处理： 删除成功！,提示*/
                                    //删除成功提示
                                    // Message.create({content: '删除成功！', color: 'success'});//默认top
                                    this.changeButtonStatus(selectedTreeNode, 'del');
                                }

                            }
                        })
                    }   // 确定按钮点击调用函数,非必输
                })
            },
            error: res => {
                toast({ color: 'warning', content: res.message })
            }
        })

    }

    /**
     * 取消
     */
    onCancelJobType() {

        //同步树 取消的逻辑
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
        if (selectedTreeNode == null) {
            this.props.form.EmptyAllFormValue(formId)
            this.props.form.setFormStatus(formId, 'browse')
            this.changeButtonStatus(null, 'cancel')
            this.props.syncTree.setNodeDisable(treeId, false);
            return
        }
        /**********************************************************
         *
         * 取消：
         *      1、重新根据选中的树节点查询表单对象
         *      2、回调，设置表单对象
         *      3、设置按钮状态
         *
         **********************************************************/

        /**********************************************************     
         * modified by wangying16 on 2018/12/12 for NCCLOUD-95993
         * 1.将会引起表单渲染的语句放到ajax请求内，防止请求未完毕时界面已渲染导致无数据
         * 2.当选中了树节点时，修改表单项停启用状态可用，同NC保持一致。
         **********************************************************/

        let data = {}
        data[primaryKey] = selectedTreeNode.refpk
        if (selectedTreeNode && selectedTreeNode.refpk != '~') {
            //查询节点信息
            ajax({
                url: urlArray.queryCardUrl,
                data,
                success: (result) => {

                    if (result.success) {
                        this.props.form.setFormItemsDisabled(formId, { enablestate: false });
                        this.props.form.setAllFormValue({ [formId]: result.data[formId] });
                        this._judgeEnableEditable(result.data[formId].rows[0].values.pk_org.value)
                        this.props.form.setFormStatus(formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(treeId, false);
                        //设置按钮状态
                        this.changeButtonStatus(selectedTreeNode, 'cancel');

                    }
                }
            });
        } else {
            //没有选中项  清空所有数据
            this.props.form.EmptyAllFormValue(formId);
            this.props.form.setFormStatus(formId, 'browse');
            //设置树可用
            this.props.syncTree.setNodeDisable(treeId, false);
            //设置按钮状态
            this.changeButtonStatus(selectedTreeNode, 'cancel');
        }

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
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode, id) {
        switch (id) {
            case 'add':
            case 'saveAdd':
                this.props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], true)
                this.props.button.setButtonVisible(['Print', 'Output', 'Refresh'], false)
                this.setState({
                    disabledSearch: true,
                    isDisabled: true
                })
                break;
            case 'edit':
                this.props.button.setButtonVisible(['Save', 'Cancel'], true)
                this.props.button.setButtonVisible(['SaveAdd', 'Print', 'Output', 'Refresh'], false)
                this.setState({
                    disabledSearch: true,
                    isDisabled: true
                })
                break;
            case 'del':
                this.props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], false)
                break;
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], false)
                this.props.button.setButtonVisible(['Print', 'Output', 'Refresh'], true)
                this.setState({
                    disabledSearch: false,
                    isDisabled: false
                })
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
            this.props.syncTree.hideIcon(treeId, key, obj);
        }

    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked) {
        let selectNode = this.props.syncTree.getSelectNode(treeId);//获得树节点选中项
        let requestParam = {};
        if (!selectNode) {
            Message.create({ content: this.state.json['10100JTB-000019'], color: 'warning' });//默认top/* 国际化处理： 请选中树节点*/
        }
        requestParam['pk_eps'] = selectNode.refpk;
        requestParam['enablestate'] = checked ? '2' : '1';
        ajax({
            url: "",
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        this.props.form.setAllFormValue({ [formId]: result.data[formId] });
                    } else {
                        //如果不是选中那就清空表单
                        this.props.form.EmptyAllFormValue(formId);
                        this.props.syncTree.delNodeSuceess(treeId, selectNode.refpk);
                    }
                }

            }
        });
    }

    onCheckBoxChange() {
        console.log('checkboxchagned!')
        let checked = !this.state.checked
        this.setState({ checked: !this.state.checked });
        this.props.form.EmptyAllFormValue(formId);//清空表单数据
        let requestParam = {
            checked: checked,
            nodeType: this.props.nodeType
        };
        ajax({
            url: urlArray.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.root.refname = this.state.json['10100JTB-000000']
                    this.root.title = this.state.json['10100JTB-000000']
                    var data = [Object.assign({ ...this.root }, { children: result.data })],
                        initLeaf = function (node) {
                            if (!node.children || node.children.length == 0) {
                                node.iconBox = {
                                    addIcon: true,
                                    editIcon: true,
                                    delIcon: true
                                }
                                delete node.children;
                            }
                            else {
                                node.isLeaf = false;
                                node.iconBox = {
                                    addIcon: true,
                                    editIcon: true,
                                    delIcon: true
                                }
                                node.children.forEach((e) => {
                                    initLeaf(e);
                                });
                            }
                        };

                    data.forEach((e) => {
                        initLeaf(e);
                    });

                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId, data);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                }

            }
        })
    }

    buttonClick(props, id) {
        switch (id) {
            case 'Save':
                this.onSaveJobType()
                break
            case 'SaveAdd':
                this.onSaveAddJobType()
                break
            case 'Cancel':
                this.onCancelButtonClick()
                break
            case 'Refresh':
                this.onRefreshButtonClick()
                break
            case 'Print':
                this.output('print')
                break;
            case 'Output':
                if (!this.refPk || this.refPk == '~') {
                    toast({ content: this.state.json['10100JTB-000020'], color: 'warning' })/* 国际化处理： 请选择需要打印的节点！*/
                    return
                }
                let pks = [];
                pks.push(this.refPk)
                this.setState({
                    pks: pks
                }, () => {
                    this.refs.printOutput.open()
                })
                break;
        }
    }

    output(type = '') {
        if (!this.refPk || this.refPk == '~') {
            toast({ content: this.state.json['10100JTB-000020'], color: 'warning' })/* 国际化处理： 请选择需要打印的节点！*/
            return
        }
        let pks = [];
        pks.push(this.refPk)
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if (type != '') {
            //打印
            print(
                'pdf',
                urlArray.printUrl,
                {
                    funcode:/*this.props.config.funcode*/this.props.funcode,     //功能节点编码
                    nodekey: 'jobtypeprint',     //模板节点标识
                    oids: pks,
                    outputType: type
                }
            )
        }
    }

    onCancelButtonClick() {
        //this.props.modal.show('cancel')
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10100JTB-000021'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
            content: this.state.json['10100JTB-000022'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.state.json['10100JTB-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
            cancelBtnName: this.state.json['10100JTB-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
            beSureBtnClick: this.onCancelJobType.bind(this)   // 确定按钮点击调用函数,非必输
        })
    }

    onCheckBoxClick() {
        console.log('onCheckBoxClick')
        if (!this.state.isDisabled) {
            this.setState({ checked: !this.state.checked });
            this.props.form.EmptyAllFormValue(formId);//清空表单数据
        }
    }

    //add wh 20180713
    onRefreshButtonClick() {
        this.refreshTree()
    }
    //add end

    //add wh 20180713
    refreshTree() {

        let requestParam = { checked: this.state.checked, nodeType: this.props.nodeType };

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url: urlArray.loadTreeDataUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.root.refname = this.state.json['10100JTB-000000']
                    this.root.title = this.state.json['10100JTB-000000']
                    let data = [Object.assign({ ...this.root }, { children: result.data })];
                    let noEditDelData = this.dealTreeData(data)
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId, data);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                    if(data[0].children && Array.isArray(data[0].children) && data[0].children.length > 0) {
                        this.props.syncTree.setNodeSelected(treeId, data[0].children[0].refpk)
                        this.onSelectTree(data[0].children[0].refpk)
                    }

                    this.props.syncTree.setIconVisible(treeId, noEditDelData)
                    //修改按钮状态
                    this.initButtonStatus();
                    toast({ title: this.state.json['10100JTB-000028'], color: "success" });/* 国际化处理： 刷新成功*/
                }
            }
        })
    }
    //add end


    /**
     * 渲染
     * @returns {*}
     */
    render() {
        const { asyncTree, syncTree, form, button, modal, search, DragWidthCom,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const { createAsyncTree } = asyncTree;//创建异步树，需要引入这个
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个

        const { createButtonApp } = button;

        let { createModal } = modal;  //模态框

        const { NCCreateSearch } = search;
        const menu1 = (
            <Menu
                onSelect={this.onMoreSelect.bind(this)}>
                <Item key="start">{this.state.json['10100JTB-000025']/* 国际化处理： 启用*/}</Item>
                <Item key="stop">{this.state.json['10100JTB-000026']/* 国际化处理： 停用*/}</Item>
            </Menu>
        );
        return (

            <div className="nc-bill-tree-card">
                {createModal('modal', { noFooter: false })}
                {createModal('cancel', {
                    title: this.state.json['10100JTB-000021'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10100JTB-000022'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: this.onCancelJobType.bind(this)
                })}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    <div className="title" >
                        {createBillHeadInfo({
                            title:this.props.nodeType == 'global' ? this.state.json['10100JTB-000023'] : this.state.json['10100JTB-000024']/* 国际化处理： 职务类别-全局,职务类别-集团*/,
                            //backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                            showBackBtn:false,
                            initShowBackBtn:false}
                        )}
                    </div>
                    <span className="title-search-detail">
                        <Checkbox

                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            disabled={this.state.isDisabled}
                            size="lg"
                        >
                            {this.state.json['10100JTB-000027']/* 国际化处理： 显示停用*/}
                        </Checkbox>
                    </span>

                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'header-action',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                        })}

                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">

                    <DragWidthCom
                        // 左树区域
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    //onSelectedChange: this.onSelectTreeNodeChange.bind(this),//选择改变
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditJobType.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddJobType.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteJobType.bind(this), // 删除点击 回调
                                    showModal: false,
                                    searchType:'filtration',//树节点过滤方式修改
                                    disabledSearch: this.state.disabledSearch || false

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div className="card-area">
                                {createForm(formId, {
                                    onAfterEvent: this.onAfterFormEvent.bind(this),
                                    onBeforeEvent: this.onBeforeFormEvent.bind(this)
                                })
                                }
                            </div>}     //右侧区域dom

                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百
                    />
                </div>

                <PrintOutput
                    ref='printOutput'
                    url={urlArray.printUrl}
                    data={{
                        funcode: this.props.funcode,
                        nodekey: 'jobtypeprint',
                        oids: this.state.pks,
                        outputType: 'output'
                    }}
                />

            </div>

        )
    }
}

export default JobType

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65