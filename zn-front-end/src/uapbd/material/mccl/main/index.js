//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print,high,promptBox,getMultiLang,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
import ReferSelect from '../components/ReferSelect';
import ClassTree from '../components/ClassTree';
const {NCCheckbox,NCMessage:Message,NCDiv,EmptyAreaTip } = base;
const {PrintOutput, ExcelImport} = high;
import Utils from '../../../public/utils/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';
//处理管控的问题：


/****************默认参数  开始***********************/
let formId = 'marcostclass';//卡片组件Id
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/mcclg/McclgLoadTreeData.do",
    queryCardUrl:"/nccloud/uapbd/mcclg/McclgLoadFormData.do",
    enablestateUrl:"/nccloud/uapbd/mcclg/McclgEDnableAction.do",
    addCardUrl:"/nccloud/uapbd/mcclg/McclgAddAction.do",
    deleteUrl:'/nccloud/uapbd/mcclg/McclgDeleteAction.do',
    saveUrl:'/nccloud/uapbd/mcclg/McclgSaveAction.do',
    validateUrl:'/nccloud/uapbd/mcclg/McclgManageModeAction.do',
    editUrl:'/nccloud/uapbd/mcclg/McclgEditAction.do',
    cancelUrl:'/nccloud/uapbd/mcclg/McclgCancelAction.do',
    printUrl:'/nccloud/uapbd/mcclg/MarCostClassPrint.do',
};
let pageCode="10140MCCLG_marcostclass";//默认集团
/***************默认参数  结束********************/

/**
 * 客户基本分类
 */
class Mccl extends Component {

    /**
     * 构造函数
     * @param props
     */
    constructor(props){

        super(props)

        //默认集团
        this.config =Object.assign({
            title: '',/* 国际化处理： 物料成本分类-集团*/
            treeId:"ClassTree",
            formId:"marcostclass",
            pageCode:"10140MCCLG_marcostclass",
            nodeType:'GROUP_NODE',
            refresh:'uapbd/material/mccl_grp/main/index.html',
            primaryKey:'pk_marcostclass',
            urls:urls,
            actions:{
                TreeNodeAdd:'TreeNodeAdd',
                TreeNodeEdit:'TreeNodeEdit',
                TreeNodeDel:'TreeNodeDel',
                Refresh:'Refresh',
                Save:'Save',
                Cancel:'Cancel',
                SaveAdd:'SaveAdd',
                print:'print',
                output:'output',
                export:'export'
            },//表单所有动作
        },props.config);



        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartClass = this.onStartClass.bind(this);
        this.onStopClass = this.onStopClass.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.setTreeStatus = this.setTreeStatus.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);
        this.checkHasChildren = this.checkHasChildren.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            cardEmpty:true,
            modeclassid : 'fbb3c484-63bc-4624-9f2e-3627221f0036',//这个用来处理管控模式
            printPks:[],//默认为空数组，当点击打印按钮的时侯，对这个东西赋值
            checked: false,//判断 显示停用按钮是否选中
            disabledShowOff:false,//禁用复选框
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            curOrg:{},
            tree:{
                needEdit:true,
                showLine:false,
                needSearch:true,
                showModal:false,
            },
            disabledSearch:false,//搜索框是否禁用
            oldParent:'',//原父节点
            isAdd:false,//新增标志  默认false
            json:{},
            inlt:null,
        }
        //为了多语在这里增加一句来判别title
        this.config.title=(this.config.nodeType ==='GROUP_NODE'?this.state.json['10140MCCLG-000000']:this.state.json['10140MCCLG-000001']);/* 国际化处理： 物料成本分类-集团,物料成本分类-业务单元*/
        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.config.title,
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.config.title,
            "refpk": "~",
            "nodeData":{},//{isLeaf:false},//增加一个属性用来标识是否时叶子节点；
        };
        this.initTemplate(this.props,
            ()=>{
                this.config.title=(this.config.nodeType ==='GROUP_NODE'?this.state.json['10140MCCLG-000000']:this.state.json['10140MCCLG-000001']);// 国际化处理： 物料成本分类-集团,物料成本分类-业务单元
                this.root.title = this.config.title;
                this.root.refname = this.config.title;
                this.initData.call(this);
                //修改按钮状态
                 this.initButtonStatus();
            })        

    }
/**
 * 单据模板
 * @param props
 */
