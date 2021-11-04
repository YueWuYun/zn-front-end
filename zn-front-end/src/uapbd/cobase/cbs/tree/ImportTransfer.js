//ywSL8zkxtU52rpsJ/bocIcdTzYXlaBZtl9o3HA0ESbsiYaRp0I9J8OmV2O4ydhM0
import React, { Component } from "react";
import { createPage, base, high } from "nc-lightapp-front";
const { NCButton, NCModal } = base;
import { doCBSAssign, cancelCBSAssign, importFunc, transformToTree, sortTree, showToast } from "./events/index"
import "./index.less";
import { toastConfig } from "./const";
let datasource = [];

export default class ImportTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],//右边的目标
      showModalT: this.props.showModalT,
      modalSize: '',
      datasource :[...datasource],
      selectNodes:[],
      selectNodesRightTree :[],
      disabledMoveAllTR :true
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showModalT && nextProps.showModalT !== this.props.showModalT) {
      
      this.setState({
        selectNodes: [],
        datasource : [],
        selectNodesRightTree :[],
        targetKeys: [],
      }, ()=>{
        let dataSource =[...this.state.datasource]
        dataSource = this.props.queryTree.call(this);
        let obj = {
          pid: null,//根节点不需要父节点
          refcode:"root",
          refname: 'CBS',
          refpk:"root",
          id:"root",
          key :'root',
          title :'CBS'
        }
        this.props.that.props.syncTree.setNodeChecked('leftTree', [obj]);
        this.props.syncTree.setSyncTreeData('rightTree', [obj]);
        let disabledMoveAllTR = true; 
        if(!dataSource[0].children || dataSource[0].children.length === 0){
            dataSource = [];
            disabledMoveAllTR = false
        }
        this.setState({
          datasource : JSON.parse(JSON.stringify(dataSource)),
          disabledMoveAllTR: disabledMoveAllTR
        });
      });
    }
  }
  /**
   * @description 已经修改好父子关系的节点数组，与当前节点对比，是否重复
   * @param {curDataArr} 已经遍历过的值的数组
   * @param {value} 当前遍历的值
   */
  findRepeatedNode =(curDataArr, value)=>{
    let res = false;
    curDataArr.map((item, index)=>{
      if(item.refpk === value){
        res = true
      }
    })

    return res
  }
  /**
   * @description 遍历树， 获取相应的一维数组，并返回。
   * @param :targetDatas 想要转换的数据，树结构，普通数组都可以
   * @param:result 返回的结果。
   * @param:isKey ： 是否是单一的字段值。返回的就是该字段的数组， 没有处理new Set原则
   * @param:isFilter是否过滤重复数据
   * @param:attr ： isKey=true， 时的字段
   * @param:refpks ： 树的pk的数组
   *  @param:isTreeStrucData ：是否树的数据， 否则，就不用递归
   */
  mapTreeData= (targetDatas, result, isKey,isFilter, attr, refpks, isTreeStrucData)=>{
    targetDatas.map((item, index)=>{
      if(isKey){  
        if(isFilter){
          if(result.indexOf(item.props ? item.props[attr]: item[attr]) !== -1){
            return 
          }
          result.push(item.props ? item.props[attr]: item[attr])
        }else{
          result.push(item.props ? item.props[attr]: item[attr])
        }
      }else{
        let value ='';
        if(refpks.length >0){
          if(refpks){
         
            value = item.props && item.props["fpid"]?item.props["fpid"] : item.fpid
            //如果选中和目标树里的数据存在该节点的pid，，就恢复该节点pid值。
            if((refpks.indexOf(value) !== -1) && (item["pid"] !== value)){
              item['pid'] = value
            }else if((refpks.indexOf(value) === -1)){//未在目标树里找到对应的父节点，设root
              item['pid'] = 'root'
            }
          }

          let findResBoo = this.findRepeatedNode(result, item.props ? item.props["refpk"]: item["refpk"]);
          if(!findResBoo){
            result.push(item);
          }
        }else{
          result.push(item);
        }
      }

      if(isTreeStrucData){//不是树，没必要递归
        item.children && item.children.length >0 && this.mapTreeData(item.children, result, isKey, isFilter, attr, refpks, isTreeStrucData);
      }
    })
    return result;
  }

  moveToRight = () => {
    let needData = {
      pid: 'pid',
      refcode: 'refcode',
      refname: "refname",
      refpk: "refpk",
      id: "id",
      values: {},
      fpid:'fpid',
    };
 
    let treeData = this.props.syncTree.getSyncTreeValue("rightTree")[0].children;
    let leftTreeData = this.props.that.props.syncTree.getSyncTreeValue("leftTree")[0].children;
    let returnData = [],
        alldatas =[],
        refpks = [],
        treeDataArr = [];

    if(treeData){
      //将目标树的数据转换成一维数组，根节点默认的不算入
      treeDataArr = this.mapTreeData(treeData, returnData, false, false, "", [], true);
      alldatas = this.state.selectNodes.concat(treeDataArr)
    }else{
      alldatas = this.state.selectNodes
    }

    refpks = this.mapTreeData(alldatas, [], true, false, "refpk");//选中+目标节点的refpk 去掉重复项需要，获取index
    returnData =this.mapTreeData(alldatas, [], false, false, "", refpks, false); //去掉重复项，

    //转换成树数据
    let disorderedTreeData = transformToTree.call(this, needData, 'CBS-集团', returnData, this.props, true);
    sortTree(disorderedTreeData);
    this.props.syncTree.setSyncTreeData('rightTree', disorderedTreeData);

    refpks = this.mapTreeData(alldatas, [], true, true, "refpk", [], false);//最后点击确定时传给后台的数据集合

    this.state.selectNodes.map((item, index)=>{
      this.props.that.props.syncTree.setNodeDisable('leftTree',true, item.refpk);
    })

    let leftTreeLength = this.mapTreeData(leftTreeData, [], false, false, "", [], true).length;//控制按钮显示问题
    if( leftTreeLength > returnData.length - 1){
      this.setState({
        disabledMoveAllTR: true
      })
    }else{
      this.setState({
        disabledMoveAllTR: false
      })
    }

    this.props.syncTree.setNodeChecked('rightTree', []);
    this.props.that.props.syncTree.setNodeChecked('leftTree', []);
    this.props.syncTree.cancelSelectedNode('rightTree');
    this.props.that.props.syncTree.cancelSelectedNode('leftTree');

    this.setState({
      selectNodes:[],
      targetKeys :refpks
    })
  }

  handleMovedData=(disabled)=>{
    let data = JSON.parse(JSON.stringify(this.state.datasource))
    let returnData =this.mapTreeData([...data], [], false, false, "", [], true);

    returnData.map((item, index)=>{
      this.props.that.props.syncTree.setNodeDisable('leftTree',disabled, item.refpk);
    })

    this.props.syncTree.setNodeChecked('rightTree', []);
    this.props.that.props.syncTree.setNodeChecked('leftTree', []);
    this.props.syncTree.cancelSelectedNode('rightTree');
    this.props.that.props.syncTree.cancelSelectedNode('leftTree');
    this.setState({
      selectNodes:[],
      selectNodesRightTree :[],
    })
  }

  moveAllToRight = ()=>{
    let returnData = [],
    refpks = [];
    let data = JSON.parse(JSON.stringify(this.state.datasource))
    this.props.syncTree.setSyncTreeData('rightTree', data);
    this.handleMovedData(true);
    returnData =this.mapTreeData(data[0].children, [], false, false, "", [], true);
    refpks = this.mapTreeData(returnData, [], true, true, "refpk", [], false);//最后点击确定时传给后台的数据集合
    this.setState({
      disabledMoveAllTR: false,
      targetKeys :refpks
    })
  }

  moveAllToLeft = () => {
    let data = JSON.parse(JSON.stringify(this.state.datasource))
    this.props.that.props.syncTree.setSyncTreeData('leftTree', data);
    this.handleMovedData(false);

    this.props.syncTree.setSyncTreeData('rightTree', [{
      pid: null,//根节点不需要父节点
      refcode:"root",
      refname: 'CBS',
      refpk:"root",
      id:"root",
      key :'root',
      title :'CBS'
    }]);
    this.setState({
      disabledMoveAllTR: true
    })
  }

  moveToLeft = () =>{
    let needData = {
      pid: 'pid',
      refcode: 'refcode',
      refname: "refname",
      refpk: "refpk",
      id: "id",
      values: {},
      fpid:'fpid'
    },
      refpks = [],
      returnData = [] ;

    let treeData = this.props.syncTree.getSyncTreeValue("rightTree")[0].children;
    let leftTreeData = this.props.that.props.syncTree.getSyncTreeValue("leftTree")[0].children;

    refpks = this.mapTreeData(treeData, [], true, false, "refpk", [], true);
    returnData =this.mapTreeData(treeData, [], false, false, "", [], true);//将右边所有树转换为一维数组

    //去重勾选项
    this.state.selectNodesRightTree.map((item ,index)=>{
      let tempIndex = refpks.indexOf(item.refpk);
      this.props.that.props.syncTree.setNodeDisable('leftTree',false, item.refpk);
      this.props.syncTree.delNodeSuceess('rightTree', item.refpk);

      if(tempIndex !== -1){
        refpks.splice(tempIndex, 1);
        returnData.splice(tempIndex, 1);
      }
    })

    returnData =this.mapTreeData(returnData, [], false, false, "", refpks);//重新构建父子关系节点
    
    //转换成树数据
    let disorderedTreeData = transformToTree.call(this, needData, 'CBS-集团', returnData, this.props, true);
    sortTree(disorderedTreeData);
    this.props.syncTree.setSyncTreeData('rightTree', disorderedTreeData);

    if(treeData.length === 0){
      this.props.syncTree.setSyncTreeData('rightTree', [{
        pid: null,//根节点不需要父节点
        refcode:"root",
        refname: 'CBS',
        refpk:"root",
        id:"root",
        key :'root',
        title :'CBS'
      }]);
    }

    this.props.syncTree.setNodeChecked('rightTree', []);
    this.props.that.props.syncTree.setNodeChecked('leftTree', []);
    this.props.syncTree.cancelSelectedNode('rightTree');
    this.props.that.props.syncTree.cancelSelectedNode('leftTree');

    let leftTreeLength = this.mapTreeData(leftTreeData, [], false, false, "", refpks, true).length;
    if(leftTreeLength > returnData.length - 1){
      this.setState({
        disabledMoveAllTR: true
      })
    }else{
      this.setState({
        disabledMoveAllTR: false
      })
    }
    this.setState({
      selectNodesRightTree:[],
    })
  }

  beSureClick = () => {
    if (this.state.targetKeys.length === 0) {
      showToast(toastConfig, 'cbsWaring');
      return false;
    }
    
    let pkFinanceOrgArr = this.props.tableArr.map((item, index) => {
      return item.key;
    });
    let params = { pk_financeorg: [...pkFinanceOrgArr], pk_cbs: [...this.state.targetKeys] , pk_project: this.props.pkProjectValueRef}

    if (this.props.type === 'cancelAssign') {
      cancelCBSAssign.call(this, params);
    } else if (this.props.type === 'assign') {
      doCBSAssign.call(this, params);
    } else if (this.props.type === 'import') {
      importFunc.call(this.props.that, params);
    }
    return true
  }

  //选中时自动勾选子级， 取消时，只取消本节点
  selectNode = (props, checkedKeys, { checked, checkedNodes, node, event })=>{
    if(!checked){ //取消选中，从选中节点中删除取消节点
      let selectNodes = [...this.state.selectNodes];
      this.state.selectNodes.map((item, index)=>{
        if(item.refpk === node.props.refpk){
          selectNodes.splice(index, 1)
        }
      })
      this.setState({
        selectNodes : selectNodes
      })
      return ;
    }

    let selectNodes = this.state.selectNodes;
    selectNodes.push(node.props);
    this.setState({
      selectNodes : selectNodes
    },()=>{
      node.props.children&&node.props.children.map((item, index)=>{
        this.props.that.props.syncTree.setNodeSelected('leftTree', item.key);
        checkedKeys.push(item.key);
        checkedNodes.push(item);
        node = item;
        this.selectNode.call(this, props, checkedKeys, { checked, checkedNodes, node, event })
      })
    })
  }
  //选中时自动勾选子级  。取消时，只取消本节点
  selectNodeRightTree= (props, checkedKeys, { checked, checkedNodes, node, event })=>{
    if(!checked){ //取消选中，从选中节点中删除取消节点
      let selectNodesRightTree = [...this.state.selectNodesRightTree];
      this.state.selectNodesRightTree.map((item, index)=>{
        if(item.refpk === node.props.refpk){
          selectNodesRightTree.splice(index, 1)
        }
      })
      this.setState({
        selectNodesRightTree : selectNodesRightTree
      })
      return ;
    }

    let selectNodesRightTree = this.state.selectNodesRightTree;
    selectNodesRightTree.push(node.props);

    this.setState({
      selectNodesRightTree : selectNodesRightTree
    },()=>{
      node.props.children&&node.props.children.map((item, index)=>{
        this.props.syncTree.setNodeSelected('rightTree', item.key);
        checkedKeys.push(item.key);
        checkedNodes.push(item);
        node = item;
        this.selectNodeRightTree.call(this, props, checkedKeys, { checked, checkedNodes, node, event })
      })
    })
  }

  render() {
    let rightTree = this.props.syncTree.getSyncTreeValue('rightTree');
    return (
      <div className = {'modal-content-resizeWrap-parent'}>
        <NCModal
          show={this.props.showModalT}
          onHide={() => this.props.setProps('importCacel')}
          size='xlg'
        >
          <NCModal.Header closeButton={true} >
            <NCModal.Title>{"数据选择"}</NCModal.Title>
          </NCModal.Header>

          <NCModal.Body>
          <div className='transfer_tree_container' type="ncdiv" style={{ marginTop: 10, display:'flex' ,justifyContent:"space-between" }}>
              <div fieldname="cbs-集团" className='left-area-nei' style ={{width:'45%'}}  >
                  <div className="tree-area">
                    {this.props.that&&this.props.that.props.syncTree.createSyncTree({
                      treeId: 'leftTree',
                      showModal: false,
                      checkable: true,
                      onCheckEve: this.selectNode.bind(this.props.that), 
                      needEdit: false,
                      checkedKeys: false,
                      needSearch:false,
                      defaultExpandAll:true,
                    })}
                  </div>
                </div>

              <div style = {{    width: '5%', marginLeft: '2.5%', flexDirection:'column',alignSelf:'center'}}>
                {this.state.selectNodes.length > 0 ? 
                  <div className={'cus-btn checkedStyle'} onClick={this.moveToRight.bind(this.props.that)} >{`>`}</div>  
                  :
                  <div className={'cus-btn nocheckedStyle'}>{`>`}</div>
                }
               {this.state.disabledMoveAllTR? 
                   <div className={'cus-btn checkedStyle'} onClick={this.moveAllToRight.bind(this.props.that)} >{`>>`}</div>  
                  :
                  <div className={'cus-btn nocheckedStyle'}>{`>>`}</div>
                }
                {this.state.selectNodesRightTree.length > 0 ? 
                   <div className={'cus-btn checkedStyle'} onClick={this.moveToLeft.bind(this.props.that)} >{`<`}</div>
                  :
                  <div className={'cus-btn nocheckedStyle'}>{`<`}</div>
                }
                {rightTree&&rightTree[0]&&rightTree[0].children&&rightTree[0].children.length>0? 
                  <div className={'cus-btn checkedStyle'} onClick={this.moveAllToLeft.bind(this.props.that)} >{`<<`}</div>
                  :
                  <div className={'cus-btn nocheckedStyle'} >{`<<`}</div>
                }
              </div>

              <div fieldname="cbs-集团" className='left-area-nei' style ={{width:'45%'}}>
                  <div className="tree-area">
                    {this.props.syncTree.createSyncTree({
                      treeId: 'rightTree',
                      showModal: false,
                      checkable: true,
                      onCheckEve: this.selectNodeRightTree.bind(this.props.that), 
                      needEdit: false,
                      checkedKeys: false,
                      needSearch:false,
                      defaultExpandAll:true,
                    })}
                  </div>
                </div>
            </div>

          </NCModal.Body>
          <NCModal.Footer>
            <NCButton onClick={() => this.props.setProps('import', this.props.tableArr, this.beSureClick)} colors="primary">确定</NCButton>
            <NCButton onClick={() => this.props.setProps('importCacel')} style={{ marginRight: 50 }}>取消</NCButton>
          </NCModal.Footer>
        </NCModal>

      </div>
    )
  }
}
ImportTransfer = createPage({
  initTemplate: ''
})(ImportTransfer);
ReactDOM.render(<ImportTransfer />, document.querySelector("#app"));
//ywSL8zkxtU52rpsJ/bocIcdTzYXlaBZtl9o3HA0ESbsiYaRp0I9J8OmV2O4ydhM0