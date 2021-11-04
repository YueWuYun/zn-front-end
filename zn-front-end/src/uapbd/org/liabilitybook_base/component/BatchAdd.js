//8eS9y5CUYcJnG5N8CVy6SRMuQA8nBM1LcZ2uzNuhcmSrLJGv86xBtj+oaOdufW+F
import React, {Component} from 'react';
import {createPage, ajax, base, toast, high, print,printer,getBusinessInfo,cacheTools,promptBox} from 'nc-lightapp-front';

import "../main/index.less" ;
import Transfer from '../component/Transfer';
const {NCAffix,NCCheckbox, NCStep, NCRadio, NCFormControl,NCBackBtn} = base;
const NCSteps = NCStep.NCSteps;

//常量
const batchaddtable = 'liabilitybook_batchlist';
const batchaddtableedit = 'liabilitybook_batchedit';
const batchaddform = 'liabilitybook_batchcard';
let pagecode = '10100LB_liabilitybook';//页面id
let urls={
    gettebledataurl:"/nccloud/uapbd/liabilitybook/getbatchdata.do",
    batchdatasaveurl:"/nccloud/uapbd/liabilitybook/batchdatasave.do",
    afterEventUrl:"/nccloud/uapbd/liabilitybook/afterevent.do",
}
let batchOrgs = [];


/**
 * 批量新增
 *
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
        this.updatestepModalButtonStatus(0);

    }

    //入口，设置第一步穿梭框中的组织
    setBatchOrgs(batchOrgs){

        this.batchOrgs = batchOrgs;

        let orgTransfer = this.orgTransfer;
        orgTransfer.setRootTitle(this.props.multiJson['10100LB-000026']);/* 国际化处理： 利润中心*/
        if(batchOrgs){
            orgTransfer.reset(batchOrgs);
        }else{
            orgTransfer.reset([]);
        }
        orgTransfer.setMoveType('1');
        this.orgTransfer = orgTransfer;

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
                Finishre: false
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
                Finishre: false
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
                Finishre: false
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
                Finishre: true
            });
        }
    };

    afterEvent2(props, moduleId, key, value, changedrows, i){

    }

    batchTableAfterEvent(props, moduleId,key,value,changedrows,index,record){


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
                          onBeforeEvent ={this.beforemoveto}
                          lang={
                              {
                                  leftTreeName: this.props.multiJson === undefined ? "" : this.props.multiJson['10100LB-000027']/* 国际化处理： 待选择数据*/,
                                  rightTreeName:
                                      this.props.multiJson === undefined ? "" : this.props.multiJson['10100LB-000028']/* 国际化处理： 已选择数据*/

                              }
                          }
                />
                <div className={'steps-radio'}><NCCheckbox id={'check01'} checked={this.state.oprType==0}
                                                           onChange={this.checkChange.bind(this)}>{this.props.multiJson['10100LB-000029']/* 国际化处理： 包含下级*/}</NCCheckbox></div>
            </div>
        );
    };
    checkChange(val){
        this.state.oprType=val? '0':'1';
        this.setState({oprType:this.state.oprType})
        this.orgTransfer.setMoveType(val?'0':'1');
    }

    beforemoveto = (btn,orgs,c,selectpks,callback)=>{
        let orgpks;
        if(btn == "all_l2r"){
            if (!(orgs && orgs.length > 0)) {
                return;
            }
            this.state.accountOrg = [];
            this.convertToTable(orgs);
            orgpks = orgs.map((item)=>{
                return item.refpk
            })
        }else if(btn == "l2r"){
            orgpks = selectpks;
        }else if(btn == "r2l"){
            if(!selectpks||selectpks.length==0) {
                toast({color: 'warning', content: this.props.multiJson['10100LB-000035']});
                /* 国际化处理： 请选择利润中心！*/
            }
            if(callback && typeof callback === 'function'){
                callback();
            }
            return true;
        }else if(btn == "all_r2l"){
            if(callback && typeof callback === 'function'){
                callback();
            }
            return true;
        }
        if(!orgpks||orgpks.length==0){
            toast({color: 'warning', content: this.props.multiJson['10100LB-000035']});/* 国际化处理： 请选择利润中心！*/
            return
        }
        let formdata = this.props.form.getAllFormValue(batchaddform);
        this.formdata = formdata;
        var flag = false;
        ajax({
            url: urls.gettebledataurl,
            async: false,
            data:{
                pageid :pagecode,
                model:formdata,
                userjson:JSON.stringify(
                    orgpks
                )
            },
            success: (res) =>{
                if(res.data){
                    if(callback && typeof callback === 'function'){
                        callback();
                    }
                }
            },
            error : (res)=>{
                toast({color: 'warning', content: res.message});
                flag = false;
            }
        })
        return flag;
    }
    /**
     * 获取分步中的第二步的页面内容
     */
    getSecondContent = () => {
        return  (
            <div className="steps-content-table">
                {this.props.form.createForm(batchaddform, {
                    onAfterEvent: this.afterEvent2.bind(this),
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
                {this.props.editTable.createEditTable(batchaddtableedit, {
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
                    }
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
                    this.orgTransfer.setRootTitle(this.props.multiJson['10100LB-000026']);/* 国际化处理： 利润中心*/
                });
                break;
            case "Next":
                if (this.state.currentStep === 0) {
                    var orgs = this.orgTransfer.getData();

                    if (!(orgs && orgs.length > 0)) {
                        toast({color: 'warning', content: this.props.multiJson['10100LB-000035']});/* 国际化处理： 请选择利润中心！*/
                        return;
                    }
                    this.state.accountOrg = [];
                    this.convertToTable(orgs);

                    this.props.form.setFormItemsValue(batchaddform,{'pk_relorg':{value:orgs[0].refpk,display:null}});
                    let formdata = this.props.form.getAllFormValue(batchaddform);
                    this.formdata = formdata;
                    ajax({
                        url: urls.afterEventUrl,
                        data:{
                            pageid :pagecode,
                            model:formdata
                        },
                        success: (res) =>{
                            if (res.data) {
                                let meta = props.meta.getMeta();
                                meta['liabilitybook_batchcard'].items.map((item)=>{
                                    if (item.attrcode == "pk_factorchart") {
                                        item.queryCondition=()=>{
                                            return {
                                                pk_factorsystem :res.data['pk_checkelemsystem'],
                                                isliability:'true'
                                            }
                                        }
                                    }
                                })
                                meta['liabilitybook_batchedit'].items.map((item)=>{
                                    if (item.attrcode == "pk_factorchart") {
                                        item.queryCondition=()=>{
                                            return {
                                                pk_factorsystem :res.data['pk_checkelemsystem'],
                                                isliability:'true'
                                            }
                                        }
                                    }
                                    if (item.attrcode == "pk_liabilityperiod") {
                                        if(res.data['pk_accperiodscheme']!= null){
                                            item.queryCondition=()=>{
                                                return {
                                                    pk_accperiodscheme:res.data['pk_accperiodscheme'],
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            this.state.currentStep = this.state.currentStep + 1;
                            this.setState(this.state,()=>{
                                this.props.form.setFormStatus(batchaddform, 'edit');
                                if(this.formdata){
                                    this.props.form.setFormItemsValue(batchaddform,this.formdata.rows[0].values)
                                }else{

                                }
                                this.updatestepModalButtonStatus();
                            });
                        }
                    })

                    return;
                }

                if (this.state.currentStep == 1) {
                    if (!this.props.form.isCheckNow(batchaddform)) {
                        return;
                    }

                    let orgs = this.state.accountOrg;

                    let orgpks = orgs.map((item)=>{
                        return item.refpk
                    })
                    let formdata = this.props.form.getAllFormValue(batchaddform);
                    this.formdata = formdata;
                    ajax({
                        url: urls.gettebledataurl,
                        data:{
                            pageid :pagecode,
                            model:formdata,
                            userjson:JSON.stringify(
                                orgpks
                            )
                        },
                        success: (res) =>{
                            if(res.data){
                                this.state.currentStep = this.state.currentStep + 1;
                                this.setState(this.state,()=>{
                                    this.props.editTable.setStatus(batchaddtable, 'browse');
                                    this.props.editTable.setTableData(batchaddtable, res.data[batchaddtable]);
                                    this.props.editTable.selectAllRows(batchaddtable, true);
                                    this.updatestepModalButtonStatus();
                                });
                            }
                        }
                    })

                    return;
                }

                if (this.state.currentStep == 2) {
                    let tableData2 = this.props.editTable.getCheckedRows(batchaddtable);
                    let allData = this.props.editTable.getAllRows(batchaddtable, true);
                    cacheTools.set('batchAddRows', allData);
                    let data = [];
                    if(tableData2.length>0){
                        tableData2.forEach((e) => {
                            data.push(e.data);
                        })
                    }
                    this.state.currentStep = this.state.currentStep + 1;
                    this.setState(this.state,()=>{
                        this.props.editTable.setTableData(batchaddtableedit, {rows: data});
                        this.props.editTable.setStatus(batchaddtableedit, 'edit');
                        this.props.editTable.setColEditableByKey(batchaddtableedit,['pk_setofbook','pk_relorg']);
                        // //税务账簿未启用的话不允许编辑，此处逻辑有问题，但按照NC端来
                        // let rows = this.props.editTable.getAllRows(batchaddtable);
                        // let indexs = rows.map((row,index)=>{
                        //     let ii = this.props.editTable.getValByKeyAndIndex(batchaddtable,index,'taxenablestate').value;
                        //     if(1==ii){
                        //         return index;
                        //     }
                        // })
                        // this.props.editTable.setEditableRowKeyByIndex(batchaddtable,indexs,'pk_taxperiod',false);
                        // //增加表格参照过滤
                        // RefFilter.pageAfterEventFilter(this.props,this.state.cursetofbook,batchaddtable)
                        this.updatestepModalButtonStatus();
                    });
                }
                break;
            case "Finish":
                this.batchFinish(() => {
                    this.props.closeModal('stepModal');
                })
                break;
            case 'Finishre':
                this.batchFinish(() => {
                    this.setState({'currentStep': 0});
                    this.orgTransfer.setRootTitle(this.props.multiJson['10100LB-000026']);/* 国际化处理： 利润中心*/
                    this.orgTransfer.reset(this.batchOrgs);
                    this.orgTransfer.setMoveType(this.state.oprType)
                });
                break;
            case "CancelStep":
                promptBox({
                    color:"warning",
                    title:this.props.multiJson['10100LB-000010'],/* 国际化处理： 确认取消*/
                    content:this.props.multiJson['10100LB-000011'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        this.props.closeModal('stepModal');
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break;
        }
    }

    getCodeName(currelorg,cursetofbook){
        if (JSON.stringify(currelorg)!='{}'&&JSON.stringify(cursetofbook)!='{}') {
            let code = (currelorg.refcode==undefined?currelorg.nodeData.refcode:currelorg.refcode)+ '-' + cursetofbook.refcode;
            let name = currelorg.refname + '-' + cursetofbook.refname;
            code = code.substr(0,40);
            name = name.substr(0,200);
            return {name:{
                    'value': name,
                    'display': name
                },
                code:{
                    'display': code,
                    'value': code
                }};
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
            selectedData = this.props.editTable.getAllRows(batchaddtableedit);
        }

        if (selectedData.length==0) {
            toast({content: this.props.multiJson['10100LB-000038'], color: 'warning'});/* 国际化处理： 请选择数据！*/
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
            url: urls.batchdatasaveurl,
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
                    data[batchaddtableedit].rows.forEach((rowValue)=>{
                        pks.push(rowValue.values.pk_liabilitybook.value);
                    })
                    cacheTools.set('allpks',pks);
                    toast({title: this.props.multiJson['10100LB-000039'], color: 'success'});/* 国际化处理： 新增成功！*/
                }
            },
            error: (res) => {
                toast({color: 'danger', content: res.message});
            }
        });

    }

    render(){
        this.props.fn(this.onClickButtons,this);
        let firstTitle = this.props.multiJson['10100LB-000030'];/* 国际化处理： 选择利润中心*/
        let {button} = this.props;
        let {createButtonApp} = button;
        const steps = [{
            title: firstTitle,
            content: this.getFirstContent,
        }, {
            title: this.props.multiJson['10100LB-000031'],/* 国际化处理： 责任核算账簿主要属性设置*/
            content: this.getSecondContent,
        }, {
            title: this.props.multiJson['10100LB-000032'],/* 国际化处理： 选择创建责任核算账簿*/
            content: this.getThirdContent,
        }, {
            title: this.props.multiJson['10100LB-000033'],/* 国际化处理： 编辑选择责任核算账簿*/
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