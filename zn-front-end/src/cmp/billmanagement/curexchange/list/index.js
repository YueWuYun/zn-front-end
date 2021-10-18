/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//单表-[外币兑换]
import React, { Component } from 'react';
import { createPage, ajax, base, high, cardCache, getMultiLang, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, buttonUsability } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import { refresh } from './events/refresh';//刷新列表功能
import { submitAssginBtn } from './tableButtonClick/submitAssginBtn.js';
import { setCacheData } from './indexUtil/setCacheData.js';
import { changeNavQueryData } from './indexUtil/changeNavQueryData.js';
import { renderCompleteEvent } from './indexUtil/renderCompleteEvent.js';
import { onrowDoubleclick } from './indexUtil/onrowDoubleclick.js';
import { getCommonLink } from './indexUtil/getCommonLink.js';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"//列表中页签底色
import { saveMultiLangRes ,createListWebSocket} from '../../../../tmpub/pub/util';
import { SCENE, URL_PARAM } from '../../../../tmpub/pub/cons/constant.js';//联查使用场景
const { NCDiv } = base;
const { NCTabPane } = NCTabs;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans, ExcelImport } = high;
//缓存
let { setDefData, getDefData } = cardCache;
class List extends Component {

	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageCode = Templatedata.list_pageid;
		this.pkname = Templatedata.pkname;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;;//缓存相关
		this.searchKey = Templatedata.search_key;//查询条件缓存key
		this.linkkey = Templatedata.voucher_linkkey;//凭证联查单据缓存key
		this.compositedata = null,//提交指派页面
			this.getAssginUsedr = null,//提交指派的value
			this.selectedPKS = [];
		this.state = {
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billId: '',//单据pk
			billno: '',//附件管理使用单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			tabs01: '0',
			tabs02: '0',
			tabs03: '0',
			tabs04: '0',
			tabs05: '0',
			tabs06: '0',
			defaultKey: '0',//页签模版显示
			add_pk: '',//新增传递参数：单据pk
			add_status: '',//新增传递参数：单据状态
			outputData: '',
			showOriginal: false, //联查余额
			showOriginalData: '',//联查余额
			compositedisplay: false,//是否显示指派页面
			record: null,//提交指派使用
			index: null//提交指派使用
		}
		// initTemplate.call(this, props);//this绑定到initTemplate中
	}
	componentDidMount() {
		this.setCacheData();//加载默认缓存数据
	}
	//操作列多语不显示
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
			this.initLinkBIll();
		};
		// getMultiLang({ moduleId: [Templatedata.app_code,'36070'], domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.app_code, '36070', '36070WC', '36070APM']
			},
			callback
		});
	}
	/**
	 * 被联查页面入口
	 */
	initLinkBIll = () => {
		let scene = this.props.getUrlParam('scene');
		//凭证-->联查单据
		if (scene && scene === 'fip') {
			setDefData(this.linkkey, this.dataSource, true);
			this.voucherLinkBill();
		} else if (scene && scene === SCENE.LINK) {
			setDefData(this.linkkey, this.dataSource, true);
			this.commonLinkbill();//普通联查
		}

	}
	/**
	 * 普通联查单据
	 */
	commonLinkbill = () => {
		//单据pk非数组
		let id = this.props.getUrlParam(URL_PARAM.ID) == null ?
			this.props.getUrlParam(URL_PARAM.PK_SRC) :
			this.props.getUrlParam(URL_PARAM.ID);
		if (id) {
			getCommonLink.call(this, id);
		}

	}
	//凭证联查单据入口
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if (checkedData && checkedData.length > 0) {
			let data = {
				operatingLogVO: checkedData,
				pageCode: this.pageCode,
			};
			ajax({
				url: '/nccloud/cmp/curexchange/voucherlink.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							if (data.grid) {
								this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							} else {
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
						}
					}
				}
			});
		};
	};
	setCacheData = () => {
		setCacheData.call(this);
	}
	//加载默认缓存数据
	setCacheData = () => {
		setCacheData.call(this);
	}
	//审批指派返回action如果需求可以请求后台
	getAssginUsedrFunction = (value) => {
		this.getAssginUsedr = value;
		if (this.state.record) {
			//操作列提交[指派提交]
			submitAssginBtn.call(this, this.state.record, this.state.index);
		} else {
			//指派提交[肩部按钮]
			buttonClick.call(this, this.props, 'submitAssginBtn');
		}
	}
	//切换页签查询数据
	getData = (serval) => {
		changeNavQueryData.call(this, serval);
	};
	//刷新列表
	refresh = () => {
		refresh.call(this);
	}
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		let isDoAction = true;//可以调用查询方法
		let bill_status = this.props.search.getSearchValByField(this.searchId, 'busistatus');
		if (bill_status && bill_status.value && bill_status.value.firstvalue) {
			//查询区单据状态和页签状态一致
			if (status != bill_status.value.firstvalue) {
				isDoAction = false;
			} else {
				isDoAction = true;
			}
		}
		buttonUsability.call(this, this.props, status);//列表按钮显影性
		//1-待提交；6-审批中；3-代办理；5-全部
		switch (status) {
			// 待提交
			case '0':
				this.setState({
					defaultKey: '0'
				})
				serval = [
					{

						field: 'busistatus',
						value: {
							firstvalue: '1',
							secondvalue: null
						},
						oprtype: '=',
						datetype: 203
					}
				];
				if (isDoAction) {
					this.getData(serval);
				}
				break;

			case '8':
				serval = [
					{
						field: 'busistatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '=',
						datetype: 203
					}
				];
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//待办理
			case '2':
				this.setState({
					defaultKey: '2'
				})
				serval = [
					{
						field: 'busistatus',
						value: {
							firstvalue: '3',
							secondvalue: null
						},
						oprtype: '=',
						datetype: 203
					}
				];
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
						oprtype: '=',
						datetype: 203
					}
				];
				if (isDoAction) {
					this.getData(serval);
				}
				break;
			//全部
			case '3':
				this.setState({
					defaultKey: '3'
				})
				serval = [

				];
				if (true) {
					isDoAction = true;
					this.getData(serval);
				}
				break;
			//审批中
			case '1':
				this.setState({
					defaultKey: '1'
				})
				serval = [
					{
						field: 'vbillstatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '=',
						datetype: 203
					}
				];
				let vbill_status = this.props.search.getSearchValByField(this.searchId, 'vbillstatus');//审批状态
				if (vbill_status && vbill_status.value && vbill_status.value.firstvalue) {
					if (vbill_status.value.firstvalue == '2') {
						isDoAction = true;
					} else {
						isDoAction = false;
					}
				}
				if (isDoAction) {
					this.getData(serval);
				}
				break;

		}
		//如果单据状态和页签不一致则合并没有数据[页签和查询条件合并]
		if (!isDoAction) {
			this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
			//页签赋值
			this.setState({
				tabs01: '',
				tabs02: '',
				tabs03: '',
				tabs04: '',
				tabs05: '',
				tabs06: '',
			});
		}
	};
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		renderCompleteEvent.call(this);
	};

	render() {
		let { table, button, ncmodal, search } = this.props;
		let buttons = this.props.button.getButtons();
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = this.props.button;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
		let { createModal } = ncmodal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (

			<div className="nc-bill-list">
			 {/**创建websocket连接 */}
			 {createListWebSocket(this.props, {
                    tableAreaCode: Templatedata.list_tableid,
                    tablePkName: Templatedata.pkname,
                    billtype: Templatedata.billtype,
					// serverLocation: '10.16.2.231:9991'
					Templatedata:Templatedata.dataSource
                })}


				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070FCE")
										&& this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000039'),//标题/* 外币兑换 */
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							{/* 小应用注册button */}
							{createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 11,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
				</NCDiv>
				{!isvoucherlink &&
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: searchBtnClick.bind(this),
							defaultConditionsNum: 12,
							showAdvBtn: true,
							// renderCompleteEvent: this.renderCompleteEvent,  // 查询区渲染完成回调函数回显查询条件                       //  显示高级按钮
							// searchBtnName :''                        //    查询按钮名称，默认查询
							// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
							// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
							// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
							// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
							// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
							// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
							//  oid: '0001Z61000000000PGKX'
						})}
					</div>
				}
				{!isvoucherlink &&

					<NCTabs activeKey={this.state.defaultKey} onChange={(v) => { this.navChangeFun.call(this, v); }}>
						<NCTabPane key={'0'} tab={
							<span>{
							//待提交
							this.props.MutiInit.getIntl("36070FCE") &&
							this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000076') + '(' } <span>{this.state.tabs01}</span>{')'
							}</span>
						} />
						<NCTabPane key={'1'} tab={
							<span>{
							//审批中
							this.props.MutiInit.getIntl("36070FCE") &&
							this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000077') + '('  }<span>{this.state.tabs06}</span>{')'}
							</span>
						} />
						<NCTabPane key={'2'} tab={
							<span>{
							//待办理
							this.props.MutiInit.getIntl("36070FCE") &&
							this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000078') + '('}<span> {this.state.tabs03}</span>{')'
							}</span>
						} />
						<NCTabPane key={'3'} tab={
							<span>{
							//全部
							this.props.MutiInit.getIntl("36070FCE") &&
							this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000079')
							}</span>
						} />
					</NCTabs>

				}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: this.dataSource,//表格加dataSource标识
						pkname: this.pkname,//给表格加pkname: 表格数据的主键名字(key)
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onSelected: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
						onSelectedAll: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
						showCheck: true,
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							//begin tm lidyu  20200326 表格数据加载完毕 处理按钮可用性
							buttonUsability.call(this, this.props, '');
							//end lidyu
						}
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
							onHide={
								() => {
									this.setState({
										showUploader: false
									})
								}
							}
						/>
					}
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
					{/* {导入} */}
					{
						createModal('importModal', {
							noFooter: true,
							className: 'import-modal',
							hasBackDrop: false,
						})
					}
					<ExcelImport
						{...Object.assign(this.props)}
						moduleName="cmp" //模块名
						billType={'36S5'} //单据类型
						pagecode={Templatedata.card_pageid}
						appcode={Templatedata.app_code}
						selectedPKS={this.selectedPKS}
					/>
				</div>
				<div>
					{/* 查询余额 */}
					<NCCOriginalBalance
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={() => {
							////console.log(retOriginalMsg, 'retOriginalMsg')
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
				<div>
					{/* 提交及指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000082')}
						data={this.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedrFunction}
						cancel={() => {
							this.setState({
								compositedisplay: false
							});
						}
						}
					/> : ""}
				</div>
			</div>

		);
	}
}

List = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(List);
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/