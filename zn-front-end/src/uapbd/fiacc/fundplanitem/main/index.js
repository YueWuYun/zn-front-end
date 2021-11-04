//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPageIcon, createPage, base, ajax, toast, print, high, getBusinessInfo, promptBox, excelImportconfig } from 'nc-lightapp-front';
let businessInfo = getBusinessInfo();
const { PrintOutput, ExcelImport } = high;
import Utils from '../../../public/utils/index.js';
import './index.less';
// 引入公共样式
import '../../../public/uapbdstyle/uapbd_style_common.less'

let {  NCTabs,  NCCheckbox, NCCol, NCRow, NCModal, NCCollapse, NCIcon, NCFormControl, NCPopconfirm,NCDiv,NCTree } = base;


//import Org from '../../../refer/org/BusinessUnitTreeRef/index'
import Org from '../../../refer/org/FinanceOrgTreeRef/index.js';
import AssignStepModal from '../assign/AssignStepModal.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";
var EMPTY_FN = function () { };
var createUIDomParam = function (pagecode, appcode) {
    var param = {
        pagecode: pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? { ...param, appcode: appcode } : param;
};

// 数组拓展删除 数组中 指定的项
Array.prototype.arrRemoveAppoint = function (item) {
    if (!this.includes(item)) {
        return;
    }
    let thatIndex = this.indexOf(item);
    return this.splice(thatIndex, 1);
}

class Fundplanitem extends Component {

    componentDidUpdate() {
        if (!this.state.editMode) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    renderNode(cfg) {
        var operation = function (operation, item, pitem, editMode) {
            return function (event) {
                if (editMode) {
                    return ''
                } else {
                    event.stopPropagation();
                    return cfg[operation](item, pitem);
                }
            };
        };
        var renderTreeTitle = (item, pitem) => {
            var isInScope = () => {
                return item.nodeData.votype == this.config.nodetype;
            };
            let isExpand = this.state.tree.expandedKeys.includes(item.key);
            let editMode = this.state.editMode;
            var isLeaf = !item.children.length, title = item.title;
            let className = isLeaf ? "tree-dian" : isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian" : "icon iconfont  icon-wenjianjia tree-wenjian";
            var textValue = this.state.treesearch.value;
            var drawTitleString = (title) => {
                if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                    var start = title.indexOf(textValue), end = start + textValue.length;
                    return <span><span>{title.substring(0, start)}</span><span className="uapbd-inoutbusiclass-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                } else {
                    return (<span><span className='refer-tree-title'>{title}</span></span>);
                }
            };
            let wenjianicon = <i className={className} />;
            let titleInfo = <span className={isInScope() ? '' : 'uapbd-inoutbusiclass-bdselected-highlight'}>{drawTitleString(item.nodeData.code)}&nbsp;&nbsp;{drawTitleString(item.title)}</span>
            let titleAdd = cfg.buttons.indexOf('add') == -1 ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-zengjia add-icon" onClick={operation('onAdd', item, pitem, editMode)}></i>;
            let titleEdit = cfg.buttons.indexOf('edit') == -1 || !pitem || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-bianji edit-icon" onClick={operation('onEdit', item, pitem, editMode)}></i>;
            let titleRemove = cfg.buttons.indexOf('delete') == -1 || !pitem || item.children.length != 0 || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-shanchu delete-icon" onClick={operation('onRemove', item, pitem, editMode)}></i>;
            return (<div className="title-con">{wenjianicon}{titleInfo}{titleEdit}{titleAdd}{titleRemove}</div>);
        };
        const loop = (datas, pdata) => {
            return datas.filter(item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                var isLeaf = !item.children.length;
                let switcherName = children.length == 0 ? 'isLeaf_hiden_point_line' : 'isLeaf_show_point_line';
                // isLeaf ? 'isleaf-style-none-tree-self-define' : 'unleaf-style-none-tree-self-define'
                return (<NCTree.NCTreeNode
                    liAttr={{ fieldid: (item.code || item.name) + "_node" }}
                    switcherClass={switcherName}
                    className={cfg && cfg.editMode && this.state.tree.selectedKeys && this.state.tree.selectedKeys[0] == item.id ? 'node-item-edit-point-style-self' : ''}
                    title={renderTreeTitle(item, pdata)} key={item.key} isLeaf={children.length == 0} disabled={cfg.editMode} nodeData={item.nodeData || {}} >{children.length == 0 ? '' : loop(children, item)}</NCTree.NCTreeNode>);
            });
        }

        // const loop = (datas, pdata) => datas.map((item) => {
        //     var children = item.children || [];
        //     return (<NCTree.NCTreeNode title={renderTreeTitle(item, pdata)} key={item.key} isLeaf={children.length == 0}  disabled={cfg.editMode} nodeData={item.nodeData|| {}} >{children.length == 0 ? '':loop(children, item)}</NCTree.NCTreeNode>)
        // });
        return loop(cfg.datas);
    }

    updateBtnStatus() {
        debugger;
        var editMode = this.state.editMode ? true : false;
        var isSelect = this.state.tree.selectedKeys.length == 1 && this.state.tree.selectedKeys[0] != 'root';
        var firstLayNode = isSelect && this.state.tree.selectedNode && this.state.tree.selectedNode.props.nodeData.pid == 'root';
        var enabled = true;
        enabled = this.props.form.getFormItemsValue('head', 'enablestate');
        var pk_fundplan = this.props.form.getFormItemsValue('head', 'pk_fundplan');
        //设置可以显示的按钮
        this.props.button.setDisabled({
            save: !editMode,
            saveadd: !(editMode) && (pk_fundplan && (!pk_fundplan.value || pk_fundplan.value.length == 0)),
            cancel: !editMode,
            print: editMode || !isSelect,
            export: editMode || !isSelect,
            refresh: editMode,
            enable: editMode || !isSelect,
            disable: editMode || !isSelect
        });

        this.props.button.setButtonsVisible({
            save: editMode,
            saveadd: editMode && (pk_fundplan && (!pk_fundplan.value || pk_fundplan.value.length == 0)),
            cancel: editMode,
            edit: false,
            delete: false,
            add: false,
            assign: !editMode,
            unassign: !editMode,
            exportfile: !editMode,
            import: !editMode,
            refresh: !editMode,
            enable: false,
            disable: false,
            print: !editMode
        });
    }
    onBtnOperation(props, id) {
        switch (id.toLowerCase()) {
            case 'cancel':
                this.onCancel();
                break;
            case 'save':
                this.onSaveForPrompt();
                break;
            case 'saveadd':
                this.onSaveAdd();
                break;
            case 'enable':
                this.onEnableState(true);
                break;
            case 'disable':
                this.onEnableState(false);
                break;
            case 'refresh':
                this.onRefresh();
                break;
            case 'assign':
                this.onAssign('do');
                break;
            case 'unassign':
                this.onAssign('undo');
                break;
            case 'print':
                this.onPrint('print');
                break;
            case 'export':
                this.onPrint('export');
                break;
            case 'exportfile':
                this.setState(this.state, () => {
                    this.props.modal.show('exportFileModal');
                });
                break;
                break;
        }
    }
    constructor(props) {
        super(props);
        this.config = props.config;

        //init template button

        createUIDom(props)(
            { pagecode: props.config.pagecode },
            { moduleId: "10140FPB", domainName: 'uapbd' },
            (data, lang) => {
                this.lang = lang;
                this.config.title = lang[this.config.title];
                this.state = this.createState();
                this.state.tree.buttons = (data && data.button ? data.button : []).map(b => b.key);
                this.setState(this.state, () => {
                    data.template.head.items.forEach(item => {
                        if (item.attrcode == 'pk_parent') {
                            //item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                            item.queryCondition = () => {
                                let pk_org = null;
                                if (this.props.config.nodetype == 'GLOUB_NODE') {
                                    pk_org = 'GLOBLE00000000000000';
                                } else if (this.props.config.nodetype == 'GROUP_NODE') {
                                    pk_org = businessInfo.groupId;
                                }
                                return { pk_org: pk_org }
                            }
                        }
                    });
                    props.meta.setMeta(data && data.template ? data.template : {},()=>{
                        this.dealTemplate();
                    });
                    let excelimportconfig = excelImportconfig(props, 'uapbd', props.config.billType, true, '', { appcode: props.config.appcode, pagecode: props.config.pagecode }, () => { this.loadTreeData() });
                    props.button.setUploadConfig("import", excelimportconfig);
                    props.button.setButtons(data && data.button ? data.button : {}, () => this.updateBtnStatus());
                    setTimeout(() => {
                        var context = data.context || {};
                        if (context.pk_org && this.config.nodetype == 'ORG_NODE') {
                            var value = {
                                refpk2: 'finance' + context.pk_org,
                                refpk: context.pk_org,
                                refname: context.org_Name
                            };
                            this.state.org.onChange(value);
                        } else {
                            this.loadTreeData(true,(datas) => {
                                if (!datas[0]) return;
                                let firatLoad = {
                                    first: {
                                        selected: true,
                                        node: {
                                            props: {
                                                nodeData: datas[0].nodeData
                                            }
                                        }
                                    }
                                }
                                this.state.tree.onSelect([datas[0].key], firatLoad)
                            });
                        }
                    }, 0);
                });
            });
    }

    createState() {
        var state = {
            pks: [],
            editMode: false,
            usepower:{
                usepowerflag:false,
                message:'',
            },
            org: {
                value: undefined,
                queryCondition: () => {//组织权限
                    return {
                        AppCode: this.config.appcode || '',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                },
                onChange: (val) => {
                    this.state.org.value = val;
                    this.setState(this.state, () => {
                        this.loadTreeData(true,(datas) => {
                            this.state.tree = {
                                ...this.state.tree,
                                selectedKeys: [],
                                selectedNode: undefined
                            };
                            this.setState(this.state, () => {
                                var meta = this.props.meta.getMeta();
                                meta.head.items.forEach(item => {
                                    if (item.attrcode == 'pk_parent') {
                                        item.queryCondition = () => {
                                            let pk_org = this.state.org.value.refpk;
                                            if (this.props.config.nodetype == 'GLOUB_NODE') {
                                                pk_org = 'GLOBLE00000000000000'
                                            } else if (this.props.config.nodetype == 'GROUP_NODE') {
                                                pk_org = businessInfo.groupId;
                                            }
                                            return { pk_org: pk_org }
                                        }
                                    }
                                });
                                this.props.meta.setMeta(meta);
                                //切换组织后选中第一个节点
                                if (!datas[0]) return;
                                let firatLoad = {
                                    first: {
                                        selected: true,
                                        node: {
                                            props: {
                                                nodeData: datas[0].nodeData
                                            }
                                        }
                                    }
                                }
                                this.state.tree.onSelect([datas[0].key], firatLoad)
                            });
                        });
                    })
                }
            },
            showOff: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (value) => {
                    this.state.showOff.checked = value;
                    this.setState(this.state, () => {
                        this.loadTreeData();
                    });
                }
            },
            treesearch: {
                valueTemp: undefined,
                fieldid:'search',
                value: undefined,
                type: 'search',
                onChange: (value) => {
                    this.intervalmain = new Date().getTime();
                    let s = setTimeout(() => {//停止输入0.5s后执行
                        if (new Date().getTime() - this.intervalmain >= 500) {
                            this.state.treesearch.value = this.state.treesearch.valueTemp;
                            this.setState(this.state, () => {
                                this.state.treesearch.onSearch();
                            });
                        }
                        clearTimeout(s);
                    }, 500);
                    this.state.treesearch.valueTemp = value;
                    this.setState(this.state);
                },
                onSearch: () => {
                    var expandKeys = [],
                        textValue = this.state.treesearch.value || '';

                    const loopsearch = (nodes = []) => {
                        var parendExpand = false;
                        (nodes || []).forEach(child => {
                            var expand = loopsearch(child.children || []);
                            child.needExpand = expand;
                            child.needShow = expand ? true : (child.code.indexOf(textValue) != -1 || child.title.indexOf(textValue) != -1 ? true : false);
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.tree.datas);
                    expandKeys.push('root');
                    this.state.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root: {
                    title: this.lang['10140FPB-000010'],//"资金计划项目",
                    name: this.lang['10140FPB-000010'],//"资金计划项目",
                    key: 'root',
                    id: 'root',
                    code:'',
                    nodeData: {
                        code: '',
                        nodeData: {
                            pk_fundplan: '',
                            enablestate:'2'
                        }
                    }
                },
                closeIcon:<i  class="icon iconfont icon-shushouqi tree-swich"></i>,
				openIcon:<i  class="icon iconfont icon-shu_zk tree-swich"></i>,
                //defaultExpandAll: true,
                datas: [],
                fieldid:'synctree',
                selectedKeys: [],
                autoExpandParent: false,
                buttons: [], //按钮权限
                selectedNode: undefined,
                disabled: false,
                expandedKeys: ['root'],
                onDoubleClick: (checkedKeys) => {
                    // arrRemoveAppoint 是一个数组删除方法
                    this.state.tree.expandedKeys.includes(checkedKeys) ? this.state.tree.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.tree.expandedKeys.push(checkedKeys);
                    this.setState(this.state);
                },
                onExpand: (expandedKeys, e) => {
                    this.state.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    e = e.first || e;
                    if (selectedKeys.length == 0) return;
                    var td = this.state.tree;
                    this.state.tree = {
                        ...this.state.tree,
                        selectedKeys: selectedKeys,
                        selectedNode: e.selected ? e.node : undefined
                    };
                    this.setState(this.state, () => {
                        this.loadFormData({ id: e.node.props.nodeData.nodeData.pk_fundplan });
                        this.updateBtnStatus();
                    });
                },
                renderNode: this.renderNode.bind(this)
            }
        };
        return state;
    }

    onAssign(doWay) {
        this.doWay = doWay;
        this.assign.show(doWay);
    }

    onFinishAssign(continueBack,isSure = 'N') {
        var doWay = this.doWay,
            pkorgs = this.assign.getOrgData(),
            pkfundplan = this.assign.getInoutbusiclassData();
        //应测试要求，此处取消分配不再提示
        //var  handler = () =>{
        ajax({
            url: doWay == 'do' ? '/nccloud/uapbd/fundplanitem/FundplanitemAssignAction.do' : '/nccloud/uapbd/fundplanitem/FundplanitemUnAssignAction.do',
            data: {
                pkorgs: pkorgs,
                pkfundplan: pkfundplan,
                isSure : isSure
            },
            success: (res) => {
                let {data,success} = res;
                if(success && data && data!=null && doWay != 'do'){
                    promptBox({
                        color: "warning",
                        title: this.lang['10140FPB-000052'],
                        content: this.lang['10140FPB-000053'],
                        beSureBtnClick: () => {
                            this.onFinishAssign(go,'Y');
                        },
                        cancelBtnClick: () => {
                            this.assign.cancel();
                        }
                    });
                    return;
                }
                toast({ title: doWay == 'do' ? this.lang['10140FPB-000033'] : this.lang['10140FPB-000034'], color: 'success' });/* 国际化处理： 分配成功!,取消分配成功,分配成功*/
                this.assign.cancel();
                if (continueBack) {
                    this.setState(this.state, () => {
                        this.onAssign(this.doWay);
                    });
                }
            }
        });
        //};
        // if(doWay  == 'undo'){
        //     // this.props.modal.show('modal',{
        //     promptBox({
        //         color:"warning",
        //         title: this.lang['10140FPB-000021'],/* 国际化处理： 确认取消*/
        //         content: this.lang['10140FPB-000035'],/* 国际化处理： 是否确认要取消?,是否确认要取消*/
        //         beSureBtnClick:handler,
        //         cancelBtnClick:()=>{}
        //      });
        // }else{
        //     handler();
        // }



    }

    loadTreeData(changenode = true ,callback) {
        if (this.config.nodetype == 'ORG_NODE' && !this.state.org.value) {
            return;
        }
        ajax({
            url: '/nccloud/uapbd/fundplanitem/FundplanitemTreeAction.do',
            data: {
                nodetype: this.config.nodetype,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                isShowSeal: this.state.showOff.checked
            },
            success: (result) => {
                this.state.tree.datas = result.data;
                if (result.data[0]) {
                    let firatLoad = {
                        first: {
                            selected: true,
                            node: {
                                props: {
                                    nodeData: result.data[0].nodeData
                                }
                            }
                        }
                    }
                    if(changenode == true){
                        this.state.tree.onSelect([result.data[0].key], firatLoad)
                    }
                }
                this.setState(this.state, () => {
                    callback && callback(result.data);
                });
            }
        });
    }

    checkUsePower(pk_fundplan){
        ajax({
            loading: true,
            url: '/nccloud/uapbd/fundplanitem/FundplanitemCheckDataModel.do',
            data: {
                "pk_fundplan": pk_fundplan,
                mdOperateCode: 'edit',//增加一个修改参数，用来标志数据权限；
            },
            success: (res) => {
                if (res.success && res.data) {//如果有修改权限才跳转到卡片页面
                    this.state.usepower.usepowerflag = res.data.usepower
                    this.state.usepower.message = res.data.message
                }
            }
        });
    }

    loadFormData({ id = undefined, pid = undefined, callback = EMPTY_FN }) {
        if (!id && !pid) {
            this.props.form.EmptyAllFormValue('head');
            setTimeout(() => {
                callback();
            }, 0);
            return;
        }
        //检查数据操作权限
        this.checkUsePower(id);
        if(!id){
            this.props.form.EmptyAllFormValue('head');
            this.props.form.setFormStatus('head', 'add');
            this.updateBtnStatus();
        }
        
        ajax({
            url: '/nccloud/uapbd/fundplanitem/FundplanitemQueryAction.do',
            data: {
                id: id,
                pid: pid,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                ...this.config
            },
            success: (result) => {
                var data = {
                    head: result.data.formData.head
                };
                //过滤空数据
                //bug 修改 NCCLOUD-160581，调整filterEmptyData   convertGridEnablestateToShow的顺序
                Utils.filterEmptyData(data.head.rows[0].values);
                Utils.convertGridEnablestateToShow(data.head.rows);
                this.props.form.setAllFormValue(data);
                this.props.form.setFormItemsDisabled('head', { 'enablestate': false, 'code': !result.data.isCodeEdit });
                setTimeout(() => {
                    callback && callback();
                }, 0);
            }
            ,
            error:(result)=>{
                debugger;
                toast({ content:result.message, color: 'warning' });/* 国际化处理： 请选择组织*/
                setTimeout(() => {
                    //callback && callback();
                    preedit;
                }, 0);
                return;
            }
        });
    }

    onAdd(node) {
        debugger;
        let doPreAddMark = false;
        let chooesedKeys = [node.id]
        this.state.tree.selectedKeys = chooesedKeys
        var inoutdirectitem = this.props.form.getFormItemsValue('head', 'inoutdirect');
        var isuseditem = this.props.form.getFormItemsValue('head', 'isused');
        //this.setState(this.state)
        if (this.config.nodetype == 'ORG_NODE' && (!this.state.org.value || !this.state.org.value.refpk)) {
            toast({ content: this.lang['10140FPB-000036'], color: 'warning' });/* 国际化处理： 请选择组织*/
            return;
        }
        if(node.nodeData && node.nodeData.nodeData['enablestate'] != 2){
            toast({ content: this.lang['10140FPB-000050'], color: 'warning' });/* 国际化处理： 已停用节点无法新增下级！*/
            return;
        }
        var preadd = () => {
            this.state.editMode = true;
            doPreAddMark = true;
            this.setState(this.state, () => {
                let data = this.props.form.getAllFormValue('head');
                Utils.convertGridEnablestateToSave(data.rows);
                this.props.form.setAllFormValue({ 'head': data });
                this.props.form.setFormItemsDisabled('head', { 'enablestate': true, 'pk_org': true });
                //选中根节点，收支方向是可以编辑，选中其他的需要和父节点保持一致
                if (inoutdirectitem.value != null && node.key != 'root') {
                    this.props.form.setFormItemsValue('head', { 'inoutdirect': inoutdirectitem });
                    this.props.form.setFormItemsValue('head', { 'isused': isuseditem });
                    this.props.form.setFormItemsDisabled('head', { 'isused': isuseditem&&isuseditem.value?isuseditem.value:false});
                    this.props.form.setFormItemsDisabled('head', { 'inoutdirect': true });
                } else {
                    this.props.form.setFormItemsDisabled('head', { 'inoutdirect': false });
                    this.props.form.getFormItemsValue('head', 'inoutdirect').value == 1 ? this.props.form.setFormItemsDisabled('head', { 'isused': false }) : this.props.form.setFormItemsDisabled('head', { 'isused': true });
                }
                this.props.form.setFormStatus('head', 'edit');
                //设置焦点
                this.props.form.setFormItemAutoFocus('head','code');
                this.updateBtnStatus();
            });
        };
        this.loadFormData({ pid: node.id, callback: preadd });
        //在设置了编码规则后，如果没有编码可以分配时，保存、保存新增、取消按钮要显示，左侧树不可编辑
        preadd();
    }

    onEdit(node) {
        let chooesedKeys = [node.id]
        ajax({
            loading: true,
            url: '/nccloud/uapbd/fundplanitem/FundplanitemCheckDataModel.do',
            data: {
                "pk_fundplan": chooesedKeys[0],
                mdOperateCode: 'edit',//增加一个修改参数，用来标志数据权限；
            },
            success: (res) => {
                if (res.success && res.data) {//如果有修改权限才跳转到卡片页面
                    this.state.tree.selectedKeys = chooesedKeys
                    this.setState(this.state)
                    var preedit = () => {
                        this.state.editMode = true;
                        this.setState(this.state, () => {
                            let data = this.props.form.getAllFormValue('head');
                            Utils.convertGridEnablestateToSave(data.rows);
                            this.props.form.setAllFormValue({ 'head': data });
                            this.props.form.setFormItemsDisabled('head', { enablestate: true });  //冗余代码 以后调整
                            var inoutdirectitem = this.props.form.getFormItemsValue('head', 'inoutdirect');
                            var isuseditem = this.props.form.getFormItemsValue('head', 'isused');
                            if (this.props.form.getFormItemsValue('head', 'pk_parent').value != null) {

                                this.props.form.setFormItemsDisabled('head', { 'isused': inoutdirectitem.value==1&&isuseditem&&isuseditem.value?isuseditem.value:false});
                                this.props.form.setFormItemsDisabled('head', { 'inoutdirect': true });
                            } else {
                                this.props.form.setFormItemsDisabled('head', { 'inoutdirect': false });
                                this.props.form.getFormItemsValue('head', 'inoutdirect').value == 1 ? this.props.form.setFormItemsDisabled('head', { 'isused': false }) : this.props.form.setFormItemsDisabled('head', { 'isused': true });
                            }
                            this.props.form.setFormStatus('head', 'edit');
                            //设置焦点
                            this.props.form.setFormItemAutoFocus('head','code');
                            this.updateBtnStatus();
                        });
                    };
                    this.loadFormData({ id: node.id, callback: preedit });
                }

            }
        });

    }


    save(callback) {
        var formData = this.props.form.getAllFormValue('head');
        formData.areacode = 'head'
        let validateData = {
            pageid: this.props.config.pagecode,
            model: formData
        }
        var cloneObj = Utils.clone(formData),
            datapk = cloneObj.rows[0].values.pk_fundplan.value || undefined;
        if (!this.props.form.isCheckNow('head')) {
            return;
        }

        this.props.validateToSave(validateData, () => {
            ajax({
                url: '/nccloud/uapbd/fundplanitem/FundplanitemSaveAction.do',
                data: {
                    model: {
                        rows: [{
                            values: cloneObj.rows[0].values,
                            rowid: 0
                        }]
                    },
                    pageid: this.config.pagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                },
                success: (result) => {
                    callback && callback(result.data);
                }
            });
        }, { 'head': 'form' }, 'form')

    }

    onSaveForPrompt() {
        if (this.props.form.getFormItemsValue('head', 'pk_fundplan').value && this.state.tree.selectedNode.props.nodeData.nodeData.inoutdirect != this.props.form.getFormItemsValue('head', 'inoutdirect').value) {
            if (this.state.tree.selectedNode.props.nodeData.nodeData.isused != this.props.form.getFormItemsValue('head', 'isused').value) {
                promptBox({
                    color: "warning",
                    //title: newValue.value ? this.lang['10140FPB-000029'] : this.lang['10140FPB-000030'],/* 国际化处理： 确认启用,确认停用*/
                    content: this.lang['10140FPB-000047'],
                    beSureBtnClick: () => {
                        promptBox({
                            color: "warning",
                            //title: newValue.value ? this.lang['10140FPB-000029'] : this.lang['10140FPB-000030'],/* 国际化处理： 确认启用,确认停用*/
                            content: this.lang['10140FPB-000049'],
                            beSureBtnClick: () => {
                                this.onSave()
                            },
                            cancelBtnClick: () => {
                                //props.form.setFormItemsValue('head', { 'enablestate': { value: oldValue.value, display: null } });
                            }
                        });
                    },
                    cancelBtnClick: () => {
                        //props.form.setFormItemsValue('head', { 'enablestate': { value: oldValue.value, display: null } });
                    }
                });
            } else {
                promptBox({
                    color: "warning",
                    //title: newValue.value ? this.lang['10140FPB-000029'] : this.lang['10140FPB-000030'],/* 国际化处理： 确认启用,确认停用*/
                    content: this.lang['10140FPB-000047'],
                    beSureBtnClick: () => {
                        this.onSave()
                    },
                    cancelBtnClick: () => {
                        //props.form.setFormItemsValue('head', { 'enablestate': { value: oldValue.value, display: null } });
                    }
                });
            }
        } else if (this.props.form.getFormItemsValue('head', 'pk_fundplan').value && this.state.tree.selectedNode.props.nodeData.nodeData.isused != this.props.form.getFormItemsValue('head', 'isused').value) {
            promptBox({
                color: "warning",
                //title: newValue.value ? this.lang['10140FPB-000029'] : this.lang['10140FPB-000030'],/* 国际化处理： 确认启用,确认停用*/
                content: this.lang['10140FPB-000049'],
                beSureBtnClick: () => {
                    this.onSave()
                },
                cancelBtnClick: () => {
                    //props.form.setFormItemsValue('head', { 'enablestate': { value: oldValue.value, display: null } });
                }
            });
        } else {
            this.onSave()
        }
    }

    onSave() {
        this.save((data) => {
            toast({ title: this.lang['10140FPB-000022'], color: 'success' });/* 国际化处理： 保存成功！*/
            this.props.form.setFormStatus('head', 'browse');
            setTimeout(() => {
                this.loadTreeData(true,() => {
                    this.loadFormData({
                        id: data.head.rows[0].values.pk_fundplan.value, callback: () => {
                            this.state.editMode = false;
                            this.setState(this.state, () => {
                                this.updateBtnStatus();
                            });
                        }
                    });
                });
            }, 0);

        });
    }

    onSaveAdd() {
        // 选中那个进行新增的
        let selectedKeys = this.state.tree.selectedKeys;
        this.save((data) => {
            this.loadTreeData(false,() => {
                this.onAdd({
                    id: selectedKeys[0],
                    key: selectedKeys[0]
                });
            });
        });
    }

    onDelete(node) {
        let chooesedKeys = [node.id]
        ajax({
            loading: true,
            url: '/nccloud/uapbd/fundplanitem/FundplanitemCheckDataModel.do',
            data: {
                "pk_fundplan": chooesedKeys[0],
                mdOperateCode: 'delete',//增加一个修改参数，用来标志数据权限；
            },
            success: (res) => {
                if (res.success && res.data) {//如果有修改权限才跳转到卡片页面
                    var formData = this.props.form.getAllFormValue('head');
                    formData.areacode = 'head'
                    let validateData = {
                        pageid: this.props.config.pagecode,
                        model: formData
                    }
                    Utils.convertGridEnablestate(formData.rows);

                    var cloneObj = Utils.clone(formData);

                    var delHandler = () => {
                        ajax({
                            url: '/nccloud/uapbd/fundplanitem/FundplanitemDelAction.do',
                            data: {
                                model: {
                                    rows: [{
                                        values: cloneObj.rows[0].values,
                                        rowid: 0
                                    }]
                                },
                                pageid: this.config.pagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                            },
                            success: (result) => {
                                if (result.success) {
                                    this.props.form.EmptyAllFormValue('head');
                                    this.loadTreeData();
                                    toast({ title: this.lang['10140FPB-000023'], color: 'success' });/* 国际化处理： 删除成功！*/
                                }
                            }
                        });
                    };
                    if (node.key == this.state.tree.root.key) {
                        toast({ content: this.lang['10140FPB-000039'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
                        return;
                    }
                    // this.props.modal.show('modal',{
                    promptBox({
                        color: 'warning',
                        title: this.lang['10140FPB-000024'],/* 国际化处理： 删除*/
                        content: this.lang['10140FPB-000025'],/* 国际化处理： 确定要删除吗？*/
                        beSureBtnClick: delHandler
                    });
                }

            }
        });

    }



    onRefresh() {
        this.props.form.EmptyAllFormValue('head');
        this.state.tree.selectedKeys = ['root'];
        this.state.tree.expandedKeys = ['root'];
        this.loadTreeData(true,() => {
            this.setState(this.state, () => {
                toast({ title: this.lang['10140FPB-000041'], color: 'success' });/* 国际化处理： 刷新成功*/
            });
        });
        this.updateBtnStatus();
    }

    onCancel() {

        var hander = () => {
            let pkValue = this.props.form.getFormItemsValue('head', 'pk_fundplan').value;
            let codeValue = this.props.form.getFormItemsValue('head', 'code').value;

            this.state.editMode = false;
            this.setState(this.state, () => {
                this.loadFormData({
                    id: this.state.tree.selectedKeys[0] == "root" ? undefined : this.state.tree.selectedKeys[0], callback: () => {
                        this.props.form.setFormStatus('head', 'browse');
                        this.updateBtnStatus();
                    }
                });
            });

            //编码回滚
            if (pkValue) {
                return;
            }
            if (!codeValue) {
                return;
            }
            ajax({
                url: '/nccloud/uapbd/fundplanitem/FundplanitemRollBackCodeAction.do',
                data: { newBillCode: codeValue, pk_org: this.state.org.value ? this.state.org.value.refpk : '', ...this.config },
                success: (result) => {
                    if (result.success) {

                    } else {
                        alert(result.message);
                    }
                }
            });
        };
        // this.props.modal.show('modal',{
        promptBox({
            color: 'warning',
            title: this.lang['10140FPB-000021'],/* 国际化处理： 确认取消*/
            content: this.lang['10140FPB-000026'],/* 国际化处理： 您确定要取消编辑吗?*/
            beSureBtnClick: hander
        });
    }

    onEnableState(enable = true) {
        var formData = this.props.form.getAllFormValue('head');
        formData.areacode = 'head'
        let validateData = {
            pageid: this.props.config.pagecode,
            model: formData
        }

        formData.rows[0].values.enablestate.value = !enable;

        Utils.convertGridEnablestate(formData.rows);

        var cloneObj = Utils.clone(formData);

        ajax({
            url: '/nccloud/uapbd/fundplanitem/FundplanitemEnableAction.do',// : '/nccloud/uapbd/cashflow/EditMainitemAction.do',
            data: {
                model: {
                    rows: [{
                        values: cloneObj.rows[0].values,
                        rowid: 0
                    }]
                },
                pageid: this.config.pagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            },
            success: (result) => {
                toast({ title: !enable ? this.lang['10140FPB-000027'] : this.lang['10140FPB-000028'], color: 'success' });/* 国际化处理： 停用成功！,启用成功！*/
                if (result.success) {
                    this.loadTreeData(true,() => {
                        this.state.tree.selectedKeys = [];
                        this.setState(this.state, () => {
                            if (enable || this.state.showOff.checked) {
                                this.loadFormData({ id: formData.rows[0].values.pk_fundplan.value });
                            } else {
                                this.loadFormData({ id: undefined });
                            }
                            this.updateBtnStatus();
                        });
                    });
                }
            }
        });
    }
    onPrint(way) {
        var datas = this.state.tree.datas,
            pks = [],
            loop = (datas) => {
                datas.forEach(d => {
                    pks.push(d.id);
                    if (d.children) {
                        loop(d.children);
                    }
                });
            };
        loop(datas);
        if (way == 'print') {
            let param = {
                funcode: this.props.config.appcode,
                nodekey: 'fundplan',
                oids: this.state.tree.selectedKeys//pks
            };
            print('pdf', '/nccloud/uapbd/fundplanitem/FundplanitemPrintAction.do', param);
        } else {
            this.setState({ pks: pks }, this.refs.printOutput.open());
        }
    }
    render() {
        if (!this.lang)
            return '';
        const { syncTree, form, button, ncmodal, DragWidthCom,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        let { createModal } = ncmodal;  //模态框


        var viewCard = () => {
            return createForm('head', {
                cancelPSwitch: true,
                onAfterEvent: this.onFormAfterHander.bind(this),
                onBeforeEvent: this.onFormBeforeHander.bind(this)
            });
        };

        var searchRender = {
            ...this.state.treesearch,
            value: this.state.treesearch.valueTemp,
            disabled: this.state.editMode
        };

        return (
            <div className='nc-bill-tree-card'>
                {createModal('modal', { noFooter: false })}
                <AssignStepModal lang={this.lang} onFinish={this.onFinishAssign.bind(this)} ref={(assign) => this.assign = assign} />
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header" >
                    <div className="title">
                        {createBillHeadInfo({
                            title:this.config.title,
                            //backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                            showBackBtn:false,
                            initShowBackBtn:false}
                        )}
                    </div>
                    {this.config.nodetype !== 'ORG_NODE' ? '' : <div className="search-box"><span style={{marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red'}}><span style={{position: 'absolute',left: 3}}>*</span></span>{Org({ ...this.state.org, disabled: this.state.editMode, fieldid: "org" })}</div>}
                    <span className="showOff">
                        <NCCheckbox {...this.state.showOff} disabled={this.state.editMode} >{this.lang['10140FPB-000045']/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </span>
                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'head_button_area',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                    </div>
                </NCDiv>
                
                <div className="tree-card">
                    <DragWidthCom
                        leftDom={
                            <div className="tree-area" id="accSchemeTree">
                                <NCDiv className="syncTreeCom syncTreeComLineStyle syncTreeCom-my-style"  fieldid="fundplanitem" areaCode={NCDiv.config.TREE}>
                                        <div className="NC_syncTreeSearch NC_syncTreeSearch_self_width">
                                            <NCFormControl {...searchRender} />
                                        </div>
                                        <NCDiv fieldid= 'synctree' areaCode={NCDiv.config.TreeCom} className="synctree-area">
                                            <NCTree
                                                {...this.state.tree}>{
                                                    this.renderNode({
                                                        datas: [{ ...this.state.tree.root, children: this.state.tree.datas }],
                                                        onAdd: this.onAdd.bind(this),
                                                        onEdit: this.onEdit.bind(this),
                                                        onRemove: this.onDelete.bind(this),
                                                        buttons: this.state.tree.buttons,
                                                        editMode: this.state.editMode
                                                })}</NCTree>
                                        </NCDiv>
                                </NCDiv>
                            </div>
                        }
                        rightDom={<div className="card-area">{viewCard()}</div>} defLeftWid='280px' leftMinWid = '300px'/>
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={'/nccloud/uapbd/fundplanitem/FundplanitemPrintAction.do'}
                    data={{
                        funcode: this.props.config.appcode,//this.props.config.appcode,
                        nodekey: 'fundplan',
                        oids: this.state.tree.selectedKeys,
                        outputType: "output"
                    }}
                >
                </PrintOutput>
                <ExcelImport
                    {...Object.assign(this.props) }
                    moduleName='uapbd'//模块名
                    billType={this.props.config.billType}//单据类型
                    selectedPKS={[]}
                    //selectedPKS = {this.state.selectedPKS}
                    //exportTreeUrl = {""}//自定义导出action接口(可不传)
                    appcode={this.props.config.appcode}
                    pagecode={this.props.config.pagecode}
                // referVO={}//自定义传参参数
                />

            </div>
        );
    }
    getPk_org = ()=>{
        let {nodetype} = this.props.config;let {value} = this.state.org;

        return nodetype == 'GLOUB_NODE'?'GLOBLE00000000000000':(nodetype=='GROUP_NODE'?businessInfo.groupId:(value?value.refpk:''));
    }

    /**
     * mergerequest回来，就可以调用处理模板的方法了
     */
    dealTemplate = ()=>{
        let pk_org = this.getPk_org();
        this.props.meta.getMeta()['head'].items.forEach(item=>{
            if(item.attrcode == 'pk_parent'){
                item.queryCondition = () => {
                    //let pk_org = this.getPk_org();
                    let pk_fundplan = this.props.form.getFormItemsValue('head', 'pk_fundplan').value;
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.fundplanitem.action.FundplanitemPkFatherSQLBuilder',
                        pk_org: pk_org,
                        orgtype: this.props.config.nodetype,
                        pk_fundplan: pk_fundplan
                    }
                }
            }
            if(item.attrcode == 'pk_cashflow'){
                item.queryCondition = () => {
                    //let pk_org = this.getPk_org();
                    let {nodetype} = this.config;
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.fundplanitem.action.FundplanitemPkCashFlowSQLBuilder',
                        pk_org: businessInfo.groupId,
                        // 加pk_group保持与pk_org保持一致，否则后台根据过滤条件会把全局的过滤掉
                        pk_group: businessInfo.groupId ,//nodetype == 'GROUP_NODE' ? pk_org : nodetype,
                        nodetype: nodetype
                    }
                }
                
            }
        });
        // this.props.meta.setMeta(meta);
    }

    onFormBeforeHander(props, formid, itemname, value, data){
        let pk_org = data.pk_org.value;
        //停启用按钮的维护权限
        if (itemname == 'enablestate'){
            if(this.state.usepower.usepowerflag != true){
                toast({ content: this.state.usepower.message, color: "warning" });/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
                return false
            }
            if ((this.props.config.nodetype == 'GLOUB_NODE' && pk_org != 'GLOBLE00000000000000') || (this.props.config.nodetype == 'GROUP_NODE' && pk_org != businessInfo.groupId) || (this.props.config.nodetype == 'ORG_NODE' && pk_org != (this.state.org.value ? this.state.org.value.refpk : ''))) {
                toast({ content: this.lang['10140FPB-000048'], color: "warning" });/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
                return false
            }
        }
        
        return true;
        // let pk_org = '';
        // if (this.state.org.value != undefined) {
        //     pk_org = this.state.org.value.refpk;
        // }
        // if (this.props.config.nodetype == 'GLOUB_NODE') {
        //     pk_org = 'GLOBLE00000000000000';
        // } else if (this.props.config.nodetype == 'GROUP_NODE') {
        //     pk_org = businessInfo.groupId;
        // }
        // let pk_org = this.getPk_org();
        // if(itemname != 'enablestate'){
        //     return true;
        // }
        
        // // if (!data.pk_fundplan.value || data.pk_fundplan.value == '')
        // //     return false;
        // // if (this.state.editMode == true)
        // //     return false;
        // let result = await new Promise(resolve=>{
        //     ajax({
        //         loading: true,
        //         url: '/nccloud/uapbd/fundplanitem/FundplanitemCheckDataModel.do',
        //         data: {
        //             "pk_fundplan": data.pk_fundplan.value,
        //             mdOperateCode: 'edit',//增加一个修改参数，用来标志数据权限；
        //         },
        //         success: (res) => {
        //             if (res.success && res.data) {//如果有修改权限才跳转到卡片页面
        //                 pk_org = data.pk_org.value;
        //                 var pk_group = data.pk_group.value;
        //                 var nodetype = this.config.nodetype;
        //                 if ((nodetype == 'GLOUB_NODE' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'GROUP_NODE' && pk_org != pk_group) || (nodetype == 'ORG_NODE' && pk_org != (this.state.org.value ? this.state.org.value.refpk : ''))) {
        //                     toast({ content: this.lang['10140FPB-000048'], color: "warning" });/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
        //                 }
        //                 resolve((nodetype == 'GLOUB_NODE' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'GROUP_NODE' && pk_org != pk_group) || (nodetype == 'ORG_NODE' && pk_org != (this.state.org.value ? this.state.org.value.refpk : '')));
        //             }
        //         }
        //     });

        // }).then(res=>{
        //     return res;
        // });
        // console.log("你好");
        // debugger;
        // return result;
        //请把原来在编辑前事件给item赋queryCondition的逻辑挪到dealTemplate中，在mergeRequest成功之后调用，不在这里处理
        // var meta = this.props.meta.getMeta();
        // if (itemname == 'pk_parent') {
        //     // if (!data.pk_fundplan.value || data.pk_fundplan.value == '')
        //     //     return false;
        //     let pk_parent = meta['head'].items.find((item) => item.attrcode == 'pk_parent');
        //     pk_parent.queryCondition = () => {
        //         return {
        //             TreeRefActionExt: 'nccloud.web.uapbd.fundplanitem.action.FundplanitemPkFatherSQLBuilder',
        //             pk_org: pk_org,
        //             orgtype: this.props.config.nodetype,
        //             pk_fundplan: data.pk_fundplan.value
        //         }
        //     }
        //     this.props.meta.setMeta(meta);
        //     return true;
        // }
        // else if (itemname == 'pk_cashflow') {
        //     let pk_cashflow = meta['head'].items.find((item) => item.attrcode == 'pk_cashflow');
        //     pk_cashflow.queryCondition = () => {
        //         return {
        //             TreeRefActionExt: 'nccloud.web.uapbd.fundplanitem.action.FundplanitemPkCashFlowSQLBuilder',
        //             pk_org: pk_org,
        //             // 加pk_group保持与pk_org保持一致，否则后台根据过滤条件会把全局的过滤掉
        //             pk_group: this.config.nodetype == 'GROUP_NODE' ? pk_org : this.config.nodetype,
        //             nodetype: this.config.nodetype
        //         }
        //     }
        //     this.props.meta.setMeta(meta);
        //     return true;
        // }else{
        //     return true;
        // }
    }

    onFormAfterHander(props, formid, itemname, newValue, oldValue, data) {
        if (itemname == 'inoutdirect') {
            this.props.form.getFormItemsValue('head', 'inoutdirect').value == 1 ? this.props.form.setFormItemsDisabled('head', { 'isused': false }) : this.props.form.setFormItemsDisabled('head', { 'isused': true })
            this.props.form.getFormItemsValue('head', 'inoutdirect').value != 1 ? this.props.form.setFormItemsValue('head', { 'isused': false }) : "";
        }
        if (itemname == 'enablestate') {
            var formData = this.props.form.getAllFormValue('head');
            var pk_org = formData.rows[0].values.pk_org.value;
            var pk_group = formData.rows[0].values.pk_group.value;
            promptBox({
                color: "warning",
                title: newValue.value ? this.lang['10140FPB-000029'] : this.lang['10140FPB-000030'],/* 国际化处理： 确认启用,确认停用*/
                content: newValue.value ? this.lang['10140FPB-000031'] : this.lang['10140FPB-000032'],/* 国际化处理： 是否确认要启用?,是否确认要停用?*/
                beSureBtnClick: () => {
                    this.onEnableState(newValue.value)
                },
                cancelBtnClick: () => {
                    props.form.setFormItemsValue('head', { 'enablestate': { value: oldValue.value, display: null } });
                }
            });
        }
        return true;
    }
}
export default Fundplanitem;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65