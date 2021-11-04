//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high, toast,print,promptBox,getBusinessInfo,getMultiLang,createPageIcon,excelImportconfig } from 'nc-lightapp-front';
//import  deepClone from '../../deepClone.js';
let { NCMessage,NCPopconfirm } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu:Menu, NCButton:Button, NCTabs:Tabs,EmptyAreaTip } = base;
const {PrintOutput, ExcelImport} = high;
const {NCDiv} = base;
import  Utils from '../../../public/utils'
//业务单元参照
import BusinessUnitTreeRef from  '../../../../uapbd/refer/org/BusinessUnitTreeRef'

const {TabPane} = Tabs;
const searchid = '10140UDDDBQ';
const tableid = 'currtype';
const pagecode = '10140MCLG';
const treeId = 'materialtypetreeid';
const isShowOffEnable = true;			//是否启用“显示停用”功能

const formBaseId = "head";//物料基本分类表单id
const formExtendId = "formExtendId";//扩展信息表单id
const urls = {
    save : '/nccloud/uapbd/materialtype/save.do',
    print : '/nccloud/uapbd/materialtype/print.do',
	query : '/nccloud/uapbd/materialtype/query.do',
    queryTemplet : '/nccloud/platform/templet/querypage.do',
    marasstframeUrl:"/nccloud/uapbd/marasstframe/query.do",
    enablestateUrl:"/nccloud/uapbd/materialtype/disenable.do",
    editCheckUrl:"/nccloud/uapbd/materialtype/editcheck.do",
    delCheckUrl:"/nccloud/uapbd/materialtype/delcheck.do",
    queryDefaultCodeRule:"/nccloud/uapbd/materialtype/queryDefaultCodeRule.do"
};

//获取并初始化模板
// let initTemplate = (props) => {console.log("class_base.inittemplate...");
// 	ajax({
// 		url: urls['queryTemplet'],
// 		data: {
// 			pagecode: pagecode		//pagecode,在生成的json模板获取
// 		},
// 		success: function(res) {
// 			let meta = res.data;
// 			// meta = modifierMeta(props,meta);
// 			props.meta.setMeta(meta);
// 		}
// 	});
// }

/**
 * 更新元数据 设置参照
 * @param meta
 * @param props
 * @returns {*}
 */
/*function modifierMeta(meta,props) {
    props.renderItem('form',formBaseId,'pk_marasstframe',refer('pk_marasstframe'));
    // props.renderItem('form',formId,'pk_group',refer('pk_group'));
    return meta;

}*/

class MaterialClass extends Component{
    constructor(props){
        super(props);
        this.config =Object.assign({},props.config);
        //显示停用复选框的状态标志
        this.state = {
            cardEmpty:true,
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            method: null,//记录当前的操作，add=新增，edit=修改
            configs: {},
            curOrg: null,
            curOrgObj: null,
            isShowOff: false,
            disabledSearch: false,
            disabledShowoff:false,
            disabledOrg: false,
            json: {}
        };
        this.printPks = [];
        this.pk_groupObj = null;
        this.getDefalutCodeRule(null,()=>{
            /* if(props.config.nodetype === 'org'){
                this.setState({disabledShowoff:true});    
            } */
            this.initTemplate(props);
            this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
    
            //默认业务单元设置
            setTimeout(()=>{
                if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
                    this.state.configs['BusinessUnitTreeRef']={value:{refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name}};
                    this.state.curOrgObj = {refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name};
                    this.state.curOrg = this.props.config.defaultOrg.pk_org;
                    this.setState(this.state);
                    this.loadTree();
                }
            },10);
        });
        
    }
    //参照回写方法
    createCfg(id,param){
        // console.log('createCfg');
        // console.log(id);
        // console.log(param);
        var obj={
            value:this.state.configs[id]?this.state.configs[id].value:[],
            // value:{refpk: "0001A21000000001H4UY",refname: "t003"},
            onChange: (val) => {
                if(val && val.refpk){
                    this.setState({cardEmpty:false})
                } else {
                    this.setState({cardEmpty:true})
                }
                this.getDefalutCodeRule(val.refpk,()=>{
                    this.state.curOrgObj = val;
                    this.state.curOrg = val.refpk;
                    this.props.form.EmptyAllFormValue(formBaseId);//清空表单
                    this.props.form.setFormItemsValue(formBaseId,{'code':{value:'',display:this.state.codeRule}});
                    var temp= Object.assign(this.state.configs[id],{value:val});
                    this.setState(Object.assign (this.state.configs,temp));
                    if(val == null || val.refpk == null || val.refpk.length < 1){
                        this.props.button.setDisabled({
                            print:true,
                            output:true,
                            refresh:true
                        });
                        this.setState({disabledShowoff:true});
                        // this.props.syncTree.setSyncTreeData(treeId , this.dealTreeData(data));
                    }else{
                        this.props.button.setDisabled({
                            print:false,
                            output:false,
                            refresh:false
                        });
                        this.setState({disabledShowoff:false});
                        this.loadTree();//重新加载树
                    }
                });
                
            }
        }
        this.state.configs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }

    /**
     * 新增方法，获取编码规则显示内容
     */
    getDefalutCodeRule =(pk_org,callback)=>{
        if(!pk_org && this.props.config.nodetype === 'org') {
            this.state.codeRule = '';
            this.state.disabledShowoff = true;
            setTimeout(() => {
                this.setState(this.state,()=>{
                    callback && callback();
                });
            }, 0);
        }else{
            ajax({
                url: urls['queryDefaultCodeRule'],
                data: {
                    pk_org: pk_org
                },
                success: (res) => {
                    let {data} = res;
                    var codeRule;
                    if(data && data.codeRule){
                        this.state.codeRule = data.codeRule;
                    }
                    this.setState(this.state,()=>{
                        let meta = this.props.meta.getMeta();
                        if(meta && meta[this.props.config.formId] && meta[this.props.config.formId].items){
                            meta[this.props.config.formId].items.forEach(item=>{
                                if(item.attrcode === 'code'){//启用状态
                                    item.placeholder = this.state.codeRule;
                                }
                            });
                        }
                        this.props.meta.setMeta(meta);
                        callback && callback();
                    })
                }
            });
        }
    }

    componentDidMount(){
        console.log('componentDidMount');
        console.log(this.props.button.getButtons());
        
        this.props.button.setButtonVisible('save',false);
        this.props.button.setButtonVisible('cancel',false);
        //if(this.props.config.nodetype === 'org'){
        this.props.button.setDisabled({
                print:true,
                output:true
            });
        // }
        console.log(this.props.config);
        let defaultOrg = this.props.config.defaultOrg;
        if(defaultOrg.pk_org != null && defaultOrg.pk_org.length > 0){

        }
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
            this.root = {
                "isleaf": false,
                "key":"root",
                "title":this.state.json[this.props.config.nodeName],
                "id":"root",
                "innercode":"root",
                "pid": "",
                "refname": this.state.json[this.props.config.nodeName],
                "refpk": "root"
            };
            this.loadTree();
        }
        getMultiLang({moduleId: '10140MCLG',domainName: 'uapbd',callback});
        // console.log('componentWillMount');
    }
    /**
 * 单据模板
 * @param props
 */
initTemplate = (props)=>{
    let _that = this;
    //页面初始设置button状态
    const initButtonStatus=(props)=>{console.log('class_grp.initButtonStatus');
        //设置保存按钮不显示
        props.button.setButtonVisible('save',false);
        //设置取消按钮不显示
        props.button.setButtonVisible('cancel',false);
        //设置保存新增按钮不显示
        props.button.setButtonVisible('saveAdd',false);
    }

    props.createUIDom(
        {
            pagecode:props.config.pageCode,
            // appid:config.appid,
            // appcode:config.pageCode
        },
        (data)=>{
            if(data.template){
                let meta = data.template;
                ajax({
                    url: '/nccloud/uapbd/material/queryMarAssistant.do',
                    data: null,
                    success: function(res) {
                        if(res&&res.data&&res.data.MarAssistant){
                            meta['marasstframe'].items.forEach((item,index) => {
                                (res.data.MarAssistant).forEach((item1,index1) => {
                                    if(item.attrcode === ('marasst'+item1.propindex)){
                                        meta['marasstframe'].items[index].visible=true;
                                        meta['marasstframe'].items[index].label=res.data.MarAssistant[index1].showname;
                                    }
                                })
                            });
                        }
                        _that.modifierMeta(props, meta);
				        props.meta.setMeta(meta,()=>{
                        props.form.setFormItemsValue("head",{'code':{value:'',display:_that.state.codeRule}});/* 国际化处理： 编码规则：XX-XX-XX-XXXX*/
                });
                    }
                })
				
            }
            if (data.button) {
                props.button.setButtons(data.button);
                let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.appcode,pagecode: props.config.pageCode},()=>{
                    this.loadTree('import');
                    this.props.form.EmptyAllFormValue(formBaseId);
                });
                props.button.setUploadConfig("import",excelimportconfig);
                props.button.setButtons(data.button);
                initButtonStatus(props);
            }
            props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
            //默认业务单元设置
            setTimeout(()=>{
                console.log('set default unit');
                console.log(this.props.config);
                if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
                    this.state.configs['BusinessUnitTreeRef']={value:{refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name}};
                    this.state.curOrgObj = {refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name};
                    this.state.curOrg = this.props.config.defaultOrg.pk_org;
                    this.setState(this.state);
                    this.loadTree();
                }
            },10);
        }
    );
}

modifierMeta = (props, meta) => {
    // 修改参照refcode
    let formItems = meta[props.config.formId].items;
    for(let i = 0; i < formItems.length; i++){
        if(formItems[i].attrcode === 'code'){//启用状态
            formItems[i].placeholder = this.state.json['10140MCLG-000000'];//所属组织/* 国际化处理： 编码规则：XX-XX-XX-XXXX*/

        }
        if(formItems[i].attrcode === 'enablestate'){//启用状态
            formItems[i].disabled = true;//所属组织
        }
    }

    let frameItems = meta['marasstframe'].items;
    for(let i = 0; i < frameItems.length; i++){
        if(frameItems[i].attrcode === 'pk_marasstframe'){//辅助属性结构
            frameItems[i].refcode = '../../../../uapbd/refer/material/MarAsstFrameGridRef/index.js';//所属组织
        }
    }
}
    setDefaultValue = () =>{
        this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:true,display:this.state.json['10140MCLG-000001']}});/* 国际化处理： 已启用*/
        //this.props.form.setFormItemsValue(formBaseId,{'coderule':{value:'2',display:'XX-XX-XX-XX'}});
    }
    setFormGroupValue(){
        let businessInfo = getBusinessInfo();
        if(this.props.config.nodetype === 'group'){
            this.props.form.setFormItemsValue(formBaseId,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
        }else{
            this.props.form.setFormItemsValue(formBaseId,{'pk_org':{value:this.state.curOrgObj.refpk,display:this.state.curOrgObj.refname}});
        }
        // console.log('setFormGroupValue');console.log(this.pk_groupObj);
        // if(this.pk_groupObj == null){
        //     ajax({
        //         url: '/nccloud/uapbd/supplierapply/queryGroupAction.do',
        //         success: function(res) {
        //             console.log(res);
        //             this.pk_groupObj = {value:res.data.value,display:res.data.display};
        //             this.props.form.setFormItemsValue(formBaseId,{'pk_org':res.data});
        //         }.bind(this)
        //     });
        // }else{
        //     this.props.form.setFormItemsValue(formBaseId,{'pk_org':{value:this.pk_groupObj.value,display:this.pk_groupObj.display}});
        // }
    } 
    //加载辅助属性结构
    loadMarAsstFrame(pk){
        let _that = this;
        if(pk != null && pk.length > 0){
            ajax({
                url: urls['marasstframeUrl'],
                data: {
                    pk: pk		//所点击数的pk_marbasclass
                },
                success: function(res) {
                    // 特征码	项目	供应商	生产商	客户
                    // FIX100	FIX2	FIX3	FIX4	FIX5
                    let frameValues = {
                        'marasst0':{value:res.data.fix1,display:res.data.fix1},//库存状态
                        'marasst1':{value:res.data.fix2,display:res.data.fix2},//项目
                        'marasst2':{value:res.data.fix3,display:res.data.fix3},//供应商
                        'marasst3':{value:res.data.fix4,display:res.data.fix4},//生产商
                        'marasst4':{value:res.data.fix5,display:res.data.fix5},//客户
                        'marasst5':{value:res.data.fix100,display:res.data.fix100},//特征码
                        'marasst6':{value:false,display:false},//自由辅助属性6
                        'marasst7':{value:false,display:false},//自由辅助属性7
                        'marasst8':{value:false,display:false},//自由辅助属性8
                        'marasst9':{value:false,display:false},//自由辅助属性9
                        'marasst10':{value:false,display:false},//自由辅助属性10
                        'marasst11':{value:false,display:false},//自由辅助属性11
                        'marasst12':{value:false,display:false},//自由辅助属性12
                        'marasst13':{value:false,display:false},//自由辅助属性13
                        'marasst14':{value:false,display:false},//自由辅助属性14
                        'marasst15':{value:false,display:false},//自由辅助属性15
                    };
                    ajax({
                        url: '/nccloud/uapbd/material/queryMarAssistantByFrameID.do',
                        data : {FrameID : pk},
                        success: function(res) {
                            if(res&&res.data){
                                res.data.assistant.forEach((item,index) => {
                                    if(item.code==6){
                                        frameValues['marasst6'].value=true;
                                        frameValues['marasst6'].display=true;
                                    }
                                    if(item.code==7){
                                        frameValues['marasst7'].value=true;
                                        frameValues['marasst7'].display=true;
                                    }
                                    if(item.code==8){
                                        frameValues['marasst8'].value=true;
                                        frameValues['marasst8'].display=true;
                                    }
                                    if(item.code==9){
                                        frameValues['marasst9'].value=true;
                                        frameValues['marasst9'].display=true;
                                    }
                                    if(item.code==10){
                                        frameValues['marasst10'].value=true;
                                        frameValues['marasst10'].display=true;
                                    }
                                    if(item.code==11){
                                        frameValues['marasst11'].value=true;
                                        frameValues['marasst11'].display=true;
                                    }
                                    if(item.code==12){
                                        frameValues['marasst12'].value=true;
                                        frameValues['marasst12'].display=true;
                                    }
                                    if(item.code==13){
                                        frameValues['marasst13'].value=true;
                                        frameValues['marasst13'].display=true;
                                    }
                                    if(item.code==14){
                                        frameValues['marasst14'].value=true;
                                        frameValues['marasst14'].display=true;
                                    }
                                    if(item.code==15){
                                        frameValues['marasst15'].value=true;
                                        frameValues['marasst15'].display=true;
                                    }
                                })
                            }
                            //设置表单为所选树节点数据
                            _that.props.form.setFormItemsValue('head',frameValues);
                        }
                    })
                    
                    this.props.form.setFormItemsValue('head',{'pk_marasstframe':{value:res.data.pk_marasstframe,display:res.data.name}});
                }.bind(this)
            });
        }else{
            let frameValues = {
                'marasst0':{value:false,display:false},//库存状态
                'marasst1':{value:false,display:false},//项目
                'marasst2':{value:false,display:false},//供应商
                'marasst3':{value:false,display:false},//生产商
                'marasst4':{value:false,display:false},//客户
                'marasst5':{value:false,display:false},//特征码
            };

            //设置表单为所选树节点数据
            this.props.form.setFormItemsValue('head',frameValues);
        }
    }
    //点击树
    onTreeSelect(refpk){//console.log('onTreeSelect');console.log(refpk);
        this.state.curSelectedNode = refpk;console.log(this.props.config);
        if(refpk == 'root'){
            this.props.button.setDisabled({
                print:true,
                output:true
            });
            //清空表单
            this.props.form.EmptyAllFormValue(formBaseId);
            //禁用停启用
            this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
            return;
        }
        this.props.button.setDisabled({
            print:false,
            output:false
        });
        ajax({
            url: urls['query'],
            data: {
                pk_marbasclass: refpk,		//所点击数的pk_marbasclass
                template: this.props.config.pageCode //用于后端区分是集团模板还是业务单元模板
            },
            success: function(res) {console.log(this.state.json['10140MCLG-000003']);console.log(res);/* 国际化处理： onTreeSelect返回*/
                //meta = modifierMeta(props,meta);
                console.log(res.data);
                //表单数据
                let headData = res.data.head.rows[0].values;
                //清空表单
                this.props.form.EmptyAllFormValue(formBaseId);
                //设置表单为所选树节点数据
                this.props.form.setAllFormValue({'head':res.data.head});
                this.loadMarAsstFrame(res.data.head.rows[0].values.pk_marasstframe.value)//加载辅助属性结构详情
                let l_enablestate = false;
                if(res.data.head.rows[0].values.enablestate.value == '2'){//已启用
                    l_enablestate = true;
                }else{//未启用、已停用
                    l_enablestate = false;
                }
                this.props.form.setFormItemsValue('head',{enablestate:{value:l_enablestate}});
                // this.props.form.setFormItemsValue(formBaseId,{'coderule':{value:'2',display:'XX-XX-XX-XX'}});
                let l_formstatus = this.props.form.getFormStatus(formBaseId);
                if(l_formstatus == 'edit' || l_formstatus == 'add'){
                    this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                }else{
                    this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
                }
                this.changeEnablestate();
                //设置表单项enablestate可用
                // this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
            }.bind(this)
        });
    }
    
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    getTreePk(p_treeObj){
        let pks = [];
        for(let i = 0; i < p_treeObj.length; i++){
            pks.push(p_treeObj[i].refpk);
            let children = p_treeObj[i].children;
            if(children != null && children.length > 0){
                pks = pks.concat(this.getTreePk(children));
            }
        }
        return pks;
    }

    loadTree(flag){console.log(this.state.isShowOff);
        if(this.props.config.nodetype === 'org'){
            if((this.state.curOrg == null || this.state.curOrg.length < 1)
                && (this.state.curOrg == null || this.state.curOrg.length < 1)
            ){
                // 原先这儿return，导致未选择业务单元是左侧空白，此处修正一下
                let data = [Object.assign({ ...this.root }, { children: [] })];
                this.props.syncTree.setSyncTreeData(treeId , this.dealTreeData(data));
                return;
            }
        }
        let requestParam = {
            checked:false,
            nodeType: this.props.config.nodetype,
            curOrg: this.state.curOrg,
            showOfff:this.state.isShowOff
        };
        ajax({
            url:"/nccloud/uapbd/materialtype/tree.do",
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    if(result.data != null && result.data.length > 0){
                        // for(let i = 0; i < result.data.length; i++){
                        //     this.printPks.push(result.data[i].refpk);
                        // }
                        this.printPks = this.getTreePk(result.data);
                    }
                    console.log('treedata');
                    console.log(result.data);
                    if (this.props.config.nodetype !== "org"){
                        if (result.data && result.data.length && result.data.length > 0){
                            this.setState({cardEmpty:false})
                        } else {
                            this.setState({cardEmpty:true})
                        }
                    }                    
                    var data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.id);
                    if(data[0].children && data[0].children.length>0){
                        this.props.syncTree.setNodeSelected(treeId,data[0].children[0].refpk);
                        this.onTreeSelect(data[0].children[0].refpk);
                    }
                }
                if(flag == 'refresh'){
                    toast({title:this.state.json['10140MCLG-000004'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
            }
        })
    }

    changeEnablestate = ()=>{
        setTimeout(()=>{
            let formStatus = this.props.form.getFormStatus(formBaseId);
            let formData = this.props.form.getAllFormValue(formBaseId);//获得表单信息
            if(formStatus == 'add' || formStatus == 'edit'){//编辑态转数字
                if(formData.rows[0].values.enablestate.value == true || formData.rows[0].values.enablestate.value == '2'){
                    // formData.rows[0].values.enablestate.value = '2';
                    this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:'2'}});
                }else{
                    // formData.rows[0].values.enablestate.value = '3';
                    this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:'3'}});
                }
            }else{//浏览态转boolean
                if(formData.rows[0].values.enablestate.value == '2' || formData.rows[0].values.enablestate.value == true){
                    formData.rows[0].values.enablestate.value = true;
                    this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:true}});
                }else{
                    formData.rows[0].values.enablestate.value = false;
                    this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:false}});
                }
            }
            console.log(formData.rows[0].values.enablestate.value);
        },100);
    }
    //校验公式
    execValidateFormular = (callback) =>{
        let formData = this.props.form.getAllFormValue(formBaseId);
        console.log(formData);
        let validateData = {
            pageid: this.props.config.pageCode,
            model: {
                areacode: 'head',
                areaType: "form",
                pageinfo: null,
                rows: formData.rows
            }
        };
        let tableTypeObj = {[formBaseId]:'form'};
        let billType = 'form';
        this.props.validateToSave( validateData , ()=>{
            console.log('校验公式执行返回成功');
            setTimeout(()=>{callback();},100);
        } , tableTypeObj , billType );
    }
    //保存数据
    saveData(){
        console.log("saveData");
        console.log(this);
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
        let parentCode = selectedTreeNode.innercode;
        // if(!selectedTreeNode){
        //     selectedTreeNode = this.state.curSelectedNode;
        // }
        console.log("selectedTreeNode--");
        console.log(selectedTreeNode);

        let pk_parent = null;
        if(selectedTreeNode != null){
            pk_parent = selectedTreeNode.id;
        }else{
            pk_parent = 'root';
        }
        let requestParam= {};
        console.log("保存前切换enablestate");
        this.changeEnablestate();
        let formData = this.props.form.getAllFormValue(formBaseId);//获得表单信息
        formData.areacode = formBaseId;//添加表单的areacode编码
        
        if(this.state.method == 'del'){
            if(formData.rows[0].values.enablestate.value == true || formData.rows[0].values.enablestate.value == '2'){
                //this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:'2'}});
                formData.rows[0].values.enablestate.value = '2';
            }else{
                //this.props.form.setFormItemsValue(formBaseId,{enablestate:{value:'3'}});
                formData.rows[0].values.enablestate.value = '3';
            }
        }
        if(this.state.method == 'add' || this.state.method == 'saveAdd'){
            formData.rows[0].values.enablestate.value == true;
            formData.rows[0].status = '2';//设置新增状态
            formData.rows[0].values.pk_parent = {value:pk_parent};
        }else if(this.state.method == 'edit'){
            formData.rows[0].status = '1';//设置更新状态
        }else if(this.state.method == 'del'){
            formData.rows[0].status = '3';//设置更新状态
            formData.rows[0].values.pk_marbasclass = {value:selectedTreeNode.refpk};
        }

        //启用禁用状态
        /*if(formData.rows[0].values.enablestate.value == true){
            formData.rows[0].values.enablestate.value = '2';
        }else{
            formData.rows[0].values.enablestate.value = '3';
        }*/

        if(this.state.method == 'add' || this.state.method == 'saveAdd' || this.state.method == 'edit'){

            if(!this.props.form.isCheckNow(formBaseId)){
                return;
            }
            /*if(formData.rows[0].values.code.value == null || formData.rows[0].values.code.value.length < 1){
                toast({content:this.state.json['10140MCLG-000005'],color:'warning'});/!* 国际化处理： 下列字段不能为空：[物料节本分类编码]*!/
                return;
            }
            if(formData.rows[0].values.name.value == null || formData.rows[0].values.name.value.length < 1){
                toast({content:this.state.json['10140MCLG-000006'],color:'warning'});/!* 国际化处理： 下列字段不能为空：[物料节本分类名称]*!/
                return;
            }*/
        }

        console.log("formData");console.log('this.state.method='+this.state.method);
        console.log(formData);
        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.props.config.pagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType: this.props.config.nodetype,
            curOrg: this.state.curOrg == null? '':this.state.curOrg,
            template: this.props.config.pageCode //用于后端区分是集团模板还是业务单元模板
        };
        //ajax请求
        ajax({
            url: urls.save,
            data: requestParam,
            success: (result) => {
                if(result.success){
                    console.log("saveData--success");console.log(this.props);console.log(result);
                    //设置表单浏览态
                    this.props.form.setFormStatus(formBaseId, 'browse');
                    this.changeEnablestate();
                    this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
                    //设置树可用
                    this.props.syncTree.setNodeDisable(treeId,false);console.log(1);
                    if(!result.data.tree[0].children || result.data.tree[0].children.length == 0 ){
                        delete result.data.tree[0].children;
                    }console.log(2);
                    if(this.state.method == 'add'){
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(treeId,result.data.tree[0]);
                        this.props.syncTree.setNodeSelected(treeId, result.data.tree[0].refpk);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({'head':result.data.form.head});
                        this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:true}});
                        this.printPks.push(result.data.tree[0].refpk);
                        toast({ title: this.state.json['10140MCLG-000007'], color: 'success' });/* 国际化处理： 保存成功！*/
                    }else if(this.state.method == 'saveAdd'){
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(treeId,result.data.tree[0]);
                        //this.props.syncTree.setNodeSelected(treeId, result.data.tree[0].refpk);
                        this.props.form.EmptyAllFormValue(formBaseId);
                        this.props.form.setFormStatus(formBaseId, 'edit');
                        this.changeEnablestate();
                        this.changeButtonStatus('add');
                        this.setFormGroupValue();
                        this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:true}});
                        this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                        this.state.method = 'add';
                        this.printPks.push(result.data.tree[0].refpk);
                        if(selectedTreeNode != null && selectedTreeNode.refpk != 'root'){
                            this.props.form.setFormItemsValue(formBaseId,{'code':{value:parentCode}});
                        }
                        toast({ title: this.state.json['10140MCLG-000007'], color: 'success' });/* 国际化处理： 保存成功！*/
                        return;
                    }else if(this.state.method == 'del'){
                        //修改回调后修改
                        this.props.syncTree.delNodeSuceess(treeId,result.data.tree[0].id);
                        this.props.form.EmptyAllFormValue(formBaseId);
                        toast({ title: this.state.json['10140MCLG-000008'], color: 'success' });/* 国际化处理： 删除成功！*/
                    }else if(this.state.method == 'edit'){console.log(3);
                        //修改回调后修改
                        this.props.syncTree.editNodeSuccess(treeId,result.data.tree[0]);console.log(4);
                        //设置表单为最新值
                        this.props.form.setAllFormValue({"head":result.data.form.head});console.log(5);
                        //启用状态
                        let l_enablestate = false;
                        if(result.data.form.head.rows[0].values.enablestate.value == '2'){//已启用
                            l_enablestate = true;
                        }else{//未启用、已停用
                            l_enablestate = false;
                        }
                        this.props.form.setFormItemsValue('head',{enablestate:{value:l_enablestate}});
                        toast({ title: this.state.json['10140MCLG-000007'], color: 'success' });/* 国际化处理： 保存成功！*/
                    }
                    //展开树节点
                    // this.props.syncTree.openNodeByPk(treeId, result.data[0].pid);

                    // this.props.syncTree.setNodeSelected(treeId, result.data[0].refpk);
                    // //设置表单项可用
                    // this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
                    //清空自定已选中项
                    // this.setState({curSelectedNode:null});
                    // this.state.curSelectedNode
                    this.changeButtonStatus('cancel');
                    window.onbeforeunload = null;
                }

            }
        });
        this.changeButtonStatus('save');
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(id){
        let status = this.props.getUrlParam('status');console.log(status);
        console.log(this.props.syncTree);
        if(status === 'browse'){
            this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
            this.props.button.setButtonVisible('print',true);
        }else{
            this.props.button.setButtonVisible('print',false);
        }
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
        switch(id){
            case 'saveAdd':
                //this.props.button.setButtonVisible('add',false);
                //this.props.button.setButtonVisible('edit',false);
                //this.props.button.setButtonVisible('del',false);
                // this.props.button.setButtonVisible('stop',false);
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveAdd',true);
                // this.props.button.setButtonVisible('saveAdd',true);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible('export',false);
                this.props.button.setButtonVisible('import',false);
                this.props.button.setDisabled({
                    save:false,
                    // saveAdd:false,
                    cancel:false
                });
                //设置树不可用
                // this.props.syncTree.setNodeDisable(this.config.treeId,true);
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, true);
                break;
            case 'add':
                this.props.button.setButtonVisible('add',false);
                this.props.button.setButtonVisible('edit',false);
                this.props.button.setButtonVisible('del',false);
                this.props.button.setButtonVisible('refresh',false);
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveAdd',true);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible('print',false);
                this.props.button.setButtonVisible('export',false);
                this.props.button.setButtonVisible('import',false);
                // this.props.button.setDisabled({
                //     save:false,
                //     cancel:false
                // });
                //设置树不可用
                this.props.syncTree.setNodeDisable(treeId,true);
                this.setState({disabledSearch:true});
                this.setState({disabledOrg:true});
                this.setState({disabledShowoff:true});
                break;
            case 'edit':
                this.props.button.setButtonVisible('add',false);
                this.props.button.setButtonVisible('edit',false);
                this.props.button.setButtonVisible('del',false);
                this.props.button.setButtonVisible('refresh',false);
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible('print',false);
                this.props.button.setButtonVisible('export',false);
                this.props.button.setButtonVisible('import',false);
                // this.props.button.setDisabled({
                //     save:false,
                //     cancel:false
                // });
                //设置树不可用
                this.props.syncTree.setNodeDisable(treeId,true);
                this.setState({disabledSearch:true});
                this.setState({disabledOrg:true});
                this.setState({disabledShowoff:true});
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, true);
                break;
            case 'del':
                // this.props.button.setButtonVisible('add',true);
                // this.props.button.setButtonVisible('edit',true);
                // this.props.button.setButtonVisible('del',true);
                //this.props.button.setButtonVisible('stop',true);
                this.props.button.setButtonVisible('save',false);
                // this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('cancel',false);
                if (this.props.config.nodetype !== "org"){
                    if (!this.props.syncTree.getSyncTreeValue(treeId)[0].children || this.props.syncTree.getSyncTreeValue(treeId)[0].children.length === 0){
                        this.setState({cardEmpty:true})
                    }
                }
                // this.props.button.setDisabled({
                //     add:false,
                //     edit:false,
                //     del:false,
                // });
                break;
            case 'save':
                break;
            case 'cancel':
                this.props.button.setButtonVisible('add',true);
                this.props.button.setButtonVisible('print',true);
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('edit',true);
                this.props.button.setButtonVisible('del',true);
                this.props.button.setButtonVisible('refresh',true);
                this.props.button.setButtonVisible('save',false);
                this.props.button.setButtonVisible('cancel',false);
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
                this.props.button.setButtonVisible('print',true);
                this.props.button.setButtonVisible('export',true);
                this.props.button.setButtonVisible('import',true);
                if(!selectedTreeNode){
                    //无选中节点，按钮不可用
                    // this.props.button.setDisabled({
                    //     add:true,
                    //     edit:true,
                    //     del:true,
                    // });
                }else if(selectedTreeNode.refpk ==this.root.refpk){
                    //选中根节点，只有新增可用
                    // this.props.button.setDisabled({
                    //     add:false,
                    //     edit:true,
                    //     del:true,
                    // });
                }else{
                    //选中非根节点，显示状态的按钮都可用
                    // this.props.button.setDisabled({
                    //     add:false,
                    //     edit:false,
                    //     del:false,
                    // });
                }
                //cancel('custclass');
                this.props.syncTree.setNodeDisable(treeId,false);
                this.setState({disabledSearch:false});
                this.setState({disabledOrg:false});
                this.setState({disabledShowoff:false});
                if (this.props.config.nodetype !== "org"){
                    if (!this.props.syncTree.getSyncTreeValue(treeId)[0].children || this.props.syncTree.getSyncTreeValue(treeId)[0].children.length === 0){
                        this.setState({cardEmpty:true})
                    }
                }
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, false);
            default :
                break;
        }
    }

    //修改校验
    onBtnEdit(){
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
        let l_pk_marbasclass = this.props.form.getFormItemsValue(formBaseId,'pk_marbasclass');console.log('enablestate changed');
        if(selectedTreeNode == null || selectedTreeNode.nodeData == null){
            return;
        }
        console.log(selectedTreeNode);
        if(this.props.config.nodetype === 'org' && this.state.curOrg != selectedTreeNode.nodeData.pk_org){
            toast({content:this.state.json['10140MCLG-000012'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
            return;
        }
        console.log(l_pk_marbasclass)
        if(l_pk_marbasclass.value == null){
            return;
        }
        let requestParam = {
            // pk_eps:selectedTreeNode.refpk,
            ts:this.props.form.getFormItemsValue(formBaseId,'ts').value,
            // nodeType:this.config.nodeType
            pk_marbasclass:l_pk_marbasclass.value
        };
        ajax({
            url:urls['editCheckUrl'],
            data:requestParam,
            success:(result)=>{
                this.props.form.setFormStatus(formBaseId,'edit');
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                this.changeButtonStatus('edit');
                this.state.method = 'edit';
                this.changeEnablestate();
                window.onbeforeunload = () => {return '';}
            }
        });
    }

    //按钮单击事件
    onButtonClick(props,id){
        console.log("--00--");
        console.log(this.props);
        let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
        console.log('onButtonClick:'+id);
        switch (id) {
            case 'print':
                console.log(this.printPks);
                print(
                    'pdf',
                    urls['print'],
                    {
                        billtype:'',//单据类型
                        funcode:'10140MCLG',//功能节点编码，即模板编码
                        nodekey:'',//模板节点标识
                        oids:this.printPks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                console.log(this.printPks);
                this.setState({
                    pks: this.printPks
                },() => {
                    this.refs.printOutput.open()
                });
                return;
                print(
                    'pdf',
                    urls['print'],
                    {
                        billtype:'',//单据类型
                        funcode:'10140MCLG',//功能节点编码，即模板编码
                        nodekey:'',//模板节点标识
                        oids:this.printPks,//单据pk
                        outputType:'output'
                    }
                );
                break;
            case 'edit':
                // if(selectedTreeNode == null){
                //     return;
                // }
                this.onBtnEdit();
                // this.props.form.setFormStatus(formBaseId,'edit');
                // this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                // this.changeButtonStatus('edit');
                // this.state.method = 'edit';
                // window.onbeforeunload = () => {return '';}
                break;
            case 'saveAdd':
                // this.state.method = 'saveAdd';
                //this.props.form.setFormStatus(formBaseId,'edit');
                //this.changeButtonStatus('edit');
                // this.saveData();
                this.execValidateFormular(()=>{
                    this.state.method = 'saveAdd';
                    this.saveData();
                });
                break;
            case 'save':
                //this.state.method = 'save';
                //this.props.form.setFormStatus(formBaseId,'edit');
                //this.changeButtonStatus('edit');
                // this.saveData();
                this.execValidateFormular(()=>{
                    let l_pk_marbasclass = this.props.form.getFormItemsValue(formBaseId,'pk_marbasclass');
                    if(l_pk_marbasclass == null || l_pk_marbasclass.value == null || l_pk_marbasclass.value.length < 1){
                        this.state.method = 'add';//新增情况下的保存
                    }else{
                        this.state.method = 'edit';//修改情况下的保存
                    }
                    this.saveData();
                });
                break;
            case 'refresh':
                //this.props.form.setFormStatus(formBaseId,'edit');
                this.loadTree('refresh');
                this.props.form.EmptyAllFormValue(formBaseId);
                //loadTree();
                break;
            case 'add':
                this.props.form.EmptyAllFormValue(formBaseId);
                let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);//获得选中节点
                console.log(selectedTreeNode);
                if(selectedTreeNode != null && selectedTreeNode.refpk != 'root'){
                    this.props.form.setFormItemsValue(formBaseId,{'code':{value:selectedTreeNode.innercode}});
                }
                if(this.props.config.nodetype === 'org'){
                    this.props.form.setFormItemsValue(formBaseId,{'pk_org':{value:this.state.curOrgObj.refpk,display:this.state.curOrgObj.refname}});
                }else{
                    this.setFormGroupValue();
                }
                this.props.form.setFormStatus(formBaseId,'edit');
                this.changeEnablestate();
                this.changeButtonStatus('add');
                this.state.method = 'add';
                this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:true}});
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                this.setDefaultValue();
                window.onbeforeunload = () => {return '';}
                break;
            case 'del':
                this.state.method = 'del';
                this.saveData();
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'cancel':
                // this.props.modal.show('cancelConfirmModal');
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140MCLG-000009'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.state.json['10140MCLG-000010'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: this.cancelConfirmModal.bind(this),
                    // cancelBtnClick:()=>{console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                })
                return;
                this.props.form.setFormStatus(formBaseId,'browse');
                this.changeEnablestate();
                this.changeButtonStatus('cancel');
                this.state.method = null;
                break;
        }
    }

    onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140MCLG-000011'],color:'warning'});/* 国际化处理： 努力开发中......*/
    }

    //表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid,allData);
    }
    
    /**
     * 编辑
     */
    onEditSys(selectedTreeNode){console.log('onEditSys');console.log(this);
        let businessInfo = getBusinessInfo();
        /*if(selectedTreeNode == null){
            return;
        }
        this.props.form.setFormStatus(formBaseId,'edit');
        this.changeButtonStatus('edit');
        this.state.method = 'edit';*/
        this.props.button.setDisabled({
            print:false,
            output:false
        });
        this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
        if(this.props.config.nodetype === 'org'){
            if(this.state.curOrg != selectedTreeNode.nodeData.pk_org){
                toast({content:this.state.json['10140MCLG-000012'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                return;
            }
        }
        if(this.props.config.nodetype === 'group'){
            if(businessInfo.groupId != selectedTreeNode.nodeData.pk_org){
                toast({content:this.state.json['10140MCLG-000013'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                return;
            }
        }
        this.onButtonClick(null,'edit');
        this.onTreeSelect(selectedTreeNode.refpk);
    }

    /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        let businessInfo = getBusinessInfo();
        this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
        if(this.props.config.nodetype === 'org'){
            if(this.state.curOrg != selectedTreeNode.nodeData.pk_org){
                toast({content:this.state.json['10140MCLG-000012'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                return;
            }
        }
        if(this.props.config.nodetype === 'group'){
            if(businessInfo.groupId != selectedTreeNode.nodeData.pk_org){
                toast({content:this.state.json['10140MCLG-000013'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                return;
            }
        }
        this.delCheck(selectedTreeNode.refpk);
        // promptBox({
        //     color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        //     title: this.state.json['10140MCLG-000009'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
        //     content: this.state.json['10140MCLG-000014'],             // 提示内容,非必输/* 国际化处理： 您确定要删除所选数据吗？*/
        //     // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
        //     // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
        //     // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
        //     // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
        //     beSureBtnClick:()=>{
        //         promptBox({
        //             color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        //             title: this.state.json['10140MCLG-000009'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
        //             content: this.state.json['10140MCLG-000015'],             // 提示内容,非必输/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
        //             // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
        //             // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
        //             // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
        //             // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
        //             beSureBtnClick:()=>{
        //                 this.onButtonClick(null,'del');
        //             }
        //             // cancelBtnClick:()=>{console.log('cancelBtnClick');
        //             //     this.props.modal.close('cancelConfirmModal');
        //             // }
        //         })
        //     }
        //     // cancelBtnClick:()=>{console.log('cancelBtnClick');
        //     //     this.props.modal.close('cancelConfirmModal');
        //     // }
        // })
    }

    /**
     * 删除前权限校验
     */
    delCheck = (pk) => {
        ajax({
            url: urls["delCheckUrl"],
            data:{
                pk: pk
            },
            success: (res) =>{console.log('delCheck');console.log(res);
                if(res.data == true){
                    promptBox({
                        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.state.json['10140MCLG-000028'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                        content: this.state.json['10140MCLG-000014'],             // 提示内容,非必输/* 国际化处理： 您确定要删除所选数据吗？*/
                        // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                        // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                        // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                        beSureBtnClick:()=>{
                            promptBox({
                                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10140MCLG-000028'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                                content: this.state.json['10140MCLG-000015'],             // 提示内容,非必输/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                                beSureBtnClick:()=>{
                                    this.onButtonClick(null,'del');
                                }
                            })
                        }
                    })
                }
            }
        });
    }
    delConfirm(props){
        // this.onButtonClick(null,'del');
        // this.props.modal.close('delConfirmModal');
        this.props.modal.show('delConfirmModal',{
            color:"warning",
            title:this.state.json['10140MCLG-000016'],/* 国际化处理： 提示*/
            content:this.state.json['10140MCLG-000015'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
            beSureBtnClick:()=>{
                // this.deleteAction(props);
                this.onButtonClick(null,'del');
            }
        });
    }

    cancelConfirmModal(props){
        this.props.form.setFormStatus(formBaseId,'browse');
        this.changeEnablestate();
        this.changeButtonStatus('cancel');
        this.state.method = null;
        this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});

        let l_pk_marbasclass = this.props.form.getFormItemsValue(formBaseId,'pk_marbasclass');
        console.log(l_pk_marbasclass);
        if(l_pk_marbasclass == null || l_pk_marbasclass.value == null || l_pk_marbasclass.value.length < 1){
            this.props.form.setFormItemsValue("head",{'code':{value:'',display:this.state.codeRule}});/* 国际化处理： 编码规则：XX-XX-XX-XXXX*/
        }
        window.onbeforeunload = null;
        if(this.state.curSelectedNode){
            this.onTreeSelect(this.state.curSelectedNode);
        }
    }

    //新增 -- 体系
    onAdd(selectedTreeNode){
        console.log('onAdd');
        this.props.button.setDisabled({
            print:false,
            output:false,
            refresh:false
        });
        if(this.props.config.nodetype === 'org' && this.state.curOrg == null){
            toast({content:this.state.json['10140MCLG-000017'],title:this.state.json['10140MCLG-000016']});/* 国际化处理： 请选择业务单元,提示*/
            return;
        }
        this.setState({cardEmpty:false})
        this.props.syncTree.setNodeSelected(treeId, selectedTreeNode.refpk);
        //this.state.curSelectedNode = curSelectedNode.refpk;
        this.onButtonClick(null,'add');
    }

    //显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
        },()=> {
            if(this.props.config.nodetype == 'org' && this.state.curOrgObj == null){
                return;
            }
            this.loadTree()
        });
        console.log(this.state.isShowOff);return;
        
        // this.loadTree();
		// this.getData(this.state.isShowOff);
	}

    /**
     * 鼠标进入树节点事件 设置图标的可见性
     * @param key
     */
    onMouseEnterEve(key){
        let l_treeObj = this.props.syncTree.getSyncTreeValue(treeId, key);
        console.log(l_treeObj);
        let obj = {};
        //判断是否是根节点
        if(key === this.root.refpk
            || (this.props.config.nodetype === 'org' && this.state.curOrg != l_treeObj.nodeData.pk_org)){
            obj = {
                delIcon:false,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                editIcon:false, //编辑图标
                addIcon:true    //新增图标
            };
        }else{
            obj = {
                delIcon:true,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                editIcon:true, //编辑图标
                addIcon:true    //新增图标
            };
        }
            //设置
            console.log('onMouseEnterEve');
            console.log(this);
            this.props.syncTree.hideIcon(treeId, key, obj );

    }

    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index){
        console.log("onAfterFormEvent");
        console.log(value);
        switch(key){
            case "pk_marasstframe"://辅助属性结构
                this.loadMarAsstFrame(value.value);
                break;
            case "enablestate":
                //获得选中节点
                
                let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
                let l_pk_marbasclass = this.props.form.getFormItemsValue(formBaseId,'pk_marbasclass');console.log('enablestate changed');
                if(selectedTreeNode == null || selectedTreeNode.nodeData == null){
                    break;
                }
                console.log(selectedTreeNode);
                if(this.props.config.nodetype === 'org' && this.state.curOrg != selectedTreeNode.nodeData.pk_org){
                    // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
                    let l_enablestate = this.props.form.getFormItemsValue(formBaseId,'enablestate');
                    console.log(l_enablestate);
                    this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!l_enablestate.value,display:!l_enablestate.value}});
                    // this.props.form.cancel(formBaseId);
                    toast({content:this.state.json['10140MCLG-000012'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                    return;
                }
                console.log(l_pk_marbasclass)
                if(l_pk_marbasclass.value == null){
                    let content = value.value?this.state.json['10140MCLG-000018']:this.state.json['10140MCLG-000019'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    // NCMessage.create({content: content, color: 'warning'});//默认top
                    toast({content:content,color:'warning'});
                    console.log(111);
                    this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
                    return;
                }
                let requestParam = {
                    // pk_eps:selectedTreeNode.refpk,
                    enablestate:value.value?'2':'1',
                    ts:this.props.form.getFormItemsValue(formBaseId,'ts').value,
                    // nodeType:this.config.nodeType
                    pk_marbasclass:l_pk_marbasclass.value
                };

                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: value.value?this.state.json['10140MCLG-000036']:this.state.json['10140MCLG-000044'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: value.value?this.state.json['10140MCLG-000020']:this.state.json['10140MCLG-000021'],             // 提示内容,非必输/* 国际化处理： 是否确认要启用？,您确定要停用所选数据及其所有下级数据吗？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    cancelBtnClick:()=>{console.log('cancelBtnClick');
                        this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}},true,false);
                    },
                    closeModalEve:()=>{console.log('closeModalEve');
                        this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}},true,false);
                    },
                    beSureBtnClick:()=>{
                        ajax({
                            url:urls['enablestateUrl'],
                            data:requestParam,
                            success:(result)=>{
                                console.log(result);
                                this.props.form.setFormItemsValue(formBaseId,{'ts':{value:result.data.ts}});
                                toast({title:value.value?this.state.json['10140MCLG-000022']:this.state.json['10140MCLG-000023'],color:"success"});/* 国际化处理： 启用成功！,停用成功！*/
                            }
                        });
                    },
                })
                // props.modal.show('enableModal',{
                //     color:"warning",
                //     title:'提示',
                //     content:value.value?"是否确认要启用？":"您确定要停用所选分类及其所有下级分类吗？",
                //     cancelBtnClick:()=>{console.log('cancelBtnClick');
                //         this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
                //     },
                //     closeModalEve:()=>{console.log('closeModalEve');
                //         this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
                //     },
                //     beSureBtnClick:()=>{
                //         ajax({
                //             url:urls['enablestateUrl'],
                //             data:requestParam,
                //             success:(result)=>{
                //                 /****
                //                  * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                //                  * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                //                  */
                //                 // let checked = this.state.checked;
                //                 //
                //                 // if(value.value){
                //                 //     //启用成功，设置表单数据
                //                 //     props.form.setAllFormValue(result.data);
                //                 // }
                //                 // if(!checked){
                //                 //     props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                //                 //     //不显示停用数据时，需要删除该节点
                //                 //     props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                //                 //     props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项可用
                //                 // }
                //                 console.log(result);
                //                 this.props.form.setFormItemsValue(formBaseId,{'ts':{value:result.data.ts}});
                //                 toast({content:value.value?"启用成功":"停用成功",title:"提示"});

                //             }
                //         });
                //     }
                // });


                
                break;
            default:
                break;
        }
    }

    // onBeforeFormEvent(props, moduleId, key, value, index){
    //     console.log("onAfterFormEvent");
    //     console.log(value);
    //     switch(key){
    //         case "enablestate":
    //             //获得选中节点
                
    //             let selectedTreeNode = this.props.syncTree.getSelectNode(treeId);
    //             let l_pk_marbasclass = this.props.form.getFormItemsValue(formBaseId,'pk_marbasclass');console.log('enablestate changed');
    //             if(selectedTreeNode == null || selectedTreeNode.nodeData == null){
    //                 break;
    //             }
    //             console.log(selectedTreeNode);
    //             if(this.props.config.nodetype === 'org' && this.state.curOrg != selectedTreeNode.nodeData.pk_org){
    //                 // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
    //                 let l_enablestate = this.props.form.getFormItemsValue(formBaseId,'enablestate');
    //                 console.log(l_enablestate);
    //                 // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!l_enablestate.value,display:!l_enablestate.value}});
    //                 // this.props.form.cancel(formBaseId);
    //                 toast({content:'组织节点只能维护当前节点有权限组织的数据！',color:'warning'});
    //                 return false;
    //             }
    //             console.log(l_pk_marbasclass)
    //             if(l_pk_marbasclass.value == null){
    //                 let content = value.value?"请选中需要启用的树节点":"请选中需要停用的树节点";
    //                 // NCMessage.create({content: content, color: 'warning'});//默认top
    //                 toast({content:content,color:'warning'});
    //                 console.log(111);
    //                 // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
    //                 return false;
    //             }
    //             let requestParam = {
    //                 // pk_eps:selectedTreeNode.refpk,
    //                 enablestate:value.value?'2':'1',
    //                 ts:this.props.form.getFormItemsValue(formBaseId,'ts').value,
    //                 // nodeType:this.config.nodeType
    //                 pk_marbasclass:l_pk_marbasclass.value
    //             };

    //             promptBox({
    //                 color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
    //                 title: "注意",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
    //                 content: value.value?"是否确认要启用？":"您确定要停用所选数据及其所有下级数据吗？",             // 提示内容,非必输
    //                 // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
    //                 // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
    //                 // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
    //                 // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
    //                 cancelBtnClick:()=>{console.log('cancelBtnClick');
    //                     // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
    //                 },
    //                 closeModalEve:()=>{console.log('closeModalEve');
    //                     // this.props.form.setFormItemsValue(formBaseId,{'enablestate':{value:!value.value}});
    //                 },
    //                 beSureBtnClick:()=>{
    //                     ajax({
    //                         url:urls['enablestateUrl'],
    //                         data:requestParam,
    //                         success:(result)=>{
    //                             console.log(result);
    //                             this.props.form.setFormItemsValue(formBaseId,{'ts':{value:result.data.ts}});
    //                             toast({content:value.value?"启用成功":"停用成功",title:"提示"});
    //                         }
    //                     });
    //                 },
    //             })


                
    //             break;
    //         default:
    //             break;
    //     }
    // }

    addClickCall = () => {
        this.onAdd(this.root)
    }
    
    render(){
        //console.log("render");console.log(this);
        let { asyncTree,syncTree,table, button, search,editTable,form,DragWidthCom,modal,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton } = button;
        let {NCFormControl,NCCheckbox} = base;
        let { createModal } = modal;
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const { createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const { Item } = Menu;
        const {createButtonApp}=button;
        const {createBillHeadInfo} = BillHeadInfo;
        const {cardEmpty} = this.state;
        let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      <Item key="1">this.state.json['10140MCLG-000035']</Item>/* 国际化处理： 过滤*/
					  <Item key="2">this.state.json['10140MCLG-000036']</Item>/* 国际化处理： 启用*/
					  <Item key="3">this.state.json['10140MCLG-000037']</Item>/* 国际化处理： 打印*/
                </Menu>
        );
        
        let createOrgRender = () => {
			return  this.props.config.nodetype && this.props.config.nodetype === 'org' ? (
				<div className="search-box">
				{BusinessUnitTreeRef({
					// onChange:this.onOrgChange.bind(this),
					// value:this.state.curOrg
					//placeholder: '重写这个参照的名字',
					//如果需要对参照过滤 可以加queryCondition参数
					//queryCondition:{
                    //}
				}=this.createCfg("BusinessUnitTreeRef",{
                    placeholder: this.state.json['10140MCLG-000024'],/* 国际化处理： 业务单元*/
                    disabled:this.state.disabledOrg,
                    fieldid:'org',
                    "pid":"",
                    "keyword":"",
                    "pageInfo":{
                        "pageIndex":0,
                        "pageSize":10,
                        "totalPage":"0"
                    },
                        queryCondition: function(){
                            return {
                                //此处可以添加参数
                                isShowDisabledData: true,
                                TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
                            };
                        }}))}
				</div>
		    ) : '';
        };
        
        return (
            <div className='nc-bill-tree-card'>
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/* {createPageIcon()} */}
                    {/* 标题 title*/}
                    {/* <div className="title"  fieldid={this.state.json[this.props.config.nodeName]+"_title"} >{this.state.json[this.props.config.nodeName]} */}
                    <div className="title">
                    {createBillHeadInfo({
                        title : this.state.json[this.props.config.nodeName],
                        initShowBackBtn:false
                    })}
                    </div>
                    {createOrgRender()}
                    {/* 简单查询 */}
					{/* <NCFormControl
						placeholder="请输入编码或名称筛选"
						value={this.state.searchValue}
						onChange={this.onSearch.bind(this)}
						type="search"
						className="search-box"
						disabled={this.state.searchDisable}
                    /> */}
                        {/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
                                        disabled={this.state.disabledShowoff}
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										// disabled={this.state.showOffDisable}
									>{this.state.json['10140MCLG-000038']/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
							):('')}
						</div>
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'btn-group',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('btn-group')

                        })}
                        {/* 彩色按钮  buttonColor: 'btn-color' */}
                        {/* {createButton('add', { name: '新增', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'add') })}
                        {createButton('edit', { name: '修改', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'edit') })}
                        {createButton('del', { name: '删除', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'del') })}
                        {createButton('save', { visible: false, name: '保存', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'save') })}
                        {createButton('cancel', { visible: false, name: '取消', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'cancel') })}
                        {createButton('refresh', { name: '刷新', buttonColor: 'btn-color', onButtonClick: this.onButtonClick.bind(this,'refresh') })}
                        {<Dropdown
							trigger={['hover']}
							overlayClassName={'overlay-button'}
							overlay={moreButton}
							animation="slide-up">
							<Button>更多</Button>
                        </Dropdown>} */}
                        {/* 灰色按钮  buttonColor: 'btn-gray' */}
                        {/* {createButton('cancel', { name: '取消', buttonColor: 'btn-gray', onButtonClick: this.dispatcher })} */}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                         // 左树区域
                        defLeftWid = '280px'
                        leftDom ={<div className="tree-area">
                            {createSyncTree({
                                treeId: treeId,
                                needEdit: true, //不启用编辑
                                showLine: false, //显示连线
                                searchType:'filtration',
                                needSearch: true, //是否需要搜索框
                                onSelectEve: this.onTreeSelect.bind(this),
                                clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                showModal:false,
                                disabledSearch:this.state.disabledSearch || false,//这个用来控制搜索框是否可用；
                                //userDefine: this.domShowDisable.bind(this)
                            })}
                            {createModal('delConfirmModal',{
                                title:this.state.json['10140MCLG-000032'],/* 国际化处理： 删除提醒*/
                                content:this.state.json['10140MCLG-000033'],/* 国际化处理： 确定要删除数据吗？*/
                                userControl:true,//自己控制什么时候关闭窗口
                                beSureBtnClick:this.delConfirm.bind(this),
                                cancelBtnClick:()=>{
                                    this.props.modal.close('delConfirmModal');
                                }
                            })}
                            {createModal('cancelConfirmModal', {
                                title: this.state.json['10140MCLG-000009'],/* 国际化处理： 注意*/
                                content: this.state.json['10140MCLG-000010'],/* 国际化处理： 确认取消操作？*/
                                beSureBtnClick: this.cancelConfirmModal.bind(this),
                                cancelBtnClick:()=>{
                                    this.props.modal.close('cancelConfirmModal');
                                }
                            })}
                            {createModal('enableModal', {
                                title: this.state.json['10140MCLG-000009'],/* 国际化处理： 注意*/
                                content: this.state.json['10140MCLG-000034'],/* 国际化处理： 确认启用/禁用数据？*/
                                beSureBtnClick: this.cancelConfirmModal.bind(this),
                                cancelBtnClick:()=>{
                                    this.props.modal.close('enableModal');
                                }
                            })}
                    </div>}
                    rightDom = {
                    <div style={{ height: '100%' }}>
                        {this.config.nodetype != 'org' ? <EmptyAreaTip
                        type="btn"
                        desc={this.state.json['10140MCLG-000045']}
                        onClick={this.addClickCall}
                        show={cardEmpty} /> : <EmptyAreaTip
                            desc={this.state.json['10140MCLG-000046']}
                            show={cardEmpty} />} 
                            <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>{createForm(formBaseId,{
                                    onAfterEvent: this.onAfterFormEvent.bind(this),
                                    // onBeforeEvent: this.onBeforeFormEvent.bind(this),
                                    expandArr:['marasstframe',''], //默认展开配置项 元素值为区域编码 
                                    cancelPSwitch:true
                                })}
                                <PrintOutput
                                    ref='printOutput'
                                    url={urls.print}
                                    data={{
                                        funcode: '10140MCLG',
                                        nodekey:'',
                                        oids: this.state.pks,
                                        outputType: 'output'
                                    }}
                                />
                                </div></div> }
                                />
                                 <ExcelImport
                                 {...this.props}
                                 moduleName ='uapbd'//模块名
                                 billType = {this.config.billType}//单据类型
                                 selectedPKS = {[]}
                                 appcode={this.config.appcode}
                                 pagecode={this.config.pageCode}
                                />
                </div>
            </div>
        );
    }
}

// MaterialClass = createPage({
// 	initTemplate: initTemplate
// })(MaterialClass);

//ReactDOM.render(<MaterialClass {...config} />, document.querySelector('#app'));

export default MaterialClass

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65