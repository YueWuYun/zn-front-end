//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { createPage, base,ajax, toast,promptBox,getMultiLang} from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse, NCStep } = base;
import OrgSelect  from './OrgSelect.js';
import ColSelect from './ColSelect.js';
import ResultGrid from './ResultGrid.js';
var EMPTY_FN = function(){};
class AssignStepModal extends Component {
    constructor(props) {
        super(props);
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
            json:{},
            comp:{} //key: compName, value:comp
        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }
  
    // componentWillMount() {
	// 	let callback = (json) => {
	// 		this.setState({json})
	// 		}
	// 	getMultiLang({moduleId: '10100PSRC', domainName: 'uapbd',callback})
    // }
    componentWillReceiveProps(nextProps){
        this.state.json = nextProps.json ||{};
        debugger;
        this.setState(this.state);

    }

    onsubmitAndContinue(){
        var d = this.state.comp['comp2'].getData();
        if(d.length < 1) {
            toast({color: 'warning',content: this.state.json['10100PSRC-000000']})/* 国际化处理： 请选择业务组织数据！*/
            return
        }
        this.onFinish('finish_continue');
    }
    show(){
        this.state.modal.show = true;
        this.state.step.current = 0;
        this.setState(this.state, ()=>{
            (Object.values(this.state.comp) || []) .forEach(element => {
                element.rest();
            });
        });
        
    }

    onsubmit(){
        var d = this.state.comp['comp2'].getData();
        if(d.length < 1) {
            toast({color: 'warning',content: this.state.json['10100PSRC-000000']})/* 国际化处理： 请选择业务组织数据！*/
            return
        }
        this.onFinish('finish');
    }
    cancel(finish){
        if(finish == 'finish')
        {
            this.state.modal.show = false;
            this.setState(this.state);
        }else{
            promptBox({
                color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10100PSRC-000001'],/* 国际化处理： 确认取消*/
                content: this.state.json['10100PSRC-000002'],/* 国际化处理： 是否确定要取消？*/
                beSureBtnClick: () => {
                    this.state.modal.show = false;
                    this.setState(this.state);
                },
                cancelBtnClick: () => {
                    return;
                }
            });
        }
    }

    getData(){
       return  this.state.comp['comp2'].getData();
    }

    render() {
        var modalCfg = {...this.state.modal},
            stepCfg ={ ...this.state.step};

        var onStep = (dir) => {
            return () =>{
                var current = this.state.step.current,
                    stepCount = this.state.step.stepCount,
                    data = this.state.comp['comp'+this.state.step.current].getData().length == 0,
                    toastMess = current === 0? this.state.json['10100PSRC-000003']:this.state.json['10100PSRC-000004'];/* 国际化处理： 请选择列,请选择业务单元*/
                if(dir < 0 && current > 0){ //prev step
                    
                    this.state.step.current = this.state.step.current - 1;
                }
                if(dir > 0 && current < stepCount-1){ // next
                    //未选择数据提示
                    if(data){
                        toast({color: 'warning',content: toastMess})
                        return false;
                    }
                    
                    this.state.step.current = this.state.step.current + 1;
                }
                this.setState(this.state, () => {
                    this.state.comp['comp'+this.state.step.current].onInit();
                });
            }
        };
        return (
            <NCModal {...modalCfg} fieldid = 'orgrole'>
                <NCModal.Header>
                    <NCModal.Title>{this.state.json['10100PSRC-000011']/* 国际化处理： 批量新增业务组织*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                        <NCStep.NCSteps style={{marginBottom:'10px'}} {...stepCfg}>
                            <NCStep title={this.state.json['10100PSRC-000005']}  description={this.state.json['10100PSRC-000006']}/* 国际化处理： 步骤1,选择列*/ />
                            <NCStep title={this.state.json['10100PSRC-000007']}  description={this.state.json['10100PSRC-000008']}/* 国际化处理： 步骤2,业务单元*//>
                            <NCStep title={this.state.json['10100PSRC-000009']}  description={this.state.json['10100PSRC-000010']}/* 国际化处理： 步骤3,数据确认*/ />
                        </NCStep.NCSteps>
                        <div style={{height: '300px',display: this.state.step.current == 0 ? '': 'none'}}><ColSelect main={this} ref={ comp =>  this.state.comp['comp0'] = comp}/></div>
                        <div className='orgselect' style={{height: '300px',display: this.state.step.current == 1 ? '': 'none'}}><OrgSelect main={this} ref={ comp =>  this.state.comp['comp1'] = comp}/></div>
                        <div style={{height: '300px',display: this.state.step.current == 2 ? '': 'none'}}><ResultGrid main={this} ref={ comp => this.state.comp['comp2'] = comp} /></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : '' }}><NCButton fieldid = 'upstep' onClick={ onStep(-1) }>{this.state.json['10100PSRC-000012']/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? 'none' : '' }}><NCButton fieldid = 'nextstep' onClick={ onStep(1) }>{this.state.json['10100PSRC-000013']/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? '' : 'none' }} ><NCButton fieldid = 'finish' onClick={ this.onsubmit.bind(this) }>{this.state.json['10100PSRC-000014']/* 国际化处理： 完成*/}</NCButton></span>
                    <span style={{display: this.state.step.current == this.state.step.stepCount - 1 ? '' : 'none' }} ><NCButton fieldid = 'finishhandcont' onClick={ this.onsubmitAndContinue.bind(this) }>{this.state.json['10100PSRC-000015']/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <NCButton onClick={ this.cancel.bind(this) }>{this.state.json['10100PSRC-000016']/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW