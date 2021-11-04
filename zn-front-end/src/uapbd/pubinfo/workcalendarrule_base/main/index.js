//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPageIcon, createPage, ajax, base, toast, print, cacheTools, high, promptBox, getBusinessInfo, cardCache } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef'
let { setDefData, getDefData } = cardCache;
let { NCCol: Col, NCRow: Row, NCDiv, EmptyAreaTip } = base;
const { NCDatePicker, NCButton, NCPanel, NCCheckbox, NCPopconfirm, NCRadio } = base;
import Utils from '../../../public/utils';
/**
 * 工作日历规则
 * @author wangying16
 */

let leftTree = 'systemTree';//左树id
let headFormId = 'headform';//右表-工作日历规则
let bodyFormId = 'bodyform';//右表-公休日设置
let modalFormId = 'createmodel';//生成工作日历模态框
let modalId = 'wcModal';//模态框id
let pageCode = '10140WCRB_main';            //pagecode
let glbOrg = 'GLOBLE00000000000000';

//请求路径
let ajaxUrl = {
    initUrl: '/nccloud/platform/templet/querypage.do',
    loadTreeDataUrl: "/nccloud/uapbd/wcr/queryWorkCalendarRuleTree.do",
    loadFormDataUrl: "/nccloud/uapbd/wcr/queryWorkCalendarRuleForm.do",
    saveWCRUrl: "/nccloud/uapbd/wcr/saveWorkCalendarRule.do",
    generateWCUrl: "/nccloud/uapbd/wcr/generateWorkCalendar.do",
    deleteWCRUrl: "/nccloud/uapbd/wcr/deleteWorkCalendarRule.do"
}

class WCRPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardEmpty: true,
            json: {},
            status: 'browse',//页面状态
            curOrg: {
                pk_org: '',
                name: ''
            }
        }
        //自定义根节点
        this.root = {
            key: "root",
            title: "",
            id: "root",
            innercode: "root",
            pid: "",
            refname: "",
            refpk: "root",
            nodeData: {
                dataType: 'root'
            }
        };

        this.initTemplate(props);
    }

    //初始化单据模板
    initTemplate = (props, callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode: props.config.pageCode///页面id
                // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140WCR', domainName: 'uapbd'
            },
            (data, langData) => { //(data, langData)
                if (langData) {
                    that.setState({
                        json: langData
                    })
                }
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        //toggleShow(props);
                    }
                    //处理个性化中心设置默认业务单元
                    let mainOrg = this.state.curOrg;
                    if (this.props.config.nodeType == 'glb') {
                        mainOrg = {
                            pk_org: glbOrg,
                            name: ''
                        }
                    } else {
                        if (data.context && data.context.pk_org) {
                            mainOrg = {
                                pk_org: data.context.pk_org,
                                name: data.context.org_Name
                            }
                        }
                    }
                    this.setState({
                        curOrg: mainOrg
                    }, () => {
                        this.loadLeftTreeData();
                    })

                    callback && callback();
                }
            }
        )
    }

    componentDidUpdate() {
        if (this.state.status === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    componentDidMount() {
    }

    //加载左树数据
    loadLeftTreeData(callback) {
        let that = this;
        that.root.title = that.state.json['10140WCR-000000']/* 国际化处理： 工作日历规则*/
        that.root.refname = that.state.json['10140WCR-000000']/* 国际化处理： 工作日历规则*/
        //业务单元节点
        if (that.props.config.nodeType == 'org' && !this.state.curOrg.pk_org) {
            that.props.syncTree.setSyncTreeData(leftTree, [that.root]);
            //设置默认选中根节点
            that.props.syncTree.setNodeSelected(leftTree, 'root');
            that.onRootSelected();
            //设置按钮状态
            that.toggleShow();
            callback && callback.call(that)
            return;
        }

        ajax({
            url: ajaxUrl.loadTreeDataUrl,
            method: "post",
            data: { pk_org: this.state.curOrg.pk_org, nodeType: this.props.config.nodeType },
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        //转换树的父子关系
                        let data = [Object.assign({ children: res.data }, that.root)];
                        let treeData = that.dealTreeData(data);
                        that.props.syncTree.setSyncTreeData(leftTree, treeData);
                        //控制树节点按钮显隐性
                        // that.modifierTreeBtn(data);
                        //设置默认选择根节点下第一个节点
                        that.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                        that.onSelect(res.data[0].refpk);
                    } else {
                        that.props.syncTree.setSyncTreeData(leftTree, [that.root]);
                        //设置默认选中根节点
                        that.props.syncTree.setNodeSelected(leftTree, 'root');
                        that.onRootSelected();
                    }
                }

                //设置按钮状态
                that.toggleShow();
                callback && callback.call(that)
            }
        });
    }

    /**
    * 处理树数据
    * @param data
    * @returns {*}
    */
    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
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
            deleteDataChildrenProp(e);
        });
        if (data[0].children && data[0].children.length > 0) {
            data[0].children.forEach((item) => {
                //工作日历规则节点所有数据挂在根节点下。
                item.pid = 'root'
            })
        }
        return data;
    }

    //控制树节点按钮显隐性
    modifierTreeBtn(data) {
        let glbData = [];
        //业务单元节点下全局级数据不应示修改和删除按钮
        if (this.props.config.nodeType == 'org' && data[0].children && data[0].children.length > 0) {
            data[0].children.forEach((item) => {
                if (item.nodeData.dataType == 'glb') {
                    let node = {
                        key: item.id,
                        value: { editIcon: false, delIcon: false }
                    }
                    glbData.push(node);
                }
            })
            this.props.syncTree.setIconVisible(leftTree, glbData)
        }
        //设置根节点只有新增按钮可选
        this.props.syncTree.setIconVisible(leftTree, [{ key: 'root', value: { editIcon: false, delIcon: false } }])
    }

    //鼠标进入树节点事件
    onMouseEnterEve(key) {
        //设置
        if (key === "root") {
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(leftTree, key, obj);
            return;
        }

        let node = this.props.syncTree.getSyncTreeValue(leftTree, key);
        let pk_org = node.nodeData.dataType;
        if (pk_org === 'glb' && this.props.config.nodeType === 'org') {//组织节点不能修改全局的数据
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(leftTree, key, obj);
        } else {
            let obj = {
                delIcon: true, //false:隐藏； true:显示; 默认都为true显示
                editIcon: true,
                addIcon: true
            };
            this.props.syncTree.hideIcon(leftTree, key, obj);
        }
    }

    //设置按钮状态
    toggleShow() {
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if (this.state.status == 'browse') {
            this.props.button.setButtonsVisible({
                CreateCalendar: true,
                Refresh: true,
                Save: false,
                SaveAdd: false,
                Cancel: false,
            });
        } else {
            this.props.button.setButtonsVisible({
                CreateCalendar: false,
                Refresh: false,
                Save: true,
                SaveAdd: true,
                Cancel: true,
            });
        }
        if (selectNode.refpk === 'root') {
            //根节点只有刷新和新增按钮可用
            this.props.button.setButtonDisabled(['CreateCalendar'], true);
        } else {
            this.props.button.setButtonDisabled(['CreateCalendar'], false);
        }
    }

    //点击编辑按钮
    onEdit(selectedTreeNode) {
        let that = this;
        /****未选中提示***/
        if (!selectedTreeNode) {
            Message.create({ content: this.state.json['10140WCR-000001'], color: 'warning' });//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }

        ajax({
            url: ajaxUrl.loadFormDataUrl,
            data: { pk_wcr: selectedTreeNode.refpk, pk_org: this.state.curOrg.pk_org, status: 1, nodeType: this.props.config.nodeType, pageCode: this.props.config.pageCode },//status 为2时为新增，1为修改，0为未变化
            success: (result) => {
                if (result.success) {
                    if (result.data && result.data.userjson && result.data.headform) {
                        let permissionInfo = JSON.parse(result.data.userjson)
                        if (permissionInfo.maintainPerm === 'Y') {
                            that.props.form.setAllFormValue({ [headFormId]: result.data.headform })
                            //设置编辑时树，表及按钮状态
                            that.setAllState('edit');
                            this.props.button.setButtonsVisible({ SaveAdd: false });
                        }
                        else {
                            toast({ color: 'warning', content: this.state.json['10140WCR-000002'] })/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                        }
                    }
                }
            }
        })
    }

    //点击删除按钮
    onDelete(selectedTreeNode) {
        var doDelete = () => {
            let message = this.state.json['10140WCR-000003']/* 国际化处理： 确认要删除所选数据吗？*/
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10140WCR-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                content: message,             // 提示内容,非必输
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: this.state.json['10140WCR-000005'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                cancelBtnName: this.state.json['10140WCR-000006'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                beSureBtnClick: () => {
                    ajax({
                        url: ajaxUrl.deleteWCRUrl,
                        data: { pk_wcr: selectedTreeNode.refpk },
                        success: (result) => {
                            if (result.success) {

                                this.props.form.EmptyAllFormValue(headFormId);
                                //调用异步树的接口，删除该树节点
                                this.props.asyncTree.delTreeData(leftTree, selectedTreeNode.refpk);
                                toast({ content: this.state.json['10140WCR-000007'], color: 'success' });/* 国际化处理： 删除成功！*/

                            }
                        }
                    })
                }   // 确定按钮点击调用函数,非必输
            })
        }

        //先校验指定组织类型的数据在该节点下是否能维护
        ajax({
            url: ajaxUrl.loadFormDataUrl,
            method: "post",
            data: { pk_wcr: selectedTreeNode.refpk, pk_org: this.state.curOrg.pk_org, status: 0, nodeType: this.props.config.nodeType },//status 为2时为新增，1为修改，0为未变化
            success: function (res) {
                if (res.success) {
                    if (res.data && res.data.userjson) {
                        let permissionInfo = JSON.parse(res.data.userjson)
                        if (permissionInfo.maintainPerm === 'Y') {
                            doDelete();
                        } else {
                            toast({ color: 'warning', content: this.state.json['10100JTB-000002'] })/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                        }
                    }
                }
            }
        });
    }

    //新增工作日历规则
    onAdd(selectedTreeNode) {
        //保存新增情况无节点选择
        if (selectedTreeNode)
            this.props.syncTree.setNodeSelected(leftTree, selectedTreeNode.refpk);
        if (this.props.config.nodeType == 'org' && !this.state.curOrg.pk_org) {
            toast({ content: this.state.json['10140WCR-000009'], color: 'warning' });/* 国际化处理： 请选择业务单元*/
            return;
        }
        let that = this;
        ajax({
            url: ajaxUrl.loadFormDataUrl,
            data: { pk_wcr: selectedTreeNode ? selectedTreeNode.refpk : '', pk_org: this.state.curOrg.pk_org, status: 2, pageCode: this.props.config.pageCode },//status 为2时为新增，1为修改，0为未变化
            success: (result) => {
                if (result.success) {
                    if (result.data && result.data.headform) {
                        //设置编辑时树，表及按钮状态
                        that.setAllState('edit');
                        that.props.form.EmptyAllFormValue(headFormId);
                        that.props.form.setFormStatus(headFormId, 'add')
                        Utils.filterEmptyData(result.data.headform.rows[0].values);
                        that.props.form.setAllFormValue({ [headFormId]: result.data.headform })

                    }

                }
            }
        })
    }

    //点击取消
    onCancel() {
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140WCR-000010'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
            content: this.state.json['10140WCR-000011'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.state.json['10140WCR-000005'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
            cancelBtnName: this.state.json['10140WCR-000006'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
            beSureBtnClick: () => {
                var selectNode = this.props.syncTree.getSelectNode(leftTree);
                // //取消时刷新页面
                // this.loadLeftTreeData();
                // //设置选中节点,并刷新右表数据
                // this.props.syncTree.setNodeSelected(leftTree, selectNode.refpk);
                this.onSelect(selectNode.refpk, {}, true);
                this.setAllState('browse');
            }   // 确定按钮点击调用函数,非必输
        })
    }

    //保存工作日历规则
    onSave() {
        let formData = this.props.form.getAllFormValue(headFormId);
        formData.areacode = headFormId;
        let requestParam = {
            model: formData,
            pageid: this.props.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };
        //判断是新增树节点还是更新树节点
        var pk = null;
        if (formData.rows[0].values.hasOwnProperty('pk_workcalendrule')) {

            pk = formData.rows[0].values['pk_workcalendrule'].value;//当前表单有pk:update 更新节点；没有pk:save 新增树节点

        }
        let nonPk = false;//更新树节点
        if (pk == null || pk == '') {
            nonPk = true;// 新增树节点
        }

        this.props.form.isCheckNow(headFormId) && this.props.validateToSave(requestParam, () => {
            ajax({
                url: ajaxUrl.saveWCRUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        //设置浏览时树，表及按钮状态
                        this.setAllState('browse');
                        result.data[0].pid = 'root';//插入到根节点下
                        if (!result.data[0].children || result.data[0].children.length == 0) {
                            delete result.data[0].children;
                        }
                        if (nonPk) {
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(leftTree, result.data);

                        } else {
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(leftTree, result.data[0]);
                        }
                        this.props.syncTree.setNodeSelected(leftTree, result.data[0].refpk);
                        this.onSelect(result.data[0].refpk, {}, true);
                        toast({ title: this.state.json['10140WCR-000012'], color: 'success' });
                        /* 国际化处理： 保存成功！*/
                    }
                }
            })
        }, { [headform]: 'form' }, 'form')
    }

    //保存新增工作日历规则
    onSaveAdd() {
        let formData = this.props.form.getAllFormValue(headFormId);
        let requestParam = {
            model: formData,
            pageid: pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };
        let validateData = {
            pageid: this.props.config.pageCode,
            headform: formData
        }

        this.props.form.isCheckNow(headFormId) && this.props.validateToSave(validateData, () => {
            ajax({
                url: ajaxUrl.saveWCRUrl,
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        result.data[0].pid = 'root';//插入到根节点下
                        if (!result.data[0].children || result.data[0].children.length == 0) {
                            delete result.data[0].children;
                        }
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(leftTree, result.data);
                        this.props.syncTree.setNodeSelected(leftTree, result.data[0].refpk);
                        toast({ title: this.state.json['10140WCR-000012'], color: 'success' });
                        /* 国际化处理： 保存成功！*/
                        //保存后清空表单
                        this.props.form.EmptyAllFormValue(headFormId);
                        let that = this;
                        ajax({
                            url: ajaxUrl.loadFormDataUrl,
                            data: { pk_wcr: '', pk_org: this.state.curOrg.pk_org, status: 2 },//status 为2时为新增，1为修改，0为未变化
                            success: (result) => {
                                if (result.success) {
                                    if (result.data && result.data.headform) {
                                        that.props.form.setFormStatus(headFormId, 'add')
                                        that.props.form.setAllFormValue({ [headFormId]: result.data.headform })
                                        //设置编辑时树，表及按钮状态
                                        that.setAllState('edit');
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }, { [headform]: 'form' }, 'form')
    }

    //树节点选中事件
    onSelect(pk, item, isChange) {
        //选中根节点
        if (pk === 'root') {
            this.onRootSelected();
            this.toggleShow();
        } else {
            //加载工作日历规则右表数据
            let that = this;
            ajax({
                url: ajaxUrl.loadFormDataUrl,
                method: "post",
                data: { pk_wcr: pk, pk_org: this.state.curOrg.pk_org, status: 0, nodeType: this.props.config.nodeType, pageCode: this.props.config.pageCode },//status 为2时为新增，1为修改，0为未变化
                success: function (res) {
                    if (res.success) {
                        if (res.data && res.data.headform) {
                            that.props.form.setAllFormValue({ [headFormId]: res.data.headform })
                            that.toggleShow();
                        }
                    }
                }
            });
        }
    }

    //点击刷新按钮
    onRefresh() {
        this.loadLeftTreeData(() => {
            toast({
                title: this.state.json['10140WCR-000013'], /* 国际化处理： 刷新成功！*/
                color: 'success'
            })
        })
    }

    //选中根节点
    onRootSelected() {
        //清空表单
        this.props.form.EmptyAllFormValue(headFormId);
        //设置上班时间，下班时间默认值
        this.props.form.setFormItemsValue(headFormId, { 'ondutytime': { value: '00:00', display: '' }, 'offdutytime': { value: '00:00', display: '' } });
    }

    //生成工作日历
    onGenerate() {
        //获取模态框数据
        let formData = this.props.form.getAllFormValue(modalFormId);
        formData.areacode = modalFormId;
        let requestParam = {
            model: formData,
            pageid: this.props.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };

        this.props.form.isCheckNow(modalFormId) && this.props.validateToSave(requestParam, () => {
            ajax({
                url: ajaxUrl.generateWCUrl,
                method: "post",
                data: requestParam,
                success: (res) => {
                    if (res.success) {
                        if (res.data && res.data.result === 'Y') {
                            this.props.modal.close(modalId);
                            toast({ content: this.state.json['10140WCR-000012'], color: 'success' });/* 国际化处理： 保存成功！*/
                        }
                    }
                }
            })
        }, { [modalFormId]: 'form' }, 'form')
    }

    initModal() {
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        //先校验指定组织类型的数据在该节点下是否能维护
        ajax({
            url: ajaxUrl.loadFormDataUrl,
            method: "post",
            data: { pk_wcr: selectNode.refpk, pk_org: this.state.curOrg.pk_org, status: 3, nodeType: this.props.config.nodeType, checkBDManage: 'Y', pageCode: this.props.config.pageCode },//status 为2时为新增，1为修改，0为未变化,3为打开生成工作日历模态框，checkBDManage根据管控模式控制字段可编辑性
            success: (res) => {
                if (res.success) {
                    if (res.data && res.data.userjson) {
                        let permissionInfo = JSON.parse(res.data.userjson)
                        if (permissionInfo.managePerm === 'N') {
                            this.props.form.setFormItemsDisabled(modalFormId, { 'pk_org': true })
                        } else {
                            this.props.form.setFormItemsDisabled(modalFormId, { 'pk_org': false })
                        }
                        if (permissionInfo.maintainPerm === 'Y') {
                            //设置模态框默认值
                            this.props.form.EmptyAllFormValue(modalFormId)
                            this.props.form.setFormStatus(modalFormId, "add");
                            Utils.filterEmptyData(res.data.createmodel.rows[0].values);
                            this.props.form.setAllFormValue({ [modalFormId]: res.data.createmodel })

                            this.props.modal.show(modalId, {});
                        } else {
                            if (this.props.config.nodeType == 'org') {
                                toast({ color: 'warning', content: this.state.json['10140WCR-000002'] })/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                            } else {
                                toast({ color: 'warning', content: this.state.json['10140WCR-000018'] })/* 国际化处理： 全局节点只能维护全局的数据！*/
                            }
                        }
                    }
                }
            }
        });
    }

    //表头按钮点击事件
    buttonClick(props, id) {
        switch (id) {
            case 'Save':
                this.onSave();
                break;
            case 'SaveAdd':
                this.onSaveAdd();
                break;

            case 'CreateCalendar':
                this.initModal();
                break;
            case 'Cancel':
                this.onCancel();
                break;
            case 'Refresh':
                this.onRefresh();
                break;
        }
    }

    //设置编辑时树，表及按钮状态
    setAllState(status) {
        let flag = status === 'edit' ? true : false;
        this.props.syncTree.setNodeDisable(leftTree, flag);//编辑时设置整棵树不可用
        //设置表单状态以及页面状态
        this.props.form.setFormStatus(headFormId, status);
        this.setState({ status: status }, () => {
            //设置按钮状态
            this.toggleShow();
        });
    }

    //业务单元参照变更事件
    onOrgChange(e) {
        if (e && e.refpk) {
            this.setState({ cardEmpty: false })
        } else {
            this.setState({ cardEmpty: true })
        }
        this.setState({
            curOrg: {
                pk_org: e.refpk,
                name: e.refname
            }
        }, () => {
            this.loadLeftTreeData();
        })
    }

    render() {
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const { button, syncTree, modal, DragWidthCom, form, config, BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createSyncTree } = syncTree;
        let { createModal } = modal;
        let nodeType = this.props.config.nodeType;
        const { cardEmpty } = this.state;
        let titleName = this.props.config.nodeType == 'glb' ? this.state.json['10140WCR-000015'] : this.state.json['10140WCR-000016']
        let orgPermCondition = function () {
            return {
                AppCode: config.appcode,
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }

        return (
            <div className='nc-bill-tree-card'>
                <NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                    {createModal(modalId, {
                        title: this.state.json['10140WCR-000014'],/* 国际化处理： 生成工作日历*/
                        content: createForm(modalFormId, {}),
                        userControl: true,//自己控制什么时候关闭窗口 
                        beSureBtnClick: this.onGenerate.bind(this),
                        cancelBtnClick: () => {
                            promptBox({
                                color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10140WCR-000017'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                hasCloseBtn: false,
                                content: this.state.json['10140WCR-000011'],/* 国际化处理： 您确定要取消吗？*/
                                beSureBtnClick: () => {
                                    this.props.modal.close(modalId);

                                }   // 确定按钮点击调用函数,非必输
                            })
                        },
                    })}
                    {/* 标题 title */}
                    <div classNmae="title">
                        {createBillHeadInfo(
                            {
                                title: this.props.config.nodeType == 'glb' ? this.state.json['10140WCR-000015'] : this.state.json['10140WCR-000016'],
                                backBtnClick: () => { },
                                initShowBackBtn: false
                            }
                        )}
                    </div>

                    {/*业务单元参照*/}
                    <div className="search-box">
                        {nodeType == 'org' && BusinessUnitTreeRef({
                            fieldid: `businessunittree`,
                            isTreelazyLoad: false,
                            queryCondition: orgPermCondition,
                            onChange: this.onOrgChange.bind(this),
                            value: { refpk: this.state.curOrg.pk_org, refname: this.state.curOrg.name },
                            disabled: this.state.status == 'browse' ? false : true,//是否禁用
                        })}
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            onButtonClick: this.buttonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="tree-card">
                    <DragWidthCom
                        //工作日历规则左树
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: leftTree,
                                    showLine: true,
                                    clickEditIconEve: this.onEdit.bind(this), //编辑点击 回调
                                    clickDelIconEve: this.onDelete.bind(this), // 删除点击 回调
                                    clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                    onSelectEve: this.onSelect.bind(this),   //选择节点回调方法
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),//鼠标进入树节点事件
                                    defaultExpandAll: true,   //初始化展开所有节点  ，默认参数为false,不展开
                                    showModal: false
                                })}
                            </div>
                        }
                        //工作日历规则右表
                        rightDom={
                            <div style={{ height: '100%' }}>
                                <EmptyAreaTip
                                    desc={this.state.json['10140WCR-000019']}
                                    show={nodeType === "org" && cardEmpty} />
                                <div className="card-area" style={{ display: nodeType === "org" && cardEmpty ? 'none' : 'block' }}>
                                    {createForm(headFormId, {
                                        expandArr: [bodyFormId]
                                    })}
                                </div>
                            </div>
                        }
                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百 
                    />
                </div>
            </div>
        )
    }
}

//初始数据处理
function modifierMeta(props, meta) {
}

// let WCRPage = createPage({
//     //initTemplate: initTemplate,
//     mutiLangCode: '10140WCR'
// })(WCRPanel);
export default WCRPanel
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65