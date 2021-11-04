//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ
import React, { Component } from 'react';
import {  base,ajax,toast } from 'nc-lightapp-front';
let { NCTable,NCSelect, NCButton,NCCol,NCRow, NCModal, NCCollapse } = base;
import OrgSelect  from './OrgSelect';

var EMPTY_FN = function(){};
class AssignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            orgValues : [],
            materialIDs : [],
            isCancelAssign : false

        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show = (ids,isCancelAssign) => {
        this.state.modal.show = true;
        this.state.materialIDs = ids;
        this.state.isCancelAssign = !!isCancelAssign;
        this.setState(this.state);

    }

    onsubmit = () => {
        let selectOrgValues = this.orgSelect.getData();
        if(!selectOrgValues || selectOrgValues.length < 1){
            toast({content: this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3011')/* 国际化处理： 请选择组织*/,color:'warning'});
            return;
        }
        ajax({
            url : "/nccloud/mmbd/bom0202/bomassign.do",
            data : {
                ids : this.state.materialIDs,
                targetIds : selectOrgValues,
                type : this.state.isCancelAssign?'cancelAssign':'assign'
            },
            success : (res) => {
                let {success,data} = res;
                if(success){
                    toast({content:this.state.isCancelAssign?( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3016')/* 国际化处理： 取消分配成功*/):( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3013')/* 国际化处理： 分配成功*/),color:'success'});
                    this.state.modal.show = false;
                    this.setState(this.state,this.onFinish());
                    if(res.data&&res.data.bodys)
                    this.props.cardTable.setTableData('bomcard_useorg',res.data.bodys['bomcard_useorg'])
                }
            }
        });
        
    }
    cancel = () => {
        this.state.modal.show = false;
        this.setState(this.state);
    }

    render() {
        var modalCfg = {...this.state.modal};
        return (
            <NCModal {...modalCfg}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.state.isCancelAssign?( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3024')/* 国际化处理： 取消分配*/):( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3014')/* 国际化处理： 快速分配*/)}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div><OrgSelect ref={(item)=> this.orgSelect = item} {...this.props}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton onClick={ this.onsubmit.bind(this) }>{this.state.isCancelAssign?( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3018')/* 国际化处理： 快速取消分配*/):( this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3015')/* 国际化处理： 分配*/)}</NCButton></span>
                    <NCButton onClick={ this.cancel.bind(this) }>{ this.props.MultiInit.getLangData("10140BOMM").intl && this.props.MultiInit.getLangData("10140BOMM").intl.get('110140BOMM3017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignModal;
//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