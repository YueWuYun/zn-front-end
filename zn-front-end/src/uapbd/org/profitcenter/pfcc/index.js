//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import  Utils from '../../../public/utils'; 
let allTableData={};
class PFCC extends Component{

    constructor(props){
        super(props);
        this.state={
            searchValue:''
        };
    }

    componentDidMount(){
        let meta={
            ccworkcenters:{
                code:'ccworkcenters',
                moduletype:'table',
                name:this.props.config.json['10100CC-000032'],/* 国际化处理： 关联工作中心*/
                items:[
                    {
                        attrcode:'pk_workcenter.vwkcode',
                        disabled:true,
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"input",
                        label:this.props.config.json['10100CC-000033'],/* 国际化处理： 工作中心编码*/
                        maxlength:"40",
                        position:"1",
                        visible:true
                    },
                    {
                        attrcode:"pk_workcenter.vwkname",
                        disabled:true,
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"input",
                        label:this.props.config.json['10100CC-000034'],/* 国际化处理： 工作中心名称*/
                        maxlength:"200",
                        position:"2",
                        visible:true,
                    },
                    {
                        attrcode:"pk_workcenter",
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"refer",
                        label:this.props.config.json['10100CC-000022'],/* 国际化处理： 工作中心*/
                        maxlength:"20",
                        metadataProperty:"mmbd.bd_wk.vwkname",
                        position:"11",
                        refcode:"uapbd/refer/workcenter/WorkCenterGridRef/index",
                        visible:false
                    }
                ]
            }
        }
        this.props.meta.setMeta(meta);
        ajax({
            url:"/nccloud/uapbd/workcenter/WorkCenterGridRef.do",
            data:{queryCondition:{'pk_org':this.props.config.pk_org},pageInfo:{pageSize:50,pageIndex:-1}},
            success:(result)=>{
                    let tableData={
                        ccworkcenters:{
                            areacode:'ccworkcenters',
                            rows:[]
                        }
                    };
                    let checkFlag;//重复标记（与列表数据若是重复了，则为false）
                    if(result.success&&result.data.rows.length!=0){
                        result.data.rows.forEach((item)=>{
                            //剔除相同元素
                            checkFlag=true;
                            this.props.config.checkWorkPK.forEach((workcenter)=>{
                                if(workcenter.value==item.refpk){
                                    checkFlag=false;
                                }
                            });
                            if(checkFlag){
                                tableData.ccworkcenters.rows.push({
                                    values:{
                                        'pk_workcenter.vwkcode':{
                                            value:item.refcode,
                                            display:item.refcode
                                        },
                                        'pk_workcenter.vwkname':{
                                            value:item.refname,
                                            display:item.refname
                                        },
                                        'pk_workcenter':{
                                            value:item.refpk,
                                            display:item.refname
                                        }
                                    }
                                });
                            }
                        });
                    }
                    //没查到数据，需要清空列表数据
                    allTableData=tableData['ccworkcenters'];
                    this.props.editTable.setTableData('ccworkcenters', tableData['ccworkcenters']);

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

    //表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['pk_workcenter.vwkcode'].value.indexOf(value)>-1 || row.values['pk_workcenter.vwkname'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}

		this.props.editTable.setTableData('ccworkcenters',allData);
	}

    render(){
        let {editTable} = this.props;
        let { createEditTable } = editTable;
        let {NCFormControl} = base;
        return(
            <div className="nc-single-table">
				{/* 头部 header */}
				<div className="nc-singleTable-header-area">				
					{/* 标题 title */}
					<div className="header-title-search-area" fieldid = {this.props.config.json['10100CC-000035']+'_title'}>
						{/* 简单查询 */}
						<div className="title-search-detail"  fieldid = 'ccwork_search_area'>								
							<NCFormControl
								placeholder={this.props.config.json['10100CC-000035']/* 国际化处理： 请输入编码或名称筛选*/}
                                type="search"
                                value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
							/>
						</div>
					</div>		
				</div>	
				
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable('ccworkcenters', {
                        onSelected:this.onSelectRow.bind(this),
                        onSelectedAll:this.onSelectRow.bind(this),
                        showCheck:true,
                        showIndex:true,
                        adaptionHeight:true
					})}
				</div>	
			</div>
        )
    }
}
export default PFCC = createPage({
})(PFCC);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65