//v4ZTAApAQgVtFynMWoMUipHk1ZJGyqjySrBOAB7b6Jie9OxA3atQFKI3kIxvzReE
import React, { Component } from 'react';
import { createPage, base,ajax,toast,promptBox,print ,high,createPageIcon, deepClone} from 'nc-lightapp-front';
import './index.less';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCllapse,NCTree,NCIcon,NCFormControl,NCDatePicker, EmptyAreaTip} = base;
const { PrintOutput } = high;
import { Table,Record } from '../../../public/excomponents';
import RefAccSystem from '../../../refer/fiacc/AccSystemGridRef/index.js';
import RefAccChart from '../../../refer/fiacc/AccChartTreeRef/index.js'
import RefCtrlRule from '../../../refer/fiacc/AccCtrlRuleGridRef/index.js';
import AssignAccountBook from './AssignAccountBook.js';
import AssignControlOrg from './AssignControlOrg.js';
import AssignAccItem from './AssignAccItem.js';
import AssignStepModal from '../assign/AssignStepModal.js'
//import RefOrg from '../../../refer/org/FinanceOrgAllDataTreeRef/index.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import RefOrg from '../../../refer/org/FinanceOrgTreeRef/index.js';
import HeaderArea from '../../../public/pubComponent/HeaderArea';

