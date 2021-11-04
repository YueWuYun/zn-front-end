//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,cardCache,createPageIcon} from 'nc-lightapp-front';
import AssigntempTree from "../component/assigntemptree";
import Assigntemprule from "../component/rulesquery.js"
import './index.less'
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;
let {setDefData, getDefData } = cardCache;
const { NCDiv } = base;

/****************默认参数  开始***********************/
let tableId = 'assigntemp';//卡片组件Id
let pageCode="10180ADVCG_assigntemp";//默认集团
let appcode="10180ADVCG";//默认集团
const assdatasource = 'uapbd.other.assigntemplate.dataSource';
const pk_item = 'pk_assign_temp';
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/assigntemp/AssigntemLoadTreeData.do",
    queryTableUrl:"/nccloud/uapbd/assigntemp/AssigntemLoadTableData.do",
    deleteCardUrl:"/nccloud/uapbd/assigntemp/AssigntemDelCardData.do",
    queryAssigntemplatePageGridByPksUrl:"/nccloud/uapbd/assigntemp/queryAssigntemplatePageGridByPks.do",
};
/***************默认参数  结束********************/

/**
 * 分配默认值配置
 * @author xuehaoc
 */
class Assigntemplate extends Component {
    constructor(props){
        super(props);
        this.props = props;
        this.config =Object.assign({
            title: '10180ADVCG-000034',/* 国际化处理： 分配默认值配置*/
            treetitle: '10180ADVCG-000039',/* 国际化处理： 档案页签*/
            treeId:"assigntempTree",
            tableId:"assigntemp",
            pageCode:"10180ADVCG_assigntemp",
            appcode:'10180ADVCG',
            nodeType:'GROUP_NODE',
            primaryKey:'pk_assign_temp',
            urls:urls
        },props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.config.treetitle,
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.config.treetitle,
            "refpk": "~"
        };

        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.setTreeStatus = this.setTreeStatus.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);


