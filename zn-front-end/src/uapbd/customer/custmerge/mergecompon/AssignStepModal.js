//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax,getMultiLang } from 'nc-lightapp-front';
let {  NCButton, NCModal,  NCStep } = base;
//import './AssignStepModal.less'
import XTable from "../mergecompon/xh_table.js"
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
        this.config =Object.assign({
            formConfig:null,
            sformConfig:null,
            json:{},
        },props.config);
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'lg'
            },
            step:{
                current: 0,
                stepCount: 2
            },
            json:{}
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    componentWillMount() {
        // let callback = (json) => {
        //     this.state.json =json
        // }
        // getMultiLang({moduleId: "1317CUME",domainName: 'uapbd',callback})
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        this.config =Object.assign({
            formConfig:null,
            sformConfig:null,
        },nextProps.config);
    }

    show(){
        this.state.modal.show = true;
        this.state.step.current = 0;
        this.setState(this.state);
        
    }

    onsubmit(){
        this.onFinish();
    }
    cancel(){
        this.state.modal.show = false;
        this.setState(this.state);
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
            this.config.json?
            <NCModal {...modalCfg} onHide = {this.cancel.bind(this)}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.step.current == 0 ?this.config.json['1317CUME-000026']:this.config.json['1317CUME-000027']/* 国际化处理： 客户档案比较,供应商档案比较*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                        <NCStep.NCSteps {...stepCfg}>
                            <NCStep title={this.config.json['1317CUME-000028']}  description={this.config.json['1317CUME-000029']/* 国际化处理： 步骤1,客户档案合并比较*/} />
                            <NCStep title={this.config.json['1317CUME-000030']}  description={this.config.json['1317CUME-000031']/* 国际化处理： 步骤2,供应商档案合并比较*/} />
                        </NCStep.NCSteps>
                        <div style={{height: '375px',display: this.state.step.current == 0 ? '': 'none'}}><XTable config={this.config.formConfig} /></div>
                        <div style={{height: '375px',display: this.state.step.current == 1 ? '': 'none'}}><XTable config={this.config.sformConfig} /></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid='pre' onClick={ onStep(-1) }>{this.config.json['1317CUME-000032']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? 'none' : '' }}><NCButton fieldid='next' onClick={ onStep(1) }>{this.config.json['1317CUME-000033']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid='finish' onClick={ this.onsubmit.bind(this) }>{this.config.json['1317CUME-000034']/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid='cancel' onClick={ this.cancel.bind(this) }>{this.config.json['1317CUME-000035']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>:<NCModal></NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW