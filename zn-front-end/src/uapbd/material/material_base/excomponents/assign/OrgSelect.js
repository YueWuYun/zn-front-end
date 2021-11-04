//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCSelect,NCTabs,NCInput, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse  } = base;
import classnames from 'classnames';
import NCTree from '../../../../public/platwapper/compwapper/NCTree';
import NCTable from '../../../../public/platwapper/compwapper/NCTable';
import '../../../../public/uapbdstyle/uapbd_style_common'
import './OrgSelect.less';
import { callbackify } from 'util';

var EMPTY_FN = function(){};

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isChild:true,
          tree: {
            main: this,
            expandedKeys:['root'],
            defNodeCfg: {

            },
            checkedKeys:[],
            root: {
                root: true,
                key: 'root',
                title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000128')/* 国际化处理： 组织*/,
                id:'root',
                refpk:'root',
                name:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000128')/* 国际化处理： 组织*/,
                nodeData:{
                  code:'root',
                  orgclazz:'root'
                },
                refname:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000128')/* 国际化处理： 组织*/,
                
            },
            datas: [],
            alldatas:[],
            renderNode: function(expandedKeys, datas = [], parent){
              var defNodeCfg = this.main.state.tree.defNodeCfg || {},
                  renderfn = function(data, classNames, isLeaf) {
                    //data.disableCheckbox = data.root == true || data.nodeData.orgclazz == 'orgtype';
                    data.title = isLeaf ?
                        ([<i className="tree-dian"/>,<span className="title-middle">{data.nodeData.code}&nbsp;{data.title}</span>]):
                        ([<i className={classNames}/>,<span className="title-middle">{data.nodeData.code}&nbsp;&nbsp;{data.title}</span>]);
                    return data;
                  },
                  loopRender = function(datas){
                    return datas.map(function(item){
                      var nodecfg = {...defNodeCfg, ...item},
                          children = item.children || [],
                          isLeaf = !children.length;
                      let classNames = expandedKeys.includes(item.refpk)?"icon iconfont  icon-wenjianjiadakai tree-wenjian":"icon iconfont  icon-wenjianjia tree-wenjian";
                      return (<NCTree.NCTreeNode
                      //liAttr={{ fieldid: ((item.key=='root' && item.key) || (item.nodeData && item.nodeData.code) || item.name) + "_node" }}
                      liAttr={{ fieldid: "root_node" }}
                      className='node-item'
                      key={item.key}
                      className={classnames("node-item", {
                        isexpend: expandedKeys.includes(item.keys)
                      })}
                      { ...(renderfn ? renderfn(nodecfg, classNames, isLeaf) : nodecfg)}
                    isLeaf={isLeaf}>{isLeaf ? '' : loopRender(children, item, renderfn)}</NCTree.NCTreeNode>);  //根节点和一级节点不可勾选 
                });
              };
              return loopRender( [{...this.root, children: this.datas}]); 
            },
            config: function(){
                return {
                  fieldid:'orgSelect',
                  checkable: true,
                  // defaultExpandAll: true,  NCCLOUD-170854去掉展开所有
                  autoExpandParent:false,
                  checkStrictly: true,
                  // NCCLOUD-170854展开收起功能失效
                  expandedKeys:this.main.state.tree.expandedKeys,
                  onExpand:(keys)=>{
                    this.expandedKeys = keys;
                    this.main.setState(this.main.state);
                  },
                  onCheck: function(selectedKeys, e){
                    let node = e.node.props,
                                checked = e.checked,
                                selectedData = this.main.state.selectData.datas,
                                data = {
                                    id: node.id || 'root',
                                    name: node.name || 'root',
                                    code: node.nodeData ? node.nodeData.code : 'root',
                                    orgclazz: node.nodeData?node.nodeData.orgclazz :'orgtype'
                                };
                            if(data.orgclazz === 'orgtype' || data.id ==='root'){
                                //如果选择的是组织类型节点
                                if(data.id !== 'root'){
                                    this.main.state.tree.datas.map((t)=>{
                                        if(t.id === node.id){
                                            this.main.getChildList([t],checked);
                                        }
                                    })
                                }else{
                                 //如果选择的是根节点
                                    this.main.getChildList(checked?[node]:selectedData,checked);

                                }

                            }else{
                                //如果选中非组织类型节点 且勾选包含所有下级
                                if(this.main.state.isChild){
                                    this.main.getChildList([node],checked);
                                }else{
                                    //没有勾选保安所有下级
                                    selectedData = checked ?
                                        selectedData.concat(data) :
                                        selectedData.filter((n) => n.id != data.id);
                                    this.main.state.selectData.datas = selectedData;
                                    this.main.setState(this.main.state);
                                }
                            }
                  }.bind(this)
                }
            }
          },
          table: {
            main: this,
            fieldid : 'orgSelectTable',
            rowKey: 'id',
            bodyStyle:{height:'330px'},
            columns:[{
              title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000154')/* 国际化处理： 编码*/,
              dataIndex: 'code',
              width: '40%'
            },{
              title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000155')/* 国际化处理： 名称*/,
              dataIndex: 'name',
              width: '40%'
            },{
              title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
              dataIndex: 'doit',
              width: '20%',
              render: function(text, record, index) {
                var delFn = function(){
                  var datas = this.state.selectData.datas;
                  this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                  this.setState(this.state);
                };
                return (<NCButton onClick={delFn.bind(this)}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</NCButton>);
              }.bind(this)
            }]
          },
          selectData: {
              datas: []
          }
         
        };
    }

    componentDidMount(){
      this.reset();
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
    reset(){
        ajax({
          url: '/nccloud/uapbd/material/queryAssignSelectOrgTree.do',
          data: {
            orgtypeIDs:['GROUPORGTYPE00000000','LIACTCOSTRG000000000','BUSINESSUNIT00000000','COSTREGION0000000000'],
            isCludeGlobalAndGroupVO: false
          },
          success:(res) => {

            var treedata =res.data;
            this.state.selectData.datas = [];
            this.state.tree.datas = treedata;
            this.state.tree.alldatas = treedata;
            let rootname = this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000128');
            let array = [this.state.tree.root].concat(this.treeToList(treedata,new Array()));
                    array && array.length>0 && array.forEach(node=>{
                        if(node.pid && node.pid!='root' && node.code){
                            node.refname = node.nodeData.code+"  "+node.name;
                        }
                        if(node.id && node.id=='root' && node.name&&node.name==rootname){
                          node.refname = "root  "+node.name;
                      }
                        if((node.pid == 'root' || node.id =='root')&&node.name&&node.name!=rootname){
                            delete node.code;
                        }
                        //this.state.treeDatas.set(node.refpk,node);
                    })
            this.props.syncTree.setSyncTreeData("orgSelect",[Object.assign({}, this.state.tree.root,{children:treedata})])//this.state.tree.root)
            this.props.syncTree.setNodeChecked("orgSelect","")
            this.setState(this.state);
            this.expandFirstNode([Object.assign({}, this.state.tree.root,{children:this.state.tree.datas})],"orgSelect",this);
          }
      });
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
     * 树节点展开事件
     */
    onTreeNodeExpand = (expandedKeys)=>{
      this.state.tree.expandedKeys = expandedKeys;
      this.setState(this.state);
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
      this.state.selectData.datas=tableDatas;
      this.setState({tableDatas, selectData: this.state.selectData})
  }
    /**
     * 递归获取所有儿子节点
     * @param array
     * @param checked
     * array 可以是树的node 也可以是树的原始数据
     */
    getChildList = (array,checked)=>{
      let me = this;
      for(let i = 0 ; i<array.length ;i++){
           let t = array[i];
           if(checked){
               me.state.selectData.datas.push({
                   id: t.id || t.props && t.props.id || 'root',
                   name: t.name || t.props && t.props.name || 'root',
                   code: t.nodeData ? t.nodeData.code : t.props ? t.props.nodeData.code :'root',
                   orgclazz: t.nodeData ? t.nodeData.orgclazz : t.props ? t.props.nodeData.orgclazz :'orgtype'
               });
           }else{
               if(t.id){
                   me.state.selectData.datas = me.state.selectData.datas.filter((i) => i.id != t.id)
               }else if(t.props ){
                   me.state.selectData.datas = me.state.selectData.datas.filter((i) => i.id != t.props.id)
               }else{
                   t.cheked = checked
               }
           }
          if(t.children instanceof  Array && t.children.length> 0
              ||t.props && t.props.children instanceof  Array && t.props && t.props.children.length>0 ){
              me.getChildList(t.children || t.props && t.props.children,checked);
          }else{
              continue;
          }
      }
      me.setState(me.state);
}

    getData(){
      return this.state.selectData.datas.filter(data=>data.orgclazz !== 'root' && data.orgclazz !== 'orgtype').map ( n => n.id);
    }
    onChange = (value) => {

      const expandedKeys = [];
      dataList.forEach((item) => {
        if (item.key.indexOf(value) > -1) {
          expandedKeys.push(getParentKey(item.key, gData));
        }
      });
      const uniqueExpandedKeys = [];
      expandedKeys.forEach((item) => {
        if (item && uniqueExpandedKeys.indexOf(item) === -1) {
          uniqueExpandedKeys.push(item);
        }
      });
      this.setState({
        expandedKeys: uniqueExpandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }

    selNode = (data, item, info) => {
      if(item){
        this.props.syncTree.setNodeChecked(item.id,item.refpk);
      }
     
    }

    
    render() {
        let {DragWidthCom,syncTree} = this.props;
        let {createSyncTree} = syncTree;
        var tree  = this.state.tree,
            table = this.state.table,
            selectDatas = this.state.selectData.datas,
            checkedKeys = selectDatas.map( (d) => d.id ),
            tableDatas = selectDatas.filter(data=>data.orgclazz !== 'root' && data.orgclazz !== 'orgtype');
        return (
        <div className = 'transfer_tree_container' style={{marginTop: 10}}>
            <div className = 'left-area' style={{height:'400px',padding:'10px',width:'calc(50% - 25px)'}}>
                <div className = 'left-area-nei'>
                    <div  className="syncTreeCom syncTreeComTransferLineStyle" style={{marginLeft: 20,height:'calc(100% - 40px)'}}>
                        <div className='synctree-area' style={{marginTop:'10px'}}>
                        
                            {createSyncTree({
                              treeId: "orgSelect",
                              showLine: true,
                              checkable: true,
                              needSearch:true,
                              needEdit:false,
                              onSelectEve:this.selNode,
                              onCheckEve: this.onTreeNodeChecked.bind(this),   //选择节点回调方法
                              openIcon:this.openIcon,
                              closeIcon:this.closeIcon,
                              defaultExpandAll:false,
                              checkStrictly:this.state.isChild, //false 勾选下级
                              onTreeExpand:this.onTreeNodeExpand,
                              searchType:'filtration',
                            })}

                            {/* <NCTree
                                {...tree.config()}
                                { ...{checkedKeys:checkedKeys}}
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
                                {tree.renderNode(this.state.tree.expandedKeys)}
                            </NCTree> */}
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <NCCheckbox checked={!this.state.isChild} onChange={(value)=>{this.state.isChild=!value;this.setState(this.state)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000130')/* 国际化处理： 包含所有下级*/}</NCCheckbox>
                    </div>
                </div>
            </div>
            <div className = 'right-area' style={{marginLeft:30,height:'400px',padding:'10px',width:'calc(50% - 25px)'}}>
              <div className = 'right-area-nei'>
                   <NCTable {...table} data={tableDatas} {...{scroll:{y: 360 }} }></NCTable>
              </div>
            </div>
        </div>
        )
    }
}


export default OrgSelect;
//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS