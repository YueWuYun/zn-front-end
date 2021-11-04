//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, { Component } from 'react';
import { base,ajax,toast } from 'nc-lightapp-front';
let { NCSelect, NCButton,NCCheckbox, NCModal, NCStep } = base;
const NCOption = NCSelect.NCOption;
import OptionSelect from './OptionSelect';
import OrgSelect  from './OrgSelect';
import AssignFilter from './AssignFilter';
import ResultGrid from './ResultGrid';

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
                stepCount: 4
            },
            buttonShow:{
                pre:false,
                next:true,
                finish:false,
                finishAndStart:false
            },
            oprValue : this.props.oprValue,
            orgValues : [],
            allpks:[],
            selectMaterialID:[],
            showResult:false,
            assignStatus:undefined

        }
        this.onFinish = this.props.onFinish || EMPTY_FN;
    }

    show = (opr) => {
        this.state.modal.show = true;
        this.state.oprValue = opr;
        this.state.step.current = 0;
        this.state.buttonShow.pre=false;
        this.state.buttonShow.next=true;
        this.state.buttonShow.finish=false;
        this.state.buttonShow.finishAndStart=false;
        this.setState(this.state, ()=>{
            this.OptionSelect.setChangeValue(opr);
        });

    }

    onsubmit = (Con) => {
        if(this.state.step.current === 3){
            if(this.state.selectMaterialID.length === 0){
                toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000134')/* 国际化处理： 请选择数据*/,color:'warning'});
                return;
            }
            ajax({
                url : "/nccloud/uapbd/material/assignMaterial.do",
                data : {
                    ids : this.state.selectMaterialID,
                    targetIds : this.orgSelect.getData(),
                    type : this.state.oprValue
                },
                success : (res) => {
                    let {success,data} = res;
                    if(success){
                        toast({content:this.state.oprValue === 'assign'?(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000135')/* 国际化处理： 分配成功*/):(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000136')/* 国际化处理： 取消分配成功*/),color:'success'});
                        this.state.step.current = 0;
                        this.state.buttonShow.pre=false;
                        this.state.buttonShow.next=true;
                        this.state.buttonShow.finish=false;
                        this.state.buttonShow.finishAndStart=false;
                        if(Con){
                            this.setState(this.state,this.onFinish());
                        }else{
                            this.state.modal.show = false;
                            this.setState(this.state,this.onFinish());
                        }
                    }
                }
            });
        }else if(this.state.step.current === 2){
            let searchdata = this.AssignFilter.getQueryInfo();
            if(!searchdata) return;
            searchdata.pageCode = 'assign';
            searchdata.userdefObj = {type : this.state.oprValue,targetIds:this.orgSelect.getData()}
            ajax({
                url: '/nccloud/uapbd/material/assignMaterialBySql.do',
                data:searchdata,
                success : (res)=>{
                    toast({content:this.state.oprValue === 'assign'?(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000135')/* 国际化处理： 分配成功*/):(this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000136')/* 国际化处理： 取消分配成功*/),color:'success'});
                    if(Con){
                        this.state.step.current = 0;
                        this.state.buttonShow.pre=false;
                        this.state.buttonShow.next=true;
                        this.state.buttonShow.finish=false;
                        this.state.buttonShow.finishAndStart=false;
                        this.setState(this.state);
                        this.onFinish()
                    }else{
                        this.state.modal.show = false;
                        this.setState(this.state);
                        this.onFinish();
                    }
                }
            });
        }
    }
    cancel = () => {
        this.state.modal.show = false;
        this.setState(this.state);
    }

    setOpr = (value) => {
        this.setState({
            oprValue : value
        });
        
    }

    queryData = (pageInfo) => {
        let searchdata = this.AssignFilter.getQueryInfo();
        if(!searchdata) return;
        searchdata.pageCode = 'assign';
        if(!pageInfo){
            pageInfo =this.props.table.getTablePageInfo('material4assign');
        }
        searchdata.pageInfo = pageInfo;
        searchdata.userdefObj = {targetIds:this.orgSelect.getData()}
        ajax({
            url: '/nccloud/uapbd/material/query.do',
            data:searchdata,
            success : (res)=>{
                let {data} = res;
                if(data && data['material4assign']){
                    this.props.table.setAllTableData('material4assign',data['material4assign']);
                    this.state.allpks=data['material4assign'].allpks;
                    this.setState(this.state);
                    if(this.state.selectMaterialID.length>0){
                        let pageSelect = [];
                        data['material4assign'].rows.forEach((item,index)=>{
                            if(this.state.selectMaterialID.indexOf(item.values.pk_material.value) !== -1){
                                pageSelect.push(index);
                            }
                        });
                        if(pageSelect.length>0){
                            this.props.table.selectTableRows('material4assign',pageSelect,true);
                        }
                    }
                }
            }
        });
    }

    updateSelectId = () => {
        let _current_page_data = this.props.table.getAllTableData('material4assign');
        let _current_page_ids = [];
        _current_page_data.rows.forEach(item=>{
            _current_page_ids.push(item.values.pk_material.value);
        });
        let _select_data = this.props.table.getCheckedRows('material4assign');
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
        if(this.state.selectMaterialID.length === 0){
            this.setState({selectMaterialID:_select_ids});
        }else{
            let selectMaterialID = this.state.selectMaterialID;
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
            this.setState({selectMaterialID:selectMaterialID});
        }
    }

    /**
     * 全部全选或取消
     */
    selectAll = (falg) => {
        if(falg){
            this.state.selectMaterialID = this.state.allpks;
        }else{
            this.state.selectMaterialID = [];
        }
        this.setState(this.state);
    }

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

    render() {
        var modalCfg = {...this.state.modal},
            stepCfg ={ ...this.state.step};

        var onStep = (dir) => {
            return () =>{
                var current = this.state.step.current,
                    stepCount = this.state.step.stepCount;
                if(current === 0){//第一步

                }else if(dir > 0&& current === 1){//第二步
                    let selectOrgValues = this.orgSelect.getData();
                    if(selectOrgValues.length === 0){
                        toast({content:'请选择组织',color:'warning'});
                        return;
                    }else{
                        this.setState({
                            orgValues : selectOrgValues
                        });
                    }
                    console.log(selectOrgValues);
                }else if(dir > 0 && current === 2){//第三步
                    if(!this.AssignFilter.getQueryInfo()){
                        return;
                    }
                    let pageInfo = { pageIndex : 0, pageSize : 10 };
                    this.queryData(pageInfo);
                }
                let c;
                if(dir < 0 && current > 0){ //prev step
                    this.state.step.current = current - 1;
                    c=current-1;
                }
                if(dir > 0 && current < stepCount-1){ // next
                    this.state.step.current = current + 1;
                    c = current + 1;
                }
                if(c===0){
                    this.state.buttonShow.pre=false;
                    this.state.buttonShow.next=true;
                    this.state.buttonShow.finish=false;
                    this.state.buttonShow.finishAndStart=false;
                }else if(c===1){
                    this.state.buttonShow.pre=true;
                    this.state.buttonShow.next=true;
                    this.state.buttonShow.finish=false;
                    this.state.buttonShow.finishAndStart=false;
                }else if(c===2){
                    this.state.buttonShow.pre=true;
                    if(this.state.showResult){
                        this.state.buttonShow.next=true;
                        this.state.buttonShow.finish=false;
                        this.state.buttonShow.finishAndStart=false;
                    }else{
                        this.state.buttonShow.next=false;
                        this.state.buttonShow.finish=true;
                        this.state.buttonShow.finishAndStart=true;
                    }
                }else if(c===3){
                    this.state.buttonShow.pre=true;
                    this.state.buttonShow.next=false;
                    this.state.buttonShow.finish=true;
                    this.state.buttonShow.finishAndStart=true;
                }
                this.setState(this.state);
            }
        };
        return (
            <NCModal {...modalCfg}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000133')/* 国际化处理： 向导分配*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                        <NCStep.NCSteps {...stepCfg}>
                            <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000111')/* 国际化处理： 步骤1*/}  description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000139')/* 国际化处理： 选择分配或取消分配操作*/} />
                            <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000112')/* 国际化处理： 步骤2*/}   description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000140')/* 国际化处理： 选择目标组织*/} />
                            <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000113')/* 国际化处理： 步骤3*/}   description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000141')/* 国际化处理： 输入过滤数据的条件*/} />
                            <NCStep title={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000138')/* 国际化处理： 步骤4*/}   description={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000142')/* 国际化处理： 选择分配或取消分配的数据*/} />
                        </NCStep.NCSteps>
                        <div style={{height: '400px',display: this.state.step.current == 0 ? '': 'none'}}><OptionSelect setOpr={this.setOpr} ref={(item)=>this.OptionSelect = item} {...this.props}/></div>
                        <div style={{height: '400px',display: this.state.step.current == 1 ? '': 'none'}}><OrgSelect ref={(item)=> this.orgSelect = item} {...this.props}/></div>
                        <div style={{height: '400px',display: this.state.step.current == 2 ? '': 'none'}}><AssignFilter ref={(item)=>{this.AssignFilter = item}} {...this.props} /></div>
                        <div style={{height: '400px',display: this.state.step.current == 3 ? '': 'none'}}><ResultGrid {...this.props} handlePageInfoChange={this.queryData} updateSelectId={this.updateSelectId} selectAll={this.selectAll}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <div style={{float:"left",display:'flex',alignItems:'center',visibility:this.state.step.current == 2 ? '': 'hidden'}}>
                        <div style={{marginRight: 10}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000127')/* 国际化处理： 分配状态*/}</div>
                        <div style={{marginRight:'40px',width:'100px'}}>
                            <NCSelect onChange={(value)=>{this.setState({assignStatus:value},()=>{this.AssignFilter.setAssignStatus(value);})}} >
                                <NCOption value="1">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000125')/* 国际化处理： 已分配*/}</NCOption>
                                <NCOption value="0">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000126')/* 国际化处理： 未分配*/}</NCOption>
                            </NCSelect>
                        </div>
                        <div style={{width:'120px'}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000102')/* 国际化处理： 是否显示查询结果*/}</div>
                        <div style={{}}>
                                <NCCheckbox defaultChecked={this.state.showResult} checked={this.state.showResult} onChange={(value)=>{this.setState({showResult:value},()=>{this.showResultChange(value);})}}></NCCheckbox>
                        </div>
                    </div>
                    <span style={{display: this.state.buttonShow.pre ? '' : 'none' }}><NCButton onClick={ onStep(-1) }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000117')/* 国际化处理： 上一步*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.next  ? '' : 'none' }}><NCButton onClick={ onStep(1)}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000118')/* 国际化处理： 下一步*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.finishAndStart  ? '' : 'none' }}><NCButton onClick={ ()=>{this.onsubmit(true)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000119')/* 国际化处理： 完成并继续*/}</NCButton></span>
                    <span style={{display: this.state.buttonShow.finish  ? '' : 'none' }} ><NCButton onClick={ ()=>{this.onsubmit(false)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000120')/* 国际化处理： 完成*/}</NCButton></span>
                    <NCButton onClick={ this.cancel.bind(this) }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }  
}
Array.prototype.remove = function(val) { 
    var index = this.indexOf(val); 
    if (index > -1) { 
    this.splice(index, 1); 
    } 
};
export default AssignStepModal;
//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW