//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax ,promptBox,toast} from 'nc-lightapp-front';
let {NCTabs,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep,NCDiv } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCTree,NCTable,NCButton,NCSelect } = component;

import OrgSelect  from './OrgSelect.js';
import DeptSelect from './DeptSelect.js';
import ResultGrid from './ResultGrid.js';
import './AssignStepModal.less'
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                pk_depts:[],
                curOrg:{
                    refpk:''
                }
            },
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            step:{
                current: 0,
                stepCount: 3
            },
            comp:{} //key: compName, value:comp
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show(){
        this.state.modal.show = true;
        this.state.step.current = 0;
        this.setState(this.state);    
    }

    onsubmit(isContinue){
        //this.onFinish();
        let data=this.ResultGrid.editTable.getAllData('dept');
        let param = {
            pageid:'10100DEPT_copy',
            model : {
                areaType: "table",
                pageinfo: null,
                rows: data.rows
            }
        };
        ajax({
            url: '/nccloud/baseapp/dept/copy.do',
            data: param,
            success:(result) => {
                if(result.success){
                    toast({ title:this.props.config.json['10100DEPT-000048'], color: "success" });/* 国际化处理： 复制成功*/
                    this.state.modal.show = false;
                    this.setState(this.state);
                    //复制成功后刷新界面数据
                    this.props.commitEvent();
                }
            }
        });
    }
    cancel(){
        promptBox({
            color:'warning',
            title: this.props.config.json['10100DEPT-000049'],/* 国际化处理： 确认取消  */
            content: this.props.config.json['10100DEPT-000050'],/* 国际化处理： 是否确定要取消？*/
            beSureBtnClick: ()=>{
                this.state.data.pk_depts=[];
                this.state.modal.show = false;
                this.setState(this.state);
            }
        });
    }

    getData(){
       return  this.state.comp['comp2'].getData();
    }

    again(){
        //完成//this.onFinish();
        let data=this.ResultGrid.editTable.getAllData('dept');
        let param = {
            pageid:'10100DEPT_copy',
            model : {
                areaType: "table",
                pageinfo: null,
                rows: data.rows
            }
        };
        ajax({
            url: '/nccloud/baseapp/dept/copy.do',
            data: param,
            success:(result) => {
                if(result.success){
                    alert(this.props.config.json['10100DEPT-000048']);/* 国际化处理： 复制成功*/
                    //继续
                    let step = this.state.step;
                    step.current = 0;
                    this.setState({
                        step:step
                    });
                    //继续时清空第一步所选数据（刷新一次数据）
                    this.state.comp['comp0'].componentWillMount();
                    //this.state.modal.show = false;
                    //this.setState(this.state);
                    //清空第3步表单数据
                    this.state.data.pk_depts=[];
                    this.setState(this.state);
                }
            }
        });
    }

    render() {
        var modalCfg = {...this.state.modal},
            stepCfg ={ ...this.state.step};

        var onStep = (dir) => {
            return () =>{
                
                var current = this.state.step.current,
                    stepCount = this.state.step.stepCount;
                if(dir==1){
                    if(current===0){
                        let data = this.state.comp['comp0'].getData();
                        if(!data || data.length===0){
                            toast({content: '请选择部门数据.',color: 'error'});
                            return;
                        }
                    }else if(current===1){
                        let curOrg = this.state.comp['comp1'].getData();
                        if(!curOrg || curOrg.refpk==null || curOrg.refpk==''){
                            toast({content: '请选择业务单元数据.',color: 'error'});
                            return;
                        }
                    }
                }
                
                if(dir < 0 && current > 0){ //prev step
                    this.state.step.current = this.state.step.current - 1;
                }
                if(dir > 0 && current < stepCount-1){ // next
                    this.state.step.current = this.state.step.current + 1;
                }

                if(dir >0 && current == 0){
                    //清空历史数据
                    this.state.data.pk_depts=[];
                    this.state.comp['comp0'].getData().forEach((dept)=>{
                        this.state.data.pk_depts.push(dept.refpk)
                    })
                }
                if( current ==1 ){
                    this.state.data.curOrg=this.state.comp['comp1'].getData();
                }

                this.setState(this.state);

            }
        };

        let deptSelectParam={
            pk_org:this.props.config.curorg.pk_org,
            json:this.props.config.json
        }

        let orgSelectParam={
            json:this.props.config.json
        }

        let resultData=this.state.data;

        let resultParam={
            resultData,
            json:this.props.config.json
        }

        return (
            <NCModal {...modalCfg} fieldid = {"deptassign"}>
                <NCModal.Header  closeButton={true} onHide={this.cancel.bind(this)}>
                    <NCModal.Title>
                        {this.props.config.json['10100DEPT-000022']/* 国际化处理： 部门复制*/}
                    </NCModal.Title>
                </NCModal.Header>
                <NCModal.Body  style={{overflow:'hidden'}}>
                        <div style={{width:'80%',marginLeft: '10%',marginTop:'-5px'}}>
                            <NCStep.NCSteps {...stepCfg}>
                                <NCStep title={this.props.config.json['10100DEPT-000051']}  description={this.props.config.json['10100DEPT-000052']/* 国际化处理： 步骤1,选择部门*/} />
                                <NCStep title={this.props.config.json['10100DEPT-000053']}  description={this.props.config.json['10100DEPT-000054']/* 国际化处理： 步骤2,选择业务单元*/} />
                                <NCStep title={this.props.config.json['10100DEPT-000055']}  description={this.props.config.json['10100DEPT-000056']/* 国际化处理： 步骤3,编辑部门*/} />
                            </NCStep.NCSteps>
                        </div>
                        <div style={{height: '377px',display: this.state.step.current == 0 ? '': 'none'}}><DeptSelect config={deptSelectParam} main={this} ref={ comp =>  this.state.comp['comp0'] = comp}/></div>
                        <div style={{height: '377px',display: this.state.step.current == 1 ? '': 'none',paddingTop:40}}><OrgSelect config={orgSelectParam} main={this} ref={ comp =>  this.state.comp['comp1'] = comp}/></div>
                        {
                            this.state.step.current == 2?
                            <div style={{height: '377px',marginTop:'10px',display: this.state.step.current == 2 ? '': 'none'}}>
                                <ResultGrid config={resultParam} ref={(ResultGrid => this.ResultGrid = ResultGrid)}/>
                            </div>
                            : ''
                        }
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid={"assginlast"} onClick={ onStep(-1) }>{this.props.config.json['10100DEPT-000057']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? 'none' : '' }}><NCButton fieldid={"assginnext"} onClick={ onStep(1) }>{this.props.config.json['10100DEPT-000058']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? '' : 'none' }} ><NCButton fieldid={"assginfinishedgo"} onClick={ this.again.bind(this) }>{this.props.config.json['10100DEPT-000059']/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? '' : 'none' }} ><NCButton fieldid={"assginfinished"} onClick={ this.onsubmit.bind(this) }>{this.props.config.json['10100DEPT-000060']/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid={"assgincancel"} onClick={ this.cancel.bind(this) }>{this.props.config.json['10100DEPT-000061']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW