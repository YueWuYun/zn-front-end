//FACbGhvKrJeCEGAjqwRh8EDYfyIqQuwAJZzRQQIY25w/njeFgnUHz3LW5SE7v7Ib
import React, { Component } from 'react';
import { createPageIcon,createPage, base, ajax, toast, print, high, promptBox,excelImportconfig } from 'nc-lightapp-front';
let { NCTabs, NCCheckbox, NCCol, NCRow, NCModal, NCCollapse, NCIcon, NCFormControl, NCPopconfirm,NCTree } = base;
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from '../../../public/utils/index.js';
let { BDselect } = Utils;
const { PrintOutput,ExcelImport } = high;
const { NCDiv } = base;
import {component} from '../../../public/platwapper/index.js';
const {NCTable,NCButton,NCSelect } = component;
import './index.less';

//import Org from '../../../refer/org/AccountBookTreeRef/index';
import Org from '../../../refer/org/FinanceOrgTreeRef/index.js';
//import Org from '../../../refer/org/FinanceOrgAllDataTreeRef/index'
import AssignStepModal from '../assign/AssignStepModal.js';
import { debug } from 'util';

// 数组拓展删除 数组中 指定的项
Array.prototype.arrRemoveAppoint = function (item) {
    if (!this.includes(item)) {
        return;
    }
    let thatIndex = this.indexOf(item);
    return this.splice(thatIndex, 1);
}

