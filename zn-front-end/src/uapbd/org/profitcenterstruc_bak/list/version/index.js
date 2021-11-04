//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {base,createPage } from 'nc-lightapp-front';
const {NCDiv} = base;
import VersionData from '../versioncarddata';

let tableid='pfc_v_list';
let  pagecode='10100PFC_v_list';

class ProfitCenterVersion extends Component {

    constructor(props){
        super(props);
        this.loadMeta(props,()=>{
            this.props.editTable.setTableData(tableid, this.props.config.listdata[tableid]);
        });
    }

    loadMeta(props,initData){
        props.createUIDom({
            pagecode : pagecode,
        },
        (data)=>{
            props.meta.setMeta(data.template);
            initData();
        });
    }

    getMemo(event){
        debugger
        this.props.config.getMemo(event.target.value);

    }

    loadCardData(value){
        debugger
        let pk_vid=value.values['pk_vid'];
        let cardData=this.props.config.carddata[pk_vid.value];//卡片数据

        this.props.modal.show('versioncarddata',{
            title : this.props.config.json['10100RESA-000011'],/* 国际化处理： 利润中心版本信息*/
            content : <VersionData config={cardData}/>
        });
    }

    render(){
        debugger

        let {editTable,modal} = this.props;
        let {createEditTable}=editTable;
        let { createModal } = modal;  //模态框

        return (

            <div>
                {createModal('versioncarddata',{noFooter:true})}
                <NCDiv fieldid="pfcversion" areaCode={NCDiv.config.FORM} className='branch' >
                    <table fieldid = 'version_table'>
                        <tr fieldid = 'firsttabletr'>
                            <td fieldid = 'firsttabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100RESA-000012']/* 国际化处理： 新版本号*/}&nbsp;
                                <input name='vno' type='text' readonly='readonly' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} value={this.props.config.vno}/>
                            </td>
                            <td fieldid = 'secondtabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100RESA-000013']/* 国际化处理： 新版本说明*/}&nbsp;
                                <input name='vname' type='text' autofocus='autofocus' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} onBlur={this.getMemo.bind(this)}/>
                            </td>
                            <td fieldid = 'thirdtabletd' className = 'nc-theme-common-font-c' style={{paddingLeft:5,paddingRight:5}}>
                                {this.props.config.json['10100RESA-000014']/* 国际化处理： 新版本生效日期*/}&nbsp;
                                <input name='effectdate' type='text' readonly='readonly' className = 'nc-theme-from-input-bgc nc-theme-common-font-c' style={{width:'200px',height:'30px'}} value={this.props.config.vstartdate}/>
                            </td>
                        </tr>
                    </table>
                </NCDiv>
                <div className="table-area" style={{marginTop:10}}>
                    {createEditTable(tableid, {//列表区
                        onRowDoubleClick:this.loadCardData.bind(this), 
                        useFixedHeader:true,    
                        showIndex:true,				//显示序号
                    })}
                </div>
            </div>

        )
    }

}

export default ProfitCenterVersion = createPage({
    initTemplate: ()=>{},
})(ProfitCenterVersion)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65