//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTree,NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse ,NCFormControl,NCDiv } = base;
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
            defNodeCfg: {

            },
            root: {
                root: true,
                key: 'root',
                id: 'root',
                name: '',
                code:this.lang['INOUTBUSICLASS-000014'],/* 国际化处理： 组织*/
                title: this.lang['INOUTBUSICLASS-000014'],/* 国际化处理： 组织*/
                nodeData:{
                  code: '',
                  id: 'root'
                }
            },
            openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),
            closeIcon:(<i  class="icon iconfont icon-shushouqi tree-swich"></i>),
            datas: [],
            renderNode: () =>{
              var  renderTreeTitle = (item, pitem) => {
                let isExpand = this.state.tree.expandedKeys.includes(item.key);
                var isLeaf = !item.children.length, title = item.title;
                let className = isLeaf?"tree-dian":isExpand?"icon iconfont  icon-wenjianjiadakai tree-wenjian":"icon iconfont  icon-wenjianjiadakai tree-wenjian";
    
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
                }).map((item) => {
                    var children = item.children || [];
                    var isLeaf = !item.children.length && item.key != "root";
                    return (<NCTree.NCTreeNode 
                      liAttr={{fieldid:(item.code || item.key)+"_node"}}
                      className="node-item"
                      switcherClass={isLeaf ? 'isleaf-style-none-tree-self-define' : 'unleaf-style-none-tree-self-define'}   title={renderTreeTitle(item, pdata)} key={item.key} isLeaf={children.length == 0}  nodeData={item} >{children.length == 0 ? '': loop(children, item)}</NCTree.NCTreeNode>);    
                });
              };
              return loop( [{...this.state.tree.root, children: this.state.tree.datas}]); 
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
            fieldid:'orgselect',
            columns:[{
              title: this.lang['INOUTBUSICLASS-000015'],/* 国际化处理： 组织编码*/
              dataIndex: 'code',
              width: '40%'
            },{
              title: this.lang['INOUTBUSICLASS-000016'],/* 国际化处理： 组织名称*/
              dataIndex: 'name',
              width: '40%'
            },{
              title: this.lang['INOUTBUSICLASS-000017'],/* 国际化处理： 操作*/
              dataIndex: 'doit',
              width: '20%',
              render: function(text, record, index) {
                var delFn = function(){
                    var datas = this.state.selectData.datas;
                    this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                    this.setState(this.state);
                };
                return (<NCButton fieldid = "delfn" onClick={delFn.bind(this)}>{this.lang['INOUTBUSICLASS-000018']}</NCButton>);/* 国际化处理： 删除*/
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
          url: '/nccloud/uapbd/inoutbusiclass/AssignSelectOrgTreeAction.do',
          data: {
            orgtypeIDs:['BUSINESSUNIT00000000'],
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
          <div className = 'transfer_tree_container' style={{display: 'flex','justify-content': 'space-around',marginTop: 20,paddingLeft: 15,paddingRight: 15}}>
            <div className = 'left-area' style={{height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
              <div className = 'left-area-nei'>
                <div className="syncTreeCom" style={{marginLeft: 20,height:'calc(100% - 35px)'}}>
                <NCDiv fieldid= 'synctree' areaCode={NCDiv.config.TreeCom} style={{'-webkit-box-flex': 1,flex: '1 1 auto',overflow: 'auto',width: '100%'}} >
                  <NCTree {...tree} { ...{checkedKeys:checkedKeys}}>
                    {tree.renderNode()}
                  </NCTree>
                </NCDiv>
                </div>
                <div style={{marginTop: 10,marginLeft: 10}}>
                <NCCheckbox {...this.state.subOrg}>{this.lang['INOUTBUSICLASS-000047'] || "包含下级"}</NCCheckbox>
                </div>
              </div>
            </div>
            <div className = 'right-area' style={{marginLeft:30,height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
              <div className = 'right-area-nei' style={{overflow: 'hidden'}}>
              <NCTable {...table} data={selectDatas} {...{bodyStyle:{'overflow-y':'auto',height:'330px'},useFixedHeader:true} }></NCTable>
              </div>
            </div>
          </div>
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS