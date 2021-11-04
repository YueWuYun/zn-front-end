//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J
/**
 * 向导批改
 * @author yinshb
 */
import React, { Component } from 'react';
import { createPage, base,ajax,toast } from 'nc-lightapp-front';
let { NCTabs, NCButton, NCModal, NCStep,NCCheckbox } = base;
import  Utils from '../../../../public/utils';
import Batcheditform from './BatchEditForm';
import BatchEditFilter from './BatchEditFilter';
import ResultGrid from './ResultGrid';
import './BatchEditStepModal.less'
var EMPTY_FN = function(){};

class Batcheditstepmodal extends Component {
    constructor(props) {
        super(props);
        this.tableConfig = props.tableConfig;
        this.url = props.url;
        this.state = {
            showForm : false,
            modal:{
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            step:{
                current: 0,
                stepCount : 3
            },
            buttonShow:{
                pre:false,
                next:true,
                finish:false,
                finishAndStart:false
            },
            tableItems : {},
            orgs : [],
            pks : [],
            allpks:[],
            showResult:false
        };
        this.onFinish = props.onFinish || EMPTY_FN;
    }

    show = (orgs,pks) => {
        ajax({
            url : '/nccloud/uapbd/material/queryBatchUpdateTab.do',
            data : {mdId:this.tableConfig.mdId},
            success : (res) => {
                if(res.data && res.data.tab){
                    let meta = this.props.meta.getMeta();
                    let tableItems = {};
                    res.data.tab.forEach(element => {
                        let attrItems = [];
                        tableItems[element.code] = {
                            code : element.code,
                            name : element.name,
                            attrs : element.attrs,
                            pk_batchupdatetab : element.pk_batchupdatetab,
                            attrItems : attrItems
                        };
                        let requiredArr = ['intolerance','outtolerance','outcloselowerlimit'];
                        element.attrs.forEach(attr=>{
                            if(this.tableConfig.tableRelation[element.code] != null){
                                this.tableConfig.tableRelation[element.code].forEach(metaid=>{
                                    meta[metaid].items.forEach(item=>{
                                        if(item.attrcode === attr.code){
                                            let i = Utils.clone(item);
                                            i.visible = true;
                                            i.disabled = false;
                                            attr.name = item.label;
                                            if(requiredArr.indexOf(item.attrcode) > -1){
                                                i.required = true;
                                            }
                                            attrItems.push(i);
                                        }else if(this.tableConfig.specialItems[element.code] && this.tableConfig.specialItems[element.code] === item.attrcode && !(element.code === 'base_info' && this.tableConfig.nodeType === 'GROUP_NODE')){
                                            tableItems[element.code].special = Utils.clone(item);
                                            tableItems[element.code].special.visible = true;
                                            tableItems[element.code].special.disabled = false;
                                            tableItems[element.code].special.isMultiSelectedEnabled = true;
                                            if(element.code === 'plan_info'){
                                                tableItems[element.code].special.label = this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000156')/* 国际化处理： 所属业务单元*/;
                                            }
                                        }else if(attr.relatedattr){
                                            let relatedattr = attr.relatedattr.split(',');
                                            if(relatedattr.indexOf(item.attrcode) > -1){
                                                let i = Utils.clone(item);
                                                i.visible = true;
                                                i.disabled = false;
                                                attr.name = item.label;
                                                attrItems.push(i);
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    });
                    this.state.tableItems = tableItems;
                    this.state.modal.show = true;
                    this.state.showForm = true;
                    this.state.step.current = 0;
                    this.state.buttonShow.pre = false;
                    this.state.buttonShow.next = true;
                    this.state.buttonShow.finishAndStart = false;
                    this.state.buttonShow.finish = false;
                    this.setState(this.state);
                }
            }
        });
    }

    onsubmit = (Continue) => {
        let reqData = this.Batcheditform.getData();
        let node_type =this.tableConfig.nodeType;
        reqData.orgs = this.state.orgs;
        if(this.state.step.current == this.state.step.stepCount - 2){//设置查询条件直接完成
            let searchdata = this.BatchEditFilter.getQueryInfo();
            if(!searchdata) return;
            searchdata.pageCode = this.tableConfig.tablepagecode;
            reqData.queryInfo = searchdata;
            reqData.pks = [];
        }else if(this.state.step.current == this.state.step.stepCount - 1){//选择批改数据后完成
            reqData.queryInfo = null;
            //let pks = this.resultGrid.getData();
            if(!this.state.pks || this.state.pks.length === 0){
                toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000159')/* 国际化处理： 出错啦！*/});
                return;
            }
            reqData.pks = this.state.pks;
        }
        ajax({
            url : this.url,
            data : {reqData,node_type},
            success : (res) => {
                this.state.step.current = 0;
                this.state.buttonShow.pre=false;
                this.state.buttonShow.next=true;
                this.state.buttonShow.finish=false;
                this.state.buttonShow.finishAndStart=false;
                this.state.orgs= [];
                this.state.allpks = [];
                this.state.pks = [];
                let {data} = res;
                if((data&&data.detailMessage)){
                    toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:data.detailMessage});
                }else if(data && data.errorLogResult && data.errorLogResult.errorMsgs && data.errorLogResult.errorMsgs.length > 0){
                    let msg = '';
                    data.errorLogResult.errorMsgs.forEach(item=>{
                        msg = msg + item.errormsg;
                    });
                    toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:msg});
                }
                if(Continue){
                    this.setState(this.state,this.onFinish());
                }else{
                    this.state.modal.show = false;
                    this.setState(this.state,this.onFinish());
                }
            }
        })
    }

    /**
     * 查询列表
     */
    queryData = (pageInfo) => {
        let searchdata = this.BatchEditFilter.getQueryInfo();
        if(!searchdata) return;
        searchdata.pageCode = this.tableConfig.tablepagecode;
        if(!pageInfo){
            pageInfo =this.props.table.getTablePageInfo(this.tableConfig.tableid);
        }
        searchdata.pageInfo = pageInfo;
        ajax({
            url: this.tableConfig.queryTable,
            data:searchdata,
            success : (res)=>{
                let {data} = res;
                if(data[this.tableConfig.tableid]){
                    this.props.table.setAllTableData(this.tableConfig.tableid,data[this.tableConfig.tableid]);
                    this.state.allpks=data[this.tableConfig.tableid].allpks;
                    this.setState(this.state);
                    if(this.state.pks.length>0){
                        let pageSelect = [];
                        data[this.tableConfig.tableid].rows.forEach((item,index)=>{
                            if(this.state.pks.indexOf(item.values.pk_material.value) !== -1){
                                pageSelect.push(index);
                            }
                        });
                        if(pageSelect.length>0){
                            this.props.table.selectTableRows(this.tableConfig.tableid,pageSelect,true);
                        }
                    }
                }
            }
        });
    }

    onStep = (dir) => {
        let c ;
        let current = this.state.step.current;
        if(dir < 0 && this.state.step.current > 0){
            this.state.step.current = current -1;
            c = current -1;
        }else if(dir > 0 && this.state.step.current < this.state.step.stepCount - 1){
            if(this.state.showForm && this.Batcheditform.getData()){
                if(this.state.step.current === 1){
                    if(!this.BatchEditFilter.getQueryInfo()){
                        return;
                    }
                    let pageInfo = { pageIndex : 0, pageSize : 10 };
                    this.queryData(pageInfo);
                }
                this.state.step.current = this.state.step.current + 1;
                c = current + 1;
            }
            
        }
        if(c===0){
            this.state.buttonShow.pre=false;
            this.state.buttonShow.next=true;
            this.state.buttonShow.finish=false;
            this.state.buttonShow.finishAndStart=false;
        }else if(c===1){
            this.state.buttonShow.pre=true;
            if(this.BatchEditFilter.getShowResult()){
                this.state.buttonShow.next=true;
                this.state.buttonShow.finish=false;
                this.state.buttonShow.finishAndStart=false;
            }else{
                this.state.buttonShow.next=false;
                this.state.buttonShow.finish=true;
                this.state.buttonShow.finishAndStart=true;
            }
        }else if(c===2){
            this.state.buttonShow.pre=true;
            this.state.buttonShow.next=false;
            this.state.buttonShow.finish=true;
            this.state.buttonShow.finishAndStart=true;
        }
        this.setState(this.state);
    }

    /**
     * 是否显示查询结果复选框选择变更事件
     */
    showResultChange = (value) => {
        if(value){
            this.state.buttonShow.next=true;
            this.state.buttonShow.finish=false;
            this.state.buttonShow.finishAndStart=false;
        }else{
            this.state.buttonShow.next=false;
            this.state.buttonShow.finish=true;
            this.state.buttonShow.finishAndStart=true;
        }
        this.setState(this.state);
    }

    updateSelectId = () => {
        let _current_page_data = this.props.table.getAllTableData(this.tableConfig.tableid);
        let _current_page_ids = [];
        _current_page_data.rows.forEach(item=>{
            _current_page_ids.push(item.values.pk_material.value);
        });
        let _select_data = this.props.table.getCheckedRows(this.tableConfig.tableid);
        let _select_ids = [];
        let _unselect_ids = [];
        if(_select_data.length === 0){
            _unselect_ids = _current_page_ids;
        }else if(_select_data.length === _current_page_ids.length){
            _select_ids = _current_page_ids;
        }else{
            _select_data.forEach(item=>{
                _select_ids.push(item.data.values.pk_material.value);
                _current_page_ids.remove(item.data.values.pk_material.value);
            });
            _unselect_ids = _current_page_ids;
        }
        if(this.state.pks.length === 0){
            this.setState({pks:_select_ids},()=>{this.resultGrid.updateButtonStatus(false)});
        }else{
            let selectMaterialID = this.state.pks;
            _unselect_ids.forEach(item=>{
                if(selectMaterialID.indexOf(item) !== -1){
                    selectMaterialID.remove(item);
                }
            });
            _select_ids.forEach(item=>{
                if(selectMaterialID.indexOf(item) === -1){
                    selectMaterialID.push(item);
                }
            });
            this.setState({pks:selectMaterialID},()=>{this.resultGrid.updateButtonStatus(false)});
        }
    }

    /**
     * 全部全选或取消
     */
    selectAll = (falg) => {
        if(falg){
            this.state.pks = this.state.allpks;
        }else{
            this.state.pks = [];
        }
        this.setState(this.state,()=>{
            this.resultGrid.updateButtonStatus(false);
        });
    }

    /**
     * 取消
     */
    cancel = () => {
        this.state.modal.show = false;
        this.setState(this.state);
    }

    render(){

        return (
            <NCModal {...this.state.modal} size="xxlg" fieldid={'batcheditstep'}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000110')/* 国际化处理： 向导批改*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCStep.NCSteps { ...this.state.step}>
                        <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000111')/* 国际化处理： 步骤1*/}  description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000114')/* 国际化处理： 选择批改属性并设值*/} />
                        <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000112')/* 国际化处理： 步骤2*/}  description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000115')/* 国际化处理： 设置过滤条件*/} />
                        <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000113')/* 国际化处理： 步骤3*/}  description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000116')/* 国际化处理： 选择批改数据*/} />
                    </NCStep.NCSteps>
                    <div style={{height: '450px',display: this.state.step.current == 0 ? '': 'none'}}>
                        <Batcheditform tableItems={this.state.tableItems} ref={item=>this.Batcheditform=item} {...this.props} oprFlag={'stepEdit'} />
                    </div>
                    <div className='nc-singleTable-search-area-assign-self-style' style={{height: '450px',display: this.state.step.current == 1 ? '': 'none'}}><BatchEditFilter {...this.props} ref={(item)=>{this.BatchEditFilter = item}} /></div>
                    <div style={{height: '450px',display: this.state.step.current == 2 ? '': 'none'}}><ResultGrid ref={(resultGrid)=>{this.resultGrid = resultGrid}} {...this.props} handlePageInfoChange={this.queryData} updateSelectId={this.updateSelectId} selectAll={this.selectAll}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <div style={{position:'absolute',display: this.state.step.current == 1 ? '': 'none'}}>
                        <div style={{display:'inline-block',verticalAlign:'middle'}}>
                            <NCCheckbox defaultChecked={this.state.showResult} checked={this.state.showResult} onChange={(value)=>{this.setState({showResult:value},()=>{this.showResultChange(value)})}}></NCCheckbox>
                        </div>
                        <div style={{display:'inline-block',verticalAlign:'middle'}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000102')/* 国际化处理： 是否显示查询结果*/}</div>
                    </div>
                    <span style={{display: this.state.buttonShow.pre ? '' : 'none' }}><NCButton fieldid={'preBtn'} onClick={ ()=>{this.onStep(-1)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000117')/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.next  ? '' : 'none' }}><NCButton fieldid={'NextBtn'} onClick={ ()=>{this.onStep(1)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000118')/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.finishAndStart  ? '' : 'none' }}><NCButton fieldid={'onsubmitAndC'} onClick={ ()=>{this.onsubmit(true)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000119')/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.finish  ? '' : 'none' }} ><NCButton fieldid={'onsubmit'} onClick={ ()=>{this.onsubmit(false)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000120')/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton fieldid={'cancel'} onClick={ this.cancel }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        )
    }

}

export default Batcheditstepmodal;
//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J