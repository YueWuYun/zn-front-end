//SjSqkhp4zf3Z3hGcvkaJ1kKCQL9JAUQYeuksuJDJfqrrUpjCUIsPBOSz8wVaXFNt
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,cacheTools,getMultiLang} from 'nc-lightapp-front';
import AssigntempTree from "./assigntemptree";
import NCC_HR_Table from '../../../public/excomponents/Table';
import utils from '../../../public/utils';
const {showFormular } = utils;
let { NCPopconfirm, NCIcon } = base;


/****************默认参数  开始***********************/
let tableId = 'assigntemp';//卡片组件Id
let pageCode="10180ADVCG_assigntemp";//默认集团
let appid="0001Z01000000000298O";//默认集团
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/assigntemp/AssigntemLoadTreeData.do",
    queryTableUrl:"/nccloud/uapbd/assigntemp/AssigntemQueryRulesData.do",
};
/***************默认参数  结束********************/

/**
 * 分配默认值配置
 * @author xuehaoc
 */
class Assigntemprule extends Component {
    constructor(props){
        super(props);
        this.props = props;
        this.config =Object.assign({
            title: '10180ADVCG-000038',/* 国际化处理： 分配默认值规则查询*/
            treetitle: '10180ADVCG-000039',/* 国际化处理： 档案页签*/
            treeId:"assigntempTree",
            tableId:"assigntemp",
            pageCode:"10180ADVCG_assigntemp",
            appid:'0001Z010000000000NXX',
            nodeType:'GROUP_NODE',
            primaryKey:'pk_assign_temp',
            pk_assign_tab:null,
            pid:null,
            urls:urls,
            json:{}
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
        this.dealTreeData = this.dealTreeData.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);

        this.state = {
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            selectedData:null,
            SelectedNoderefpk:null,
            curOrg:'',//当前组织
            tree:{
                needEdit:false,
                showLine:false,
                needSearch:true,
                showModal:false,
            },
            oldParent:'',//原父节点
            json:{}
        }
    }
    rulesqueryMeta = {
        code: "",
        name: this.props.config.json['10180ADVCG-000040'],/* 国际化处理： 分配默认值规则*/
        pageid: "",
        accassitem: {
            items: [
                {
                    itemtype: "input",
                    col: "4",
                    label: this.props.config.json['10180ADVCG-000041'] ,/* 国际化处理： 序号*/
                    maxlength: "10",
                    title: this.props.config.json['10180ADVCG-000041'],/* 国际化处理： 序号*/
                    dataIndex: 'id',
                    width:"12%",
                    visible: true,
                    disabled: true,
                    attrcode: "id"

                },
                {
                    itemtype: "input",
                    col:"4",
                    visible: true,
                    label: this.props.config.json['10180ADVCG-000042'],/* 国际化处理： 分配规则*/
                    title:this.props.config.json['10180ADVCG-000042'],/* 国际化处理： 分配规则*/
                    dataIndex: 'orgname',
                    width:"22%",
                    maxlength: "40",
                    attrcode: "orgname"
                },
                {
                    itemtype: "input",
                    col: "4",
                    visible: true,
                    label: this.props.config.json['10180ADVCG-000043'],/* 国际化处理： 分配默认值模板*/
                    title:this.props.config.json['10180ADVCG-000043'],/* 国际化处理： 分配默认值模板*/
                    dataIndex: 'docclassname',
                    width:"22%",
                    maxlength: "100",
                    disabled: false,
                    attrcode: "docclassname",
                },

                {
                    itemtype: "input",
                    col: "4",
                    visible: true,
                    label: this.props.config.json['10180ADVCG-000044'],/* 国际化处理： 模板编码*/
                    title:this.props.config.json['10180ADVCG-000044'],/* 国际化处理： 模板编码*/
                    dataIndex: 'templatecode',
                    width:"22%",
                    maxlength: "100",
                    attrcode: "templatecode "
                },
                {
                    itemtype: "input",
                    col: "4",
                    visible: true,
                    label: this.props.config.json['10180ADVCG-000045'],/* 国际化处理： 模板名称*/
                    title:this.props.config.json['10180ADVCG-000045'],/* 国际化处理： 模板名称*/
                    dataIndex: 'templatename',
                    width:"22%",
                    maxlength: "100",
                    attrcode: "templatename "
                }


            ],
            moduletype: "table",
            code: "accassitem",
            name: this.props.config.json['10180ADVCG-000046']/* 国际化处理： 辅助核算项目*/
        }
    }
    /**
     * 请求元数据模板
     */
    componentWillMount() {
    }

    //转换表格数据
    transTableData (data){
        let tableData = new Array();

        if(data && data.length>0){
            data.map((item)=>{
                let record = new Object();
                record.orgname = item.orgname;
                record.docclassname = item.docclassname;
                record.templatecode = item.templatecode;
                record.id=item.id;
                record.templatename = item.templatename;
                tableData.push(record);
            })
        }
        return tableData;

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
        this.loadTreeData(()=>{
            this.props.syncTree.openNodeByPk(this.config.treeId, this.config.pid);
            this.props.syncTree.setNodeSelected(this.config.treeId, this.config.pk_assign_tab);
        });
        this.getData(this.config.pk_assign_tab);
    }

    /**
     * 加载树节点数据
     */
    loadTreeData(callback){
        /*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string,nodeType:string}}
         *****************************************************************/
        let requestParam = {
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
                    let data = [Object.assign( {...this.root} ,{title:this.props.config.json[this.root.title],refname:this.props.config.json[this.root.refname]}, {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    if(callback)
                        callback();
                }
            }
        });
    }

    //加载表格数据
    getData(pk_assign_tab){
        if(pk_assign_tab){
            let requestParam = {
                pk_assign_tab:pk_assign_tab,
                nodeType:this.config.nodeType
            };
            ajax({
                url:urls.queryTableUrl,
                data:requestParam,
                success:(result)=>{
                    showFormular(this.props,result,{
                        "assigntemp" : "SimpleTable",
                    });
                    if(result.success){
                        debugger
                        //表单数据
                        if(result.data){
                            let data = result.data;
                            this.AccAssItemTable.loadData(this.transTableData(data));
                            //this.props.table.setAllTableData(tableId, result.data[tableId]);
                        }
                        /************************************************************
                         * 选中树节点回调成功后设置当前选中节点
                         ************************************************************/
                        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                        this.state.curSelectedNode = selectedTreeNode;
                        this.state.SelectedNoderefpk = pk_assign_tab;
                        this.setState(this.state);
                    }
                }
            });
            // let data = res.data.rows.accAssItems;
            // this.AccAssItemTable.loadData(this.transTableData(data));
        }
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        this.AccAssItemTable.loadData(this.transTableData({rows: [] }))
        /******************************************************
         * 判断点击的是否是根节点
         ******************************************************/
        if(refpk == this.root.refpk||selectedTreeNode.isLeaf==false){
            return;
        }

        this.getData(refpk);
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
        const {syncTree,form,button,ncmodal,DragWidthCom,table} = this.props;
        const { createButtonApp } = button;
        const { createSimpleTable } = table;
        let { createModal } = ncmodal;  //模态框


        /**
         * 树参数
         **/
        let assigntempTreeParam = {
            treeId :this.config.treeId,
            needEdit: this.state.tree.needEdit,
            showLine: this.state.tree.showLine, //显示连线
            needSearch: this.state.tree.needSearch, //是否需要搜索框
            onSelectTree: this.onSelectTree.bind(this),//选择
            showModal:this.state.tree.showModal
        };
        return(
            <div>

                {/* 头部 header*/}
                <div className="header">
                    {/* 标题 title*/}
                </div>
                {/* 树表区域 */}
                <div className="tree-card">
                    <DragWidthCom

                        // 左树区域
                        leftDom = {<AssigntempTree treeConfig={assigntempTreeParam} syncTree={this.props.syncTree} ref={(NCCHRTree) => this.NCCHRTree = NCCHRTree }/>}

                        // 右表区域
                        rightDom = {
                            <div className="nc-bill-table-area">
                                <NCC_HR_Table
                                    columns={this.rulesqueryMeta.accassitem.items}
                                    scroll={{ y: 182, x: true }}
                                    ref={(NCC_HR_Table)=>{this.AccAssItemTable = NCC_HR_Table;}}/>
                            </div>
                        }
                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '280px'
                    />
                </div>
            </div>

        )
    }
}

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{
    props.createUIDom(
        {pagecode:pageCode},
        (data)=>{
            if(data.template){
                let meta = data.template;
                meta = modifierMeta(meta,props);
                props.meta.setMeta(meta);
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
function  modifierMeta(meta,props) {
    meta[tableId].items.forEach((temp)=>{
        if(temp.attrcode == 'pk_father'){

        }
    });
    return meta;

}

/**
 * 创建页面
 */
export default Assigntemprule = createPage({
    initTemplate: initTemplate,
})(Assigntemprule)











//SjSqkhp4zf3Z3hGcvkaJ1kKCQL9JAUQYeuksuJDJfqrrUpjCUIsPBOSz8wVaXFNt