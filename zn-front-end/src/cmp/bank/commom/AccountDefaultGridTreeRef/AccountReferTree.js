/*wb6hAvIuL5NGP2ozhRp04qgN69Lmq3VEqygELrUYQeMUAZ21CkwPwAmAdyb/pZJL*/
import {Component} from 'react';
import { base ,ajax} from 'nc-lightapp-front';
import Utils,{BaseUtils} from "../../../../../src/uapbd/public/utils/index";
import classnames from 'classnames';
const {NCTree,NCFormControl:FormControl,NCDiv} =base;
import './index.less';
/***********************************************
 * 树组件
 * @author liupzhc
 * @date 2018-06-11
 * @version 1.0.0
 ***********************************************/
class NCC_HR_Tree extends Component{
    constructor(props){
        super(props);
        this.rootNode = Object.assign({
            refpk:'root',
            refname:this.props.multiLang['refer-001063'],/* 国际化处理： 根节点*/
            refcode:'root',
            show:true,
            key:'root',
            show:true
        },this.props.rootNode);
        this.state = {
            isMultiSelectedEnabled: this.props.isMultiSelectedEnabled || false,
            autoExpandParent: true,
            expandedKeys: this.props.expandedKeys || ['root','~'],//展开的节点
            oldExpandedKeys:this.props.expandedKeys || ['root','~'],
            checkedKeys: this.props.checkedKeys || [],//选中的节点
            selectedKeys: this.props.selectedKeys || [],
            defaultSelectedKeys: [],//指定选中的节点
            defaultExpandedKeys: [this.rootNode.refpk] || [], //默认展开的节点
            treeData: this.props.treeData,
            defaultCheckedKeys: this.props.defaultCheckedKeys || [],
            allTreeData:{},
            treeSearchVal:this.props.treeSearchVal || null,
            multiMode:this.props.multiMode || false,
            actExpandKeys:this.props.actExpandKeys || new Array()
        };
    }
    componentWillReceiveProps(newProps){
        let {expandedKeys} = this.state;
        this.state.multiMode = newProps.multiMode;
        this.state.checkedKeys = newProps.checkedKeys;
        this.state.treeData = newProps.allTreeData;
        this.state.selectedKeys = newProps.selectedKeys;
        this.state.expandedKeys = [...newProps.expandedKeys];
        this.state.treeSearchVal = newProps.treeSearchVal;
        this.setState(this.state);
    }
    /**********************************
     * 获得选中项
     * @returns {Array}
     **********************************/
    getSelectedTreeData =(keys)=>{
        if(!keys || keys.length == 0){
            return null;
        }
        var selectedTreeData = [];
        const loop = (data,key)=>{
            data.map((item)=>{
                if(item.refpk == key){
                    selectedTreeData.push(item);
                }
                if(item.hasOwnProperty('children') && item.children.length>0){
                    loop(item.children,key);
                }
            })
        }
        for(var i = 0;i<keys.length;i++){
            let treeData = this.state.treeData;
            loop(treeData,keys[i]);
        }
        return selectedTreeData;
    }
    getNeedExpandKeysByNodes = (nodes)=>{
        const getParentPks = (items)=>{
            let pids = [];
            for(let i = 0;i<items.length;i++){
                pids.push((items[i] && items[i].pid)? items[i].pid:'root');
            }
            return pids;
        }
        return getParentPks(nodes);
    }
    /**************************************
     * 检查选中节点是否是根或者第一级子目录
     * @param data
     * @returns {boolean}
     **************************************/
    isRootOrFirstSub = (data) =>{return data.pid == 'root' || data.refpk == 'root' || data.pid == '~' || data.refpk == '~';}
    isRoot = (data) =>{return data.refpk == 'root' || data.key == 'root';}
    isFirstSub =(data)=>{return data.pid == 'root' || data.pid =='~';}
    /**********************************
     * 树查询框值改变事件
     * @param textValue
     **********************************/
    onTreeSearchChange =(textValue)=>{
        let {setExpandedKeys} = this.props.listener;
        let expandedKeys = new Array();
        const loopsearch = (nodes = []) => {
            var parendExpand = false;
            (nodes || [] ).forEach(child => {
                var expand = loopsearch( child.children || [] );
                child.needExpand = textValue && textValue.length>0?expand:false;
                child.show = expand ? true: ((child.refcode && child.refcode.indexOf(textValue) != -1) || (child.refname && child.refname.indexOf(textValue)  != -1)? true: false);
                parendExpand = parendExpand ? parendExpand :child.show;
                expand && expandedKeys.push(child.refpk);
                if(expand && !expandedKeys.includes(child.pid)){
                    expandedKeys.push(child.pid);
                }
            });
            return parendExpand;
        }
        expandedKeys.push('root');
        let parendExpand = loopsearch(this.state.treeData || []);
        let selectKeys = this.props.isMultiSelectedEnabled ? this.state.checkedKeys:this.state.selectedKeys;
        if(!textValue || textValue.length == 0){
            let needExpandedKeys = new Array();
            const loop = (datas,pdata)=>{
                let parentExpand = false;
                datas.forEach(data=>{
                    var expand = loop(data.children || [],data );
                    if(expand || data && selectKeys.includes(data.refpk)){
                        parentExpand = true;
                    }
                });
                parentExpand && needExpandedKeys.push(pdata.refpk);
                return parentExpand;
            }
            loop(this.state.treeData,this.rootNode);
            expandedKeys = [...this.state.actExpandKeys,...needExpandedKeys];
        }
        setExpandedKeys && setExpandedKeys(expandedKeys,()=>{
            this.state.autoExpandParent = true;
            this.setState(this.state);
        });
    }
    /**********************************
     * 树节点展开事件
     * @param expandedKeys
     **********************************/
    onExpand(expandedKeys,node){
        if(node){
            if(node.expanded && !this.state.actExpandKeys.includes(node.node.props.eventKey)){
                this.state.actExpandKeys.push(node.node.props.eventKey);
            } 
            if(!node.expanded && this.state.actExpandKeys.includes(node.node.props.eventKey)){
                this.state.actExpandKeys = this.state.actExpandKeys.filter(key=>key!=node.node.props.eventKey);
            }  
        }
        let {setExpandedKeys} = this.props.listener;
        setExpandedKeys(expandedKeys,()=>{
            this.setState({autoExpandParent: false})
        })
    }

