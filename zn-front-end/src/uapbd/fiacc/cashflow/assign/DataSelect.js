//i7TmLDdRNdG2+XQnktK7bXyoAn4adJTnWlqBUkmuVk5plnFIFZUw0OKLwFSymei+
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTabs,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCFormControl,NCTree  } = base;
const { NCDiv } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCTable,NCButton,NCSelect } = component;

import '../../../public/uapbdstyle/uapbd_style_common.less'

var EMPTY_FN = function(){};

var TreeWapper = function(){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: TreeWapper.lang['10140CASHFLOW-000010'],/* 国际化处理： 现金流量*/
            code: ''
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


    this.getExpandedKeysAndWapperNode = function(move = true, textValue){
        var  root = buildNodeTreeNode(move);
        var nodeComps, expandKeys = [];

        if(textValue){
            const loopsearch = (nodes = []) => {
                var parendExpand = false;
                (nodes || [] ).forEach(child => {
                    var expand = loopsearch( child.children || [] );
                    child.needExpand = expand;
                    child.needShow = expand ? true: (child.title.indexOf(textValue)  != -1 || (child.code || '').indexOf(textValue)  != -1? true: false);
                    parendExpand = parendExpand ? parendExpand :child.needShow;
                    if(expand){
                        expandKeys.push(child.key);
                    }
                });
                return parendExpand;
            }
            var rootExpand = loopsearch([root]);
        }
        expandKeys.push('root');
        return {
            expandedKeys: expandKeys,
            root: root
        };
    }

    this.renderNode = (move = false, textValue,expandedKeys) => {
        var  root = this.getExpandedKeysAndWapperNode(move, textValue).root;
        var  renderTreeTitle = (item, pitem) => {
            var isLeaf = !item.children  || item.children  == 0;
			var	isExpand = expandedKeys.includes(item.refpk);
            var drawTitleString = (title,icon) => {
                let className = icon?(isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia"):'';
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return (
                    [
                        <i className={className} style={{color:'#f2b224'}} />,
                        <span className='refer-tree-title' style={{margin:0,padding:0}}>
                            <span>
                                {title.substring(0, start)}
                            </span>
                            <span style={{ 'color':'#f50','transition':'all .3s?ease','font-weight': 'bold'}} className="uapbd-cashflow-treefilter-highlight" >
                            {textValue}
                            </span>
                            <span>{title.substring(end, title.length)}</span>
                        </span>
                    ]
                    )
                }else{
                    return (
                    [
                        <i className={className} style={{color:'#f2b224'}}/>,
                        <span  className='refer-tree-title' style={{margin:0,padding:0}}>{title}</span>
                    ]
                    );
                }
            };
            let titleInfo = <span className="title-middle">{drawTitleString(item.code,true)}&nbsp;&nbsp;{drawTitleString(item.name || item.title,false)}</span>
            return (<div className="title-con">{titleInfo}</div>);
        };
      
        const loopdraw = (datas, pdata) => {
            return  datas.filter( item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((node) => {
                var children = node.children || [];
                return (<NCTree.NCTreeNode
                    liAttr={{fieldid:(node.code||node.name||node.refname||node.refpk)+"_node"}}
                    className="node-item"
                    title={renderTreeTitle(node)} key={node.key} isLeaf={children.length == 0}>{children.length != 0 && loopdraw(children)}</NCTree.NCTreeNode>)
            });
        }
        return loopdraw([root]);
    };

    var loopChildMove = function(nodes, move = false){
        nodes.forEach( n => {
            n.move = move;
            loopChildMove(n.children || [], move);
        });
    };

    var loopParentMove = function(n, move = false){
        var pid   = n.pid,
            pnode =  dataMap[pid] || root;
        if(pnode.root)
            return;
        pnode.move = move;
        loopParentMove(pnode, move);
    };

    this.moveRight  = function(nodeid, incParent = false, incChild = false, incSelf = true){
        var curNode = dataMap[nodeid],
            move = true;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children || [], move);
    };

    this.moveLeft = function(nodeid, incParent = false, incChild = false, incSelf = true){
        var curNode = dataMap[nodeid],
            move = false;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children ||[], move);
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
};

