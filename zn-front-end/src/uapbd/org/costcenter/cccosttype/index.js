//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 2020/04/27 xianggang5
 * 费用类型参照框
 * 
 */



import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {base,ajax,createPage } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import  Utils from '../../../public/utils'; 
let allTableData={};
class CCCostType extends Component{

    constructor(props){
        super(props);
        this.state={
            searchValue:''
        };
    }

    componentDidMount(){
        let meta={
            cccosttype:{
                code:'cccosttype',
                moduletype:'table',
                name:'',/* 国际化处理： 关联工作中心*/
                items:[
                    {
                        attrcode:'pk_costtype.code',
                        disabled:true,
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"input",
                        label:'费用类型编码',/* 国际化处理： 费用类型编码*/
                        maxlength:"40",
                        position:"1",
                        visible:true
                    },
                    {
                        attrcode:"pk_costtype.name",
                        disabled:true,
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"input",
                        label:'费用类型名称',/* 国际化处理： 费用类型名称*/
                        maxlength:"200",
                        position:"2",
                        visible:true,
                    },
                    {
                        attrcode:"pk_costtype",
                        isDataPowerEnable:true,
                        isTreelazyLoad:false,
                        isrevise:false,
                        itemtype:"refer",
                        label:'费用类型',/* 国际化处理： 费用类型*/
                        maxlength:"20",
                        metadataProperty:"mmbd.bd_wk.vwkname",
                        position:"11",
                        refcode:"",
                        visible:false
                    }
                ]
            }
        }
        this.props.meta.setMeta(meta);
        ajax({
            url:"/nccloud/uapbd/fiacc/CostTypeGridRef.do",
            data:{queryCondition:{'pk_org':this.props.config.pk_org},pageInfo:{pageSize:50,pageIndex:-1}},
            success:(result)=>{
                    let tableData={
                        cccosttype:{
                            areacode:'cccosttype',
                            rows:[]
                        }
                    };
                    let checkFlag;//重复标记（与列表数据若是重复了，则为false）
                    if(result.success&&result.data.rows.length!=0){
                        result.data.rows.forEach((item)=>{
                            //剔除相同元素
                            checkFlag=true;
                            this.props.config.checkCostTypePk.forEach((CostType)=>{
                                if(CostType.value==item.refpk){
                                    checkFlag=false;
                                }
                            });
                            if(checkFlag){
                                tableData.cccosttype.rows.push({
                                    values:{
                                        'pk_costtype.code':{
                                            value:item.refcode,
                                            display:item.refcode
                                        },
                                        'pk_costtype.name':{
                                            value:item.refname,
                                            display:item.refname
                                        },
                                        'pk_costtype':{
                                            value:item.refpk,
                                            display:item.refname
                                        }
                                    }
                                });
                            }
                        });
                    }
                    //没查到数据，需要清空列表数据
                    allTableData=tableData['cccosttype'];
                    this.props.editTable.setTableData('cccosttype', tableData['cccosttype']);

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
        console.log("onSearch",value);
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['pk_costtype.code'].value.indexOf(value)>-1 || row.values['pk_costtype.name'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}

		this.props.editTable.setTableData('cccosttype',allData);
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
					{createEditTable('cccosttype', {
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
export default CCCostType = createPage({
})(CCCostType);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65