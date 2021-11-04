//i7TmLDdRNdG2+XQnktK7bXyoAn4adJTnWlqBUkmuVk5plnFIFZUw0OKLwFSymei+
import React, { Component } from 'react';
import {base,ajax, toast} from 'nc-lightapp-front';
import {component} from "../../../public/platwapper/index.js";
import '../../../public/uapbdstyle/uapbd_style_common.less';
const {NCCheckbox,NCTree,NCButton,NCDiv} = base;


let TreeWapper = function(){
    let datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: ''
        };
    this.initData =  function(ds,title){
        datas = ds;
        var loop =  (nodes) => {
            nodes.forEach(node => {
                dataMap[node.key] = node;
                root.title = title;
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
    let renderTittle = (item, newExpandkeys) => {
        let children = item.children || [],
            isLeaf = !children.length,
            isExpand = newExpandkeys.includes(item.key);
        let className = isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
        let titleInfo = <span><i style={{color: '#f2b224'}} className={className}/><span className='refer-tree-title' style={{margin:0,padding:0}}>{item.title}</span></span>
        return (
            <div>{titleInfo}</div>
        );
    }
    this.renderNode = (move = false, newExpandkeys) => {
        let expandedKeys = newExpandkeys;
        const loop = datas => datas.map((item) => {
            var children = item.children || [];
            // 鍒ゆ柇鏄惁 鏄彾瀛愯妭鐐�
            let itisLeaf = children.length == 0;
            return (<NCTree.NCTreeNode 
                liAttr={{fieldid:(item.code||item.name||item.refname||item.refpk)+"_node"}}
                switcherClass={children.length == 0 ? 'transferSwitcherClassSelfNameHidden':'transferSwitcherClassSelfNameShow'} title={renderTittle(item, expandedKeys)} key={item.key} isLeaf={itisLeaf}>{loop(children)}</NCTree.NCTreeNode>)
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

    var loopDirectChild = function(n,move = false){
        if(n.root){
            return;
        }
        n.children && n.children.forEach( n => {
            n.move = move;
        });
    }
    var loopLastChild = function(n,move =false){
        n.forEach( n => {
           if(n.children.length == 0){
               n.move = move;
           }else{
               loopLastChild(n.children);
           }
        });
    }
    this.moveRight  = function(nodeid, incParent = false, incChild = false, incSelf = true, incDirectChild = false,incLastChild = false){
        var curNode = dataMap[nodeid],
            move = true;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove([curNode] || [], move);
        if(incDirectChild)
            loopDirectChild(curNode|| [], move);
        if(incLastChild)
            loopLastChild(curNode.children|| [], move)
    };

    this.moveLeft = function(nodeid, incParent = false, incChild = false, incSelf = true,incDirectChild = false,incLastChild = false){
        var curNode = dataMap[nodeid],
            move = false;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove([curNode] ||[], move);
        if(incDirectChild)
            loopDirectChild(curNode|| [], move);
        if(incLastChild)
            loopLastChild(curNode.children|| [], move);
    };

    this.getData = function(){
        var ids = [],
            rootNode = dataMap['root'] ;

        var loopChild = function(nodes){
            nodes.forEach( n => {
                if(n.move)
                    ids.push(n.key);
                loopChild(n.children || []);
            });
        };
        !!rootNode && loopChild(rootNode.children || []);
        return ids;
    };
};

class DataSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json:props.json,
            treeWapper: new TreeWapper(),
            origin: {
                selectedKey: undefined,
                expandedKeys:['root'],
                autoExpandParent: false,
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand:(keys)=>{
                    this.state.origin.expandedKeys = keys;
                    this.setState(this.state);
                },

            },
            target: {
                selectedKey:undefined,
                expandedKeys:['root'],
                autoExpandParent: false,
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKey = selectedKeys[0];
                    this.setState(this.state);
                },
                onExpand:(keys)=>{
                    this.state.target.expandedKeys = keys;
                    this.setState(this.state);
                }
            },
            incChild:{
                checked: true,
                onChange: (v) => {
                    this.state.onlySelf.checked =false;
                    this.state.incChild.checked = v?v:true;
                    this.state.onlyLastChild.checked = false;
                    this.state.onlyDirectChild.checked = false;
                    this.setState(this.state);

                }
            },
            onlySelf:{
                checked:false,
                onChange:(v)=>{
                    this.state.onlySelf.checked =v?v:true;
                    this.state.incChild.checked = false;
                    this.state.onlyLastChild.checked = false;
                    this.state.onlyDirectChild.checked = false;
                    this.setState(this.state);

                }
            },
            onlyDirectChild:{
                checked:false,
                onChange:(v)=>{
                    this.state.onlySelf.checked =false;
                    this.state.incChild.checked = false;
                    this.state.onlyLastChild.checked = false;
                    this.state.onlyDirectChild.checked = v?v:true;
                    this.setState(this.state);

                }

            },
            onlyLastChild:{
                checked:false,
                onChange:(v)=>{
                    this.state.incChild.checked =false;
                    this.state.onlySelf.checked = false;
                    this.state.onlyDirectChild.checked = false;
                    this.state.onlyLastChild.checked = v?v:true;
                    this.setState(this.state);
                }
            },
            currentTitle:''

        };
    }
    // componentWillReceiveProps(nextProps){
    //     if(Object.keys(nextProps.json).length !== 0 ){
    //         this.state.json = nextProps.json;
    //         this.setState({
    //             json:nextProps.json
    //         })
    //     }
    // }
    initTreeData(checkOrg,url,title){
        ajax({
            url: url,
            data: {
                checkOrg:checkOrg
            },
            success:(res) => {
                let{success,data} = res;
                let treedata;
                if(success&&data){
                     treedata =data;
                    this.state.treeWapper.initData(treedata,title);
                    this.setState({
                        currentTitle:title
                    });
                }else{
                     treedata =[];
                    this.state.treeWapper.initData(treedata,title);
                    this.setState({
                        currentTitle:title
                    },()=>{
                        toast({color:'info',title:this.state.json['10100POST-000001']+title+this.state.json['10100POST-000002']});/* 鍥介檯鍖栧鐞嗭細 娌℃湁鏌ヨ鍒�,淇℃伅锛�*/
                    });
                }
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
            treeWapper.moveRight(origin.selectedKey, false, this.state.incChild.checked, this.state.onlySelf.checked,this.state.onlyDirectChild.checked,this.state.onlyLastChild.checked);
            this.setState(this.state);
        };

        var moveToTagetAll = () => {
            treeWapper.moveRight('root', false, true, false ,false,false);
            this.setState(this.state);
        };


        var moveToOrigin = () =>{
            treeWapper.moveLeft(target.selectedKey, false,this.state.incChild.checked, this.state.onlySelf.checked,this.state.onlyDirectChild.checked,this.state.onlyLastChild.checked);
            this.setState(this.state);
        };

        var moveToOriginAll = () =>{
            treeWapper.moveLeft('root', false, true, false,false,false);
            this.setState(this.state);
        }
        return (
            <div>
                <div className="transfer_tree_container" style={{height: 270}}>
                    <div className = 'left-area' style={{height:'270px',padding:'10px',width:'calc(50% - 25px)'}}>
                        <div className = 'left-area-nei nc-theme-transfer-wrap-bgc'>
                            <div style={{height:30,width:'100%',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.state.json['10100POST-000005']}</div>
                                <div  className="syncTreeCom" style={{height:'calc(100% - 45px)'}}>
                                    <NCDiv areaCode={NCDiv.config.TreeCom} fieldid = 'origin' className='synctree-area'  style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                        <NCTree
                                            showLine = {true}
                                            openIcon={<i  className="icon iconfont icon-shu_zk tree-swich"></i>}
                                            closeIcon={<i  className="icon iconfont icon-shushouqi tree-swich"></i>}
                                            {...origin}>{treeWapper.renderNode(false,origin.expandedKeys)}</NCTree>
                                    </NCDiv>
                                </div>
                        </div>
                    </div>
                    <div className = 'button-area' style={{paddingTop: 0,height: 270}}>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"dataselecttarget"} onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"dataselecttargetall"} onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton  fieldid={"dataselectorigin"} onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                        </div>
                        <div className="opr-botton opr-botton-trans">
                            <NCButton fieldid={"dataselectorginall"} onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                        </div>
                    </div>
                    <div  className = 'right-area' style={{height:'270px',padding:'10px',width:'calc(50% - 25px)'}}>
                        <div className = 'right-area-nei nc-theme-transfer-wrap-bgc' style={{border:'1px solid #d0d0d0',height:'100%'}}>
                            <div style={{height:30,width:'100%',margin: 0,paddingTop: 5,paddingLeft: 20}}>{this.state.json['10100POST-000006']}</div>{/* 鍥介檯鍖栧鐞嗭細 宸查�夋嫨鏁版嵁*/}
                            <div  className="syncTreeCom" style={{height:'calc(100% - 45px)'}}>
                                <NCDiv areaCode={NCDiv.config.TreeCom} fieldid = 'target' className='synctree-area'   style={{marginLeft:20,width:'calc(100% - 20px)'}}>{/* 鍥介檯鍖栧鐞嗭細 鏍戞帶浠�*/}
                                <NCTree
                                    showLine = {false}
                                    openIcon = {<i  className="icon iconfont icon-shu_zk tree-swich"></i>}
                                    closeIcon = {<i  className="icon iconfont icon-shushouqi tree-swich"></i>}
                                    {...target}>{treeWapper.renderNode(true,target.expandedKeys)}</NCTree>
                                </NCDiv>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%',height: 40,alignItems: 'center',justifyContent:'center',display: this.state.currentTitle == this.state.json['10100POST-000018'] ? 'none':'flex'}}>
                    <NCCheckbox {...this.state.incChild}>{this.state.json['10100POST-000007']}</NCCheckbox>{/* 鍥介檯鍖栧鐞嗭細 鍖呭惈鎵�鏈変笅绾�*/}
                    <NCCheckbox {...this.state.onlySelf}>{this.state.json['10100POST-000053']}</NCCheckbox>{/* 鍥介檯鍖栧鐞嗭細 浠呰嚜宸�*/}
                    <NCCheckbox {...this.state.onlyDirectChild}>{this.state.json['10100POST-000054']}</NCCheckbox>{/* 鍥介檯鍖栧鐞嗭細 浠呯洿鎺ヤ笅绾�*/}
                    <NCCheckbox {...this.state.onlyLastChild}>{this.state.json['10100POST-000055']}</NCCheckbox>{/* 鍥介檯鍖栧鐞嗭細 浠呮湯绾�*/}
                </div>
            </div>

        )
    }
}
export default DataSelect;

//i7TmLDdRNdG2+XQnktK7bXyoAn4adJTnWlqBUkmuVk5plnFIFZUw0OKLwFSymei+