class DataSelect extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        TreeWapper.lang = this.lang;
        this.maincfg = props.maincfg;
        this.state = {
            treeWapper: new TreeWapper(),
            doit: 'do',
            treesearchorigin:{
                searchValue: undefined,
                fieldid:'search',
                type: 'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchorigin.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.treesearchorigin.searchValue = this.state.treesearchorigin.value;
                    var expandedKeys = this.state.treeWapper.getExpandedKeysAndWapperNode(false, this.state.treesearchorigin.searchValue).expandedKeys;
                    this.state.origin.expandedKeys = expandedKeys;
                    this.setState(this.state);
                }
            },
            origin: {
                autoExpandParent: false,
                selectedKeys:[],
                fieldid:'origintree',
                expandedKeys:['root'],
                openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon:(<i  class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand:(expandedKeys, {expanded, node}) =>{
                    debugger;
                    this.state.origin.expandedKeys = expandedKeys;
                    this.setState(this.state);
                }
            },
            treesearchtarget:{
                searchValue: undefined,
                type: 'search',
                fieldid:'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchtarget.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.treesearchtarget.searchValue = this.state.treesearchtarget.value;
                    var expandedKeys = this.state.treeWapper.getExpandedKeysAndWapperNode(true, this.state.treesearchtarget.searchValue).expandedKeys;
                    this.state.target.expandedKeys = expandedKeys;
                    this.setState(this.state);
                }
            },
            target: {
                selectedKeys:[],
                expandedKeys:['root'],
                fieldid:'targettree',
                autoExpandParent: false,
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon:(<i   class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand:(expandedKeys, {expanded, node}) =>{
                    this.state.target.expandedKeys = expandedKeys;
                    this.setState(this.state);
                }
               
            },
            incChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = v;
                    this.setState(this.state);
                }
            }
        };
    }

    rest(doit){
        //分配需要改成显示包含停用数据,以后不在改这块,坚决不改
        ajax({
          url: '/nccloud/uapbd/cashflow/CashflowTreeAction.do',
          data: {
            orgtypeIDs:['FINANCEORGTYPE000000'],
            isCludeGlobalAndGroupVO: false,
            isShowSeal: true,
            nodetype:  this.maincfg.nodetype
            
          },
          success:(res) => {
            var treedata =res.data;
            this.state.treeWapper.initData(treedata);
            this.state.doit = doit;
            this.setState(this.state);
          }
      });
    }

    getData(){
        return this.state.treeWapper.getData();
    }

    render() {
        var {treeWapper,origin, target,treesearchorigin,treesearchtarget}  = this.state
        var moveToTaget = () => {
            if(this.state.doit == 'do'){
                origin.selectedKeys.forEach(key => {
                    treeWapper.moveRight(key, true, this.state.incChild.checked, true);
                });
            }
            if(this.state.doit == 'undo'){
                origin.selectedKeys.forEach(key => {
                    treeWapper.moveRight(key, false,true, true);
                });
            }
           
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRight('root', false, true, false );
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            if(this.state.doit == 'do'){
                target.selectedKeys.forEach(key =>{
                    treeWapper.moveLeft(key, true, true, true);
                });
            }
            if(this.state.doit == 'undo'){
                target.selectedKeys.forEach(key =>{
                    treeWapper.moveLeft(key, true, false, true);
                });
            }
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            treeWapper.moveLeft('root', false, true, false);
            this.setState(this.state);
        }

        return (
            <div className = 'transfer_tree_container'>
                <div className = 'left-area' style={{height:'350px',padding:'10px',width:'calc(50% - 25px)'}}>
                    <NCDiv areaCode={NCDiv.config.Tree} className = 'left-area-nei'>
                        <div style={{height:30,width:'100%',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['10140CASHFLOW-000011']/* 国际化处理： 待选择数据*/}</div>
                        <div style={{width:200,marginLeft:20,marginTop:10}} >
                            <NCFormControl {...this.state.treesearchorigin}/>
                        </div>
                        <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                            <div  className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'}} fieldid="fundplanitem">
                                <NCTree {...origin}>{treeWapper.renderNode(false, treesearchorigin.searchValue,this.state.origin.expandedKeys)}</NCTree>
                            </div>
                        </div>
                    </NCDiv>
                </div>
                <div className = 'button-area'>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton fieldid = "button-first" onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton fieldid = "button-second" onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton fieldid = "button-third" onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton fieldid = "button-forth" onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                    </div>
                </div>

                <div className = 'right-area' style={{height:'350px',padding:'10px',width:'calc(50% - 25px)'}}>
                    <NCDiv className = 'right-area-nei' areaCode={NCDiv.config.Tree}>
                        <div style={{height:30,width:'100%',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['10140CASHFLOW-000012']/* 国际化处理： 已选择数据*/}</div>
                        <div style={{width:200,marginLeft:20,marginTop:20}}>
                            <NCFormControl {...this.state.treesearchtarget}/>
                        </div>
                        <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                            <NCDiv fieldid= 'targettree' areaCode={NCDiv.config.TreeCom}  className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'} } >
                                <NCTree {...target}>{ treeWapper.renderNode(true, treesearchtarget.searchValue,this.state.target.expandedKeys)}</NCTree>
                            </NCDiv>
                        </div>
                    </NCDiv>
                </div>
                <div style={{height:40,display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <NCCheckbox {...this.state.incChild}>{this.lang['10140CASHFLOW-000013']/* 国际化处理： 包含下级*/}</NCCheckbox>
                </div>
            </div>
        )
    }
}
export default DataSelect;

//i7TmLDdRNdG2+XQnktK7bXyoAn4adJTnWlqBUkmuVk5plnFIFZUw0OKLwFSymei+