//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
const { NCDiv } = base;
let { NCTabs,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCFormControl,NCTree  } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCTable,NCButton,NCSelect } = component;
var EMPTY_FN = function(){};

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.state = {
          treesearch:{
            valueTemp: undefined,
            fieldid:'search',
            value: undefined,
            onChange:(value) =>{
              this.intervalmain2 = new Date().getTime();
              let s = setTimeout(() => {//停止输入0.5s后执行
                  if (new Date().getTime() - this.intervalmain2 >= 500) {
                    this.state.treesearch.value = this.state.treesearch.valueTemp;
                    this.setState(this.state,() =>{
                      this.state.treesearch.onSearch();
                    });
                  }
                  clearTimeout(s);
              }, 500);
              this.state.treesearch.valueTemp = value;
              this.setState(this.state);
            },
            onSearch: () =>{
                var expandKeys = [],
                    textValue = this.state.treesearch.value || '';
                const loopsearch = (nodes = []) => {
                    var parendExpand = false;
                    (nodes || [] ).forEach(child => {
                        var expand = loopsearch( child.children || [] );
                        child.needExpand = expand;
                        child.needShow = expand ? true: (child.nodeData.code.indexOf(textValue) != -1 || child.title.indexOf(textValue)  != -1? true: false);
                        parendExpand = parendExpand ? parendExpand :child.needShow;
                        if(expand){
                            expandKeys.push(child.key);
                        }
                    });
                    return parendExpand;
                }
                var rootExpand = loopsearch(this.state.tree.datas);
                expandKeys.push('root');
                this.state.tree.expandedKeys = expandKeys;
                this.setState(this.state);
            }
          },
          tree: {
            main: this,
            fieldid:'orgselect',
            root: {
                root: true,
                key: 'root',
                id: 'root',
                name: '',
                code: this.lang['10140CASHFLOW-000014'],/* 国际化处理： 组织*/
                title: this.lang['10140CASHFLOW-000014'],/* 国际化处理： 组织*/
                nodeData:{
                  code: '',
                  id: 'root'
                }
            },
            // 打开关闭图标
            openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),
            closeIcon:(<i  class="icon iconfont icon-shushouqi tree-swich"></i>),
            datas: [],
            renderNode: () => {
              var  renderTreeTitle = (item, pitem) => {
                let isExpand = this.state.tree.expandedKeys.includes(item.key);
                var isLeaf = !item.children.length, title = item.title;
                console.log(this.state.tree.expandedKeys, isExpand);
                let className = isLeaf?"tree-dian":isExpand?"icon iconfont  icon-wenjianjiadakai tree-wenjian":"icon iconfont  icon-wenjianjia tree-wenjian";
                var textValue = this.state.treesearch.value;
                var drawTitleString = (title) =>{
                    if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                        var start = title.indexOf(textValue) , end = start + textValue.length;
                        return <span><span   className='refer-tree-title'>{title.substring(0, start)}</span><span className="uapbd-cashflow-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                    }else{
                        return (<span><span  className='refer-tree-title'>{title}</span></span>);
                    }
                };
                let wenjianicon = <i className={className}/>;
                let titleInfo = <span>{drawTitleString(item.nodeData.code + " " +item.title)}</span>
                return (<div className="title-con">{wenjianicon}{titleInfo}</div>);
              };

              const loop = (datas, pdata) => {
                  return  datas.filter( item => {
                    return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
                }).map((node) => {
                    var children = node.children || [];
                    var isLeaf = !node.children.length && node.key != "root";
                    return (<NCTree.NCTreeNode
                      liAttr={{fieldid:(node.code||node.name||node.refname||node.refpk)+"_node"}}
                      className="node-item"
                      title={renderTreeTitle(node, pdata)} key={node.key} isLeaf={children.length == 0}  nodeData={node} >{children.length == 0 ? '': loop(children, node)}</NCTree.NCTreeNode>);    
                });
              };
              return loop( [{...this.state.tree.root, children: this.state.tree.datas}]); 
              // var defNodeCfg = this.main.state.tree.defNodeCfg || {},
              //     renderfn = function(data){
              //       data.disableCheckbox = data.root == true || data.nodeData.orgclazz == 'orgtype';
              //       return data;
              //     },
              //     loopRender = function(datas){
              //       return datas.map(function(item){
              //         var nodecfg = {...defNodeCfg, ...item},
              //             children = item.children || [];
              //         return <NCTree.NCTreeNode { ...(renderfn ? renderfn(nodecfg) : nodecfg)} isLeaf={children.length ==0}>{children.length ==0 ? '' : loopRender(children, item, renderfn)}</NCTree.NCTreeNode>;  //根节点和一级节点不可勾选 
              //     });
              // };
              // return loopRender( [{...this.root, children: this.datas}]); 
            },
            checkable: true,
            defaultExpandAll: true,
            checkStrictly: true,
            expandedKeys:['root'],
            autoExpandParent: false,
            exCheckedKeys:[],
            onExpand:(expandedKeys, e) => {
              this.state.tree.expandedKeys = expandedKeys;
              this.setState(this.state);
            },
            onCheck: (selectedKeys, e) => {
              var node = e.node,
                  checked = e.checked,
                  selectedData = this.state.selectData.datas,
                  subOrg = this.state.subOrg.checked,
                  exCheckedKeys = this.state.tree.exCheckedKeys,
                  isRootOrOrgType = (node) =>{
                      return node.props.nodeData.root || node.props.nodeData.nodeData.orgclazz =='orgtype';
                  },
                  loop = (nodes) =>{
                    nodes.forEach(n => {
                      handerCheckedNode(n);
                      loop(n.props.children || []);
                    });
                  },
                  handerCheckedNode = (node) =>{
                    var data = {   //处理当前node
                      id: node.props.nodeData.id,
                      name: node.props.nodeData.name,
                      code: node.props.nodeData.code
                    };
                    if(isRootOrOrgType(node)){
                      exCheckedKeys = checked ?  exCheckedKeys.concat(data.id) :  exCheckedKeys.filter( (n) => n != data.id );
                    }else{
                      selectedData  = checked ? selectedData.concat(data) : selectedData.filter( (n) => n.id != data.id );
                    }
                  };
              handerCheckedNode(node);
              if(subOrg || isRootOrOrgType(node)  )
                 loop(node.props.children || []);
              this.state.tree.exCheckedKeys = exCheckedKeys;
              this.state.selectData = {datas: selectedData};
              this.setState(this.state);
            }
          },

          subOrg:{
            checked:false,
            onChange: (val) =>{
              this.state.subOrg.checked = val;
              this.setState(this.state);
            }
          },

          table: {
            main: this,
            rowKey: 'id',
            columns:[{
              title: this.lang['10140CASHFLOW-000015'],/* 国际化处理： 组织编码*/
              dataIndex: 'code',
              width: '40%'
            },{
              title: this.lang['10140CASHFLOW-000016'],/* 国际化处理： 组织名称*/
              dataIndex: 'name',
              width: '40%'
            },{
              title: this.lang['10140CASHFLOW-000017'],/* 国际化处理： 操作*/
              dataIndex: 'doit',
              width: '20%',
              render: function(text, record, index) {
                var delFn = function(){
                  debugger;
                    var datas = this.state.selectData.datas;
                    this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                    this.setState(this.state);
                };
                return (<NCButton fieldid = "delete" onClick={delFn.bind(this)}>{this.lang['10140CASHFLOW-000018']}</NCButton>);/* 国际化处理： 删除*/
              }.bind(this)
            }]
          },
          selectData: {
              datas: []
          }
         
        };
    }

    rest(){
        ajax({
          url: '/nccloud/uapbd/cashflow/AssignSelectOrgTreeAction.do',
          data: {
            orgtypeIDs:['FINANCEORGTYPE000000'],
            isCludeGlobalAndGroupVO: true
          },
          success:(res) => {

            var treedata =res.data;
            this.state.selectData.datas = [];
            this.state.tree.datas = treedata;
            this.setState(this.state);
          }
      });
    }

    getData(){
      return this.state.selectData.datas.map ( n => n.id);
    }
    render() {
        var tree  = this.state.tree,
            table = this.state.table,
            selectDatas = this.state.selectData.datas,
            checkedKeys = selectDatas.map( (d) => d.id );
        checkedKeys = checkedKeys.concat(this.state.tree.exCheckedKeys || []);
        var searchRender = {
              ...this.state.treesearch,
              value: this.state.treesearch.valueTemp
        };
        return (
          <div className = 'transfer_tree_container'>
            <div style={{display: 'flex',justifyContent: 'space-around'}}>
              <div className = 'left-area' style={{height:'350px',padding:'10px',width:'calc(50% - 25px)'}}>
                <NCDiv areaCode={NCDiv.config.Tree}  className = 'left-area-nei'>
                  <div style={{width:200,marginLeft:20,marginTop:10}} >
                    <NCFormControl {...searchRender}/>
                  </div>
                  <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                    <NCDiv fieldid= 'orgselect' areaCode={NCDiv.config.TreeCom} className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                      <NCTree {...tree} { ...{checkedKeys:checkedKeys}}>
                        {tree.renderNode()}
                      </NCTree>
                    </NCDiv>
                  </div>
                </NCDiv>
              </div>
              <div className = 'right-area' style={{height:'350px',padding:'10px',width:'calc(50% - 25px)'}}>
                <div className = 'right-area-nei'>
                  <NCTable {...table} data={selectDatas} {...{scroll:{y: 360 }} }></NCTable>
                </div>
              </div>
            </div>
            <div style={{height:40,display:'flex',justifyContent:'center',alignItems:'center'}}>
              <NCCheckbox {...this.state.subOrg}>{this.lang['10140CASHFLOW-000013']/* 国际化处理： 包含下级*/}</NCCheckbox>
            </div>
          </div>
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS