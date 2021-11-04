//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ
import React, {Component} from 'react';
import {base, ajax, toast} from 'nc-lightapp-front'

import WkSelect from './WkSelect'

let {NCModal, NCButton} = base

const saveAassignVOs = '/nccloud/mmbd/aassign/saveAassignVOs.do'    //提交选择结果


class AssignModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal: {
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            isCancelAssign: false,
            cactivityid: null,       //选中的作业档案pk
            pk_org: null            //当前工厂pk
        },
        this.onfinish = null
    }

    show = (data, isCancelAssign, callback) => {
        this.state.modal.show = true
        this.state.cactivityid = data.cactivityid
        this.state.pk_org = data.pk_org
        this.props.setUrlParam({currentorg: data.pk_org})
        this.state.isCancelAssign = !! isCancelAssign
        this.onfinish = callback
        this.setState(this.state)
    }

    onSubmit = () => {
        console.log(this.wkSelect.state)
        let data = {
            pk_org: this.wkSelect.state.currentorg,
            cactivityid: this.wkSelect.state.cactivityid,
            aassignedvos: this.wkSelect.state.selectedData
        }
        ajax({
            url: saveAassignVOs,
            data,
            success: (res)=>{
                this.state.modal.show = false
                this.setState(this.state)
                this.onfinish()
            }
        })
    }

    onCancel = () => {
        this.state.modal.show = false
        this.setState(this.state)
    }

    render = () => {
        var modalCfg = {...this.state.modal}
        return (
            <NCModal {...modalCfg}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.state.isCancelAssign ? '作业分配' : '作业分配'}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div>
                        <WkSelect ref={(wkSelect)=>this.wkSelect = wkSelect} {...this.props} />
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span>
                        <NCButton onClick={this.onSubmit.bind(this)}>{this.state.isCancelAssign ? '确定' : '确定'}</NCButton>
                    </span>
                    <NCButton onClick={this.onCancel.bind(this)}>{'取消'}</NCButton>
                </NCModal.Footer>
            </NCModal>
        )
    }
}

export default AssignModal
//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