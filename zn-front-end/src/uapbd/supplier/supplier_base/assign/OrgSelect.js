//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
import classnames from 'classnames';
import '../../../public/uapbdstyle/uapbd_style_common'
let {NCCol,NCRow,NCCheckbox,NCTree,NCInput,NCButton,NCDiv } = base;
import {component} from '../../../public/platwapper/index.js';
const {NCTable} = component;
var EMPTY_FN = function(){};

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tree: {
            //树参数配置
            expandedKeys:['root'],
            checkedKeys:[],
            isChild:false,
            defaultExpandedKeys:[],
            checkable:true,
            main: this,
            hasLoadData:false,
            defNodeCfg: {
                
            },
            root: {
                root: true,
                key: 'root',
                title: this.props.Lang['10140SUG-000032'],
                refpk:'root',
                id:'root',
                refname:this.props.Lang['10140SUG-000032']
            },
            datas: [],
            alldatas:[]
          },
          table: {
            main: this,
            rowKey: 'id',
            scroll:{y:390,x:false},
            columns:[{
              title: this.props.Lang['10140SUG-000033'],
              dataIndex: 'code',
              width: '40%'
            },{
              title: this.props.Lang['10140SUG-000034'],
              dataIndex: 'name',
              width: '40%'
            },{
              title: this.props.Lang['10140SUG-000035'],
              dataIndex: 'opr',
              width: '20%',
              render: function(text, record, index) {
                var delFn = function(){
                    let {tableDatas,tree} = this.state;
                    console.log(this.state.tree.checkedKeys, this.state.tableDatas);
                    this.state.tableDatas = tableDatas.filter((data) => data.refpk != record.refpk);
                    tree.checkedKeys = tableDatas.filter((data) => {
                        if(data.refpk != record.refpk){
                            return true;
                        }
                    });
                    this.state.tree.checkedKeys = this.state.tree.checkedKeys.map((item)=>{
                        return item.refpk;
                    })
                    console.log(this.state.tree.checkedKeys, this.state.tableDatas);
                    this.setState(this.state);
                    console.log(this.state.tree.checkedKeys, this.state.tableDatas);
                };
                return (<span  fieldid="del_btn" onClick={delFn.bind(this)} className={'table-opr'}>{this.props.Lang['10140SUG-000039']}</span>);
              }.bind(this)
            }]
          },
          tableDatas:[],
          includeChildren:true,
          treeDatas:new Map()

        };
    }   

    componentDidMount(){
        this.loadAssignTreeData();
    }
    getHasLoadOrgTreeData = ()=>{
        return this.state.hasLoadData;
    }
    resetOrgSelect = ()=>{
        this.state.tree.checkedKeys = [];
        this.setState(this.state,()=>{
            this.clearData();
        })
    }
    /**
     * 加载分配树数据
     */
    loadAssignTreeData = ()=>{
        ajax({
            url: '/nccloud/uapbd/customer/assignTree.do',
            data: {orgtypeIDs:['BUSINESSUNIT00000000'],isCludeGlobalAndGroupVO: false},
            success:(res) => {
                let {success,data} = res;
                if(success){

                    let resData = new Array();
                    data && data.length>0 && data.forEach(d=>{
                        if(!!d){
                            resData.push(d);
                        }
                    })
                    this.state.tree.datas = resData;
                    this.state.tree.alldatas = resData;
                    //shu
                    let array = [this.state.tree.root].concat(this.treeToList(resData,new Array()));
                    array && array.length>0 && array.forEach(node=>{
                        if(node.pid && node.pid!='root' && node.code){
                            node.refname = node.code+"  "+node.name;
                        }
                        if(node.pid == 'root' || node.id =='root'){
                            delete node.code;
                        }
                        this.state.treeDatas.set(node.refpk,node);
                    })
                    this.props.syncTree.setSyncTreeData("orgselect_tree", [Object.assign(this.state.tree.root,{children:this.state.tree.datas})])
                    this.props.syncTree.setNodeChecked("orgselect_tree","")
                    this.removeNullChildren(this.state.tree.datas);
                    this.state.tableDatas = new Array();
                    this.state.hasLoadData = true;
                    this.setState(this.state,()=>{
                        this.state.tree.checkedKeys = ['root'];
                        this.setState(this.state,()=>{
                            this.state.tree.checkedKeys = [];
                            this.setState(this.state);
                        })
                    });
                    this.expandFirstNode( [Object.assign(this.state.tree.root,{children:this.state.tree.datas})],"orgselect_tree",this);
                }
            }
        });
    }
    expandFirstNode = (treeData, id, that) => {
        if(!treeData || !id || !that) return ;
    
        let pks = [];
        treeData.map( (item, index) => {
            if(item && item.key) {
                pks.push(item.key);
            }
        })
        that.props.syncTree.openNodeByPk(id, pks)
        return ;
    }
    removeNullChildren = (datas)=>{
        datas && datas.forEach(data=>{
            if(data.hasOwnProperty('children') && data.children.length>0){
               this.removeNullChildren(data.children);
            }else{
                delete data.children;
            }
        })
    }
   
    /**
     * 清空选中数据
     */
    clearData = ()=>{
        this.state.tree.checkedKeys = new Array();
        this.setState({tableDatas:[]});
    }
    /**
     * 获得选中数据
     */
    getData(){
      return this.state.tableDatas.map ( n => n.refpk);
    }
    /**
     * 树节点选中事件
     * @param selectedKeys 选中keys
     * @param e 
     */
    onTreeNodeChecked =(props,checkedKeys, e)=>{
        let resultKeys = checkedKeys;//this.getCheckedKeys(checkedKeys,e);
        //设置勾选中的树节点
        this.state.tree.checkedKeys = checkedKeys.length == 0?[]: resultKeys;
        this.state.tableDatas = [];
        //setState
        this.setState(this.state,this.resetTableData.bind(this,this.state.tree.checkedKeys, e));
    }

    /**
     * 展开图标替换
     * @param selectedKeys 选中keys
     * @param e 
     */  
    openIcon = () => {
        return (
            <i
            className="icon iconfont icon-shu_zk tree-swich"
        />
        )
    } 

    closeIcon=()=>{
        return(
        <i
            className="icon iconfont icon-shushouqi tree-swich"
        />
        )}
    /**
     * 获得选中的节点pk
     */
    getCheckedKeys = (checkedKeys,e)=>{
        let treeNode = this.state.treeDatas.get(e.node.props.eventKey);
        //是虚节点 或者  非虚节点 && includeChildren
        let isVirtualNode = treeNode.root || treeNode.nodeData.orgclazz =='orgtype';
        let resultKeys = new Array();
        if(isVirtualNode || (!isVirtualNode && this.state.includeChildren)){
            let pkArr = this.getKeys([treeNode],new Array());
            if(e.checked){
                resultKeys = checkedKeys.concat(pkArr);
            }else{
                for(let key of checkedKeys){
                    if(!pkArr.includes(key)){
                        resultKeys.push(key); 
                    }
                }
            }
        }else{
            if(e.checked){
                resultKeys = checkedKeys.concat([e.node.props.eventKey]);
            }else{
                for(let key of checkedKeys){
                    if(key!=e.node.props.eventKey){
                        resultKeys.push(key); 
                    }
                }
                
            }
           
        }
        return resultKeys;
    }
    getKeys = (treeNodes,pkArr = [])=>{
        treeNodes.forEach(treeNode=>{
            pkArr.push(treeNode.refpk);
            if(treeNode.children && treeNode.children.length>0){
                this.getKeys(treeNode.children,pkArr);
            }
        })
        return pkArr;
    }
    treeToList = (data, list = []) => {
        if (data && Array.isArray(data) && data.length>0) {
            data.forEach((e) => {
                list.push(e);
                if (e && e.hasOwnProperty('children') && e.children.length>0) {
                    this.treeToList(e.children, list);
                }
            });
            return list;
        } else {
            return false;
        }
    }
    /**
     * 重置表格数据
     */
    resetTableData = (checkedKeys, e)=>{
        debugger
        let result = new Array();
        const getItem = (data,pks,result = [])=>{
            data.forEach(item=>{
                if(pks.includes(item.refpk)){
                    result.push({
                        id:item.id,
                        name:item.name,
                        code:item.nodeData.code,
                        nodeData:item.nodeData,
                        refpk:item.id,
                        refname:item.name
                    });
                }
                if(item.hasOwnProperty('children') && item.children.length>0 ){
                    getItem(item.children,pks,result);
                }
            })
            return result;
        }
        let tableDatas = getItem(this.state.tree.datas,checkedKeys,new Array());
        tableDatas = tableDatas.filter(d => {return d.nodeData && (d.root || d.nodeData.orgclazz != 'orgtype')})
        this.setState({tableDatas:tableDatas});
    }
    /**
     * 树节点展开事件
     */
    onTreeNodeExpand = (expandedKeys)=>{
        this.state.tree.expandedKeys = expandedKeys;
        this.setState(this.state);
    }
    renderFileTreeTitle = (item)=>{
        let className ;
        if(item && item.hasOwnProperty('children') && item.children.length > 0){
            className = this.state.tree.expandedKeys.includes(item.refpk)?"icon iconfont  icon-wenjianjiadakai tree-wenjian":"icon iconfont  icon-wenjianjia tree-wenjian";
        }else{
            className = "tree-dian";
        }
        return(
            <div className={"title-con"}>
                <i style={{color:''}} className={className}/><span className="title-middle">{item.refname}</span>
            </div>
        )
    }
    selNode = (data, item, info) => {
        if(item){
            this.props.syncTree.setNodeChecked(item.id,item.refpk);
        }
       
      }
    render() {
        var tree  = this.state.tree,
            table = this.state.table;
        let {DragWidthCom,syncTree} = this.props;
        let {createSyncTree} = syncTree;

        var loop = (datas)=>datas.map((data)=>{
            return  <NCTree.NCTreeNode 
                        liAttr={{fieldid:(data.name||data.refname||data.code||data.refcode||data.refpk)+"_node"}}
                        className='node-item'
                        key={data.refpk}
                        title={this.renderFileTreeTitle(data)}
                        isLeaf={!data.children}
                    >
                        {data.children && loop(data.children)}
                    </NCTree.NCTreeNode>;  //根节点和一级节点不可勾选
        });
        return (
            <div className = 'transfer_tree_container' style={{marginTop: 10}}>
                <div className = 'left-area' style={{height:'450px',padding:'10px',width:'calc(50% - 25px)',overflow:'hidden'}}>
                    <div className = 'left-area-nei'>
                        <div className="syncTreeCom " style={{marginTop:'10px', marginLeft: 20,height:'calc(100% - 40px)',overflow:'auto'}}>
                        <NCDiv fieldid= 'orgselect' areaCode={NCDiv.config.TreeCom}
                            style={{ height: "100%"}}> 
                            {createSyncTree({
                                treeId: "orgselect_tree",
                                needEdit:false ,
                                showLine: this.state.tree.checkable,
                                checkable: this.state.tree.checkable,
                                onCheckEve: this.onTreeNodeChecked.bind(this),   //选择节点回调方法
                                openIcon:this.openIcon,
                                onSelectEve:this.selNode,
                                closeIcon:this.closeIcon,
                                defaultExpandAll:false,
                                checkStrictly:this.state.includeChildren, //false 勾选下级
                                onTreeExpand:this.onTreeNodeExpand,
                                searchType:'filtration',
                            })}
                            {/* <NCTree 
                                fieldid={"orgselect_tree"}
                                multiple = {this.state.tree.checkable}
                                checkable={this.state.tree.checkable}
                                defaultExpandAll={this.state.tree.checkable}
                                checkStrictly={!this.state.tree.isChild}
                                autoExpandParent = {false}
                                showLine={this.state.tree.checkable}
                                onCheck={this.onTreeNodeChecked}
                                checkedKeys={this.state.tree.checkedKeys}
                                defaultExpandedKeys={this.state.tree.defaultExpandedKeys}  //默认展开指定的节点
                                expandedKeys={this.state.tree.expandedKeys || ['root']} 
                                onExpand={this.onTreeNodeExpand}
                                openIcon={
                                    <i
                                        className="icon iconfont icon-shu_zk tree-swich"
                                    />
                                }
                                closeIcon={
                                    <i
                                        className="icon iconfont icon-shushouqi tree-swich"
                                    />
                                }
                            > 
                                {loop([Object.assign(this.state.tree.root,{children:this.state.tree.datas})])}
                            </NCTree> */}
                        </NCDiv>
                        </div>
                        <div style={{marginTop: 10}}>
                        <NCCheckbox checked={!this.state.includeChildren} onChange={
                            (val)=>{
                                this.setState({includeChildren:!val})
                            }}>
                            {this.props.Lang['10140SUG-000040']}
                        </NCCheckbox>

                    </div>
                    </div>
                </div>
                <div className = 'right-area' style={{marginLeft:30,height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
                <div className = 'right-area-nei' style={{overflow: 'hidden'}}>
                    <NCTable {...table} data={this.state.tableDatas} {...{bodyStyle:{'overflow-y':'hidden',height:'390px'},useFixedHeader:true} }></NCTable>
                </div>
                </div>
            </div>
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS