//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, high, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
import Factor from '../../../fiacc/factorgroup/relatefactor';
import FactorChart from '../../../refer/fiacc/FactorChartTreeRef';
const { NCDiv } = base;

const { NCCheckbox, NCMessage: Message, NCModal, NCButton, NCRow, NCCol } = base;
const { Header, Body } = NCModal;
const pageCode = "10140ETSFG_factorgroup";
const urls = {
    loadTree: '/nccloud/uapbd/factorgroup/loadtree.do',
    query: '/nccloud/uapbd/factorstructure/query.do'
};



/****************默认参数  开始***********************/
let treeId = 'factorGroupTree'
let formId = 'factorGroupForm';//卡片组件Id
let listId = 'factorlist'
let primaryKey = 'pk_factorgroup'
let pk_structure = '1001Z310000000016156'//测试用的结构pk


/***************默认参数  结束********************/

/**
 * 客户基本分类
 */
class FactorGroup extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props) {

        super(props)

        this.root = {
            "isleaf": false,
            "key": "~",
            "title": '要素结构',
            "id": "~",
            "innercode": "~",
            "pid": "",
            "refname": '要素结构',
            "refpk": "~",
            "nodeData": { isLeaf: false },//增加一个属性用来标识是否时叶子节点；
        };

        this.state = {
            isShowDisable: false,//显示停用按钮是否可用
            isShowCheck: false,//显示停用是否被选中
            pageStatus: 'browse',
            curSelectedNode: null, //当前节点
            relateFactorData: null,
            oldParent: '',
            curStructure: '',
            isparam: false,//判断一下factorstructure是否是有要素结构传过来的
            enablestate: false, //元素组启用状态，默认false
            factorchart: {
                value: undefined,
                fieldid: 'factorchart',
                onChange: (val) => {
                    this.state.factorchart.value = val;
                    this.state.factorstructure = undefined
                    this.setState(this.state, this.loadTreeData)
                }
            },
            factorstructure: undefined
        }

        let chartid = props.getUrlParam('chartid')
        let chartname = props.getUrlParam('chartname')


        if (chartid && chartname) {
            this.state.factorchart.value = {
                refpk: chartid,
                refname: chartname
            }
            this.setState(this.state)
            let factorstructure = props.getUrlParam('factorstructure')
            this.state.factorstructure = factorstructure ? factorstructure : undefined
            this.state.isparam = true
            this.setState(this.state)

        }

