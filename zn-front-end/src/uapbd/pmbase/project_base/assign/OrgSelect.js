//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import { base, ajax } from 'nc-lightapp-front';
let { NCCol, NCRow, NCDiv, NCTree,NCCheckbox } = base;
import { component } from '../../../public/platwapper/index.js';
const { NCTable, NCButton } = component;

import '../../../public/uapbdstyle/uapbd_style_common'

var EMPTY_FN = function () { };

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: {
                main: this,
                defNodeCfg: {

                },
                root: {
                    root: true,
                    key: 'root',
                    refname: this.props.json['10140PRJB-000006']/* 国际化处理： 组织*/,
                    name: this.props.json['10140PRJB-000006']/* 国际化处理： 组织*/,
                    title: this.props.json['10140PRJB-000006']/* 国际化处理： 组织*/
                },
                expandedKeys: [],
                exCheckedKeys: [],
                datas: [],
                renderNode: function (datas = [], parent) {
                    let renderFileTreeTitle = (item) => {
                        console.log(this, 'renderFileTreeTitle');
                        let className,
                            isExpand = this.expandedKeys.includes(item.refpk);
                        if (item && item.hasOwnProperty('children') && item.children.length > 0) {
                            className = isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian" : "icon iconfont  icon-wenjianjia tree-wenjian";
                        } else {
                            className = "tree-dian";
                        }
                        return (
                            <div className={"title-con"}>
                                <i className={className} /><span className="title-middle">{item.refname}</span>
                            </div>
                        )
                    };
                    var defNodeCfg = this.main.state.tree.defNodeCfg || {},
                        renderfn = function (data) {
                            data.disableCheckbox = data.root == true || data.nodeData.orgclazz == 'orgtype';
                            return data;
                        },
                        loopRender = function (datas) {
                            return datas.map(function (item) {
                                var nodecfg = { ...defNodeCfg, ...item },
                                    children = item.children || [];
                                return <NCTree.NCTreeNode
                                    liAttr={{ fieldid: (item.name) + "_node" }}
                                    className='node-item'
                                    {...(renderfn ? renderfn(nodecfg) : nodecfg)}
                                    title={renderFileTreeTitle(item)}
                                    isLeaf={children.length == 0}>
                                    {children.length == 0 ? '' : loopRender(children, item, renderfn)}
                                </NCTree.NCTreeNode>;  //根节点和一级节点不可勾选
                            });
                        };
                    return loopRender([{ ...this.root, children: this.datas }]);
                },
                config: function () {
                    return {
                        checkable: true,
                        fieldid: 'orgselect',
                        defaultExpandAll: true,
                        checkStrictly: true,
                        onCheck: (selectedKeys, e)=> {
                            var node = e.node,
                                checked = e.checked,
                                subOrg = this.main.state.subOrg.checked,
                                selectedData = this.main.state.selectData.datas,
                                loop = (nodes) => {
                                    nodes.forEach(n => {
                                        handerCheckedNode(n);
                                        loop(n.props.children || []);
                                    });
                                },
                                handerCheckedNode = (node) => {
                                    var data = {   //处理当前node
                                        id: node.props.id,
                                        name: node.props.name,
                                        code: node.props.code
                                    };
                                    selectedData = checked ? selectedData.concat(data) : selectedData.filter((n) => n.id != data.id);
                                };
                            handerCheckedNode(node);
                            if (subOrg)
                                loop(node.props.children || []);
                            this.main.state.selectData.datas = selectedData;
                            this.main.setState(this.main.state);
                        }
                    }
                }
            },
            table: {
                main: this,
                rowKey: 'id',
                fieldid: 'orgtable',
                bodyStyle: { 'overflow-y': 'hidden', height: '390px' },
                columns: [{
                    title: this.props.json['10140PRJB-000007'],/* 国际化处理： 组织编码*/
                    dataIndex: 'code',
                    width: '40%'
                }, {
                    title: this.props.json['10140PRJB-000008'],/* 国际化处理： 组织名称*/
                    dataIndex: 'name',
                    width: '40%'
                }, {
                    title: this.props.json['10140PRJB-000009'],/* 国际化处理： 操作*/
                    dataIndex: 'doit',
                    width: '20%',
                    render: function (text, record, index) {
                        var delFn = function () {
                            var datas = this.state.selectData.datas;
                            this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                            this.setState(this.state);
                        };
                        return (<NCButton fieldid='del' onClick={delFn.bind(this)}>{this.props.json['10140PRJB-000010']}</NCButton>); {/* 国际化处理： 删除*/ }
                    }.bind(this)
                }]
            },
            subOrg: {
                checked: false,
                onChange: (val) => {
                    this.state.subOrg.checked = val;
                    this.setState(this.state);
                }
            },
            selectData: {
                datas: []
            }

        };
    }

    componentDidMount() {
        this.reset();
    }
    reset() {
        ajax({
            url: '/nccloud/uapbd/customer/assignTree.do',
            data: {
                orgtypeIDs: ['BUSINESSUNIT00000000'],
                isCludeGlobalAndGroupVO: false,
                isProject_grp: true
            },
            success: (res) => {

                var treedata = res.data;
                this.state.selectData.datas = [];
                this.state.tree.datas = treedata;
                this.setState(this.state);
            }
        });
    }

    getData() {
        return this.state.selectData.datas.map(n => n.id);
    }
    // 树展开的回调函数
    onExpandFn = (keys) => {
        this.state.tree.expandedKeys = keys;
        this.setState(this.state);
    }
    render() {
        var tree = this.state.tree,
            table = this.state.table,
            selectDatas = this.state.selectData.datas,
            checkedKeys = selectDatas.map((d) => d.id);
        return (
            <div className='transfer_tree_container' style={{ marginTop: 10 }}>
               <div className = 'left-area nc-theme-transfer-wrap-bgc' style={{height:'450px',padding:'10px',width:'calc(50% - 25px)'}}>
                    <div className='left-area-nei'>
                        <div className="syncTreeCom" style={{ marginLeft: 20, height: 'calc(100% - 40px)' }}>
                            <NCDiv fieldid='orgselect' areaCode={NCDiv.config.TreeCom} className='synctree-area' >
                                <NCTree
                                    closeIcon={<i class="icon iconfont icon-shushouqi tree-swich"></i>}
                                    openIcon={<i class="icon iconfont icon-shu_zk tree-swich"></i>}
                                    onExpand={this.onExpandFn}
                                    expandedKeys={this.state.tree.expandedKeys}
                                    {...tree.config()}
                                    {...{ checkedKeys: checkedKeys }}>
                                    {tree.renderNode()}
                                </NCTree>
                            </NCDiv>
                        </div>
                    </div>
                </div>
                <div className = 'right-area nc-theme-transfer-wrap-bgc' style={{marginLeft:30,height:'450px',padding:'10px',width:'calc(50% - 25px)',overflow:'hidden'}}>
                    <NCTable  {...table} data={selectDatas} {...{ scroll: { y: 390 } }}></NCTable>
                </div>
                <div style={{ height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <NCCheckbox {...this.state.subOrg}>{this.props.json['10140PRJB-000052']/* 国际化处理： 包含下级*/}</NCCheckbox>
                </div>
            </div>
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS