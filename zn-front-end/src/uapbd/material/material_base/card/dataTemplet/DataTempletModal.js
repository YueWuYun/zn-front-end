//rswyWFjIkqmXXTiv0CVVfelxIpUCBzU3ZVFdQF+dIK86A164/hoZR/ZQQB2/GLJe
import React, { Component } from 'react';
import {  base,ajax,toast,promptBox } from 'nc-lightapp-front';
let { NCTable, NCButton, NCModal,NCFormControl,NCCheckbox,NCForm } = base;
const NCFormItem = NCForm.NCFormItem;
const urls = {
    saveMaterialDataTemlet:"/nccloud/uapbd/material/saveMaterialDataTemlet.do",//保存物料数据模板
    queryMaterialDataTemlet:"/nccloud/uapbd/material/queryMaterialDataTemlet.do",//加载物料数据模板列表
    queryMaterialDataByTemletId:"/nccloud/uapbd/material/queryMaterialDataByTemletId.do",//通过模板id加载页面物料信息
    updateDefaultStatus:"/nccloud/uapbd/material/updateDefaultStatus.do",//设置默认数据模板
    deleteMaterialDataTemplet:"/nccloud/uapbd/material/deleteMaterialDataTemplet.do"//删除数据模板
}
var EMPTY_FN = function(){};
class DataTempletModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal:{
                show: false,
                fieldid:'datatemplet',
                size: 'lg'
            },
            saveModal:{
                fieldid:'saveModal',
                show:false,
                siz:'sm'
            },
            tableData : [],
            funcode:'',
            reqData:{},
            name:'',
            isDefault:false,
            checked_pk:'',
            default_pk:''
        }
        this.selectTempletEvt = props.selectTempletEvt || EMPTY_FN;
        this.loadDataAfter = props.loadDataAfter || EMPTY_FN;
    }

    show = (funcode,reqData,checked_pk) => {
        this.state.modal.show = true;
        this.state.saveModal.show = false;
        this.state.funcode = funcode;
        this.state.reqData = reqData;
        this.setState(this.state,this.loadData);
    }

    loadData = () =>{
        ajax({
            url : urls['queryMaterialDataTemlet'],
            data:{funcode:this.state.funcode},
            success:(res) => {
                let {success,data} = res;
                if(data && data.templetData){
                    this.setState({tableData:this.convert(data.templetData)},()=>{this.loadDataAfter(this.state.checked_pk,this.state.default_pk)});
                }else{
                    this.setState({tableData:[]},()=>{this.loadDataAfter(this.state.checked_pk,this.state.default_pk)});
                }
            }
        });
    }

    convert = (data) => {
        let arr = [];
        data.forEach(element => {
            if(element.isdefault){
                this.setState({default_pk:element.pk_datatemplet_id});
            }
            let row = {
                templet_name : element.templet_name,
                isdefault : element.isdefault,
                pk_datatemplet_id : element.pk_datatemplet_id
            };
            arr.push(row);
        });
        return arr;
    }

    /**
     * 保存数据模板
     */
    save=()=>{
        if(!this.state.name || this.state.name.trim() === ''){
            toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,color:'warning',content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000078')/* 国际化处理： 请填写模板名称！*/});
            return
        }
        let reqData = this.state.reqData;
        reqData.userjson = `{\"funcode\":\"${this.state.funcode}\",\"name\":\"${this.state.name}\",\"isDefault\":${this.state.isDefault}}`;
        ajax({
            url:urls['saveMaterialDataTemlet'],
            data:reqData,
            success:(res)=>{
                let {success,data} = res;
                if(data && data.templetData){
                    this.setState({tableData:this.convert(data.templetData)});
                }else{
                    this.setState({tableData:[]});
                }
                this.state.modal.show = false;
                this.state.saveModal.show = false;
                this.setState(this.state);
                toast({title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089')/* 国际化处理： 保存成功*/,color:'success'});
            }
        });
    }

    /**
     * 设置默认模板
     */
    updateDefaultTemplet = (pk_datatemplet_id,isDefault) => {
        if(!isDefault){
            this.setState({
                default_pk : ''
            });
        }
        ajax({
            url : urls['updateDefaultStatus'],
            data : {
                pk_datatemplet_id : pk_datatemplet_id,
                isDefault : isDefault,
                funcode : this.state.funcode
            },
            success : (res) => {
                let {success,data} = res;
                if(data && data.templetData){
                    this.setState({tableData:this.convert(data.templetData)});
                }else{
                    this.setState({tableData:[]});
                }
            }
        });
    }

    /**
     * 删除数据模板
     */
    deleTemplet = (pk_datatemplet_id) =>{
        promptBox({
            color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046')/* 国际化处理： 确认删除*/ ,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000090')/* 国际化处理： 确认删除该数据吗？*/ ,             // 提示内容,非必输
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
            cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
            beSureBtnClick: () => {
                ajax({
                    url : urls['deleteMaterialDataTemplet'],
                    data : {
                        pk_datatemplet_id : pk_datatemplet_id,
                        funcode : this.state.funcode
                    },
                    success : (res) => {
                        let {data} = res;
                        if(data && data.templetData){
                            this.setState({tableData:this.convert(data.templetData)});
                        }else{
                            this.setState({tableData:[]});
                        }
                    }
                });
            }
        });
    }

    /**
     * 选择默认模板
     */
    selectTemplet(pk_datatemplet_id) {
        promptBox({
            color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000088')/* 国际化处理： 确认*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            content: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000079')/* 国际化处理： 是否要导入数据模板数据，这样会清空您录入的信息？*/,             // 提示内容,非必输
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
            cancelBtnName: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
            beSureBtnClick: () => {
                ajax({
                    url : urls['queryMaterialDataByTemletId'],
                    data : {
                        pk_datatemplet_id : pk_datatemplet_id
                    },
                    success : (res) => {
                        this.state.modal.show = false;
                        this.state.checked_pk = pk_datatemplet_id;
                        this.setState(this.state,()=>{
                            this.selectTempletEvt(res.data);
                        })
                     }
                    });
            }
        });
    }

    /**
     * 设置选择模板
     */
    setSelected=(pk_datatemplet_id)=>{
        this.setState({checked_pk:pk_datatemplet_id});
    }

    render() {
        const columns = [
            /* { title: '', dataIndex: 'checkbox', key: 'checkbox', width: 50,render:(text,record,index)=>{
                return <NCCheckbox onChange={(value)=>{this.selectTemplet(record.pk_datatemplet_id)}} checked = {record.pk_datatemplet_id===this.state.checked_pk?true:false}/>;
                } 
            }, */
            { title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000080')/* 国际化处理： 模板名称*/, dataIndex: 'templet_name', key: 'templet_name', width: 200 },
            { title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000081')/* 国际化处理： 默认模板*/, dataIndex: 'isdefault', key: 'isdefault',width: 120, render:(text,record,index) => {
                return <NCCheckbox onChange={(value)=>{this.updateDefaultTemplet(record.pk_datatemplet_id,value)}} checked = {record.pk_datatemplet_id===this.state.default_pk?true:false}/>;
                }
            },
            { title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/, dataIndex: 'delete', key: 'delete', width: 80 ,render:(text,record,index)=>{
            return (<div><a href='javascript:;' onClick={()=>{this.deleTemplet(record.pk_datatemplet_id)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000056')/* 国际化处理： 删除*/}</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onClick={()=>{this.selectTemplet(record.pk_datatemplet_id)}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000082')/* 国际化处理： 调用模板*/}</a></div>);
                }
            },
        ];
        return (
            <div>
            <NCModal fielid = 'datatemp' {...this.state.modal}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000083')/* 国际化处理： 模板*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCTable 
                        columns={columns} 
                        data={this.state.tableData}
                        emptyText={()=>this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000084')/* 国际化处理： 无模板*/}
                    />
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton fieldid = 'save' onClick={ ()=>{this.state.saveModal.show=true;this.setState(this.state)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000085')/* 国际化处理： 保存模板*/}</NCButton>
                    <NCButton fieldid = 'cancel' onClick={ ()=>{this.state.modal.show=false;this.setState(this.state)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>

            <NCModal {...this.state.saveModal}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000085')/* 国际化处理： 保存模板*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCForm showSubmit={false}>
                        <NCFormItem inline={true}  isRequire={false} labelName={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000080')/* 国际化处理： 模板名称*/} >
                            <NCFormControl fieldid = 'templ' type={'text'} value={this.state.name} onChange={(value)=>this.setState({name:value})} />
                        </NCFormItem>
                        <NCFormItem inline={true} isRequire={false} labelName={this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000087')/* 国际化处理： 默认*/}>
                            <NCCheckbox onChange={(value)=>this.setState({isDefault:value})} checked = {this.state.isDefault}></NCCheckbox>
                        </NCFormItem>
                    </NCForm>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton fieldid = 'sure' onClick={ this.save }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000088')/* 国际化处理： 确认*/}</NCButton></span>
                    <NCButton onClick={ ()=>{this.state.saveModal.show=false;this.setState(this.state)} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                </NCModal.Footer>
            </NCModal>
        </div>
        );
    }  
}
export default DataTempletModal;
//rswyWFjIkqmXXTiv0CVVfelxIpUCBzU3ZVFdQF+dIK86A164/hoZR/ZQQB2/GLJe