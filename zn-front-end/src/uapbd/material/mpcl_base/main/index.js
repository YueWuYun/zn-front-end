//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, createPage, high, NCCreateSearch, print, promptBox, toast,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
import OrgSelect from "../component/org";
import MarpuClassTree from "../component/marpuclasstree";
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;

const {NCCheckbox, NCMessage,EmptyAreaTip} = base;
const {NCDiv} = base;
const { PrintOutput } = high;
const {ExcelImport} = high;

/****************默认参数  开始***********************/
let formId = 'marpuclass';//卡片组件Id
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/mpcl/MpclLoadTreeData.do",
    queryCardUrl:"/nccloud/uapbd/mpcl/MpclLoadFormData.do",
    enablestateUrl:"/nccloud/uapbd/mpcl/MpclEnablestate.do",
    addCardUrl:"/nccloud/uapbd/mpcl/MpclAddData.do",
    deleteUrl:'/nccloud/uapbd/mpcl/MpclDelTreeNode.do',
    saveUrl:'/nccloud/uapbd/mpcl/MpclSaveData.do',
    validateUrl:'/nccloud/uapbd/mpcl/MpclValiData.do',
    editUrl:'/nccloud/uapbd/mpcl/MpclEditData.do',
    cancelUrl:'/nccloud/uapbd/mpcl/MpclCancelData.do',
    print:'/nccloud/uapbd/mpcl/MpclPrintInfo.do',

};
let pageCode="10140MPCLG_list";//默认集团
let appCode="10140MPCLG";//默认集团
/***************默认参数  结束********************/

/**
 * 物料采购分类（mpcl）
 * @author xuehaoc
 */
export default class MarPuClass extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            title: "",
            treetitle: "",
            treeId:"marpuTree",
            formId:"marpuclass",
            pageCode:"10140MPCLG_list",
            appcode:'10140MPCLG',
            nodeType:'GROUP_NODE',
            primaryKey:'pk_marpuclass',
            urls:urls
        },props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":'10140MPCLG-000001',/* 国际化处理： 物料采购分类*/
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": '10140MPCLG-000001',/* 国际化处理： 物料采购分类*/
            "refpk": "~"
        };

        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.setTreeStatus = this.setTreeStatus.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);
        this.checkHasChildren = this.checkHasChildren.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty:true,
            checked: false,//判断 显示停用按钮是否选中
            showOffDisabl:true,
            disabledSearch:false,//搜索框是否禁用
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            curOrg:'',//当前组织
            formStatus:'browse',
            tree:{
                needEdit:true,
                showLine:false,
                needSearch:true,
                showModal:false,
            },
            oldParent:'',//原父节点
            isAdd:false,//新增标志  默认false
            pks:[],
            json:{}
        }
        this.initTemplate(this.props, () => {
            //修改按钮状态
            this.initButtonStatus();
            if(this.config.nodeType!='ORG_NODE'){
                ///不是业务单元节点，直接加载树节点数据
                this.loadTreeData();
            }else{
                //是业务单元节点
                if(!this.state.curOrg || this.state.curOrg == ''){
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData([Object.assign( {...this.root},{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]} )]));
                }else{
                    //this.initButtonStatus();
                    this.onOrgChange(this.state.curOrg);
                }
            }
        });

    }

    componentWillMount(){
    }

    initTemplate = (props, callback)=>{
        createUIDom(props)(
            {
                pagecode:props.config.pageCode?props.config.pageCode:pageCode
            },
            {
                moduleId: "10140MPCLG",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(meta, props);
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        props.button.setButtons(data.button);
                        props.button.setDisabled({
                            print: true,
                            output: true
                        });
                        let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.appcode,pagecode: props.config.pagecode_card},() =>{
                            if(this.config.nodeType!='ORG_NODE'){
                                ///不是业务单元节点，直接加载树节点数据
                                this.loadTreeData(()=>{toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/});
                            }else{
                                //是业务单元节点
                                if(!this.state.curOrg || this.state.curOrg == ''){
                                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData([Object.assign( {...this.root} ,{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]})]));
                                    toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/
                                }else{
                                    this.loadTreeData(()=>{toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/});
                                }
                            }
                            //修改按钮状态
                            this.initButtonStatus();
                            //刷新后选中的是根节点，设置停启用功能不可用
                            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true}) 
                        });
                        props.button.setUploadConfig("import",excelimportconfig);
                        props.button.setButtons(data.button);
                    }
                    if(data.context){
                        if(data.context.pk_org&&data.context.org_Name){
                            this.state.curOrg = {
                            refname: data.context.org_Name,
                            refpk:data.context.pk_org}
                        }
                    }
                    callback && callback();
                }
            }
        );

    }

    /**
     * 更新元数据 设置参照
     * @param meta
     * @param props
     * @returns {*}
     */
    modifierMeta(meta,props) {
        meta[formId].items.forEach((temp)=>{
            if(temp.attrcode == 'enablestate'){
                temp['disabled']=true;
            }else if(temp.attrcode == 'pk_father'){
                temp.queryCondition = ()=>{
                    return{
                        "pk_org":this.state.curOrg.refpk,
                    }
                }
            }
        });
        return meta;
    }

    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
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

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        // if(this.config.nodeType!='ORG_NODE'){
        //     ///不是业务单元节点，直接加载树节点数据
        //     this.loadTreeData();
        // }else{
        //     //是业务单元节点
        //     if(!this.state.curOrg || this.state.curOrg == ''){
        //         this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData([Object.assign( {...this.root} )]));
        //     }
        // }
        // //修改按钮状态
        // this.initButtonStatus();

    }

    componentDidUpdate(){
        //let formStatus = this.props.form.getFormStatus(this.config.formId);
        if(this.state.formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value){ //选择行政组织钩子
        if(value && value.hasOwnProperty('refpk')){

            this.state.curOrg = value;
            this.state.cardEmpty = false;
            this.setState(this.state);
            this.setReferMeta.call(this);
            this.loadTreeData();
        } else {
            this.setState({cardEmpty:true})
        }
    }

    setReferMeta(){
        if(this.props.meta.getMeta() && this.props.meta.getMeta().hasOwnProperty(this.config.formId)){
            this.props.meta.getMeta()[this.config.formId].items.map((temp)=>{
                if(temp.attrcode == 'parent_id'){
                    temp.refcode = "uapbd/refer/material/MaterialPuClassTreeRef/index.js";
                    if(this.props.config.nodeType == "ORG_NODE"){
                        temp.queryCondition=()=> {
                            return {
                                pk_org: this.state.curOrg.refpk,

                            };
                        }
                    }
                }
            })
        }
    }

    /**
     * 加载树节点数据
     */
    loadTreeData(callback){
        let requestParam = {
            isShowOff:this.state.checked,
            pk_curOrg:this.state.curOrg.refpk,//当前选择的组织pk
            nodeType:this.config.nodeType
        };

        ajax({

            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    if (this.props.config.nodeType !== 'ORG_NODE'){
                        if (result.data && result.data.length && result.data.length > 0){
                            this.setState({cardEmpty:false})
                        } else {
                            this.setState({cardEmpty:true})
                        }
                    }                    
                    let data = [Object.assign( {...this.root} ,{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]}, {children : result.data},{} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    this.props.syncTree.setNodeSelected(this.config.treeId, this.root.refpk);

                    this.setTreeStatus();
                    callback&&callback();
                }
            }
        });
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus(){
        //设置保存按钮不显示
        this.props.button.setButtonVisible(['save','cancel','saveAdd'],false);
    }

    /**
     * 设置树的状态
     */
    setTreeStatus(){
        this.props.syncTree.setNodeDisable(this.config.treeId,false);
        if(this.config.nodeType == 'ORG_NODE'){
            if(!this.state.curOrg || this.state.curOrg == ''){
                this.props.syncTree.setNodeDisable(this.config.treeId,true);//业务单元，没有组织情况下，设置整棵树不可用
            }else{
                this.props.syncTree.setNodeDisable(this.config.treeId,false);
            }
        }
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk,node){
        let status = this.props.form.getFormStatus(this.config.formId);
        if(status == 'edit'){
            return;
        }
        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true})
            this.props.button.setDisabled(["print","output"],true);
            return;
        }
        let requestParam = {
            pk_marpu:refpk,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType,
            moduleid:this.config.formId,
            pagecode:this.config.pageCode
        };
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:(result)=>{
                showFormular(this.props,result,{
                    "marpuclass" : "form",
                });
                if(result.success){
                    this.props.button.setDisabled({
                        print:false,
                        output:false
                    });
                    //表单数据
                    let headData = result.data[formId].rows[0].values;
                    if(headData.hasOwnProperty('enablestate')){
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if(enablestateValue == '2'){
                            result.data[formId].rows[0].values.enablestate.value = true;
                        }else{
                            result.data[formId].rows[0].values.enablestate.value = false;
                            result.data[formId].rows[0].values.enablestate.display = false;
                        }
                    }
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    setTimeout(() => {
                        this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':(this.props.config.nodeType==='ORG_NODE'&&node.nodeData['isGrp'])})
                    } ,0);

                    /************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
                    let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                    this.state.curSelectedNode = selectedTreeNode;
                    this.setState(this.state);
                }
                this.toggleShow("browse");
            }
        });
    }

    /**
     * 新增
     * @param selectNode
     */
    onAddMarpuClass(selectNode){
        this.state.curSelectedNode = selectNode;
        this.setState(this.state);
        let pk_father = this.root.refpk;
        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk
            pk_father = this.state.curSelectedNode.refpk;
        }
        if(this.config.nodeType=="ORG_NODE" && this.state.curOrg==""){
            toast({content: this.state.json['10140MPCLG-000002'],color: 'warning'});/* 国际化处理： 库存组织为空，不能增加！*/
            //NCMessage.create({content: '库存组织为空，不能增加！', color: 'warning'});
            return;
        }
        this.setState({cardEmpty:false})
        if(pk_father != this.root.refpk){
            if(selectNode.nodeData.enablestate != "2"){
                toast({content: this.state.json['10140MPCLG-000003'],color: 'warning'});/* 国际化处理： 上级已停用不能为其增加下级。*/
                //NCMessage.create({content: "上级已停用不能为其增加下级。", color: 'warning'});
                return;
            }
        }
        let requestParam = {
            pk_father:pk_father,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType,
            moduleid:this.config.formId,
            pagecode:this.config.pageCode
        };
        /******************************************************
         * 记录原父节点pk,移动树节点时使用
         ******************************************************/
        this.setState({oldParent:requestParam.pk_father});
        ajax({
            url:this.config.urls.addCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //清空表单数据
                    showFormular(this.props,result,{
                        "marpuclass" : "form",
                    });
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.props.form.setFormStatus(this.config.formId, 'add' );
                    //设置新增默认值
                    if(result.data['form'][this.config.formId].rows[0].values['pk_father'].display == " "){
                        result.data['form'][this.config.formId].rows[0].values['pk_father'].display = null;
                    }
                    utils.filterEmptyData(result.data['form'][this.config.formId].rows[0].values);
                    this.props.form.setAllFormValue({[this.config.formId]:result.data['form'][this.config.formId]});
                    setTimeout(() => {
                        this.props.form.setFormItemsDisabled(this.config.formId,{'code':!result.data['isCodeEdit']})
                    } ,0);
                    this.state.isAdd = true;
                    this.setState(this.state);
                    this.toggleShow("add");

                }
            }
        })



    }

    /**
     * 编辑：
     * @param selectedTreeNode
     */
    onEditMarpuClass(selectedTreeNode){
        debugger;
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        if (!this.state.curSelectedNode) {
            toast({content: this.state.json['10140MPCLG-000004'],color: 'warning'});/* 国际化处理： 请选中需要编辑的节点。*/
            //NCMessage.create({content: '请选中需要编辑的节点', color: 'warning'});//默认top
            return;
        }
        let requestParam = {
            primaryKey:this.state.curSelectedNode.refpk,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType,
            moduleid:this.config.formId,
            pagecode:this.config.pageCode,
            type:"edit"
        };
        /**************************************************
         * 记录父节点pk 移动树节点时使用
         **************************************************/
        this.setState({oldParent:this.state.curSelectedNode.pid,isAdd:false});
        ajax({
            url: this.config.urls.validateUrl,
            data: requestParam,
            success: (res) => {
                if (res.success && res.data) {
                    ajax({
                        url: this.config.urls.editUrl,
                        data: requestParam,
                        success: (res) => {
                            if (res.success && res.data) {
                                showFormular(this.props,res,{
                                    "marpuclass" : "form",
                                });
                                //设置表单数据
                                this.props.form.setAllFormValue({[this.config.formId]: res.data['form'][this.config.formId]});
                                setTimeout(() => {
                                    this.props.form.setFormItemsDisabled(this.config.formId, {'code': !res.data['isCodeEdit']})
                                } ,0);
                                //设置表单状态为编辑态
                                this.toggleShow("edit");
                            }
                        }
                    })
                }
            }
        })
    }

    checkHasChildren(tree,pk) {
        if(!tree){
            tree = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        }
        let i = tree.length;
        while (i--){
            let data = tree[i];
            if (data.refpk === pk) {
                if(data.hasOwnProperty('children')&&data['children']!=null && data.children.length === 0){
                    delete data.children;
                    data.isleaf = true;
                }
                return true;
            } else {
                if (data.hasOwnProperty('children')&&data['children']!=null) {
                    let res = this.checkHasChildren(data.children, pk);
                    if(res){
                        return false
                    }
                }
            }
        }
    }

    //按钮事件
    buttonClick(props, id) {
        switch (id) {
            case 'save':
                this.onSaveMarpuClass() ;
                break;
            case 'saveAdd':
                this.onSaveAddMarpuClass() ;
                break;
            case 'cancel':
                promptBox({
                    color:"warning",
                    title: this.state.json['10140MPCLG-000005'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10140MPCLG-000006'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: () => {
                        this.onCancelMarpuClass() ;
                    }
                })

                break;
            case 'refresh':
                if(this.config.nodeType!='ORG_NODE'){
                    ///不是业务单元节点，直接加载树节点数据
                    this.loadTreeData(()=>{toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/});
                }else{
                    //是业务单元节点
                    if(!this.state.curOrg || this.state.curOrg == ''){
                        this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData([Object.assign( {...this.root} ,{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]})]));
                        toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/
                    }else{
                        this.loadTreeData(()=>{toast({title:this.state.json['10140MPCLG-000023']});/* 国际化处理： 刷新成功！*/});
                    }
                }
                //修改按钮状态
                this.initButtonStatus();
                //刷新后选中的是根节点，设置停启用功能不可用
                this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true})       
                break;
            case "print":
                let printParam={
                    funcode: "10140MPCLG",
                    appcode:"10140MPCLG",
                    nodekey: '',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'output':
                let allDatas = this.props.syncTree.getSyncTreeValue(this.config.treeId)
                let pks = this.getTreeAllPks(allDatas);
                if(pks.length==0){
                    return
                }
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            default:
                break;
        }
    }

    //打印功能函数
    pintFunction(param){
        let allDatas = this.props.syncTree.getSyncTreeValue(this.config.treeId)
        let pks = this.getTreeAllPks(allDatas);
        if(pks.length==0){
            return
        }
        param.oids = pks;
        print(
            'pdf',
            urls['print'],
            param
        );
    }

    getTreeAllPks = (treeData)=>{
        let result = new Array();
        const loop = (treeData)=>{
            treeData.forEach(data=>{
                if(data.refpk!='~'){
                    result.push(data.refpk);
                }
                if(data.hasOwnProperty('children')&&data.children!=null && data.children.length>0){
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }


    /**************************************************
     *
     * 保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     *
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     *
     **************************************************/
    onSaveMarpuClass(){
        let flag = this.props.form.isCheckNow(this.config.formId);
        if(!flag)return
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        let requestParam = {
            model : formData,
            pageid : this.config.pageCode,
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = false;
        if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value)? false:true;
        }
        this.props.validateToSave( requestParam,()=>{
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        showFormular(this.props,result,{
                            "marpuclass" : "form",
                        });
                        this.props.button.setDisabled({
                            print:false,
                            output:false
                        });
                        if(!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        let isMove = false;
                        if(result.data.treeNodeData[0].pid!=this.state.oldParent){
                            isMove = true;
                        }
                        if(nonPk){
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }else{
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }
                        if(isMove){
                            this.props.syncTree.moveNode(this.config.treeId,result.data.treeNodeData[0].refpk,result.data.treeNodeData[0].pid)
                            this.checkHasChildren(null,this.state.oldParent);
                        }
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.form.setAllFormValue({[this.config.formId]:result.data.curFormData[this.config.formId]});
                        this.setState({curSelectedNode:null});
                        toast({title:this.state.json['10140MPCLG-000007']});/* 国际化处理： 保存成功！*/
                        this.toggleShow("browse");
                    }

                }
            });
        } , {"marpuclass":'form'} , 'form' )

    }

    /**************************************************
     *
     * 新增保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     *
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     *
     **************************************************/
    onSaveAddMarpuClass(){

        let selectedTreeNode = this.state.curSelectedNode;
        let requestParam= {};

        let flag = this.props.form.isCheckNow(this.config.formId);
        if(!flag)return

        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码

        requestParam = {
            model: formData,
            pageid: this.config.pageCode,
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 只能是新增，就刷新当前选中节点
         ************************************/
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value)?false:true;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        this.props.validateToSave( requestParam,()=>{
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        if(!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         *  新增回调后添加
                         **************************************************************/
                        if(nonPk){
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }else{
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }
                        toast({title:this.state.json['10140MPCLG-000007']});/* 国际化处理： 保存成功！*/
                        /**************************************************************
                         *  展开当前节点的父节点
                         **************************************************************/
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);

                        /**************************************************************
                         *  如果选中节点丢失，重置当前选中节点 保障性操作
                         **************************************************************/
                        if(!selectedTreeNode){
                            this.props.syncTree.setNodeSelected(this.config.treeId,result.data.treeNodeData[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                            this.setState({curSelectedNode:selectedTreeNode});
                        }
                        /**************************************************************
                         *  重新设置整棵树不可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId,true);
                        let requestParam = {
                            pk_father:this.state.curSelectedNode.refpk,
                            nodeType:this.config.nodeType,
                            pk_curOrg:this.state.curOrg.refpk,
                            moduleid:this.config.formId,
                            pagecode:this.config.pageCode
                        };
                        /**************************************************************
                         * 记录原父节点pk 移动时使用
                         **************************************************************/
                        this.setState({oldParent:requestParam.pk_father,isAdd:true});
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if(result.success){
                                    showFormular(this.props,result,{
                                        "marpuclass" : "form",
                                    });
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    this.props.form.setFormStatus(this.config.formId, 'add' );
                                    this.props.form.setAllFormValue({[this.config.formId]:result.data['form'][this.config.formId]});
                                    setTimeout(() => {
                                        this.props.form.setFormItemsDisabled(this.config.formId,{'code':!result.data['isCodeEdit']})
                                    } ,0);
                                    /**************************************************************
                                     * 回调成功后  设置新增标志
                                     * @type {boolean}
                                     **************************************************************/
                                    this.state.isAdd = true;
                                    this.setState(this.state);
                                    this.toggleShow("add");
                                }
                            }

                        })
                    }
                }
            });
        } , {"marpuclass":'form'} , 'form' )

    }

    /**
     *
     * 删除：
     *      1、根据选中的树节点做出相应的提示
     *      2、弹出删除确认提示
     *      3、构造请求参数
     *      4、ajax请求，后台执行删除
     *      5、回调，执行前台删除动作
     *
     * 删除状态下：
     *      清空表单对象数据，按钮全成Disabled状态
     *
     * @param selectedTreeNode
     */
    onDeleteMarpuClass(selectedTreeNode){
        if (!selectedTreeNode) {
            toast({content: this.state.json['10140MPCLG-000008'],color: 'warning'});/* 国际化处理： 请选中需要删除的节点*/
            //NCMessage.create({content: '请选中需要删除的节点', color: 'warning'});
            return;
        }
        if(selectedTreeNode.refpk == this.root.refpk){
            toast({content: this.state.json['10140MPCLG-000009'],color: 'warning'});/* 国际化处理： 根节点不能删除*/
            //NCMessage.create({content: '根节点不能删除', color: 'warning'});
            return;
        }
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        /**************************************************************
         * 请求参数对象
         **************************************************************/
        let requestParam = {
            primaryKey:selectedTreeNode.refpk,
            pk_curOrg:this.state.curOrg.refpk,
            ts:selectedTreeNode.nodeData.ts,
            nodeType:this.config.nodeType,
            moduleid:this.config.formId,
            pagecode:this.config.pageCode,
            type:"delete"
        };
        ajax({
            url:this.config.urls.validateUrl,
            data:requestParam,
            success:(result)=>{
                /**************************************************************
                 * 先校验有无删除权限，能删除在做下一步操作
                 **************************************************************/
                if(result.success && result.data){
                    promptBox({
                        color:"info",
                        title: this.state.json['10140MPCLG-000010'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140MPCLG-000011'],/* 国际化处理： 您确定要删除所选数据吗?*/
                        beSureBtnClick: ()=>{
                            promptBox({
                                color:"info",
                                title: this.state.json['10140MPCLG-000010'],/* 国际化处理： 确认删除*/
                                content: this.state.json['10140MPCLG-000012'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
                                beSureBtnClick: () => {
                                    ajax({
                                        url:this.config.urls.deleteUrl,
                                        data:requestParam,
                                        success:(result)=>{
                                            if(result.success){
                                                this.props.form.EmptyAllFormValue(this.config.formId);
                                                this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                                                if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0)) {
                                                    this.setState({cardEmpty:true})
                                                }
                                                toast({title:this.state.json['10140MPCLG-000013']});/* 国际化处理： 删除成功！*/
                                                this.toggleShow("browse");
                                            }

                                        }
                                    })
                                }
                            });
                        }
                    });
                }

            }
        });

    }

    /**********************************************************
     *
     * 取消：
     *      1、重新根据选中的树节点查询表单对象
     *      2、回调，设置表单对象
     *      3、设置按钮状态
     *
     **********************************************************/
    onCancelMarpuClass(){
        if (this.config.nodeType != 'ORG_NODE' && (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0)) {
            this.setState({cardEmpty:true})
        }
        let selectedTreeNode = this.state.curSelectedNode;
        this.props.form.EmptyAllFormValue(this.config.formId);
        let requestParam = {
            pk_curOrg:this.state.curOrg.refpk,
            primaryKey:selectedTreeNode.refpk,
            nodeType:this.config.nodeType,
            isAdd:this.state.isAdd,
            moduleid:this.config.formId,
            pagecode:this.config.pageCode,
        };
        if(selectedTreeNode){
            ajax({
                url:this.config.urls.cancelUrl,
                data:requestParam,
                success:(result)=>{
                    if(result.success){
                        showFormular(this.props,result,{
                            "marpuclass" : "form",
                        });
                        if(selectedTreeNode.refpk == '~'){
                            this.props.syncTree.setNodeSelected(this.config.treeId,selectedTreeNode.refpk);
                            this.toggleShow("browse");
                        }else {
                            this.props.form.setAllFormValue({[this.config.formId]: result.data[this.config.formId]});
                            this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
                            this.toggleShow("browse");
                        }
                    }
                }
            });
        }
    }

    /*****button group end*****/

    toggleShow = (status) =>{
        this.state.formStatus = status;
        let flag = status === 'browse' ? false : true;
        this.props.button.setButtonVisible(['save','cancel','saveAdd'],flag);
        this.props.button.setButtonVisible(['refresh','print','import'],!flag);
        this.props.button.setButtonVisible('saveAdd',status === 'add' ? true : false);
        this.setState({
            disabledSearch:flag,
            showOffDisable:flag,
        });
        this.props.form.setFormStatus(this.config.formId, status==='browse'?"browse" :"edit");
        this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':flag})
        this.props.syncTree.setNodeDisable(this.config.treeId,flag);
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key,node){
        let nodeType = this.props.config.nodeType;
        //设置
        if(key === this.root.refpk ||(nodeType==='ORG_NODE'&&node.nodeData['isGrp'])){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }else{
            let obj = {
                delIcon:true, //false:隐藏； true:显示; 默认都为true显示
                editIcon:true,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }

    }

    /**
     * checkbox change 事件
     * 是否显示停用
     */
    onCheckBoxChange(){
        this.setState({checked:!this.state.checked});
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
        if(this.config.nodeType!='ORG_NODE'||(this.state.curOrg && this.state.curOrg != '')){
            setTimeout(() => {
                this.loadTreeData();
            }, 10);
        }
    }

    onBeforeFormEvent(props, moduleId, key, value, data) {
        let formStatus = this.props.form.getFormStatus(formId)
        if (formStatus != 'edit' && !data.pk_marpuclass.value) {
            return false
        }

        return true;
    }

    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value,oldvalue, index){
        switch(key){
            case "enablestate":

                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

                if(!selectedTreeNode){
                    let content = value.value?this.state.json['10140MPCLG-000014']:this.state.json['10140MPCLG-000015'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    //NCMessage.create({content: content, color: 'warning'});//默认top
                    toast({content: content,color: 'warning'});
                    return;
                }
                let requestParam = {
                    primaryKey:selectedTreeNode.refpk,
                    enablestate:value.value?'2':'3',
                    pk_curOrg:this.state.curOrg.refpk,
                    ts:selectedTreeNode.nodeData.ts,
                    nodeType:this.config.nodeType,
                    moduleid:this.config.formId,
                    pagecode:this.config.pageCode,
                    type:value.value ? "enable" : "disable"
                };
                ajax({
                    url: this.config.urls.validateUrl,
                    data: requestParam,
                    success: (res) => {
                        if (res.success && res.data) {
                            promptBox({
                                color: "info",
                                title: this.state.json['10140MPCLG-000016'],/* 国际化处理： 提示*/
                                content: value.value ? this.state.json['10140MPCLG-000017'] : this.state.json['10140MPCLG-000018'],/* 国际化处理： 是否确认要启用？,您确定要要停用所选数据及其所有下级数据吗？*/
                                beSureBtnClick: () => {
                                    ajax({
                                        url: this.config.urls.enablestateUrl,
                                        data: requestParam,
                                        success: (result) => {
                                            /****
                                             * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                             * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                             */
                                            toast({title: value.value ? this.state.json['10140MPCLG-000019'] : this.state.json['10140MPCLG-000020']});/* 国际化处理： 启用成功！,停用成功！*/
                                        }
                                    });
                                },
                                cancelBtnClick: () => {
                                    props.form.setFormItemsValue(this.config.formId, {'enablestate': {value: !value.value}});
                                    return;
                                },
                                closeBtnClick: () => {
                                    props.form.setFormItemsValue(this.config.formId, {'enablestate': {value: !value.value}});
                                    return;
                                },
                            });
                        //     ajax({
                        //         url: this.config.urls.enablestateUrl,
                        //         data: requestParam,
                        //         success: (result) => {
                        //             /****
                        //              * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                        //              * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                        //              */
                        //             toast({content: value.value ? "启用成功" : "停用成功", title: "提示"});
                        //         }
                        //     });
                        }
                    },
                    error:(res)=>{
                        toast({content:res.message,color:"warning"});
                        props.form.setFormItemsValue(this.config.formId, {'enablestate': {value: !value.value}});
                    }
                })



                break;
            default:
                break;
        }
        //some code
    }

    addClickCall = () => {
        this.onAddMarpuClass(this.root);
    }

    /**
     * 渲染
     * @returns {*}
     */
    render(){
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const {syncTree,form,button,ncmodal,DragWidthCom,BillHeadInfo} = this.props;

        const {createSyncTree} = syncTree;//创建同步树 需要引入这个

        const {createForm} = form;//创建表单，需要引入这个

        const { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        const {cardEmpty} = this.state;

        let { createModal } = ncmodal;  //模态框

        let orgPermCondition=function(){
            return {
                AppCode:'10140MPCLO',
                GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }

        /**
         * 组织选择区 参数
         **/
        let orgParam = {
            curOrg:this.state.curOrg,
            onOrgChange:this.onOrgChange.bind(this),
            status:this.props.form.getFormStatus(this.config.formId),
            orgPermCondition:function(){
                return {
                    AppCode:'10140MPCLO',
                    GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            },
        };
        /**
         * 树参数
         **/
        let marpuTreeParam = {
            treeId :this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            onMouseEnterEve:this.onMouseEnterEve.bind(this),
            clickAddIconEve: this.onAddMarpuClass.bind(this), //新增点击 回调
            clickEditIconEve: this.onEditMarpuClass.bind(this), //编辑点击 回调
            clickDelIconEve: this.onDeleteMarpuClass.bind(this), // 删除点击 回调
            showModal:this.state.tree.showModal,
            disabledSearch:this.state.disabledSearch
        };
        return(
            <div className="nc-bill-tree-card">
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/* {createPageIcon()} */}
                    {/* 标题 title*/}
                    {/* <div className="title"  fieldid={this.config.appcode=="10140MPCLG"?this.state.json['10140MPCLG-000000']:this.state.json['10140MPCLG-000022']+"_title"}>{this.config.appcode=="10140MPCLG"?this.state.json['10140MPCLG-000000']:this.state.json['10140MPCLG-000022']国际化处理:物料采购分类-集团  物料采购分类-库存组织}</div> */}
                    <div className="title">
                    {createBillHeadInfo({
                         title : this.config.appcode=="10140MPCLG"?this.state.json['10140MPCLG-000000']:this.state.json['10140MPCLG-000022'], //国际化处理:物料采购分类-集团  物料采购分类-库存组织
                         initShowBackBtn:false
                    })}
                    </div>
                    {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                    {/*{this.renderOrgSearchArea.bind(this)}*/}
                    {this.config.nodeType == 'ORG_NODE' &&
                    <div className="search-box">
                        {/*组织选择区域*/}
                        <OrgSelect config={orgParam}/>
                    </div>
                    }
                    <span className="showOff">
                        <NCCheckbox
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            disabled={this.state.showOffDisable}
                            size="lg"
                        >
                            {this.state.json['10140MPCLG-000021']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
			        </span>
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom

                        // 左树区域
                        leftDom = {<MarpuClassTree treeConfig={marpuTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree }/>}

                        // 右卡片区域
                        rightDom = {
                            <div style={{ height: '100%' }}>
                            {this.config.nodeType != 'ORG_NODE' ? <EmptyAreaTip
                                type="btn"
                                desc={this.state.json['10140MPCLG-000024']}
                                onClick={this.addClickCall}
                                show={cardEmpty} /> : <EmptyAreaTip
                                    desc={this.state.json['10140MPCLG-000025']}
                                    show={cardEmpty} />}
                        <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>{
                            createForm(this.config.formId, {
                                onAfterEvent: this.onAfterFormEvent.bind(this),
                                onBeforeEvent: this.onBeforeFormEvent.bind(this),
                                cancelPSwitch:true})
                                }
                        </div>
                        </div> }

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '20%'
                        leftMinWid = '300px'
                    />
                </div>

                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode:'10140MPCLG',
                        nodekey:'',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.config.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.config.appcode}
                    pagecode={this.config.pageCode}
                 />
            </div>

        )
    }
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65