/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import { createPage, base, cardCache, high, getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, buttonUsability } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { delConfirm } from './indexUtil/delConfirm.js';
import { refresh } from './indexUtil/refresh.js';
import { onrowDoubleclick } from './indexUtil/onrowDoubleclick.js';
import { renderCompleteEvent } from './indexUtil/renderCompleteEvent.js';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const { BillTrack, ApproveDetail } = high;//联查单据
let { getDefData } = cardCache;
const { NCDiv } = base;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * 收款结算单协同
 */
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
		// initTemplate.call(this, props);
	}
	componentDidMount() {
		this.getOIdData();//加载默认缓存数据
	}
	//操作列多语不显示
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.app_code, '36070']
			},
			callback
		});
	}
	//加载默认缓存数据
	getOIdData = () => {
		// let { hasCacheData } = this.props.table;
		// this.restStateData();//获得缓存中state值
		// if (!hasCacheData(this.dataSource)) {
		// 	//自己查询数据
		// } else {
		// 	//加载缓存数据-自动加载数据
		// }
	}
	// 还原列表页页签数字数据
	restStateData = () => {
		//获取页签数据
		let cachestate = getDefData(this.key, this.dataSource);
		if (cachestate) {
			let keys = Object.keys(cachestate);
			for (let i = 0, l = keys.length; i < l; i++) {
				let key = keys[i];
				this.state[key] = cachestate[key];
			}
		}
	}
	//删除单据
	delConfirm = () => {
		delConfirm.call(this);
	}
	//刷新列表
	refresh = () => {
		refresh.call(this);
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
		renderCompleteEvent.call(this);
	};
	render() {
		let { table, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接 */}
				{api.comm.createListWebSocket(this.props, {
                    tableAreaCode: cons.list.tableCode,
                    tablePkName: cons.field.pk,
                    billtype: cons.comm.billType
                    // serverLocation: '10.16.2.231:9991'
                })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.props.MutiInit.getIntl("36070RBMCP") &&
									this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000041'),//标题/* 国际化处理： 收款结算协同确认*/
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 小应用注册按钮 */}
						{this.props.button.createButtonApp({
							area: Templatedata.list_head,
							buttonLimit: 8,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						showAdvBtn: true,                           //  显示高级按钮
						// renderCompleteEvent: this.renderCompleteEvent,  // 查询区渲染完成回调函数 
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
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
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