//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage } from 'nc-lightapp-front';
class CCList extends Component{

    constructor(props){
        super(props);
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.props.config.json['10100CCG-000000'],/* 国际化处理： 成本中心*/
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.props.config.json['10100CCG-000000'],/* 国际化处理： 成本中心*/
            "refpk": "~"
		};
    }

    componentDidMount(){
        ajax({
            url:"/nccloud/uapbd/costcenter/loadtreedata.do",
            data:{ pk_org:this.props.config.pk_org,enablestate:'N' },
            success:(result)=>{
                    if(result.success&&result.data){
                        let data = [Object.assign( {...this.root} , {children : result.data} )];
                        //同步树  加载全部数据
                        this.props.syncTree.setSyncTreeData('cclist' , this.dealTreeData(data));
                        this.props.syncTree.openNodeByPk('cclist', this.root.refpk);
                    }
                }
            });
    }

    //处理树结构数据
	dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.beforeName=node.code?(node.code+'  '):'';
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

	//左侧树节点单击事件
    onSelectTree(refpk){
        let selectedNodeData = this.props.syncTree.getSelectNode('cclist');//获取选中节点的数据
        let cclistdata=[];
        
        if(refpk!='~'){//不是根节点数据
            cclistdata.push(refpk);
        }
        this.props.config.loadCCList(cclistdata);
    }

    //同部树选中事件，回调伏组件函数以生成子表表单数据
    onCheckEve(props,checkedKeys,{checked,checkedNodes,node,event}){
        //checkedNodes：[props:{refpk,refname,code}]
        let cclistdata=[];
        let addFlag;
        checkedNodes.forEach((node) => {
            //剔除相同元素
            addFlag=true;
            //剔除根节点数据；
            if(node.props.refpk=='~'){
                addFlag=false;
            }
            this.props.config.checkListPK.forEach((item)=>{
                if(item.value==node.props.refpk){
                    addFlag=false;
                }
            });
            if(addFlag){
                cclistdata.push(
                    node.props.refpk
                );
            }          
        });
        props.config.loadCCList(cclistdata);
    }

    render(){
        let {syncTree } = this.props;
        const {createSyncTree}=syncTree;
        return(
            <div className="nc-bill-card">
                <div className="tree-area" style={{border: 'none'}} >
                    {createSyncTree({
                        treeId :'cclist',
                        needEdit: false, //不启用编辑
                        showLine: true, //显示连线
                        needSearch: true, //是否需要搜索框
                        checkable:true,
                        onSelectEve: this.onSelectTree.bind(this),//选择
                        onCheckEve:this.onCheckEve.bind(this)  //复选框选中回调函数
                        //onSelectEve: this.onSelectTree.bind(this),//选择
                        //onMouseEnterEve:this.onMouseEnterEve.bind(this),
                        //showModal:false
                    })}		
                </div>		
            </div>
        )
    }
}

export default CCList = createPage({
})(CCList);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65