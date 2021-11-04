//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast , print, high,promptBox,createPageIcon, excelImportconfig, getLangCode } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCIcon,NCFormControl,NCPopconfirm,NCBackBtn,NCAffix, NCDiv } = base;

import Utils from '../../../public/utils/index.js';
import deepClone from '../../../public/utils/deepClone';
//import RefSystem from '../../../refer/org/AccountBookTreeRef/index';
import utils from '../../../public/utils';
const {showFormular } = utils;
import RefOrg from '../../../refer/org/FinanceOrgTreeRef/index.js';
import RefSystem from '../../../refer/fiacc/AccSystemGridRef/index.js';
import RefChart from '../../../refer/fiacc/AccChartTreeRef/index.js';
import RefAccount from '../../../refer/fiacc/AccountGridRef/index.js';
import RefCalItem from '../../../refer/fiacc/AccAssItemGridRef/index.js';
import BatchEditStepModal from '../batchEdit/BatchEditStepModal.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less'
import { relative } from 'path';
import {codeUtilsParseCodeRule,codeUtilsGetParentCode,codeUtilsGetAccLev} from '../public/index'
import HeaderArea from '../../../public/pubComponent/HeaderArea';
const {PrintOutput, ExcelImport} = high;

// 计算主表表体高度//这一段摘自平台的treeTableManyCols组件，配合isDragbel使用
let tableHeight = 0;
const screenHeight = window.screen.width;

if (1919 >= screenHeight > 1440) {
  tableHeight = 48 * 10 + "px";
} else if (screenHeight > 1919) {
  tableHeight = 56 * 10 + "px";
} else {
  tableHeight = 40 * 10 + "px";
}


