//aZXgMjKPkPbaM1YCUhLNkKngpe+cLzHig+t/Jr9B2zjlN5580FLu7jbn2WfZ/lkA
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let {NCTabs,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCFormControl,NCTree,NCDiv  } = base;

import {component} from '../../../public/platwapper/index.js';
const {NCButton } = component;

import './deptSelect.less'
import '../../../public/uapbdstyle/uapbd_style_common.less'

var EMPTY_FN = function(){};
var TreeWapper = function(title){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            code:title,
            title: title
        };
    
    this.initData =  function(ds){
        datas = ds;
        var loop =  (nodes) => {
            //这里加入非空判断
            if(!nodes){
                return;
            }

            nodes.forEach(node => {
                dataMap[node.key] = node;
                loop(node.children||[]);
            });
        };
        loop(datas);
        dataMap[root.key] = {...root, children: ds};
    }.bind(this);

    var buildNodeTreeNode = function(move = true){
        var newRoot = { ...root},
            loop = (nodes, pnode) => {
            //这里加入非空判断
            if(!nodes){
                return;
            }

            nodes.map( node => {
                var  movesign =  node.move ? true: false,
                    n  = movesign == move ?  {... node, children: []} : undefined ,
                    childs = node.children || [];
                if(n){
                    pnode.children = pnode.children || [];
                    pnode.children.push(n);
                }
                loop(childs, n || newRoot);
            });
        };
        loop(datas, newRoot);
        return newRoot;
    }.bind(this);

    var  renderTreeTitle = (item, expandedTarget) => {
        let child = item.children || [];
        // origin 和 target
        let isLeaf = !child.length;

        // expandedTarget && expandedTarget.indexOf(item.key) > -1
        let titleInfo = <span><i className={isLeaf ? 'tree-dian' : expandedTarget && expandedTarget.indexOf(item.key) > -1 ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian':'icon iconfont  icon-wenjianjia tree-wenjian'}></i>&nbsp;<span>{item.key != 'root' && item.code}</span>&nbsp;&nbsp;<span>{item.name || item.title}</span></span>
        return (<div>{titleInfo}</div>);
    };

    this.renderNode = (move = false, expandedTarget) => {
        const loop = datas => datas.map((item) => {
            var children = item.children || [];
            //return (<NCTree.NCTreeNode title={item.title} key={item.key} isLeaf={children.length == 0}>{loop(children)}</NCTree.NCTreeNode>)
            //构造树显示编码加名称
            return (<NCTree.NCTreeNode 
                liAttr={{ fieldid: (item.code || item.name) + "_node" }}
                className='node-item'
                title={renderTreeTitle(item, expandedTarget)}
                key={item.key}
                switcherClass={children.length == 0 ? 'transferSwitcherClassSelfNameHidden':'transferSwitcherClassSelfNameShow'}
                isLeaf={children.length == 0}>{loop(children)}</NCTree.NCTreeNode>)
        });
        var  root = buildNodeTreeNode(move);
        return loop([root]);
    };

    var loopChildMove = function(nodes, move = false){
        nodes.forEach( n => {
            n.move = move;
            loopChildMove(n.children || [], move);
        });
    };
    var loopOnlyChildMove = function(nodes, move = false){
        nodes.forEach( n => {
            n.move = move;
        });
    };
    var loopEndChildMove = function(nodes, move = false){
        nodes.forEach( n => {
            var children = n.children || [];
            if(children.length == 0)
                n.move = move;
            else
                loopEndChildMove(n.children || [], move);
        });
    };

    var loopParentMove = function(n, move = false){
        var pid   = n.pid,
            pnode =  dataMap[pid] || root;
        if(pnode.root)
            return;
        pnode.move = move;
        loopParentMove(pnode);
    };

    this.moveRight  = function(nodeid, incParent = false, incChild = false, incSelf = true, incOnlyChild = false, incEndChild = false ){
        var curNode = dataMap[nodeid],
            move = true;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children || [], move);
        if(incOnlyChild)
            loopOnlyChildMove(curNode.children || [], move);
        if(incEndChild)
            loopEndChildMove(curNode.children || [], move);
    };

    this.moveLeft = function(nodeid, incParent = false, incChild = false, incSelf = true, incOnlyChild = false, incEndChild = false){
        var curNode = dataMap[nodeid],
            move = false;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children ||[], move);
        if(incOnlyChild)
            loopOnlyChildMove(curNode.children || [], move);
        if(incEndChild)
            loopEndChildMove(curNode.children || [], move);
    };

    this.getData = function(){
        var ids = [],
            rootNode = dataMap['root'];

        var loopChild = function(nodes){
            nodes.forEach( n => {
                if(n.move)
                    ids.push(n.key);
                loopChild(n.children || []);
            });
        };
        loopChild(rootNode.children || []);
        return ids;
    };

    this.getDataObjs = function(){
        var objs = [],
            rootNode = dataMap['root'];

        var loopChild = function(nodes){
            nodes.forEach( n => {
                if(n.move)
                    objs.push(n);
                loopChild(n.children || []);
            });
        };
        loopChild(rootNode.children || []);
        return objs;
    };
};

class DeptSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeWapper: new TreeWapper(props.config.json['10100DEPT-000000']/* 国际化处理： 部门*/),
            origin: {
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand : (expandedKeys) => {
                    this.state.origin.expandedKeys = expandedKeys;
                    console.log(this.state.origin.expandedKeys);
                    this.setState(this.state);
                },
                expandedKeys:[],
                selectedKey:undefined,
                defaultExpandedKeys:'root'
            },
            target: {
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand : (expandedKeys) => {
                    this.state.target.expandedKeys = expandedKeys;
                    console.log(this.state.target.expandedKeys);
                    this.setState(this.state);
                },
                expandedKeys:[],
                selectedKey:undefined,
                defaultExpandedKeys:'root'
            },
            incChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = v;
                    this.setState(this.state);
                }
            },
            incOnlyChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incOnlyChild.checked = v;
                    this.setState(this.state);
                }
            },
            incSelf:{
                checked: true,
                onChange: (v) => {
                    this.state.incSelf.checked = v;
                    this.setState(this.state);
                }
            },
            incEndChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incEndChild.checked = v;
                    this.setState(this.state);
                }
            },
        };
    }

    componentWillMount(){
        ajax({
          url: '/nccloud/baseapp/dept/treeQuery.do',
          data: {
            enablestate:'Y',//显示停用部门
            pk_org:this.props.config.pk_org//北分
          },
          success:(res) => {
            var treedata =res.data;
            this.state.treeWapper.initData(treedata);
            this.setState(this.state);
          }
      });
    }

    getData(){
        return this.state.treeWapper.getDataObjs();
    }
    render() {
        var treeWapper = this.state.treeWapper,
            origin  = this.state.origin,
            target  = this.state.target;

        var moveToTaget = () => {
            treeWapper.moveRight(origin.selectedKey, false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            //treeWapper.moveRight('root', false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            treeWapper.moveRight('root', false, true, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            this.setState(this.state);
        };

        var moveToOrigin = () =>{
            treeWapper.moveLeft(target.selectedKey, false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            //treeWapper.moveLeft('root', false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            treeWapper.moveLeft('root', false, true, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            this.setState(this.state);
        }
        return (
            <div>
                <div className="transfer_tree_container" style={{height: 315,marginTop: 10}}>
                    <div className = 'left-area nc-theme-transfer-wrap-bgc' style={{height:'305px',padding:'10px'/*,background:'rgba(249,249,249,1)'*/,width:'calc(50% - 25px)'}}>
                        <div className = 'left-area-nei'>
                            <div style={{height:30,width:'100%',/*background:'rgba(249,249,249,1)',*/margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.props.config.json['10100DEPT-000064']/* 国际化处理： 待选择数据*/}</div>
                            <div className="syncTreeCom" style={{marginLeft: 20,height:'calc(100% - 50px)'}}>
                                <NCDiv fieldid= 'depttree' areaCode={NCDiv.config.TreeCom} className='synctree-area' >
                                    <NCTree
                                        showLine={true}
                                        closeIcon={<i class="icon iconfont icon-shushouqi tree-swich"></i>}
                                        openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}
                                        {...origin}>{treeWapper.renderNode(false ,this.state.origin.expandedKeys) }</NCTree>
                                </NCDiv>
                            </div>
                        </div>
                    </div>
                    <div className = 'button-area' style={{paddingTop: 0,height: 305}}>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"deptmovetarget"} onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"deptmovetargetall"} onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"deptmoveorigin"} onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"deptmoveorigin"} onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                        </div>
                    </div>
                    <div className = 'right-area nc-theme-transfer-wrap-bgc' style={{height:'305px',padding:'10px'/*,background:'rgba(249,249,249,1)'*/,width:'calc(50% - 25px)'}}>
                        <div className = 'right-area-nei'>
                            <div style={{height:30,width:'100%',/*background:'rgba(249,249,249,1)',*/margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.props.config.json['10100DEPT-000065']/* 国际化处理： 已选择数据*/}</div>
                            <div className="syncTreeCom" style={{marginLeft: 20,height:'calc(100% - 50px)'}}>
                                <NCDiv fieldid= 'choosedept' areaCode={NCDiv.config.TreeCom} className='synctree-area'  >
                                    <NCTree
                                        showLine={true}
                                        closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}
                                        openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}
                                    {...target}>{treeWapper.renderNode(true, this.state.target.expandedKeys)}</NCTree>
                                </NCDiv>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                    <NCCheckbox {...this.state.incChild}>{this.props.config.json['10100DEPT-000066']/* 国际化处理： 包含所有下级*/}</NCCheckbox>
                </div>
            </div>
            
        )
    }
}

export default DeptSelect;

//aZXgMjKPkPbaM1YCUhLNkKngpe+cLzHig+t/Jr9B2zjlN5580FLu7jbn2WfZ/lkA