//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, output, high, getBusinessInfo, promptBox, createPageIcon } from 'nc-lightapp-front';
import OrgSelect from "../component/org";
import CustClassTree from "../component/custclasstree";
const { NCCheckbox, NCMessage: Message, NCDiv } = base;
const { PrintOutput } = high;
import Utils from '../../../public/utils/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';

/****************默认参数  开始***********************/
const formId = 'checkiteminfo';//卡片组件Id
const urls = {
    loadTreeDataUrl: "/nccloud/uapbd/orgcloseacc/LoadCheckTypeTreeData.do",
    queryCardUrl: "/nccloud/uapbd/orgcloseacc/QueryCheckItem.do",
    addCardUrl: "/nccloud/uapbd/orgcloseacc/AddCheckItem.do",
    addTreeNodeUrl: "/nccloud/uapbd/orgcloseacc/AddCheckType.do",
    deleteUrl: '/nccloud/uapbd/orgcloseacc/DeleteCheckItem.do',
    saveUrl: '/nccloud/uapbd/orgcloseacc/SaveCheckItem.do',
    saveTreeNodeUrl: '/nccloud/uapbd/orgcloseacc/SaveCheckType.do',
    validateUrl: '/nccloud/uapbd/orgcloseacc/ValidateCheckItem.do',
    deleteTreeNodeUrl: '/nccloud/uapbd/orgcloseacc/DeleteCheckType.do',
    editTreeNodeUrl: "/nccloud/uapbd/orgcloseacc/QueryCheckType.do",
    cancelUrl: '/nccloud/uapbd/custclass/cancel.do',
    printUrl: '/nccloud/uapbd/orgcloseacc/PrintCheckItem.do'       //打印


};
const pageCode = "101008_checkitem";//默认集团
const appid = '101008';
const dealItemTypeModel = 'checktypeinfo';

/***************默认参数  结束********************/

class Comp extends Component {

    constructor(props) {

        super(props)

        this.config = {
            title: '月结检查项',
            treeId: "checkItemTree",
            formId: "checkiteminfo",
            pageCode: "101008_checkitem",
            printFunCode: '101008',//有打印模板的小应用编码
            printNodeKey: 'printitem',//模板节点标识
            nodeType: 'GROUP_NODE',
            refresh: 'uapbd/orgcloseacc/checkitem/main/index.html',
            primaryKey: 'pk_checkitem',
            urls: urls,
            actions: {
                TreeNodeAdd: 'TreeNodeAdd',
                TreeNodeEdit: 'TreeNodeAdd',
                TreeNodeDel: 'TreeNodeDel',
                Add: 'Add',
                Edit: 'Edit',
                Delete: 'Delete',
                Copy: 'Copy',
                Refresh: 'Refresh',
                Save: 'Save',
                Cancel: 'Cancel',
                Print: 'Print',
                Print1: 'Print1',
                Output: 'Output'
            },//表单所有动作
        };

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key": "~",
            "title": '月结检查项类别',
            "id": "~",
            "innercode": "~",
            // "pid": "~",
            "refname": '月结检查项类别',
            "refpk": "~"
        };

        this.state = {
            // checked: false,//判断 显示停用按钮是否选中
            // disabledShowOff:false,//禁用复选框
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
            disabledSearch: false,//树搜索框
            json: {},
            inlt: null
        }

        createUIDom(props)(
            { pagecode: pageCode },
            { moduleId: '101008', domainName: 'uapbd' },
            (data, langData, inlt) => {
                //多语
                if (langData) {
                    this.state.json = langData;
                    if (inlt) {
                        this.state.inlt = inlt;
                    }
                    this.root.title = this.state.json['101008-000001'];/* 国际化处理： 月结检查项类别*/
                    this.root.refname = this.state.json['101008-000001'];/* 国际化处理： 月结检查项类别*/
                }
                if (data.template) {
                    props.meta.setMeta(data.template);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                    props.button.setButtonVisible(['Print1'], false);
                }
                this.loadTreeData();
            }
        );
    }

    // 初始化树
    componentDidMount() {
        //this.loadTreeData();
    }

    componentDidUpdate() {
        let l_formstatus = this.props.form.getFormStatus(formId);
        let modalFormStatus = this.props.form.getFormStatus(dealItemTypeModel);
        if (l_formstatus != 'add' && l_formstatus != 'edit' && modalFormStatus != 'add' && modalFormStatus != 'edit') {
            window.onbeforeunload = null;
        }
        else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
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
        data && data.forEach((e) => {
            e.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    loadTreeData = (callback) => {

        let data;

        ajax({
            url: urls.loadTreeDataUrl,
            data,
            success: (res) => {
                if (res.success) {
                    let data = [Object.assign({ ...this.root }, { children: res.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //默认选中根节点
                    this.props.syncTree.setNodeSelected(this.config.treeId, this.root.refpk);
                    //刷新，关闭所有节点
                    // this.props.syncTree.closeNodeByPk(this.config.treeId);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    this.onSelectTree(this.root.refpk);

                    callback && callback();
                }
            }

        })
    }

    addTreeNode = (selectNode) => {
        this.selectNode = selectNode;
        let requestParam = {
            module: selectNode.refpk
        };
        ajax({
            url: urls.addTreeNodeUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    this.showDealItemTypeModel(() => {
                        //清空表单数据
                        this.props.form.EmptyAllFormValue(dealItemTypeModel);
                        //设置新增默认值
                        this.props.form.setAllFormValue({ [dealItemTypeModel]: result.data[dealItemTypeModel] });
                        //设置表单为编辑态
                        this.props.form.setFormStatus(dealItemTypeModel, 'add');
                    });
                }
            }
        })
    }

    editTreeNode = (selectedTreeNode) => {
        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        //设置当前选中节点
        this.setState({
            curSelectedNode: selectedTreeNode,
            oldParent: selectedTreeNode.pid, //记录父节点pk 移动树节点时使用
            isAdd: false
        }, () => {
            this.props.button.setButtonVisible(['Add', 'Refresh'], true);
            this.props.button.setButtonVisible(['Save', 'Cancel', 'Edit', 'Delete', 'Copy', 'Print', 'Preview', 'Output', 'Print1'], false);

            //请求参数对象
            let requestParam = {
                primaryKey: selectedTreeNode.refpk
            };
            ajax({
                url: this.config.urls.editTreeNodeUrl,
                data: requestParam,
                success: (res) => {
                    if (res.success && res.data) {
                        this.showDealItemTypeModel(() => {
                            //清空表单数据
                            this.props.form.EmptyAllFormValue(dealItemTypeModel);
                            //设置表单数据
                            this.props.form.setAllFormValue({ [dealItemTypeModel]: res.data[dealItemTypeModel] });
                            // this.props.form.setFormItemsDisabled(dealItemTypeModel,{enablestate:true});//设置表单项不可用
                            //设置表单状态为编辑态
                            this.props.form.setFormStatus(dealItemTypeModel, 'edit');

                        });
                    }
                }
            })
        });
    }

    showDealItemTypeModel(callback) {
        this.props.modal.show(dealItemTypeModel, {
            title: this.state.json['101008-000001'],/* 国际化处理： 月结检查项类别*/
            content: <div>
                {this.props.form.createForm(dealItemTypeModel, {})}
            </div>,
            leftBtnName: this.state.json['101008-000015'],/* 国际化处理： 保存*/
            rightBtnName: this.state.json['101008-000016'],/* 国际化处理： 取消*/
            beSureBtnClick: () => { this.saveTreeNode() },
            cancelBtnClick: () => { this.cancelBtnClick() }, //取消按钮事件回调
            closeModalEve: () => { this.closeModalEve() }, //关闭按钮事件回调
            userControl: true  // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
        });

        callback && callback();
    }

    deleteTreeNode = (selectedTreeNode) => {

        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        //保障性操作
        if (!selectedTreeNode) {
            toast({ content: this.state.json['101008-000004'], color: 'warning' });/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        if (selectedTreeNode.refpk == this.root.refpk) {
            toast({ content: this.state.json['101008-000005'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        //设置当前选中节点
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);

        let requestParam = {
            primaryKey: selectedTreeNode.refpk,
            pk_curOrg: this.state.curOrg.refpk,
            ts: selectedTreeNode.nodeData.ts,
            nodeType: this.config.nodeType
        };

        promptBox({
            color: "warning",
            title: this.state.json['101008-000006'],/* 国际化处理： 确认删除*/
            content: this.state.json['101008-000007'],/* 国际化处理： 您确定要删除所选数据吗?*/
            beSureBtnClick: () => {
                this.del(selectedTreeNode, requestParam);
            }
        });

    }

    del = (selectedTreeNode, requestParam) => {
        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (result) => {
                /**************************************************************
                 * 先校验有无删除权限，能删除在做下一步操作
                 **************************************************************/
                if (result.success && result.data) {
                    promptBox({
                        color: "warning",
                        title: this.state.json['101008-000006'],/* 国际化处理： 确认删除*/
                        content: this.state.json['101008-000008'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
                        beSureBtnClick: () => {
                            if (selectedTreeNode['children']) {
                                if (selectedTreeNode.children.length > 0) {
                                    toast({ content: this.state.json['101008-000009'], color: 'danger' });/* 国际化处理： 数据已被引用，不能删除*/
                                    return;
                                }
                            } else {
                                ajax({
                                    url: this.config.urls.deleteTreeNodeUrl,
                                    data: requestParam,
                                    success: (result) => {
                                        if (result.success) {
                                            //清空表单数据
                                            this.props.form.EmptyAllFormValue(this.config.formId);
                                            //删除树节点
                                            this.props.syncTree.delNodeSuceess(this.config.treeId, selectedTreeNode.refpk);
                                            //删除成功提示
                                            toast({ title: this.state.json['101008-000010'], color: 'success' });/* 国际化处理： 删除成功！*/
                                            //重新设置按钮状态
                                            this.changeButtonStatus(selectedTreeNode, this.config.actions.TreeNodeDel);
                                        }

                                    }
                                })
                            }
                        }
                    });
                }
            }
        });
    }

    refreshTreeNode = () => { }

    saveTreeNode = () => {

        let selectNode = this.state.curSelectedNode;

        if (selectNode == undefined) {

            selectNode = this.selectNode;
        }

        // 获得表单数据
        if (!this.props.form.isCheckNow(dealItemTypeModel)) {
            return;
        }

        let formData = this.props.form.getAllFormValue(dealItemTypeModel);//获得表单信息
        formData.areacode = dealItemTypeModel;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        /**************************************************************
         *  请求参数对象
         **************************************************************/
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            treeNodeType: selectNode.nodeData.treeNodeType
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = false;
        if (formData.rows[0].values.hasOwnProperty('pk_checktype')) {
            nonPk = (!!formData.rows[0].values.pk_checktype.value) ? false : true;
        }
        ajax({
            url: this.config.urls.saveTreeNodeUrl,
            data: requestParam,
            success: (result) => {
                if (result.success) {

                    //去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                    if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
                        delete result.data.treeNodeData[0].children;
                    }
                    /**************************************************************
                     * 是否是移动节点
                     **************************************************************/
                    let isMove = false;
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
                    //设置新增节点为选中节点
                    this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
                    //设置表单为浏览态
                    this.props.form.setFormStatus(this.config.formId, 'browse');
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.changeButtonStatus();
                    this.props.modal.close(dealItemTypeModel);

                    //清空选中节点的缓存
                    this.setState({ curSelectedNode: null });
                    this.state.disabledShowOff = false;
                    this.setState(this.state);

                    toast({ content: this.state.json['101008-000017'], color: 'success' });/* 国际化处理： 保存成功*/
                }

            }
        });

    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree = (refpk) => {

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
            this.props.button.setButtonVisible(['Save', 'Cancel', 'Add', 'Edit', 'Delete', 'Copy', 'Print', 'Preview', 'Output', 'Print1'], false);

            return;
        }

        this.changeButtonStatus();

        let treeNodeType = this.props.syncTree.getSelectNode(this.config.treeId).nodeData.treeNodeType;

        if (!(treeNodeType == 'checkitem')) {
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            return;
        }

        /******************************************************
         * 请求参数
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         ******************************************************/
        let requestParam = {
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

                    //处理显示公式
                    this.dealFormula(result, formId);

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

    afterEvent = (props, moduleId, key, value, oldValue) => {

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
                addIcon: false
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }
        else {

            let treeData = this.props.syncTree.getSyncTreeValue(this.config.treeId, key);
            let nodeType = treeData.nodeData.treeNodeType;
            let ispreset = treeData.nodeData.ispreset;

            if (nodeType == 'module') {
                let obj = {
                    delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                    editIcon: false,
                    addIcon: true
                };

                //总账不可新增
                if (key == '2002') {
                    obj.addIcon = false;
                }

                this.props.syncTree.hideIcon(this.config.treeId, key, obj);

            }
            else if (nodeType == 'checktype') {
                let obj = {
                    delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                    editIcon: true,
                    addIcon: false
                };
                if (ispreset == 'N') {
                    obj.delIcon = true;
                }

                //如果是总账下的checktype，那么不能编辑也不能删除 -- wangqchf
                if (treeData.nodeData.moduleId && treeData.nodeData.moduleId == '2002') {
                    obj.delIcon = false
                    obj.editIcon = false
                }
                this.props.syncTree.hideIcon(this.config.treeId, key, obj);

            }
            else if (nodeType == 'checkitem') {
                let obj = {
                    delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                    editIcon: false,
                    addIcon: false
                };

                this.props.syncTree.hideIcon(this.config.treeId, key, obj);
            }
        }
    }

    add = () => {

        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

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
         * 记录原父节点pk,移动树节点时使用
         ******************************************************/
        this.setState({ oldParent: parent_id });

        /***
         * 选中 检查类型 的树节点时
         * 加载树是会返回树节点类型，checktype 为检查类型节点
         */
        if (selectNode.nodeData.treeNodeType == "checktype") {

            /******************************************************
             * 请求参数对象
             * moduleid 所属模块pk
             * checktypeid 检查项类别pk
             ******************************************************/
            let requestParam = {
                module: selectNode.pid,
                checktype: selectNode.refpk
            };

            ajax({
                url: this.config.urls.addCardUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        //清空表单数据
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为编辑态
                        this.props.form.setFormStatus(this.config.formId, 'add');
                        //表单数据
                        let headData = result.data[this.config.formId].rows[0].values;
                        if (headData.hasOwnProperty('enablestate')) {
                            let enablestateValue = headData.enablestate.value;
                            //根据表单项enablestate的值修改开关状态
                            if (enablestateValue == '2') {
                                result.data[this.config.formId].rows[0].values.enablestate.value = true;
                                result.data[this.config.formId].rows[0].values.enablestate.display = true;
                            } else {
                                result.data[this.config.formId].rows[0].values.enablestate.value = false;
                                result.data[this.config.formId].rows[0].values.enablestate.display = false;
                            }
                        }

                        this.setState(this.state, () => {
                            //设置新增默认值
                            this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });

                            //设置表单项不可用
                            this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true, associpoint: false });
                            //修正一下form当中关联应用的问题，如果是预置数据并且有值的情况下不可编辑-- liyfp
                            if (selectNode.nodeData.ispreset && selectNode.nodeData.ispreset == 'Y') {
                                this.props.form.setFormItemsDisabled(this.config.formId, { associappid: true });
                                let mate = this.props.meta.getMeta();
                                mate[this.config.formId].items.map((item) => {
                                    if ("associappid" == item.attrcode) {
                                        item.required = false;
                                    }
                                });
                                this.props.meta.setMeta(mate);
                            } else {
                                this.props.form.setFormItemsDisabled(this.config.formId, { associappid: false });
                                let mate = this.props.meta.getMeta();
                                mate[this.config.formId].items.map((item) => {
                                    if ("associappid" == item.attrcode) {
                                        item.required = true;
                                    }
                                });
                                this.props.meta.setMeta(mate);
                            }

                            this.props.syncTree.setNodeDisable(this.config.treeId, true);//编辑时设置整棵树不可用
                            this.setState({ disabledSearch: true });

                            //新增成功，设置按钮状态
                            this.changeButtonStatus();

                            /*******************************
                             * 回调成功后  设置新增标志
                             * @type {boolean}
                             *******************************/
                            this.state.isAdd = true;
                        });

                    }
                }
            })
        }
    }

    edit = () => {

        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

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
            toast({ content: this.state.json['101008-000003'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }

        //编辑时设置整棵树不可用
        this.props.syncTree.setNodeDisable(this.config.treeId, true);
        this.setState({ disabledSearch: true });
        //设置表单状态为编辑态
        this.props.form.setFormStatus(this.config.formId, 'edit');
        // //设置表单状态为编辑态
        // this.props.form.setFormStatus(dealItemTypeModel, 'edit');

        this.setCheckoncloseProperty();
        //修正一下form当中关联应用的问题，如果是预置数据并且有值的情况下不可编辑-- liyfp
        if (selectedTreeNode.nodeData.ispreset && selectedTreeNode.nodeData.ispreset == 'Y') {
            this.props.form.setFormItemsDisabled(this.config.formId, { associappid: true });
            let mate = this.props.meta.getMeta();
            mate[this.config.formId].items.map((item) => {
                if ("associappid" == item.attrcode) {
                    item.required = false;
                }
            });
            this.props.meta.setMeta(mate);
        } else {
            this.props.form.setFormItemsDisabled(this.config.formId, { associappid: false });
            let mate = this.props.meta.getMeta();
            mate[this.config.formId].items.map((item) => {
                if ("associappid" == item.attrcode) {
                    item.required = true;
                }
            });
            this.props.meta.setMeta(mate);
        }
        //修正一下form当中关联节点的问题，如果是预置数据并且有值的情况下不可编辑，否则可编辑 -- wangqchf
        let associpointValue = this.props.form.getFormItemsValue(this.config.formId, 'associpoint')
        let isAssociNotNull = associpointValue && associpointValue.value && (associpointValue.value != '')
        if (selectedTreeNode.nodeData.ispreset && selectedTreeNode.nodeData.ispreset == 'Y' && isAssociNotNull) {
            this.props.form.setFormItemsDisabled(this.config.formId, { associpoint: true })
        }
        else {
            this.props.form.setFormItemsDisabled(this.config.formId, { associpoint: false })
        }

        this.changeButtonStatus();

    }

    delete = () => {

        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

        if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
            return;
        }
        //* 保障性操作
        if (!selectedTreeNode) {
            toast({ content: this.state.json['101008-000004'], color: 'warning' });/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        //根节点不能删除
        if (selectedTreeNode.refpk == this.root.refpk) {
            toast({ content: this.state.json['101008-000005'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        //* 设置当前选中节点
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        //* 请求参数对象
        let requestParam = {
            primaryKey: selectedTreeNode.refpk,
            ts: selectedTreeNode.nodeData.ts
        };

        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (result) => {
                // * 先校验有无删除权限，能删除在做下一步操作
                if (result.success) {
                    promptBox({
                        color: "warning",
                        title: this.state.json['101008-000006'],/* 国际化处理： 确认删除*/
                        content: this.state.json['101008-000007'],/* 国际化处理： 您确定要删除所选数据吗?*/
                        beSureBtnClick: () => {
                            promptBox({
                                color: "warning",
                                title: this.state.json['101008-000006'],/* 国际化处理： 确认删除*/
                                content: this.state.json['101008-000008'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
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
                                                toast({ title: this.state.json['101008-000010'], color: 'success' });/* 国际化处理： 删除成功！*/
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

    refresh = () => {
        this.loadTreeData(() => {
            toast({ color: 'success', title: this.state.json['101008-000011'] });/* 国际化处理： 刷新成功！*/
        });
    }

    copy = () => {

        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

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
         * 记录原父节点pk,移动树节点时使用
         ******************************************************/
        this.setState({ oldParent: parent_id });

        /***
         * 选中 检查类型 的树节点时
         * 加载树是会返回树节点类型，checktype 为检查类型节点
         */
        if (selectNode.nodeData.treeNodeType == "checkitem") {
            //清空表单数据
            // this.props.form.EmptyAllFormValue(this.config.formId);
            //设置表单为编辑态
            this.props.form.setFormStatus(this.config.formId, 'add');
            //编辑时设置整棵树不可用
            this.props.syncTree.setNodeDisable(this.config.treeId, true);
            // this.setState({disabledSearch:true});
            this.state.disabledSearch = true;

            this.props.form.setFormItemsValue(this.config.formId, {
                'pk_checkitem': { value: '', display: '' },
                'ts': { display: '', value: '' },
                'creator': { display: '', value: '' },
                'creationtime': { display: '', value: '' },
                'modifier': { display: '', value: '' },
                'modifiedtime': { display: '', value: '' },
                'ispreset': { display: '', value: '' }
            })

            // //设置新增默认值
            // let row = this.props.form.getAllFormValue(this.config.formId).rows[0];
            //
            // //设置空值
            // row.values.pk_checkitem.value = '';
            // row.values.ts.value = '';
            // row.values.creator.value = '';
            // row.values.creationtime.value = '';
            // row.values.modifier.value = '';
            // row.values.modifiedtime.value = '';
            // row.values.name.value = '';
            //
            // let newFormData = {
            //     areacode:this.config.formId,
            //     rows:[{row}]
            // }
            //
            // this.props.form.EmptyAllFormValue(this.config.formId);
            // this.props.form.setAllFormValue({[this.config.formId]:newFormData});
            //新增成功，设置按钮状态
            this.changeButtonStatus(selectNode, this.config.actions.TreeNodeAdd);

            /*******************************
             * 回调成功后  设置新增标志
             * @type {boolean}
             *******************************/
            this.state.isAdd = true;
            this.setState(this.state);
        }
    }

    save = () => {

        if (!this.props.form.isCheckNow(this.config.formId)) return;

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
            treeNodeType: this.props.syncTree.getSelectNode(this.config.treeId).nodeData.treeNodeType
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = false;
        if (formData.rows[0].values.hasOwnProperty(this.config.primaryKey)) {
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value) ? false : true;
        }

        let requestParam1 = {
            model: formData,
            pageid: this.config.pageCode
        };

        let saveajax = () => {
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {

                        /**************************************************************
                         *  设置树可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId, false);
                        this.setState({ disabledSearch: false });

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
                         * 清空选中节点的缓存
                         **************************************************************/
                        this.setState({ curSelectedNode: null });
                        this.state.disabledShowOff = false;
                        this.setState(this.state);

                        toast({ content: this.state.json['101008-000017'], color: 'success' });/* 国际化处理： 保存成功*/
                    }
                }
            });
        }

        this.props.validateToSave(requestParam1, saveajax, { [formId]: 'form' }, 'form');
    }

    cancel = () => {

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

            if (selectedTreeNode.nodeData.treeNodeType == 'checkitem') {

                //查询节点信息
                ajax({
                    url: this.config.urls.queryCardUrl,
                    data: requestParam,
                    success: (result) => {
                        if (result.success) {
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
                            // this.setState({disabledSearch:false});
                            this.state.disabledSearch = false;

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
            } else {

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
                // this.setState({disabledSearch:false});
                this.state.disabledSearch = false;

                /**********************************************************
                 * 设置enablestate可用
                 **********************************************************/
                this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: false });
                /**********************************************************
                 * 设置按钮状态
                 **********************************************************/
                this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
            }

            this.setState(this.state);

        }
    }

    saveItemTypeModal = () => { }

    closeItemTypeModal = () => { }

    onAfterFormEvent = (props, moduleId, key, value, oldValue) => {
        if (key == 'checkstrategy') {
            this.setCheckoncloseProperty(value);
        }
    }

    setCheckoncloseProperty = (checkstrategyValue) => {

        if (checkstrategyValue == undefined) {
            checkstrategyValue = this.props.form.getFormItemsValue(formId, 'checkstrategy');
        }

        if (checkstrategyValue && checkstrategyValue.value == 1) {
            this.props.form.setFormItemsValue(formId, { 'checkonclose': { value: true, display: this.state.json['101008-000012'] } });/* 国际化处理： 是*/
            this.props.form.setFormItemsDisabled(formId, { 'checkonclose': true });
        } else {
            this.props.form.setFormItemsDisabled(formId, { 'checkonclose': false });
        }
        this.setState(this.state);
    }

    onButtonClick = (props, id) => {
        switch (id) {
            case this.config.actions.Add:
                this.add(); break;
            case this.config.actions.Edit:
                this.edit(); break;
            case this.config.actions.Delete:
                this.delete(); break;
            case this.config.actions.Refresh:
                this.refresh(); break;
            case this.config.actions.Copy:
                this.copy(); break;
            case this.config.actions.Save:
                this.save(); break;
            case this.config.actions.Cancel:
                promptBox({
                    color: "warning",
                    title: this.state.json['101008-000013'],/* 国际化处理： 确认取消*/
                    content: this.state.json['101008-000014'],/* 国际化处理： 是否确认取消？*/
                    beSureBtnClick: this.cancel.bind(this)
                });
                break;
            case this.config.actions.Print:
                this.print(); break;
            case this.config.actions.Output:
                this.export(); break;
        }
    }

    //打印
    print = () => {

        let refpk = this.props.syncTree.getSelectNode(this.config.treeId).refpk;

        let pks = [refpk];

        print(
            'pdf',
            urls.printUrl,
            {
                funcode: this.config.printFunCode,//功能节点编码
                nodekey: this.config.printNodeKey,//模板节点编码
                oids: pks
            }
        )
    }
    //输出
    export = () => {



        let refpk = this.props.syncTree.getSelectNode(this.config.treeId).refpk;

        let pks = [refpk];

        // this.setState({
        //     ids : pks
        // },this.refs.printOutput.open());

        var data = {
            funcode: this.config.printFunCode, //功能节点编码，即模板编码
            nodekey: this.config.printNodeKey, //模板节点标识
            oids: pks, //或['1001A41000000000A9LR','1001A410000000009JDD'] 单据pk oids含有多个元素时为批量打印,
            outputType: "output"
        }
        output({ data: data, url: urls.printUrl });
    }

    checkTreeNodeIsDisabled = (node) => {
        return !!node.disabled;
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

    changeButtonStatus = () => {

        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        if (selectedTreeNode == undefined) {
            selectedTreeNode = this.state.curSelectedNode;
        }
        let treeNodeType = selectedTreeNode.nodeData.treeNodeType;
        let modifier = selectedTreeNode.nodeData.modifier;
        let status = this.props.form.getFormStatus(this.config.formId);

        if (status == 'edit' || status == 'add') {
            this.props.button.setButtonVisible(['Save', 'Cancel'], true);
            this.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Refresh', 'Print', 'Preview', 'Output', 'Print1'], false);
        } else {
            switch (treeNodeType) {
                case 'module':
                    this.props.button.setButtonVisible(['Refresh'], true);
                    this.props.button.setButtonVisible(['Save', 'Cancel', 'Add', 'Edit', 'Delete', 'Copy', 'Print', 'Preview', 'Output', 'Print1'], false);
                    break;
                case 'checktype':
                    this.props.button.setButtonVisible(['Add', 'Refresh'], true);
                    this.props.button.setButtonVisible(['Save', 'Cancel', 'Edit', 'Delete', 'Copy', 'Print', 'Preview', 'Output', 'Print1'], false);
                    if (selectedTreeNode.nodeData['moduleId'] === '2002') {
                        this.props.button.setButtonVisible(['Add'], false);
                    }
                    break;
                case 'checkitem':
                    //总账下所有的内容均不可编辑 -- wangqchf
                    let visibleActions = ['Edit', 'Delete', 'Copy', 'Refresh', 'Print', 'Preview', 'Output']
                    let unVisibleActions = ['Save', 'Cancel', 'Add', 'Print1']
                    if (selectedTreeNode.nodeData.moduleId && selectedTreeNode.nodeData.moduleId == '2002') {
                        visibleActions = ['Refresh', 'Print', 'Preview', 'Output']
                        unVisibleActions = ['Save', 'Cancel', 'Add', 'Print1', 'Edit', 'Delete', 'Copy']
                    }
                    this.props.button.setButtonVisible(unVisibleActions, false);
                    this.props.button.setButtonVisible(visibleActions, true);

                    if (selectedTreeNode.nodeData['checkattr'] != 1 || selectedTreeNode.nodeData['moduleId'] === '2002') {
                        this.props.button.setButtonVisible(['Edit'], false);
                    }

                    if (selectedTreeNode.nodeData['ispreset'] === 'Y') {
                        this.props.button.setButtonVisible(['Delete'], false);
                    } else {
                        if (selectedTreeNode.nodeData['checkattr'] === 0 && selectedTreeNode.nodeData['moduleId'] != '2002') {
                            this.props.button.setButtonVisible(['Delete'], false);
                        }
                    }

                    break;
                default:
                    this.props.button.setButtonVisible(['Save', 'Cancel', 'Add', 'Edit', 'Delete', 'Copy', 'Refresh', 'Print', 'Preview', 'Output', 'Print1'], false);
                    break;
            }
        }
    }

    cancelBtnClick = () => {
        promptBox({
            color: "warning",
            title: this.state.json['101008-000013'],/* 国际化处理： 确认取消*/
            content: this.state.json['101008-000014'],/* 国际化处理： 是否确认取消？*/
            beSureBtnClick: () => {
                this.props.modal.close(dealItemTypeModel);
            }
        })
    }

    closeModalEve = () => {
        this.props.modal.show(dealItemTypeModel, {
            title: this.state.json['101008-000001'],/* 国际化处理： 月结检查项类别*/
            content: <div>
                {this.props.form.createForm(dealItemTypeModel, {})}
            </div>,
            leftBtnName: this.state.json['101008-000015'],/* 国际化处理： 保存*/
            rightBtnName: this.state.json['101008-000016'],/* 国际化处理： 取消*/
            beSureBtnClick: () => { this.saveTreeNode() },
            cancelBtnClick: () => { this.cancelBtnClick() }, //取消按钮事件回调
            closeModalEve: () => { this.closeModalEve() }, //关闭按钮事件回调
            userControl: true  // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
        });
        // this.cancelBtnClick();
        promptBox({
            color: "warning",
            title: this.state.json['101008-000013'],/* 国际化处理： 确认取消*/
            content: this.state.json['101008-000014'],/* 国际化处理： 是否确认取消？*/
            beSureBtnClick: () => {
                this.props.modal.close(dealItemTypeModel);
            }
        })
    }

    dealFormula = (result, fid) => {
        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
            this.props.dealFormulamsg(
                result.formulamsg,
                {
                    [fid]: "form"
                }
            );
        }
    }

    render() {
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const { syncTree, form, button, modal, DragWidthCom, BillHeadInfo } = this.props;

        const { createBillHeadInfo } = BillHeadInfo;
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个

        const { createForm } = form;//创建表单，需要引入这个

        const { createButtonApp, createButton } = button;

        let { createModal } = modal;  //模态框

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
            clickAddIconEve: this.addTreeNode.bind(this), //新增点击 回调
            clickEditIconEve: this.editTreeNode.bind(this), //编辑点击 回调
            clickDelIconEve: this.deleteTreeNode.bind(this), // 删除点击 回调
            showModal: this.state.tree.showModal,
            disabledSearch: this.state.disabledSearch //树查询框禁用
        };

        let title = this.state.json['101008-000000'];/* 国际化处理： 月结检查项*/

        return (
            <div className='nc-bill-tree-card'>

                {createModal('modal', { noFooter: false })}

                {createModal(dealItemTypeModel)}

                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="header">
                    {
                        createBillHeadInfo(
                            {
                                title: title ? title : this.config.title,             //标题
                                initShowBackBtn: false
                            }
                        )}
                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {createButtonApp({
                            area: this.config.formId,
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.' + this.config.formId)

                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom={<CustClassTree treeConfig={custTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree} />}
                        // 右卡片区域
                        rightDom={<div className="card-area">
                            {createForm(this.config.formId, { onAfterEvent: this.onAfterFormEvent.bind(this) })}
                        </div>}
                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='280px'
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={urls.printUrl}
                    data={{
                        funcode: this.config.printFunCode,//功能节点编码
                        nodekey: this.config.printNodeKey,//模板节点编码
                        oids: this.state.ids,
                        outputType: 'output'
                    }}
                />
            </div>

        )
    }
}

var CheckItem = createPage({
    billinfo: [
        {
            billtype: 'form',
            pagecode: '101008_checkitem',
            headcode: formId
        },
        {
            billtype: 'form',
            pagecode: '101008_checkitem',
            headcode: dealItemTypeModel
        }
    ]
})(Comp);
ReactDOM.render(<CheckItem />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65