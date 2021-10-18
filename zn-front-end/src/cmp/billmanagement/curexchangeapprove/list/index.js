/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//单表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';
let { NCTabsControl } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, tableButtonClick } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import NCCOriginalBalance from '../../../public/restmoney/list/index';
const { NCUploader, ApproveDetail, PrintOutput } = high;
const { NCDiv } = base;
//打印
let oid = Templatedata.list_oid;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageCode = Templatedata.list_pageid;
		this.state = {
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billId: '',//单据pk
			billno: '',//附件管理使用单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			tabs01: '',
			tabs02: '',
			tabs03: '',
			tabs04: '',
			tabs05: '',
			tabs06: '',
			defaultKey: 0,
			add_pk: '',//新增传递参数：单据pk
			add_status: '',//新增传递参数：单据状态
			outputData: '',
			showOriginal: false, //联查余额
			showOriginalData: ''//联查余额
		}
		initTemplate.call(this, props);//this绑定到initTemplate中
	}
	componentDidMount() {
		//this.getData();
	}
	//删除单据
	delConfirm = () => {

		let selectedData = this.props.table.getCheckedRows(this.tableId);
		let deletTableId = this.tableId;
		let indexArr = [];
		let dataArr = [];
		let liststsmap = [];
		let delObj = {
			status: '3',
			values: {
				ts: {
					display: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000085'),/* 国际化处理： 时间戳*/
				},
				pk_cruexchange: {
					display: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000086'),/* 国际化处理： 主键*/
				}
			}
		};
		//处理选择数据
		selectedData.forEach((val) => {
			delObj.rowId = val.data.rowId;
			delObj.values.ts.value = val.data.values.ts.value;//ts时间戳
			dataArr.push(val.data.values.pk_cruexchange.value);//主键数组
			indexArr.push(val.index);
			let deletetsmap = {
				'ts': val.data.values.ts.value,
				'pk': val.data.values.pk_cruexchange.value
			}
			liststsmap.push(deletetsmap);
		});
		let data = {
			'pks': dataArr,
			'listTsmap': liststsmap
		};
		let self = this;
		ajax({
			url: '/nccloud/cmp/curexchange/curexchangedelete.do',
			data: data,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					toast({
						duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
						color: 'success',     // 提示类别，默认是 "success",非必输
						title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
						content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000031')   // 提示内容,非必输/* 国际化处理： 删除成功!*/
					})
					//props.table.deleteTableRowsByIndex(deletTableId, indexArr)//直接删除table中的行列
					self.refresh();
				}
			}
		});
	};
	//按钮名称
	getButtonNames = (codeId) => {
		if (codeId === 'printBtn' || codeId === 'addBtn' || codeId === 'copyBtn' || codeId === 'submitBtn') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
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

	getData = (serval) => {
		//查询条件和页签合并
		let searchVal = this.props.search.getAllSearchData(this.searchId);//新盘条件修改
		if (!searchVal) {
			return;
		}
		if (!serval) {
			return;
		}
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		if (this.props.meta.getMeta()[this.searchId].oid) {
			oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
		}
		if (serval) {
			searchVal.conditions.push(...serval);
			let data = {
				querycondition: searchVal,
				custcondition: {
					logic: 'and', //逻辑操作符，and、or
					conditions: []
				},
				pageInfo: pageInfo,
				pageCode: Templatedata.list_pageid,
				queryAreaCode: this.searchId, //查询区编码
				oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			};
			ajax({
				url: '/nccloud/cmp/curexchange/curexchangequeryscheme.do',
				data: data,
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
		}

	};
	//刷新列表
	refresh = () => {

		let table_id = Templatedata.list_tableid;
		let search_id = Templatedata.list_searchid;
		let page_id = Templatedata.list_pageid;

		let refreshpageInfo = this.props.table.getTablePageInfo(table_id);//分页
		let refreshsearchVal = this.props.search.getAllSearchData(search_id);//查询condition
		if (this.props.meta.getMeta()[search_id].oid) {
			oid = this.props.meta.getMeta()[search_id].oid;//动态获取oid
		}
		let refreshdata = {
			querycondition: refreshsearchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: refreshpageInfo,
			pageCode: page_id,
			queryAreaCode: search_id, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/curexchange/curexchangequeryscheme.do',
			data: refreshdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(table_id, data[table_id]);

						//========页签赋值=====2次请求=====================
						ajax({
							url: '/nccloud/cmp/curexchange/curexchangequeryalldata.do',
							data: refreshdata,
							success: (res) => {
								let { success, data } = res;
								if (success) {
									if (data) {
										//处理页签值，显示全部数据结果
										let returnData = data[table_id].rows;
										let tabs01 = [];
										let tabs02 = [];
										let tabs03 = [];
										let tabs04 = [];
										let tabs05 = [];
										let tabs06 = [];

										returnData.forEach((val) => {
											if (val.values.busistatus.value === '1') {
												//已保存
												tabs01.push(val.values.pk_cruexchange.value);
											}
											if (val.values.busistatus.value === '2') {
												// 待审批
												tabs02.push(val.values.pk_cruexchange.value);
											}
											if (val.values.busistatus.value === '3') {
												// 待办理
												tabs03.push(val.values.pk_cruexchange.value);
											}
											if (val.values.busistatus.value === '4') {
												// 已完毕
												tabs04.push(val.values.pk_cruexchange.value);
											}
											if (val.values.vbillstatus.value === '2') {
												//审批状态：审批中
												tabs06.push(val.values.pk_cruexchange.value);
											}
											tabs05.push(val.values.pk_cruexchange.value);


										});
										//页签赋值
										this.setState({
											tabs01: tabs01.length,
											tabs02: tabs02.length,
											tabs03: tabs03.length,
											tabs04: tabs04.length,
											tabs05: tabs05.length,
											tabs06: tabs06.length
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
		let isDoAction = true;
		let bill_status = this.props.search.getSearchValByField(this.searchId, 'busistatus');
		if (bill_status && bill_status.value && bill_status.value.firstvalue) {
			isDoAction = false;
		}
		switch (status) {
			// 待提交
			case '1':
				this.setState({
					defaultKey: 0
				})
				serval = [
					{

						field: 'busistatus',
						value: {
							firstvalue: '1',
							secondvalue: null
						},
						oprtype: '=',
						display: null
					}
				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: '1', display: '已保存' });
				if (isDoAction) {
					this.getData(serval);
				}
				break;

			case '2':
				serval = [
					{
						field: 'busistatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '='
					}
				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: '2', display: '待审批' });
				// this.getData(serval);
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//待办理
			case '3':
				this.setState({
					defaultKey: 2
				})
				serval = [
					{
						field: 'busistatus',
						value: {
							firstvalue: '3',
							secondvalue: null
						},
						oprtype: '='
					}
				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: '3', display: '待办理' });
				// this.getData(serval);
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//已完毕
			case '4':
				serval = [
					{
						field: 'busistatus',
						value: {
							firstvalue: '4',
							secondvalue: null
						},
						oprtype: '='
					}
				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: '4', display: '已完毕' });
				// this.getData(serval);
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//全部
			case '5':
				this.setState({
					defaultKey: 3
				})
				serval = [

				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: null });
				// this.getData(serval);
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//审批中
			case '6':
				this.setState({
					defaultKey: 1
				})
				serval = [
					{
						field: 'vbillstatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '='
					}
				];
				// this.props.search.setSearchValByField(this.searchId, 'busistatus', { value: null });
				// this.getData(serval);
				if (isDoAction) {
					this.getData(serval);
				}
				break;

		}
	};
	render() {
		let { table, button, ncmodal, search } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = this.props.button;
		let { createButton, getButtons } = button;
		let { createModal } = ncmodal;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (

			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070FCEAPP") &&
									this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000042'),//标题/* 国际化处理： 外币兑换*/
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							{/* 小应用注册button */}
							{createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this)
							})}

						</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 12,
						showAdvBtn: true,                           //  显示高级按钮
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						oid: oid
					})}
				</div>
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={this.state.defaultKey}>
						<div key={1} clickFun={this.navChangeFun.bind(this, '1')}>
							{this.props.MutiInit.getIntl("36070FCEAPP") &&
								this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000087')}
							{' '}{this.state.tabs01}{/* 国际化处理： 待提交*/}
						</div>
						{/* <div key={3} clickFun={this.navChangeFun.bind(this, '2')}>
							{'待审批'}{this.state.tabs02}
						</div>   */}
						<div key={6} clickFun={this.navChangeFun.bind(this, '6')}>
							{this.props.MutiInit.getIntl("36070FCEAPP") &&
								this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000088')}
							{' '}{this.state.tabs06}{/* 国际化处理： 审批中*/}
						</div>
						<div key={3} clickFun={this.navChangeFun.bind(this, '3')}>
							{this.props.MutiInit.getIntl("36070FCEAPP") &&
								this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000089')}
							{' '}{this.state.tabs03}{/* 国际化处理： 待办理*/}
						</div>
						{/* <div key={4} clickFun={this.navChangeFun.bind(this, '4')}>
							{'已完毕'}{this.state.tabs04}
						</div> */}
						<div key={5} clickFun={this.navChangeFun.bind(this, '5')}>
							{this.props.MutiInit.getIntl("36070FCEAPP") &&
								this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000090')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true

					})}
					{createModal('delete', {
						title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000032'),/* 国际化处理： 提示*/
						content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000033'),/* 国际化处理： 确定要删除单据吗?*/
						beSureBtnClick: this.delConfirm
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/curexchange/curexchangeprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div>
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={() => {
							//console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({
								showOriginal: false
							})
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({
								showOriginal: false
							})
						}}
					>
					</NCCOriginalBalance>

				</div>
			</div>

		);
	}
}

List = createPage({
	mutiLangCode: '36070FCEAPP'
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/