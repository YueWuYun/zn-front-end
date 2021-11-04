//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCButton,NCCheckbox, NCModal, NCStep } = base;
import OrgSelect  from './OrgSelect.js';
import DataSelect from './DataSelect.js';
import './AssignStepModal.less'
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.state = {
            doit : 'do',
            title :'',
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            step:{
                current: 0,
                stepCount: 2
            }
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show(doit){
        this.state.modal.show = true;
        this.state.doit = doit;
        this.state.title = this.state.doit === 'do' ? this.lang['10140FPB-000000'] : this.lang['10140FPB-000051']/* 国际化处理： 分配*/;
        this.state.step.current = 0;
        this.setState(this.state, ()=>{
            this.OrgSelect.rest();
            this.DataSelect.rest(doit);
        });
        
    }

    onsubmit(){
        this.onFinish();
    }

    onsubmitContinue(){
        var continueBack = () =>{
            this.show();
        };
        this.onFinish(continueBack);
    }

    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }

    getOrgData(){
        return  this.OrgSelect.getData();
    }

    getInoutbusiclassData(){
        return  this.DataSelect.getData();
    }

    render() {
        var modalCfg = {...this.state.modal},
            stepCfg ={ ...this.state.step};

        var onStep = (dir) => {
            return () =>{
                var current = this.state.step.current,
                    stepCount = this.state.step.stepCount;
                if(dir < 0 && current > 0){ //prev step
                    this.state.step.current = this.state.step.current - 1;
                }
                if(dir > 0 && current < stepCount-1){ // next
                    this.state.step.current = this.state.step.current + 1;
                }
                this.setState(this.state);
            }
        };
        return (
            <NCModal className="my-modal-style" {...modalCfg} fieldid="assignStep">
                <NCModal.Header>
                    <NCModal.Title>{this.state.title}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                        <NCStep.NCSteps {...stepCfg}>
                            <NCStep title={this.lang['10140FPB-000001']}  description={this.lang['10140FPB-000002']/* 国际化处理： 步骤,选择目标组织*/} />
                            <NCStep title={this.lang['10140FPB-000003']}   description={this.lang['10140FPB-000004']/* 国际化处理： 步骤2,选择目标数据*/}  />
                        </NCStep.NCSteps>
                        <div style={{height: '375px',display: this.state.step.current == 0 ? '': 'none'}}><OrgSelect lang={this.lang} ref={ comp => this.OrgSelect = comp}/></div>
                        <div style={{height: '375px',display: this.state.step.current == 1 ? '': 'none'}}><DataSelect lang={this.lang} ref={ comp => this.DataSelect = comp}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid = 'up' onClick={ onStep(-1) }>{this.lang['10140FPB-000005']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? 'none' : '' }}><NCButton fieldid = 'next' onClick={ onStep(1) }>{this.lang['10140FPB-000006']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid = 'finishandnext' onClick={ this.onsubmitContinue.bind(this) }>{this.lang['10140FPB-000008']/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid = 'finishand' onClick={ this.onsubmit.bind(this) }>{this.lang['10140FPB-000007']/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid = 'canel' onClick={ this.cancel.bind(this) }>{this.lang['10140FPB-000009']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW