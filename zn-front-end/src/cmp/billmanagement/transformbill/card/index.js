/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible.js';
import { orgVersionUtil } from '../config/orgVersionUtil';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index';
import { savecommit , repaintView} from '../card/events/buttonClick'

import {
	sourceModel_CMP,
	SHOWMODEL_BULU,
	SHOWMODEL_LIULAN,
	SHOWMODEL_ZHIFU,
	commondata
} from '../../../public/utils/constant';
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import { formBeforeEvent } from '../beforeEvent/formRefFilter';
import Sign from '../../../../tmpub/pub/util/ca';
import { commonurl } from '../../../public/utils/constant';
import {
	editdiablefield,
	orgchangecleandata,
	emptyorgcleandata,
	sourceflagtranslate,
	initBillByPKorg
} from '../pubutil/cardfunction';
// import JointBill from '../../../../sscrp/refer/jointbill/JointBillTableRef/config/JointBillModal';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const { NCBackBtn, NCAffix, NCDiv } = base;
const { NCUploader, ApproveDetail, BillTrack, PrintOutput, ApprovalTrans } = high;
import { processHeadOlcRateEditable } from '../pubutil/util';
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ctablecode;
		this.formId = constant.formcode1;
		this.cacheDataSource = constant.cacheDataSource;
		this.billpk = constant.pk_transformbill;

		this.tradeType = 'pk_billtypecode';
		this.formVOClassName = 'TransformBillVO';

		this.state = {
			billId: '', // 单据id
			billno: '', // 单据编号
			addid: '',
			showUploader: false, // 附件
			target: null, // 附件上传组件参数
			approveshow: false, // 审批意见
			billtrackshow: false, // 单据追溯
			showBuLu: false, //设置显示补录模态框显隐性
			onLineData: [], // 补录数据
			modelType: SHOWMODEL_BULU, // 补录框类型
			oldorg: '', // 修改之前的财务组织value值
			oldorgDis: '', // 修改之前的财务组织display值
			outputData: '', // 输出数据
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [], // 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true, // 返回按钮
			billCodeModalShow: false, // 增值税发票
			billCode: '', // 增值税发票单据code
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, //多语
			inlt: null,
			sscivmMessage:'',
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {
		let callback = (json, status, inlt) => {
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			saveMultiLangRes(this.props, json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
			} else {
				// //console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		};
		// getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				[constant.module_tmpub_name]: [ constant.module_tmpub_id ],
				[constant.module_name]: [ constant.module_id, constant.mutiLangCode ]
			},
			callback
		});

		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		};
	}

	componentDidMount() {
		// this.renderHtmlByStatus();
	}

	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initBillByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg(); //此方法不可以调用2次，不然rest失败
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: false }); //财务组织
		}
		if (status === 'edit') {
			this.props.resMetaAfterPkorgEdit();
		}
		if (status === 'copy') {
			this.props.resMetaAfterPkorgEdit();
		}
	};

	// 根据不同的状态渲染不同的页面数据
	renderHtmlByStatus = () => {
		// this.initBillByPKorg();
		initBillByPKorg.call(this);
		let flag = false;
		let status = this.props.getUrlParam('status');
		let src = this.props.getUrlParam('src');
		let pk = this.props.getUrlParam('id');
		let linksce = this.props.getUrlParam('scene');
		let data = { pk: pk, pageCode: this.pageId,userJson:status };

		// 新增
		if (status === 'add') {
			// this.disablefield();
			this.setState({ billno: null });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
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
						let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
						if (sourceflag) {
							// sourceflagtranslate.call(this,sourceflag);
						}
						if (olcrate) {
							this.props.form.setFormItemsDisabled(this.formId, {
								olcrate: true
							});
						}
						if (orgpk) {
							this.props.resMetaAfterPkorgEdit();
						}
						this.disablemoney();
						orgVersionUtil.call(this, this.props, this.formId); //多版本视图显隐性
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
			buttonVisible(this.props, null, null, null, null);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}

		//查询单据详情
		if (status === 'browse') {
			if (pk) {
				this.browseRender(pk);
				if (linksce) {
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
				}
			}
		}

		//查询单据详情
		if (status === 'edit') {
			// this.disablefield();
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billno
			});
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							let billno = res.data[this.formId].rows[0].values.vbillno.value;
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								// showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
								showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
								billCode: billno
							});
							if(res.data.userjson){
								let userjson = JSON.parse(res.data.userjson);
								let {retExtParam} =userjson;
								//设置组织本币列编辑性
								processHeadOlcRateEditable(this.props, retExtParam);
							}
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
							let pk_srcbilltypecode = res.data[this.formId].rows[0].values.pk_srcbilltypecode.value;
							if (sourceflag) {
								sourceflagtranslate.call(this, sourceflag);
							}
							if (pk_srcbilltypecode) {
								editdiablefield.call(this);
							}
							this.disablemoney();
							orgVersionUtil.call(this, this.props, this.formId); //多版本视图显隐性
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
			buttonVisible(this.props, null, null, null, null);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}

		if (status === 'copy') {
			// disablefield.call(this);
			this.setState({ billno: null });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
			ajax({
				url: requesturl.copy,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
							// comparecurrency.call(this,res.data[this.formId].rows[0].values.pk_currtype.value,res.data.userjson);
							if(res.data.userjson){
								let userjson = JSON.parse(res.data.userjson);
								let {retExtParam} =userjson;								
								//设置组织本币列编辑性
								processHeadOlcRateEditable(this.props, retExtParam);
							}
							let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
							if (sourceflag) {
								sourceflagtranslate.call(this, sourceflag);
							}
							this.disablemoney();
							orgVersionUtil.call(this, this.props, this.formId); //多版本视图显隐性
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
				}
			});
			buttonVisible(this.props, null, null, null, null);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}
	};

	// 浏览态数据渲染
	browseRender = (pk) => {
		let cardData, billstatus, isinner, balatypepk, settlesatus;
		let linksce = this.props.getUrlParam('scene');

		if (pk) {
			this.props.setUrlParam({ id: pk });
			cardData = getCacheById(pk, this.cacheDataSource);
			let queryData = { pk: pk, pageCode: this.pageId };
			if (cardData) {
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
				let vbillno = cardData[this.formId].rows[0].values.vbillno.value;
				let billpk = cardData[this.formId].rows[0].values[this.billpk].value;
				billstatus = cardData[this.formId].rows[0].values.busistatus.value;
				isinner = cardData[this.formId].rows[0].values.isinner_pay.value;
				balatypepk = cardData[this.formId].rows[0].values.pk_balatype.value;
				settlesatus = cardData[this.formId].rows[0].values.settlesatus.value;

				let sourceflag = cardData[this.formId].rows[0].values.sourceflag.value;
				if (sourceflag) {
					sourceflagtranslate.call(this, sourceflag);
				}

				buttonVisible(this.props, billstatus, balatypepk, isinner, settlesatus);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({
					addid: billpk
				});
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: vbillno
				});
				this.judgeBillSource(linksce);
				orgVersionUtil.call(this, this.props, this.formId); //多版本视图显隐性
			} else {
				ajax({
					url: requesturl.querycard,
					data: queryData,
					async: false,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								let billno = res.data[this.formId].rows[0].values.vbillno.value;
								let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
								if (sourceflag) {
									sourceflagtranslate.call(this, sourceflag);
								}
								let billid = res.data[this.formId].rows[0].values[this.billpk].value;
								billstatus = res.data[this.formId].rows[0].values.busistatus.value;
								isinner = res.data[this.formId].rows[0].values.isinner_pay.value;
								balatypepk = res.data[this.formId].rows[0].values.pk_balatype.value;
								settlesatus = res.data[this.formId].rows[0].values.settlesatus.value;
								this.setState({
									addid: billid
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: billno
								});
								this.judgeBillSource(linksce);
								this.props.form.setFormStatus(this.formId, 'browse');
								buttonVisible(this.props, billstatus, balatypepk, isinner, settlesatus);
								orgVersionUtil.call(this, this.props, this.formId); //多版本视图显隐性
							} else {
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
					}
				});
			}
		} else {
			this.emptyData();
		}
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	};

	// 清空数据
	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props, null, null, null, null);
		this.setState({
			billno: null,
			addid: null
			// showNCbackBtn: true
		});
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
		});

		this.props.form.setFormStatus(this.formId, 'browse');
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	};

	//清空金额
	emptymoney() {
		this.props.form.setFormItemsValue(this.formId, { olcamount: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { glcamount: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { gllcamount: { display: null, value: null } });
	}
	//禁用金额
	disablemoney() {
		this.props.form.setFormItemsDisabled(this.formId, { olcamount: true });
		this.props.form.setFormItemsDisabled(this.formId, { glcamount: true });
		this.props.form.setFormItemsDisabled(this.formId, { gllcamount: true });
	}

	//清空本币汇率
	emptyrate() {
		this.props.form.setFormItemsValue(this.formId, { olcrate: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { glcrate: { display: null, value: null } });
		this.props.form.setFormItemsValue(this.formId, { gllcrate: { display: null, value: null } });
	}
	// 禁用本币汇率
	disablerate() {
		this.props.form.setFormItemsDisabled(this.formId, { olcrate: true });
		this.props.form.setFormItemsDisabled(this.formId, { glcrate: true });
		this.props.form.setFormItemsDisabled(this.formId, { gllcrate: true });
	}
	// 取消禁用本币汇率
	undisablerate() {
		this.props.form.setFormItemsDisabled(this.formId, { olcrate: false });
		this.props.form.setFormItemsDisabled(this.formId, { glcrate: false });
		this.props.form.setFormItemsDisabled(this.formId, { gllcrate: false });
	}
	// 根据单据来源显示返回按钮
	judgeBillSource = (linksce) => {
		if (linksce) {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				// showBillCode: false //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
	};

	// udpatecache更新缓存
	cacheUpdate = (billdata) => {
		let id = billdata[this.formId].rows[0].values.pk_transformbill.value;
		updateCache(this.billpk, id, billdata, this.formId, this.cacheDataSource, billdata[this.formId].rows[0].values);
		this.pageTransition(id, 'browse');
	};

	// 按钮点击跳转
	pageTransition = (billpk, urlstatus) => {
		let linksce = this.props.getUrlParam('scene');
		this.props.pushTo(constant.cardpath, {
			pagecode: constant.cpagecode,
			status: urlstatus,
			id: billpk,
			scene:linksce
		});
		this.renderHtmlByStatus();
	};
	//删除单据
	delConfirm = () => {
		let pksArr = [];
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
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
			data: deldata,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						if (data.failMsg.length > 0) {
							toast({
								color: 'danger',
								content: data.failMsg[0] /* 国际化处理： 删除成功*/
							});
						} else {
							toast({
								color: 'success',
								content: this.state.json['36070TBR-000011'] /* 国际化处理： 删除成功*/
							});
							let nextId = getNextId(pk, this.cacheDataSource);
							deleteCacheById(this.billpk, pk, this.cacheDataSource);
							this.props.setUrlParam(nextId);
							this.browseRender(nextId);
						}
					}
				}
			}
		});
	};
	// 组织更改确认方法
	orgBeSureBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		this.props.form.cancel(this.formId);
		this.props.form.setFormItemsValue(this.formId, {
			pk_org: {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		if (!pk_org) {
			this.props.initMetaByPkorg();
			emptyorgcleandata.call(this);
			let sourceflag1 = this.props.form.getFormItemsValue(this.formId, 'sourceflag').value;
			if (sourceflag1) {
				sourceflagtranslate.call(this, sourceflag1);
			}
		} else {
			let changedata = this.props.createFormAfterEventData(this.pageId, this.formId);
			ajax({
				url: requesturl.orgchange,
				data: changedata,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							if(res.data.userjson){
								let userjson = JSON.parse(res.data.userjson);
								let {retExtParam} =userjson;
								this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
								//设置组织本币列编辑性
								processHeadOlcRateEditable(this.props, retExtParam);
							}
							let sourceflag = res.data[this.formId].rows[0].values.sourceflag.value;
							if (sourceflag) {
								sourceflagtranslate.call(this, sourceflag);
							}
							orgchangecleandata.call(this);
						}
					} else {
						emptyorgcleandata.call(this);
					}
				}
			});
		}
	};
	// 财务组织取消
	orgCancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	// 取消弹框确认按钮操作
	cancelModalBeSure = () => {
		// let urlstatus = this.props.getUrlParam('status')
		let pk_transformbill = this.props.getUrlParam('id');
		let addid;
		if (this.state.addid) {
			addid = this.state.addid;
		} else {
			addid = this.props.getUrlParam('addid');
		}
		let id = getCurrentLastId(this.cacheDataSource);
		//动态修改地址栏中的status的值
		this.props.setUrlParam({
			status: 'browse'
		});
		if (pk_transformbill) {
			this.browseRender(pk_transformbill);
		} else {
			if (id) {
				this.browseRender(id);
			} else {
				if (addid) {
					this.browseRender(addid);
				} else {
					this.emptyData();
				}
			}
		}
	};
	// 取消弹框取消按钮操作
	cancelModalCancel = () => {
		// //console.log("修改之前的财务组织",this.state.oldorg);
		this.props.form.setFormItemsValue(this.formId, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	// 返回方法
	backClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath, { pagecode: constant.lpagecode });
	};
	closeModal = () => {
		this.setState({ billCodeModalShow: false });
	};
	// 保存网银补录数据
	processRetMsg = async (retPayMsg) => {
		let pksArr = [];
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pksArr.push(pk); //主键数组
		pktsmap[pk] = ts;
		// 判断是支付还是补录
		if (this.state.modelType === SHOWMODEL_ZHIFU) {
			let signdata = await Sign({
				isSign: true,
				isKey: true,
				data: null,
				encryptVOClassName: null,
				primaryId: pksArr
			});
			if (signdata.isStop) {
				return;
			}
			let data = {
				pktsmap: pktsmap,
				pks: pksArr,
				payRetMsg: retPayMsg,
				pageCode: this.pageId,
				requestsrc: 'card',
				clearText: signdata.data.text, // 明文串
				cipherText: signdata.data.signText, // 密文串
				userJson: signdata.data.userjson // 用户信息
			};
			ajax({
				url: requesturl.paycard,
				data: data,
				success: (res) => {
					let { data, success } = res;
					if (success) {
						if (data) {
							this.cacheUpdate(data);
							toast({
								color: 'success',
								content: this.state.json['36070TBR-000075']
							});
						}
					}
				}
			});
		} else if (this.state.modelType === SHOWMODEL_BULU) {
			let signdata = await Sign({
				isSign: false,
				isKey: false,
				data: null,
				encryptVOClassName: null
			});
			if (signdata.isStop) {
				return;
			} else {
				toast({
					color: 'success',
					content: this.state.json['36070TBR-000076']
				});
			}
		}
	};
	// 提交即指派
	getAssginUsedr = (value) => {
		let pktsmap = {};
		//处理选择数据
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_transformbill').value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pktsmap[pk] = ts;
		//自定义请求数据
		let data = {
			pageCode: this.pageId,
			pktsmap: pktsmap,
			pk: pk,
			ts: ts,
			userObj: value
		};
		ajax({
			url: requesturl.commitcard,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({
						color: 'success',
						content: this.state.json['36070TBR-000002'] /* 国际化处理： 提交成功*/
					});
					// this.buttonAfter(data.form);
					this.cacheUpdate(data.form);
					this.setState({
						compositedata: data.form,
						compositedisplay: false
					});
				} else {
					this.props.table.setAllTableData(this.formId, { rows: [] });
				}
			}
		});
	};

	render() {
		let { form, modal, cardPagination, ncmodal ,button} = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createButton, createButtonApp,createErrorFlag } = button;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { createModal } = ncmodal;
		let { showUploader, target, billno, billId, assignShow ,assignData,assignType} = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* <div className="nc-bill-top-area"> */}
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
				})}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.state.json['36070TBR-000023'], ///* 国际化处理： 现金缴存*/
								billCode: this.state.billno, //单据号
								backBtnClick: () => {
									//返回按钮的点击事件
									this.backClick();
								}
							})}
						</div>

						<div className="header-button-area">
							{this.props.button.createErrorFlag({
								headBtnAreaCode: cons.card.btnHeadCode
							})}
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this)
								// popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: this.cacheDataSource
							})}
						</div>
						<div className="nc-faith-demo-div2">
							{/* 这里是附件上传组件的使用，需要传入三个参数 */}
							{showUploader && (
								<NCUploader
									billId={billId}
									target={target}
									placement={'bottom'}
									billNo={billno}
									onHide={() => {
										//关闭对话框
										this.setState({
											showUploader: false
										});
									}} // 关闭功能
									customInterface={{
										queryLeftTree: commonurl.lefttreequery,
										queryAttachments: requesturl.enclosurequery
									}}
								/>
							)}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ constant.formcode1, constant.formcode2, constant.formcode3 ],
						onAfterEvent: afterEvent.bind(this), // 编辑后事件
						onBeforeEvent: formBeforeEvent.bind(this) // 编辑前事件
					})}
				</div>
				{/* </div> */}
				<div>
					{/* <NCButton colors="primary" onClick={this.openBillTrack}>单据追溯</NCButton> */}
					<BillTrack
						show={this.state.billtrackshow}
						close={() => {
							this.setState({ billtrackshow: false });
						}}
						pk={billId} //单据id
						type={constant.billtype} //单据类型
					/>
				</div>

				{/** 指派 */}
				<div>
					{assignShow && (
						<ApprovalTrans
							title={this.state.json['36070TBR-000081'] /* 国际化处理： 指派*/}
							data={assignData}
							display={assignShow}
							getResult={(value) => {
								//关闭指派框
								this.setState({
									assignShow: false,
									assignData: null,
									assignType: constant.assignType.commit
								});
								//判断指派类型 如果是保存提交类型 则继续保存提交
								if (assignType == constant.assignType.savecommit) {
									savecommit.call(this, this.props, value);
								} else {
									//如果是提交类型 继续提交
									let extParam = {};
									if (value) {
										extParam['content'] = JSON.stringify(value);
									}
									cardOperator(this.props, constant.cpagecode, constant.formcode1, [], constant.pk, requesturl.commit, this.state.json['36070TBR-000002'] , constant.cacheDataSource, repaintView.bind(this, this.props), false, extParam);
								}
							}}
							cancel={() => {
								this.setState({ assignShow: false, assignData: null });
							}}
							hideNote={false}
						/>
					)}
				</div>

				{/** 网银补录 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu} //补录框显示
					modal={modal}
					onLineData={this.state.onLineData} //补录数据
					moduleType={sourceModel_CMP} //模块编码
					modelType={this.state.modelType} //补录框类型
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						});
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						});
					}}
				/>

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
					showOriginalData={this.state.showOriginalData}
					// 点击确定按钮的回调函数
					onSureClick={(retOriginalMsg) => {
						//关闭对话框
						this.setState({
							showOriginal: false
						});
					}}
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showOriginal: false
						});
					}}
				/>

				{/* 联查审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							});
						}}
						billtype={constant.billtype}
						billid={billId}
					/>
				</div>

				{/* 增值税发票 */}
				{/* <JointBill show={this.state.billCodeModalShow} 
				close={()=>this.closeModal()} 
				billCode={this.state.billCode} 
				{...this.props} /> */}

				{this.state.compositedisplay ? (
					<ApprovalTrans
						title={this.state.json['36070TBR-000081']}
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={() => {
							//关闭对话框
							this.setState({
								compositedata: null,
								compositedisplay: false
							});
						}}
					/>
				) : (
					''
				)}
			</div>
		);
	}
}

Card = createPage({
	billinfo: {
		billtype: 'form',
		pagecode: constant.cpagecode,
		headcode: constant.formcode1
	}
	// mutiLangCode: constant.mutiLangCode
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/