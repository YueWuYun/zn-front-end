//y93ZP0NIitN7NsEBSgDAvpaCTjm/vhTJErfw9JfYWuwf/+9utoLS6J7bTgkuYvHy
import React,{Component} from 'react';
import {BaseUtils} from '../../../public/utils/index';
import { createPage, base, ajax ,NCCreateSearch,toast} from 'nc-lightapp-front';

/**
 * 银行档案数
 * @author zx
 * @param
 *      config{
 *          treeRootTitle:this.config.treeRootTitle,//根节点名称
            treeId:this.config.treeId,//树组件ID
            showLine:this.config.showLine, //显示连接线
            needSearch:this.config.needSearch || true,
            needEdit:this.config.needEdit || true,
            editNodeCallBack:this.editNodeCallBack.bind(this),
            addNodeCallBack: this.addNodeCallBack.bind(this),//  新增节点回调方法
            delNodeCallBack: this.delNodeCallBack.bind(this),//删除节点回调方法
            showModal:this.config.showModal || true,
            clickEditIconEve: this.clickEditIconEve.bind(this), //编辑点击 回调
            clickAddIconEve: this.clickAddIconEve.bind(this), //新增点击 回调
            clickDelIconEve: this.clickDelIconEve.bind(this), // 删除点击 回调
            metaId:this.config.metaId,    //弹出框中内容，树模板id（需要弹出编辑框才使用）
            searchType:'location',   // 搜索框查询方式，定位/过滤  location/filtration，默认定位
            type:this.config.type,
            pk_org:this.state.pk_org,
            stopFlag:this.state.stopFlag,               //是否停用
            loadNodeData:this.loadNodeData.bind(this),   //展开节点，加载叶子
            urls:{
                loadTreeDataUrl:"",   //加载树
                loadDocTreeUrl:'',   //加载银行档案即非第一层树
                queryCardUrl:"",     //查询右边卡片数据
                enablestateUrl:"",   //是否启用
                addCardUrl:"",        //新增树
                deleteUrl:'',        //删除树
                editUrl:'',         //编辑树
                saveUrl:'',         //保存树
                validateUrl:'',
                cancelUrl:''
            }
 *      }
 */
let pk_org;
class BankTypeTree extends Component{
    constructor(props = {}){
        super(props);
        this.config = Object.assign({
            treeId:"bankTypeTree",
            formId:"head",
            pageCode:"",
            type:'group',
            primaryKey:'',
            disabledSearch:false//控制树搜索框
        },this.props.treeConfig || {});
        this.state = {
            selectedNode:null,
            json:this.config.json || {},
            treeData:{},
            stopFlag:false,
            disabledSearch:this.config.disabledSearch,
            root:{
                "isleaf": false,
                "key":"~",
                "title":this.config.json && this.config.json['10140BANK-000000'],
                nodeData:{isleaf:false},
                "id":"~",
                "innercode":"~",
                //"pid": "~",
                "refname": this.config.json && this.config.json['10140BANK-000000'],
                "refpk": "~"
            }
        };
        //绑定事件，主要用于绑定this指针
        this.dealTreeData = this.dealTreeData.bind(this);
    }
    /**
     *  已加载组件收到新的参数时调用，即已渲染的数结构变化时调用
     */
    componentWillReceiveProps(newProps){
        let newConfig = newProps.treeConfig || {};
        this.setConfig.call(this,newConfig);
    }
    setConfig(config){
        this.config = Object.assign({
            treeRootTitle:this.state.json && this.state.json['10140BANK-000000'],
            treeId:"bankTypeTree",
            formId:"head",
            stopFlag:false,
            pageCode:"",
            primaryKey:''
        },config || {});
        this.state.stopFlag=config.stopFlag;
        this.state.showCust=config.showCust;
        this.state.showOthers=config.showOthers;
        this.state.json = config.json || {};
        this.state.root.title = this.state.json && this.state.json['10140BANK-000000'];
        this.state.root.refname = this.state.json && this.state.json['10140BANK-000000'];
        this.setState(this.state);
    }
    getSelectedTreeNode(){
        return this.state.selectedNode || {};
    }
    setPkOrg(pkOrg){
        pk_org = pkOrg;
    }
    /**
     * 树节点选中事件
     * @param pk
     */
    onSelectEve(pk,treeNode){
        if(Array.isArray(pk)){
            let temp = pk.slice(0);
            pk = temp[0];
            treeNode = temp[1];
            this.state.selectedNode = treeNode;
        }else{
            //将选中节点存入state中
            this.state.selectedNode = this.props.syncTree.getSelectNode(this.config.treeId);
        }
        this.setState(this.state,()=>{
            //点击的是银行类别父节点
            if(this.state.selectedNode && this.state.selectedNode.pid === '~'){
                this.loadTreeData(pk,treeNode,this.state.stopFlag,this.state.showCust,this.state.showOthers);
                //this.props.syncTree.openNodeByPk(this.config.treeId,pk);
            }else if(this.config.onSelectEve && BaseUtils.isFunction(this.config.onSelectEve)){
                this.config.onSelectEve(pk);
            }else{
                this.config.loadNodeData(pk,()=>{
                    this.loadTreeData(pk,treeNode,this.state.stopFlag,this.state.showCust,this.state.showOthers);
                });
            }
            //控制按钮状态
            this.config.disableButton(treeNode);
        });

    }
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        this.loadTreeData();
        if(this.config.type!='glb'){
            this.props.syncTree.setTreeEdit('bankTypeTree', false);
        }
    }
    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        
        let deleteDataChildrenProp = function(node){
            
            if(!node.children  || node.nodeData.isleaf) {
                delete node.children;
            }
            else{
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
     * 加载树
     */
    loadTreeData(pk,expandNode,stopFlag,showCust,showOthers){
        if(this.config.loadTreeData && BaseUtils.isFunction(this.config.loadTreeData)){
            this.config.loadTreeData(pk,treeNode);
        }else{
            let me = this;
            if(me.state.root.refpk == pk)
                return;
            //判断是否要加载银行档案
            let isDoc = false;
            let grandPid = "~";
           // let treeNode = this.state.selectedNode;
            //展开节点为空或展开节点的pid为~时说明展开的是银行类型
            if(expandNode){
               grandPid  = expandNode.pid;
               isDoc = true;
            }
            me.setState({
                showCust:showCust || false,
                showOthers:showOthers || false,
                stopFlag:stopFlag || false
            },()=>{
                let requestParams = {
                    pk_org:me.config.type == 'glb' ? 'GLOBLE00000000000000' : pk_org ? pk_org : me.config.pk_org,
                    stopFlag:me.state.stopFlag || false,
                    showCust:me.state.showCust || false,
                    showOthers:me.state.showOthers || false,
                    isDoc:isDoc,
                    type:me.config.type,
                    pid:pk === 'refresh' ? null : pk,
                    grandPid:grandPid,
                    keyword:me.config.keyword
                };
                ajax({
                    url:isDoc ? me.config.urls.loadDocTreeUrl : me.config.urls.loadTreeDataUrl,
                    loading:true,
                    data:requestParams,
                    success:(result)=>{
                        if(result.success){
                            if(!isDoc){
                               
                                // me.state.root.nodeData=iconBox;
                                let data = [Object.assign( me.state.root , {children : result.data || []} )];
                                //异步树
                                this.props.syncTree.setSyncTreeData(me.config.treeId , me.dealTreeData(data));
                                //展开节点  设置默认展开项
                                this.props.syncTree.openNodeByPk(this.config.treeId, me.state.root.refpk);
                                //必须将treeData放入state中，否则后续查询指定节点获取不到
                                this.state.treeData = me.dealTreeData(data);
                            }else{
                                if(result.data){
                                    expandNode.isLeaf = false;
                                    //expandNode.children=[];
                                    let temp = me.dealTreeData(result.data);
                                    let res = temp.filter((item)=>{
                                        let node = expandNode.children && expandNode.children.find((e)=> e.props && e.props.refpk == item.refpk || e.refpk && e.refpk == item.refpk);
                                        return !node;
                                    });
                                    if(res.length > 0)
                                        this.props.syncTree.addNodeSuccess(me.config.treeId,res);
                                    this.props.syncTree.openNodeByPk(me.config.treeId,pk);
                                }else{
                                    expandNode.isLeaf = true;
                                    //this.props.syncTree.editNodeSuccess(me.config.treeId,expandNode);
                                }
                                this.state.treeData = me.dealTreeData(this.props.syncTree.getSyncTreeValue(me.config.treeId ));
                            }

                            this.setState(this.state,()=>{
                                pk === 'refresh' && toast({title:me.state.json['10140BANK-000010'],color:'success'});
                            });
                        }
                    }
                });
            });

        }
    }

    /**
     * 节点选择改变事件
     * @param node
     */
    onSelectedChange(node){
        if(node){
            this.state.selectedNode = node;
            this.setState(this.state,()=>{
                if(this.config.onSelectedChange && BaseUtils.isFunction(this.config.onSelectedChange)){
                    this.config.onSelectedChange(node);
                }
            });
        }
    }

    /**
     * 鼠标滑过节点事件
     * @param node
     */
    onMouseEnterEve(pk,node){
        
        if(this.config.onMouseEnterEve && BaseUtils.isFunction(this.config.onMouseEnterEve)){
            this.config.onMouseEnterEve(pk,node);
        }else{
            let isTypeNode = (node.refpk !== this.state.root.refpk && node.pid === "~");
            //银行类别--只有是此种类型节点时，才显示编辑和删除图标  只有全局显示树图标
            if(this.config.type == 'glb'){
                if(!isTypeNode){
                    let iconBox = {
                        addIcon: true,
                        editIcon: false,
                        delIcon: false
                    }
                    this.props.syncTree.hideIcon(this.config.treeId,pk,iconBox);
                }
            }else{
                //this.props.syncTree.setTreeEdit("bankTypeTree",false);
                let iconBox = {
                    addIcon: false,
                    editIcon: false,
                    delIcon: false
                }
                this.props.syncTree.hideIcon(this.config.treeId,pk,iconBox);
            }
        }

    }

    /**
     * 编辑节点回调函数
     * @param formValues 弹框form中所有字段值  this.form.getAllFormValue(metaId)
     * 其中metaId为树模板id
     */
    editNodeCallBack(formValues){
        if(this.config.editNodeCallBack && BaseUtils.isFunction(this.config.editNodeCallBack)){
            this.config.editNodeCallBack(formValues);
        }
    }
    addNodeCallBack(formValues){
        if(this.config.addNodeCallBack && BaseUtils.isFunction(this.config.addNodeCallBack)){
            this.config.addNodeCallBack(formValues);
        }
    }
    delNodeCallBack(node){
        if(this.config.delNodeCallBack && BaseUtils.isFunction(this.config.delNodeCallBack)){
            this.config.delNodeCallBack(node);
        }
    }
    clickEditIconEve(item){
        if(this.config.clickEditIconEve && BaseUtils.isFunction(this.config.clickEditIconEve)){
            this.config.clickEditIconEve(item);
        }
    }

    /**
     * 点击新增图标
     * @param item
     */
    clickAddIconEve(item){
        if(this.config.clickAddIconEve && BaseUtils.isFunction(this.config.clickAddIconEve)){
            this.config.clickAddIconEve(item);
        }
    }
    clickDelIconEve(item){
        if(this.config.clickDelIconEve && BaseUtils.isFunction(this.config.clickDelIconEve)){
            this.config.clickDelIconEve(item);
        }
    }

    /**
     * 树节点展开关闭事件
     * @param expandedKeys
     * @param info
     */
    onTreeExpand(expandedKeys,info){
        let me = this;
        if(info){
            if(info.node.props.refpk != '~' && info.expanded){
                me.onSelectEve.call(this,[info.node.props.refpk,info.node.props]);
            }
        }
    }
    render(){
        const {syncTree} = this.props;
        //创建异步树
        const {createSyncTree} = syncTree;

        return (
            <div className="tree-area">
                {createSyncTree({
                    treeId:this.config.treeId,//树组件ID
                    expandedKeys:['~'],
                    searchType:'filtration',
                    onSelectEve:this.onSelectEve.bind(this),//选择
                    disabledSearch: this.props.treeConfig.disabledSearch || false,
                    loadTreeData:this.loadTreeData.bind(this), //加载子节点事件
                    onSelectedChange:this.onSelectedChange.bind(this), //选择节点改变事件
                    showLine:this.config.showLine, //显示连接线
                    needSearch:this.config.needSearch || true,
                    needEdit:this.config.needEdit || true,
                    editNodeCallBack:this.editNodeCallBack.bind(this),
                    addNodeCallBack: this.addNodeCallBack.bind(this),//  新增节点回调方法
                    delNodeCallBack: this.delNodeCallBack.bind(this),//删除节点回调方法
                    showModal:this.config.showModal || false,//为true会弹出默认modal
                    clickEditIconEve: this.clickEditIconEve.bind(this), //编辑点击 回调
                    clickAddIconEve: this.clickAddIconEve.bind(this), //新增点击 回调
                    clickDelIconEve: this.clickDelIconEve.bind(this), // 删除点击 回调
                    metaId:this.config.metaId,    //弹出框中内容，树模板id（需要弹出编辑框才使用）
                    //searchType:this.config.searchType || 'location',
                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                    onTreeExpand:this.onTreeExpand.bind(this),
                    metaId:this.config.metaId    //树模板id
                })}
            </div>
        );
    }
}

export default BankTypeTree
//y93ZP0NIitN7NsEBSgDAvpaCTjm/vhTJErfw9JfYWuwf/+9utoLS6J7bTgkuYvHy