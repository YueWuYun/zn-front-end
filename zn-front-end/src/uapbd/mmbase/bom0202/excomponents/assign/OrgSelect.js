//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree  } = base;
import classnames from 'classnames';
import '../../../../../uapbd/public/uapbdstyle/uapbd_style_common'
import './OrgSelect.less';

var EMPTY_FN = function(){};

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isChild:false,
          tree: {
            main: this,
            expandedKeys:['root'],
            defNodeCfg: {

            },
            root: {
                root: true,
                key: 'root',
                title: this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3023')/* 国际化处理： 组织*/,
                id:'root',
                name:this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3023')/* 国际化处理： 组织*/,
                nodeData:{
                  code:'root',
                  orgclazz:'root'
                }
            },
            datas: [],
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
                  checkable: true,
                  defaultExpandAll: true,
                  checkStrictly: true,
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
            rowKey: 'id',
            bodyStyle:{height:'330px'},
            columns:[{
              title: this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3019')/* 国际化处理： 编码*/,
              dataIndex: 'code',
              width: '40%'
            },{
              title: this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3020')/* 国际化处理： 名称*/,
              dataIndex: 'name',
              width: '40%'
            },{
              title: this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3002')/* 国际化处理： 操作*/,
              dataIndex: 'doit',
              width: '20%',
              render: function(text, record, index) {
                var delFn = function(){
                  var datas = this.state.selectData.datas;
                  this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                  this.setState(this.state);
                };
                return (<NCButton onClick={delFn.bind(this)}>{this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3004')/* 国际化处理： 删除*/}</NCButton>);
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
    
    reset(){
        ajax({
          url: '/nccloud/mmbd/bompub/assignorgtree.do',
          data: {
            orgtypeIDs:['BUSINESSUNIT00000000'],
            isCludeGlobalAndGroupVO: false
          },
          success:(res) => {

            var treedata =res.data;
            this.state.selectData.datas = [];
            this.state.tree.datas = treedata;
            this.setState(this.state);
          }
      });
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
    render() {
        var tree  = this.state.tree,
            table = this.state.table,
            selectDatas = this.state.selectData.datas,
            checkedKeys = selectDatas.map( (d) => d.id ),
            tableDatas = selectDatas.filter(data=>data.orgclazz !== 'root' && data.orgclazz !== 'orgtype');
        return (
        <div className = 'transfer_tree_container' style={{marginTop: 10}}>
            <div className = 'left-area' style={{height:'400px',padding:'10px',background:'rgb(249,249,249)',width:'calc(50% - 25px)'}}>
                <div className = 'left-area-nei'>
                    <div field="tree-area" className="syncTreeCom syncTreeComTransferLineStyle" style={{marginLeft: 20,height:'calc(100% - 40px)'}}>
                        <div className='synctree-area'  fieldname="树控件">
                            <NCTree
                                {...tree.config()}
                                { ...{checkedKeys:checkedKeys}}
                                openIcon={
                                    <i
                                        field={"tree-switcher"}
                                        className="icon iconfont icon-shu_zk tree-swich"
                                    />
                                }
                                closeIcon={
                                    <i
                                        field={"tree-switcher"}
                                        className="icon iconfont icon-shushouqi tree-swich"
                                    />
                                }
                            >
                                {tree.renderNode(this.state.tree.expandedKeys)}
                            </NCTree>
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <NCCheckbox checked={this.state.isChild} onChange={(value)=>{this.state.isChild=value;this.setState(this.state)}}>{this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3021')/* 国际化处理： 包含所有下级*/}</NCCheckbox>
                    </div>
                </div>
            </div>
            <div className = 'right-area' style={{marginLeft:30,height:'400px',padding:'10px',background:'rgb(249,249,249)',width:'calc(50% - 25px)'}}>
              <NCTable {...table} data={tableDatas} {...{scroll:{y: 360 }} }></NCTable>
            </div>
        </div>
        )
    }
}


export default OrgSelect;
//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS