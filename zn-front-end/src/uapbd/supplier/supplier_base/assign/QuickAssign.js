//kjlk6SMVdVhwiA/Bq6MHoRDhL3aYb3DLPch81bs1d3h6MAaCb229oMmduA0++mDE
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
import '../../../public/uapbdstyle/uapbd_style_common'
let {NCCol,NCRow,NCCheckbox,NCTree,NCInput,NCButton,NCDiv } = base;
import {component} from '../../../public/platwapper/index.js';
const {NCTable} = component;
//  import  Table  from 'bee-table';
//  import BigData from "bee-table/build/lib/bigData";
//  const BigDataTable = BigData(Table);
var EMPTY_FN = function(){};

/**
 * 快速分配 dialog
 */

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
                return (<span fieldid="del_btn" onClick={delFn.bind(this)} className={'table-opr'} style={{pointer:'cursor'}}>{this.props.Lang['10140SUG-000039']}</span>);
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
                    this.state.tree.alldatas= resData;
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
                    this.props.syncTree.setSyncTreeData("quickassign", [Object.assign(this.state.tree.root,{children:this.state.tree.datas})])
                    this.props.syncTree.setNodeChecked("quickassign","")
                    this.removeNullChildren(this.state.tree.datas);
                    this.state.tableDatas = new Array();
                    this.setState(this.state,()=>{
                        this.state.tree.checkedKeys = ['root'];
                        this.setState(this.state,()=>{
                            this.state.tree.checkedKeys = [];
                            this.setState(this.state);
                        })
                    });
                    this.expandFirstNode( [Object.assign(this.state.tree.root,{children:this.state.tree.datas})],"quickassign",this);
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
        let resultKeys = checkedKeys//this.getCheckedKeys(checkedKeys,e);
        // if(this.state.includeChildren){
        //     let pkArr = this.getCheckedKeys(e);
        //     if(e.checked){
        //         resultKeys = checkedKeys.concat(pkArr);
        //     }else{
        //         for(let key of checkedKeys){
        //             if(!pkArr.includes(key)){
        //                 resultKeys.push(key); 
        //             }
        //         }
        //     }
        // }else{
        //    //不包含下级 && 取消选中
        //     if(e.checked){
        //         resultKeys = checkedKeys;
        //     }else{
        //         for(let key of checkedKeys){
        //             if(key!=e.node.props.eventKey){
        //                 resultKeys.push(key); 
        //             }
        //         }
                
        //     }
        // }
        
        //设置勾选中的树节点
        this.state.tree.checkedKeys = checkedKeys.length == 0?[]: resultKeys;
        this.state.tableDatas = [];
        //setState
        this.setState(this.state,this.resetTableData.bind(this,this.state.tree.checkedKeys, e));
    }
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
        if (Array.isArray(data)) {
            data.forEach((e) => {
                list.push(e);
                if (e && e.hasOwnProperty('children') && e.children.length>0 ) {
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
                if(item.hasOwnProperty('children') && item.children.length>0){
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
            className = this.state.tree.expandedKeys.includes(item.refpk)?"refer-tree-switch iconfont icon-wenjianjiadakai tree-wenjian":"refer-tree-switch iconfont icon-wenjianjia tree-wenjian";
        }else{
            className = "refer-tree-point";
        }
        return(
            <span>
                <span className={className}/><span className='refer-tree-title'>{item.refname}</span>
            </span>
        )
    }
    searchTabVal = (val) => {
        const rebuildData = arr => {
          let newarr = [];
          arr.forEach( (element) => {
            if(element.nodeData.code!='liactcostrg'&&element.nodeData.code!='businessunit'&&element.nodeData.code!='costregion'&&element.nodeData.code!='virtualorg'
            &&element.children && element.children.length) {
                if((element.refname+element.nodeData.code).includes(val)) {
                    newarr.push(element);
                }
                const ab = rebuildData(element.children);
                const obj = {
                    ...element,
                    children: ab
                };
                if (ab && ab.length) {
                    newarr.push(obj);
                }
            }else {
                if((element.refname+element.nodeData.code).includes(val)) {
                    newarr.push(element);
                }
            }
          });
          return newarr;
        };
        const newTreeData = rebuildData(this.state.tree.alldatas);
        const tree = this.state.tree;
        tree.datas = newTreeData;
        this.setState({tree})
      }

      selNode = (data, item, info) => {
        if(item){
            this.props.syncTree.setNodeChecked(item.id,item.refpk);
        }
       
      }
    render() {
        var tree  = this.state.tree,table = this.state.table;
        let {DragWidthCom,syncTree} = this.props;
        let {createSyncTree} = syncTree;
        var loop = (datas)=>datas.map((data)=>{
            return  <NCTree.NCTreeNode 
                        liAttr={{fieldid:(data.code||data.refcode|| data.name||data.refname||data.refpk)+"_node"}}
                        className='node-item'
                        key={data.refpk}
                        //disableCheckbox={data.root == true }//|| data.nodeData.orgclazz == 'orgtype'
                        title={this.renderFileTreeTitle(data)}
                        isLeaf={!data.children}
                    >
                        {data.children && loop(data.children)}
                    </NCTree.NCTreeNode>;  //根节点和一级节点不可勾选
        });
        return [
            <div className = 'transfer_tree_container' style={{display: 'flex','justify-content': 'space-around',marginTop: 20,paddingLeft: 15,paddingRight: 15}}>
                <div className = 'left-area' style={{height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
                    <div className = 'left-area-nei'>
                        <div  className="syncTreeCom" style={{marginTop:'10px',marginLeft: 20,height:'calc(100% - 40px)'}}>
                        {/* <div style={{marginTop:'10px'}}>
                            <NCInput style={{width:'450px'}} placeholder={
                            this.props.Lang['10140SUG-000062']//业务单元
                            } className="search-input"
                                onChange={ debounce(this.searchTabVal, 500)} />
                        </div> */}
                        {/* <div className='synctree-area'  fieldname="树控件"> */}
                        {createSyncTree({
                                treeId: "quickassign",
                                needEdit:false ,
                                showLine: this.state.tree.checkable,
                                checkable: this.state.tree.checkable,
                                onCheckEve: this.onTreeNodeChecked.bind(this),   //选择节点回调方法
                                openIcon:this.openIcon,
                                closeIcon:this.closeIcon,
                                onSelectEve:this.selNode,
                                defaultExpandAll:false,
                                checkStrictly:this.state.includeChildren, //false 勾选下级
                                onTreeExpand:this.onTreeNodeExpand,
                                searchType:'filtration',
                            })}
                        {/* <NCTree
                            fieldid={"quickassign"}
                            multiple = {this.state.tree.checkable}
                            checkable={this.state.tree.checkable}
                            defaultExpandAll={this.state.tree.checkable}
                            checkStrictly={!this.state.tree.isChild}
                            autoExpandParent = {false}
                            showLine={this.state.tree.checkable}
                            onCheck={this.onTreeNodeChecked}
                            checkedKeys={this.state.tree.checkedKeys}
                            defaultExpandedKeys={this.state.tree.defaultExpandedKeys}  //默认展开指定的节点
                            expandedKeys={this.state.tree.expandedKeys || []} 
                            onExpand={this.onTreeNodeExpand}
                          
                        > 
                            {loop([Object.assign(this.state.tree.root,{children:this.state.tree.datas})])}
                        </NCTree> */}
                        </div>
                        <div style={{marginTop: 10,marginLeft: 10}}>
                            <NCCheckbox checked={!this.state.includeChildren} onChange={
                                (val)=>{
                                    this.setState({includeChildren:!val},()=>{
                                        
                                    })
                                }}>
                                {this.props.Lang['10140SUG-000040']}
                            </NCCheckbox>
                        </div>
                    </div>
                </div>
                <div className = 'right-area' style={{marginLeft:30,height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
                    <div className = 'right-area-nei'>
                        <NCTable {...table} data={this.state.tableDatas} {...{bodyStyle:{'overflow-y':'auto',height:'390px'},useFixedHeader:true} } scroll={{y:500}} loadBuffer={10}/>
                    </div>
                </div>
            </div>
        ]
    }
}
export default OrgSelect;

//kjlk6SMVdVhwiA/Bq6MHoRDhL3aYb3DLPch81bs1d3h6MAaCb229oMmduA0++mDE