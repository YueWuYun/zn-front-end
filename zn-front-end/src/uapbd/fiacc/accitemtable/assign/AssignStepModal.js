//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep } = base;
import AccountSelect  from './AccountSelect.js';
import RuleSelect from './RuleSelect.js';
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
        this.lang =props.lang;
        this.state = {
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
        this.mainprops = props.mainprops;
    }

    show(param, onFinish){
        this.state.modal.show = true;
        this.onFinish = onFinish;
        this.state.step.current = 0;
        this.param = param;
        this.setState(this.state, ()=>{
            this.AccountSelect.rest(param);
            this.RuleSelect.rest(param);
        });
        
    }

    onsubmit(){
        this.onFinish &&  this.onFinish();
    }
    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }
    
    cancelSucess(){
        //分配 第二步 取消是调用
        return;
    }
    getAccountData(){
        return  this.AccountSelect.getData();
    }

    getRuleData(){
        return  this.RuleSelect.getData();
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
            <NCModal {...modalCfg} fieldid='modalcfg'>
                <NCModal.Header>
                    <NCModal.Title>{this.param && this.param.mode == 'add' ? this.lang['ACCCHART-000004'] : this.lang['ACCCHART-000005']/* 国际化处理： 分配,取消分配*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                        <NCStep.NCSteps {...stepCfg}>
                            <NCStep title={this.lang['ACCCHART-000006']}  description={this.lang['ACCCHART-000007']/* 国际化处理： 步骤1,选择科目控制规则*/} />
                            <NCStep title={this.lang['ACCCHART-000008']}  description={this.lang['ACCCHART-000009']/* 国际化处理： 步骤2,选择需要分配的科目*/} />
                        </NCStep.NCSteps>
                        <div style={{height: '400px',display: this.state.step.current == 0 ? '': 'none'}}><RuleSelect    lang={this.lang} ref={ comp => this.RuleSelect = comp}/></div>
                        <div style={{height: '400px',display: this.state.step.current == 1 ? '': 'none'}}><AccountSelect lang={this.lang} mainprops={this.mainprops} ref={ comp => this.AccountSelect = comp}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid='pre' onClick={ onStep(-1) }>{this.lang['ACCCHART-000010']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? 'none' : '' }}><NCButton fieldid='next' onClick={ onStep(1) }>{this.lang['ACCCHART-000011']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid='submit' onClick={ this.onsubmit.bind(this) }>{this.lang['ACCCHART-000012']/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid='cancel' onClick={ this.cancel.bind(this) }>{this.lang['ACCCHART-000013']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW