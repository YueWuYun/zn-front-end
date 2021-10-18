/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, base, high, cardCache, getMultiLang, viewModel,toast } from 'nc-lightapp-front';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { buttonVisable } from "./events/buttonVisable";//自定义按钮显示
import { orgVersionUtil } from "../util/orgVersionUtil";//多版本显示
import { formBeforeEvent } from '../util/CMPFormRefFilter.js';//单据控制规则[form编辑前事件]
import { bodyBeforeEvent } from '../util/CMPTableRefFilter.js';//单据控制规则[table编辑前事件]
import { getLinkquery } from './indexUtil/getLinkquery.js';
import { getLinkQueryData } from './indexUtil/getLinkQueryData.js';
import { loadQueryData } from './indexUtil/loadQueryData.js';
import { linkLoadQueryData } from './indexUtil/linkLoadQueryData.js';
import { getStandardQueryData } from './indexUtil/getStandardQueryData.js';
import { delConfirm } from './indexUtil/delConfirm.js';
import { changeOrgConfirm } from './indexUtil/changeOrgConfirm.js';
import { cancelBtnClick } from './indexUtil/cancelBtnClick.js';
import { saveBill } from './indexUtil/saveBill.js';
import { saveAddBill } from './indexUtil/saveAddBill.js';
import { saveSubBill } from './indexUtil/saveSubBill.js';
import { cancelConfirm } from './indexUtil/cancelConfirm.js';
import { saveSubAssginBill } from './indexUtil/saveSubAssginBill.js';
import { buttonUsability } from './events/buttonUsability.js';
import { setPkRegister, setPkNoteNo } from "./events/checkNoteno.js";//票据号相关
import { linkToggleShow } from './indexUtil/linkToggleShow.js';//被联查页面状态加载
import { commonurl } from '../../../public/utils/constant';//附件改造使用
import { addmodellineBtn } from './tableButtonClick/addlineBtn';//表体增行
import { associateFbmBillData } from './indexUtil/associateFbmBill';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import { SCENE, URL_PARAM } from '../../../../tmpub/pub/cons/constant.js';//联查使用场景
import { checkSingleSettle, checkSingleSettleDel } from './buttonClick/checkSingleSettle';
let { NCAffix, NCButton } = base;
let { setGlobalStorage, getGlobalStorage } = viewModel;
const { NCUploader, ApproveDetail, ApprovalTrans, Refer, BillTrack, PrintOutput, Inspection } = high;//附件相关
const { NCDiv } = base;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * [收款结算]-卡片
 */
