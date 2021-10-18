/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, createPageIcon } from 'nc-lightapp-front';
let { NCTabsControl, NCDiv } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, tableButtonClick } from './events';
import { high } from 'nc-lightapp-front';
const { NCUploader, ApproveDetail } = high;//打印相关
const { BillTrack } = high;//联查单据
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import Inspection from '../Inspection/index.js';//联查计划预算
import { commonurl } from '../../../public/utils/constant';//附件改造使用
let oid = Templatedata.list_oid;
//******注意：收款结算被联查不在使用这个******
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.link_list_pageid;//协同单据联查页面
		this.state = {
			showInspection: false,//联查预算
			sourceData: null,//联查预算数据源
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billId: '',//单据pk
			billno: '',//附件管理使用单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			tabs00: '',
			tabs01: '',
			tabs02: '',
			tabs09: '',
			tabs10: '',
			tabs11: '',
			tpflag: true,
			tradetype: 'D4',
			tradename: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000019'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4',
			outputData: ''//打印输出使用
		}
		initTemplate.call(this, props);
	}
	componentDidMount() {
		//  this.getLinkQueryData(null);
		let url = window.parent.location.href;
		let obj = this.GetQuery(url);

		//联查1：付款结算单联查
		if (obj && obj.src && obj.src == 'paybills') {
			//联查处理
			let paybillsData = cacheTools.get('paybillsData');

			if (paybillsData && paybillsData.length > 0) {

				this.getLinkQueryData(paybillsData);
			}
		}
		//联查2：到账通知联查
		if (obj && obj.src && obj.src == 'informer') {
			//联查处理
			let informerData = cacheTools.get('informers');

			if (informerData && informerData.length > 0) {

				this.getLinkQueryData(informerData);
			}
		}
		//计划结算--->联查单据
		if (this.props.getUrlParam('pk_ntbparadimvo')) {
			this.getLinkplanData();
		}


	}
	GetQuery = (query) => {
		let theRequest = {};
		if (query.indexOf('?') != -1) {
			let str = query.substr(1);
			if (str.indexOf('&') != -1) {
				let strs = str.split('&');
				for (let i = 0; i < strs.length; i++) {
					theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
				}
			} else {
				theRequest[str.split('=')[0]] = str.split('=')[1];
			}
		}
		return theRequest;
	};
	//计划结算---->>联查单据
	getLinkplanData = (serval) => {
		ajax({
			url: '/nccloud/cmp/recbill/linkplanquery.do',
			data: { pk: this.props.getUrlParam('pk_ntbparadimvo'), pageid: this.pageId },
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);

					} else {
						// this.props.table.setAllTableData(table_id, { rows: [] });
						this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
						//页签赋值
						this.setState({
							tabs00: '',
							tabs01: '',
							tabs02: '',
							tabs09: '',
							tabs10: '',
							tabs11: ''
						});

					}
				}
			}
		});
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	/* 添加高级查询区中的页签 */
	addAdvTabs = () => {
		return [
		]
	};

	/* 替换高级查询body区域 */
	replaceAdvBody = () => {
		return (
			<div>3333</div>
		)
	}
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			show: false
		})
	}
	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}
	//联查单据
	getLinkQueryData = (searchData) => {
		//测试数据
		// let testArr = ["1001G5100000000016SC", "1001G5100000000017B2", "1001G510000000001JK6"];
		console.log(searchData);
		let sendArr = {
			'pks': searchData,
			'pageid': this.pageId
		}
		ajax({
			url: '/nccloud/cmp/recbill/recbilllinkbill.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let rowlenght = data[this.tableId].rows;
						console.log(rowlenght);
						let src = this.props.getUrlParam('src');
						if (rowlenght.length == 1) {
							let record = rowlenght[0];
							//1条数据跳转到卡片页面
							this.props.linkTo('/cmp/billmanagement/recbilllink/card/index.html', {
								status: 'browse',
								id: record.values.pk_recbill.value,
								billno: record.values.bill_status.value,
								pagecode: this.pageId
							});

						}
					} else {
						//没查到数据跳转到卡片页面
						this.props.linkTo('/cmp/billmanagement/recbilllink/card/index.html', {
							status: 'browse',
							id: null,
							billno: null,
							pagecode: this.pageId
						});
					}

				}
			}
		});


	}
	getData = (serval) => {
		let searchVal = this.props.search.getAllSearchData(this.searchId);//新盘适配插叙条件
		if (this.props.meta.getMeta()[this.searchId].oid) {
			oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
		}
		if (!searchVal) {
			return;
		}
		if (!serval) {
			return;
		}
		searchVal.conditions.push(...serval);
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pageCode: Templatedata.list_pageid,
			queryAreaCode: Templatedata.list_searchid, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/recbill/recbillquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
						//========页签赋值=====2次请求=====================

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
		refreshpageInfo.pageIndex = 0
		let refreshsearchVal = this.props.search.getAllSearchData(search_id);//查询condition


		let searchdata = {
			conditions: refreshsearchVal.conditions || refreshsearchVal,
			pageInfo: refreshpageInfo,
			pagecode: page_id,
			queryAreaCode: search_id,  //查询区编码
			oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
			queryType: Templatedata.list_querytype
		};
		ajax({
			url: '/nccloud/cmp/recbill/recbillquery.do',
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(table_id, data[table_id]);

						//========页签赋值=====2次请求=====================
						ajax({
							url: '/nccloud/cmp/recbill/recbillqueryalldata.do',
							data: searchdata,
							success: (res) => {
								let { success, data } = res;
								if (success) {
									if (data) {
										//处理页签值，显示全部数据结果
										let returnData = data[table_id].rows;
										let tabs00 = [];
										let tabs01 = [];
										let tabs02 = [];
										let tabs09 = [];
										let tabs10 = [];

										returnData.forEach((val) => {
											if (val.values.bill_status.value === '1') {
												//审批通过
												tabs01.push(val.values.pk_recbill.value);
											}
											if (val.values.bill_status.value === '2') {
												//审批中
												tabs02.push(val.values.pk_recbill.value);
											}
											if (val.values.bill_status.value === '9') {
												// 未确认
												tabs09.push(val.values.pk_recbill.value);
											}
											if (val.values.bill_status.value === '-10') {
												// 保存
												tabs10.push(val.values.pk_recbill.value);
											}
											tabs00.push(val.values.pk_recbill.value);


										});
										//页签赋值
										this.setState({
											tabs00: tabs00.length,
											tabs01: tabs01.length,
											tabs02: tabs02.length,
											tabs09: tabs09.length,
											tabs10: tabs10.length,
										});
									}

								}
							}
						});

					} else {
						this.props.table.setAllTableData(table_id, { rows: [] });
					}

				}
			}
		});

	}
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
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
					}
				];
				this.getData(serval);
				break;

			case '0':
				serval = [

				];
				this.getData(serval);
				break;

		}
	};
	render() {
		let { table, search, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070RBM") &&
										this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000046'),//标题{/* 国际化处理： 收款结算*/}
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
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						oid: oid

					})}
				</div>
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={-1}>
						{/* <div key={9} clickFun={this.navChangeFun.bind(this, '9')}>
						{'待确认'}{ this.state.tabs09}
						</div> */}
						<div key={-1} clickFun={this.navChangeFun.bind(this, '-10')}>
							<span>
							{this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000087')}{'('}<span>{this.state.tabs10}</span>{')'/* 国际化处理： 待提交*/}
							</span>
						</div>
						{/* <div key={3} clickFun={this.navChangeFun.bind(this, '2')}>
							{'待提交'}{0}
						</div> */}
						<div key={2} clickFun={this.navChangeFun.bind(this, '2')}>
							<span>
							{this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000088')}{'('}<span>{this.state.tabs02}</span>{')'/* 国际化处理： 审批中*/}
							</span>
						</div>
						{/* <div key={1} clickFun={this.navChangeFun.bind(this, '1')}>
							{'审批通过'}{this.state.tabs01}
						</div> */}
						<div key={0} clickFun={this.navChangeFun.bind(this, '0')}>
							<span>
							{this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000089')}{/* 国际化处理： 全部*/}
							</span>
						</div>
					</NCTabsControl>
				</div>
				{/* <div style={{ height: '10px' }} /> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true
					})}
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={billno}
							onHide={this.onHideUploader}
							customInterface={
								{
									queryLeftTree: commonurl.lefttreequery,
									queryAttachments: Templatedata.annex_url
								}
							}//附件改造
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billid}
					/>
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
				{/* 联查计划预算 */}
				<div>
					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.sourceData}
						cancel={() => {
							this.setState({ showInspection: false })
						}}
						affirm={() => {
							this.setState({ showInspection: false })
						}}
					/>
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/recbill/recbillprintcard.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
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