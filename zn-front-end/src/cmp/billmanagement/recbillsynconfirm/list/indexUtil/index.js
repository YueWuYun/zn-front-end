/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import { createPage, ajax, cardCache, high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, tableButtonClick, buttonUsability } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { delConfirm } from './indexUtil/delConfirm.js';
const { BillTrack, ApproveDetail } = high;//联查单据
let { getDefData } = cardCache;
let oid = Templatedata.list_oid;
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_pageid;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.pkname = Templatedata.pkname;
		this.key = Templatedata.key;//缓存相关
		this.searchKey = Templatedata.search_key;//查询条件缓存key
		this.state = {
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			tabs00: '',
			tabs01: '',
			tabs02: '',
			tabs09: '',
			tabs10: '',
			tabs11: '',
			defaultKey: 0
		}
		initTemplate.call(this, props);
	}
	componentDidMount() {
		this.getOIdData();//加载默认缓存数据
	}
	//加载默认缓存数据
	getOIdData = () => {
		let { hasCacheData } = this.props.table;
		this.restStateData();//获得缓存中state值
		if (!hasCacheData(this.dataSource)) {
			//自己查询数据
		} else {
			//加载缓存数据-自动加载数据
		}
	}
	//删除单据
	delConfirm = () => {
		delConfirm.call(this);
	}
	//刷新列表
	refresh = () => {
		refresh.call(this);
		let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);//分页
		refreshpageInfo.pageIndex = 0;
		let refreshsearchVal = this.props.search.getAllSearchData(this.searchId);//查询condition
		if (this.props.meta.getMeta()[this.searchId].oid) {
			oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
		}
		/**
	     * 限定只能，来源系统是：协同单据
		 */
		let refresh_setServal = [
			{

				field: 'source_flag',
				value: {
					firstvalue: '9',
					secondvalue: null
				},
				oprtype: '=',
				display: null
			}
		];
		refreshsearchVal.conditions.push(...refresh_setServal);
		let searchdata = {
			querycondition: refreshsearchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: [
					{
						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				]
			},
			pageInfo: refreshpageInfo,
			pageCode: this.pageId,
			queryAreaCode: this.searchId, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};

		ajax({
			url: '/nccloud/cmp/recbill/recbillquery.do',
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[0].grid[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
					}

				}
			}
		});

	}
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		this.setState({ defaultKey: status });
		switch (status) {
			case '-10':
				serval = [
					{

						field: 'bill_status',
						value: {
							firstvalue: '-10',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					},
					{

						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				this.getData(serval);
				break;
			case '9':
				serval = [
					{

						field: 'bill_status',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					},
					{

						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				this.getData(serval);
				break;

			case '2':
				serval = [
					{
						field: 'bill_status',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '='
					},
					{

						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				this.getData(serval);
				break;

			case '1':
				serval = [
					{
						field: 'bill_status',
						value: {
							firstvalue: '1',
							secondvalue: null
						},
						oprtype: '='
					},
					{

						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				this.getData(serval);
				break;

			case '0':
				serval = [
					{

						field: 'source_flag',
						value: {
							firstvalue: '9',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				this.getData(serval);
				break;

		}
	};
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(this.searchKey, this.dataSource);
		if (cachesearch && cachesearch.conditions) {
			for (let item of cachesearch.conditions) {
				if (item.field == 'bill_date') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: time });
				} else {
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: item.value.firstvalue });
				}
			}
		}
	};
	render() {
		let { table, button, search, ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { createModal } = ncmodal;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.props.MutiInit.getIntl("36070RBMCP") &&
								this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000041')}
						</h2>{/* 国际化处理： 收款结算协同确认*/}
					</div>
					<div className="header-button-area">
						{/* 小应用注册按钮 */}
						{this.props.button.createButtonApp({
							area: Templatedata.list_head,
							buttonLimit: 8,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						showAdvBtn: true,                           //  显示高级按钮
						renderCompleteEvent: this.renderCompleteEvent,  // 查询区渲染完成回调函数 
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						// addAdvTabs: this.addAdvTabs             // 添加高级查询区自定义页签 (fun), return Dom 
						// oid: '0001Z61000000000RI6Z'
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: this.dataSource,
						pkname: this.pkname,
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onSelected: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						onSelectedAll: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						showCheck: true,
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
					})}
					{createModal('delete', {
						// title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000035'),/* 国际化处理： 提示*/
						// content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000062'),/* 国际化处理： 确定要删除单据吗?*/
						title: '提示',/* 国际化处理： 提示*/
						content: '确定要删除单据吗?',/* 国际化处理： 确定要删除单据吗?*/
						beSureBtnClick: this.delConfirm
					})}
				</div>
				{/* 联查单据 */}
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={
							() => {
								this.setState({
									show: false
								})
							}
						}
						billtype={this.state.billtype}
						billid={this.state.billid}
					/>
				</div>
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: Templatedata.list_moduleid,
	billinfo: {
		billtype: 'grid',
		pagecode: Templatedata.list_pageid,
		bodycode: Templatedata.list_tableid
	}
})(List);
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/