var createUIDomParam = function(pagecode, appcode){
    var param = {
        pagecode:pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? {...param, appcode: appcode} : param;
};

	
const defaultFlag = 'Y',defaultFlagNo = 'N',defaultSeperator = ',',defaultLinker = '-';//added by liusenc 这个用来做受控模块的字符串拼接；




class Account extends Component {
    constructor(props) {
        super(props);
        this.config = props.config;
        this.ajaxno = 1;
        this.init = false;
         //init template button
         createUIDom(props)({
            ...createUIDomParam(this.props.config.pagecode, this.props.config.appcode)
            //pagecode:this.props.config.pagecode
            // appcode: this.props.config.appcode
        },{moduleId: "10140ACCB",domainName: 'uapbd' } ,(data,lang)=> {

            this.lang = lang;
            if(this.config.nodetype === 'glb')
            {
                this.config.title = this.lang['10140ACCB-000049']+"-"+this.lang['10140ACCB-000050'];/* 国际化处理： 会计科目-全局,会计科目,全局*/
            }else if (this.config.nodetype === 'grp'){
                this.config.title = this.lang['10140ACCB-000049']+"-"+this.lang['10140ACCB-000051'];/* 国际化处理： 会计科目-集团,会计科目,集团*/
            }else{
                this.config.title = this.lang['10140ACCB-000018'];/* 国际化处理： 会计科目-组织*/
            }            
            this.state = this.createState();
            if(this.config.nodetype === 'org'){
                let ccontext = data.context || {};
                if(ccontext.pk_org){
                    this.state.refOrg.value = {};
                    this.state.refOrg.value.refpk2 = 'finance' + ccontext.pk_org;//财务组织比较特殊，这里必须得设一个refpk2,仅仅是为了显示；
                    this.state.refOrg.value.refpk = ccontext.pk_org;
                    this.state.refOrg.value.refcode = "";
                    this.state.refOrg.value.refname =  ccontext.org_Name;
                    this.state.refOrg.value.values = {
                        name:{
                            display:null,
                            scale:"-1",
                            value:ccontext.org_Name
                        },
                        code:{
                            display:null,
                            scale:"-1",
                            value:"",
                        }
                    }
                }
            }
            this.setState(this.state, () => {
                //在这里对查询模板条件置一下参照条件；added by liusenc 20180814
                data = this.modifierSearchTemplate(data);
                var listModulesTemplate = {
                    'clazz': 'nc.vo.bd.account.AccCtrlModuleVO',
                    'code': 'listModules',
                    'moduletype': 'table',
                    'name': this.lang['10140ACCB-000047'],/* 国际化处理： 受控模块*/
                    'vometa':"uap.accctrlmodule",
                    'items':[
                    {
                        'itemtype': 'input',
                        'label': this.lang['10140ACCB-000053'],/* 国际化处理： 受控模块编码*/
                        'attrcode': 'code',
                        'visible': true,
                        'maxlength': '20',
                        'disabled': true,
                        'metapath': 'code',
                    },
                    {
                        'itemtype': 'input',
                        'label': this.lang['10140ACCB-000054'],/* 国际化处理： 受控模块名称*/
                        'attrcode': 'name',
                        'visible': true,
                        'maxlength': '20',
                        'disabled': true,
                        'metapath': 'name'
                    },
                    {
                        'itemtype': 'switch',
                        'label': this.lang['10140ACCB-000055'],/* 国际化处理： 标志*/
                        'attrcode': 'flag',
                        'visible': false,
                        'maxlength': '20',
                        'disabled': true,
                        'metapath': 'flag'
                    }
                        
                    ]
                }; 
                //在这里处理自定义项单据模板
                let defArrys = ['def1','def2','def3','def4','def5'];
                let defIndex = 0;
                let defLength = data.template['formAccount'].items.length;
                for(;defIndex < defLength;defIndex++){
                    let ele = data.template['formAccount'].items[defIndex];
                    if(!( defArrys.indexOf(ele.attrcode) < 0)){//存在
                        let cpos = ele.position;
                        data.template['test'] && data.template['test'].items && data.template['test'].items.forEach((tele)=>{
                            if(tele.attrcode == ele.attrcode){
                                data.template['formAccount'].items[defIndex] = deepClone(tele);
                                data.template['formAccount'].items[defIndex].position = cpos;
								data.template['formAccount'].items[defIndex].visible = false;//因为可以设置关联区域了，所以这里不再显示；
                            }
                        })
                    }
                } 
                let defLength2 = data.template['listAccount'].items.length;
                for(defIndex = 0;defIndex < defLength2;defIndex++){
                    let ele2 = data.template['listAccount'].items[defIndex];
                    if(!(defArrys.indexOf(ele2.attrcode) <0)){
                        data.template['test'] && data.template['test'].items && data.template['test'].items.forEach((tele)=>{
                            if(tele.attrcode == ele2.attrcode){
                                data.template['listAccount'].items[defIndex].visible = tele.visible;
                            }
                        });
                    }
                }                          
                data.template['listModules'] = listModulesTemplate;
                //data.template['listModules\u0026childform1'] = listModulesTemplate1;
                //data.template['listModules\u0026childform2'] = listModulesTemplate2;
                this.state.search.oid = data.template.search.oid;
                this.batEditSearchOid = data.template.batEditSearch.oid;
                this.state.template = data.template;
                this.state.listPanel.listtree.columns = this.createTreeCols(this.state.template);
                props.meta.setMeta(data && data.template ? data.template:{} , () =>{
                    let excelImportConfig = excelImportconfig(props, 'uapbd', 'account', true, '', {appcode:this.config.appcode, pagecode:this.config.pagecode});
                    props.button.setUploadConfig('import', excelImportConfig);
                    props.button.setButtons(data && data.button ? data.button: {}, () =>{
                        props.button.setMainButton('add',true);//
                        setTimeout(() => {
                            /*
                            if(this.config.nodetype === 'org'){
                                let ccontext = data.context || {};
                                if(ccontext.pk_org){
                                    this.state.refOrg.value = {};
                                    this.state.refOrg.value.refpk = ccontext.pk_org;
                                    this.state.refOrg.value.refname =  ccontext.org_Name;
                                }
                            }
                            */
                            this.init = true;
                            this.setState(this.state, () => {
                                this.updateButtonStatus();
                            });
                        }, 0);
                    });
                });
            });
        }); 
        this.appcode = props.getUrlParam('c') || props.getSearchParam('c');       
    }

    createState(){
        //通用state
        var stateBase = {
            curIndex : 0,
            isFirst : false,
            isEnd : false,//added by liusenc 20181211 用于卡片页面的翻页按钮；
            editMode: false,
            showMode: 'list',
            editModeCfg : { //在编辑态时用来判断当前的VO是创建还是编辑的,设置一些在编辑前的数据,为了在有错误时回滚
                handlerMode: 'create',
                srcpk: undefined,
                srccode:''
            },
            template: {},
            printpks:[],//这个用来记录打印的pks
            printnodekey:'',//这个用来记录打印的nodekey
            searchConditions:{},//发现一个问题20180814，取高级查询条件总是为空，这里设置一下：modified by liusenc
            search:{
                //id: 'search',
                //defaultConditionsNum:2,
                //oid:'0001AA1000000000JL91',
                clickSearchBtn: (props,data,tyep,queryInfo) => {
                    //在这里校验一下是否选择科目体系和科目表；如果未选中，则提示返回；added by liusenc 20180814
                    if(!this.state.refSystem.value || !this.state.refChart.value){
                        toast({color:'warning',content:this.lang['10140ACCB-000025']});/* 国际化处理： 请选择科目体系和科目表!,请选择科目体系和科目表*/
                        return;
                    }
                    //
                    this.state.searchConditions = props.search.getAllSearchData('search');
                    this.setState(this.state,()=>{
                        this.routerToList(()=>{
                            let nrecords = this.state.listPanel.listPrintpks.length;
                            console.log(this.lang['10140ACCB-000011']+nrecords+this.lang['10140ACCB-000012']);/* 国际化处理： 共打印出了,条记录！*/
                            if(nrecords >0){
                                toast({ color: 'success', content: this.lang['10140ACCB-000027']+","+this.lang['10140ACCB-000028']+nrecords+this.lang['10140ACCB-000029'] });/* 国际化处理： 查询成功,共,条,查询成功,共*/
                            }else{
                                toast({content:this.lang['10140ACCB-000013'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据!*/
                            }
                        });

                    });
                }
            }
        };

        //参照state
        var stateRef = {
            refOrg: {
                fieldid: 'refOrg',
                value: undefined,
                onChange: (value) => {
                    var {refOrg, refSystem, refChart, refChartVersion} = this.state;
                    refOrg.value = value;
                    refSystem.value = undefined;
                    refChart.value = undefined;
                    refChartVersion.value = undefined;
                    this.state.listPanel.listtree.selectedRecord = undefined;//20181212
                    refChartVersion.datas = [];
                    refChartVersion.isTemp = false,//added by liusenc 20180920是否为临时版本标志
                    refChartVersion.isNewVersion = false,//默认为否；
                    refChartVersion.isFirstVersion = false,//默认为否；是否为第一版；
                    refChartVersion.pk_originalChart = "",//这个字段记录的是原始科目表信息；在科目表版本发生变化的时候，根据这个值来设置当前选中版本是否为第一版
                    refChartVersion.pk_newVersionChart = "",//这个字段记录的是最新版本科目表的pk，用来辅助确认当前选中的版本是否是最新版本；                    
                    this.setState(this.state, () => {
                        //this.updateButtonStatus();
                        this.fillDataTree([], () => {
                            this.updateButtonStatus();
                        }); 
                    });
                },
                queryCondition: () => {
                    return{
                        AppCode: this.appcode, //'10140ACCO'
                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                    }
                }					
            },
            refSystem:{
                fieldid: 'refSystem',
                value:undefined,
                onChange: (value) => {
                    var {refOrg, refSystem, refChart, refChartVersion} = this.state;
                    this.state.refSystem.value = value;
                    refChartVersion.value = undefined;
                    this.state.listPanel.listtree.selectedRecord = undefined;//20181212
                    this.state.listPanel.classbtn.selectNumber = undefined; //切换体系时清空选中分类
                    this.state.listPanel.classbtn.curBtn = undefined; 
                    refChartVersion.datas = [];
                    refChartVersion.isTemp = false,//added by liusenc 20180920是否为临时版本标志
                    refChartVersion.isNewVersion = false,//默认为否；
                    refChartVersion.isFirstVersion = false,//默认为否；是否为第一版；
                    refChartVersion.pk_originalChart = "",//这个字段记录的是原始科目表信息；在科目表版本发生变化的时候，根据这个值来设置当前选中版本是否为第一版
                    refChartVersion.pk_newVersionChart = "",//这个字段记录的是最新版本科目表的pk，用来辅助确认当前选中的版本是否是最新版本； 
                    this.state.refChart.value = undefined;
                    this.setState(this.state, () => {
                        //this.updateButtonStatus();
                        this.fillDataTree([], () => {
                            this.updateButtonStatus();
                        }); 
                    });
                }
            },
            refChart:{
                fieldid: 'refChart',
                value:undefined,
                queryCondition:() =>{
                    return {
                        ...this.config,
                        pk_accsystem : this.state.refSystem.value? (this.state.refSystem.value instanceof Array ? this.state.refSystem.value[0].refpk : this.state.refSystem.value.refpk) : '',
                        pk_org : this.state.refOrg.value ? (this.state.refOrg.value instanceof Array ? this.state.refOrg.value[0].refpk : this.state.refOrg.value.refpk) : '',//20180815modified by liusenc 发现组织参照返回的是数组适配
                        TreeRefActionExt:'nccloud.web.uapbd.account.action.RefCondAccChart'
                    };
                },
                onChange: (value) => {
                    this.state.refChart.value = value;
                    //console.log( this.state.refChart.value instanceof Array);
                    this.state.refChartVersion.value = undefined;
                    this.state.listPanel.listtree.selectedRecord = undefined;//20181212
                    this.state.refChartVersion.datas = [];
                    this.setState(this.state, ()=> {
                        if(value.refpk !== undefined){
                        this.loadDatarefChartVersion( data  => {
                            //var lastData = this.fillDatarefChartVersion(data);
                            this.state.refChartVersion.datas = data;
                            //根据查询到科目表的所有版本信息，过滤出最新的值，返回给调用者
                            let retChart = undefined;
                            if(data.length > 0){
                                data.forEach((ele)=>{
                                    if(ele.endperiod === '9999-99-99'){
                                        retChart = ele;
                                    }
                                    //在这个地方设置一下第一版本科目表信息；
                                    if(this.state.refChartVersion.pk_originalChart.trim() === ""){
                                        this.state.refChartVersion.pk_originalChart = ele.originalchart;
                                    }
                                })
                                data.forEach((ele)=>{
                                    if(ele.endperiod === '9999-99-99' && ele.tempversionflag){//如果结束日期是9999-99-99 并且 是临时版本；那么refChart就为这个选中的；
                                        ele.beginperiod = ele.beginperiod+"*";
                                        retChart = ele;
                                    }
                                }) //fixed by liusenc 20180918		
                            //在这里加一下如果是临时版本对refChartVersion.isTemp字段赋一下值
                                if(retChart.tempversionflag){
                                    this.state.refChartVersion.isTemp = true;//modified by liusenc 20180920
                                }
                            //第一次加载数据过来，总是最新的版本
                                
                                this.state.refChartVersion.pk_newVersionChart = (this.state.refChart.value ? (this.state.refChart.value instanceof Array ? this.state.refChart.value[0].refpk : this.state.refChart.value.refpk): '');//当前选中的科目表参照pk
                                this.state.refChartVersion.isNewVersion = (this.state.refChartVersion.pk_newVersionChart === retChart.pk_accchart);
                                if(retChart.pk_accchart === this.state.refChartVersion.pk_originalChart){
                                    this.state.refChartVersion.isFirstVersion = true;
                                }                                 	
                            }
  
                            if(retChart){
                                this.state.refChartVersion.value = retChart.pk_accchart;
                                this.state.modalInsertMid.refAccount.queryCondition = () => {
                                    return{
                                        pk_accchart: retChart.pk_accchart || '',
                                        GridRefActionExt:'nccloud.web.uapbd.account.action.RefCondMidAccount',
                                    }
                                },                                
                                this.setState(this.state,() =>{
                                    this.routerToList();
                                });
                            }
                        });
                    }else{
                        this.fillDataTree([], () => {
                            this.updateButtonStatus();
                        });                         
                    }
                    });
                }
            },
            refChartVersion: {
                fieldid: 'refChartVersion',
                datas:[],
                showClear: false,
                placeholder: this.lang['10140ACCB-000031'],/* 国际化处理： 科目表生效日期*/
                value: undefined,
                isTemp:false,//added by liusenc 20180920是否为临时版本标志
                isNewVersion:false,//默认为否；
                isFirstVersion:false,//默认为否；是否为第一版；
                pk_originalChart:"",//这个字段记录的是原始科目表信息；在科目表版本发生变化的时候，根据这个值来设置当前选中版本是否为第一版
                pk_newVersionChart:"",//这个字段记录的是最新版本科目表的pk，用来辅助确认当前选中的版本是否是最新版本；
                onChange: (value) => {
                    this.state.listPanel.listtree.selectedRecord = undefined;//20181212
                    this.state.refChartVersion.value = value;
                    //这里遍历以下datas，找到对应的参照把是否临时版本赋值过去
                    this.state.refChartVersion.datas.forEach((ele)=>{
                        if(value === ele.pk_accchart){
                            this.state.refChartVersion.isTemp = ele.tempversionflag//modified by liusenc 20180920
                        }
                    })
                    if(value === this.state.refChartVersion.pk_newVersionChart){
                        this.state.refChartVersion.isNewVersion = true;//是最新版本；
                    }else{
                        this.state.refChartVersion.isNewVersion = false;//是最新版本；
                    }
                    if(value === this.state.refChartVersion.pk_originalChart){
                        this.state.refChartVersion.isFirstVersion = true;
                    }else{
                        this.state.refChartVersion.isFirstVersion = false;
                    }                    
                    this.state.modalInsertMid.refAccount.queryCondition = () => {
                        return{
                            pk_accchart: value || '',
                            GridRefActionExt:'nccloud.web.uapbd.account.action.RefCondMidAccount',
                        }
                    },
                    this.setState(this.state, () => {
                        this.routerToList();
                    });
                },
                renderOption: function() {
                    return this.datas.map( data => {
                        return <Option value={data.pk_accchart}>{data.beginperiod}</Option>
                    });
                }
            },
            showoff:{
                defaultChecked: false,
                checked: false,
                onChange: (value) =>{
                    this.state.showoff.checked = value;
                    this.routerToList();
                }
            }
        };

        //树表state
        var loopNode = (nodes, handler) => {
            nodes.forEach( node => {
                if(node.children  && node.children.length == 0 ){
                    delete node.children;
                }
                handler && handler(node, node.children || []);
                loopNode(node.children || [], handler);
            });
        };
        var listPanel = {
            listPrintpks:[],//增加一个字段，用来记录当前列界面下的所有的科目的pk-accounts;added by liusenc 20180810
            listCodes: [], //增加一个字段，用来记录当前列界面下的所有的科目的code
            datas: [],
            listtree:{
                isTree:true,
                columns: [],
                expandedRowKeys: [],
                selectedRecord: undefined,
                rowClassName: record => {
                    return this.state.listPanel.listtree.selectedRecord && record.id ==  this.state.listPanel.listtree.selectedRecord.id ? 'nctable-selected-row' : '';
                   
                },
                onRowClick: (record, index, event) => {
                    this.state.listPanel.listtree.selectedRecord = record;
                    this.setState(this.state, ()=> {
                        this.updateButtonStatus();
                    });
                },
                onRowDoubleClick:(record, index, event)=>{
                    this.state.listPanel.listtree.selectedRecord = record;
                    var {refOrg, refSystem, refChart, refChartVersion} = this.state;
                    let curpk = record.id;
                    let iidex = this.state.listPanel.listPrintpks.indexOf(curpk);
                    this.state.curIndex = iidex;
                    this.state.isFirst = iidex == 0 ? true : false;
                    this.state.isEnd = iidex == this.state.listPanel.listPrintpks.length-1 ? true : false;                    
                    this.setState(this.state, ()=> {
                        this.routerToCard(record.id, this.state.refChartVersion.value);
                    });
                   
                },
                rowKey: (record, index) => {
                    return record.id;
                },
                onExpand: (expanded, record) => {
                    var expandedRowKeys =  this.state.listPanel.listtree.expandedRowKeys || [];
                    if(expanded){
                        expandedRowKeys.push(record.id);
                    }else{
                        expandedRowKeys = expandedRowKeys.filter( d=> {return d != record.id }); //.push(record.id);
                    }
                    this.state.listPanel.listtree.expandedRowKeys = expandedRowKeys;
                    this.setState(this.state);
                },
                // adaptionHeight: true, //表格占满屏幕
                // scroll: { x: true, y :450},
                height: 30,//平台传递的NCT able属性用来画界面；
                isDrag: true//这个参数用来控制表头的可拉伸性，

            },
            numberBtnStyle:{
                color:'#555',
                textDecoration:'none',
                fontSize: 13,
                padding: '3px 3px',
                marginRight: 14
            },
            numberBtnStyleActive:{
                color:'red',
                textDecoration:'none',
                fontSize: 13,
                marginRight:14,
                padding: '3px 3px',
                borderBottom: 'solid 2px #e14c46'
            },
            numberbtn : {
                btns: [],
                selectNumber: 0,
                renderNumberBtn: () => {
                    var {btns} = this.state.listPanel.numberbtn,
                        filterNodeKeyByNumber = (nodeNumber) => { 
                        var keys = [],
                            hander = (node, children = []) => {
                                node.nodeData.laynumber <= nodeNumber  &&  keys.push(node.id)
                            };
                        loopNode(this.state.listPanel.datas, hander);
                        return keys;
                    };
            
                    return btns.map(btn => {
                        // let numberBtnInner = ['一级','二级','三级','四级','五级','六级','七级','八级','九级','十级'];
                        var onclick = () => {
                            var keys = filterNodeKeyByNumber(btn.index);
                            //debugger;
                            this.state.listPanel.numberbtn.selectNumber = btn.index;
                            this.state.listPanel.listtree.expandedRowKeys = keys;
                            this.setState(this.state);
                        }
                        return (
                            <a href='javascript:void(0);'
                                style = {this.state.listPanel.numberbtn.selectNumber != btn.index ? listPanel.numberBtnStyle : listPanel.numberBtnStyleActive}
                                onClick={() => {
                                    onclick();
                                }}
                            >{btn.index}</a>
                        )
                    });
                }
            },
            classbtn: {
                curBtn: undefined,
                btns: [],
                selectNumber: undefined,
                renderClassBtn: () => {
                    var {listtree, numberbtn, classbtn }  = this.state.listPanel;
                    return classbtn.btns.map( btn => {
                        var onclick = () => {
                            this.state.listPanel.classbtn.selectNumber = btn.display;
                            this.state.listPanel.classbtn.curBtn = btn;
                            this.setState(this.state);
                        };
                        return  <a href='javascript:void(0);'
                                    style={this.state.listPanel.classbtn.selectNumber != btn.display ? listPanel.numberBtnStyle : listPanel.numberBtnStyleActive}
                                    onClick={() => {
                                        onclick();
                                    }}
                                >{btn.display}</a>
                    });
                },
                filterData: (datas) => {
                    var {listtree, numberbtn, classbtn }  = this.state.listPanel;
                    if(!classbtn.curBtn || !classbtn.curBtn.value)
                        return datas;
                    return datas.filter( data => {
                        return data.nodeData.pk_acctype.value == classbtn.curBtn.value
                    });
                }
            },
            setDatas: (datas) => {
                var {listtree, numberbtn, classbtn }  = this.state.listPanel,
                createNumberBtns = (nodes) => { //获取树节点层级号数组
                    var maxlaynumber = 1, i, btns = [],
                        hander = (node, children = []) =>{ 
                            var nodenumber = parseInt(node.nodeData.laynumber);
                            maxlaynumber = nodenumber <= maxlaynumber ? maxlaynumber: nodenumber;
                        };
                    loopNode(nodes, hander);
                    for(i = 0 ; i <= maxlaynumber; i++ ){
                        btns.push({
                            index: i,
                            expand: false
                        });
                    }
                    return btns;
                },
                createClassBtns = (nodes) => {
                    var classNames = [], classkeys = [],
                        hander = (node, children) =>{ 
                            var type = node.nodeData.pk_acctype;
                            if(classkeys.indexOf(type.value) == -1){
                                classNames.push(type);
                                classkeys.push(type.value);
                            }
                        }; 
                    loopNode(nodes, hander);
                    classNames.push({display: this.lang['10140ACCB-000032']});/* 国际化处理： 全部*/
                    return classNames;
                };
                numberbtn.btns = createNumberBtns(datas);
                classbtn.btns = createClassBtns(datas);
                // classbtn.curBtn = undefined; 
                // classbtn.selectNumber = undefined; 
              //  listtree.selectedRecord = undefined;
                numberbtn.expandedRowKeys = [];
                this.state.listPanel.datas = datas;
            }
        };

        var formPanel = {
            moduleMap: {}
        };

        var modalInsertMid = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            refAccount:{
                value: undefined,
                isMultiSelectedEnabled: false,
                fieldid: 'insertmidaccount',
                onChange: (value) => {
                    var {modal , refAccount, code , name, listMid} = this.state.modalInsertMid;
                    refAccount.value = value;
                    this.setState(this.state, () => {
                        //debugger;
                        if(!value.refpk){
                            this.props.table.setAllTableData(listMid.areacode,{rows:[]}); 
                            return;
                        }						
                        this.loadMidAccount(value.refpk, (data) => {
                            if(!data||data === null){
                                this.props.table.setAllTableData(listMid.areacode,{rows:[]}); 
                            }else{
                                this.props.table.setAllTableData(listMid.areacode,data[listMid.areacode]);
                            }
                        });
                    });
                },
                queryCondition: () => {
                    return{
                        pk_accchart: this.state.refChartVersion.value || '',
                        GridRefActionExt:'nccloud.web.uapbd.account.action.RefCondMidAccount',
                    }
                },//增加参照的查寻过滤条件,added by liusenc ，在refchartversion变化的时候给这个参照置的条件不知道为啥没起效果，这里重新置一下；
            },
            code:{
                title: this.lang['10140ACCB-000033'],/* 国际化处理： 插入科目编码*/
                placeholder:this.lang['10140ACCB-000034']+"*",/* 国际化处理： 科目编码*,科目编码*/
                value:undefined,
                fieldid:'insertmidcode',
                onChange:(value)=>{
                    var {modal , refAccount, code , name} = this.state.modalInsertMid;
                    code.value = value;
                    this.setState(this.state);
                }
            },
            name:{
                title: this.lang['10140ACCB-000035'],/* 国际化处理： 插入科目名称*/
                placeholder:this.lang['10140ACCB-000036']+"*",/* 国际化处理： 科目名称*,科目名称*/
                value: undefined,
                fieldid:'insertmidname',
                onChange:(value)=>{
                    var {modal , refAccount, code , name} = this.state.modalInsertMid;
                    name.value = value;
                    this.setState(this.state);
                }
            },
            listMid:{
                areacode: 'list_insertmid'
            },
            btnSumbit: {
                name: this.lang['10140ACCB-000037'],/* 国际化处理： 确定*/
                onClick: () => {
                    this.saveMid(() => {
                        var {modal , refAccount, code , name} = this.state.modalInsertMid;
                        modal.show = false;
                        this.setState(this.state, () => {
                            this.routerToList();
                            toast({color:'success',content:this.lang['10140ACCB-002005']});/* 国际化处理： */
                        });
                    });
                }
            },
            btnCancel:{
                name: this.lang['10140ACCB-000008'],/* 国际化处理： 取消*/
                onClick: () => {
                    var {modal , refAccount, code , name} = this.state.modalInsertMid;
                    modal.show = false;
                    this.setState(this.state);
                }
            },
            init: ( callback ) => {//清空选择,清空数据等
                var {modal , refAccount, code , name, listMid} = this.state.modalInsertMid;
                refAccount.value = undefined;
                code.value = undefined;
                name.value = undefined;
                //此处清空表格数据
                this.setState(this.state, () => {
                    this.props.table.setAllTableData(listMid.areacode,{rows:[]}); 
                    setTimeout(() => {
                        callback && callback();
                    }, 0);
                });
               
            }
        };

        var modalQuickCal = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            refCalItem:{
                value: undefined,
                isMultiSelectedEnabled: true,
                fieldid :'refmodalQuickCal',
                onChange: (value) => {
                    var {modal , refCalItem, listCalItem, listAccountItem} = this.state.modalQuickCal;
                    refCalItem.value = value;
                    this.setState(this.state, () => {
                        //debugger;
                        var values = this.state.modalQuickCal.refCalItem.value || [];
                        var data = {
                            rows: values.map(v => {
                                var obj = {
                                    pk_accassitem:{ value : v.refpk},
                                    code:{ value : v.refcode},
                                    name:{ value : v.refname},
                                    islast: { value : false},
                                    isnull: { value : false},
                                    print: { value : false},
                                    direction: { value : false}
                                }
                                var row = {
                                    rowid: undefined,
                                    status: 0,
                                    values: obj
                                };
                                return row;
                            })
                        };
                        this.props.editTable.setTableData(listCalItem.areacode, data);
                        this.props.editTable.setStatus(listCalItem.areacode,'edit');//fix 将表格转为编辑态						
                        setTimeout( () => {
                            //debugger;
                            var selectCodes = values.map( val => { return val.refcode});
                            //selectCodes = [...selectCodes,'1001'];
                            var datas  = this.props.table.getAllTableData('list_quickcal_listaccountitem');

                            var filterDatas = datas.rows.map((d, index) => {
                                return {
                                    index: index,
                                    data: d
                                };
                            });

                            var filterDatas = filterDatas.filter((d) => {
                                var code = d.data.values.code.value;
                                var isFilter = false ;
                                selectCodes.forEach(selcode => {
                                    if( !isFilter &&  code.startsWith(selcode)){
                                        isFilter = true;
                                    }
                                });
                                return isFilter;
                            });
                            var indexs = filterDatas.map( fd => { return fd.index});
                            this.props.table.selectTableRows('list_quickcal_listaccountitem', indexs, true);
                        
                        });
                    });
                }
            },
            listCalItem:{
                areacode: 'list_quickcal_listcallitem'
            },
            listAccountItem:{
                areacode: 'list_quickcal_listaccountitem'
            },            
            btnSumbit: {
                name: this.lang['10140ACCB-000037'],/* 国际化处理： 确定*/
                onClick: () => {
                    var {modal , refCalItem, listCalItem , listAccountItem} = this.state.modalQuickCal;  
                    var accountcheckvos = this.props.table.getCheckedRows(listAccountItem.areacode) || [];
                    var pk_accasoas = accountcheckvos.map( v => {
                            return v.data.values.pk_accasoa.value;
                        });
                        //debugger;
                    var itemvos = this.props.editTable.getAllData(listCalItem.areacode).rows || [],
                        paramItems = itemvos.map( item => {
                            var keys = Object.keys(item.values);
                            var obj = {};
                            keys.forEach( key => {
                                obj[key] = item.values[key].value;
                            });
                            return obj;
                    });
                    if( pk_accasoas.length ==0 ){
                        toast({color:'warning',content:this.lang['10140ACCB-000038']});/* 国际化处理： 请选择科目*/
                        return;
                    }
                    if(paramItems.length == 0 ){
                        toast({color:'warning',content:this.lang['10140ACCB-000039']});/* 国际化处理： 请选择辅助核算项*/
                        return;
                    } 					

                    promptBox({
                        color:"warning",
                        title:this.lang['10140ACCB-000040'],/* 国际化处理： 提示*/
                        content: this.lang['10140ACCB-000041']+"，"+this.lang['10140ACCB-000042']+"？",/* 国际化处理： 当前科目的变更将同步到符合属性控制策略的所有下级科目表，是否确定进行该操作？,当前科目的变更将同步到符合属性控制策略的所有下级科目表,是否确定进行该操作*/
                        beSureBtnClick: () => {
                            this.saveQuickCal(() => {
                                var {modal , refCalItem, listCalItem, listAccountItem} = this.state.modalQuickCal;
                                modal.show = false;
                                this.setState(this.state, () => {
                                    this.routerToList();
                                });
                            });
                        }
                    });   


                }
            },
            btnCancel:{
                name: this.lang['10140ACCB-000008'],/* 国际化处理： 取消*/
                onClick: () => {
                    var {modal , refCalItem, listCalItem, listAccountItem} = this.state.modalQuickCal;
                    modal.show = false;
                    this.setState(this.state);
                }
            },
            init: ( callback ) => {//清空选择,清空数据等
//                var {modal , refCalItem, listCalItem, listAccountItem} = this.state.modalQuickCal;
//                this.props.editTable.setStatus(listCalItem.areacode,'edit');
                setTimeout(() => {
                    callback && callback();
                } , 0);
            }
        };

        var selectAssist = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            search:{
                type: 'search',
                value: undefined,
                searchValue:undefined,
                onChange:(value) =>{
                    this.state.selectAssist.search.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    var expandKeys = [],
                        textValue = this.state.selectAssist.search.value || '';
                    const loopsearch = (nodes = []) => {
                        var parendExpand = false;
                        (nodes || [] ).forEach(child => {
                            var expand = loopsearch( child.children || [] );
                            child.needExpand = expand;
                            child.needShow = expand ? true: (child.code.indexOf(textValue) != -1 || child.name.indexOf(textValue)  != -1 || textValue == ''? true: false);
                            parendExpand = parendExpand ? parendExpand :child.needShow;
                            if(expand){
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.selectAssist.tree.datas);
                    //debugger;
                    expandKeys.push('root');
                    this.state.selectAssist.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root:{
                    title: this.lang['10140ACCB-000043'],/* 国际化处理： 辅助核算项目*/
                    code: '',
                    name: this.lang['10140ACCB-000043'],/* 国际化处理： 辅助核算项目*/
                    pk_accassitem: 'root'
                },
                defaultExpandAll: true,
                autoExpandParent: false,
                expandedKeys:['root'],
                datas: [],
                checkedKeys:[],
                checkedNodes:[],
                checkable: true,
                checkStrictly: true,
                onCheck:(checkedkeys, e) => {
                    var {selectAssist} = this.state;
                    selectAssist.tree.checkedKeys = checkedkeys.filter(key => key != 'root');
                    selectAssist.tree.checkedNodes = e.checkedNodes.filter(node => node.key != 'root');
                    this.setState(this.state);
                },
                onExpand:(expandedKeys, e) => {
                    this.state.selectAssist.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                renderNode:() => {
                    var {selectAssist} = this.state,
                        datas = [{...selectAssist.tree.root, children: selectAssist.tree.datas}];
                    // const loop = (datas) => datas.map((item) => {
                    //     var children = item.children || [];
                    //     return (<NCTree.NCTreeNode title={item.name} key={item.pk_accassitem} isLeaf={children.length == 0} nodeData={item} >{loop(children)}</NCTree.NCTreeNode>)
                    // });
                    // return loop(datas);
                    var  renderTreeTitle = (item, pitem) => {
                        let isExpand = this.state.selectAssist.tree.expandedKeys.includes(item.key);
                        let children = item.children || [];
                        let isLeaf =  !children.length;
                        let classNames = isLeaf ? 'tree-dian' : isExpand ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian' : 'icon iconfont  icon-wenjianjia tree-wenjian';
                        var textValue = this.state.selectAssist.search.value;
                        var drawTitleString = (title) =>{
                            if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                                var start = title.indexOf(textValue) , end = start + textValue.length;
                                return <span><span>{title.substring(0, start)}</span><span className="uapbd-account-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                            }else{
                                return (<span>{title}</span>);
                            }
                        };
                        let titleInfo = <span className="title-middle">{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name)}</span>
                        return (<div className="title-con"><i className={classNames}/>{titleInfo}</div>);
                    };

                    const loop = (datas, pdata) => {
                        return  datas.filter( item => {
                            return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
                        }).map((item) => {
                            var children = item.children || [];
                            return (<NCTree.NCTreeNode liAttr={{"fieldid": `${item.code}_node`}} title={renderTreeTitle(item)} key={item.pk_accassitem} isLeaf={children.length == 0} nodeData={item}>{children.length == 0 ? '': loop(children, item)}</NCTree.NCTreeNode>);    
                        });
                    }
                    return loop(datas);
                },
                focusable: ()=>{
                    return true;
                }
            },
            init:(callback) => {
                var {selectAssist} = this.state;
                selectAssist.tree.datas = [];
                selectAssist.tree.checkedKeys = [];
                selectAssist.tree.checkedNodes = [];
                selectAssist.tree.expandedKeys = ['root'];
                selectAssist.search.value = undefined;
                selectAssist.search.searchValue = undefined;
                ajax({
                    loading: true,
                    url:'/nccloud/uapbd/account/LoadAccAssItemsAction.do', 
                    data: {}, 
                    success:res => {
                        this.state.selectAssist.tree.datas = res.data;
                        this.setState(this.state, () => {
                            callback && callback();
                        });
                    }
                }); 
                
               
            },
            btnSumbit: {
                name: this.lang['10140ACCB-000037'],/* 国际化处理： 确定*/
                onClick: () => {
                    var {checkedNodes} = this.state.selectAssist.tree;
                    let curDatas = this.props.cardTable.getVisibleRows('formAccAss');
                    let curRowNum = curDatas.length;
                    if(checkedNodes.length + curDatas.length  > 9){
                        toast({color:'warning',content:this.lang['10140ACCB-000044']+"9"+this.lang['10140ACCB-000045']+"，"+this.lang['10140ACCB-000046']+"!"});/* 国际化处理： 辅助核算项数已经达到最大数9个，不能增加!,辅助核算项数已经达到最大数,个,不能增加*/
                        return;
                    }
                    var existpks = curDatas.map( ele =>{
                        return ele.values.pk_entity.value;
                    });

                    var addData = checkedNodes.filter(node => {
                        return existpks.indexOf(node.props.nodeData.pk_accassitem) == -1;
                    }).map( ele =>{
                        curRowNum = curRowNum + 1;
                        return {
                            values:{
                                pk_entity:{
                                    value:ele.props.nodeData.pk_accassitem,
                                },
                                id: {   value:curRowNum }, 
                                num:{   value:1             },    
                                isbalancecontrol:{ value:false},
                                isempty:{value:false},
                                isnonleafused:{value:false},
                                issumprint:{value:false},                   
                                'pk_entity.code':{
                                    value:ele.props.nodeData.code,
                                    display:ele.props.nodeData.code
                                },
                                'pk_entity.name':{
                                    value:ele.props.nodeData.name,
                                    display:ele.props.nodeData.name
                                }                                                                                           
                            }
                        } 
                    });
                    this.props.cardTable.setTableData('formAccAss',{rows:[...curDatas, ...addData]});
                    setTimeout(() => {
                        this.state.selectAssist.modal.show = false;
                        this.setState(this.state);
                    }, 0);
                }
            },
            btnCancel:{
                name: this.lang['10140ACCB-000008'],/* 国际化处理： 取消*/
                onClick: () => {
                    var {selectAssist} = this.state;
                    selectAssist.modal.show = false;
                    this.setState(this.state);
                }
            }
        };
        var selectModule = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            search:{
                type: 'search',
                value: undefined,
                searchValue:undefined,
                onChange:(value) =>{
                    this.state.selectModule.search.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    var expandKeys = [],
                        textValue = this.state.selectModule.search.value || '';
                    const loopsearch = (nodes = []) => {
                        var parendExpand = false;
                        (nodes || [] ).forEach(child => {
                            var expand = loopsearch( child.children || [] );
                            child.needExpand = expand;
                            child.needShow = expand ? true: (child.code.indexOf(textValue) != -1 || child.name.indexOf(textValue)  != -1 || textValue == ''? true: false);
                            parendExpand = parendExpand ? parendExpand :child.needShow;
                            if(expand){
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.selectModule.tree.datas);
                    expandKeys.push('root');
                    this.state.selectModule.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root:{
                    title: this.lang['10140ACCB-000047'],/* 国际化处理： 受控模块*/
                    key: 'root',
                    id: 'root',
                    name: this.lang['10140ACCB-000048'],/* 国际化处理： 模块信息*/
                    code: this.lang['10140ACCB-000048'],
                    systypename:this.lang['10140ACCB-000048'],/* 国际化处理： 模块信息*/
                    systypecode: 'root'
                },
                defaultExpandAll: true,
                autoExpandParent: false,
                expandedKeys:['root'],
                datas: [],
                checkedKeys:[],
                checkedNodes:[],
                checkable: true,
                checkStrictly: false,//true,
                onCheck:(checkedkeys, e) => {
                    var {selectModule} = this.state;
                    selectModule.tree.checkedKeys = checkedkeys;//checkedkeys.filter(key => key != 'root');
                    selectModule.tree.checkedNodes = e.checkedNodes.filter(node => node.key != 'root');//e.checkedNodes;//
                    this.setState(this.state);
                },
                onExpand:(expandedKeys, e) => {
                    this.state.selectModule.tree.expandedKeys = expandedKeys;
                    console.log(expandedKeys);
                    this.setState(this.state);
                },
                renderNode:() => {
                    var {selectModule} = this.state,
                        datas = [{...selectModule.tree.root, children: selectModule.tree.datas}];
                    var  renderTreeTitle = (item, pitem) => {
                        console.log(item, item.key);
                        let isExpand = this.state.selectModule.tree.expandedKeys.includes(item.key);
                        let children = item.children || [];
                        let isLeaf =  !children.length;
                        let classNames = isLeaf ? 'tree-dian' : isExpand ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian' : 'icon iconfont  icon-wenjianjia tree-wenjian';
                        var textValue = this.state.selectModule.search.value;
                        var drawTitleString = (title) => {
                            if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                                var start = title.indexOf(textValue) , end = start + textValue.length;
                                return <span><span>{title.substring(0, start)}</span><span className="uapbd-account-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                            }else{
                                return (<span>{title}</span>);
                            }
                        };
                        let titleInfo = <span className="title-middle">{drawTitleString(item.code)}</span>;//&nbsp;&nbsp;{drawTitleString(item.name)}</span>
                        return (<div className="title-con"><i className={classNames}/>{titleInfo}</div>);
                    };

                    const loop = (datas, pdata) => {
                        return  datas.filter( item => {
                            return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
                        }).map((item) => {
                            var children = item.children || [];
                            return (<NCTree.NCTreeNode liAttr={{"fieldid": `${item.code}_node`}} title={renderTreeTitle(item)} key={item.nodeData ? item.nodeData.data.systypecode:item.id } isLeaf={children.length == 0} nodeData={item.nodeData ? item.nodeData.data : {}}>{children.length == 0 ? '': loop(children, item)}</NCTree.NCTreeNode>);    
                        });
                    }
                    return loop(datas);
                        //debugger;
                    // const loop = (datas) => datas.map((item) => {
                    //     var children = item.children || [];
                    //     if(item.key === "root"){
                    //         return (<NCTree.NCTreeNode title={item.systypename} key={item.systypecode} isLeaf={children.length == 0}  nodeData={item} >{loop(children)}</NCTree.NCTreeNode>)
                    //     }
                    //     return (<NCTree.NCTreeNode title={item.name} key={item.nodeData.data.systypecode} isLeaf={children.length == 0}  nodeData={item.nodeData.data} >{loop(children)}</NCTree.NCTreeNode>)
                    // });
                    // return loop(datas);
                },
                focusable: ()=>{
                    return true;//自定义参照支持tinper所定义的快捷键；
                }                
            },
            init:(callback) => {
                var {selectModule} = this.state;
                selectModule.tree.datas = [];
                selectModule.tree.checkedKeys = [];
                selectModule.tree.checkedNodes = [];
                ajax({
                    loading: true,
                    url:'/nccloud/uapbd/account/LoadCtrlModulesAction.do', 
                    data: {}, 
                    success:res => {
                        this.state.selectModule.tree.datas = res.data;
                        this.setState(this.state, () => {
                            callback && callback();
                        });
                    }
                });
            },
            btnSumbit: {
                name: this.lang['10140ACCB-000037'],/* 国际化处理： 确定*/
                onClick: () => {
                    var {checkedNodes} = this.state.selectModule.tree;
                    let datas = this.props.editTable.getAllData('listModules');
                    let curAll = datas.rows.length ;
                    let existCodes = [];
                    datas.rows.forEach((ele)=>{
                        existCodes.push(ele.values.code.value);
                    })
                    //debugger;
                    //如果checkedNodes非空，那么向表中填充数据；
                    checkedNodes.forEach((ele)=>{
                        if(!(existCodes.indexOf(ele.props.nodeData.systypecode) > -1)){//如果表中现有的不存在，那么加进去
                        let tmp = {
                            code:{
                                value:ele.props.nodeData.systypecode,
                                display:ele.props.nodeData.systypecode
                            },
                            name:{
                                value:ele.props.nodeData.systypename,
                                display:ele.props.nodeData.systypename
                            },
                            flag:{
                                value:true,//新增过来的全是为true;
                            }                            
                        }
                        this.props.editTable.addRow('listModules',curAll,false,tmp);
                        curAll = curAll + 1;
                    }
                        
                    })
                    //关闭模态框；
                    this.state.selectModule.modal.show = false;
                    this.setState(this.state);
                }
            },
            btnCancel:{
                name: this.lang['10140ACCB-000008'],/* 国际化处理： 取消*/
                onClick: () => {
                    var {selectModule} = this.state;
                    selectModule.modal.show = false;
                    this.setState(this.state);
                }
            }
        };
        
        var state = {
            ...stateBase,
            ...stateRef,
            listPanel: listPanel,
            formPanel:formPanel,
            modalInsertMid:modalInsertMid,
            modalQuickCal:modalQuickCal,
            selectModule: selectModule,
            selectAssist: selectAssist
        };
        return state;
    }
    modifierSearchTemplate(dataTemplate){
        dataTemplate.template.search.items.forEach((ele)=>{
            //如果是科目类型参照，那么对其置一下条件；
            if("bd_account.pk_acctype" === ele.attrcode){
                ele.queryCondition = ()=>{
                    return{
                        "pk_accsystem":this.state.refSystem.value? (this.state.refSystem.value instanceof Array ? this.state.refSystem.value[0].refpk :this.state.refSystem.value.refpk ): '',
                        GridRefActionExt:"nccloud.web.uapbd.account.action.RefCondAccType",
                    }
                }
            }else if("bd_accasoa.creator" === ele.attrcode || "bd_accasoa.modifier" === ele.attrcode){
                ele.isShowDisabledData = true;//如果是创建对象或者修改对象为用户参照，支持停用按钮；
            }else if("bd_accasoa.sumprint_level" === ele.attrcode){
                ele.options=[];
                let constPrintLevel0 = {display:this.lang['10140ACCB-000017'],value:"0"};//这个用来设置汇总打印级次的值/* 国际化处理： 末级*/
                ele.options.push(constPrintLevel0);
                for(let index =1;index<21;index++){//默认设置的为21，见nc的查询模板设置
                    ele.options.push({display:index+"",value:index+""});
                }
            }
        });

        dataTemplate.template.batEditSearch.items.forEach((ele)=>{
            //如果是科目类型参照，那么对其置一下条件；
            if("pk_account.pk_acctype" === ele.attrcode){
                ele.queryCondition = ()=>{
                    return{
                        "pk_accsystem":this.state.refSystem.value? (this.state.refSystem.value instanceof Array ? this.state.refSystem.value[0].refpk :this.state.refSystem.value.refpk ): '',
                        GridRefActionExt:"nccloud.web.uapbd.account.action.RefCondAccType",
                    }
                }
            }else if("creator" === ele.attrcode || "modifier" === ele.attrcode){
                ele.isShowDisabledData = true;//如果是创建对象或者修改对象为用户参照，支持停用按钮；
            }else if("sumprint_level" === ele.attrcode){
                ele.options=[];
                let constPrintLevel0 = {display:this.lang['10140ACCB-000017'],value:"0"};//这个用来设置汇总打印级次的值/* 国际化处理： 末级*/
                ele.options.push(constPrintLevel0);
                for(let index =1;index<21;index++){//默认设置的为21，见nc的查询模板设置
                    ele.options.push({display:index+"",value:index+""});
                }
            }
        })
        return dataTemplate;
    }

    updateButtonStatus(isEdit=false){//增加一个参数，显示是否是编辑按钮进入的，默认为true 
        //this.props.button.setMainButton('add',true);//
        var me = this;
        //debugger;
        var {showMode, editMode, refSystem, refChart, refChartVersion, listPanel, refOrg} = this.state,
            listtree = listPanel.listtree,
            havListSelect = (listtree.selectedRecord !== undefined && listtree.selectedRecord !== null),
            listCardSelectedEnable = ((showMode == 'list' ? (listtree.selectedRecord && listtree.selectedRecord.nodeData['enablestate'].value) : this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.enablestate.value) == "2" ),//已启用
            havSystem = (refSystem.value !== undefined && refSystem.value !== null) && refSystem.value && (refSystem.value instanceof Array ? refSystem.value[0].refpk :refSystem.value.refpk),
            havChart  = (refChart.value !== undefined && refChart.value !== null ) && refChart.value  && (refChart.value instanceof Array ? refChart.value[0].refpk :refChart.value.refpk),//modified by liusenc 20180815,因为科目表参照value变成了数组，这里适配一下；
            //havDate   = refChartVersion.value  && refChartVersion.value.refpk;
            havDate   =( refChartVersion.value !== undefined && refChartVersion.value !== null) && refChartVersion.value ;
            let isNewVersion = (havChart && havDate && refChartVersion.isNewVersion);//( ( refChart.value instanceof Array ? refChart.value[0].refpk :refChart.value.refpk) === refChartVersion.value));//如果二者相等，那么代表的是最新的版本，只有此时插入中间级，批改，快速设置辅助核算，停启用才可用 added by liusenc 20180925
            let isTempVersion = (havChart && havDate && refChartVersion.isTemp);//若为临时表        
            let canPrint = this.state.showMode == 'list' ? (this.state.listPanel.listPrintpks.length > 0)  : (!editMode && this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.pk_account.value); 
        var isSelectFormAcc = (editMode && this.props.cardTable.getCheckedRows('formAccAss') && this.props.cardTable.getCheckedRows('formAccAss').length > 0 ),
            isSelectFormMoudle = (editMode && this.props.editTable.getCheckedRows('listModules') && this.props.editTable.getCheckedRows('listModules').length > 0);
            this.props.button.setDisabled({
            add_group_null: !(!editMode && havSystem && havChart ),   
            add:       !(!editMode && havSystem && havChart ),  
            addcopy:   !(!editMode && ((showMode == 'list' && havListSelect) || showMode == 'card' ) ),//!(!editMode && havSystem && havChart && havListSelect ), 
            addmid:  !(isNewVersion && !editMode && ((showMode == 'list' && havDate) || showMode == 'card' ) ),//!(!editMode && havSystem && havChart && havListSelect ), 
            
            edit_group_null: !(!editMode && ((showMode == 'list' && havListSelect) || showMode == 'card') ),
            edit:       !(!editMode && ((showMode == 'list' && havListSelect) || showMode == 'card') ),
            editbat:    !((isNewVersion || isTempVersion) && !editMode && ((showMode == 'list' && havDate) || showMode == 'card')),

            delete:     !(!editMode && ((showMode == 'list' && havListSelect) || showMode == 'card' ) ),

            refresh:    !(!editMode),

            supportcal:  !(isNewVersion && !editMode && ((showMode == 'list' && havDate) || showMode == 'card' )),
            enable_group_null:   !(!editMode),
            enable:        !(isNewVersion && !editMode && ((showMode == 'list' && havListSelect && !listCardSelectedEnable) || (showMode == 'card' && !listCardSelectedEnable)) ),
            enable_undo:   !(isNewVersion && !editMode && ((showMode == 'list' && havListSelect && listCardSelectedEnable) || (showMode == 'card' && listCardSelectedEnable)) ),
            print_group_null:   !(!editMode && havSystem && havChart && havDate && canPrint),   
            print:         !(!editMode && havSystem && havChart && havDate && canPrint),   
            print_output:  !(!editMode && havSystem && havChart && havDate && canPrint ),
            saveadd:isEdit,//增加一个参数用来控制编辑态进入界面的时候这玩意不可用；,
            deleterow:!isSelectFormAcc ,
            movedown:!isSelectFormAcc ,
            moveup:!isSelectFormAcc ,
            deletemodule:!isSelectFormMoudle,
            import: this.config.nodetype == 'org' && !(refOrg.value && refOrg.value.refpk) ? true : false,
        });
        this.props.button.setButtonsVisible(['add_group_null','add','addcopy','addmid','edit_group_null','edit','editbat','delete','delete-1','more','refresh','supportcal','supportcal-1','enable_group_null','enable','enable_undo','print_group_null','print' ,'print_output'], !editMode);
        this.props.button.setButtonsVisible(['save','canceledit','addrow','deleterow','movedown','moveup','addmodule','deletemodule'], editMode);
        this.props.button.setButtonsVisible(['saveadd'], !isEdit && editMode);
        this.props.button.setButtonsVisible(['card_backlist'], !editMode && showMode == 'card');
        //在这里设置一下卡片上下翻页的按钮的显隐性
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !editMode && showMode == 'card');
    }
    
    createTreeCols(template){
        var treeCols = template.listAccount.items || [],
            numberCol,
        onClickLinkCode = (record,index) =>{
            return () => {
                var {refOrg, refSystem, refChart, refChartVersion} = this.state;
                let curpk = record.id;
                let iidex = this.state.listPanel.listPrintpks.indexOf(curpk);
                this.state.curIndex = iidex;
                this.state.isFirst = iidex == 0 ? true : false;
                this.state.isEnd = iidex == this.state.listPanel.listPrintpks.length-1 ? true : false;
                //this.state.selRecordId = record.id;
                this.setState(this.state,()=>{
                    this.routerToCard(record.id, refChartVersion.value)}
                    );
            }
        };
        treeCols = treeCols.filter( item => item.visible );
        let theme = window.top.nccColor  //获取当前主题'black'
        let fontColor = theme === 'black' ? '#7374ff' : 'blue' //适配暗黑主题
        let langcode = getLangCode();
        let isEn = langcode == 'english' ? true : false 
        treeCols = treeCols.map( item => {  
            let cellWidth = 120
            if(item.attrcode === 'pk_acctype' || item.attrcode === 'cashtype' || item.attrcode === 'balanorient' || item.attrcode === 'remcode' || item.attrcode === 'currency'){
                cellWidth = 80
            }
            if(isEn && item.attrcode === 'bothorient'){
                cellWidth = 170
            }
             return  {
                 item: item,                
                 key: item.attrcode,
                 width: cellWidth,
                //  title: item.label,
                 title: (<div fieldid={item.attrcode}>{item.label}</div>),
                 render : (text,record,index) => {
                    var scopeStyle = record.nodeData.pk_accchart.value == record.nodeData.pk_currentchart.value ? {style:{
                        textDecoration: 'none'
                       }} :{
                       style:{
                        color: fontColor,
                        textDecoration: 'none'
                       }
                    };
                    //在这里加一下处理颜色的代码：

                    if(record.nodeData[item.attrcode] && record.nodeData[item.attrcode].seldefinecolor ){//这里的selfdefinecolor为自己添加的
                        if(scopeStyle.style && scopeStyle.style.color){
                            scopeStyle.style.color = record.nodeData[item.attrcode].seldefinecolor;
                        }
                        scopeStyle = {
                            style:{
                                color : record.nodeData[item.attrcode].seldefinecolor
                            }
                        }
                    }

                    if(item.attrcode == 'code')
                        return <div fieldid='code'>
                            <a {...scopeStyle} href='javascript:void(0)' onClick={onClickLinkCode(record,index)}>{record.nodeData[item.attrcode] ? (record.nodeData[item.attrcode].value || '') : ''}</a>
                            </div>

                    var value = '';
                    if( item.itemtype === 'switch'){
                        if(item.attrcode === 'quantitycheck'){//如果是辅助核算，那么这个是否打选中有record记录中的unit.value === null是否为空来判断，因为这个是必输项modifide by liusenc 20180810
                            value = ((record.nodeData['unit'].value  && record.nodeData['unit'].value.trim() !== '') ? this.lang['10140ACCB-000056'] : this.lang['10140ACCB-000057']);/* 国际化处理： 是,否*/
                        }else{
                        value =  (record.nodeData[item.attrcode] === undefined ? false : record.nodeData[item.attrcode].value) ? this.lang['10140ACCB-000056']:this.lang['10140ACCB-000057'];/* 国际化处理： 是,否*/
                        }
                    }
                    else if( item.itemtype === 'refer' || item.itemtype === 'select')
                        value =  record.nodeData[item.attrcode] ? (record.nodeData[item.attrcode].display || '') : '';
                    else
                         value = record.nodeData[item.attrcode] ? (record.nodeData[item.attrcode].value || '') : '';
                    return(
                        <div {...scopeStyle} fieldid={item.attrcode}>
                            {value?value:<span>&nbsp;</span>}
                        </div>
                    )
                        
                      
                }
             }
        });
        numberCol = {
            key: 'keyno',
            width: 80,
            title: '',
            render: (text, record, index) => {
                return '';//  index + 1;
            }
        };
        treeCols.unshift(numberCol);
        return treeCols;
    }


    loadDatarefChartVersion(callback){//加载科目版本日期；
        ajax({
            loading:true,
            url:'/nccloud/uapbd/account/ListVersionAction.do',
            data:{'pk_accchart': this.state.refChart.value ? (this.state.refChart.value instanceof Array ? this.state.refChart.value[0].refpk : this.state.refChart.value.refpk): ''},//修改20180814-20：49，发现参照突然变成了数组了
            success:(res) => callback && callback(res.data || [])
        });
    }
    /*
    fillDatarefChartVersion(datas= []){
        this.state.refChartVersion.datas = datas;
        //根据查询到科目表的所有版本信息，过滤出最新的值，返回给调用者
        let retChart = undefined;
        if(datas.length > 0){
            datas.forEach((ele)=>{
                if(ele.endperiod === '9999-99-99'){
                    retChart = ele;
                }
                //在这个地方设置一下第一版本科目表信息；
                if(this.state.refChartVersion.pk_originalChart.trim() === ""){
                    this.state.refChartVersion.pk_originalChart = ele.originalchart;
                }
            })
            datas.forEach((ele)=>{
                if(ele.endperiod === '9999-99-99' && ele.tempversionflag){//如果结束日期是9999-99-99 并且 是临时版本；那么refChart就为这个选中的；
                    ele.beginperiod = ele.beginperiod+"*";
					retChart = ele;
                }
            }) //fixed by liusenc 20180918			
        }
        //在这里加一下如果是临时版本对refChartVersion.isTemp字段赋一下值
        if(retChart.tempversionflag){
            this.state.refChartVersion.isTemp = true;//modified by liusenc 20180920
        }
        //第一次加载数据过来，总是最新的版本
        this.state.refChartVersion.isNewVersion = true;
        if(retChart.pk_accchart === this.state.refChartVersion.pk_originalChart){
            this.state.refChartVersion.isFirstVersion = true;
        }        
      return retChart;
    }
    */

    loadDataTree(callback){
        //let searchVal = this.props.search.getAllSearchData('search') || {};//由于下面的原因，这里先把这句注释掉；
        //20180814发现当为高级查询时候，无法在这里取到查询条件，所以再点击查询时候，把查询条件置入进去，现在从state中取出来
        let searchVal = this.state.searchConditions || {};//modified by liusenc
        ajax({
            loading: true,
            url:'/nccloud/uapbd/account/TreeAccountAction.do', 
            data: {
                ...this.config,
                pk_org: this.state.refOrg.value ? (this.state.refOrg.value instanceof Array ? this.state.refOrg.value[0].refpk : this.state.refOrg.value.refpk): '',//20180815modified by liusenc 发现组织参照返回的是数组适配
                pk_accchart:this.state.refChartVersion.value || '',
                showoff :this.state.showoff.checked,
                querycondition:searchVal,
                oid: this.state.search.oid , 
                querytype:'tree',
                queryAreaCode:this.state.search.id
            }, 
            success: (res) => {
                /*
                showFormular(this.props,res,{
					"listAccount" : "table",
					//'agentstores_childform1': "cardTable",
					//'agentstores_childform2': "cardTable"
                });	
                */
               //这里加一个函数，专门处理字段变色的问题：

               if(res && res.formulamsg && res.data){//说明有颜色数据，那么将颜色数据合并一下： 20181220
                    var mapColor = new Map();
                    for( var itemformular of res.formulamsg){
                        if(itemformular.render && itemformular.render.color && !mapColor.get(itemformular.render.attrcode)){
                            mapColor.set(itemformular.render.attrcode,itemformular.render.color)
                        }
                    }
                    //下面开始修改data的值：
                    var ctloopNode = (nodes,colormap) => {
                        nodes.forEach( node => {
                            for (var indexColor of colormap){
                                node.nodeData[indexColor[0]].seldefinecolor = indexColor[1];
                            }
                            if(node.children  && node.children.length == 0 ){
                               return;
                            }
                            ctloopNode(node.children || [],colormap);
                        });
                    };  
                    ctloopNode(res.data.treenode,mapColor);                                      
                }

               
               //20181220发现平台的showFormular函数不支持           
                //toast({color:'warning',content:'数据量('+res.data.debug.count+'),action执行时间:' + res.data.debug.alltime + ',其中查询接口耗时:' + res.data.debug.queryTime + '其中平台翻译耗时:' + res.data.debug.translatorTime});
                callback && callback(res.data.treenode || [])
            }
        }); 
    }

    fillDataTree(datas= [], callback){
        //新增了列表打印pks，added by liusenc 20180810
        let cpks = [];
        let codes = []
        //在这里深度优先遍历一下树节点
        var cloopNode = (nodes,pks, codes ) => {
            nodes.forEach( node => {
                pks.push(node.nodeData.pk_account.value);
                codes.push({pk_account: node.nodeData.pk_account.value, code: node.code}); //编码code、pk_account
                if(node.children  && node.children.length == 0 ){
                   return;
                }
                cloopNode(node.children || [],pks, codes);
            });
        };
        cloopNode(datas,cpks, codes);
        /*        
        datas.forEach((ele)=>{
            cpks.push(ele.nodeData.pk_account.value);
        })
        */

        this.state.listPanel.listPrintpks = cpks;
        this.state.listPanel.listCodes = codes;
        //
        this.state.listPanel.setDatas(datas);
        this.setState(this.state, () => {
            callback && callback();
        });
    }
	
    componentDidUpdate(){//fix--增加编辑态离开按钮提醒20180925 added  by liusenc 
        if(!this.init)
            return;
        //form如果是编辑态，关闭浏览器需要给你提示
        let cardEdit = this.state.editMode; //((this.state.showMode != 'list') && (this.props.form.getFormStatus('formAccount') == 'edit') );
        let insertMidStatus = this.state.modalInsertMid.modal.show;
        let quickCalStatus = this.state.modalQuickCal.modal.show;
        let batchStatus = this.BatchEditStepModal.isShow();
        //几种情况：卡片编辑态，
        if(cardEdit || insertMidStatus || quickCalStatus || batchStatus){

            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
                };
           
        }else{

            window.onbeforeunload = null;

        }
    } 	

    loadDataForm(param = {}, callback){ //pk_account, pk_chart, mode 
        ajax({
            loading:true,
            url:'/nccloud/uapbd/account/LoadAccountAction.do',
            data:{
                ...param,
                ...this.config
            },
            success:(res) => {
                showFormular(this.props,res,{
                    "formAccount" : "form",
					"formAccAss":"cardTable",
                });
                var vo = res.data.vo,
                    moduleMap = res.data.moduleMap,
                    ctrlData = res.data.ctrlData;
                if(!vo.body){
                    vo.body ={};
                    vo.body.formAccAss ={
                        areacode: 'formAccAss',
                        rows:[]
                    };
                }
                callback && callback(vo, moduleMap,ctrlData)
            }
        });
    }

    handlerFormByCurCode(accountvo, callback){
        var successHander = (data) =>{
            var vo = data.mapdata.vo,
                moduleMap = data.mapdata.moduleMap,
                ctrlData =data.mapdata.ctrlData;
            if(!vo.body){
                vo.body = {
                    formAccAss:{
                        areacode: 'formAccAss',
                        rows:[]
                    }
                };
            }
            this.fillDataForm(vo, moduleMap,ctrlData, () => {
                callback && callback();
            });
        };
        var errorHandler = (msg) =>{ //code编码清空
            toast({color: 'danger',content:msg ,title:this.lang['10140ACCB-000058']});/* 国际化处理： 错误*/
            callback && callback();
        };
        ajax({
            loading:true,
            data: accountvo,
            url:'/nccloud/uapbd/account/LoadAccountHelperAction.do',
            success:(res) => {
                showFormular(this.props,res,{
                    "formAccount" : "form",
					"formAccAss":"cardTable",
                });                
                res.data.success ? successHander(res.data): errorHandler(res.data.msg);
            }
        });
    }

    callFormItem(callback){
        callback && callback();
    }
     
    fillDataForm(vo, moduleMap = {} , ctrlData, callback){
        //填充表单
       // this.props.form.EmptyAllFormValue('formAccount');
        setTimeout(() => {
            let status = this.props.form.getFormStatus('formAccount')
            status==='add' && Utils.filterEmptyData(vo.head['formAccount'].rows[0].values); //fix：去空后，翻页时空值不会更新
            this.props.form.setAllFormValue({'formAccount': vo.head['formAccount'] });
            let isUnit = (vo.head['formAccount'].rows[0].values.unit && vo.head['formAccount'].rows[0].values.unit.value  && vo.head['formAccount'].rows[0].values.unit.value.trim() !== '');
            let quantitycheck = isUnit ? {value:true,display:this.lang['10140ACCB-000056']} : {value:false,display:this.lang['10140ACCB-000057']} /* 国际化处理： 是,否*/
            this.props.form.setFormItemsValue('formAccount',{'quantitycheck': quantitycheck}); // fix：isUnit为false时，数量核算状态不会更新

            let genData = {
                areacode : 'listModules',
                rows :  ( ctrlData || [] ).map( element => {
                    return {
                        rowid:null,
                        status:0,
                        values:{
                            code:{value:element.code,display:element.code},
                            name:{value:moduleMap[element.code],display:moduleMap[element.code]},
                            flag:{value:element.flag}
                        }
                    }
                })
            };
            this.props.cardTable.setTableData('formAccAss', vo.body['formAccAss'], false);
            setTimeout( () =>{
                this.props.editTable.setTableData('listModules',genData);
                setTimeout(() => {
                    callback && callback();
                },0);
            },0);
        }, 0);
      
       
      
    }

    // //填充表单
    // fillDataForm11(vo, moduleMap,ctrlData,callback){

    //     this.props.form.setAllFormValue({'formAccount': vo.head['formAccount'] });
    //     //在这里设置一下生效日期维当前会计科目表的选中的版本日期；modifide by liusenc 20180814;
    //     let displayBeginData = "";
    //     this.state.refChartVersion.datas.forEach((item)=>{
    //         if(item.pk_accchart === this.state.refChartVersion.value){
    //             displayBeginData = item.beginperiod;
    //         }
    //     })
    //                 //这里设置一下银行科目相关的东西
    //     let cformData = vo.head.formAccount.rows[0].values;
    //     let isBankSelected = ( cformData.cashtype.value && cformData.cashtype.value === "2" );//2为下拉选中了银行科目；结算方式，银行账号，票据日期，票据号，票据类型
    //     let isQuantityCheckSelected = ( cformData.unit.value )//默认计量单位是否有值；如果有值，将这个设为可用，否则设为不可用
        
    //     //added by liusenc 20180817 11:15 如果带出来的数据中包含数量核算已选中，那么相应字段应当设为可编辑，可用；如果带入的数据中选中的是银行科目，那么响应的字段应当设为可编辑，可用；
    //     let waitSetedValue = {};
    //     waitSetedValue['pk_currentchart.beginperiod'] = {value:this.state.refChartVersion.value,display:displayBeginData};
    //         if(!isBankSelected){//如果更换了下拉按钮，应该把这些字段值清空，恢复默认；
    //                 waitSetedValue['balancetype'] = {value:isBankSelected,display:'否'};
    //                 waitSetedValue['bankacc'] = {value:isBankSelected,display:'否'};
    //                 waitSetedValue['billdate'] = {value:isBankSelected,display:'否'};
    //                 waitSetedValue['billnumber'] = {value:isBankSelected,display:'否'};
    //                 waitSetedValue['billtype'] = {value:isBankSelected,display:'否'};
    //         }
            
    //         //这里设置一下数量核算需要的东西；
            
    //         if(!isQuantityCheckSelected){//如果未被选中，清除一下；
    //             waitSetedValue['quantitycheck'] = {value:isQuantityCheckSelected,display:'否'};
    //             waitSetedValue['unit'] = {value:undefined};
    //             waitSetedValue['price'] = {value:isQuantityCheckSelected,display:'否'};
    //             waitSetedValue['quantity']={value:isQuantityCheckSelected,display:'否'};

    //         }
    //         if(isQuantityCheckSelected){
    //             waitSetedValue['quantitycheck'] = {value:isQuantityCheckSelected,display:'是'};  
    //         }
    //         //在这里设置一下表单的值
    //         this.props.form.setFormItemsValue('formAccount',waitSetedValue);
    //         this.props.form.setFormItemsDisabled('formAccount',{'balancetype':!isBankSelected,'bankacc':!isBankSelected,'billdate':!isBankSelected,'billnumber':!isBankSelected,'billtype':!isBankSelected,'unit':!isQuantityCheckSelected , 'price':!isQuantityCheckSelected,'quantity':!isQuantityCheckSelected});
    //         //这里需要将默认计量单位设置为必输项目；
    //         this.props.form.setFormItemsRequired('formAccount',{'unit':isQuantityCheckSelected});

    //     //added by liusenc 20180807 11:15 
    //     //因为平台没法翻译pk_entity.code，display为0028，value为12Z08923892，类型的数据，因此这里自己处理一下：
    //     vo.body['formAccAss'].rows.forEach((ele)=>{
    //         ele.values["pk_entity.code"].value = ele.values["pk_entity.code"].display;
    //     })//fixed by liusenc 20180913		
    //     this.props.editTable.setTableData('formAccAss', vo.body['formAccAss']);
    //     //this.state.formPanel.moduleMap = {};
    //     let genData = this.makeCtrlDatas(moduleMap,ctrlData);

    //     if(genData !== null){
    //         this.props.editTable.setTableData('listModules',genData);
    //     }else{
    //         this.props.editTable.setTableData('listModules',{rows:[]});//如果没有受控模块，那么清空一下数据表
    //     }

    //     setTimeout(() => {
    //         callback && callback();
    //     },0)
    // }

   
    sortCtrlDatasFunc(rowa,rowb){//根据受控模块编码来进行排序；
        return rowa.values.code.value - rowb.values.code.value;
    }  
    genCtrlStringByTable(){//根据选中的受控模块数据来生成相应的String串；
        let cdataRows = this.props.editTable.getAllRows('listModules');
        //在这里过滤一下，如果status为3也即是删除的不再考虑；
        let dataRows = [];
        if(cdataRows !== null && cdataRows.length > 0){
            cdataRows.forEach((ele)=>{
                if(ele.status !== "3"){//已经删除的不管；
                    dataRows.push(ele);                   
                }               
            })
        }
        let retArr = "";
        if(dataRows !== null && dataRows.length > 0 ){            
            dataRows.sort(this.sortCtrlDatasFunc);
            dataRows.forEach((ele)=>{
                let tmp = ele.values.code.value + defaultLinker + (ele.values.flag.value ? defaultFlag : defaultFlagNo) + defaultSeperator;
                retArr = retArr + tmp;
            })          
            retArr = retArr.substr(0,retArr.length - 1);
        }
        return retArr;        
    }  
    loadMidAccount(pk_accasoa,callback){
        ajax({
            loading: true,
            url:'/nccloud/uapbd/account/ListMidAccountChildrenAction.do', 
            data: {
                ...this.config,
                pk_accasoa: pk_accasoa
            }, 
            success:res => callback && callback(res.data)
        }); 
    }

    loadQuickAssistAccount(pk_chart,callback){
        ajax({
            loading: true,
            url:'/nccloud/uapbd/account/ListMidAccountChildrenAction.do', 
            data: {
                ...this.config,
                pk_accasoa: pk_accasoa
            }, 
            success:res => callback && callback(res.data)
        }); 
    }

    routerToCard(pk_account,pk_chart, callback){ //一个主键不能确定一条数据！！！！！！！
        this.state.showMode = 'card';
        this.state.editMode = false;
        this.setState(this.state, () => {
            this.props.form.setFormStatus('formAccount', 'browse');
            this.props.cardTable.setStatus('formAccAss', 'browse');
            setTimeout(() =>{
                this.updateButtonStatus();
                this.loadDataForm({pk_account:pk_account,pk_chart:pk_chart, mode: 'load'}, (vo, moduleMap,ctrlData) => {
                    this.fillDataForm(vo, moduleMap,ctrlData);
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBackBtn: true,
                    });
                    callback && callback();
               });
            });
           
        });
    }
    /**
     * @description: 返回列表
     * @param {isCardback} 区分是否由卡片页返回列表,true:卡片返回列表，默认false
     * @return: 
     */
    routerToList(callback, isCardback=false){
        this.state.showMode = 'list';
        this.state.editMode = false;
        if(!isCardback){ //由卡片返回列表时,不清除选中行标记
            this.state.listPanel.listtree.selectedRecord = undefined;
        }
        this.setState(this.state, () => {
            this.loadDataTree((datas) => {
                this.fillDataTree(datas, () => {
                    //设置滚动条高度
                    this.updateButtonStatus();
                    callback && callback();
                });
            });
        });
    }	

    save(vo, callback){
        //保存vo前校验
        this.props.cardTable.filterEmptyRows('formAccAss');
        if(!this.props.form.isCheckNow('formAccount')){
            return;
        }
        //在这里加一下保存前的校验：科目编码，科目名称，科目类型，如果勾选了数量核算，那么还得校验默认计量单位是否为空；
        let curValue = this.props.form.getFormItemsValue('formAccount',['code','name','pk_acctype','quantitycheck','unit','cashtype']);
        if(curValue[3].display === this.lang['10140ACCB-000056']){//如果数量核算被选中，那么校验一下默认计量单位是否为空，若为空那么就跑错误/* 国际化处理： 是*/
            if(!curValue[4].value || curValue[4].value.trim() === ""){
                toast({color:'warning',content:this.lang['10140ACCB-000059']+"！"});/* 国际化处理： 默认计量单位不能为空！,默认计量单位不能为空*/
                return;
            }
        }
      
        let genCtrlString = this.genCtrlStringByTable();//产生受控模块数据；
        this.props.form.setFormItemsValue('formAccount',{'ctrlmodules':{value:genCtrlString,display:genCtrlString}});
                         
        let accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
        this.props.validateToSave(vo,()=>{
            ajax({
            loading:true,
            data: vo,
            url:'/nccloud/uapbd/account/SaveAccountAction.do',
            success:(res) => {
                toast({title : this.lang['10140ACCB-000014'],color : 'success'});/* 国际化处理： 保存成功！*/
                res && res.data && callback && callback(res.data || {});//后台适配了代码，保存成功后，返回保存后的pk_account;20181211 added by liusenc
            }
        })
    },{"formAccount":'form',"formAccAss":"cardTable"},'card');
    }

    /* 在这里增加卡片分页页面*/
    pageInfoClick(key){
        let record = {};
        let index = 0;
        switch(key){
            case 'firstItem':
                index = 0;
                break;
            case 'prevItem':
                index = this.state.curIndex-1;
                break;
            case 'nextItem':
                index = this.state.curIndex+1;
                break;
            default:
                // index = this.state.listPanel.listPrintpks.length-1;
                index = this.state.listPanel.listCodes.length-1;
                break;
        }
        // record.id = this.state.listPanel.listPrintpks[index];
        record.id = this.state.listPanel.listCodes[index].pk_account;
        this.state.curIndex = index;
        this.state.isFirst = index == 0 ? true : false;
        this.state.isEnd = index == this.state.listPanel.listCodes.length-1 ? true : false;
                //this.state.selRecordId = record.id;
        this.setState(this.state,()=>{
            this.routerToCard(record.id, this.state.refChartVersion.value)}
            );

             
    }

    onButtonClick(areaname, props, btncode){
        switch (btncode) {
            case 'add':
                this.onAdd();
                break;
            case 'edit':
                this.onEdit();
                break;
            case 'editbat':
                this.onBatEdit();
                break;
            case 'addcopy':
                this.onCopy();
                break;
            case 'canceledit':
                this.onCancelEdit();
                break;
            case 'card_backlist':
                this.routerToList(null,true);
                break;  
            case 'refresh':
                this.onRefresh();
                break;
            case 'save':
                this.onSave();
                break;        
            case 'saveadd':
                this.onSaveAdd();
                break;     
            case 'enable':
                this.onEnable(true);
                break;
            case 'enable_undo':
                this.onEnable(false);
                break;
            case 'saveadd':
                this.onSaveAdd();
                break; 
            case 'addrow':
                this.onAddRow();
                break;  
            case 'deleterow':
                this.onDeleteRow();
                break;   
            case 'movedown':
                this.onMovedown();
                break;   
            case 'moveup':
                this.onMoveup();
                break;   
            case 'addmid':
                this.onAddMid();
                break;      
            case 'supportcal':
                this.onQuickCal();
                break; 
            case 'delete':
                this.onDelete();
                break; 
            case 'print':
                this.onPrint('print');
                break; 
            case 'print_output':
                this.onPrint('output');
                break; 
            case 'supportcal':
                this.onQuickCal();
                break;
            case 'addmodule':
                this.onAddModule();
                break; 
            case 'deletemodule':
                this.onDeleteModule();
                break;
            case 'export':
                this.props.modal.show('exportFileModal');
                break;
            default:
                break;
        }
    }
    onAddModule(){
        var {selectModule} = this.state;
        selectModule.init(() => {
            this.state.selectModule.modal.show = true;
            this.setState(this.state);
        });
    }
    onDeleteModule(){
        promptBox({
            color:"warning",
            title:this.lang['10140ACCB-002002'],/* 国际化处理： 删除*/
            content: this.lang['10140ACCB-002003'],/* 确定要删除吗？*/
            beSureBtnClick: () => {
                let checkedDatas = this.props.editTable.getCheckedRows('listModules');
                let delIndexes = (checkedDatas || [] ).map( ele => { return ele.index});
                this.props.editTable.deleteTableRowsByIndex('listModules',delIndexes,true);//
            }
        }); 
    }

    onAdd(){
        var {refOrg, refSystem, refChart, refChartVersion, listPanel} = this.state;
        var  fetchListBaseData = () => {
            return {
                head:{
                    formAccount: {
                        rows:[{
                            values:{
                                pk_accchart:{
                                    value: this.state.refChartVersion.value,
                                    display: ''
                                },
                                code:{
                                    value: listPanel.listtree.selectedRecord ?  listPanel.listtree.selectedRecord.nodeData.code.value : '',
                                    display: ''
                                }
                            }
                        }]
                    }
                },
                body:{
                    formAccAss:{
                        rows:[]
                    }
                }
            };
        };
        var fetchCardBaseData = () => {
            var accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
            return {
                head:{
                    formAccount: {
                        rows:[{
                            values:{
                                pk_accchart:{
                                    value: this.state.refChartVersion.value,
                                    display: ''
                                },
                                code:{
                                    value: accountvo.head.formAccount.rows[0].values.code.value,
                                    display: ''
                                }
                            }
                        }]
                    }
                },
                body:{
                    formAccAss:{
                        rows:[]
                    }
                }
            };
        };
        var accountvo = this.state.showMode == 'list' ? fetchListBaseData() : fetchCardBaseData();
        this.state.editMode = true;

        this.state.showMode = 'card';
        this.state.editModeCfg = {
            handlerMode: 'create',
            srcpk: undefined,
            srccode: accountvo.head.formAccount.rows[0].values.code.value
        };
        //准备开启编辑表单
        this.props.form.EmptyAllFormValue("formAccount");
        this.props.form.setFormStatus('formAccount', 'add');
        this.setState(this.state, () => {
            //this.props.form.setFormStatus('formAccount', 'edit');
            this.props.cardTable.setStatus('formAccAss', 'edit');
            this.fillDataForm(accountvo, {}, [], ()=>{
                let tempaccountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                this.handlerFormByCurCode(tempaccountvo,() =>{
                    this.callFormItem(() => {
                        this.updateButtonStatus();
                        this.restFormItem();//added by liusenc 20180927
                    });
                });
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: false,
                });
            });
        });
    }
    onCopy(){
        var initCard = (src, callback) =>{
            var {refOrg, refSystem, refChart, refChartVersion, listPanel} = this.state;
            if( src == 'card'){
                var accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                //清空主键
                this.props.form.setFormItemsValue('formAccount',{
                    pk_account:{
                        value: '',
                        display: ''
                    },
                    pk_accchart:{
                        value: this.state.refChartVersion.value,
                        display: ''
                    },
                    pk_originalaccount:{
                        value: accountvo.head.formAccount.rows[0].values.pk_account.value,
                        display: ''
                    },
                    pk_accasoa:{
                        value: undefined,
                        display: ''
                    }
                });
                setTimeout(() => {
                    var accountvo2 = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                    callback(accountvo2);
                }, 0);
             
            }else{
                this.loadDataForm({
                    pk_account:  this.state.listPanel.listtree.selectedRecord.id,
                    pk_chart: this.state.refChartVersion.value
                },(vo, moduleMap,ctrlData) => {
                    this.fillDataForm(vo, moduleMap,ctrlData,() => {
                        var accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                        this.props.form.setFormItemsValue('formAccount',{
                            pk_account:{
                                value: '',
                                display: ''
                            },
                            pk_accchart:{
                                value: this.state.refChartVersion.value,
                                display: ''
                            },
                            pk_originalaccount:{
                                value: accountvo.head.formAccount.rows[0].values.pk_account.value,
                                display: ''
                            },
                            pk_accasoa:{
                                value: undefined,
                                display: ''
                            }
                            
                        });
                        setTimeout(() => {
                            var accountvo2 = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                            callback(accountvo2);
                        }, 0);
                    });
               });
            }
        };
        var src = this.state.showMode;
        this.state.editMode = true;

        this.state.showMode = 'card';
       
        this.setState(this.state, () =>{
            initCard(src,(accountvo) =>{
                this.state.editModeCfg = {
                    handlerMode: 'create',
                    srcpk: undefined,
                    srccode: accountvo.head.formAccount.rows[0].values.code.value
                };
                this.setState(this.state, () => {
                    this.props.form.setFormStatus('formAccount', 'edit');
                    this.props.cardTable.setStatus('formAccAss', 'edit');
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBackBtn: false,
                    });
                    setTimeout(() => {
                        this.updateButtonStatus();
                        setTimeout(() => {
                            this.restFormItem();
                        }, 0);
                    }, 0);
                });
             });
        })
        
    }

  
    onEdit(){
        let onShowMode = this.state.showMode;
        var pkAccount = undefined;
        if(this.state.showMode =='card'){
            let accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
            this.state.editMode = true;

            this.state.showMode = 'card';
            this.state.editModeCfg = {
                handlerMode: 'edit',
                srcpk: accountvo.head.formAccount.rows[0].values.pk_account.value,
                srccode: accountvo.head.formAccount.rows[0].values.code.value
            };
            pkAccount = accountvo.head.formAccount.rows[0].values.pk_account.value;//用于下面的卡片界面；
            this.setState(this.state, () => {
                this.props.form.setFormStatus('formAccount', 'edit');
                this.props.cardTable.setStatus('formAccAss', 'edit');
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: false,
                });
                setTimeout(() =>{
                    this.updateButtonStatus(true);
                    
                },0);
            });
        }else{
            if( !this.state.listPanel.listtree.selectedRecord){
                return;//如果未选中数据
            }
            this.state.editMode = true;

            this.state.showMode = 'card';
            this.state.editModeCfg = {
                handlerMode: 'edit',
                srcpk: this.state.listPanel.listtree.selectedRecord.id,
                srccode: this.state.listPanel.listtree.selectedRecord.code
            };
            this.setState(this.state, () => {
                this.loadDataForm({
                    pk_account: this.state.listPanel.listtree.selectedRecord.id,
                    pk_chart: this.state.refChartVersion.value
                },(vo, moduleMap,ctrlData) => {
                    this.fillDataForm(vo, moduleMap,ctrlData,() =>{
                        this.props.form.setFormStatus('formAccount', 'edit');
                        this.props.cardTable.setStatus('formAccAss', 'edit');
                        this.props.BillHeadInfo.setBillHeadInfoVisible({
                            showBackBtn: fasle,
                        });
                        setTimeout(() =>{
                            this.updateButtonStatus(true);
                        },0);
                    });       
                });
            });
        }
     
         //判断当前新增是来源于卡片还是列表, 获取父科目的主键，pkParentAccount;
         //这里做一下判断，如果是卡片页面，如果是列表页面跳转的怎样//added by liusenc 20190107

        //var pkAccount = this.state.listPanel.listtree.selectedRecord ?  this.state.listPanel.listtree.selectedRecord.id : undefined;
        if(onShowMode == 'list'){
            pkAccount = this.state.listPanel.listtree.selectedRecord ?  this.state.listPanel.listtree.selectedRecord.id : undefined;
        }
        this.setState(this.state, () => {
            var {refOrg, refSystem, refChart, refChartVersion, listPanel} = this.state;
            this.loadDataForm({
                pk_account: pkAccount,
                pk_chart: refChartVersion.value
            },(vo, moduleMap,ctrlData) => {
                this.fillDataForm(vo, moduleMap,ctrlData,() =>{
                    this.props.form.setFormStatus('formAccount', 'edit');
                    this.props.cardTable.setStatus('formAccAss', 'edit');
                    this.props.BillHeadInfo.setBillHeadInfoVisible({
                        showBackBtn: false,
                    });
                    setTimeout(() =>{
                        this.updateButtonStatus(true);
                        this.restFormItem();;//adde by liusenc 20180927
                    },0);
                });       
            });
        });
    }

   
    onBatEdit(){
        this.BatchEditStepModal.show({
            config:this.config, 
            //增加参数,判断当前版本是否为临时版本；如果是就取当前pk_accchart，否则，取条件为9999-99-99日期且非临时版本的科目表；
            isTemp:this.state.refChartVersion.isTemp,//这个用来判断是否是临时科目表版本//added by liusenc 20180920
            pk_accchart: this.state.refChartVersion.value,//这个是科目表版本中选定的value，这个可能会有问题啊，怀疑是不是应该取科目表参照中的值需要跟一下NC的代码			
            pksys: this.state.refSystem.value.refpk, 
            pkorg: this.state.refOrg.value ? (this.state.refOrg.value instanceof Array ? this.state.refOrg.value[0].refpk : this.state.refOrg.value.refpk): '',
            searchoid: this.batEditSearchOid,
            curchart:{...this.state.refChart.value}
         },(data) =>{
            if(data.selectedPKs.length==0){
                toast({color:'warning',content:this.lang['10140ACCB-001005']});
            }else{
                ajax({
                    loading:true,
                    data: data,
                    url:'/nccloud/uapbd/account/BatEditSaveAction.do',
                    success:(res) => {
                        var msgs = res.data;
                        if(msgs && msgs.length > 0){
                            toast({color:'warning',content:msgs});
                        }else{
                            toast({color:'success',content:this.lang['10140ACCB-002004']});
                        }
                        this.BatchEditStepModal.cancel(() => {
                            this.routerToList();

                        });


                    }
                });
            }
         });
    }
    onBackList(){
        this.routerToList();
    }
    //获取新增科目编码的索引值
    getCodeIndex = (codes, code) => {
        let leftIndex = 0
        let rightIndex = codes.length - 1

        while (leftIndex <= rightIndex) {
            var midIndex = Math.floor((leftIndex + rightIndex) / 2);
            var midval = codes[midIndex].code;
            if (leftIndex == rightIndex && midval > code) {
                return midIndex;
            }
            if (leftIndex == rightIndex && midval < code) {
                return midIndex + 1;
            }
            if (midval > code) {
                //左边找
                rightIndex = midIndex - 1;
            } else if (midval < code) {
                //右边找
                leftIndex = midIndex + 1;
            } else {
                return midval;
            }
        }
        return leftIndex;
    }
    // 保存回调
    saveCallBack = (saveResult) => {
        let {listPrintpks, listCodes} = this.state.listPanel
        //saveMode
        if(listPrintpks && listPrintpks.indexOf(saveResult.pk_account) < 0 ){
            let addIndex = this.getCodeIndex(listCodes, saveResult.code)
            listPrintpks.splice(addIndex, 0, saveResult.pk_account);
            listCodes.splice(addIndex, 0, {pk_account: saveResult.pk_account, code: saveResult.code});
            this.state.curIndex = addIndex
            this.state.isFirst = addIndex == 0 ? true : false;
            this.state.isEnd = addIndex == listCodes.length - 1 ? true : false;
        }
    }
    onSave(){
        this.props.cardTable.filterEmptyRows('formAccAss');
        //在这里加一下保存前的校验：科目编码，科目名称，科目类型，如果勾选了数量核算，那么还得校验默认计量单位是否为空；
        let curValue = this.props.form.getFormItemsValue('formAccount',['code','name','pk_acctype','quantitycheck','unit','cashtype']);
        console.log(curValue);
        //拿出来的数据是按照次序的，现在开始一次校验；
        if(!curValue[0].value || (curValue[0].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000086']});/* 国际化处理： 科目编码不能为空！*/
            return;
        }
        if(!curValue[1].value || (curValue[1].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000061']+"！"});/* 国际化处理： 科目名称不能为空！,科目名称不能为空*/
            return;
        }       
        if(!curValue[2].value || (curValue[2].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000062']+"！"});/* 国际化处理： 科目类型不能为空！,科目类型不能为空*/
            return;
        }
        if(curValue[3].display === this.lang['10140ACCB-000056']){//如果数量核算被选中，那么校验一下默认计量单位是否为空，若为空那么就跑错误/* 国际化处理： 是*/
            if(!curValue[4].value || curValue[4].value.trim() === ""){
                toast({color:'warning',content:this.lang['10140ACCB-000059']+"！"});/* 国际化处理： 默认计量单位不能为空！,默认计量单位不能为空*/
                return;
            }
        }
        if(curValue[5].display === null || curValue[5].display.trim() === "" || curValue[5].value === null || curValue[5].value.trim() === ""){//现金分类不能为空
            toast({color:'warning',content:this.lang['10140ACCB-000063']+"！"});/* 国际化处理： 现金分类不能为空！,现金分类不能为空*/
            return;
        }  		
        let genCtrlString = this.genCtrlStringByTable();//产生受控模块数据；
        //将表头信息设置一下；
        //if( genCtrlString !== null && genCtrlString.length > 0 ){
            this.props.form.setFormItemsValue('formAccount',{'ctrlmodules':{value:genCtrlString,display:genCtrlString}});
        //}                          
        let accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
        this.save(accountvo, (saveResult) =>{
            //this.routerToList();
            //在这里做一下缓存更新，如果更新以后，那么把这个pks放到列表打印的pks中去；//主要是为了适配卡片分页按钮；
            //如果没有在listPrintpks中找到保存的结果，那么就认为这里是新增的否则认为是更新的
            this.saveCallBack(saveResult)

            this.setState(this.state,()=>{
                this.routerToCard(saveResult.pk_account, this.state.refChartVersion.value);//停留在卡片界面added by liusenc 20181211
            })
            
        });
    }

    onSaveAdd(){
        this.props.cardTable.filterEmptyRows('formAccAss');
        //在这里加一下保存前的校验：科目编码，科目名称，科目类型，如果勾选了数量核算，那么还得校验默认计量单位是否为空；
        let curValue = this.props.form.getFormItemsValue('formAccount',['code','name','pk_acctype','quantitycheck','unit']);
        console.log(curValue);
        //拿出来的数据是按照次序的，现在开始一次校验；
        if(!curValue[0].value || (curValue[0].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000086']});/* 国际化处理： 科目编码不能为空！*/
            return;
        }
        if(!curValue[1].value || (curValue[1].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000061']+"！"});/* 国际化处理： 科目名称不能为空！,科目名称不能为空*/
            return;
        }       
        if(!curValue[2].value || (curValue[2].value.trim() === "")){
            toast({color:'warning',content:this.lang['10140ACCB-000062']+"！"});/* 国际化处理： 科目类型不能为空！,科目类型不能为空*/
            return;
        }
        if(curValue[3].display === this.lang['10140ACCB-000056']){//如果数量核算被选中，那么校验一下默认计量单位是否为空，若为空那么就跑错误/* 国际化处理： 是*/
            if(!curValue[4].value || curValue[4].value.trim() === ""){
                toast({color:'warning',content:this.lang['10140ACCB-000059']+"！"});/* 国际化处理： 默认计量单位不能为空！,默认计量单位不能为空*/
                return;
            }
        }
        let genCtrlString = this.genCtrlStringByTable();//产生受控模块数据；
        //将表头信息设置一下；
        if( genCtrlString !== null && genCtrlString.length > 0 ){
            this.props.form.setFormItemsValue('formAccount',{'ctrlmodules':{value:genCtrlString,display:genCtrlString}});
        }        
        let accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
        this.save(accountvo, (saveResult) =>{
            //在这里做一下缓存更新，如果更新以后，那么把这个pks放到列表打印的pks中去；//主要是为了适配卡片分页按钮；
            //如果没有在listPrintpks中找到保存的结果，那么就认为这里是新增的否则认为是更新的
            this.saveCallBack(saveResult)

            this.setState(this.state,()=>{
                this.onAdd();
            })
            
        });
    }
    onCancelEdit(){
        promptBox({
            color:"warning",
            title:this.lang['10140ACCB-002001'],/* 国际化处理： 提示*/
            content: this.lang['10140ACCB-000065'],/* 国际化处理： 确认是否取消编辑*/
            beSureBtnClick: () => {
                this.props.form.setFormStatus('formAccount', 'browse');
                this.props.cardTable.setStatus('formAccAss', 'browse');
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true,
                });
                setTimeout(() => {
                    if(!this.state.listPanel.listtree.selectedRecord){
                        this.routerToList();
                    }else{
                        this.routerToCard(this.state.listPanel.listtree.selectedRecord.id, this.state.refChartVersion.value);//停留在卡片界面
                    }
                    }, 0);
            }
        });      
    }
    
    onRefresh(){
     
    if(this.state.refChartVersion && this.state.refChartVersion.value ){
        var showMode = this.state.showMode,
            pk_account = showMode == 'list' ? '': this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.pk_account.value,
            pk_chart = this.state.refChartVersion.value;
        
        if(showMode == 'list'){
            this.routerToList();
        }else{
            this.routerToCard(pk_account, pk_chart);
        }   
    }else{
        this.fillDataTree([], () => {
            this.updateButtonStatus();
        });        
    }
        toast({ color: 'success', title: this.lang['10140ACCB-000066']+"！" });/* 国际化处理： 刷新成功！,刷新成功*/
    }

    onDelete(){
        var fn = () =>{
            var showMode = this.state.showMode;
            if(showMode == 'list' && !this.state.listPanel.listtree.selectedRecord){
                return;//如果未选中数据
            }
            var param = {
                pk_account:showMode == 'list' ? this.state.listPanel.listtree.selectedRecord.id : this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.pk_account.value,
                pk_chart:this.state.refChartVersion.value
            };
            ajax({
                loading:true,
                data: param,
                url:'/nccloud/uapbd/account/DeleteAccountAction.do',
                success:(res) => {
                    toast({ color: 'success', title: this.lang['10140ACCB-002006']});/* 国际化处理： 删除成功！*/
                    this.routerToList(() =>{
                        
                        this.state.listPanel.listtree.selectedRecord = undefined;
                        this.setState(this.state);
                        
                    });
                }
            });
        };
        promptBox({
            color:"warning",
            title:this.lang['10140ACCB-002002'],/* 国际化处理： 提示*/
            content: this.lang['10140ACCB-000067'],/* 国际化处理： 确认是否删除数据*/
            size:'sm',
            beSureBtnClick: fn
        });
        
    }

   
    onEnable(enable = true){ 
        var fn = () => {
            var showMode = this.state.showMode ;
            if(showMode == 'list' && !this.state.listPanel.listtree.selectedRecord){
                return;//如果未选中数据
            }
            var pk_account = showMode == 'list' ? this.state.listPanel.listtree.selectedRecord.id : this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.pk_account.value,
            enablestate = showMode == 'list' ? this.state.listPanel.listtree.selectedRecord.nodeData['enablestate'].value : this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.enablestate.value,           
            pk_chart = this.state.refChartVersion.value;
            if(enable && enablestate === "2" || !enable && enablestate === "3"){//2为已经启用，3为已经停用
                toast({color:'warning',content:enablestate === "2" ?this.lang['10140ACCB-000068']+"！":this.lang['10140ACCB-000069']+"！"});/* 国际化处理： 数据已经启用！,数据已经停用！,数据已经启用,数据已经停用*/
                return;
            }
            ajax({
                loading:true,
                data: {
                    pk_chart: pk_chart,
                    pk_account: pk_account
                },
                url: enable? '/nccloud/uapbd/account/EnableAccountAction.do' : '/nccloud/uapbd/account/UnEnableAccountAction.do',
                success:(res) => {
                    
                    showMode == 'list' ? this.routerToList() : this.routerToCard(pk_account, pk_chart);
                    toast({title :  (enablestate === "2"  ?this.lang['10140ACCB-000015']:this.lang['10140ACCB-000016']),color : 'success'});/* 国际化处理： 停用成功！,启用成功！*/
                }
            });
        }

        promptBox({
            color:"warning",
            title:this.lang['10140ACCB-000040'],/* 国际化处理： 提示*/
            size:'lg',
            content: enable ? this.lang['10140ACCB-000072']: this.lang['10140ACCB-000073'],/* 国际化处理： 确认是否启用数据,确认是否停用数据*/
            beSureBtnClick: fn
        });
       
    }
    onPrint(type = 'print'){
        var showMode = this.state.showMode,
            pk_accounts = showMode == 'list' ?  this.state.listPanel.listPrintpks : [this.props.createMasterChildData(this.config.pagecode, 'formAccount').head.formAccount.rows[0].values.pk_account.value],
            pk_chart = this.state.refChartVersion.value;
            //列表界面将待打印数据的pk全部拿出来，modidfied by liusenc 2-0180810
            let cpks = [];
            cpks.push(pk_chart);
            cpks = cpks.concat(pk_accounts);
            if(cpks.length < 2){//说明没有数据
                return;
            }			
            this.state.printpks = cpks;
            this.state.printnodekey = ( showMode == 'list' ? this.config.listNodeKey : this.config.cardNodeKey);
        /*
        param = {
            funcode: this.config.funcode || '',
            nodekey: showMode == 'list' ? this.config.listNodeKey : this.config.cardNodeKey,
            oids: cpks,
        };
        if(type == 'output'){
            param.outputType = 'output';
        }
        print('pdf', 'nccloud/uapbd/account/EnableAccountAction.do', param);
        */
       if('print' === type){
           print('pdf','/nccloud/uapbd/account/AccountPrintAction.do',{
                funcode: this.config.appcode || '',
                nodekey: showMode == 'list' ? this.config.listNodeKey : this.config.cardNodeKey,
                oids: cpks})
        }else if('output' === type){
            this.setState(this.state,
            this.refs.printOutput.open());
        }      
        
    }

    
    onAddRow(){
        //首先校验，是否超过了9个辅助核算项目，查过了报错；
        let curlines = this.props.cardTable.getNumberOfRows('formAccAss');//
        if(curlines >= 9){
            toast({color:'warning',content:this.lang['10140ACCB-000044']+"9"+this.lang['10140ACCB-000045']+"，"+this.lang['10140ACCB-000046']+"！"});/* 国际化处理： 辅助核算项数已经达到最大数9个，不能增加！,辅助核算项数已经达到最大数,个,不能增加*/
            return;
        }        
        var {selectAssist} = this.state;
        selectAssist.modal.show = true;
        selectAssist.init(() => {
            this.setState(this.state);
        });
    }

    onDeleteRow(){
        promptBox({
            color:"warning",
            title:this.lang['10140ACCB-002002'],/* 国际化处理： 删除*/
            content: this.lang['10140ACCB-002003'],/* 确定要删除吗？*/
            beSureBtnClick: () => {
                let checkedDatas = this.props.cardTable.getCheckedRows('formAccAss');
                let delIndexes = [];
                checkedDatas.forEach((ele)=>{
                    delIndexes.push(ele.index);
                })
                this.props.cardTable.delRowsByIndex('formAccAss',delIndexes);
                //删除以后，如果尚且有数据，那么对数据的index列进行一下重新设置；
                let currVisibleRows = this.props.cardTable.getNumberOfRows('formAccAss');
                if(currVisibleRows > 0){//表中尚且有数据；
                    let index = 0;
                    for(;currVisibleRows > 0;currVisibleRows--){
                        this.props.cardTable.setValByKeyAndIndex('formAccAss',index,'id',{value:index+1,display:index+1});
                        index = index + 1;
                    }
                }
                //最后在这里设置一下按钮，将按钮上移下移删除置灰；
                this.props.button.setDisabled({
                    deleterow:true ,
                    movedown:true ,
                    moveup:true ,
                });
            }
        });   
    }

    moveDownOrUp(dir){
        var  allRows    = this.props.cardTable.getVisibleRows('formAccAss');
        var checkRows   = this.props.cardTable.getCheckedRows('formAccAss');
        if(checkRows.length != 1)
            return
        var selectIndex = checkRows[0].index;
        var targetIndex = dir == 'up' ? selectIndex - 1 : selectIndex + 1;

      
        if(selectIndex == -1)
            return;
        if(dir == 'up' &&   targetIndex < 0)
            return;
        if(dir == 'down' && targetIndex > allRows.length - 1 )
            return;
        
        var selData = allRows[selectIndex],
            tarData = allRows[targetIndex],
            tempData = allRows[targetIndex];
        if(selData.values.num.value > 1 || tarData.values.num.value > 1){
            toast({color:'warning',content:this.lang['10140ACCB-000074']+"！"});/* 国际化处理： 不能与共享辅助核算交换顺序！,不能与共享辅助核算交换顺序*/
            return;
        }
        let temIndex = selData.values.id.value;
        selData.values.id.value = tarData.values.id.value;
        tarData.values.id.value = temIndex;
        allRows[targetIndex] = selData;
        allRows[selectIndex] = tarData;
        this.props.cardTable.setTableData('formAccAss',{rows:allRows});
        setTimeout(() => {
            this.props.cardTable.selectRowsByIndex('formAccAss',targetIndex);
        }, 0);
    }

    onMovedown(){
        this.moveDownOrUp('down');
      
    }
    onMoveup(){
        this.moveDownOrUp('up');
    }

    onAddMid(){
        this.state.modalInsertMid.init(() => {
            var {modal , refAccount, code , name} = this.state.modalInsertMid;
            modal.show = true;
            this.setState(this.state);
        });
    }

    saveMid(callback){
        var {modal , refAccount, code , name, listMid} = this.state.modalInsertMid,
            {refOrg, refSystem, refChart, refChartVersion} = this.state,
        checkvos = this.props.table.getCheckedRows(listMid.areacode) || [],
        pkaccounts = checkvos.map( v => {
            return v.data.values.pk_account.value;
        });
        if(checkvos.length === 0){
            toast({color:'warning',content:this.lang['10140ACCB-000075']+"！"});/* 国际化处理： 需选择至少一个科目进行插入！,需选择至少一个科目进行插入*/
            return ;
        } 
        if(name.value == undefined || code.value === undefined){
            toast({ color: 'warning', content: this.lang['10140ACCB-000033']+","+this.lang['10140ACCB-000035']+","+this.lang['10140ACCB-000076']+"!"});/* 国际化处理： [插入科目编码],[插入科目名称]不能为空!,插入科目编码,插入科目名称,不能为空*/
            return;
        }
        let allowRepeat = "false";//默认首次为不允许插入已有的重复编码；added by liusenc 20180925
        let chartName = checkvos[0].data.values.pk_accchart.display;//这个用来拼接下面代码中的提示；
        ajax({
            loading: true,
            url:'/nccloud/uapbd/account/SaveMidAccountAction.do', 
            data: {
                allRepeat:allowRepeat,
                pk_account:pkaccounts,
                pk_parentAccount: refAccount.value.values.pk_account.value,
                name: name.value,
                code: code.value,
                pk_accchart: (this.state.refChart.value instanceof Array ? this.state.refChart.value[0].refpk : this.state.refChart.value.refpk),//refChartVersion.value//20180809修改by liusenc，传递科目表的参数；//修改20180814-20：49，发现参照突然变成了数组了
            }, 
            success:(res)=>{//res => callback && callback()
                //console.log(res);
                //fixed 增加插入中间级逻辑校验20180925 
                if(res.success && res.data.indexOf("32001") > -1){
                    let tipsContent = res.data.split("#",2);
                    promptBox({
                        color:"warning",
                        title:this.lang['10140ACCB-000040'],/* 国际化处理： 提示*/
                        content: tipsContent[1] + "\n" +/*  this.lang['10140ACCB-000077']+"！"+  this.lang['10140ACCB-000078']+"："+this.lang['10140ACCB-000079']+"："+chartName+'\n'+ */ /* 国际化处理： 科目编码重复！所在科目表为：科目表编码：,科目编码重复,所在科目表为,科目表编码*/
                        this.lang['10140ACCB-000080']+"？",/* 国际化处理： 是否允许编码重复的科目在其插入后是否作为其下级科目？,是否允许编码重复的科目在其插入后是否作为其下级科目*/
                        beSureBtnClick: () => {
                            ajax({
                                loading:true,
                                url:'/nccloud/uapbd/account/SaveMidAccountAction.do',
                                data:{
                                    allRepeat:"true",
                                    pk_account:pkaccounts,
                                    pk_parentAccount: refAccount.value.values.pk_account.value,
                                    name: name.value,
                                    code: code.value,
                                    pk_accchart: (this.state.refChart.value instanceof Array ? this.state.refChart.value[0].refpk : this.state.refChart.value.refpk),//refChartVersion.value//20180809修改by liusenc，传递科目表的参数；//修改20180814-20：49，发现参照突然变成了数组了
                                },
                                success:res=> callback && callback()
                            }) 
                        }
                    });

                }else{
                    callback && callback();
                }

            }
        });
    }

    onQuickCal(){
        var {refOrg, refSystem, refChart, refChartVersion} = this.state;
        var {modal , refCalItem, listCalItem , listAccountItem} = this.state.modalQuickCal;
        this.state.modalQuickCal.init(() => {
            modal.show = true;
            this.setState(this.state,() =>{
                ajax({
                    loading: true,
                    url:'/nccloud/uapbd/account/ListAccountQuickAssistAction.do', 
                    data: {
                        pk_accchart:refChartVersion.value,
                        ...this.config
                    }, 
                    success:(res) => {
                        this.props.table.setAllTableData(listAccountItem.areacode,res.data[listAccountItem.areacode]);
                        this.props.editTable.setStatus(listCalItem.areacode,'edit');
                    }
                });
            });
        });
    }

    saveQuickCal(callback){
        var {modal , refCalItem, listCalItem , listAccountItem} = this.state.modalQuickCal;  
        var accountcheckvos = this.props.table.getCheckedRows(listAccountItem.areacode) || [];
        var pk_accasoas = accountcheckvos.map( v => {
                return v.data.values.pk_accasoa.value;
            });
            //debugger;
        var itemvos = this.props.editTable.getAllData(listCalItem.areacode).rows || [],
            paramItems = itemvos.map( item => {
                var keys = Object.keys(item.values);
                var obj = {};
                keys.forEach( key => {
                    obj[key] = item.values[key].value;
                });
                return obj;
        });
		/*
        if( pk_accasoas.length ==0 ){
            toast({color:'warning',content:'请选择科目'});
            return;
        }
        if(paramItems.length == 0 ){
            toast({color:'warning',content:'请选择辅助核算项'});
            return;
        }
		*/
        ajax({
            loading: true,
            url:'/nccloud/uapbd/account/SaveQuickAssistAction.do', 
            data: {
                items: paramItems,
                pk_accasoa: pk_accasoas,
                pk_chart: this.state.refChartVersion.value
            }, 
            success:res => callback && callback()
        });
    }
    onFormBeforeHandler(props,formid,itemname,newValue,oldValue,data){
        //增加一下表单编辑前事件：added by liusenc 20180816 20:39
			let cpk_system = this.state.refSystem.value? (this.state.refSystem.value instanceof Array ? this.state.refSystem.value[0].refpk :this.state.refSystem.value.refpk ): ''; 
            let constPrintLevel0 = {display:this.lang['10140ACCB-000017'],value:"0"};//这个用来设置汇总打印级次的值/* 国际化处理： 末级*/
            let curAccountCode = props.form.getFormItemsValue('formAccount',['code'])[0].value;
            let codeRule = props.form.getFormItemsValue('formAccount',['pk_accchart.pk_accsystem.acccoderule'])[0].value;
            let curAcclevel = codeUtilsGetAccLev(curAccountCode,codeUtilsParseCodeRule(codeRule));//props.form.getFormItemsValue('formAccount',['acclev'])[0].value ? parseInt(props.form.getFormItemsValue('formAccount',['acclev'])[0].value) : 0 ;
            /*        
            if(itemname === "pk_acctype"){
			            let meta = props.meta.getMeta();
			            meta.formAccount.items.map((ele)=>{
			                if(ele.attrcode === 'pk_acctype'){
			                    ele.queryCondition = function(){
			                        return {
			                            "pk_accsystem":cpk_system,
			                            GridRefActionExt:"nccloud.web.uapbd.account.action.RefCondAccType",
			                        }
			                    }
			                }
			            })
			            props.meta.setMeta(meta); 
                    }else if(itemname === 'sumprint_level'){//如果输入为汇总打印级次，那么分析一下当前的编码级次，增加一下下拉的items
                        
                    }
                    */
                   if(itemname === "pk_acctype" && curAcclevel > 1){//如果选择为科目类型，且不为根科目，那么科目类型是不可编辑的；
                       return false;
                   }					
                let meta = props.meta.getMeta();
                if(itemname === "pk_acctype" || itemname === "sumprint_level"){
                    meta.formAccount.items.map((ele)=>{
                        if(ele.attrcode === 'pk_acctype'){
                            ele.queryCondition = function(){
                                return {
                                    "pk_accsystem":cpk_system,
                                    GridRefActionExt:"nccloud.web.uapbd.account.action.RefCondAccType",
                                }
                            }
                        }else if(ele.attrcode === 'sumprint_level'){//如果是汇总打印级次，那么设置一下下拉；
                              ele.options=[];
                              ele.options.push(constPrintLevel0);
                              for(let index =1;index<curAcclevel+1;index++){
                                  ele.options.push({display:index+"",value:index+""});
                              }
                        }
                    })
                }
                props.meta.setMeta(meta); 

        return true;
    }

    //此处做高内聚,表单禁用启用，联动都写到这,牺牲一些效率是值得的
    restFormItem(isEdit = false){
        var form = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss'),
            accountvo = form.head.formAccount.rows[0],
            canEditCfg = {},
            doValCfg = {};
        //设置cashtype
        // AccountVO.BALANCETYPE/* 结算方式 */, AccountVO.BANKACC/* 银行帐号 */, AccountVO.BILLDATE/* 票据日期 */, AccountVO.BILLNUMBER/* 票据号 */, AccountVO.BILLTYPE
        var cashtypeVal = accountvo.values.cashtype.value;
        var cashtypeRelations = ['balancetype','bankacc','billdate','billnumber','billtype'],
            canEdit = cashtypeVal == '2';
        cashtypeRelations.forEach(itemname =>{
            canEditCfg[itemname] = !canEdit;
            if(!canEdit)
                doValCfg[itemname] = {
                    value : false,
                    display: this.lang['10140ACCB-000057']/* 国际化处理： 否*/
                };
        });
      
        // AccountVO.PRICE/* 单价 */, AccountVO.QUANTITY
        //设置quantitycheck
        if(isEdit){//编辑后事件触发的
        var quantitycheckVal = accountvo.values.quantitycheck.value;
        var quantitycheckRelations = ['price','quantity','unit'],
            canEdit = quantitycheckVal == true;
        quantitycheckRelations.forEach(itemname =>{
            canEditCfg[itemname] = !canEdit;
            if(!canEdit)
                doValCfg[itemname] = {
                    value : false,
                    display: this.lang['10140ACCB-000057']/* 国际化处理： 否*/
                };
        });
    }else{
        quantitycheckRelations = ['price','quantity','quantitycheck'],
        canEdit = (accountvo.values.unit.value !== null && accountvo.values.unit.value  && accountvo.values.unit.value.trim() !== '') ;
        quantitycheckRelations.forEach(itemname =>{
            if(itemname !== 'quantitycheck')
                {
                    canEditCfg[itemname] = !canEdit;
                }
            if(!canEdit)
                {
                    doValCfg[itemname] = {
                    value : false,
                    display: this.lang['10140ACCB-000057']/* 国际化处理： 否*/
                };
            }else {
                if('quantitycheck' === itemname){
                    doValCfg[itemname] ={
                        value:true,
                        display:this.lang['10140ACCB-000056']/* 国际化处理： 是*/
                    }
                }
            }
        });           
    }
        
        //AccountVO.INNERINFO
        //设置inneracc
        var inneraccVal = accountvo.values.inneracc.value;
        var inneraccRelations = ['innerinfo'],
             canEdit = inneraccRelations == true;
        inneraccRelations.forEach(itemname =>{
            canEditCfg[itemname] = !canEdit;
            if(!canEdit)
                doValCfg[itemname] = {
                    value : false,
                    display: this.lang['10140ACCB-000057']/* 国际化处理： 否*/
                };
        });
        this.props.form.setFormItemsDisabled('formAccount',canEditCfg);
        this.props.form.setFormItemsValue('formAccount',doValCfg);
    }

    onFormAfterHander(props, formid, itemname, newValue, oldValue, data){
        if(itemname =='code'){  
            if(this.state.editModeCfg.handlerMode == 'edit'){
                if(newValue.value.length != this.state.editModeCfg.srccode.length){
                    toast({color:'warning',content:this.lang['10140ACCB-000081']});/* 国际化处理： 编辑科目不能改变层级*/
                    this.props.form.setFormItemsValue('formAccount',{
                        code:{
                            value:this.state.editModeCfg.srccode,
                            display:this.state.editModeCfg.srccode
                        }
                    });
                }
            }else{
                let accountvo = this.props.createMasterChildData(this.config.pagecode, 'formAccount', 'formAccAss');
                this.handlerFormByCurCode(accountvo);
            }
           
        }else if(itemname =='pk_acctype'){
            let that = this;
            ajax({
                loading: true,
                url:'/nccloud/uapbd/accsystem/AccTypeQueryAction.do', 
                data: {pk_acctype:newValue.refpk}, 
                success:res => {
                    that.props.form.setFormItemsValue('formAccount',{
                        accproperty:{
                            value:res.data
                        }
                    });
                }
            }); 
        }
        if(itemname === 'cashtype'|| itemname === 'quantitycheck' || itemname === 'inneracc'){  //优化一下,如果是有联动和禁用启用的itemname,调用restFormItem
            this.restFormItem(true);//增加一个参数added by liusnc 代表是编辑后事件，其他的都为设置事件
        }
        return true;
    }

    onQuickCalSimpleTableSelected(props,moduleid,record,index,status){
		//快速辅助核算模态框中，勾选设置辅助核算项目的选中与否易用性函数added by liusenc 20180830
        
        let curSelCode = record.code.value;//当前选中行的科目编码；
        let allTableData = props.table.getAllTableData('list_quickcal_listaccountitem').rows;
        //由于平台的simpleTable的getdata方法获取到的行数据没有index信息，仅仅有rowid信息，因此遍历数据，发现有以当前编码开头的数据将index放入到数组中；
        let codeBeginIndexes = [];
        
        for(let index = 0;index<allTableData.length;index++){
            let cindexcode = allTableData[index].values.code.value;
            if( cindexcode.startsWith(curSelCode) && cindexcode !== curSelCode ){
                codeBeginIndexes.push(index);
            }
        }
        //根据当前选中的code来过滤一下表数据；
        
        if(status){//代表选中了数据
            props.table.selectTableRows('list_quickcal_listaccountitem', codeBeginIndexes, true);
        }else if(codeBeginIndexes.length > 0 ){//代表取消选中数据；
            promptBox({
                color:"warning",
                title:this.lang['10140ACCB-000040'],/* 国际化处理： 提示*/
                content: this.lang['10140ACCB-000082']+"【"+curSelCode+"】"+this.lang['10140ACCB-000083']+"？",/* 国际化处理： 是否取消选择科目【,】的所有下级？,是否取消选择科目,的所有下级*/
                beSureBtnClick: () => {
                    props.table.selectTableRows('list_quickcal_listaccountitem', codeBeginIndexes, false); 
                }
            }); 
        }
    }	

    render(){
        if(!this.init)
        return '';
        let {  button, search,DragWidthCom,modal,table,form,cardTable, editTable ,cardPagination, config} = this.props;
        const {createCardPagination} = cardPagination;
        var {refSystem, refChart, refChartVersion, listPanel, modalInsertMid, modalQuickCal, selectAssist, selectModule} = this.state;
        var {listtree, numberbtn,classbtn} = listPanel;
        const { createBillHeadInfo } = this.props.BillHeadInfo;

        var drawCommonBtn = (cardname) =>{
            return button.createButtonApp({
                area: 'common',
                onButtonClick: this.onButtonClick.bind(this, cardname)
            });
        }
        var titleSearchContent = () =>{
            return(
                
                <div style={{display: "flex"}}>
                {this.config.nodetype == 'org' ? <div className="search-box" style={this.config.title == this.lang['10140ACCB-000018'] ? { width: 190, marginLeft: 0 } : { width: 140 }}><span style={{ marginTop: 9, zIndex: 1, float: 'left', position: 'relative', color: 'red' }}><span style={{ position: 'absolute', left: 3 }}>*</span></span>{RefOrg(this.state.refOrg)}</div> : ''}{/* 国际化处理： 会计科目-组织*/}
                <div className="search-box" style={{ width: 140, marginLeft: 10 }}><span style={{ marginTop: 9, zIndex: 1, float: 'left', position: 'relative', color: 'red' }}><span style={{ position: 'absolute', left: 3 }}>*</span></span>{RefSystem(refSystem)}</div>
                <div className="search-box" style={{ width: 140, marginLeft: 10 }}><span style={{ marginTop: 9, zIndex: 1, float: 'left', position: 'relative', color: 'red' }}><span style={{ position: 'absolute', left: 3 }}>*</span></span>{RefChart(refChart)}</div>
                <div className="search-box" style={{ width: 140, marginLeft: 10 }}><NCSelect {...refChartVersion}>{refChartVersion.renderOption()}</NCSelect></div>
                <div className="search-box account_batch_checkbox" style={{ paddingTop: 6, width: 100, marginLeft: 6 }}><NCCheckbox {...this.state.showoff}>{this.lang['10140ACCB-000019']}</NCCheckbox></div> {/* 国际化处理： 显示停用*/}
                </div>
             
            );
        }
        var getTableHeight = (defaultHeight=0) =>{
            return document.getElementById('app').offsetHeight-defaultHeight+'px';
        }
        var drawTree = () => {
            return (
                <div style={{display:this.state.showMode == 'list'? '': 'none'}}>
                    
                    <HeaderArea
                        title={this.config.title}
                        searchContent={
                            titleSearchContent()
                        }
                        btnContent={this.state.showMode == 'list' && drawCommonBtn('list')}
                    />
                    <div className="nc-bill-search-area">{search.NCCreateSearch('search', this.state.search)}</div>
                    <div className="table-title-area nc-theme-gray-area-bgc">
                        {/* <div style={{position: 'absolute',left: 10,top: 6}}>{numberbtn.renderNumberBtn()}</div>
                        <div style={{position: 'absolute',right: 10,top: 6}}>{classbtn.renderClassBtn()}</div> */}
                        <div style={{position: 'absolute',left: 20,top: 13}}>{numberbtn.renderNumberBtn()}</div>
                        <div style={{position: 'absolute',right: 3,top: 13}}>{classbtn.renderClassBtn()}</div>
                    </div>
                    <NCDiv fieldid="account" areaCode={NCDiv.config.TableCom} className="nc-bill-table-area">
                            {/*<NCTable className='table-tit'暂时把样式注释掉，因为影响了拖拽性*/}
                        <NCTable
                            {...listPanel.listtree}
                            bodyStyle={{height:getTableHeight(192)}}
                            scroll={{ x: true, y: getTableHeight(192) }}
                            data={classbtn.filterData(listPanel.datas)}
                            expandedRowKeys={[...listtree.expandedRowKeys]}>
                        </NCTable>
                    </NCDiv>
                </div>

            );
        }
        var drawCard = () =>{
            let theme = window.top.nccColor  //获取当前主题'black'
            if(this.state.showMode == 'list')
                return '';
            return (
                [
                    <div className="nc-bill-top-area"> 
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
{/*                             <span>
                                {!this.state.editMode ?<NCBackBtn id='showReturn' 
                                onClick={this.onButtonClick.bind(this, 'card',this.props,'card_backlist')}></NCBackBtn>:''}
                                <div className="title" style={{position:"absolute",left:20}}>{this.config.title}</div>
                            </span> */}
                            <span>{createBillHeadInfo(
                                {
                                    title:this.config.title,
                                    backBtnClick:()=>{
                                        this.onButtonClick('card',this.props,'card_backlist');
                                    }
                                }
                                )}</span>
                            <div className="header-button-area">
                                {this.state.showMode != 'list' && drawCommonBtn('card')}
                                {/* {button.createButtonApp({
                                            area: 'common',
                                            onButtonClick: this.onButtonClick.bind(this, 'card')
                                })} */}
                                {button.createButtonApp({
                                            area: 'card',
                                            onButtonClick: this.onButtonClick.bind(this, 'card')
                                })}
                                {button.createButtonApp({
                                            area: 'edit',
                                            onButtonClick: this.onButtonClick.bind(this, 'edit')
                                })}
                                {/*在这里开始画表格分页按钮added by liusenc 20181211
                                <div>
                                    {createCardPagination({
                                        handlePageInfoChange: this.pageInfoClick.bind(this)
                                    })}
                                </div>
                                */ }
                                <div className={`show cardPagination-lightapp-component`} style={{display: (!this.state.editMode && this.state.showMode == 'card') ? '' :'none' }}>
                                    <NCButton
                                        disabled={this.state.isFirst ? true : false}
                                        className={`${this.state.isFirst ? 'disable' : ''} first-item cardPaginationBtn`}
                                        onClick={this.pageInfoClick.bind(this, 'firstItem')}
                                    >
                                        <span className='icon iconfont icon-shangyiye' />
                                    </NCButton>
                                    <NCButton
                                        disabled={this.state.isFirst ? true : false}
                                        className={`${this.state.isFirst ? 'disable' : ''} item cardPaginationBtn`}
                                        onClick={this.pageInfoClick.bind(this, 'prevItem')}
                                    >
                                        <span className='icon iconfont icon-jiantouzuo' />
                                    </NCButton>
                                    <NCButton
                                        disabled={this.state.isEnd ? true : false}
                                        className={`${this.state.isEnd ? 'disable' : ''} item cardPaginationBtn`}
                                        onClick={this.pageInfoClick.bind(this, 'nextItem')}
                                    >
                                        <span className='icon iconfont icon-jiantouyou' />
                                    </NCButton>
                                    <NCButton
                                        disabled={this.state.isEnd ? true : false}
                                        className={`${this.state.isEnd ? 'disable' : ''} last-item cardPaginationBtn`}
                                        onClick={this.pageInfoClick.bind(this, 'finalItem')}
                                    >
                                        <span className='icon iconfont icon-xiayiye' />
                                    </NCButton>                                    
                                </div>
                            </div>
                        </NCDiv>
                        </NCAffix>
                        <div className="nc-bill-form-area">
                            {form.createForm('formAccount', {
                                onAfterEvent: this.onFormAfterHander.bind(this),
                                onBeforeEvent: this.onFormBeforeHandler.bind(this),
                            })}
                        </div>
                    </div>,
                    <div className="nc-bill-bottom-area"> 
                        <div className="nc-bill-table-area">
                            {cardTable.createCardTable('formAccAss', {
                              tableHead:() => {
                                   return (
                                        <div className="shoulder-definition-area">
                                            <div className="definition-icons">
                                                {button.createButtonApp({
                                                    area: 'card_bear_accass',
                                                    buttonLimit: 4,
                                                    onButtonClick: this.onButtonClick.bind(this, 'card_bear_accass')
                    
                                                })}
                                                {this.props.cardTable.createBrowseIcons('formAccAss', {
                                                    iconArr: ['close', 'open', 'max','setCol'],
                                                    maxDestAreaId: 'nc-bill-card'
                                                })}
                                            </div>	
                                        </div>
                                )
                              },
                              showCheck:true,
                              selectedChange:()=>{
                                    let isEdit =  this.state.editModeCfg.handlerMode === 'create' ? false : true
                                    this.updateButtonStatus(isEdit);
                              },
                              setCellClass: (index, record, ICode)=>{
                                    if(record.values.num.value > '1'){
                                        return theme==='black' ? 'font-blue-b' : 'font-blue'  //表体字体颜色设置为蓝色,适配暗黑主题
                                    }
                              }
                            })}                        
                        </div>
                        <div className="nc-bill-table-area">
                        <NCDiv areaCode={NCDiv.config.TABS} className="shoulder-definition-area" style={{marginBottom: 5}}>
                            <div className="definition-icons" >
                                <div>
                                    {button.createButtonApp({
                                        area: 'card_bear_module',
                                        buttonLimit: 4,
                                        onButtonClick: this.onButtonClick.bind(this, 'card_bear_module')
        
                                    })}
                                </div>
                            </div>	
                        </NCDiv>                        
                        {editTable.createEditTable('listModules',{showIndex:true,showCheck:true,
                        selectedChange:()=>{
                            this.updateButtonStatus();
                        },
                        setCellClass: (index, record, ICode)=>{
                            if(!record.values.flag.value){ 
                                return theme==='black' ? 'font-blue-b' : 'font-blue'  //非自建为蓝色,适配暗黑主题
                            }
                          }
                        })}
                    </div>                     
                </div>]
            );
           
        };

        return (
            <div className={this.state.showMode == 'list'? 'nc-bill-list': 'nc-bill-extCard'}>
                <PrintOutput
                ref='printOutput'
                url='/nccloud/uapbd/account/AccountPrintAction.do'
                data={{
                    funcode:this.config.appcode || '',
                    oids:this.state.printpks,
                    outputType:"output",
                    nodekey: this.state.printnodekey,

                }}>
                </PrintOutput>
            
                { modal.createModal('tip',{}) }
                {drawTree()}
                {drawCard()}
            
                <NCModal {...selectAssist.modal} fieldid='selectAssist'>
                <NCModal.Header><NCModal.Title>{this.lang['10140ACCB-000020']}</NCModal.Title></NCModal.Header>{/* 国际化处理： 选择核算项目*/}
                <NCModal.Body>
                    <NCDiv fieldid="assist" areaCode={NCDiv.config.TREE} className="tree-area">
                        <div   class="syncTreeCom syncTreeComLineStyle" id="accSchemeTree">
                            <div className="NC_syncTreeSearch">
                                <NCFormControl {...selectAssist.search} fieldid='search'/>
                            </div>
                            <NCDiv fieldid="selectAssist" areaCode={NCDiv.config.TreeCom}   className="synctree-area">
                                <NCTree
                                    closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}/* 国际化处理： 树开关*/
                                    openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}/* 国际化处理： 树开关*/
                                {...selectAssist.tree}>{selectAssist.tree.renderNode()}</NCTree>
                            </NCDiv>
                        </div>
                    </NCDiv>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton className="button-primary" fieldid='confirm' {...selectAssist.btnSumbit}>{this.lang['10140ACCB-000037']}</NCButton></span>{/* 国际化处理： 确定*/}
                    <span><NCButton fieldid='cancel' {...selectAssist.btnCancel}>{this.lang['10140ACCB-000008']}</NCButton></span>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
                </NCModal>
                <NCModal {...selectModule.modal} fieldid='selectModule'> 
                <NCModal.Header><NCModal.Title>{this.lang['10140ACCB-000022']}</NCModal.Title></NCModal.Header>{/* 国际化处理： 选择受控模块*/}
                <NCModal.Body>
                    <NCDiv fieldid="selectModule" areaCode={NCDiv.config.TREE} className="tree-area">
                        <div class="syncTreeCom syncTreeComLineStyle" id="accSchemeTree">
                            <div className="NC_syncTreeSearch">
                                <NCFormControl {...selectModule.search} fieldid='search'/>
                            </div>
                            <NCDiv fieldid="selectModule" areaCode={NCDiv.config.TreeCom} className="synctree-area">
                                <NCTree {...selectModule.tree}
                                    closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}/* 国际化处理： 树开关*/
                                    openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}/* 国际化处理： 树开关*/
                                >{selectModule.tree.renderNode()}</NCTree>
                            </NCDiv>
                        </div>
                    </NCDiv>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton className="button-primary" {...selectModule.btnSumbit}>{this.lang['10140ACCB-000037']}</NCButton></span>{/* 国际化处理： 确定*/}
                    <span><NCButton  {...selectModule.btnCancel}>{this.lang['10140ACCB-000008']}</NCButton></span>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
                </NCModal>
                <BatchEditStepModal lang={this.lang} {...this.props} ref={(BatchEditStepModal) => this.BatchEditStepModal = BatchEditStepModal}/>
                <NCModal {...modalInsertMid.modal} fieldid='modalInsertMid'>
                    <NCModal.Header><NCModal.Title>{this.lang['10140ACCB-000023']}</NCModal.Title></NCModal.Header>{/* 国际化处理： 插入中间级*/}
                    <NCModal.Body>
                        <NCRow style={{marginBottom: 5}}>
                            <NCCol md={4} xs={4} sm={4}>{RefAccount(modalInsertMid.refAccount)}</NCCol>
                            <NCCol md={4} xs={4} sm={4}><NCFormControl {...modalInsertMid.code}/></NCCol>
                            <NCCol md={4} xs={4} sm={4}><NCFormControl {...modalInsertMid.name}/></NCCol>    
                        </NCRow>
                        {table.createSimpleTable('list_insertmid', {
                            showCheck:true
                        })}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton className="button-primary" fieldid='confirm' {...modalInsertMid.btnSumbit}>{this.lang['10140ACCB-000037']}</NCButton></span>{/* 国际化处理： 确定*/}
                        <span><NCButton  fieldid='cancel'{...modalInsertMid.btnCancel}>{this.lang['10140ACCB-000008']}</NCButton></span>{/* 国际化处理： 取消*/}
                    </NCModal.Footer>
                </NCModal>
                
                <NCModal  {...modalQuickCal.modal} fieldid='modalQuickCal' onHide={()=>{
                    this.state.modalQuickCal.modal.show=false;
                    this.setState(this.state);
                }}>
                    <NCModal.Header closeButton><NCModal.Title>{this.lang['10140ACCB-000024']}</NCModal.Title></NCModal.Header>{/* 国际化处理： 快速设置辅助核算*/}
                    <NCModal.Body>
                        <NCRow style={{marginBottom: 5}}>
                            <NCCol md={4} xs={4} sm={4}>
                            <div style={{display:'flex'}}>
                                <span style={{color:'red'}}>*</span>
                                {RefCalItem(modalQuickCal.refCalItem)}
                            </div>
                            
                            </NCCol> 
                        </NCRow>
                        
                        <div className="fiacc-tableUse">
                            {editTable.createEditTable(modalQuickCal.listCalItem.areacode, {
                                showIndex: true
                            })}
                        </div>
                 
                        {table.createSimpleTable(modalQuickCal.listAccountItem.areacode, {
                            showCheck:true,
                            showIndex:true,
                            onSelected:this.onQuickCalSimpleTableSelected.bind(this),							
                        })}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton className="button-primary" fieldid='confirm'{...modalQuickCal.btnSumbit}>{this.lang['10140ACCB-000037']}</NCButton></span>{/* 国际化处理： 确定*/}
                        <span><NCButton  fieldid='cancel'{...modalQuickCal.btnCancel}>{this.lang['10140ACCB-000008']}</NCButton></span>{/* 国际化处理： 取消*/}
                    </NCModal.Footer>
                </NCModal>
                <ExcelImport 
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    billType = 'account'//单据类型
                    appcode={config.appcode}          
                    pagecode={config.pagecode}
                />

            </div>
        );
    }
}
export default Account;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65