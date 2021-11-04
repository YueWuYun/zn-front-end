//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ
import React, { Component } from 'react';
import { createPage, base,ajax,toast,cacheTools} from 'nc-lightapp-front';
let {NCModal} = base;
import {component} from '../../../public/platwapper/index.js';
const { NCButton } = component;
import OrgSelect  from './OrgSelect';
var EMPTY_FN = function(){};
class AssignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                fieldid:'assign',
                size: 'xlg',
                // backdrop:false/"static"//是否弹出遮罩层/点击遮罩层是否触发关闭事件
                backdrop:true
            },
        }
        this.config = {isAssign:true,};
        this.pk_project = this.props.getUrlParam('id');
    }

    show(flag){
        this.state.modal.show = true;
        this.config.isAssign = flag ==='assign'?true:false;
        this.setState(this.state, ()=>{
            this.orgSelect.reset();
        });
    }

    onsubmit(){
        debugger
        let targetOrgIds = [];
        this.orgSelect.state.selectData.datas
        &&this.orgSelect.state.selectData.datas.map((item)=>{
            targetOrgIds.push(item['id']);
        });

        let pk = this.props.getUrlParam('id');

        if(!(pk || this.props.table.getCheckedRows(this.props.gridId))){
            toast({ 'color':'danger','content':this.props.json['10140PRJB-000000']})/* 国际化处理： 请勾选分配项目！*/
        }
        let projectpks=[];
        if(pk){
           projectpks.push(pk);
        }else{
            this.props.table.getCheckedRows(this.props.gridId).map((item)=>{
                projectpks.push(item.data.values.pk_project.value) 
             })
        }
        

        debugger
        targetOrgIds.length===0?toast({
            'color':'danger',
            'content':this.props.json['10140PRJB-000001']/* 国际化处理： 请选择目标组织！*/
        }): ajax({
            url:'/nccloud/uapbd/pmbase/ProjectAssignOrgs.do',
            data:{
                pkcustList:projectpks,
                targetOrgIds:targetOrgIds,
                isAssign:this.config.isAssign
            },
            success:(res)=>{
                let{success,data} = res;
                if(success){
                    if(data&&data.hasOwnProperty('message')){
                        toast({'color':'success','content':data.message});
                        this.loadData();
                        this.cancel();
                    }
                }
            }
        });
    }
    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }

    loadData=()=>{

        this.props.getData&&this.props.getData(this.props.getUrlParam('id'));
    }


    loadSaleInfoGridData = ()=>{
        let editStatusBtns = ['subG5ModalSave','subG5ModalCancel'];
        let browseStatusBtns=['subGrid5Edit','subGrid5Del','subGrid5Addr','subGrid5Ref','subGrid5Print']
        this.props.loadSubGridData&&this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid5,
            this.props.config.custsaleForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns
        );
    }
    loadFinaceInfoGridData = ()=>{
        let editStatusBtns = ['subG4ModalSave','subG4ModalCancel'];
        let browseStatusBtns=['subGrid4Edit','subGrid4Del','subGrid4Ref','subGrid4Pri'];
        this.props.loadSubGridData&&this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid4,
            this.props.config.custfinanceForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns
        )
    }
    loadCreDitCtlInfoGridData =()=>{
        let editStatusBtns = ['subG6ModalSave','subG6ModalCancel'];
        let browseStatusBtns=['subG6Edit','subG6Del','subG6Ref','subG6Pri']
        this.props.loadSubGridData&&this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid6,
            this.props.config.creditctlForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns
        )
    }


    render() {
        let json = this.props.json;
        var modalCfg = {...this.state.modal}
        return (
            <NCModal {...modalCfg} onHide = {this.cancel.bind(this)}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.config.isAssign?json['10140PRJB-000002']:json['10140PRJB-000003']}</NCModal.Title>{/* 国际化处理： 快速分配,快速取消分配*/}
                </NCModal.Header>
                <NCModal.Body>
                    <div><OrgSelect ref={( item )=> this.orgSelect = item} {...{json:json}}/></div>
                </NCModal.Body>
                <NCModal.Footer>

                    <NCButton fieldid = 'sure' onClick={ this.onsubmit.bind(this) }>{json['10140PRJB-000004']}</NCButton>{/* 国际化处理： 确定*/}
                    <NCButton fieldid = 'cancel' onClick={ this.cancel.bind(this) }>{json['10140PRJB-000005']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}
export default AssignModal;

//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