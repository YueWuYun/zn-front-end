//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTabs, NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep } = base;
import {component} from '../../../public/platwapper/index.js';
const {NCButton } = component;
const { NCDiv } = base;
import OrgSelect  from './OrgSelect.js';
import DataSelect from './DataSelect.js';
import './AssignStepModal.less'
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.mainprops = props.mainprops;
        this.maincfg= props.maincfg;
        this.doit = 'do';
        this.state = {
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
        this.doit = doit;
        this.state.title = this.doit === 'do' ? this.lang['10140CASHFLOW-000000'] : this.lang['10140CASHFLOW-000064']/* 国际化处理： 分配*/;
        this.state.modal.show = true;
        this.state.step.current = 0;
        this.setState(this.state, ()=>{
            this.OrgSelect.rest();
            this.DataSelect.rest(doit);
        });
        
    }

    onsubmit(go = false){
        this.onFinish(go);
    }
    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
    }

    getOrgData(){
        return  this.OrgSelect.getData();
    }

    getCashflowData(){
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
            <NCModal {...modalCfg} fieldid = {"cashflow"}>
                <NCModal.Header>
                    <NCModal.Title>{this.state.title}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div style={{width: '70%',marginLeft: '15%'}}>
                        <NCStep.NCSteps {...stepCfg}>
                            <NCStep title={this.lang['10140CASHFLOW-000001']}  description={this.lang['10140CASHFLOW-000002']/* 国际化处理： 步骤1,选择目标组织*/} />
                            <NCStep title={this.lang['10140CASHFLOW-000003']}  description={this.lang['10140CASHFLOW-000004']/* 国际化处理： 步骤2,选择目标数据*/}/>
                        </NCStep.NCSteps>
                    </div>
                    <div style={{height: '375px',display: this.state.step.current == 0 ? '': 'none'}}><OrgSelect mainprops={this.mainprops}  maincfg={this.maincfg}  lang={this.lang} ref={ comp => this.OrgSelect = comp}/></div>
                    <div style={{height: '375px',display: this.state.step.current == 1 ? '': 'none'}}><DataSelect mainprops={this.mainprops}  maincfg={this.maincfg} lang={this.lang} ref={ comp => this.DataSelect = comp}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid = "before_step" onClick={ onStep(-1) }>{this.lang['10140CASHFLOW-000005']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? 'none' : '' }}><NCButton fieldid = "next_step" onClick={ onStep(1) }>{this.lang['10140CASHFLOW-000006']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid = "finsh_continue" onClick={ this.onsubmit.bind(this, true) }>{this.lang['10140CASHFLOW-000008']/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid = "finsh" onClick={ this.onsubmit.bind(this,false) }>{this.lang['10140CASHFLOW-000007']/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid = "concel" onClick={ this.cancel.bind(this) }>{this.lang['10140CASHFLOW-000009']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW