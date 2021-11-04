//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料按规则批改---列表
 * @author yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax,toast,createPageIcon,getMultiLang,base } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index'
const {NCDiv} = base;
var pagecodeValues = {};
var tableId = 'list';

var urls = {
    'queryBatchUpdateRuleTeamList' : "/nccloud/uapbd/batchupdaterule/queryBatchUpdateRuleTeamList.do",
    'delBatchUpdateRuleTeam':'/nccloud/uapbd/batchupdaterule/delBatchUpdateRuleTeam.do',
    'executeBatchUpRuleTeam':'/nccloud/uapbd/batchupdaterule/executeBatchUpRuleTeam.do'
}

let initTemplate = (props,modifierMeta,callback) => {
    props.createUIDom({
        pagecode : pagecodeValues.pagecode
    },(data)=>{
        data.button && props.button.setButtons(data.button);
        data.button && props.button.setPopContent(['DeleteLine'],props.MutiInit.getIntl("10140BURG") && props.MutiInit.getIntl("10140BURG").get('10140BURG-000000'));/* 国际化处理： 确认执行该操作吗？*/
        let meta = data.template;
        meta = modifierMeta(meta);
        props.meta.setMeta(meta);
        setTimeout(() => {
            callback();
        }, 0);
    });
}

class Batchupdaterule extends Component {
    constructor(props){
        super(props);
        this.config = props.config;
        pagecodeValues = this.config.pagecodeValues;
        //页面state
        this.state = {
            BusinessUnit : {},
            json:{}
        };
        initTemplate(this.props,this.modifierMeta,()=>{
            this.getlistData(false,false);
        });
    }

    componentWillMount(){
        let callback = (json) => {
            console.log(this.state.json);
            this.setState({json});
        }
        getMultiLang({moduleId: '10140BURG',domainName: 'uapbd',callback});
    }

    /**
     * 处理加工meta
     */
    modifierMeta = (meta) => {
        let opr = {
            attrcode: 'opr',
            key : 'opr',
            label: this.state.json['10140BURG-000001'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:200,
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index) => {
                return this.props.button.createOprationButton(
                    ['EditLine','DeleteLine'],
                    {
                        area:'list_line',
                        buttonLimit:3,
                        onButtonClick : (props,id) => {
                            switch (id){
                                case 'DeleteLine' ://行删除操作
                                    if(this.props.config.node_type === 'ORG_NODE' && record.pk_org.value !== this.state.BusinessUnit.refpk){
                                        toast({content:this.state.json['10140BURG-000046'],color:'danger',title:this.state.json['10140BURG-000005']});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                                        return;
                                    } 
                                    ajax({
                                        url : urls['delBatchUpdateRuleTeam'],
                                        data : {pk:record.pk_batchupruleteam.value,ts:record.ts.value},
                                        success : (res) => {
                                            let {success} = res;
                                            if(success){
                                                this.props.table.deleteTableRowsByIndex(tableId,index);
                                                toast({title:this.state.json['10140BURG-000002'],color:'success'});/* 国际化处理： 删除成功！*/
                                            }
                                        }
                                    });
                                    break;
                                case 'EditLine':
                                    if(this.props.config.node_type === 'ORG_NODE' && record.pk_org.value !== this.state.BusinessUnit.refpk){
                                        toast({content:this.state.json['10140BURG-000046'],color:'danger',title:this.state.json['10140BURG-000005']});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                                        return;
                                    } 
                                    props.pushTo('/card',{
                                        status:'edit',
                                        pagecode:this.props.config.pagecodecard,
                                        id : record.pk_batchupruleteam.value,
                                        refcode : this.state.BusinessUnit.refcode,
                                        refname : this.state.BusinessUnit.refname,
                                        refpk : this.state.BusinessUnit.refpk,
                                    });
                                    break;
                            }
                        }
                    }
                );
            }
        };
        meta[tableId].items.push(opr);
        return meta;
    }

    /**
     * 获取列表数据
     */
    getlistData = (isRefresh = false,showmsg=true) => {
        ajax({
            url : urls['queryBatchUpdateRuleTeamList'],
            data : {
                pagecode : pagecodeValues.pagecode,
                node_type : this.props.config.node_type,
                pk_org : this.state.BusinessUnit.refpk
            },
            success:(res) => {
                let {data,success} = res;
                if(success && data && data.list){
                    this.props.table.setAllTableData(tableId,data.list);
                    if(showmsg){
                        if(isRefresh){
                            toast({color:'success',title:this.state.json['10140BURG-000003']});/* 国际化处理： 刷新成功！*/
                        }else{
                            let sum = data.list.rows ? data.list.rows.length : 0;
                            if(sum === 0){
                                toast({content:this.state.json['10140BURG-000004'],color:'warning',title:this.state.json['10140BURG-000005']});/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
                            }else{
                                toast({content:this.state.json['10140BURG-000008'] + '，' + this.state.json['10140BURG-000009'] + sum + this.state.json['10140BURG-000010'] + '。',color:'success',title:this.state.json['10140BURG-000006']});/* 国际化处理： 查询成功,共,条数据,已成功！*/
                            }
                        }
                    }
                }
                this.updateButton();
            }
        })
    }

    /**
     * 更新按钮状态
     */
    updateButton = () => {
        let rows = this.props.table.getCheckedRows(tableId);
        let length = rows && rows.length > 0 ? rows.length : 0;
        let ruleTeamAdd = false;
        if(this.props.config.node_type === 'ORG_NODE' && (!this.state.BusinessUnit || !this.state.BusinessUnit.refpk)){
            ruleTeamAdd = true;
        }
        if(length === 0){
            this.props.button.setDisabled({
                execute : true,
                ruleTeamAdd : ruleTeamAdd,
                ruleTeamDel:true,
                listRefresh:false
            });
        }else if(length === 1){
            let pk_org = rows[0].data.values.pk_org.value;
            this.props.button.setDisabled({
                execute : !((this.props.config.node_type === 'ORG_NODE' && pk_org === this.state.BusinessUnit.refpk) || this.props.config.node_type === 'GROUP_NODE'),
                ruleTeamAdd : ruleTeamAdd,
                ruleTeamDel:!((this.props.config.node_type === 'ORG_NODE' && pk_org === this.state.BusinessUnit.refpk) || this.props.config.node_type === 'GROUP_NODE'),
                listRefresh:false
            });
        }else if(length > 1){
            this.props.button.setDisabled({
                execute : true,
                ruleTeamAdd : ruleTeamAdd,
                ruleTeamDel:true,
                listRefresh:false
            });
        }
    }

    /**
     * 按钮点击事件
     */
    onButtonClick = (props,id) => {
        switch(id){
            case 'execute' :
                let rows = this.props.table.getCheckedRows(tableId);
                if(!rows || rows.length === 0){
                    return ;
                }
                let pk_batchupruleteam = rows[0].data.values.pk_batchupruleteam;
                let ts = rows[0].data.values.ts;
                ajax({
                    url : urls['executeBatchUpRuleTeam'],
                    data : {pk:pk_batchupruleteam.value,ts:ts.value},
                    success : (res) => {
                        let {success} =res;
                        if(success) {
                            toast({title:this.state.json['10140BURG-000007'],color:'success'});/* 国际化处理： 执行成功！*/
                        }
                    }
                })
                break;
            case 'ruleTeamAdd' :
                this.props.pushTo('/card',{
                    status:'add',
                    pagecode:this.props.config.pagecodecard,
                    refcode : this.state.BusinessUnit.refcode,
                    refname : this.state.BusinessUnit.refname,
                    refpk : this.state.BusinessUnit.refpk,
                });
                break;
            case 'ruleTeamDel' :
                rows = this.props.table.getCheckedRows(tableId);
                if(!rows || rows.length === 0){
                    return ;
                }
                pk_batchupruleteam = rows[0].data.values.pk_batchupruleteam;
                ts = rows[0].data.values.ts;
                let rowId = rows[0].data.rowId;
                ajax({
                    url : urls['delBatchUpdateRuleTeam'],
                    data : {pk:pk_batchupruleteam.value,ts:ts.value},
                    success : (res) => {
                        let {success} = res;
                        if(success){
                            this.props.table.deleteTableRowsByRowId(tableId,rowId);
                            toast({title:this.state.json['10140BURG-000002'],color:'success'});/* 国际化处理： 删除成功！*/
                        }
                    }
                })
                break;
            case 'listRefresh' :
                this.getlistData(true);
                break;
        }
    }

    BusinessUnitChange = (value) => {
        this.setState({BusinessUnit:value},()=>{
            this.updateButton();
            if(value && value.refpk){
                this.getlistData();
            }
        });
    }

    /**
     * 双击行事件
     */
    onRowDoubleClick = (record,index) => {
        //record(行数据) ，index(当前index)
        this.props.pushTo('/card',{
            status:'browse',
            pagecode:this.props.config.pagecodecard,
            id : record.pk_batchupruleteam.value,
            refcode : this.state.BusinessUnit.refcode,
            refname : this.state.BusinessUnit.refname,
            refpk : this.state.BusinessUnit.refpk,
        });
    }

    /**
     * 渲染页面
     */
    render () {
        let { button, table,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let {createSimpleTable } = table;
        let { createButtonApp } = button;
        return (
            <div className="nc-bill-list">
                <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:this.state.json["10140BURG-000011"],/* 国际化处理： 批改规则*/
                            initShowBackBtn:false
                        })}
                    </div>
                    <div className="title-search-detail">
                        {this.props.config.node_type === 'ORG_NODE' && <BusinessUnitTreeRef
                            value = {this.state.BusinessUnit}
                            fieldid= {'BusinessUnitTreeRef'}
                            onChange = {this.BusinessUnitChange}
                        />}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
							area: 'list_head',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick, 
							popContainer: document.querySelector('.header-button-area')
	
						})}
                    </div>
                    </NCDiv>

                <div className="nc-bill-table-area">
                    {createSimpleTable(tableId, {
                        dataSource: this.config.datasource,
                        showCheck: true,
                        showIndex: true,
                        onRowDoubleClick : this.onRowDoubleClick,
                        selectedChange: ()=>{this.updateButton()},
                        onSelectedAll:()=>{this.updateButton()},
                        onSelected:()=>{this.updateButton()}
                    })}
                </div>
            </div>
        )
    }
}

Batchupdaterule = createPage({
    initTemplate: function(){},
    //mutiLangCode: '10140MATERIAL'
})(Batchupdaterule);
export default Batchupdaterule;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65