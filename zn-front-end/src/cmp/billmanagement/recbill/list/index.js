/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表
import React, { Component } from 'react';
import { createPage, ajax, base, cacheTools, toast, high, cardCache, getMultiLang, viewModel } from 'nc-lightapp-front';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { refresh } from './events/refresh.js';
import { getLinkplanData } from './indexUtil/getLinkplanData.js';
import { getLinkQueryData } from './indexUtil/getLinkQueryData.js';
import { getStandardQueryData } from './indexUtil/getStandardQueryData.js';
import { getData } from './indexUtil/getData.js';
import { delConfirm } from './indexUtil/delConfirm.js';
import { renderCompleteEvent } from './indexUtil/renderCompleteEvent.js';
import { submitAssginBtn } from './tableButtonClick/submitAssginBtn.js';
import { onrowDoubleclick } from './indexUtil/onrowDoubleclick.js';
import { commonurl } from '../../../public/utils/constant';//附件改造使用
import { SCENE, URL_PARAM } from '../../../../tmpub/pub/cons/constant.js';//联查使用场景
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, tableButtonClick, buttonUsability } from './events';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"//列表中页签底色
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let { NCButton, NCDiv } = base;
const { NCTabPane } = NCTabs;
const { Refer } = high;
const { Inspection, BillTrack, PrintOutput, NCUploader, ApproveDetail, ApprovalTrans, ExcelImport } = high;
//缓存
let { setDefData, getDefData } = cardCache;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * 收款结算单-列表
 */
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_pageid;
		this.cardPageId = Templatedata.card_pageid;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.pkname = Templatedata.pkname;
		this.key = Templatedata.key;//缓存相关
		this.linkkey = Templatedata.linkkey;//凭证联查单据缓存key
		this.searchKey = Templatedata.search_key;//查询条件缓存key
		this.linkscekey = Templatedata.linksce_key;//联查单据key
		this.getAssginUsedr = null;//指派使用常量
		this.compositedata = null;//指派使用数据
		this.selectedPKS = []; //导出数据的主键pk
		this.state = {
			tradeCode: Templatedata.card_pageid,//交易类型code可以用于pagecode跳转
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
			add_pk: '',//新增跳转使用
			add_status: '',//新增跳转使用
			tabs00: '0',
			tabs01: '0',
			tabs02: '0',
			tabs09: '0',
			tabs10: '0',
			tabs11: '0',
			tpflag: true,
			tradetype: 'D4',
			tradename: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000019'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4',
			defaultKey: '0',
			outputData: '',//打印输出使用
			compositedisplay: false,//是否显示指派页面
			record: null,//提交指派使用
			index: null,//提交指派使用,
			sscivmMessage:'',

		};
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
			this.linkBill();//联查单据[多语在willmount中是异步的只能把联查放到这里面]
		};
		// getMultiLang({ moduleId: [Templatedata.app_code, '36070'], domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.app_code, '36070']
			},
			callback
		});
	}
	//联查单据
	linkBill = () => {
		let url = window.parent.location.href;
		let obj = this.GetQuery(url);
		//联查1：付款结算单联查[目前走linkcard]
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
			setDefData(this.linkscekey, this.dataSource, true);//被联查使用
			this.getLinkplanData();
		}
		//凭证-->联查单据
		if (this.props.getUrlParam('scene') && this.props.getUrlParam('scene') === SCENE.FIP) {
			//加入缓存[凭证]
			setDefData(this.linkkey, this.dataSource, true);
			this.voucherLinkBill();
		}
		//联查单据--->其他单据联查收款结算单[支持单个pk或者多个pk][联查标识pk_src]
		if (this.props.getUrlParam('scene') &&
			this.props.getUrlParam('scene') === SCENE.LINK &&
			this.props.getUrlParam(URL_PARAM.PK_SRC)
		) {
			//联查收款结算单加入缓存
			setDefData(this.linkscekey, this.dataSource, true);
			console.log(cacheTools.get(SCENE.LINK), 'cache');
			console.log(this.props.getUrlParam(URL_PARAM.PK_SRC), 'pk_src');
			let ids = cacheTools.get(SCENE.LINK) == null ?
				this.props.getUrlParam(URL_PARAM.PK_SRC) :
				cacheTools.get(SCENE.LINK);
			if (ids) {
				getStandardQueryData.call(this);//普通联查单据入口
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000122') });/* 国际化处理： 未获取到缓存数据，请确定数据是否存在pk!*/
				return;
			}
		} else if (this.props.getUrlParam('id') &&
			this.props.getUrlParam('id').split(',').length == 1) {
			// 联查单据[单据追溯没有scene场景]
			// 我是单据追溯而来
			this.props.pushTo('/card', {
				status: 'browse',
				id: this.props.getUrlParam('id'),
				scene: 'linksce',
				pagecode: this.cardPageId
			});
		}
	}
	//计划结算---->>联查单据
	getLinkplanData = (serval) => {
		getLinkplanData.call(this, serval);
	};
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
	// 设置缓存数据的方法
	setStateCache = () => {
		setDefData(this.key, this.dataSource, this.state);
	}
	//凭证联查单据入口
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if (checkedData && checkedData.length > 0) {
			let data = {
				operatingLogVO: checkedData,
				pageCode: this.pageId,
			};
			ajax({
				url: '/nccloud/cmp/recbill/voucherlink.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data && data.grid) {
							let values = data.grid[this.tableId].rows;
							console.log("凭证反联查:" + values);
							//1条数据跳转到卡片页面
							if (values.length == 1) {
								let record = values[0];
								this.props.pushTo('/card', {
									status: 'browse',
									id: record.values.pk_recbill.value,
									scene: 'linksce',
									pagecode: this.cardPageId
								});
							} else {
								//2多条数据跳转到列表页面
								this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							}
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
						}
					}
				}
			});
		};
	};
	//到账通知联查单据
	getLinkQueryData = (searchData) => {
		getLinkQueryData.call(this, searchData)
	}
	//切换页签调用
	getData = (serval) => {
		getData.call(this, serval);
	};
	//刷新列表
	refresh = () => {
		refresh.call(this);
	}
	//删除单据
	delConfirm = () => {
		delConfirm.call(this);
	}
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		let bill_status = this.props.search.getSearchValByField(this.searchId, 'bill_status');
		let isDoAction = true;
		if (bill_status && bill_status.value && bill_status.value.firstvalue) {
			//查询区单据状态和页签状态一致
			if (status != bill_status.value.firstvalue) {
				isDoAction = false;
			} else {
				isDoAction = true;
			}
		}

		switch (status) {
			//待提交
			case '0':
				this.setState({ defaultKey: '0' });
				serval = [
					{

						field: 'bill_status',
						value: {
							firstvalue: '-10',
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
			case '9':
				serval = [
					{

						field: 'bill_status',
						value: {
							firstvalue: '9',
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
			//审批中
			case '1':
				this.setState({ defaultKey: '1' });
				serval = [
					{
						field: 'bill_status',
						value: {
							firstvalue: '2,-1',
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

			case '7':
				serval = [
					{
						field: 'bill_status',
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
			case '-1':
				serval = [
					{
						field: 'bill_status',
						value: {
							firstvalue: '-1',
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
			case '2':
				this.setState({ defaultKey: '2' });
				serval = [

				];
				if (isDoAction) {
					this.getData(serval);
				}
				break;

		}
		//不一致即设置页签值
		if (!isDoAction) {
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
	};
	//审批指派返回action如果需求可以请求后台
	getAssginUsedrFunction = (value) => {
		this.getAssginUsedr = value;
		if (this.state.record) {
			//操作列提交[指派提交]tableClick里面有写方法
			submitAssginBtn.call(this, this.state.record, this.state.index);
		} else {
			//指派提交[肩部按钮]
			buttonClick.call(this, this.props, 'submitAssginBtn');
		}
	}
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		renderCompleteEvent.call(this);
	};
	render() {
		let { table, button, search, ncmodal, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = ncmodal;
		let { createButtonApp } = this.props.button;
		const { createBillHeadInfo } = BillHeadInfo;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
		let isotherlink = getDefData(this.linkscekey, this.dataSource);//是否来自其他单据联查
		//支持网新增需求_begin:交易类型发布小应用得到的应用名称要做相应修改
		let billname = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000046');//标题
		if (getGlobalStorage('sessionStorage', 'billname')) {
			billname = getGlobalStorage('sessionStorage', 'billname');//标题
		}
		//end
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
								title: billname,
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						<div className="button-app-wrapper">
							{this.state.tpflag && !isvoucherlink && !isotherlink && <Refer
								placeholder={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000035')/* 国际化处理： 单据模板类型*/}
								refName={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000036')}/* 国际化处理： 收款交易类型*/
								refCode={'tradetypeF4'}
								refType={'grid'}
								queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
								columnConfig={[
									{
										name: [this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000129'), this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000130')],/* 国际化处理： 编码,名称*/
										code: ['refcode', 'refname']
									}
								]}
								queryCondition={{
									parentbilltype: 'F4'//过滤条件
								}}
								value={this.state.tradetype}
								onChange={(value) => {
									this.setState(
										{
											tradetype: value.refcode,
											tradename: value.refname,
											tradepk: value.refpk,
											tradeCode: value.refcode//跳转卡片使用交易类型
										},
										function () {
											if (this.state.tradetype && this.state.tradetype.length > 0) {
												//若存储值是字符串，可以直接存储
												setGlobalStorage('sessionStorage', 'sessionTP', this.state.tradetype);
											}
											if (this.state.tradename && this.state.tradename.length > 0) {
												// sessionStorage.setItem("sessionName", JSON.stringify(this.state.tradename));
												setGlobalStorage('sessionStorage', 'sessionName', this.state.tradename);
											}
											if (this.state.tradepk && this.state.tradepk.length > 0) {
												// sessionStorage.setItem("sessionpk", JSON.stringify(this.state.tradepk));
												setGlobalStorage('sessionStorage', 'sessionpk', this.state.tradepk);
											}
											console.log('transtype:', getGlobalStorage('sessionStorage', 'sessionTP'));
											console.log('transtype_name:', getGlobalStorage('sessionStorage', 'sessionName'));
											console.log('pk_transtype:', getGlobalStorage('sessionStorage', 'sessionpk'));
										}
									);
								}}
								isMultiSelectedEnabled={false}
								clickContainer={<NCButton fieldid='trade_type'>
									{this.props.MutiInit.getIntl("36070RBM") &&
										this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000047')}
								</NCButton >}/* 国际化处理： 收款交易类型*/
							/>}
						</div>
						{/* 小应用注册按钮 */}
						<div>
							{createButtonApp({
								area: Templatedata.list_head,
								buttonLimit: 8,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
					</div>
				</NCDiv>
				{!isvoucherlink && !isotherlink &&
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: searchBtnClick.bind(this),
							defaultConditionsNum: 2, //默认显示几个查询条件
							showAdvBtn: true,                           //  显示高级按钮
							// renderCompleteEvent: this.renderCompleteEvent,  // 查询区渲染完成回调函数[回显查询条件] 
							// searchBtnName :''                        //    查询按钮名称，默认查询
							// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
							// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
							// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
							// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
							// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
							// addAdvTabs: this.addAdvTabs              // 添加高级查询区自定义页签 (fun), return Dom 
							// oid: '0001Z61000000000RI33'

						})}
					</div>
				}
				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}
				{/* 页签颜色灰色需要注释如下div样式 */}
				{/* <div className="tab-definInfo-area"> */}

				{!isvoucherlink && !isotherlink &&

					<NCTabs activeKey={this.state.defaultKey} onChange={(v) => { this.navChangeFun.call(this, v); }}>
						<NCTabPane key={'0'} tab={
							<span>{
								//待提交
								this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000087') + '('}<span>{this.state.tabs10}</span>{')'}
							</span>
						} />
						<NCTabPane key={'1'} tab={
							<span>{
								//审批中
								this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000088') + '('}<span>{this.state.tabs02}</span>{')'}
							</span>
						} />
						<NCTabPane key={'2'} tab={
							<span>{
								//全部
								this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000089')}
							</span>
						} />
					</NCTabs>

				}

				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: this.dataSource,
						pkname: this.pkname,
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onSelected: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						onSelectedAll: buttonUsability.bind(this, this.props, ''),//列表控制列表按钮是否可用
						showCheck: true,
						showIndex: true,//显示序号
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							//begin tm tangleic 20200326 表格数据加载完毕 处理按钮可用性
							buttonUsability.call(this, this.props, '');
							//end tm tangleic
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
							this.setState({ showInspection: false, sourceData: null })
						}}
						affirm={() => {
							this.setState({ showInspection: false, sourceData: null })
						}}
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
						billType={'F4'} //单据类型
						pagecode='36070RBM_C01'
						appcode={Templatedata.app_code}
						selectedPKS={this.selectedPKS}
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
				<div>
					{/* 提交及指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000114')}
						data={this.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedrFunction}
						cancel={
							() => {
								this.setState({
									compositedisplay: false
								})
							}
						}
					/> : ""}
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