var EMPTY_FN = function(){};
var createUIDomParam = function(pagecode, appcode){
    var param  = {
        pagecode:pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? {...param, appcode: appcode} : param;
};

class Accitemtable extends Component {

    componentDidUpdate(){
        if(this.state.chartEdit || this.state.ctrlEdit || this.state.accmapEdit || this.state.version.config.show){
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{
            window.onbeforeunload = null;
        }
    }

    updateBtnStatus(){
        var {refOrg, refSystem, charttree, tab, charttree, ctrltree} = this.state;
        var chartEdit = this.state.chartEdit,
            ctrlEdit = this.state.ctrlEdit,
            accmapEdit = this.state.accmapEdit,
            refChartVersion = this.state.refChartVersion,
            accmap = this.state.accmap,
            tab = tab.activeKey,
            chartSelect = charttree.selectedKeys && charttree.selectedKeys.length == 1  && this.state.charttree.selectedKeys [0] != 'root';


        //设置可以显示的按钮
        this.props.button.setDisabled({
            chart_save:   !(tab == 'chart' && chartEdit),
            chart_cancel: !(tab == 'chart' && chartEdit),
            chart_refresh : !(tab === 'chart' && !chartEdit),
            chart_addv:   !(tab === 'chart' && !chartEdit && chartSelect ),
            chart_deletev:  !(tab === 'chart' && !chartEdit && chartSelect ),
            chart_accmap: !(tab === 'chart' && !chartEdit && chartSelect && refChartVersion.value!=null),

            ctrl_save:    !(tab == 'ctrl' && ctrlEdit),
            ctrl_cancel:  !(tab == 'ctrl' && ctrlEdit),
            ctrl_refresh: !(tab == 'ctrl' && !ctrlEdit),
            ctrl_assign:  !(tab == 'ctrl' && !ctrlEdit),
            ctrl_unassign: !(tab == 'ctrl' && !ctrlEdit)
        });

        this.props.button.setButtonsVisible(['chart_save','chart_cancel','accchart_rule_add','accchart_book_add'], tab == 'chart' && chartEdit);
        this.props.button.setButtonsVisible(['ctrl_save','ctrl_cancel'],   tab == 'ctrl' && ctrlEdit);

        this.props.button.setButtonsVisible(['chart_refresh','chart_addv','chart_deletev','chart_accmap'], tab == 'chart' && !chartEdit);
        this.props.button.setButtonsVisible(['ctrl_refresh','ctrl_assign','ctrl_unassign','ctrlrule_account_add','ctrlrule_account_delete','ctrlrule_org_add','ctrlrule_org_delete'],   tab == 'ctrl' && !ctrlEdit);

        this.props.button.setDisabled({
            accmap_edit:!accmap.tempversionflag,
            accmap_check:!accmap.tempversionflag,
            accmap_validate:!accmap.tempversionflag,
            accmap_unvalidate:accmap.tempversionflag,
        })
        this.props.button.setButtonsVisible(['accmap_edit','accmap_check','accmap_validate','accmap_print','accmap_refresh'], !accmapEdit);
        this.props.button.setButtonsVisible(['accmap_save','accmap_cancel','accmap_automatch'], accmapEdit);
    }

    onBtnOperation(prop, btncode, areacode, opt){
        switch (btncode.toLowerCase()) {
            case 'chart_save':
                this.onSaveChart();
                break;
            case 'chart_cancel':
                this.cancelChart();
                break;
            case 'chart_addv':
                this.onAddVersion();
                break;
            case 'chart_deletev':
                this.onDeleteVersion();
                break;
            case 'chart_accmap':
                this.onaccmap();
                break;
            case 'chart_refresh':
                this.onChartRefresh();
                break;

            case 'ctrl_save':
                this.saveCtrl();
                break;
            case 'ctrl_cancel':
                this.cancelCtrl();
                break;
            case 'ctrl_refresh':
                this.onCtrlRefresh();
                break;


            case 'ctrl_assign':
                this.onAssign('assign');
                break;
            case 'ctrl_unassign':
                this.onAssign('unassign');
                break;

            case 'accchart_rule_add':
                this.addRowChartRule();
                break;
            case 'accchart_rule_delete':
                this.deleteRowChartRule(opt.index);
                break;
            case 'accchart_book_add':
                this.addRowChartBook();
                break;
            case 'accchart_book_delete':
                this.deleteRowChartBook(opt.index);
                break;

            case 'ctrlrule_account_add':
                this.addRowAccount();
                break;
            case 'ctrlrule_account_delete':
                this.deleteRowAccount();
                break;
            case 'ctrlrule_org_add':
                this.editCtrlOrg();
                break;
            case 'ctrlrule_org_delete':
                this.editCtrlOrg();
                break;

            case 'accmap_edit':
                this.state.accmapEdit = true;
                this.props.editTable.setStatus('accmap',"edit");
                this.updateBtnStatus();
                break;
            case 'accmap_save':
                this.saveAccmap();
                break;
            case 'accmap_cancel':
                promptBox({
                    color:"warning",
                    title:this.lang['ACCCHART-000023'],/* 国际化处理： 确认取消*/
                    content:this.lang['ACCCHART-000015'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        this.state.accmapEdit = false;
                        this.props.editTable.cancelEdit('accmap', this.updateBtnStatus());
                    },
                    cancelBtnClick:()=>{
                        return;
                    }
                })
                break;
            case 'accmap_check':
                this.state.check.ischeck = true;
                this.checkAccmap();
                break;
            case 'accmap_automatch':
                this.AccmapAutomatch();
                break;
            case 'accmap_validate':
                this.state.check.ischeck = false;
                this.checkAccmap();
                break;
            case 'accmap_unvalidate':
                this.AccmapUnValidate();
                break;
            case 'accmap_print':
                let printParam={
                    funcode: this.config.appcode,
                    nodekey: 'accoutmaplist',
                    outputType:'print'
                };
                this.AccmappintFunction(printParam);
                break;
            case 'accmap_output':
                let allDatas = this.props.editTable.getAllData("accmap");
                let pks = [];
                allDatas.rows.forEach((item,index)=>{
                    pks.push(item.values['pk_accmap'].value)
                })
                if(pks.length==0){
                    return
                }
                this.state.accmap.pks=pks
                this.setState(this.state,this.refs.printOutput.open())
                break;
                break;
            case 'accmap_refresh':
                this.onaccmap(()=>{toast({title:this.lang['ACCCHART-000084'],color:'success'})});
                break;
        }
    }

    initMeta(template, buttons){
        template['accchart'].items.forEach((item,key)=>{  //添加超链接
            if(item.attrcode == 'allgroup'){
                item.isMultiSelectedEnabled = true;
                //item.refcode = 'uapbd/fiacc/accitemtable/RefGroup/index.js';
            }
            if(item.attrcode == 'pk_accctrlrule'){
                item.queryCondition = () => {
                    return {
                        pk_accsystem:this.state.refSystem.value.refpk,
                        pk_org: this.config.nodetype =='org' ? this.state.refOrg.value.refpk: '',
                        nodetype: this.config.nodetype,
                        GridRefActionExt:'nccloud.web.uapbd.acctable.action.RefCondCtrlRule'
                    }
                };
            }
        });

        var chartRuleRowBtns = buttons.filter( btn =>  btn.area == 'accchart_rule_row').map( b => b.key);
        template['accchart_rule'].items.push({
            attrcode: 'opr',
            label: this.lang['ACCCHART-000034'],/* 国际化处理： 操作*/
            itemtype:'customer',
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                var buttonAry = this.state.chartEdit ? chartRuleRowBtns: [''];
                return this.props.button.createOprationButton(buttonAry, {
                    area: 'accchart_rule_row',
                    onButtonClick:(props, btncode) => {
                        this.onBtnOperation(props, btncode,'accchart_rule_row',{record, index});
                    }
                });
            }
        });
        var chartBookRowBtns = buttons.filter( btn =>  btn.area == 'accchart_book_row').map( b => b.key);
        template['accchart_book'].items.push({
            attrcode: 'opr',
            label: this.lang['ACCCHART-000034'],/* 国际化处理： 操作*/
            itemtype:'customer',
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                var buttonAry = this.state.chartEdit ? chartBookRowBtns: [''];
                return this.props.button.createOprationButton(buttonAry, {
                    area: 'accchart_book_row',
                    onButtonClick:(props, btncode) => {
                        this.onBtnOperation(props, btncode,'accchart_book_row',{record, index});
                    }
                });
            }
        });
        template['accmapsearch'].items.forEach((item,key)=>{  //添加超链接
            if(item.attrcode == 'pk_newaccount.pk_account.pk_acctype'){
                item.queryCondition=()=>{
                    return {
                        pk_accsystem:this.state.refSystem.value.refpk,
                        GridRefActionExt: 'nccloud.web.uapbd.acctable.action.AccTypeGridRefExt'
                    }
                }
            }
        });
        template['searchaccounthand'].items.forEach((item,key)=>{  //添加超链接
            if(item.attrcode == 'pk_acctype'){
                item.queryCondition=()=>{
                    return {
                        pk_accsystem:this.state.refSystem.value.refpk,
                        GridRefActionExt: 'nccloud.web.uapbd.acctable.action.AccTypeGridRefExt'
                    }
                }
            }
        });
        template['searchaccounthand2'].items.forEach((item,key)=>{  //添加超链接
            if(item.attrcode == 'pk_acctype'){
                item.queryCondition=()=>{
                    return {
                        pk_accsystem:this.state.refSystem.value.refpk,
                        GridRefActionExt: 'nccloud.web.uapbd.acctable.action.AccTypeGridRefExt'
                    }
                }
            }
        });
        template['accmap'].items.forEach((item,key)=>{  //添加超链接
            if(item.attrcode == 'pk_oldaccount'){
                item.refcode = 'uapbd/refer/fiacc/AccountGridRef/index.js';
                item.queryCondition=()=>{
                    return {
                        pk_accchart:this.state.charttree.selectedKeys[0],
                        pk_acctype:this.state.accmap.pk_acctype,
                        GridRefActionExt: 'nccloud.web.uapbd.acctable.action.AccountGridRefExt'
                    }
                }
            }
        });
    }
    constructor(props) {
        super(props);
        this.config = props.config;
        var me = this;
        this.accmapTemplate = {};
        //init template button
        createUIDom(props)({...createUIDomParam(this.props.config.pagecode, this.props.config.appcode)}, {  moduleId: "10140ACCCHART",domainName: 'uapbd'}, (data, lang)=> {
            this.lang = lang;
            this.config.title = this.lang[this.config.title];
            this.state = this.createState();
            this.accmapTemplate = deepClone(data.template.accmap); //原始模版
            this.state.charttree.buttons = this.state.ctrltree.buttons = ( data && data.button ? data.button: []).map( b =>  b.key);
            this.setState(this.state, () =>{
                this.initMeta(data.template, data.button);
                let gridMultiple = this.getAccmapShowCol(this.state.tempversionflag); //改为：根据是否生效动态渲染列
                this.changeVisibleCol(data.template.accmap, gridMultiple.accmap[1].children);
                data.template = props.meta.handleMultiple(data.template, gridMultiple);
                props.meta.setMeta(data && data.template ? data.template: {});
                props.button.setButtons(data && data.button ? data.button: {}, () => this.updateBtnStatus());
                setTimeout(() => {
                    var context = data.context || {};
                    if(context.pk_org && this.config.nodetype == 'org'&&context.pk_org != "GLOBLE00000000000000"){
                        var value = {
                            refpk: context.pk_org,
                            refname: context.org_Name
                        };
                        this.state.refOrg.onChange(value);
                    }
                }, 0);
            });
        });
        this.renderNode = this.renderNode.bind(this);
    }

    createState(){
        var refState = {
            refOrg: {
                fieldid:'FinanceOrgTreeRef',
                value: undefined,
                onChange: (val) => {
                    this.state.refOrg.value = val;
                    this.state.refSystem.value = undefined;
                    this.setState(this.state);
                },
                queryCondition : ()=>{//组织权限
                    var me = this;
                    var    cpde = this.config.appcode ;
                    return {
                        AppCode:'10140ACCO',
                        //AppCode: this.config.appcode || '',//此处应该使用会计科目的Appcode
                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                }
            },
            refSystem:{
                fieldid:'AccSystemGridRef',
                value: undefined,
                onChange: (val) => {
                    this.state.refSystem.value = val;
                    this.setState(this.state, () =>{
                        this.initPage();
                    });
                }
            }
        }

        var statePageChart = {
            charttree:{
                buttons:[],
                root: {
                    root: true,
                    key: 'root',
                    id: 'root',
                    code: '',
                    title: this.lang['ACCCHART-000035']/* 国际化处理： 科目表*/
                },
                datas: [],
                selectedNodeDatas:{},//存储选中节点树对应右边的数据
                expandedKeys: ['root'],
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),/* 国际化处理： 树开关*/
                closeIcon: (<i   class="icon iconfont icon-shushouqi tree-swich"></i>),/* 国际化处理： 树开关*/
                selectedKeys :  [],
                selectedNode:  undefined,
                onExpand:(expandedKeys, {expanded, node}) =>{
                    this.state.charttree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    if(!e.selected) return;
                    if(selectedKeys[0] == 'root'){
                        return;
                    }

                    if(!this.state.refSystem.value  || !this.state.refSystem.value.refpk){
                        toast({content : this.lang['ACCCHART-000036'],color : 'warning'});/* 国际化处理： 请选择科目体系*/
                        return;
                    }
                    if(this.config.nodetype == 'org'){
                        if(!this.state.refOrg.value || !this.state.refOrg.value.refpk ){
                            toast({content : this.lang['ACCCHART-000037'],color : 'warning'});/* 国际化处理： 请选择组织*/
                            return;
                        }
                    }
                    this.state.cardEmpty = false, //树 缺省适配
                    this.state.charttree = {
                        ...this.state.charttree,
                        selectedKeys: selectedKeys,
                        selectedNode: e.selected ? e.node: undefined,
                    };
                    this.loadDatarefChartVersion( data  => {
                        this.fillDatarefChartVersion(data);
                    });
                    this.setState(this.state, ()=>{
                        this.loadCtrlTree(ctrlTreeData => {
                            this.state.ctrltree ={
                                ... this.state.ctrltree,
                                datas: ctrlTreeData,
                                selectedKeys :  [],
                                selectedNode:  undefined,
                            };
                            this.setState(this.state, () =>{
                                this.props.form.EmptyAllFormValue('accchart');
                                this.props.form.EmptyAllFormValue('ctrlrule');
                                this.updateBtnStatus();
                                this.loadChartForm({id: selectedKeys[0]}, (data) => {
                                    this.fillChartForm(data);
                                })
                            });

                        });
                    });
                }
            }
        };

        var statePageRule = {
            ctrltree : {
                root: {
                    root: true,
                    id: 'root',
                    key: 'root',
                    code: '',
                    title: this.lang['ACCCHART-000038']/* 国际化处理： 科目控制规则*/
                },
                datas: [],
                selectedNodeDatas:{},//存储选中节点树对应右边的数据
                expandedKeys:['root'],
                selectedKeys :  [],
                selectedNode:  undefined,
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),/* 国际化处理： 树开关*/
                closeIcon: (<i   class="icon iconfont icon-shushouqi tree-swich"></i>),/* 国际化处理： 树开关*/
                onExpand:(expandedKeys, {expanded, node}) =>{
                    this.state.ctrltree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    if(!e.selected) return;
                    if(selectedKeys[0] == 'root'){
                        return;
                    }
                    this.state.ctrltree = {
                        ...this.state.ctrltree,
                        selectedKeys: selectedKeys,
                        selectedNode: e.selected ? e.node: undefined
                    };
                    this.setState(this.state, () => {
                        this.loadCtrlForm({ id: selectedKeys[0]}, (data)=>{
                            this.fillCtrlForm(data)
                            this.updateBtnStatus();
                        });
                    });

                }
            }
        };

        var state = {
            cardEmpty: true, //树 缺省适配
            isEmptyChartTreeData: true, //科目表数据是否为空
            chartEdit:false,
            ctrlEdit: false,
            accmapEdit:false,
            tab: {
                activeKey:'chart',
                onChange : (value) => {
                    var {refOrg, refSystem, charttree, tab} = this.state;
                    var selectedKeys = charttree.selectedKeys;
                    if(this.state.chartEdit || this.state.ctrlEdit) //编辑态不允许切换
                        return;
                    tab.activeKey = !selectedKeys || selectedKeys.length == 0 || selectedKeys[0] == 'root' ? 'chart' :value;
                    if(tab.activeKey=="ctrl"&&JSON.stringify(this.state.ctrltree.selectedNodeDatas)!='{}'){
                        this.fillCtrlForm(this.state.ctrltree.selectedNodeDatas);
                    }else if(tab.activeKey=="chart"&&JSON.stringify(this.state.charttree.selectedNodeDatas)!='{}'){
                        this.fillChartForm(this.state.charttree.selectedNodeDatas);
                    }
                    this.setState(this.state,() =>{
                        this.updateBtnStatus();
                    });
                }
            },
            ctrlTip:{
                createOrg: {
                    config: {
                        show: false,
                        onClick: () => {},
                    },
                    onHandler: (yes) =>{
                        return () => {
                            this.state.ctrlTip.createOrg.config.onClick(yes);
                        }
                    }
                }
            },
            version:{
                config:{ show: false},
                rest: (callback) =>{
                    var version = this.state.version;
                    // version.checked = false;
                    this.state.version.checkbox.checked = false;
                    version.datepicker.value = undefined;
                    version.refCtrlRule.disabled = true;
                    version.refCtrlRule.value = undefined;
                    //获取当前选中的科目表和控制规则
                    let data = this.props.createExtCardData(this.config.pagecode, 'accchart', ['accchart_rule','accchart_book']);
                    var rule = data.head.accchart.rows[0].values.pk_accctrlrule;
                    var refrule;
                    if(rule && rule.value){
                        refrule = {
                            refpk : rule.value,
                            refname : rule.display
                        };
                    }
                    version.refCtrlRule.value = refrule;
                    this.state.version = version;
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                },
                checkbox:{
                    checked: false,
                    onChange: (val) =>{
                        this.state.version.checkbox.checked = val;
                        var {checkbox,datepicker,refCtrlRule }  = this.state.version;
                        refCtrlRule.disabled = !val;
                        this.setState(this.state);
                    }
                },
                datepicker:{
                    value: undefined,
                    format: 'YYYY-MM-DD',
                    onChange: (value) => {
                        var {checkbox,datepicker }  = this.state.version;
                        datepicker.value = value;
                        this.setState(this.state);
                    }
                },
                refCtrlRule:{
                    disabled: true,
                    value: undefined,
                    onChange:(value)=>{
                        var {checkbox,datepicker ,refCtrlRule}  = this.state.version;
                        refCtrlRule.value = value;
                        this.setState(this.state);
                    },
                    queryCondition:() => {
                        debugger;
                        return {
                            pk_accsystem:this.state.refSystem.value.refpk,
                            pk_org: this.config.nodetype =='org' ? this.state.refOrg.value.refpk: '',
                            pk_accchart:this.state.charttree.selectedKeys[0],
                            nodetype: this.config.nodetype,
                            include_pk_accchart: false,
                            GridRefActionExt:'nccloud.web.uapbd.acctable.action.RefCondCtrlRule'
                        }
                    }
                },
                onSubmit:() =>{
                    this.onSaveVersion();
                }
            },
            accmap:{
                config:{
                    show: false,
                    onHide:() =>{
                        this.props.editTable.cancelEdit("accmap");
                        this.state.accmapEdit = false;
                        this.state.accmap.config.show = false;
                        this.setState(this.state)
                    }},
                tempversionflag:false,
                pk_acctype:null,
                pks:null,
                rest: (callback) =>{
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                },
            },
            refChartVersion: {
                datas:[],
                placeholder: this.lang['ACCCHART-000039'],/* 国际化处理： 科目表生效日期*/
                value: null,
                onChange: (value) => {
                    this.state.refChartVersion.value = value;
                    for(var i = 0;i<this.state.refChartVersion.datas.length;i++){
                        if(this.state.refChartVersion.datas[i].pk_accchart==value){
                            this.state.accmap.tempversionflag = this.state.refChartVersion.datas[i].tempversionflag
                        }
                    }
                    this.onaccmap();
                },
                renderOption: function() {
                    return this.datas.map( data => {
                        return <Option value={data.pk_accchart}>{data.beginperiod}</Option>
                    });
                }
            },
            check:{
                config:{ show: false},
                ischeck:true,
                rest: (callback) =>{
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                },
                onSubmit:() =>{
                    if(this.state.check.ischeck){
                        this.state.check.config.show = false;
                        this.setState(this.state)
                    }else{
                        this.AccmapValidate();
                    }
                }
            },
            ...refState,
            ...statePageChart,
            ...statePageRule
        };
        return state;
    }

    renderNode(cfg,nodeName){
        var type = cfg.type,
            operation = function(operation, item, pitem){
                return function(event){
                    event.stopPropagation();
                    return cfg[operation](item, pitem);
                };
            };
        var slefNodeName = nodeName;
        var renderTreeTitle = (item, pitem) => {
            var hasAdd;
            var hasEdit;
            var hasDel;
            let isExpand = this.state[slefNodeName].expandedKeys.includes(item.key);
            let isLeaf = !item.children.length;
            var isedit = this.state.chartEdit || this.state.ctrlEdit;
            let className = isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
            let fileIcon = <span><i style={{color:'#f2b224'}} className={className}/></span>
            let titleInfo = <span className="title-middle">{item.code || ''}  {item.title || ''}</span>
            let titleAdd    =  ( isedit) ? '' :<i style={{marginLeft: 10, fontSize:14}}  class="icon iconfont icon-zengjia add-icon" onClick={operation('onAdd',item, pitem)}></i>;/* 国际化处理： 新增*/
            let titleEdit   =  ( item.key =='root' || isedit) ? '' : <i style={{marginLeft: 10, fontSize:14}} class="icon iconfont icon-bianji edit-icon" onClick={operation('onEdit',item, pitem)}></i>;/* 国际化处理： 编辑*/
            let titleRemove =  ( item.key =='root' || isedit) ? '' : <i style={{marginLeft: 10, fontSize:14}} class="icon iconfont icon-shanchu delete-icon" onClick={operation('onRemove',item, pitem)}></i>;/* 国际化处理： 删除*/
            return (<div className="title-con">{fileIcon}{titleInfo}{titleAdd}{titleEdit}{titleRemove}</div>);
        };
        const loop = (datas, pdata) => datas.map((item) => {
            var children = item.children || [];
            let switcherName = !children.length ? 'isLeaf_hiden_point_line':'isLeaf_show_point_line';
            switcherName = 'isLeaf_show_point_line';
            return (
                <NCTree.NCTreeNode switcherClass={switcherName} disabled={cfg.isedit}
                    className={cfg.isedit && this.state[nodeName].selectedKeys && this.state[nodeName].selectedKeys[0] == item.key ? 'node-item-edit-point-style-self': ''}
                    title={renderTreeTitle(item, pdata)} key={item.key} isLeaf={children.length == 0} nodeData={item}
                    liAttr={{"fieldid": `${item.code}_node`}}
                >
                    {children.length == 0 ? '' :loop(children, item)}
                </NCTree.NCTreeNode>
                )
        });
        return loop(cfg.datas);
    }

    initTableButton(){


    }
    titleSearchContent(){
        var isEdit    = this.state.chartEdit || this.state.ctrlEdit;
        return(
            <div className='header-search-def'>
                {this.config.nodetype !== 'org' ? '' :
                    <div className="search-box">
                        <span style={{ marginTop: 9, zIndex: 1, float: 'left', position: 'relative', color: 'red' }}><span style={{ position: 'absolute', left: 3 }}>*</span></span>
                        {RefOrg({ ...this.state.refOrg, disabled: isEdit })}
                    </div>
                }
                <div className="search-box">
                    <span style={{ marginTop: 9, zIndex: 1, float: 'left', position: 'relative', color: 'red' }}>
                        <span style={{ position: 'absolute', left: 3 }}>*</span>
                    </span>
                    {RefAccSystem({ ...this.state.refSystem, disabled: isEdit })}
                </div>
            </div>
        )

    }
    getHeight = (defaultHeight=0) => {          
        return document.getElementById('app').offsetHeight - defaultHeight + 'px';
    }
    render() {
        if(!this.lang) return '';
        const {syncTree,form,cardTable,editTable, button,search,ncmodal,DragWidthCom} = this.props;
        var isEdit    = this.state.chartEdit || this.state.ctrlEdit,
            chartEdit = this.state.chartEdit,
            ctrlEdit  = this.state.ctrlEdit;

        var {charttree,ctrltree,refChartVersion, cardEmpty, isEmptyChartTreeData} = this.state;

        var chartNode = {
                datas:  [{...charttree.root, children: charttree.datas || []}],
                onAdd : this.addChart.bind(this),
                onEdit : this.editChart.bind(this),
                onRemove : this.delChart.bind(this),
                isedit: this.state.chartEdit,
                type: 'chart'
            },
            ctrlNode = {
                datas: [{...ctrltree.root, children: ctrltree.datas}],
                onAdd : this.addCtrl.bind(this),
                onEdit : this.editCtrl.bind(this),
                onRemove : this.delCtrl.bind(this),
                isedit: ctrlEdit,
                type: 'rule'
            };
        var renderChartArea = () => {
            // this.state.refSystem.value.refpk
            let isShowTipBtn = this.state.refSystem.value && this.state.refSystem.value.refpk && isEmptyChartTreeData
            let emptyTipType = isShowTipBtn ? 'btn'  : 'desc';
            let emptyTipTxt = isShowTipBtn ? this.lang['ACCCHART-000088'] : (this.config.nodetype === 'org' ? this.lang['ACCCHART-000086'] : this.lang['ACCCHART-000087']) /* 国际化处理： 请先选择财务组织:请先选择科目体系*/
            let tempHeight = this.getHeight(86)
            return     <div style={{height: tempHeight}}><div className="tree-card" style={{height: '100%'}}>
                <DragWidthCom
                    leftDom  = {
                    <div className="tree-area">
                        <div class="syncTreeCom syncTreeComLineStyle syncTreeComMR20" id="accSchemeTree">
                            <div className="synctree-area">
                                <NCTree {...this.state.charttree}>{this.renderNode(chartNode,'charttree')}</NCTree>
                            </div>
                        </div>
                    </div>
                    }
                    rightDom = {
                        <div style={{ height: '100%' }}>
                            {/* mptyAreaTip type值为"desc"/"btn","desc"状态无下方按钮，且仅设置btn的时候可以添加onClick回调 */}
                            <EmptyAreaTip type={emptyTipType} desc={emptyTipTxt} 
                                onClick={chartNode.onAdd} show={cardEmpty} />
                            
                            <div style={{height: "100%", display: cardEmpty ? 'none' : 'block'}}>
                                
                                <div className="nc-bill-form-area">
                                    {form.createForm('accchart', {
                                        onAfterEvent: this.onChartAfterEvent.bind(this)
                                    })}
                                </div>
                                <div className="nc-bill-table-area">
                                    {cardTable.createCardTable('accchart_rule', {
                                        showIndex:true,
                                        hideSwitch:()=>{return false;},
                                        tableHead: () => {
                                            return (
                                                <div className="shoulder-definition-area">
                                                    <div className="definition-icons">
                                                        {button.createButtonApp({
                                                            area: 'accchart_rule',
                                                            buttonLimit: 3,
                                                            onButtonClick: (props, btncode) =>{
                                                                this.onBtnOperation(props, btncode, 'accchart_rule');
                                                            },
                                                            popContainer: document.querySelector('.card-childer-button')

                                                        })}

                                                    </div>
                                                </div>
                                            )
                                        },
                                        //onBeforeEvent: this.onCardTableBeforeEdit.bind(this,'accchart_rule')
                                        //onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                    })}
                                </div>
                                <div className="nc-bill-table-area">
                                    {cardTable.createCardTable('accchart_book', {
                                        // adaptionHeight: true,
                                        showIndex:true,
                                        hideSwitch:()=>{return false;},
                                        tableHead: () => {
                                            return (
                                                <div className="shoulder-definition-area">
                                                    <div className="definition-icons">
                                                        {button.createButtonApp({
                                                            area: 'accchart_book',
                                                            buttonLimit: 3,
                                                            onButtonClick: (props, btncode) =>{
                                                                this.onBtnOperation(props, btncode, 'accchart_book');
                                                            },
                                                            popContainer: document.querySelector('.card-childer-button')

                                                        })}

                                                    </div>
                                                </div>
                                            )
                                        }
                                        //onAfterEvent: this.onPsnjobAfterEdit.bind(this),
                                        //onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                    defLeftWid = '22%'/>
            </div>
            </div>
        };

        var renderCtrlArea = () => {
            let tempHeight = this.getHeight(86)

            return  <div style={{height: tempHeight}}>
                <div className="tree-card" style={{height: '100%'}}>
                    <DragWidthCom
                        leftDom  = {
                        <div className="tree-area">
                            <div class="syncTreeCom syncTreeComLineStyle syncTreeComMR20" id="accSchemeTree">
                                <div className="synctree-area">
                                <NCTree {...this.state.ctrltree}>{this.renderNode(ctrlNode,'ctrltree')}</NCTree>
                                </div>
                            </div>
                        </div>
                        }
                        rightDom = {
                            <div>
                                <div className="nc-bill-form-area">
                                    {form.createForm('ctrlrule', {})}
                                </div>
                                <div className="nc-bill-table-area nc-bill-table-area-fixed-btn">
                                    {cardTable.createCardTable('ctrlrule_account', {
                                        showIndex:true,
                                        hideSwitch:()=>{return false;},
                                        tableHead: () => {
                                            return (
                                                <div className="shoulder-definition-area">
                                                    <div className="definition-icons">
                                                        {button.createButtonApp({
                                                            area: 'ctrlrule_account',
                                                            buttonLimit: 3,
                                                            onButtonClick: (props, btncode) =>{
                                                                this.onBtnOperation(props, btncode, 'ctrlrule_account');
                                                            },
                                                            popContainer: document.querySelector('.card-childer-button')

                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        //onAfterEvent: this.onPsnjobAfterEdit.bind(this),
                                        //onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                    })}
                                </div>
                                <div className="nc-bill-table-area">
                                    {cardTable.createCardTable('ctrlrule_rule', {
                                        showIndex:true,
                                        hideSwitch:()=>{return false;},
                                        //onAfterEvent: this.onPsnjobAfterEdit.bind(this),
                                        //onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                    })}
                                </div>
                                <div className="nc-bill-table-area nc-bill-table-area-fixed-btn">
                                    {cardTable.createCardTable('ctrlrule_org', {
                                        showIndex:true,
                                        hideSwitch:()=>{return false;},
                                        tableHead: () => {
                                            return (
                                                <div className="shoulder-definition-area">
                                                    <div className="definition-icons">
                                                        {button.createButtonApp({
                                                            area: 'ctrlrule_org',
                                                            buttonLimit: 3,
                                                            onButtonClick: (props, btncode) =>{
                                                                this.onBtnOperation(props, btncode, 'ctrlrule_org');
                                                            },
                                                            popContainer: document.querySelector('.card-childer-button')

                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        //onAfterEvent: this.onPsnjobAfterEdit.bind(this),
                                        //onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                    })}
                                </div>
                            </div>
                        }
                        defLeftWid = '20%'/>
                </div>
            </div>
        };
        return (
            <div className='nc-bill-tree-card'>
                <AssignStepModal lang={this.lang} mainprops={this.props} ref={(item) => this.AssignStepModal = item}/>
                <NCModal {...this.state.version.config} fieldid='newversion'>
                    <NCModal.Header>
                        <NCModal.Title>{this.lang['ACCCHART-000040']/* 国际化处理： 科目表创建新版本*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                    {this.lang['ACCCHART-000041']/* 国际化处理： 新版本生效日期*/}: <NCDatePicker {...this.state.version.datepicker} />
                    {this.lang['ACCCHART-000042']/* 国际化处理： 所属控制规则*/}:{RefCtrlRule(this.state.version.refCtrlRule)}
                    { this.lang['ACCCHART-000043']/* 国际化处理：  创建临时版本,创建临时版本*/} :<NCCheckbox {...this.state.version.checkbox} fieldid='version'/>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid='submit' onClick={ this.state.version.onSubmit }>{this.lang['ACCCHART-000044']/* 国际化处理： 确定*/}</NCButton>
                        <NCButton fieldid='cancel' onClick={ () => {this.state.version.config.show = false; this.setState(this.state)}} >{this.lang['ACCCHART-000013']/* 国际化处理： 取消*/}</NCButton>
                    </NCModal.Footer>
                </NCModal>

                <NCModal zIndex={300} show ={this.state.ctrlTip.createOrg.config.show} fieldid='createorgshow'>
                    <NCModal.Header>
                        <NCModal.Title>{this.lang['ACCCHART-000045']/* 国际化处理： 提示*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                    {this.lang['ACCCHART-000046']/* 国际化处理： 新增组织是否创建下级科目表?,新增组织是否创建下级科目表*/}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid='yes' onClick={ this.state.ctrlTip.createOrg.onHandler(true) }>{this.lang['ACCCHART-000047']/* 国际化处理： 是*/}</NCButton>
                        <NCButton fieldid='no' onClick={ this.state.ctrlTip.createOrg.onHandler(false) }>{this.lang['ACCCHART-000048']/* 国际化处理： 否*/}</NCButton>
                        <NCButton fieldid='cancel' onClick={ () => {this.state.ctrlTip.createOrg.config.show = false; this.setState(this.state)}} >{this.lang['ACCCHART-000013']/* 国际化处理： 取消*/}</NCButton>
                    </NCModal.Footer>
                </NCModal>

                <NCModal {...this.state.check.config} fieldid='check' >
                    <NCModal.Header>
                        <NCModal.Title>{this.lang['ACCCHART-000049']/* 国际化处理： 检查*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div>{this.lang['ACCCHART-000050']/* 国际化处理： 旧版本未与新版本进行对照的科目有*/}：</div>
                        {editTable.createEditTable("account", {//列表区
                            showIndex:true,				//显示序号
                        })}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid='submit' onClick={ this.state.check.onSubmit }>{this.lang['ACCCHART-000044']/* 国际化处理： 确定*/}</NCButton>
                        {!this.state.check.ischeck&&<NCButton fieldid='cancel' onClick={ () => {this.state.check.config.show = false; this.setState(this.state)}} >{this.lang['ACCCHART-000013']/* 国际化处理： 取消*/}</NCButton>}
                    </NCModal.Footer>
                </NCModal>

                <NCModal {...this.state.accmap.config} size = 'xlg' fieldid='accmap' >
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['ACCCHART-000051']/* 国际化处理： 科目对照*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body className='btn-list'>
                        {button.createButtonApp({
                            area: 'accmap',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                        {search.NCCreateSearch("accmapsearch", {
                            clickSearchBtn: this.clickaccmapSearchBtn.bind(this),
                        })}
                        <NCRow className='accitem-ncrow'>
                            <NCCol md={3} xs={3} sm={3}>
                                <div className='gray'>{this.lang['ACCCHART-000052']/* 国际化处理： 科目体系*/} :  <NCFormControl className="demo1-input" value={this.state.refSystem.value ? this.state.refSystem.value.refname :''} size="sm"/> </div>
                            </NCCol>
                            <NCCol md={3} xs={3} sm={3}>
                                <div className='grayLight'>{this.lang['ACCCHART-000035']/* 国际化处理： 科目表*/} : <NCFormControl className="demo1-input" value={this.state.charttree.selectedNode ? this.state.charttree.selectedNode.props.nodeData.name :''} size="sm"/></div>
                            </NCCol>
                            <NCCol md={3} xs={3} sm={3}>
                                <div className='grayDeep'>{this.lang['ACCCHART-000053']/* 国际化处理： 生效日期*/} : {this.state.charttree.selectedNode ? <NCSelect {...refChartVersion}>{refChartVersion.renderOption()}</NCSelect> :''}</div>
                            </NCCol>
                        </NCRow>
                        {editTable.createEditTable("accmap", {//列表区
                            onAfterEvent: this.onAccmapAfterEvent.bind(this),                      // 控件的编辑后事件
                            onBeforeEvent:this.onAccmapBeforeEvent.bind(this),
                            statusChange: function(){
                                // setTimeout(() => {
                                //     this.updateButtonStatus();
                                // }, 0)
                            }.bind(this),				//表格状态监听
                            showIndex:true,				//显示序号
                            height:'285px'
                        })}
                    </NCModal.Body>
                </NCModal>

                <AssignAccountBook  lang={this.lang}  {...{config: this.config}} ref={(item) => this.assignChartBook = item}></AssignAccountBook>
                <AssignControlOrg   lang={this.lang}  {...{config: this.config}} ref={(item) => this.assignCtrlOrg = item}></AssignControlOrg>
                <AssignAccItem      lang={this.lang}  {...{config: this.config}} mainprops={this.props} ref={(item) => this.assignCtrlItem = item}></AssignAccItem>

                {ncmodal.createModal('modal',{noFooter:false})}
                <HeaderArea
                    title = {this.config.title} 
					searchContent = {
                        this.titleSearchContent()
					}
					btnContent = {
                    <div>
                    {button.createButtonApp({
                        area: 'chart',
                        onButtonClick: this.onBtnOperation.bind(this)
                    })}
                    {button.createButtonApp({
                        area: 'ctrl',
                        onButtonClick: this.onBtnOperation.bind(this)
                    })}
                    </div>}
				/>
                

                <NCTabs defaultActiveKey="chart" {...this.state.tab}>
                    <NCTabs.NCTabPane tab={this.lang['ACCCHART-000035']/* 国际化处理： 科目表*/} key="chart" forceRender={true}>
                        {this.state.tab.activeKey == 'chart' ?  renderChartArea() : ''}
                    </NCTabs.NCTabPane>
                    <NCTabs.NCTabPane tab={this.lang['ACCCHART-000054']/* 国际化处理： 科目管控规则*/} key="ctrl" forceRender={true}>
                        {this.state.tab.activeKey == 'ctrl' ?  renderCtrlArea() : ''}
                    </NCTabs.NCTabPane>
                </NCTabs>
                <PrintOutput
                    ref='printOutput'
                    url= {'/nccloud/uapbd/acctable/AccmapPrintAction.do'}
                    data={{
                        funcode:this.config.appcode,
                        nodekey:'accoutmaplist',     //模板节点标识
                        oids: this.state.accmap.pks,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        );
    }



    onChartAfterEvent(props, areacode, attrname,  value, hisvalues, index, rowRecord){
        if(attrname == 'accpolicychart'){
            if(value.value == true){ //
                this.props.form.setFormItemsDisabled('accchart',{allgroup:this.config.nodetype == 'grp'});
                if(this.config.nodetype == 'grp'){
                    let data = this.props.createExtCardData(this.config.pagecode, 'accchart', ['accchart_rule','accchart_book']);
                    var pkgroup = data.head.accchart.rows[0].values.pk_group;
                    this.props.form.setFormItemsValue('accchart',{allgroup:{value:pkgroup.value, display:pkgroup.display}});

                  
                }
            }else{
                this.props.form.setFormItemsDisabled('accchart',{allgroup:true});
                this.props.form.setFormItemsValue('accchart',{allgroup:{value:'', display:''}});
            }
        }
    }

    initPage(callback){
        this.loadChartTree( (datas) => {
            this.state.charttree ={
                ... this.state.charttree,
                datas: datas,
                selectedKeys :  [],
                selectedNode:  undefined,
            };
            this.state.ctrltree ={
                ... this.state.ctrltree,
                datas: [],
                selectedKeys :  [],
                selectedNode:  undefined,
            };
            this.state.cardEmpty = datas.length > 0 ? false : true;
            this.state.isEmptyChartTreeData = datas.length > 0 ? false : true;
            this.state.tab.activeKey = 'chart';
            this.setState(this.state,() =>{
                this.props.form.EmptyAllFormValue('accchart');
                this.props.form.EmptyAllFormValue('ctrlrule');
                this.updateBtnStatus();
                setTimeout(() => {
                    callback && callback();
                }, 0);
            });
        });
    }

    loadChartTree(callback){
        var {refOrg, refSystem} = this.state,{ nodetype } = this.config;
        var systemid =  refSystem.value ? refSystem.value.refpk : undefined,
            pkorg    = nodetype =='org' ? (refOrg.value ? refOrg.value.refpk: undefined) : undefined;
        if( !systemid  || (nodetype =='org' && !pkorg)  ){ //未选中体系, 组织节点并且未选中组织,清空列表
            callback && callback([]);
            return;
        }
        ajax({
            url: '/nccloud/uapbd/acctable/AccTableTreeAction.do',
            data: {
                pkaccsys: systemid,
                pkorg: pkorg,
                nodetype: nodetype
            },
            success:(result)=> {
                callback && callback(result.data || []);
            }
        });
    }

    loadChartForm(param = {}, callback){
        ajax({
            url: '/nccloud/uapbd/acctable/AccTableLoadAction.do',
            data: {
                ...param,
                ...this.config
            } ,
            success:(result)=> {
                callback && callback(result.data);
            }
        });
    }

    fillChartForm(data,callback){
        let dataSource=JSON.parse(JSON.stringify(data));
        this.props.form.setAllFormValue({'accchart': data.head['accchart'] });
        setTimeout(() => {
            if(data.bodys['accchart_book']){
                this.props.cardTable.setTableData('accchart_book', data.bodys['accchart_book']);
            }else{
                this.props.cardTable.setTableData('accchart_book', {rows:[]});
            }
            setTimeout(() => {
                if(data.bodys['accchart_rule']){
                    this.props.cardTable.setTableData('accchart_rule', data.bodys['accchart_rule']);
                }else{
                    this.props.cardTable.setTableData('accchart_rule', {rows:[]});
                }
                setTimeout(() => {
                    if(data.bodys['accchart_policy']){
                        this.props.cardTable.setTableData('accchart_policy', data.bodys['accchart_policy']);
                        var value = '';
                        var display ='';
                        (data.bodys['accchart_policy'].rows || [] ).forEach(r =>{
                            value = value + r.values.pk_group.value + ',';
                            display = display + r.values.pk_group.display + ',';
                        });
                        var refValue = {
                            value:value,
                            display: display
                        };
                        this.props.form.setFormItemsValue('accchart',{allgroup:refValue});
                    }else{
                        this.props.cardTable.setTableData('accchart_policy', {rows:[]});
                        this.props.form.setFormItemsValue('accchart',{allgroup:{value:'',display:''}});
                    }
                    setTimeout(() => {
                        callback && callback();
                    }, 0);
                }, 0);
            }, 0);
            this.state.charttree.selectedNodeDatas=dataSource;
            this.setState(this.state);
        }, 0);
    }
    addRowChartRule(){
        let len = this.props.cardTable.getNumberOfRows('accchart_rule');
        this.props.cardTable.addRow('accchart_rule',len,{});
    }
    deleteRowChartRule(index){
        var data = this.props.cardTable.getRowsByIndexs('accchart_rule', index)[0];
        var pkaccchart = data.values.pk_createaccchart && data.values.pk_createaccchart.value && data.values.pk_createaccchart.value.length > 0 ? data.values.pk_createaccchart.value : undefined;
        var accchart = this.props.form.getAllFormValue('accchart');
        var frompk = accchart.rows[0].values.pk_accchart.value;
        // if(!frompk){ //新增
        //     if(pkaccchart){ //新增时 存在pkaccchart的rule都是上级继承来的不能删除
        //         toast({content : "上级预留规则不可以删除",color : 'danger'});
        //         return;
        //     }
        // }else{//修改
        //     if(frompk != pkaccchart){
        //         toast({content : "上级预留规则不可以删除",color : 'danger'});
        //         return;
        //     }
        // }
        this.props.cardTable.delRowsByIndex('accchart_rule', index);
    }
    addRowChartBook(){
        //mazheng
        var accchart = this.props.form.getAllFormValue('accchart');
        var pk_accchart = accchart.rows[0].values.pk_accchart.value;

        this.assignChartBook.show({
            pk_accchart : pk_accchart,
            pk_accsystem: this.state.refSystem.value.refpk
        },() => {
            var refbookdatas = this.assignChartBook.getData(),
                len = this.props.cardTable.getNumberOfRows('accchart_book'),
                allDatas = this.props.cardTable.getAllData('accchart_book').rows || [],
                haspks = allDatas.map(d => {
                    return d.values.pk_accountingbook.value;
                });

            refbookdatas = refbookdatas.filter(data => {
                return haspks.indexOf(data.pk_accountingbook) == -1;
            });

            refbookdatas.forEach( (data, index) => {
                this.props.cardTable.addRow('accchart_book',len + index,{
                    'pk_accountingbook':{value: data.pk_accountingbook, display: data.pk_accountingbook},
                    'pk_accountingbook.code':{value: data.org_accountingbook_code, display: data.org_accountingbook_code},
                    'pk_accountingbook.name':{value: data.org_accountingbook_name, display: data.org_accountingbook_name},
                    'pk_accountingbook.pk_relorg.code':{value: data.org_financeorg_code, display: data.org_financeorg_code},
                    'pk_accountingbook.pk_relorg.name':{value: data.org_financeorg_name, display: data.org_financeorg_name},
                });
            });
            this.assignChartBook.oncancel();
        });
    }
    deleteRowChartBook(index){
        this.props.cardTable.delRowsByIndex('accchart_book', index);
    }
    loadCtrlTree(callback){
        var {charttree, ctrltree} = this.state;
        if(!charttree.selectedKeys || charttree.selectedKeys[0] == 'root' ){
            callback && callback([]);
            return;
        }
        ajax({
            url: '/nccloud/uapbd/acctable/AccTableControlTreeAction.do',
            data: { pkaccchart:charttree.selectedKeys[0]},
            success:(result)=> {
                callback && callback(result.data || []);
            }
        });
    }
    loadCtrlForm( param, callback){
        ajax({
            url: '/nccloud/uapbd/acctable/AccTableControlLoadAction.do',
            data:{
                ... param,
                ... this.config,
                pkaccchart:this.state.charttree.selectedKeys[0]
            },
            success:(result)=> {
                var data = result.data || {};
                if(data.ctrlrule_account){
                    // debugger;
                    // var rows =  data.ctrlrule_account.ctrlrule_account.rows;

                    // rows.sort((obj1, obj2) => {
                    //     var code1 =  obj1.values['pk_account.code'].value;
                    //     var code2 =  obj2.values['pk_account.code'].value;
                    //     if(code1.indexOf(code2)){
                    //         return false;
                    //     }
                    //     else if(code2.indexOf(code1)){
                    //         return true;
                    //     }else{
                    //         var len = code1.length - code2.length > 0 ? code2.length : code1.length;
                    //         return parseInt(code1.substring(0, len)) - parseInt(code2.substring(0, len)) > 0 ?  true: false;
                    //     }
                    // });
                    // data.ctrlrule_account.ctrlrule_account.rows = rows;
                }
                callback && callback(data);
            }
        });
    }
    fillCtrlForm( data, callback ){
        let dataSource=JSON.parse(JSON.stringify(data));
        this.props.form.setAllFormValue({'ctrlrule': data.ctrlrule.ctrlrule });
        setTimeout(() => {
            if(data.ctrlrule_org){
                this.props.cardTable.setTableData('ctrlrule_org', data.ctrlrule_org.ctrlrule_org);
            }else{
                this.props.cardTable.setTableData('ctrlrule_org', {rows:[] });
            }
            setTimeout(() => {
                if(data.ctrlrule_account){
                    this.props.cardTable.setTableData('ctrlrule_account', data.ctrlrule_account.ctrlrule_account);
                }else{
                    this.props.cardTable.setTableData('ctrlrule_account', {rows:[] });
                }
                setTimeout(() => {
                    if(data.ctrlrule_rule){
                        this.props.cardTable.setTableData('ctrlrule_rule', data.ctrlrule_rule.ctrlrule_rule);
                    }else{
                        this.props.cardTable.setTableData('ctrlrule_rule', {rows:[] });
                    }
                    setTimeout(() => {
                        callback && callback();
                    }, 0);
                }, 0);
            }, 0);
            this.state.ctrltree.selectedNodeDatas=dataSource;
            this.setState(this.state);
        }, 0);
    }

    addChart(item, pitem){
        var param = {
            pid: item.key,
            pkorg: this.state.refOrg.value ? this.state.refOrg.value.refpk: undefined,
            pksys: this.state.refSystem.value.refpk,
            nodetype: this.config.nodetype
        }
        this.loadChartForm(param, (data)=>{
            this.fillChartForm(data,() => {
                this.state.chartEdit = true;
                this.state.cardEmpty = false; // 不显示空区域
                this.setState(this.state, () => {
                    this.updateBtnStatus();
                    this.props.form.setFormStatus('accchart', 'edit');
                    this.props.cardTable.setStatus('accchart_rule', 'edit');
                    this.props.cardTable.setStatus('accchart_book', 'edit');
                    //根科目表只能修改名称格式和控制剂次
                    this.props.form.setFormItemsDisabled('accchart',{dispnamemodel:false});
                    this.props.form.setFormItemsDisabled('accchart',{ctrllevel:false});
                    this.props.form.setFormItemsDisabled('accchart',{code:false});
                    this.props.form.setFormItemsDisabled('accchart',{name:false});
                    this.props.form.setFormItemsDisabled('accchart',{pk_accctrlrule:false});


                   
                   var accpolicychart = this.props.form.getFormItemsValue('accchart','accpolicychart');
                 

                         //如果是集团节点 禁用选择集团
                         if(this.config.nodetype == 'grp'){
                            this.props.form.setFormItemsDisabled('accchart',{allgroup:true});
                        }else{
                            if(accpolicychart.value == true){ //
                                this.props.form.setFormItemsDisabled('accchart',{allgroup:false});
                            }else{
                                this.props.form.setFormItemsDisabled('accchart',{allgroup:true});
                            }
                        }
                    //this.props.form.setFormItemsDisabled('accchart',{allgroup:this.config.nodetype == 'grp'});
                });
            });
        });
    }

    editChart(item, pitem){
        this.loadChartForm({ id: item.key}, (data)=>{
            this.fillChartForm(data, () =>{
                this.props.form.setFormStatus('accchart', 'edit');
                this.props.cardTable.setStatus('accchart_rule', 'edit');
                this.props.cardTable.setStatus('accchart_book', 'edit');
                if(pitem.root){
                    this.props.form.setFormItemsDisabled('accchart',{code:false,name:false,dispnamemodel:false,ctrllevel:false});
                }else{
                    this.props.form.setFormItemsDisabled('accchart',{code:false,name:false,dispnamemodel:false,ctrllevel:false});
                }


                var accpolicychart = this.props.form.getFormItemsValue('accchart','accpolicychart');

                  //如果是集团节点 禁用选择集团
                if(this.config.nodetype == 'grp'){
                    this.props.form.setFormItemsDisabled('accchart',{allgroup:true});
                }else{
                    if(accpolicychart.value == true){ //
                        this.props.form.setFormItemsDisabled('accchart',{allgroup:false});
                    }else{
                        this.props.form.setFormItemsDisabled('accchart',{allgroup:true});
                    }
                }

               
                //root chart 跟科目表需要设置验证规则可以为空

                this.state.chartEdit = true;
                this.state.cardEmpty = false; // 不显示空区域
                this.setState(this.state, () => {
                    var meta = this.props.meta.getMeta();
                    meta.accchart.items.forEach(item =>{
                        if(item.attrcode == 'pk_accctrlrule'){
                            item.required = !pitem.root;
                        }
                    });
                    this.props.meta.setMeta(meta, () =>{
                        this.updateBtnStatus();
                    });

                });
            });
        });
    }

    saveChart(callback){
       
        this.doSaveChart((result) =>{
            if(result.success == true){
                toast({title : this.lang['ACCCHART-000022'],color : 'success'});/* 国际化处理： 保存成功！*/
                callback && callback(result.data);
                return;
            }
            toast({title : '错误', content: result.error ,color : 'danger'});/* 国际化处理： 保存失败！*/
         //   toast({title : result.error,color : 'warning'});/* 国际化处理： 保存成功！*/
            // promptBox({
            //     color:"warning",
            //     title: '确认继续',
            //     content: result.error+',集团已经关联是否替换?',
            //     beSureBtnClick: () =>{
            //         this.doSaveChart((result2) =>{
            //             if(result2.success == true){
            //                 toast({title : this.lang['ACCCHART-000022'],color : 'success'});/* 国际化处理： 保存成功！*/
            //                 callback && callback(result2.data);
            //                 return;
            //             }
            //         }, true);
            //     }
            // });
            
        });
    }

    doSaveChart(callback, isreplace = false){
        //如果是全局科目表并且新增顶级科目表，所属控制规则自动设置为非必输，否则必输
        let status=this.props.form.getFormStatus('accchart');
        if((this.config.nodetype =='glb'&&this.state.charttree.datas.length==0)||
            this.config.nodetype =='glb'&&this.state.charttree.datas.length==1&&status=='edit'){
            this.props.form.setFormItemsRequired('accchart',{'pk_accctrlrule':false});
        }else{
            this.props.form.setFormItemsRequired('accchart',{'pk_accctrlrule':true});
        }
        if(!this.props.form.isCheckNow('accchart')){
            return;
        }
        this.props.cardTable.filterEmptyRows('accchart_rule',['obligaterule'],'include');
        setTimeout(() => {
            let data = this.props.createExtCardData(this.config.pagecode, 'accchart', ['accchart_rule','accchart_book']);

            var allgroup = '';
            if(data.head.accchart.rows[0].values.accpolicychart && data.head.accchart.rows[0].values.accpolicychart.value){
                allgroup   = data.head.accchart.rows[0].values.allgroup.value;
            }
            data.userjson = allgroup;
            data.head.accchart.rows[0].values.isreplaceply.value = isreplace;
            var afterhander = () =>{
                ajax({
                    url: '/nccloud/uapbd/acctable/AccTableEditAction.do',
                    data: data,
                    success: (res) => {
                        callback && callback(res.data);
                    }
                })
            };

            var checkdata = {
                model:{
                    rows:[{
                        values: data.head.accchart.rows[0].values,
                        rowid: 0
                    }],
                    areacode: 'accchart'
                },
                pageid: this.config.pagecode
            };

            this.props.validateToSave( checkdata , () =>{
                afterhander();
            } , {accchart: 'form'},'form');

        }, 0);
    }


    onSaveChart(){
        this.saveChart( data => {
            this.props.cardTable.resetTableData('accchart_rule');
            setTimeout(() => {
                this.props.cardTable.resetTableData('accchart_book');
                setTimeout(() => {
                    this.props.form.setFormStatus('accchart', 'browse');
                    this.props.cardTable.setStatus('accchart_rule', 'browse');
                    this.props.cardTable.setStatus('accchart_book', 'browse');
                    this.loadChartTree( chartTreeData => {
                        this.state.charttree ={
                            ... this.state.charttree,
                            datas: chartTreeData
                        };
                        this.state.chartEdit = false;
                        this.state.cardEmpty = chartTreeData.length > 0 ? false : true;
                        this.state.isEmptyChartTreeData = chartTreeData.length > 0 ? false : true;
                        this.setState(this.state, () => {
                            this.loadChartForm( {id: data.vos[0].pk_accchart}, (d) =>{
                                this.fillChartForm( d,() =>{
                                    this.state.chartEdit = false;
                                    this.setState(this.state, () => {
                                        this.updateBtnStatus();
                                    });
                                })
                            })
                        })
                    });

                }, 0);
            }, 0);
            // this.props.cardTable.resetTableData('accchart_rule', () =>{
            //     this.props.cardTable.resetTableData('accchart_book', () =>{
                   
            //     });
            // });
        });

        // this.saveChart( (data) => {
        //     this.loadChartTree( chartTreeData => {
        //         this.state.charttree ={
        //             ... this.state.charttree,
        //             datas: datas,
        //             selectedKeys :  [],
        //             selectedNode:  undefined,
        //         };

        //     this.loadCtrlTree( (treedata) => {

        //     });
        // });
        // this.saveChart( (data) => {
        //     this.loadChartTree( (chartData) => {
        //         this.state.charttree ={
        //             ... this.state.charttree,
        //             datas: datas,
        //             selectedKeys :  [],
        //             selectedNode:  undefined,
        //         };
        //     this.loadCtrlTree( (treedata) => {
        //         this.loadChartForm( {id: data.vos[0].pk_accchart}, (d) =>{
        //             this.fillChartForm( d,() =>{
        //                 this.state.chartEdit = false;
        //                 this.setState(this.state, () => {
        //                     this.updateBtnStatus();
        //                     this.props.form.setFormStatus('accchart', 'browse');
        //                     this.props.cardTable.setStatus('accchart_rule', 'browse');
        //                     this.props.cardTable.setStatus('accchart_book', 'browse');
        //                 })
        //             })
        //         })
        //     });
        // });
    }

    cancelChart(){
        var handler = () => {
            var loadAfterHander = () =>{
                this.state.chartEdit = false;
                this.state.cardEmpty = this.state.charttree.datas.length > 0 ? false : true
                this.state.isEmptyChartTreeData = this.state.charttree.datas.length > 0 ? false : true
                this.setState(this.state,() => {
                    this.updateBtnStatus();
                    this.props.form.setFormStatus('accchart', 'browse');
                    this.props.cardTable.setStatus('accchart_rule', 'browse');
                    this.props.cardTable.setStatus('accchart_book', 'browse');
                });
            }

            if(this.state.charttree.selectedKeys[0]){
                this.loadChartForm({id: this.state.charttree.selectedKeys[0]}, (data) => {
                    this.fillChartForm(data, () => {
                        loadAfterHander();
                    });
                });
            }else{
                this.props.form.EmptyAllFormValue('accchart');
                setTimeout(loadAfterHander, 0);

            }
        };
        // this.props.modal.show('modal',{
        promptBox({
            color:"warning",
            title: this.lang['ACCCHART-000023'],/* 国际化处理： 确认取消*/
            content: this.lang['ACCCHART-000024'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: handler
        });
    }

    delChart(item, pitem){
        var handler = () => {
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableDelAction.do',
                data: {
                    pk_accchart: item.key
                },
                success:(result)=> {
                    toast({title : this.lang['ACCCHART-000025'],color : 'success'});/* 国际化处理： 删除成功！*/
                    this.initPage();
                }
            });
        };
        // this.props.modal.show('modal',{
        promptBox({
            title: this.lang['ACCCHART-000026'],/* 国际化处理： 确认删除*/
            content: this.lang['ACCCHART-000027'],/* 国际化处理： 是否确认要取消?删除科目表将删除当前科目表和下级科目表的所有版本.*/
            beSureBtnClick: handler
        });
    }


    addCtrl(item, pitem){
        var param = {
            pkorg: this.state.refOrg.value ? this.state.refOrg.value.refpk: undefined,
            pk_accsystem: this.state.refSystem.value.refpk,
            pk_accchart: this.state.charttree.selectedKeys[0],
            nodetype: this.config.nodetype
        };
        this.loadCtrlForm(param, (data)=>{
            this.fillCtrlForm(data,() => {
                this.state.ctrlEdit = true;
                this.setState(this.state, () => {
                    this.props.form.setFormStatus('ctrlrule', 'edit');
                    this.props.cardTable.setStatus('ctrlrule_account', 'edit');
                    this.props.cardTable.setStatus('ctrlrule_org', 'edit');
                    this.updateBtnStatus();
                });
            });
        });
    }

    editCtrl(item, pitem){
        var param = {
            id: item.key
        }
        this.loadCtrlForm(param, (data)=>{
            this.fillCtrlForm(data, () =>{
                this.state.ctrlEdit = true;
                this.setState(this.state, () => {
                    this.props.form.setFormStatus('ctrlrule', 'edit');
                    this.props.cardTable.setStatus('ctrlrule_account', 'edit');
                    this.props.cardTable.setStatus('ctrlrule_org', 'edit');
                    this.updateBtnStatus();
                });
            });

        });
    }

    cancelCtrl(){
        var handler = () =>{
            this.loadCtrlForm({id: this.state.ctrltree.selectedKeys[0]}, (data) => {
                this.state.ctrlEdit = false;
                this.setState(this.state,() => {
                    this.updateBtnStatus();
                    this.fillCtrlForm(data, () =>{
                        this.state.ctrlEdit = false;
                        this.props.form.setFormStatus('ctrlrule', 'browse');
                        this.props.cardTable.setStatus('ctrlrule_account', 'browse');
                        this.props.cardTable.setStatus('ctrlrule_org', 'browse');
                    });
    
                });
            });
        };
       

        promptBox({
            color:"warning",
            title: this.lang['ACCCHART-000023'],/* 国际化处理： 确认取消*/
            content: this.lang['ACCCHART-000024'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: handler
        });
    }
    delCtrl(item, pitem){
        var handler = () =>{
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableControlDelAction.do',
                data:{pk_accctrlrule: item.key},
                success: (result) => {
                    toast({title : this.lang['ACCCHART-000025'],color : 'success'});/* 国际化处理： 删除成功！*/
                    this.loadCtrlTree((datas) => {
                        this.state.ctrlEdit = false;
                        this.state.ctrltree = {
                            ...this.state.ctrltree,
                            datas: datas
                        };
                        this.setState(this.state, () => {
                            this.props.form.EmptyAllFormValue('ctrlrule');
                            this.props.cardTable.setTableData('ctrlrule_org', {rows:[] });
                            this.props.cardTable.setTableData('ctrlrule_account',  {rows:[] });
                            this.props.cardTable.setTableData('ctrlrule_rule', {rows:[] });
                        });
                    });
                }
            });
        }
       

        promptBox({
            title: this.lang['ACCCHART-000026'],/* 国际化处理： 确认删除*/
            content: this.lang['ACCCHART-000028'],/* 国际化处理： 是否确认要删除?*/
            beSureBtnClick: handler
        });

    }

    onChartRefresh(){
        this.initPage(() =>{
            toast({title : this.lang['ACCCHART-000084'],color:'success'});/* 国际化处理： 未设置管控模式*/
        });
    }

    onCtrlRefresh(){
        this.loadCtrlTree((datas) => {
            this.state.ctrlEdit = false;
            this.state.ctrltree = {
                ...this.state.ctrltree,
                datas: datas,
                selectedKeys :  []
            };
            this.setState(this.state, () => {
                this.props.form.EmptyAllFormValue('ctrlrule');
                this.props.cardTable.setTableData('ctrlrule_org', {rows:[] });
                this.props.cardTable.setTableData('ctrlrule_account',  {rows:[] });
                this.props.cardTable.setTableData('ctrlrule_rule', {rows:[] });
                this.updateBtnStatus();
                toast({title : this.lang['ACCCHART-000084'],color:'success'});/* 国际化处理： 未设置管控模式*/
            });
        });

        // this.loadCtrlTree(() => {
        //     this.props.form.EmptyAllFormValue('ctrlrule');
        //     this.updateBtnStatus();
        // });
    }

    saveCtrl(){
        if(!this.props.form.isCheckNow('ctrlrule')){
            return;
        }
        var data = {
            model:{
                rows:[{
                    values: this.props.form.getAllFormValue('ctrlrule').rows[0].values,
                    rowid: 0
                }],
                areacode: 'ctrlrule'
            },
            pageid: this.config.pagecode
        };

        var sumbitHander = (data, callback) => {
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableControlEditAction.do',
                data:data,
                success: (result) => {callback && callback(result);}
            });
        };

        var afterHander = (result) =>{
            this.props.form.setFormStatus('ctrlrule', 'browse');
            this.loadCtrlTree((datas) => {
                this.state.ctrlEdit = false;
                this.state.ctrltree = {
                    ...this.state.ctrltree,
                    selectedKeys: [result.data.pk_accctrlrule],
                    datas: datas
                };
                this.setState(this.state, () => {
                    this.loadCtrlForm({id: result.data.pk_accctrlrule}, (d) => {
                        this.fillCtrlForm(d);
                        this.updateBtnStatus();
                    });
                });
            });
        };

        var allHander = () =>{
            sumbitHander(data, (result) => {
                if(result.data.pk_accctrlrule){
                    afterHander(result);
                    return;
                }
                this.state.ctrlTip.createOrg.config = {
                    show: true,
                    onClick : (yes) =>{
                        this.state.ctrlTip.createOrg.config.show = false;
                        this.setState(this.state, () => {
                            sumbitHander({...data, checked: yes}, (result) => {
                                afterHander(result);
                            });
                        });
                    }
                };
                this.setState(this.state);
            });
        }
        this.props.validateToSave( data , () =>{
            allHander();
        } , {ctrlrule: 'form'},'form');


      
    }
    addRowAccount(){
        //为允许
        var isallinherit = this.props.form.getAllFormValue('ctrlrule').rows[0].values.isallinherit.value;
        var isselectrule = this.state.ctrltree.selectedKeys.length != 1
        if(isallinherit || isselectrule){
            toast({content:this.lang['ACCCHART-000059'],color : 'warning'});/* 国际化处理： 继承科目表全部科目时不可用*/
            return;
        }

        var editParam = {
            mode: 'add',
            pkacctable: this.state.charttree.selectedKeys[0],
            pk_accctrlrule  : this.state.ctrltree.selectedKeys[0],
            onFinish:() => {
                var data = this.assignCtrlItem.getData();
                ajax({
                    url: '/nccloud/uapbd/acctable/AccTableControlEditTableItemAction.do',
                    data:data,
                    success:(result)=> {
                        this.loadCtrlForm({id: this.state.ctrltree.selectedKeys[0]}, (data) => {
                            this.fillCtrlForm(data);
                            this.assignCtrlItem.oncancel();
                        });
                    }
                });
            }
        };
        this.assignCtrlItem.show(editParam);
    }

    deleteRowAccount(){
        //为允许
        var isallinherit = this.props.form.getAllFormValue('ctrlrule').rows[0].values.isallinherit.value;
        if(isallinherit){
            toast({content:this.lang['ACCCHART-000059'],color : 'warning'});/* 国际化处理： 继承科目表全部科目时不可用*/
            return;
        }
        var editParam = {
            mode: 'remove',
            pk_accctrlrule  : this.state.ctrltree.selectedKeys[0],
            onFinish:() => {
                var data = this.assignCtrlItem.getData();
                ajax({
                    url: '/nccloud/uapbd/acctable/AccTableControlEditTableItemAction.do',
                    data:data,
                    success:(result)=> {
                        promptBox({
                            color: 'success',
                            content: result.data,
                            hasCloseBtn:true,
                            noFooter: false,
                            noCancelBtn:true
                           });
                        this.loadCtrlForm({id: this.state.ctrltree.selectedKeys[0]}, (data) => {
                            this.fillCtrlForm(data);
                            this.assignCtrlItem.oncancel();
                        });
                    }
                });
            }
        };
        this.assignCtrlItem.show(editParam);
    }

    editCtrlOrg(){
        //为允许
        var allowallsubuse = this.props.form.getAllFormValue('ctrlrule').rows[0].values.allowallsubuse.value;
        if(allowallsubuse){
            toast({content:this.lang['ACCCHART-000060'],color : 'warning'});/* 国际化处理： 允许全部直接下级组织细化时不能编辑*/
            return;
        }

        var submitHander = (param, callback) => {
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableControlEditRuleOrgAction.do',
                data: param,
                success:(result)=> {
                    callback && callback(result);
                }
            });
        };

        //-----mz
        var datas = this.props.cardTable.getAllData('ctrlrule_org');
        var initOrgData = {
            curgroup:[]
        };

        datas.rows.forEach(data =>{
            var pkgroup = data.values.pk_group.value;
            var pkorg   = data.values.pk_org.value;
            if(!initOrgData[pkgroup]){
                initOrgData[pkgroup] = [];
            }
            initOrgData[pkgroup].push(pkorg);

        });
        this.assignCtrlOrg.show({
            pkrule: this.state.ctrltree.selectedKeys[0],
            initOrgData: initOrgData
        }, () => {
            var param =  {
                orgdata : this.assignCtrlOrg.getData(),
                pk_accctrlrule  : this.state.ctrltree.selectedKeys[0]
            };
            submitHander(param, (result) => {
                if(result.data){
                    this.loadCtrlForm({id: this.state.ctrltree.selectedKeys[0]}, (data) => {
                        this.fillCtrlForm(data);
                    });
                    this.assignCtrlOrg.oncancel();
                    return;
                }
                this.state.ctrlTip.createOrg.config = {
                    show: true,
                    onClick : (yes) =>{
                        this.state.ctrlTip.createOrg.config.show = false;
                        this.setState(this.state, () => {
                            submitHander({...param, checked: yes}, (result) => {
                                this.loadCtrlForm({id: this.state.ctrltree.selectedKeys[0]}, (data) => {
                                    this.fillCtrlForm(data);
                                });
                                this.assignCtrlOrg.oncancel();
                                return;
                            });
                        });
                    }
                };
                this.setState(this.state);
            });
        });
    }

    onAddVersion(){
        var myDate = new Date(new Date().getTime() + 24*60*60*1000);
        var year  = myDate.getFullYear(),
            month = myDate.getMonth() +1,
            date  = myDate.getDate()
        var value =   year+'-'+ (month <10 ? ('0' + month) : month ) + '-'+ (date < 10 ? ('0'+ date) : date);        //获取当前日(1-31)
        this.state.version.rest();
        this.state.version.config.show = true;
        this.state.version.datepicker.value = value;
        this.setState(this.state);
    }

    onaccmap(callback){
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapLoadDataAction.do',
            data:{
                pagecode:this.config.pagecode,
                pk_accchart:this.state.refChartVersion.value
            },
            success:(result)=> {
                this.state.accmap.config.show = true;
                if(result.data){
                    this.props.editTable.setTableData("accmap", result.data["accmap"]);
                }else{
                    this.props.editTable.setTableData("accmap", {rows:[]});
                }
                callback && callback();
                this.setState(this.state);
                this.updateBtnStatus();
            }
        });
    }

    onAccmapAfterEvent(props, moduleId, key, value, changedrows, index,record){
        let data = {
            pageid:this.config.pagecode,
            model : {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows[0] = record;
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapEditAfterAction.do',
            data,
            success: (result)=> {
                if(result.data){
                    result.data["accmap"].rows[0].values['pk_oldaccount'].value = value.refpk,
                    result.data["accmap"].rows[0].values['pk_oldaccount'].display = value.refcode
                    this.props.editTable.updateTableData("accmap", result.data["accmap"]);
                }
            }
        });
    }

    onAccmapBeforeEvent(props,moduleId, item,index,value, record){
        if(record.values["pk_newaccount.endflag"].value=='N'){
            return false
        }else{
            this.state.accmap.pk_acctype = record.values["pk_newaccount.pk_account.pk_acctype.pk_acctype"].value;
            return true;
        }
    }

    loadDatarefChartVersion(callback){//加载科目版本日期；
        this.state.refChartVersion.value = null;
        this.state.accmap.tempversionflag = false;
        ajax({
            loading:true,
            url:'/nccloud/uapbd/account/ListVersionAction.do',
            data:{'pk_accchart': this.state.charttree.selectedKeys ? this.state.charttree.selectedKeys[0]: ''},//修改20180814-20：49，发现参照突然变成了数组了
            success:(res) => callback && callback(res.data || [])
        });
    }

    fillDatarefChartVersion(datas= []){
        if(datas.length<=1){
            return
        }
        let newDatas = datas.filter(data=>
            data.endperiod === '9999-99-99'&&data.originalchart!=data.pk_accchart
        )
        this.state.refChartVersion.datas = newDatas;
        //根据查询到科目表的所有版本信息，过滤出最新的值，返回给调用者
        let retChart = undefined;
        if(newDatas.length>0)
            retChart = newDatas[0];
        if(newDatas.length > 1){
            newDatas.forEach((ele)=>{
                if(ele.tempversionflag  === true){
                    retChart = ele;
                }
            })
        }
        this.state.refChartVersion.value = retChart.pk_accchart;
        this.state.accmap.tempversionflag = retChart.tempversionflag;
        this.updateBtnStatus()
    }

    clickaccmapSearchBtn(props,searchVal) {
        let queryInfo = this.props.search.getQueryInfo("accmapsearch");
        let data = {
            nodeType:this.config.nodeType,
            querycondition: searchVal==null?null:searchVal,
            pagecode: this.config.pagecode?this.config.pagecode:null,
            pk_accchart:this.state.refChartVersion.value,
            queryAreaCode: "accmapsearch",
            oid:queryInfo.oid,
            querytype:'tree'
        };
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapLoadDataAction.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.editTable.setTableData("accmap", data["accmap"]);
                        this.props.button.setDisabled({
                            accmap_print:data["accmap"]<=0,
                            accmap_output:data["accmap"]<=0,
                        })
                    } else {
                        this.props.editTable.setTableData("accmap", { rows: [] });
                        this.props.button.setDisabled({
                            accmap_print:true,
                            accmap_output:true,
                        })
                    }
                }
            }
        });
    };

    saveAccmap(){
        let tableData = this.props.editTable.getChangedRows("accmap",true);
        if(!tableData || tableData.length === 0) {
            toast({content:this.lang['ACCCHART-000061'],color : 'warning'});/* 国际化处理： 没有要修改的数据！,没有要修改的数据*/
            return
        }
        if(!this.props.editTable.checkRequired("accmap", this.props.editTable.getAllRows("accmap",true))) {
            return
        }
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapbatchSaveVOsAction.do',
            data:{
                pageid:this.config.pagecode,
                model : {
                    areaType: "table",
                    pageinfo: null,
                    rows: tableData,
                }
            },
            success:(result)=> {
                if(result.data){
                    this.props.editTable.setStatus("accmap","browse");
                    this.state.accmapEdit = false;
                    this.onaccmap();
                }
            }
        });
    }

    checkAccmap(){
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapCheckAction.do',
            data:{
                pagecode:this.config.pagecode,
                pk_accchart:this.state.refChartVersion.value
            },
            success:(result)=> {
                this.state.check.config.show = true;
                if(result.data){
                    this.props.editTable.setTableData("account", result.data["account"]);
                }else{
                    if(!this.state.check.ischeck){
                        this.AccmapValidate();
                        return
                    }
                    this.props.editTable.setTableData("account", {rows:[]});
                }
                this.setState(this.state);
            }
        });
    }

    AccmapAutomatch(){
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapAutoMatchAction.do',
            data:{
                pagecode:this.config.pagecode,
                pk_accchart:this.state.refChartVersion.value
            },
            success:(result)=> {
                if(result.data){

                }
            }
        });
    }
   
    AccmapValidate(){
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapEffectAction.do',
            data:{
                pagecode:this.config.pagecode,
                pk_accchart:this.state.refChartVersion.value
            },
            success:(result)=> {
                if(result.data){
                    this.state.accmap.tempversionflag = false;
                    this.state.check.config.show = false;
                    this.changeMeta(false);
                    this.props.button.setDisabled({
                        accmap_edit:true,
                        accmap_check:true,
                        accmap_validate:true,
                        accmap_unvalidate:false,
                    })
                    this.setState(this.state);
                    this.onaccmap();
                }
            }
        });
    }
    //科目对照合并列
    getAccmapShowCol = (tempversionflag) => {
        let gridMultiple = {};
        if(tempversionflag){ //目前调试发现合并列children不能添加判断条件，只能固定值，先这样啰嗦处理
            gridMultiple = {
                accmap: [
                    {
                        name: this.lang['ACCCHART-000016'],/* 国际化处理： 新版本*/
                        code: "newversion",
                        children: ["pk_newaccount.pk_account.pk_accchart", "pk_newaccount.pk_account.pk_acctype","pk_newaccount.pk_account.code","pk_newaccount.name","pk_newaccount.pk_account.balanorient"]
                    },
                    {
                        name: this.lang['ACCCHART-000017'],/* 国际化处理： 旧版本*/
                        code: "oldversion", //取消生效，即未生效时显示的旧版本模版
                        children: ["pk_oldaccount.pk_account.pk_acctype", "pk_oldaccount","pk_oldaccount.name","pk_oldaccount.pk_account.balanorient"]//未生效
                    }
                ]
            };
        }else {
            gridMultiple = {
                accmap: [
                    {
                        name: this.lang['ACCCHART-000016'],/* 国际化处理： 新版本*/
                        code: "newversion",
                        children: ["pk_newaccount.pk_account.pk_accchart", "pk_newaccount.pk_account.pk_acctype","pk_newaccount.pk_account.code","pk_newaccount.name","pk_newaccount.pk_account.balanorient"]
                    },
                    {
                        name: this.lang['ACCCHART-000017'],/* 国际化处理： 旧版本*/
                        code: "oldversion", //生效时显示的旧版本模版
                        children: ["pk_oldaccounthis.pk_account.pk_acctype", "pk_oldaccounthis.pk_account.code","pk_oldaccounthis.name","pk_oldaccounthis.pk_account.balanorient"]//未生效
                    }
                ]
            };
        }
        return gridMultiple
    }
    //根据是否生效改变科目对照字段的显隐性
    changeVisibleCol = (accmapplate, oldversionKey) => {
        let showKeys = ["pk_newaccount.pk_account.pk_accchart", "pk_newaccount.pk_account.pk_acctype","pk_newaccount.pk_account.code","pk_newaccount.name","pk_newaccount.pk_account.balanorient"];
        showKeys.push(...oldversionKey)
        accmapplate && accmapplate.items && accmapplate.items.map((item)=>{
            item.visible = showKeys.includes(item.attrcode);
            if(item.attrcode == 'pk_oldaccount'){
                item.refcode = 'uapbd/refer/fiacc/AccountGridRef/index.js';
                item.queryCondition=()=>{
                    return {
                        pk_accchart:this.state.charttree.selectedKeys[0],
                        pk_acctype:this.state.accmap.pk_acctype,
                        GridRefActionExt: 'nccloud.web.uapbd.acctable.action.AccountGridRefExt'
                    }
                }
            }
        })
    }
    //根据是否生效改变科目对照模板
    changeMeta = (tempversionflag) => {
        let meta = this.props.meta.getMeta();
        let gridMultiple = this.getAccmapShowCol(tempversionflag);
        if(meta.accmap && meta.accmap.items){
            let tempData = deepClone(this.accmapTemplate)
            meta.accmap = tempData;
            this.changeVisibleCol(meta.accmap, gridMultiple.accmap[1].children)
        }
        let tempMeta = this.props.meta.handleMultiple(meta, gridMultiple);
        this.props.meta.setMeta(tempMeta);           
    }
    AccmapUnValidate(){
        ajax({
            url: '/nccloud/uapbd/acctable/AccMapUnEffectAction.do',
            data:{
                pagecode:this.config.pagecode,
                pk_accchart:this.state.refChartVersion.value
            },
            success:(result)=> {
                if(result.data){
                    this.state.accmap.tempversionflag = true;
                    this.changeMeta(true);
                    this.props.button.setDisabled({
                        accmap_edit:false,
                        accmap_check:false,
                        accmap_validate:false,
                        accmap_unvalidate:true,
                    })
                    this.setState(this.state)
                    this.onaccmap();
                }
            }
        });
    }

    AccmappintFunction(param){
        let allDatas = this.props.editTable.getAllData("accmap");
        let pks = [];
        allDatas.rows.forEach((item,index)=>{
            pks.push(item.values['pk_accmap'].value)
        })
        if(pks.length==0){
            return
        }
        param.oids = pks;
        print(
            'pdf',
            '/nccloud/uapbd/acctable/AccmapPrintAction.do',
            param
        );
    }

    onSaveVersion(){
        var {checkbox,datepicker,refCtrlRule }  = this.state.version;
        if(datepicker.value){
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableVersionAddAction.do',
                data:{
                    istemp:checkbox.checked,
                    period:datepicker.value,
                    pk_accctrlrule: refCtrlRule.value ? refCtrlRule.value.refpk: '',
                    pk_accchart:this.state.charttree.selectedKeys[0]
                },
                success:(result)=> {
                    toast({title:this.lang['ACCCHART-000055'],color : 'success'});/* 国际化处理： 保存成功*/
                    this.state.version.config.show = false;
                    this.setState(this.state,() =>{
                        this.initPage();
                    });
                }
            });
        } else {
            toast({color:'warning',content:this.lang['ACCCHART-000085']}); /* 国际化处理： 请选择新版本生效日期*/
        }
        
    }


    onDeleteVersion(){
        var {checkbox,datepicker,refCtrlRule }  = this.state.version;
        var preHander = (pk_accchart, predo ,callback) =>{
            ajax({
                url: '/nccloud/uapbd/acctable/AccTableVersionDelAction.do',
                data:{
                    pk_accchart:this.state.charttree.selectedKeys[0],
                    predo: predo
                },
                success:(result)=> {
                    callback && callback(result.data);
                }
            });
        };

        var pk_accchart = this.state.charttree.selectedKeys[0];
        preHander(pk_accchart, true, (istemp) =>{
            promptBox({
                title: this.lang['ACCCHART-000026'],/* 国际化处理： 确认删除*/
                content: istemp ? this.lang['ACCCHART-000062'] : this.lang['ACCCHART-000064'],/* 国际化处理： 删除临时将删除对照信息,确认是否删除?,删除版本将删除当前科目表及其下级科目表的最新版本，确定要执行此操作吗?,删除临时将删除对照信息,确认是否删除,删除版本将删除当前科目表及其下级科目表的最新版本,确定要执行此操作吗*/
                beSureBtnClick: () => {
                    preHander(pk_accchart, false, () =>{
                        toast({title:this.lang['ACCCHART-000056'],color : 'success'});/* 国际化处理： 删除成功*/
                        this.initPage();
                    });
                }
            });

        });
        // var handler = () =>{
        //     ajax({
        //         url: '/nccloud/uapbd/acctable/AccTableVersionDelAction.do',
        //         data:{
        //             pk_accchart:this.state.charttree.selectedKeys[0]
        //         },
        //         success:(result)=> {
        //             toast({title:'提示',content:'操作删除版本操作成功'});
        //             this.initPage();
        //         }
        //     });
        // };
        // // this.props.modal.show('modal',{
        // promptBox({
        //     title: "确认删除",
        //     content: "删除版本将删除当前科目表及其下级科目表的最新版本，确定要执行此操作吗?",
        //     beSureBtnClick: handler
        // });
    }

    onAssign(mode = 'assign'){
        this.AssignStepModal.show({
            pk_accchart: this.state.charttree.selectedKeys[0],
            mode: mode == 'assign' ? 'add' : 'del'
        }, () =>{
            var rule = this.AssignStepModal.getRuleData(),
                account = this.AssignStepModal.getAccountData();
            // this.props.modal.show('modal',{
            promptBox({
                title: mode == 'assign'? this.lang['ACCCHART-000029'] : this.lang['ACCCHART-000030'],/* 国际化处理： 确认分配,确认取消分配*/
                content:  mode == 'assign'? this.lang['ACCCHART-000031'] : this.lang['ACCCHART-000032'],/* 国际化处理： 是否确认要分配,是否要确认取消分配*/
                beSureBtnClick: () =>{
                    ajax({
                        url: '/nccloud/uapbd/acctable/BatchAssignAction.do',
                        data:{
                            pk_accchart:this.state.charttree.selectedKeys[0],
                            mode: mode,
                            pk_rule:rule,
                            pk_account:account
                        },
                        success:(result)=> {
                            var msgs = result.data;
                            if(msgs && msgs.length > 0){
                                promptBox({
                                    color: 'success',
                                    title:mode == 'assign'?'部分批量分配成功':'部分批量取消分配成功',
                                    content: msgs,
                                    hasCloseBtn:true,
                                    noFooter: false,
                                    noCancelBtn:true
                                   });
                                // toast({color:'warning',content:msgs});
                            }                            
							toast({title: mode == 'assign'? this.lang['ACCCHART-001001']:this.lang['ACCCHART-001002'] ,color : 'success'});/* 国际化处理： 操作成功*/
                            this.AssignStepModal.cancel();
                        }
                    });
                },
                cancelBtnClick:() =>{
                    this.AssignStepModal.cancelSucess();
                }

            });

        });
    }
};
export default Accitemtable;

//v4ZTAApAQgVtFynMWoMUipHk1ZJGyqjySrBOAB7b6Jie9OxA3atQFKI3kIxvzReE