//hBScdMuaQUcfWvROlENkvzVWP2pD2hYdM6D+LlJFzamMMYSZGOCHywZ49Re8byV6
import React,{Component} from 'react';
import {ajax,base,toast,promptBox} from 'nc-lightapp-front';
import Utils,{BaseUtils} from '../../../public/utils/index';

class SupplierClassTree extends Component{
    constructor(props){
        super(props);
        this.lang = props.lang;
        this.state = {
            ...this.props,
            selectedNode:null,
            disabledSearch:false,
        }
    }
    /**
     * state更新 重置
     * @param newProps
     */
    componentWillReceiveProps(newProps){
        this.state = {
            ...newProps
        }
       this.setState(this.state);
    }
    /**
     * 设置树节点选中
     * @param treeId
     * @param refpk
     */
    setTreeNodeSelected(treeId,refpk){
        this.props.syncTree.setNodeSelected(treeId, refpk);
    }
    /**
     * 获得树节点选中数据
     * @param treeId
     */
    getSelectedTreeNode(treeId){
        return this.props.syncTree.getSelectNode(treeId);
    }
    /**
     * 设置树数据
     * @param treeId
     * @param data
     */
    setTreeData(treeId,data){
        debugger
        this.props.syncTree.setSyncTreeData(treeId , Utils.dealTreeData(data));
    }
    /**
     * 获得树全部数据
     * @param treeId
     */
    getTreeData(treeId,refpk){
        return this.props.syncTree.getSyncTreeValue(treeId,refpk);
    }
    /**
     * 编辑树数据成功事件
     * @param treeId
     * @param data
     */
    editTreeNodeSuccess(treeId,data){
        this.props.syncTree.editNodeSuccess(treeId,data);
    }
    /**
     * 新增树数据成功事件
     * @param treeId
     * @param data
     */
    addTreeDataSuccess(treeId,data){
        this.props.syncTree.addNodeSuccess(treeId,data);
    }
    /**
     * 删除树数据成功事件
     * @param treeId
     * @param data
     */
    deleteTreeDataSuccess(treeId,data){
        this.props.syncTree.delNodeSuceess(treeId,data);
    }
    /**
     * 展开指定节点
     * @param treeId
     * @param key
     */
    openNode(treeId,key){
        this.props.syncTree.openNodeByPk(treeId, key);
    }
    /**
     * 移动树节点
     * @param config
     */
    moveTreeData(config){
        //树数据
        let treeData = config.treeData || this.props.syncTree.getSyncTreeValue(config.treeId);
        //移动
        this.props.syncTree.moveNode(config.treeId,config.curNodeKey,config.targetNodeKey);
        //检查原父节点还有没有子节点
        Utils.checkHasChildren(treeData,config.originNodeKey);
    }
    /**
     * 设置树组件状态 可用 不可用
     * @param treeId
     * @param bool
     */
    setTreeStatus(treeId,bool){
        this.props.syncTree.setNodeDisable(treeId,bool);
        // this.setState({disabledSearch:bool});
    }
    /**
     * 设置树的状态
     */
    initTreeStatus(treeId,nodeType,curOrg){
        this.props.syncTree.setNodeDisable(treeId,false);
        // this.setState({disabledSearch:false});
        if(nodeType == 'ORG_NODE'){
            debugger
            this.props.syncTree.setNodeDisable(treeId,!curOrg || curOrg == '' || !curOrg.hasOwnProperty("refpk"));
            this.setState({disabledSearch:!curOrg || curOrg == '' || !curOrg.hasOwnProperty("refpk")});
            // if(!curOrg || curOrg == '' || !curOrg.hasOwnProperty("refpk")){
            //     this.props.syncTree.setNodeDisable(treeId,true);//业务单元，没有组织情况下，设置整棵树不可用
            //     this.setState({disabledSearch:true});
            // }else{
            //     this.props.syncTree.setNodeDisable(treeId,false);
            //     this.setState({disabledSearch:false});
            // }
        }
    }
    /**
     * 通用ajax请求
     * @param config
     * @param callback
     */
    ajaxRequest = async (config)=>{
       return await new Promise(resolve=>{
           ajax({
               url:config.url,
               data:config.param,
               success:(res)=>{
                   if(res.success && config.callback &&typeof config.callback === 'function'){
                       return resolve(config.callback(res,this.state.curOrg));
                   }
               }
           })
       })
    }
    /**
     * 加载树数据
     */
    loadTreeData(callback){
        /*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string,nodeType:string}}
         *****************************************************************/
        let requestParam = {
            isShowOff:this.state.isShowOff,
            pk_curOrg:this.state.curOrg.refpk,//当前选择的组织pk
            nodeType:this.state.nodeType
        };
        let config = {
            url:this.state.urls.loadTreeDataUrl,
            param:requestParam,
            callback:(result,curOrg)=>{
                let data = [Object.assign( {...this.state.root} , {children : result.data} )];
                if(this.state.nodeType == 'ORG_NODE' && (!curOrg || curOrg == '' || !curOrg.hasOwnProperty('refpk'))){
                    data = [this.state.root];
                }
                this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output','Refresh'],!(data[0].children && data[0].children.length>0));

                //设置树数据
                this.setTreeData(this.state.treeId,data);
                //展开节点
                this.openNode(this.state.treeId, data[0].refpk);
                if(data[0].children && data[0].children.length>0){
                    this.props.syncTree.setNodeSelected(this.state.treeId,data[0].children[0].refpk);
                    this.onSelectTreeCallBack(data[0].children[0].refpk);
                }
                this.initTreeStatus(this.state.treeId,this.state.nodeType,this.state.curOrg);
                callback && callback(data);
            }
        }
        //请求数据
        this.ajaxRequest.call(this,config);
    }
    /**
     * 点击树节点回调
     * @param value
     */
    onSelectTreeCallBack(value){
        let me = this;
        // if(this.checkTreeNodeIsDisabled(this.getTreeData(this.state.treeId,value))){
        //     return;
        // }
        this.props.button.setButtonDisabled(['Print','Menu_Print','Menu_Output'], value == this.state.root.refpk);
        //有业务穿插，这样不好，但是这业务也够劲儿
        this.props.form.EmptyAllFormValue(this.props.formId);
        this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true});
        if(value == this.state.root.refpk){
            return;
        }
        let requestParam = {
            pk_curOrg:this.state.curOrg.refpk,
            [this.state.primaryKey]:value,
            nodeType:this.state.nodeType
        }
        let config = {
            url:this.state.urls.queryCardUrl,
            param:requestParam,
            callback:(result)=>{
                //显示公式
                if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        result.formulamsg,
                        {
                            [this.props.formId]:'form'
                        }
                    );
                }
                
                //点击树回调事件
                if(this.state.onSelectTreeCallBack && typeof this.state.onSelectTreeCallBack ==='function'){
                    
                    this.state.onSelectTreeCallBack(result.data);
                }
            }
        }
        //ajax请求
        this.ajaxRequest(config);
    }
    /**
     * 鼠标进入节点区域回调
     * @param value
     */
    onMouseEnterEveCallBack(key,node){
        //false:隐藏； true:显示; 默认都为true显示
        let obj = {
            delIcon:false, //false:隐藏； true:显示; 默认都为true显示
            editIcon:false,
            addIcon:true
        }
        if(key == this.props.root.refpk){
            obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
        }else{
            let {isGlobeData,isGroupData,isOrgData} = node.nodeData;
            //态low态low态low态low态low态low
            switch(this.props.nodeType){
                case 'GLOBE_NODE'://全局节点
                    if(isGlobeData){//全局数据
                        obj = {
                            delIcon:true,
                            editIcon:true,
                            addIcon:true
                        }
                    }else if(isGroupData || isOrgData){//非全局数据
                        obj = {
                            delIcon:false,
                            editIcon:false,
                            addIcon:false
                        }
                    }
                    break;
                case 'GROUP_NODE':
                    if(isGroupData){
                        obj = {
                            delIcon:true,
                            editIcon:true,
                            addIcon:true
                        }
                    }else if(isGlobeData){
                        obj = {
                            delIcon:false,
                            editIcon:false,
                            addIcon:true
                        }
                    }
                    break;
                case 'ORG_NODE':
                    if(isOrgData){
                        obj = {
                            delIcon:true,
                            editIcon:true,
                            addIcon:true
                        }
                    }else{
                        obj = {
                            delIcon:false,
                            editIcon:false,
                            addIcon:true
                        }
                    }
                    break;
            }
        }
        this.props.syncTree.hideIcon(this.state.treeId, key, obj );
    }
    /**
     * 鼠标点击树节点新增回调
     * @param node
     */
    onClickAddIconEveCallBack(node){
        if(this.checkTreeNodeIsDisabled(node)){
            return;
        }
        let config = {
            url:this.state.urls.addUrl,
            param:{
                pk_supplierclass:node.refpk,
                isShowOff:this.state.isShowOff,
                pk_curOrg:this.state.curOrg.refpk,
                nodeType:this.state.nodeType,
                parent_id:node.refpk,
            },
            callback:(result)=>{
                 //显示公式
                 if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        result.formulamsg,
                        {
                            [this.props.formId]:'form'
                        }
                    );
                }
                this.state.selectedNode = node;
                this.setState(this.state,()=>{
                    if(this.state.onClickAddIconEveCallBack && typeof this.state.onClickAddIconEveCallBack === 'function'){
                        this.state.onClickAddIconEveCallBack(result.data,this.state.selectedNode);
                    }
                });


            }
        }
        //ajax请求
        this.ajaxRequest(config);
    }
    /**
     * 鼠标点击树节点编辑回调
     * @param node
     */
    onClickEditIconEveCallBack(node){
        if(this.checkTreeNodeIsDisabled(node)){
            return;
        }
        //编辑
        const onEditNode = (node)=>{
            let config = {
                url:this.state.urls.editUrl,
                param:{
                    pk_supplierclass:node.refpk,
                    isShowOff:this.state.isShowOff,
                    pk_curOrg:this.state.curOrg.refpk,
                    nodeType:this.state.nodeType,
                },
                callback:(result)=>{
                     //显示公式
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                [this.props.formId]:'form'
                            }
                        );
                    }
                    this.state.selectedNode = node;
                    this.setState(this.state,()=>{
                        if(this.state.onClickEditIconEveCallBack && typeof this.state.onClickEditIconEveCallBack === 'function'){
                            this.state.onClickEditIconEveCallBack(result.data,node);
                        }
                    });
                }
            }
            //ajax请求
            this.ajaxRequest(config);
        };

        //校验
        let result = this.validate(node);
        //返回一个promise对象
        result.then((res)=>{
            //如果为true继续执行
            if(res){
                onEditNode(node);
            }
        })
    }

    //编辑前校验
     validate = (node)=>{
        let validateConfig = {
            url:this.state.urls.validateUrl,
            param:{
                pk_supplierclass:node.refpk,
                isShowOff:this.state.isShowOff,
                pk_curOrg:this.state.curOrg.refpk,
                nodeType:this.state.nodeType,
                parent_id:node.refpk,
            },
            callback:(data)=>{
                return data;
            }
        };
        //ajax请求
        return this.ajaxRequest(validateConfig);
    };
    /**
     * 鼠标点击树节点删除回调
     * @param node
     */
    onClickDelIconEveCallBack(node){
        if(this.checkTreeNodeIsDisabled(node)){
            return;
        }
        const onDeleteNode = (node)=>{
            let config = {
                url:this.state.urls.deleteUrl,
                param:{
                    pk_supplierclass:node.refpk,
                    ts:node.nodeData.ts,
                    isShowOff:this.state.isShowOff,
                    pk_curOrg:this.state.curOrg.refpk,
                    nodeType:this.state.nodeType,
                },
                callback:(result)=>{
                    this.state.selectedNode = node;
                    this.setState(this.state);
                    if(this.state.onClickDelIconEveCallBack && typeof this.state.onClickDelIconEveCallBack === 'function'){
                        this.state.onClickDelIconEveCallBack(result.data,node);
                    }
                }
            }
            //ajax请求
            this.ajaxRequest(config);
        };

        promptBox({
            color:'warning',
            title: this.lang['10140SCL-000011'],/* 国际化处理： 确认删除*/
            content: this.lang['10140SCL-000012'],/* 国际化处理： 您确定要删除所选数据吗?*/
            beSureBtnClick: ()=>{
                promptBox({
                    color:'warning',
                    title: this.lang['10140SCL-000011'],/* 国际化处理： 确认删除*/
                    content: this.lang['10140SCL-000013'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
                    beSureBtnClick: () => {
                        //校验
                        let result = this.validate(node);
                        //返回一个promise对象
                        result.then((res)=>{
                            //如果为true继续执行
                            if(res){
                                onDeleteNode(node);
                            }
                        })
                    }
                });
            }
        });


    }
    /**
     * 鼠标改变树节点选中回调
     * @param node
     */
    onSelectedChanged(node){
        if(this.state.hasOwnProperty('onSelectedChanged') && BaseUtils.isFunction(this.state.onSelectedChanged)){
            if(node.refpk !== this.state.selectedNode.refpk){
                this.state.onSelectedChange(node);
            }
        }
    }

    checkTreeNodeIsDisabled(node){
        return !!node.disabled;
    }

    render(){
        const {syncTree,ncmodal} = this.state;
        const {createSyncTree} = syncTree;//创建同步树
        const {createModal} = ncmodal;
        return(
            <div className="tree-area">
                {createSyncTree({
                    treeId :this.state.treeId,                 //树组件ID
                    needEdit: this.state.needEdit || true,     //启用编辑          默认启用
                    showLine: this.state.showLine || false,    //显示连线          默认不显示
                    needSearch: this.state.needSearch || true, //是否需要搜索框     默认需要搜索框
                    onSelectEve: this.onSelectTreeCallBack.bind(this),//选择
                    onMouseEnterEve:this.onMouseEnterEveCallBack.bind(this),
                    clickAddIconEve: this.onClickAddIconEveCallBack.bind(this),    //新增点击 回调
                    clickEditIconEve: this.onClickEditIconEveCallBack.bind(this),  //编辑点击 回调
                    clickDelIconEve: this.onClickDelIconEveCallBack.bind(this),    // 删除点击 回调
                    showModal:this.state.showModal || false,    //是否弹层编辑      默认不弹出
                    onSelectedChange:this.onSelectedChanged.bind(this),
                    searchType:'filtration',//树节点过滤方式修改
                    disabledSearch:this.state.disabledSearch

                })}
                {createModal('modal',{noFooter:false})}
            </div>
        )
    }
}
export default SupplierClassTree
//hBScdMuaQUcfWvROlENkvzVWP2pD2hYdM6D+LlJFzamMMYSZGOCHywZ49Re8byV6