        this.state = {
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            SelectedNoderefpk:null,
            expandedKeys:['~'],
            omate:'',
            tree:{
                needEdit:false,
                showLine:false,
                needSearch:true,
                showModal:false,
            },
            json:{}
        }
        this.initTemplate(this.props, () => {
            if(getDefData("treedata",assdatasource)&&getDefData("treedata",assdatasource)!=null){
                this.props.syncTree.setSyncTreeData(this.config.treeId , getDefData("treedata",assdatasource));
                // this.props.syncTree.openNodeByPk(this.config.treeId, getDefData("SelectedNoderefpk",assdatasource) || ['~']);
                this.props.syncTree.setNodeSelected(this.config.treeId, getDefData("SelectedNoderefpk",assdatasource));
                this.props.button.setDisabled({add:false,refresh:false});
                this.setTreeStatus();
                this.onSelectTree(getDefData("SelectedNoderefpk",assdatasource));
            }else{
                this.loadTreeData();
                this.initButtonStatus(true);
            }
        });
    }
    cacheExpandedKeys = (callback = ()=>{})=>{
        setDefData('openedKeys',assdatasource,this.NCCHRTree.state.expandedKeys);
        setTimeout(()=>{callback()},0);
    }
    push2Card = (param = {})=>{
        this.cacheExpandedKeys(()=>{
            this.props.pushTo("/card", param);
        });
    }

    initTemplate = (props,callback) => {
        createUIDom(props)(
            {
                pagecode : pageCode
            },
            {
                moduleId: "10180ADVCG",domainName: 'uapbd'
            },
            (data, langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        meta = this.modifierMeta(meta,this.props);
                        this.props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        this.props.button.setButtons(data.button);
                        this.props.button.setPopContent({'delete':this.state.json['10180ADVCG-000047']});/* 国际化处理： 确认要删除该信息吗？*/
                    }
                    props.createUIDom(
                        {pagecode:"10180ADVCG_assigntemp_card"},
                        (data)=> {
                            if (data.template) {
                                this.setState({
                                    omate:data.template
                                })
                            }
                            callback && callback();
                        }
                    )

                }
            });
    }
    /**
     * 请求元数据模板
     */
    componentWillMount(){}
    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        this.props.syncTree.openNodeByPk(this.config.treeId, getDefData("openedKeys",assdatasource) || ['~']);
    }
    modifierMeta=(meta,props)=> {
        meta[tableId].pagination = true;
        meta[tableId].items.push({
            attrcode: 'opr',
            itemtype:'customer',
            label: this.state.json['10180ADVCG-000023'],/* 国际化处理： 操作*/
            width: 200,
            className : 'table-opr',
            visible: true,
            render: (text, record, index) => {
                let btnArray = ['edit','delete'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-button",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });
        return meta;

    }

    tableButtonClick(props, id, text, record, index){
        switch(id){
            case 'edit':
                this.push2Card({
                    pagecode:'10180ADVCG_assigntemp_card',
                    status: 'edit',
                    pagetype:getDefData("curSelectedNode",assdatasource)["refname"].split(" ")[0],
                    id: record["pk_assign_temp"].value,
                    pk_assign_tab:record["pk_assign_tab"].value
                });
                // props.pushTo("/card", {
                //     pagecode:'10180ADVCG_assigntemp_card',
                //     status: 'edit',
                //     pagetype:getDefData("curSelectedNode",assdatasource)["refname"].split(" ")[0],
                //     id: record["pk_assign_temp"].value,
                //     pk_assign_tab:record["pk_assign_tab"].value
                // });
                break;
            case 'delete':
                ajax({
                    url: urls.deleteCardUrl,
                    data: {
                        id: record["pk_assign_temp"].value,
                        pk_assign_tab:record["pk_assign_tab"].value,
                        ts: record.ts.value
                    },
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10180ADVCG-000030'] });/* 国际化处理： 删除成功！*/
                            props.table.deleteCacheId(tableId,res.data[0]);
                            props.table.deleteTableRowsByIndex(tableId, index);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    /**
     * 初始元数据后 设置enablestate不可编辑
     */
    setFormEnableStateProp(){
        //获得元数据
        let meta = this.props.meta.getMeta();
        tableId = this.config.tableId?this.config.tableId:tableId;
        //判断元数据中有我的表单元数据
        if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(tableId)){
            //获得表单元数据
            let formMeta = this.props.meta.getMeta()[tableId];
            //判断表单元数据有属性
            if(formMeta.hasOwnProperty("items")){
                //获得属性
                let items = formMeta.items;
                if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
                    items.map((item)=>{
                        //查找enablestate属性
                        if(item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate'){
                            //设置enablestate属性不可用
                            this.props.form.setFormItemsDisabled(tableId,{enablestate:true});
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
     * 加载树节点数据
     */
    loadTreeData(){
        let requestParam = {
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    let data = [Object.assign( {...this.root},{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]} , {children : result.data} )];
                    let treedata = this.dealTreeData(data);
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , treedata);
                    setDefData("treedata",assdatasource,treedata);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, getDefData("openedKeys",assdatasource) || ['~']);
                    // this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    this.setTreeStatus();
                }
            }
        });
    }

    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus(flag){
        this.props.button.setDisabled({
            add:flag,
            edit:flag,
            delete:flag,
            refresh:flag
        });
    }

    /**
     * 设置树的状态
     */
    setTreeStatus(){
        this.props.syncTree.setNodeDisable(this.config.treeId,false);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk,callback){
        debugger
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        this.props.table.setAllTableData(tableId, {rows: [] });
        this.props.button.setDisabled({add:true,refresh:true});

        if(refpk == this.root.refpk||selectedTreeNode.isLeaf==false){
            return;
        }
        
        let requestParam = {
            pk_assign_tab:refpk,
            nodeType:this.config.nodeType,
            pageInfo: this.props.table.getTablePageInfo(tableId)?this.props.table.getTablePageInfo(tableId):
                {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 0
                },
        };
        //utils.expandFirstNode(getDefData("treedata",assdatasource), this.config.treeId, this);
        this.state.omate.hasOwnProperty(selectedTreeNode["refname"].split(" ")[0])&&this.props.button.setDisabled({add:false,refresh:false});
        /******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
        ajax({
            url:this.config.urls.queryTableUrl,
            data:requestParam,
            success:(result)=>{
                showFormular(this.props,result,{
                    "assigntemp" : "SimpleTable",
                });
                if(result.success){

                    //表单数据
                    if(result.data){
                        this.props.table.setAllTableData(tableId, result.data[tableId]);
                    }
                    setDefData("curSelectedNode",assdatasource,selectedTreeNode);
                    setDefData("SelectedNoderefpk",assdatasource,refpk);
                    this.props.syncTree.openNodeByPk(this.config.treeId, getDefData("openedKeys",assdatasource) || ['~']);
                    callback&&callback()
                }
            }
        });
    }

    //按钮事件
    buttonClick(props, id) {
        if(id == 'rulesquery'){
            let formConfig ={};
            if(getDefData("curSelectedNode",assdatasource)){
                let  pk_assign_tab = getDefData("curSelectedNode",assdatasource).refpk
                formConfig ={
                    pk_assign_tab :pk_assign_tab,
                    pid:getDefData("curSelectedNode",assdatasource).pid,
                    json:this.state.json,
                }
            }
            this.props.modal.show("rules",{
                title:this.state.json['10180ADVCG-000038'],/* 国际化处理： 分配默认值规则查询*/
                size:'xlg', // 模态框大小 sm/lg/xlg
                content:<Assigntemprule config={formConfig} />,
                userControl:true,//自己控制什么时候关闭窗口
                noFooter : true,
                //beSureBtnClick:this.onSaveSys.bind(this)
                className:'rulesModal'
            });
            return;
        }
        const pagettype = getDefData("curSelectedNode",assdatasource)["refname"].split(" ")[0];
        switch (id) {
            case 'add':
                this.push2Card({
                    status: 'add',
                    pagecode:'10180ADVCG_assigntemp_card',
                    pagetype:pagettype,
                    id: '',
                    pk_assign_tab:getDefData("curSelectedNode",assdatasource).refpk
                });
                // this.props.pushTo("/card", {
                //     status: 'add',
                //     pagecode:'10180ADVCG_assigntemp_card',
                //     pagetype:pagettype,
                //     id: '',
                //     pk_assign_tab:getDefData("curSelectedNode",assdatasource).refpk
                // });
                break;
            case 'refresh':
                this.onSelectTree(getDefData("SelectedNoderefpk",assdatasource),()=>{toast({title:this.state.json['10180ADVCG-000028']});});/* 国际化处理： 刷新成功！*/
                break;
            default:
                break;
        }
    }

    //列表双击事件
    doubleClick(record, index, e) {
        let pagettype = getDefData("curSelectedNode",assdatasource)["refname"].split(" ")[0];
        this.push2Card({
            status: 'browse',
            pagecode:'10180ADVCG_assigntemp_card',
            pagetype:pagettype,
            id: record["pk_assign_temp"].value,
            pk_assign_tab:record["pk_assign_tab"].value
        });
        // this.props.pushTo("/card", {
        //     status: 'browse',
        //     pagecode:'10180ADVCG_assigntemp_card',
        //     pagetype:pagettype,
        //     id: record["pk_assign_temp"].value,
        //     pk_assign_tab:record["pk_assign_tab"].value
        // });
    }

    //列表分页
    pageInfoClick = (props, config, pks)=>{
        let data = {
            "allpks": pks,
            "pageid": pageCode
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: urls.queryAssigntemplatePageGridByPksUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                showFormular(this.props,res,{
                    "assigntemp" : "SimpleTable",
                });
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
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
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {syncTree,form,button,modal,DragWidthCom,table} = this.props;
        const { createButtonApp } = button;
        const { createSimpleTable } = table;
        let { createModal } = modal;  //模态框


        /**
         * 树参数
         **/
        let custTreeParam = {
            treeId :this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            showModal:this.state.tree.showModal
        };
        return(
            <div className="nc-bill-list">

                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    {/* 标题 title*/}
                    <div className="header-title-search-area" >
                        {/* {createPageIcon()} */}
                        {/* <h2 className="title-search-detail"> */}
                        {createBillHeadInfo({
                            title:this.state.json[this.config.title],
							initShowBackBtn:false
                        }	
	                    )}
                        {/* </h2> */}
                    </div>

                    {/* 按钮组 btn-group*/}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 树表区域 */}
                <div className="tree-card">
                    <DragWidthCom

                        // 左树区域
                        leftDom = {<AssigntempTree treeConfig={custTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree }/>}

                        // 右表区域
                        rightDom = {
                            <div className="nc-bill-table-area">
                                {createSimpleTable(this.config.tableId, {
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: assdatasource,
                                    pkname:pk_item,
                                    componentInitFinished:()=>{
                                        //缓存数据赋值成功的钩子函数
                                        //若初始化数据后需要对数据做修改，可以在这里处理
                                    },
                                    showIndex: true,
                                    onRowDoubleClick: this.doubleClick.bind(this),
                                })}
                            </div>
                        }

                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '20%'
                        leftMinWid = '300px'
                    />
                </div>
                {createModal('modal',{noFooter:false})}
                { createModal("rules",{
                    title:this.state.json['10180ADVCG-000038'],/* 国际化处理： 分配默认值规则查询*/
                    content:<Assigntemprule config={this.state.formConfig} />,
                    userControl:true,//自己控制什么时候关闭窗口
                }) }

            </div>

        )
    }
}

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{

}

/**
 * 创建页面
 */
Assigntemplate = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: '10180ADVCG_assigntemp',
        bodycode: 'assigntemp'
    }
})(Assigntemplate)

//ReactDOM.render(<Assigntemplate />, document.querySelector('#app'));

export default Assigntemplate;


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65