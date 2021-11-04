//VRDvoDzYsQMeLay/u4LmpXnt/EypKWoDQyhW7dxeQ0UApM2SeH2v0tQ+cDHK7FUZ
import React, { Component } from "react";
import { createPage, base } from "nc-lightapp-front";
let { NCTable, NCButton, NCModal } = base;
import { queryFinanceOrg } from "./events/index";
import { constant, attrcodeObj } from "./const";

let {
  orgTreeId,
} = constant;
  
let {
  pkFinancePrimery,
  code,
  name,
} = attrcodeObj;

let treeDatas = [];
export default class AssignTransfer extends Component {
  constructor(props) {
    super(props);
    let that = this;
    this.state = {
      showModalT: this.props.showModalT,
      table: {
        main: this,
        rowKey: 'id',
        scroll: { y: 390, x: false },
        columns: [{
          title: '组织编码',
          dataIndex: 'code',
          width: '40%'
        },
        {
          title: '组织名称',
          dataIndex: 'name',
          width: '40%'
        },
        {
          title: "操作",
          dataIndex: "opr",
          key: "opr",
          width: 100,
          fixed: "right",
          itemtype : 'customer',
          className : 'table-opr',
          render(text, record, index) {
            return (
              <div className='operation-btn'>
                <NCButton onClick={() => that.deleteRow(text, record, index)}>删除</NCButton>
              </div>
            )
          }
        }]
      },
      tableDatas: [],
      checkedKey :[], 
      nodes:[]
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.showModalT && nextProps.showModalT !== this.props.showModalT) {
      treeDatas = queryFinanceOrg.call(this);
      this.setState({
        tableDatas: []
      }, () => {
        let keys = [];
        keys = this.state.tableDatas.map((item, index) => {
          return item.refpk;
        })
        this.props.syncTree.setNodeChecked(orgTreeId, keys);
      });
    }
  }

  deleteRow = (text, record, index) => {
    this.state.tableDatas.splice(index, 1);
    let keys = this.state.tableDatas.map((item, index) => {
      return item.refpk;
    })
    this.props.syncTree.setNodeChecked(orgTreeId, keys);
    this.setState({
      tableDatas: [...this.state.tableDatas],
      checkedKey : keys,
      nodes :[]
    });
  }

  onCheckEve = (props, checkedKeys, { checked, checkedNodes, node, event}) => {
    if(!checked){
     if(node.props.refpk === "root"){
      this.setState({
        checkedKey: [],
        nodes : []
       })
     }else{
      let existIndex = this.state.checkedKey.indexOf(node.props.refpk) ;
      this.state.checkedKey.splice(existIndex, 1);
      this.state.nodes.splice(existIndex, 1)
      this.props.syncTree.cancelSelectedNode(orgTreeId);
      this.setState({
       checkedKey: this.state.checkedKey,
       nodes : this.state.nodes
      })
     }
     
    }

    let tableDatasArr = [];
    if (checkedKeys.indexOf("root") === checkedKeys.length - 1 && checked || treeDatas.data.length === checkedKeys.length && checkedKeys.indexOf("root")=== -1&& checked) {
      let keys = treeDatas.data.map((item, index) => {
        return item[pkFinancePrimery];
      });
      keys.push("root");
      this.props.syncTree.setNodeChecked(orgTreeId, keys);
      let checkedNodesArr = []
      tableDatasArr = treeDatas.data.map((item, index) => {
        if (item[pkFinancePrimery] === "root") {
          return;
        }
   
        let obj = {
          code: item[code],
          name: item[name],
          key: item[pkFinancePrimery],
          refcode: item[code],
          refname: item[name],
          refpk: item[pkFinancePrimery],
          props: item
        };
        checkedNodesArr.push({'props': obj})

        return obj;
      });
      this.setState({
        checkedKey: keys,
        nodes: checkedNodesArr
      });
    }else if(treeDatas.data.length === checkedKeys.length && checkedKeys.indexOf("root")  === -1&& !checked){
      this.props.syncTree.setNodeChecked(orgTreeId, []);
      tableDatasArr = [];
    }else {
      let indexof = checkedKeys.indexOf("root") ;
      if(indexof !== -1){
        checkedKeys.splice(indexof, 1);
        checkedNodes.splice(indexof, 1);
      }
      
      this.props.syncTree.setNodeChecked(orgTreeId, checkedKeys);
      //表中放入除了root节点
      tableDatasArr = checkedNodes.map((item, index) => {
        let obj = {
          code: item.props.refcode,
          name: item.props.refname,
          key: item.props.refpk,
          refcode: item.props.refcode,
          refname: item.props.refname,
          refpk: item.props.refpk,
          props: item.props,
          children: ''
        };
        return obj;
      });
      this.setState({
        checkedKey: checkedKeys,
        nodes: checkedNodes
      });
    }
    this.setState({
      tableDatas: [...tableDatasArr],
    });
  }

  render() {
    return (
      <div>
        <NCModal
          show={this.props.showModalT}
          onHide={() => this.props.setProps('cancel')}
          size='xlg'
        >
          <NCModal.Header closeButton={true} >
            <NCModal.Title>{"选择分配目标"}</NCModal.Title>
          </NCModal.Header>

          <NCModal.Body>
            <div className='transfer_tree_container' type="ncdiv" style={{ marginTop: 10, display:'flex' ,justifyContent:"space-between" }}>
              <div className='left-area area-common'>
              <div fieldname="财务组织" className='left-area-nei'>
                <div className="tree-area">
                  {this.props.syncTree.createSyncTree({
                    treeId: orgTreeId,
                    showModal: false,
                    checkable: true,
                    onCheckEve: this.onCheckEve,
                    needEdit: false,
                    checkedKeys: false,
                    needSearch:false,
                    onSelectEve : (checkedKey, node, checked, event)=>{
                      if(this.state.checkedKey.indexOf(checkedKey) === -1){
                        this.state.checkedKey.push(checkedKey)
                        this.state.nodes.push(event.selectedNodes[0])
                        this.setState({
                          checkedKey : this.state.checkedKey,
                          nodes :this.state.nodes
                        }, ()=>{
                          this.onCheckEve(this.props, [...this.state.checkedKey],{checked : event.selected, checkedNodes: this.state.nodes, node:event.node})
                        })
                      }
                    }
                  })}
                </div>
              </div>
              </div>
              <div className='right-area  area-common' >
                <NCTable table={this.state.table} columns={this.state.table.columns} data={this.state.tableDatas} ></NCTable>
              </div>
            </div>
          </NCModal.Body>
          <NCModal.Footer>
            <NCButton onClick={() => this.props.setProps('next', this.state.tableDatas)} colors="primary" >下一步</NCButton>
            <NCButton onClick={() => this.props.setProps('cancel')} style={{ marginRight: 50 }}>取消</NCButton>
          </NCModal.Footer>
        </NCModal>
      </div>
    )
  }
}
AssignTransfer = createPage({
  initTemplate: ''
})(AssignTransfer);
ReactDOM.render(<AssignTransfer />, document.querySelector("#app"));
//VRDvoDzYsQMeLay/u4LmpXnt/EypKWoDQyhW7dxeQ0UApM2SeH2v0tQ+cDHK7FUZ