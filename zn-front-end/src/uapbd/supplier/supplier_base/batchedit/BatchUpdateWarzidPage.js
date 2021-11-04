//4E6+HMJEnKZFfwBjlWTKfavqjiRUkzTVR231AfWp0WWE57zpK4b4BYWUSlq+TflKklnkiapeFcZz
//7B7zqAgJeA==
import React,{Component} from 'react';
import {ajax,base,toast} from 'nc-lightapp-front';
import BatchUpdatePage from './BatchUpdatePage';
import AssignFilter  from '../component/AdvanceQryFilter';
import ResultGrid from '../component/ResultGrid';
import SupHotKeys from '../utils/SupplierHotKeys';
const {NCModal, NCStep ,NCCheckbox,NCRow,NCCol,NCHotKeys} = base;
import {component} from '../../../public/platwapper/index.js';
const {NCButton} = component;
const {USUAL_KEYS} = NCHotKeys;
const EMPTY_FN = ()=>{}
/**
 * 向导批改dialog
 */
export default class BatchUpdateWarzid extends Component{
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
                title:this.props.Lang['10140SUG-000055'],/* 国际化处理： 向导批改*/
                backdrop:"static",
                fieldid:'batchupdatewarzid'
            },
            step:{
                0:{
                    title:this.props.Lang['10140SUG-000006'],/* 国际化处理： 步骤1*/
                    id:0,
                    description:this.props.Lang['10140SUG-000063'],/* 国际化处理： 选择批改属性并设置值*/
                    isRender:false,
                    render:(callback,config)=>{
                        return <BatchUpdatePage  {...Object.assign(config,{isWarzidBatchUpdate:true})}  ref={( BatchUpdatePage )=> this.BatchUpdatePage = BatchUpdatePage}/>
                    }
                },
                1:{
                    title:this.props.Lang['10140SUG-000008'],/* 国际化处理： 步骤2*/
                    id:1,
                    description:this.props.Lang['10140SUG-000053'],/* 国际化处理： 设置过滤条件*/
                    isRender:false,
                    render:(callback,config)=>{
                        return <AssignFilter {...config}/>
                    }
                },
                2:{
                    title:this.props.Lang['10140SUG-000010'],/* 国际化处理： 步骤3*/
                    id:2,
                    description:this.props.Lang['10140SUG-000054'],/* 国际化处理： 选择批改数据*/
                    isRender:false,
                    render:(callback,config)=>{
                        var cfg = {
                            pageInfoClick: this.pageInfoClick.bind(this),
                            ...config
                        };
                        return <ResultGrid {...cfg} ref={(ResultGrid)=>{this.ResultGrid=ResultGrid}}/>
                    }
                }
            },
            currentStep:0,
            button:{
                previousStep: {
                    id: 'previousStep',
                    fieldid:'previousStep',
                    name: this.props.Lang['10140SUG-000017'],/* 国际化处理： 上一步*/
                    visible:false,
                    action: this.previousStep
                },
                nextStep:{
                    id:'nextStep',
                    fieldid:'nextStep',
                    name:this.props.Lang['10140SUG-000018'],/* 国际化处理： 下一步*/
                    visible:true,
                    action:this.nextStep
                },
                finish:{
                    id:'finish',
                    fieldid:'finish',
                    name:this.props.Lang['10140SUG-000019'],/* 国际化处理： 完成*/
                    visible:false,
                    action:()=>{this.beforeOnFinish(false,this.onFinish)}
                },
                finishAndContinue:{
                    id:'finishAndContinue',
                    fieldid:'finishAndContinue',
                    name:this.props.Lang['10140SUG-000020'],/* 国际化处理： 完成并继续*/
                    visible:false,
                    action:()=>{this.beforeOnFinish(false,this.onFinishAndConitnue)}
                },
                cancel:{
                    id:'cancel',
                    fieldid:'cancel',
                    name:this.props.Lang['10140SUG-000004'],/* 国际化处理： 取消*/
                    visible:true,
                    action:this.close
                }
            },
            checked:false,
            showResult:{
                name:this.props.Lang['10140SUG-000021'],/* 国际化处理： 是否显示查询结果*/
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
    validateEveryPage = (curStep,isBtnClick,callback)=>{
        if(curStep == 0){//第一步
            let selectedTab = this.BatchUpdatePage.getSelectedTab();
            if(selectedTab && selectedTab != 'sup_base_info'){
                let selectedOrg = this.BatchUpdatePage.getSelectedOrg();
                if(!selectedOrg || selectedOrg.length == 0){
                    isBtnClick && toast({title:this.props.Lang['10140SUG-000143'],content:this.props.Lang['10140SUG-000219'],color:'warning'});
                    return; 
                }
            }
            let selectedAttrs = this.BatchUpdatePage.getSelectedAttrs();
            if(!selectedAttrs || selectedAttrs.length == 0){
                isBtnClick && toast({title:this.props.Lang['10140SUG-000143'],content:this.props.Lang['10140SUG-000220'],color:'warning'});
                return;
            }
        }else if(curStep == 1){
            if(!this.props.search.getAllSearchData('assignsupplierquery')){
                return;
            }
        }
        callback && callback();
    }
    /**
     * 重置页面
     */
    resetPage = (callback)=>{
        this.state.checked = false;
        this.state.currentStep = 0;
        this.setResultTableData();//表格数据置空
        this.setState(this.state,()=>{
            this.changeButtonStatus(this.state.currentStep);
            callback && callback();
        })
    }
    /**
     * 关闭窗口
     */
    closeModal = (after)=> {
        this.resetPage(()=>{
            //执行关闭modal和关闭后事件
            this.setState({show:false},()=>{
                (after && typeof after ==='function') && after();
                this.BatchUpdatePage.cleanBatchUpdateData();//清理批改数据
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
        /**
         * 显示modal框
         * @param after
         */
        const showModal = (after)=>{
            this.setState({show:true},()=>{
                (after && typeof after ==='function') && after();
                this.BatchUpdatePage.SyncLoadRefer();//加载批改页签
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
    /**
     * 上一步
     */
    previousStep = ()=>{
        this.setState({currentStep:this.state.currentStep-1},()=>{
            this.state.currentStep == 1 && this.setPk_org_assignRequired.call(this);
            this.changeButtonStatus(this.state.currentStep);
        })
    }

    setPk_org_assignRequired = ()=>{
         this.props.search.setRequiredByField('assignsupplierquery','pk_org',this.props.nodeType != 'ORG_NODE');
    }
    /**
     * 下一步
     */
    nextStep = ()=>{
        this.validateEveryPage(this.state.currentStep,true,()=>{
            if(this.state.currentStep==1 && !this.state.checked){
                return;
            }
            if(this.state.currentStep==1 && !this.props.search.getAllSearchData('assignsupplierquery')){
                return;
            }
            //点击的是第四步，并且选中显示结果，才查数据
            this.setState({currentStep:this.state.currentStep+1},()=>{
                this.state.currentStep == 1 && this.setPk_org_assignRequired.call(this);
                if(this.state.currentStep==2 && this.state.checked){
                    this.queryResultTableData((data) => {
                        this.setResultTableData(data);
                        setTimeout(() => {
                            this.ResultGrid.afterDataUpdate(data, false);
                        }, 0);
                    },this.state.currentStep);
                }
                this.changeButtonStatus(this.state.currentStep);
            })
        });
    }
    /**
     * 步骤条点击事件
     * @param id
     */
    onStepClick = (id)=>{
        this.validateEveryPage(id-1,false,()=>{
            if(id==2 && !this.state.checked){
                return;
            }
            if(id==2 && !this.props.search.getAllSearchData('assignsupplierquery')){
                return;
            }
            //点击的是第三步，并且选中显示结果，才查数据
            this.setState({currentStep:id},()=>{
                this.state.currentStep == 1 && this.setPk_org_assignRequired.call(this);
                if(id==2 && this.state.checked){
                    this.queryResultTableData((data) => {
                        this.setResultTableData(data);
                        setTimeout(() => {
                            this.ResultGrid.afterDataUpdate(data, false);
                        }, 0);
                    },this.state.currentStep);
                }
                this.changeButtonStatus(this.state.currentStep);
            })
        });
    }

    /**
     * 查询表格数据
     * @param callback
     * @param step
     */
    queryResultTableData = (callback,step)=>{
        let queryInfo = this.props.search.getQueryInfo('assignsupplierquery',true);
        var param  = {
            formatInfo:{
                pageInfo:this.props.table.getTablePageInfo('assign_supplier_baseInfo'),
                querycondition: this.props.search.getAllSearchData('assignsupplierquery'),
                oid: queryInfo.oid || this.props.oid,
                queryAreaCode:'assignsupplierquery',
                querytype:'tree',
            },
            areacode:'assign_supplier_baseInfo',
            showOff:false,
            nodeType:this.props.nodeType,
            operate:'batchupdateWizard'

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
            this.batchUpdate(this.closeOk);
        })
    }
    checkLastStep = ()=>{
        return this.state.currentStep == 2 ? this.ResultGrid.getCheckedRows().length>0:true ;
    }
    
    pageInfoClick(){
        this.queryResultTableData((data) =>{
            this.setResultTableData(data);
            setTimeout(() => {
                this.ResultGrid.afterDataUpdate(data, true)
            }, 0);
        },this.state.currentStep);
    }
    /**
     * 分配
     * @param callback
     */
    batchUpdate = (callback)=>{
        if(!this.checkLastStep()){
            this.setState({isHotKeyFinish:false});
            toast({title:this.props.Lang['10140SUG-000143']/*错误信息*/,content:this.props.Lang['10140SUG-000205']/*没有选中批改数据！*/,color:'warning'});
            return;
        }

        this.getAssignParam((data)=>{
            ajax({
                url:'/nccloud/uapbd/supplier/batchUpdateWarzid.do',
                data:data,
                success:(res)=>{
                    this.setState({isHotKeyFinish:false},()=>{
                        res.success && this.state.listener.onBeforeSureClick(callback);
                        toast({content:this.props.Lang['10140SUG-000064'],color:'success'});/* 国际化处理： 批量修改成功！*/
                    });
                }
            })
        })
    }
    /**
     * 完成并继续
     */
    onFinishAndConitnue = (isHotKeyFinish)=>{
        this.setState({isHotKeyFinish:isHotKeyFinish},()=>{
            this.batchUpdate(this.resetPage);
        });
    }
    /**
     * 获得批改的参数
     */
    getAssignParam = (callback)=>{
        let batchUpdateParam = this.BatchUpdatePage.getBatchUpdateData();//批改参数
        let searchData = this.props.search.getAllSearchData("assignsupplierquery");//查询条件
        let selectedResPks = this.ResultGrid.state.selectpks;
        let queryInfo = this.props.search.getQueryInfo('assignsupplierquery',false);
        if(!searchData){
            return false
        }
        batchUpdateParam.formatVO = {
            pageInfo:this.props.table.getTablePageInfo('assign_supplier_baseInfo'),
            querycondition: searchData,
            oid: queryInfo.oid ,
            queryAreaCode:'assignsupplierquery',
            querytype:'tree'
        };
        batchUpdateParam.pks = selectedResPks || [];
        batchUpdateParam.nodeType = this.props.nodeType;
        batchUpdateParam.pk_curOrg = this.props.envParam.pk_org;
        batchUpdateParam.isShowQryResult = this.state.checked;
        (this.state.checked && selectedResPks && selectedResPks.length>0)?ajax({
            url:'/nccloud/uapbd/supplier/beforeEditSupValidate.do',
            data:{pk_suppliers:selectedResPks,operate:'batchupdate'},
            success:(res)=>{
                if(res.success && res.data){
                    callback && callback(batchUpdateParam);
                }
            }
        }):(callback && callback(batchUpdateParam));
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
            case 1:
                //勾选 显示结果：上一步 下一步 取消 显示
                //不勾选 显示结果：上一步 完成并继续 完成 取消 显示
                this.state.button.previousStep.visible = true;
                this.state.button.nextStep.visible = this.state.checked;
                this.state.button.finish.visible = !this.state.checked;
                this.state.button.finishAndContinue.visible = !this.state.checked;
                break;
            case 2:
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
            this.changeButtonStatus(1);
        });
    }
    /**
     *
     * @param flag
     */
    oncheckBatchUpdateOrCancel = (flag)=>{
        debugger
        this.setState({isAssign:flag =='hasAssign'?true:false});
    }
    /**
     * 渲染步骤条
     * @returns {*}
     */
    renderBatchUpdateStep = ()=>{
        return <NCStep.NCSteps current={this.state.currentStep} size={Object.keys(this.state.step).length}>
            {Object.values(this.state.step).map(step=>{
                return <NCStep {...step} onClick={()=>{this.onStepClick(step.id)}}/>
            })}
        </NCStep.NCSteps>

    }
    /**
     * 渲染步骤条页面
     */
    renderBatchUpdatePage = ()=>{
        return Object.keys(this.state.step).map(index=>{
            return (<div style={{height:'450px',display:this.state.currentStep == index?'':'none'}}>
                {this.state.step[index].render(index==0?this.oncheckBatchUpdateOrCancel:EMPTY_FN,this.props)}
            </div>)
        })
    }
    /**
     * 渲染批改状态
     * @returns {*}
     */
    renderBatchUpdateStatus = ()=>{
        return (<div style={{display: this.state.currentStep == 1  ? '' : 'none',float:'left' }}>
            <NCRow>
                <NCCol md={12} sm={12} xs={12}>
                    <NCCheckbox  {...this.state.showResult.property} checked={this.state.checked}>{this.state.showResult.name}</NCCheckbox>
                </NCCol>
            </NCRow>
        </div>)
    }
    /**
     * 渲染按钮
     * @returns {any[]}
     */
    renderBatchUpdateButtons = ()=>{
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
            <NCModal {...this.state.modal} show={this.state.show} onHide = {this.close}>
                
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.modal.title}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    {this.renderBatchUpdateStep()}
                    {this.renderBatchUpdatePage()}
                </NCModal.Body>
               
                <NCModal.Footer>
                    {this.renderBatchUpdateStatus()}
                    {this.renderBatchUpdateButtons()}
                </NCModal.Footer>
            </NCModal>
            
        );
    }

}

//4E6+HMJEnKZFfwBjlWTKfavqjiRUkzTVR231AfWp0WWE57zpK4b4BYWUSlq+TflKklnkiapeFcZz
//7B7zqAgJeA==