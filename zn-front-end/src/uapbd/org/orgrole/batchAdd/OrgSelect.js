//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
import './OrgSelect.less'
import '../../../public/uapbdstyle/uapbd_style_common.less'
let { NCTable,NCCheckbox,NCDiv,NCTree  } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCButton,NCSelect } = component;


var EMPTY_FN = function(){};

var TreeWapper = function(treethis){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: treethis.state.json['10100PSRC-000008']/* 国际化处理： 业务单元*/
        };
    
    this.initData =  function(ds){
        datas = ds;
        var loop =  (nodes) => {
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
    var  renderTreeTitle = (item, expandKeys) => {
        let child = item.children || [];
        let isLeaf = !child.length, isExpand = expandKeys.includes(item.key);
        var drawTitleString = (title) =>{
            return (<span><span className='refer-tree-title'>{item.title}</span></span>);
        };
        //let titleInfo = <span><i className={isLeaf ? 'tree-dian' : isExpand ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian':'icon iconfont  icon-wenjianjia tree-wenjian'}></i>&nbsp;{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name || item.title)}</span>
        let titleInfo = <span><i className={isLeaf ? 'tree-dian' : expandKeys && expandKeys.indexOf(item.key) > -1 ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian':'icon iconfont  icon-wenjianjia tree-wenjian'}></i>&nbsp;<span>{item.code}</span>&nbsp;&nbsp;<span>{item.name || item.title}</span></span>
        return (<div className="title-con">{titleInfo}</div>);
    };
    this.renderNode = (move = false, expandedKeys) => {
        let expandKeys = expandedKeys || [];
        const loop = datas => datas.map((item) => {
            var children = item.children || [];
            let isLeaf = children.length == 0;
            let switcherName = isLeaf ? 'isLeaf_hiden_point_line':'isLeaf_show_point_line';
            return (<NCTree.NCTreeNode
                    liAttr={{ fieldid: (item.code || item.name) + "_node" }}
                    switcherClass={switcherName}
                    isLeaf={isLeaf}
                    title={renderTreeTitle(item, expandKeys)}
                    key={item.key}
                    isLeaf={children.length == 0}>{loop(children)}</NCTree.NCTreeNode>
            )
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

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.main = props.main;
        this.state = {
            json:props.main.state.json,
            treeWapper: new TreeWapper(props.main),
            origin: {
                autoExpandParent: false,
                showLine:true,
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand:(keys)=>{
                    this.state.origin.expandedKeys = keys;
                    this.setState(this.state);
                },
                expandedKeys:['root'],
                selectedKey:undefined
            },
            target: {
                autoExpandParent: false,
                showLine:true,
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand:(keys)=>{
                    this.state.target.expandedKeys = keys;
                    this.setState(this.state)
                },
                expandedKeys:['root'],
                selectedKey:undefined
            },
            incChild:{
                checked: true,
                onChange: (v) => {
                    this.state.incChild.checked = v;
                    this.state.incOnlyChild.checked =false;
                    this.state.incSelf.checked = undefined;
                    this.state.incEndChild.checked= false;
                    this.setState(this.state);
                }
            },
            incOnlyChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = false;
                    this.state.incOnlyChild.checked =v;
                    this.state.incSelf.checked = false;
                    this.state.incEndChild.checked= false;
                    this.setState(this.state);
                }
            },
            incSelf:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = false;
                    this.state.incOnlyChild.checked =false;
                    this.state.incSelf.checked = v;
                    this.state.incEndChild.checked= false;
                    this.setState(this.state);
                }
            },
            incEndChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = false;
                    this.state.incOnlyChild.checked =false;
                    this.state.incSelf.checked = false;
                    this.state.incEndChild.checked= v;
                    this.setState(this.state);
                }
            },
        };
    }

    rest(){

    }
    loadData(params){
        ajax({
          url: '/nccloud/uapbd/orgrole/BusiFuncTreeAction.do',
          data: {
            pk_func_relation :params.map( p => {
                return p.getData().function_code;
            })
          },
          success:(res) => {
            var treedata =res.data;
            this.state.treeWapper.initData(treedata);
            this.setState(this.state);
            this.setState({
                treedata
            });
            console.log('treedata',treedata)
          }
      });
    }

    onInit(){
        var colSelectComp = this.main.state.comp['comp0'],
            colDatas = colSelectComp.getData() || [];

        this.loadData(colDatas);
    }

    getData(){
        return this.state.treeWapper.getDataObjs();
    }
    render() {
        var treeWapper = this.state.treeWapper,
            origin  = this.state.origin,
            target  = this.state.target;

        var moveToTaget = () => {
            if(this.state.incChild.checked){
                treeWapper.moveRight(origin.selectedKey, false, this.state.incChild.checked, true, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            }else{
                treeWapper.moveRight(origin.selectedKey, false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            }
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            //treeWapper.moveRight('root', false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            treeWapper.moveRight('root', true, true, true, true, true);
            this.setState(this.state);
        };
        var moveToOrigin = () => {
            if(this.state.incChild.checked){
                treeWapper.moveLeft(target.selectedKey, false, this.state.incChild.checked, true, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            } else {
                treeWapper.moveLeft(target.selectedKey, false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            };
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            //treeWapper.moveLeft('root', false, this.state.incChild.checked, this.state.incSelf.checked, this.state.incOnlyChild.checked, this.state.incEndChild.checked);
            treeWapper.moveLeft('root', true, true, true, true, true);
            this.setState(this.state);
        }
        return (
            <div>
                <div className="transfer_tree_container" style={{height: 270}}>
                    <div className = 'left-area' style={{height:'270px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                        <div className = 'left-area-nei'>
                            <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.state.json['10100PSRC-000053']/* 国际化处理： 待选择数据*/}</div>
                            <div  className="syncTreeCom syncTreeComTransferLineStyle" style={{height:'calc(100% - 45px)'}}>
                                <NCDiv fieldid= 'origin' areaCode={NCDiv.config.TreeCom} className='synctree-area'   style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                <NCTree 
                                    className='col-ready-data'
                                    closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}
                                    openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}/* 国际化处理： 树开关*/
                                    {...origin}>{treeWapper.renderNode(false, origin.expandedKeys) }</NCTree>
                                </NCDiv>
                            </div>
                        </div>
                    </div>
                    <div className = 'button-area' style={{paddingTop: 0,height: 270}}>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid = 'taget' onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid = 'tagetall' onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton  fieldid = 'origin' onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid = 'originall' onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                        </div>
                    </div>
                    <div className = 'right-area' style={{height:'270px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                        <div className = 'right-area-nei'>
                            <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.state.json['10100PSRC-000054']/* 国际化处理： 已选择数据*/}</div>
                            <div  className="syncTreeCom syncTreeComTransferLineStyle" style={{height:'calc(100% - 45px)'}}>
                                <NCDiv fieldid= 'target' areaCode={NCDiv.config.TreeCom} className='synctree-area'   style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                    <NCTree className='col-select-data'
                                        closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}
                                        openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}
                                    {...target}>{treeWapper.renderNode(true, target.expandedKeys)}</NCTree>
                                </NCDiv>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%',display: 'flex',justifyContent: 'center',height: 40,alignItems: 'center'}}>
                    <span style={{marginRight: 20}}>
                        <NCCheckbox {...this.state.incChild}>{this.state.json['10100PSRC-000055']/* 国际化处理： 包含所有下级*/}</NCCheckbox>
                    </span>
                    <span style={{marginRight: 20}}>
                        <NCCheckbox {...this.state.incSelf}>{this.state.json['10100PSRC-000056']/* 国际化处理： 仅自己*/}</NCCheckbox>
                    </span>
                    <span style={{marginRight: 20}}>
                        <NCCheckbox {...this.state.incOnlyChild}>{this.state.json['10100PSRC-000057']/* 国际化处理： 仅直接下级*/}</NCCheckbox>
                    </span>
                    <span style={{marginRight: 20}}>
                        <NCCheckbox {...this.state.incEndChild}>{this.state.json['10100PSRC-000058']/* 国际化处理： 仅末级*/}</NCCheckbox>
                    </span>
                </div>
            </div>
        
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS