//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
class CCDept extends Component{

    constructor(props){
        super(props);
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.props.config.json['10100CC-000029'],/* 国际化处理： 部门（所有）*/
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.props.config.json['10100CC-000030'],/* 国际化处理： 部门*/
            "refpk": "~"
		};
        this.state={
			curOrg:{pk_org:this.props.config.pk_org,name:this.props.config.name},
		}
    }

    componentDidMount(){
        this.onOrgChanged({refpk:this.state.curOrg.pk_org,refname:this.state.curOrg.name});
    }

    //处理树结构数据
	dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.beforeName=node.code?(node.code+'  '):'';
            //node.beforeName=node.code;
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

    //主组织参照切换事件
    onOrgChanged(value){
        this.setState({
            curOrg:{pk_org:value.refpk,name:value.refname},
        })
        ajax({
            url:"/nccloud/baseapp/dept/treeQuery.do",
            data:{pk_org:value.refpk,enablesstate:'N'},
            success:(result)=>{
                if(result.success){
                    if(result.data){
                        let data = [Object.assign( {...this.root} , {children : result.data} )];
                        //同步树  加载全部数据
                        this.props.syncTree.setSyncTreeData('ccdept' , this.dealTreeData(data));
                        this.props.syncTree.openNodeByPk('ccdept', this.root.refpk);
                    }else{
                        this.props.syncTree.setSyncTreeData('ccdept' , []);
                    }
                }
                }
            });
    }

	//左侧树节点单击选中事件
    onSelectTree(refpk){
        let ccdeptsData=[];
        let selectedNodeData = this.props.syncTree.getSelectNode('ccdept');//获取选中节点的数据
        if(refpk!='~'){//不是根节点数据
            ccdeptsData.push({
                rowid:null,
                status:'2',
                values:{
                    pk_dept:{
                        display:selectedNodeData.refname,
                        value:selectedNodeData.refpk
                    },
                    "pk_dept.code":{
                        display:selectedNodeData.code,
                        value:selectedNodeData.code
                    },
                    "pk_dept.pk_org":{
                        display:this.state.curOrg.name,
                        value:this.state.curOrg.pk_org
                    },
                    status:{
                        display:this.props.config.json['10100CC-000031'],/* 国际化处理： 新增*/
                        value:2
                    }
                }
            });
        }
        this.props.config.loadDept(ccdeptsData);
        ccdeptsData = [];
    }

    //同部树选中事件，回调伏组件函数以生成子表表单数据
    onCheckEve(props,checkedKeys,{checked,checkedNodes,node,event}){
        //checkedNodes：[props:{refpk,refname,code}]
        let ccdeptsData=[];
        let addFlag;
        checkedNodes.forEach((node) => {
            //剔除相同元素，剔除根节点数据
            addFlag=true;
            if(node.props.refpk=='~'){
                addFlag=false;
            }
            this.props.config.checkDeptPK.forEach((item)=>{
                if(item.value==node.props.refpk){
                    addFlag=false;
                }
            });
            if(addFlag){
                ccdeptsData.push({
                    rowid:null,
                    status:'2',
                    values:{
                        pk_dept:{
                            display:node.props.refname,
                            value:node.props.refpk
                        },
                        "pk_dept.code":{
                            display:node.props.code,
                            value:node.props.code
                        },
                        "pk_dept.pk_org":{
                            display:this.state.curOrg.name,
                            value:this.state.curOrg.pk_org
                        },
                        status:{
                            display:this.props.config.json['10100CC-000031'],/* 国际化处理： 新增*/
                            value:2
                        }
                    }
                });
            }          
        });
        props.config.loadDept(ccdeptsData);
    }

    render(){
        let {syncTree } = this.props;
        const {createSyncTree}=syncTree;
        let orgPermCondition=function(){
            return {
                AppCode:"10100CC",
                TreeRefActionExt: 'nccloud.web.action.PrimaryOrgSQLBuilder,nccloud.web.uapbd.costcenter.action.CostCenterSqlBuilder'
            }
		}
        return(
            <div /*className="nc-bill-card"*/>
                <div className="search-box" style={{width:'240px',marginBottom:'10px'}} fieldid = 'ccdept_search'>
                    {BusinessUnitTreeRef({
                            //fieldValued:
                        fieldid : 'BusinessUnitTreeRef',
                        disabled:false,
                        isTreelazyLoad:false,
                        onChange:this.onOrgChanged.bind(this),
                        value:{
                            refpk:this.state.curOrg.pk_org,
                            refname:this.state.curOrg.name
                        }
                    })}
                </div>
                <div className="tree-area"  fieldid = 'ccdept_tree'>
                    {createSyncTree({
                        treeId :'ccdept',
                        needEdit: false, //不启用编辑
                        showLine: true, //显示连线
                        needSearch: true, //是否需要搜索框
                        checkable:true,
						onSelectEve: this.onSelectTree.bind(this),//选择
                        onCheckEve:this.onCheckEve.bind(this)  //复选框选中回调函数
                    })}		
                </div>		
            </div>
        )
    }
}

export default CCDept = createPage({
})(CCDept);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65