//8eS9y5CUYcJnG5N8CVy6SRMuQA8nBM1LcZ2uzNuhcmSrLJGv86xBtj+oaOdufW+F
import React, {Component} from 'react';
import {createPage, ajax, base, toast, high, print,printer,getBusinessInfo,cacheTools,promptBox} from 'nc-lightapp-front';

import "../main/index.less" ;
import Transfer from '../../../public/excomponents/Transfer';
import Utils from "../../../public/utils";
import {config} from '../config/config';
import {RefFilter,AccountUtils} from '../utils/accountcommon';
const {NCAffix,NCCheckbox, NCStep, NCRadio, NCFormControl,NCBackBtn} = base;
const NCSteps = NCStep.NCSteps;

//常量
const {pagecode,batchaddform,batchaddtable,formEnable,formPeriod,ajaxurl,gridId}=config;

let batchOrgs = [];


/**
 * 批量新增
 * zhaochxs
 */
class BatchAdd extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            thirdTableData: [],
            accountOrg: [],
            currelorg:{},
            cursetofbook:{},
            listShow:true
        }
    }

    componentDidMount() {

        this.setState({
            currentStep: 0,
            oprType: '1'
        });
        RefFilter.setSetOfBookRefFilter(this.props,batchaddform);
        RefFilter.pageAfterEventFilter(this.props,this.state.cursetofbook,batchaddform,'batch')
        this.updatestepModalButtonStatus(0);

    }

    //入口，设置第一步穿梭框中的组织
    setBatchOrgs(batchOrgs){

        this.batchOrgs = batchOrgs;

        let orgTransfer = this.orgTransfer;
        orgTransfer.setRootTitle(this.props.multiJson['10100ACB-000000']);/* 国际化处理： 财务组织*/
        if(batchOrgs){
            orgTransfer.reset(batchOrgs);
        }else{
            orgTransfer.reset([]);
        }
        orgTransfer.setMoveType('1');
        this.orgTransfer = orgTransfer;

    }

    //设置税务期间不可编辑
    taxperiodDisabled(formId,value){
        if(value&&value.value){
            //this.props.form.setFormItemsDisabled(formId,{'pk_taxperiod':false});
        }else{
            //this.props.form.setFormItemsDisabled(formId,{'pk_taxperiod':true});
        }
    }

    validBatchAddForm(){
        let values = this.props.form.getFormItemsValue(batchaddform,['pk_accountperiod','pk_curraccchart','pk_taxperiod']);
        if(values[0].value&&!values[1].value){
            toast({content: this.props.multiJson['10100ACB-000001'], color: 'warning'});/* 国际化处理： 总账核算账簿启用期间和当前科目表必须同时设置数据！*/
            return false;
        }

        // if(values[2].display != null && values[2].display != undefined && values[2].display.length > 0 && values[0].display>values[2].display){
        //     toast({content: this.props.multiJson['10100ACB-000002'], color: 'warning'});/* 国际化处理： 税务核算账簿的启用期间不能早于总账的启用期间！*/
        //     return false;
        // }
        return true;
    }

    //调节批量添加窗口按钮显示
    updatestepModalButtonStatus = () => {
        let current = this.state.currentStep;
        if (current === 0) {
            this.props.button.setDisabled({
                Prev: true,
                Next: false,
                Finish: true,
                CancelStep: false
            });
            this.props.button.setButtonsVisible({
                Next: true,
                FinishRe: false
            });
        } else if (current === 1 ) {
            this.props.button.setDisabled({
                Prev: false,
                Next: false,
                Finish: true,
                CancelStep: false
            });
            this.props.button.setButtonsVisible({
                Next: true,
                FinishRe: false
            });
        }else if(current===2){
            this.props.button.setDisabled({
                Prev: false,
                Next: false,
                Finish: false,
                CancelStep: false
            });
            this.props.button.setButtonsVisible({
                Next: true,
                FinishRe: false
            });
        } else if(current===3){
            this.props.button.setDisabled({
                Prev: false,
                Next: true,
                Finish: false,
                CancelStep: false
            });
            this.props.button.setButtonsVisible({
                Next: false,
                FinishRe: true
            });
        }
    };

    afterEvent2(props, moduleId, key, value, changedrows, i){
        if (key === 'pk_setofbook') {
            if (value.value == null) {
                this.state.cursetofbook={};
                this.setState(this.state);
                return;
            }

            if(value.value){
                props.form.setFormItemsValue([batchaddform], {
                    'pk_exratescheme': {value: null, display: null}
                });
            }

            this.state.cursetofbook=i;
            this.setState(this.state);

            //增加参照过滤条件
            RefFilter.pageAfterEventFilter(this.props,this.state.cursetofbook,batchaddform,'batch');

        }
        let enable = {value:2,display:this.props.multiJson['10100ACB-000003']}/* 国际化处理： 已启用*/
        let disable = {value:1,display:this.props.multiJson['10100ACB-000004']}/* 国际化处理： 未启用*/

        if(key=='pk_materialperiod'){

            this.props.form.setFormItemsValue(batchaddform,{'materialenablestate':value.value?enable:disable});

        }else if(key=='pk_assetperiod'){
            this.props.form.setFormItemsValue(batchaddform,{'assetenablestate':value.value?enable:disable});

        }else if(key=='pk_taxperiod'){
            //this.props.form.setFormItemsValue(batchaddform,{'taxenablestate':value.value?enable:disable});

        }else if(key=='pk_accountperiod'){
            this.props.form.setFormItemsValue(batchaddform,{'accountenablestate':value.value?enable:disable});
            //this.taxperiodDisabled(batchaddform,value);
            if(value.value){
                //this.props.form.setFormItemsDisabled(batchaddform,{'pk_taxperiod':false});
            }else{
                //this.props.form.setFormItemsDisabled(batchaddform,{'pk_taxperiod':true});
                this.props.form.setFormItemsValue(batchaddform,{'taxenablestate':disable});
            }
        }else if(key=='pk_productcostperiod'){
            if(this.props.form.getFormItemsValue(batchaddform,'pk_factorchart').value){
                this.props.form.setFormItemsValue(batchaddform,{'productcostenablestate':value.value?enable:disable});
            }else{
                this.props.form.setFormItemsValue(batchaddform,{'productcostenablestate':disable});
            }
        }else if(key=='pk_itemcostperiod'){
            if(this.props.form.getFormItemsValue(batchaddform,'pk_factorchart').value) {
                this.props.form.setFormItemsValue(batchaddform, {'itemcostenablestate': value.value ? enable : disable});
            }else{
                this.props.form.setFormItemsValue(batchaddform, {'itemcostenablestate': disable});
            }
        }
    }

    batchTableAfterEvent(props, moduleId,key,value,changedrows,index,record){

        let enable = {value:2,display:this.props.multiJson['10100ACB-000003']};/* 国际化处理： 已启用*/
        let disable = {value:1,display:this.props.multiJson['10100ACB-000004']};/* 国际化处理： 未启用*/
        let existValue = value.refpk;

        if(key=='pk_materialperiod'){
            this.props.editTable.setValByKeyAndIndex(batchaddtable,index,'materialenablestate',existValue?enable:disable);

        }else if(key=='pk_assetperiod'){
            this.props.editTable.setValByKeyAndIndex(batchaddtable,index,'assetenablestate',existValue?enable:disable);

        }else if(key=='pk_taxperiod'){
            //this.props.editTable.setValByKeyAndIndex(batchaddtable,index,'taxenablestate',existValue?enable:disable);

        }else if(key=='pk_accountperiod'){
            this.props.editTable.setValByKeyAndIndex(batchaddtable,index,'accountenablestate',existValue?enable:disable);

        }else if(key=='pk_productcostperiod'){
            this.props.editTable.setValByKeyAndIndex(batchaddtable,index,'productcostenablestate',existValue?enable:disable);

        }else if(key=='pk_itemcostperiod'){
            this.props.editTable.setValByKeyAndIndex(batchaddtable,index, 'itemcostenablestate', existValue ? enable : disable);

        }
    }

    /**
     * 获取分步中的第一步的页面内容
     */
    getFirstContent = () => {
        return (
            <div id="org_transfer" className="first-steps-content">
                <Transfer ref={(item)=>{
                                if(item){
                                    this.orgTransfer=item;
                                    if(this.batchOrgs){
                                        /*this.orgTransfer.setRootTitle('财务组织');
                                        this.orgTransfer.reset(this.batchOrgs);*/
                                    }
                                }
                            }}
                          showSearch={true}
                          lang={
                              {
                                  leftTreeName: this.props.multiJson === undefined ? "" : this.props.multiJson['10100ACB-000047']/* 国际化处理： 待选择数据*/,
                                  rightTreeName:
                                      this.props.multiJson === undefined ? "" : this.props.multiJson['10100ACB-000048']/* 国际化处理： 已选择数据*/

                              }
                          }
                />
                <div className={'steps-radio'}><NCCheckbox id={'check01'} checked={this.state.oprType==0}
                                                           onChange={this.checkChange.bind(this)}>{this.props.multiJson['10100ACB-000013']/* 国际化处理： 包含下级*/}</NCCheckbox></div>
            </div>
        );
    };
    checkChange(val){
        this.state.oprType=val? '0':'1';
        this.setState({oprType:this.state.oprType})
        this.orgTransfer.setMoveType(val?'0':'1');
    }

    /**
     * 获取分步中的第二步的页面内容
     */
    getSecondContent = () => {
        return  (
            <div className="steps-content-table">
                {this.props.form.createForm(batchaddform, {
                    onAfterEvent: this.afterEvent2.bind(this),
                    expandArr:['accountbatch','assetbatch','materialbatch','taxbatch','productcostbatch','itemcostbatch']
                })}
            </div>
        );
    };

    /**
     * 获取分步中的第三步的页面内容
     */
    getThirdContent = () => {
        return (
            <div className="steps-content-table">
                {this.props.editTable.createEditTable(batchaddtable, {
                    useFixedHeader:true,
                    showIndex:true,
                    showCheck:true,
					adaptionHeight:true
                })}
            </div>
        )
    }
    /**
     * 获取分步中的第四步的页面内容
     */
    getForthContent = () => {
        return (
            <div className="steps-content-table">
                {this.props.editTable.createEditTable(batchaddtable, {
                    useFixedHeader:true,
                    onAfterEvent:this.batchTableAfterEvent.bind(this),
                    showIndex:true,
                    showCheck:false,
					adaptionHeight:true
                })}
            </div>
        )
    }

    /**
     * 将树数据转换为表数据，提供给第三步生成表格数据使用
     */
    convertToTable = (orgTree) => {
        orgTree.forEach((item, index) => {
            this.state.accountOrg.push(item);
            if (item.children && item.children.length > 0) {
                this.convertToTable(item.children);
            }
        });
    }

    onClickButtons(props, id) {
        switch (id) {
            case "Prev":

                if(this.state.currentStep==1){
                    let formdata = this.props.form.getAllFormValue(batchaddform);
                    this.formdata = formdata;
                }
                if (this.state.currentStep == 2) {

                    //第二步重新渲染，添加以下代码初始化页面赋默认值
                    this.props.form.setFormStatus(batchaddform, 'edit');
                    if(this.formdata){
                        this.props.form.setFormItemsValue(batchaddform,this.formdata.rows[0].values);
                        this.taxperiodDisabled(batchaddform, props.form.getFormItemsValue(batchaddform, 'pk_accountperiod'));
                    }
                    this.props.form.setFormItemsValue(batchaddform, {'dataoriginflag':{value:0,display:this.props.multiJson['10100ACB-000005']}});/* 国际化处理： 本级产生*/
                }
                if (this.state.currentStep == 3) {
                    let datas = cacheTools.get('batchAddRows');
                    if (datas) {
                        this.props.editTable.setStatus(batchaddtable, 'browse');
                        this.props.editTable.setTableData(batchaddtable, {rows: datas});
                    }
                }

                let current = this.state.currentStep - 1;
                if (current < 0) current = 0;
                this.state.currentStep = current;
                this.setState(this.state,()=>{
                    if(current===0){
                        this.orgTransfer.reset(this.batchOrgs);
                        this.state.accountOrg.forEach(node => {
                            this.orgTransfer.state.treeWapper.moveRight(node.key);
                        });
                    }
                    this.orgTransfer.setMoveType(this.state.oprType)
                    this.updatestepModalButtonStatus(current);
                    this.orgTransfer.setRootTitle(this.props.multiJson['10100ACB-000000']);/* 国际化处理： 财务组织*/
                });
                break;
            case "Next":
                if (this.state.currentStep === 0) {
                    var orgs = this.orgTransfer.getData();

                    if (!(orgs && orgs.length > 0)) {
                        toast({color: 'warning', content: this.props.multiJson['10100ACB-000006']});/* 国际化处理： 请选择财务组织！*/
                        return;
                    }
                    this.state.accountOrg = [];
                    this.convertToTable(orgs);

                    this.state.currentStep = this.state.currentStep + 1;
                    this.setState(this.state,()=>{
                        this.props.form.setFormStatus(batchaddform, 'edit');
                        if(this.formdata){
                            this.props.form.setFormItemsValue(batchaddform,this.formdata.rows[0].values)
                        }else{
                            let items = {};
                            formEnable.forEach((item) => {
                                if (!(props.form.getFormItemsValue(batchaddform, item)&&props.form.getFormItemsValue(batchaddform, item).value)) {
                                    items[item] = {value: 1, display: this.props.multiJson['10100ACB-000004']};/* 国际化处理： 未启用*/
                                }
                            })
                            this.props.form.setFormItemsValue(batchaddform, items);
                            this.props.form.setFormItemsValue(batchaddform, {'dataoriginflag':{value:'0',display:this.props.multiJson['10100ACB-000005']}});/* 国际化处理： 本级产生*/
                        }
                        this.taxperiodDisabled(batchaddform, props.form.getFormItemsValue(batchaddform, 'pk_accountperiod'));
                        this.updatestepModalButtonStatus();
                    });

                    return;
                }

                if (this.state.currentStep == 1) {
                    if (!this.props.form.isCheckNow(batchaddform)) {
                        return;
                    }

                    if (!this.validBatchAddForm()) {
                        return;
                    }
                    let orgs = this.state.accountOrg;
                    let formdata = this.props.form.getAllFormValue(batchaddform);
                    this.formdata = formdata;
                    let tableData = [];
                    orgs.forEach((e) => {
                        let currows = Utils.clone(formdata.rows[0]);

                        currows.values.pk_relorg.value = e.refpk;
                        currows.values.pk_relorg.display = e.refname;
                        //如果财务组织没有税务职能则税务状态与期间赋空
                        if(e.nodeData.istaxorg=='0'){
                            currows.values.taxenablestate.value='1';
                            currows.values.taxenablestate.display=this.props.multiJson['10100ACB-000004'];/* 国际化处理： 未启用*/
                            //currows.values.pk_taxperiod.value='';
                            //currows.values.pk_taxperiod.display='';
                        }
                        Object.assign(currows.values, AccountUtils.getCodeName(e, this.state.cursetofbook));
                        tableData.push(currows);
                    });
                    this.state.currentStep = this.state.currentStep + 1;
                    this.setState(this.state,()=>{
                        this.props.editTable.setStatus(batchaddtable, 'browse');
                        this.props.editTable.setTableData(batchaddtable, {rows: tableData});
                        this.props.editTable.selectAllRows(batchaddtable, true);
                        this.updatestepModalButtonStatus();

                    });

                    /*setTimeout(() => {
                        this.props.editTable.setStatus(batchaddtable, 'browse');
                        this.props.editTable.setTableData(batchaddtable, {rows: tableData});
                        this.props.editTable.selectAllRows(batchaddtable, true);
                    }, 10)*/
                    //this.updatestepModalButtonStatus();
                    return;
                }

                if (this.state.currentStep == 2) {
                    let tableData2 = this.props.editTable.getCheckedRows(batchaddtable);
                    if (tableData2.length == 0) {
                        toast({content: this.props.multiJson['10100ACB-000007'], color: 'warning'});/* 国际化处理： 请选择数据！*/
                        return
                    }
                    let allData = this.props.editTable.getAllRows(batchaddtable, true);
                    cacheTools.set('batchAddRows', allData);
                    let data = [];
                    tableData2.forEach((e) => {
                        data.push(e.data);
                    })
                    this.state.currentStep = this.state.currentStep + 1;
                    this.setState(this.state,()=>{
                        this.props.editTable.setTableData(batchaddtable, {rows: data});
                        this.props.editTable.setStatus(batchaddtable, 'edit');
                        this.props.editTable.setColEditableByKey(batchaddtable,['pk_setofbook','pk_relorg']);
                        //税务账簿未启用的话不允许编辑，此处逻辑有问题，但按照NC端来
                        let rows = this.props.editTable.getAllRows(batchaddtable);
                        let indexs = rows.map((row,index)=>{
                            let ii = this.props.editTable.getValByKeyAndIndex(batchaddtable,index,'taxenablestate').value;
                            if(1==ii){
                                return index;
                            }
                        })
                        //this.props.editTable.setEditableRowKeyByIndex(batchaddtable,indexs,'pk_taxperiod',false);
                        //增加表格参照过滤
                        RefFilter.pageAfterEventFilter(this.props,this.state.cursetofbook,batchaddtable)
                        this.updatestepModalButtonStatus();
                    });
                    /*setTimeout(() => {
                        this.props.editTable.setTableData(batchaddtable, {rows: data});
                        this.props.editTable.setStatus(batchaddtable, 'edit');
                        this.props.editTable.setColEditableByKey(batchaddtable,['pk_setofbook','pk_relorg','accounttype']);
                        //税务账簿未启用的话不允许编辑，此处逻辑有问题，但按照NC端来
                        let rows = this.props.editTable.getAllRows(batchaddtable);
                        let indexs = rows.map((row,index)=>{
                            let ii = this.props.editTable.getValByKeyAndIndex(batchaddtable,index,'taxenablestate').value;
                            if(1==ii){
                                return index;
                            }
                        })
                        this.props.editTable.setEditableRowKeyByIndex(batchaddtable,indexs,'pk_taxperiod',false);
                        //增加表格参照过滤
                        RefFilter.pageAfterEventFilter(this.props,this.state.cursetofbook,batchaddtable)
                    }, 100)*/
                }
                //this.updatestepModalButtonStatus();
                break;
            case "Finish":
                this.batchFinish(() => {
                    this.props.closeModal('stepModal');
                })
                break;
            case 'FinishRe':
                this.batchFinish(() => {
                    this.setState({'currentStep': 0});
                    this.orgTransfer.setRootTitle(this.props.multiJson['10100ACB-000000']);/* 国际化处理： 财务组织*/
                    this.orgTransfer.reset(this.batchOrgs);
                    this.orgTransfer.setMoveType(this.state.oprType)
                });
                break;
            case "CancelStep":
                this.props.closeModal('stepModal');
                break;
        }
    }
    batchFinish( callBack ){
        let selectedData = [];
        if (this.state.currentStep == 2) {
            selectedData = this.props.editTable.getCheckedRows(batchaddtable);
            let data = [];
            selectedData.forEach((e)=>{
                data.push(e.data);
            })
            selectedData = data;
        }else if(this.state.currentStep == 3){
            selectedData = this.props.editTable.getAllRows(batchaddtable);
        }

        if (selectedData.length==0) {
            toast({content: this.props.multiJson['10100ACB-000007'], color: 'warning'});/* 国际化处理： 请选择数据！*/
            return
        }

        let stepModalSaveDdata = {
            pageid: pagecode,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: selectedData
            }
        };
        ajax({
            url: ajaxurl.batchsave,
            data: stepModalSaveDdata,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let {success, data} = res;
                if (success) {
                    //原NC在批量新增后没有任何表操作，这里先不做处理
                    /*let allD = this.props.editTable.getAllData(gridId);
                    let rows = allD.rows.length==0 ? data[gridId].rows : allD.rows.concat(data[gridId].rows);
                    this.props.editTable.setTableData(gridId, {rows:rows});*/
                    setTimeout(()=>{
                        callBack();
                        this.updatestepModalButtonStatus();
                    },1);
                    let pks = cacheTools.get('allpks');
                    if(!pks){ pks=[]}
                    data[gridId].rows.forEach((rowValue)=>{
                        pks.push(rowValue.values.pk_accountingbook.value);
                    })
                    cacheTools.set('allpks',pks);
                    toast({title: this.props.multiJson['10100ACB-000008'], color: 'success'});/* 国际化处理： 新增成功！*/
                }
            },
            error: (res) => {
                toast({color: 'danger', content: res.message});
            }
        });

    }

    render(){
        this.props.fn(this.onClickButtons,this);
        let firstTitle = this.props.multiJson['10100ACB-000009'];/* 国际化处理： 选择财务组织*/
        let {button} = this.props;
        let {createButtonApp} = button;
        const steps = [{
            title: firstTitle,
            content: this.getFirstContent,
        }, {
            title: this.props.multiJson['10100ACB-000010'],/* 国际化处理： 核算账簿主要属性设置*/
            content: this.getSecondContent,
        }, {
            title: this.props.multiJson['10100ACB-000011'],/* 国际化处理： 选择创建财务核算账簿*/
            content: this.getThirdContent,
        }, {
            title: this.props.multiJson['10100ACB-000012'],/* 国际化处理： 编辑选择财务核算账簿*/
            content: this.getForthContent,
        }];
        return (
            <div>
                <NCSteps className={'step-margin'} current={this.state.currentStep}>
                    {steps.map(item => <NCStep key={item.title} title={item.title}/>)}
                </NCSteps>
                {steps[this.state.currentStep].content()}
                {/*style={{bottom:'10px',position:'absolute',zIndex:"100"}}*/}
                
            </div>
        );
    }
}
export default BatchAdd

//8eS9y5CUYcJnG5N8CVy6SRMuQA8nBM1LcZ2uzNuhcmSrLJGv86xBtj+oaOdufW+F