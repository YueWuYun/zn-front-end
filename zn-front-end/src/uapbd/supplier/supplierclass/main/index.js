//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
const { PrintOutput, ExcelImport } = high;
import OrgRefer from "../component/SupplierClassOrgRefer";
import SupplierClassTree from "../component/SupplierClassTree";

const { NCCheckbox, NCDiv, EmptyAreaTip } = base;
import Utils from '../../../public/utils/index';
import SupplierClassForm from "../component/SupplierClassForm";
import createUIDom from "../../../public/utils/BDCreateUIDom";

/**
 * 全局主键
 * @type {string}
 */
const PK_GLOBE = 'GLOBLE00000000000000';
export default class SupplierClass extends Component {
    constructor(props) {
        super(props);

        createUIDom(props)(props.config, { moduleId: "10140SCL", domainName: 'uapbd' }, (data, lang) => {
            this.lang = lang;
            this.state = {
                cardEmpty: true,
                selectedPKS: [],
                pks: [],
                //供应商基本分类参数
                supplierclass: Object.assign({
                    primaryKey: 'pk_supplierclass',
                    parentId: 'parent_id',
                    curOrg: '',
                    title: props.config.nodeType == 'GLOBE_NODE' ? this.lang['10140SCL-000023'] : props.config.nodeType == 'GROUP_NODE' ? this.lang['10140SCL-000024'] : this.lang['10140SCL-000025']
                }, props.config),
                //树参数
                tree: {
                    treeId: 'supplierclassTree',
                    needEdit: true,
                    showLine: false,
                    needSearch: true,
                    showModal: false,
                    root: {
                        "isleaf": false,
                        "key": "~",
                        "title": this.lang['10140SCL-000014']/* 国际化处理： 供应商基本分类*/,
                        "id": "~",
                        "innercode": "~",
                        "pid": "",
                        "nodeData": { enablestate: true },
                        "refname": this.lang['10140SCL-000014']/* 国际化处理： 供应商基本分类*/,
                        "refpk": "~"
                    }
                },
                form: {
                    formId: 'supplierclass',
                },

                urls: {
                    loadTreeDataUrl: '/nccloud/uapbd/supplierclass/loadtreedata.do',
                    queryCardUrl: '/nccloud/uapbd/supplierclass/querycard.do',
                    addUrl: '/nccloud/uapbd/supplierclass/addcard.do',
                    editUrl: '/nccloud/uapbd/supplierclass/editcard.do',
                    deleteUrl: '/nccloud/uapbd/supplierclass/deletecard.do',
                    saveUrl: '/nccloud/uapbd/supplierclass/savecard.do',
                    enablestateUrl: '/nccloud/uapbd/supplierclass/enablestate.do',
                    cancelUrl: '/nccloud/uapbd/supplierclass/cancel.do',
                    validateUrl: '/nccloud/uapbd/supplierclass/validate.do',
                    refresh: '/uapbd/customer/custclass_grp/main/index.html',
                    printUrl: '/nccloud/uapbd/supplierclass/printSupplierClass.do',
                },
                actions: {
                    TreeNodeAdd: 'TreeNodeAdd',
                    TreeNodeEdit: 'TreeNodeEdit',
                    TreeNodeDel: 'TreeNodeDel',
                    Refresh: 'Refresh',
                    Save: 'Save',
                    Cancel: 'Cancel',
                    SaveAdd: 'SaveAdd'
                },//表单所有动作
                isShowOff: false,
                curSelectedNode: null,
                disabledShowOff: false,
                isAdd: false,
                disabledSearch: false,
                oldParent: '',
                status: 'browse'
            }
            this.setState(this.state, () => {
                this.initTemplate.call(this, props, data, () => {
                    this.initData();
                });
            });
        });

    }

    initTemplate = (props, data, callback) => {
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

        };
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
        };
        /*props.createUIDom(
            {pagecode: props.config.pageCode},
            (data) => {*/
        if (data.template) {
            data.template[props.config.formId].items.forEach((temp) => {
                if (temp.attrcode == 'parent_id') {
                    temp.refcode = "uapbd/refer/supplier/SupplierClassTreeRef/index.js";
                    temp.queryCondition = {
                        // nodeType:this.props.config.nodeType,
                        //朋展已经维护了数据权限 可见性 等，只需要告诉是哪种节点，用pk_org表示
                        pk_org: this.props.config.nodeType == 'GLOBE_NODE' ? PK_GLOBE : data.context.pk_org,
                        // TreeRefActionExt : 'nccloud.web.uapbd.ref.custsupplier.SupplierClassReferSqlBuilder'
                    };
                    temp.isShowDisabledData = false;//不显示停启用复选框
                }
            });
            props.meta.setMeta(data.template);
            setFormEnableStateProp(props);
        }
        if (data.button) {
            let excelimportconfig = excelImportconfig(props, 'uapbd', this.props.config.billType, true, '', { 'appcode': this.props.config.appcode, 'pagecode': this.props.config.pageCode }, () => {
                this.onRefreshSupplierClass.call(this, () => {

                });
            });
            props.button.setUploadConfig("Import", excelimportconfig);
            props.button.setButtons(data.button);
            initButtonStatus(props);
        }

        if (props.config.nodeType == 'ORG_NODE' && data.context && data.context.pk_org) {
            this.state.supplierclass.curOrg = { refname: data.context.org_Name, refpk: data.context.pk_org };
            this.setState(this.state, () => {
                this.OrgRefer.onOrgChange(this.state.supplierclass.curOrg);
            });
        }
        callback && callback();
        //}
        //);
    }

    componentDidMount() {
        //this.initData();
    }

    componentDidUpdate() {
        if (this.state.status != 'browse') {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
                //如果节点有编码规则，点击新增，然后就关闭浏览器页签，会导致编码不回滚
                // ajax({
                //     url:'/nccloud/uapbd/supplierclass/rollbackCode.do',
                //     data:{pk_curOrg:this.state.supplierclass.curOrg.refpk,nodeType:this.config.nodeType},
                //     success:(res)=>{
                //         return '';
                //     }
                // })
            };
        } else {

            window.onbeforeunload = null;
        }
    }

    /**
     * 初始数据
     */
    initData() {
        this.setState({
            disabledShowOff: this.state.supplierclass.nodeType == 'ORG_NODE' && !this.state.supplierclass.curOrg
        }, () => {
            this.NCCHRTree.loadTreeData((data) => {
                if (!data[0].children || data[0].children.length === 0) {
                    this.setState({ cardEmpty: true })
                } else {
                    this.setState({ cardEmpty: false })
                }
            });
        })
    }

    /***************树组件事件 开始******************/
    /**
     * 点击树节点回调
     * @param data
     */
    onSelectTreeCallBack(data) {
        //把数据设置到表单上
        if (data[this.state.form.formId] && data[this.state.form.formId].rows[0].values.hasOwnProperty('enablestate')) {

            var enablestateObj = Utils.convertEnableState(data[this.state.form.formId].rows[0].values['enablestate'], 'form');
            if (!!enablestateObj) {
                data[this.state.form.formId].rows[0].values['enablestate'] = enablestateObj;
            }
        }
        //清空表单
        this.NCCHRForm.clearFormData(this.state.form.formId);
        //设置表单为所选树节点数据
        this.NCCHRForm.setFormData({ [this.state.form.formId]: data[this.state.form.formId] });
        //设置表单项enablestate可用
        this.NCCHRForm.setFormItemStatus(this.state.form.formId, { enablestate: false });

        /************************************************************
         * 选中树节点回调成功后设置当前选中节点
         ************************************************************/
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.state.tree.treeId);//获得选中节点
        debugger
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);

    }

    /**
     * 新增
     * @param data
     * @param node
     */
    onClickAddIconEveCallBack(data, node) {
        /*******************************
         * 回调成功后  设置新增标志
         * @type {boolean}
         *******************************/
        this.setState({
            cardEmpty: false,
            isAdd: true,
            disabledShowOff: true,
            curSelectedNode: node,
            oldParent: node.refpk,
            disabledSearch: true,
            status: 'add'
        }, () => {
            //清空表单数据
            this.NCCHRForm.clearFormData(this.state.form.formId);
            //设置表单为编辑态
            this.props.form.setFormStatus(this.state.form.formId, 'add');
            //表单数据
            let headData = data[this.state.form.formId].rows[0].values;
            if (headData.hasOwnProperty('enablestate')) {
                // let enablestateValue = headData.enablestate.value;
                // //根据表单项enablestate的值修改开关状态
                // data[this.state.form.formId].rows[0].values.enablestate.value = false;
                // data[this.state.form.formId].rows[0].values.enablestate.display = false;
                // if (enablestateValue == '2') {
                //     data[this.state.form.formId].rows[0].values.enablestate.value = true;
                //     data[this.state.form.formId].rows[0].values.enablestate.display = true;
                // }
            }
            //设置新增默认值
            this.NCCHRForm.setFormData({ [this.state.form.formId]: this.filterEmptyData(data[this.state.form.formId].rows[0].values, this.state.status) });

            this.setCustClassCodeEditStatus(data.userjson == 'Y');
            //设置表单项不可用
            this.NCCHRForm.setFormItemStatus(this.state.form.formId, { enablestate: true });
            //编辑时设置整棵树不可用
            this.NCCHRTree.setTreeStatus(this.state.tree.treeId, true);
            //新增成功，设置按钮状态
            this.changeButtonStatus(node, this.state.actions.TreeNodeAdd);
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
        this.props.form.setFormItemsDisabled(this.state.form.formId, { 'code': flag });
    }

    /**
     * 编辑
     * @param data
     * @param node
     */
    onClickEditIconEveCallBack(data, node) {
        //清空表单数据
        this.NCCHRForm.clearFormData(this.state.form.formId);
        //设置表单为编辑态
        this.props.form.setFormStatus(this.state.form.formId, 'edit');
        //表单数据
        let headData = data[this.state.form.formId].rows[0].values;
        if (headData.hasOwnProperty('enablestate')) {
            // let enablestateValue = headData.enablestate.value;
            // //根据表单项enablestate的值修改开关状态
            // if (enablestateValue == '2') {
            //     data[this.state.form.formId].rows[0].values.enablestate.value = true;
            //     data[this.state.form.formId].rows[0].values.enablestate.display = true;
            // } else {
            //     data[this.state.form.formId].rows[0].values.enablestate.value = false;
            //     data[this.state.form.formId].rows[0].values.enablestate.display = false;
            // }
        }
        //设置新增默认值
        this.NCCHRForm.setFormData({ [this.state.form.formId]: data[this.state.form.formId] });
        //设置表单项不可用
        this.NCCHRForm.setFormItemStatus(this.state.form.formId, { enablestate: true });
        this.NCCHRTree.setTreeStatus(this.state.tree.treeId, true);//编辑时设置整棵树不可用
        //新增成功，设置按钮状态
        this.changeButtonStatus(node, this.state.actions.TreeNodeEdit);
        /*******************************
         * 回调成功后  设置新增标志
         * @type {boolean}
         *******************************/
        this.setState({
            isAdd: false,
            disabledShowOff: true,
            curSelectedNode: node,
            oldParent: node.pid,
            disabledSearch: true,
            status: 'edit'
        })

    }

    /**
     * 删除
     * @param data
     * @param node
     */
    onClickDelIconEveCallBack(data, node) {
        /**************************************************************
         * 清空表单数据
         **************************************************************/
        this.NCCHRForm.clearFormData(this.state.form.formId);
        /**************************************************************
         * 删除树节点
         **************************************************************/
        this.NCCHRTree.deleteTreeDataSuccess(this.state.tree.treeId, node.refpk)
        /**********************************************************
         * 适配含树页面缺省
         **********************************************************/
        if (this.props.config.nodeType != "ORG_NODE" && (!this.props.syncTree.getSyncTreeValue(this.state.tree.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.state.tree.treeId)[0].children.length === 0)) {
            this.setState({ cardEmpty: true })
        }
        /**************************************************************
         * 删除成功提示
         **************************************************************/
        toast({ title: this.lang['10140SCL-000015'], color: 'success' });
        /* 国际化处理： 删除成功！*/
        /**************************************************************
         * 重新设置按钮状态
         **************************************************************/
        this.changeButtonStatus(node, this.state.actions.TreeNodeDel);
    }

    /***************树组件事件 结束******************/


    /***************业务单元事件 开始******************/
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value) { //选择行政组织钩子
        this.state.supplierclass.curOrg = value;
        this.state.disabledShowOff = !value || value == '' || !value.hasOwnProperty("refpk");
        if (value && value.refpk) {
            this.state.cardEmpty = false
        } else {
            this.state.cardEmpty = true
        }
        this.setState(this.state, () => {
            this.NCCHRTree.loadTreeData();
            this.props.meta.getMeta()[this.props.config.formId].items.find(temp => {
                //上级客户分类参照条件
                if (temp.attrcode == 'parent_id') {
                    temp.refcode = "uapbd/refer/supplier/SupplierClassTreeRef/index.js";
                    temp.queryCondition = () => {
                        return {
                            pk_org: value && value.refpk
                        };
                    }
                    return true;
                }
            })
            // this.NCCHRTree.initTreeStatus(this.state.tree.treeId, this.state.supplierclass.nodeType, value);
        });


    }

    /***************业务单元事件 结束******************/


    /***************停用启用事件 开始******************/
    /**
     * checkbox change 事件
     */
    onCheckBoxChange() {
        if (!this.state.disabledShowOff) {
            this.setState({ isShowOff: !this.state.isShowOff }, () => {
                this.NCCHRTree.loadTreeData((data) => {
                    if (!data[0].children || data[0].children.length === 0) {
                        this.setState({ cardEmpty: true })
                    } else {
                        this.setState({ cardEmpty: false })
                    }
                });
                this.NCCHRForm.clearFormData(this.state.form.formId);//清空表单数据
            })
        }
    }

    /***************停用启用事件 结束******************/


    /******************按钮事件 开始******************/
    /**
     * 按钮点击动作
     * @param props
     * @param id
     */
    onButtonClick(props, id) {
        debugger
        switch (id) {
            case this.state.actions.Refresh:
                this.onRefreshSupplierClass.call(this, () => {
                    toast({ color: 'success', title: this.lang['10140SCL-000026'] });//刷新成功
                });
                break;
            case this.state.actions.Save:
                this.onSaveSupplierClass.call(this);
                break;
            case this.state.actions.SaveAdd:
                this.onSaveAddSupplierClass.call(this);
                break;
            case this.state.actions.Cancel:
                this.onCancelSupplierClassPrompt(this.onCancelSupplierClass);
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
            case 'Export':
                this.setState({

                }, () => {
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }

    /**
     *  通过查询 pub_print_template 表 只查询到appcode为10140SCLO的模板记录，所以这里写成定值了
     * @param flag
     */
    printAndOutput = (flag) => {
        let treeData = this.props.syncTree.getSyncTreeValue(this.state.tree.treeId);
        if (treeData) {
            let pks = this.getTreeAllPks(treeData);
            if (!pks || pks.length === 0) {
                toast({ content: this.lang['10140SCL-000016'], color: "warning" });
                /* 国际化处理： 没有打印的数据！*/
                return;
            }
            if (flag === 'print') {
                print('pdf', this.state.urls.printUrl,
                    {
                        //billtype:'',
                        funcode: this.props.config.appcode,
                        nodekey: 'nccloud',
                        oids: pks,
                        // outputType: flag
                    });
            } else {
                this.setState({
                    pks: pks
                }, this.refs.printOutput.open());
            }
        }
    }//this.state.supplierclass.pageCode.substr(0,this.state.supplierclass.pageCode.indexOf("_"))
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

    /**
     * 保存
     */
    onSaveSupplierClass() {
        if (!this.props.form.isCheckNow(this.state.form.formId)) {
            return;
        }
        /**************************************************************
         * 获得表单数据
         **************************************************************/
        let formData = this.NCCHRForm.getFormData(this.state.form.formId);//获得表单信息
        formData.areacode = this.state.form.formId;//添加表单的areacode编码
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
            pageid: this.state.supplierclass.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.state.supplierclass.nodeType,
            pk_curOrg: this.state.supplierclass.curOrg.refpk || "",
        };
        let data = {
            model: formData,
            pageid: this.state.supplierclass.pageCode
        };
        this.props.validateToSave(data, () => {
            ajax({
                url: this.state.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        //显示公式
                        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.state.form.formId]: 'form'
                                }
                            );
                        }
                        /**************************************************************
                         *  设置树可用
                         **************************************************************/
                        this.NCCHRTree.setTreeStatus(this.state.tree.treeId, false);
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
                        /**************************************************************
                         * 判断是新增还是编辑
                         **************************************************************/
                        if (this.state.isAdd) {
                            //新增回调后添加
                            this.NCCHRTree.addTreeDataSuccess(this.state.tree.treeId, result.data.treeNodeData[0])
                        } else {
                            //修改回调后修改
                            this.NCCHRTree.editTreeNodeSuccess(this.state.tree.treeId, result.data.treeNodeData[0])
                        }
                        /**************************************************************
                         * 移动树节点  并且检查原父节点没有子节点时去除'>'符号
                         **************************************************************/
                        isMove ? this.NCCHRTree.moveTreeData({
                            treeId: this.state.tree.treeId,
                            curNodeKey: result.data.treeNodeData[0].refpk,
                            targetNodeKey: result.data.treeNodeData[0].pid
                        }) : null;
                        /**************************************************************
                         * 展开当前树节点
                         **************************************************************/
                        this.NCCHRTree.openNode(this.state.tree.treeId, result.data.treeNodeData[0].pid);
                        /**************************************************************
                         * 设置新增节点为选中节点
                         **************************************************************/
                        this.NCCHRTree.setTreeNodeSelected(this.state.tree.treeId, result.data.treeNodeData[0].refpk);
                        /**************************************************************
                         * 设置表单为浏览态
                         **************************************************************/
                        this.props.form.setFormStatus(this.state.form.formId, 'browse');
                        /**************************************************************
                         * 清空表单数据
                         **************************************************************/

                        this.NCCHRForm.clearFormData(this.state.form.formId);

                        var enablestateObj = Utils.convertEnableState(result.data.curFormData[this.state.form.formId].rows[0].values['enablestate'], 'form');
                        if (!!enablestateObj) {
                            result.data.curFormData[this.state.form.formId].rows[0].values['enablestate'] = enablestateObj;
                        }

                        /**************************************************************
                         * 重置表单数据为当前选中节点的表单数据
                         **************************************************************/

                        this.NCCHRForm.setFormData({ [this.state.form.formId]: result.data.curFormData[this.state.form.formId] });
                        /**************************************************************
                         * 设置enablestate属性为可用状态
                         **************************************************************/
                        this.NCCHRForm.setFormItemStatus(this.state.form.formId, { enablestate: false });
                        /**************************************************************
                         * 设置按钮状态
                         **************************************************************/
                        this.changeButtonStatus(this.state.curSelectedNode, this.state.actions['Save']);
                        /**************************************************************
                         * 清空选中节点的缓存(清空后停用报错)
                         **************************************************************/
                        this.setState({
                            curSelectedNode: this.NCCHRTree.getSelectedTreeNode(this.state.tree.treeId),//获得选中节点,
                            disabledShowOff: false,
                            disabledSearch: false,
                            status: 'browse'
                        }, () => {
                            toast({ title: this.lang['10140SCL-000017'], color: 'success' });
                            /* 国际化处理： 保存成功！*/
                        });
                    }

                }
            });
        }, { [this.state.form.formId]: 'form' }, 'form');
    }

    /**
     * 检查节点是否含有子节点
     * @param tree
     * @param pk
     * @returns {boolean}
     */
    checkHasChildren(tree, pk) {
        if (!tree) {
            tree = this.NCCHRTree.getTreeData(this.state.tree.treeId);
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

    /**
     * 保存新增
     */
    onSaveAddSupplierClass() {
        if (!this.props.form.isCheckNow(this.state.form.formId)) {
            return;
        }
        let selectedTreeNode = this.state.curSelectedNode;
        let requestParam = {};
        /**************************************************************
         *  获得表单数据
         **************************************************************/
        let formData = this.NCCHRForm.getFormData(this.state.form.formId);//获得表单信息
        formData.areacode = this.state.form.formId;//添加表单的areacode编码
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
            pageid: this.state.supplierclass.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.state.supplierclass.nodeType,
            pk_curOrg: this.state.supplierclass.curOrg.refpk || "",
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if (formData.rows[0].values.hasOwnProperty(this.state.supplierclass.primaryKey)) {
            nonPk = (!!formData.rows[0].values[this.state.supplierclass.primaryKey].value) ? false : true;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        let data = {
            model: formData,
            pageid: this.state.supplierclass.pageCode
        };
        this.props.validateToSave(data, () => {
            /**************************************************************
             *  ajax请求
             **************************************************************/
            ajax({
                url: this.state.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        /**************************************************************
                         *  设置表单为浏览态
                         **************************************************************/
                        this.props.form.setFormStatus(this.state.form.formId, 'browse');

                        /**************************************************************
                         *  去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                         **************************************************************/
                        if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         *  新增回调后添加
                         **************************************************************/
                        this.NCCHRTree.addTreeDataSuccess(this.state.tree.treeId, result.data.treeNodeData[0]);
                        /**************************************************************
                         *  展开当前节点的父节点
                         **************************************************************/
                        this.NCCHRTree.openNode(this.state.tree.treeId, result.data.treeNodeData[0].pid)

                        /**************************************************************
                         *  如果选中节点丢失，重置当前选中节点 保障性操作
                         **************************************************************/
                        if (!selectedTreeNode) {
                            this.NCCHRTree.setTreeNodeSelected(this.state.tree.treeId, result.data.treeNodeData[0].pid);
                            selectedTreeNode = this.NCCHRTree.getSelectedTreeNode(this.state.tree.treeId);//获得选中节点
                            this.setState({ curSelectedNode: selectedTreeNode });
                        }
                        /**************************************************************
                         *  重新设置整棵树不可用
                         **************************************************************/
                        this.NCCHRTree.setTreeStatus(this.state.tree.treeId, true);
                        /**************************************************************
                         * 请求参数对象
                         **************************************************************/
                        let requestParam = {
                            parent_id: this.state.curSelectedNode.refpk,
                            nodeType: this.state.supplierclass.nodeType,
                            pk_curOrg: this.state.supplierclass.curOrg.refpk
                        };
                        /**************************************************************
                         * 记录原父节点pk 移动时使用
                         **************************************************************/
                        this.setState({ oldParent: requestParam.parent_id, isAdd: true });
                        ajax({
                            url: this.state.urls.addUrl,
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {
                                    //显示公式
                                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                        this.props.dealFormulamsg(
                                            result.formulamsg,
                                            {
                                                [this.state.form.formId]: 'form'
                                            }
                                        );
                                    }
                                    /**************************************************************
                                     * 清空表单数据
                                     **************************************************************/
                                    this.NCCHRForm.clearFormData(this.state.form.formId);
                                    /**************************************************************
                                     * 重置表单数据
                                     **************************************************************/
                                    //表单数据
                                    let headData = result.data[this.state.form.formId].rows[0].values;
                                    if (headData.hasOwnProperty('enablestate')) {
                                        let enablestateValue = headData.enablestate.value;
                                        //根据表单项enablestate的值修改开关状态
                                        if (enablestateValue == '2') {
                                            result.data[this.state.form.formId].rows[0].values.enablestate.value = true;
                                            result.data[this.state.form.formId].rows[0].values.enablestate.display = true;
                                        } else {
                                            result.data[this.state.form.formId].rows[0].values.enablestate.value = false;
                                            result.data[this.state.form.formId].rows[0].values.enablestate.display = false;
                                        }
                                    }
                                    /**************************************************************
                                     * 回调成功后  设置新增标志
                                     * @type {boolean}
                                     **************************************************************/
                                    this.state.isAdd = true;
                                    this.state.disabledSearch = true;
                                    this.state.status = 'add';
                                    this.setCustClassCodeEditStatus(result.data.userjson == 'Y');
                                    /**************************************************************
                                     * 设置表单为编辑态
                                     **************************************************************/
                                    this.props.form.setFormStatus(this.state.form.formId, 'add');
                                    /**************************************************************
                                     * 重新设置按钮状态
                                     **************************************************************/
                                    this.changeButtonStatus(selectedTreeNode, this.state.actions['SaveAdd']);
                                    this.setState(this.state, () => {
                                        this.NCCHRForm.setFormData({ [this.state.form.formId]: this.filterEmptyData(result.data[this.state.form.formId].rows[0].values, this.state.status) });
                                    });

                                }
                            },
                            error: (e) => {
                                /**************************************************************
                                 *  重新设置整棵树可用
                                 **************************************************************/
                                this.NCCHRTree.setTreeStatus(this.state.tree.treeId, false);
                                /**************************************************************
                                 * 设置按钮状态
                                 **************************************************************/
                                this.changeButtonStatus(this.state.curSelectedNode, this.state.actions['Save']);
                                /**************************************************************
                                 * 清空选中节点的缓存(清空后停用报错)
                                 **************************************************************/
                                this.setState({
                                    curSelectedNode: this.NCCHRTree.getSelectedTreeNode(this.state.tree.treeId),//获得选中节点,
                                    disabledShowOff: false,
                                    status: 'browse'
                                });
                            }

                        })
                    }
                }
            });
        }, { [this.state.form.formId]: 'form' }, 'form');
    }

    /**
     * 刷新
     */
    onRefreshSupplierClass(callback) {
        //刷新按钮只刷新业务数据区
        this.NCCHRForm.clearFormData(this.state.form.formId);
        this.NCCHRTree.loadTreeData(callback);
    }

    onCancelSupplierClassPrompt = (callback) => {
        promptBox({
            color: 'warning',
            title: this.lang['10140SCL-000018'], /* 国际化处理： 确认取消*/
            content: this.lang['10140SCL-000019'], /* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: function () {
                this.setState({ disabledSearch: false, status: 'browse' }, () => {
                    //回滚单据号
                    ajax({
                        url: this.state.urls.cancelUrl,
                        data: {
                            pk_supplierclass: this.state.curSelectedNode.refpk,
                            isAdd: this.state.isAdd,
                            nodeType: this.props.config.nodeType,
                            pk_curOrg: this.state.supplierclass.curOrg && this.state.supplierclass.curOrg.hasOwnProperty('refpk') ? this.state.supplierclass.curOrg.refpk : null,
                        },
                        success: (res) => {
                            callback && callback();
                        }
                    })
                })
            }.bind(this)
        })
    }
    /**
     * 取消
     */
    onCancelSupplierClass = () => {
        let selectedTreeNode = this.state.curSelectedNode;
        //清空表单数据
        this.NCCHRForm.clearFormData(this.state.form.formId);
        if (selectedTreeNode) {
            if (selectedTreeNode.refpk != this.state.tree.root.refpk) {
                this.NCCHRTree.onSelectTreeCallBack(selectedTreeNode.refpk);
            }
            /**********************************************************
             * 设置树节点选中项
             **********************************************************/
            this.NCCHRTree.setTreeNodeSelected(this.state.tree.treeId, selectedTreeNode.refpk);
            /**********************************************************
             * 设置表单状态
             **********************************************************/
            this.props.form.setFormStatus(this.state.form.formId, 'browse');
            /**********************************************************
             * 设置树可用
             **********************************************************/
            this.NCCHRTree.setTreeStatus(this.state.tree.treeId, false);
            this.state.disabledShowOff = false;
            this.state.disabledSearch = false;
            /**********************************************************
             * 设置enablestate可用
             **********************************************************/
            this.NCCHRForm.setFormItemStatus(this.state.form.formId, { enablestate: selectedTreeNode.refpk == this.state.tree.root.refpk });
            /**********************************************************
             * 设置按钮状态
             **********************************************************/
            this.changeButtonStatus(selectedTreeNode, this.state.actions['Cancel']);
            /**********************************************************
             * 适配含树页面缺省
             **********************************************************/
            if (this.props.config.nodeType != "ORG_NODE" && (!this.props.syncTree.getSyncTreeValue(this.state.tree.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.state.tree.treeId)[0].children.length === 0)) {
                this.state.cardEmpty = true;
            }
            this.setState(this.state);
        }
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode, id) {
        switch (id) {
            case this.state.actions.TreeNodeAdd:
            case this.state.actions.SaveAdd:
                this.props.button.setButtonVisible('Refresh', false);
                this.props.button.setButtonVisible('Import', false);
                this.props.button.setButtonVisible('Export', false);
                this.props.button.setButtonVisible('Save', true);
                this.props.button.setButtonVisible('SaveAdd', true);
                this.props.button.setButtonVisible('Cancel', true);
                this.props.button.setButtonVisible('Print', false);
                this.props.button.setDisabled({
                    Save: false,
                    SaveAdd: false,
                    Cancel: false
                });

                break;
            case this.state.actions.TreeNodeEdit:
                this.props.button.setButtonVisible('Refresh', false);
                this.props.button.setButtonVisible('Import', false);
                this.props.button.setButtonVisible('Export', false);
                this.props.button.setButtonVisible('Save', true);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', true);
                this.props.button.setButtonVisible('Print', false);
                this.props.button.setDisabled({
                    Save: false,
                    Cancel: false
                });
                break;
            case this.state.actions.TreeNodeDel:
                this.props.button.setButtonVisible('Refresh', true);
                this.props.button.setButtonVisible('Save', false);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', false);
                this.props.button.setButtonVisible('Print', true);
                break;
            case this.state.actions.Save:
            case this.state.actions.Cancel:
                this.props.button.setButtonVisible('Refresh', true);
                this.props.button.setButtonVisible('Import', true);
                this.props.button.setButtonVisible('Export', true);
                this.props.button.setButtonVisible('Save', false);
                this.props.button.setButtonVisible('SaveAdd', false);
                this.props.button.setButtonVisible('Cancel', false);
                this.props.button.setButtonVisible('Print', true);
            default:
                break;
        }
    }

    addClickCall = () => {
        this.setState({ cardEmpty: false })
        this.NCCHRTree.onClickAddIconEveCallBack(this.state.tree.root)
    }

    /******************按钮事件 结束******************/
    render() {
        if (!this.lang)
            return '';
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const { syncTree, form, button, ncmodal, DragWidthCom, BillHeadInfo } = this.props;
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        let { createModal } = ncmodal;  //模态框
        const { createBillHeadInfo } = BillHeadInfo; //新加 返回图标和按钮

        const { cardEmpty } = this.state
        /**
         * 组织选择区 参数
         **/
        let orgParam = {
            curOrg: this.state.supplierclass.curOrg,
            onOrgChange: this.onOrgChange.bind(this),
            status: this.state.status,
            fieldid: 'org',
            queryCondition: {
                'AppCode': '10140SCLO',
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        };
        /**
         * 树参数
         **/
        let treeConfig = {
            treeId: this.state.tree.treeId,
            formId: this.state.form.formId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            showModal: this.state.tree.showModal,
            urls: this.state.urls,
            onSelectTreeCallBack: this.onSelectTreeCallBack.bind(this),
            onClickAddIconEveCallBack: this.onClickAddIconEveCallBack.bind(this),
            onClickEditIconEveCallBack: this.onClickEditIconEveCallBack.bind(this),
            onClickDelIconEveCallBack: this.onClickDelIconEveCallBack.bind(this),
            ncmodal: this.props.ncmodal,
            syncTree: this.props.syncTree,
            isShowOff: this.state.isShowOff,
            root: this.state.tree.root,
            curOrg: this.state.supplierclass.curOrg,
            nodeType: this.state.supplierclass.nodeType,
            disabledSearch: this.state.disabledSearch,
            lang: this.lang,
            ...this.props

        };
        /**
         * 表单参数
         */
        let formConfig = {
            formId: this.state.form.formId,
            treeId: this.state.tree.treeId,
            meta: this.props.meta,
            form: this.props.form,
            isAdd: this.state.isAdd,
            ncmodal: this.props.ncmodal,
            curSelectedNode: this.state.curSelectedNode,
            curOrg: this.state.supplierclass.curOrg,
            nodeType: this.state.supplierclass.nodeType,
            enablestateUrl: this.state.urls.enablestateUrl,
            lang: this.lang,
            updateTree: () => {
                this.initData()
            }
        };
        return (
            <div className="nc-bill-tree-card">
                {createModal('modal', { noFooter: false, leftBtnName: this.lang['10140SCL-000020'] })/* 国际化处理： 确定*/}
                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="header">
                        {
                            createBillHeadInfo({
                                title: this.state.supplierclass.title,
                                initShowBackBtn: false,
                                backBtnClick: () => { }
                            })
                        }
                        {/* {createPageIcon()} */}
                        {/* 标题 title*/}
                        {/* <div className="title">{this.state.supplierclass.title}</div> */}
                        {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                        {
                            this.state.supplierclass.nodeType == 'ORG_NODE' &&
                            <div className="search-box" style={{ width: 200 }}>
                                <OrgRefer {...orgParam} ref={(OrgRefer) => {
                                    this.OrgRefer = OrgRefer;
                                }} />
                            </div>
                        }
                        {/*显示停用*/}
                        <span className="showOff">
                            <NCCheckbox
                                defaultChecked={false}
                                checked={this.state.isShowOff}
                                onChange={this.onCheckBoxChange.bind(this)}
                                // onClick={this.onCheckBoxClick.bind(this)}
                                disabled={this.state.disabledShowOff}
                                size="lg"
                            >
                                {this.lang['10140SCL-000022']/* 国际化处理： 显示停用*/}
                            </NCCheckbox>
                        </span>
                        {/* 按钮组 btn-group*/}
                        <div className=" btn-group">
                            {createButtonApp({
                                area: this.state.form.formId,
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.' + this.state.form.formId)
                            })}
                        </div>
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom={<SupplierClassTree {...Object.assign(treeConfig, this.state.supplierclass)}
                            ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree} />}
                        // 右卡片区域
                        rightDom={<div style={{ height: '100%' }}>
                            {this.props.config.nodeType != 'ORG_NODE' ? <EmptyAreaTip
                                type="btn"
                                desc={this.lang['10140SCL-000027']}
                                onClick={this.addClickCall}
                                show={cardEmpty} /> : <EmptyAreaTip desc={this.lang['10140SCL-000028']} show={cardEmpty} />}
                            <div style={{ display: cardEmpty ? 'none' : 'block' }}>
                                <SupplierClassForm {...formConfig} ref={(NCCHRForm) => this.NCCHRForm = NCCHRForm} />
                            </div>
                        </div>}
                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='280px'
                        leftMinWid='300px'
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={this.state.urls.printUrl}
                    data={{
                        funcode: this.props.config.appcode,
                        nodekey: 'nccloud',
                        oids: this.state.pks,
                        outputType: "output"
                    }}
                //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...Object.assign(this.props)}
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