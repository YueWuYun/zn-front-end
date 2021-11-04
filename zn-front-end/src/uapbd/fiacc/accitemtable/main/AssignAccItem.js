//N/frgba6E2W96PojvrkdItmEtXpQmmGlUHvQC5FoltYHNmHGn3gVLJ5287BiVQsL
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep,NCTree,NCFormControl } = base;
var EMPTY_FN = function(){};

import '../../../public/uapbdstyle/uapbd_style_common.less'

var TreeWapper = function(ds){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: TreeWapper.lang['ACCCHART-000067'],/* 国际化处理： 会计科目*/
            code: ''
        };
    
    datas = ds || [];
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
    this.initData(datas);

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
                    child.needShow = expand ? true: (child.title.indexOf(textValue)  != -1  || child.code.indexOf(textValue)!= -1? true: false);
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

    this.renderNode = (move = false, textValue) => {
        var  root = this.getExpandedKeysAndWapperNode(move, textValue).root;
        var  renderTreeTitle = (item, pitem) => {
            var drawTitleString = (title) =>{
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return <span><span>{title.substring(0, start)}</span><span className="uapbd-inoutbusiclass-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                }else{
                    return (<span>{title}</span>);
                }
            };
            let titleInfo = <span className="title-middle">{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name || item.title)}</span>
            return (<div className="title-con">{titleInfo}</div>);
        };
      
        const loopdraw = (datas, pdata) => {
            return  datas.filter( item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                return (<NCTree.NCTreeNode title={renderTreeTitle(item)} key={item.key} isLeaf={children.length == 0}>{children.length == 0 ? '' :loopdraw(children)}</NCTree.NCTreeNode>)
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

class AssignAccItem extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        TreeWapper.lang = this.lang;
        this.mainprops = props.mainprops;
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            treeWapper: new TreeWapper([]),
            treesearchorigin:{
                searchValue: undefined,
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
                expandedKeys:['root'],
                multiple: true,
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
                multiple: true,
                autoExpandParent: false,
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
            },
            incParent:{
                checked: true,
                onChange: (v) => {
                    this.state.incParent.checked = v;
                    this.setState(this.state);
                }
            },
            search:{
                defaultConditionsNum:2,
                oid:'-1',
                clickSearchBtn: (props,data,tyep,queryInfo) => {
                    this.loadTree( treedata => {
                        this.state.treeWapper.initData(treedata);
                        this.setState(this.state);
                    });
                }
            }
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show(editParam){
        this.state.modal.show = true;
        this.state.editParam = editParam;
        this.onFinish = editParam.onFinish;
        this.state.treesearchtarget.value = undefined;
        this.state.treesearchorigin.value = undefined;
        this.state.treesearchorigin.searchValue = undefined;
        this.state.treesearchtarget.searchValue = undefined;
        this.state.origin.selectedKeys = [];
        this.state.target.selectedKeys = [];
        this.state.treeWapper = new TreeWapper([]);
        this.setState(this.state, ()=>{
            this.loadTree((treedata) =>{
                this.state.treeWapper = new TreeWapper(treedata);
                this.setState(this.state);
            });
        });
    }

    loadTree(success){
        let searchVal = this.mainprops.search.getAllSearchData('searchaccounthand2') || {};
        let queryInfo = this.mainprops.search.getQueryInfo('searchaccounthand2',false);
        debugger;
        var param = {
                querycondition:searchVal,
                pagecode: this.mainprops.config.pagecode,  
                queryAreaCode:'searchaccounthand2',
                oid: queryInfo.oid || '' ,
                querytype:'tree',
                ...this.state.editParam
        };

        ajax({
            url: '/nccloud/uapbd/acctable/AccTableItemRef.do',
            data: this.state.editParam,
            data: param,
            success:(result)=> {
                success && success(result.data);
                // this.state.treeWapper = new TreeWapper(result.data);
                // this.setState(this.state, () => {
                //     var callback  = success || EMPTY_FN;
                //     callback();
                // });
            }
        });
    }


    rest(){
    }

    getData(){
        var data = {
            ...this.state.editParam,
            pk_account : this.state.treeWapper.getData()
        };
        return data;
    }

    onsubmit(){
        this.onFinish();
    }

    oncancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }

    render() {
        var {treeWapper,origin, target,treesearchorigin,treesearchtarget}  = this.state;
        var moveToTaget = () => {
            var  addMode =   this.state.editParam && this.state.editParam.mode == 'add' ;
            origin.selectedKeys.forEach(key => {
                treeWapper.moveRight(key, addMode/*this.state.incParent.checked*/, !addMode? true: this.state.incChild.checked, true);
            });
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRight('root', false, true, false );
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            var  addMode =   this.state.editParam && this.state.editParam.mode == 'add' ;
            target.selectedKeys.forEach(key =>{
                treeWapper.moveLeft(key, !addMode/*this.state.incParent.checked*/, addMode, true);
            });
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            treeWapper.moveLeft('root', false, true, false);
            this.setState(this.state);
        }

        var renderIncChild = () =>{
            var state =  this.state;
            return this.state.editParam && this.state.editParam.mode == 'add' ? <NCCheckbox {...this.state.incChild}>{this.lang['ACCCHART-000001']}</NCCheckbox> : ''/* 国际化处理： 包含下级*/
        };
        return (
            <NCModal zIndex={200} {...this.state.modal} className='acctiem-set-modal-table' field='modal'>
                <NCModal.Header>
                    <NCModal.Title>{this.lang['ACCCHART-000068']/* 国际化处理： 设置科目*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                {this.mainprops.search.NCCreateSearch('searchaccounthand2', this.state.search)}
                <div className = 'transfer_tree_container'>
                    <div className = 'left-area' style={{height:'350px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                        <div className = 'left-area-nei'>
                            <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['ACCCHART-000069']/* 国际化处理： 待选数据*/}</div>
                            <div style={{width:200,marginLeft:20,marginTop:10}}>
                                <NCFormControl {...this.state.treesearchorigin}/>
                            </div>
                            <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                                <div className='synctree-area'   style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                    <NCTree {...origin}>{treeWapper.renderNode(false, treesearchorigin.searchValue)}</NCTree>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className = 'right-area' style={{height:'350px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                        <div className = 'right-area-nei'>
                            <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.lang['ACCCHART-000070']/* 国际化处理： 已选数据*/}</div>
                            <div style={{width:200,marginLeft:20,marginTop:10}}>
                                <NCFormControl {...this.state.treesearchtarget}/>
                            </div>
                            <div  className="syncTreeCom" style={{height:'calc(100% - 70px)'}}>
                                <div className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                    <NCTree {...target}>{ treeWapper.renderNode(true, treesearchtarget.searchValue)}</NCTree>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex',justifyContent: 'center',height: 40,alignItems: 'center'}}>
                  {renderIncChild()}  
                </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton onClick={ this.onsubmit.bind(this) }>{this.lang['ACCCHART-000044']/* 国际化处理： 确定*/}</NCButton></span>
                    <span><NCButton onClick={ this.oncancel.bind(this) }>{this.lang['ACCCHART-000013']/* 国际化处理： 取消*/}</NCButton></span>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignAccItem;

//N/frgba6E2W96PojvrkdItmEtXpQmmGlUHvQC5FoltYHNmHGn3gVLJ5287BiVQsL