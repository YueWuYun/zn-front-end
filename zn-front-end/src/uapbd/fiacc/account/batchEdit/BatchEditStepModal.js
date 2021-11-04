//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J
import React, { Component } from 'react';
import { createPage, base,ajax } from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep } = base;
import AttrSelect  from './AttrSelect';
import SearchSelect from './SearchSelect';
import ResultGrid from './ResultGrid';

var EMPTY_FN = function(){};
class BatchEditStepModal extends Component {
    constructor(props) {

        super(props);
        this.lang = props.lang;
        this.common = props;
        this.curParam = {};
        this.state = {
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            step:{
                current: 0,
                stepCount: 3
            },
            curParam:{},
            pks:[]
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show(curParam,callback){
        this.state.modal.show = true;
        this.state.step.current = 0;
        this.state.curParam = curParam;
        this.onFinish = callback;
        this.setState(this.state, ()=>{
            this.AttrSelect.init(curParam);
            this.SearchSelect.init(curParam);
            this.ResultGrid.init(curParam);
        });
        
    }
	    isShow(){
        return this.state.modal.show;
    }

    onsubmit(){
        //buld submit data
        // var data = {
        //     attrs: {

        //     },
        //     pkorg:'',
        //     nodetype: '',
        //     pkcharts:[],
        //     selectedPKs:[]
        // }
        var data = {
            itemtypes: this.AttrSelect.getSelectItemType(),
            attrs:  this.AttrSelect.getAttrs(),
            pkorg:  this.state.curParam.pkorg,
            nodetype:  this.state.curParam.config.nodetype,
            pkcharts: this.AttrSelect.getPKCharts(),
            selectedPKs:this.state.pks
        };
        this.onFinish(data);
    }
    cancel(callback){
        this.state.modal.show = false;
        this.setState(this.state,()=>  {
            //callback && callback();
        });
    }

    onSelectPKChange(pks){
        this.state.pks = pks;
        this.setState(this.state);
    }
    

    render() {
        var modalCfg = {...this.state.modal},
            stepCfg ={ ...this.state.step};

        var onStep = (dir) => {
            return () =>{
                var current = this.state.step.current,
                    stepCount = this.state.step.stepCount;

                // 2-> 3 need check
                if(current == 0 && dir == 1  && !this.AttrSelect.checkAttr() ){
                    return;
                }
                this.ResultGrid.initSelectPK(this.state.pks);
                if(dir < 0 && current > 0){ //prev step
                    this.state.step.current = this.state.step.current - 1;
                }
                if(dir > 0 && current < stepCount-1){ // next
                    this.state.step.current = this.state.step.current + 1;
                }
                this.setState(this.state, () =>{
                    if(this.state.step.current == 2){
                        this.ResultGrid.initSelectPK(this.state.pks);
                    }
                    if(this.state.step.current == 1){
                        this.SearchSelect.initSelectChart(this.AttrSelect.getPKCharts());
                    }
                });
            }
        };
        return (
            <NCModal {...modalCfg} fieldid='modlacfg' >
                <NCModal.Header >
                    <NCModal.Title>{this.lang['10140ACCB-000001']}</NCModal.Title>{/* 国际化处理： 批改*/}
                </NCModal.Header>
                <NCModal.Body>
                    <NCStep.NCSteps {...stepCfg}>
                        <NCStep title="1"  description={this.lang['10140ACCB-000002']} />{/* 国际化处理： 选择批改属性并设置值*/}
                        <NCStep title="2"  description={this.lang['10140ACCB-000003']} />{/* 国际化处理： 设置过滤条件*/}
                        <NCStep title="3"  description={this.lang['10140ACCB-000004']} />{/* 国际化处理： 选择批改数据*/}
                    </NCStep.NCSteps>
                    <div style={{height: '400px',display: this.state.step.current == 0 ? '': 'none'}}><AttrSelect  lang={this.lang} common={this.common}  ref={(AttrSelect) => this.AttrSelect = AttrSelect }/></div>
                    <div style={{height: '400px',display: this.state.step.current == 1 ? '': 'none'}}><SearchSelect lang={this.lang} common={this.common} onSelectPKChange={this.onSelectPKChange.bind(this)} ref={(SearchSelect) => this.SearchSelect = SearchSelect }/></div>
                    <div style={{height: '400px',display: this.state.step.current == 2 ? '': 'none'}}><ResultGrid   lang={this.lang} common={this.common} onSelectPKChange={this.onSelectPKChange.bind(this)} ref={(ResultGrid) => this.ResultGrid = ResultGrid} /></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid='pre' onClick={ onStep(-1) }>{this.lang['10140ACCB-000005']}</NCButton></span>{/* 国际化处理： 上一步*/}
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? 'none' : '' }}><NCButton fieldid='next' onClick={ onStep(1) }>{this.lang['10140ACCB-000006']}</NCButton></span>{/* 国际化处理： 下一步*/}
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1  ? '' : 'none' }} ><NCButton fieldid='finish' onClick={ this.onsubmit.bind(this) }>{this.lang['10140ACCB-000007']}</NCButton></span>{/* 国际化处理： 完成*/}
                    <NCButton fieldid='cancel' onClick={ this.cancel.bind(this) }>{this.lang['10140ACCB-000008']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default BatchEditStepModal;

//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J