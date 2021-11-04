//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 2020/04/27 xianggang5
 * 费用类型版本化参照框
 * 
 */



import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import  Utils from '../../../public/utils'; 
let allTableData={};
class CCVersion extends Component{

    constructor(props){
        super(props);
        this.CCVersion_formId = 'version_form';
        this.CCVersion_tableId = 'version_table' ;
    }

    componentDidMount(){
        //进来会做版本化的内容查询
        //加载meta
        let meta = this.props.config.meta;
        this.props.meta.setMeta(meta);
        this.setDefaultInfo(); //版本化弹框的预置信息处理
        let pk_costcenter = this.props.config.pk_costcenter;
        if(pk_costcenter){
            pk_costcenter = pk_costcenter.value;
        }
        let querydata={//准备查询版本化成本中心的数据
            pk_costcenter:pk_costcenter,
            areacode:this.CCVersion_tableId
        }
        this.queryVerionTable(querydata); //版本化查询事件
    }

    //版本化表头的预置信息处理
    setDefaultInfo(){
        this.props.form.setFormStatus(this.CCVersion_formId, 'edit');
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let versiondata ={
            vname:{ value:"初始版本"},
            vno:{ value:`${year}${month<10?`0${month}`:`${month}`}`},
            effectivedate:{ value:`${year}${`-`}${month<10?`0${month}`:`${month}`}${`-`}${date<10?`0${date}`:`${date}`}` + ' 00:00:00'},
            expirationdate:{ value:"9999-12-12 00:00:00"},
        };
        this.props.form.setFormItemsValue(this.CCVersion_formId,versiondata);
        this.loadVersion();
    }

    //版本化界面的表单数据加载到主界面(初始进来会处理，编辑后改变值后会处理)
    loadVersion(){
        let formModelData = this.props.form.getAllFormValue(this.CCVersion_formId);//获取所有的表单数据
        let formData= {
			model: formModelData,
			pageid:'10100CC_costcenter'
        }
        console.log("formData",formData);
        this.props.config.loadVersionData(formData);
    }
    //版本化查询
    queryVerionTable(querydata){
        ajax({
            url:"/nccloud/uapbd/costcenter/costcenterversionquery.do",
            data:querydata,
            success:(result)=>{
                let {success ,data} = result ;
                if(success && data){
                    console.log("queryVersionAjax",data,data[this.CCVersion_tableId],data[this.CCVersion_tableId].rows,data[this.CCVersion_tableId].rows.values);
                    this.props.editTable.setTableData(this.CCVersion_tableId,data[this.CCVersion_tableId]);
                }
            }
        });
    }

    //行单击事件
    onSelectRow(props,moduleId,record,index,status){
        let selectWorkData=[];
        props.editTable.getCheckedRows(moduleId).forEach((item)=>{
            selectWorkData.push(item.data);
        });
        props.config.loadWork(selectWorkData);
    }

    //编辑后事件
    onFormAfterEvent(props, moduleId, key,value,oldValue){
        this.loadVersion();
    }
    render(){
        let {editTable,form} = this.props;
        let { createEditTable } = editTable;
        let {createForm} = form;
        return(
            <div className="nc-single-table">
				{/* 头部 header */}
				<div>				
                    {createForm('version_form',{
                            setVisibleByForm:true,
                            adaptionHeight:true,
                            onAfterEvent:this.onFormAfterEvent.bind(this)
                        })}
				</div>	
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable('version_table', {
                        showIndex:true,
                        adaptionHeight:true
					})}
				</div>	
			</div>
        )
    }
}
export default CCVersion = createPage({
})(CCVersion);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65