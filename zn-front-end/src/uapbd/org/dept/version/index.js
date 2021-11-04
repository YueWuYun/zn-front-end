//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {base,ajax,createPage } from 'nc-lightapp-front';
const {NCForm,NCInput,NCTable,NCDiv} = base;
import DeptVersionData from '../versioncarddata';

let tableid='versioninfo';
let  pagecode='10100DEPT_dept_v_list';
let appid='0001Z0100000000081E1';

class DeptVersion extends Component {

    constructor(props){
        super(props);
        this.loadMeta(props,()=>{
            this.props.editTable.setTableData(tableid, this.props.config.listdata[tableid]);
        });
    }

    loadMeta(props,initData){
        props.createUIDom({
            pagecode : pagecode,
            appid : appid
        },
        (data)=>{
            props.meta.setMeta(data.template);
            initData();
        });
    }

    getMemo(event){

        this.props.config.getMemo(event.target.value);

    }

    loadCardData(value){
        let pk_vid=value.values['pk_vid'];
        let cardData=this.props.config.carddata[pk_vid.value];//卡片数据

        this.props.modal.show('versioncarddata',{
            title : this.props.config.json['10100DEPT-000075'],/* 国际化处理： 部门版本信息*/
            content : <DeptVersionData config={cardData}/>
        });
    }

    render(){

        let {editTable,modal} = this.props;
        let {createEditTable}=editTable;
        let { createModal } = modal;  //模态框

        return (
            
            <div>
                {createModal('versioncarddata',{noFooter:true})}
                <NCDiv fieldid="deptversion" areaCode={NCDiv.config.FORM} className='branch' >
                    <table fieldid = 'version_table'>
                        <tr fieldid = 'firsttabletr'>
                            <td fieldid = 'firsttabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100DEPT-000076']/* 国际化处理： 新版本号*/}&nbsp;
                                <input name='vno' type='text' readonly='readonly' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} value={this.props.config.vno}/>
                            </td>
                            <td fieldid = 'secondtabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100DEPT-000073']/* 国际化处理： 新版本说明*/}&nbsp;
                                <input name='vname' type='text' autofocus='autofocus' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} onBlur={this.getMemo.bind(this)}/>
                            </td>
                            <td fieldid = 'thirdtabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100DEPT-000074']/* 国际化处理： 新版本生效日期*/}&nbsp;
                                <input name='veffectdate' type='text' readonly='readonly' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} value={this.props.config.veffectdate}/>
                            </td>
                        </tr>
                    </table>
                </NCDiv>
                <div className="table-area" style={{marginTop:10}}>
                    {createEditTable(tableid, {//列表区
                        onRowDoubleClick:this.loadCardData.bind(this),
                        //onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
                        useFixedHeader:true,    
                        //selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        //statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
                        showIndex:true,				//显示序号
                        //showCheck:true			//显示复选框
                        //params: 'test',                                  // 自定义传参
                    })}
                </div>
            </div>

        )
    }

}

export default DeptVersion = createPage({
    initTemplate: ()=>{},
})(DeptVersion)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65