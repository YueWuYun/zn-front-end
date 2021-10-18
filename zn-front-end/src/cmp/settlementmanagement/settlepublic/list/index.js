/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
// 结算被联查页面
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, createPageIcon,getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const { NCDiv } = base;
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_pageid;
		this.state = {
			pk: '',
			url: '',
			appcode: '',
			pagecode: '',
			direction: {}
		}
		initTemplate.call(this, props);
	}
	//加载多语
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
		};
		// getMultiLang({ moduleId: [Templatedata.list_moduleid,'36070'], domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
			},
			callback
		});
	}

	componentDidMount() {
		let key = this.props.getUrlParam('callback');
		let appcode = this.props.getUrlParam('callbackappcode');
		let pagecode = this.props.getUrlParam('callbackpagecode');
		// 收付方向 0收 1付
		let direction = this.props.getUrlParam('src');
		if (!direction) {
			direction = 0;
		}
		let srcvalue;
		// 结算页面右键悬停不显示display
		if (direction == 0) {
			srcvalue = { value: direction, display: '收款' }
		} else {
			srcvalue = { value: direction, display: '付款' }
		}
		// if (direction == 0) {
		// 	srcvalue = {value:direction};
		// }
		if (key) {
			this.setState({
				url: key,
				appcode: appcode,
				pagecode: pagecode,
				direction: srcvalue
			})
		}

	}
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		// 设置收付方向
		debugger
		let srcvalue = this.state.direction;
		if (srcvalue) {
			this.props.search.setSearchValByField(this.searchId, 'direction',
				srcvalue);
			this.props.search.setDisabledByField(this.searchId, 'direction', true);
		}
	}
	// 高级查询面板中的清空按钮 点击事件钩子，用于业务组清除自定义查询条件值
	advSearchClearEve = () => {
		// 设置收付方向,不允许清空
		let srcvalue = this.state.direction;
		if (srcvalue) {
			this.props.search.setSearchValByField(this.searchId, 'direction',
				srcvalue);
			this.props.search.setDisabledByField(this.searchId, 'direction', true);
		}
	}
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	getData = (serval) => {

		let searchVal = this.props.search.getAllSearchData(this.searchId).conditions;//新盘适配插叙条件
		let sendVal = searchVal.concat(serval);
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);

		let conditions = [];
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions
			},
			// conditions: searchVal.conditions || searchVal,
			pageInfo: pageInfo,
			pageCode: Templatedata.list_pageid,
			queryAreaCode: Templatedata.list_searchid,  //查询区编码
			oid: Templatedata.list_oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: Templatedata.query,
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	};
	//刷新列表
	refresh = () => {
		let table_id = Templatedata.list_tableid;;
		let search_id = Templatedata.list_searchid;
		let page_id = Templatedata.list_pageid;

		let refreshpageInfo = this.props.table.getTablePageInfo(table_id);//分页
		let refreshsearchVal = this.props.search.getAllSearchData(search_id);//查询condition

		let conditions = [];
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions
			},
			// conditions: searchVal.conditions || searchVal,
			pageInfo: refreshpageInfo,
			pageCode: page_id,
			queryAreaCode: search_id,  //查询区编码
			oid: Templatedata.list_oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: Templatedata.query,
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(table_id, data[table_id]);
					} else {
						this.props.table.setAllTableData(table_id, { rows: [] });
					}

				}
			}
		});

	}

	render() {
		let { table, button, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000069'),//标题
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							{/* 小应用注册按钮 */}
							{this.props.button.createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 8,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						showAdvBtn: false,                           //  显示高级按钮
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						oid: Templatedata.list_oid,
						renderCompleteEvent: this.renderCompleteEvent,  // 查询区渲染完成回调函数
						advSearchClearEve: this.advSearchClearEve  //  高级查询面板中的清空按钮 点击事件钩子，用于业务组清除自定义查询条件值
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: false
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/