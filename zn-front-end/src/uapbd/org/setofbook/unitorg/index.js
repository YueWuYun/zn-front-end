//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base,high,toast } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
const {NCForm,NCInput,NCTable} = base;
/*账簿类型	*/
import SetOfBookGridRef from '../../../refer/org/SetOfBookGridRef';

let tableid='bookorgrel';

class UnitOrg extends Component {

    constructor(props) {
        super(props)
        this.state = {
            json:props.json,//多语资源文件数据
            sobref:{
                refpk:this.props.config.refpk,
                refname:this.props.config.refname,
                refcode:this.props.config.refcode
            },
            configs: {}          
        }
        //加载多语资源
		Utils.initPage(
			props,
			"10100SOB_bookorgrel",
			'10100SOB',//多语资源编码
			()=>{},
			()=>{
                this.initData(this);
            },
			this
		);
    }

    initData(_this){

        ajax({
            url: '/nccloud/uapbd/setofbook/orgrelqry.do',
            data: {pk_setofbook:_this.props.config.refpk},
            success:(result)=>{
                let { success, data } = result;
                if (success) {
                    if(!data){
                        data={
                            'bookorgrel':{
                                'rows':[]
                            }
                        }
                        _this.props.editTable.setTableData(tableid, data[tableid]);
                    }
                    data[tableid].rows.forEach(function(item, index, array){
                        if (item.values['accountbooktype'].value == '1') {
                            item.values['accountbooktype'].display = _this.state.json['10100SOB-000022'];/* 国际化处理： 主账簿*/
                        }else if (item.values['accountbooktype'].value == '2'){
                            item.values['accountbooktype'].display = _this.state.json['10100SOB-000023'];/* 国际化处理： 报告账簿*/
                        }else{
                            item.values['accountbooktype'].value = '';
                            item.values['accountbooktype'].display = '';
                        }
                        if (item.values['liabilitybooktype'].value == '1') {
                            item.values['liabilitybooktype'].display = _this.state.json['10100SOB-000022'];/* 国际化处理： 主账簿*/
                        }else if (item.values['liabilitybooktype'].value == '2'){
                            item.values['liabilitybooktype'].display = _this.state.json['10100SOB-000023'];/* 国际化处理： 报告账簿*/
                        }else{
                            item.values['liabilitybooktype'].value = '';
                            item.values['liabilitybooktype'].display = '';
                        }
                    });
                    _this.props.editTable.setTableData(tableid, data[tableid]);
                }
            }
        })
    }

    onRefChange(value){
        this.setState({
            sobref:value
        });
        let _this=this;
        ajax({
            url: '/nccloud/uapbd/setofbook/orgrelqry.do',
            data: {pk_setofbook:value.refpk},
            success:(result)=>{
                let { success, data } = result;
                if (success) {
                    if(!data){
                        data={
                            'bookorgrel':{
                                'rows':[]
                            }
                        }
                        this.props.editTable.setTableData(tableid, data[tableid]);
                    }
                    data[tableid].rows.forEach(function(item, index, array){
                        if (item.values['accountbooktype'].value == '1') {
                            item.values['accountbooktype'].display = _this.state.json['10100SOB-000022'];/* 国际化处理： 主账簿*/
                        }else if (item.values['accountbooktype'].value == '2'){
                            item.values['accountbooktype'].display = _this.state.json['10100SOB-000023'];/* 国际化处理： 报告账簿*/
                        }else{
                            item.values['accountbooktype'].value = '';
                            item.values['accountbooktype'].display = '';
                        }
                        if (item.values['liabilitybooktype'].value == '1') {
                            item.values['liabilitybooktype'].display = _this.state.json['10100SOB-000022'];/* 国际化处理： 主账簿*/
                        }else if (item.values['liabilitybooktype'].value == '2'){
                            item.values['liabilitybooktype'].display = _this.state.json['10100SOB-000023'];/* 国际化处理： 报告账簿*/
                        }else{
                            item.values['liabilitybooktype'].value = '';
                            item.values['liabilitybooktype'].display = '';
                        }
                    });
                    this.props.editTable.setTableData(tableid, data[tableid]);
                }
            }
        })
    }

    render(){

        let { editTable } = this.props;
		let { createEditTable } = editTable;

        return (

            <div style={{marginTop: -15}}>
				<div className="header" style={{paddingLeft: 0,border:'none'}}>
                    <span style={{marginRight:'16px'}} className = 'nc-theme-common-font-c'>{this.state.json['10100SOB-000020']/* 国际化处理： 账簿类型*/}:</span>{SetOfBookGridRef({
                        isTreelazyLoad:false,
                        //queryCondition:orgPermCondition,
                        onChange:this.onRefChange.bind(this),
                        value:this.state.sobref
                    })}
                </div>
				<div className="table-area">
					{createEditTable(tableid, {//列表区
						showIndex:true,				//显示序号                            // 自定义传参
                        useFixedHeader:true,
						adaptionHeight:true
					})}
				</div>
            </div>
        )
    }

}

UnitOrg = createPage({
	initTemplate: ()=>{}
})(UnitOrg);
export default UnitOrg;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65