        this.initTemplate(this.props, this.loadTreeData.bind(this))
        this.initButtonStatus()

    }

    initTemplate = (props, callback) => {

        props.createUIDom({
            pagecode: pageCode
        },
            (data, langData, inlt) => {
                if (langData) {
                    this.state.json = langData
                    if (inlt) {
                        this.state.inlt = inlt
                    }
                }
                if (data.template) {
                    let meta = data.template;
                    meta[listId].pagination = true
                    meta = this.modifierMeta(props, meta);
                    props.meta.setMeta(meta);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                }
                this.setState(this.state);
                callback && callback();
            }
        );


    }

    modifierMeta = (props, meta) => {
        // if(!props){
        //     props = this.props;
        // }
        // if(!meta){
        //     meta = this.props.meta.getMeta();
        // }
        // meta[listId].items.map((item)=>{
        //     item.attrcode = item.attrcode.replace('pk_factor.','')
        //     return item
        // })

        return meta;
    }

    loadTreeData() {
        let requestParam = {
            isShowCheck: this.state.isShowCheck,
            pk_factorchart: this.state.factorchart.value ? this.state.factorchart.value.refpk : undefined,
            pk_factorstructure: this.state.factorstructure,
        };

        ajax({

            url: '/nccloud/uapbd/factorgroup/loadtree.do',
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    
                    let data = [Object.assign({ ...this.root }, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(data));
                    //先设置一下根节点图标隐藏，不然会有点小问题
                    let obj = {
                        delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                        editIcon: false,
                        addIcon: false
                    };
                    this.props.syncTree.hideIcon(treeId, '~', obj);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);

                    this.props.syncTree.setNodeDisable(treeId, false);
                    //禁用
                    //this.state.disabledShowOff = false;
                    this.setState(this.state);
                    this.props.button.setDisabled({
                        Import: true,
                        ListDelete: true
                    });
                }
            }
        });

    }

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

    initButtonStatus() {
        this.props.button.setButtonsVisible({
            Save: false,
            SaveAdd: false,
            Cancel: false,
        })


        //设置保存新增按钮不显示

        this.props.button.setDisabled({
            Import: true,
            ListDelete: true
        });
    }

    updateButtonStatus(status) {
        switch (status) {
            case 'browse':
                this.props.button.setButtonsVisible({
                    Save: false,
                    SaveAdd: false,
                    Cancel: false,
                })
                break
            case 'edit':
                this.props.button.setButtonsVisible({
                    Save: true,
                    SaveAdd: true,
                    Cancel: true,
                })
                break
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key) {
        let selectNode = this.props.syncTree.getSyncTreeValue(treeId, key)
        if (key === this.root.refpk) {
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: false
            };
            this.props.syncTree.hideIcon(treeId, key, obj);
        } else if (!selectNode['nodeData'].isfactorgroup) {
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(treeId, key, obj);
        }

    }


    componentDidUpdate() {

    }
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount() {


    }

    onButtonClick(props, id) {
        switch (id) {
            case 'Save':
                this.onSave.call(this);
                break;
            case 'SaveAdd':
                this.onSaveAddClass.call(this);
                break;
            case 'Cancel':
                this.onCancel.call(this);
                break;
            default: break;
        }

    }

    onSave() {
        //在这里做一下表单非空项目校验
        if (!this.props.form.isCheckNow(formId)) {
            return;
        }
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        let requestParam = {
            model: formData,
            pageid: pageCode,
            isparam: this.state.isparam,
            pk_factorstructure: this.state.factorstructure,
            pk_factorchart: this.state.factorchart.value ? this.state.factorchart.value.refpk : undefined,
            isShowCheck: this.state.isShowCheck,
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = true;
        if (formData.rows[0].values.hasOwnProperty(primaryKey)) {
            nonPk = (!!formData.rows[0].values[primaryKey].value) ? false : true;
        }
        this.props.validateToSave({ "model": formData, "pageid": pageCode }, () => {
            ajax({
                url: '/nccloud/uapbd/factorgroup/save.do',
                data: requestParam,
                success: (result) => {
                    if (result.success) {
                        this.props.syncTree.setNodeDisable(treeId, false);
                        let data = [Object.assign({ ...this.root }, { children: result.data['tree'] })];
                        //同步树  加载全部数据
                        this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(data));
                        //展开节点  设置默认展开项
                        this.props.syncTree.openNodeByPk(treeId, this.root.refpk);

                        this.props.syncTree.setNodeDisable(treeId, false);
                        //禁用
                        //this.state.disabledShowOff = false;
                        this.setState(this.state);
                        this.props.syncTree.setNodeSelected(treeId, result.data['newnode']);
                        this.props.form.setFormStatus(formId, 'browse');
                        this.props.form.EmptyAllFormValue(formId);
                        let cdata = result.data['form'].head[formId];
                        this.props.form.setAllFormValue({ [formId]: cdata });
                        this.updateButtonStatus('browse')
                        toast({ title: '保存成功', color: 'success' });/* 国际化处理： 保存成功！*/
                        this.setState({ curSelectedNode: null });
                        this.state.disabledShowOff = false;
                        this.setState(this.state);
                        this.props.button.setDisabled({
                            Import: false,
                            ListDelete: false
                        });
                    }

                }
            });
        }, { 'factorGroupForm': 'form' }, 'form')
    }

    onCancel() {
        promptBox({
            title: '确认取消',/* 国际化处理： 确认取消*/
            content: '是否确认要取消?',/* 国际化处理： 是否确认要取消?*/
            color: 'warning',
            beSureBtnClick: () => {
                let selectedTreeNode = this.state.curSelectedNode;
                this.props.form.EmptyAllFormValue(formId);
                if (selectedTreeNode) {
                    if (selectedTreeNode.refpk == '~' || selectedTreeNode.nodeData.pk_structure == '~') {
                        this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
                        this.props.form.setFormStatus(formId, 'browse');
                        this.props.syncTree.setNodeDisable(treeId, false);
                        this.updateButtonStatus('browse')
                    } else {
                        let pageInfo = this.props.table.getTablePageInfo(listId);
                        let requestParam = {
                            primaryKey: selectedTreeNode.refpk,
                            pageInfo: pageInfo
                        };
                        ajax({
                            url: '/nccloud/uapbd/factorgroup/loadformlist.do',//与修改时一样，所以可以掉用修改时得代码
                            data: requestParam,
                            success: (result) => {
                                if (result.success) {
                                    let hdata = result.data.head[formId];
                                    this.props.form.setAllFormValue({ [formId]: hdata });
                                    let bdata = result.data.bodys[listId];
                                    if (bdata) {
                                        this.props.table.setAllTableData(listId, bdata)
                                    } else {
                                        this.props.table.setAllTableData(listId, { rows: [] })
                                    }
                                    this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
                                    this.props.form.setFormStatus(formId, 'browse');
                                    this.props.syncTree.setNodeDisable(treeId, false);
                                    this.updateButtonStatus('browse')
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

    onSelectFactorGroup(refpk) {
        let selectNode = this.props.syncTree.getSyncTreeValue(treeId, refpk)
        if (!!selectNode.disabled) {
            return;
        }
        let status = this.props.form.getFormStatus(formId);
        if (status == 'edit') {
            return;
        }
        if (refpk == this.root.refpk || !selectNode['nodeData'].isfactorgroup) {
            //清空表单
            this.props.form.EmptyAllFormValue(formId);
            this.props.table.setAllTableData(listId, { rows: [] })
            this.props.button.setDisabled({
                Import: true,
                ListDelete: true
            });
            return;
        }
        let pageInfo = this.props.table.getTablePageInfo(listId);
        let requestParam = {
            isShowOff: this.state.checked,
            pageInfo: pageInfo,
            primaryKey: refpk
        };
        ajax({
            url: '/nccloud/uapbd/factorgroup/loadformlist.do',
            data: requestParam,
            success: function (result) {
                if (result.success) {
                    //清空表单
                    this.props.form.EmptyAllFormValue(formId);
                    let hdata = result.data.head[formId];
                    this.props.form.setAllFormValue({ [formId]: hdata });
                    let bdata = result.data.bodys[listId];
                    if (!!bdata) {
                        this.props.table.setAllTableData(listId, bdata)
                    } else {
                        this.props.table.setAllTableData(listId, { rows: [] })
                    }

                    let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点

                    this.state.curSelectedNode = selectedTreeNode;
                    this.setState(this.state);
                    this.updateButtonStatus('browse');
                    this.props.button.setDisabled({
                        Import: false,
                        ListDelete: false
                    });
                }
            }.bind(this),
        });

    }

    onAddFactorGroup(selectNode) {
        if (!!selectNode.disabled) {
            return;
        }
        //设置当前选中节点
        this.state.curSelectedNode = selectNode;
        //父节点
        let parent_id = this.root.refpk;
        if (selectNode) {
            //存在选中节点，设置父节点pk为选中节点refpk
            parent_id = this.state.curSelectedNode.refpk;
        }
        this.setState({ oldParent: parent_id });

        this.state.factorstructure = selectNode.nodeData['pk_structure'] == '~' ? selectNode.id : selectNode.nodeData['pk_structure']

        this.setState(this.state)

        //清空表单数据
        this.props.form.EmptyAllFormValue(formId);
        if (selectNode.nodeData && selectNode.nodeData.pk_structure != '~') {
            this.props.form.setFormItemsValue(formId, { 'pk_parent': { value: this.state.curSelectedNode.refpk, display: this.state.curSelectedNode.name } })
        }
        this.props.form.setFormItemsValue(formId, { 'pk_factorchart': { value: this.state.factorchart.value.refpk, display: this.state.factorchart.value.refname } })
        this.props.table.setAllTableData(listId, { rows: [] })
        //设置表单为编辑态
        this.props.form.setFormStatus(formId, 'edit');
        this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用
        /*******************************
        * 回调成功后  设置新增标志
        * @type {boolean}
        *******************************/
        this.state.isAdd = true;
        this.state.disabledShowOff = true;
        this.state.pageStatus = 'edit'
        this.setState(this.state);
        this.updateButtonStatus(this.state.pageStatus)

    }

    onEditFactorGroup(selectNode) {
        if (!!selectNode.disabled) {
            return;
        }
        this.state.curSelectedNode = selectNode;
        this.setState(this.state);
        if (!this.state.curSelectedNode) {
            // Message.create({content: this.state.json['10140RACK-000003'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点*/
            // return;
        }
        let pageInfo = this.props.table.getTablePageInfo(listId);
        let requestParam = {
            primaryKey: this.state.curSelectedNode.refpk,
            pageInfo: pageInfo,
            //增加一个参数，用来做数据权限的处理
            mdOperateCode: 'edit',
        };
        /**************************************************
         * 记录父节点pk 移动树节点时使用
         **************************************************/
        this.setState({ oldParent: this.state.curSelectedNode.pid, isAdd: false });
        ajax({
            url: '/nccloud/uapbd/factorgroup/validate.do',
            data: requestParam,
            success: (res) => {
                if (res.success && res.data) {
                    ajax({
                        url: '/nccloud/uapbd/factorgroup/loadformlist.do',
                        data: requestParam,
                        success: (result) => {
                            if (result.success) {
                                this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用
                                //设置一下编码规则字段；
                                let hdata = result.data.head[formId];
                                this.props.form.setAllFormValue({ [formId]: hdata });
                                let bdata = result.data.bodys[listId];
                                if (bdata) {
                                    this.props.table.setAllTableData(listId, bdata)
                                } else {
                                    this.props.table.setAllTableData(listId, { rows: [] })
                                }

                                this.props.form.setFormStatus(formId, 'edit');
                                this.updateButtonStatus('edit')
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

    onDeleteFactorGroup(selectedTreeNode) {
        if (!!selectedTreeNode.disabled) {
            return;
        }
        if (!selectedTreeNode) {
            // Message.create({ content: this.state.json['10140RACK-000005'], color: 'warning' });/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        if (selectedTreeNode.refpk == this.root.refpk) {
            // Message.create({ content: this.state.json['10140RACK-000006'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        let requestParam = {
            primaryKey: selectedTreeNode.refpk,
            ts: selectedTreeNode.nodeData.ts,
            pk_factorchart: this.state.factorchart.value.refpk,
            //增加一个参数，用来做数据权限的处理
            mdOperateCode: 'delete',
        };
        ajax({
            url: '/nccloud/uapbd/factorgroup/validate.do',
            data: requestParam,
            success: (result) => {
                /**************************************************************
                 * 先校验有无删除权限，能删除在做下一步操作
                 **************************************************************/
                if (result.success && result.data) {
                    promptBox({
                        title: '确认删除',/* 国际化处理： 确认删除*/
                        content: '您确定要删除所选数据吗?',/* 国际化处理： 您确定要删除所选数据吗?*/
                        color: 'warning',
                        beSureBtnClick: () => {
                            ajax({
                                url: '/nccloud/uapbd/factorgroup/delete.do',
                                data: requestParam,
                                success: (result) => {
                                    if (result.success) {
                                        this.props.form.EmptyAllFormValue(formId);
                                        this.props.table.setAllTableData(listId, { rows: [] })
                                        this.props.syncTree.delNodeSuceess(treeId, selectedTreeNode.refpk);
                                        toast({ title: '删除成功', color: 'success' });/* 国际化处理： 删除成功！*/
                                        this.updateButtonStatus('browse')
                                        this.props.button.setDisabled({
                                            Import: true,
                                            ListDelete: true
                                        });
                                    }
                                }
                            })
                        }
                    });
                }
            }
        });

    }

    //分页
    pageInfoClick = (props, config, pks) => {

        let data = {
            "allpks": pks,
            "pageid": pageCode,
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: '/nccloud/uapbd/factorgroup/pagequery.do',
            data: data,
            success: function (res) {
                let { success, data } = res;
                that.formu(res.formulamsg);
                if (success) {
                    if (data) {
                        props.table.setAllTableData(listId, data[listId]);
                    } else {
                        props.table.setAllTableData(listId, { rows: [] });
                    }
                }
            }
        });
    }

    formu = (formulamsg) => {
        if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
            this.props.dealFormulamsg(
                formulamsg,  //参数一：返回的公式对象
                {                //参数二：界面使用的表格类型
                    listId: 'SimpleTable'
                }
            );
        }
    }

    tablebuttonClick(props, id) {
        switch (id) {
            case 'Import':
                let tabledata = props.table.getAllTableData(listId)
                let pks = tabledata.rows.map(item => {
                    return item.values['pk_factor'].value
                })
                this.state.relateFactorData = undefined
                this.setState(this.state)
                this.props.modal.show('modal', {
                    userControl: true,
                    title: '关联要素',
                    content: <Factor fieldid={"factor"} config={pks} getRelateFactor={this.getRelateFactor.bind(this)} />,
                    cancelBtnClick: this.cancelBtnClick.bind(this),
                    beSureBtnClick: this.saveRealation.bind(this)
                });
                break;
            case 'ListDelete':
                let checkdata = props.table.getCheckedRows('factorlist')
                if (!checkdata || checkdata.length == 0) {
                    toast({ title: '请选中数据进行删除', color: 'warning' });
                }
                let pk_factorgroup = this.state.curSelectedNode.refpk
                let pageInfo = this.props.table.getTablePageInfo(listId);
                let checkdatapks = checkdata.map(row => {
                    return row.data.values.pk_factor.value
                })
                let requestParam = {
                    pageInfo: pageInfo,
                    pk_factorgroup: pk_factorgroup,
                    checkdatapks: checkdatapks
                }
                ajax({
                    url: '/nccloud/uapbd/factorgroup/relatefactordelete.do',
                    data: requestParam,
                    success: function (res) {
                        let { success, data } = res;
                        if (success) {
                            if (data) {
                                props.table.setAllTableData(listId, data[listId]);
                            } else {
                                props.table.setAllTableData(listId, { rows: [] });
                            }
                        }
                    }
                });
        }

    }

    cancelBtnClick() {
        promptBox({
            title: '确认取消',/* 国际化处理： 确认取消*/
            content: '是否确认要取消?',/* 国际化处理： 是否确认要取消?*/
            color: 'warning',
            beSureBtnClick: () => {
                this.props.modal.close('modal')
            }
        });
    }

    getRelateFactor(relateFactorData) {
        this.state.relateFactorData = relateFactorData
        this.setState(this.state)
    }

    saveRealation() {
        let relatefactor = this.state.relateFactorData
        if (!relatefactor || relatefactor.length == 0) {
            toast({ title: '请选中数据引入', color: 'success' });
        }
        relatefactor = relatefactor.map(value => {
            return {
                'pk_factor': value.data.values.pk_factor.value,
                'pk_factorchart': value.data.values.pk_factorchart.value
            }
        })
        if (!!relatefactor) {
            this.props.modal.close('modal')
            let pk_factorgroup = this.state.curSelectedNode.refpk
            let pageInfo = this.props.table.getTablePageInfo(listId);
            let requestParam = {
                pageInfo: pageInfo,
                relatefactor: relatefactor,
                pk_factorgroup: pk_factorgroup
            }
            let that = this
            ajax({
                url: '/nccloud/uapbd/factorgroup/relatefactorsave.do',
                data: requestParam,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        if (data) {
                            that.props.table.setAllTableData(listId, data[listId]);
                        } else {
                            that.props.table.setAllTableData(listId, { rows: [] });
                        }
                    }
                }
            });

        }

    }

    onCheckBoxChange() {
        this.state.isShowCheck = !this.state.isShowCheck
        this.setState(this.state);
        this.loadTreeData();
        this.props.form.EmptyAllFormValue(formId);
        this.props.table.setAllTableData(listId, { rows: [] })
    }



    render() {

        const { syncTree, form, button, ncmodal, DragWidthCom, BillHeadInfo, table, modal } = this.props;

        const { createSyncTree } = syncTree;

        const { createSimpleTable } = table

        const { createModal } = modal;

        const { createForm } = form;//创建表单，需要引入这个

        const { createButtonApp } = button;
        const { createBillHeadInfo } = BillHeadInfo;

        return (
            <div className="nc-bill-tree-card">

                {createModal('modal', { noFooter: false })}
                {/* 头部 header*/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="header">

                    {/* 标题 title*/}

                    <div className='header-title-search-area'>
                        {createBillHeadInfo({
                            title: '核算要素组',
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="search-box" style={{ width: 200, marginRight: 0 }}>{FactorChart(this.state.factorchart)}</div>

                    <span className="showOff">
                        <NCCheckbox
                            disabled={this.state.isShowDisable}
                            defaultChecked={false}
                            checked={this.state.isShowCheck}
                            onChange={this.onCheckBoxChange.bind(this)}
                        // onClick={this.onCheckBoxClick.bind(this)}
                        // size="lg"
                        >
                            {'显示停用'/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
                    </span>


                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: "card_head",
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),

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
                                    showLine: true, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    searchType: "filtration",
                                    // disabledSearch: this.state.disabledSearch,
                                    onSelectEve: this.onSelectFactorGroup.bind(this),//选择
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),
                                    clickAddIconEve: this.onAddFactorGroup.bind(this), //新增点击 回调
                                    clickEditIconEve: this.onEditFactorGroup.bind(this), //编辑点击 回调
                                    clickDelIconEve: this.onDeleteFactorGroup.bind(this), // 删除点击 回调
                                    showModal: false,
                                    defaultExpandAll: true   //初始化展开所有节点

                                })}
                            </div>}
                        // 右卡片区域
                        rightDom={

                            <div className="card-area">
                                <div className='nc-bill-card'>
                                    <div className="nc-bill-form-area">
                                        {createForm(formId, {
                                            // onAfterEvent: this.onAfterFormEvent.bind(this),
                                            // onBeforeEvent: this.onBeforeEvent.bind(this),
                                            cancelPSwitch: true
                                        })}
                                    </div>
                                    <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                                        <span className="bill-info-title" style={{
                                            fontSize: '16px',
                                            marginLeft: '8px',
                                            lineHeight: '32px',
                                            verticalAlign: 'baseline'
                                        }}>关联要素</span>
                                        <div className="header-button-area">
                                            {createButtonApp({
                                                area: 'list-header-button',
                                                buttonLimit: 3,
                                                onButtonClick: this.tablebuttonClick.bind(this),
                                                popContainer: document.querySelector('.list-header-button')
                                            })}
                                        </div>
                                    </NCDiv>
                                    <div className="nc-bill-table-area">

                                        {createSimpleTable('factorlist', {
                                            handlePageInfoChange: this.pageInfoClick.bind(this),
                                            showIndex: true,
                                            showCheck: true
                                        })}
                                    </div>
                                </div>
                            </div>}

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='280px'
                    />
                </div>

            </div>

        )
    }
}

FactorGroup = createPage({
    billinfo: {
        billtype: 'form',
        pagecode: pageCode,
        headcode: 'factorGroupForm'
    }
})(FactorGroup)

ReactDOM.render(<FactorGroup />, document.querySelector('#app'));












//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65