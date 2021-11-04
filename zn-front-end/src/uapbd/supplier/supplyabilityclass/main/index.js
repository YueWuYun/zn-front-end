//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,cacheTools,print,output,high,promptBox,cardCache,createPageIcon} from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
const {NCMenu,NCDropdown,NCCheckbox,NCPopconfirm,NCMessage,NCCol,NCRow,NCButton,NCTooltip} = base;
const {NCMenuGroup} = NCMenu;
let {setDefData, getDefData } = cardCache;
const { Item } = NCMenu;
const { PrintOutput } = high;



/****************默认参数  开始***********************/
let formId = "head";//卡片组件Id
const urls={
    loadTreeDataUrl:"/nccloud/uapbd/supplyabilityclass/loadtreedata.do",
    queryTemplet : '/nccloud/platform/templet/querypage.do',
    addCardUrl:"/nccloud/uapbd/supplyabilityclass/addcard.do",
    queryCardUrl:"/nccloud/uapbd/supplyabilityclass/querycard.do",
    enablestateUrl:"/nccloud/uapbd/supplyabilityclass/enablestate.do",
    deleteUrl:'/nccloud/uapbd/supplyabilityclass/deltreenode.do',
    printUrl: '/nccloud/uapbd/supplyabilityclass/print.do',
    saveUrl:'/nccloud/uapbd/supplyabilityclass/savenode.do'
};
let pageCode="10140SACL_supabcl01";//默认集团
/***************默认参数  结束********************/

/**
 * 供货能力分类
 */
class Supplyabilityclass extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            title: "",
            treeId:"supplyabilityclassTree",
            formId:formId,
            pageCode:pageCode,
            nodeType:'GROUP_NODE',
            urls:urls
        },props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":"",
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": "",
            "refpk": "~"
        };

        //显示停用复选框的状态标志
        this.state = {
            pks:[],
            checked: false,//判断 显示停用按钮是否选中
            json: {},
            disabledSearch:false,//左树上搜索按钮
            curOrg: '' ,//客户销售分类-财务组织节点，选中的组织主键
            showOffDisable:false,
            curSelectedNode: {} //直接点击树节点操作按钮时 用于记录selectedNode
        }



        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartEps = this.onStartEps.bind(this);
        this.onStopEps = this.onStopEps.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);

        this.initTemplate(props);

    }
    
    
     //初始化单据模板
    initTemplate = (props,callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode:props.config.pageCode//页面id
            // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140SACL',domainName: 'uapbd'
            },
            (data, langData)=>{ //(data, langData)
                if(langData){
                    this.state.json = langData
                    that.root.title = this.state.json['10140SACL-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 供货能力分类*/
                    that.root.refname = this.state.json['10140SACL-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 供货能力分类*/
                    props.config.title = this.state.json['10140SACL-000000']//this.state.json['10140SACL-000000'],/* 国际化处理： 供货能力分类*/
                }
                if (data) {

                    if (data.template) {
                        let meta = data.template;
                        //modified by qiaojie(20190813) 解决英文情况下，等级体系参照显示的还是中文的bug。
                        // meta['head'].items.map((obj)=>{
                        //     if(obj.attrcode == 'gradesys'){
                        //         obj.refName = '等级体系';
                        //         obj.placeholder= '等级体系';
                        //     }
                        // })
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    that.onRefresh()
                    callback && callback();
                }
            }
        )
		}

     /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.iconBox = {
                delIcon:true,
                editIcon:true,
                addIcon:true
            }
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children&&node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data&&data.forEach( (e) => {
            e.iconBox = {
                delIcon:true,
                editIcon:true,
                addIcon:true
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    componentDidUpdate(){
        //form如果是编辑态，关闭浏览器需要给你提示
        let formstatus = this.props.form.getFormStatus(this.config.formId);

        if(formstatus == 'browse'|| formstatus == undefined){
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
        //this.onRefresh();
        //修改按钮状态
        this.initButtonStatus();

    }

    onRefresh(){
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let that = this;
        let requestParam = { 
            checked:this.state.checked,
            pkorg:this.state.curOrg.refpk
         };

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url:that.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    that.root.title = this.state.json['10140SACL-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 供货能力分类*/
                    that.root.refname = this.state.json['10140SACL-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 供货能力分类*/
                    if(result.data){
                        let data = [Object.assign( {...that.root} , {children : result.data} )];
                        //同步树  加载全部数据
                        that.props.syncTree.setSyncTreeData(that.config.treeId , that.dealTreeData(data));

                        //展开节点  设置默认展开项
                        that.props.syncTree.openNodeByPk(that.config.treeId, that.root.refpk);

                        //设置打印按钮不可用
                        that.props.button.setButtonDisabled(['print','export'],true);
                    }
                    if(!result.data){
                        that.setSyncTreeData(leftTree, []);
                    }
                    if(selectedTreeNode){
                        that.props.syncTree.setNodeSelected(that.config.treeId, selectedTreeNode.refpk);
                    }
                    if(getDefData('supplyability_btnopr',that.props.config.datasource) == 'refresh'){
                        toast({title:this.state.json['10140SACL-000001'],color:"success"});/* 国际化处理： 刷新成功！*/
                        setDefData('supplyability_btnopr',that.props.config.datasource,'browse');
                    }
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
        this.props.button.setButtonVisible('save',false);
        this.props.button.setButtonVisible('saveadd',false);
        this.props.button.setButtonVisible('cancel',false);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){

        if('~' == refpk){
            this.props.button.setButtonDisabled(['print','export'],true);
            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true});
        }else{
            this.props.button.setButtonDisabled(['print','export'],false);
        }
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if(status == 'edit'){
            return;
        }

        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url:this.config.urls.queryCardUrl,
            data:{pk_supabclass:refpk},
            success:(result)=>{

                if(result.success){
                    //表单数据
                    let headData = result.data.head.rows[0].values;
                    if(headData.hasOwnProperty('enablestate')){
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if(enablestateValue == '2'){
                            result.data.head.rows[0].values.enablestate.value = true;
                        }else{
                            result.data.head.rows[0].values.enablestate.value = false;
                        }
                    }
                    let sapks =[];
                    sapks.push(headData.pk_supabclass.value);
                    cacheTools.set('sapks',sapks);
                    
                    if(headData.pid.display == this.root.refpk){
                        result.data.head.rows[0].values.pid.display = '';
                        result.data.head.rows[0].values.pid.value='';
                    }
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({head:result.data.head});
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                    //设置打印按钮可用
                    this.props.button.setButtonDisabled(['print','export'],false);

                }
            }
        });
    }


    /**
     * 检查上级是否有停用数据 有：return true
     * @param props
     * @param selectedNode
     * @returns {boolean}
     */
    checkParentIsStop = (props,selectedNode)=>{
        let fathid = selectedNode.pid;
        if(fathid === '~'){
            return false;
        }
        let parentNode = props.syncTree.getSyncTreeValue(this.config.treeId,selectedNode.pid);
        if(parentNode && !parentNode.nodeData.enablestate){
            return !parentNode.nodeData.enablestate;
        }else{
            this.checkParentIsStop(props,parentNode);
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
                    let content = value.value?this.state.json['10140SACL-000002']:this.state.json['10140SACL-000003'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    NCMessage.create({content: content, color: 'warning'});//默认top
                    return;
                }
                let requestParam = {pk_supabclass:selectedTreeNode.refpk,enablestate:value.value?'2':'1'};

                //检测是否有停用的上级，如果有停用上级，就不能启用
                let flag = this.checkParentIsStop(props,selectedTreeNode);
                if(value.value && flag){
                    toast({content:this.state.json['10140SACL-000029'],color:'warning'});/* 国际化处理： 选中的供应商分类存在停用的上级, 不能启用！*/
                    props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                    return;
                        
                }else{
                    promptBox({
                        color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: value.value?this.state.json['10140SACL-000026']:this.state.json['10140SACL-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                        noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        hasCloseBtn:false,
                        content: value.value?this.state.json['10140SACL-000005']:this.state.json['10140SACL-000006'],/* 国际化处理： 您确定要启用所选数据吗？,您确定要停用所选数据及其所有下级数据吗？*/
                        beSureBtnClick: () =>{
                            ajax({
                                url:this.config.urls.enablestateUrl,
                                data:requestParam,
                                success:(result)=>{
                                    /****
                                     * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                     * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                     */
                                    //刷新界面
                                    this.onRefresh();
                                    toast({title:value.value?this.state.json['10140SACL-000007']:this.state.json['10140SACL-000008'],color:'success'});/* 国际化处理： 启用成功！,停用成功！,提示*/
    
                                },
                                error:(result)=>{
                                    if(value.value){
                                        props.form.setFormItemsValue(this.config.formId,{enablestate:{value:false,display:null}});
                                        //result.data.form.head.rows[0].values.enablestate.value = false;
                                    }else{
                                        props.form.setFormItemsValue(this.config.formId,{enablestate:{value:true,display:null}});
                                        //result.data.form.head.rows[0].values.enablestate.value = true;
                                    }
                                    toast({content:result.message,title:this.state.json['10140SACL-000010'], color: 'warning'});/* 国际化处理： 警告*/
                                }
                            });
                        } ,
                        cancelBtnClick:()=>{
                            props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:null}});
                            return;
                        }
                    })
                }
                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 新增
     */
    onAddEps(selectNode){
        this.setState({curSelectedNode:selectNode});
        let requestParam = {};//请求参数对象
        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk
            requestParam['pk_father'] = selectNode.refpk;
        }else{
            //不存在选中节点，设置父节点为根节点refpk
            requestParam['pk_father'] = this.root.refpk;
        }
        ajax({
            url:this.config.urls.addCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'add');
                    Utils.filterEmptyData(result.data.head.rows[0].values);
                    //设置新增默认值
                    this.props.form.setAllFormValue({head:result.data.head});
                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});

                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用

                    //设置停启用按钮和左树上搜索按钮不可用
                    this.setState( {
                        showOffDisable:true,
                        disabledSearch:true
                        });
                        
                    this.changeButtonStatus(selectNode,'add');
                }
            }
        })
    }

    /**
     * 编辑
     */
    onEditEps(selectedTreeNode){
        this.setState({curSelectedNode:selectedTreeNode});
        /**************************************************
         *
         * 编辑：
         *      1、构造请求参数
         *      2、ajax请求，后台查询需要编辑的对象
         *      3、回调，设置表单数据为编辑的对象
         *
         * 编辑状态下：
         *      只有 保存  取消 按钮 显示
         *
         *
         **************************************************/
        /****未选中提示***/
        if (!selectedTreeNode) {

            NCMessage.create({content: this.state.json['10140SACL-000011'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;

        }
        /***ajax请求***/
        ajax({
            url:this.config.urls.queryCardUrl,
            data:{pk_supabclass:selectedTreeNode.refpk},
            success:(result)=>{

                if(result.success){
                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用

                    //设置表单数据
                    this.props.form.setAllFormValue({head:result.data.head});
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                    //设置表单状态为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'edit');
                    this.changeButtonStatus(selectedTreeNode,'edit');

                    //查询时执行显示公式前端适配
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            result.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [this.config.formId]:"form"
                            }
                        );
                    }

                    //设置停启用按钮和左树上搜索按钮不可用
                    this.setState( {
                        showOffDisable:true,
                        disabledSearch:true
                        });
                }
            }
        });
    }

    /**
     * 保存
     */
    onSaveEps(callback){
        //必填项校验
        let memberFlag = this.props.form.isCheckNow(this.config.formId);
        if(!memberFlag){
            return;
        }

        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if(!selectedTreeNode){
            selectedTreeNode = this.state.curSelectedNode;
        }
        let requestParam= {};
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
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息  
        /****
         * 构造参数
         * @type {string}
         */
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        // formData.rows[0].values.eps_code.value = selectedTreeNode.nodeData.pcode + formData.rows["0"].values.eps_code.value;
        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        if(formData.rows[0].values.hasOwnProperty('pk_supabclass')){

            pk = formData.rows[0].values.pk_supabclass.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(pk == null || pk ==''){
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }

        //适配校验公式
        this.props.validateToSave( requestParam , ()=>{
            //ajax请求
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        //设置表单浏览态
                        
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(!result.data.treenode[0].children || result.data.treenode[0].children.length == 0 ){
                            delete result.data.treenode[0].children;
                        }
                        if(nonPk){

                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treenode);
                        }else{
                            
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treenode[0]);
                        }

                        let headData = result.data.head.head.rows[0].values;
                        if(headData.hasOwnProperty('enablestate')){
                            let enablestateValue = headData.enablestate.value;
                            //根据表单项enablestate的值修改开关状态
                            if(enablestateValue == '2'){
                                headData.enablestate.value = true;
                            }else{
                                headData.enablestate.value = false;
                            }
                        }

                        if(headData.pid.display == this.root.refpk){
                            headData.pid.display = '';
                            headData.pid.value='';
                        }
                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({head:result.data.head.head});
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treenode[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treenode[0].refpk);
                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                        toast({title:this.state.json['10140SACL-000025'],color:'success'});/* 国际化处理： 保存成功！,提示*/
                        //清空自定已选中项 设置停启用按钮和左树上搜索按钮不可用
                        this.setState({
                            curSelectedNode:null,
                            showOffDisable:false,
                            disabledSearch:false
                        });
                        this.changeButtonStatus(selectedTreeNode,'save');
                    }
                }
            }); 
        } ,{[this.config.formId]:'form'} , 'form')
        
    }

    /**
     * 保存新增
     */
    onSaveAddEps(){
        
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        let requestParam= {};
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
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: '10140EPSG'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        
        if(formData.rows[0].values.hasOwnProperty('pk_custsaleclass')){

            pk = formData.rows[0].values.pk_custsaleclass.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(pk == null || pk ==''){
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点

        }

        //适配校验公式
        this.props.validateToSave( requestParam , ()=>{
            /***ajax请求***/
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    /**********
                     *
                     * 这里的代码可以精简，临时先这样，逻辑思路是一样的
                     *
                     *
                     *********/
                    if(result.success){
                        //设置表单为浏览态
                       // this.props.form.setFormStatus(this.config.formId, 'browse');
                        if(!result.data.treenode[0].children || result.data.treenode[0].children.length == 0 ){
                            delete result.data.treenode[0].children;
                        }
                        //新增回调后添加
                        
                        this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treenode);
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treenode[0].pid);

                        //判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
                        if(!selectedTreeNode){
                            this.props.syncTree.setNodeSelected(this.config.treeId,result.data.treenode[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                        }

                        //重新设置整棵树不可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,true);

                        //判断是否有选中节点
                        if (!selectedTreeNode) {
                            //如果没有默认加载根节点下面
                            requestParam = {
                                pk_father:this.root.refpk
                            };
                        } else {
                            requestParam = {
                                pk_father:selectedTreeNode.refpk
                            };
                        }
                        //ajax请求
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if(result.success){
                                    
                                    //清空表单数据
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    //新增成功，设置表单默认值
                                    this.props.form.setAllFormValue({head:result.data.head});
                                    //设置表单为编辑态
                                    this.props.form.setFormStatus(this.config.formId, 'edit');
                                    this.changeButtonStatus(selectedTreeNode,'saveadd');
                                }
                            }

                        })
                    }
                }
            });
        } ,{[this.config.formId]:'form'} , 'form');

        
    }

    /**
     * 删除
     */
    onDeleteEps(selectedTreeNode){

        let requestParam = {};
        /*******************************************
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
         *******************************************/
        if (!selectedTreeNode) {

            NCMessage.create({content: this.state.json['10140SACL-000012'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;

        }
        if(selectedTreeNode.refpk == this.root.refpk){
            NCMessage.create({content: this.state.json['10140SACL-000013'], color: 'warning'});//默认top/* 国际化处理： 根节点不能删除*/
            return;

        }
        let message = this.state.json['10140SACL-000014']/* 国际化处理： 确认要删除所选数据吗？*/
        if(selectedTreeNode.hasOwnProperty('children') && selectedTreeNode.children && selectedTreeNode.children.length>0){
            NCMessage.create({content: this.state.json['10140SACL-000015'], color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
            return;
        }


        promptBox({
            color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140SACL-000016'],/* 国际化处理： 确认删除*/// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn:false,
            content: message,/* 国际化处理： 确认删除*/
            beSureBtnClick: () =>{
                requestParam = {
                    pk_supabclass:selectedTreeNode.refpk
                }
                let pid = selectedTreeNode.pid;
                
                ajax({
                    url:this.config.urls.deleteUrl,
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            //调用异步树的接口，删除该树节点
                            this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                            toast({title:this.state.json['10140SACL-000017']});/* 国际化处理： 删除成功！,提示*/
                            this.changeButtonStatus(selectedTreeNode,'delete');
                            //删除成功提示
                            // Message.create({content: '删除成功！', color: 'success'});//默认top
                        }

                    }
                })
            }   
        })
    }

    /**
     * 取消
     */
    onCancelEps(){

        promptBox({
            color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140SACL-000028'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn:false,
            content: this.state.json['10140SACL-000018'],/* 国际化处理： 您确定要取消吗？*/
            beSureBtnClick: () =>{
                //同步树 取消的逻辑
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                /**********************************************************
                 *
                 * 取消：
                 *      1、重新根据选中的树节点查询表单对象
                 *      2、回调，设置表单对象
                 *      3、设置按钮状态
                 *
                 **********************************************************/
                this.props.form.EmptyAllFormValue(this.config.formId);
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                if(selectedTreeNode && selectedTreeNode.refpk != '~'){ //新增取消报错修正
                    //查询节点信息
                    ajax({
                        url:this.config.urls.queryCardUrl,
                        data:{pk_supabclass:selectedTreeNode.refpk},
                        success:(result)=>{
                            if(result.success && result.data){
                                
                                this.props.form.setAllFormValue({head:result.data.head});
                                this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':false});
                            }
                            if(!result.data){
                                this.props.form.setAllFormValue({});
                            }
                        }
                    });
                }else{
                    //没有选中项  清空所有数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                }
                this.setState({
                    showOffDisable:false
                });
                this.props.form.setFormStatus(this.config.formId, 'browse');
                //设置树可用
                this.props.syncTree.setNodeDisable(this.config.treeId,false);
                //设置按钮状态
                //设置停启用按钮和左树上搜索按钮不可用
                this.setState( {
                    showOffDisable:false,
                    disabledSearch:false
                    });
                this.changeButtonStatus(selectedTreeNode,'cancel');
            }   
        })

        
    }

    /**
     * 启用
     */
    onStartEps(){
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

            NCMessage.create({content: this.state.json['10140SACL-000002'], color: 'warning'});//默认top/* 国际化处理： 请选中需要启用的树节点*/
        }else if(formData.rows[0].values.enablestate.value == '2'){
            NCMessage.create({content: this.state.json['10140SACL-000019'], color: 'warning'});//默认top/* 国际化处理： 该数据已启用，无需多次启用*/
            return;
        }
        requestParam = {
            pk_custsaleclass:formData.rows[0].values.pk_custsaleclass.value,
            enablestate:'2'
        }
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                //启用成功，设置表单数据
                if(result.success){
                    //this.props.form.setAllFormValue({head:result.data.head});
                    //关闭 展开，可以做一个refreshTreeNode方法
                    this.refreshTreeNode(this.config.treeId,selectedTreeNode.pid);
    
                    this.changeButtonStatus('start');

                    //刷新界面
                    this.onRefresh();
                }
               // this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                // this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                // this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
            }
        });
        
    }

    /**
     * 停用
     */
    onStopEps(){
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if(!selectedTreeNode){

            NCMessage.create({content: this.state.json['10140SACL-000003'], color: 'warning'});//默认top/* 国际化处理： 请选中需要停用的树节点*/
        }else if(formData.rows[0].values.enablestate.value == '1'){
            NCMessage.create({content: this.state.json['10140SACL-000020'], color: 'warning'});//默认top/* 国际化处理： 该数据已停用，无需多次停用*/
            return;
        }
        requestParam = {
            pk_custsaleclass:formData.rows[0].values.pk_custsaleclass.value,
            enablestate:'1'
        }
        
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success){

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.refreshTreeNode(this.config.treeId,selectedTreeNode.pid);
                    this.changeButtonStatus('stop');
                    //刷新界面
                    this.onRefresh();
                    //this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                    // this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                    // this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
                }
            }
        });
        
    }

    /**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if(key == 'start'){
            this.onStartEps();
        }else if(key == 'stop'){
            this.onStopEps();
        }

    }


    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode,id){
        switch(id){
            case 'add':
            case 'saveadd':
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveadd',true);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible(['refresh','print'],false);
                this.props.button.setButtonVisible('export',false);
                break;
            case 'edit':
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveadd',true);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setButtonVisible(['refresh','print'],false);
                this.props.button.setButtonVisible('export',false);
                break;
            case 'delete':
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible('save',false);
                this.props.button.setButtonVisible('saveadd',false);
                this.props.button.setButtonVisible('cancel',false);
                this.props.button.setButtonVisible(['refresh','print'],true);
                this.props.button.setButtonVisible('export',true);
            default :
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key){
        //设置
        let obj = {};
        if(key === this.root.refpk){
            obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
        }else{
            obj = {
                delIcon:true, //false:隐藏； true:显示; 默认都为true显示
                editIcon:true,
                addIcon:true
            };
        }
        this.props.syncTree.hideIcon(this.config.treeId, key, obj );
    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if(!selectNode ){
            NCMessage.create({content: this.state.json['10140SACL-000021'], color: 'warning'});//默认top/* 国际化处理： 请选中树节点*/
        }
        requestParam['pk_custsaleclass'] = selectNode.refpk;
        requestParam['enablestate'] = checked?'2':'1';
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        this.props.form.setAllFormValue({head:result.data.head});
                    } else {
                        //如果不是选中那就清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
                    }
                }
                this.refreshTreeNode(this.config.treeId,selectNode.pid);

            }
        });
    }

    /**
     * checkbox change 事件
     */
    onCheckBoxChange(){
        this.setState(
            {checked:!this.state.checked},
            () => {
                let showDisableOrg = this.state.checked;
                //this.state.checked = !this.state.checked
                let requestParam = {
                checked:showDisableOrg
                };
                ajax({
                    url:this.config.urls.loadTreeDataUrl,
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            var data = [Object.assign( {...this.root} , {children : result.data} )],
                                initLeaf = function(node){
                                    if(!node.children || node.children.length == 0) {
                                        
                                        delete node.children;
                                    }
                                    else{
                                        node.isLeaf = false;
                                        node.children&&node.children.forEach( (e) => {
                                            initLeaf(e);
                                        } );
                                    }
                                };

                                data&& data.forEach( (e) => {
                                initLeaf(e);
                            });

                            //同步树 加载全部数据
                            this.props.syncTree.setSyncTreeData(this.config.treeId , data);
                            //展开节点  设置默认展开项
                            this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                        }

                    }
                })
            }
        );
        
    }

    onButtonClick(props,id){
        switch (id) {
            case 'save':
            //保存
                this.onSaveEps();
                break;
            case 'saveadd':
            //保存新增
                this.onSaveAddEps()
                break;
            case 'cancel':
            //取消
                this.onCancelEps()
                break;
            case 'refresh':
            //刷新
                setDefData('supplyability_btnopr',props.config.datasource,'refresh');
                this.onRefresh()
                break;
            case 'print':
                let pks =  cacheTools.get('sapks');
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    urls.printUrl, 
                    {
                        //billtype:'',  //单据类型
                        funcode: props.config.appcode,      //功能节点编码，即模板编码
                        nodekey:'supabcl02',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    },
                    false
                );
                break;
            case 'export':
                let pks1 =  cacheTools.get('sapks');

                var data= {
                    appcode:'10140SACL',      //功能节点编码，即模板编码
                    nodekey:'supabcl02',     //模板节点标识
                    oids: pks1,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    outputType: "output"
                 }
                output({data: data,url:urls.printUrl});
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     urls.printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: props.config.appcode,      //功能节点编码，即模板编码
                //         //nodekey:'',     //模板节点标识
                //         // nodekey:'assprinttem',  
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            default:
                break;
        }
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

        const {asyncTree,syncTree,form,button,modal,search,DragWidthCom} = this.props;
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个

        const {createButtonApp}=button;

        let { createModal } = modal;  //模态框

        const {NCCreateSearch} = search;

        return(

            <div className="nc-bill-tree-card">
                {createModal('modal',{noFooter:false})}
                {/* 头部 header*/}
                <div className='header'>
                    {/* 标题 title*/}
                    {createPageIcon()}
                    <div className="title">{this.props.config.title}</div>
                    <span className="showOff">
                        <NCCheckbox
                            checked={this.state.checked}
                            defaultChecked={false}
                            //checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            //onClick={this.onCheckBoxClick.bind(this)}
                            disabled={this.state.showOffDisable}
                            size="lg"
                        >
                            {this.state.json['10140SACL-000024']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
                    </span>
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 5,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </div>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    disabledSearch:this.state.disabledSearch,
                                    treeId :this.config.treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditEps.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddEps.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteEps.bind(this), // 删除点击 回调
                                    showModal:false

                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    cancelPSwitch: true,
                                    onAfterEvent: this.onAfterFormEvent.bind(this)

                                })
                                }
                            </div> }     //右侧区域dom

                            defLeftWid='280px'      // 默认左侧区域宽度，px/百分百 
                    />
                    <PrintOutput
                        ref='printOutput'
                        url={urls.printUrl}
                        data={{
                            funcode:'10140SACL',      //功能节点编码，即模板编码
                            // nodekey:'',     //模板节点标识
                            oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                            outputType: "output"
                        }}
                        //callback={this.onSubmit}
                        >
                    </PrintOutput>
                </div>

            </div>

        )
    }
}


/**
 * 创建页面
 */
export default Supplyabilityclass = createPage({
    billinfo:[{
        billtype: 'form',
        pagecode: pageCode,
        headcode: formId
    }],
    //initTemplate: initTemplate,
    mutiLangCode: '10140SACL'
})(Supplyabilityclass)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65