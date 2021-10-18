/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
﻿//主子表卡片
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { saveMultiLangRes,createCardWebSocket } from '../../../../tmpub/pub/util';
import { processHeadOlcRateEditable } from '../../../public/cmppubutil';
const { NCAffix, NCDiv } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans } = high;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ctablecode;
		this.formId = constant.formcode1;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			addid: '',
			oldorg:'',
			oldorgDis:'',
			showUploader: false, // 附件弹框
			target: null,
			approveshow: false, // 提交指派弹框
			outputData: '', // 输出数据
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[],// 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true, // 返回按钮
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, // 多语
			inlt: null,
			sscivmMessage:'',
		};
		// initTemplate.call(this, props);
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				// console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode,'36070APM']
			}, 
		callback });
		
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		this.renderHtmlByStatus();
	}

	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initBillByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();//此方法不可以调用2次，不然rest失败
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		}
		if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();
		}
		if (status === 'copy') {
			this.props.resMetaAfterPkorgEdit();
		}
	}

	// 根据不同状态渲染不同数据
	renderHtmlByStatus = () =>{

		this.initBillByPKorg();
		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		let statusflag = urlstatus === 'browse' ? false : true;
		if(statusflag){
			this.disablefield();
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: vbillno
			});
			buttonVisible(this.props, null);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}
		//查询单据详情
		if (urlstatus === 'add') {
			//默认新增添加默认值财务组织
			this.setState({ billno: null});
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: vbillno
			});
			this.props.form.EmptyAllFormValue(this.formId);
			let adddata = { pageCode: this.pageId };
			//可以调用后台
			ajax({
				url: requesturl.add,
				data: adddata,
				success: (res) => {
					//获取后台返回data				
					if (res.data) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						let orgpk = res.data[this.formId].rows[0].values.pk_org.value;
						let olcrate = res.data[this.formId].rows[0].values.olcrate.value;
						if(olcrate){
							this.props.form.setFormItemsDisabled(this.formId,{'olcrate': true});
						}
						if(orgpk){
							this.props.resMetaAfterPkorgEdit();
						}
						orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}

		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}
		//查询单据详情
		if (urlstatus === 'edit') {
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let billno = res.data[this.formId].rows[0].values.billno.value;
							let systemcode = res.data[this.formId].rows[0].values.systemcode.value;
							this.props.form.setFormItemsDisabled(this.formId,{'pk_org': true});
							processHeadOlcRateEditable.call(this,res.data.userjson);
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								// showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});
							orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
							this.judesystemcode(systemcode);
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		} 

		if (urlstatus === 'copy') {
			this.setState({ billno: null});
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				// showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: vbillno
			});
			ajax({
				url: requesturl.copy,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId,{'pk_org': true});
							orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
							let systemcode = res.data[this.formId].rows[0].values.systemcode.value;
							this.judesystemcode(systemcode);
							processHeadOlcRateEditable.call(this,res.data.userjson);
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}
	}

	// 判断来源系统
	judesystemcode(systemcode){
		if(systemcode === '5'){
			this.props.form.setFormItemsDisabled(this.formId,{'pk_currency': true});
			this.props.form.setFormItemsDisabled(this.formId,{'pk_bankaccount': true});
			this.props.form.setFormItemsDisabled(this.formId,{'money': true});
		}else{
			this.props.form.setFormItemsDisabled(this.formId,{'pk_currency': false});
			this.props.form.setFormItemsDisabled(this.formId,{'pk_bankaccount': false});
			this.props.form.setFormItemsDisabled(this.formId,{'money': false});
		}
	}

	// 禁用字段
	disablefield(){
		// this.props.form.setFormItemsDisabled(this.formId,{'billno': true});
		this.props.form.setFormItemsDisabled(this.formId,{'billstatus': true});
		this.props.form.setFormItemsDisabled(this.formId,{'vbillstatus': true});
		this.props.form.setFormItemsDisabled(this.formId,{'settlestatus': true});
		this.props.form.setFormItemsDisabled(this.formId,{'olcmoney': true});
		this.props.form.setFormItemsDisabled(this.formId,{'billmaker': true});
		this.props.form.setFormItemsDisabled(this.formId,{'billmakedate': true});
		this.props.form.setFormItemsDisabled(this.formId,{'commiter': true});
		this.props.form.setFormItemsDisabled(this.formId,{'commitdate': true});
		this.props.form.setFormItemsDisabled(this.formId,{'approver': true});
		this.props.form.setFormItemsDisabled(this.formId,{'approvedate': true});
		this.props.form.setFormItemsDisabled(this.formId,{'pk_executor': true});
		this.props.form.setFormItemsDisabled(this.formId,{'settledate': true});
		this.props.form.setFormItemsDisabled(this.formId,{'glcmoney': true});
		this.props.form.setFormItemsDisabled(this.formId,{'gllcmoney': true});
	}

	//清空金额
	emptymoney () {
		this.props.form.setFormItemsValue(this.formId,{'olcmoney':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'glcmoney':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'gllcmoney':{ display: null, value: null }});
	}

	//清空本币汇率
	emptyrate () {
		this.props.form.setFormItemsValue(this.formId, { olcrate: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { glcrate: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { gllcrate: { display: null, value: null } });
	}
	// 禁用本币汇率
	disablerate () {
		this.props.form.setFormItemsDisabled(this.formId,{'olcrate':true});
		this.props.form.setFormItemsDisabled(this.formId,{'glcrate':true});
		this.props.form.setFormItemsDisabled(this.formId,{'gllcrate':true});
	}
	// 取消禁用本币汇率
	undisablerate () {
		this.props.form.setFormItemsDisabled(this.formId,{'olcrate':false});
		this.props.form.setFormItemsDisabled(this.formId,{'glcrate':false});
		this.props.form.setFormItemsDisabled(this.formId,{'gllcrate':false});
	}

	// 浏览态数据渲染
	browseRender = (pkbill) =>{
		let cardData,billstatus,billno,pk_cashdraw
		let scene = this.props.getUrlParam('scene');
		if(pkbill){
			cardData = getCacheById(pkbill, this.cacheDataSource);
			let queryData =  { pk: pkbill, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });

				billno = cardData[this.formId].rows[0].values.billno.value;
				pk_cashdraw = cardData[this.formId].rows[0].values[this.pkname].value;
				billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible(this.props, billstatus);
				this.props.form.setFormStatus(this.formId, 'browse');

				this.setState({ 
					addid: pk_cashdraw,
				});
				if(scene){
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: billno
					});
				}else{
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: billno
					});
				}
				// this.props.BillHeadInfo.setBillHeadInfoVisible({
				// 	showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// 	showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				// 	billCode: billno
				// });
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			}else{
				ajax({
					url: requesturl.querycard,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								billno = res.data[this.formId].rows[0].values.billno.value;
								pk_cashdraw = res.data[this.formId].rows[0].values[this.pkname].value;
								billstatus = res.data[this.formId].rows[0].values.billstatus.value;
								this.setState({ 
									addid: pk_cashdraw,
								});
								if(scene){
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: billno
									});
								}else{
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: billno
									});
								}
								// this.props.BillHeadInfo.setBillHeadInfoVisible({
								// 	showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								// 	showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								// 	billCode: billno
								// });
								buttonVisible(this.props, billstatus);
								this.props.form.setFormStatus(this.formId, 'browse');



								orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
							}else{
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
					}
				});
			}
		}else{
			this.emptyData();
		}
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}

	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props, null);
		this.setState({ 
			billno: null,
			addid: null,
			// showNCbackBtn: true
		});
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
			// billCode: billno
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata){
		let billno,id,billstatus;
		if(billdata.head){
			billno = billdata.head[this.formId].rows[0].values.billno.value;
			id = billdata.head[this.formId].rows[0].values[this.pkname].value;
			billstatus = billdata.head[this.formId].rows[0].values.billstatus.value;
			// 更新缓存
			updateCache(this.pkname,id,billdata,this.formId,this.cacheDataSource, billdata.head[this.formId].rows[0].values);	
			this.props.form.setAllFormValue({
				[this.formId]: billdata.head[this.formId]
			});
		}else{
			billno = billdata[this.formId].rows[0].values.billno.value;
			id = billdata[this.formId].rows[0].values[this.pkname].value;
			billstatus = billdata[this.formId].rows[0].values.billstatus.value;
			// 更新缓存
			updateCache(this.pkname,id,billdata,this.formId,this.cacheDataSource, billdata[this.formId].rows[0].values);
			this.props.form.setAllFormValue({
				[this.formId]: billdata[this.formId]
			});
		}
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: billno
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});
		
		this.props.form.setFormStatus(this.formId, 'browse');
		buttonVisible(this.props, billstatus);
	}

	// 更改组织确认按钮
	ortBeSureBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		this.props.form.cancel(this.formId);
		this.props.form.setFormItemsValue(this.formId, {
			'pk_org': {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		if (!pk_org) {
			//tm begin lidyu 解决从历史记录中选择财务组织 其他字段不可编辑问题 20200320
			// this.props.initMetaByPkorg();
			//end lidyu 20200320
			this.emptyorgcleandata();
		} else {
			let changedata = this.props.createFormAfterEventData(this.pageId, this.formId);
			ajax({
				url: requesturl.orgchange,
				data: changedata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							processHeadOlcRateEditable.call(this,res.data.userjson);
							this.orgchangecleandata();
							this.disablefield();
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
		}
		//清空表格
		//this.props.form.EmptyAllFormValue('head');
	};

	// 组织修改取消
	orgCancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	// 更改组织清空输入数据
	orgchangecleandata = () => {
		this.props.form.setFormItemsValue(this.formId,{'pk_bankaccount':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'money':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'olcmoney':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'pk_balatype':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'brief':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'glcmoney':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'gllcmoney':{ display: null, value: null }});
	}

	// 清空组织，清空其他数据
	emptyorgcleandata = () =>{
		this.props.form.setFormItemsValue(this.formId,{'pk_currency':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'pk_cashaccount':{ display: null, value: null }});
		this.props.form.setFormItemsValue(this.formId,{'olcrate':{ display: null, value: null }});
		this.orgchangecleandata();
	}

	//删除单据
	delConfirm = () => {

		let pksArr = [];
		let pktsmap = {};
		//处理选择数据
		
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pksArr.push(pk); //主键数组
		pktsmap[pk] = ts;
		
		//自定义请求数据
		let deldata = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			pks: pksArr
		};

		ajax({
			url: requesturl.delete,
			data:deldata,
			success: (res) => {
				let {data, success} = res
					if(success){
						if(data){
							if(data.failMsg.length > 0){
								toast({
									color: 'danger',
									content: data.failMsg[0]/* 国际化处理： 删除成功*/
								});
							}else{
								toast({ color: 'success', content: this.state.json['36070WC-000008'] });/* 国际化处理： 删除成功*/
								let nextId = getNextId(pk, this.cacheDataSource);
								deleteCacheById(this.pkname, pk, this.cacheDataSource);
								this.props.setUrlParam(nextId);
								this.browseRender(nextId);
							}
						}
					}
			}
		});
	};
	
	// 取消弹框确认按钮操作
	cancelModalBeSure = () => {
		let pk_cashdraw = this.props.getUrlParam('id');
		let id = getCurrentLastId(this.cacheDataSource);
		let addid;
		if(this.state.addid){
			addid = this.state.addid;
		}else{
			addid = this.props.getUrlParam('addid');
		}
		//动态修改地址栏中的status的值
		this.props.setUrlParam({
			status: 'browse'
		});
		if(pk_cashdraw){
			//动态修改地址栏中的status的值
			this.props.setUrlParam({
				id: pk_cashdraw
			});
			this.browseRender(pk_cashdraw);
		}else{
			if(id){
				//动态修改地址栏中的status的值
				this.props.setUrlParam({
					id: id
				});
				this.browseRender(id);
			}else{
				if(addid){
					//动态修改地址栏中的status的值
					this.props.setUrlParam({
						id: addid
					});
					this.browseRender(addid)
				}else{
					this.emptyData();
				}
			}
		}
	};

	// 取消弹框取消按钮操作
	cancelModalCancel = () => {
		// console.log("修改之前的财务组织",this.state.oldorg);
		// this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		// this.props.form.setFormStatus(this.formId, 'edit');
	};
	
	// 返回方法
	backClick = () =>{
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath,{pagecode: constant.lpagecode});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	// 提交即指派
	getAssginUsedr = (value) => {
		
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_cashdraw').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pktsmap[pk] = ts;

		//自定义请求数据
		let data = {
			pageCode: this.pageId,
			pktsmap: pktsmap,
			pk: pk,
			ts: ts,
			userObj:value
		};
		const formcode1 = constant.formcode1;
		ajax({
			url: requesturl.commitcard,
			data: data,
			success:  (res) => {
				let { success, data } = res;
				if (success) {
					let id = res.data.form[formcode1].rows[0].values.pk_cashdraw.value
					updateCache(this.pkname, id, res.data.form, formcode1, this.cacheDataSource, res.data.form[formcode1].rows[0].values);
					toast({
						color: 'success',
						content: this.state.json['36070WC-000001'] /* 国际化处理： 提交成功*/
					});
					this.buttonAfter(data.form);
					this.setState({
						compositedata: data.form,
						compositedisplay: false,
					});
				} else {
					this.props.table.setAllTableData(this.formId, { rows: [] });
				}
			}
		});
	}

	render() {
		let { form, cardPagination } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		// const { createButtonApp, createErrorFlag } = button;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
			 {/**创建websocket */}
			 {createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: constant.formcode1,
                    billpkname: constant.pkname,
					billtype: constant.billtype,
					dataSource:constant.cacheDataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/* <div className="nc-bill-top-area"> */}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: this.state.json['36070WC-000019'],  ///* 国际化处理： 现金缴存*/
									billCode: this.state.billno,//单据号
									backBtnClick: () => { //返回按钮的点击事件
										this.backClick();
									}
								})}
							</div>
							  {/** 渲染按钮 **/}
							<div className="header-button-area">
							{this.props.button.createErrorFlag({
                                    headBtnAreaCode: 'card_head'
                                })}
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 7,
									onButtonClick: buttonClick.bind(this),
									// popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							{/* 附件 */}
							<div className="nc-faith-demo-div2">
								{/* 这里是附件上传组件的使用，需要传入三个参数 */}
								{showUploader && <NCUploader
										billId={billId}
										target={target}
										placement={'bottom'}
										billNo={billno}
										onHide={this.onHideUploader} // 关闭功能
										/>
								}
							</div>
							<div className="header-cardPagination-area" style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: this.cacheDataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>
				{/* 设置卡片展开于隐藏 默认隐藏 */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ this.formId, constant.formcode2 ],
						onAfterEvent: afterEvent.bind(this)
					})}
				</div>
				{/* </div> */}
				{/* 联查审批意见 */}
				<div>
                	<ApproveDetail
                    	show={this.state.approveshow}
                    	close={() =>{
							this.setState({
								approveshow: false
							})
						}}
                   		billtype={constant.billtype}
                    	billid={billId}
                	/>
            	</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData = {this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
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

				{this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['36070WC-000048']}
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={() => {
                        //关闭对话框
                        this.setState({
							compositedata: null,
							compositedisplay: false,
						});
                    }}
                /> : ""}

			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'form',
        pagecode: constant.cpagecode,
        headcode: constant.formcode1
    },
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/