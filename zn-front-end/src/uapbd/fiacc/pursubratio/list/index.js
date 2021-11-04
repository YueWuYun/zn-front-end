//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import React, { Component } from 'react';
import { createPage, base ,getMultiLang} from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, doubleClick } from './events';
import { tableId, searchId,pkname,dataSource,multiLangCode,module} from './constants';
import {onListButtonControl} from '../common/buttonVisible'; 
const { NCDiv } = base;

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageId = this.props.getSearchParam("p");
		this.Info = {
			allButtonsKey :[],//保存所有头部按钮
		}
		this.state = {
			json:{}
		}
	}


	componentWillMount(){
		//进入界面先加载多语，然后渲染界面模板
		let callback = (json) => {
			this.setState({json:json},() => {
				initTemplate.call(this, this.props,this.initShow);
			});
		}
		getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
	}

	initShow =()=>{
		//如果列表有缓存数据，就会先将缓存数据渲染到表格，然后调用componentInitFinished中的方法
		if(!this.props.table.hasCacheData(dataSource)){
			this.onSelected();//没有缓存的话，就直接控制按钮
		}
	}


	//列表控制按钮
	onSelected = () => {
		onListButtonControl.call(this,this.props);
	};

	

	render() {
		let { table, search } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER}>
				<div className="nc-bill-header-area">
					<div className="header-title-search-area" >
						{createBillHeadInfo({
							title: this.state.json['10140CCSD-000000'],//国际化处理： 采购件分项比例维护
							initShowBackBtn: false
							})}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head_area',
							buttonLimit: 6,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId,{
						clickSearchBtn: searchBtnClick.bind(this),//   点击按钮事件
						showAdvBtn: true,                         //  显示高级按钮
					})}
				</div>
				
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,//单页应用缓存key
						pkname: pkname,//单页应用缓存主键名字(该名字为表的主键名字)
						handlePageInfoChange: pageInfoClick.bind(this),//翻页事件
						showCheck: true,//显示复选框
						showIndex: true,//显示序号
						onRowDoubleClick: doubleClick.bind(this),//行双击事件
						onSelected: this.onSelected.bind(this),//单选事件
						onSelectedAll:this.onSelected.bind(this),//全选事件
						componentInitFinished:()=>{//表格渲染完之后处理事件
							this.onSelected();
						}
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
})(List);

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65