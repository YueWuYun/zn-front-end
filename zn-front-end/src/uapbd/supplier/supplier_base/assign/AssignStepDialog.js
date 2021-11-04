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
 * 向导分配 dialog
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
            //执行关闭modal和关闭后事件
            this.setState({show:false},()=>{
                (after && typeof after ==='function') && after();
            })
        })
    }
    /**
     * 关闭
     * @param callback
     */
    close = (beforeCancel)=>{
        //有回调 就执行回调  把关闭modal的操作放到回调中，有关闭后事件，也放到回调中执行
        (beforeCancel && typeof beforeCancel ==='function')?
            beforeCancel(this.closeModal.bind(this,this.state.listener.onAfterCancelClick)):
            this.closeModal(this.state.listener.onAfterCancelClick);
    }
    closeOk = (beforeOk)=>{
        //有回调 就执行回调  把关闭modal的操作放到回调中，有关闭后事件，也放到回调中执行
        (beforeOk && typeof beforeOk ==='function')?
            beforeOk(this.closeModal.bind(this,this.state.listener.onAfterCloseOk)):
            this.closeModal(this.state.listener.onAfterCloseOk);
    }
    /**
     * 打开modal
     * @param before
     */
    show = (param,before)=>{
        if(param){
            //在卡片上点击向导分配时 只给当前数据分配
            this.setState({pk_supplier:param.pk_supplier});
        }
        /**
         * 显示modal框
         * @param after
         */
        const showModal = (after)=>{
            this.setState({show:true},()=>{
                (after && typeof after ==='function') && after();
            })
        }
        /**
         * 打开前事件
         */
        if(before && typeof before === 'function'){
            before(this.showModal.bind(this,this.state.listener.onAfterShow));
        }else if(!before && this.state.listener.onBeforeShow && typeof this.state.listener.onBeforeShow==='function' ){
            this.state.listener.onBeforeShow(showModal.bind(this,this.state.listener.onAfterShow));
        }else{
            //打开
            showModal(this.state.listener.onAfterShow);
        }

    }
    setPk_org_assignRequired = ()=>{
        let me = this;
        me.props.search.setRequiredByField('assignsupplierquery','pk_org',true);
    }
    /**
     * 上一步
     */
    previousStep = ()=>{
        this.setState({currentStep:this.state.currentStep-1},()=>{
            this.state.currentStep == 2 && this.setPk_org_assignRequired.call(this);
            this.changeButtonStatus(this.state.currentStep);
            this.state.currentStep == 1 && !this.orgSelect.getHasLoadOrgTreeData() && this.orgSelect.loadAssignTreeData();
        })
    }
    /**
     * 下一步
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
        //点击的是第四步，并且选中显示结果，才查数据
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
     * 步骤条点击事件
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
        //点击的是第四步，并且选中显示结果，才查数据
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
     * 查询表格数据
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
     * 设置表格结果
     * @param data
     */
    setResultTableData = (data)=>{
        this.props.table.setAllTableData('assign_supplier_baseInfo',data?data['assign_supplier_baseInfo']:{rows:[]});
    }
    beforeOnFinish = (isHotKeyFinish = false,finishFun)=>{
        !this.state.isHotKeyFinish && this.state.show && this.state.button.finish.visible && finishFun(isHotKeyFinish);
    }
    /**
     * 完成
     */
    onFinish = (isHotKeyFinish)=>{
        this.setState({isHotKeyFinish:isHotKeyFinish},()=>{
            this.checkHasTargetOrgs()?this.assign(this.closeOk):toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});/* 国际化处理： 未选择目标组织！*/
        })
    }
    /**
     * 分配
     * @param callback
     */
    assign = (callback)=>{
        //检查是否有选中结果
        if(!this.checkLastStep()){
            toast({title:this.props.Lang['10140SUG-000143']/*错误信息*/,content:this.props.Lang['10140SUG-000204']/*没有选中要分配/取消分配的数据.*/,color:'warning'});
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
                    toast({title:this.props.Lang['10140SUG-000023'],color:'success'})/* 国际化处理： 分配成功！*/
                })
            }
        })
    }
    /**
     * 完成并继续
     */
    onFinishAndConitnue = (isHotKeyFinish)=>{
        this.setState({isHotKeyFinish:isHotKeyFinish},()=>{
            //分配
            this.checkHasTargetOrgs()?this.assign():toast({content:this.props.Lang['10140SUG-000022'],color:'warning'});/* 国际化处理： 未选择目标组织！*/
        })
    }
    /**
     * 检查是否选择了目标组织
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
     * 获得选中的表格数据pk
     */
    getCheckedResultGridPks = ()=>{
        let checkedRows = this.ResultGrid.getCheckedRows(),pk_suppliers = new Array();
        checkedRows.forEach(row=>{
            pk_suppliers.push(row.data.values['pk_supplier'].value);
        })
        return pk_suppliers;
    }

    /**
     * 获得分配参数
     * @returns {{formatInfo: {pageInfo: null, querycondition: *, oid: *, queryAreaCode: string, querytype: string}, targetOrgIds: *, isAssign: boolean, assignStatus: string, pk_suppliers: Array}}
     */
    getAssignParam = ()=>{
        //选中项
        let pk_suppliers = this.getCheckedResultGridPks();
        //查询条件
        let queryInfo = this.props.search.getQueryInfo('assignsupplierquery',false);
        //结果Table数据
        let gridData = this.state.showResult.grid;
        //查询区条件
        let search = this.props.search.getAllSearchData("assignsupplierquery");
        //分配或取消分配的组织
        let orgIds = this.orgSelect.getData();
        //分配  or  取消分配
        let isAssign = this.OptionSelect.getIsAssign();
        //未分配或已分配
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
     * 改变按钮状态
     * @param key
     */
    changeButtonStatus = (key)=>{
        switch(key){
            case 0://下一步  取消  显示
                this.state.button.previousStep.visible = false;
                this.state.button.nextStep.visible = true;
                this.state.button.finish.visible = false;
                this.state.button.finishAndContinue.visible = false;
                break;
            case 1://上一步  下一步  取消  显示
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = true;
                this.state.button.finish.visible = false;
                this.state.button.finishAndContinue.visible = false;
                break;
            case 2:
                //勾选 显示结果：上一步 下一步 取消 显示
                //不勾选 显示结果：上一步 完成并继续 完成 取消 显示
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = this.state.checked;
                this.state.button.finish.visible = !this.state.checked;
                this.state.button.finishAndContinue.visible = !this.state.checked;
                break;
            case 3:
                //上一步 完成并继续 完成 取消 显示
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = false;
                this.state.button.finish.visible = true;
                this.state.button.finishAndContinue.visible = true;
                break;
        }
        this.setState(this.state);
    }

    /**
     * 是否显示查询结果改变选中事件
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
     * 渲染步骤条
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
     * 渲染步骤条页面
     */
    renderAssignStepPage = ()=>{
        return Object.keys(this.state.step).map(index=>{
            return (<div style={{height:'450px',display:this.state.currentStep == index?'':'none'}}>
                    {this.state.step[index].render(index==0?this.oncheckAssignOrCancel:EMPTY_FN,this.props)}
                </div>)
        })
    }

    /**
     * 渲染分配状态
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
     * 渲染按钮
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