initTemplate = (props,callback)=>{
    /**
     * 页面初始设置button状态
     * @param props
     */

    createUIDom(props)(
        {pagecode:this.config.pageCode},//appid:config.appid},//,appcode:config.appcode},
        {
            moduleId: "10140MCCLG",domainName: 'uapbd'
        },        
        (data,langData,inlt)=>{
            if(langData){
                this.state.json = langData
                if(inlt){
                    this.state.inlt = inlt
                }
            }
            if(data){
            if(data.template){
                props.meta.setMeta(data.template);
                this.setFormEnableStateProp(props);
            }
            if (data.button) {
                let excelimportconfig = excelImportconfig(props,'uapbd',this.config.billType,true,'',{appcode: this.config.appcode,pagecode: this.config.pageCode},()=>{
                    this.setState({
                        //checked: false,//判断 显示停用按钮是否选中,不管是否选中数据
                        curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
                        //curOrg:'',//当前组织
                        oldParent:'',//原父节点
                        isAdd:false,//新增标志  默认false
                    },()=>{
                        this.initData.call(this);
                        // this.OrgSelect.clearSelectedOrg();
                        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                        this.changeButtonStatus('','Refresh');
                        //toast({ color: 'success', title: this.state.json['10140MCCLG-000022'] });/* 国际化处理： 刷新成功！*/
                    });
                });
                props.button.setUploadConfig("import",excelimportconfig);
                props.button.setButtons(data.button);

            }
            let ccontext = data.context || {};
            if(this.config.nodeType == 'ORG_NODE'){
                if(ccontext.pk_org){
                    this.state.curOrg.refpk = ccontext.pk_org;
                    this.state.curOrg.refname = ccontext.org_Name;
                }
                this.setState(this.state);
            }
            callback && callback();
        }

        }
    );


}
/**
 * 初始元数据后 设置enablestate不可编辑
 */
 setFormEnableStateProp = (props)=>{
    //获得元数据
    let meta = props.meta.getMeta();
    //判断元数据中有我的表单元数据
    if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(this.config.formId)){
        //获得表单元数据
        let formMeta = props.meta.getMeta()[this.config.formId];
        //判断表单元数据有属性
        if(formMeta.hasOwnProperty("items")){
            //获得属性
            let items = formMeta.items;
            if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
                items.map((item)=>{
                    //查找enablestate属性
                    if(item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate'){
                        //设置enablestate属性不可用
                        props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                    }
                });
            }
        }
    }
}
    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.iconBox ={
                editIcon:true,
                addIcon:true,
                delIcon:true,
            };
            //node.isleaf = node.nodeData.isLeaf;//从服务端拿出来的数据
            if(!node.children || node.children.length == 0 ){//|| node.isleaf) {

                delete node.children;
            }
            else{
                //node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            e.iconBox={
                editIcon:true,
                addIcon:true,
                delIcon:true,
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    componentWillMount() {
        /*
        let callback = (json) => {
            this.setState({json})
            this.config.title=(this.config.nodeType ==='GROUP_NODE'?this.state.json['10140MCCLG-000000']:this.state.json['10140MCCLG-000001']);// 国际化处理： 物料成本分类-集团,物料成本分类-业务单元
            this.root.title = this.config.title;
            this.root.refname = this.config.title;
        }
        getMultiLang({moduleId: "10140MCCLG",domainName: 'uapbd',callback})
        */
    }
    
    componentDidUpdate(){//fix--增加编辑态离开按钮提醒20180925 added  by liusenc 
        //form如果是编辑态，关闭浏览器需要给你提示
        let formstatus = this.props.form.getFormStatus(this.config.formId);

        
        if((formstatus == undefined || formstatus == 'browse')){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
                };
        }
    }	
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        /*
        this.initData.call(this);
        //修改按钮状态
         this.initButtonStatus();
         */

    }
    initData(){
        if(this.config.nodeType!='ORG_NODE'){
            ///不是业务单元节点，直接加载树节点数据
            this.loadTreeData();
        }else{
            //是业务单元节点
            if(!this.state.curOrg || this.state.curOrg == '' || !this.state.curOrg.hasOwnProperty('refpk')){
                this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData([Object.assign( {...this.root} )]));
                this.props.syncTree.setNodeDisable(this.config.treeId,true);
                //禁用
                //this.state.disabledShowOff = true;
                this.setState(this.state)
            }else{
                this.loadTreeData();
            }
        }
        ;
    }
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value){ //选择行政组织钩子
        if (value && value.refpk){
            this.state.cardEmpty = false;
        } else {
            this.state.cardEmpty = true
        }
        this.state.curOrg = value;
        //this.state.disabledShowOff = !value || value == '' || !value.hasOwnProperty("refpk");
        this.setState(this.state,()=>{
            this.state.disabledShowOff?this.initData():this.loadTreeData();
        });
    }
    /*
    *获取所有的树上的pks
    */
   getTreePk(p_treeObj){
    let pks = [];
    //在这里加一下当前选中的组织信息，用来做查询；
    pks.push(this.state.curOrg.refpk);
    for(let i = 0; i < p_treeObj.length; i++){
        pks.push(p_treeObj[i].refpk);
        let children = p_treeObj[i].children;
        if(children != null && children.length > 0){
            pks = pks.concat(this.getTreePk(children));
        }
    }
    return pks;
}
    /**
     * 加载树节点数据
     */
    loadTreeData(){
        /*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string,nodeType:string}}
         *****************************************************************/
        let requestParam = {
            isShowOff:this.state.checked,
            pk_curOrg:this.state.curOrg.refpk,//当前选择的组织pk
            nodeType:this.config.nodeType,
            primaryKey:'~',//异步树处理同步数据；
        };

        /*****************************************************************
         * ajax请求 加载树数据
         * @param url:请求树数据url,data: requestParam, success:回调
         *****************************************************************/
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
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);

                    this.setTreeStatus();
                    //把树的所有pks加载进去：
                    if(result.data !== undefined && result.data !== null && result.data.length > 0){
                        this.state.printPks = this.getTreePk(result.data);
                    }                    
                    //禁用
                    //this.state.disabledShowOff = false;
                    this.setState(this.state);
                }
            }
        });
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus(){

        this.props.button.setButtonsVisible({
            Save:false,
            Cancel:false,
            SaveAdd:false,
            Refresh:true,
            print:true,
            output:true,

        });
        this.props.button.setDisabled({
            print:true,
            output:true}//默认情况下打印和输出按钮是不可用的
        );
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
    /*
    onTreeExpand(expandedKeys,info){
        //在这里判断一下是否选中了库存组织和仓库，若未曾选中，直接返回；
        if(this.config.nodeType === 'ORG_NODE' && !this.state.curOrg.refpk){
            return;
        }
          
     if(info.expanded){
         
          // ajax 请求选择的树节点数据,因为是异步树，所以在这里在请求一下异步树的数据；
          
         let requestParam = {
            isShowOff:this.state.checked,
            primaryKey:info.node.props.refpk,//异步树处理；
            pk_curOrg:this.state.curOrg.refpk,//当前选择的组织pk
            nodeType:this.config.nodeType
         };
         ajax({
             url:this.config.urls.loadTreeDataUrl,
             data:requestParam, 
             success:function(res){
                 if(res.success){
                     if(res.data ){//说明有数据；
                         let selectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId,info.node.props.refpk);
                         selectedNode.children = [];
                         this.props.syncTree.addNodeSuccess(this.config.treeId,this.dealTreeData(res.data));
                         this.props.syncTree.openNodeByPk(this.config.treeId,info.node.props.refpk);
                         this.state.curSelectedNode = selectedNode;
                         this.setState(this.state);
                     }
                 }
 
             }.bind(this),           
         });
     }
    }
    */
    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk,node){
        if(this.checkTreeNodeIsDisabled(this.props.syncTree.getSyncTreeValue(this.config.treeId,refpk))){
            return;
        }
        /******************************************************
         * 获得表单状态
         ******************************************************/
        let status = this.props.form.getFormStatus(this.config.formId);
        /******************************************************
         * 编辑态  树节点操作无效
         ******************************************************/
        if(status == 'edit'){
            return;
        }
        /******************************************************
         * 判断点击的是否是根节点
         ******************************************************/
        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
			this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
            this.props.button.setDisabled({
                print:true,
                output:true}//默认情况下打印和输出按钮是不可用的
            );                  
            return;
        }
        /******************************************************
         * 请求参数
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         ******************************************************/
        let requestParam = {
            isShowOff:this.state.checked,
            primaryKey:refpk,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType
        };
        /******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:function(result){
                if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                    this.props.dealFormulamsg(result.formulamsg,
                        {
                            "marcostclass":"form",
                        })
                }                

                if(result.success){

/*
                    if(result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')){

                        var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                        if(!!enablestateObj){
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                        }

                    }
                    */
                   if(result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')){

                    var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                    if(!!enablestateObj){
                        result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                    }

                }

                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    //设置表单项enablestate可用
                    //this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                    this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':(this.props.config.nodeType==='ORG_NODE'&&node.nodeData['isGrp'])})

                    /************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
                    let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                    this.state.curSelectedNode = selectedTreeNode;
                    //这个事件需要重置一下打印和输出按钮的可用与否
                    /*
                    this.props.button.setDisabled({
                        print:false,
                        output:false}//默认情况下打印和输出按钮是不可用的
                    );
                    */
                   this.changeButtonStatus(selectedTreeNode,'select');                    
                    this.setState(this.state);
                }
            }.bind(this),
        });
    }

    /**
     * 新增
     * @param selectNode
     */
    onAddClass(selectNode){
        if(this.checkTreeNodeIsDisabled(selectNode)){
            return;
        }
        if(this.config.nodeType=="ORG_NODE" && !this.state.curOrg.refpk){
            Message.create({content: this.state.json['10140MCCLG-000002'], color: 'warning'});/* 国际化处理： 业务单元为空，不能增加！*/
            return;
        }   		
        /******************************************************
         * 设置当前选中节点
         ******************************************************/
        this.state.cardEmpty = false;
        this.state.curSelectedNode = selectNode;
        this.setState(this.state);

        /******************************************************
         * 父键
         * @type {string}
         ******************************************************/
        let parent_id = this.root.refpk;
        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk
            parent_id = this.state.curSelectedNode.refpk;
        }

        /******************************************************
         * 请求参数对象
         ******************************************************/
        let requestParam = {
            parent_id:parent_id,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType,
        };
        /******************************************************
         * 记录原父节点pk,移动树节点时使用
         ******************************************************/
        this.setState({oldParent:requestParam.parent_id});
        ajax({
            url:this.config.urls.addCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'add');
                    //表单数据
                    let FormData = result.data.FormData;
                    let CanEdit = result.data.CanEdit;
                    let headData = FormData[this.config.formId].rows[0].values;
                    if(headData.hasOwnProperty('enablestate')){
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        /*
                        if(enablestateValue == '2'){
                            result.data[this.config.formId].rows[0].values.enablestate.value = true;
                            result.data[this.config.formId].rows[0].values.enablestate.display = true;
                        }else{
                            result.data[this.config.formId].rows[0].values.enablestate.value = false;
                            result.data[this.config.formId].rows[0].values.enablestate.display = false;
                        }
                        */
                       /*
                       var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                       if(!!enablestateObj){
                           result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                       }
                       */
                    }
                    if(headData['pk_father'] && headData['pk_father'].display ==" " ){
                        headData['pk_father'].display = null;
                    }
                    Utils.filterEmptyData(FormData[this.config.formId].rows[0].values);
                    //设置新增默认值
                    this.props.form.setAllFormValue({[this.config.formId]:FormData[this.config.formId]});

                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true,code:!CanEdit});

                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                    //新增成功，设置按钮状态
                    this.changeButtonStatus(selectNode,this.config.actions.TreeNodeAdd);

                    /*******************************
                     * 回调成功后  设置新增标志
                     * @type {boolean}
                     *******************************/
                    this.state.isAdd = true;
                    this.state.disabledShowOff = true;
                    this.setState(this.state);

                }
            }
        })



    }

    /**
     * 编辑：
     *      1、构造请求参数
     *      2、ajax请求，后台查询需要编辑的对象
     *      3、回调，设置表单数据为编辑的对象
     *
     * 编辑状态下：
     *      只有 保存  取消 按钮 显示
     * @param selectedTreeNode
     */
    onEditClass(selectedTreeNode){
        if(this.checkTreeNodeIsDisabled(selectedTreeNode)){
            return;
        }
        /******************************************************
         * 设置当前选中节点
         ******************************************************/
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        /**************************************************
         * 未选中提示
         **************************************************/
        if (!this.state.curSelectedNode) {
            Message.create({content: this.state.json['10140MCCLG-000003'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }
        /**************************************************
         * 请求参数对象
         * @type {{primaryKey: *, pk_curOrg: *, nodeType: *}}
         **************************************************/
        let requestParam = {
            primaryKey:this.state.curSelectedNode.refpk,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType
        };
        /**************************************************
         * 记录父节点pk 移动树节点时使用
         **************************************************/
        this.setState({oldParent:this.state.curSelectedNode.pid,isAdd:false});
        ajax({
            url:this.config.urls.validateUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success && res.data){
                    ajax({
                        url:this.config.urls.editUrl,
                        data:requestParam,
                        success:(result)=>{

                            if(result.success){
                                let FormData = result.data.FormData;
                                let CanEdit = result.data.CanEdit;                                
                                this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用

                                /*
                                if(Utils.checkHasProps(this.props.meta.getMeta(),this.config.formId,'enablestate')){
                                    if(FormData[this.config.formId].rows[0].values.enablestate.value == '2'){
                                        FormData[this.config.formId].rows[0].values.enablestate.value = true;
                                        FormData[this.config.formId].rows[0].values.enablestate.display = true;
                                    }else{
                                        FormData[this.config.formId].rows[0].values.enablestate.value = false;
                                        FormData[this.config.formId].rows[0].values.enablestate.display = false;
                                    }
                                }
                                */

                               /*
                                var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                if(!!enablestateObj){
                                    result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                }
                                */
                                //设置表单数据
                                this.props.form.setAllFormValue({[this.config.formId]:FormData[this.config.formId]});
                                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true,code:!CanEdit});//设置表单项不可用
                                //设置表单状态为编辑态
                                this.props.form.setFormStatus(this.config.formId, 'edit');
                                this.changeButtonStatus(this.state.curSelectedNode,this.config.actions.TreeNodeEdit);
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

    checkHasChildren(tree,pk) {
        if(!tree){
            tree = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        }
        let i = tree.length;
        while (i--){
            let data = tree[i];
            if (data.refpk === pk) {
                if(data.hasOwnProperty('children') && data.children.length === 0){
                    delete data.children;
                    data.isleaf = true;
                }
                return true;
            } else {
                if (data.hasOwnProperty('children')) {
                    let res = this.checkHasChildren(data.children, pk);
                    if(res){
                        return false
                    }
                }
            }
        }
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
    onSaveClass(){
        /**************************************************************
         * 获得表单数据
         **************************************************************/
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        /**************************************************************
         *  请求参数对象
         **************************************************************/

        if(formData.rows[0].values.hasOwnProperty('enablestate')){

            var enablestateObj = Utils.convertEnableState(formData.rows[0].values['enablestate'],'db');
            if(!!enablestateObj){
                formData.rows[0].values['enablestate'] = enablestateObj;
            }

        }

        let requestParam = {
            "model" : formData,
            "pageid" : this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            "nodeType":this.config.nodeType,
            "pk_curOrg":this.state.curOrg.refpk || ""
        };
        /**************************************************************
         *  没有主键  false时就是有主键  即编辑 即刷新父节点
         **************************************************************/
        let nonPk = false;
        if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value)? false:true;
        }
        this.props.validateToSave({"model" : formData,"pageid" : this.config.pageCode},()=>{
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
    
                        /**************************************************************
                         *  设置树可用
                         **************************************************************/
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        /**************************************************************
                         * 去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                         **************************************************************/
                        if(!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        /**************************************************************
                         * 是否是移动节点
                         **************************************************************/
                        let isMove = false;
                        if(result.data.treeNodeData[0].pid!=this.state.oldParent){
                            isMove = true;
                        }
                        /**************************************************************
                         * 判断是新增还是编辑
                         **************************************************************/
                        if(nonPk){
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }else{
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        }
                        /**************************************************************
                         * 移动树节点  并且检查原父节点没有子节点时去除'>'符号
                         **************************************************************/
                        if(isMove){
                            this.props.syncTree.moveNode(this.config.treeId,result.data.treeNodeData[0].refpk,result.data.treeNodeData[0].pid)
                            //this.checkHasChildren(null,this.state.oldParent);
                        }
                        /**************************************************************
                         * 展开当前树节点
                         **************************************************************/
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        /**************************************************************
                         * 设置新增节点为选中节点
                         **************************************************************/
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
                        /**************************************************************
                         * 设置表单为浏览态
                         **************************************************************/
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        /**************************************************************
                         * 清空表单数据
                         **************************************************************/
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        /**************************************************************
                         * 重置表单数据为当前选中节点的表单数据
                         **************************************************************/
                        result.data.curFormData[this.config.formId].rows[0].values['enablestate'] =
                            Utils.convertEnableState(result.data.curFormData[this.config.formId].rows[0].values['enablestate'],'form');                    
                         this.props.form.setAllFormValue({[this.config.formId]:result.data.curFormData[this.config.formId]});
                        /**************************************************************
                         * 设置enablestate属性为可用状态
                         **************************************************************/
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                        /**************************************************************
                         * 设置按钮状态
                         **************************************************************/
                        this.changeButtonStatus(this.state.curSelectedNode,this.config.actions['Save']);
                        /**************************************************************
                         * 清空选中节点的缓存
                         **************************************************************/
                         toast({title : this.state.json['10140MCCLG-000004'],color : 'success'});/* 国际化处理： 保存成功！*/
                        this.setState({curSelectedNode:null});
                        this.state.disabledShowOff = false;
                        this.setState(this.state);
                    }
    
                }
            });
        },{'marcostclass':'form'},'form')



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
    onSaveAddClass(){
        let selectedTreeNode = this.state.curSelectedNode;
        let requestParam= {};
        /**************************************************************
         *  获得表单数据
         **************************************************************/
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        if(formData.rows[0].values.hasOwnProperty('enablestate')){

            var enablestateObj = Utils.convertEnableState(formData.rows[0].values['enablestate'],'db');
            if(!!enablestateObj){
                formData.rows[0].values['enablestate'] = enablestateObj;
            }

        }
        /**************************************************************
         *  请求参数对象
         **************************************************************/
        requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType:this.config.nodeType,
            pk_curOrg:this.state.curOrg.refpk
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            nonPk = (!!formData.rows[0].values[this.config.primaryKey].value)?false:true;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        /**************************************************************
         *  ajax请求
         **************************************************************/
        ajax({
            url: this.config.urls.saveUrl,
            data: requestParam,
            success: (result) => {
                if(result.success){
                    /**************************************************************
                     *  设置表单为浏览态
                     **************************************************************/
                    this.props.form.setFormStatus(this.config.formId, 'browse');

                    /**************************************************************
                     *  去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                     **************************************************************/
                    if(!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0 ){
                        delete result.data.treeNodeData[0].children;
                    }
                    /**************************************************************
                     *  新增回调后添加
                     **************************************************************/
                    this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
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

                    /**************************************************************
                     * 请求参数对象
                     **************************************************************/
                    let requestParam = {
                        parent_id:this.state.curSelectedNode.refpk,
                        nodeType:this.config.nodeType,
                        pk_curOrg:this.state.curOrg.refpk
                    };
                    /**************************************************************
                     * 记录原父节点pk 移动时使用
                     **************************************************************/
                    this.setState({oldParent:requestParam.parent_id,isAdd:true});
                    ajax({
                        url: this.config.urls.addCardUrl,
                        data: requestParam,
                        success: (result) => {
                            if(result.success){
                                let FormData = result.data.FormData;
                                let CanEdit = result.data.CanEdit;
                                /**************************************************************
                                 * 清空表单数据
                                 **************************************************************/
                                this.props.form.EmptyAllFormValue(this.config.formId);
                                /**************************************************************
                                 * 重置表单数据
                                 **************************************************************/
                                    //表单数据
                                    /*
                                let headData = result.data[this.config.formId].rows[0].values;
                                if(headData.hasOwnProperty('enablestate')){
                                    let enablestateValue = headData.enablestate.value;
                                    //根据表单项enablestate的值修改开关状态
                                    if(enablestateValue == '2'){
                                        result.data[this.config.formId].rows[0].values.enablestate.value = true;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = true;
                                    }else{
                                        result.data[this.config.formId].rows[0].values.enablestate.value = false;
                                        result.data[this.config.formId].rows[0].values.enablestate.display = false;
                                    }
                                }
                                */
                               /*
                                var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                if(!!enablestateObj){
                                    result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                }
                                */
                                this.props.form.setFormStatus(this.config.formId, 'edit');
                                let headData = FormData[this.config.formId].rows[0].values;
                                if(headData['pk_father'] && headData['pk_father'].display ==" " ){
                                    headData['pk_father'].display = null;
                                }                                
                                this.props.form.setAllFormValue({[this.config.formId]:FormData[this.config.formId]});
                                //设置表单项不可用
                                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true,code:!CanEdit});//同时设置一下成本编码是否可编辑；                                 
                                /**************************************************************
                                 * 设置表单为编辑态
                                 **************************************************************/
                                
                                /**************************************************************
                                 * 重新设置按钮状态
                                 **************************************************************/
                                this.changeButtonStatus(selectedTreeNode,this.config.actions['SaveAdd']);
                                /**************************************************************
                                 * 回调成功后  设置新增标志
                                 * @type {boolean}
                                 **************************************************************/
                                this.state.isAdd = true;
                                this.setState(this.state);
                            }
                        }

                    })
                }


            }
        });


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
    onDeleteClass(selectedTreeNode){
        if(this.checkTreeNodeIsDisabled(selectedTreeNode)){
            return;
        }
        /**************************************************************
         * 保障性操作
         **************************************************************/
        if (!selectedTreeNode) {
            Message.create({content: this.state.json['10140MCCLG-000005'], color: 'warning'});/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        /**************************************************************
         * 根节点不能删除
         **************************************************************/
        if(selectedTreeNode.refpk == this.root.refpk){
            Message.create({content: this.state.json['10140MCCLG-000006'], color: 'warning'});/* 国际化处理： 根节点不能删除*/
            return;
        }
        /**************************************************************
         * 设置当前选中节点
         **************************************************************/
        this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state);
        /**************************************************************
         * 请求参数对象
         **************************************************************/
        let requestParam = {
            primaryKey:selectedTreeNode.refpk,
            pk_curOrg:this.state.curOrg.refpk,
            ts:selectedTreeNode.nodeData.ts,
            nodeType:this.config.nodeType
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
                        title: this.state.json['10140MCCLG-000007'],/* 国际化处理： 确认删除*/
                        color:'warning',                    
                        content: this.state.json['10140MCCLG-000008'],/* 国际化处理： 您确定要删除所选数据吗?*/
                        beSureBtnClick: ()=>{
                            promptBox({
                                title: this.state.json['10140MCCLG-000007'],/* 国际化处理： 确认删除*/
                                color:'warning',
                                content: this.state.json['10140MCCLG-000009'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
                                beSureBtnClick: () => {
                                    ajax({
                                        url:this.config.urls.deleteUrl,
                                        data:requestParam,
                                        success:(result)=>{
                                            if(result.success){
                                                /**************************************************************
                                                 * 清空表单数据
                                                 **************************************************************/
                                                this.props.form.EmptyAllFormValue(this.config.formId);
                                                /**************************************************************
                                                 * 删除树节点
                                                 **************************************************************/
                                                this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                                                /**************************************************************
                                                 * 适配含树页面缺省状态
                                                 **************************************************************/
                                                if (this.config.nodeType !== "ORG_NODE"){
                                                    if (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0){
                                                        this.setState({cardEmpty:true})
                                                    }
                                                }
                                                /**************************************************************
                                                 * 删除成功提示
                                                 **************************************************************/
                                                toast({title:this.state.json['10140MCCLG-000010'],color: 'success'});/* 国际化处理： 删除成功！*/
                                                /**************************************************************
                                                 * 重新设置按钮状态
                                                 **************************************************************/
                                                this.changeButtonStatus(selectedTreeNode,this.config.actions.TreeNodeDel);
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
    onCancelClass(){

        promptBox({
            color:'warning',
            title: this.state.json['10140MCCLG-000011'],/* 国际化处理： 确认取消*/
            content: this.state.json['10140MCCLG-000012'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick:()=>{
        /**********************************************************
         * 获得选中的树节点
         **********************************************************/
        // let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        /**********************************************************
         * 没有选中节点 以当前操作的节点作为选中节点
         **********************************************************/
        let selectedTreeNode = this.state.curSelectedNode;
        /**********************************************************
         * 清空表单数据
         **********************************************************/
        this.props.form.EmptyAllFormValue(this.config.formId);
        /**********************************************************
         * 设置表单项enablestate不可用
         **********************************************************/
        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
        /**********************************************************
         * 请求参数对象
         * @type {{pk_curOrg: *, primaryKey: *, nodeType: *, isAdd: boolean}}
         **********************************************************/
        let requestParam = {
            pk_curOrg:this.state.curOrg.refpk,
            primaryKey:selectedTreeNode.refpk,
            nodeType:this.config.nodeType,
            isAdd:this.state.isAdd,
        };
        if(selectedTreeNode){
            if(selectedTreeNode.refpk == '~'){
                /**********************************************************
                 * 设置树节点选中项
                 **********************************************************/
                this.props.syncTree.setNodeSelected(this.config.treeId,selectedTreeNode.refpk);
                /**********************************************************
                 * 设置表单状态
                 **********************************************************/
                this.props.form.setFormStatus(this.config.formId, 'browse');
                /**********************************************************
                 * 设置树可用
                 **********************************************************/
                this.props.syncTree.setNodeDisable(this.config.treeId,false);
                /**********************************************************
                 * 设置enablestate可用
                 **********************************************************/
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                /**********************************************************
                 * 设置按钮状态
                 **********************************************************/
                this.changeButtonStatus(selectedTreeNode,this.config.actions['Cancel']);
            }else{
                //查询节点信息
                ajax({
                    url:this.config.urls.cancelUrl,
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            /**********************************************************
                             * 重置表单数据
                             **********************************************************/
                            this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                            /**********************************************************
                             * 设置树节点选中项
                             **********************************************************/
                            this.props.syncTree.setNodeSelected(this.config.treeId,selectedTreeNode.refpk);
                            /**********************************************************
                             * 设置表单状态
                             **********************************************************/
                            this.props.form.setFormStatus(this.config.formId, 'browse');
                            /**********************************************************
                             * 设置树可用
                             **********************************************************/
                            this.props.syncTree.setNodeDisable(this.config.treeId,false);
                            /**********************************************************
                             * 设置enablestate可用
                             **********************************************************/
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                            /**********************************************************
                             * 设置按钮状态
                             **********************************************************/
                            this.changeButtonStatus(selectedTreeNode,this.config.actions['Cancel']);
                        }
                    }
                });
            }
            if (this.config.nodeType !== "ORG_NODE"){
                if (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0){
                    this.state.cardEmpty = true;
                }
            }
            this.state.disabledShowOff = false;
            this.setState(this.state);

        }

            }});



    }

    /**
     * 启用
     */
    onStartClass(){
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};
        /**************************************************
         *
         * 启用/停用
         *      1、判断选中树节点的状态，做出相应的提示
         *      2、构造请求参数
         *      3、ajax请求，后台执行更新
         *
         * 启用/停用状态下：
         *      按钮的可见性和可操作性不变
         *
         *
         **************************************************/

        if(!selectedTreeNode){

            Message.create({content: this.state.json['10140MCCLG-000013'], color: 'warning'});//默认top/* 国际化处理： 请选中需要启用的树节点*/
        }else if(formData.rows[0].values.enablestate.value == '2'){
            Message.create({content: this.state.json['10140MCCLG-000014'], color: 'warning'});//默认top/* 国际化处理： 该数据已启用，无需多次启用*/
            return;
        }
        requestParam = {
            primaryKey:formData.rows[0].values[this.config.primaryKey].value,
            enablestate:'2',
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType
        };
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                //启用成功，设置表单数据
                this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                this.changeButtonStatus('','Start');
            }
        });

    }

    /**
     * 停用
     */
    onStopClass(){
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if(!selectedTreeNode){

            Message.create({content: this.state.json['10140MCCLG-000015'], color: 'warning'});//默认top/* 国际化处理： 请选中需要停用的树节点*/
        }else if(formData.rows[0].values.enablestate.value == '1'){
            Message.create({content: this.state.json['10140MCCLG-000016'], color: 'warning'});//默认top/* 国际化处理： 该数据已停用，无需多次停用*/
            return;
        }
        requestParam = {
            primaryKey:formData.rows[0].values[this.config.primaryKey].value,
            enablestate:'1',
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType
        }

        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success){

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.changeButtonStatus('','Stop');
                }
            }
        });

    }

    /*****button group end*****/

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode,id){

        switch(id){
            case this.config.actions.TreeNodeAdd:
            case this.config.actions.SaveAdd:
                this.props.button.setButtonsVisible({
                    Refresh:false,
                    Save:true,
                    SaveAdd:true,
                    Cancel:true,
                    print:false,
                    import:false,
                    output:false
                })

                this.props.button.setDisabled({
                    Save:false,
                    SaveAdd:false,
                    Cancel:false
                });
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                this.state.disabledSearch = true;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case this.config.actions.TreeNodeEdit:
            this.props.button.setButtonsVisible({
                Refresh:false,
                Save:true,
                SaveAdd:true,
                Cancel:true,
                print:false,
                import:false,
                output:false
            })


                this.props.button.setDisabled({
                    Save:false,
                    Cancel:false,
                    SaveAdd:true,
                });
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                this.state.disabledSearch = true;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case this.config.actions.TreeNodeDel:
            this.props.button.setButtonsVisible({
                Refresh:true,
                Save:false,
                SaveAdd:false,
                Cancel:false,
                print:true,
                import:true,
                output:true
            })
            this.props.button.setDisabled({
                Refresh:false,
                print:true,
                import:false,
                output:true,
            });   

                //--this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                break;
            case this.config.actions.Save:
            case this.config.actions.Cancel:
            this.props.button.setButtonsVisible({
                Refresh:true,
                Save:false,
                SaveAdd:false,
                Cancel:false,
                print:true,
                import:true,
                output:true
            })
            this.props.button.setDisabled({
                Refresh:false,
                print:false,
                import:false,
                output:false,
            });            
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                this.state.disabledSearch = false;//在这里添加一下树搜索框禁用的控制
                this.setState(this.state);
                break;
            case 'select' :
            case 'Start' :
            case 'Stop' :
            this.props.button.setButtonsVisible({
                Refresh:true,
                Save:false,
                SaveAdd:false,
                Cancel:false,
                print:true,
                import:true,
                output:true
            })
            this.props.button.setDisabled({
                Refresh:false,
                print:false,
                output:false,
            });
                break;
                case 'Refresh':
                this.props.button.setButtonsVisible({
                    Refresh:true,
                    Save:false,
                    SaveAdd:false,
                    Cancel:false,
                    print:true,
                    import:true,
                    output:true
                })
                this.props.button.setDisabled({
                    Refresh:false,
                    print:true,
                    import:false,
                    output:true,
                });
                    break;                
            default :
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key,node){
        //设置
        if(key === this.root.refpk || (this.props.config.nodeType ==='ORG_NODE' && node.nodeData['isGrp'])){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }else{
            let obj = {
                delIcon:true,
                editIcon:true,
                addIcon:true,
            };
            this.props.syncTree.hideIcon(this.config.treeId,key,obj);
        }

    }

    /**
     * checkbox change 事件
     */
    onCheckBoxChange(){
        if(this.state.disabledShowOff){
            return;
        }

        this.state.checked = !this.state.checked;
        this.setState(this.state);
        //如果是组织级节点，且并未选中组织值，那么直接返回
        if(this.config.nodeType ==='ORG_NODE'){
            if(this.state.curOrg === '' || this.state.curOrg === undefined || !this.state.curOrg.hasOwnProperty('refpk')){
                return;
            }
        }        
        let requestParam = {
            isShowOff:this.state.checked,
            pk_curOrg:this.state.curOrg.refpk,
            nodeType:this.config.nodeType,
            primaryKey:'~',//异步树处理同步数据；
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    if (result.data && result.data.length && result.data.length > 0){
                        this.state.cardEmpty = false;
                    } else {
                        this.state.cardEmpty = true
                    }
                    var data = [Object.assign( {...this.root} , {children : result.data} )];
                    /*
                    ,
                        initLeaf = function(node){
                            if(!node.children || node.children.length == 0) {
                                ;
                                delete node.children;
                            }
                            else{
                                node.isLeaf = false;
                                node.children.forEach( (e) => {
                                    initLeaf(e);
                                } );
                            }
                        };

                    data.forEach( (e) => {
                        initLeaf(e);
                    });
                    */
                   this.changeButtonStatus('','Refresh');
                    if(result.data !== undefined && result.data !== null && result.data.length > 0){
                        this.state.printPks = this.getTreePk(result.data);
                    }                    
                    this.setState(this.state);                    

                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                }

            }
        })
    }

    /**
     * checkbox 选中事件
     */

    onCheckBoxClick(){
        if(!this.state.disabledShowOff){
            //this.setState({checked:!this.state.checked});
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true})//显示停用时启用状态不可修改
        }

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

        switch(key){
            case "enablestate":

                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

                if(!selectedTreeNode){
                    let content = value.value?this.state.json['10140MCCLG-000013']:this.state.json['10140MCCLG-000015'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    Message.create({content: content, color: 'warning'});//默认top
                    return;
                }
				let ctvalue = value.value;//这个用来给取消按钮使用的；
                let requestParam = {
                    primaryKey:selectedTreeNode.refpk,
                    enablestate:value.value ,
                    pk_curOrg:this.state.curOrg.refpk,
                    ts:selectedTreeNode.nodeData.ts,
                    nodeType:this.config.nodeType
                };
                /*
                ajax({
                    url:this.config.urls.validateUrl,
                    data:requestParam,
                    success:(res)=>{
                        if(res.success && res.data){
                            ajax({
                                url:this.config.urls.enablestateUrl,
                                data:requestParam,
                                success:(result)=>{

    
    
                                    this.props.syncTree.setNodeDisable(this.config.treeId,false);

                                    this.props.form.setFormStatus(this.config.formId, 'browse');

                                    this.props.form.EmptyAllFormValue(this.config.formId);

                                    if(result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')){
                                        var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                        if(!!enablestateObj){
                                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                        } 
                                    }                                           
                                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});

                                    this.changeButtonStatus(this.state.curSelectedNode,this.config.actions['Save']);

                                    this.setState({curSelectedNode:null});
                                    this.state.disabledShowOff = false;
                                    this.setState(this.state);
    
                                    toast({content:value.value  ?"启用成功":"停用成功",title:"提示"});
                                }
                            });
                        }
                    }
                })

                */



                promptBox({
                    color:"warning",
                    title:this.state.json['10140MCCLG-000017'],/* 国际化处理： 提示*/
                    content:value.value ? this.state.json['10140MCCLG-000018']:this.state.json['10140MCCLG-000019'],/* 国际化处理： 确认启用该数据？,您确定要停用所选数据及其所有下级数据吗？*/
                    beSureBtnClick:()=>{

                        ajax({
                            url:this.config.urls.validateUrl,
                            data:requestParam,
                            success:(res)=>{
                                if(res.success && res.data){
                                    ajax({
                                        url:this.config.urls.enablestateUrl,
                                        data:requestParam,
                                        success:(result)=>{

            
            
                                            this.props.syncTree.setNodeDisable(this.config.treeId,false);

                                            this.props.form.setFormStatus(this.config.formId, 'browse');

                                            this.props.form.EmptyAllFormValue(this.config.formId);

                                            if(result.data[this.config.formId].rows[0].values.hasOwnProperty('enablestate')){
                                                var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                                                if(!!enablestateObj){
                                                    result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                                                } 
                                            }                                           
                                            this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});

                                            this.changeButtonStatus(this.state.curSelectedNode,this.config.actions['Save']);

                                            this.setState({curSelectedNode:null});
                                            this.state.disabledShowOff = false;
                                            this.setState(this.state);
            
                                            toast({title:value.value  ?this.state.json['10140MCCLG-000020']:this.state.json['10140MCCLG-000021'],color: 'success'});/* 国际化处理： 启用成功！,停用成功！*/
                                        }
                                    });
                                }
                            }
                        })
                    },
                    cancelBtnClick:()=>{
                        props.form.setFormItemsValue(this.config.formId,{enablestate:{display:null,value:!ctvalue}});
                        return;
                    }
                });




                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 刷新
     */
    onRefreshClass(){
        this.setState({
            //checked: false,//判断 显示停用按钮是否选中,不管是否选中数据
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            //curOrg:'',//当前组织
            oldParent:'',//原父节点
            isAdd:false,//新增标志  默认false
        },()=>{
            this.initData.call(this);
            // this.OrgSelect.clearSelectedOrg();
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            this.changeButtonStatus('','Refresh');
			toast({ color: 'success', title: this.state.json['10140MCCLG-000022'] });/* 国际化处理： 刷新成功！*/
        });
    }
    onButtonClick(props,id){
        switch(id){
            case this.config.actions.Refresh:
                this.onRefreshClass.call(this);
                break;
            case this.config.actions.Save:
                this.onSaveClass.call(this);
                break;
            case this.config.actions.SaveAdd:
                this.onSaveAddClass.call(this);
                break;
            case this.config.actions.Cancel:
                this.onCancelClass.call(this);
                break;
            case this.config.actions.print:
                this.onPrint('print');
                break;
            case this.config.actions.output:
                this.onPrint('output');   
            case this.config.actions.export:
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:break;
        }
    }
    /*
    onPrint(modal){
        let cpk = this.props.form.getFormItemsValue(this.config.formId,'pk_marcostclass').value;
        if(cpk === null){
            return;
        }

        let pks = [];
        pks.push(cpk);
        print(
            'pdf',
             urls.printUrl,
             {
                 billtype:'',
                 funcode:'10140MCCLG',
                 nodekey:'',
                 oids:pks,
                 outputtype:modal,
             }
        )
    }
    */
    onPrint(modal){
        /*
        let allD1 = this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children;
        let pks = [];
        if(allD1 === undefined || allD1 === null){
            return;
        }
        allD1.forEach((item,index)=>{
            pks.push(item.id);
        });
        this.state.printPks = pks;
        if(pks.length === 0){
            return;
        }
        */
       let pks = this.state.printPks;
       if(pks === undefined || pks === null || pks.length === 0){
           return;
       }       
        if("print" === modal){//打印
            print(
                'pdf',
                urls.printUrl,
                {
                    //billtype:'',
                    funcode:'10140MCCLG',
					appcode:'10140MCCLG',
                    //nodekey:'nccloud',
                    oids:pks,                   
                }
            )
       }else if('output' === modal){
           this.setState(this.state,
        this.refs.printOutput.open());
       }                
        
    }
    checkTreeNodeIsDisabled(node){
        return !!node.disabled;
    }
    onBeforeEvent(props,moduleId,key,value,index){
        let cpk_org = this.state.curOrg.refpk;
        if( "pk_father" === key){
            let meta = props.meta.getMeta();
            meta.marcostclass.items.map((ele)=>{
                if(ele.attrcode === 'pk_father'){
                    ele.queryCondition = function(){
                        return{
                            "pk_org":cpk_org,
                        }
                    }
                }
            })
            props.meta.setMeta(meta);
            return true;
        }
		return true;
    }

    addClickCall = () => {
        this.onAddClass(this.root)
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

        const {createButtonApp}=button;
        const {createBillHeadInfo} = BillHeadInfo;
        const {cardEmpty} = this.state;

        let { createModal } = ncmodal;  //模态框

        /**
         * 组织选择区 参数
         **/
        let orgParam = {
            curOrg:this.state.curOrg,
            onOrgChange:this.onOrgChange.bind(this),
            status:this.props.form.getFormStatus(this.config.formId),
        };
        /**
         * 树参数
         **/
        let TreeParam = {
            treeId :this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            onMouseEnterEve:this.onMouseEnterEve.bind(this),
            clickAddIconEve: this.onAddClass.bind(this), //新增点击 回调
            clickEditIconEve: this.onEditClass.bind(this), //编辑点击 回调
            clickDelIconEve: this.onDeleteClass.bind(this), // 删除点击 回调
            showModal:this.state.tree.showModal,
            //onTreeExpand:this.onTreeExpand.bind(this),
            disabledSearch:this.state.disabledSearch//这个用来做是否禁用搜索框的控制；
        };
        return(
            
            <div className="nc-bill-tree-card">
                <PrintOutput
                ref='printOutput'
                url={urls.printUrl}
                data={{
                    funcode:'10140MCCLG',
					appcode:'10140MCCLG',
                    oids:this.state.printPks,
                    outputType:"output"
                }}
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
                {createModal('modal',{noFooter:false})}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {/* 标题 title*/}
                    {/* <div className="title" fieldid={this.config.title + "_title"}>{this.config.title}</div> */}
                    <div className="title">
                    {createBillHeadInfo({
                        title : this.config.title,
                        initShowBackBtn:false
                    })}
                    </div>
                    {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                    {/*{this.renderOrgSearchArea.bind(this)}*/}
                    {this.config.nodeType == 'ORG_NODE' &&
                    <div className="search-box">
                        {/*组织选择区域*/}
                        <ReferSelect config={orgParam} ref={(ReferSelect)=>{this.ReferSelect = ReferSelect;}}/>
                    </div>
                    }
                    <span className="showOff">
                        <NCCheckbox
                            disabled={this.state.disabledShowOff}
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            onClick={this.onCheckBoxClick.bind(this)}
                            size="lg"
                        >
                            {this.state.json['10140MCCLG-000023']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
			        </span>
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: "costActions",
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            //popContainer: document.querySelector('.'+this.config.formId)

                        })}

                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom

                        // 左树区域
                        
                        leftDom = {
                        //<div style={{width:'100%',height:800,overFlow: 'auto',paddingBottom: 200}}>
                        
                        <ClassTree treeConfig={TreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree }/>
                        
                        }

                        // 右卡片区域
                        rightDom = {
                            <div style={{ height: '100%' }}>
                            {this.config.nodeType != 'ORG_NODE' ? <EmptyAreaTip
                                type="btn"
                                desc={this.state.json['10140MCCLG-000024']}
                                onClick={this.addClickCall}
                                show={cardEmpty} /> : <EmptyAreaTip
                                    desc={this.state.json['10140MCCLG-000025']}
                                    show={cardEmpty} />}
                        <div className="card-area">{
                            createForm(this.config.formId, {
                                onAfterEvent: this.onAfterFormEvent.bind(this),
                                onBeforeEvent:this.onBeforeEvent.bind(this),
                                cancelPSwitch:true})}
                                </div></div>}

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '280px'
                    />
                </div>

            </div>

        )
    }
}

export default Mccl;














//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65