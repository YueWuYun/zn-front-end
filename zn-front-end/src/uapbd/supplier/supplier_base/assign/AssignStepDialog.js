//atPqBu0yTg/msDRK8xP2h5kNxKOnsv7oWUjWBaf7P1ZF1i7AIjvfbQ/MtJ1fmBbH
import React, { Component } from 'react';
import {base,ajax ,toast} from 'nc-lightapp-front';

import OptionSelect from './OptionSelect';
import AssignFilter  from '../component/AdvanceQryFilter';
import OrgSelect from './OrgSelect';
import ResultGrid from '../component/ResultGrid';
import SupHotKeys from '../utils/SupplierHotKeys';
import {component} from '../../../public/platwapper/index.js';
import './AssignStepDialog.less';
let { NCModal, NCStep ,NCCheckbox,NCHotKeys} = base;
const {NCButton,NCSelect} = component;
const NCOption = NCSelect.NCOption;
let EMPTY_FN = function(){};
const {USUAL_KEYS} = NCHotKeys;
/**
 * εε―Όει dialog
 */
export default class AssignStepDialog extends Component {
    constructor(props) {
        super(props);
        debugger
        this.state = {
            pk_supplier:null,
            show:false,
            isHotKeyFinish:false,
            listener:{
                onBeforeSureClick:this.props.listener?this.props.listener.onBeforeSureClick:null,
                onAfterSureClick:this.props.listener?this.props.listener.onAfterSureClick:null,
                onBeforeCancelClick:this.props.listener?this.props.listener.onBeforeCancelClick:null,
                onAfterCancelClick:this.props.listener?this.props.listener.onAfterCancelClick:null,
                onBeforeShow:this.props.listener?this.props.listener.onBeforeShow:null,
                onAfterShow:this.props.listener?this.props.listener.onAfterShow:null
            },
            modal:{
                size:'xlg',
                title:this.props.Lang['10140SUG-000005'],
                backdrop:"static",
            },
            step:{
                0:{
                    title:this.props.Lang['10140SUG-000006'],
                    id:0,
                    description:this.props.Lang['10140SUG-000007'],
                    isRender:false,
                    render:(callback,config)=>{
                        return <OptionSelect  {...config} {...this.props} ref={( OptionSelect )=> this.OptionSelect = OptionSelect}/>
                    }
                },
                1:{
                    title:this.props.Lang['10140SUG-000008'],
                    id:1,
                    description:this.props.Lang['10140SUG-000009'],
                    isRender:false,
                    render:(callback,config)=>{
                        return <OrgSelect {...this.props} ref={( item )=> this.orgSelect = item}/>
                    }
                },
                2:{
                    title:this.props.Lang['10140SUG-000010'],
                    id:2,
                    description:this.props.Lang['10140SUG-000011'],
                    isRender:false,
                    render:(callback,config)=>{
                       return <AssignFilter {...config}/>
                    }
                },
                3:{
                    title:this.props.Lang['10140SUG-000012'],
                    id:3,
                    description:this.props.Lang['10140SUG-000013'],
                    isRender:false,
                    render:(callback,config)=>{
                        var cfg = {
                            pageInfoClick: this.pageInfoClick.bind(this),
                            ...config
                        };
                        return <ResultGrid {...cfg} {...this.props} ref={(ResultGrid)=>{this.ResultGrid = ResultGrid;}}/>
                    }
                }
            },
            currentStep:0,
            isAssign:true,
            assignStatus:{
                name:this.props.Lang['10140SUG-000014'],
                status:'',
                options: {
                    blank:{
                        value:'blank',
                        name:'',

                    },
                    hasAssign: {
                        value:'hasAssign',
                        name:this.props.Lang['10140SUG-000015']
                    },
                    hasNotAssign:{
                        value:'hasNotAssign',
                        name:this.props.Lang['10140SUG-000016']
                    }
                }
            },
            button:{
                previousStep: {
                    id: 'previousStep',
                    name: this.props.Lang['10140SUG-000017'],
                    visible:false,
                    action: this.previousStep
                },
                nextStep:{
                    id:'nextStep',
                    name:this.props.Lang['10140SUG-000018'],
                    visible:true,
                    action:this.nextStep
                },
                finish:{
                    id:'finish',
                    name:this.props.Lang['10140SUG-000019'],
                    visible:false,
                    action:this.onFinish
                },
                finishAndContinue:{
                    id:'finishAndContinue',
                    name:this.props.Lang['10140SUG-000020'],
                    visible:false,
                    action:this.onFinishAndConitnue
                },
                cancel:{
                    id:'cancel',
                    name:this.props.Lang['10140SUG-000004'],
                    visible:true,
                    action:this.close
                }
            },
            checked:false,
            showResult:{
                name:this.props.Lang['10140SUG-000021'],
                property:{
                    onChange:this.onShowResultCheckChanged
                },
                grid:null,
            },
            hotKeysCfg:{
                className:"simpleModal-hotkeys-wrapper",
                enabled:true,
                focused:true,
                display:"inline-block",
                keyMap:{
                    previousStep:USUAL_KEYS.NC_CARDPAGE_UP,
                    nextStep:USUAL_KEYS.NC_CARDPAGE_DOWN,
                    finishAndContinue:'alt+c',
                    finish: USUAL_KEYS.NC_MODAL_CONFIRM,
                    cancel: ['Alt+N','Esc']},
                handlers:{
                    nextStep:()=>{this.state.show && this.state.button.nextStep.visible && this.nextStep();},
                    previousStep:()=>{this.state.show && this.state.button.previousStep.visible && this.previousStep();},
                    finish: () => {this.beforeOnFinish(true,this.onFinish)},
                    finishAndContinue:()=>{this.beforeOnFinish(true,this.finishAndContinue)},
                    cancel: () => {this.state.show && this.state.button.cancel.visible && this.close();}
                }
            }

        };
    }
    resetPage = (callback)=>{
        this.state.checked = false;
        this.state.currentStep = 0;
        this.state.isAssign = true;
        this.setResultTableData();
        this.orgSelect.resetOrgSelect();
        this.setState(this.state,()=>{
            this.changeButtonStatus(this.state.currentStep);
            callback && callback()
            
        })

    }
    pageInfoClick(){
        this.queryResultTableData((data) =>{
            this.setResultTableData(data);
            setTimeout(() => {
                this.ResultGrid.afterDataUpdate(data, true)
            }, 0);
        },this.state.currentStep);
    }

    closeModal = (after)=> {
        this.resetPage(()=>{
            //ζ§θ‘ε³ι­modalεε³ι­εδΊδ»Ά
            this.setState({show:false},()=>{
                (after && typeof after ==='function') && after();
            })
        })
    }
    /**
     * ε³ι­
     * @param callback
     */
    close = (beforeCancel)=>{
        //ζεθ° ε°±ζ§θ‘εθ°  ζε³ι­modalηζδ½ζΎε°εθ°δΈ­οΌζε³ι­εδΊδ»ΆοΌδΉζΎε°εθ°δΈ­ζ§θ‘
        (beforeCancel && typeof beforeCancel ==='function')?
            beforeCancel(this.closeModal.bind(this,this.state.listener.onAfterCancelClick)):
            this.closeModal(this.state.listener.onAfterCancelClick);
    }
    closeOk = (beforeOk)=>{
        //ζεθ° ε°±ζ§θ‘εθ°  ζε³ι­modalηζδ½ζΎε°εθ°δΈ­οΌζε³ι­εδΊδ»ΆοΌδΉζΎε°εθ°δΈ­ζ§θ‘
        (beforeOk && typeof beforeOk ==='function')?
            beforeOk(this.closeModal.bind(this,this.state.listener.onAfterCloseOk)):
            this.closeModal(this.state.listener.onAfterCloseOk);
    }
    /**
     * ζεΌmodal
     * @param before
     */
    show = (param,before)=>{
        if(param){
            //ε¨ε‘ηδΈηΉε»εε―ΌειζΆ εͺη»ε½εζ°ζ?ει
            this.setState({pk_supplier:param.pk_supplier});
        }
        /**
         * ζΎη€Ίmodalζ‘
         * @param after
         */
        const showModal = (after)=>{
            this.setState({show:true},()=>{
                (after && typeof after ==='function') && after();
            })
        }
        /**
         * ζεΌεδΊδ»Ά
         */
        if(before && typeof before === 'function'){
            before(this.showModal.bind(this,this.state.listener.onAfterShow));
        }else if(!before && this.state.listener.onBeforeShow && typeof this.state.listener.onBeforeShow==='function' ){
            this.state.listener.onBeforeShow(showModal.bind(this,this.state.listener.onAfterShow));
        }else{
            //ζεΌ
            showModal(this.state.listener.onAfterShow);
        }

    }
    setPk_org_assignRequired = ()=>{
        let me = this;
        me.props.search.setRequiredByField('assignsupplierquery','pk_org',true);
    }
    /**
     * δΈδΈζ­₯
     */
    previousStep = ()=>{
        this.setState({currentStep:this.state.currentStep-1},()=>{
            this.state.currentStep == 2 && this.setPk_org_assignRequired.call(this);
            this.changeButtonStatus(this.state.currentStep);
            this.state.currentStep == 1 && !this.orgSelect.getHasLoadOrgTreeData() && this.orgSelect.loadAssignTreeData();
        })
    }
    /**
     * δΈδΈζ­₯
     */
    nextStep = ()=>{
        if(this.state.currentStep==1 && !this.checkHasTargetOrgs()){
            toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});
            return;
        }
        if(this.state.currentStep==2 && !this.state.checked){
            return;
        }
        if(this.state.currentStep==2 && !this.props.search.getAllSearchData('assignsupplierquery')){
            return;
        }
        //ηΉε»ηζ―η¬¬εζ­₯οΌεΉΆδΈιδΈ­ζΎη€Ίη»ζοΌζζ₯ζ°ζ?
        this.setState({currentStep:this.state.currentStep+1},()=>{
            this.state.currentStep == 2 && this.setPk_org_assignRequired.call(this);
            if(this.state.currentStep == 1 && !this.orgSelect.getHasLoadOrgTreeData()){
                this.orgSelect.loadAssignTreeData();
            }
            if(this.state.currentStep==3 && this.state.checked){
                this.queryResultTableData((data) => {
                    this.setResultTableData(data);
                    setTimeout(() => {
                        this.ResultGrid.afterDataUpdate(data, false);
                    }, 0);
                },this.state.currentStep);
            }
            this.changeButtonStatus(this.state.currentStep);
        })
    }
    /**
     * ζ­₯ιͺ€ζ‘ηΉε»δΊδ»Ά
     * @param id
     */
    onStepClick = (id)=>{
        let me = this;
        if(id==2 && !this.checkHasTargetOrgs()){
            toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});
            return;
        }
        if(id==3 && !this.state.checked){
            return;
        }
        if(id==3 && !this.props.search.getAllSearchData('assignsupplierquery')){
            return;
        }
        //ηΉε»ηζ―η¬¬εζ­₯οΌεΉΆδΈιδΈ­ζΎη€Ίη»ζοΌζζ₯ζ°ζ?
        this.setState({currentStep:id},()=>{
            me.state.currentStep == 2 && me.setPk_org_assignRequired.call(me);
            if(this.state.currentStep == 1 && !this.orgSelect.getHasLoadOrgTreeData()){
                this.orgSelect.loadAssignTreeData();
            }
            if(id==3 && this.state.checked){
                this.queryResultTableData(this.setResultTableData,this.state.currentStep);
            }
            this.changeButtonStatus(this.state.currentStep);
        })
    }
    /**
     * ζ₯θ―’θ‘¨ζ Όζ°ζ?
     * @param callback
     * @param step
     */
    queryResultTableData = (callback,step)=>{
        let queryInfo = this.props.search.getQueryInfo('assignsupplierquery',false);
        var param  = {
            formatInfo:{
                pageInfo:this.props.table.getTablePageInfo('assign_supplier_baseInfo'),
                querycondition: this.props.search.getAllSearchData('assignsupplierquery'),
                oid: queryInfo.oid || this.props.oid,
                queryAreaCode:'assignsupplierquery',
                querytype:'tree'
            },
            areacode:'assign_supplier_baseInfo',
            showOff:true,
            nodeType:this.props.nodeType,
            operate:'assignWizard',
            isAssign:this.state.assignStatus.status,
            assignTargets:this.orgSelect.getData()

        };
        ajax({
            url:'/nccloud/uapbd/supplier/querySupplierBaseInfo.do',
            data:param,
            success:(res)=>{
                res.success && callback(res.data);
            }
        })
    }
    /**
     * θ?Ύη½?θ‘¨ζ Όη»ζ
     * @param data
     */
    setResultTableData = (data)=>{
        this.props.table.setAllTableData('assign_supplier_baseInfo',data?data['assign_supplier_baseInfo']:{rows:[]});
    }
    beforeOnFinish = (isHotKeyFinish = false,finishFun)=>{
        !this.state.isHotKeyFinish && this.state.show && this.state.button.finish.visible && finishFun(isHotKeyFinish);
    }
    /**
     * ε?ζ
     */
    onFinish = (isHotKeyFinish)=>{
        this.setState({isHotKeyFinish:isHotKeyFinish},()=>{
            this.checkHasTargetOrgs()?this.assign(this.closeOk):toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});/* ε½ιεε€ηοΌ ζͺιζ©η?ζ η»η»οΌ*/
        })
    }
    /**
     * ει
     * @param callback
     */
    assign = (callback)=>{
        //ζ£ζ₯ζ―ε¦ζιδΈ­η»ζ
        if(!this.checkLastStep()){
            toast({title:this.props.Lang['10140SUG-000143']/*ιθ――δΏ‘ζ―*/,content:this.props.Lang['10140SUG-000204']/*ζ²‘ζιδΈ­θ¦ει/εζΆειηζ°ζ?.*/,color:'warning'});
            return;
        }
        if(!this.props.search.getAllSearchData('assignsupplierquery')){
            return;
        }
        const back2InitStatus = ()=>{
            this.state.assignStatus.status = "";
            this.OptionSelect.setIsAssign('assign');
            this.setResultTableData();
            this.orgSelect.resetOrgSelect();
            this.setState({checked:false,currentStep:0},()=>{
                this.props.table.setAllTableData('assign_supplier_baseInfo',{rows:[]});
                this.changeButtonStatus(this.state.currentStep);
            });
        }
        ajax({
            url:'/nccloud/uapbd/supplier/supAssignWarizd.do',
            data:this.getAssignParam(),
            success:(res)=>{
                this.setState({isHotKeyFinish:false},()=>{
                    back2InitStatus();
                    res.success && callback && callback();
                    toast({title:this.props.Lang['10140SUG-000023'],color:'success'})/* ε½ιεε€ηοΌ ειζεοΌ*/
                })
            }
        })
    }
    /**
     * ε?ζεΉΆη»§η»­
     */
    onFinishAndConitnue = (isHotKeyFinish)=>{
        this.setState({isHotKeyFinish:isHotKeyFinish},()=>{
            //ει
            this.checkHasTargetOrgs()?this.assign():toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});/* ε½ιεε€ηοΌ ζͺιζ©η?ζ η»η»οΌ*/
        })
    }
    /**
     * ζ£ζ₯ζ―ε¦ιζ©δΊη?ζ η»η»
     * @returns {*}
     */
    checkHasTargetOrgs = ()=>{
        let orgIds = this.orgSelect.getData();
        !(orgIds && orgIds[0]) && this.setState({isHotKeyFinish:false});
        return orgIds && orgIds[0]
    }
    checkLastStep = ()=>{
        return this.state.currentStep == 3 ? this.ResultGrid.getCheckedRows().length>0:true ;
    }
    /**
     * θ·εΎιδΈ­ηθ‘¨ζ Όζ°ζ?pk
     */
    getCheckedResultGridPks = ()=>{
        let checkedRows = this.ResultGrid.getCheckedRows(),pk_suppliers = new Array();
        checkedRows.forEach(row=>{
            pk_suppliers.push(row.data.values['pk_supplier'].value);
        })
        return pk_suppliers;
    }

    /**
     * θ·εΎειεζ°
     * @returns {{formatInfo: {pageInfo: null, querycondition: *, oid: *, queryAreaCode: string, querytype: string}, targetOrgIds: *, isAssign: boolean, assignStatus: string, pk_suppliers: Array}}
     */
    getAssignParam = ()=>{
        //ιδΈ­ι‘Ή
        let pk_suppliers = this.getCheckedResultGridPks();
        //ζ₯θ―’ζ‘δ»Ά
        let queryInfo = this.props.search.getQueryInfo('assignsupplierquery',false);
        //η»ζTableζ°ζ?
        let gridData = this.state.showResult.grid;
        //ζ₯θ―’εΊζ‘δ»Ά
        let search = this.props.search.getAllSearchData("assignsupplierquery");
        //ειζεζΆειηη»η»
        let orgIds = this.orgSelect.getData();
        //ει  or  εζΆει
        let isAssign = this.OptionSelect.getIsAssign();
        //ζͺειζε·²ει
        let assignStatus = this.state.assignStatus.status=='hasAssign'?true:this.state.assignStatus.status=='hasNotAssign'?false:null;

        return {
            formatInfo:{
                pageInfo:null,
                querycondition: search,
                oid: queryInfo.oid || this.props.oid,
                queryAreaCode:'assignsupplierquery',
                querytype:'tree'
            },
            targetOrgIds:orgIds,
            isAssign:isAssign,
            assignStatus:assignStatus,
            pk_suppliers:pk_suppliers || [],
            nodeType:this.props.nodeType,
            pk_curOrg:this.props.envParam.pk_org,
            isShowQueryResult:this.state.checked,
            tsMap:new Map()
        };
    }
    /**
     * ζΉεζι?ηΆζ
     * @param key
     */
    changeButtonStatus = (key)=>{
        switch(key){
            case 0://δΈδΈζ­₯  εζΆ  ζΎη€Ί
                this.state.button.previousStep.visible = false;
                this.state.button.nextStep.visible = true;
                this.state.button.finish.visible = false;
                this.state.button.finishAndContinue.visible = false;
                break;
            case 1://δΈδΈζ­₯  δΈδΈζ­₯  εζΆ  ζΎη€Ί
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = true;
                this.state.button.finish.visible = false;
                this.state.button.finishAndContinue.visible = false;
                break;
            case 2:
                //εΎι ζΎη€Ίη»ζοΌδΈδΈζ­₯ δΈδΈζ­₯ εζΆ ζΎη€Ί
                //δΈεΎι ζΎη€Ίη»ζοΌδΈδΈζ­₯ ε?ζεΉΆη»§η»­ ε?ζ εζΆ ζΎη€Ί
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = this.state.checked;
                this.state.button.finish.visible = !this.state.checked;
                this.state.button.finishAndContinue.visible = !this.state.checked;
                break;
            case 3:
                //δΈδΈζ­₯ ε?ζεΉΆη»§η»­ ε?ζ εζΆ ζΎη€Ί
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = false;
                this.state.button.finish.visible = true;
                this.state.button.finishAndContinue.visible = true;
                break;
        }
        this.setState(this.state);
    }

    /**
     * ζ―ε¦ζΎη€Ίζ₯θ―’η»ζζΉειδΈ­δΊδ»Ά
     * @param value
     */
    onShowResultCheckChanged = (value)=>{
        this.setState({checked:!this.state.checked},()=>{
            this.changeButtonStatus(2);
        });
    }
    /**
     *
     * @param flag
     */
    oncheckAssignOrCancel = (flag)=>{
        debugger
        this.setState({isAssign:flag =='hasAssign'?true:false});
    }
    onAssignStatusChanged = (value)=>{
        debugger
        this.state.isAssign = value;
        this.setState(this.state);
    }
    /**
     * ζΈ²ζζ­₯ιͺ€ζ‘
     * @returns {*}
     */
    renderAssignStep = ()=>{
        return <NCStep.NCSteps current={this.state.currentStep} size={Object.keys(this.state.step).length}>
            {Object.values(this.state.step).map(step=>{
                return <NCStep {...step} onClick={()=>{this.onStepClick(step.id)}}/>
            })}
        </NCStep.NCSteps>
    }
    /**
     * ζΈ²ζζ­₯ιͺ€ζ‘ι‘΅ι’
     */
    renderAssignStepPage = ()=>{
        return Object.keys(this.state.step).map(index=>{
            return (<div style={{height:'450px',display:this.state.currentStep == index?'':'none'}}>
                    {this.state.step[index].render(index==0?this.oncheckAssignOrCancel:EMPTY_FN,this.props)}
                </div>)
        })
    }

    /**
     * ζΈ²ζειηΆζ
     * @returns {*}
     */
    renderAssignStatus = ()=>{
        return (<div style={{display: this.state.currentStep == 2  ? '' : 'none',float:'left'}}>
                    <h4 className="assignStatus-h4" style={{display:'inline-block'}}>{this.state.assignStatus.name}</h4>
                    <div style={{width:'200px',marginLeft:'5px',display:'inline-block'}} fieldid={"assignstatus_select"} className="assignStepDialog-label">
                        <NCSelect defaultValue={this.state.assignStatus.status}  onChange={this.onAssignStatusChanged}>
                            { Object.values(this.state.assignStatus.options).map(option=>{
                                return <NCOption value={option.value}>{option.name}</NCOption>
                            })}
                        </NCSelect>
                    </div>
                <NCCheckbox style={{display:'inline-block'}}  {...this.state.showResult.property} checked={this.state.checked}>{this.state.showResult.name}</NCCheckbox>
            </div>)
    }
    /**
     * ζΈ²ζζι?
     * @returns {any[]}
     */
    renderAssignButtons = ()=>{
        let {button,hotKeysCfg} = this.state;
        let config = {
            btnComps:Object.keys(button).map(btnKey=>{
                return <NCButton className={button[btnKey].visible?'show':'hide'} onClick={button[btnKey].action} {...button[btnKey]}>{button[btnKey].name}</NCButton>
            }),
            hotKeysCfg
        }
        return <SupHotKeys {...config}/>
    }
    render() {
        return (
        <NCModal {...this.state.modal} show={this.state.show} onHide = {this.close} fieldid={"supplierstepassign"}>
            <NCModal.Header closeButton={true}>
                <NCModal.Title>{this.state.modal.title}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>
                {this.renderAssignStep()}
                {this.renderAssignStepPage()}
            </NCModal.Body>
            <NCModal.Footer>
                {this.renderAssignStatus()}
                {this.renderAssignButtons()}
            </NCModal.Footer>
        </NCModal>
        );
    }
}

//atPqBu0yTg/msDRK8xP2h5kNxKOnsv7oWUjWBaf7P1ZF1i7AIjvfbQ/MtJ1fmBbH