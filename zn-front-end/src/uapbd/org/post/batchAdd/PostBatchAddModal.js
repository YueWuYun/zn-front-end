//6MDc8FsQhXaR5cNofmIGGtaX6y5mUHbJX0Nz61NwZi37/x+rbL6CnfvBXtjJueRf
import React, {Component} from 'react';
import {base, ajax, toast} from 'nc-lightapp-front';
const {NCButton, NCModal, NCStep} = base;
import ResultGrid from '../../../public/pubComponent/ResultGrid';
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import DataSelect from './DataSelect';
import BusinessSelect from './BusinessSelect';

class PostBatchAddModal extends Component{


    constructor(props) {
        super(props);
        this.state = {
            myModal: {
                modalDropup: true,
                size: 'xlg',
                backdrop: true /false ,//是否弹出遮罩层/点击遮罩层是否触发关闭事件
            },
            step: {
                current: 0,
                stepCount: 5
            },
            show: false,
            context:{},
            checkOrg:'',
            checkDept:[],
            checkJob:[],
            stepCheckedRows:[],
            stepCheckRowkeys:[],
            json:props.json
        }
        this.config = props.config;
    }
    //完成，完成并继续方法
    onsubmit = (contiFlag) => {
        let{step,stepCheckedRows} = this.state;
        let{current} = step;
        let{editTable,pagecode} =this.props;
        if(current ==3&&stepCheckedRows.length==0){
            toast({
                color:'warning',
                content:this.state.json['10100POST-000009']/* 国际化处理： 请选择岗位数据！*/
            });
            return;
        }
        let batchAddRows = current ==3?{
            model:{rows:stepCheckedRows},
            pageid:pagecode
        }:{
            model:editTable.getAllData('batchEditGrid'),
            pageid:pagecode
        };
        ajax({
            url: '/nccloud/uapbd/post/batchAddSave.do',
            data: batchAddRows,
            success: (res) => {
                let {success, data} = res;

                if(success){
                    if(data){
                        toast({color: 'success', title: this.state.json['10100POST-000010']});/* 国际化处理： 操作成功！*/
                        if(contiFlag){
                            this.continueAdd()
                        }else{
                            this.state.show = false;
                            this.state.step.current = 0;
                            this.state.checkOrg = '',
                                this.state.checkDept =[],
                                this.state.checkJob = [],
                                this.state.stepCheckedRows=[]
                            this.setState(this.state);
                        }
                    }
                }
            }
        });
    }
    //完成并继续
    continueAdd = ()=>{
        this.state.show = true;
        this.state.step.current = 0,
        this.setState(this.state);
    }
    //第一步业务单元切换方法
    businessOnChange = (val)=>{
        this.state.checkOrg = val;
        this.setState(this.state);
    }
    //模态关闭
    cancel = () => {
        confirmUtil.call(this,{
            title:this.state.json['10100POST-000011'],/* 国际化处理： 确认取消*/
            content:this.state.json['10100POST-000012'],/* 国际化处理： 是否确认要取消？*/
            beSureBtnClick:()=>{
                this.state.show = false;
                this.state.step.current = 0;
                this.state.checkOrg = '',
                    this.state.checkDept =[],
                    this.state.checkJob = [],
                    this.state.stepCheckedRows=[]
                this.setState(this.state);
            }
        });
    }
    //下一步上一步方法
    onStep = (dir) => {
        let{current,stepCount} = this.state.step;
        let{stepCheckedRows,checkOrg} = this.state;
        let modalTitle = this.state.json['10100POST-000008'];
        if (dir < 0 && current > 0) { //prev step
            current -= 1;
        }
        if (dir > 0 && current <= stepCount - 1) { // next
            current += 1;
        }

        switch(current){
            case 1:
                if(!!!checkOrg.refpk){
                    toast({color:'warning',title:this.state.json['10100POST-000013']});/* 国际化处理： 请选择业务单元！*/
                    return;
                }
                modalTitle = this.state.json['10100POST-000014'];/* 国际化处理： 选择部门*/
                dir > 0 && this.deptSelect.getData().length==0 && this.deptSelect.initTreeData(this.state.checkOrg.refpk,'/nccloud/uapbd/post/queryDeptTree.do',this.state.json['10100POST-000015']);/* 国际化处理： 部门*/
                this.state.step.current = current;
                this.state.myModal.modalTitle = modalTitle;
                this.setState(this.state);
                break;
            case 2:
                // 特殊处理一下： 当第四步勾选了岗位，然后点击上一步返回第三步，
                // 再次点击下一步到第四步，但是不选择岗位数据
                // 接着点击下一步，会将原选择的岗位数据带到下一步的问题
                this.state.stepCheckedRows = [];
                this.state.stepCheckRowkeys = [];
                if(this.deptSelect.getData().length==0){
                    toast({
                        color:'warning',
                        content:this.state.json['10100POST-000016']/* 国际化处理： 请选择部门！*/
                    });
                    return;
                }
                modalTitle = this.state.json['10100POST-000017'];/* 国际化处理： 选择职务*/
                this.state.checkDept =this.deptSelect.getData();
                dir > 0 && this.jobSelect.getData().length==0 &&  this.jobSelect.initTreeData('','/nccloud/uapbd/post/queryJobTree.do',this.state.json['10100POST-000018']);/* 国际化处理： 职务*/
                this.state.step.current = current;
                this.state.myModal.modalTitle = modalTitle;
                this.setState(this.state);
                break;
            case 3:
                if(this.jobSelect.getData().length==0){
                    toast({
                        color:'warning',
                        content:this.state.json['10100POST-000019']/* 国际化处理： 请选择职务！*/
                    });
                    return;
                }
                modalTitle = this.state.json['10100POST-000020'];/* 国际化处理： 选择创建岗位*/
                this.state.checkJob = this.jobSelect.getData();
                this.state.step.current = current;
                this.state.myModal.modalTitle = modalTitle;
                this.props.table.setAllTableData('batchSimpleGrid',{rows:[]});
                this.props.editTable.setTableData('batchEditGrid',{rows:[]});
                this.setState(this.state,()=>{
                    ajax({
                        url:'/nccloud/uapbd/post/loadBatchAddData.do',
                        data:{
                            checkOrg:this.state.checkOrg.refpk,
                            checkDept:this.state.checkDept,
                            checkJob:this.state.checkJob,
                            pagecode:this.props.pagecode,
                            gridId:'batchSimpleGrid'
                        },
                        success:(res)=>{
                            let {success,data} = res;
                            if(success){
                                if(data){
                                    this.props.table.setAllTableData('batchSimpleGrid',data['batchSimpleGrid'])
                                }
                            }
                        }
                    });
                });
                break;
            case 4:
                if(stepCheckedRows.length==0){
                    toast({color:'warning',title:this.state.json['10100POST-000009']});/* 国际化处理： 请选择岗位数据！*/
                    return;
                }
                //
                this.props.table.setAllTableData('batchSimpleGrid',{rows:[]});
                this.props.editTable.setTableData('batchEditGrid',{rows:[]});

                this.props.editTable.setStatus('batchEditGrid','edit',()=>{
                    this.props.editTable.setTableData('batchEditGrid',{rows:stepCheckedRows});
                });
                modalTitle = this.state.json['10100POST-000021'];/* 国际化处理： 编辑选择岗位*/
                this.state.stepCheckedRows = [];
                this.state.step.current = current;
                this.state.myModal.modalTitle = modalTitle;
                this.setState(this.state);
                break;
            default:
                modalTitle = this.state.json['10100POST-000022']/* 国际化处理： 选择业务单元*/
                this.state.step.current = current;
                this.state.myModal.modalTitle = modalTitle;
                this.setState(this.state);
                break;


        }
    };
    //第四步行全选事件
    onSelectedAll = (props, moduleId, status,length)=>{
        let checkedRows = props.table.getCheckedRows(moduleId);
        checkedRows.map((record)=>{
            this.state.stepCheckedRows.push(record.data);
        });
        this.setState(this.state);

    }
    //第四步行选中事件
    gridBeChecked = (props,moduleId,record,index,status)=>{
        let {stepCheckRowkeys,stepCheckedRows}  =this.state;
        console.log(record,status);
        if(!stepCheckRowkeys.includes(record.key)&&status){
            stepCheckRowkeys.push(record.key);
            //这个key不知道是干啥的 不删除的话后台转化报错，因为record.values里面的结构是{String:Objecy},key是{Sting:String}
            delete record.key;
            let editTablerow = {
                values:record
            }
            stepCheckedRows.push(editTablerow);
        }
        if(!status){
            let inx = stepCheckRowkeys.findIndex(i=>i==record.key);
            inx!==-1&&stepCheckRowkeys.splice(inx,1);
            inx!==-1&&stepCheckedRows.splice(inx,1);

        }
        this.setState(this.state);
    }
    //模态显示
    show = () => {
        this.state.show = true;
        this.setState(this.state);
    }

    render() {
        const config = this.state.myModal;
            return (
                <NCModal {...config} show={this.state.show} onHide={this.cancel.bind(this)} fieldid={"batchAdd"}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.state.myModal.modalTitle}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{width: '80%',marginLeft: '10%',marginBottom:'10px'}}>
                            <NCStep.NCSteps {...this.state.step}>
                                <NCStep title={this.state.json['10100POST-000023']} description={this.state.json['10100POST-000022']}/>{/* 国际化处理： 步骤1,选择业务单元*/}
                                <NCStep title={this.state.json['10100POST-000024']} description={this.state.json['10100POST-000014']}/>{/* 国际化处理： 步骤2,选择部门*/}
                                <NCStep title={this.state.json['10100POST-000025']} description={this.state.json['10100POST-000017']}/>{/* 国际化处理： 步骤3,选择职务*/}
                                <NCStep title={this.state.json['10100POST-000026']} description={this.state.json['10100POST-000020']}/>{/* 国际化处理： 步骤4,选择创建岗位*/}
                                <NCStep title={this.state.json['10100POST-000027']} description={this.state.json['10100POST-000021']}/>{/* 国际化处理： 步骤5,编辑选择岗位*/}
                            </NCStep.NCSteps>
                        </div>
                        <div style={{display: this.state.step.current == 0 ? '' : 'none'}}>
                            <BusinessSelect
                                ref={(item => this.businessSelect = item)} {...{
                                json:this.state.json,
                                pageprops:this.props,
                                context:this.state.context,
                                checkedOrg:this.state.checkOrg,
                                businessOnChange:this.businessOnChange
                            }}/></div>
                        <div style={{height:300,display: this.state.step.current == 1 ? '' : 'none'}}>
                            <DataSelect
                                ref={(item => this.deptSelect = item)} {...{
                                pageprops: this.props,
                                json:this.state.json
                            }}/></div>
                        <div style={{height:300,display: this.state.step.current==2 ? '' : 'none'}}>
                            <DataSelect
                                ref={(item => this.jobSelect = item)} {...{
                                pageprops: this.props,
                                json:this.state.json
                            }}/></div>
                        <div style={{height:350, display: this.state.step.current == 3 ? '' : 'none'}}>
                            <ResultGrid
                                ref={(item => this.resultgrid = item)} {...{
                                pageprops: this.props,
                                gridId:'batchSimpleGrid',
                                simpleOrEdit:'simple',
                                height:'300px',
                                showHeadButtons:false,
                                onSelected: this.gridBeChecked,
                                onSelectedAll:this.onSelectedAll,
                                json:this.state.json
                            }}/>
                        </div>
                        <div style={{height:350, display: this.state.step.current == 4 ? '' : 'none'}}>
                            <ResultGrid
                                ref={(item => this.editResultGrid = item)} {...{
                                pageprops: this.props,
                                gridId:'batchEditGrid',
                                json:this.state.json,
                                simpleOrEdit:'edit',
                                height:'300px'
                            }}/>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                    <span style={{display: this.state.step.current == 0 ? 'none' : ''}}><NCButton fieldid={"postbatchlast"}
                        onClick={this.onStep.bind(this, -1)}>{this.state.json['10100POST-000028']}</NCButton></span>{/* 国际化处理： 上一步*/}
                        <span
                            style={{display: (this.state.step.current >= 3 ) ? '' : 'none'}}><NCButton fieldid={"postbatchfinished"}
                            onClick={this.onsubmit.bind(this,false)}>{this.state.json['10100POST-000029']}</NCButton></span>{/* 国际化处理： 完成*/}
                        <span
                            style={{display: (this.state.step.current == 4 ) ? '' : 'none'}}><NCButton fieldid={"postbatchfinishedgo"}
                            onClick={this.onsubmit.bind(this,true)}>{this.state.json['10100POST-000030']}</NCButton></span>{/* 国际化处理： 完成并继续*/}
                        <span
                            style={{display: (this.state.step.current == 4) ? 'none' : ''}}><NCButton fieldid={"postbatchnext"}
                            onClick={this.onStep.bind(this, 1)}>{this.state.json['10100POST-000031']}</NCButton></span>{/* 国际化处理： 下一步*/}
                        <NCButton fieldid={"postbatchcancel"} onClick={this.cancel.bind(this)}>{this.state.json['10100POST-000032']}</NCButton>{/* 国际化处理： 取消*/}
                    </NCModal.Footer>
                </NCModal>
            );


    }

}
export default PostBatchAddModal;

//6MDc8FsQhXaR5cNofmIGGtaX6y5mUHbJX0Nz61NwZi37/x+rbL6CnfvBXtjJueRf