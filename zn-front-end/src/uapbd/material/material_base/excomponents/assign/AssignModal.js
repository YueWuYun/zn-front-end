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
                size: 'xlg',
                onHide : this.cancel
            },
            orgValues : [],
            materialIDs : [],
            isCancelAssign : false

        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
        this.closeEvnt = this.props.closeEvnt || EMPTY_FN;
    }

    show = (ids,isCancelAssign) => {
        this.state.modal.show = true;
        this.state.materialIDs = ids;
        this.state.isCancelAssign = !!isCancelAssign;
        this.setState(this.state);

    }

    onsubmit = () => {
        let node_type =this.props.config.node_type;
        let selectOrgValues = this.orgSelect.getData();
        if(!selectOrgValues || selectOrgValues.length < 1){
            toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000137')/* 国际化处理： 请选择组织*/,color:'warning'});
            return;
        }
        ajax({
            url : "/nccloud/uapbd/material/assignMaterial.do",
            data : {
                reqdata:{
                    ids : this.state.materialIDs,
                    targetIds : selectOrgValues,
                    type : this.state.isCancelAssign?'cancelAssign':'assign'
                },
                node_type:node_type
            },
            success : (res) => {
                let {success,data} = res;
                if(success){
                    toast({content:this.state.isCancelAssign?(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000136')/* 国际化处理： 取消分配成功*/):(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000135')/* 国际化处理： 分配成功*/),color:'success'});
                    this.state.modal.show = false;
                    this.setState(this.state,this.onFinish());
                }
            }
        });
        this.closeEvnt();
    }
    cancel = () => {
        this.state.modal.show = false;
        this.setState(this.state);
        this.closeEvnt();
    }

    render() {
        var modalCfg = {...this.state.modal};
        return (
            <NCModal {...modalCfg} size="xxlg" fieldid={'assign'}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.isCancelAssign?(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000132')/* 国际化处理： 取消分配*/):(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000144')/* 国际化处理： 快速分配*/)}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div><OrgSelect ref={(item)=> this.orgSelect = item} {...this.props}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton fieldid={'onsubmit'} onClick={ this.onsubmit.bind(this) }>{this.state.isCancelAssign?(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000143')/* 国际化处理： 快速取消分配*/):(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000131')/* 国际化处理： 分配*/)}</NCButton></span>
                    <NCButton fieldid={'cancel'} onClick={ this.cancel.bind(this) }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignModal;
//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