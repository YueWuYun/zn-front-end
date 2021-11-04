//dV5zdT0++RlNbIUiI4eOQChlluzpxAhAvWExpad6egV2hH50KJo65t0Gq2t1y2qi
import React, { Component } from "react";
import { createPage, ajax, base ,toast ,print} from 'nc-lightapp-front';
import AccSystem from "../../../refer/fiacc/AccSystemGridRef";
import '../../../public/uapbdstyle/uapbd_style_common.less'
let treeId = 'fds';
const {NCButton,NCRow,NCCol,NCTabs,NCTabPane}=base;

/**
 *科目表使用情况查询 
 **/
class AccountUseage extends Component{
    constructor(props) {
        super(props);
        
        this.state={
            ...this.props,
            curAccSystem : {},//当前选中的科目体系参照；
            json : props.config.json,  //多语
            inlt : props.config.inlt
        }
    }

    componentDidMount() {
        this.loadTreeData('111');
    }

    onSysChange(value){//科目体系参照变化
        this.setState(
            {curAccSystem : value},
            () => {
                this.loadTreeData(value.refpk);
            }
        );
    }

    /**
     * 加载树节点数据
     */
    loadTreeData(pk, callback){
        ajax({
            url:'/nccloud/uapbd/accsystem/AccChartsUsingAction.do',
            data:{pk:pk},
            success:(result)=>{
                if(result.success){
                    if(!result.data || result.data.length==0){
                        this.props.button.setButtonDisabled(['usePrint'], true);
                    }else{
                        this.props.button.setButtonDisabled(['usePrint'], false);
                    }
                    let title = this.state.curAccSystem['refname']?this.state.curAccSystem['refname']:this.state.json['10140ACCSB-000003'];/* 国际化处理： 基准科目体系*/
                    //自定义根节点
                    let root = {
                        "isleaf": false,
                        "key":"~",
                        "title": title,
                        "id":"~",
                        "innercode":"~",
                        "pid": "",
                        "refname": title,
                        "refpk": "~"
                    };
                    let data = [Object.assign( {...root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, root.refpk);
                    
                    callback && callback();
                }
            }
        });
    }

    /**
     * 处理树数据
     */
    dealTreeData(data){
        let deleteDataChildrenProp = (node) => {
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }else{
                node.isLeaf = false;
                this.px(node);
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            e.iconBox = {
                editIcon:false,
                addIcon:false,
                delIcon:false
            };
            deleteDataChildrenProp(e);
        });
        return data;
    }

    //根据innercode大小排序
    px(node){
        let compare = (property) => {
            return (a,b) => {
                let type1 = a['nodeData']['type'];
                let type2 = b['nodeData']['type'];
                if(type1!=type2){
                    return type1 - type2;
                }
                let value1 = a[property];
                let value2 = b[property];
                return value1 - value2;
            }
        }
        if(!node || node.isLeaf || !node.children) return;
        node.children.sort(compare('innercode'));
    }

    
    refresh(){
        if(this.state.curAccSystem && this.state.curAccSystem['refpk']){
            this.loadTreeData(this.state.curAccSystem['refpk'], () => {
                toast({ color: 'success', title: this.state.json['10140ACCSB-000004'] });/* 国际化处理： 刷新成功！*/
            });
        }else
            toast({ color: 'success', title: this.state.json['10140ACCSB-000004'] });/* 国际化处理： 刷新成功！*/
    }

    //打印
    print(){
		let pks=[this.state.curAccSystem['refpk']];
        let param={
            funcode : '10140ACCSB',
            nodekey : 'accchartqryprint',  //模板节点标识
            oids : pks
        };
		print(
			'pdf',
			'/nccloud/uapbd/accsystem/AccQueryInfoPinrtAction.do',
			param
		);
    }

    onButtonClick(props, id){
        if(id==='usePrint'){
            this.print()
        }else if(id==='useRefresh'){
            this.refresh()
        }
    }

    render(){

        const {syncTree} = this.state;
        const {createSyncTree} = syncTree;
        const { button} = this.props;
        const {createButtonApp}=button;

        return(
            <div className="nc-single-table nc-single-table-add-new nc-theme-gray-area-bgc">
                {/* 头部 header */}
                <div className="nc-theme-area-bgc nc-singleTable-header-area" style={{height: 40}}>
                    <div className="header-title-search-area">
                        <div className="search-box">
                            {AccSystem({
                                onChange:this.onSysChange.bind(this),
                                value:this.state.curAccSystem,
                            })}
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'useCard',
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                    </div>
                </div>
                {/* 列表区 */}
                <div className="nc-theme-area-bgc uapbd_style_scroll_container">
                    <div>
                        <div className="nc-singleTable-table-area">
                            <div style={{height: '50%',overflow: 'auto',maxHeight: 350,display: 'block'}}>
                                {createSyncTree({
                                    treeId : treeId,
                                    showLine: true, //显示连线
                                    needEdit: false, //不启用编辑
                                    showModal: false,
                                    needSearch: false //是否需要搜索框
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default AccountUseage

//dV5zdT0++RlNbIUiI4eOQChlluzpxAhAvWExpad6egV2hH50KJo65t0Gq2t1y2qi