//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, {Component} from 'react';
import {base, ajax} from 'nc-lightapp-front';
import {component} from "../platwapper/index.js";
const {NCCheckbox,NCInput} = base;
const { NCTree,NCTable,NCButton } = component;
import '../uapbdstyle/uapbd_style_common.less'


/**
 *  客户快速分配，向导分配组织树组件
 */
class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: {
                main: this,
                defNodeCfg: {},
                checkedKeys:[],
                root: {
                    root: true,
                    id:'root',
                    key: 'root',
                    refpk:'root',
                    nodeData:{
                        code:'root',
                        orgclazz:'root'
                      },
                    name :this.props.json['orgselect-000000']/* 国际化处理： 组织*/,
                    title: this.props.json['orgselect-000000']/* 国际化处理： 组织*/,
                    refname:this.props.json['orgselect-000000']/* 国际化处理： 组织*/,
                },
                expandedKeys:['root'],
                datas: [],
                alldatas:[],
                renderNode: function (datas = [], parent) {
                    let renderFileTreeTitle = (item)=>{
                        let className,
                        isExpand = this.expandedKeys.includes(item.refpk);
                        if(item && item.hasOwnProperty('children') && item.children.length > 0){
                            className = isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian":"icon iconfont  icon-wenjianjia tree-wenjian";
                        }else{
                            className = "tree-dian";
                        }
                        if(item.pid == 'root'){
                            item.code = '';
                        }
                        return(
                            <div className={"title-con"}>
                                <i className={className}/>
                                <span className="title-middle">{
                                    item.key === 'root' ||
                                    item.key == 'BUSINESSUNIT00000000' ||
                                    item.key == 'CREDITCTLREGION00000' ||
                                    item.key == 'STUMEMBER_VIRTUALORG' ?
                                        item.title:(item.code +' '+item.refname)}
                                        </span>
                            </div>
                        )
                    };
                    let defNodeCfg = this.main.state.tree.defNodeCfg || {},
                        renderfn = function (data) {
                            //根节点和一级节点不可勾选
                            //data.disableCheckbox = data.root == true || data.nodeData.orgclazz == 'orgtype';
                            //根节点不可勾选
                            //data.disableCheckbox = data.root == true ;
                            return data;
                        },
                        loopRender = function (datas) {
                            return datas.map(function (item) {
                                let nodecfg = {...defNodeCfg, ...item},
                                    children = item.children || [];
                                return <NCTree.NCTreeNode
                                            {...(renderfn ? renderfn(nodecfg) : nodecfg)}
                                            className='node-item'
                                            liAttr={{fieldid:(item.code||item.name)+"_node"}}
                                            title={renderFileTreeTitle(item)}
                                            isLeaf={children.length == 0}
                                        >
                                        {children.length == 0 ? '' : loopRender(children, item, renderfn)}
                                        </NCTree.NCTreeNode>;
                            });
                        };
                    return loopRender([{...this.root, children: this.datas}]);
                },
                config: function () {
                    return {
                        checkable: true,
                        defaultExpandAll: true,
                        checkStrictly: true,
                        autoExpandParent : false,
                        onCheck: function (selectedKeys, e) {
                            let node = e.node.props,
                                checked = e.checked,
                                selectedData = this.main.state.selectData.datas,
                                data = {
                                    id: node.id || 'root',
                                    name: node.name || 'root',
                                    code: node.nodeData ? node.nodeData.code : 'root',
                                    orgclazz: node.nodeData?node.nodeData.orgclazz :'orgtype'
                                };
                            if(data.orgclazz === 'orgtype' || data.id ==='root'){
                                //如果选择的是组织类型节点
                                if(data.id !== 'root'){
                                    this.main.state.tree.datas.map((t)=>{
                                        if(t.id === node.id){
                                            this.main.getChildList([t],checked);
                                        }
                                    })
                                }else{
                                 //如果选择的是根节点
                                    this.main.getChildList(checked?[node]:selectedData,checked);
                                }
                            }else{
                                //如果选中非组织类型节点 且勾选包含所有下级
                                if(this.main.state.includeAllJunior.check){
                                    this.main.getChildList([node],checked);
                                }else{
                                    //没有勾选保安所有下级
                                    selectedData = checked ?
                                        selectedData.concat(data) :
                                        selectedData.filter((n) => n.id != data.id);
                                    this.main.state.selectData.datas = selectedData;
                                    this.main.setState(this.main.state);
                                }
                            }
                        }.bind(this)
                    }
                }
            },
            table: {
                main: this,
                rowKey: 'id',
                fielid:'lefttable',
                columns: [{
                    title: this.props.json['orgselect-000001'],/* 国际化处理： 组织编码*/
                    dataIndex: 'code',
                    width: '40%'
                }, {
                    title: this.props.json['orgselect-000002'],/* 国际化处理： 组织名称*/
                    dataIndex: 'name',
                    width: '40%'
                }, {
                    title: this.props.json['orgselect-000003'],/* 国际化处理： 操作*/
                    dataIndex: 'doit',
                    width: '20%',
                    render: function (text, record, index) {
                        let delFn = function () {
                            let datas = this.state.selectData.datas;
                            this.state.selectData.datas = datas.filter((data) => data.id != record.id);
                            this.setState(this.state);
                        };
                        return (<NCButton onClick={delFn.bind(this)}>{this.props.json['orgselect-000006']}</NCButton>);{/* 国际化处理： 删除*/}
                    }.bind(this)
                }]
            },
            selectData: {
                datas: []
            },
            checkedAll:{
                check:false
            },
            isChild:true,

        };
    }

    reset() {
        ajax({
            url: '/nccloud/uapbd/customer/assignTree.do',
            data: {
                orgtypeIDs: ['SALEORGTYPE000000000', 'FINANCEORGTYPE000000', 'CREDITCTLREGION00000'],
                isCludeGlobalAndGroupVO: false
            },
            success: (res) => {

                let treedata = res.data;
                this.state.selectData.datas = [];
                this.state.tree.datas = treedata;
                let array = [this.state.tree.root].concat(this.treeToList(treedata,new Array()));
                    array && array.length>0 && array.forEach(node=>{
                        if(node.pid && node.pid!='root' && node.code){
                            node.refname = node.code+"  "+node.name;
                        }
                        if(node.pid == 'root' || node.id =='root'){
                            delete node.code;
                        }
                        //this.state.treeDatas.set(node.refpk,node);
                    })
                this.props.props.syncTree.setSyncTreeData('customerdistrib',[Object.assign(this.state.tree.root,{children:treedata})]);
                this.props.props.syncTree.setNodeChecked("customerdistrib","")
                this.state.tree.alldatas = treedata;
                this.setState(this.state);
                this.expandFirstNode( [Object.assign(this.state.tree.root,{children:treedata})],"customerdistrib",this);
            }
        });
    }
    expandFirstNode = (treeData, id, that) => {
        if(!treeData || !id || !that) return ;
    
        let pks = [];
        treeData.map( (item, index) => {
            if(item && item.key) {
                pks.push(item.key);
            }
        })
        that.props.props.syncTree.openNodeByPk(id, pks)
        return ;
    }
    treeToList = (data, list = []) => {
        if (Array.isArray(data)) {
            data.forEach((e) => {
                list.push(e);
                if (e && e.hasOwnProperty('children') && e.children.length>0 ) {
                    this.treeToList(e.children, list);
                }
            });
            return list;
        } else {
            return false;
        }
    }
     /**
     * 展开图标替换
     * @param selectedKeys 选中keys
     * @param e 
     */  
    openIcon = () => {
        return (
            <i
            className="icon iconfont icon-shu_zk tree-swich"
        />
        )
    } 

    closeIcon=()=>{
        return(
        <i
            className="icon iconfont icon-shushouqi tree-swich"
        />
        )}

        /**
     * 树节点展开事件
     */
    onTreeNodeExpand = (expandedKeys)=>{
        this.state.tree.expandedKeys = expandedKeys;
        this.setState(this.state);
    }

    onTreeNodeChecked(props,checkedKeys, e){
        let resultKeys = checkedKeys;//this.getCheckedKeys(checkedKeys,e);
      //设置勾选中的树节点
      this.state.tree.checkedKeys = checkedKeys.length == 0?[]: resultKeys;
      this.state.tableDatas = [];
      //setState
      this.setState(this.state,this.resetTableData.bind(this,this.state.tree.checkedKeys, e));
    }

    /**
     * 重置表格数据
     */
    resetTableData = (checkedKeys, e)=>{
        debugger
        let result = new Array();
        const getItem = (data,pks,result = [])=>{
            data.forEach(item=>{
                if(pks.includes(item.refpk)){
                    result.push({
                        id:item.id,
                        name:item.name,
                        code:item.nodeData.code,
                        nodeData:item.nodeData,
                        refpk:item.id,
                        refname:item.name
                    });
                }
                if(item.hasOwnProperty('children') && item.children.length>0 ){
                    getItem(item.children,pks,result);
                }
            })
            return result;
        }
        let tableDatas = getItem(this.state.tree.datas,checkedKeys,new Array());
        tableDatas = tableDatas.filter(d => {return d.nodeData && (d.root || d.nodeData.orgclazz != 'orgtype')})
        this.state.selectData.datas=tableDatas;
        this.setState({tableDatas, selectData: this.state.selectData})
    }

    getData() {
        let returndata = []
        this.state.selectData.datas.map((n)=>{
            if(n.orgclazz !== 'orgtype'){
                returndata.push(n.id)
            }
        });
        return returndata;
    }
    //选择所有
    onCheckAll = (c) => {
        this.getChildList(this.state.tree.datas,c);
        this.setState({
            checkedAll:{
                check:c
            }
        })

    }
    //包含所有下级
    onCheckAllJunior = (c) => {
        this.setState({
            includeAllJunior:{
                check:!c
            }
        });
    }
    // 树的展开的回调函数
    onExpandFn=(keys)=>{
        this.state.tree.expandedKeys = keys;
        this.setState(this.state);
    }
    /**
     * 递归获取所有儿子节点
     * @param array
     * @param checked
     * array 可以是树的node 也可以是树的原始数据
     */
    getChildList = (array,checked)=>{
        let me = this;
        for(let i = 0 ; i<array.length ;i++){
             let t = array[i];
             if(checked){
                 me.state.selectData.datas.push({
                     id: t.id || t.props && t.props.id || 'root',
                     name: t.name || t.props && t.props.name || 'root',
                     code: t.nodeData ? t.nodeData.code : t.props ? t.props.nodeData.code :'root',
                     orgclazz: t.nodeData ? t.nodeData.orgclazz : t.props ? t.props.nodeData.orgclazz :'orgtype'
                 });
             }else{
                 if(t.id){
                     me.state.selectData.datas = me.state.selectData.datas.filter((i) => i.id != t.id)
                 }else if(t.props ){
                     me.state.selectData.datas = me.state.selectData.datas.filter((i) => i.id != t.props.id)
                 }else{
                     t.cheked = checked
                 }
             }
            if(t.children instanceof  Array && t.children.length> 0
                ||t.props && t.props.children instanceof  Array && t.props && t.props.children.length>0 ){
                me.getChildList(t.children || t.props && t.props.children,checked);
            }else{
                continue;
            }
        }
        me.setState(me.state);
}

    selNode = (data, item, info) => {
        if(item){
            this.props.props.syncTree.setNodeChecked(item.id,item.refpk);
        }
   
  }
    render() {
        let {DragWidthCom,syncTree} = this.props.props;
        let {createSyncTree} = syncTree;
        let {tree,table} = this.state;
        let  selectDatas = this.state.selectData.datas.filter((n) => n.orgclazz !== 'orgtype');
        let  checkedKeys = this.state.selectData.datas.map((d) => d.id);
            return (
                <div className = 'transfer_tree_container' style={{marginTop: 10}}>
                <div className = 'left-area nc-theme-transfer-wrap-bgc' style={{height:'450px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                    <div className = 'left-area-nei nc-theme-transfer-list-body-bgc'>
                        <div  className="syncTreeCom" style={{marginLeft: 20,height:'calc(100% - 40px)'}}>
                            <div className='synctree-area' style={{marginTop:'10px',marginTop:'10px'}}>{/* 国际化处理： 树控件*/}
                            
                                {createSyncTree({
                                treeId: "customerdistrib",
                                showLine: true,
                                checkable: true,
                                needEdit:false ,
                                onSelectEve:this.selNode,
                                onCheckEve: this.onTreeNodeChecked.bind(this),   //选择节点回调方法
                                openIcon:this.openIcon,
                                closeIcon:this.closeIcon,
                                defaultExpandAll:false,
                                checkStrictly:this.state.isChild, //false 勾选下级
                                onTreeExpand:this.onTreeNodeExpand,
                                searchType:'filtration',
                            })}

                                {/* <NCTree
                                    closeIcon={<i  class="icon iconfont icon-shushouqi tree-swich"></i>}
                                    openIcon={<i  class="icon iconfont icon-shu_zk tree-swich"></i>}
                                    onExpand={this.onExpandFn}
                                    expandedKeys={this.state.tree.expandedKeys}
                                    {...tree.config()} {...{checkedKeys: checkedKeys}}>
                                    {tree.renderNode()}
                                </NCTree> */}
                            </div>
                        </div>
                        <div style={{marginTop: 10}}>
                            {/*<span style={{textAlign: 'left', marginBottom: '8px'}}><NCCheckbox*/}
                                {/*checked = {this.state.checkedAll.check} onChange={this.onCheckAll.bind(this)}>选择所有</NCCheckbox></span>*/}
                            <span style={{textAlign: 'left', marginBottom: '8px'}}><NCCheckbox
                                checked={!this.state.isChild} onChange={(value)=>{this.state.isChild=!value;this.setState(this.state)}}>{this.props.json['orgselect-000007']}</NCCheckbox></span>{/* 国际化处理： 包含所有下级*/}
                        </div>
                    </div>
                </div>
                <div className = 'right-area nc-theme-transfer-wrap-bgc' style={{marginLeft:30,height:'450px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)',overflow:'hidden'}}>
                    <NCTable {...table} data={selectDatas} {...{
                        bodyStyle: {'overflow-y': 'auto', height: '390px'},
                        useFixedHeader: true
                    }}></NCTable>
                </div>
            </div>
        )
    }
}

export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS