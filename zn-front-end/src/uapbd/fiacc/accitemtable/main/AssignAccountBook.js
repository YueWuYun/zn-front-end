//oU5FkDFBkmm9eqiPWaTy46t3KfgzLnWyKShyc9lOIWEWfsEKN5yAck/p65eP3ZDy
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep ,NCTree,NCRadio,NCFormControl} = base;
let { NCRadioGroup } = NCRadio;
var EMPTY_FN = function(){};
import Utils, {BaseUtils} from '../../../public/utils/index'




import Org from '../../../refer/org/GroupDefaultTreeRef/index.js';
class AssignAccountBook extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.config = props.config;
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'lg'
            },

            refOrg: {
                value: undefined,
                isMultiSelectedEnabled: false,
                onChange: (val) => {
                    this.state.refOrg.value = val;
                    this.state.search.value = undefined;
                    this.setState(this.state, () =>{
                        this.loadTree((datas) =>{
                            this.state.tree.datas = datas;
                            this.state.tree.expandedKeys = ['root'];
                            this.setState(this.state);
                        });
                    });
                }
            },
            search:{
                type:'search',
                value: undefined,
                onChange:(value) => {
                    this.state.search.value = value;
                    this.setState(this.state);
                },
                onSearch: () => {
                    this.loadTree((datas) =>{
                        this.state.tree.datas = datas;
                        this.state.tree.expandedKeys = ['root'];
                        this.setState(this.state);
                    });
                }
            },
            radioGroup:{
                name:'booktype',
                selectedValue: 'type',
                onChange: value => {
                    this.state.radioGroup.selectedValue = value;
                    this.setState(this.state, () =>{
                        this.loadTree((datas) =>{
                            this.state.tree.datas = datas;
                            this.state.tree.expandedKeys = ['root'];
                            this.setState(this.state);
                        });
                    });
                }
            },

    
            treecheckKeys: [],
            treecheckDatas: [],

            renderNodeTitle: (data) =>{
                return <span>{data.code}&nbsp;&nbsp;{data.title}</span>
            },

            renderNodeType:() => {
                var root = {
                    title: this.lang['ACCCHART-000071'],/* 国际化处理： 财务核算账簿*/
                    code: '',
                    key: 'root'
                };
                var loop = (datas, pnode) =>{
                    return datas.map( (data) => {
                        return (<NCTree.NCTreeNode title={this.state.renderNodeTitle(data)} key={data.key} isLeaf={ !data.children || data.children.length == 0 } disableCheckbox={!pnode || pnode.key == 'root'} nodeData={data.nodeData}>{loop(data.children || [], data)}</NCTree.NCTreeNode>)
                    });
                };
                var nodes = [{...root, children: this.state.tree.datas}];
                return loop(nodes, undefined);
            },

            renderNodeMain: ()=>{
                var loop = (datas, pnode) =>{
                    return datas.map( (data) => {
                        return (<NCTree.NCTreeNode title={this.state.renderNodeTitle(data)}  key={data.key} isLeaf={ !data.children || data.children.length == 0 } nodeData={data.nodeData}>{loop(data.children || [], data)}</NCTree.NCTreeNode>)
                    });
                };
                return loop( this.state.tree.datas, undefined);
            },

            tree: {
                checkable: true,
                checkStrictly: true,
                datas: [],
                autoExpandParent: false,
                expandedKeys:['root'],
                onCheck: (checkedKeys,  { checked, checkedNodes, node, event }) =>{
                    var treecheckKeys = this.state.treecheckKeys|| [];
                    if(checked){
                        treecheckKeys = [...treecheckKeys, checkedKeys.checked.filter(pk => treecheckKeys.indexOf(pk) == -1)] ;

                    }else{
                        treecheckKeys = treecheckKeys.filter(pk =>  checkedKeys.checked.indexOf(pk) == -1)
                    }
                    this.state.treecheckKeys = treecheckKeys;
                    this.setState(this.state);
                },
                onExpand:(expandedKeys, e) => {
                    this.state.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
            }
        }
    }

    loadTree(callback){
        var pk_group = this.state.refOrg.value && this.state.refOrg.value.refpk? this.state.refOrg.value.refpk: '-1';
        ajax({
            url: '/nccloud/uapbd/ref/AccountBookTreeRef.do',
            data: {
                queryCondition:{
                    isshow: true,
                    pk_group: pk_group,
                    treetype: this.state.radioGroup.selectedValue,
                    textValue: this.state.search.value,
                    isShowUsual: false,
                    disabledDataShow: false,
                    TreeRefActionExt:'nccloud.web.uapbd.acctable.action.AcctableAccountBoolOrgSQLBuilder',
                    pk_accchart: this.state.pk_accchart,
                    pk_accsystem:this.state.pk_accsystem
                }
             
            },
            success:(result)=> {
                callback && callback(result.data.datarows);
            }
        });
    }

    show(cfg,onfinish){
        this.state.modal.show = true;
        this.state.pk_accchart = cfg.pk_accchart;
        this.state.pk_accsystem = cfg.pk_accsystem;
        this.state.refOrg.queryCondition = () => {
            return {
                TreeRefActionExt:'nccloud.web.uapbd.acctable.action.AcctableAccountBookGroupSQLBuilder',
                pk_accchart: this.state.pk_accchart,
                pk_accsystem:this.state.pk_accsystem
            };
        };

        this.onfinish = onfinish;
        this.setState(this.state, ()=>{
            this.rest( () => {
                this.loadTree((datas) =>{
                    this.state.tree.datas = datas;
                    this.state.tree.expandedKeys = ['root'];
                    this.setState(this.state);
                });
            })
        });
        
    }
    rest(callback){
        this.state.radioGroup.selectedValue = 'type';
        this.state.refOrg.value = undefined;
        this.state.search.value = undefined;
        this.state.treecheckKeys = [];
        this.state.treecheckDatas = {};
        this.state.tree.datas = []
        this.setState(this.state, () => {
            callback && callback();
        });
    }

    getData(){
        var selDatas =  [],
            result = [],
            checkedKeys = this.state.treecheckKeys;

        var loop = (datas) =>{
            datas.forEach(e => {
                checkedKeys.forEach(d =>{
                    if(d == e.id){
                        selDatas.push(e)
                    }
                });
                loop(e.children || []);
            });
        }
        loop(this.state.tree.datas || []);
        result = selDatas.map(d => {
            return {
                org_accountingbook_code: d.nodeData.nodecode,
                org_accountingbook_name:d.nodeData.nodetitle,
                org_financeorg_code: d.nodeData.financeorgcode,
                org_financeorg_name: d.nodeData.financeorgname,
                pk_accountingbook:d.nodeData.pk_accountingbook
            };
        });
        return result;
    }

    onsubmit(){
        this.onfinish();
    }
    oncancel(){
        this.state.modal.show = false;
        this.setState(this.state, () =>{
            this.rest();
        });
    }

  
    render() {
        return (
            <NCModal zIndex={250} {...this.state.modal}>
                <NCModal.Header className='dnd-cancel'>
                    <NCModal.Title>
                        <div>
                            <div style={{display:'inline-block',verticalAlign: 'middle',marginTop:-5}}>{this.lang['ACCCHART-000071']/* 国际化处理： 财务核算账簿*/}</div>
                            <div style={{width: 200, paddingLeft: 10,display:'inline-block',verticalAlign: 'middle',marginTop:-5}}>{Org(this.state.refOrg)}</div>
                        </div>
                    </NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                <div className='accountBookGrid_wrap_neibu' style={{display:'flex',marginTop:10,justifyContent: 'flex-start',marginBottom:10}}>
                    <div style={{position: 'relative'}} className="icon-qingkong-hover-container">
                        <NCFormControl {...this.state.search}/>
                    </div>
                </div>
                <NCRadioGroup {...this.state.radioGroup}>
                        <NCRadio value="type">{this.lang['ACCCHART-000072']/* 国际化处理： 账簿类型*/}</NCRadio>
                        <NCRadio value="main">{this.lang['ACCCHART-000073']/* 国际化处理： 主账簿*/}</NCRadio>
                </NCRadioGroup>
                <div style={{height: 350,overflow: 'auto'}}>
                    <NCTree {...this.state.tree}>{this.state.radioGroup.selectedValue == 'type' ? this.state.renderNodeType(): this.state.renderNodeMain()}</NCTree>
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
export default AssignAccountBook;

//oU5FkDFBkmm9eqiPWaTy46t3KfgzLnWyKShyc9lOIWEWfsEKN5yAck/p65eP3ZDy