let page_id = Templatedata.card_pageid;
let { getCurrentLastId, getCacheById, deleteCacheById } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		if (props.getUrlParam('pagecode')) {
			page_id = props.getUrlParam('pagecode');//根据交易类型赋值pagecode，跳转不同页面
		}
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'RecBillVO';//form表单的vo类名
		this.tableVOClassName = 'RecBillDetailVO';//table表体的vo类名
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.card_tableid;
		this.tableId = Templatedata.card_tableid;
		this.childform = Templatedata.card_edit_form;
		this.pageId = page_id;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;//缓存相关
		this.pkname = Templatedata.pkname;//缓存相关
		this.billno = '', // 单据编号
		this.settlepkinfo = null;//关联结算信息使用
		this.sourceData = null,//联查预算数据源
			this.showbilltrackpk = '',//联查单据pk
			this.showbilltracktype = '',//联查单据类型
			this.approvebillid = '',//审批意见单据pk
			this.billtype = '',//审批意见单据类型
			this.billId = '',//单据pk
			this.deleteId = '',//删除缓存的id
			this.org_value = '';//切换组织取消使用
		this.org_display = '';//切换组织取消使用
		this.target = null;//附件控制弹出位置
		this.outputData = '';//打印输出使用
		this.compositedata = null;//提交指派页面
		this.getConstAssginUsedr = null;//提交指派的value
		this.notestatus = 'add';//编辑票据号前的状态
		this.pk_registers = null;//票据号表体pk集合
		this.backSceneMark = null;//浏览态是否可以显示返回箭头
		this.state = {
			sourceData: null,//计划预算显示值<不能放在全局变量中,否则影像刷新>
			tradetype: 'D4',//按钮交易类型：对应code
			tradename: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000019'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4',//按钮交易类型：对应pk
			showInspection: false,//联查预算
			showbilltrack: false,//联查单据
			show: false,//审批意见是否显示
			showUploader: false,//控制附件弹出框
			pasteflag: false,//表体中按钮的显隐性状态
			compositedisplay: false,//是否显示指派页面
			isSaveSub: false,//是否保存提交标识
			tableindex: null,
			isTradeshow: false,//交易类型按钮是否显示
			isPublishTradeTypeApp:false,//是否发布交易类型而来的小应用
			// 取个性化中心设置的组织,用户预设财务组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,
			sscivmMessage:null,
			showbilltrackpk:'',
			showbilltracktype:'',
			approvebillid:'',
			billtype:''

		};
	}
	componentDidMount() {
	}
	//首次加载数据
	initData = () => {
		let link_src = this.props.getUrlParam('src');//联查来源
		let link_sce = this.props.getUrlParam('scene');//联查场景
		this.backSceneMark = this.props.getUrlParam('scene');
		//被联查处理信息
		if (link_src && link_src == 'settlement') {
			getLinkquery.call(this);//关联结算信息回调
		} else if (link_src && link_src == 'ssc') {
			linkLoadQueryData.call(this);//报账中心联查
		}else if (link_src && link_src == 'fbm_relation') {
			let  pk_registers=this.props.getUrlParam('id');
			associateFbmBillData.call(this,pk_registers);//票据生成数据
		} else if (link_sce && link_sce === SCENE.LINK && this.props.getUrlParam(URL_PARAM.PK_SRC)) {
			getStandardQueryData.call(this);//fts反联查
		} else if (link_sce) {
			//联查到卡片然后判断如果获取到是多个pk跳转到列表，单个直接显示卡片
			linkLoadQueryData.call(this);//联查单据过来的联查卡片
		} else {
			this.refresh();
		}
	}
	//浏览器页签关闭提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		};
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
	//联查单据[结算信息]
	getLinkQueryData = (searchData) => {
		getLinkQueryData.call(this, searchData);
	}
	//加载数据[刷新数据]
	refresh = () => {
		loadQueryData.call(this);//加载数据
	}
	//设置页面的编辑性
	setPageStatus = () => {

		let status = this.props.getUrlParam('status');//页面状态
		if (status == 'browse') {
			this.props.cardTable.setStatus(this.tableId, 'browse');
			this.props.form.setFormStatus(this.formId, 'browse');
		} else {
			let check_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
			if (check_org && check_org.value) {
				this.props.resMetaAfterPkorgEdit();
			}
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.form.setFormStatus(this.formId, 'edit');
		}
	}
	//被联查页面加载状态
	linkToggleShow = () => {
		linkToggleShow.call(this);//被联查页面状态加载
	}
	//标准页面状态加载
	toggleShow = () => {

		let status = this.props.getUrlParam('status');//页面状态
		//票据号相关赋值
		if (status && status == 'edit') {
			this.notestatus = status;//票据号状态
			this.pk_registers = null;//重置表体票据号pk
			setPkRegister.call(this);//汇总表体票据号pk
		}
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		if (!this.props.getUrlParam('id') || this.props.getUrlParam('id').length <= 0) {
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		}

		if (status == 'browse') {
			//设置卡片头部状态
			if (this.billno != null) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.billno  //修改单据号---非必传
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
			}
		} else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});

		} else {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		//单据被联查标识，是否有联查场景
		if (this.backSceneMark) {
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//不显示分页按钮
			if (this.props.getUrlParam('scene') != 'bz') {//我的报账传过来特殊处理
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				});
			}
		}
		// setPkNoteNo.call(this);//给table中有票据号的表体所有非元数据pk_note赋值[查询出数据赋值即可]
		this.setPageStatus();//设置页面表头和表体编辑态
		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		buttonVisable.call(this, this.props);//按钮的显隐性
		buttonUsability.call(this, this.props);//控制卡片表体中肩部按钮是否可用
	};
	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initMetaByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		} else {
			this.props.resMetaAfterPkorgEdit();
		}
	}
	//卡片返回按钮
	handleClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo('/list');
	}
	//删除单据
	delConfirm = () => {
		delConfirm.call(this);
	};
	//切换组织--确定
	changeOrgConfirm = () => {
		changeOrgConfirm.call(this);
	}
	//切换组织取消按钮
	cancelBtnClick = () => {
		cancelBtnClick.call(this);
	}
	//保存单据
	saveBill = () => {
		saveBill.call(this);
	};
	//保存新增
	saveAddBill = () => {
		saveAddBill.call(this);
	}
	//保存提交
	saveSubBill = () => {
		saveSubBill.call(this);
	}
	//取消确认按钮
	cancelConfirm = () => {
		cancelConfirm.call(this);
	}
	//取消---跳转浏览态页面
	//@param url:请求的连接
	//@param pk:跳转数据pk
	//@param pagecode:请求的pageid
	//@param billno:请求的单据状态
	cancleNewPage = (pk, bill_no, pagecode) => {

		this.props.pushTo('/card', {
			status: 'browse',
			id: pk,
			billno: bill_no,
			pagecode: pagecode
		})
		this.refresh();
		// this.toggleShow();//切换页面状态
	}
	/**
 	 * 跳转空白card页面
 	 */
	cancleSkyPage = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.cardTable.setTableData(this.tableId, { rows: [] });
		this.props.pushTo('/card', {
			status: 'browse',
			id: '',
			billno: '',
			pagecode: this.pageId
		})
		this.billno = null;
		this.props.resMetaAfterPkorgEdit();
		this.toggleShow();//切换页面状态
	}
	/**
	 * 报账联查取消跳转空白页面
	 */
	linkcancleSkyPage = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.cardTable.setTableData(this.tableId, { rows: [] });
		this.props.setUrlParam({
			status: 'browse',
			id: '',
			billno: '',
			pagecode: this.pageId
		});
		this.billno = null;
		this.props.resMetaAfterPkorgEdit();
		this.toggleShow();//切换页面状态
	}
	//加载缓存数据
	loadCacheData = () => {
		let data_id = getCurrentLastId(this.dataSource);
		let cardData;
		if (data_id) {
			cardData = getCacheById(data_id, this.dataSource);
		}
		if (cardData) {
			//加载缓存
			this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
			let billno_1 = cardData.head[this.formId].rows[0].values.bill_no.value;
			let urlbillno_1 = cardData.head[this.formId].rows[0].values.bill_status.value;
			this.billno = billno_1;
			props.setUrlParam({
				status: 'browse',
				id: pks,
				billno: urlbillno_1,
				pagecode: this.pageId
			});

			this.toggleShow();//切换页面状态
		} else {
			this.cancleSkyPage();
		}
		//如果没有缓存数据？
	}
	// 调用删除缓存数据方法
	deleteCacheData = () => {
		deleteCacheById(this.pkname, this.deleteId, this.dataSource);
	}
	//审批指派返回action如果需求可以请求后台
	getAssginUsedr = (value) => {
		this.getConstAssginUsedr = value;
		if (this.state.isSaveSub) {
			//指派提交[保存提交]
			// saveSubAssginBill.call(this);
			saveSubBill.call(this);
		} else {
			//指派提交[肩部按钮]
			buttonClick.call(this, this.props, 'submittAssginBtn');
		}
	}
	//获取列表肩部信息,肩部按钮
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">

				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: Templatedata.card_body,
						buttonLimit: 3,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}

				</div>
			</div>
		);
	};
	 //检查是否是独立结算信息
	 checkSettleInfo=()=>{
		let isfromindependent=this.props.form.getFormItemsValue(this.formId, 'isfromindependent');
		if(isfromindependent&&isfromindependent.value&&isfromindependent.value=='1'){
			toast({
				color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
					this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000111')
			});//国际化处理:不允许改变独立结算信息的行数!
			return true;
		 } else{
	 	return false;
		}
	}

		 //检查是否是独立结算信息
		 checkSettleAlterRow=()=>{
			let isfromindependent=this.props.form.getFormItemsValue(this.formId, 'isfromindependent');
			
			
			let  delFlag=isfromindependent&&isfromindependent.value&&(isfromindependent.value==1);
			//console.log(isfromindependent);
			//console.log(isfromindependent.value);
			//console.log(isfromindependent.value==1)
			if(delFlag){
				toast({
					color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
						this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000111')
				});//国
				
			}
			return !delFlag;
		}
	render() {
		let { cardTable, form, button, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButtonApp ,createErrorFlag} = button;
		let { showUploader } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		//支持网新增需求_begin:交易类型发布小应用得到的应用名称要做相应修改
		let billname = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000046');//标题
		if (getGlobalStorage('sessionStorage', 'billname')) {
			billname = getGlobalStorage('sessionStorage', 'billname');//标题
		}
		//end
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
				})}
				{/* 一主一子特有div */}
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER}
							className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: billname,//标题
											billCode: this.billno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.handleClick();
											}
										}
									)}
							</div>
							<div className="header-button-area">
								<div className="button-app-wrapper">		
									{createErrorFlag({
										headBtnAreaCode: cons.card.btnHeadCode
									})}
								</div>
								<div className="button-app-wrapper">
									{this.state.isTradeshow && !this.state.isPublishTradeTypeApp &&
										<Refer
											placeholder={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000035')/* 国际化处理： 单据模板类型*/}
											refName={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000036')}/* 国际化处理： 收款交易类型*/
											refCode={'tradetypeF4'}
											refType={'grid'}
											queryGridUrl={'/nccloud/riart/ref/fiBillTypeTableRefAction.do'}
											columnConfig={[
												{
													name: [this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000129'), 
													this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000130')],
													code: ['refcode', 'refname']/* 国际化处理： 编码,名称*/
												}
											]}
											queryCondition={{
												parentbilltype: 'F4'//过滤条件
											}}
											value={this.state.tradetype}
											onChange={(value) => {
												//console.log(value);

												this.setState(
													{
														tradetype: value.refcode,
														tradename: value.refname,
														tradepk: value.refpk
													},
													function () {
														if (this.state.tradetype && this.state.tradetype.length > 0) {
															setGlobalStorage('sessionStorage', 'sessionTP', this.state.tradetype);
														}
														if (this.state.tradename && this.state.tradename.length > 0) {
															setGlobalStorage('sessionStorage', 'sessionName', this.state.tradename);
														}
														if (this.state.tradepk && this.state.tradepk.length > 0) {
															setGlobalStorage('sessionStorage', 'sessionpk', this.state.tradepk);
														}
														//console.log('transtype:', getGlobalStorage('sessionStorage', 'sessionTP'));
														//console.log('transtype_name:', getGlobalStorage('sessionStorage', 'sessionName'));
														//console.log('pk_transtype:', getGlobalStorage('sessionStorage', 'sessionpk'));
													}
												);
											}}
											isMultiSelectedEnabled={false}
											clickContainer={
												<NCButton fieldid='trade_type' >
													{this.props.MutiInit.getIntl("36070RBM") &&
														this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000047')}

												</NCButton >}
										/>}

								</div>
								<div>
									{createButtonApp({
										area: Templatedata.card_head,
										buttonLimit: 14,
										onButtonClick: buttonClick.bind(this)
									})}
								</div>
							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									dataSource: this.dataSource,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1],
							onAfterEvent: afterEvent.bind(this),//编辑后事件
							onBeforeEvent: formBeforeEvent.bind(this)//form编辑前事件
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{
							createCardTable(this.tableId, {
								adaptionHeight: true,//表格固定行
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: () => {
									this.saveBill();
									this.props.cardTable.closeModel(this.tableId);//关闭侧拉
								},
								onAfterEvent: afterEvent.bind(this),//编辑后事件
								onBeforeEvent: bodyBeforeEvent.bind(this),//table编辑前事件
								onSelected: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
								onSelectedAll: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
								showIndex: true,//显示序号
								showCheck: true,
								modelDelRowBefore:()=> {
									let isfromindependent=this.props.form.getFormItemsValue(this.formId, 'isfromindependent');
									let  delFlag=isfromindependent&&isfromindependent.value&&(isfromindependent.value==1);
								   if(delFlag){
									 toast({
										 color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
											 this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000111')
									 });//国
								   } 
									return !delFlag;
								 },

								modelAddRowBefore:()=> {
								   let isfromindependent=this.props.form.getFormItemsValue(this.formId, 'isfromindependent');
								   let  addFlag=isfromindependent&&isfromindependent.value&&(isfromindependent.value==1);
								  if(addFlag){
									toast({
										color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
											this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000111')
									});//国
								  } 
								   return !addFlag;
								},
								modelAddRow: (props, moduleId, index) => {
									addmodellineBtn.call(this);//增行后赋值
								}
							})
						}
					</div>
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={this.billId}
							target={this.target}
							placement={'bottom'}
							billNo={this.billno}
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
						billid={this.state.approvebillid}
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/recbill/recbillprintcard.do'
						data={this.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div>
					{/* 提交及指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000114')}
						data={this.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr}
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

Card = createPage({
	mutiLangCode: Templatedata.list_moduleid,
	billinfo: {
		billtype: 'card',//一主一子
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid,
		bodycode: Templatedata.card_tableid,
	},
	orderOfHotKey: [Templatedata.card_formid, Templatedata.card_tableid]//快捷键
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/