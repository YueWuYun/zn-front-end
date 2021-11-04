//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {createPage,ajax,base,toast,cardCache,high,print,output,promptBox,getBusinessInfo,createPageIcon,excelImportconfig,getLangCode} from 'nc-lightapp-front';
//import createUIDom from '../../../public/utils/BDCreateUIDom';
import createUIDom from './BDCreateUIDom';
import AccPeriodTreeGridRef from '../../../../uapbd/refer/pubinfo/AccPeriodTreeGridRef/index';
import Orgunitversion from '../../orgunit/version';
import {initTemplate, buttonClick, onClickSearchBtn} from './events';
import Utils from '../../../public/utils';
import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less';
//解决IE11小应用打开报错的问题
document.documentElement.focus();


let {setDefData, getDefData} = cardCache;

const {NCUploader, PrintOutput,ExcelImport} = high; // 从 高阶组件引入NCUploader。
const queryCardUrl = '/nccloud/uapbd/org/queryorgcard.do';  //卡片查询url
const saveUrl = '/nccloud/uapbd/customer/saveCustomer.do';             //新增保存
const updateUrl = '/nccloud/uapbd/customer/saveEditCustomer.do';         //修改保存
const queryorgunitUrl = '/nccloud/uapbd/org/queryorgtype.do';         //查询组织类型vo
const queryorgtypeUrl = '/nccloud/uapbd/org/queryallorgtype.do';         //查询所有组织类型
const versionlId = 'versionlId';//版本化模态框

let { NCTable,NCAnchor,NCScrollElement,NCScrollLink,NCSwitch,NCCheckbox,NCCol,NCRow
    , NCCollapse, NCDatePicker,NCBackBtn,NCAffix,NCPopconfirm,NCDiv} = base;

var datasource = 'uapbd.org.orgunit.orgunit';
var createUIDomParam = function(pagecode, appcode){
    var param  = {
        pagecode:pagecode
    };
    return param;
};

class Orgunitpage extends Component {
    componentDidUpdate() {
        //组织主管
        let orgmanagerstatus = this.props.editTable.getStatus('orgmanager');
        //业务期间
        let orgmoduleperiodstatus = this.props.editTable.getStatus('orgmoduleperiod');
        //内部客商
        let innercustsuppstatus = this.props.form.getFormStatus('innercustsupp');
        //维护vat
        let orgvatfunclet = this.props.editTable.getStatus('orgvatfunclet');
        let orgstatus = this.props.form.getFormStatus('org');
        if ((orgstatus == undefined || orgstatus == 'browse') && (orgmanagerstatus == undefined || orgmanagerstatus == 'browse') && (orgmoduleperiodstatus == undefined || orgmoduleperiodstatus == 'browse') && (innercustsuppstatus == undefined || innercustsuppstatus == 'browse') && (orgvatfunclet == undefined || orgvatfunclet == 'browse')) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => { //编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    constructor(props) {
        super(props);
        let urlstatus = props.getUrlParam('status');
        let urlorg = props.getUrlParam('pk_org');
        this.config = createUIDomParam('10100ORG_orgunit','10100ORG');
        let config = {
            pagecode:'10100ORG_orgunit',
            datasource : 'uapbd.org.orgunit.orgunit',
            appcode:'10100ORG',
            gridId:'orglist',
        };
        props.config = config;
        createUIDom(props)(this.config,{moduleId: "10100ORG",domainName: 'uapbd' }, (data, lang,inlt,rootdata)=> {
            
            this.lang = lang;
            this.state = this.createState(data);
            this.state.buttons = data.button || [];
            this.setState(this.state, () => {
            this.state.adminroot = rootdata.adminroot;
            this.state.corproot = rootdata.corproot;
            this.state.orgroot = rootdata.orgroot;
            this.state.usertype = rootdata.usertype.usertype;
            this.state.bodyHei = 120;
            //设置编辑公式
            var relationItemData = [];
            var allcomps = Object.values(this.state.card);
            //添加职能编辑公式
            allcomps.map( comp =>{
                comp.allarea.map(areaname =>{
                    relationItemData.push({
                        billtype: 'form',
                        pagecode: '10100ORG_orgunit',
                        headcode: areaname
                    });
                });
            });
            //添加表头编辑公式
            relationItemData.push({
                billtype: 'form',
                pagecode: '10100ORG_orgunit',
                headcode: 'org'
            });
            this.props.setRelationItemBillinfo(relationItemData);
            //列表操作列按钮
            let buttonAry =[];
            data.button.map((obj)=>{
                    if(obj.hasOwnProperty('area')&&obj.hasOwnProperty('key')&&obj.area ==='currency-opr-col'){
                        buttonAry.push(obj.key);
                    }
                });
                this.modifierMeta(props, data,buttonAry);
                //查询集团下面的法人/业务单元/行政根节点
                this.queryRoot(data,props);
                this.props.button.setButtonsVisible(['save','saveadd','cancel','copy','edit'],false);
                props.meta.setMeta(data && data.template ? data.template:{});
                //数据导入按钮
                var appcodeurl = props.getAppCode();
                let excelimportconfig = excelImportconfig(props,'riaorg','10100org',true,'',{appcode: appcodeurl,pagecode: '10100ORG_orgunit'},()=>{this.browseList()});
                props.button.setUploadConfig("import",excelimportconfig);

                props.button.setButtons(data && data.button ? data.button: {}, () =>{
                    let buttonAry =[];
                    data.button.map((obj)=>{
                        if(obj.hasOwnProperty('area')&&obj.hasOwnProperty('key')&&obj.area ==='currency-opr-col'){
                            buttonAry.push(obj.key);
                        }
                    });
                    this.state.treelist.linebtn = buttonAry;//保存行操作按钮
                    this.props.button.setPopContent('oprdel', this.lang['10100ORG-000091']); 
                    var context = data.context || {};
                    this.buttonToggleShow();
                    if(urlstatus == 'card'){
                        this.browseCard(urlorg)
                    }
                });
            });
        });
        window.onbeforeunload = () => {
            if(this.state.editMode == 'edit')
                return;
            else
                return;
        };
    }
    createState(template){
        var me = this,
            props = this.props,
            pk_corp = {},
            popContainer = document.querySelector('.childline-button-area'),
            commonFormBtn = {
                buttonLimit: 5,
                onButtonClick: (props,id)=>{
                    me.commonCardsubBtnClick(props,id);
                },
                popContainer: popContainer
            },
            commonFormEvent = {
                onBeforeEvent:this.beforeEvent.bind(this),
                onAfterEvent: this.afterEvent.bind(this)
            },
            commonCardName = (arename) =>{
                return 'subname-' + arename || 'null';
            },
            isshow = function(){
                return props.form.getFormItemsValue('org',this.orgtypeitem).value == null ? false : me.props.form.getFormItemsValue('org',this.orgtypeitem).value;
            },
            getpk = function(headpk = false){
                if(headpk){
                    var selectMember = me.state.getSelectListTreeData() || [];
                    if(me.state.showMode == 'list' && selectMember.length > 0){
                        return selectMember[0].nodeData.org.values.pk_org.value;
                    }else{
                        me.props.form.getFormItemsValue('org','pk_org').value
                    }
                }else{
                    return props.form.getFormItemsValue(this.areaname,this.pk).value == null ? undefined : me.props.form.getFormItemsValue(this.areaname,this.pk).value;
                }  
            },
            emptyFormData = function(){
                props.form.EmptyAllFormValue(this.areaname);
                if(this.authorize != undefined){
                    this.authorize.authorizeareacode.forEach(areaname =>{
                        props.form.EmptyAllFormValue(areaname);
                    });
                }
            },
            setFormStatus = function(){
                props.form.setFormStatus(this.areaname,me.state.status == false ? 'edit': 'browse')
                if(this.authorize != undefined){
                    this.authorize.authorizeareacode.forEach(areaname =>{
                        props.form.setFormStatus(areaname,me.state.status == false ? 'edit': 'browse')
                    });
                }
            },
            renderCardFramework = function(){
                 var comp = this,
                        {btn, areaname,title,orgtypeitem}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                        </span>
                                        <span className='part-stop-btn'>
                                            {createButtonApp(btn)}
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                   
            },
            renderCardForm = function(){
                var comp = this,
                       {btn, areaname,title,orgtypeitem, isshow}   = comp;
                   var {form,button}     = props;
                   var {createButtonApp} = button;
                   var {createForm}      = form;
                   return createForm(areaname, commonFormEvent);      
            };
        var createTreeColumns = () =>{
            var newcolumns =  (template.template['orglist'].items || [])
                .filter(item => item.visible && item.visible == true)
                .map(item =>{
                    return {
                        title: <div fieldid = {item.attrcode} style={{color:item.color,width:item.width}}>{item.label}</div>,
                        key:item.attrcode ,
                        render: (value, record, index) =>{
                            var v = (item.itemtype == 'refer' || item.itemtype =='switch_browse') ? record.nodeData.org.values[item.attrcode].display : record.nodeData.org.values[item.attrcode].value ;
                            if(item.attrcode == 'code'){
                                var linkToCard = (e) => {
                                    e.stopPropagation();
                                    this.browseCard(record.nodeData.org.values.pk_org.value)
                                };
                                return <div fieldid = {item.attrcode} style={{color: '#007ace', cursor: 'pointer' }} onClick={linkToCard}>{v}</div>
                            }
                            return  <div fieldid = {item.attrcode} className='cloumData'>{v}</div> || '' //width:"160px"color:null,
                        }
                    }
                });
                
            var checkcolumn = {
                fixed:true,
                width: 120,
                key:'checkcolumn',
                title: (() =>{
                    var cfg = {
                        onChange: (val) => {
                             var pks = [];
                             var loop = (datas) =>{
                                datas.forEach(d =>{
                                    var children = d.children || [];
                                    pks.push(d.nodeData.org.values.pk_org.value);
                                    loop(children);
                                });
                            };
                            if(val){
                                loop(this.state.treelist.data || []);
                                this.state.treelist.checkedkeys = pks;
                                this.setState(this.state);
                            }else{
                                this.state.treelist.checkedkeys = [];
                                this.setState(this.state);
                            }
                        }
                    }
                    return  <NCCheckbox {...cfg}/>
                })(),
                render: (value, record, index) =>{
                    var checkedkeys = this.state.treelist.checkedkeys || [],
                        pk_org = record.nodeData.org.values.pk_org.value,
                        expanded = this.state.treelist.expandedRowKeys.indexOf(pk_org) != -1;
                    var checked = checkedkeys.indexOf(pk_org) != -1;
                    var cfg = {
                            checked : checked,
                            onChange:(check)=>{    
                                if(!checked){
                                    checkedkeys.push(pk_org);
                                }else{
                                    this.state.treelist.checkedkeys = checkedkeys.filter( key =>  key != pk_org);
                                }
                                me.setState(me.state, () =>{
                                        me.buttonToggleShow();
                                });
                            }
                        };
                    var wenjianjiaO = <i class="icon iconfont  icon-wenjianjiadakai tree-wenjian treeTableIcon"></i>;
                    var wenjianjiaC = <i class="icon iconfont  icon-wenjianjia tree-wenjian treeTableIcon"></i>;
                    var wenjianjia = null;
                    wenjianjia = record.children.length > 0? 
                                 expanded? wenjianjiaO : wenjianjiaC 
                                 : null;
                    return (<span fieldid = "first-col">
                                <label className={checked ? "u-checkbox is-checked u-checkbox-dark self-checkbox":"u-checkbox u-checkbox-dark self-checkbox"}>
                                    <input type="checkbox" {...cfg}></input>
                                    <label class="u-checkbox-label"></label>
                                 {wenjianjia}
                                </label>
                            </span>)
                }
            };
            var opercolumn = {
                title: this.lang['10100ORG-000093'],
                fixed:'right',
                key:'opercolumn',
                render:(val, record, index) =>{
                    var pk_org = record.nodeData.org.values.pk_org.value;
                    var rowHander = (handerName) =>{
                        return (e) =>{
                            if(handerName == 'onDeleteOrg'){
                                this[handerName]([pk_org]);
                            }else{
                                this[handerName](pk_org);
                            }
                        };
                    };
                    return (<span fieldid = "opr">
                        <span
                            style={{display: this.state.treelist.linebtn.indexOf('opredit') != -1 ? '' : 'none',color: '#007ace', cursor: 'pointer'}} 
                            onClick={rowHander('onEditOrg')}>
                            {this.lang['10100ORG-000105']}
                        </span>
                        <span  
                        style={{marginLeft:7,display: this.state.treelist.linebtn.indexOf('oprdel') != -1 ? '' : 'none',color: '#007ace', cursor: 'pointer'}} 
                        onClick={rowHander('onCopyOrg')}>{this.lang['10100ORG-000106']}</span> 
                        <NCPopconfirm trigger="click"
                            placement="top"
                            onCancel={() => {
                                // this.setState({ visible: false });
                            }}
                            onClose={() => {
                                this.onDeleteOrg([pk_org],false)
                             }} 
                            content={<div><span class="iconfont icon-tixing"/> {this.lang['10100ORG-000050']}</div>}
                        >
                            
                                <span
                                    style={{marginLeft:7,display: this.state.treelist.linebtn.indexOf('oprcopy') != -1 ? '' : 'none',color: '#007ace', cursor: 'pointer'}}
                                    className={"u-menu-item-title-wrapper"}
                                    >    
                                    {this.lang['10100ORG-000107']}
                                </span>
                            
                        </NCPopconfirm>  
                        
                    </span>);
                }
            };
            // checkcolumn
            // checkcolumn.width = 
            return [checkcolumn, ...newcolumns, opercolumn];
        };
        var createDeptTreeColumns = () =>{
            var newcolumns =  (template.template['orgdept'].items || [])
                .filter(item => item.visible && item.visible == true)
                .map(item =>{
                    return {
                        title: <div fieldid = {item.attrcode} style={{color:item.color,width:item.width}}>{item.label}</div>,
                        key:item.attrcode,
                        render: (value, record, index) =>{
                            var v = (item.itemtype == 'refer' || item.itemtype =='switch_browse') ?  record.nodeData.dept.values[item.attrcode].display : record.nodeData.dept.values[item.attrcode].value ;
                            return  <div fieldid = {item.attrcode} className='cloumData'>{v}</div> || '' //width:"160px"color:null,
                        }
                    }
                });
            var checkcolumn = {
                    fixed:  true,
                    width: 80,
                    key:'checkcolunm',
                    title:'',
                };
            return [checkcolumn,...newcolumns];
        };
        var state = {  //添加当前选中组织到State
            showMode: 'list',
            templateid : template.template.pageid ,
            pagecode : template.template.code ,
            showlogoUploader: false,//上传logo
            showUploader: false,//上传附件
            orgunit_versiontype:'',//版本化的时候确认版本的是哪一个1：财务组织体系版本化 2：利润中心体系版本化 3：人力资源组织体系版本化4：行政组织体系版本化
            usertype:'',//登录用户类型0=集团管理员，1=普通用户，2=帐套管理员， 
            orgroot:{},//业务单元根节点
            corproot:{},//法人公司根节点
            adminroot:{},//行政组织根节点
            orgunit_pk_orgarr:[],//批量操作主键
            orgunit_name:'',//当前操作数据的名称
            cacheData:{
                allpks:[],//列表所有数据主键集合
                currentDataStatus:'loading',//loading loaded
                getPrePK:(pk)=>{
                    if (me.state.cacheData.allpks.length === 1 && me.state.cacheData.allpks[0] === pk) {
                        return null;
                    } else if (me.state.cacheData.allpks.length > 1) {
                        let index = me.state.cacheData.allpks.indexOf(pk);
                        if (index != 0) { //是最后一条
                            return me.state.cacheData.allpks[index - 1]
                        } else { //不是最后一条
                            return null;
                        }
                    }
                },
                getNextPK:(pk)=>{
                    if (me.state.cacheData.allpks.length === 1 && me.state.cacheData.allpks[0] === pk) {
                        return null;
                    } else if (me.state.cacheData.allpks.length > 1) {
                        let index = me.state.cacheData.allpks.indexOf(pk);
                        if (index != me.state.cacheData.allpks.length - 1) { //是最后一条
                            return me.state.cacheData.allpks[index + 1]
                        } else { //不是最后一条
                            return null
                        }
                    }
                },
                currentpk:'',//当前页面主键
                cacheDataArr:[],//缓存数据集合[{pk:'',formdata:''}]
            },
            status:true,//页面状态 true浏览态false编辑态
            getpk:getpk,
            getSelectListTreeData:()=>{
                var selectdata = [];
                var {data,checkedkeys} = this.state.treelist;
                var loop = (datas) =>{
                    datas.forEach(d =>{
                        var children = d.children || [];
                        if(checkedkeys.indexOf(d.nodeData.org.values.pk_org.value) !=-1){
                            selectdata.push(d);
                        }
                        loop(children);
                    });
                }
                loop(data);
                return selectdata;
            },
            //显示停启用
            showoff:{
                defaultChecked :false,
                checked : false,
                size :'lg',
                onChange: (val) => {
                    this.state.showoff.checked = val;
                    this.setState(this.state, () =>{
                        this.onSearchOrg();
                    });
                }
            },

            //查询区域
            search: {
                id: '10100ORGSEARCH',
                defaultConditionsNum:2,
                oid:template.template['10100ORGSEARCH'].oid,
                clickSearchBtn: () => {
                    this.onSearchOrg();
                }
            },
            //业务单元树表
            treelist:{
                data:[],
                isTree:true,
                isDrag:true,
                columns: createTreeColumns(),
                expandedRowKeys:[],
                adaptionHeight:true,
                linebtn:[],
                checkedkeys: [],
                scroll:{
                    y: 400
                },
                height:30,
                rowKey: rcd => rcd.id,
                expandedIcon:(<i fieldid="opentree-switcher"   class="icon iconfont icon-shu_zk tree-swich uapbd-margin-r-10"></i>),
                collapsedIcon:(<i fieldid="closetree-switcher"  class="icon iconfont icon-shushouqi tree-swich uapbd-margin-r-10"></i>),
                rowClassName : record => {
                    let orgunitTableRow = record.children.length ? '':'end-row-orgunit';
                    return this.state.treelist.checkedkeys.indexOf(record.nodeData.org.values.pk_org.value) ? (orgunitTableRow + ' orgunit-table-selected-row') : orgunitTableRow;
                },
                // onRowClick: (record) => {
                //     var pk_org =  record.nodeData.org.values.pk_org.value,
                //         checkedkeys = this.state.treelist.checkedkeys || [];
                    
                //     var haspk = checkedkeys.indexOf(pk_org);
                //      if(haspk == -1){
                //         checkedkeys.push(pk_org);
                //     }else{
                //         this.state.treelist.checkedkeys = checkedkeys.filter( key =>  key != pk_org);
                //     }
                //     me.setState(me.state, () =>{
                //             me.buttonToggleShow();
                //     });
                // },
                onRowDoubleClick: (record, index, event) =>{
                    this.browseCard( record.nodeData.org.values.pk_org.value)
                },
                onExpand:(expanded, node) => {
                    var innercode = node.nodeData.org.values.innercode.value;
                    var expandchild = [];
                    var  treedatas = me.state.treelist.data || [];
                    if(expanded){
                        me.state.treelist.expandedRowKeys.push(node.nodeData.org.values.pk_org.value);
                    }else{
                        var loop  = (data) => {
                            var childs = data.children || [];
                            if(data.innercode.indexOf(node.nodeData.org.values.innercode.value) != -1){
                                expandchild.push(data.id)
                            }
                            childs.forEach( child =>{
                                loop(child);
                            });
                        }
                        treedatas.forEach(data =>{
                            loop(data);
                        });
                        me.state.treelist.expandedRowKeys = me.state.treelist.expandedRowKeys.filter( na => {
                            return na !=  node.nodeData.org.values.pk_org.value && expandchild.indexOf(na) == -1
                        });
                    }
                    me.setState(me.state, () =>{
                        var  datas = me.state.treelist.data || [];
                        var maxlayno = 1;
                        var expandedRowKeys = me.state.treelist.expandedRowKeys || []
                        var loop  = (data, lay) => {
                            var childs = data.children || [];
                            if(expandedRowKeys.indexOf(data.id) != -1){
                                maxlayno = maxlayno >= lay ? maxlayno : lay;
                            }
                            childs.forEach( child =>{
                                loop(child, lay + 1);
                            });
                        }
                        datas.forEach(data =>{
                            loop(data, 1);
                        });
                        var columns = me.state.treelist.columns || [];
                        columns[0].width = 80+27 * (maxlayno);
                        this.setState(this.state);
    
                    });
                }
            },

            depttreelist:{
                data:[],
                isTree:true,
                height:30,
                isDrag:true,
                columns:createDeptTreeColumns(),
                expandedRowKeys:[],
                scroll:{
                    y: 400
                },
                rowKey: rcd => rcd.id,
                onExpand:(expanded, node) => {
                    if(expanded){
                        me.state.depttreelist.expandedRowKeys.push(node.nodeData.dept.values.pk_dept.value);
                    }else{
                        me.state.depttreelist.expandedRowKeys = me.state.depttreelist.expandedRowKeys.filter( na => {
                            return na !=  node.nodeData.dept.values.pk_dept.value
                        });
                    }
                    me.setState(me.state);
                }
            }
        };
        var card = {
            corp:{
                areaname: 'corp',
                orderby: 1,
                pk:'pk_corp',
                orgtypeitem:'orgtype2',
                allarea:['corp','corpcontactinfo','corpdefinfo','corpotherinfo','corpaudioinfo'],
                btn: {...commonFormBtn, area: 'corporgtype-button-area'},
                title: this.lang['10100ORG-000064'],
                emptyFormData : function(){
                    me.props.form.EmptyAllFormValue('corp',['pk_fatherorg']);
                },
            },
            hrorg:{
                areaname: 'hrorg',
                orderby: 2,
                title: this.lang['10100ORG-000065'],
                orgtypeitem:'orgtype4',
                allarea:['hrorg','hrorgdef','hrorgauditinfo'],
                pk:'pk_hrorg',
                btn: {...commonFormBtn, area: 'hrorgorgtype-button-area'}
            },
            financeorg:{
                areaname: 'financeorg',
                orderby: 3,
                title: this.lang['10100ORG-000066'],
                orgtypeitem:'orgtype5',
                allarea:['financeorg','financeorgdef','financeorgaudioinfo'],
                pk:'pk_financeorg',
                btn: {...commonFormBtn, area: 'financeorgorgtype-button-area'}  
            },
            fundorg:{
                areaname: 'fundorg',
                orderby: 4,
                orgtypeitem:'orgtype6',
                allarea:['fundorg','fundorgdef','fundorgauditinfo'],
                pk:'pk_fundorg',
                title: this.lang['10100ORG-000067'],
                btn: {...commonFormBtn, area: 'fundorgorgtype-button-area'}
            },
            purchaseorg:{
                areaname: 'purchaseorg',
                orderby: 5,
                orgtypeitem:'orgtype7',
                allarea:['purchaseorg','purchaseorgdef','purchaseorgauditinfo'],
                pk:'pk_purchaseorg',
                title: this.lang['10100ORG-000068'],
                btn: {...commonFormBtn, area: 'purchaseorgorgtype-button-area'}
            },
            saleorg:{
                areaname: 'saleorg',
                orderby: 6,
                orgtypeitem:'orgtype8',
                allarea:['saleorg','saleorgrelation','saleorgdef','saleorgaudit'],
                pk:'pk_salesorg',
                title: this.lang['10100ORG-000069'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000070'],
                    authorizeareacode:['saleorgrelation'],
                },
                btn: {...commonFormBtn, area: 'saleorgorgtype-button-area'},
                renderCardFramework : function(){
                    var comp = this,
                        {btn, areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                            <span className='part-stop-btn'>
                                                {createButtonApp(btn)}
                                            </span>
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 销售业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0], commonFormEvent)}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            stockorg:{     
                areaname: 'stockorg',
                orderby: 7,
                orgtypeitem:'orgtype9',
                allarea:['stockorg','stockassetrelation','stockorgrelation','stocktrafficrelation','stockqccenterrelation','stockorgdef','stockorgaudit'],
                pk:'pk_stockorg',
                title: this.lang['10100ORG-000071'],
                authorize:{
                    authorizetitle:[this.lang['10100ORG-000072'],[this.lang['10100ORG-000073']],[this.lang['10100ORG-000074']],[this.lang['10100ORG-000075']]],
                    authorizeareacode:['stocktrafficrelation','stockqccenterrelation','stockorgrelation','stockassetrelation'],
                },
                btn: {...commonFormBtn, area: 'stockorgorgtype-button-area'},
                renderCardFramework : function(){
                    var comp = this,
                        {btn, areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                            <span className='part-stop-btn'>
                                                {createButtonApp(btn)}
                                            </span>
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[0]/* 国际化处理： 物流业务委托关系*/}
                                                <span className="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0],commonFormEvent)}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[1]/* 国际化处理： 质检业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[1],commonFormEvent)}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[2]/* 国际化处理： 采购业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[2],commonFormEvent)}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle[3]/* 国际化处理： 资产库存业务委托关系*/}
                                                <span className='wuliu'></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[3],commonFormEvent)}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            trafficorg:{
                areaname: 'trafficorg',
                orderby: 8,
                title: this.lang['10100ORG-000076'],
                orgtypeitem:'orgtype10',
                allarea:['trafficorg','trafficorgdef','trafficorgauditinfo'],
                pk:'pk_trafficorg',
                btn: {...commonFormBtn, area: 'trafficorgorgtype-button-area'}
            },
            qccenter:{
                areaname: 'qccenter',
                orderby: 9,
                title: this.lang['10100ORG-000077'],
                orgtypeitem:'orgtype11',
                allarea:['qccenter','qccenterdef','qccenterauditinfo'],
                pk:'pk_qccenter',
                btn: {...commonFormBtn, area: 'qccenterorgtype-button-area'}
            },
            assetorg:{
                areaname: 'assetorg',
                orderby: 10,
                orgtypeitem:'orgtype12',
                allarea:['assetorg','assetorgmaintainrelation','assetorgdef','assetorgauditinfo'],
                pk:'pk_assetorg',
                title: this.lang['10100ORG-000078'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000079'],
                    authorizeareacode:['assetorgmaintainrelation'],
                },
                btn: {...commonFormBtn, area: 'assetorgorgtype-button-area'},
                renderCardFramework : function(){
                    var comp = this,
                        {btn, areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                            <span className='part-stop-btn'>
                                                {createButtonApp(btn)}
                                            </span>
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 资产维修业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0], commonFormEvent)}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            maintainorg:{
                areaname: 'maintainorg',
                orderby: 11,
                orgtypeitem:'orgtype14',
                allarea:['maintainorg','maintainstockrelation','maintainorgdef','maintainorgauditinfo'],
                pk:'pk_maintainorg',
                title: this.lang['10100ORG-000080'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000081'],
                    authorizeareacode:['maintainstockrelation'],
                },
                btn: {...commonFormBtn, area: 'maintainorgorgtype-button-area'},
                renderCardFramework : function(){
                    var comp = this,
                        {btn, areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                            <span className='part-stop-btn'>
                                                {createButtonApp(btn)}
                                            </span>
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 维修库存业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0], commonFormEvent)}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            liabilitycenter:{
                areaname: 'liabilitycenter',
                orderby: 12,
                title: this.lang['10100ORG-000003'],
                orgtypeitem:'orgtype15',
                allarea:['liabilitycenter','liabilitycenterauditinfo','liabilitycenterdef'],
                pk:'pk_liabilitycenter',
                btn: {...commonFormBtn, area: 'liabilitycenterorgtype-button-area'}
            },
            itemorg:{
                areaname: 'itemorg',
                orderby: 13,
                orgtypeitem:'orgtype16',
                allarea:['itemorg','itemstockrelation','itemorgdefinfo','itemorgauditinfo'],
                pk:'pk_itemorg',
                title: this.lang['10100ORG-000082'],
                authorize:{
                    authorizetitle:this.lang['10100ORG-000083'],
                    authorizeareacode:['itemstockrelation'],
                },
                btn: {...commonFormBtn, area: 'itemorgorgtype-button-area'},
                renderCardFramework : function(){
                    var comp = this,
                        {btn, areaname,title,orgtypeitem,authorize}   = comp;
                    var {form,button}     = props;
                    var {createButtonApp} = button;
                    var {createForm}      = form;
                    var switchCfg = {
                        checked :props.form.getFormItemsValue('org',orgtypeitem).value == null ? false : props.form.getFormItemsValue('org',orgtypeitem).value,
                        onChange:me.onCardSwitchChange.bind(me, comp, orgtypeitem)
                    };
                    return (
                        <div name={commonCardName(areaname)} style={{display: comp.isshow() ? '' : 'none'}}>
                            <NCScrollElement name={areaname}>
                                <div className="nc-bill-table-area nc-bill-table-list nc-bill-part nc-theme-gray-area-bgc">
                                    <NCCol className='part-col'>
                                        <div className="col-title nc-theme-common-font-c">{title}</div>
                                        <div className="col-switch"><NCSwitch {...switchCfg}/></div>
                                        <div className="col-btm">{createButtonApp(btn)}</div>
                                        {/* <span className="showOff">
                                            {title}
                                            <NCSwitch {...switchCfg}/>
                                            <span className='part-stop-btn'>
                                                {createButtonApp(btn)}
                                            </span>
                                        </span> */}
                                    </NCCol>
                                    <NCCollapse className='nc-bill-btn-par' style={{marginBottom:'5px'}} in={switchCfg.checked}>
                                        <div>
                                            {comp.renderCardForm()}
                                            <div className="operator operator-tit nc-theme-common-font-c">
                                                {authorize.authorizetitle/* 国际化处理： 项目库存业务委托关系*/}
                                                <span class="wuliu"></span>
                                            </div>
                                            {createForm(authorize.authorizeareacode[0], commonFormEvent)}
                                        </div>
                                    </NCCollapse>
                                </div>
                            </NCScrollElement>
                        </div>
                    );
                },
            },
            planbudget:{
                areaname: 'planbudget',
                orderby: 14,
                title: this.lang['10100ORG-000084'],
                orgtypeitem:'orgtype17',
                allarea:['planbudget','planbudgetdef','planbudgetauditinfo'],
                pk:'pk_planbudget',
                btn: {...commonFormBtn, area: 'planbudgetorgtype-button-area'}
            },
            adminorg:{
                areaname: 'adminorg',
                orderby: 15,
                title: this.lang['10100ORG-000085'],
                orgtypeitem:'orgtype29',
                allarea:['adminorg','adminorgdef','adminorgauditinfo'],
                pk:'pk_adminorg',
                btn: {...commonFormBtn, area: 'adminorgorgtype-button-area'}
            },
            factory:{
                areaname: 'factory',
                orderby: 16,
                title: this.lang['10100ORG-000086'],
                orgtypeitem:'orgtype33',
                allarea:['factoryauditinfo','factorydefitem','factory'],
                pk:'pk_factory',
                btn: {...commonFormBtn, area: 'factoryorgtype-button-area'}
            },
            plancenter:{
                areaname: 'plancenter',
                orderby: 17,
                title: this.lang['10100ORG-000087'],
                orgtypeitem:'orgtype34',
                allarea:['plancenter','plancenterdefiitem','plancenterauditinfo'],
                pk:'pk_plancenter',
                btn: {...commonFormBtn, area: 'plancenterorgtype-button-area'}
            }
        };
        Object.values(card).forEach(v => {
            !v.setFormStatus && (v.setFormStatus = setFormStatus);
            !v.emptyFormData && (v.emptyFormData = emptyFormData);
            !v.isshow && (v.isshow = isshow);
            !v.getpk && (v.getpk = getpk);
            !v.renderCardFramework  && (v.renderCardFramework = renderCardFramework);
            !v.renderCardForm && (v.renderCardForm = renderCardForm);
        });
        state.card = card;
        return state;
    }
    //新增的时候特殊字段是否能编辑的控制
    controlFormItemForCardAdd(){
        //新增的时候，如果存在根节点，就把上级业务单元设置为必填项，否则设置为不可以编辑
        if(!(this.state.orgroot && this.state.orgroot.haveroot)){
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
        }else{
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
        }


        //编辑的时候，如果选中的就是业务单元根节点，那么上级就不能编辑
        var orgroot = this.state.orgroot;
        if(!orgroot.haveroot){
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
        }
        if(orgroot.haveroot){
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
        }
        //勾选了财务组织，项目的所述财务组织为非必填，反之，必填
        if(!orgroot.haveroot){
            this.props.form.setFormItemsRequired('itemorg',{'pk_financeorg':false});
        }else{
            this.props.form.setFormItemsRequired('itemorg',{'pk_financeorg':true});
        }
        //编辑的时候，如果选中的就是法人根节点，那么上级就不能编辑
        let corproot = this.state.corproot;
        if(!corproot.haveroot){
            this.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('corp',{'pk_fatherorg':false});
        }
        if(corproot.haveroot){
            this.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('corp',{'pk_fatherorg':true});
        }

        //编辑的时候，如果选中的就是行政根节点，那么上级就不能编辑
        let adminroot = this.state.adminroot;
        if(!adminroot.haveroot){
            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
            this.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
        }
        if(adminroot.haveroot){
            this.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
        }
        //新增的时候会计期间方案和本位币是可以修改
        this.props.form.setFormItemsDisabled('org',{'pk_accperiodscheme':false});
        this.props.form.setFormItemsDisabled('org',{'pk_currtype':false});
    }
    //编辑的时候特殊字段是否能编辑的控制
    controlFormItemForCardEdit(pk_org){
        //处理业务单元，法人，行政上级组织可编辑性
        this.dealFatherItemEditproperty(pk_org);

        //编辑的时候库存的财务组织，如果勾选财务，那么就不能编辑
        if(this.props.form.getFormItemsValue('org','orgtype5').value){
            this.props.form.setFormItemsDisabled('stockorg',{pk_financeorg:true});//设置表单项不可用
            this.props.form.setFormItemsRequired('stockorg',{pk_financeorg:false});//设置表单项不可用
            if(!this.props.form.getFormItemsValue('org','orgtype2').value){
                this.props.form.setFormItemsRequired('org',{'pk_corp':true});
            }
        }
        
        if(pk_org != undefined){
            //编辑的时候会计期间方案和本位币是不可以修改
            this.props.form.setFormItemsDisabled('org',{'pk_accperiodscheme':true});
            this.props.form.setFormItemsDisabled('org',{'pk_currtype':true});
        }

        //如果勾选了库存和销售，那么使用零售应该是可以操作的其他情况不可以操作
        if(this.props.form.getFormItemsValue('org','orgtype9').value ||
            this.props.form.getFormItemsValue('org','orgtype8').value){
                this.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项可用
        }else{
            this.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
        }
    }
    //查询根数据和设置模板关联关系以及参照过滤条件
    queryRoot(data,props){
        if(!data.template['formrelation']){
            data.template['formrelation'] = {};
        }
        //设置模板之间的关联关系
        //组合原NC也去的单据模板关联关系
        data.template['formrelation'].corp=['corpotherinfo','corpcontactinfo','corpdefinfo','corpaudioinfo'];//'corpaudioinfo'
        data.template['formrelation'].org=['orgtype','orgversioninfo','orgauditinfo'];//'corpaudioinfo','orgauditinfo'
        data.template['formrelation'].hrorg=['hrorgdef','hrorgauditinfo'];//'hrorgauditinfo'
        data.template['formrelation'].financeorg=['financeorgdef','financeorgaudioinfo'];//'financeorgaudioinfo'
        data.template['formrelation'].fundorg=['fundorgdef','fundorgauditinfo'];//,'fundorgauditinfo'
        data.template['formrelation'].purchaseorg=['purchaseorgdef','purchaseorgauditinfo'];//,'purchaseorgauditinfo'
        data.template['formrelation'].saleorg=['saleorgdef','saleorgaudit'];//'saleorgdef','saleorgaudit',
        data.template['formrelation'].stockorg=['stockorgdef','stockorgaudit'];//'stockorgaudit','stockorgdef'
        data.template['formrelation'].trafficorg=['trafficorgdef','trafficorgauditinfo'];//'trafficorgauditinfo',
        data.template['formrelation'].qccenter=['qccenterdef','qccenterauditinfo'];//'qccenterauditinfo',
        data.template['formrelation'].assetorg=['assetorgdef','assetorgauditinfo'];//'assetorgauditinfo','assetorgdef'
        data.template['formrelation'].maintainorg=['maintainorgdef','maintainorgauditinfo'];//'maintainorgauditinfo','maintainorgdef'
        data.template['formrelation'].liabilitycenter=['liabilitycenterdef','liabilitycenterauditinfo'];//'liabilitycenterauditinfo',
        data.template['formrelation'].itemorg=['itemorgdefinfo','itemorgauditinfo'];//'itemorgauditinfo','itemorgdefinfo'
        data.template['formrelation'].planbudget=['planbudgetdef','planbudgetauditinfo'];//'planbudgetauditinfo',
        data.template['formrelation'].adminorg=['adminorgdef','adminorgauditinfo'];//'adminorgauditinfo',
        data.template['formrelation'].factory=['factorydefitem','factoryauditinfo'];//'factoryauditinfo',
        data.template['formrelation'].plancenter=['plancenterdefiitem','plancenterauditinfo'];//,'plancenterauditinfo'
        //列表界面初始化界面数据加载
        data.template['orgmanager'].items.map((obj)=>{
            if(obj.attrcode == 'cuserid'){
                //经济类型
               // props.renderItem('table','orgmanager', 'cuserid', null);
                obj.isMultiSelectedEnabled = false;
                obj.queryCondition = function () {
                    return {
                        GridRefActionExt: 'nccloud.web.org.orgunit.action.UserFilter'
                    }
                }
            }
         });
         //内部客商组织过滤
         data.template['innercustsupp'].items.map((obj)=>{
            if(obj.attrcode == 'pk_org'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.org.orgunit.action.InnercustOrgFilter'
                    }
                }
            }
         })
         //查询区域的负责人也需要组织和集团的过滤
         data.template['10100ORGSEARCH'].items.map((obj)=>{

            if(obj.attrcode == 'chargeleader'){
                obj.isShowUnit = true;
                obj.isShowUsual = true;
                obj.queryCondition=()=>{
                    return {
                        isMutiGroup:"Y"
                    }
                }
            }
            if(obj.attrcode == 'principal' ){
                obj.isShowUnit = true;
                obj.isShowUsual = true;
                obj.isShowDisabledData = true;
                obj.queryCondition=()=>{
                    return {
                        isMutiGroup:"Y"
                    }
                }
            }
            if(obj.attrcode == 'pk_corp'){
                //所属公司增加权限过滤
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        //卡片模板初始化数据加载
        data.template['org'].items.map((obj)=>{
            //上级业务单元权限过滤
            if(obj.attrcode == 'pk_fatherorg'){
                    obj.queryCondition = function () {
                        return {
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                            AppCode:props.config.appcode
                        }
                    }
            }
            if(obj.attrcode == 'chargeleader'){
                obj.isShowUnit = true;
                obj.isShowUsual = true;
                obj.unitCondition=()=>{
                    return {
                        isMutiGroup:"Y"
                    }
                }
            }
            if(obj.attrcode == 'principal' ){
                obj.isShowUnit = true;
                obj.isShowUsual = true;
                obj.isShowDisabledData = true;
                obj.unitCondition=()=>{
                    return {
                        isMutiGroup:"Y"
                    }
                }
            }
            if(obj.attrcode == 'pk_corp'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        
        //法人公司
        //添加自定义参照
        data.template['corp'].items.map((obj)=>{

            
            if(obj.attrcode == 'pk_fatherorg'){
                //法人公司职能中上级公司需要跨集团
                obj.isShowUnit = true;
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
            if(obj.attrcode == 'industry'){
                //经济行业
                props.renderItem('form','corp', 'industry', null);
                obj.queryCondition = function () {
                    return {
                        pk_defdoclist: '1009ZZ100000000034NN'
                    }
                }
            }
            if(obj.attrcode == 'ecotype'){
                //经济类型
                props.renderItem('form','corp', 'ecotype', null);
                obj.queryCondition = function () {
                    return {
                        pk_defdoclist: '1009ZZ100000000034NZ'
                    }
                }
            }
            if(obj.attrcode == 'corptype'){
                //单位类型
                props.renderItem('form','corp', 'corptype', null);
                obj.queryCondition = function () {
                    return {
                        pk_defdoclist: '1010ZZ10000000003NY1'
                    }
                }
            }
            if(obj.attrcode == 'unitdistinction'){
                //单位级别
                props.renderItem('form','corp', 'unitdistinction', null);
                obj.queryCondition = function () {
                    return {
                        pk_defdoclist: '1010ZZ10000000003OPT'
                    }
                }
            }
        })

        //人力资源组织上级组织条件过滤
        data.template['hrorg'].items.map((obj)=>{
                    
            if(obj.attrcode == 'pk_fatherorg'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })

        //财务职能中成本域增加集团过滤
        data.template['financeorg'].items.map((obj)=>{
                    
            if(obj.attrcode == 'pk_costregion'){
                //成本域增加集团过滤
                props.renderItem('form','financeorg', 'pk_costregion', null);
                obj.queryCondition = function () {
                    return {
                        pk_group: getBusinessInfo()==null?null:getBusinessInfo().groupId
                    }
                }
            }
        })

        //增加表头业务单元参照过滤
        data.template['fundorg'].items.map((obj)=>{
                    
            if(obj.attrcode == 'pk_fatherorg'){
                obj.isShowUnit = true ;
            }
        })

        //销售组织上级销售主组织过滤
        data.template['saleorg'].items.map((obj)=>{
                    
            if(obj.attrcode == 'pk_fatherorg'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        //库存组织中的财务组织增加主组织过滤
        data.template['stockorg'].items.map((obj)=>{
            if(obj.attrcode == 'pk_financeorg'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        //想租组织中上级项目增加主组织过滤
        data.template['itemorg'].items.map((obj)=>{
            if(obj.attrcode == 'pk_fatherorg'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        //人力资源组织上级组织增加主组织过滤
        data.template['adminorg'].items.map((obj)=>{
                    
            if(obj.attrcode == 'pk_fatherorg'){
                obj.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        AppCode:props.config.appcode
                    }
                }
            }
        })
        
        // let reqData = [
        //     {
        //         rqUrl: '/uapbd/org/haverootorgunit.do',
        //         rqCode: 'haverootorgunit'
        //     },
        //     {
        //         rqUrl: '/uapbd/org/haveadminrootorgunit.do',
        //         rqCode: 'haveadminrootorgunit'
        //     },
        //     {
        //         rqUrl: '/uapbd/org/isgroupadmin.do',
        //         rqCode: 'usertype'
        //     },
        //     {
        //         rqUrl: '/uapbd/org/havecorprootorgunit.do',
        //         rqCode: 'havecorprootorgunit'
        //     }
        // ];
        // ajax({
        //     url : "/nccloud/platform/pub/mergerequest.do",
        //     data : reqData,
        //     success : (res) => {
        //         this.state.adminroot = res.data.haveadminrootorgunit;
        //         this.state.corproot = res.data.havecorprootorgunit;
        //         this.state.orgroot = res.data.haverootorgunit;
        //         this.state.usertype = res.data.usertype;
        //     }
        // });
    }
    //处理业务单元，法人公司，行政上级的编辑性
    dealFatherItemEditproperty(){
        //编辑的时候，如果选中的就是业务单元根节点，那么上级就不能编辑
        var orgroot = this.state.orgroot;
        var pk_org =  this.props.form.getFormItemsValue('org','pk_org').value
        if(!orgroot.haveroot || pk_org == orgroot.pk){
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
        }
        if(orgroot.haveroot && pk_org != orgroot.pk){
            this.props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
        }
        //勾选了财务组织，项目的所述财务组织为非必填，反之，必填
        if(this.props.form.getFormItemsValue('org','orgtype5').value == true || pk_org == orgroot.pk){
            this.props.form.setFormItemsRequired('itemorg',{'pk_financeorg':false});
        }else{
            this.props.form.setFormItemsRequired('itemorg',{'pk_financeorg':true});
        }
        //编辑的时候，如果选中的就是法人根节点，那么上级就不能编辑
        let corproot = this.state.corproot;
        if(!corproot.haveroot || pk_org == corproot.pk){
            this.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('corp',{'pk_fatherorg':false});
        }
        if(corproot.haveroot && pk_org != corproot.pk){
            this.props.form.setFormItemsDisabled('corp',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('corp',{'pk_fatherorg':true});
        }

        //编辑的时候，如果选中的就是行政根节点，那么上级就不能编辑
        let adminroot = this.state.adminroot;
        if(!adminroot.haveroot || pk_org == adminroot.pk){
            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
            this.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
            this.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
        }
        if(adminroot.haveroot && pk_org != adminroot.pk){
            this.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
            this.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
        }
    }
    loadCardData(cfg){
        var {pk_org, callback, loadtype = 'add'} = cfg; //loadtype: add/copy/load
        var orgData = undefined;
        //！！！！如果卡片效率过不去，前端发送17次数据，从后台请求不同子集数据
        if(this.state.cacheData.currentDataStatus == 'loaded' && loadtype != 'add' ){
            if(this.state.cacheData.cacheDataArr.length > 0){
                var cache = Object.values(this.state.cacheData.cacheDataArr);
                cache && cache.forEach((d)=>{
                    if(d.pk == pk_org){
                        orgData = d.formdata;
                        callback && callback(orgData);
                    }
                })
                if(cache && cache.length >= 20){
                    this.state.cacheData.cacheDataArr = [];
                }
            }
        }
        if(this.state.cacheData.currentDataStatus == 'loading' || orgData == undefined || loadtype == 'add'){
            ajax({
                url: '/nccloud/uapbd/org/queryorgtype.do',
                data:{
                    pk_org: pk_org || undefined,
                    oid:this.state.templateid,
                    pagecode:this.state.pagecode,
                    btnopr: loadtype || 'add'
                },
                success: (res) => {
                    orgData = res.data || undefined;
                    this.state.cacheData.currentDataStatus = 'loaded';
                    if(!(loadtype == 'add' || loadtype == 'copy') ){
                        this.state.cacheData.cacheDataArr = this.state.cacheData.cacheDataArr.filter( key =>  key.pk != pk_org);
                        this.state.cacheData.cacheDataArr.push({
                            pk:pk_org,
                            formdata:JSON.parse(JSON.stringify(res.data)),
                        });
                    }
                    callback && callback(orgData);
                }
            }); 
        }
        this.state.cacheData.currentpk = pk_org;
        //为了提高卡片翻页效率，提前缓存当前页前后3条数据
        this.loadPreCardData(pk_org,0,2);
        //后三条数据
        this.loadNextCardData(pk_org,0,2);
    }
    loadPreCardData(pk_org,requestCount,total){
        var prepk = this.state.cacheData.getPrePK(pk_org) || undefined;
        if(prepk != undefined){
            ajax({
                url: '/nccloud/uapbd/org/queryorgtype.do',
                loading:false,
                data:{
                    pk_org: prepk || undefined,
                    oid:this.state.templateid,
                    pagecode:this.state.pagecode,
                    btnopr: 'load'
                },
                success: (res) => {
                    requestCount = requestCount + 1;
                    this.state.cacheData.cacheDataArr = this.state.cacheData.cacheDataArr.filter( key =>  key.pk != prepk);
                    this.state.cacheData.cacheDataArr.push({
                        pk:prepk,
                        formdata:JSON.parse(JSON.stringify(res.data))
                    });
                  if(requestCount < total){
                    this.loadPreCardData(prepk,requestCount,total);
                  }
                }
            });
        }
    }
    loadNextCardData(pk_org,requestCount,total){
        var nextpk = this.state.cacheData.getNextPK(pk_org) || undefined;
        if(nextpk != undefined){
            ajax({
                url: '/nccloud/uapbd/org/queryorgtype.do',
                loading:false,
                data:{
                    pk_org: nextpk || undefined,
                    oid:this.state.templateid,
                    pagecode:this.state.pagecode,
                    btnopr: 'load'
                },
                success: (res) => {
                    requestCount = requestCount + 1;
                    this.state.cacheData.cacheDataArr = this.state.cacheData.cacheDataArr.filter( key =>  key.pk != nextpk);
                    this.state.cacheData.cacheDataArr.push({
                        pk:nextpk,
                        formdata:JSON.parse(JSON.stringify(res.data))
                    });
                  if(requestCount < total){
                    this.loadNextCardData(nextpk,requestCount,total);
                  }
                }
            });
        }
    }
    loadListData(callback){
        var afterHander = () =>{
            let searchVal = this.props.search.getAllSearchData('10100ORGSEARCH') || {};
            let conditions = [];
            let custcondition = {};
    
            if (!this.state.showoff.checked) {
                conditions.push({
                    display: this.lang['10100ORG-000090'],
                    field: 'enablestate',
                    oprtype: '=',
                    value: {
                        firstvalue: '2',
                        secondvalue: null
                    }
                });/* 国际化处理： 启用状态*/
                custcondition = {
                    conditions,
                    logic: 'and'
                };
            }

            let paramData = {
                querycondition: searchVal,
                custcondition: custcondition,
                pagecode: this.config.pagecode,
                queryAreaCode: this.state.search.id,
                pageInfo: {},
                querytype: 'tree',
                oid: this.state.search.oid
            };
            ajax({
                url: '/nccloud/uapbd/org/querypage.do',
                data: paramData,
                success: function (res) {
                    var datas = res.data || [];
                    var pks = [];
                    var loop = (datas) =>{
                        datas.forEach(d =>{
                            var children = d.children || [];
                            pks.push(d.nodeData.org.values.pk_org.value);
                            if(d.nodeData.org.values.enablestate.value == 2){
                                d.nodeData.org.values.enablestate.value = true
                            }else{
                                d.nodeData.org.values.enablestate.value = false
                            }
                            loop(children);
                        });
                    }; 
                    loop(datas);
                    callback && callback(datas, pks);
                }
            }); 
        };
        setTimeout(() => {
            afterHander()
        }, 0);
    }
    
    fillCardData(orgData,callback){
        var data = {};
        orgData && orgData.forEach( d =>{
            var values = Object.values(d);
            values.forEach(v =>{
                if(v && v.areacode){
                    data[v.areacode] = v;
                }
            });
        });
        Utils.filterEmptyData(data.org.rows[0].values);
        this.state.pk_corp = data.org.rows[0].values.pk_corp;
        this.props.form.setAllFormValue(data);
        this.setState(this.state,() =>{
            callback && callback(data);
        });
    }
    fillListData(datas = [],callback){ //res.data.orglist.rows
        this.state.treelist.data = datas;
        this.setState(this.state, () =>{
            callback && callback(datas);
        })
    }
    //批量设置页面所有form状态
    setAllFormStatus(data){
        var status = this.state.status == false ? 'edit': 'browse';
        var allcomps = Object.values(this.state.card);
        //设置表头form状态
        this.props.form.setFormStatus('org',status);
        var btn = {};
        allcomps.map( comp =>{
            //职能不显示停启用按钮，编辑态
            data && this.toggleButtonShow (data[comp.areaname] == undefined ? 3 : data[comp.areaname].rows[0].values['enablestate'].value,comp.areaname,btn);
            comp.setFormStatus();
        });
        //郑新宇标识  编辑时是法人公司需要禁用所属公司
        data && this.props.form.setFormItemsDisabled('org',{pk_corp:!!data.org.rows[0].values.orgtype2.value});
        this.props.button.setButtonsVisible(btn);
        this.setState(this.state);
    }
    setAllFormStatusForCopy(){
        var status = this.state.status == false ? 'edit': 'browse';
        var allcomps = Object.values(this.state.card);
        //设置表头form状态
        this.props.form.setFormStatus('org',status);
        //表头主键清空
        this.props.form.setFormItemsValue('org',{'pk_org':{value:null,display:null}});
        var btn = {};
        allcomps.map( comp =>{
            //职能不显示停启用按钮，编辑态
            this.toggleButtonShow (3,comp.areaname,btn);
            comp.emptyFormData();
            comp.setFormStatus();
        });
        this.props.button.setButtonsVisible(btn);
    }
    //修正后的代码 
    //添加超链接和业务期初期间，最后一列不同单元格不同属性（日期和参照）
    modifierMeta(props, meta,buttonAry){
        var that = this;
        //添加超链接
        // meta.template['orglist'].items = meta.template['orglist'].items.map((item,key)=>{
        //     item.width = '120px';
        //     if (item.attrcode === 'code') {
        //         item.render = (text, record, index) => {
        //             return (
        //                 <span style={{color: '#007ace', cursor: 'pointer' }} onClick={() => this.browseCard(record.values['pk_org'].value) }>
        //                     {record && record.values['code'] && record.values['code'].value}
        //                 </span>
        //             );
        //         };
        //     }
        //     return item;
        // });
    
        // //添加操作列
        // meta.template['orglist'].items.push({
        //     attrcode: 'opr',
        //     label: this.lang['10100ORG-000093'],
        //     itemtype:'customer',
        //     width: '200px',
        //     fixed: 'right',
        //     className: 'table-opr',
        //     visible: true,
        //     render: (text, record, index) => {
        //         return props.button.createOprationButton(buttonAry, {
        //             area: 'currency-opr-col',
        //             buttonLimit: 3,
        //             onButtonClick:(props, btncode)=>{
        //                 this.oprListButtonClick(record, index, props, btncode);
        //             }
        //         });
        //     }
        // });
    
        //业务期初期间设置会计期间为操作列
        meta.template['orgmoduleperiod'].items.push({
            attrcode: 'opr',
            label:  this.lang['10100ORG-000101'],
            itemtype:'customer',
            width: '200px',
            //fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                let moudleidnum = record.values.moduleid.value; 
                //let arr = ['4510','4530','4532','3614','3617','3618','3632','3630','3634','3635','3637'];//,担保管理 '3616' 银行贷款管理:3615 银行授信管理:3613
                let arr = ['4510','4530','4532','4534','4545','3614','3632','3634','3635','3613','3615','3616','3617','3630','3618','3637','3634','3635','3661','3662','3663','3665','3666','3667','3668','3680','3620'];
                var index = arr.indexOf(moudleidnum);
                var pk_accperiodscheme = undefined;
                var selectMember = this.state.getSelectListTreeData() || [];
                if(this.state.showMode == 'list' && selectMember.length > 0){
                    pk_accperiodscheme = selectMember[0].nodeData.org.values.pk_accperiodscheme.value;
                }else{
                    pk_accperiodscheme = this.props.form.getFormItemsValue('org','pk_accperiodscheme').value
                }
                var timedata = record.values.pk_accperiod.value;
                if (index >= 0) { //画日期
                    return (
                        <div style={{width:200, height: 28}} onClick={(e)=>{
                            e.stopPropagation()
                        }}>
                            <NCDatePicker 
                            fieldid="orgunit_calendar"
                            value={timedata} 
                            onChange={(value)=>{
                                timedata = value;
                                props.editTable.setValByKeyAndRowId('orgmoduleperiod',record.rowid,'pk_accperiod',{"value":timedata,"display":timedata});
                            }}/>
                        </div>
                    )
                } else { 
                    return (
                        <div style={{width:200, height: 28}} onClick={(e)=>{
                            e.stopPropagation()
                        }}>
                            {AccPeriodTreeGridRef({
                                fieldid:'accperiod',
                                value:{"refname":timedata,"refpk":timedata}, 
                                onChange:(value)=>{
                                    timedata = value.refname ? value.refname : '';
                                    props.editTable.setValByKeyAndRowId('orgmoduleperiod',record.rowid,'pk_accperiod',{"value":timedata,"display":timedata});
                                },
                                queryCondition:() => {
                                    return {
                                        "pk_accperiodscheme": pk_accperiodscheme
                                    }
                                }
                            } )}
                        </div>
                        )
                }        
            }
        });
            return meta;
    }
    //按钮状态控制
    buttonToggleShow(){
            var {showMode, status,usertype,adminroot,corproot,orgroot} = this.state; //showMode == list, card, status = true, fase
            var editstatus = status;
            let allData = this.state.treelist.checkedkeys || [];
            
            this.props.button.setDisabled({
                auxiliary:    !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)) ,
                version:      !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                printpage :   !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                orgunitreldept:!(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                setadminorgroot: !(editstatus && (showMode == 'list' ? allData && allData.length == 1 && adminroot.haveroot && allData[0] != adminroot.pk : adminroot.haveroot && this.props.form.getFormItemsValue('org','pk_org').value != null && this.props.form.getFormItemsValue('org','pk_org').value != adminroot.pk)) ,
                setcorproot:   !(editstatus && (showMode == 'list' ? allData && allData.length == 1 && corproot.haveroot && allData[0] != corproot.pk : corproot.haveroot && this.props.form.getFormItemsValue('org','pk_org').value != null && this.props.form.getFormItemsValue('org','pk_org').value != corproot.pk)) ,
                setorgroot:     !(editstatus && (showMode == 'list' ? allData && allData.length == 1 && orgroot.haveroot && allData[0] != orgroot.pk : orgroot.haveroot && this.props.form.getFormItemsValue('org','pk_org').value != null && this.props.form.getFormItemsValue('org','pk_org').value != orgroot.pk)) ,
    
                orgmoduleperiod: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                createinnercustsupp: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                logomanage: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                editVAT: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                orgmanager: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                attachconfig: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                print: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                export: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                edit: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                delete: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                copy: !(editstatus && (showMode == 'list' ? allData && allData.length > 0  : this.props.form.getFormItemsValue('org','pk_org').value != null)),
                enable: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','enablestate').value == 3)),
                disable: !(editstatus && (showMode == 'list' ? allData && allData.length > 0 : this.props.form.getFormItemsValue('org','enablestate').value == 2)),
                //add: !editstatus,
                //more: !(editstatus && showMode == 'list' ? allData && allData.length > 0 : true),
                'setroot-2' :!(editstatus && usertype != 1),
                import_1:!editstatus,
                import:!editstatus,
                exportfile:!editstatus,
                refresh:showMode == 'list' ? false : this.props.form.getFormItemsValue('org','pk_org').value == null,
                // save: editstatus,
                // saveadd: editstatus,
                // cancel: editstatus
            });   
            this.props.button.setButtonsVisible({
                auxiliary:   editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                version:      editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                printpage :   editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                orgunitreldept:editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                setadminorgroot: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                setcorproot:   editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                setorgroot:     editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
    
                orgmoduleperiod: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                createinnercustsupp: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                logomanage: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                editVAT: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                orgmanager: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                attachconfig: editstatus&& (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                print: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                export: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                edit: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                delete: editstatus &&(showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                refresh: editstatus &&(showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                copy: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                enable: editstatus &&(showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                disable: editstatus &&(showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                add: editstatus,
                more: editstatus && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                'setroot-2' :editstatus && usertype != 1 && (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                save: !editstatus,
                saveadd: !editstatus && (this.props.form.getFormItemsValue('org','pk_org').value == null),
                import_1:editstatus,
                import:editstatus,
                exportfile:editstatus,
                version:editstatus &&  (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                adminorgversion:editstatus &&  (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                hrorgversion:editstatus &&  (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                liabilitycenterversion:editstatus &&  (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                financeorgversion:editstatus &&  (showMode == 'list' ? true : this.props.form.getFormItemsValue('org','pk_org').value != null),
                cancel: !editstatus
            });
            this.setState(this.state);
    }
    onEditOrg(pk_org){
        var afterHander = (codeDatapro,pk_org,data) =>{
            ////设置页面form状态
            this.setAllFormStatus(data);
            //设置form特殊字段编辑性
            this.controlFormItemForCardEdit(pk_org);
            //设置按钮状态
            this.buttonToggleShow();
            //设置按钮是否能编辑
            codeDatapro && this.props.form.setFormItemsDisabled('org',{code:!codeDatapro.isCodeEdit});
        };
        this.checkDataPower(pk_org,'edit',(codeDatapro)=>{
            this.props.addUrlParam({
                status: 'card',
                pk_org: pk_org
            })
            this.state.showMode = 'card';
            this.state.status = false;
            this.setState(this.state,() =>{
                this.loadCardData({
                    pk_org: pk_org,
                    loadtype: 'load',
                    callback: (orgData) =>{
                        this.fillCardData(orgData, (data) =>{
                            //设置卡片翻页的当前主键
                            this.setCardPaginationId(1);
                            afterHander(codeDatapro,pk_org,data);
                        })
                    }
                });
            });
        });
    }
    checkDataPower(pk_org,status = 'edit',callback){
        ajax({
            url: '/nccloud/uapbd/org/getcode.do',
            loading:false,
            data:{
                pk_org: pk_org || undefined,
                status: status
            },
            success: (res) => {
                callback && callback(res.data);
            }
        });
    }
    onAddOrg(){
        var afterHander = (codeDatapro,parentPKOrg,data) =>{
            //设置特殊字段的控制
            this.controlFormItemForCardAdd();
            //设置按钮是否能编辑和按照编码规则设置的值
            codeDatapro && this.props.form.setFormItemsDisabled('org',{code:!codeDatapro.isCodeEdit});
            codeDatapro && this.props.form.setFormItemsValue('org',{'code':{value:codeDatapro.newCode,display:codeDatapro.newCode}});
            setTimeout(() => {
                //设置页面form状态
                this.setAllFormStatus(data);
                //更新按钮状态
                this.buttonToggleShow();
            }, 0);
        };
        var {status, showMode} = this.state;
        var parentPKOrg = undefined;
        this.state.showMode = 'card';
        this.state.status = false;
        if(showMode == 'list'){
            var {checkedkeys, data} = this.state.treelist;
            var selectMember = this.state.getSelectListTreeData() || []
            parentPKOrg = selectMember.length > 0 ? selectMember[0].nodeData.org.values.pk_org : {value:null,display:null};//选中行pk
        }else{
            parentPKOrg = this.props.form.getFormItemsValue('org','pk_org');//选中行pk
        };
        this.checkDataPower(parentPKOrg && parentPKOrg.value,'add',(codeDatapro)=>{
            var allcomps = Object.values(this.state.card);
            this.props.form.EmptyAllFormValue("org");
            var showComps = allcomps.filter( comp => comp.isshow());
            showComps.forEach((d)=>{
                this.props.form.EmptyAllFormValue(d.areaname);
            })
            this.props.form.setFormStatus('org','add');
            this.setState(this.state,()=>{
                this.loadCardData({
                    pk_org:parentPKOrg.value,
                    loadtype: 'add',
                    callback:(data) =>{
                        this.fillCardData(data, (data) =>{
                            afterHander(codeDatapro,parentPKOrg,data);
                        });
                    }
                })
            });
        });
    }
    onCopyOrg(pk_org){
        var afterHander = (codeDatapro,pk_org,data) =>{
            ////设置页面form状态
            this.setAllFormStatusForCopy(data);
            //设置form特殊字段编辑性
            this.controlFormItemForCardEdit(undefined);
            //设置按钮状态
            this.buttonToggleShow();
            //设置按钮是否能编辑
            codeDatapro && this.props.form.setFormItemsDisabled('org',{code:!codeDatapro.isCodeEdit});
            codeDatapro && this.props.form.setFormItemsValue('org',{'code':{value:codeDatapro.newCode,display:codeDatapro.newCode}});
        };
        this.state.showMode = 'card';
        this.state.status = false;
        this.checkDataPower(pk_org,'copy',(codeDatapro)=>{
            this.props.addUrlParam({
                status: 'card',
                pk_org: pk_org
            })
            this.setState(this.state,() =>{
                this.loadCardData({
                    pk_org: pk_org,
                    loadtype: 'copy',
                    callback: (orgData) =>{
                        this.fillCardData(orgData, (data) =>{
                            afterHander(codeDatapro,pk_org,data);
                        })
                    }
                });
            });
        })
    }
    checkCardData(callback){
        var memberFlag = this.props.form.isCheckNow('org');
        if(!memberFlag){
            return;
        }
        //记录错误提示信息
        let warm = '';
        var allcomps = Object.values(this.state.card);
        var showComps = allcomps.filter( comp => comp.isshow());
        //必填项校验
        var errorarr = showComps.filter( obj =>{
           //如果勾选利润中心，那么管控范围就不能为空
            if("liabilitycenter" == obj.areaname){
                let pk_controlarea = this.props.form.getFormItemsValue('org','pk_controlarea');
                if(pk_controlarea.display == undefined || pk_controlarea.display == ''){
                    warm = this.lang['10100ORG-000003'] + this.props.form.getFormItemsValue('org','name').name.value+this.lang['10100ORG-000004'];/* 国际化处理： 利润中心,的管控范围不能为空！*/
                    return true;
                }
            }
            if("stockorg" == obj.areaname){
                //校验必填项
                if(!this.props.form.isCheckNow('stockorg')){
                    warm = this.lang['10100ORG-000005'];/* 国际化处理： 库存组织有必填项未填！*/
                    return true;
                }
            }
            if("adminorg" == obj.areaname){
                //校验必填项
                if(!this.props.form.isCheckNow('adminorg')){
                    warm = this.lang['10100ORG-000006'];/* 国际化处理： 行政有必填项未填！*/
                    return true;
                }
            }
            if("corp" == obj.areaname){
                //校验必填项
                if(!this.props.form.isCheckNow('corp')){
                    warm = this.lang['10100ORG-000007'];/* 国际化处理： 法人公司有必填项未填！*/
                    return true;
                }
            }
        });
        if(errorarr.length > 0 ){
            toast({content: warm, color: 'warning'});
            return ;
        }
        setTimeout(() => {
            callback && callback();
        }, 0);
    }
    packageCardData(callback){
        //界面上勾选的所有职能form（包含表头）
        var formidarr = ['org'];
        var allcomps = Object.values(this.state.card);
        //修改的时候，以前存在，现在取消的职能数组（需要删除）
        var deletemdata = [];
        deletemdata = allcomps.filter( comp => {
            return comp.getpk(false) != undefined && !comp.isshow()
        });
        var showComps = allcomps.filter( comp => comp.isshow());
        showComps.map((obj)=>{
            //只往后台传勾选职能的form 
            formidarr.push(obj.areaname);
            if(obj.authorize !=  undefined) formidarr.push.apply(formidarr,obj.authorize.authorizeareacode)
        })
        var formdata = this.props.form.getAllFormValue(formidarr);
        var validedata = {};
        //为了适配校验公式，需要把每个模板的pagecode传进去
        formdata && Object.keys(formdata).forEach( key => {
            //平台目前不支持批量校验，所以先只校验表头
            if(key == 'org'){
                formdata[key]['areacode']='org';
                validedata = {
                    model: formdata[key],
                    pageid: this.props.config.pagecode
                }
            }
        })
        setTimeout(() => {
            callback && callback(formdata,validedata,deletemdata);
        }, 0);
    }
    onSaveOrg(callback){
        debugger;
        var afterHander = (data,deletemdata) =>{
            //保存的时候，如果是根节点行政组织，就设置为非必填项
            if(!this.state.adminroot.haveroot && this.props.form.getFormItemsValue('org','orgtype29').value){
                this.state.adminroot = {haveroot:true,pk:data['org'].rows[0].values['pk_org'].value};
            }
            //保存的时候，如果是根节点法人组织，就设置为非必填项
            if(!this.state.corproot.haveroot && this.props.form.getFormItemsValue('org','orgtype2').value){
                this.state.corproot = {haveroot:true,pk:data['org'].rows[0].values['pk_org'].value};
            }
            //保存的时候，如果是根节点组织，就设置为非必填项
            if(!this.state.orgroot.haveroot){
                this.state.orgroot = {haveroot:true,pk:data['org'].rows[0].values['pk_org'].value};
            }
            this.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项不可用
            this.props.form.setFormItemsRequired('org',{'pk_corp':false});
            //将原来存在，现在删除的职能form数据清空
            deletemdata && deletemdata.forEach((delobj)=>{
                this.props.form.EmptyAllFormValue(delobj);
            })
            //卡片翻页增加新增的数据
            this.setCardPaginationId(2);
        };
        this.checkCardData(()=>{
            this.packageCardData((formdata,validedata,deletemdata)=>{
                this.saveOrg(formdata,validedata,deletemdata,(data)=>{
                    afterHander(data,deletemdata);
                    //没有回调就刷新界面，有回调就不刷新，直接执行回调函数
                    if(!callback){
                        this.state.cacheData.currentpk = '';
                        this.state.cacheData.cacheDataArr = [];
                        this.state.cacheData.currentDataStatus = 'loading';
                        this.state.showMode = 'card';
                        this.state.status = true;
                        this.setState(this.state,()=>{
                            this.browseCard(data['org'].rows[0].values['pk_org'].value);
                        });
                        toast({color: 'success', title: this.lang['10100ORG-000047']});/* 国际化处理： 保存成功！*/
                    }
                    setTimeout(() => {
                        callback && callback();
                    }, 0);
                })
            });
        });
    }
    onSaveAddOrg(){
        this.onSaveOrg(() =>{
           this.onAddOrg();
        });
    }
    saveOrg(formdata,validedata,deletemdata,callback){
        debugger;
        var deleteorgtypearr = [];
        deletemdata && deletemdata.forEach(d => {
            deleteorgtypearr.push(d.areaname);
        })
        let that = this;
        this.props.validateToSave(validedata,()=>{
                    //保存数据
                    ajax({
                        url:'/nccloud/uapbd/org/save.do',
                        //data:formdata,
                        data:{formdata:formdata,status:'save',deleteorgtype:deleteorgtypearr},
                        success:(res)=>{
                            if(res.success){
                                callback && callback(res.data);
                                if(formdata.fundorg!=undefined&&formdata.fundorg.rows[0].values.code.value==null){
                                    // toast({duration: 6666 ,title:that.lang['10100ORG-000110'],color:"warning"});
                                }
                            };
                        }
                    });
                },{'org':'form'} , 'form')
    }
    onRefreshOrg(callback){
        this.state.showMode = 'list';
        this.state.status = true;
        this.setState(this.state, () => {
            this.loadListData( data => {
                this.fillListData(data,(data) =>{
                    toast({title:this.lang['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                    this.buttonToggleShow();
                    setTimeout(() => {
                        callback && callback(data);
                    }, 0);
                });
            });
        });
    }
    onRefreshCardOrg(pk_org,callback){
        this.state.showMode = 'card';
        this.state.status = true;
        this.state.cacheData.currentDataStatus = 'loading';
        this.setState(this.state, () => {
            this.loadCardData({
                pk_org: pk_org,
                loadtype: 'loading',
                callback: (data,codeDatapro) =>{
                    this.fillCardData(data, (data) =>{
                        this.setAllFormStatus(data);
                        this.buttonToggleShow();
                        toast({title:this.lang['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                        //afterHander(codeDatapro,pk_org);
                    })
                    setTimeout(() => {
                        callback && callback(data);
                    }, 0);
                }
            });
        });
    }
    onSearchOrg(callback){
        var afterHander = (data, allnewpks) =>{
            //提示查询纪录
            if(allnewpks && allnewpks.length > 0){
                toast({
                    content: this.lang['10100ORG-000094'] + allnewpks.length + this.lang['10100ORG-000095'],
                    color: 'success'
                });/* 国际化处理： 查询成功，共,条*/
            }else{
                toast({content: this.lang['10100ORG-000096'], color: 'warning'});/* 国际化处理： 未查询出符合条件的数据！*/
            }
            setTimeout(() => {
                this.buttonToggleShow();
            }, 0);
        };

        this.state.showMode = 'list';
        this.state.status = true;//浏览态
        this.setState(this.state, () => {
            this.loadListData( (data,pks) => {
                this.state.treelist.data = data;
                this.state.treelist.checkedkeys = [];
                this.props.ViewModel.setData(this.props.config.datasource, {
                    simpleTable: {
                        allpks: pks
                    }
                });
                this.state.cacheData.allpks = pks;
                this.state.treelist.expandedRowKeys = data.map( d=> {
                    return d.nodeData.org.values.pk_org.value
                });
                this.setState(this.state, () =>{
                    afterHander(data,pks);
                });
              
                // this.fillListData(data,() =>{
                //     afterHander(data,pks);
                //     setTimeout(() => {
                //         callback && callback(data);
                //     }, 0);
                // });
            });
        });
    }
    onEnableOrg(pk_orgs = [], enable = false){
        this.enableOrg(pk_orgs, enable, ()=>{
            //提示
            if(this.state.showMode == 'list'){
                this.browseList();
            }else{
                this.browseCard(pk_orgs[0]);
            }
        })
    }
    enableOrg(pk_orgs, enable, callback){
        var handlerPolicy = (callback) =>{
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_orgs[0],status:'edit'}, 
                success:(res)=>{
                    promptBox({
                        color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: !enable ? this.lang['10100ORG-000103'] : this.lang['10100ORG-000102'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                        noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        content: !enable ? this.lang['10100ORG-000034']/* 国际化处理： 确认停用该组织？*/ :this.lang['10100ORG-000032'],
                        beSureBtnClick: () =>{
                            callback && callback();
                        }   
                    })
                }
            });
        };
        var handlerEnable = () =>{
            ajax({
                url: !enable ? '/nccloud/uapbd/org/disable.do' : '/nccloud/uapbd/org/enable.do',
                data:{pk_org:pk_orgs},
                success:(res)=>{
                    this.state.cacheData.currentDataStatus = 'loading';
                    callback && callback();
                    toast({ color: 'success', title:!enable ? this.lang['10100ORG-000014']/* 国际化处理： 停用成功！*/ :  this.lang['10100ORG-000018']/* 国际化处理： 启用成功！*/ });
                }
            });
        };
        handlerPolicy(() =>{
            handlerEnable();
        });
    }
    onDeleteOrg(pk_orgs = [],needwords = true){
        this.deleteOrg(pk_orgs,needwords,()=>{
            //提示
            if(this.state.showMode == 'list'){
                this.browseList();
            }else{
                this.browseCard(this.props.cardPagination.getNextCardPaginationId({id:pk_orgs[0],status:1}));
            }
        })
    }
    deleteOrg(pk_orgs,needwords, callback){
        var handlerPolicy = (callback) =>{
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_orgs[0],status:'edit'}, 
                success:(res)=>{
                    promptBox({
                        color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.lang['10100ORG-000099'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                        noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        hasCloseBtn:false,
                        content: this.lang['10100ORG-000009'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: () =>{
                            callback && callback();
                        }   
                    })
                }
            });
        };
        var handlerDelete = (callback) =>{
            ajax({
                url: '/nccloud/uapbd/org/delete.do',
                data:{pk_org:pk_orgs},
                success:(res)=>{
                    toast({ color: 'success', title: this.lang['10100ORG-000010'] });/* 国际化处理： 删除成功！*/
                    callback && callback();
                }
            });
        };
        if(needwords != false){
            handlerPolicy(() =>{
                handlerDelete( () =>{
                    this.setCardPaginationId(3,()=>{
                        callback && callback();
                    });
                });
            });
        }else{
            handlerDelete( () =>{
                this.setCardPaginationId(3,()=>{
                    callback && callback();
                });
            });
        }
    }
    setCardPaginationId(status = 1,callback){//1为修改，2为新增，3为删除
        this.props.cardPagination.setCardPaginationId ({
            id:this.props.form.getFormItemsValue('org','pk_org').value,
            status:status
        });
        callback && callback();
    } 
    browseCard(pk_org,callback){
        this.props.addUrlParam({
            status: 'card',
            pk_org: pk_org
        })
        this.state.showMode = 'card';
        this.state.status = true;
        this.setState(this.state,()=>{
            if(!(pk_org == '' || pk_org == undefined || pk_org == null)){
                this.loadCardData({
                    pk_org:pk_org,
                    loadtype : 'load',
                    callback:(data, codeDatapro) =>{
                        this.fillCardData(data, (data) =>{
                            this.state.orgunit_name =  this.props.form.getFormItemsValue('org','name').name.value;
                            this.buttonToggleShow();
                            //设置页面form状态
                            this.setAllFormStatus(data);
                            //设置卡片翻页的当前主键
                            this.setCardPaginationId(1);
                            setTimeout(() => {
                                callback && callback(data);
                            }, 0);
                        })
                    }
                });
            }else{
                //清空所有form数据
                var allcomps = Object.values(this.state.card);
                //清空主表数据
                this.props.form.EmptyAllFormValue("org");
                var showComps = allcomps.filter( comp => comp.isshow());
                showComps.forEach((d)=>{
                    this.props.form.EmptyAllFormValue(d.areaname);
                })
                //设置按钮状态
                this.buttonToggleShow();
                //控制页面按钮状态
                this.setAllFormStatus();
            }
        });
    }
    browseList(callback){
        this.props.addUrlParam({
            status: 'list',
            pk_org: ''
        })
        this.state.showMode = 'list';
        this.state.status = true;
        this.setState(this.state, () => {
            this.loadListData((data,pks)  => {
                this.fillListData(data);
                this.state.cacheData.allpks = pks;
                this.props.ViewModel.setData(this.props.config.datasource, {
                    simpleTable: {
                        allpks: pks
                    }
                });
                this.buttonToggleShow();
                setTimeout(() => {
                    callback && callback(data);
                }, 0);
            });
        });
    }
    onCancelCardEdit(){
        var pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        var handlerFillCard =( data) =>{
            this.fillCardData(data, (data) =>{
                this.state.showMode = 'card';
                this.state.status = true;
                this.setState(this.state, () =>{
                    //设置页面form状态
                    this.setAllFormStatus(data);
                    //设置卡片翻页的当前主键
                    this.setCardPaginationId(1);
                    //设置按钮状态
                    this.buttonToggleShow();
                });
            })
        };
        if(pk_org != null){
            //编辑态取消
            this.loadCardData({
                pk_org:pk_org,
                loadtype:'load',
                callback:(data, codeDatapro) =>{
                    handlerFillCard(data);
                }
            });
        }else{
            //新增态取消
            this.state.showMode = 'card';
            this.state.status = true;
            this.setState(this.state,()=>{
                this.onRollBackcode(()=>{
                    //清空所有form数据
                    var allcomps = Object.values(this.state.card);
                    //清空主表数据
                    this.props.form.EmptyAllFormValue("org");
                    var showComps = allcomps.filter( comp => comp.isshow());
                    showComps.forEach((d)=>{
                        this.props.form.EmptyAllFormValue(d.areaname);
                    })
                    //控制页面按钮状态
                    this.setAllFormStatus();
                    setTimeout(() => {
                        //设置按钮状态
                        this.buttonToggleShow();
                    }, 0);
                });
            });
        }
    } 
    //回收编码
    onRollBackcode(callback){
        ajax({
            url:'/nccloud/uapbd/org/rollbackcode.do',
            data: {
                code:this.props.form.getFormItemsValue('org','code').value,
                nodetype:'GROUP_NODE'
            }, 
            success:(res)=>{
                callback && callback();
            }
        });
    }
     //浏览态职能的停启用按钮
    commonCardsubBtnClick(props,id){
        var pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        var fieldname = "";
        let buttonname = '' ;
        if(id.indexOf("enable") != -1){
            buttonname = id.substring(0,id.indexOf("enable"));
            id = 'enable';
        }else{
            buttonname = id.substring(0,id.indexOf("disable"));
            id = 'disable';
        }

        var allcomps = Object.values(this.state.card);
        allcomps.forEach(d =>{
            if(d.areaname == buttonname) fieldname = d.orgtypeitem;
        });
        //判断按钮可以用行，如果已经启用就不能再启用
        let enable = props.form.getFormItemsValue(buttonname,'enablestate');
        switch (id) {
            // 表格操作按钮
            case 'enable':
                if(enable.value == 2){
                    toast({content : this.lang['10100ORG-000031'],color : "warning"});/* 国际化处理： 该职能已经启用！*/
                    break;
                }
                promptBox({
                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: this.lang['10100ORG-000032'],/* 国际化处理： 您确定要启用所选数据吗？*/
                    beSureBtnClick: () =>{
                        ajax({
                            url:'/nccloud/uapbd/org/orgtypeenbale.do',
                            data:{pk_org:pk_org,fieldname:fieldname,enable:'2',buttonname:buttonname},
                            success:(res)=>{
                                let {success,data} = res;
                                if(success){
                                    var btn = {};
                                    this.toggleButtonShow('2',buttonname,btn);
                                    this.props.button.setButtonsVisible(btn);
                                    toast({ color: 'success', title: this.lang['10100ORG-000018'] });/* 国际化处理： 启用成功！*/
                                    this.props.form.setFormItemsValue(buttonname,{'enablestate':{value:'2',display:this.lang['10100ORG-000017']}});/* 国际化处理： 已启用*/
                                    this.setState(this.state);
                                };
                            }
                        });
                    }   
                })
                break;
            case 'disable':
                if(enable == 2){
                    toast({content : this.lang['10100ORG-000033'],color : 'warning'});/* 国际化处理： 该职能已经停用！*/
                    break;
                }
                promptBox({
                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: this.lang['10100ORG-000034'],/* 国际化处理： 您确定要停用所选数据吗？*/
                    beSureBtnClick: () =>{
                        ajax({
                            url:'/nccloud/uapbd/org/orgtypeenbale.do',
                            data:{pk_org:pk_org,fieldname:fieldname,enable:'3',buttonname:buttonname},
                            success:(res)=>{
                                let {success,data} = res;
                                if(success){
                                    var btn = {};
                                    this.toggleButtonShow('3',buttonname,btn);
                                    this.props.button.setButtonsVisible(btn);
                                    toast({ color: 'success', title: this.lang['10100ORG-000014'] });/* 国际化处理： 停用成功！*/
                                    //停用成功之后，需要把界面上停启用改变
                                    this.props.form.setFormItemsValue(buttonname,{'enablestate':{value:'3',display:this.lang['10100ORG-000013']}});/* 国际化处理： 已停用*/
                                    this.setState(this.state);
                                };
                            }
                        });
                    }   
                })
                break;
            default:
                break;
        }
    }
    //控制业务单元职能的停启用按钮
    toggleButtonShow (enablestate,subGrid,btn){
        let enablebtnname = subGrid + 'enable';
        let disablebtnname = subGrid + 'disable';

        if(enablestate ==='2'){//启用状态
            btn[disablebtnname] = true;
            btn[enablebtnname] = false;
        }else{
            btn[disablebtnname] = false;
            btn[enablebtnname] = true;
        }
         //新增的时候，职能的停启用按钮都不现实
         if(!this.state.status){
            btn[disablebtnname] = false;
            btn[enablebtnname] = false;
         }
    }

//------------------------------------列表按钮点击事件开始----------------------------------------------------------------
    //列表行操作按钮
    // oprListButtonClick(record, index, props, key){
    //     switch (key) {
    //         // 表格操作按钮
    //         case 'opredit':
    //             this.onEditOrg(record.nodeData.org.values.pk_org.value);
    //             break;
    //         case 'oprdel':
    //             this.onDeleteOrg([record.nodeData.org.values.pk_org.value],false);
    //             break;
    //         case 'oprcopy':
    //             this.onCopyOrg(record.nodeData.org.values.pk_org.value);
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //列表按钮点击事件
    onListBtnOperation(btncode, areacode){
        var _this = this;
        var props = _this.props;
        //停启用获取修改行数据
        var pk_orgarr = [];
        var pk_org ='';
        var pk_fatherorg = {};
        var selectMember = this.state.getSelectListTreeData() || [];
        //selectMember = data.filter( d=>{ checkedkeys.indexOf(d.nodeData.org.values.pk_org.value) !=-1 });

        let havecountryzone = true;
        let havenocountryzonename = '';
        if(_this.state.showMode == 'card'){
            pk_org = _this.props.form.getFormItemsValue('org','pk_org').value;
            pk_fatherorg = _this.props.form.getFormItemsValue('org','pk_fatherorg');
            this.state.orgunit_name =  _this.props.form.getFormItemsValue('org','name').name.value;
            pk_orgarr.push(pk_org);
        }else{
            if(selectMember.length != 0 ){
                selectMember.map((obj)=>{
                    pk_orgarr.push(obj.nodeData.org.values.pk_org.value);
                    if(!obj.nodeData.org.values.countryzone.value){
                        havecountryzone = false;
                        havenocountryzonename = havenocountryzonename + obj.nodeData.org.values.name.value+'，';
                    }
                })
                this.state.orgunit_name =  selectMember[0].nodeData.org.values.name.value;
                pk_org = selectMember[0].nodeData.org.values.pk_org.value;
                //保存操作的数据
                _this.state.orgunit_pk_orgarr = pk_orgarr;
                pk_fatherorg = {display:selectMember[0].nodeData.org.values.code.display,value:selectMember[0].nodeData.org.values.code.value};
            }
        }
        switch (btncode) {
            case 'add':
                _this.onAddOrg();
                break;
            case 'edit':
                _this.onEditOrg(pk_org);         
                //委托关系，需要根据开启的职能，关闭委托关系的不能编辑状态
                //_this.dealrelationformstatus();
                break;
            case 'save':
                 _this.onSaveOrg();break;
            case 'copy' :
                 _this.onCopyOrg(pk_org);break;
            case 'saveadd':
                _this.onSaveAddOrg();break;
            case 'delete':
                    _this.onDeleteOrg(pk_orgarr,true);
                    break;
            case 'cancel':
                promptBox({
                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: _this.lang['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: _this.lang['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () =>{
                        this.onCancelCardEdit();
                    }   
                })
                break;
            case 'disable':
                    _this.onEnableOrg(pk_orgarr,false);
                    break;
            case 'enable':
                    _this.onEnableOrg(pk_orgarr,true);
                    break;
            case 'refresh':
                    if(areacode == 'list'){
                        _this.onRefreshOrg();
                    }else{
                        _this.onRefreshCardOrg(pk_org);
                    }
                    break;
            case 'version':
                //版本化
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                props.modal.show('org_v',{title:_this.lang['10100ORG-000056']});
                //查询版本信息还有新版本号
                let reqData = [
                    {
                        rqUrl: '/uapbd/org/queryversionvno.do',
                        rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                        rqCode: 'versionvno'
                    },
                    {
                        rqUrl: '/uapbd/org/queryversionvo.do',
                        rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                        rqCode: 'versionvos'
                    }
                    ];
                    ajax({
                        url :'/nccloud/platform/pub/mergerequest.do',
                        data : reqData,
                        success : (res) => {
                            if(res.success){
                                //给table赋值versionvo
                                props.table.setAllTableData('org_v',res.data.versionvos['org_v']);
                                //给form赋值versioncode
                                props.form.setAllFormValue({['org_v_head']:res.data.versionvno['org_v_head']});
                            }
                        }
                    });
                props.form.setFormStatus('org_v_head','edit');
                break;
            case 'financeorgversion':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                ajax({
                    url :'/nccloud/uapbd/org/queryfinanceversion.do',
                    data:{type:'1'},
                    success : (res) => {
                        if(res.success){
                            props.modal.show('financeorg_v',{title:_this.lang['10100ORG-000019']});/* 国际化处理： 财务组织版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            if(res.data){
                                if(res.data.financeorg_v && res.data.financeorg_v.rows && res.data.financeorg_v.rows.length > 0){
                                    res.data.financeorg_v.rows[0].values.vname.value = null;
                                }
                                props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                            }
                        }
                    }
                });
                this.state.orgunit_versiontype = '1';
                props.form.setFormStatus('financeorg_v','edit');
                break;

            case 'adminorgversion':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                
                ajax({
                    url :'/nccloud/uapbd/org/queryfinanceversion.do',
                    data:{type:'4'},
                    success : (res) => {
                        if(res.success){
                            props.modal.show('financeorg_v',{title:_this.lang['10100ORG-000020']});/* 国际化处理： 行政组织体系版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            if(res.data){
                                props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                            }
                        }
                    }
                });
                this.state.orgunit_versiontype = '4';
                props.form.setFormStatus('financeorg_v','edit');
                break;

            case 'liabilitycenterversion':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                
                ajax({
                    url :'/nccloud/uapbd/org/queryfinanceversion.do',
                    data:{type:'2'},
                    success : (res) => {
                        if(res.success){
                            
                            if(res.data){
                                if('error' == res.data['financeorg_v'].rows[0].values.vname.value){
                                    promptBox({
                                        color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                        title: _this.lang['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                        noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                        content: _this.lang['10100ORG-000021'],/* 国际化处理： 该集团下还未创建利润中心,确定要进行利润中心体系的版本化操作吗？*/
                                        beSureBtnClick: () =>{
                                            props.modal.show('financeorg_v',{title:_this.lang['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                            props.form.EmptyAllFormValue('financeorg_v');
                                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                            props.form.setFormItemsValue('financeorg_v',{'vname':{value:null,display:null}})
                                        }   
                                    })
                                }else{
                                    props.modal.show('financeorg_v',{title:_this.lang['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                    props.form.EmptyAllFormValue('financeorg_v');
                                    props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                }
                                
                            }
                        }
                    }
                });
                this.state.orgunit_versiontype = '2';
                props.form.setFormStatus('financeorg_v','edit');
                break;

            case 'hrorgversion':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                
                ajax({
                    url :'/nccloud/uapbd/org/queryfinanceversion.do',
                    data:{type:'3'},
                    success : (res) => {
                        if(res.success){
                            props.modal.show('financeorg_v',{title:_this.lang['10100ORG-000023']});/* 国际化处理： 人力资源组织体系版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            if(res.data){
                                props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                            }
                        }
                    }
                });
                this.state.orgunit_versiontype = '3';
                props.form.setFormStatus('financeorg_v','edit');
                break;

            case 'orgmanager':
                //组织主管
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                ajax({
                    url :'/nccloud/uapbd/org/orgmanagerquery.do',
                    data:{pk_org:pk_org},
                    success : (res) => {
                        if(res.success){
                            props.modal.show('orgmanager',{title: this.lang['10100ORG-000057']});
                            if(res.data){
                                props.editTable.setTableData('orgmanager',res.data.orgmanager);
                            }else{
                                props.editTable.setTableData('orgmanager',{rows: []});
                            }
                            props.button.setButtonDisabled(['orgmanagedel'],true);
                            props.button.setButtonVisible(['orgmanagesave','orgmanagecancel'],false);
                            props.button.setButtonVisible(['orgmanageadd','orgmanageedit','orgmanagerefresh','orgmanagedel'],true);
                        }
                    }
                });
                break;
            case 'attachconfig':
                //附件管理
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                _this.setState({
                    showUploader: true,
                })
                    break;
            case 'logomanage':
                    //logo管理
                    if(selectMember.length > 1){
                        toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                        return;
                    }
                    ajax({
                        url :'/nccloud/uapbd/org/checklogo.do',
                        data:{pk_org:pk_org},
                        success : (res) => {
                            if(res.success){
                                if(res.data){
                                    _this.setState({
                                        showlogoUploader: true,
                                    })
                                }else{
                                    toast({content: _this.lang['10100ORG-000024'], color: 'warning'});/* 国际化处理： 业务单元中法人公司才能维护logo！*/
                                    return;
                                }
                            }
                        }
                    });
                break;
            case 'orgmoduleperiod'://业务期初期间
                    if(selectMember.length > 1){
                        toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                        return;
                    }
                    ajax({
                        url :'/nccloud/uapbd/org/orgmoduleperiod.do',
                        data:{pk_org: pk_org},
                        success : (res) => {
                            if(res.success){
                                props.modal.show('orgmoduleperiod',{title:this.lang['10100ORG-000058']});
                                if(res.data){
                                    props.editTable.setTableData('orgmoduleperiod',res.data.orgmoduleperiod);
                                }else{
                                    props.editTable.setTableData('orgmoduleperiod',{rows: []});
                                }
                                props.editTable.setStatus('orgmoduleperiod','edit');
                            }
                        }
                    });
                break;
            case 'createinnercustsupp'://生成内部客商
                    if(selectMember.length > 1){
                        props.form.setItemsVisible('innercustsupp',{'code':false,'custname':false,'custshortname':false});
                    }else{
                        props.form.setItemsVisible('innercustsupp',{'code':true,'custname':true,'custshortname':true});
                    }
                    //内部客商必须要把国家地区维护 !selectMember[0].values.countryzone.value
                    if((this.state.showMode == 'list' && !havecountryzone) || (this.state.showMode == 'card' && !this.props.form.getFormItemsValue('org','countryzone').value) ){
                        toast({content:havenocountryzonename + _this.lang['10100ORG-000025'], color: 'warning'});/* 国际化处理： 请先维护该组织的国家地区属性！*/
                        return;
                    }
                    ajax({
                        url :'/nccloud/uapbd/org/checkinnercustsupp.do',
                        data:{pk_org: pk_orgarr},
                        success : (res) => {
                            if(res.success){
                                if(res.data.exists){
                                    toast({content : res.data.existscontent,color : 'warning'});
                                    return ;
                                }else{
                                    props.modal.show('innercustsupp',{title: this.lang['10100ORG-000059']});
                                    props.form.setFormStatus('innercustsupp','edit');
                                    props.form.EmptyAllFormValue('innercustsupp');
                                    if(this.state.showMode == 'list'){
                                        props.form.setFormItemsValue('innercustsupp',{'code':{value:selectMember[0].nodeData.org.values.code.value,display:selectMember[0].nodeData.org.values.code.value}});
                                        props.form.setFormItemsValue('innercustsupp',{'custname':{value:selectMember[0].nodeData.org.values.name.value,display:selectMember[0].nodeData.org.values.name.value}});
                                        props.form.setFormItemsValue('innercustsupp',{'custshortname':{value:selectMember[0].nodeData.org.values.shortname.value,display:selectMember[0].nodeData.org.values.name.value}});
                                    }else{
                                        props.form.setFormItemsValue('innercustsupp',{'code':{value:props.form.getFormItemsValue('org','code').value,display:props.form.getFormItemsValue('org','code').value}});
                                        props.form.setFormItemsValue('innercustsupp',{'custname':{value:props.form.getFormItemsValue('org','name')[props.form.getResidtxtLang('org','name')].value,display:props.form.getFormItemsValue('org','name')[props.form.getResidtxtLang('org','name')].value}});
                                        props.form.setFormItemsValue('innercustsupp',{'custshortname':{value:props.form.getFormItemsValue('org','shortname')[props.form.getResidtxtLang('org','shortname')].value,display:props.form.getFormItemsValue('org','shortname')[props.form.getResidtxtLang('org','shortname')].value}});
                                    }
                                }
                            }
                        }
                    });
                break;
            case 'editVAT'://维护vat
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                ajax({
                    url :'/nccloud/uapbd/org/checklogo.do',
                    data:{pk_org:pk_org},
                    success : (res) => {
                        if(res.success){
                            if(res.data){
                                ajax({
                                    url :'/nccloud/uapbd/org/vatquery.do',
                                    data:{pk_org: pk_org},
                                    success : (res) => {
                                        if(res.success){
                                            props.modal.show('orgvatfunclet',{title:this.lang['10100ORG-000060']});
                                            if(res.data){
                                                props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                                            }else{
                                                props.editTable.setTableData('orgvatfunclet',{rows: []});
                                            }
                                            props.editTable.setStatus('orgvatfunclet','browse');
                                            props.button.setButtonDisabled(['vatdel'],true);
                                            props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                                            props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                                        }
                                    }
                                });
                            }else{
                                toast({content: _this.lang['10100ORG-000026'], color: 'warning'});/* 国际化处理： 业务单元中财务才能维护VAT！*/
                                return;
                            }
                        }
                    }
                });        
                break;

            case 'orgunitreldept'://业务单元关联部门
                ajax({
                    url :'/nccloud/uapbd/org/querytreenode.do',
                    success : (res) => {
                        if(res.success){
                            props.modal.show('orgdept',{title: this.lang['10100ORG-000061']});
                            props.syncTree.setSyncTreeData('orgunittree', res.data);
                            //设置默认中第一行
                            //props.syncTree.setNodeSelected('orgunittree', pk_orgarr[0]);
                            _this.onSelectEve( pk_orgarr[0],null,true);
                            this.setState({
                                bodyHei: document.querySelector(".orgdept .u-modal-body").offsetHeight - 67
                            })

                        }
                    }
                });
                break;
            case 'setorgroot':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                promptBox({
                    color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: _this.lang['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: _this.lang['10100ORG-000028'],/* 国际化处理： 您确定要设置成根业务单元吗？*/
                    beSureBtnClick: () =>{
                        _this.onSetUnitOrgRoot();
                    }   
                })
                break;
            case 'setcorproot':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                promptBox({
                    color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: _this.lang['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: _this.lang['10100ORG-000029'],/* 国际化处理： 您确定要设置成根公司吗？*/
                    beSureBtnClick: () =>{
                        _this.onSetCorpRoot();
                    }   
                })
                break;
            case 'setadminorgroot':
                if(selectMember.length > 1){
                    toast({content: _this.lang['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                promptBox({
                    color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: _this.lang['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: _this.lang['10100ORG-000030'],/* 国际化处理： 您确定要设置成根行政组织吗？*/
                    beSureBtnClick: () =>{
                        _this.onSetAdminOrgRoot();
                    }   
                })
                break;
            case 'print':
                let pks = this.state.cacheData.allpks ;
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    '/nccloud/uapbd/org/print.do', 
                    {
                        //billtype:'',  //单据类型
                        funcode: '10100ORG',      //功能节点编码，即模板编码
                        nodekey:this.state.showMode == 'list' ? 'listPrint':'cardPrint',     //模板节点标识
                        oids: this.state.showMode == 'list' ? pks : [pk_org]   //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
                break;
            case 'export':
                let pks1 = this.state.cacheData.allpks;//cacheTools.get('orgunit_allpkorg');
                let data = {
                    funcode:'10100ORG',  
                    appcode:'10100ORG',      //小应用编码
                    nodekey:this.state.showMode == 'list' ? 'listPrint':'cardPrint',     //模板节点标识
                    oids:this.state.showMode == 'list' ? pks1:[pk_org],    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                    outputType: 'output'
                }
                _this.setState({
                    pks: pks1
                },() => {
                    output({data: data,url:'/nccloud/uapbd/org/print.do'})
                });
                break;
            case 'exportfile':
                _this.setState(_this.state,()=>{
                    _this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }
//------------------------------------列表按钮点击事件结束----------------------------------------------------------------

//------------------------------------卡片界面form编辑事件按钮点击事件开始---------------------------------------------------------
    beforeEvent=(props, moduleId, key,value, changedrows)=>{
        debugger;
        var meta = this.props.meta.getMeta();
        var pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        switch(key)
            {
                case 'orgtype6':
                                //开启的时候
                                if(!value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype5').value == false){
                                        toast({content: this.lang['10100ORG-000035'], color: 'warning'});//默认top/* 国际化处理： 业务单元如需具有资金职能，则必须先具有财务职能！*/
                                        return false;
                                    }
                                }

                                if(!value.value){
                                    
                                        toast({content: this.lang['10100ORG-000110'], color: 'warning'});//默认top/* 国际化处理： 业务单元如需具有资金职能，则必须先具有财务职能！*/
                                        // return false;
                                }

                                break;//资金
                case 'orgtype33':
                                //开启的时候
                                if(!value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype34').value == true){
                                        toast({content: this.lang['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return false;
                                    };
                                    if(this.props.form.getFormItemsValue('org','orgtype9').value == false){
                                        toast({content: this.lang['10100ORG-000037'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元具有工厂职能必须同时具有库存职能！*/
                                        return false;
                                    };
                                }
                                break;//工厂
                case 'orgtype5':
                                //关闭的时候
                                if(value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype2').value == true){
                                        toast({content: this.lang['10100ORG-000038'], color: 'warning'});//默认top/* 国际化处理： 业务单元具有公司职能时，必须同时具有财务职能！*/
                                        return false;
                                    }
                                    if(this.props.form.getFormItemsValue('org','orgtype6').value == true){
                                        toast({content: this.lang['10100ORG-000111'], color: 'warning'});//默认top/* 国际化处理： 业务单元具有资金职能时，必须同时具有财务职能！*/
                                        return false;
                                    }
                                }
                                break;//财务
                case 'orgtype34':
                                if(!value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype33').value == true){
                                        toast({content: this.lang['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return false;
                                    }
                                }
                                break;//计划中心
                case 'region':
                                let region = meta['corp'].items.find((item) => item.attrcode == 'region');
                                var country = props.form.getFormItemsValue('org','countryzone');
                                region.queryCondition = function () {
                                    return {
                                        pk_country: country && country.value || '',
                                        pk_father:'~'
                                    }
                                }
                                props.meta.setMeta(meta);
                                break;//法人行政区划参照需要关联表头的国家地区
                case 'pk_fatherorg':
                                if(!(pk_org == null)){
                                    //新增或者复制的时候，上级业务单元不能选自己
                                    let pk_fatherorg = meta['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgcorp = meta['corp'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorghrorg = meta['hrorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgsaleorg = meta['saleorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgliability = meta['liabilitycenter'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    let pk_fatherorgadminorg = meta['adminorg'].items.find((item) => item.attrcode == 'pk_fatherorg');
                                    pk_fatherorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'org'
                                        }
                                    }
                                    pk_fatherorgcorp.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'corp'
                                        }
                                    }
                                    pk_fatherorghrorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'hrorg'
                                        }
                                    }
                                    pk_fatherorgsaleorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'saleorg'
                                        }
                                    }
                                    pk_fatherorgliability.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'liabilitycenter'
                                        }
                                    }
                                    pk_fatherorgadminorg.queryCondition = function () {
                                        return {
                                            TreeRefActionExt: 'nccloud.web.org.orgunit.action.OrgPkFatherSQLBuilder,nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                                            pk:pk_org,
                                            AppCode:props.config.appcode,
                                            orgtype:'adminorg'
                                        }
                                    }
                                    this.props.meta.setMeta(meta); 
                                }
                                break;//
                case 'istaxorg':
                    //开启的时候
                    if(value.value){
                        if(this.props.form.getFormItemsValue('org','orgtype2').value == true){
                            toast({content: this.lang['10100ORG-000039'], color: 'warning'});//默认top/* 国际化处理： 法人公司必须具有税务职能！*/
                            return false;
                        }
                    }
                    break;//资金
                case 'orgtype4':
                    //关闭的时候，如果是根节点，就给出提示，不能关闭
                    if(value.value){
                        if(this.state.adminroot.haveroot && this.state.adminroot.pk == pk_org && this.props.form.getFormItemsValue('org','orgtype29').value == true ){
                            toast({content: this.lang['10100ORG-000108'], color: 'warning'});//默认top/* 国际化处理： 行政组织的根节点必须具有人力资源职能！*/
                            return false;
                        }
                    }
                    break;//行政
                default: return true;//只对职能区域按钮做编辑后事件，其他的先跳过
            }
        return true;
    }
    afterEvent =(props, moduleId, key,value, changedrows)=>{
        var that = this;
        var subGrid = 'org';
        var pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        switch(key)
            {
                case 'orgtype2':
                                subGrid = 'corp';
                                this.props.form.setFormItemsValue('org',{'orgtype2':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //是法人公司，必须要有财务职能，关闭法人公司，不一定关闭财务职能
                                    that.props.form.setFormStatus("financeorg","add");
                                    if(that.props.form.getFormItemsValue('org','pk_corp').value != ''){
                                        that.props.form.setFormItemsValue('corp',{'pk_fatherorg':that.props.form.getFormItemsValue('org','pk_corp')}) ;
                                    }     
                                    that.props.form.setFormItemsValue('org',{'orgtype5':{value:value.value,display:null}}) ;
                                    //勾选法人之后，所属公司不能编辑
                                    that.props.form.setFormItemsValue('org',{'pk_corp':{value:null,display:null}}) ;
                                    that.props.form.setFormItemsDisabled('org',{'pk_corp':true});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('org',{'pk_corp':false});
                                    //勾选法人公司之后财务组织的税务组织必须勾选
                                    that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:true,display:false}});
                                    //当法人公司和财务职能都勾选时，财务职能的缴税税种字段可编辑，委托税种字段不可编辑
                                    that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':false});//缴税税种
                                    that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':true});//委托税种
                                }
                                if(!value.value){
                                    that.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项可用
                                    if(that.props.form.getFormItemsValue('org','orgtype5').value == true){
                                        //关闭法人，如果财务还在，那么所属公司必填
                                        that.props.form.setFormItemsRequired('org',{'pk_corp':true});
                                        that.props.form.setFormItemsValue('org',{'pk_corp':this.state.pk_corp}) ;
                                        if(that.props.form.getFormItemsValue('financeorg','istaxorg').value == true){
                                            //不勾选税务组织时，缴税税种和委托税种字段不可编辑；当勾选税务组织时，缴税税种和委托税种字段可编辑
                                            that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':false});//缴税税种
                                            that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':false});//委托税种
                                        }else{
                                            that.props.form.setFormItemsDisabled('financeorg',{'paytaxcates':true});//缴税税种
                                            that.props.form.setFormItemsDisabled('financeorg',{'authorizedtaxcates':true});//委托税种
                                        }
                                    }
                                }
                                break;//法人公司
                case 'orgtype4':
                                subGrid = 'hrorg';
                                this.props.form.setFormItemsValue('org',{'orgtype4':{value:value.value,display:null}}) ;
                                break;//人力资源
                case 'orgtype5':   
                                subGrid = 'financeorg'; 
                                this.props.form.setFormItemsValue('org',{'orgtype5':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('stockorg',{'pk_financeorg':false});
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});
                                    //如果勾选了财务，但是没有勾选法人，那么所属公司是必填
                                    if(!this.props.form.getFormItemsValue('org','orgtype2').value){
                                        that.props.form.setFormItemsRequired('org',{'pk_corp':true});
                                    }
                                }else{
                                    //停用财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    //停用财务职能的时候，需要把库存的所属财务组织为可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});//设置表单项不可用
                                    if(this.props.form.getFormItemsValue('org','orgtype5').value){
                                        //勾选法人公司之后财务组织的税务组织必须勾选
                                        that.props.form.setFormItemsValue('financeorg',{'istaxorg':{value:true,display:false}});
                                    }
                                    //停用财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('stockorg',{'pk_financeorg':true});
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});
                                    //取消财务职能，所属公司改为非必填
                                    that.props.form.setFormItemsRequired('org',{'pk_corp':false});
                                }
                                break;//财务组织
                case 'orgtype6':
                                //开启的时候
                                this.props.form.setFormItemsValue('org',{'orgtype6':{value:value.value,display:null}}) ;
                                if(value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype5').value == false){
                                        toast({content: this.lang['10100ORG-000035'], color: 'warning'});//默认top/* 国际化处理： 业务单元如需具有资金职能，则必须先具有财务职能！*/
                                        return;
                                    }
                                    if((this.props.form.getFormItemsValue('fundorg','issettlecenter').value == null||this.props.form.getFormItemsValue('fundorg','issettlecenter').value == false) && (this.props.form.getFormItemsValue('fundorg','isfinancecorp').value == null || this.props.form.getFormItemsValue('fundorg','isfinancecorp').value == false)){
                                        this.props.form.setFormItemsValue('fundorg',{'issettlecenter':{value:true,display:null}})
                                    }
                                }
                                subGrid = 'fundorg'; break;//资金
                case 'orgtype7':
                                subGrid = 'purchaseorg'; 
                                this.props.form.setFormItemsValue('org',{'orgtype7':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':false});//设置表单项不可用
                                }
                                break;//采购
                case 'orgtype8':
                                subGrid = 'saleorg';
                                this.props.form.setFormItemsValue('org',{'orgtype8':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启销售职能的时候，需要把表头使用零售设置为可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项不可用
                                }else{
                                    //停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
                                    that.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                                }
                                //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype9').value){
                                    //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启库存职能的时候，需要把销售的默认库存组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':false});//设置表单项可用
                                }
                                //如果财务组织已经启用，需要把财务相关的委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype5').value){
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                }else{
                                    //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default2':false,'default1':false});//设置表单项可用
                                }
                                //如果利润中心职能已经启用，需要把采购业务委托关系中的默认利润中心设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype15').value){
                                    //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
                                }else{
                                    //开启利润中心职能的时候，需要把销售的默认利润中心设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':false});//设置表单项可用
                                }
                                break;//销售
                case 'orgtype9':
                                subGrid = 'stockorg';
                                this.props.form.setFormItemsValue('org',{'orgtype9':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
                                    //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
                                    //开启销售职能的时候，需要把表头使用零售设置为可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项不可用
                                }else{
                                    //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':false});//设置表单项不可用
                                    //停用库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':false});//设置表单项不可用
                                    //停用库存职能的时候，需要把销售的默认库存组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('saleorgrelation',{'target':false});//设置表单项不可用
                                    //停用销售职能的时候，需要把表头使用零售设置为不可编辑
                                    that.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
                                    that.props.form.setFormItemsValue('org',{'isretail':{value:null,display:null}});
                                }
                                //如果财务组织已经启用，需要把财务相关的委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype5').value){
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('stockorg',{'pk_financeorg':false});
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});
                                }else{
                                    //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default2':false,'default1':false});//设置表单项不可用
                                    //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});//设置表单项不可用
                                    that.props.form.setFormItemsRequired('stockorg',{'pk_financeorg':true});
                                    that.props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':false});
                                }
                                //如果质检职能已经启用，需要把质检业务委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype11').value){
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':false});//设置表单项可用
                                }
                                //如果利润中心职能已经启用，需要把采购业务委托关系中的默认利润中心设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype15').value){
                                    //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
                                }else{
                                    //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':false});//设置表单项可用
                                }
                                //如果物流职能已经启用，需要把物流业务委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype10').value){
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':false});//设置表单项可用
                                }
                                //如果资产职能已经启用，需要把资产库存业务委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype12').value){
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':false});//设置表单项可用
                                }
                                //如果采购职能已经启用，需要把采购业务委托关系中的默认采购组织设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype7').value){
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockorgrelation',{'target':false});//设置表单项可用
                                }
                                break;//库存
                case 'orgtype10':
                                subGrid = 'trafficorg'; 
                                this.props.form.setFormItemsValue('org',{'orgtype10':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启物流职能的时候，需要把库存的物流业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stocktrafficrelation',{'target':false});//设置表单项不可用
                                }
                                break;//物流
                case 'orgtype11':
                                subGrid = 'qccenter';
                                this.props.form.setFormItemsValue('org',{'orgtype11':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用质检职能的时候，需要把库存的质检业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockqccenterrelation',{'target':false});//设置表单项不可用
                                }
                                break;//质检
                case 'orgtype12':  
                                subGrid = 'assetorg'; 
                                this.props.form.setFormItemsValue('org',{'orgtype12':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用资产职能的时候，需要把库存的资产库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('stockassetrelation',{'target':false});//设置表单项不可用
                                }
                                break;//资产
                case 'orgtype14':
                                subGrid = 'maintainorg';
                                this.props.form.setFormItemsValue('org',{'orgtype14':{value:value.value,display:null}}) ;
                                if(value.value){
                                    //开启维修职能的时候，需要把资产的资产维修业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //停用维修职能的时候，需要把资产的资产维修业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':false});//设置表单项不可用
                                }
                                // //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype9').value){
                                    //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{target:true});//设置表单项不可用
                                }else{
                                    //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为可编辑
                                    that.props.form.setFormItemsDisabled('assetorgmaintainrelation',{target:false});//设置表单项可用
                                    //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('maintainstockrelation',{'target':false});//设置表单项不可用
                                }
                                break;//维修
                case 'orgtype15':
                                subGrid = 'liabilitycenter'; 
                                this.props.form.setFormItemsValue('org',{'orgtype15':{value:value.value,display:null}}) ;
                                // if(value.value){
                                //     //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
                                //     //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
                                // }else{
                                //     //停用利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为可编辑
                                //     that.props.form.setFormItemsDisabled('stockorgrelation',{'default3':false});//设置表单项不可用
                                //     //停用利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
                                //     that.props.form.setFormItemsDisabled('saleorgrelation',{'default3':false});//设置表单项不可用
                                // }
                                break;//利润中心
                case 'orgtype16':
                                subGrid = 'itemorg';
                                this.props.form.setFormItemsValue('org',{'orgtype16':{value:value.value,display:null}}) ;
                                //如果库存职能已经启用，需要把维修库存委托关系设置为不可编辑
                                if(this.props.form.getFormItemsValue('org','orgtype9').value){
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
                                }else{
                                    //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为可编辑
                                    that.props.form.setFormItemsDisabled('itemstockrelation',{'target':false});//设置表单项可用
                                }
                                break;//项目
                case 'orgtype17': 
                                subGrid = 'planbudget';
                                this.props.form.setFormItemsValue('org',{'orgtype17':{value:value.value,display:null}}) ;
                                break;//预算
                case 'orgtype29':
                                //如果是根节点行政组织，就设置为非必填项
                                this.props.form.setFormItemsValue('org',{'orgtype29':{value:value.value,display:null}}) ;
                                if(!this.state.adminroot.haveroot){
                                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
                                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
                                }else{
                                    that.props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
                                    that.props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
                                }
                                subGrid = 'adminorg'; 
                                break;//行政
                case 'orgtype33':
                                //开启的时候
                                this.props.form.setFormItemsValue('org',{'orgtype33':{value:value.value,display:null}}) ;
                                if(value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype34').value == true){
                                        toast({content: this.lang['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return;
                                    };
                                }
                                subGrid = 'factory';break;//工厂
                case 'orgtype34':
                                //开启的时候
                                this.props.form.setFormItemsValue('org',{'orgtype34':{value:value.value,display:null}}) ;
                                if(value.value){
                                    if(this.props.form.getFormItemsValue('org','orgtype33').value == true){
                                        toast({content: this.lang['10100ORG-000036'], color: 'warning'});//默认top/* 国际化处理： 一个业务单元不可同时具有计划中心职能和工厂职能！*/
                                        return;
                                    }
                                }
                                subGrid = 'plancenter';break;//计划中心
                case 'issettlecenter':
                                //资金职能下 结算中心开启的时候
                                if(value.value && this.props.form.getFormItemsValue('org','orgtype6').value){
                                    that.props.form.setFormItemsValue('fundorg',{'isfinancecorp':{value:false,display:null}})
                                }else{
                                    if(this.props.form.getFormItemsValue('org','orgtype6').value){
                                        that.props.form.setFormItemsValue('fundorg',{'isfinancecorp':{value:true,display:null}})
                                    } 
                                }
                                break;
                case 'isfinancecorp':
                                //资金职能下 财务公司开启的时候
                                if(value.value && this.props.form.getFormItemsValue('org','orgtype6').value){
                                    that.props.form.setFormItemsValue('fundorg',{'issettlecenter':{value:false,display:null}})
                                }else{
                                    if(this.props.form.getFormItemsValue('org','orgtype6').value){
                                        that.props.form.setFormItemsValue('fundorg',{'issettlecenter':{value:true,display:null}})
                                    }
                                }
                                break;
                case 'pk_address':
                                //选择地点参照，默认带出所属地区参照
                                ajax({
                                    url:'/nccloud/uapbd/org/getpkarea.do',
                                    data: {pk:value.refpk}, 
                                    success:(res)=>{
                                        if(res.success){     
                                            if(res.data){
                                                that.props.form.setFormItemsValue('stockorg',{'pk_areacl':{value:res.data.pk,display:res.data.name}});
                                            }
                                        }
                                    }
                                });
                                break;
                case 'reportconfirm':
                        //集团内只能有一个报表组织
                        if(value.value){
                            ajax({
                                url: '/nccloud/uapbd/org/checkreportconfirm.do',
                                data: {pk_org:pk_org},
                                success: (res) => {
                                    if (res.success) {
                                        if(res.data){
                                            toast({content: this.lang['10100ORG-000040'], color: 'warning'});//默认top/* 国际化处理： 集团内只能有一个报表确认组织！*/
                                            that.props.form.setFormItemsValue('org',{'reportconfirm':{value:false,display:null}});
                                            return false;
                                        }
                                    }
                                }
                            })
                        }
                        break;//资金
                default: ;
            }
            //处理业务单元，法人，行政上级组织可编辑性
            that.dealFatherItemEditproperty(pk_org);
    }
//------------------------------------卡片界面form编辑事件按钮点击事件结束---------------------------------------------------------

//------------------------------------卡片界面初始化数据开始---------------------------------------------------------
    dealrelationformstatus (){
        let props = this.props;
        //财务职能开启
        if(this.props.form.getFormItemsValue('org','orgtype5').value == true){
            //开启财务职能的时候，需要把库存的采购业务委托关系中的默认结算财务组织和默认应收组织设置为不可编辑
            props.form.setFormItemsDisabled('stockorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            //开启财务职能的时候，需要把库存的所属财务组织为不可编辑
            props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});//设置表单项不可用
            //开启财务职能的时候，需要把销售的默认结算财务组织和默认应收组织设置为不可编辑
            props.form.setFormItemsDisabled('saleorgrelation',{'default2':true,'default1':true});//设置表单项不可用
            props.form.setFormItemsRequired('stockorg',{'pk_financeorg':false});
            props.form.setFormItemsDisabled('stockorg',{'pk_financeorg':true});
        }
        //开启采购职能
        if(this.props.form.getFormItemsValue('org','orgtype7').value == true){
            //开启采购职能的时候，需要把库存的采购业务委托关系中的默认采购组织设置为不可编辑
            props.form.setFormItemsDisabled('stockorgrelation',{'target':true});//设置表单项不可用
        }
        //开启库存职能
        if(this.props.form.getFormItemsValue('org','orgtype9').value == true ){
            //开启库存职能的时候，需要把维修的维修库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('maintainstockrelation',{'target':true});//设置表单项不可用
            //开启库存职能的时候，需要把项目的项目库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('itemstockrelation',{'target':true});//设置表单项不可用
            //开启库存职能的时候，需要把销售的默认库存组织设置为不可编辑
            props.form.setFormItemsDisabled('saleorgrelation',{'target':true});//设置表单项不可用
        }
        //开启物流职能
        if(this.props.form.getFormItemsValue('org','orgtype10').value == true ){
             //开启物流职能的时候，需要把库存的物流业务委托关系设置为不可编辑
             props.form.setFormItemsDisabled('stocktrafficrelation',{'target':true});//设置表单项不可用
        }
        //开启质检职能
        if(this.props.form.getFormItemsValue('org','orgtype11').value == true){
            //开启质检职能的时候，需要把库存的质检业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('stockqccenterrelation',{'target':true});//设置表单项不可用
        }
       //开启资产职能
       if(this.props.form.getFormItemsValue('org','orgtype12').value == true){
            //开启资产职能的时候，需要把库存的资产库存业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('stockassetrelation',{'target':true});//设置表单项不可用
        }
        //开启维修职能
       if(this.props.form.getFormItemsValue('org','orgtype14').value == true){
            //开启维修职能的时候，需要把资产的资产维修业务委托关系设置为不可编辑
            props.form.setFormItemsDisabled('assetorgmaintainrelation',{'target':true});//设置表单项不可用
        }
        //开启利润中心职能
       if(this.props.form.getFormItemsValue('org','orgtype15').value == true ){
            //开启利润中心职能的时候，需要把库存的采购业务委托关系中的默认利润中心设置为不可编辑
            props.form.setFormItemsDisabled('stockorgrelation',{'default3':true});//设置表单项不可用
            //开启利润中心职能的时候，需要把销售的默认利润中心设置为不可编辑
            props.form.setFormItemsDisabled('saleorgrelation',{'default3':true});//设置表单项不可用
        }
    }
    //卡片界面翻页的时候查询数据
    pageInfo(pk){
        this.browseCard(pk);
        //如果是集团管理员，设置根节点，需要单独控制一下
        if(this.state.usertype != 1 ){
            let reqData = [
                {
                    rqUrl: '/uapbd/org/haverootorgunit.do',
                    rqCode: 'haverootorgunit'
                },
                {
                    rqUrl: '/uapbd/org/haveadminrootorgunit.do',
                    rqCode: 'haveadminrootorgunit'
                },
                {
                    rqUrl: '/uapbd/org/havecorprootorgunit.do',
                    rqCode: 'havecorprootorgunit'
                }
            ];
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : reqData,
                success : (res) => {
                    //如果是集团管理员,设置根节点才可以见
                    //当没有行政组织或者法人公司的时候，设置成根行政组织和设置成根法人公司不可用
                    let adminroot = res.data.haveadminrootorgunit;
                    if(!adminroot.haveroot){
                        this.props.button.setButtonDisabled(['setadminorgroot'],true);
                    }else{
                        if(pk == adminroot.pk){
                            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                            this.props.button.setButtonDisabled(['setadminorgroot'],true);
                        }else{
                            this.props.button.setButtonDisabled(['setadminorgroot'],false);
                        }
                    }
                    let corproot = res.data.havecorprootorgunit;
                    if(!corproot.haveroot){
                        this.props.button.setButtonDisabled(['setcorproot'],true);
                    }else{
                        if(pk == corproot.pk){
                            this.props.button.setButtonDisabled(['setcorproot'],true);
                        }else{
                            this.props.button.setButtonDisabled(['setcorproot'],false);
                        }
                    }
                    let orgroot = res.data.haverootorgunit;
                    if(!orgroot.haveroot){
                        this.props.button.setButtonDisabled(['setorgroot'],true);
                    }else{
                        if(pk == orgroot.pk){
                            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                            this.props.button.setButtonDisabled(['setorgroot'],true);
                        }else{
                            this.props.button.setButtonDisabled(['setorgroot'],false);
                        }
                    }
                }
            });
        }else{
            this.props.button.setButtonVisible(['setroot-2'],false);
        }
    }
    //卡片职能开关事件
    onCardSwitchChange(comp, areaname, btnStatus){
        if(this.state.status){
            return;
        }
        this.afterEvent(this.props, undefined, areaname,{vaule:btnStatus}, undefined);
    }
//------------------------------------卡片界面初始化数据结束----------------------------------------------------------

//------------------------------------设置根节点按钮事件开始----------------------------------------------------------------
       /**
     * 设置行政组织根节点
     * @param data
     * @returns {*}
     */
    onSetAdminOrgRoot=()=> {
        var pk_org = undefined;
        if(this.state.showMode == 'list'){
            var selectMember = this.state.getSelectListTreeData() || [];
            pk_org = selectMember[0].nodeData.org.values.pk_org.value
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        }
        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: 'adminroot'
            },
            success: (res) => {
                if (res.success) {
                    this.browseList();
                    this.props.modal.close('setadminorgroot');
                    toast({color: 'success', title: this.lang['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            },
            error: (result) => {
                toast({content: result.message, title: this.lang['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

     /**
     * 设置法人公司根节点
     * @param data
     * @returns {*}
     */
    onSetCorpRoot=()=> {
        var pk_org = undefined;
        if(this.state.showMode == 'list'){
            var selectMember = this.state.getSelectListTreeData() || [];
            pk_org = selectMember[0].nodeData.org.values.pk_org.value
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        }
        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: 'corproot'
            },
            success: (res) => {
                if (res.success) {
                    this.browseList();
                    toast({color: 'success', title: this.lang['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                    this.props.modal.close('setcorproot');
                }
            },
            error: (result) => {
                toast({content: result.message, title: this.lang['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

        /**
     * 设置业务单元根节点
     * @param data
     * @returns {*}
     */
    onSetUnitOrgRoot = ()=> {
        var pk_org = undefined;
        if(this.state.showMode == 'list'){
            var selectMember = this.state.getSelectListTreeData() || [];
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value
        }
        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: 'orgroot'
            },
            success: (res) => {
                if (res.success) {
                    this.browseList();
                    this.props.modal.close('setorgroot');
                    toast({color: 'success', title: this.lang['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            },
            error: (result) => {
                toast({content: result.message, title: this.lang['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

//------------------------------------设置根节点按钮事件结束----------------------------------------------------------------

//------------------------------------上传附件和上传照片按钮事件开始----------------------------------------------------------------
    onHideUploader = () => {
        this.setState({showlogoUploader: false, showUploader: false})
    }
    //上传附件照片校验
    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        let that = this;
        if (fileList.length > 0) {
            toast({content: that.lang['10100ORG-000052'], color: 'warning'});/* 国际化处理： logo只允许上传一张图片，请先删除原图片！*/
            return false;
        }
        let isJPG = false;
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            isJPG = true;
        }
        if (!isJPG) {
            toast({content: that.lang['10100ORG-000053'], color: 'warning'});/* 国际化处理： 只支持jpg,png格式图片！*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast({content: that.lang['10100ORG-000054'], color: 'warning'});/* 国际化处理： 上传大小小于2M！*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }
//------------------------------------上传附件和上传照片按钮事件结束----------------------------------------------------------------

//------------------------------------业务单元关联部门按钮事件开始----------------------------------------------------------------
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve(data, item, isChange) {
        let that = this;
        if (isChange) {
            //加载成员树表
            ajax({
                url: '/nccloud/uapbd/org/querydept.do',
                data: {
                    pk_org: data
                },
                success:  (res) => {
                    if (res.success) {
                        if (res.data) {
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            this.state.depttreelist.data = res.data;
                            this.state.depttreelist.checkedkeys = [];
                            this.state.depttreelist.expandedRowKeys = res.data.map( d=> {
                                return d.nodeData.dept.values.pk_dept.value
                            });
                            this.setState(this.state);
                        } 
                    }
                }
            });
        }
    }
    onMouseEnterSortTreeEve(key) {
        let obj = {
            delIcon: false,
            editIcon: false,
            addIcon: false
        };
        this.props.syncTree.hideIcon('orgunittree', key, obj)
    }
//------------------------------------业务单元关联部门按钮事件结束----------------------------------------------------------------

//------------------------------------VAT维护按钮事件开始----------------------------------------------------------------
    onOrgVATButtonClick(props, id) {
        
        let that = this;
        //获取改变的数据
        let selectedData = props.editTable.getCheckedRows('orgvatfunclet');
        let pk_org = undefined;
        if(this.state.showMode == 'list'){
            var selectMember = this.state.getSelectListTreeData() || [];
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        }
        let tableData = this.props.editTable.getAllData('orgvatfunclet'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        let rownum = this.props.editTable.getNumberOfRows('orgvatfunclet'); //获取列表总行数
        switch (id) {
            case 'vatadd':
                this.props.editTable.addRow('orgvatfunclet', rownum, true);
                this.props.editTable.setStatus('orgvatfunclet', 'edit');
                that.VATbuttonToggleShow("vatadd");
                that.props.button.setButtonDisabled([
                        'vatdel', 'vatlinedel'
                    ], true);
                that.props.button.setMainButton('vatsave', true);
                that.props.button.setMainButton('vatadd', false);
                break;
            case 'vatdel':
                if (selectedData.length == 0) {
                    toast({content: that.lang['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.lang['10100ORG-000099'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.lang['10100ORG-000050'],
                    /* 国际化处理： 您确定要删除吗？*/
                    beSureBtnClick: () => {
                        let indexArr1 = [];
                        selectedData.forEach((val) => {
                            indexArr1.push(val.index);
                        });
                        //界面上删除数据
                        this.props.editTable.deleteTableRowsByIndex('orgvatfunclet', indexArr1);
                        this.onSaveOrgVAT('vatdel');
                    }
                });break;
            case 'vatlinedel':
                // if (selectedData.length == 0) {
                //     toast({content: that.lang['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                //     return
                // }
                let indexArr = [];
                selectedData.forEach((val) => {
                    indexArr.push(val.index);
                });
                that.VATbuttonToggleShow( 'vatedit');
                this.props.editTable.deleteTableRowsByIndex('orgvatfunclet', indexArr);
                that.props.button.setButtonDisabled([
                        'vatdel','vatlinedel'
                    ], true);
                break;
            case 'vatedit':
                this.props.editTable.setStatus('orgvatfunclet', 'edit');
                that.VATbuttonToggleShow('vatedit');
                this.props.button.setButtonDisabled(['vatlinedel'], true);
                break;
            case 'vatcancel':
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.lang['10100ORG-000002'],
                    /* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () => {
                        this.props.editTable.cancelEdit('orgvatfunclet');
                        this.props.editTable.setStatus('orgvatfunclet', 'browse');
                        this.VATbuttonToggleShow('vatcancel');
                        this.props.button.setMainButton('vatsave', false);
                        this.props.button.setMainButton('vatadd', true);
                    }
                });break;
            case 'vatrefresh':
                ajax({
                    url :'/nccloud/uapbd/org/vatquery.do',
                    data:{pk_org: pk_org},
                    success : (res) => {
                        if(res.success){
                            if(res.data){
                                this.props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                            }else{
                                this.props.editTable.setTableData('orgvatfunclet',{rows: []});
                            }
                            this.props.editTable.setStatus('orgvatfunclet','browse');
                            this.props.button.setButtonDisabled(['vatdel'],true);
                            this.props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                            this.props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                            toast({title:that.lang['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                        }
                    }
                });break;
            case 'vatsave':
            //过滤界面上的无效数据
                this.props.editTable.filterEmptyRows('orgvatfunclet', ['pk_country']);
                this.onSaveOrgVAT();
                this.props.button.setMainButton('vatsave', false);
                this.props.button.setMainButton('vatadd', true);
                break;
        }
    }
    onVATTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index) {
        ajax({
            url: '/nccloud/uapbd/org/vatedit.do',
            data: {
                countrycode: value.refpk
            },
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        this.props.editTable.setValByKeyAndIndex('orgvatfunclet', record, 'countrycode', {
                                value: res.data,
                                display: res.data
                            })
                    }
                }
            }
        });
        return true;
    }
    onSaveOrgVAT = (btnopera) => {
        //去除空行
        this.props.editTable.filterEmptyRows('orgvatfunclet', ['pk_country']);
        let changedRows = this.props.editTable.getChangedRows('orgvatfunclet', false);
        if (changedRows && !this.props.editTable.checkRequired('orgvatfunclet', changedRows)) 
            return;
        var selectMember = this.state.getSelectListTreeData() || [];
        let pk_org = undefined;
        if(this.state.showMode == 'list'){
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        }
        let savedata = {
            pageid: pk_org,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        savedata.model.rows = changedRows;
        ajax({
            url: '/nccloud/uapbd/org/vatesave.do', data: savedata, //{data:data,opera:'year'},
            success: (res) => {
                if (res.success) {
                    this.VATbuttonToggleShow('vatsave');
                    this.props.editTable.setStatus('orgvatfunclet', 'browse');
                    if(res.data){
                        this.props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                    }else{
                        this.props.editTable.setTableData('orgvatfunclet',{rows: []});
                    }
                    if('vatdel' == btnopera){
                        toast({color: 'success', title: this.lang['10100ORG-000010']});/* 国际化处理： 删除成功！*/
                    }else{
                        toast({color: 'success', title: this.lang['10100ORG-000047']});/* 国际化处理： 保存成功！*/
                    }
                }
            }
        });
    }
    VATbuttonToggleShow(status) {
        if (status === 'vatadd' || status === 'vatedit') {
            this.props.button.setButtonVisible([
                    'vatadd', 'vatlinedel', 'vatsave', 'vatcancel'
                ], true);
            this.props.button.setButtonVisible([
                    'vatedit', 'vatdel','vatrefresh'
                ], false);
        } else {
            this.props.button.setButtonVisible([
                    'vatadd', 'vatdel', 'vatedit','vatrefresh'
                ], true);
            this.props.button.setButtonVisible([
                    'vatsave', 'vatcancel', 'vatlinedel'
                ], false);
        }
    }
//------------------------------------VAT维护按钮事件结束----------------------------------------------------------------

//------------------------------------内部客商按钮事件开始----------------------------------------------------------------
    afterInnercustEvent(props, moduleId, key, value, oldValue) {
        let meta = props.meta.getMeta();
        if(key == 'pk_org'){
            meta['innercustsupp'].items.map((obj) => {
                if (obj.attrcode == 'pk_org') {
                    //需要根据管控模式判断客商和供应商有没有对应的节点
                    ajax({
                        url: '/nccloud/uapbd/org/checknodeoperapower.do',
                        data: {
                            pk_org: value.value
                        },
                        success: (res) => {
                            if (res.success) {
                                //过滤客户基本分类
                                if (res.data) {
                                    toast({content: res.data, color: 'warning'});
                                }
                                meta['innercustsupp'].items.find((item) => item.attrcode == 'pk_custclass').queryCondition = () => {
                                    return {pk_org: value.value}
                                }
                                //过滤供应商档案
                                meta['innercustsupp'].items.find((item) => item.attrcode == 'pk_supplierclass').queryCondition = () => {
                                    return {pk_org: value.value}
                                }
                                props.meta.setMeta(meta);
                            }
                        }
                    });
                }
            })
        }
        
    }
    onSaveOrgInnercust = () => {
        let memberFlag = this.props.form.isCheckNow('innercustsupp');
        if (!memberFlag) {
            that.props.modal.show('innercustsupp');
            return;
        }
        var selectMember = this.state.getSelectListTreeData() || [];
        var countryzone = undefined ,pk_unitorg = undefined;
        if(this.state.showMode == 'list'){
            countryzone = selectMember[0].nodeData.org.values.countryzone.value;
            pk_unitorg = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            countryzone = this.props.form.getFormItemsValue('org', 'countryzone').value
            pk_unitorg = this.props.form.getFormItemsValue('org', 'pk_org').value
        }
        var pk_org = this.props.form.getFormItemsValue('innercustsupp', 'pk_org').value;
        var code = this.props.form.getFormItemsValue('innercustsupp', 'code').value;
        var custname = this.props.form.getFormItemsValue('innercustsupp', 'custname').value;
        var custshortname = this.props.form.getFormItemsValue('innercustsupp', 'custshortname').value;
        var pk_custclass = this.props.form.getFormItemsValue('innercustsupp', 'pk_custclass').value;
        var pk_supplierclass = this.props.form.getFormItemsValue('innercustsupp', 'pk_supplierclass').value;
        ajax({
            url: '/nccloud/uapbd/org/saveinnercust.do',
            data: {
                pk_org: pk_org,
                countryzone: countryzone,
                code: code,
                custname: custname,
                custshortname: custshortname,
                pk_custclass: pk_custclass,
                pk_supplierclass: pk_supplierclass,
                pk_unitorg: pk_unitorg,
                pk_orgarr:this.state.orgunit_pk_orgarr
            }, 
            success: (res) => {
                if (res.success) {
                    this.props.modal.close('innercustsupp');
                    this.props.form.setFormStatus('innercustsupp','browse');
                    toast({color: 'success', title: this.lang['10100ORG-000047']});/* 国际化处理： 保存成功！*/
                }
            }
        });
    }
//------------------------------------内部客商按钮事件结束----------------------------------------------------------------

//------------------------------------业务期初期间按钮事件开始----------------------------------------------------------------
    //业务期间按钮事件
    onOrgPeirodButtonClick(props, id) {
        var tableData = this.props.editTable.getAllData('orgmoduleperiod'), //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
            changetableData = this.props.editTable.getChangedRows('orgmoduleperiod'),
            rownum = this.props.editTable.getNumberOfRows('orgmoduleperiod'), //获取列表总行数
            flag = 0,data = {};
        switch (id) {
            case 'periodsave':
                this.checkPeriodDate(()=>{
                    this.onSaveOrgPeriod();
                })
                break;
            case 'batchempty':
                while (flag != rownum) {
                    this.props.editTable.setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                            value: '',
                            display: ''
                        });
                    flag = flag + 1;
                }
                break;
            case 'batchsetbeginyear':
                if (!tableData || tableData.length === 0) 
                    return
                data = {
                    pageid: 'beginyear',
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = tableData.rows;
                ajax({
                    url: '/nccloud/uapbd/org/batchsetyearperiod.do', data: data, //{data:data,opera:'year'},
                    success: (res) => {
                        if (res.success) {
                            if (res.data) {
                                while (flag != rownum) {
                                    if (res.data[flag] != null) {
                                        this.props.editTable.setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                                                value: res.data[flag],
                                                display: res.data[flag]
                                            });
                                    }
                                    flag = flag + 1;
                                }
                            }
                        }
                    }
                });
                this.props.editTable.setStatus('orgmoduleperiod', 'edit');
                break;
            case 'batchcurrentyear':
                if (!tableData || tableData.length === 0) 
                    return
                data = {
                    pageid: 'currentyear',
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = tableData.rows;
                ajax({
                    url: '/nccloud/uapbd/org/batchsetyearperiod.do', data: data, //{data:data,opera:'year'},
                    success: (res) => {
                        if (res.success) {
                            if (res.data) {
                                while (flag != rownum) {
                                    if (res.data[flag] != null) {
                                        this.props.editTable.setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                                                value: res.data[flag],
                                                display: res.data[flag]
                                            });
                                    }
                                    flag = flag + 1;
                                }
                            }
                        }
                    }
                });
                this.props.editTable.setStatus('orgmoduleperiod', 'edit');
                break;
        }
    }
    onPeriodBeforeEvent(props, moduleId, item, index, value, record) {
        // 业务期初期间，银行授信管理、银行存款管理、银行贷款管理、担保管理、
        // 信用证管理、商业汇票、资金调度、内部存款管理、内部贷款管理、票据集中管理、资金结算这几个模块对应的会计期间是日期，不是会计参照
        let meta = this .props.meta.getMeta();
        let moudleidnum = record.values.moduleid.value;
        //let arr = ['4510','4530','4532','3613','3614','3615','3616','3617','3618','3632','3634','3635','3637']
        let arr = ['4510','4530','4532','4534','4545','3614','3632','3634','3635','3613','3615','3616','3617','3630','3618','3637','3634','3635','3661','3662','3663','3665','3666','3667','3668','3680','3620'];
        var index = arr.indexOf(moudleidnum);
        if (index >= 0) {
            meta[moduleId].items.find(e => e.attrcode === 'pk_accperiod').itemtype = 'datetimepicker';
            meta[moduleId].items.find(e => e.attrcode === 'pk_accperiod').refcode = null;
            // 重要！下面那行一定要写
            this.props.renderItem('table', moduleId, 'pk_accperiod', null) // 前三个参数，根据模板json填对应值，moduleId是区域id
            this.props.meta.setMeta(meta)
        } else {
            ajax({
                url: '/nccloud/uapbd/org/setaccperiodscheme.do',
                data: {
                    pk_orgtype: record.values.pk_orgtype.display,
                    pk_org: record.values.pk_org.value,
                    moudleid: moudleidnum
                },
                success: (res) => {
                    if (res.success) {
                        if (res.data) {
                            item.queryCondition = function () {
                                return {"pk_accperiodscheme": res.data}
                            }
                        }
                    }
                }
            });
        }
        //编辑前事件必须范围true，不然不可以使用
        return true;
    }
    checkPeriodDate = (callback) =>{
        let tableData = this.props.editTable.getAllData('orgmoduleperiod'); 
        let arr = ['4510','4530','4532','4534','4545','3614','3632','3634','3635','3613','3615','3616','3617','3630','3618','3637','3634','3635','3661','3662','3663','3665','3666','3667','3668','3680','3620'];
        var flag = true ;
        var regyearmonthdate = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        var regExpyear = new RegExp(regyearmonthdate);
        var regyearmonth = /^[1-9]\d{3}-(0[1-9]|1[0-2])$/;
        var regExpmonth = new RegExp(regyearmonth);
        var newdata = tableData && tableData.rows.map((obj)=>{
            var index = arr.indexOf(obj.values.moduleid.value);
            if(index >= 0){
                //如果大于0说明这个应该是日期格式年月日，需要检查pk_accperiod的数据是否符合规范
                if(obj.values.pk_accperiod.value && isNaN(obj.values.pk_accperiod.value) && !regExpyear.test(obj.values.pk_accperiod.value)){
                    obj.values.pk_accperiod = {'display': '', 'value': ''}
                    flag = false;
                }
            }else{
                if(obj.values.pk_accperiod.value && isNaN(obj.values.pk_accperiod.value) && !regExpmonth.test(obj.values.pk_accperiod.value)){
                    obj.values.pk_accperiod = {'display': '', 'value': ''}
                    flag = false;
                }
            }
            return obj;
        })
        if(!flag){
            this.props.editTable.setTableData('orgmoduleperiod', {'areaType': "table",'areacode': null,'rows':newdata});
            toast({content: this.lang['10100ORG-000109'], color: 'warning'});/* 国际化处理： 期初期间格式不正确！*/
        }
        if(newdata && flag){
            callback && callback();
        }
    }
    onSaveOrgPeriod = () => {
        let pk_org = undefined;
        if(this.state.showMode == 'list'){
            var selectMember = this.state.getSelectListTreeData() || []
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        }
        let tableData = this.props.editTable.getAllData('orgmoduleperiod'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        let changetableData = this.props.editTable.getChangedRows('orgmoduleperiod');
        if (!changetableData || changetableData.length === 0) 
        return
        let data = {
            pageid: '10100ORG_orgmoduleperiod',
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = changetableData;
        ajax({
            url: '/nccloud/uapbd/org/saveperiod.do', data: data, //{data:data,opera:'year'},
            success: (res) => {
                if (res.success) {
                    ajax({
                        url: '/nccloud/uapbd/org/orgmoduleperiod.do',
                        data: {
                            pk_org: pk_org
                        },
                        success: (res) => {
                            if (res.success) {
                                if (res.data) {
                                    this.props.editTable.setTableData('orgmoduleperiod', res.data.orgmoduleperiod);
                                } else {
                                    this.props.editTable.setTableData('orgmoduleperiod', {rows: []});
                                }
                                this.props.editTable.setStatus('orgmoduleperiod', 'edit');
                            }
                        }
                    });
                    toast({color: 'success', title: this.lang['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            }
        });
    }
//------------------------------------业务期初期间按钮事件结束----------------------------------------------------------------

//------------------------------------组织主管按钮事件开始----------------------------------------------------------------
    //组织主管按钮点击事件
    onOrgManageButtonClick(props, id) {
        var selectMember = this.state.getSelectListTreeData() || [];
        //选中多行的时候，默认以第一个为当前选中行
        let pk_org = undefined;
        if(this.state.showMode == 'list'){
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        }
        let selectedData = this.props.editTable.getCheckedRows('orgmanager');
        let indexArr = [];
                selectedData.forEach((val) => {
                    indexArr.push(val.index);
                });
        switch (id) {
            case 'orgmanageadd':
                let num = this.props.editTable.getNumberOfRows('orgmanager'); //获取列表总行数
                this.props.editTable.addRow('orgmanager', num, true);
                this.props.editTable.setStatus('orgmanager', 'edit');
                this.orgManageButtonState(this.props, 'orgmanageadd');
                this.props.button.setMainButton('orgmanagesave', true);
                this.props.button.setMainButton('orgmanageadd', false);
                break;
            case 'orgmanagedel':
                
                if (selectedData.length == 0) {
                    toast({content: this.lang['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10100ORG-000099'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: this.lang['10100ORG-000009'],
                    /* 国际化处理： 确定要删除所选数据吗？*/
                    beSureBtnClick: () => {
                        this.props.editTable.deleteTableRowsByIndex('orgmanager', indexArr);
                        //过滤无效行
                        this.props.editTable.filterEmptyRows('orgmanager', ['cuserid']);
                        var tableData = this.props.editTable.getChangedRows('orgmanager'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                        if (!tableData || tableData.length === 0) 
                            return;
                        tableData.map((obj) => {
                            obj.values.pk_org.value = pk_org;
                        })
                        var savedata = {
                            pageid: '10100ORG_orgmanager',
                            model: {
                                areaType: "table",
                                pageinfo: null,
                                rows: []
                            }
                        };
                        savedata.model.rows = tableData;
                        ajax({
                            url: '/nccloud/uapbd/org/orgmanagesavequery.do',
                            data: savedata,
                            success: (res) => {
                                if (res.success) {
                                    //保存完设置为浏览态
                                    if (res.data) {
                                        this.props.editTable.setTableData('orgmanager', res.data.orgmanager);
                                    } else {
                                        this.props.editTable.setTableData('orgmanager', {rows: []});
                                    }
                                    this.orgManageButtonState(this.props, 'orgmanagedel');
                                    toast({title: this.lang['10100ORG-000010'], color: 'success'});/* 国际化处理： 删除成功！*/
                                }
                            }
                        });
                    }
                })
                break;
            case 'orgmanageedit':
                this.props.editTable.setStatus('orgmanager', 'edit');
                this.orgManageButtonState(this.props, 'orgmanageedit');
                this.props.button.setMainButton('orgmanagesave', true);
                this.props.button.setMainButton('orgmanageadd', false);
                break;
            case 'orgmanagelinedel':
                this.props.editTable.deleteTableRowsByIndex('orgmanager', indexArr);
                break;
            case 'orgmanagesave':
                this.onSaveOrgManager();
                this.props.button.setMainButton('orgmanagesave', false);
                this.props.button.setMainButton('orgmanageadd', true);
                break;
            case 'orgmanagecancel':
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: this.lang['10100ORG-000002'],
                    /* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: '/nccloud/uapbd/org/orgmanagerquery.do',
                            data: {
                                pk_org: pk_org
                            },
                            success: (res) => {
                                if (res.success) {              
                                    if (res.data) {
                                        this.props.editTable.setTableData('orgmanager', res.data.orgmanager);
                                    }
                                    this.props.editTable.cancelEdit('orgmanager');
                                    this.orgManageButtonState(this.props, 'orgmanagerefresh');
                                }
                            }
                        });
                        //保存完设置为浏览态
                        this.props.editTable.setStatus('orgmanager', 'browse');
                        this.props.button.setMainButton('orgmanagesave', false);
                        this.props.button.setMainButton('orgmanageadd', true);
                    }
                });break;
            case 'orgmanagerefresh':
                ajax({
                    url: '/nccloud/uapbd/org/orgmanagerquery.do',
                    data: {
                        pk_org: pk_org
                    },
                    success: (res) => {
                        if (res.success) {
                            if (res.data) {
                                this.props.editTable.setTableData('orgmanager', res.data.orgmanager);  
                            }
                            toast({title:this.lang['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                            this.orgManageButtonState(this.props, 'orgmanagerefresh');
                            this.props.button.setButtonDisabled(['orgmanagedel'], true);
                        }
                    }
                });
                //保存完设置为浏览态
                this.props.editTable.setStatus('orgmanager', 'browse');
                break;
        }
    }
    onTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index) {
        if (value.refpk) {
            ajax({
                url: '/nccloud/uapbd/org/userquery.do',
                data: {
                    cuserid: value.refpk
                },
                success: (res) => {
                    if (res.success) {
                        if (res.data) {
                            if (undefined != res.data.orgmanager.rows[0].values['username']) {
                                this.props.editTable.setValByKeyAndIndex('orgmanager', record, 'username', {value: res.data.orgmanager.rows[0].values.username.value});
                            }
                            if (undefined != res.data.orgmanager.rows[0].values['psncode']) {
                                this.props.editTable.setValByKeyAndIndex('orgmanager', record, 'psncode', {value: res.data.orgmanager.rows[0].values.psncode.value});
                            }
                            if (undefined != res.data.orgmanager.rows[0].values['psnname']) {
                                this.props.editTable.setValByKeyAndIndex('orgmanager', record, 'psnname', {value: res.data.orgmanager.rows[0].values.psnname.value});
                            }
                        }
                    }
                }
            });
        }
    }
    orgManageButtonState(props, status) {
        if (status === 'orgmanageadd' || status === 'orgmanageedit') {
            this.props.button.setButtonVisible([
                    'orgmanagesave', 'orgmanagecancel','orgmanageadd','orgmanagelinedel'
                ], true);
                this.props.button.setButtonVisible([
                    'orgmanageedit', 'orgmanagerefresh', 'orgmanagedel'
                ], false);
        } else {
            this.props.button.setButtonVisible([
                    'orgmanagesave', 'orgmanagecancel','orgmanagelinedel'
                ], false);
                this.props.button.setButtonVisible([
                    'orgmanageadd', 'orgmanageedit', 'orgmanagerefresh', 'orgmanagedel'
                ], true);
        }
    }
    onSaveOrgManager() {
        var selectMember = this.state.getSelectListTreeData() || [];
        let pk_org = undefined;
        if(this.state.showMode == 'list'){
            pk_org = selectMember[0].nodeData.org.values.pk_org.value;
        }else{
            pk_org = this.props.form.getFormItemsValue('org','pk_org').value;
        }
        this.props.editTable.filterEmptyRows('orgmanager', ['cuserid']);
        let tableData = this.props.editTable.getChangedRows('orgmanager'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        tableData.map((obj) => {
            obj.values.pk_org.value = pk_org;
        })
        if (!tableData || tableData.length === 0) {
            //保存完设置为浏览态
            this.props.editTable.setStatus('orgmanager', 'browse');
            this.orgManageButtonState(this.props, 'orgmanagesave');
            toast({title: this.lang['10100ORG-000047'], color: 'success'});/* 国际化处理： 保存成功！*/
            return;
        }
        let savedata = {
            pageid: '10100ORG_orgmanager',
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        savedata.model.rows = tableData;
        ajax({
            url: '/nccloud/uapbd/org/orgmanagesavequery.do',
            data: savedata,
            success: (res) => {
                if (res.success) {
                    //保存完设置为浏览态
                    if (res.data) {
                        this.props.editTable.setTableData('orgmanager', res.data.orgmanager);
                    } else {
                        this.props.editTable.setTableData('orgmanager', {rows: []});
                    }
                    this.props.editTable.setStatus('orgmanager', 'browse');
                    this.orgManageButtonState(this.props, 'orgmanagesave');
                    toast({title: this.lang['10100ORG-000047'], color: 'success'});/* 国际化处理： 保存成功！*/
                }
            }
        });
    }
//------------------------------------组织主管按钮事件结束----------------------------------------------------------------

//------------------------------------财务组织版本化按钮事件开始----------------------------------------------------------------
    //财务组织版本化
    onSaveFinanceVersion = () => {
        var memberFlag = this.props.form.isCheckNow('financeorg_v');
        if(!memberFlag){
            return;
        }
        //版本化的时候确认版本的是哪一个1：财务组织体系版本化 2：利润中心体系版本化 3：人力资源组织体系版本化4：行政组织体系版本化
        var{orgunit_versiontype }  = this.state; 
        var form = this.props.form.getAllFormValue('financeorg_v');
        ajax({
            url: '/nccloud/uapbd/org/savefinanceversion.do',
            data: {
                form,
                type: orgunit_versiontype
            },
            success: (res) => {
                if (res.success) {
                    if(this.state.showMode == 'list'){// 版本化之后刷新界面 修改了界面数据，需要重新加载数据
                        this.browseList();
                    }else{
                        this.browseCard(this.props.form.getFormItemsValue('org','pk_org').value);
                    }
                    if (1 == orgunit_versiontype) {
                        toast({title: this.lang['10100ORG-000043'], color: 'success'});/* 国际化处理： 财务组织版本化成功！*/
                    }
                    if (2 == orgunit_versiontype) {
                        toast({title: this.lang['10100ORG-000044'], color: 'success'});/* 国际化处理： 利润中心体系版本化成功！*/
                    }
                    if (3 == orgunit_versiontype) {
                        toast({title: this.lang['10100ORG-000045'], color: 'success'});/* 国际化处理： 人力资源组织体系版本化成功！*/
                    }
                    if (4 == orgunit_versiontype) {
                        toast({title: this.lang['10100ORG-000046'], color: 'success'});/* 国际化处理： 行政组织体系版本化成功！*/
                    }
                    this.props.modal.close('financeorg_v');
                }
            }
        })
    }

//------------------------------------财务组织版本化按钮事件结束----------------------------------------------------------------

//------------------------------------版本化按钮事件开始----------------------------------------------------------------
    onRowDoubleClick(record,index,props) {
        let config = {
            pk_vid: record.pk_vid.value,
            pk_org: record.pk_org.value,
            json:this.lang,
            props:this.props,
            templatedata:props.meta.getMeta() || undefined,
            pagecode: '10100ORG_orgcardversion',
            pageTitle:this.lang['10100ORG-000104'],
            appcode: '10100ORG',
            type: 'version',
        };
        this.props.modal.show('orgversion', {
                content: <Orgunitversion {...{config:config}}/>,
                userControl: false //自己控制什么时候关闭窗口
            })
    }
    onSaveVersion = () => {
        let formdata = this.props.form.getAllFormValue('org_v_head');
        ajax({
            url: '/nccloud/uapbd/org/saveorgversion.do',
            data: formdata,
            success: (res) => {
                if (res.success) {
                    if(this.state.showMode == 'list'){
                        this.browseList();
                    }else{
                        this.browseCard(this.props.form.getFormItemsValue('org','pk_org').value);
                    }
                    toast({title: this.lang['10100ORG-000042'], color: 'success'});/* 国际化处理： 版本化成功！*/
                }
            }
        })
    }
//------------------------------------版本化按钮事件结束----------------------------------------------------------------

//------------------------------------上面就是重新适配的代码----------------------------------------------------------------    
    render() {
        if(!this.lang)
            return '';
        let {cardTable,form,button,modal,cardPagination,table,editTable,search,DragWidthCom,syncTree,treeTableManyCol,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        const {createCardPagination} = cardPagination;
        let {createForm} = form;
        let {createCardTable} = cardTable;
        let {createButtonApp} = button;
        let {createModal} = modal;
        let {createSimpleTable} = table;
        let {createSyncTree} = syncTree;
        let {treeTableCol} = treeTableManyCol;
        let {NCCreateSearch} = search;
        let {createEditTable} = editTable;
        var renderMainCard = () => {
            var renderScrollLink = () =>{
                var allcomps = Object.values(this.state.card);
                var showComps = allcomps.filter( comp => comp.isshow());
                return showComps.map( comp =>{
                    var cfg = {
                        spy:true,
                        smooth:true,
                        duration:300,
                        offset:-100,
                        to: comp.areaname || 'less name'
                    };
                    return  <NCScrollLink {...cfg}><p>{comp.title || 'less title' }</p></NCScrollLink>
                });
            };
            return (
                <div className="nc-bill-list">
                    <NCAffix>
                        <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className="header-title-search-area" >
                            {createBillHeadInfo({
                            title:this.lang['10100ORG-000098'],
                            backBtnClick: this.browseList.bind(this),
                            showBackBtn:this.state.status,
                            initShowBackBtn:this.state.status}
                            )}
                            </div>
                            <div className="header-button-area">
                                {this.state.showMode != 'list' && createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    onButtonClick:(props, btncode) =>{
                                        this.onListBtnOperation( btncode, 'card');
                                    },
                                })}
                                {(this.state.status == false || this.props.form.getFormItemsValue('org','pk_org').value == null) ? '' : 
                                <div className='header-button-cardPagination'>
                                    {createCardPagination({
                                        handlePageInfoChange: (props,pk)=>{
                                            this.pageInfo(pk);
                                        },
                                        urlPkname:'pk_org',
                                        dataSource: this.props.config.datasource,
                                    })}
                                </div>}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <NCAnchor>{renderScrollLink()}</NCAnchor>
                    <NCScrollElement style={{marginBottom:'5px'}} name={'org'}>
                        <div className="nc-bill-form-area">
                            {createForm('org', {
                                expandArr:['orgtype'],
                                onBeforeEvent:this.beforeEvent.bind(this),
                                onAfterEvent: this.afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>
                </div>  
            );
        };
        var renderSubCard = () =>{
            var cardcfgs = Object.values(this.state.card);
            return cardcfgs.map( cfg => cfg.renderCardFramework());        
        };
        var renderList = () =>{
           // if(this.state.showMode != 'list')
           // return '';
            return (
                <div style = {{height:'100%',display:this.state.showMode != 'list'? 'none' : ''}}>
                    {/* 标题 title  <div className="nc-bill-header-area"></div>  */}
                    <NCDiv areaCode={NCDiv.config.HEADER} className = 'nc-bill-header-area'>
                        <div className="header-title-search-area">
							{createBillHeadInfo({
                            title:this.lang['10100ORG-000098'],
                            //backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                            showBackBtn:false,
                            initShowBackBtn:false}
							)}
                            <span className="showOff orgunit-customize-showOff" style={{marginLeft:20}}><NCCheckbox{...this.state.showoff}>{this.lang['10100ORG-000097']/* 国际化处理： 显示停用部门*/}</NCCheckbox></span>
                        </div>
                         {/* 按钮区  btn-group */}
                         <div className="header-button-area">
                                {this.state.showMode == 'list' && createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    buttonLimit: 3,
                                    onButtonClick: (props, btncode) =>{
                                        this.onListBtnOperation( btncode, 'list');
                                    },
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                    </NCDiv>
                    <div className="nc-bill-search-area">
                        {NCCreateSearch(this.state.search.id, this.state.search)}
                    </div>
                    <div className="nc-bill-tree-table">
                        <div className="nc-bill-table-area">
                            <div className="treeTableCol treeTableCol-style">
                                <NCDiv fieldid='orglist' areaCode={NCDiv.config.TableCom} className="version-head biaoge">
                                    <NCTable 
                                    bodyStyle={{minHeight:'400px',height:400}}
                                    {...this.state.treelist}/>
                                </NCDiv>
                            </div>
                        </div> 
                    </div>
                </div>
                    );
        };
        var renderCard = () =>{
            if(this.state.showMode != 'card') return '';
            return (
                <div  class='nc-bill-card'>
                    <div className="nc-bill-card orgunit-card">
                        {renderMainCard()}
                        {renderSubCard()}
                    </div>
                </div>
            );
        };
        const {bodyHei} = this.state;
        return (
            <div className={this.state.showMode == 'list'?'nc-bill-list':'nc-bill-card'}>
                {renderList()}
                {renderCard()}
                {createModal('org_v', {
                    title: this.lang['10100ORG-000056'],
                    /* 国际化处理： 版本化*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('org_v_head')}
                                    <div
                                        className="nc-singleTable-table-area"
                                        style={{
                                        marginTop: '10px'
                                    }}>
                                        {createSimpleTable('org_v', {
                                            onRowDoubleClick: (record,index,props)=>{
                                                this
                                                .onRowDoubleClick(record,index,props)
                                            },
                                            showIndex: true,
                                            adaptionHeight:false
                                        })}</div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this.onSaveVersion.bind(this)
                })}
                {createModal('financeorg_v', {
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('financeorg_v')}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    //className:'senior',
                    userControl: true, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    className:'senior',
                    beSureBtnClick: this
                        .onSaveFinanceVersion
                        .bind(this),
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.lang['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close('financeorg_v');
                            }
                        })
                    }
                })}
                {createModal('orgmanager', {
                    title: this.lang['10100ORG-000057'],
                    /* 国际化处理： 组织主管*/
                    className: 'zuzhi',
                    content: function () {
                        return (
                            <div>
                                <div style={{height: 45,marginTop: -15 }}>
                                    <div style={{position: 'relative',height: '100%'}}>
                                        <div className='orgmanager-button-parent'>
                                            {createButtonApp({
                                                area: 'orgmanager-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: (props, id)=>{
                                                    this.onOrgManageButtonClick(props, id)
                                                },
                                                popContainer: document.querySelector('.orgmanager-button-area')
                                            })}
                                        </div>
                                        <span fieldid='orgmanagetitle' className='orgmanager-button-text'>
                                            {this.lang['10100ORG-000088']/* 国际化处理： 所属组织*/}:{this.state.orgunit_name}
                                        </span>
                                    </div>
                                </div>
                                {createEditTable('orgmanager', {
                                    onAfterEvent: (props, moduleId, key, value, changedrows, record, index)=>{
                                        this.onTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index)
                                    },
                                    onSelected: () => {
                                        let data = this.props.editTable.getCheckedRows('orgmanager');
                                        if (data.length > 0) {
                                            this.props.button.setButtonDisabled(['orgmanagedel'], false);
                                        } else {
                                            this.props.button.setButtonDisabled(['orgmanagedel'], true);
                                        }
                                    },
                                    onSelectedAll: () => {
                                        let data = this.props.editTable.getCheckedRows('orgmanager');
                                        if (data.length > 0) {
                                            this.props.button.setButtonDisabled(['orgmanagedel'], false);
                                        } else {
                                            this.props.button.setButtonDisabled(['orgmanagedel'], true);
                                        }
                                    },
                                    showCheck: true,
                                    showIndex: true
                                })}
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.lang['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close('orgmanager');
                                this.props.editTable.setStatus('orgmanager', 'browse');
                            }
                        })
                    }
                })}
                {createModal('orgmoduleperiod', {
                    title: this.lang['10100ORG-000058'],
                    /* 国际化处理： 批量设置业务期初期间*/
                    className: 'piliang',
                    resizable: false,
                    content: function () {
                        return (
                            <div>
                                <div
                                    style={{
                                    height: 45,
                                    marginTop: -10
                                }}>
                                    <div
                                        style={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                        <div
                                            style={{
                                            position: 'absolute',
                                            height: '100%',
                                            right: 0,
                                            top: 5
                                        }}>
                                            {createButtonApp({
                                                area: 'period-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this
                                                    .onOrgPeirodButtonClick
                                                    .bind(this),
                                                popContainer: document.querySelector('.period-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {createEditTable('orgmoduleperiod', {
                                    adaptionHeight:true,
                                    inModal: true,
                                    otherAreaHeight: 45,
                                    // onCloseModel:this.onCloseTableModel.bind(this),
                                    // tableModelConfirm:this.onModelConfirm.bind(this),
                                    // onAfterEvent:this.onTableModelAfterEdit.bind(this), statusChange:
                                    // this.gridStatusChange.bind(this),
                                    // selectedChange:this.gridBeChecked.bind(this), showCheck:true,
                                    onBeforeEvent: (props, moduleId, item, index, value, record)=>{
                                        this.onPeriodBeforeEvent(props, moduleId, item, index, value, record);
                                    },
                                    showIndex: true
                                })}
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.lang['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close('orgmoduleperiod');
                                this.props.editTable.setStatus('orgmoduleperiod', 'browse');
                            }
                        })
                    },
                    beSureBtnClick: this.onSaveOrgPeriod.bind(this)
                })}
                {createModal('innercustsupp', {
                    title: this.lang['10100ORG-000059'],
                    /* 国际化处理： 生成内部客商*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('innercustsupp', {
                                        setVisibleByForm:true,
                                        onAfterEvent: (props, moduleId, key, value, oldValue)=>{
                                            this
                                            .afterInnercustEvent(props, moduleId, key, value, oldValue);
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    className: 'combine',
                    noFooter: false, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.lang['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close('innercustsupp');
                                this.props.form.setFormStatus('innercustsupp', 'browse');
                            }
                        })
                    },
                    beSureBtnClick: this.onSaveOrgInnercust.bind(this)
                })}
                {createModal('orgvatfunclet', {
                    title: this.lang['10100ORG-000060'],
                    /* 国际化处理： VAT维护*/
                    content: function () {
                        return (
                            <div>
                                <div
                                    style={{
                                    height: 45,
                                    marginTop: -10
                                }}>
                                    <div
                                        style={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                        <div
                                            style={{
                                            position: 'absolute',
                                            height: '100%',
                                            right: 0,
                                            top: 5
                                        }}>
                                            {createButtonApp({
                                                area: 'vat-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: (props, id)=>{
                                                    this
                                                    .onOrgVATButtonClick(props, id);
                                                },
                                                popContainer: document.querySelector('.vat-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {createEditTable('orgvatfunclet', {
                                    onAfterEvent: (props, moduleId, key, value, changedrows, record, index) =>{
                                        this.onVATTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index);
                                    },
                                    onSelected: () => {
                                        let checkdata = this.props.editTable.getCheckedRows('orgvatfunclet');
                                        if (checkdata.length > 0) {
                                            this.props.button.setButtonDisabled(['vatdel'], false);
                                            this.props.button.setButtonDisabled(['vatlinedel'], false);
                                        } else {
                                            this.props.button.setButtonDisabled(['vatdel'], true);
                                            this.props.button.setButtonDisabled(['vatlinedel'], true);
                                        }
                                    },
                                    onSelectedAll: () => {
                                        let checkdata = this.props.editTable.getCheckedRows('orgvatfunclet');
                                        if (checkdata.length > 0) {
                                            this.props.button.setButtonDisabled(['vatdel'], false);
                                            this.props.button.setButtonDisabled(['vatlinedel'], false);
                                        } else {
                                            this.props.button.setButtonDisabled(['vatdel'], true);
                                            this.props.button.setButtonDisabled(['vatlinedel'], true);
                                        }
                                    },
                                    showIndex: true,
                                    showCheck: true,
                                    isAddRow:false
                                })}
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    beSureBtnClick: this
                        .onSaveOrgVAT
                        .bind(this),
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.lang['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.lang['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close('orgvatfunclet');
                                this.props.editTable.setStatus('orgvatfunclet', 'browse');
                            }
                        })
                    }
                })}
                {createModal('orgdept', {
                    title: this.lang['10100ORG-000061'],
                    /* 国际化处理： 业务单元关联部门*/
                    className: '',
                    size:'lg',
                    content: function () {
                        return (
                            <div className="tree-table">
                                <DragWidthCom //业务单元树
                                    leftDom= { 
                                        <div className="tree-area-dept"> 
                                            {createSyncTree({ treeId:'orgunittree', showLine:true, // clickEditIconEveclickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调 //clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调 // clickAddIconEve: this.onAdd.bind(this), //新增点击 回调 
                                            onSelectEve: (data, item, isChange)=>{
                                                this.onSelectEve(data, item, isChange)
                                            }, //选择节点回调方法 
                                            defaultExpandAll:true, //初始化展开所有节点 ，默认参数为false,不展开 
                                            onMouseEnterEve:(key) => {
                                                this.onMouseEnterSortTreeEve(key);
                                            },//鼠标滑过节点事件
                                                showModal:false })} 
                                        </div> } //部门---树状表
                                    rightDom= { 
                                        <div className="treeTableCol"> 
                                            <NCDiv fieldid='dept' areaCode={NCDiv.config.TableCom} className="version-head"> 
                                            {/* treeTableCol( 'orgdept',{ async:false, //数据同步加载为false,异步加载为true //showCheckBox:true, //checkedType:'radio', 
                                                                defaultExpandAll:true, //初始化展开所有节点 ，默认参数为false,不展开 
                                                                } )*/ } 
                                                <NCTable {...this.state.depttreelist} scroll={{y: bodyHei }} bodyStyle={{minHeight: bodyHei}}/>
                                            </NCDiv> 
                                        </div> } 
                                        defLeftWid='35%' // 默认左侧区域宽度，px/百分百 
                                />
                            </div>
                        )
                    }.bind(this)(),
                    userControl: false, //自己控制什么时候关闭窗口
                })}
                {
                    this.state.showUploader &&
                    <NCUploader
                    billId = {
                        'uapbd/null/' + this.state.getpk(true)
                    }
                    //billNo={'001'} target={target}
                    placement = {
                        'bottom_right'
                    }
                    multiple = {
                        true
                    }
                    onHide = {
                        this.onHideUploader.bind(this)
                    }
                    />}

                    {this.state.showlogoUploader &&<NCUploader
                    billId = {
                        'logo/' + this.state.getpk(true)
                    }
                    //billNo={'001'} target={target}
                    placement = {
                        'bottom_right'
                    }
                    multiple = {
                        false
                    }
                    beforeUpload = {
                        this.beforeUpload.bind(this)
                    }
                    onHide = {
                        this.onHideUploader.bind(this)
                    }
                    //onHide={this.onHideUploader}
                    />
                }
                {createModal('setorgroot', {
                    title: this.lang['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.lang['10100ORG-000028'],
                    /* 国际化处理： 您确定要设置成根业务单元吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this.onSetUnitOrgRoot.bind(this)
                })}
                {createModal('setadminorgroot', {
                    title: this.lang['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.lang['10100ORG-000030'],
                    /* 国际化处理： 您确定要设置成根行政组织吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSetAdminOrgRoot
                        .bind(this)
                })}
                {createModal('setcorproot', {
                    title: this.lang['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.lang['10100ORG-000029'],
                    /* 国际化处理： 您确定要设置成根公司吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSetCorpRoot
                        .bind(this)
                })}
                <PrintOutput
                    ref='printOutput'
                    url='/nccloud/uapbd/org/print.do'
                    data={{
                        funcode:'10100ORG',      //功能节点编码，即模板编码
                        nodekey:this.state.showMode == 'card' ?'cardPrint':'listPrint',     //模板节点标识
                        oids: this.state.cacheData.allpks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                    >
                </PrintOutput>
                <ExcelImport 
                    {...Object.assign(this.props)}
                    moduleName = 'riaorg'//模块名
                    billType = {'10100org'}//单据类型
                    selectedPKS = {[]}
                    //selectedPKS = {this.state.selectedPKS}
                    //exportTreeUrl = {""}//自定义导出action接口(可不传)
                    appcode={'10100ORG'}          
                    pagecode={'10100ORG_orgunit'} 
                   // referVO={}//自定义传参参数
                />
                <div className='orgversion-table'>
                    {createModal('orgversion', {
                        noFooter: false, //是否需要底部按钮,默认true
                    })}
                </div>
                {createModal('delete')}
                {createModal('confirm')}
                {createModal('warning', {
                    title: this.lang['10100ORG-000062'],
                    /* 国际化处理： 关闭提醒*/
                    content: this.lang['10100ORG-000063'],
                    /* 国际化处理： 是否确定要关闭？*/
                })}
                { createModal('tip') }
            </div>
        )
    }
}
Orgunitpage = createPage({
    initTemplate:function(){}
})(Orgunitpage)
//ReactDOM.render(<Orgunitpage/>, document.querySelector('#app'));
export default Orgunitpage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65