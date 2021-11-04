//eI8Va8F9NpTKcgGTOVnzUOrRiOJpHuY1q7+Kgg3jZd8OwlMGqksbQuqD4LW3db5F
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl, NCDiv  } = base;

import '../../../public/uapbdstyle/uapbd_style_common.less'

var EMPTY_FN = function(){};

var TreeWapper = function(){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: TreeWapper.lang['ACCCHART-000000']/* 国际化处理： 科目*/
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
        let targetItem = targetKeys;
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
            var isLeaf = !children.length, title = item.title;
            let IconClassName = isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
            var drawTitleString = (title) =>{
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return <span><span className='refer-tree-title'>{title.substring(0, start)}</span><span className="uapbd-cashflow-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                }else{
                    return (<span><span className='refer-tree-title'>{title}</span></span>);
                }
            };
            let titleInfo = <span><i style={{color:'rgb(242, 178, 36)'}} className={IconClassName}/>{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name || item.title)}</span>
            return (<div className="title-con">{titleInfo}</div>);
        };

        const loopdraw = (datas, pdata) => {
            return  datas.filter( item => {

                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                return (<NCTree.NCTreeNode
                    isLeaf={children.length == 0}
                    className='node-item'
                    liAttr={{"fieldid": `${item.code}_node`}}
                    switcherClass={children.length == 0 ? 'isleaf-style-none-tree-self-define' : 'unleaf-style-none-tree-self-define'} 
                    title={renderTreeTitle(item)}
                    key={item.key}
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
        loopParentMove(pnode,move);
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
        this.lang =props.lang;
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
                expandedKeys:['root'],
                selectedKeys:[],
                multiple: true,
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon: (<i   class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand:(expandedKeys)=>{
                    this.state.origin.expandedKeys = expandedKeys;
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
                expandedKeys:['root'],
                selectedKeys:[],
                multiple: true,
                openIcon: (<i   class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon: (<i   class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand:(expandedKeys)=>{
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
            },
            search:{
                defaultConditionsNum:2,
                oid:'-1',
                clickSearchBtn: (props,data,tyep,queryInfo) => {
                    this.onSearch( treedata => {
                        this.state.treeWapper.initData(treedata);
                        this.setState(this.state);
                    });
                }
            }
        };
        this.mainprops = props.mainprops;
    }
    
    rest(param){
        this.param = param;
        // ajax({
        //     url: '/nccloud/uapbd/acctable/ListAssignAccountAction.do',
        //     data: {
        //     pk_accchart: param.pk_accchart
        //     },
        //     success:(res) => {
        //         var treedata =res.data;
        //         debugger;
        //         this.state.treeWapper.initData(treedata);
        //         this.setState(this.state);
        //     }
        // });
        this.onSearch( treedata => {
            this.state.treeWapper.initData(treedata);
            this.setState(this.state);
        });
    }

    onSearch(callback){
        let searchVal = this.mainprops.search.getAllSearchData('searchaccounthand') || {};
        let queryInfo = this.mainprops.search.getQueryInfo('searchaccounthand',false);
        var param = {
                querycondition:searchVal,
                pagecode: this.mainprops.config.pagecode,  
                queryAreaCode:'searchaccounthand',
                oid: queryInfo.oid || '' ,
                querytype:'tree',
                pk_accchart: this.param.pk_accchart
        };
        ajax({
            url: '/nccloud/uapbd/acctable/ListAssignAccountAction.do',
            // data: {
            //     pk_accchart: this.param.pk_accchart
            // },
            data: param,
            success:(res) => {
              var treedata =res.data;
              callback && callback(treedata);
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
            if(mode == 'add'){
                origin.selectedKeys.forEach(key => {
                    treeWapper.moveRight(key, true, this.state.incChild.checked, true);
                });
            }else{
                debugger;
                origin.selectedKeys.forEach(key => {
                    treeWapper.moveRight(key, false, true, true);
                });
            }
           
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRight('root', false, true, false );
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            var mode = this.param.mode;
            if(mode == 'add'){
                target.selectedKeys.forEach(key =>{
                    treeWapper.moveLeft(key, false, true, true);
                });
            }else{
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

       var  orignRender = treeWapper.renderNode(false, origin.searchValue, this.state['origin'].expandedKeys);
       var  targetRender = treeWapper.renderNode(true, target.searchValue, this.state['target'].expandedKeys);

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

        var drawIncChild = () =>{
            return this.param && this.param.mode == 'add' ? <NCCheckbox {...this.state.incChild}>{this.lang['ACCCHART-000001']}</NCCheckbox> : '';/* 国际化处理： 包含下级*/
        };

        return (
            <div>
                {this.mainprops.search.NCCreateSearch('searchaccounthand', this.state.search)}
                <NCDiv fieldid="transfer" areaCode={NCDiv.config.Area} className = 'transfer_tree_container'>
                    <NCDiv fieldid="left  " areaCode={NCDiv.config.Area} className = 'left-area' style={{height:'350px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                        <div className = 'left-area-nei'>
                            <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['ACCCHART-000002']/* 国际化处理： 待选择数据*/}</div>
                            <div style={{width:200,marginLeft:20,marginTop:10}}>
                                <NCFormControl {...this.state.treesearchorigin}/>
                            </div>
                            <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                                <div className='synctree-area'   style={{marginLeft:20,width:'calc(100% - 20px)'}}>
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
                    <NCDiv fieldid="right" areaCode={NCDiv.config.Area} className = 'right-area' style={{height:'350px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
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
                <div style={{display: 'flex',justifyContent: 'center',height: 40,alignItems: 'center'}}>
                    {drawIncChild()}
                </div>
            </div>
        )
    }
}
export default DataSelect;

//eI8Va8F9NpTKcgGTOVnzUOrRiOJpHuY1q7+Kgg3jZd8OwlMGqksbQuqD4LW3db5F