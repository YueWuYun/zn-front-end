//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high, toast,print,promptBox,getBusinessInfo,getMultiLang ,cacheTools,createPageIcon} from 'nc-lightapp-front';
//import  deepClone from '../../deepClone.js';
let { NCMessage,NCPopconfirm,NCBackBtn } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu:Menu, NCButton:Button, NCTabs:Tabs,NCModal,NCButton } = base;
const {PrintOutput} = high
import  Utils from '../../../public/utils'
import './index.less';
//业务单元参照
import BusinessUnitTreeRef from  '../../../../uapbd/refer/org/BusinessUnitTreeRef'

let businessInfo = getBusinessInfo();
const {TabPane} = Tabs;
const searchid = '10140UDDDBQ';
const tableid = 'currtype';
const pagecode = '10140SAQSG_qualidoc_card';
const isShowOffEnable = true;			//是否启用“显示停用”功能
// const treeId = 'materialtypetreeid';

const formBaseId = "supqualidoc";//物料基本分类表单id
const formExtendId = "formExtendId";//扩展信息表单id
const urls = {
	save : '/nccloud/uapbd/supplierqualisys/save.do',
    query : '/nccloud/uapbd/supplierqualisys/query.do',
    print : '/nccloud/uapbd/supplierqualisys/print.do',  //分页查询url
    queryTemplet : '/nccloud/platform/templet/querypage.do',
    enablestateUrl : '/nccloud/uapbd/supplierqualisys/disenable.do',
    codeRuleUrl : '/nccloud/uapbd/supplierqualisys/coderule.do',
};

class MaterialClass extends Component{
    constructor(props){
        super(props);
        //显示停用复选框的状态标志
        this.state = {
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            method: null,//记录当前的操作，add=新增，edit=修改
            configs: {},
            curOrg: null,
            isShowOff: false,
            disabledOrg: false,
            ajditem: {
                config : {
                    show: false,
                    size:'xlg'
                }
            },
            curOrgObj:null,
            disabledSearch: false,
            disabledShowoff:false,
            json:{},
            configs:{'BusinessUnitTreeRef':{value:{}}}
        };
        this.printPks = [];
        this.pk = null;
        this.pk_groupObj = null;
        this.codeRule = null;
        this.initTemplate(props);

    }
    initTemplate = (props)=>{
        /**
         * 页面初始设置button状态
         * @param props
         */
        const initButtonStatus=(props)=>{console.log('class_grp.initButtonStatus');
            //设置保存按钮不显示
            props.button.setButtonVisible('save',false);
            //设置取消按钮不显示
            props.button.setButtonVisible('cancel',false);
            //设置保存新增按钮不显示
            props.button.setButtonVisible('saveAdd',false);
            props.button.setButtonVisible('addline',false);
        }
    
        props.createUIDom(
            {
                pagecode:props.config.pageCode,
                // appid:config.appid,
                // appcode:config.appcode
            },
            (data)=>{console.log('createUIDom');console.log(data);
                if(data.template){
                    let meta = data.template;
                    this.modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    // props.meta.setMeta(data.template);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                    initButtonStatus(props);
                }
                console.log(data.context);
                props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
            }
        );
    
    
    }
    
