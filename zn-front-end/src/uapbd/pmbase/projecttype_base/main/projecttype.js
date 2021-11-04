//KCoCSUjb7JGuSQ+WF0J54MHf9lJClqQh6RZzJesILPN/kic5P5AAGmODUXwEPVUm
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print,high,promptBox} from 'nc-lightapp-front';
const {NCCheckbox,NCDiv,NCMessage} = base;
const { PrintOutput } = high;
import Utils from '../../../public/utils/index';
/**
 * 项目类型
 */
export default class ProjectType extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            title: '',/* 国际化处理： 项目类型*/
            treeId:"projectTypeTree",
            formId:"head",
            pageCode:'10140PRJTG',
            nodeType:'GROUP_NODE',
            primaryKey:'pk_projectclass',//主键
            urls:{
                loadTreeDataUrl:"/nccloud/uapbd/projecttype/loadtreedata.do",
                queryCardUrl:"/nccloud/uapbd/projecttype/querycard.do",
                enablestateUrl:"/nccloud/uapbd/projecttype/enablestate.do",
                addCardUrl:"/nccloud/uapbd/projecttype/addcard.do",
                deleteUrl:'/nccloud/uapbd/projecttype/deltreenode.do',
                saveUrl:'/nccloud/uapbd/projecttype/savenode.do',
                printUrl:'/nccloud/uapbd/eps/printProjecttype.do'
            },
            actions:{
                TreeNodeAdd:'TreeNodeAdd',
                TreeNodeEdit:'TreeNodeEdit',
                TreeNodeDel:'TreeNodeDel',
                Refresh:'Refresh',
                Save:'Save',
                Cancel:'Cancel',
                SaveAdd:'SaveAdd'
            },//表单所有动作
        },props.config);
        let callback = (json,status,inlt)=> {
            this.lang = json;//多语对象
            /* 国际化处理： 项目类型-集团  全局*/
            this.config.title = this.props.config.nodeType == 'GLOBE_NODE' ? this.lang['10140PRJT-000036'] : this.lang['10140PRJT-000000'];
            //自定义根节点
            this.root = {
                "isleaf": false,
                "key":"~",
                "title":this.config.title,
                "id":"~",
                "innercode":"~",
                "pid": "",
                "refname": this.config.title,
                "refpk": "~"
            };
            //显示停用复选框的状态标志
            this.state = {
                checked: false,//判断 显示停用按钮是否选中
                disabledShowOff:false,//是否禁用显示停用
                curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
                pks:null,
                selectedKeys:['~'],
                disabledSearch:false,
                status:'browse',
                title : this.config.title
            }
            this.setState(this.state,()=>{
                this.initData.call(this);
            });
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '10140PRJT',domainName: 'uapbd',callback});

    }
    componentDidUpdate(){
        if(!this.lang)
            return ;
        if(this.state.status !='browse'){
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{

            window.onbeforeunload = null;
        }
    }
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData =(data)=>{
        let deleteDataChildrenProp = function(node){
            node.iconBox = {
                editIcon:true,
                delIcon:true,
                addIcon:false,
            }
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
    componentDidMount(){
        //this.initData();
    }
    initData =(callback)=>{
        let requestParam = {
            showOff:this.state.checked,
            nodeType:this.config.nodeType,
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    this.setState({selectedKeys:[this.root.refpk]},()=>{
                        let data = [Object.assign( {...this.root} , {children : result.data} )];
                        //同步树  加载全部数据
                        this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                        //展开节点  设置默认展开项
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                        this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output','Refresh'],!result.data || result.data.length == 0);
                        //修改按钮状态
                        this.initButtonStatus();
                        callback && callback();
                    })
                }
            }
        });
    }
    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus = ()=>{
        //设置保存按钮不显示
        this.props.button.setButtonVisible('save',false);
        //设置取消按钮不显示
        this.props.button.setButtonVisible('cancel',false);
        //设置保存新增按钮不显示
        this.props.button.setButtonVisible('saveAdd',false);
    }
    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree =(refpk)=>{
        this.setState({selectedKeys:[refpk],curSelectedNode:this.props.syncTree.getSyncTreeValue(this.config.treeId,refpk)},()=>{

            let status = this.props.form.getFormStatus(this.config.formId);
            if(status == 'edit'){
                return;
            }
            this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output'],refpk == this.root.refpk);
            if(refpk == this.root.refpk){
                //清空表单
                this.props.form.EmptyAllFormValue(this.config.formId);
                return;
            }
            ajax({
                url:this.config.urls.queryCardUrl,
                data:{pk_projectclass:refpk,nodeType:this.config.nodeType,},
                success:(result)=>{
                    if(result.success){
                         //显示公式
                         if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.config.formId]:'form'
                                }
                            );
                        }
                        //表单数据
                        let headData = result.data.head.rows[0].values;
                        if(headData.hasOwnProperty('enablestate')){
                            result.data.head.rows[0].values.enablestate.value = headData.enablestate.value == '2';
                            result.data.head.rows[0].values.enablestate.display = headData.enablestate.value == '2';
                        }
                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                        //设置表单项enablestate可用
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                    }
                }
            });
        })
    }
    /**
     * 编辑前事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param data
     * @returns {boolean}
     */
    onBeforeFormEvent = (props, moduleId, key, value,data)=>{
        let selectedTreeNode = !!this.state.curSelectedNode?this.state.curSelectedNode:this.props.syncTree.getSelectNode(this.config.treeId);
        return this.checkCurNodeEnableStateAuth(selectedTreeNode);
    }
    /**
     * 表单编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent = (props, moduleId, key, value, index) =>{
        switch(key){
            case "enablestate":
                let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);
                if(!selectedTreeNode){
                    let content = value.value?this.lang['10140PRJT-000001']:this.lang['10140PRJT-000002'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    NCMessage.create({content: content, color: 'warning'});//默认top
                    return;
                }
                /******************
                 * 检查操作权限
                 ******************/
                if(!this.checkCurNodeEnableStateAuth(selectedTreeNode)){
                    props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                    return;
                }
                let requestParam = {
                    pk_projectclass:selectedTreeNode.refpk,
                    enablestate:value.value?'2':'1',
                    nodeType:this.config.nodeType,
                };
                promptBox({
                    color:"warning",
                    title:this.lang['10140PRJT-000003'],/* 国际化处理： 提示*/
                    content:value.value?this.lang['10140PRJT-000004']:this.lang['10140PRJT-000005'],/* 国际化处理： 确认启用该数据？,确认停用该数据？*/
                    beSureBtnClick:()=>{
                        ajax({
                            url:this.config.urls.enablestateUrl,
                            data:requestParam,
                            success:(result)=>{
                                result.success && toast({title:value.value?this.lang['10140PRJT-000025']:this.lang['10140PRJT-000026'],color:'success'});/* 国际化处理： 启用成功！,停用成功！*/
                            }
                        });
                    },
                    cancelBtnClick:()=>{
                        props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                        return;
                    }
                });
                break;
            default:
                break;
        }
    }
    /**
     * 新增
     */
    onAddProjectType = (selectNode)=>{
        this.setState({curSelectedNode:selectNode,disabledShowOff:true,status:'edit'},()=>{
            let requestParam = {
                pk_parent:selectNode?selectNode.refpk:this.root.refpk,
                nodeType:this.config.nodeType
            };//请求参数对象
            ajax({
                url:this.config.urls.addCardUrl,
                data:requestParam,
                success:(result)=>{
                    if(result.success){
                         //显示公式
                         if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.config.formId]:'form'
                                }
                            );
                        }
                        //清空表单数据
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为编辑态
                        this.props.form.setFormStatus(this.config.formId, 'edit');
                        //设置新增默认值
                        this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                        //设置表单项不可用
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                        this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                        this.setState({disabledSearch:true});
                        this.changeButtonStatus(selectNode,this.config.actions.TreeNodeAdd);
                    }
                }
            })
        });
    }
    /**
     * 编辑
     */
    onEditProjectType = (selectedTreeNode)=>{
        // /******************
        //  * 检查操作权限
        //  ******************/
        // let hasAuth = this.checkHasOperateAuth(selectedTreeNode);
        // if(!hasAuth){
        //     toast({content:'集团节点只能维护当前登录集团的数据！',color:'warning'});
        //     return;
        // }
        this.setState({curSelectedNode:selectedTreeNode,disabledShowOff:true,status:'edit'},()=>{
            if (!selectedTreeNode) {
                toast({content: this.lang['10140PRJT-000027'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点！*/
                return;
            }
            ajax({
                url:this.config.urls.queryCardUrl,
                data:{pk_projectclass:selectedTreeNode.refpk,nodeType:this.config.nodeType},
                success:(result)=>{
                    if(result.success){
                         //显示公式
                         if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.config.formId]:'form'
                                }
                            );
                        }
                        this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                        this.setState({disabledSearch:true});
                        //设置表单数据
                        this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                        //设置表单状态为编辑态
                        this.props.form.setFormStatus(this.config.formId, 'edit');
                        this.changeButtonStatus(selectedTreeNode,this.config.actions.TreeNodeEdit);
                    }
                }
            });
        });
    }


    /**
     * 保存
     */
    onSaveProjectType = ()=>{
        /**主动表单校验**/
        if(!this.props.form.isCheckNow(this.config.formId)){
            return;
        }
        let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if(!selectedTreeNode){
            selectedTreeNode = this.state.curSelectedNode;
        }
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        /***设置请求参数***/
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType:this.config.nodeType,
        };
        var pk = null;
        if(formData.rows[0].values.hasOwnProperty(this.config.primaryKey)){
            pk = formData.rows[0].values.pk_projectclass.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(pk == null || pk ==''){
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }
        let data = {
            model: formData,
            pageid: this.config.pageCode
        };
        this.props.validateToSave(data,()=>{

            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                         //显示公式
                         if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    [this.config.formId]:'form'
                                }
                            );
                        }
                        //设置表单浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        this.setState({disabledSearch:false});
    
                        if( result.data.treeNodeData[0].children && result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        nonPk?this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]):
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //取消时  启用状态改为 true/false
                        var enablestateObj = Utils.convertEnableState(result.data.curFormData[this.config.formId].rows[0].values['enablestate'],'form');
                        result.data.curFormData[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                        //新增成功，设置表单默认值
                        this.props.form.setAllFormValue({[this.config.formId]:result.data.curFormData[this.config.formId]});
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                        this.changeButtonStatus(selectedTreeNode,this.config.actions.Save);
                        //清空自定已选中项
                        this.setState({curSelectedNode:null,disabledShowOff:false,status:'browse'},()=>{
                            this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output','Refresh'],!result.data || result.data.length == 0);
                            toast({title:this.lang['10140PRJT-000028'],color:'success'});/* 国际化处理： 保存成功！*/
                        });
                    }
                }
            });
        },{[this.config.formId]:'form'},'form');
    }
    /**
     * 保存新增
     */
    onSaveAddProjectType = ()=>{
        /**主动表单校验**/
        if(!this.props.form.isCheckNow(this.config.formId)){
            return;
        }
        let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点

        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType:this.config.nodeType,
        };
        let data = {
            model: formData,
            pageid: this.config.pageCode
        };
        this.props.validateToSave(data,()=>{
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        //设置表单为浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        if( result.data.treeNodeData[0].children && result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        //新增回调后添加
                        this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        //判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
                        if(!selectedTreeNode){
                            this.props.syncTree.setNodeSelected(this.config.treeId,result.data.treeNodeData[0].pid);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                        }
                        //重新设置整棵树不可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,true);
                        this.setState({disabledSearch:true,status:'browse'});
                        //判断是否有选中节点
                        requestParam = {
                            pk_parent:selectedTreeNode?selectedTreeNode.refpk:this.root.refpk,
                            nodeType:this.config.nodeType
                        }
                        ajax({
                            url: this.config.urls.addCardUrl,
                            data: requestParam,
                            success: (result) => {
                                if(result.success){
                                     //显示公式
                                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                        this.props.dealFormulamsg(
                                            result.formulamsg,
                                            {
                                                [this.config.formId]:'form'
                                            }
                                        );
                                    }
                                    //清空表单数据
                                    this.props.form.EmptyAllFormValue(this.config.formId);
                                    //新增成功，设置表单默认值
                                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                                    //设置表单为编辑态
                                    this.props.form.setFormStatus(this.config.formId, 'edit');
                                    this.changeButtonStatus(selectedTreeNode,this.config.actions.SaveAdd);
                                    this.setState({status:'edit'});
                                }
                            }
                        })
                    }
                }
            });
        },{[this.config.formId]:'form'},'form');
    }
    /**
     * 删除
     */
    onDeleteProjectType = (selectedTreeNode)=>{
        /******************
         * 检查操作权限
         ******************/
        if (!selectedTreeNode) {
            toast({content: this.lang['10140PRJT-000029'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点！*/
            return;
        }
        if(selectedTreeNode.refpk == this.root.refpk){
            toast({content: this.lang['10140PRJT-000030'], color: 'warning'});//默认top/* 国际化处理： 根节点不能删除！*/
            return;
        }
        let message = this.lang['10140PRJT-000011']/* 国际化处理： 确认要删除所选数据吗？*/
        if(selectedTreeNode.hasOwnProperty('children') && !!selectedTreeNode.children && selectedTreeNode.children.length>0){
            toast({content: this.lang['10140PRJT-000012'], color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
            return;
        }
        promptBox({
            title: this.lang['10140PRJT-000013'],/* 国际化处理： 确认删除*/
            content: message,
            beSureBtnClick: () => {
                let requestParam = {
                    pk_projectclass:selectedTreeNode.refpk,
                    nodeType:this.config.nodeType,
                };
                ajax({
                    url:this.config.urls.deleteUrl,
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            //调用异步树的接口，删除该树节点
                            this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                            toast({title:this.lang['10140PRJT-000014'],title:this.lang['10140PRJT-000003']});/* 国际化处理： 删除成功！,提示*/
                            this.changeButtonStatus(selectedTreeNode,this.config.actions.TreeNodeDel);
                            //设置表单项可用
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                        }
                    }
                })
            }
        });
    }

    onCancelProjectTypePrompt = (callback)=>{

        promptBox({
            title:this.lang['10140PRJT-000031'],/* 国际化处理： 确认取消*/
            content:this.lang['10140PRJT-000032'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick:function(){
                callback && callback();
            }.bind(this)
        })
    }
    /**
     * 取消
     */
    onCancelProjectType = ()=>{
        this.setState({disabledShowOff:false,status:'browse'},()=>{
            let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
            this.props.form.EmptyAllFormValue(this.config.formId);
            
            if(selectedTreeNode && selectedTreeNode.refpk!=this.root.refpk){
                //查询节点信息
                ajax({
                    url:this.config.urls.queryCardUrl,
                    data:{pk_projectclass:selectedTreeNode.refpk,nodeType:this.config.nodeType},
                    success:(result)=>{
                        if(result.success){
                             //显示公式
                             if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                                this.props.dealFormulamsg(
                                    result.formulamsg,
                                    {
                                        [this.config.formId]:'form'
                                    }
                                );
                            }
                            //取消时  启用状态改为 true/false
                            var enablestateObj = Utils.convertEnableState(result.data[this.config.formId].rows[0].values['enablestate'],'form');
                            result.data[this.config.formId].rows[0].values['enablestate'] = enablestateObj;
                            this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});//设置表单项不可用
                        }
                    }
                });
            }else{
                //没有选中项  清空所有数据
                this.props.form.EmptyAllFormValue(this.config.formId);
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
            }
            this.props.form.setFormStatus(this.config.formId, 'browse');
            //设置树可用
            this.props.syncTree.setNodeDisable(this.config.treeId,false);
            this.setState({disabledSearch:false});
            //设置按钮状态
            this.changeButtonStatus(selectedTreeNode,this.config.actions.Cancel);
        })
    }
    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus =(selectedTreeNode,id)=>{
        switch(id){
            case this.config.actions.TreeNodeAdd:
            case this.config.actions.SaveAdd:
                this.props.button.setButtonVisible('Save',true);
                this.props.button.setButtonVisible('SaveAdd',true);
                this.props.button.setButtonVisible('Cancel',true);
                this.props.button.setButtonVisible('Refresh',false);
                this.props.button.setButtonVisible('Print',false);
                break;
            case this.config.actions.TreeNodeEdit:
                this.props.button.setButtonVisible('Save',true);
                this.props.button.setButtonVisible('SaveAdd',false);
                this.props.button.setButtonVisible('Cancel',true);
                this.props.button.setButtonVisible('Refresh',false);
                this.props.button.setButtonVisible('Print',false);
                break;
            case this.config.actions.TreeNodeDel:
                this.props.button.setButtonVisible('Save',false);
                this.props.button.setButtonVisible('SaveAdd',false);
                this.props.button.setButtonVisible('Cancel',false);
                this.props.button.setButtonVisible('Refresh',true);
                this.props.button.setButtonVisible('Print',true);
                break;
            case this.config.actions.Save:
            case this.config.actions.Cancel:
                this.props.button.setButtonVisible('Save',false);
                this.props.button.setButtonVisible('SaveAdd',false);
                this.props.button.setButtonVisible('Cancel',false);
                this.props.button.setButtonVisible('Refresh',true);
                this.props.button.setButtonVisible('Print',true);
            default :
                break;
        }
    }
    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve =(key)=>{
        let node = this.props.syncTree.getSyncTreeValue(this.config.treeId,key);
        let obj = {
            delIcon:true, //false:隐藏； true:显示; 默认都为true显示
            editIcon:true,
            addIcon:false
        };
        if(key == this.root.refpk){
            //根节点
            obj = {
                delIcon:false,  //删除图标    false:隐藏； true:显示; 默认都为true显示
                editIcon:false, //编辑图标
                addIcon:true    //新增图标
            };
        }else if(this.config.nodeType == 'GROUP_NODE' && !node.nodeData.isGroupNode){
            //集团节点 && 不是集团树节点
            obj = {
                delIcon:false,
                editIcon:false,
                addIcon:false
            };
        }else if(this.config.nodeType == 'GLOBE_NODE' && node.nodeData.isGroupNode){
            //全局节点 && 是集团树节点
            obj = {
                delIcon:false,
                editIcon:false,
                addIcon:false
            };
        }
        this.props.syncTree.hideIcon(this.config.treeId, key, obj );
    }
    /**
     * checkbox change 事件
     */
    onCheckBoxChange = ()=>{
        this.setState({checked:!this.state.checked},()=>{
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            let requestParam = {
                showOff:this.state.checked,
                nodeType:this.config.nodeType,
            };
            ajax({
                url:this.config.urls.loadTreeDataUrl,
                data:requestParam,
                success:(result)=>{
                    if(result.success){
                        var data = [Object.assign( {...this.root} , {children : result.data} )],
                            initLeaf = function(node){
                                node.iconBox = {
                                    editIcon:true,
                                    delIcon:true,
                                    addIcon:false,
                                }
                                if(!node.children || node.children.length == 0) {
                                    delete node.children;
                                }else{
                                    node.isLeaf = false;
                                    node.children.forEach( (e) => {
                                        initLeaf(e);
                                    } );
                                }
                            };
                        data.forEach( (e) => {
                            initLeaf(e);
                        });
                        //同步树 加载全部数据
                        this.props.syncTree.setSyncTreeData(this.config.treeId , data);
                        //展开节点  设置默认展开项
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    }
                }
            })
        });
    }
    onRefreshProjectType = ()=>{
        this.setState({
            //checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            selectedKeys:[this.root.refpk]
        },()=>{
            this.initData(()=>{
                toast({title:this.lang['10140PRJT-000037'],color:'success'});
            });
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            //设置表单项可用
            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
        });
    }
    onButtonClick = (props,id)=>{
        switch(id){
            case this.config.actions.Refresh:
                this.onRefreshProjectType();
                break;
            case this.config.actions.Save:
                this.onSaveProjectType();
                break;
            case this.config.actions.SaveAdd:
                this.onSaveAddProjectType();
                break;
            case this.config.actions.Cancel:
                this.onCancelProjectTypePrompt(this.onCancelProjectType);
                break;
            case 'Print':
                this.printAndOutput('print');
                break;
            case 'Menu_Print':
                this.printAndOutput('print');
                break;
            case 'Menu_Output':
                let treeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
                let pks = this.getTreeAllPks(treeData);
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            default:break;
        }
    }
    printAndOutput = (flag)=>{
        let treeData = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        if(treeData){
            let pks = this.getTreeAllPks(treeData);
            print('pdf',this.config.urls.printUrl,{billtype:'',funcode:'10140PRJTG',nodekey:'',oids:pks,outputType:flag});
        }
    }
    getTreeAllPks = (treeData)=>{
        let result = new Array();
        const loop = (treeData)=>{
            treeData.forEach(data=>{
                if(data.refpk!='~'){
                    result.push(data.refpk);
                }
                if(data.hasOwnProperty('children') && data.children.length>0){
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }
    /**
     * 检查是否有操作权限
     * @param node
     * @returns {*}
     */
    checkHasOperateAuth = (node)=>{
        if(this.config.nodeType=='GROUP_NODE'){
            return node.nodeData.isGroupNode;
        }
        return true;
    }
    /**
     * 检查是否可以停启用
     * @param node
     * @returns {boolean}
     */
    checkCurNodeEnableStateAuth = (node)=>{
        if(node.refpk == 'root' || node.refpk == '~'){
            return true;
        }
        if(!node.nodeData.isGroupNode && this.config.nodeType == 'GROUP_NODE'){
            toast({content:this.lang['10140PRJT-000033'],color:'warning'});/* 国际化处理： 当前集团只能维护当前集团的数据！*/
            return false;
        }else if(node.nodeData.isGroupNode && this.config.nodeType == 'GLOBE_NODE'){
            toast({content:this.lang['10140PRJT-000034'],color:'warning'});/* 国际化处理： 全局只能维护全局的数据！*/
            return false;
        }
        return true;
    }
    /**
     * 渲染
     * @returns {*}
     */
    render(){
        if(!this.lang)
            return '';
        const {asyncTree,syncTree,form,button,search,DragWidthCom,BillHeadInfo} = this.props;
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        // const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createButtonApp}=button;
        const {createBillHeadInfo} = BillHeadInfo;
        return(
            <div>
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/* 标题 title*/}
                    <div className="title">{/*this.config.title*/}
                    {createBillHeadInfo({
                                        title:this.config.title,
                                        initShowBackBtn:false
                                    })}</div>
                    <span className="showOff">
                        <NCCheckbox
                            disabled={this.state.disabledShowOff}
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange}
                            size="lg"
                        >
                            {this.lang['10140PRJT-000023']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
			        </span>

                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {createButtonApp({
                            area: this.config.formId,
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick,
                            popContainer: document.querySelector('.'+this.config.formId)
                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :this.config.treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    selectedKeys:this.state.selectedKeys,
                                    onSelectEve: this.onSelectTree,//选择
                                    onMouseEnterEve:this.onMouseEnterEve,
                                    clickEditIconEve: this.onEditProjectType, //编辑点击 回调
                                    clickAddIconEve: this.onAddProjectType, //新增点击 回调
                                    clickDelIconEve: this.onDeleteProjectType, // 删除点击 回调
                                    showModal:false,
                                    disabledSearch:this.state.disabledSearch,
                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    onAfterEvent: this.onAfterFormEvent,
                                    onBeforeEvent:this.onBeforeFormEvent,
                                    cancelPSwitch:true
                                })
                                }
                            </div> }     //右侧区域dom
                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {this.config.urls['printUrl']}
                    data={{
                        funcode:'10140PRJTG',
                        nodekey:'',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                >
                </PrintOutput>
            </div>
        )
    }
}
//KCoCSUjb7JGuSQ+WF0J54MHf9lJClqQh6RZzJesILPN/kic5P5AAGmODUXwEPVUm