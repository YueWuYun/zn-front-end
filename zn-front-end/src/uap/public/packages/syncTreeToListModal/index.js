import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { createPage, base, ajax, toast } from "nc-lightapp-front";
import List from "./List";
import "./index.less";
import { nodeExistById, generateLfListArr } from "./method";

const { NCButton, NCTree } = base;
const { NCTreeNode } = NCTree;

class SyncTreeToListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rtListArr: props.params.queryData.rtListArr || [],//[],
      currNodeObj: {},
      itemIndex: -1,
      treeData: [],
      checkedArr: [],
      billtype:props.params.queryData.queryCondition.src_billtype,
      expandedKeys: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = (otherData = {}, firstInit = true) => {
    const that = this;
    const { params } = this.props;
    ajax({
      url: params.queryUrl,
      data: { ...params.queryData, ...otherData },
      success: res => {
        const { success, data } = res;
        if (success) {
          that.initTreeListData(data.rows, firstInit);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  initTreeListData = (treeData, firstInit) => {
    // treeData = [{
    //   isleaf: false, // 有子节点为false, 没有子节点为true
    //   // "pid": "1001A110000000001UPS", //父节点pk
    //   refcode: "040001", //编码
    //   refname: "中国建设银行上海支行", //名称
    //   refpk: "1001A110000000001UPa", //pk
    //   values: {} //自定义属性
    // },
    // {
    //   isleaf: false,
    //   // "pid": "1001A110000000001UPS",
    //   refcode: "040001",
    //   refname: "中国建设银行天安支行",
    //   refpk: "1001A110000000001Uvv",
    //   values: {}
    // }];
    this.setState({ treeData })
  };

  onCheckEve = (value, node) => {
    this.setState({ checkedArr: value.checked });
  };

  onLoadData = async(treeNode) => {
    const nodeKey = treeNode.props.eventKey;
    const that = this;
    const { params } = this.props;
    // const aData = [{
    //   isleaf: false, // 有子节点为false, 没有子节点为true
    //   // "pid": "1001A110000000001UPS", //父节点pk
    //   refcode: "040002", //编码
    //   refname: "3中国建设银行上海支行", //名称
    //   refpk: "1001A110000000001UP5", //pk
    //   values: {} //自定义属性
    // },
    // {
    //   isleaf: false,
    //   // "pid": "1001A110000000001UPS",
    //   refcode: "040002",
    //   refname: "1中国建设银行天安支行",
    //   refpk: "1001A110000000001Uvk",
    //   values: {}
    // }]
    // this.addNodeInfoToTree(aData,nodeKey)
    return new Promise(resolve => {
      ajax({
        url: params.queryUrl,
        data: {
          "pid":nodeKey,
          "queryCondition":{"src_billtype":this.state.billtype}
         },
        success: (res) => {
          const { success, data } = res;
          if (success) {
            that.addNodeInfoToTree(data.rows, nodeKey);
          }
        },
        error: (res) => {
          console.log(res);
        }
      })
      resolve();
    });
    
  };

  addNodeInfoToTree = (node, nodeKey) => {
    let { treeData } = this.state;
    const loop = (data) => {
      data.map((item) => {
        if (item.refpk === nodeKey) {
          item.children = node;
        } else if (item.children) {
          loop(item.children)
        }
      })
    }
    loop(treeData, nodeKey);
    console.log("treeData", treeData)
    this.setState({ treeData })
  }

  changeState = (obj = {}) => {
    this.setState(obj);
  };

  addToList = () => {
    let { checkedArr, rtListArr, treeData } = this.state;
    if (!checkedArr.length) return;
    const filteredIDArr = nodeExistById(checkedArr, rtListArr);
    if (!filteredIDArr.length) return;
    let arr = generateLfListArr(filteredIDArr, treeData);
    rtListArr = rtListArr.concat(arr);
    this.setState({ rtListArr })
  };

  delList = () => {
    let { rtListArr } = this.state;
    if (rtListArr.length <= 0) return;
    rtListArr.splice(this.state.itemIndex, 1);
    this.setState({ itemIndex: -1 });
  };

  loadTreeData = (pk, treeNode) => {
    this.getData({ pk }, false);
  };

  listClick = (item, itemIndex) => {
    this.setState({ itemIndex });
  };

  expand = (expandedKeys, other) => {
    console.log(expandedKeys, other)
    this.setState({expandedKeys})
  }

  render() {
    const { params } = this.props;
    const { rtListArr, itemIndex, expandedKeys } = this.state;
    const loop = (data) => data.map((item) => {
      return <NCTreeNode title={item.refname} liAttr={{"fieldid":"sync_tree_node"}}
        key={item.refpk}>{item.children && loop(item.children)}</NCTreeNode>;
    });
    const treeNodes = this.state.treeData.length && loop(this.state.treeData);

    return (
      <section>
        <div className="single-attribute-modal-contain">
          <div className="flex-lf" fieldid="sync_list_tree">
            {
              this.state.treeData.length && <NCTree
                openIcon={<i className='iconfont icon-wenjianjiadakai' />}
                closeIcon={<i className='iconfont icon-wenjianjia' />}
                checkable checkStrictly={params.checkStrictly || true}
                onCheck={this.onCheckEve} loadData={this.onLoadData}
                onExpand={this.expand}
                expandedKeys={expandedKeys}
                >
                {treeNodes}
              </NCTree>
            }
          </div>
          <div className="flex-center">
            <div className="btn-group">
              <NCButton onClick={this.addToList} fieldid="right_btn"> &gt;&gt;</NCButton>
              <NCButton style={{ marginTop: 8 }} onClick={this.delList} fieldid="del_btn"> &lt;&lt;</NCButton>
            </div>
          </div>
          <div className="flex-rt">
            <List
              rtListArr={rtListArr}
              itemIndex={itemIndex}
              onItemClick={this.listClick}
            />
          </div>
        </div>
        <footer className="single-attribute-modal-footer">
          <NCButton fieldid="ensure_btn"
            onClick={() => {
              this.props.onEnsureInfoSave(rtListArr);
            }}
          >
            确定
          </NCButton>
          <NCButton fieldid="cancel_btn"
            onClick={() => {
              this.props.onCancelInfoSave();
            }}
          >
            取消
          </NCButton>
        </footer>
      </section>
    );
  }
}

SyncTreeToListModal = createPage({})(SyncTreeToListModal);

export default SyncTreeToListModal;