    modifierMeta = (props, meta) => {
        // let status = props.getUrlParam('status');
        // meta[config.formId].status = status;
        // meta[config.tableId].status = status;
        console.log('modifierMeta');
        // 修改参照refcode
        let formItems = meta[props.config.formId].items;
        for(let i = 0; i < formItems.length; i++){
            if(formItems[i].attrcode === 'pk_qualitype'){//资质分类
                formItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';//资质分类
            }
            
        }
    
        // 修改参照refcode
        let typeFormItems = meta[props.config.typeFormId].items;console.log(props.config.typeFormId);console.log(typeFormItems);
        for(let i = 0; i < typeFormItems.length; i++){
            if(typeFormItems[i].attrcode === 'pk_parentqualitype'){//上级资质分类
                console.log("上级资质分类");
                typeFormItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';//物料多版本
            }
        }
    
        let tableItems = meta[props.config.tableId].items;console.log(tableItems);
        for(let i = 0; i < tableItems.length; i++){
            if(tableItems[i].attrcode === 'cmaterialvid'){console.log(this.state.json['10140SAQSG-000000']);/* 国际化处理： 配件编码*/
                tableItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                //参数组织过滤
                // tableItems[i].queryCondition = () => {
                //     let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
                //     console.log('modifierMeta pkorg = '+pk_org);
                //     return {pk_org : pk_org};
                // };
            }
        }
    
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10140SAQSG-000001'],/* 国际化处理： 操作*/
            visible: true,
            itemtype: 'customer',
            className:'table-opr',
            width:200,
            fixed:'right',
            render: (text, record, index) => {
                let status = props.cardTable.getStatus(props.config.tableId);
                console.log('status============'+status);
                return status === 'browse' ? (
                    // <span
                    // 	onClick={() => {
                    //         props.cardTable.toggleRowView(config.tableId, record)
            
                    //     }}
                    //     > 展开
                     // </span>
                     ''
                ):(<div className="currency-opr-col">
                        {/* <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.openModel(config.tableId, 'edit', record, index);
                                e.stopPropagation();
                            }}
                        >更多</span>
                        &nbsp;&nbsp; */}
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.delRowsByIndex(props.config.tableId, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10140SAQSG-000038']/* 国际化处理： 删除*/}</span>
                    </div>
                );
            }
        };
        meta[props.config.tableId].items.push(porCol);
    
        return meta;
    }
    //参照回写方法
    createCfg(id,param){
        var obj={
            value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('onChange--'+val);
                console.log(val);
                if(val != null && val.refpk != null && val.refpk.length > 0){
                    this.props.button.setDisabled({'add':false});
                }
                this.state.curOrgObj = val;
                this.state.curOrg = val.refpk;
                this.loadTree();//重新加载树
                var temp= Object.assign(this.state.configs[id],{value:val});
                this.setState(Object.assign (this.state.configs,temp));
            }.bind(this)
        }
        this.state.configs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }
    componentDidMount(){
        console.log('componentDidMount');
        console.log(this.props.button.getButtons());
        this.root = {
            "isleaf": false,
            "key":"root",
            "title":this.state.json['10140SAQSG-000002'],/* 国际化处理： 资质分类*/
            "id":"root",
            "innercode":"TYPE",
            "pid": "",
            "refname": this.state.json['10140SAQSG-000002'],/* 国际化处理： 资质分类*/
            "refpk": "root"
        };
        this.changeButtonStatus();
        //this.loadTree();
        this.props.button.setButtonVisible('save',false);
        this.props.button.setButtonVisible('cancel',false);
        if(this.props.config.nodetype == 'org'){
            this.props.button.setDisabled({'add':true});
        }
        this.cardUrl = "";
        this.listUrl = "";
        this.mainUrl = "";
        if(this.props.config.nodetype == 'group'){
            this.cardUrl = "/uapbd/supplier/supplierqualisys_grp/card/index.html";
            this.listUrl = "/uapbd/supplier/supplierqualisys_grp/list/index.html";
            this.mainUrl = "/uapbd/supplier/supplierqualisys_grp/main/index.html";
        }else{
            this.cardUrl = "/uapbd/supplier/supplierqualisys_org/card/index.html";
            this.listUrl = "/uapbd/supplier/supplierqualisys_org/list/index.html";
            this.mainUrl = "/uapbd/supplier/supplierqualisys_org/main/index.html";
        }
        setTimeout(()=>{this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});},1000);
        // this.getCodeRule();
        //默认业务单元设置
        setTimeout(()=>{
            console.log('set default unit');
            console.log(this.props.config);

            let status= this.props.getUrlParam('status')
            if(status&&status=='browse'){
                let org = cacheTools.get("curOrgObj");
                if(org != null){
                    this.state.configs['BusinessUnitTreeRef'].value = org;
                    this.state.curOrg=org.refpk?org.refpk:'';
                    this.state.curOrgObj=org;
                    this.setState(this.state);
                    if(org.refpk){
                        this.props.button.setDisabled({'add':false});

                    }
                }
                this.loadTree();//重新加载树
            }else{
                if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
                    this.state.configs['BusinessUnitTreeRef']={value:{refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name}};
                    this.state.curOrgObj = {refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name};
                    this.state.curOrg = this.props.config.defaultOrg.pk_org;
                    this.setState(this.state);
                    //this.loadTree();//重新加载树
                }
                this.loadTree();//重新加载树
            }

        },1000);
    }

    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
            this.root = {
                "isleaf": false,
                "key":"root",
                "title":this.state.json['10140SAQSG-000002'],/* 国际化处理： 资质分类*/
                "id":"root",
                "innercode":"TYPE",
                "pid": "",
                "refname": this.state.json['10140SAQSG-000002'],/* 国际化处理： 资质分类*/
                "refpk": "root"
            };
        }
        getMultiLang({moduleId: '10140SAQSG',domainName: 'uapbd',callback});
    }

    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.props.config.formId);
        if(formStatus != 'add' && formStatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:'2',display:this.state.json['10140SAQSG-000003']}});/* 国际化处理： 已启用*/
    }
    //
    getDocDetail = (docPk)=>{
        if(docPk == null || docPk.length < 1){
            return;
        }
        ajax({
            url: urls['query'],
            data: {
                pk: docPk,		//所点击数的pk_marbasclass
                template:this.props.config.template
            },
            success: function(res) {console.log(this.state.json['10140SAQSG-000004']);console.log(res);/* 国际化处理： onTreeSelect返回*/
                //meta = modifierMeta(props,meta);
                console.log(res.data);
                // //表单数据
                // let headData = res.data[this.props.config.formId].rows[0].values;
                // //清空表单
                // this.props.form.EmptyAllFormValue(formBaseId);
                // //设置表单为所选树节点数据
                // this.props.form.setAllFormValue(res.data);
                //设置表单项enablestate可用
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
                if(res.data == undefined){console.log('show model');
                    this.onButtonClick(null,'cancel');
                    this.state.ajditem.config.show = true;
                    this.setState(this.state);
                    return;
                }
                if (res.data.head) {
                    console.log("headdata");
                    console.log(res.data);
                    console.log(this);
                    this.props.form.setAllFormValue({ [this.props.config.formId]: res.data.head[this.props.config.formId] });
                    let l_enablestate = false;
                    if(res.data.head[this.props.config.formId].rows[0].values.enablestate.value == '2'){//已启用
                        l_enablestate = true;
                    }else{//未启用、已停用
                        l_enablestate = false;
                    }
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:l_enablestate}});
					// let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].value;
                    // this.setState({title_code});
                    let l_pk_group = res.data.head[this.props.config.formId].rows[0].values['pk_group'].value;
                    let l_pk_org = res.data.head[this.props.config.formId].rows[0].values['pk_org'].value;
                    if(this.props.config.nodeType == "group"){
                        if(l_pk_org == l_pk_group){
                            // this.props.button.setDisabled({
                            //     copy:true,
                            //     edit:true,
                            //     del:true 
                            // });
                        }else{

                        }
                    }
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.props.config.tableId, res.data.body[this.props.config.tableId]);
                }
            }.bind(this)
        });
    }
    //点击树
    onTreeSelect(refpk){console.log('onTreeSelect');console.log(refpk);
        let selectedTree = this.props.syncTree.getSyncTreeValue(this.props.config.treeId,refpk);console.log(selectedTree);
        this.changeButtonStatus();
        if(selectedTree.innercode == 'TYPE'){
            // alert('TYPE');
            this.props.form.EmptyAllFormValue(this.props.config.formId);
            this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
            this.props.cardTable.setTableData(this.props.config.tableId, {rows:[]});
            return;
        }
        this.state.curSelectedNode = refpk;
        if(refpk == 'root'){
            this.props.form.EmptyAllFormValue(this.props.config.formId);
            this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
            this.props.cardTable.setTableData(this.props.config.tableId, {rows:[]});
            return;
        }
        this.pk = refpk;
        this.getDocDetail(refpk);
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

    setFormGroupValue(){
        console.log('setFormGroupValue');console.log(this.pk_groupObj);
        // if(this.pk_groupObj == null){
        //     ajax({
        //         url: '/nccloud/uapbd/supplierapply/queryGroupAction.do',
        //         success: function(res) {
        //             console.log(res);
        //             this.pk_groupObj = {value:res.data.value,display:res.data.display};
        //             this.props.form.setFormItemsValue(this.props.config.formId,{'pk_org':res.data});
        //         }.bind(this)
        //     });
        // }else{
        //     this.props.form.setFormItemsValue(this.props.config.formId,{'pk_org':{value:this.pk_groupObj.value,display:this.pk_groupObj.display}});
        // }
        this.props.form.setFormItemsValue(this.props.config.formId,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
    }

    getTreePk(p_treeObj){
        let pks = [];
        if(p_treeObj == null){
            return pks;
        }
        for(let i = 0; i < p_treeObj.length; i++){
            if(p_treeObj[i].innercode == 'DOC'){
                pks.push(p_treeObj[i].refpk);
            }
            let children = p_treeObj[i].children;
            if(children != null && children.length > 0){
                pks = pks.concat(this.getTreePk(children));
            }
        }
        return pks;
    }

    //编码规则
    getCodeRule(){console.log('getCodeRule');console.log(this.state.curOrg)
        if(this.props.config.nodetype == 'org' && this.state.curOrg == null){
            return;
        }
        ajax({
            url:urls.codeRuleUrl,
            data:{
                pk_org:this.state.curOrg
            },
            success:(res)=>{
                if(res.success){console.log(res);
                    this.codeRule = res.data;
                    try{
                    let meta = this.props.meta.getMeta();
                    this.props.form.setFormItemsValue(this.props.config.formId,{code:{value:this.codeRule.newCode}});
                    this.props.form.setFormItemsDisabled(this.props.config.formId,{code:!this.codeRule.isCodeEdit});
                    }catch(e){
                        console.error(e);
                    }
                }
            }
        });
    }

    loadTree(flag){
        if(this.props.config.nodetype == 'org'){
            if((this.state.defaultOrg == null || this.state.defaultOrg.length < 1)
                && (this.state.curOrg == null || this.state.curOrg.length < 1)
            ){
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
            url:"/nccloud/uapbd/supplierqualisys/tree.do",
            data:requestParam,
            success:(result)=>{
                if(result.success){console.log('load tree');console.log(result.data);
                    this.printPks = this.getTreePk(result.data);
                    var data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(this.props.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.props.config.treeId, this.root.id);
                }
                if(flag == 'refresh'){
                    toast({title:this.state.json['10140SAQSG-000005'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
            }
        })
    }

    //修改enablestate
    changeEnablestate = ()=>{
        setTimeout(()=>{
            let formStatus = this.props.form.getFormStatus(this.props.config.formId);
            let formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
            if(formStatus == 'add' || formStatus == 'edit'){//编辑态转数字
                if(formData.rows[0].values.enablestate.value == true || formData.rows[0].values.enablestate.value == '2'){
                    // formData.rows[0].values.enablestate.value = '2';
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:'2'}});
                }else{
                    // formData.rows[0].values.enablestate.value = '3';
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:'3'}});
                }
            }else{//浏览态转boolean
                if(formData.rows[0].values.enablestate.value == '2' || formData.rows[0].values.enablestate.value == true){
                    formData.rows[0].values.enablestate.value = true;
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:true}});
                }else{
                    formData.rows[0].values.enablestate.value = false;
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:false}});
                }
            }
            console.log(formData);
            formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
            console.log(formData.rows[0].values.enablestate.value);
        },100);
    }
    //校验公式
    execValidateFormular = (callback) =>{
        let CardData = this.props.createMasterChildData(this.props.config.pageCode, this.props.config.formId, this.props.config.tableId);
        console.log(CardData);
        /*let validateData = {
            pageid: this.props.config.pageCode,
            model: {
                areacode: 'head',
                areaType: "form",
                pageinfo: null,
                rows: formData.rows
            }
        };*/
        let tableTypeObj = {[this.props.config.formId]:'form',[this.props.config.tableId]:'cardTable'};
        let billType = 'card';
        this.props.validateToSave( CardData , ()=>{
            console.log('校验公式执行返回成功');
            setTimeout(()=>{callback();},100);
        } , tableTypeObj , billType );
    }
    //保存数据
    saveData(){
        console.log("saveData");
        console.log(this);
        this.props.cardTable.filterEmptyRows(this.props.config.tableId,['qualilevel','qualistatus'],'include');
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
        this.changeEnablestate();
        let CardData = this.props.createMasterChildData(this.props.config.pageCode, this.props.config.formId, this.props.config.tableId);
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
        let formData = this.props.form.getAllFormValue(formBaseId);//获得表单信息
        let cc = this.props.form.checkRequired(formBaseId);
        console.log(cc);
        formData.areacode = formBaseId;//添加表单的areacode编码
        if(this.state.method == 'add' || this.state.method == 'copy' || this.state.method == 'saveAdd'){
            CardData.head[this.props.config.formId].rows[0].status='2';//设置更新状态
            // formData.rows[0].values.pk_parent = {value:pk_parent};
            CardData.head[this.props.config.formId].rows[0].values.pk_supqualidoc.value = null;
            CardData.head[this.props.config.formId].rows[0].values.enablestate.value = '2';
            this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:'2'}});
            for(var i = 0; i < CardData.body.supqualilevel.rows.length; i++){
                CardData.body.supqualilevel.rows[i].values.pk_qualilevel.value = null;
                CardData.body.supqualilevel.rows[i].values.pk_supqualidoc = {value:null};
                CardData.body.supqualilevel.rows[i].status='2';//设置新增状态
            }
            // CardData.head[this.props.config.formId].rows[0].status = '2';//新增
        }else if(this.state.method == 'edit'){
            CardData.head[this.props.config.formId].rows[0].status='1';//设置更新状态
            // CardData.head[this.props.config.formId].rows[0].status = '1';//修改
        }else if(this.state.method == 'del'){
            CardData.head[this.props.config.formId].rows[0].status='3';//设置更新状态
            CardData.head[this.props.config.formId].rows[0].values.pk_supqualidoc.value=selectedTreeNode.refpk;//设置更新状态
            if(CardData.head[this.props.config.formId].rows[0].values.enablestate.value == true || CardData.head[this.props.config.formId].rows[0].values.enablestate.value == '2'){
                CardData.head[this.props.config.formId].rows[0].values.enablestate.value = '2';
            }else{
                CardData.head[this.props.config.formId].rows[0].values.enablestate.value = '3';
            }
            // CardData.head[this.props.config.formId].rows[0].values.enablestate.value='2';//
            // CardData.head[this.props.config.formId].rows[0].status = '3';//删除
        }
        // if(CardData.head[this.props.config.formId].rows[0].values.enablestate.value == true){
        //     CardData.head[this.props.config.formId].rows[0].values.enablestate.value = '2';
        // }else{
        //     CardData.head[this.props.config.formId].rows[0].values.enablestate.value = '3';
        // }
        console.log("formData");console.log('this.state.method='+this.state.method);
        console.log(CardData);
        let headRows = CardData.head['supqualidoc'].rows;
        if(headRows[0].values['code'].value == null || headRows[0].values['code'].value.length < 1){
            toast({content:this.state.json['10140SAQSG-000006'],color:'warning'});/* 国际化处理： 下列字段不能为空:<br>[资质编码]*/
            return;
        }
        if(headRows[0].values['name'].value == null || headRows[0].values['name'].value.length < 1){
            toast({content:this.state.json['10140SAQSG-000007'],color:'warning'});/* 国际化处理： 下列字段不能为空:<br>[资质名称]*/
            return;
        }
        if(headRows[0].values['pk_qualitype'].value == null || headRows[0].values['pk_qualitype'].value.length < 1){
            toast({content:this.state.json['10140SAQSG-000008'],color:'warning'});/* 国际化处理： 下列字段不能为空:<br>[资质分类]*/
            return;
        }
        let bodyRows = CardData.body['supqualilevel'].rows;
        console.log(bodyRows);
        if(bodyRows.length < 1){
            toast({content:this.state.json['10140SAQSG-000009'],color:'warning'});/* 国际化处理： 资质等级不能为空！*/
            return;
        }
        for(let i = 0; i < bodyRows.length; i++){
            if(bodyRows[i].values['qualilevel'].value == null || bodyRows[i].values['qualilevel'].value.length < 1){
                toast({content:this.state.json['10140SAQSG-000010']+(i+1)+this.state.json['10140SAQSG-000011'],color:'warning'});/* 国际化处理： 下列字段不能为空:<br>第,行：[等级]*/
                return; 
            }
            if(bodyRows[i].values['qualistatus'].value == null || bodyRows[i].values['qualistatus'].value.length < 1){
                toast({content:this.state.json['10140SAQSG-000010']+(i+1)+this.state.json['10140SAQSG-000012'],color:'warning'});/* 国际化处理： 下列字段不能为空:<br>第,行：[状态]*/
                return; 
            }
        }
        console.log(CardData);
        
        /***设置请求参数***/
        // requestParam = {
        //     model: formData,
        //     pageid: this.props.config.pagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        //     nodeType: this.props.config.nodetype,
        //     curOrg: this.state.curOrg == null? '':this.state.curOrg
        // };
        //ajax请求
        ajax({
            url: urls.save,
            data: CardData,
            success: (result) => {
                if(result.success){
                    console.log("saveData--success");console.log(this.props);console.log(result);
                    if (result.data) {
						if (result.data.billcard.head && result.data.billcard.head[this.props.config.formId]) {
							this.props.form.setAllFormValue({ [this.props.config.formId]: result.data.billcard.head[this.props.config.formId] });
                            this.pk = this.props.form.getFormItemsValue(this.props.config.formId,'pk_supqualidoc').value;
                            // pk_value = res.data.head[this.props.config.formId].rows[0].values[pk_item].value
						}
						if (result.data.billcard.body && result.data.billcard.body[this.props.config.tableId]) {
							this.props.cardTable.setTableData(this.props.config.tableId, result.data.billcard.body[this.props.config.tableId])
						}
					}
                    //设置表单浏览态
                    this.props.form.setFormStatus(this.props.config.formId, 'browse');
                    this.props.cardTable.setStatus(this.props.config.tableId,'browse');
                    //设置树可用
                    this.props.syncTree.setNodeDisable(this.props.config.treeId,false);console.log(1);
                    if(!result.data.tree[0].children || result.data.tree[0].children.length == 0 ){
                        delete result.data.tree[0].children;
                    }console.log(2);
                    if(this.state.method == 'add' || this.state.method == 'copy'){
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(this.props.config.treeId,result.data.tree[0]);
                        this.props.syncTree.setNodeSelected(this.props.config.treeId, result.data.tree[0].refpk);
                        toast({title:this.state.json['10140SAQSG-000013'],color:"success"});/* 国际化处理： 保存成功！*/
                    }else if(this.state.method == 'saveAdd'){
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(this.props.config.treeId,result.data.tree[0]);
                        this.props.syncTree.setNodeSelected(this.props.config.treeId, result.data.tree[0].refpk);
                        this.props.form.EmptyAllFormValue(this.props.config.formId);
                        this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                        this.props.form.setFormStatus(formBaseId, 'edit');
                        this.props.cardTable.setTableData(this.props.config.tableId, {rows: []});//清空表格
                        this.onButtonClick(this.props,'add');
                        toast({title:this.state.json['10140SAQSG-000013'],color:"success"});/* 国际化处理： 保存成功！*/
                        return;
                    }else if(this.state.method == 'del'){
                        //修改回调后修改
                        this.props.syncTree.delNodeSuceess(this.props.config.treeId,result.data.tree[0].id);
                        this.props.form.EmptyAllFormValue(this.props.config.formId);
                        this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                        this.props.cardTable.setTableData(this.props.config.tableId, {rows: []});
                        toast({title:this.state.json['10140SAQSG-000014'],color:"success"});/* 国际化处理： 删除成功！*/
                    }else if(this.state.method == 'edit'){
                        //修改回调后修改
                        this.props.syncTree.editNodeSuccess(this.props.config.treeId,result.data.tree[0]);
                        this.props.syncTree.setNodeSelected(this.props.config.treeId, result.data.tree[0].refpk);
                        toast({title:this.state.json['10140SAQSG-000013'],color:"success"});/* 国际化处理： 保存成功！*/
                        //设置表单为最新值
                        // this.props.form.setAllFormValue(result.data.form);console.log(5);
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
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
        console.log('changeButtonStatus=='+selectedTreeNode);
        console.log(selectedTreeNode);
        if(selectedTreeNode == null){
            this.props.button.setDisabled({
                // add:true,
                copy:true,
                edit:true,
                del:true,
                print:true,
                output:true,
            });
        }else if(selectedTreeNode.innercode == 'TYPE'){
            this.props.button.setDisabled({
                add:false,
                copy:true,
                edit:true,
                del:true,
                print:true,
                output:true,
            });
        }else{
            this.props.button.setDisabled({
                add:false,
                copy:false,
                edit:false,
                del:false,
                print:false,
                output:false,
            });
        }
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
            case 'edit':
                //加入copy处理
            case 'copy':
                this.props.button.setButtonVisible('add',false);
                this.props.button.setButtonVisible('edit',false);
                this.props.button.setButtonVisible('del',false);
                this.props.button.setButtonVisible('refresh',false);
                this.props.button.setButtonVisible('search',false);
                this.props.button.setButtonVisible('print',false);
                this.props.button.setButtonVisible('save',true);
                if(id == 'edit'){
                    this.props.button.setButtonVisible('saveAdd',false);
                }else if(id == 'add'||id=='copy'){
                    this.props.button.setButtonVisible('saveAdd',true);
                }
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible('addline',true);
                this.props.button.setButtonVisible('copy',false);
                this.setState({disabledSearch:true});
                this.setState({disabledShowoff:true});
                this.setState({disabledOrg:true});
                // this.props.button.setDisabled({
                //     save:false,
                //     cancel:false
                // });
                //设置树不可用
                this.props.syncTree.setNodeDisable(this.props.config.treeId,true);
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
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
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('edit',true);
                this.props.button.setButtonVisible('del',true);
                this.props.button.setButtonVisible('refresh',true);
                this.props.button.setButtonVisible('save',false);
                this.props.button.setButtonVisible('cancel',false);
                this.props.button.setButtonVisible('addline',false);
                this.props.button.setButtonVisible('print',true);
                this.props.button.setButtonVisible('search',true);
                this.props.button.setButtonVisible('copy',true);
                this.setState({disabledSearch:false});
                this.setState({disabledShowoff:false});
                this.setState({disabledOrg:false});
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:false});
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
                this.props.syncTree.setNodeDisable(this.props.config.treeId,false);
                // this.props.asyncTree.setAsyncNodeDisable(this.config.treeId, false);
            default :
                break;
        }
    }

    //按钮单击事件
    onButtonClick(props,id){
        console.log("--00--");console.log(props);
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
        console.log('onButtonClick:'+id);
        console.log(id);
        switch (id) {
            case 'print':
                console.log(this.printPks);
                let l_selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
                if(l_selectedTreeNode == null){
                    return;
                }else{
                    this.printPks = [];
                    this.printPks.push(l_selectedTreeNode.refpk);
                }
                print(
                    'pdf',
                    urls['print'],
                    {
                        billtype:'',//单据类型
                        funcode:'10140SAQSG',//功能节点编码，即模板编码
                        nodekey:'print',//模板节点标识
                        oids:this.printPks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                console.log(this.printPks);
                l_selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
                if(l_selectedTreeNode == null){
                    return;
                }else{
                    this.printPks = [];
                    this.printPks.push(l_selectedTreeNode.refpk);
                }
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
                        funcode:'10140SAQSG',//功能节点编码，即模板编码
                        nodekey:'print',//模板节点标识
                        oids:this.printPks,//单据pk
                        outputType:'output'
                    }
                );
                break;
            case 'copy':
                if(selectedTreeNode == null || selectedTreeNode.innercode != 'DOC'){
                    toast({content:this.state.json['10140SAQSG-000015'],color:'warning'});/* 国际化处理： 请选择需要复制的资质数据*/
                    return;
                }
                this.props.form.setFormStatus(this.props.config.formId,'edit');
                this.changeButtonStatus('copy');
                this.state.method = 'copy';
                this.props.cardTable.setStatus(this.props.config.tableId,'edit');
                this.changeEnablestate();
                break;
            case 'edit':
                if(selectedTreeNode == null || selectedTreeNode.innercode != 'DOC'){
                    toast({content:this.state.json['10140SAQSG-000016'],color:'warning'});/* 国际化处理： 请选择需要修改的资质数据*/
                    return;
                }
                let formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
                console.log(formData);
                let l_pk_group = formData.rows[0].values['pk_group'].value;
                let l_pk_org = formData.rows[0].values['pk_org'].value;
                if(this.props.config.nodetype == 'group'){
                    if(l_pk_group != l_pk_org){
                        toast({content:this.state.json['10140SAQSG-000017'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
                        return;
                    }
                }
                if(this.props.config.nodetype == 'org'){
                    if(this.state.curOrg != l_pk_org){
                        toast({content:this.state.json['10140SAQSG-000018'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限的数据*/
                        return;
                    }
                }
                this.props.form.setFormStatus(this.props.config.formId,'edit');
                this.changeButtonStatus('edit');
                this.state.method = 'edit';
                this.props.cardTable.setStatus(this.props.config.tableId,'edit');
                this.changeEnablestate();
                break;
            case 'addline':
                // this.props.cardTable.addRow(this.props.config.tableId);
                this.props.cardTable.addRow(this.props.config.tableId);
                break;
            case 'saveAdd':
                // this.state.method = 'saveAdd';
                // this.saveData();
                this.execValidateFormular(()=>{
                    this.state.method = 'saveAdd';
                    this.saveData();
                });
                break;
            case 'search':
                cacheTools.set('curOrgObj',this.state.curOrgObj);
                this.props.pushTo('/list',{
                    status:'browse'
                });
                break;
            case 'save':
                //this.state.method = 'save';
                //this.props.form.setFormStatus(formBaseId,'edit');
                //this.changeButtonStatus('edit');
                // let pk_supqualidoc = this.props.form.getFormItemsValue(this.props.config.formId,'pk_supqualidoc');
                // if(pk_supqualidoc == null || pk_supqualidoc.value == null || pk_supqualidoc.value.length < 1){
                //     this.state.method = 'add';
                // }else{
                //     this.state.method = 'edit';
                // }
                // this.saveData();
                this.execValidateFormular(()=>{
                    let pk_supqualidoc = this.props.form.getFormItemsValue(this.props.config.formId,'pk_supqualidoc');
                    if(this.state.method == 'copy' || (pk_supqualidoc == null || pk_supqualidoc.value == null || pk_supqualidoc.value.length < 1)){
                        this.state.method = 'add';
                    }else{
                        this.state.method = 'edit';
                    }
                    this.saveData();
                });
                break;
            case 'refresh':
                //this.props.form.setFormStatus(formBaseId,'edit');
                this.loadTree('refresh');
                this.props.form.EmptyAllFormValue(this.props.config.formId);
                //loadTree();
                break;
            case 'add':
                this.props.form.EmptyAllFormValue(this.props.config.formId);
                this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});
                if(this.props.config.nodetype === 'org'){
                    if(this.state.curOrgObj == null){
                        toast({content:this.state.json['10140SAQSG-000019'],color:'warning'});/* 国际化处理： 请选择业务单元*/
                        return;
                    }console.log(this.state.curOrgObj);
                    this.props.form.setFormItemsValue(this.props.config.formId,{'pk_org':{value:this.state.curOrgObj.refpk,display:this.state.curOrgObj.refname}});
                }else{
                    this.setFormGroupValue();
                }
                //新增资质时计算默认资质类别
                if(selectedTreeNode != null && selectedTreeNode.innercode == 'TYPE' && selectedTreeNode.refpk != 'root'){
                    let typeName = selectedTreeNode.refname;
                    let typeIndex = typeName.indexOf(" ");
                    if(typeIndex > -1){
                        typeName = typeName.substr(typeIndex);
                    }
                    this.props.form.setFormItemsValue(this.props.config.formId,{'pk_qualitype':{value:selectedTreeNode.refpk,display:typeName}});
                }
                if(selectedTreeNode != null && selectedTreeNode.innercode == 'DOC' && selectedTreeNode.refpk != 'root'){
                    let tempRefPk = selectedTreeNode.pid;
                    for(let i = 0; i < 10; i++){
                        let tempTreeValue = this.props.syncTree.getSyncTreeValue(this.props.config.treeId,tempRefPk);
                        if(tempTreeValue == null || tempTreeValue.innercode == 'root'){
                            break;
                        }
                        if(tempTreeValue.innercode == 'TYPE'){
                            let typeName = tempTreeValue.refname;
                            let typeIndex = typeName.indexOf(" ");
                            if(typeIndex > -1){
                                typeName = typeName.substr(typeIndex);
                            }
                            this.props.form.setFormItemsValue(this.props.config.formId,{'pk_qualitype':{value:tempTreeValue.refpk,display:typeName}});
                            break;
                        }
                        tempRefPk = tempTreeValue.pid;
                    }
                }
                
                this.props.cardTable.setTableData(this.props.config.tableId, { rows: [] });
                this.props.form.setFormStatus(this.props.config.formId,'edit');
                this.props.cardTable.setStatus(this.props.config.tableId,'edit');
                this.changeButtonStatus('add');
                this.state.method = 'add';
                this.setDefaultValue();
                this.getCodeRule();
                this.changeEnablestate();
                break;
            case 'del':
                if(selectedTreeNode == null || selectedTreeNode.innercode != 'DOC'){
                    toast({content:this.state.json['10140SAQSG-000020'],color:'warning'});/* 国际化处理： 请选择需要删除的资质数据*/
                    return;
                }
                formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
                console.log(formData);
                l_pk_group = formData.rows[0].values['pk_group'].value;
                l_pk_org = formData.rows[0].values['pk_org'].value;
                if(this.props.config.nodetype == 'group'){
                    if(l_pk_group != l_pk_org){
                        toast({content:this.state.json['10140SAQSG-000017'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
                        return;
                    }
                }
                if(this.props.config.nodetype == 'org'){
                    if(this.state.curOrg != l_pk_org){
                        toast({content:this.state.json['10140SAQSG-000018'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限的数据*/
                        return;
                    }
                }
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140SAQSG-000021'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                    content: this.state.json['10140SAQSG-000022'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: ()=>{
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10140SAQSG-000021'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                            content: this.state.json['10140SAQSG-000023'],             // 提示内容,非必输/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                            // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                            // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                            // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                            beSureBtnClick: ()=>{
                                this.state.method = 'del';
                                this.saveData();
                            },
                            // cancelBtnClick: () => {
                            //     console.log('cancelBtnClick');
                            //     this.props.modal.close('cancelConfirmModal');
                            // }
                        });
                    },
                    // cancelBtnClick: () => {
                    //     console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                });
                // props.modal.show('confirmModal',{
                //     color:"warning",
                //     title:'提示',
                //     content:"确认删除该数据？",
                //     beSureBtnClick:()=>{
                //         this.state.method = 'del';
                //         this.saveData();
                //     }
                // });
                break;
            case 'cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140SAQSG-000024'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
                    content: this.state.json['10140SAQSG-000025'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: ()=>{console.log('beSureBtnClick');
                        this.props.form.setFormStatus(this.props.config.formId,'browse');
                        this.props.cardTable.setStatus(this.props.config.tableId,'browse');
                        this.props.cardTable.resetTableData(this.props.config.tableId);
                        this.changeButtonStatus('cancel');
                        this.state.method = null;
                        // this.props.cardTable.cancelEdit(this.props.config.tableId);
                        let val = this.props.form.getFormItemsValue(this.props.config.formId,'code').value;
                        console.log(val);
                        if(val == null || val.length < 1){
                            this.props.form.setFormItemsDisabled(this.props.config.formId,{enablestate:true});
                        }
                        if(this.pk != null && this.pk.length > 0){
                            this.getDocDetail(this.pk);
                        }else{
                            this.props.form.EmptyAllFormValue(this.props.config.formId);
                            this.props.cardTable.setTableData(this.props.config.tableId,{'rows':[]});
                        }
                        this.changeEnablestate();
                    },
                    // cancelBtnClick: () => {
                    //     console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                });
                // this.props.modal.show('confirmModal',{
                //     color:"warning",
                //     title:'提示',
                //     content:"确认取消操作？",
                //     beSureBtnClick:()=>{
                //         this.props.form.setFormStatus(this.props.config.formId,'browse');
                //         this.changeButtonStatus('cancel');
                //         this.state.method = null;
                //         this.props.editTable.cancelEdit(this.props.config.tableId);
                //     }
                // });
                break;

            case 'typeadd':console.log(selectedTreeNode);
                if(selectedTreeNode == null || this.props.config.nodetype == 'org'){
                    return;
                }else{
                    //this.onAdd(selectedTreeNode);
                    this.props.modal.show('modalForm');
                    this.props.form.setFormStatus(this.props.config.typeFormId, 'edit');
                    this.props.form.EmptyAllFormValue(this.props.config.typeFormId);
                    this.props.form.setFormItemsDisabled(formBaseId,{enablestate:true});

                    let refpk = selectedTreeNode.refpk;
                    let refname = selectedTreeNode.refname;
                    if(selectedTreeNode.innercode === 'DOC'){
                        console.log(selectedTreeNode);
                        let typeValue = this.props.syncTree.getSyncTreeValue(this.props.config.treeId,selectedTreeNode.pid);
                        console.log(typeValue);
                        refpk = typeValue.refpk;
                        refname = typeValue.refname;
                    }
                    if(selectedTreeNode.refpk != 'root'){
                        let typeName = selectedTreeNode.refname;
                        let typeIndex = typeName.indexOf(" ");
                        if(typeIndex > -1){
                            typeName = typeName.substr(typeIndex);
                        }
                        this.props.form.setFormItemsValue(this.props.config.typeFormId, {'pk_parentqualitype':{value: refpk,display:typeName}});
                    }
                }
                break;
            case 'typeedit':
                if(selectedTreeNode == null || selectedTreeNode.refpk == 'root' || this.props.config.nodetype == 'org'){
                    return;
                }else{
                    this.onEditSys(selectedTreeNode);
                }
                break;
            case 'typedel':
                if(selectedTreeNode == null || selectedTreeNode.refpk == 'root' || this.props.config.nodetype == 'org'){
                    return;
                }else{
                    this.onDeleteSysEve(selectedTreeNode);
                }
                break;
            case 'typerefresh':
                this.onButtonClick(null,'refresh');
                break;
        }
    }

    onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140SAQSG-000026'],color:'warning'});/* 国际化处理： 努力开发中......*/
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
		this.props.cardTable.setTableData(tableid,allData);
    }

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
        // let meta = props.meta.getMeta(tableId);
        // let formItems = meta[props.config.formId].items;
        // let form = props.form.getAllFormValue(props.config.formId);
        console.log('form afterEvent');
        console.log(i);console.log(s);console.log(g);console.log('end');
        if(key == 'enablestate'){

            let formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
            let l_pk_group = formData.rows[0].values['pk_group'].value;
            let l_pk_org = formData.rows[0].values['pk_org'].value;
            if(this.props.config.nodetype == 'group'){
                if(l_pk_group != l_pk_org){
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                    toast({content:this.state.json['10140SAQSG-000017'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据*/
                    return;
                }
            }
            if(this.props.config.nodetype == 'org'){
                if(this.state.curOrg != l_pk_org){
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                    toast({content:this.state.json['10140SAQSG-000018'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限的数据*/
                    return;
                }
            }


            if(this.pk == null || this.pk.length < 1 || this.pk == 'undefined'){
                return;
            }
            let requestParam = {
                enablestate:value.value?'2':'1',
                pk:this.pk,
                ts:props.form.getFormItemsValue(this.props.config.formId,'ts').value
            };
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: value.value?this.state.json['10140SAQSG-000027']:this.state.json['10140SAQSG-000028'],               // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用？,确认停用？*/
                content: value.value?this.state.json['10140SAQSG-000029']:this.state.json['10140SAQSG-000030'],             // 提示内容,非必输/* 国际化处理： 是否确认要启用？,是否确认要停用？*/
                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: ()=>{
                    ajax({
                        url:urls['enablestateUrl'],
                        data:requestParam,
                        success:(result)=>{
                            console.log(result);
                            props.form.setFormItemsValue(this.props.config.formId,{'ts':{value:result.data.ts}});
                            toast({title:value.value?this.state.json['10140SAQSG-000031']:this.state.json['10140SAQSG-000032'],color:"success"});/* 国际化处理： 启用成功？,停用成功？*/
                        }
                    });
                },
                cancelBtnClick: () => {
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                },
                closeModalEve:()=>{console.log('closeModalEve');
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                }
            });
            // props.modal.show('confirmModal',{
            //     color:"warning",
            //     title:'提示',
            //     content:value.value?"确认启用该数据？":"确认停用该数据？",
            //     cancelBtnClick:()=>{console.log('cancelBtnClick');
            //         props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
            //     },
            //     closeModalEve:()=>{console.log('closeModalEve');
            //         props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
            //     },
            //     beSureBtnClick:()=>{
            //         ajax({
            //             url:urls['enablestateUrl'],
            //             data:requestParam,
            //             success:(result)=>{
            //                 toast({content:value.value?"启用成功":"停用成功",title:"提示"});
            //             }
            //         });
            //     }
            // });
        }
        // form.rows[0].values['cmaterialoid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid.name'] = {display: i.refname, value: i.refname};
        // form.rows[0].values['pk_unit'] = {display: i.values.measdoc_name.value, value: i.values.pk_measdoc.value};
        
    }
    
    //显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
        },()=>{
            if(this.props.config.nodetype == 'org' && this.state.curOrgObj == null){
                return;
            }
            this.loadTree();
        });
		// this.getData(this.state.isShowOff);
	}
    /**
     * 编辑
     */
    onEditSys(selectedTreeNode){console.log('onEditSys');console.log(this.props.cardTable);
        if(selectedTreeNode.innercode === 'TYPE'){//分类树
            // this.state.ajditem.config.show = true;
            // this.setState(this.state);
            // this.props.form.setFormStatus(this.props.config.typeFormId, 'edit');
            this.props.modal.show('modalForm');
            this.props.form.setFormStatus(this.props.config.typeFormId, 'edit');
            this.getTypeData(selectedTreeNode.refpk);
            return;
        }
        this.onTreeSelect(selectedTreeNode.refpk);
        this.props.syncTree.setNodeSelected(this.props.config.treeId, selectedTreeNode.refpk);
        this.onButtonClick(null,'typeedit');
    }

    //删除确认
    onDeleteConfirm(){console.log('onDeleteConfirm');
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.props.config.treeId);//获得选中节点
        if(selectedTreeNode.innercode === 'TYPE'){//分类树删除
            // this.props.modal.show('delete');
            this.onDelType(selectedTreeNode.refpk);
            return;
        }
        //this.onButtonClick(null,'del');
    }
    /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        this.props.syncTree.setNodeSelected(this.props.config.treeId, selectedTreeNode.refpk);
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140SAQSG-000021'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
            content: this.state.json['10140SAQSG-000022'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
            // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
            // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
            beSureBtnClick: ()=>{
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140SAQSG-000021'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                    content: this.state.json['10140SAQSG-000023'],             // 提示内容,非必输/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: this.onDeleteConfirm.bind(this),
                    // cancelBtnClick: () => {
                    //     console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                });
            },
            // cancelBtnClick: () => {
            //     console.log('cancelBtnClick');
            //     this.props.modal.close('cancelConfirmModal');
            // }
        });
        // this.props.modal.show('delete');
        // this.props.modal.show('confirmModal',{
        //     color:"warning",
        //     title:'提示',
        //     content:"确认删除？",
        //     beSureBtnClick:this.onDeleteConfirm.bind(this)
        // });
        return;
        if(selectedTreeNode.innercode === 'TYPE'){//分类树删除
            this.props.modal.show('delete');
            //this.onDelType(selectedTreeNode.refpk);
            return;
        }
        this.onButtonClick(null,'typedel');
    }

    //新增 -- 体系
    onAdd(selectedTreeNode){console.log('onAdd');
        this.props.syncTree.setNodeSelected(this.props.config.treeId, selectedTreeNode.refpk);
        //this.state.curSelectedNode = curSelectedNode.refpk;
        //selectedTreeNode.innercode === 'TYPE' || 
        if(selectedTreeNode.refpk == 'root'){//分类树
            // this.state.ajditem.config.show = true;
            // this.setState(this.state);
            // this.props.modal.show('modalForm');
            // this.props.form.setFormStatus(this.props.config.typeFormId, 'edit');
            // this.props.form.EmptyAllFormValue(this.props.config.typeFormId);
            // return;
        }
        this.onButtonClick(null,'typeadd');
    }

    /**
     * 鼠标进入树节点事件 设置图标的可见性
     * @param key
     */
    onMouseEnterEve(key,keyObj){
        //判断是否是根节点
        let obj = {};
        if(this.props.config.nodetype == 'group'){
            if(key === this.root.refpk){
                obj = {
                    delIcon:false,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                    editIcon:false, //编辑图标
                    addIcon:true    //新增图标
                };
            }else{
                if(keyObj.innercode == 'TYPE'){
                    obj = {
                        delIcon:true,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                        editIcon:true, //编辑图标
                        addIcon:true    //新增图标
                    };
                }else{
                    obj = {
                        delIcon:false,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                        editIcon:false, //编辑图标
                        addIcon:true    //新增图标
                    };
                }
            }
        }else{
            obj = {
                delIcon:false,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                editIcon:false, //编辑图标
                addIcon:false    //新增图标
            };
        }
        this.props.syncTree.hideIcon(this.props.config.treeId, key, obj );
    }

    //获取分类信息
    getTypeData(pk){
        ajax({
            url: '/nccloud/uapbd/suppliertype/query.do',
            data: {
                pk:pk
            },
            success: (result) => {
                // this.state.ajditem.config.show = false; 
                // this.setState(this.state); 
                this.props.form.setAllFormValue({ [this.props.config.typeFormId]: result.data[this.props.config.typeFormId] });
                // this.props.form.setFormItemsValue(this.props.config.typeFormId,result.data.supqualitype.rows[0].values);
            }
        });
    }

    onDelType(pk){
        ajax({
            url: '/nccloud/uapbd/suppliertype/del.do',
            data: {
                pk:pk
            },
            success: (result) => {
                this.props.syncTree.delNodeSuceess(this.props.config.treeId,pk);
                toast({title:this.state.json['10140SAQSG-000014'],color:"success"});/* 国际化处理： 删除成功！*/
            }
        });
    }
    onSaveType(){
        var formData = this.props.form.getAllFormValue(this.props.config.typeFormId).rows[0].values;
        
        ajax({
            url: '/nccloud/uapbd/suppliertype/save.do',
            data: {
                model: {
                    rows:[{
                        values: formData,
                        rowid: 0
                    }]
                },
                pageid : this.props.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            },
            success: (result) => {
                // this.state.ajditem.config.show = false; 
                // this.setState(this.state);
                this.props.modal.close('modalForm');
                if(!result.data.tree[0].children || result.data.tree[0].children.length == 0 ){
                    delete result.data.tree[0].children;
                }
                let tempTree = this.props.syncTree.getSyncTreeValue(this.props.config.treeId,result.data.tree[0].refpk);
                let method = result.data.tree[0].nodeData.method;
                if(method == 'add'){
                    //新增回调后添加
                    this.props.syncTree.addNodeSuccess(this.props.config.treeId,result.data.tree[0]);
                }else if(method == 'update'){
                    //修改回调后修改
                    this.props.syncTree.editNodeSuccess(this.props.config.treeId,result.data.tree[0]);
                }
            }
        });
    }

    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let { createButton,createButtonApp } = button;
        let buttons  = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {/* {status == 'browse' ?<div><span className="definition-search-title">详细信息 | 总计：</span>
                        <span className = 'count'>{this.state.totalcount}</span><span>条</span>
                    { <span>		申请数量 ：</span>
                        <span className='count'>{this.state.applycount}</span><span>个</span> }
                        </div>:<span className="definition-search-title"></span>} */}
                </div>
                <div className="definition-icons" style={{padding:0,verticalAlign:'middle'}}>
                    {/* {buttons.map( (v) =>{
                            if(v.btncode === 'addline'){
                                return (createButton(v.btncode, {
                                    name: v.btnname,
                                    onButtonClick: this.buttonClick.bind(this),
                                }))
                            }
                        })}  */}
                        {createButtonApp({
                                        area: 'card_body',//按钮注册中的按钮区域
                                        //buttonLimit: 5, 
                                        onButtonClick: this.onButtonClick.bind(this) 
                                        //popContainer: document.querySelector('.header-button-area')
                                    })}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                    {/* {createButton("deleteline", {
                        name: '删行',
                        onButtonClick: this.onButtonClick.bind(this)
                    })} */}
                </div>	
            </div>
        )
    }
    
    render(){
        //console.log("render");console.log(this);
        let { asyncTree,syncTree,table, button, search,editTable,form,DragWidthCom,cardTable,modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton } = button;
        let {NCFormControl,NCCheckbox} = base;
        let { createCardTable } = cardTable;
        let { createModal } = modal;
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const { createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const { Item } = Menu;
        const {createButtonApp}=button;
        let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      <Item key="1">{this.state.json['10140SAQSG-000050']/* 国际化处理： 过滤*/}</Item>
					  <Item key="2">{this.state.json['10140SAQSG-000051']/* 国际化处理： 启用*/}</Item>
					  <Item key="3">{this.state.json['10140SAQSG-000052']/* 国际化处理： 打印*/}</Item>
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
                    "pid":"",
                    "keyword":"",
                    disabled:this.state.disabledOrg,
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
        
        let createTreeButton = () => {
            if(this.props.config.nodetype && this.props.config.nodetype === 'group'){
                return (
                    <div style={{textAlign:'right',marginBottom:10}}>
                        <a style={{cursor:'pointer'}} id='typeadd' onClick={this.onButtonClick.bind(this,null,'typeadd')}>{this.state.json['10140SAQSG-000036']/* 国际化处理： 新增*/}</a>
                        &emsp;
                        <a style={{cursor:'pointer'}} id='typeedit' onClick={this.onButtonClick.bind(this,null,'typeedit')} >{this.state.json['10140SAQSG-000037']/* 国际化处理： 修改*/}</a>
                        &emsp;
                        <a style={{cursor:'pointer'}} id='typedel' onClick={this.onButtonClick.bind(this,null,'typedel')}>{this.state.json['10140SAQSG-000038']/* 国际化处理： 删除*/}</a>
                        &emsp;
                        <a style={{cursor:'pointer'}} id='typerefresh' onClick={this.onButtonClick.bind(this,null,'typerefresh')}>{this.state.json['10140SAQSG-000041']/* 国际化处理： 刷新*/}</a>
                    </div>
                );
            }
        };

        

        return (
            <div className='nc-bill-tree-card'>
                {/* 头部 header*/}
                <div className="header">
                    {createPageIcon()}
                    {/* 标题 title*/}
                    <div className="title">{this.state.json[this.props.config.nodeName]}</div>
                    {createOrgRender()}

                    {/* <NCModal {...this.state.ajditem.config}>
                    <NCModal.Header >
                        <NCModal.Title>资质分类维护界面</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        { createForm(this.props.config.typeFormId, {})}
                    </NCModal.Body> 
                    <NCModal.Footer>
                        <NCButton onClick={() => { this.state.ajditem.config.show = false; this.setState(this.state);}} shape="border" style={{marginRight: 50}}>关闭</NCButton>
                        <NCButton onClick={this.onSaveType.bind(this)} colors="primary">确认</NCButton>
                    </NCModal.Footer>
                    </NCModal> */}

                    { createModal('modalForm',{
                        title:this.state.json['10140SAQSG-000034'],/* 国际化处理： 资质分类维护界面*/
                        content:this.props.form.createForm(this.props.config.typeFormId),
                        userControl:true,//自己控制什么时候关闭窗口
                        cancelBtnClick:()=>{
                            this.props.modal.close('modalForm');
                        },
                        beSureBtnClick:this.onSaveType.bind(this)
                    }) }
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
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
                                        // disabled={this.state.showOffDisable}
                                        disabled={this.state.disabledShowoff}
									>{this.state.json['10140SAQSG-000055']/* 国际化处理： 显示停用*/}</NCCheckbox>
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
                </div>
                {/* 树卡区域 */}
                <div className="tree-card">
                <DragWidthCom
                         // 左树区域
                            leftDom ={<div className="tree-area">
                            {/* {createTreeButton()} */}
                            {createSyncTree({
                                treeId: this.props.config.treeId,
                                needEdit: true, //不启用编辑
                                showLine: false, //显示连线
                                needSearch: true, //是否需要搜索框
                                searchType: 'filtration',
                                onSelectEve: this.onTreeSelect.bind(this),
                                clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                showModal:false,
                                disabledSearch:this.state.disabledSearch || false,//这个用来控制搜索框是否可用；
                                //userDefine: this.domShowDisable.bind(this)
                            })}
                    </div>}
                    
                    // rightDom = {<div  id='nc-bill-card' style={{width:'calc(100% - 20px)'}} >
                    rightDom = {<div  id='nc-bill-card' style={{width:'100%'}} >
					<div className="nc-bill-card" style={{width:'100%'}}>
						<div className="nc-bill-form-area">
							{createForm(this.props.config.formId, {
                                onAfterEvent: this.afterEvent.bind(this),
                                cancelPSwitch:true
                            })}
						</div>
						<div className="nc-bill-table-area" style={{marginTop:0}}>
                            {/* <div className='nc-bill-header-area'>
                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'card_body',//按钮注册中的按钮区域
                                        //buttonLimit: 5, 
                                        onButtonClick: this.onButtonClick.bind(this) 
                                        //popContainer: document.querySelector('.header-button-area')
                                    })}
                                </div>
                            </div> */}
							{/* {this.getTableHead()} */}
							{createCardTable(this.props.config.tableId, {
                                tableHead: this.getTableHead.bind(this),
                                isAddRow: true,//失去焦点自动增行
								// modelSave: this.modelSave.bind(this),
                                // showIndex:true,
                                // onAfterEvent: this.cardTableAfterEventFn.bind(this), 
							})}
						</div>
						{createModal('delete', {
							title: this.state.json['10140SAQSG-000021'],/* 国际化处理： 注意*/
							content: this.state.json['10140SAQSG-000022'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.onDeleteConfirm.bind(this)
                        })}
                        {createModal('confirmModal', {
							title: this.state.json['10140SAQSG-000042'],/* 国际化处理： 注意*/
							content: this.state.json['10140SAQSG-000043']/* 国际化处理： 确认？*/
						})}
					</div>
                    <PrintOutput
                        ref='printOutput'
                        url={urls['print']}
                        data={{
                            funcode: '10140SAQSG',
                            nodekey:'print',
                            oids: this.state.pks,
                            outputType: 'output'
                        }}
                    />
            </div>}
            defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
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