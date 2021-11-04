//J61VM9cpY9HzdVKT7Z7GvVUqx5K4PRMaoUB9PKzzKvh3YOkIv9x6uF8MKwXaiuAQ
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl, NCDiv  } = base;

import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less'
var EMPTY_FN = function(){};

var TreeWapper = function(){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: TreeWapper.lang['ACCCHART-000014'],/* 国际化处理： 管控规则*/
            id: 'root'
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

    this.renderNode = (move = false, textValue, targetKeys) => {
        let targetItem = targetKeys || [];
        var  root = buildNodeTreeNode(move);
        var nodeComps, expandKeys = [];

        if(textValue){
            const loopsearch = (nodes = []) => {
                var parendExpand = false;
                (nodes || [] ).forEach(child => {
                    var expand = loopsearch( child.children || [] );
                    child.needExpand = expand;
                    child.needShow = expand ? true: (child.title.indexOf(textValue)  != -1? true: false);
                   
                   // child.needShow = expand ? true: (child.nodeData.code.indexOf(textValue) != -1 || child.title.indexOf(textValue)  != -1? true: false);
                    parendExpand = parendExpand ? parendExpand :child.needShow;
                    if(expand){
                        expandKeys.push(child.key);
                    }
                });
            }
            var rootExpand = loopsearch([root]);
            expandKeys.push('root');
        }
       
        var  renderTreeTitle = (item, pitem) => {
            let children = item.children || [];
            let isExpand = targetItem.includes(item.key);
            var isLeaf = !children.length;
            let IconClassName = isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
            var drawTitleString = (title) =>{
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return <span><span>{title.substring(0, start)}</span><span className="uapbd-cashflow-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                }else{
                    return (<span>{title}</span>);
                }
            };
            var classname =  item.nodeData && (item.nodeData.isallinherit) ?  'title-middle uapbd-batassign-rule-used ' : 'title-middle ';
            
          //  var classname =  item.nodeData && ( item.nodeData.allowallsubuse || item.nodeData.isallinherit) ?  'title-middle uapbd-batassign-rule-used ' : 'title-middle ';
            let titleInfo = <span className={classname}><i style={{color:'rgb(242, 178, 36)'}} className={IconClassName}/>{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name || item.title)}</span>;
            return (<div className="title-con">{titleInfo}</div>);
        };
      
        const loopdraw = (datas, pdata) => {
            return  datas.filter( item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                return (<NCTree.NCTreeNode 
                    title={renderTreeTitle(item)} 
                    key={item.key} 
                    className='node-item'
                    liAttr={{"fieldid": `${item.code}_node`}}
                    switcherClass={children.length == 0 ? 'isleaf-style-none-tree-self-define' : 'unleaf-style-none-tree-self-define'} 
                    isLeaf={children.length == 0}>{loopdraw(children)}</NCTree.NCTreeNode>)
            });
        }
        nodeComps =  loopdraw([root]);
        return {
            nodeComps: nodeComps,
            expandKeys: expandKeys
        };
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

    this.moveRight  = function(nodeid, mode){
        var curNode = dataMap[nodeid];
        if(curNode.root || curNode.nodeData.isallinherit)
            return;
        if(mode == 'add'){
            var loopChildMoveBlueRight = (children, onlyAllowallsubuse) =>{
                children.forEach(c => {
                    if(onlyAllowallsubuse){
                        if(c.nodeData.isallinherit){
                            c.move = true;
                            loopChildMoveBlueRight(c.children || [], onlyAllowallsubuse);
                        }
                    }else{
                        c.move = true;
                        loopChildMoveBlueRight(c.children || [], onlyAllowallsubuse);
                    }
                })
            };
            var loopParentMoveBlueRight = (pnode, cnode) =>{
                if(pnode.id == 'root')
                    return;
                var children = pnode.children;
                pnode.move = true;
                children = children.filter( c => {return  c.id != cnode.id});
                loopChildMoveBlueRight(children, true)
                loopParentMoveBlueRight( dataMap[pnode.pid] || root ,pnode);
            };
    
            curNode.move = true;
            loopChildMoveBlueRight(curNode.children || [], false);
            loopParentMoveBlueRight(dataMap[curNode.pid], curNode)
        }else{
            curNode.move = true;
            loopChildMove(curNode.children || [], true);
        }
        
    };

    this.moveLeft = function(nodeid,mode){
        var curNode = dataMap[nodeid];
        if(curNode.root || curNode.nodeData.isallinherit)
            return;
        if(mode == 'add'){
            curNode.move = false;
            loopChildMove(curNode.children || [], false);
        }else{
            var loopChildMoveBlueLeft = (children, onlyAllowallsubuse) =>{
                children.forEach(c => {
                    if(onlyAllowallsubuse){
                        if(c.nodeData.isallinherit){
                            c.move = false;
                            loopChildMoveBlueLeft(c.children || [], onlyAllowallsubuse);
                        }
                    }else{
                        c.move = false;
                        loopChildMoveBlueLeft(c.children || [], onlyAllowallsubuse);
                    }
                })
            };
            var loopParentMoveBlueLeft = (pnode, cnode) =>{
                if(pnode.id == 'root')
                    return;
                var children = pnode.children;
                pnode.move = false;
                children = children.filter( c => {return  c.id != cnode.id});
                loopChildMoveBlueLeft(children, true)
                loopParentMoveBlueLeft( dataMap[pnode.pid] || root ,pnode);
            };
    
            curNode.move = false;
            loopChildMoveBlueLeft(curNode.children || [], false);
            loopParentMoveBlueLeft(dataMap[curNode.pid], curNode)
        }
    };

    this.moveRightAll  = function(nodeid, incParent = false, incChild = false, incSelf = true){
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

    this.moveLeftAll = function(nodeid, incParent = false, incChild = false, incSelf = true){
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
        this.state = {
            treeWapper: new TreeWapper(),
            treesearchorigin:{
                type: 'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchorigin.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.origin.searchValue = this.state.treesearchorigin.value;
                    this.setState(this.state);
                }
            },
            origin: {
                searchValue: undefined,
                autoExpandParent:false,
                defaultExpandAll:true,
                selectedKeys:[],
                multiple: true,
                openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon: (<i  class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKeys = selectedKeys;
                    this.setState(this.state);
                }
            },
            treesearchtarget:{
                type: 'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchtarget.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.target.searchValue = this.state.treesearchtarget.value;
                    this.setState(this.state);
                }
            },
            target: {
                searchValue: undefined,
                autoExpandParent:false,
                defaultExpandAll:true,
                selectedKeys:[],
                multiple: true,
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon: (<i   class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKeys = selectedKeys;
                    this.setState(this.state);
                }
            },
            incChild:{
                checked: true,
                onChange: (v) => {
                    this.state.incChild.checked = v;
                    this.setState(this.state);
                }
            },
            incParent:{
                checked: true,
                onChange: (v) => {
                    this.state.incParent.checked = v;
                    this.setState(this.state);
                }
            }
        };
    }
    
    rest(param){
        this.param = param;
        ajax({
          url: '/nccloud/uapbd/acctable/ListAssignCtrlRuleAction.do',
          data: {
           pk_accchart: param.pk_accchart
          },
          success:(res) => {
            var treedata =res.data;
            debugger;
            this.state.treeWapper.initData(treedata);
            this.setState(this.state);
          }
      });
    }

    getData(){
        return this.state.treeWapper.getData();
    }
    render() {
        var treeWapper = this.state.treeWapper,
            origin  = this.state.origin,
            target  = this.state.target;

        var moveToTaget = () => {
            var mode = this.param.mode;
            origin.selectedKeys.forEach(key => {
                treeWapper.moveRight(key, mode);
            });
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRightAll('root', false, true, false );
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            var mode = this.param.mode;
            target.selectedKeys.forEach(key => {
                treeWapper.moveLeft(key, mode);
            });
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            treeWapper.moveLeftAll('root', false, true, false);
            this.setState(this.state);
        }

       var  orignRender = treeWapper.renderNode(false, origin.searchValue);
       var  targetRender = treeWapper.renderNode(true, target.searchValue);

       var orignExpandKeys =  origin.searchValue ? orignRender.expandKeys  : origin.expandKeys;
       var targetExpandKeys = target.searchValue ? targetRender.expandKeys : target.expandKeys;

        var originTree = {
            ...origin,
            expandKeys: orignExpandKeys
        };

        var targetTree = {
            ...target,
            expandKeys: targetExpandKeys
        };

        return (
            <NCDiv fieldid="transfer" areaCode={NCDiv.config.Area} className = 'transfer_tree_container' style={{marginTop: 10}}>
                <NCDiv fieldid="left" areaCode={NCDiv.config.Area} className = 'left-area' style={{height:'380px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                    <div className = 'left-area-nei'>
                        <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['ACCCHART-000002']/* 国际化处理： 待选择数据*/}</div>
                        <div style={{width:200,marginLeft:20,marginTop:10}}>
                            <NCFormControl {...this.state.treesearchorigin}/>
                        </div>
                        <div  className="syncTreeCom" style={{marginLeft: 20,height:'calc(100% - 100px)'}}>
                            <div className='synctree-area' >
                                <NCTree {...originTree}>{orignRender.nodeComps}</NCTree>
                            </div>
                        </div>
                    </div>
                </NCDiv>
                <div className = 'button-area'>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                    </div>
                </div>
                <NCDiv fieldid="right" areaCode={NCDiv.config.Area} className = 'right-area' style={{height:'380px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                    <div className = 'right-area-nei'>
                        <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['ACCCHART-000003']/* 国际化处理： 已选择数据*/}</div>
                        <div style={{width:200,marginLeft:20,marginTop:20}}>
                            <NCFormControl {...this.state.treesearchtarget}/>
                        </div>
                        <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                            <div className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                <NCTree {...targetTree}>{targetRender.nodeComps}</NCTree>
                            </div>
                        </div>
                    </div>
                </NCDiv>
            </NCDiv>
        )
    }
}
export default DataSelect;

//J61VM9cpY9HzdVKT7Z7GvVUqx5K4PRMaoUB9PKzzKvh3YOkIv9x6uF8MKwXaiuAQ