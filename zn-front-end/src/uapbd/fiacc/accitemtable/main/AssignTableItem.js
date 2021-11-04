//LrCGg8zjJFE8Q6LXL6cza6LYSPaDb0/4kDc53JLoe7rG+Y750iQgyc6GXg83H27q
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep,NCTree } = base;
var EMPTY_FN = function(){};

var TreeWapper = function(ds){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: this.json['INOUTBUSICLASS-000067']/* 国际化处理： 会计科目*/
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

    this.renderNode = (move = false) => {
        const loop = datas => datas.map((item) => {
            var children = item.children || [];
            return (<NCTree.NCTreeNode title={item.title} key={item.key} isLeaf={children.length == 0}>{loop(children)}</NCTree.NCTreeNode>)
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

    var loopParentMove = function(n, move = false){
        var pid   = n.pid,
            pnode =  dataMap[pid] || root;
        if(pnode.root)
            return;
        pnode.move = move;
        loopParentMove(pnode);
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
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            treeWapper: new TreeWapper(),
            origin: {
                selectedKey:undefined,
                autoExpandParent: false,
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                }
            },
            target: {
                selectedKey:undefined,
                autoExpandParent: false,
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKey = selectedKeys[0];
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
                checked: false,
                onChange: (v) => {
                    this.state.incParent.checked = v;
                    this.setState(this.state);
                }
            }
        }
    }

    show(editParam){
        this.state.modal.show = true;
        this.state.editParam = editParam;
        this.onFinish = editParam.onFinish;
        this.setState(this.state, ()=>{
            this.loadTree();
        });
    }

    loadTree(success){
        ajax({
            url: '/nccloud/uapbd/acctable/AccTableItemRef.do',
            data: this.state.editParam,
            success:(result)=> {
                debugger;
                this.state.treeWapper = new TreeWapper(result.data);
                this.setState(this.state, () => {
                    var callback  = success || EMPTY_FN;
                    callback();
                });
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
        debugger;
        this.onFinish();
    }

    oncancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }

    render() {
        var treeWapper = this.state.treeWapper,
        origin  = this.state.origin,
        target  = this.state.target;

        var moveToTaget = () => {
            treeWapper.moveRight(origin.selectedKey, this.state.incParent.checked, this.state.incChild.checked, true);
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRight('root', false, true, false );
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            treeWapper.moveLeft(target.selectedKey, this.state.incParent.checked, this.state.incChild.checked, true);
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            treeWapper.moveLeft('root', false, true, false);
            this.setState(this.state);
        }

        return (
            <NCModal zIndex={250} {...this.state.modal} fieldid='state'>
                <NCModal.Header>
                    <NCModal.Title>this.json['INOUTBUSICLASS-000080']</NCModal.Title>/* 国际化处理： 批量分配*/
                </NCModal.Header>
                <NCModal.Body>
                <NCRow md={12} xs={12} sm={12}>
                    <NCCol md={5} xs={5} sm={5}>
                        <div>this.json['INOUTBUSICLASS-000069']</div>/* 国际化处理： 待选数据*/
                        <NCTree {...origin}>{treeWapper.renderNode(false) }</NCTree>
                    </NCCol>
                    <NCCol md={2} xs={2} sm={2}>
                        <NCButton fieldid='movetotarget'    onClick={moveToTaget.bind(this)}>this.json['INOUTBUSICLASS-000076']</NCButton>   /* 国际化处理： 添加*/
                        <NCButton fieldid='movetotargetall' onClick={moveToTagetAll.bind(this)}>this.json['INOUTBUSICLASS-000077']</NCButton>   /* 国际化处理： 添加全部*/
                        <NCButton fieldid='movetoorigin'    onClick={moveToOrigin.bind(this)}>this.json['INOUTBUSICLASS-000021']</NCButton>   /* 国际化处理： 删除*/
                        <NCButton fieldid='movetooriginall' onClick={moveToOriginAll.bind(this)}>this.json['INOUTBUSICLASS-000078']</NCButton>/* 国际化处理： 删除全部*/
                    </NCCol>
                    <NCCol md={5} xs={5} sm={5}>
                        <div>this.json['INOUTBUSICLASS-000070']</div>/* 国际化处理： 已选数据*/
                        <NCTree {...target}>{treeWapper.renderNode(true)}</NCTree>
                    </NCCol>
                </NCRow>
                <NCRow md={12} xs={12} sm={12}>
                    <NCCheckbox fieldid='incchild'{...this.state.incChild}>this.json['INOUTBUSICLASS-000001']</NCCheckbox>/* 国际化处理： 包含下级*/
                </NCRow>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton className='button-primary' fieldid='submit'  onClick={ this.onsubmit.bind(this) }>this.json['INOUTBUSICLASS-000044']</NCButton></span>/* 国际化处理： 确定*/
                    <span><NCButton fieldid='cancel'   onClick={ this.oncancel.bind(this) }>this.json['INOUTBUSICLASS-000013']</NCButton></span>/* 国际化处理： 取消*/
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignAccItem;

//LrCGg8zjJFE8Q6LXL6cza6LYSPaDb0/4kDc53JLoe7rG+Y750iQgyc6GXg83H27q