//aYkBVHfTt2ZRWDnZP/YgF/cfJcygP2ruJCvJpHp19fSLIUNyPYTSBby2yQC0gx44
import React, { Component } from 'react';
import { createPageIcon,createPage, base, ajax, toast, print, high, getBusinessInfo, promptBox, excelImportconfig } from 'nc-lightapp-front';
let businessInfo = getBusinessInfo();
const { PrintOutput } = high;
import Utils from '../../../public/utils/index.js';
import './index.less';
// 引入公共样式
import '../../../public/uapbdstyle/uapbd_style_common.less'
const {ExcelImport}=high;
let { NCTable, NCSelect, NCTabs, NCCheckbox, NCCol, NCRow, NCModal, NCCollapse, NCIcon, NCFormControl, NCPopconfirm,NCDiv,NCTree } = base;
import {component} from '../../../public/platwapper/index.js';
const {NCButton } = component;
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

class Inoutbusiclass extends Component {

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
        var operation = function (operation, item, pitem) {
            return function (event) {
                event.stopPropagation();
                return cfg[operation](item, pitem);
            };
        };
        var renderTreeTitle = (item, pitem) => {
            var isInScope = () => {
                return item.nodeData.votype == this.config.nodetype;
            };
            let isExpand = this.state.tree.expandedKeys.includes(item.key);
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
            let titleAdd = cfg.buttons.indexOf('add') == -1 ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-zengjia add-icon" onClick={operation('onAdd', item, pitem)}></i>;
            let titleEdit = cfg.buttons.indexOf('edit') == -1 || !pitem || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-bianji edit-icon" onClick={operation('onEdit', item, pitem)}></i>;
            let titleRemove = cfg.buttons.indexOf('delete') == -1 || !pitem || item.children.length != 0 || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-shanchu delete-icon" onClick={operation('onRemove', item, pitem)}></i>;
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
                    liAttr={{fieldid:(item.code || item.key)+"_node"}}
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
        var editMode = this.state.editMode ? true : false;
        var isSelect = this.state.tree.selectedKeys.length == 1 && this.state.tree.selectedKeys[0] != 'root';
        var firstLayNode = isSelect && this.state.tree.selectedNode && this.state.tree.selectedNode.props.nodeData.pid == 'root';
        var enabled = true;
        enabled = this.props.form.getFormItemsValue('inoutBusiClass', 'enablestate');
        var pk_inoutbusiclass = this.props.form.getFormItemsValue('inoutBusiClass', 'pk_inoutbusiclass');
        //设置可以显示的按钮
        this.props.button.setDisabled({
            save: !editMode,
            saveadd: !(editMode),
            cancel: !editMode,
            group_print: editMode,
            print: editMode || !isSelect,
            output: editMode || !isSelect,
            refresh: editMode,
            enable: editMode || !isSelect,
            disable: editMode || !isSelect,
            assign: editMode,
            unassign: editMode
        });

        this.props.button.setButtonsVisible({
            save: editMode,
            saveadd: editMode && (!pk_inoutbusiclass.value || pk_inoutbusiclass.value.length == 0),
            cancel: editMode,
            group_print: !editMode,
            refresh: !editMode,
            adjustItem: !editMode,
            mainItem: !editMode,
            enable: !editMode,
            disable: !editMode,
            assign: !editMode,
            unassign: !editMode,
            print: !editMode,
            import: !editMode,
            export: !editMode
        });
        this.props.form.setFormItemsDisabled('inoutBusiClass', { enablestate: editMode || (!pk_inoutbusiclass || !pk_inoutbusiclass.value || pk_inoutbusiclass.value.length == 0) });

    }
    onBtnOperation(props, id) {
        switch (id.toLowerCase()) {
            case 'cancel':
                this.onCancel();
                break;
            case 'save':
                this.onSave();
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
               this.setState({

                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'output':
                this.onPrint('output');
                break;


        }
    }
    constructor(props) {
        super(props);
        this.config = props.config;

        //init template button
        createUIDom(props)(createUIDomParam(this.props.config.pagecode, this.props.config.appcode), { moduleId: "10140INOUTBUSICLASS", domainName: 'uapbd' }, (data, lang) => {
            this.lang = lang;
            this.config.title = lang[this.config.title];
            this.state = this.createState();
            this.state.tree.buttons = (data && data.button ? data.button : []).map(b => b.key);
            this.setState(this.state, () => {
                data.template.inoutBusiClass.items.forEach(item => {
                    if (item.attrcode == 'pk_parent') {
                        //item.refcode = 'uapbd/refer/fiacc/CashflowTreeRef/index.js';
                        item.queryCondition = () => {
                            let pk_org = null;
                            if (this.props.config.nodetype == 'glb') {
                                pk_org = 'GLOBLE00000000000000';
                            } else if (this.props.config.nodetype == 'grp') {
                                pk_org = businessInfo.groupId;
                            }
                            return { pk_org: pk_org }
                        }
                        item.isDataPowerEnable = false;
                    }
                });
                props.meta.setMeta(data && data.template ? data.template : {});
                let excelimportconfig = excelImportconfig(props,'uapbd',this.props.config.billType,true,'',{'appcode':this.props.config.appcode , 'pagecode':this.props.config.pagecode},()=>{this.loadTreeData()});
				props.button.setUploadConfig("import",excelimportconfig);
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
                fieldid:'orgunit',
                queryCondition: () => {//组织权限
                    return {
                        AppCode: this.config.appcode || '',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                },
                onChange: (val) => {
                    this.state.org.value = val;
                    this.setState(this.state, () => {
                        this.loadTreeData(() => {
                            this.state.tree = {
                                ...this.state.tree,
                                selectedKeys: [],
                                selectedNode: undefined
                            };
                            this.setState(this.state, () => {
                                var meta = this.props.meta.getMeta();
                                meta.inoutBusiClass.items.forEach(item => {
                                    if (item.attrcode == 'pk_parent') {
                                        item.queryCondition = () => {
                                            let pk_org = this.state.org.value.refpk;
                                            if (this.props.config.nodetype == 'glb') {
                                                pk_org = 'GLOBLE00000000000000'
                                            } else if (this.props.config.nodetype == 'grp') {
                                                pk_org = businessInfo.groupId;
                                            }
                                            return { pk_org: pk_org }
                                        }
                                    }
                                });
                                this.props.meta.setMeta(meta);
                                this.props.form.EmptyAllFormValue('inoutBusiClass');
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
                            child.needShow = expand ? true : (child.nodeData.code.indexOf(textValue) != -1 || child.title.indexOf(textValue) != -1 ? true : false);
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
                    title: this.lang['INOUTBUSICLASS-000010'],/* 国际化处理： 收支项目*/
                    code:this.lang['INOUTBUSICLASS-000010'],/* 国际化处理： 收支项目*/
                    key: 'root',
                    id: 'root',
                    nodeData: {
                        code: ''
                    }
                },
                fieldid:'synctree',
                //defaultExpandAll: true,
                datas: [],
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
                        this.loadFormData({ id: e.node.props.nodeData.id });
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

    onFinishAssign(continueBack) {
        var doWay = this.doWay,
            pkorgs = this.assign.getOrgData(),
            pkinoutbusiclasss = this.assign.getInoutbusiclassData();
        //应测试要求，此处取消分配不再提示
        var  handler = () =>{
        ajax({
            url: doWay == 'do' ? '/nccloud/uapbd/inoutbusiclass/InoutbusiclassAssignAction.do' : '/nccloud/uapbd/inoutbusiclass/UnInoutbusiclassAssignAction.do',
            data: {
                pkorgs: pkorgs,
                pkinoutbusiclasss: pkinoutbusiclasss
            },
            success: (res) => {
                toast({ title: doWay == 'do' ? this.lang['INOUTBUSICLASS-000033'] : this.lang['INOUTBUSICLASS-000034'], color: 'success' });/* 国际化处理： 分配成功!,取消分配成功,分配成功*/
                this.assign.cancel();
                if (continueBack) {
                    this.setState(this.state, () => {
                        this.onAssign(this.doWay);
                    });
                }
            }
        });
        };
        if(doWay=='do'){
            handler()
        }else{
            //取消分配需要校验
            ajax({
                url:"/nccloud/uapbd/inoutbusiclass/UnAssignCheckChildAction.do",
                data:{pkorgs: pkorgs,
                    pkinoutbusiclasss: pkinoutbusiclasss},
                success:(res)=>{
                    if(res.data){
                        if(res.data.needCheck=='Y'){
                            promptBox({
                                color: 'warning',               
                                title: this.lang['INOUTBUSICLASS-003002'],                // 询问
                                content: this.lang['INOUTBUSICLASS-003003'],             // 待取消的项目中部分数据存在下级组织级数据已无法取消，是否继续取消其他的项目
                                noCancelBtn: false,            
                                beSureBtnClick: ()=>{
                                    handler()
                                },
                                cancelBtnClick: ()=>{
                                    this.assign.cancel()
                                }
                            })
                        }
                    }else{
                        handler()
                    }

                }
            })
        }
        // if(doWay  == 'undo'){
        //     // this.props.modal.show('modal',{
        //     promptBox({
        //         color:"warning",
        //         title: this.lang['INOUTBUSICLASS-000021'],/* 国际化处理： 确认取消*/
        //         content: this.lang['INOUTBUSICLASS-000035'],/* 国际化处理： 是否确认要取消?,是否确认要取消*/
        //         beSureBtnClick:handler,
        //         cancelBtnClick:()=>{}
        //      });
        // }else{
        //     handler();
        // }



    }

    loadTreeData(callback) {
        if (this.config.nodetype == 'org' && !this.state.org.value) {
            return;
        }
        ajax({
            url: '/nccloud/uapbd/inoutbusiclass/InoutbusiclassTreeAction.do',
            data: {
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
        if (!id && !pid) {
            this.props.form.EmptyAllFormValue('inoutBusiClass');
            setTimeout(() => {
                callback();
            }, 0);

            return;
        }
        ajax({
            url: '/nccloud/uapbd/inoutbusiclass/InoutbusiclassLoadAction.do',
            data: {
                id: id,
                pid: pid,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                ...this.config
            },
            success: (result) => {
                var data = {
                    inoutBusiClass: result.data.formData.inoutBusiClass
                };
                Utils.convertGridEnablestateToShow(data.inoutBusiClass.rows);
                this.props.form.setAllFormValue(data);
                this.props.form.setFormItemsDisabled('inoutBusiClass', { enablestate: false });
                this.props.form.setFormItemsDisabled('inoutBusiClass', { code: !result.data.isCodeEdit });
                setTimeout(() => {
                    callback && callback();
                }, 0);
            }
        });
    }

    onAdd(node) {
        let chooesedKeys = [node.id]
        this.state.tree.selectedKeys=chooesedKeys
        this.setState(this.state)
        if (this.config.nodetype == 'org' && (!this.state.org.value || !this.state.org.value.refpk)) {
            toast({ content: this.lang['INOUTBUSICLASS-000036'], color: 'warning' });/* 国际化处理： 请选择组织*/
            return;
        }
        var preadd = () => {
            this.state.editMode = true;
            this.setState(this.state, () => {
                let data = this.props.form.getAllFormValue('inoutBusiClass');
                Utils.convertGridEnablestateToSave(data.rows);
                this.props.form.setFormStatus('inoutBusiClass', 'add');
                var meta = this.props.meta.getMeta();
                Utils.mergeData(data.rows[0].values, meta.inoutBusiClass.items);

                this.props.form.setAllFormValue({ 'inoutBusiClass': data });
                this.props.form.setFormItemsDisabled('inoutBusiClass', { enablestate: true });
               
                this.updateBtnStatus();
            });
        };
        this.loadFormData({ pid: node.id, callback: preadd });
    }

    onEdit(node) {
        let chooesedKeys = [node.id]
        this.state.tree.selectedKeys=chooesedKeys
        this.setState(this.state)
        var preedit = () => {
            this.state.editMode = true;
            this.setState(this.state, () => {
                let data = this.props.form.getAllFormValue('inoutBusiClass');
                Utils.convertGridEnablestateToSave(data.rows);
                this.props.form.setAllFormValue({ 'inoutBusiClass': data });
                this.props.form.setFormItemsDisabled('inoutBusiClass', { enablestate: true });  //冗余代码 以后调整
                this.props.form.setFormStatus('inoutBusiClass', 'edit');
                this.updateBtnStatus();
            });
        };
        this.loadFormData({ id: node.id, callback: preedit });
    }


    save(callback) {
        var formData = this.props.form.getAllFormValue('inoutBusiClass');
        formData.areacode = 'inoutBusiClass'
        let validateData = {
            pageid: this.props.config.pagecode,
            model: formData
        }
        var cloneObj = Utils.clone(formData),
            datapk = cloneObj.rows[0].values.pk_inoutbusiclass.value || undefined;
        if (!this.props.form.isCheckNow('inoutBusiClass')) {
            return;
        }

        this.props.validateToSave(validateData, () => {
            ajax({
                url: '/nccloud/uapbd/inoutbusiclass/InoutbusiclassEditAction.do',
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
        }, { 'inoutBusiClass': 'form' }, 'form')

    }

    onSave() {
        this.save((data) => {
            toast({ title: this.lang['INOUTBUSICLASS-000022'], color: 'success' });/* 国际化处理： 保存成功！*/
            this.props.form.setFormStatus('inoutBusiClass', 'browse');
            setTimeout(() => {
                this.loadTreeData(() => {
                    this.loadFormData({
                        id: data.inoutBusiClass.rows[0].values.pk_inoutbusiclass.value, callback: () => {
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
        this.save((data) => {
            this.loadTreeData(() => {
                this.onAdd({
                    id: this.state.tree.selectedKeys[0],
                    key: this.state.tree.selectedKeys[0]
                });
            });
        });
    }

    onDelete(node) {
        var delHandler = () => {
            ajax({
                url: '/nccloud/uapbd/inoutbusiclass/InoutbusiclassDelAction.do',
                data: {
                    id: node.key
                },
                success: (result) => {
                    if (result.success) {
                        this.props.form.EmptyAllFormValue('inoutBusiClass');
                        this.loadTreeData();
                        toast({ title: this.lang['INOUTBUSICLASS-000023'], color: 'success' });/* 国际化处理： 删除成功！*/
                    }
                }
            });
        };
        if (node.key == this.state.tree.root.key) {
            toast({ content: this.lang['INOUTBUSICLASS-000039'], color: 'warning' });/* 国际化处理： 根节点不能删除*/
            return;
        }
        // this.props.modal.show('modal',{
        promptBox({
            color: 'warning',
            title: this.lang['INOUTBUSICLASS-000024'],/* 国际化处理： 删除*/
            content: this.lang['INOUTBUSICLASS-000025'],/* 国际化处理： 确定要删除吗？*/
            beSureBtnClick: delHandler
        });
    }



    onFlush() {
        this.props.form.EmptyAllFormValue('inoutBusiClass');
        this.state.tree.selectedKeys = ['root'];
        this.state.tree.expandedKeys = ['root'];
        this.loadTreeData(() => {
            this.setState(this.state, () => {
                toast({ title: this.lang['INOUTBUSICLASS-000041'], color: 'success' });/* 国际化处理： 刷新成功*/
            });
        });
        this.updateBtnStatus();
    }

    onCancel() {

        var hander = () => {
            let pkValue = this.props.form.getFormItemsValue('inoutBusiClass', 'pk_inoutbusiclass').value;
            let codeValue = this.props.form.getFormItemsValue('inoutBusiClass', 'code').value;

            this.state.editMode = false;
            this.setState(this.state, () => {
                this.loadFormData({
                    id: this.state.tree.selectedKeys[0]=="root"?undefined:this.state.tree.selectedKeys[0] ,callback: () => {
                        this.props.form.setFormStatus('inoutBusiClass', 'browse');
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
                url: '/nccloud/uapbd/inoutbusiclass/InoutbusiclassRollBackCodeAction.do',
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
            title: this.lang['INOUTBUSICLASS-000021'],/* 国际化处理： 确认取消*/
            content: this.lang['INOUTBUSICLASS-000026'],/* 国际化处理： 您确定要取消编辑吗?*/
            beSureBtnClick: hander
        });
    }

    onEnableState(enable = true) {
        var formData = this.props.form.getAllFormValue('inoutBusiClass');
        formData.rows[0].values.enablestate.value = !enable;
        Utils.convertGridEnablestate(formData.rows);
        ajax({
            url: enable ? '/nccloud/uapbd/inoutbusiclass/InoutbusiclassEnableAction.do' : '/nccloud/uapbd/inoutbusiclass/InoutbusiclassDisableAction.do',// : '/nccloud/uapbd/cashflow/EditMainitemAction.do',
            data: {
                pk_inoutbusiclass: formData.rows[0].values.pk_inoutbusiclass.value,
                pageid: this.config.pagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            },
            success: (result) => {
                toast({ title: !enable ? this.lang['INOUTBUSICLASS-000027'] : this.lang['INOUTBUSICLASS-000028'], color: 'success' });/* 国际化处理： 停用成功！,启用成功！*/
                if (result.success) {
                    this.loadTreeData(() => {
                        this.state.tree.selectedKeys = [];
                        this.setState(this.state, () => {
                            if (enable) {
                                this.loadFormData({ id: formData.rows[0].values.pk_inoutbusiclass.value });
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
                funcode: '10140IOIB',
                nodekey: 'inoutBusiClass',
                oids: pks
            };
            print('pdf', '/nccloud/uapbd/inoutbusiclass/InoutbusiclassPrintAction.do', param);
        } else {
            this.setState({ pks: pks }, this.refs.printOutput.open());
        }
    }
    render() {
        if (!this.lang)
            return '';
        const { syncTree, form, button, ncmodal, DragWidthCom,BillHeadInfo } = this.props;
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        let { createModal } = ncmodal;  //模态框
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮

        var viewCard = () => {
            return createForm('inoutBusiClass', {
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
                <NCDiv areaCode={NCDiv.config.HEADER} className="header">
                {/*createPageIcon()*/}
                    <div className="title" fieldid={this.config.title+"_title"} >
                        {createBillHeadInfo({ 
                            title:this.config.title,
                            initShowBackBtn:false
                        })}
                    </div>
                    {this.config.nodetype !== 'org' ? '' : <div className="search-box"> {Org({ ...this.state.org, disabled: this.state.editMode })}</div>}
                    <span className="showOff">
                        <NCCheckbox {...this.state.showOff} disabled={this.state.editMode} >{this.lang['INOUTBUSICLASS-000045']/* 国际化处理： 显示停用*/}</NCCheckbox>
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
                            <div className="tree-area">
                                <NCDiv fieldid="inoutbusi" areaCode={NCDiv.config.TREE} class="syncTreeCom-my-style syncTreeCom syncTreeComLineStyle" id="accSchemeTree">
                                    <div className="NC_syncTreeSearch NC_syncTreeSearch_self_width">
                                        <NCFormControl {...searchRender} />
                                    </div>
                                    <NCDiv fieldid= 'synctree' areaCode={NCDiv.config.TreeCom} className="synctree-area">
                                        <NCTree
                                            closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}
                                            openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}
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
                        rightDom={<div className="card-area">{viewCard()}</div>} defLeftWid='280px' />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={'/nccloud/uapbd/inoutbusiclass/InoutbusiclassPrintAction.do'}
                    data={{
                        funcode: this.props.config.appcode,
                        nodekey: 'inoutBusiClass',
                        oids: this.state.tree.selectedKeys,
                        outputType: "output"
                    }}
                >
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
        );
    }

    onFormBeforeHander(props, formid, itemname, value, data) {
        if (itemname == 'enablestate') {
            if (!data.pk_inoutbusiclass.value || data.pk_inoutbusiclass.value == '')
                return false;
            if (this.state.editMode == true)
                return false;
            var pk_org = data.pk_org.value;
            var pk_group = data.pk_group.value;
            var nodetype = this.config.nodetype;
            if ((nodetype == 'glb' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'grp' && pk_org != pk_group) || (nodetype == 'org' && pk_org != (this.state.org.value ? this.state.org.value.refpk : ''))) {
                toast({ content: this.lang['INOUTBUSICLASS-000046'], color: "warning" });/* 国际化处理： 不能修改不再管控范围内的数据*/
                return false;
            }

        }
        return true;
    }

    onFormAfterHander(props, formid, itemname, newValue, oldValue, data) {
        if (itemname == 'enablestate') {
            var formData = this.props.form.getAllFormValue('inoutBusiClass');
            var pk_org = formData.rows[0].values.pk_org.value;
            var pk_group = formData.rows[0].values.pk_group.value;
            promptBox({
                color: "warning",
                title: newValue.value ? this.lang['INOUTBUSICLASS-000029'] : this.lang['INOUTBUSICLASS-000030'],/* 国际化处理： 确认启用,确认停用*/
                content: newValue.value ? this.lang['INOUTBUSICLASS-000031'] : this.lang['INOUTBUSICLASS-000032'],/* 国际化处理： 是否确认要启用?,是否确认要停用?*/
                beSureBtnClick: () => {
                    this.onEnableState(newValue.value)
                },
                cancelBtnClick: () => {
                    props.form.setFormItemsValue('inoutBusiClass', { 'enablestate': { value: oldValue.value, display: null } });
                }
            });
        }


        // if(itemname == 'enablestate'){
        //     var formData = this.props.form.getAllFormValue('inoutBusiClass');
        //     var pk_org = formData.rows[0].values.pk_org.value;
        //     var pk_group = formData.rows[0].values.pk_group.value;
        //     var nodetype = this.config.nodetype;
        //     if((nodetype == 'glb' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'grp' && pk_org != pk_group)  || (nodetype == 'org' && pk_org != (this.state.org.value ? this.state.org.value.refpk : '')  ) ){
        //         toast({content : '不能修改不再管控范围内的数据', color:"warning"});
        //         var oldV = oldValue.value;
        //         props.form.setFormItemsValue('inoutBusiClass',{'enablestate':{value:oldV,display:null}});
        //         return;
        //     }

        //     var oldV = oldValue.value;
        //     // this.props.modal.show('modal',{
        //     promptBox({
        //         color:"warning",
        //         title: newValue.value ?"确认启用":"确认停用",
        //         content: newValue.value ?"是否确认要启用?":'您确定要停用所选数据及其所有下级数据吗?',
        //         beSureBtnClick:()=>{
        //            this.onEnableState(newValue.value)
        //         },
        //         cancelBtnClick:()=>{
        //             props.form.setFormItemsValue('inoutBusiClass',{'enablestate':{value:oldV,display:null}});
        //         }
        //     });
        // }
        return true;
    }
}
export default Inoutbusiclass;

//aYkBVHfTt2ZRWDnZP/YgF/cfJcygP2ruJCvJpHp19fSLIUNyPYTSBby2yQC0gx44