    checkIsHotKeyFire = ()=>{
        return window.event && ['keyCode','charCode','which'].find(e => window.event[e]);
    }
    /**********************************
     * 树节点选中事件
     * @param selectedKey
     * @param obj
     **********************************/
    onTreeNodeSelect(selectedKey,obj){
        if(!this.checkIsHotKeyFire()){
            if(!this.state.actExpandKeys.includes(obj.node.props.refpk)){
                this.state.actExpandKeys.push(obj.node.props.refpk);
            }else{
                this.state.actExpandKeys = this.state.actExpandKeys.filter(key=>key!=obj.node.props.refpk);
            }
            if(!this.state.expandedKeys.includes(obj.node.props.refpk)){
                this.state.expandedKeys.push(obj.node.props.refpk);
            }else{
                this.state.expandedKeys = this.state.expandedKeys.filter(key=>key!=obj.node.props.refpk);
            }
        }
        this.setState(this.state,()=>{
            if(obj.node.props.refpk == 'root' || obj.node.props.pid == 'root'){return;}
            let {setExpandedKeys,onTreeNodeSelect} = this.props.listener;
            setExpandedKeys(this.state.expandedKeys,()=>{
                let nodes = this.getSelectedTreeData(obj.node.props.refpk);
                this.state.selectedKeys = [obj.node.props.refpk];
                if(this.props.isMultiSelectedEnabled){//多选时有此操作
                    this.state.checkedKeys = this.state.multiMode?this.state.checkedKeys:obj.node.props.disableCheckbox?this.state.checkedKeys:[obj.node.props.refpk];
                }
                this.setState(this.state,()=>{onTreeNodeSelect && onTreeNodeSelect(this.state.selectedKeys,null,obj,this.state.checkedKeys);});
            })
        })
    }
    /**********************************
     * 树节点复选框选中事件
     * @param selectedKey
     * @param obj
     **********************************/
    onTreeNodeChecked(checkedKeys,obj){
        this.state.checkedKeys = checkedKeys.length == 0?[]:checkedKeys;
        this.state.selectedKeys = [obj.node.props.eventKey];//selectedKeys 是当前操作的节点
        this.state.multiMode = obj.checked?true:(checkedKeys.length>1?true:false);
        let {setExpandedKeys,setMultiMode,onTreeNodeChecked} = this.props.listener;
        setMultiMode(obj.checked,()=>{
            this.setState(this.state,()=>{onTreeNodeChecked && onTreeNodeChecked(checkedKeys,obj);
                // setExpandedKeys(this.state.expandedKeys,()=>{})
            });
        })
    }
    onTreeNodeDblClick(checkedKeys,{node,event}){
        //兼容只选择子节点
        if(this.props.onlyLeafCanSelect && node.props.children && node.props.children.length > 0){
            return false;
        }
        let {onTreeNodeDblClick} = this.props.listener;
        // onTreeNodeDblClick && onTreeNodeDblClick(checkedKeys,this.getSelectedTreeData([checkedKeys]));
        onTreeNodeDblClick && onTreeNodeDblClick(checkedKeys,{node,event});
    }
    /****************************************
     * 渲染节点标题
     ****************************************/
    renderFileTreeTitle = (item)=>{
        let className='refer-tree-point' ;
        if(item && item.hasOwnProperty('children')&& item.children.length >0){
            className = (this.state.expandedKeys.includes(item.refpk))?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
        }
        //高亮过滤值
        const index = item.refname.search(this.state.treeSearchVal);
        const beforeStr = item.refname.substr(0, index);
        let subIndex = (index!=-1?this.state.treeSearchVal.length:0);
        const afterStr = item.refname.substr(index + subIndex);
        let title = index>-1 && !this.isRootOrFirstSub(item)?(
            <span className='refer-tree-title'>
                {beforeStr}<span className="u-tree-searchable-filter" style={{color:'#E14C46'}}>{this.state.treeSearchVal}</span>{afterStr}
            </span>):(<span className='refer-tree-title'>{item.refname}</span>)
        return(<span><span className={className}/>{title}</span>)
    }
    render =()=> {
        const loop = data =>{
            let items = data.filter(node=>{return this.isRootOrFirstSub(node) || node.show});
           return items.map((item) => {
                var children = item.children || [];
                return <NCTree.NCTreeNode 
                    {...item} 
                    title={this.renderFileTreeTitle(item)}>
                    {children.length >0 && loop(children)}
                </NCTree.NCTreeNode>;
        })};
        let {setTreeSearchVal,popSearchTree} = this.props.listener;
        return [
            <NCDiv fieldid="projectname" areaCode={NCDiv.config.TREE}>
            <div className='refer-tree-header' style={{'border-right':'1px solid #d0d0d0','-webkit-box-sizing':'border-box','box-sizing':'border-box'}}>
                <div className='refer-search-table-input'>
                    <FormControl
                        fieldid="search"
                        className="search-input"
                        type="text"
                        value={this.state.treeSearchVal}
                        placeholder={this.props.multiLang['refer-001067']+this.props.refName/* 国际化处理： 搜索*/}
                        tabIndex={this.props.treeSearchInputTabIndex}
                        onKeyDown={this.props.onTreeSearchKeyDown()}
                        onChange={(v) => {
                                this.interval = new Date().getTime();
                                setTreeSearchVal && setTreeSearchVal(v,()=>{
                                    let s = setTimeout(() => {//停止输入0.5s后执行
                                        new Date().getTime() - this.interval >= 500 && popSearchTree && popSearchTree('',()=>{this.onTreeSearchChange(v);});
                                        clearTimeout(s);
                                    }, 500);
                                })
                            }}
                            ref ={(formControl)=>{this.FormControl = ReactDOM.findDOMNode(formControl);}}
                            onFocus={function () {
                                console.log('focus')
                            }}
                    />
                    <i className="refer-search-i iconfont icon-sousuo"/>
                    {this.state.treeSearchVal && (<i className="refer-del-i iconfont icon-qingkong"
                            onClick={() => {popSearchTree && popSearchTree('',()=>{setTreeSearchVal && setTreeSearchVal('',()=>{this.onTreeSearchChange(this.state.treeSearchVal);});});}}
                        />
                    )}
                </div>
            </div>,
            <NCDiv fieldid="projectname" areaCode={NCDiv.config.TreeCom}>
            <div className='refer-tree-wrapper' style={{'border-right':'1px solid #d0d0d0'}}>
                <div className='refer-tree-container'>
                    <NCTree
                        focusable = {true}
                        multiple={this.state.isMultiSelectedEnabled}                         //多选
                        checkable={this.state.isMultiSelectedEnabled}                        //多选时渲染复选框
                        showLine={true}
                        onExpand={this.onExpand.bind(this)}
                        defaultExpandedKeys={this.state.defaultExpandedKeys}                 //默认展开指定的节点
                        defaultCheckedKeys={this.state.defaultCheckedKeys || []}
                        expandedKeys={this.state.expandedKeys || []}                         //展开的节点
                        autoExpandParent={this.state.autoExpandParent}
                        selectedKeys={this.state.selectedKeys}
                        checkStrictly={true}
                        checkedKeys={this.state.checkedKeys || []}                           //选中的节点
                        onSelect={this.onTreeNodeSelect.bind(this)}
                        onCheck={this.onTreeNodeChecked.bind(this)}
                        onDoubleClick={this.onTreeNodeDblClick.bind(this)}
                        tabIndexValue = {this.props.tabIndex}
                        onKeyDown = {this.props.onTreeNodeKeyDown()}
                        ref={(tree)=>{this.AccountTree = tree;}}
                    >
                        {this.state.treeData && loop(this.state.treeData)}
                    </NCTree>
                </div>
            </div>
            </NCDiv>
            </NCDiv>
        ]
    }
}
export default NCC_HR_Tree

/*wb6hAvIuL5NGP2ozhRp04qgN69Lmq3VEqygELrUYQeMUAZ21CkwPwAmAdyb/pZJL*/