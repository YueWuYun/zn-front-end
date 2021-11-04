//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, createPage, NCCreateSearch, toast,print,high,promptBox,createPageIcon} from 'nc-lightapp-front';
const {NCDiv,NCCheckbox,NCMessage,EmptyAreaTip} = base;
const { PrintOutput } = high;
import Utils from '../../../public/utils/index';
/****************默认参数  开始***********************/
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/eps/loadtreedata.do",
    queryCardUrl:"/nccloud/uapbd/eps/querycard.do",
    enablestateUrl:"/nccloud/uapbd/eps/enablestate.do",
    addCardUrl:"/nccloud/uapbd/eps/addcard.do",
    deleteUrl:'/nccloud/uapbd/eps/deltreenode.do',
    saveUrl:'/nccloud/uapbd/eps/savenode.do',
    printUrl:'/nccloud/uapbd/eps/printEps.do',
    isLowerLevelSealUrl:'/nccloud/uapbd/eps/isLowerLevelSeal.do'

};
/***************默认参数  结束********************/
/**
 * 企业项目结构（EPS）(改名为“项目基本分类”)
 * @author liupzhc
 */
export default class Eps extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            title: '',   //标题/* 国际化处理： 企业项目结构（EPS）-集团*/
            treeId:"epsTree",                 //树ID
            formId:"head",                    //表单areacode
            pageCode:"10140EPSG_form",             //pageid or json名称
            nodeType:'GROUP_NODE',            //节点类型  GLOBE_NODE GROUP_NODE ORG_NODE
            refresh:'/uapbd/pmbase/eps_grp/main/index.html', //刷新url
            urls:urls,                         //操作url
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
            /* 国际化处理： 企业项目结构（EPS）-集团  全局*/
            this.config.title = this.props.config.nodeType == 'GLOBE_NODE' ? this.lang['10140EPS-000025'] : this.lang['10140EPS-000000'];
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
                cardEmpty:true,
                checked: false,//判断 显示停用按钮是否选中
                disabledShowOff:false,
                curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
                formData:{},
                pks:null,
                selectedKeys:[this.root.refpk],
                disabledSearch:false,
                status:'browse',
                title:this.config.title
            }
            this.setState(this.state,()=>{
                this.initData.call(this);
            });

        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '10140EPS',domainName: 'uapbd',callback});
    }
    dealTreeData =(data)=>{
        let deleteDataChildrenProp = function(node){
            node.iconBox={
                addIcon:true,
                editIcon:true,
                delIcon:true,
            }
            if(!node.children || node.children.length == 0) {
                node.isLeaf = true;
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
        /*this.setState({selectedKeys:[this.root.refpk]},()=>{
            this.initData();
        })*/
    }
    componentDidUpdate(){
        if(this.state && this.state.status && this.state.status !='browse'){
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{

            window.onbeforeunload = null;
        }
    }

    initData =(callback)=>{
        let requestParam = {
            showOff:this.state.checked,
            nodeType:this.config.nodeType
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    if (result.data && result.data.length && result.data.length > 0){
                        this.setState({cardEmpty:false})
                    } else {
                        this.setState({cardEmpty:true})
                    }
                    //,'Refresh'
                    this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output'],!result.data || result.data.length ==0);
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    callback && callback();
                }
            }
        });
    }
    onSelectTree =(refpk)=>{
        this.setState({selectedKeys:[refpk]},()=>{
            //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
            let status = this.props.form.getFormStatus(this.config.formId);
            if(status == 'edit'){
                return;
            }
            this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output'],refpk == this.root.refpk);
            if(refpk == this.root.refpk){
                //清空表单
                this.props.form.EmptyAllFormValue(this.config.formId);
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                return;
            }
            ajax({
                url:this.config.urls.queryCardUrl,
                data:{pk_eps:refpk,nodeType:this.config.nodeType},
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
                            let enablestateValue = headData.enablestate.value;
                            //根据表单项enablestate的值修改开关状态
                            if(enablestateValue == '2'){
                                result.data.head.rows[0].values.enablestate.value = true;
                                result.data.head.rows[0].values.enablestate.display = true;
                            }else{
                                result.data.head.rows[0].values.enablestate.value = false;
                                result.data.head.rows[0].values.enablestate.display = false;
                            }
                        }
                        if(headData.pk_parent.display == this.root.refpk){
                            result.data.head.rows[0].values.pk_parent.display = '';
                            result.data.head.rows[0].values.pk_parent.value='';
                        }
                        this.state.formData[this.config.formId] = result.data[this.config.formId].rows[0].values;
                        this.setState(this.state);
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
        // let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);
        // return this.checkCurNodeEnableStateAuth(selectedTreeNode);
        return true;
    }
    onAfterFormEvent=(props, moduleId, key, value, index)=>{
        switch(key){
            case "enablestate":
                //获得选中节点
                /* bugfix NCCLOUD-163597  this.state.curSelectedNode || */
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
                if(!selectedTreeNode){
                    let contentMsg = value.value?this.lang['10140EPS-000001']:this.lang['10140EPS-000002'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    NCMessage.create({content: contentMsg, color: 'warning'});//默认top
                    return;
                }
                /******************
                 * 检查操作权限
                 ******************/
                    let hasAuth = this.checkCurNodeEnableStateAuth(selectedTreeNode);
                    if(!hasAuth){
                        props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                        return;
                    }
                let requestParam = {
                        pk_eps:selectedTreeNode.refpk,
                        enablestate:value.value?'2':'1',
                        ts:selectedTreeNode.nodeData.ts,
                        nodeType:this.config.nodeType
                    };
                let enable = value.value;
                /***********************************************************************
                 * 启用：判断树节点和当前打开的节点是否匹配，不匹配给出提示，
                 * 停用：判断树节点下有没有未停用的树节点，有->给出不能停用的提示；无->停用
                 *
                 * 这里的提示比较繁琐。
                 ***********************************************************************/
                ajax({
                    url:this.config.urls.isLowerLevelSealUrl,
                    data:requestParam,
                    success:(res)=>{
                        if(!enable&&selectedTreeNode.isLeaf){
                            //全局节点是叶子节点，并且其下面又存在未停用的节点，则表示它下面存在因管控模式可见性而未见的集团节点，故不能停用
                            if(res.success && !selectedTreeNode.nodeData.isGroupNode && res.data.allSealFlag && res.data.hasUnSealGroupNode ){
                                props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:null}});
                                toast({content:this.lang['10140EPS-000003'],color:'warning'});/* 国际化处理： 该节点下存在未停用的集团级节点，不能停用，请先停用集团级节点。*/
                                return;
                            }
                        }
                        let msg = (!enable && res.data.allSealFlag)?this.lang['10140EPS-000004']:enable?this.lang['10140EPS-000005']:this.lang['10140EPS-000006'];/* 国际化处理： 该档案存在已启用的下级，是否将所有下级同时停用?,是否确认启用?,是否确认停用?*/
                        promptBox({
                            color:'warning',
                            title:this.lang['10140EPS-000007'],/* 国际化处理： 提示*/
                            content: msg,
                            beSureBtnClick:()=>{
                                let hasAuth = enable?this.checkParentEnableStateAuth(selectedTreeNode.pid):true;
                                if(hasAuth){
                                    ajax({
                                        url:this.config.urls.enablestateUrl,
                                        data:requestParam,
                                        success:(result)=>{
                                            result.success && toast({content:enable?this.lang['10140EPS-000008']:this.lang['10140EPS-000009'],title:this.lang['10140EPS-000007']});/* 国际化处理： 启用成功,停用成功,提示*/
                                        }
                                    });
                                }else{
                                    //没有权限时，需要把启用状态恢复，处理逻辑同取消按钮。
                                    props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:null}});
                                }
                            },
                            cancelBtnClick:()=>{
                                props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:null}});
                                return;
                            }
                        })
                    }
                })
                break;
            default:
                break;
        }
    }
    onAddEps = (selectNode)=>{
        this.setState({curSelectedNode:selectNode,disabledShowOff:true,status:'add',cardEmpty:false},()=>{
            let requestParam = {
                pk_parent:selectNode?selectNode.refpk:this.root.refpk,
                nodeType:this.config.nodeType
            };
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
                        this.props.form.setFormStatus(this.config.formId, this.state.status);
                        this.setState({disabledSearch:true},()=>{
                            //设置新增默认值
                            this.props.form.setAllFormValue({[this.config.formId]:this.filterEmptyData(result.data[this.config.formId].rows[0].values,this.state.status)});
                            this.props.syncTree.setNodeSelected(this.config.treeId, selectNode.refpk);
                            //设置表单项不可用
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
                            this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                            this.changeButtonStatus(selectNode,this.config.actions.TreeNodeAdd);
                        });
                    }
                }
            })
        });
    }
    filterEmptyData = (data,status)=>{
        const isObject =function (param){
            return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
        }
        if(!isObject(data) || status != 'add'){
            return {rows:[{values:data}]};
        }
        let filterData = new Object();
        Object.keys(data).forEach(key=>{
            data[key] && (data[key].value || data[key].display) && Object.assign(filterData,{[key]:data[key]});
        })
        return {rows:[{values:filterData}]};
    }
    onEditEps = (selectedTreeNode)=>{
        /******************
         * 检查操作权限
         ******************/
        let hasAuth = this.checkHasOperateAuth(selectedTreeNode);
        if(!hasAuth){
            toast({content:this.lang['10140EPS-000010'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
            return;
        }
        this.setState({curSelectedNode:selectedTreeNode,disabledShowOff:true,status:'edit'},()=>{
            if (!selectedTreeNode) {
                NCMessage.create({content: this.lang['10140EPS-000011'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点*/
                return;
            }
            ajax({
                url:this.config.urls.queryCardUrl,
                data:{pk_eps:selectedTreeNode.refpk,nodeType:this.config.nodeType},
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
                        this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
                        //设置表单状态为编辑态
                        this.props.form.setFormStatus(this.config.formId, 'edit');
                        this.changeButtonStatus(selectedTreeNode,this.config.actions.TreeNodeEdit);
                    }
                }
            });
        });
    }
    onSaveEps =()=>{
        /**主动表单校验**/
        if(!this.props.form.isCheckNow(this.config.formId)) return;
        let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if(!selectedTreeNode){
            selectedTreeNode = this.state.curSelectedNode;
        }
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            //pcode: selectedTreeNode.nodeData.pcode
            nodeType:this.config.nodeType
        };
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(formData.rows[0].values.hasOwnProperty('pk_eps')){
            nonPk = formData.rows[0].values.pk_eps.value?false:true;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        let data = {
            model:formData,
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
    
                        if( result.data.treeNodeData[0].children && result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        result.data.treeNodeData[0].isLeaf = true;
                        var pnode = this.props.syncTree.getSyncTreeValue(this.config.treeId,result.data.treeNodeData[0].pid);
                        nonPk?(pnode?this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]):this.setNode2TempFatherNode(result.data.codeRule,result.data.treeNodeData[0])):
                        this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                       
                        // nonPk? this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]):
                        //     this.props.syncTree.editNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
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
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        
                        //清空自定已选中项
                        this.setState({curSelectedNode:null,disabledShowOff:false,disabledSearch:false,status:'browse'},()=>{
                            toast({content:this.lang['10140EPS-000012'],color:'success'});/* 国际化处理： 保存成功。*/
                        });
                        //保存成功后修改状态
                        this.changeButtonStatus(selectedTreeNode,this.config.actions['Save']);
                    }
                }
            });
        },{[this.config.formId]:'form'},'form');
    }
    treeToList =(data, list = [])=> {
        // data 树结构数据
        if (Array.isArray(data)) {
            data.forEach((e) => {
                // 获取除 children 外的其他属性，并且放进list数组
                let { children, ...others } = e;
                list.push({ ...others });
                if (Array.isArray(e.children)) {
                    this.treeToList(e.children, list);
                }
            });
            // 返回list集合
            return list;
        } else {
            return false;
        }
    }
    setNode2TempFatherNode = (codeRule,curNode)=>{
        var treeNodes = this.props.syncTree.getSyncTreeValue(this.config.treeId);
        const getEveryLevelCodeLength = (codes)=>{
            let lengthArr = new Array();
            codes.forEach((code,index)=>{
                let length = 0;
                for(var i =0 ; i<=index; i++){
                    length+=parseInt(code);
                }
                lengthArr.push(length);
            });
            return lengthArr;
        }
        const getPNode = (pcode,tree)=>{
            var list = new Array();
            tree && this.treeToList(tree,list);
            var pNode = list && list.length>0 && list.find(node=>{
                return pcode == node.code;
            })
            if(!pNode){
                pNode = tree[0];
            }
            return pNode;
        }
        var codeArr = codeRule.split("/");
        var lengthArr = getEveryLevelCodeLength(codeArr);
        var curNodeCode = curNode.code;
        for(var i = 0;i<lengthArr.length;i++){
            var pcode = curNodeCode.substr(0,lengthArr[i]);
            var pNode = getPNode(pcode,treeNodes);
            if(pNode){
                var children = pNode.children || new Array();
                children.push(curNode);
                pNode.children = children;
                return;
            }
            
        }
    }
    onSaveAddEps = ()=>{
        /**主动表单校验**/
        if(!this.props.form.isCheckNow(this.config.formId)) return;
        let selectedTreeNode = this.state.curSelectedNode || this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            nodeType:this.config.nodeType
        };
        let data = {
            model:formData,
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
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        this.setState({disabledSearch:false});
                        if( result.data.treeNodeData[0].children && result.data.treeNodeData[0].children.length == 0 ){
                            delete result.data.treeNodeData[0].children;
                        }
                        result.data.treeNodeData[0].isLeaf = true;
                        //新增回调后添加
                        var pnode = this.props.syncTree.getSyncTreeValue(this.config.treeId,result.data.treeNodeData[0].pid);
                        if(pnode){
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data.treeNodeData[0]);
                            this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
                        }else{
                            this.setNode2TempFatherNode(result.data.codeRule,result.data.treeNodeData[0]);
                        }
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
                                    //设置表单为编辑态
                                    this.props.form.setFormStatus(this.config.formId, 'add');
                                    this.setState({status:'add'},()=>{
                                        this.props.form.setAllFormValue({[this.config.formId]:this.filterEmptyData(result.data[this.config.formId].rows[0].values,this.state.status)});
                                        //新增成功，设置表单默认值
                                        this.changeButtonStatus(selectedTreeNode,this.config.actions['SaveAdd']);
                                    });
                                }
                            }
                        })
                    }
                }
            });
        },{[this.config.formId]:'form'},'form');
    }
    onDeleteEps =(selectedTreeNode)=>{
        if (!selectedTreeNode) {
            NCMessage.create({content: this.lang['10140EPS-000013'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        let message = this.lang['10140EPS-000014']/* 国际化处理： 确认要删除所选数据吗？*/

        promptBox({
            color:'warning',
            title: this.lang['10140EPS-000015'],/* 国际化处理： 确认删除*/
            content: message,
            beSureBtnClick: () => {
                let requestParam = {
                    pk_eps:selectedTreeNode.refpk,
                    ts:selectedTreeNode.nodeData.ts,
                    isLeaf:selectedTreeNode.isLeaf,
                    nodeType:this.config.nodeType
                }
                ajax({
                    url:this.config.urls.deleteUrl,
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            //调用异步树的接口，删除该树节点
                            this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                            this.changeButtonStatus(selectedTreeNode,this.config.actions.TreeNodeDel);
                            if (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0){
                                this.setState({cardEmpty:true})
                            }
                            toast({content:this.lang['10140EPS-000016'],title:this.lang['10140EPS-000007']});/* 国际化处理： 删除成功！,提示*/
                        }
                    }
                })
            }
        });
    }
    onCancelEpsPrompt = (callback)=>{
        promptBox({
            color:"warning",
            title:this.lang['10140EPS-000017'],/* 国际化处理： 确认取消*/
            content:this.lang['10140EPS-000018'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick:function(){
                callback && callback();
            }.bind(this)
        })
    }
    onCancelEps =()=>{
        this.setState({disabledShowOff:false,status:'browse'},()=>{
            let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
            this.props.form.EmptyAllFormValue(this.config.formId);
            if(selectedTreeNode){
                ajax({
                    url:this.config.urls.queryCardUrl,
                    data:{pk_eps:selectedTreeNode.refpk,nodeType:this.config.nodeType},
                    success:(result)=>{
                        if(result.success && result.data){
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
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});//设置表单项可用

                        }else{
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                        }
                        if (!this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children || this.props.syncTree.getSyncTreeValue(this.config.treeId)[0].children.length === 0){
                            this.setState({cardEmpty:true})
                        }
                        //设置按钮状态
                        this.changeButtonStatus(selectedTreeNode,this.config.actions['Cancel']);
                    }
                });
            }else{
                //没有选中项  清空所有数据
                this.props.form.EmptyAllFormValue(this.config.formId);
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                //设置按钮状态
                this.changeButtonStatus(selectedTreeNode,this.config.actions['Cancel']);
            }
            this.props.form.setFormStatus(this.config.formId, 'browse');
            //设置树可用
            this.props.syncTree.setNodeDisable(this.config.treeId,false);
            this.setState({disabledSearch:false});
        })
    }
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
    onMouseEnterEve = (key)=>{
        let node = this.props.syncTree.getSyncTreeValue(this.config.treeId,key);
        let obj = {
            delIcon:true, //false:隐藏； true:显示; 默认都为true显示
            editIcon:true,
            addIcon:true
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
                addIcon:true
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
    onChange =(checked)=>{
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if(!selectNode ){
            NCMessage.create({content: this.lang['10140EPS-000019'], color: 'warning'});//默认top/* 国际化处理： 请选中树节点*/
        }
        requestParam['pk_eps'] = selectNode.refpk;
        requestParam['enablestate'] = checked?'2':'1';
        requestParam['nodeType'] = this.config.nodeType;
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    } else {
                        //如果不是选中那就清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
                    }
                }
            }
        });
    }
    onCheckBoxChange = ()=>{
        this.setState({checked:!this.state.checked},()=>{
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            let requestParam = {
                showOff:this.state.checked,
                nodeType:this.config.nodeType
            };
            ajax({
                url:this.config.urls.loadTreeDataUrl,
                data:requestParam,
                success:(result)=>{
                    if(result.success){
                        if (result.data && result.data.length && result.data.length > 0){
                            this.setState({cardEmpty:false})
                        } else {
                            this.setState({cardEmpty:true})
                        }
                        var data = [Object.assign( {...this.root} , {children : result.data} )],
                            initLeaf = function(node){
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
    onRefreshEps =()=>{
        this.setState({
            //checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            formData:{}
        },()=>{
            this.initData.call(this,()=>{
                toast({title:this.lang['10140EPS-000026'],color:'success'});
            });
            this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            //设置表单项可用
            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
        });
    }
    onButtonClick =(props,id)=>{
        switch(id){
            case this.config.actions.Refresh:
                this.onRefreshEps();
                break;
            case this.config.actions.Save:
                this.onSaveEps();
                break;
            case this.config.actions.SaveAdd:
                this.onSaveAddEps();
                break;
            case this.config.actions.Cancel:
                this.onCancelEpsPrompt(this.onCancelEps);
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
            print('pdf',this.config.urls.printUrl,{billtype:'',funcode:'10140EPSG',nodekey:'',oids:pks,outputType:flag});
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
    checkCurNodeEnableStateAuth = (node)=>{
        if(node.refpk =='root' || node.refpk =='~'){
            return true;
        }
        if(!node.nodeData.isGroupNode && this.config.nodeType == 'GROUP_NODE'){
            toast({content:this.lang['10140EPS-000020'],color:'warning'});/* 国际化处理： 当前集团只能维护当前集团的数据*/
            return false;
        }else if(node.nodeData.isGroupNode && this.config.nodeType == 'GLOBE_NODE'){
            toast({content:this.lang['10140EPS-000021'],color:'warning'});/* 国际化处理： 全局只能维护全局的数据*/
            return false;
        }
        return true;
    }
    checkParentEnableStateAuth = (pid)=>{
        if(pid == this.root.refpk || pid == 'root')
            return true;
        let node = this.props.syncTree.getSyncTreeValue(this.config.treeId,pid);
        if(node && node.nodeData && !node.nodeData.enablestate){
            toast({content:this.lang['10140EPS-000022'],color:'warning'});/* 国际化处理： 上级停用，下级无法启用!*/
            return false;
        }
        return true;
    }

    addClickCall = () => {
        this.onAddEps(this.root)
    }

    render(){
        if(!this.lang)
            return '';
        const {syncTree,form,button,ncmodal,DragWidthCom,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createButtonApp}=button;
        let { createModal } = ncmodal;  //模态框
        const {cardEmpty} = this.state;
        return(
            <div className="nc-bill-tree-card">
                {createModal('modal',{
                    leftBtnName : this.lang['10140EPS-000023']})/* 国际化处理： 确定*/}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/*createPageIcon()*/}
                    {/* 标题 title*/}
                    {/*<div className="title" fieldid={this.props.config.title+'_title'}>{this.config.title}</div>*/}
                    <div className="header-title-search-area">
                    {createBillHeadInfo({
                                        title:this.config.title,
                                        initShowBackBtn:false
                                    })}
                    </div>
                    <span className="showOff">
                        <NCCheckbox
                            disabled={this.state.disabledShowOff}
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange}
                            size="lg"
                        >
                            {this.lang['10140EPS-000024']/* 国际化处理： 显示停用*/}
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
                                    onSelectEve: this.onSelectTree,//选择
                                    selectedKeys:this.state.selectedKeys,
                                    onMouseEnterEve:this.onMouseEnterEve,
                                    clickEditIconEve: this.onEditEps, //编辑点击 回调
                                    clickAddIconEve: this.onAddEps, //新增点击 回调
                                    clickDelIconEve: this.onDeleteEps, // 删除点击 回调
                                    showModal:false,
                                    disabledSearch:this.state.disabledSearch,
                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom = {
                            <div style={{ height: '100%' }}>
                                <EmptyAreaTip
                                type="btn"
                                desc={this.lang['10140EPS-000027']}
                                onClick={this.addClickCall}
                                show={cardEmpty} />
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    onBeforeEvent:this.onBeforeFormEvent,
                                    onAfterEvent: this.onAfterFormEvent.bind(this),
                                    cancelPSwitch: true
                                })
                                }
                            </div></div> }     //右侧区域dom
                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                        leftMinWid = '300px'
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {this.config.urls['printUrl']}
                    data={{
                        funcode:'10140EPSG',
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
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65