var EMPTY_FN = function () { };
var createUIDomParam = function (pagecode, appcode) {
    var param = {
        pagecode: pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? { ...param, appcode: appcode } : param;
};

class Cashflow extends Component {
    componentDidUpdate() {
        if (!this.state.editMode) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }


    constructor(props) {
        super(props);
        this.config = props.config;
        this.modeclassid = '08d4138b-a7b5-42fd-94bc-bb6eb7ac0fdc';

        //init template button
        createUIDom(props)({ ...createUIDomParam(this.props.config.pagecode, this.props.config.appcode) }, { moduleId: "10140CASHFLOW", domainName: 'uapbd' }, (data, lang) => {
            this.lang = lang;
            this.config.title = this.lang[this.config.title];
            this.state = this.createState();
            this.state.tree.buttons = (data && data.button ? data.button : []).map(b => b.key);
            this.setState(this.state, () => {
                data.template.cashflow.items.forEach(item => {
                    if (item.attrcode == 'pk_parent') {
                        //item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                        item.queryCondition = () => {
                            return {
                                TreeRefActionExt: 'nccloud.web.uapbd.cashflow.action.RefCondCashflowFormParent',
                                nodetpye: this.config.nodetype,
                                pk_org: this.config.nodetype == 'org' && this.state.org.value ? this.state.org.value.refpk : undefined
                            }
                        };
                    }
                });

                data.template.cfadjitemset.items.forEach(item => {

                    let refOrg = this.config.nodetype == 'org' && this.state.org.value ? this.state.org.value.refpk : this.config.nodetype == 'glb'?'GLOBLE00000000000000':undefined
                    if (item.attrcode == 'mainitem') {
                        // item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                        item.queryCondition = () => {
                            return {
                                TreeRefActionExt: 'nccloud.web.uapbd.cashflow.action.RefCondCashflowAdjItem',
                                nodetpye: this.config.nodetype,
                                pk_org: refOrg,
                                ismain: true
                            }
                        };
                    }
                    if (item.attrcode == 'additionalitem') {
                        // item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                        item.queryCondition = () => {
                            return {
                                TreeRefActionExt: 'nccloud.web.uapbd.cashflow.action.RefCondCashflowAdjItem',
                                nodetpye: this.config.nodetype,
                                pk_org: refOrg,
                                ismain: false
                            }
                        };
                    }
                    if (item.attrcode == 'additionaladjitem') {
                        //  item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                        item.queryCondition = () => {
                            return {
                                TreeRefActionExt: 'nccloud.web.uapbd.cashflow.action.RefCondCashflowAdjItem',
                                nodetpye: this.config.nodetype,
                                pk_org: refOrg,
                                ismain: false
                            }
                        };
                    }
                });
                props.meta.setMeta(data && data.template ? data.template : {});
                props.button.setButtons(data && data.button ? data.button : {}, () => this.updateBtnStatus());
                setTimeout(() => {
                    debugger;
                    var context = data.context || {};
                    if (context.pk_org && this.config.nodetype == 'org') {
                        var value = {
                            refpk2:'finance' + context.pk_org,
                            refpk: context.pk_org,
                            refname: context.org_Name
                        };
                        this.state.org.onChange(value);
                    } else {
                        this.loadTreeData((datas)=>{
                            if(!datas[0]) return;
                            let firatLoad = {
                                first:{
                                    selected: true,
                                    node:{
                                        props:{
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
                        var meta = this.props.meta.getMeta();
                        meta.cashflow.items.forEach(item => {
                            if (item.attrcode == 'pk_parent') {
                                item.queryCondition = () => {
                                    return {
                                        pk_org: this.state.org.value ? this.state.org.value.refpk : ''
                                    };
                                };
                            }
                        });
                        this.loadTreeData(() => {
                            this.state.tree = {
                                ...this.state.tree,
                                selectedKeys: [],
                                selectedNode: undefined
                            };
                            this.setState(this.state, () => {
                                this.props.form.EmptyAllFormValue('cashflow');
                            });
                        });
                    });
                }
            },

            showOff: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (value) => {
                    this.state.showOff.checked = value;
                    this.setState(this.state, () => {
                        this.loadTreeData(() => {
                            this.state.tree = {
                                ...this.state.tree,
                                selectedKeys: [],
                                selectedNode: undefined
                            };
                            this.setState(this.state, () => {
                                this.props.form.EmptyAllFormValue('cashflow');
                            });
                        });
                    });
                }
            },

            treesearch: {
                valueTemp: undefined,
                value: undefined,
                fieldid:'search',
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
                            child.needShow = expand ? true : (child.nodeData.code.indexOf(textValue) != -1 || child.title.indexOf(textValue) != -1 ? true : false);
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.tree.datas);
                    debugger;
                    expandKeys.push('root');
                    this.state.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root: {
                    title: this.lang['10140CASHFLOW-000031'],/* 国际化处理： 现金流量项目*/
                    code: this.lang['10140CASHFLOW-000031'],/* 国际化处理： 现金流量项目*/
                    key: 'root',
                    id: 'root',
                    nodeData: { ismain: false }
                },
                //defaultExpandAll: true,
                fieldid:'cashflow',
                datas: [],
                showLine: true,
                selectedKeys: [],
                buttons: [], //按钮权限
                autoExpandParent: false,
                expandedKeys: ['root'],
                selectedNode: undefined,
                disabled: false,
                openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),/* 国际化处理： 树开关*/
                closeIcon: (<i  class="icon iconfont icon-shushouqi tree-swich"></i>),/* 国际化处理： 树开关*/
                onDoubleClick: (checkedKeys) => {
                    console.log(checkedKeys);
                    // arrRemoveAppoint 是一个数组删除方法
                    this.state.tree.expandedKeys.includes(checkedKeys) ? this.state.tree.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.tree.expandedKeys.push(checkedKeys);
                    console.log(this.state.tree.expandedKeys);
                    this.setState(this.state);
                },
                onExpand: (expandedKeys, e) => {
                    this.state.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    e = e.first || e;
                    if (selectedKeys.length == 0) return;
                    this.state.tree = {
                        ...this.state.tree,
                        selectedKeys: selectedKeys,
                        selectedNode: e.selected ? e.node : undefined
                    };
                    this.setState(this.state, () => {
                        this.loadFormData({ id: e.node.props.nodeData.id });
                        this.updateBtnStatus();
                    });
                },
                renderNode: this.renderNode.bind(this)
            },
            ajditem: {
                config: {
                    show: false,
                    size: 'xlg'
                }
            }
        };
        return state;
    }

    renderNode(cfg) {
        var me = this;
        var operation = function (operation, item, pitem) {
            me.curOptNode = {
                item: item,
                pitem: pitem
            };
            return function (event) {
                event.stopPropagation();
                return cfg[operation](item, pitem);
            };
        };
        var renderTreeTitle = (item, pitem) => {
            var isInScope = () => {
                return item.nodeData.votype == this.config.nodetype || item.id == 'root';
            };
            let isExpand = this.state.tree.expandedKeys.includes(item.key);
            console.log(this.state.tree.expandedKeys, isExpand);
            var isLeaf = !item.children.length, title = item.title;
            let className = isLeaf ? "tree-dian" : isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian" : "icon iconfont  icon-wenjianjia tree-wenjian";

            var textValue = this.state.treesearch.value;
            var drawTitleString = (title) => {
                if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                    var start = title.indexOf(textValue), end = start + textValue.length;
                    return <span><span className='refer-tree-title'>{title.substring(0, start)}</span><span className="uapbd-cashflow-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                } else {
                    return (<span><span className='refer-tree-title'>{title}</span></span>);
                }
            };
            let wenjianicon = <i className={className} />;
            let titleInfo = <span className={isInScope() ? '' : 'uapbd-cashflow-bdselected-highlight nc-theme-gray-area-bgc'}>{drawTitleString(item.nodeData.code)}&nbsp;&nbsp;{drawTitleString(item.title)}</span>
            let titleAdd = cfg.buttons.indexOf('add') == -1 ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-zengjia add-icon" onClick={operation('onAdd', item, pitem)}></i>;/* 国际化处理： 新增*/
            let titleEdit = cfg.buttons.indexOf('edit') == -1 || !pitem || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-bianji edit-icon" onClick={operation('onEdit', item, pitem)}></i>;/* 国际化处理： 编辑*/
            let titleRemove = cfg.buttons.indexOf('delete') == -1 || !pitem || item.children.length != 0 || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-shanchu delete-icon" onClick={operation('onRemove', item, pitem)}></i>;/* 国际化处理： 删除*/
            return (<div className="title-con">{wenjianicon}{titleInfo}{titleEdit}{titleAdd}{titleRemove}</div>);
        };
        const loop = (datas, pdata) => {
            return ((datas || []).filter(item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }) || []).map((node) => {
                var children = node.children || [];
                var isLeaf = !node.children.length && node.key != "root";
                let switcherName = !children.length ? 'isLeaf_hiden_point_line' : 'isLeaf_show_point_line';
                let fieldid = (node.code||node.name||node.refname||node.refpk)+"_node";
                return (<NCTree.NCTreeNode
                    liAttr={{fieldid:fieldid}}
                    switcherClass={switcherName}
                    title={renderTreeTitle(node, pdata)}
                    key={node.key}
                    isLeaf={children.length == 0}
                    className={cfg && cfg.editMode && this.state.tree.selectedKeys && this.state.tree.selectedKeys[0] == node.key ? 'node-item-edit-point-style-self nc-theme-tree-item-active-bgc' : ''}
                    disabled={cfg.editMode} nodeData={node.nodeData || {}} >{children.length == 0 ? '' : loop(children, node)}</NCTree.NCTreeNode>);
            });
        }
        return loop(cfg.datas);
    }


    updateBtnStatus() {
        var editMode = this.state.editMode;
        var isSelect = this.state.tree.selectedKeys.length == 1 && this.state.tree.selectedKeys[0] != 'root';
        var firstLayNode = isSelect && this.state.tree.selectedNode && !this.state.tree.selectedNode.props.nodeData.pid;
        var iscurnodetype = isSelect && this.state.tree.selectedNode && this.state.tree.selectedNode.props.nodeData.votype == this.config.nodetype;
        var pk_cashflow = this.props.form.getFormItemsValue('cashflow', 'pk_cashflow');
        //设置可以显示的按钮
        this.props.button.setDisabled({
            save: !editMode,
            saveadd: !editMode,
            cancel: !editMode,
            group_print: editMode,
            refresh: editMode,
            adjustItem: editMode || !isSelect,
            mainItem: editMode || !isSelect || !firstLayNode || !iscurnodetype,
            assign: editMode,
            unassign: editMode,
            print: editMode || !isSelect,
            output: editMode || !isSelect,
            import: editMode,
            export: editMode
        });

        this.props.button.setButtonsVisible({
            save: editMode,
            saveadd: editMode && !(!!pk_cashflow && !!pk_cashflow.value && pk_cashflow.value.length > 0),
            //saveadd:editMode && (!pk_cashflow || !pk_cashflow.value || pk_cashflow.value.length == 0),
            cancel: editMode,
            refresh: !editMode,
            adjustItem: !editMode,
            mainItem: !editMode,
            enable: !editMode,
            unassign: !editMode,
            print: !editMode,
            assigngroup: !editMode,
            assign: !editMode,
            printgroup: !editMode,
            output: !editMode,
            import: !editMode,
            export: !editMode
        });
        this.props.form.setFormItemsDisabled('cashflow', { enablestate: editMode || (!pk_cashflow || !pk_cashflow.value || pk_cashflow.value.length == 0) });
        let excelimportconfig = excelImportconfig(this.props,'uapbd',this.props.config.billType,true,'',{appcode: this.props.config.appcode,pagecode: this.props.config.pagecode},()=>{this.onFlush()});
        this.props.button.setUploadConfig("import",excelimportconfig);
    }

    onBtnOperation(props, id) {

        switch (id.toLowerCase()) {

            case 'cancel':
                this.onCancel();
                break;
            case 'save':
                this.onSave(() => {
                });
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
                this.onFlush();
                break;
            case 'adjustitem':
                this.onAdjItem();
                break;
            case 'mainitem':
                this.onSetMainItem();
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
            case 'output':
                this.onPrint('output');
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
        }
    }

    onAssign(doWay) {
        this.doWay = doWay;
        this.assign.show(doWay);
    }

    onFinishAssign(go,isSure = 'N') {
        var doWay = this.doWay,
            pkorgs = this.assign.getOrgData(),
            pkcashflows = this.assign.getCashflowData();
        ajax({
            url: doWay == 'do' ? '/nccloud/uapbd/cashflow/CashflowAssignAction.do' : '/nccloud/uapbd/cashflow/CashflowUnAssignAction.do',
            data: {
                pkorgs: pkorgs,
                pkcashflows: pkcashflows,
                isSure : isSure
            },
            success: (res) => {
                let {data,success} = res;
                if(success && data && data.showMsg == 'show' && doWay != 'do'){
                    promptBox({
                        color: "warning",
                        title: this.lang['10140CASHFLOW-000065'],
                        content: this.lang['10140CASHFLOW-000066'],
                        beSureBtnClick: () => {
                            this.onFinishAssign(go,'Y');
                        },
                        cancelBtnClick: () => {
                            this.assign.cancel();
                        }
                    });
                    return;
                }
                toast({ title: doWay == 'do' ? this.lang['10140CASHFLOW-000032'] : this.lang['10140CASHFLOW-000033'], color: 'success' });/* 国际化处理： 分配成功!,取消分配成功,分配成功*/
                this.assign.cancel();
                if (go) {
                    this.setState(this.state, () => {
                        this.onAssign(this.doWay);
                    });
                }

            }
        });
    }

    loadTreeData(callback) {
        if (this.config.nodetype == 'org' && !this.state.org.value) {
            return;
        }
        ajax({
            url: '/nccloud/uapbd/cashflow/CashflowTreeAction.do',
            data: {
                orgtypeIDs: ['FINANCEORGTYPE000000'],
                isCludeGlobalAndGroupVO: false,
                nodetype: this.config.nodetype,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                isShowSeal: this.state.showOff.checked
            },
            success: (result) => {
                this.state.tree.datas = result.data;
                this.setState(this.state, () => {
                    callback && callback(result.data);
                });
            }
        });
    }

    loadFormData({ id = undefined, pid = undefined, callback = EMPTY_FN }) {
        this.props.form.EmptyAllFormValue('cashflow');
        if (!id && !pid) {
            callback();
            return;
        }
        ajax({
            url: '/nccloud/uapbd/cashflow/CashflowLoadAction.do',
            data: {
                ...this.props.config,
                id: id,
                pid: pid,
                area: 'cashflow',
                //nodetype: this.config.nodetype,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                // pagecode:this.props.config.pagecode,
                // appcode: this.props.config.appcode,

            },
            success: (result) => {
                if (!result.data) {
                    return;
                }
                var data = {
                    cashflow: result.data.cashflow
                };
                Utils.convertGridEnablestateToShow(data.cashflow.rows);
                //手动将下拉项itemtype翻译
                let typeValue = data.cashflow.rows[0].values.itemtype.value
                if (typeValue) {
                    if (data.cashflow.rows[0].values.ismain.value) {
                        data.cashflow.rows[0].values.itemtype.display = typeValue == 1 ? this.lang['10140CASHFLOW-005002'] : this.lang['10140CASHFLOW-005003']
                    } else {
                        data.cashflow.rows[0].values.itemtype.display = typeValue == 1 ? this.lang['10140CASHFLOW-005004'] : this.lang['10140CASHFLOW-005005']
                    }
                }
                this.props.form.setAllFormValue(data);
                this.props.form.setFormItemsDisabled('cashflow', { enablestate: false });
                setTimeout(() => {
                    callback && callback();
                }, 0);


            }
        });
    }

    onAdd = (node) => {
        let chooesedKeys = [node.id]
        this.state.tree.selectedKeys=chooesedKeys
        this.setState(this.state,()=>{
            if (this.config.nodetype == 'org' && (!this.state.org.value || !this.state.org.value.refpk)) {
                toast({ content: this.lang['10140CASHFLOW-000034'], color: 'warning' });/* 国际化处理： 请选择组织*/
                return;
            }
            let flag = node.nodeData && node.nodeData.ismain
            //根节点添加主表项目默认勾选
            if (node.key === 'root') {
                flag = true
            }
            this.setCashFlowType(flag, () => {

                var preadd = () => {
                    this.state.editMode = true;
                    this.setState(this.state, () => {
                        let data = this.props.form.getAllFormValue('cashflow');
                        Utils.convertGridEnablestateToSave(data.rows);
                        this.props.form.EmptyAllFormValue('cashflow')
                        this.props.form.setFormStatus('cashflow', 'add');
                        var meta = this.props.meta.getMeta();
                        Utils.mergeData(data.rows[0].values, meta.cashflow.items);
                        debugger;
                        Utils.filterEmptyData(data.rows[0].values);
                        this.props.form.setAllFormValue({'cashflow':data});
                        this.props.form.setFormItemsDisabled('cashflow', { enablestate: true, ismain: node.key != 'root' });

                        this.props.form.setFormItemsValue('cashflow', { ismain: { value: node.key === 'root' ? true : node.nodeData.ismain } });
                        this.updateBtnStatus();
                    });
                };
                this.loadFormData({ pid: node.id, callback: preadd });
            });
        })
    }

    onEdit = (node) => {
        let chooesedKeys = [node.id]
        this.state.tree.selectedKeys=chooesedKeys
        this.setState(this.state,()=>{
            if (node.nodeData.votype !== this.config.nodetype) {
                toast({ content: this.config.nodetypename + this.lang['10140CASHFLOW-000035'] + this.config.nodetypename + this.lang['10140CASHFLOW-000036'], color: 'warning' });/* 国际化处理： 节点只能修改,数据*/
                return;
            }
            this.setCashFlowType(node.nodeData && node.nodeData.ismain, () => {

                var preedit = () => {
                    this.state.editMode = true;
                    this.setState(this.state, () => {
                        let data = this.props.form.getAllFormValue('cashflow');
                        Utils.convertGridEnablestateToSave(data.rows);
                        this.props.form.setAllFormValue({'cashflow':data});
                        this.props.form.setFormItemsDisabled('cashflow', { enablestate: true, ismain: true });  //冗余代码 以后调整
                        this.props.form.setFormStatus('cashflow', 'edit');
                        this.updateBtnStatus();
                    });
                };
                this.loadFormData({ id: node.id, callback: preedit });

            });
        })

    }
    /**
     * 根据ismain 设置下拉选项
     * @param ismain:
     *               true  itemtype：现金流入  现金流出
     *               false itemtype：贷方  借方
     * @param callback 执行onAdd和onEdit的后续逻辑
     */
    setCashFlowType = (ismain, callback) => {
        this.props.meta.getMeta()['cashflow'].items.find(item => {
            if (item.attrcode == 'itemtype') {
                //现金流量项目类型 字段
                item.options = [{ display: '', value: '' }, { display: ismain ? this.lang['10140CASHFLOW-005002'] : this.lang['10140CASHFLOW-005004'], value: '1' }, { display: ismain ? this.lang['10140CASHFLOW-005003'] : this.lang['10140CASHFLOW-005005'], value: '2' }];
            }
        })
        this.props.meta.setMeta(this.props.meta.getMeta(), callback);
    }
    save(callback) {
        var formData = this.props.form.getAllFormValue('cashflow');
        formData.areacode = 'cashflow';
        let validateData = {
            pageid: this.props.config.pagecode,
            model: formData
        }
        if (!this.props.form.isCheckNow('cashflow')) {
            return;
        }
        var cloneObj = Utils.clone(formData);
        this.props.validateToSave(validateData, () => {
            ajax({
                url: '/nccloud/uapbd/cashflow/CashflowEditAction.do',
                data: {
                    model: {
                        rows: [{
                            values: cloneObj.rows[0].values,
                            rowid: 0
                        }]
                    },
                    pageid: this.config.pagecode
                },
                success: (result) => {
                    callback && callback(result.data);
                }
            });
        }, { 'cashflow': 'form' }, 'form')

    }
    onSave(callback) {
        this.save(data => {
            toast({ title: this.lang['10140CASHFLOW-000037'], color: 'success' });/* 国际化处理： 保存成功*/
            this.state.tree.selectedKeys = [data.cashflow.rows[0].values.pk_cashflow.value];
            this.loadTreeData(() => {
                this.loadFormData({
                    id: data.cashflow.rows[0].values.pk_cashflow.value, callback: () => {
                        this.props.form.setFormStatus('cashflow', 'browse');
                        this.state.editMode = false;
                        this.setState(this.state, () => {
                            this.updateBtnStatus();
                        });
                    }
                });
            });
        });
    }

    onSaveAdd() {
        this.save((data) => {
            toast({ title: this.lang['10140CASHFLOW-000037'], color: 'success' });/* 国际化处理： 保存成功*/
            this.loadTreeData(() => {
                debugger;
                this.onAdd({
                    id: this.state.tree.selectedKeys[0],
                    key: this.state.tree.selectedKeys[0],
                    nodeData: {
                        ismain: data.cashflow.rows[0].values.ismain.value,
                    }
                });
            });
        });
    }

    onDelete(node) {
        if (node.nodeData.votype !== this.config.nodetype) {
            toast({ content: this.config.nodetypename + this.lang['10140CASHFLOW-000035'] + this.config.nodetypename + this.lang['10140CASHFLOW-000036'], color: 'warning' });/* 国际化处理： 节点只能修改,数据*/
            return;
        }
        if (node.nodeData.votype !== this.config.nodetype) {
            toast({ content: this.config.nodetypename + this.lang['10140CASHFLOW-000038'], color: 'warning' });/* 国际化处理： 只能删除末级*/
            return;
        }

        var delHandler = () => {
            ajax({
                url: '/nccloud/uapbd/cashflow/CashflowDelAction.do',
                data: {
                    id: node.key
                },
                success: (result) => {
                    if (result.success) {
                        this.props.form.EmptyAllFormValue('cashflow');
                        this.props.form.setFormItemsDisabled('cashflow',{'enablestate':true});
                        this.loadTreeData();
                        toast({ title: this.lang['10140CASHFLOW-000022'], color: 'success' });/* 国际化处理： 删除成功！*/
                    }
                }
            });
        };
        if (node.key == this.state.tree.root.key) {
            toast({ content: this.lang['10140CASHFLOW-000040'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        // this.props.modal.show('modal',{
        promptBox({
            color: 'warning',
            title: this.lang['10140CASHFLOW-000023'],/* 国际化处理： 确认删除*/
            content: this.lang['10140CASHFLOW-000024'],/* 国际化处理： 是否确认要删除?*/
            beSureBtnClick: delHandler
        });
    }



    onFlush() {
        this.props.form.EmptyAllFormValue('cashflow');
        this.state.tree.selectedKeys = ['root'];
        this.state.tree.expandedKeys = ['root'];
        this.loadTreeData(() => {
            toast({ title: this.lang['10140CASHFLOW-003001'], color: 'success' });/* 国际化处理： 未设置管控模式*/
        });
        this.updateBtnStatus();
    }

    onCancel() {
        var handler = () => {
            this.state.editMode = false;
            this.setState(this.state, () => {
                this.loadFormData({
                    id: this.state.tree.selectedKeys[0]=="root"?undefined:this.state.tree.selectedKeys[0], callback: () => {
                        this.props.form.setFormStatus('cashflow', 'browse');
                        this.updateBtnStatus();
                    }
                });
            });
        };
        // this.props.modal.show('modal',{
        promptBox({
            color: "warning",
            title: this.lang['10140CASHFLOW-000025'],/* 国际化处理： 确认取消*/
            content: this.lang['10140CASHFLOW-000026'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: handler
        });

    }

    onSetMainItem() {

        if (this.state.tree.selectedNode) {
            if (this.state.tree.selectedNode.props.nodeData.votype !== this.config.nodetype) {
                toast({ content: this.config.nodetypename + this.lang['10140CASHFLOW-000035'] + this.config.nodetypename + this.lang['10140CASHFLOW-000036'], color: 'warning' });/* 国际化处理： 节点只能修改,数据*/
                return;
            }
            ajax({
                url: '/nccloud/uapbd/cashflow/EditMainitemAction.do',
                data: {
                    id: this.state.tree.selectedKeys[0]
                },
                success: (result) => {
                    if (result.success) {
                        this.loadTreeData();
                        this.loadFormData({ id: this.state.tree.selectedNode.props.nodeData.id });
                    }
                }
            });

        }
    }

    onAdjItem() {
        var bdselect = new BDselect([this.modeclassid]);
        bdselect.getModeByClassid(this.modeclassid, (mode) => {
            if (!mode || mode.length != 1) {
                toast({ content: this.lang['10140CASHFLOW-000043'], color: 'warning' });/* 国际化处理： 未设置管控模式*/
            }
            var md = mode[0].managemode,
                nodetype = this.config.nodetype
            debugger;
            if (nodetype == 'glb') {
                if (!(md == BDselect.SCOPE_GLOBE || md == BDselect.SCOPE_GLOBE_GROUP || md == BDselect.SCOPE_GLOBE_GROUP_ORG)) {
                    // toast({content : '现金流量项目档案的管控模式为全局、全局+集团或全局+集团+组织时，才能在全局节点设置调整项。',color : 'danger'});
                    this.calSelectModelTip(md);
                    return;
                }

            }
            if (nodetype == 'grp') {
                if (!(md == BDselect.SCOPE_GROUP || md == BDselect.SCOPE_GROUP_ORG)) {
                    //toast({content : '现金流量项目档案的管控模式为集团或集团+组织时，才能在集团节点设置调整项。',color : 'danger'});
                    this.calSelectModelTip(md);
                    return;
                }

            }
            if (nodetype == 'org') {
                if (!(md == BDselect.SCOPE_ORG)) {
                    //toast({content : '现金流量项目档案的管控模式为组织时，才能在组织节点设置调整项。',color : 'danger'});
                    this.calSelectModelTip(md);
                    return;
                }

            }
            this.state.ajditem.config.show = true;
            this.props.form.setFormStatus('cfadjitemset', 'edit');
            this.setState(this.state);

            ajax({
                url: '/nccloud/uapbd/cashflow/LoadAdjItemAction.do',
                data: {
                    ...this.config,
                    pkorg: this.state.org.value ? this.state.org.value.refpk : undefined
                },
                success: (result) => {
                    if (result.success) {
                        var from = this.props.form;
                        var data = {
                            cfadjitemset: result.data.cfadjitemset
                        };
                        from.setAllFormValue(data);
                    }
                }
            });
        });

    }

    calSelectModelTip(md) {
        if ((md == BDselect.SCOPE_GLOBE || md == BDselect.SCOPE_GLOBE_GROUP || md == BDselect.SCOPE_GLOBE_GROUP_ORG)) {
            toast({ content: this.lang['10140CASHFLOW-000044'], color: 'warning' });/* 国际化处理： 现金流量项目档案的管控模式为全局、全局+集团或全局+集团+组织时，只能在全局节点设置调整项。,现金流量项目档案的管控模式为全局,全局,集团或全局,集团,组织时,只能在全局节点设置调整项*/
            return;
        }
        if ((md == BDselect.SCOPE_GROUP || md == BDselect.SCOPE_GROUP_ORG)) {
            toast({ content: this.lang['10140CASHFLOW-000050'], color: 'warning' });/* 国际化处理： 现金流量项目档案的管控模式为集团或集团+组织时，只能在集团节点设置调整项。,现金流量项目档案的管控模式为集团或集团,组织时,只能在集团节点设置调整项*/
            return;
        }
        if ((md == BDselect.SCOPE_ORG)) {
            toast({ content: this.lang['10140CASHFLOW-000052'], color: 'warning' });/* 国际化处理： 现金流量项目档案的管控模式为组织时，只能在组织节点设置调整项。,现金流量项目档案的管控模式为组织时,只能在组织节点设置调整项*/
            return;
        }
    }

    onSaveAdjItem() {
        var formData = this.props.form.getAllFormValue('cfadjitemset');
        formData.areacode = 'cfadjitemset'
        let requestParam = {
            model: formData,
            pageid: this.config.pagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };
        this.props.form.isCheckNow('cfadjitemset') && this.props.validateToSave(requestParam, () => {
            ajax({
                url: '/nccloud/uapbd/cashflow/EditAdjItemAction.do',
                data: requestParam,
                success: (result) => {
                    this.state.ajditem.config.show = false;
                    this.setState(this.state);
                }
            });
        }, { 'cfadjitemset': 'form' }, 'form')

    }

    getBillVOScopeValue() {
        var formData = this.props.form.getAllFormValue('cashflow');
        var pk_org = formData.rows[0].values.pk_org.value,
            pk_group = formData.rows[0].values.pk_group.value;
        if (pk_org == pk_group)
            return 'grp';
        if (pk_org == 'GLOBLE00000000000000')
            return 'glb';
        return 'org';

    };

    onEnableState(enable = true) {
        if (this.config.nodetype != this.getBillVOScopeValue()) {
            var msgpx = '';
            if (this.config.nodetype == 'org')
                msgpx = '组织';
            if (this.config.nodetype == 'grp')
                msgpx = '集团';
            if (this.config.nodetype == 'glb')
                msgpx = '全局';

            toast({ content: msgpx + '节点只能修改' + msgpx + '数据', color: 'warning' });/* 国际化处理： 上级已停用，不能启用该现金流量项目,上级已停用,不能启用该现金流量项目*/
            return;
        };
        debugger;
        var formData = this.props.form.getAllFormValue('cashflow');
        formData.rows[0].values.enablestate.value = !enable;
        var pk = formData.rows[0].values.pk_parent.value;
        Utils.convertGridEnablestate(formData.rows);
        if (enable) { //checked parent
            var datas = this.state.tree.datas,
                parentstatus = undefined;
            var loop = (datas) => {
                datas.forEach(d => {
                    if (d.key == pk) {
                        parentstatus = d.nodeData.parentstatus;
                    }
                    var children = d.children;
                    loop(children);
                });
            };
            loop(datas);
            if (pk && parentstatus != '2') {
                toast({ content: this.lang['10140CASHFLOW-000054'], color: 'warning' });/* 国际化处理： 上级已停用，不能启用该现金流量项目,上级已停用,不能启用该现金流量项目*/
                return;
            }
        }
        ajax({
            url: enable ? '/nccloud/uapbd/cashflow/CashflowEnableAction.do' : '/nccloud/uapbd/cashflow/CashflowDisableAction.do',// : '/nccloud/uapbd/cashflow/EditMainitemAction.do',
            data: {
                model: {
                    rows: [{
                        values: formData.rows[0].values,
                        rowid: 0
                    }]
                },
                pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            },
            success: (result) => {
                if (result.success) {
                    this.loadTreeData();
                    this.loadFormData({ id: this.state.tree.selectedNode ? this.state.tree.selectedNode.props.nodeData.id : this.state.tree.selectedKeys[0]});
                    let ctips = (enable) ? this.lang["10140CASHFLOW-004001"] : this.lang["10140CASHFLOW-005001"];
                    toast({ title: ctips, color: 'success' });/* 国际化处理： 保存成功！*/
                }
            }
        });
    }

    onPrint(way) {
        // if(!this.state.tree.selectedKeys || this.state.tree.selectedKeys.length != 1){
        //     toast({content : "没有选中现金流量项目",color : 'danger'});
        //     return;
        // }
        // var formData = this.props.form.getAllFormValue('cashflow').rows[0].values,
        //     datapk = formData.pk_cashflow.value || undefined;

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
        debugger;
        if (way == 'print') {
            var param = {
                funcode: this.config.appcode,
                nodekey: 'cashflow',
                oids: pks
            };
            print('pdf', '/nccloud/uapbd/cashflow/CashflowPrintAction.do', param);
        } else {
            this.setState({ pks: pks }, this.refs.printOutput.open());
        }
    }


    render() {
        if (!this.lang) return '';
        const { syncTree, form, button, ncmodal, DragWidthCom ,BillHeadInfo} = this.props;
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        let { createModal } = ncmodal;  //模态框
        const {createBillHeadInfo} = BillHeadInfo;



        var viewCard = () => {
            return createForm('cashflow', {
                cancelPSwitch: true
                // onAfterEvent: this.onAfterFormEvent.bind(this)
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

                <NCModal {...this.state.ajditem.config} fieldid="cashflow">
                    <NCModal.Header>
                        <NCModal.Title>{this.lang['10140CASHFLOW-000056']/* 国际化处理： 调整项设置*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        {createForm('cfadjitemset', {})}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid = {button.key|| button.name} onClick={this.onSaveAdjItem.bind(this)} colors="primary">{this.lang['10140CASHFLOW-000058']/* 国际化处理： 确定*/}</NCButton>
                        <NCButton fieldid = {button.key|| button.name} onClick={() => { this.state.ajditem.config.show = false; this.setState(this.state); }} shape="border">{this.lang['10140CASHFLOW-000057']/* 国际化处理： 取消*/}</NCButton>
                    </NCModal.Footer>
                </NCModal>

                <AssignStepModal lang={this.lang} mainprops={this.props} maincfg={this.config} onFinish={this.onFinishAssign.bind(this)} ref={(assign) => this.assign = assign} />

                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/* {createPageIcon()} */}
                    {/* <div className="title">{this.config.title}</div> */}
                    <div className="title">
                        {createBillHeadInfo({
                            title : this.config.title,
                            initShowBackBtn:false
                        })}
                    </div>
                    {this.config.nodetype !== 'org' ? '' : <div className="search-box"> {Org({ ...this.state.org, disabled: this.state.editMode,fieldid:'org_fieldid' })}</div>}
                    <span className="showOff">
                        <NCCheckbox {...this.state.showOff} disabled={this.state.editMode}>{this.lang['10140CASHFLOW-000059']/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </span>

                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'main',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="tree-card">
                    <DragWidthCom
                        leftDom={
                            <NCDiv areaCode={NCDiv.config.Tree}  fieldid = "synctree"  className="tree-area">
                                <div class="syncTreeCom syncTreeComLineStyle" id="accSchemeTree" style={{'min-width':'300px'}}>
                                    <div className="NC_syncTreeSearch">
                                        <NCFormControl {...searchRender} disabled={this.state.editMode} />
                                    </div>
                                    <NCDiv fieldid= 'cashflow' areaCode={NCDiv.config.TreeCom}  className="synctree-area" >
                                        <NCTree
                                            {...this.state.tree}>{
                                            this.renderNode({
                                                datas: [{ ...this.state.tree.root, children: this.state.tree.datas }],
                                                search: this.state.treesearch,
                                                onAdd: this.onAdd.bind(this),
                                                onEdit: this.onEdit.bind(this),
                                                onRemove: this.onDelete.bind(this),
                                                buttons: this.state.tree.buttons,
                                                editMode: this.state.editMode
                                            })}
                                        </NCTree>
                                    </NCDiv>
                                </div>
                            </NCDiv>
                        }
                        rightDom={<div className="card-area">{createForm('cashflow', {
                            cancelPSwitch: true,
                            onAfterEvent: this.onFormAfterHander.bind(this),
                            onBeforeEvent: this.onFormBeforeHander.bind(this)
                        })}</div>}
                        defLeftWid='25%' leftMinWid = '300px'/>
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={'/nccloud/uapbd/cashflow/CashflowPrintAction.do'}
                    data={{
                        funcode: this.config.appcode,
                        nodekey: 'cashflow',
                        oids: this.state.pks,
                        outputType: "output"
                    }}>
                </PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.props.config.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.props.config.appcode}
                    pagecode={this.props.config.pagecode}
                />
            </div>
        )
    }

    onFormBeforeHander(props, formid, itemname, value, data) {

        if (itemname == 'enablestate') {
            if (this.state.editMode)
                return false;
            var pk_org = data.pk_org.value;
            var pk_group = data.pk_group.value;
            var nodetype = this.config.nodetype;
            if ((nodetype == 'glb' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'grp' && pk_org != pk_group)) {
                //toast({ content: this.lang['10140CASHFLOW-000060'], color: "warning" });/* 国际化处理： 不能修改不再管控范围内的数据*/
                return false;
            }
            // else{
            //     promptBox({
            //         color:"warning",
            //         title: !value.value ?this.lang['10140CASHFLOW-000027']:this.lang['10140CASHFLOW-000028'],/* 国际化处理： 确认启用,确认停用*/
            //         content: !value.value ?this.lang['10140CASHFLOW-000029']:this.lang['10140CASHFLOW-000030'],/* 国际化处理： 是否确认要启用?,是否确认要停用?*/
            //         beSureBtnClick:()=>{
            //            this.onEnableState(!value.value)
            //         }
            //     });
            //     return false;
            // }

        }

        return true;
    }


    onFormAfterHander(props, formid, itemname, newValue, oldValue, data) {
        if (itemname == 'pk_parent') {
            if (!newValue.value)
                return true;
            if (data.values.ismain.value == 'N') {
                this.props.form.setFormItemsDisabled('cashflow', { enablestate: true, ismain: false });  //冗余代码 以后调整
            } else if (data.values.ismain.value == 'Y') {
                this.props.form.setFormItemsDisabled('cashflow', { enablestate: true, ismain: true });  //冗余代码 以后调整
            } else {
                toast({ content: this.lang['10140CASHFLOW-000063'], color: "warning" });/* 国际化处理： 参照数据不能确定主表项目的值*/
            }
        }
        if (itemname == 'enablestate') {
            var formData = this.props.form.getAllFormValue('cashflow');
            var pk_org = formData.rows[0].values.pk_org.value;
            var pk_group = formData.rows[0].values.pk_group.value;
            var nodetype = this.config.nodetype;
            var oldV = oldValue.value;
            promptBox({
                color: "warning",
                title: newValue.value ? this.lang['10140CASHFLOW-000027'] : this.lang['10140CASHFLOW-000028'],
                content: newValue.value ? this.lang['10140CASHFLOW-000029'] : this.lang['10140CASHFLOW-000030'],
                beSureBtnClick: () => {
                    this.onEnableState(newValue.value)
                },
                cancelBtnClick: () => {
                    props.form.setFormItemsValue('cashflow', { 'enablestate': { value: oldV, display: null } });
                }
            });
        }
        if (itemname == 'ismain') {
            this.setCashFlowType(data)
        }
        return true;
    }

}
export default Cashflow;

//FACbGhvKrJeCEGAjqwRh8EDYfyIqQuwAJZzRQQIY25w/njeFgnUHz3LW5SE7v7Ib