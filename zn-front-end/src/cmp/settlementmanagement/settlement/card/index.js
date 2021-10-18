/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, cardCache, promptBox, getMultiLang } from 'nc-lightapp-front';
let {  NCAffix } = base;
const { NCUploader, PrintOutput, BillTrack, ApproveDetail } = high;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, initTemplateApp } from './events';
import { Templatedata } from "../config/Templatedata";
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index';
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import {
	sourceModel_CMP, SHOWMODEL_BULU,
	SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU,
	PAYMODEL_COMBINEPAY
} from '../../../public/utils/constant';
import Sign from '../../../../tmpub/pub/util/ca';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js';
import { formBeforeEvent } from './formRefFilter/CMPFormRefFilter.js';
import { bodyBeforeEvent } from './tableRefFilter/CMPTableRefFilter.js';
import { createSimpleBillData ,createCardWebSocket} from '../../../../tmpub/pub/util/index.js';
import { saveMultiLangRes ,showErrBtn } from '../../../../tmpub/pub/util';
import appBase from '../../base'
import Modal from "../../../../tmpub/pub/util/modal/index";
const { api, cons } = appBase;
let { getCacheById, updateCache } = cardCache;
const { NCDiv } = base;
const saga_gtxid = Templatedata.saga_gtxid;
const pkname = Templatedata.pkname;

class Card extends Component {
	constructor(props) {
		super(props);
		debugger
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.childform = Templatedata.card_tableid_edit;//侧拉编辑框
		this.pageId = Templatedata.card_pageid;
		this.pagecode = Templatedata.card_pagecode;
		this.listDataSource = Templatedata.listDataSource;
		this.printurl = Templatedata.settleprint;
		this.tableVOClassName = Templatedata.settleBodyVOClassName;// 子表vo名称
		this.headVOClassName = Templatedata.settlementHeadVOClassName;//表头的名称
		this.tradeType = 'settlebilltype';//结算单据类型字段
		this.notestatus = 'add';//编辑票据号前的状态
		this.isNet = '0';  // 为0表示不是网银支付，为1表示是网银支付
		this.billno = '';// 单据编号
		this.billId = '';// 单据id，用于刷新卡片页，附件上传
		this.md5key = null;//合并支付使用key
		this.yurref = null;//合并支付第二次使用到银行参考号
		this.state = {
			showUploader: false,	//控制附件弹出框
			target: null,			//控制弹出位置
			showBuLu: false,         //设置显示补录模态框显隐性
			onLineData: [],
			modelType: SHOWMODEL_BULU, //操作类型，本结算业务用的
			modalValue: SHOWMODEL_BULU, //补录框类型，传给网银补录框的
			// 是否展示期初余额联查框，true:展示，false:不展示
			showOriginal: false,
			// 联查余额取数据，将需要联查的数据赋值给我
			showOriginalData: [],
			showbilltrack: false,	//联查单据
			showbilltrackpk: '',	//联查单据pk
			showbilltracktype: '',	//联查单据类型
			approveShow: false,//审批意见是否显示
			approveBillid: '',//审批意见单据pk
			approveBilltype: '',//审批意见单据类型
			openflag: 'true',	// 展开
			outputdata: {},		// 输出
			tradecode: null,//工资清单支付特殊标识
			sscivmMessage:'',
			showModal: false, //退回意见框
		};

		/**
		 * 加入判断结算网银审批卡片页
		 */
		if (this.props.getUrlParam('scene') == 'approvesce') {
			initTemplateApp.call(this, props, () => {
				// 去掉分页箭头
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				// 去掉返回按钮
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,
				});
			});
		} else {
			// 结算卡片页
			// initTemplate.call(this, props);
		}
	}
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return this.getLangCode('000087');//'当前单据未保存，您确认离开此页面？';
			}
		}
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.list_moduleid, '36070']
			},
			callback
		});
	}
	componentDidMount() {
		let pk = this.props.getUrlParam('id');
		// 上游单据id
		let srcid = this.props.getUrlParam('srcid');
		// 来源src
		let src = this.props.getUrlParam('src');
		if (pk) {
			this.refreshCard(pk, null, true);
		} else if (srcid) {
			// 上游单据联查结算信息，需要走不同的url加载信息
			this.refreshCard(srcid, Templatedata.linksettle, null, true);
		}
	}
	/** 重新查询数据，更新页面 
	 * needDb : 是否需要从数据库查询，TRUE：是；空和false都是不必须走
	*/
	refreshCard = (pk, url, needDb) => {
		if (!pk) {
			return;
		}
		let cardData = getCacheById(pk, this.listDataSource);
		if (cardData && !needDb) {
			// 有缓存，走缓存里的
			/**现在有一个问题需要解决
			 * 1.怎么判断已在缓存中的数据是否需要更新，加参数？
			 */
			this.setFormAndTableData(cardData);
			return;
		}
		let data = {
			pageid: this.pageId
		};
		if (!url) {
			url = '/nccloud/cmp/settlement/settlecardquery.do';
			data['pk'] = pk;
		} else {
			data['pk_busibill'] = pk;
		}
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data && res.data.net) {
					this.isNet = res.data.net;
				} else {
					this.isNet = '0';
				}
				if (res.data && res.data.vos) {
					this.setFormAndTableData(res.data.vos);
					// 更新缓存
					let billId = res.data.vos.head[this.formId].rows[0].values.pk_settlement.value;
					updateCache(
						'pk_settlement',
						billId,
						res.data.vos,
						this.formId,
						this.listDataSource,
						res.data.vos.head[this.formId].rows[0].values
					);
				} else {
					toast({ color: 'warning', content: this.getLangCode('000080') });/* 国际化处理： '未查询出符合条件的数据'*/
					this.props.button.setButtonVisible(Templatedata.allBtn, false);
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
					this.props.button.setButtonVisible(Templatedata.allBtnName, false);
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
			}
		});
	};
	/**
	 * 请求数据成功后设置页面数据
	 */
	setFormAndTableData = (data) => {
		if (data.head) {
			this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
			//页签赋值
			let billno = data.head[this.formId].rows[0].values.billcode.value;
			let billId = data.head[this.formId].rows[0].values.pk_settlement.value;
			this.billno = billno;
			this.billId = billId;// 单据id，用于刷新卡片页，附件上传
		}
		if (data.body) {
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			this.props.cardTable.setTableData(this.tableId, data.body[this.tableId]);
		}

		// 如果是审批页，不往下走
		if (this.props.getUrlParam('scene') == 'approvesce') return;
		// 此处均由卡片页本页面设置按钮显隐性
		this.toggleShowBydata(data);
		// 设置编辑性，此处先不做处理，因为会报错
		// this.setEditableByDirection();
		// 此处调用组织多版本展示，结算需要
		this.formMultiVersionProcess();
	}
	// 组织多版本数据
	formMultiVersionProcess = () => {
		orgVersionView(this.props, this.formId);
	}
	// 根据卡片页数据设置显隐性，参数data是整个数据
	// 此处将参数取消，采用从页面上取值的方式，这样更符合设计原则
	toggleShowBydata = (data) => {
		// 设置表头数据
		// let record = data.head[this.formId].rows[0].values;
		let records = this.props.form.getAllFormValue(this.formId);
		let record = records.rows["0"].values;
		let billstatus = -1;
		// 这个是业务单据状态，里面有保存和审批通过状态，展示在列表页的业务单据状态
		let busistatus = record.busistatus && record.busistatus.value;
		// 结算状态
		let settlestatus = record.settlestatus && record.settlestatus.value;
		// 签字人
		// let pk_signer = record.pk_signer.value;
		// 业务单据审批状态,有可能不存在
		let aduitstatus = record.aduitstatus && record.aduitstatus.value;
		// 结算人
		// let pk_executor = record.pk_executor.value;
		// 结算状态，为5是已结算
		// let settleflag = settlestatus == '5' ? true : false;
		// 未结算状态
		// let unsettle = settlestatus == '0' ? true : false;

		// 状态判断修改
		/****1.先拿业务单据审批状态判断 */
		if (!aduitstatus || aduitstatus != '0') {
			// 未审批通过
			billstatus = 0;
		}
		// 审批通过，继续判断下面的
		if (billstatus == -1 && (!busistatus || busistatus != '8')) {
			//未签字态
			billstatus = 1;
		}
		// 签字态
		if (billstatus == -1 && settlestatus && settlestatus == '0') {
			// 未结算状态
			billstatus = 2;
		} else if (billstatus == -1 && settlestatus == '5') {
			// 结算成功状态
			billstatus = 3;
		} else if (billstatus == -1 && settlestatus == '2') {
			// 支付失败
			billstatus = 5;
		} else if (billstatus == -1 && (settlestatus == '3' || settlestatus == '1')) {
			// 支付中和收款中
			billstatus = 6;
		} else if (billstatus == -1 && settlestatus == '6') {
			// 部分成功
			billstatus = 7;
		}
		else if (billstatus == -1 && billstatus == -1) {
			// 结算过程中，前面都没走的情况下，走结算过程中
			billstatus = 4;
		}

		this.toggleShow();// 卡片中标题栏返回按钮控制
		// this.toggleShowButtons(this.props,billstatus);//按钮显隐性控制
		this.toggleShowButtons(this.props,billstatus);//按钮显隐性控制

	}
	// 卡片中返回按钮ncback按钮控制
	toggleShow = () => {
		let status = this.props.getUrlParam('status');

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
				// billCode: '123231232111'  //修改单据号---非必传
			});

		}

	}
	//切换页面状态，切换页面按钮显隐性，抽出的方法，浏览器刚进页面，刷新页面，
	//begin tm lidyu 方法中多传一个参数 aduitstatus审批状态 用来判断驳回按钮显隐性 20200421 
	toggleShowButtons = (props,billstatu) => {
		// console.log("buttons", this.props.button.getButtons());
		// 当前页面状态，编辑态还是浏览态
		//let status = this.props.getUrlParam('status');
		
		let status = this.props.getUrlParam('status');
		if (!status) {
			status = 'browse';
		}
		//获取单据状态，通过billno传递单据状态
		//let billstatus = this.props.getUrlParam('billstatus'); 
		let billstatus = billstatu;

		// if (status == 'edit') {
		// 设置编辑性 ,不管是编辑还是浏览都进行设置页面状态
		this.props.cardTable.setStatus(this.tableId, status);
		this.props.form.setFormStatus(this.formId, status);

		// }
		let flag = status === 'browse' ? true : false;
		//设置看片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		//先设置所有的都不可见，里面去设置可见性
		this.props.button.setButtonVisible(Templatedata.allBtn, false);
		//begin tm lidyu 驳回先不显示  下面在控制 20200421
		this.props.button.setButtonVisible(Templatedata.back, false);
		this.props.button.setButtonVisible(Templatedata.linkGroup, true);
		this.props.button.setButtonVisible(Templatedata.otherGruop, true);
		if (status != 'browse') {
			//修改：保存，取消
			//tm begin lidyu 编辑态去掉驳回按钮 20200420
			this.props.button.setButtonVisible(Templatedata.back, flag);
			//end lidyu 
			this.props.button.setButtonVisible(Templatedata.saveGroup, true);
			this.props.button.setButtonVisible(Templatedata.splitGroup, true);
		} else {
			this.props.button.setButtonVisible(Templatedata.refreshBtn, true);
			this.props.button.setButtonVisible(Templatedata.makebillBtn, true);

			//浏览态状态过滤	
			if (!billstatus && billstatus !== 0) {
				//this.props.button.setButtonVisible(Templatedata.allBtn, false);
			} else if ((billstatus === -1 || billstatus == 0)) {
				// 保存态，未审批的单据，签字，结算都不能点击
				//this.props.button.setButtonVisible(Templatedata.signGroup, false);
				this.props.button.setButtonVisible(Templatedata.editGroup, true);
			} else if (billstatus === 1) {
				// 待签字态
				this.props.button.setButtonVisible(Templatedata.signGroup, true);
				this.props.button.setButtonVisible(Templatedata.editGroup, true);
				//tm lidyu 审批通过显示驳回按钮 20200421
				this.props.button.setButtonVisible(Templatedata.back, true);
			} else if (billstatus === 2) {
				// 待结算态，无法判断是否是网银，所以网银和结算都展示，在后台会判断是否是网银
				this.props.button.setButtonVisible(Templatedata.settleGroup, true);
				this.props.button.setButtonVisible(Templatedata.antiSignBtn, true);
				this.props.button.setButtonVisible(Templatedata.payGroup, true);
				this.props.button.setButtonVisible(Templatedata.payBtn, true);
				this.props.button.setButtonDisabled(Templatedata.payBtn, false);
				this.props.button.setButtonVisible(Templatedata.commitGroup, true);
				this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, false);
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);

			} else if (billstatus === 3) {
				// 已结算，结算成功，需要展示取消结算,取消委托在支付中和收款中加了
				this.props.button.setButtonVisible(Templatedata.antiSettleBtn, true);
				this.props.button.setButtonVisible(Templatedata.settleGroup, false);
				// this.props.button.setButtonVisible(Templatedata.cancelCommit, true); 
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);

			} else if (billstatus === 4) {
				// 结算过程中
				this.props.button.setButtonVisible(Templatedata.payGroup, false);
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);
			} else if (billstatus === 5) {
				// 支付失败,需要展示支付变更按钮、网银补录
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, true);
				this.props.button.setButtonVisible(Templatedata.payGroup, true);
				this.props.button.setButtonVisible(Templatedata.preparenetBtn, true);
				// 结算红冲也要展示
				this.props.button.setButtonVisible(Templatedata.redHandleBtn, true);
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);
			} else if (billstatus === 6) {
				// 支付中或收款中，需要展示取消委托按钮，，取消委托需要根据结算类型判断
				this.props.button.setButtonVisible(Templatedata.cancelCommit, true);
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);
			} else if (billstatus === 7) {
				// 部分成功
				this.props.button.setButtonVisible(Templatedata.payGroup, true);
				this.props.button.setButtonVisible(Templatedata.redHandleBtn, true);
				// 联查单据设置可见
				this.props.button.setButtonVisible(Templatedata.linkVoucherBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
				this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);
				//新增：部分成功--->支付中增加显示:支付变更
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, true);
			}
			this.setButtonVisibleByField();
		}
		//begin lidyu 控制重试按钮显示情况
		showErrBtn(this.props, { headBtnCode: 'card_head', headAreaCode: Templatedata.card_formid, fieldPK:Templatedata.pkname, datasource:Templatedata.cardDataSource });
		//end
	};
	// 设置需要特殊判断的按钮的显隐性,根据字段值进行判断
	setButtonVisibleByField = () => {

		// 结算状态
		let settlestatus = this.props.form.getFormItemsValue(this.formId, 'settlestatus') &&
			this.props.form.getFormItemsValue(this.formId, 'settlestatus').value;
		// 支付中或收款中才需要展示取消委托
		let settling = settlestatus == '3' || settlestatus == '1';
		// 是否需要承付
		let iscommpay = this.props.form.getFormItemsValue(this.formId, 'iscommpay') &&
			this.props.form.getFormItemsValue(this.formId, 'iscommpay').value;
		// 1.设置取消委托的显示和不显示
		// 完成结算方式
		let settletype = this.props.form.getFormItemsValue(this.formId, 'settletype') &&
			this.props.form.getFormItemsValue(this.formId, 'settletype').value;
		// if (settletype && settling && (settletype=='1'||settletype=='2')) {
		// 	// 1=委付，2=委收，只有这两种去展示取消委托
		// 	this.props.button.setButtonVisible(Templatedata.cancelCommit, true);
		// }
		// 获取子表数据
		let tablerows = this.props.cardTable.getAllRows(this.tableId);
		let inner = false;
		let issettle = false;
		for (let index = 0; index < tablerows.length; index++) {
			// 校验内部账户
			let pk_inneraccount = tablerows[index].values.pk_inneraccount
				&& tablerows[index].values.pk_inneraccount.value;
			if (pk_inneraccount) {
				inner = true;
			}
			// 判断是否有结算成功
			let setstatus = tablerows[index].values.settlestatus.value;
			if (setstatus == '5') {
				issettle = true;
			}
		}
		if (!inner) {
			// 代表没有内部账户，将委托和取消委托置为不可见,
			// 前面已经按照状态设置为可见了，此处控制不可见
			this.props.button.setButtonVisible(Templatedata.cancelCommit, false);
			this.props.button.setButtonVisible(Templatedata.commitGroup, false);
		}
		// 判断是否是网银支付
		let isnet = this.isNet;
		if (!isnet || isnet == '0' || isnet == 0) {
			// 表示不是网银支付,所有网银相关全部隐藏
			this.props.button.setButtonVisible(Templatedata.payGroup, false);
			this.props.button.setButtonVisible(Templatedata.payBtn, false);
			this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, false);
			this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, false);
		} else {
			// 否则是网银，将结算隐藏
			this.props.button.setButtonVisible(Templatedata.settleGroup, false);
			this.props.button.setButtonVisible(Templatedata.antiSettleBtn, false);
			// 将委托隐藏,有的内部账户也有可能是网银支付，此处不管
			// this.props.button.setButtonVisible(Templatedata.commitGroup, false);
			// this.props.button.setButtonVisible(Templatedata.cancelCommit, false);
		}
		// 判断是否存在结算成功来展示按钮
		if (issettle) {
			// 结算成功，展示取消结算
			this.props.button.setButtonVisible(Templatedata.settleGroup, false);
			this.props.button.setButtonVisible(Templatedata.antiSettleBtn, true);
		} else {
			this.props.button.setButtonVisible(Templatedata.settleGroup, true);
			this.props.button.setButtonVisible(Templatedata.antiSettleBtn, false);
		}
		//begin_zhanghjr:承付的结算单未结算状态不允许进行委托办理add on 2019/08/20
		if(iscommpay){
			this.props.button.setButtonVisible(Templatedata.commitGroup, false);
			this.props.button.setButtonVisible(Templatedata.cancelCommit, false);
		}
		//end_zhagnhjr
		this.newAddDsButtonVisable();//工资清单特殊按钮控制显隐性
	}
	//工资清单特殊按钮控制显隐性
	newAddDsButtonVisable = () => {
		// 结算方向
		let ds_direction = this.props.form.getFormItemsValue(this.formId, 'direction') &&
			this.props.form.getFormItemsValue(this.formId, 'direction').value;
		if (ds_direction && ds_direction == 0) {
			this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);// 收款类及工资发放不能 结算红冲
		}
		//交易类型
		let pk_tradetype = this.props.form.getFormItemsValue(this.formId, 'pk_tradetype') &&
			this.props.form.getFormItemsValue(this.formId, 'pk_tradetype').value;
		if (pk_tradetype && pk_tradetype == 'DS') {
			this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);// 收款类及工资发放不能 结算红冲
			//单据状态
			let bill_status = this.props.form.getFormItemsValue(this.formId, 'busistatus') &&
				this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
			if (!(bill_status && bill_status == '8')) {
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, false);//单据状态非签字-禁用支付变更
			}
			//新增：生效状态--->未生效显示支付变更按钮。---->生效了，隐藏支付变成按钮
			let isbusieffect = this.props.form.getFormItemsValue(this.formId, 'isbusieffect') &&
				this.props.form.getFormItemsValue(this.formId, 'isbusieffect').value;
			if (isbusieffect) {
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, false);//生效后-禁用支付变更
				this.props.button.setButtonVisible(Templatedata.payGroup, false);
			} else {
				this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, true);//未生效-启用支付变更
				this.props.button.setButtonVisible(Templatedata.payGroup, true);
			}
		}
		//卡片中增加结算按钮显隐性<仅仅根据表头的结算状态判断即可>
		let settle_stat = this.props.form.getFormItemsValue(this.formId, 'settlestatus') &&
			this.props.form.getFormItemsValue(this.formId, 'settlestatus').value;
		if (settle_stat && settle_stat == 0) {//未结算,释放结算按钮
			this.props.button.setButtonVisible(Templatedata.settleGroup, true);
			this.props.button.setButtonVisible(Templatedata.antiSettleBtn, false);
		} else if (settle_stat && settle_stat == 1) {//支付中,释放取消按钮
			this.props.button.setButtonVisible(Templatedata.settleGroup, false);
			this.props.button.setButtonVisible(Templatedata.antiSettleBtn, true);
		} else if (settle_stat == 2) {
			this.props.button.setButtonVisible(Templatedata.payGroup, true);
		}

		//注意：结算和取消结算控制太不好判断，之前的判断不能达到效果，所有决定全部放开结算和取消结算，后台进行判断按钮事件
		this.props.button.setButtonVisible(Templatedata.settleGroup, true);
		this.props.button.setButtonVisible(Templatedata.antiSettleBtn, true);
		//注意；放开联查网银信息，支付变更单按钮
		this.props.button.setButtonVisible(Templatedata.linkNetBankBtn, true);
		this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, true);

		//单据状态
		let bill_status = this.props.form.getFormItemsValue(this.formId, 'busistatus') &&
		this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
		// （网银）审批状态<单据状态>
		let appstatus = this.props.form.getFormItemsValue(this.formId, 'vbillstatus') &&
			this.props.form.getFormItemsValue(this.formId, 'vbillstatus').value;
		// 未审批通过关闭支付组按钮<单据状态：签字态和审批通过>
		if (appstatus && appstatus != 1) this.props.button.setButtonVisible(Templatedata.payBtn, false);
		let systemcode = this.props.form.getFormItemsValue(this.formId, 'systemcode') &&
			this.props.form.getFormItemsValue(this.formId, 'systemcode').value;
		// 审批中、审核通过关闭取消签字
		// begin 2020-02-27 关联资金结算单据结算信息生成的结算单据 可以取消签字
		if((systemcode == 5 || systemcode == 2) && bill_status == 8){
			this.props.button.setButtonVisible(Templatedata.antiSignBtn, true);
		} else if((systemcode == 5 || systemcode == 2) && bill_status == 1){
			this.props.button.setButtonVisible(Templatedata.signGroup, true);
		}else if (appstatus && (appstatus == 2 || appstatus == 1)){
			this.props.button.setButtonVisible(Templatedata.antiSignBtn, false);
		}
		
		// end
		//签字状态：<把支付相关的按钮都放出来了，后台进行判断是否可以点击>
		if (bill_status && bill_status == 8) {
			//签字状态：0=未结算，1=支付中，2=支付失败，3=收款中，4=收款失败，5=结算成功，6=部分成功，7=结算红冲，9=手工结算，10=划账中，11=划账失败，12=待变更。
			let settle_stat = this.props.form.getFormItemsValue(this.formId, 'settlestatus') &&
				this.props.form.getFormItemsValue(this.formId, 'settlestatus').value;
			if (settle_stat) {
				//结算状态：0=未结算，2=支付失败，6=部分成功
				if (settle_stat == 0) {
					//未结算的签字单据可以进行网上付款
					this.props.button.setButtonVisible(Templatedata.payGroup, true);
					this.props.button.setButtonVisible(Templatedata.payBtn, true);
					// this.props.button.setButtonVisible(Templatedata.combinpayBtn, true);
					// this.props.button.setButtonVisible(Templatedata.preparenetBtn, true);
					// this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
					// this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, false);
				}
				if (settle_stat == 2) {
					//<支付失败>的签字单据可以显示:网上转账，支付变更
					this.props.button.setButtonVisible(Templatedata.payGroup, true);
					this.props.button.setButtonVisible(Templatedata.payBtn, true);
					// this.props.button.setButtonVisible(Templatedata.combinpayBtn, false);
					// this.props.button.setButtonVisible(Templatedata.preparenetBtn, false);
					// this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
					// this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, true);
				}
				if (settle_stat == 6) {
					//<部分成功>的签字单据可以显示:网上转账，合并支付，结算红冲
					this.props.button.setButtonVisible(Templatedata.payGroup, true);
					this.props.button.setButtonVisible(Templatedata.payBtn, true);
					// this.props.button.setButtonVisible(Templatedata.combinpayBtn, true);
					// this.props.button.setButtonVisible(Templatedata.preparenetBtn, true);
					// this.props.button.setButtonVisible(Templatedata.redHandleBtn, true);
					// this.props.button.setButtonVisible(Templatedata.settlePayChangeBtn, true);
				}
			}
		}
	}
	// 根据收付方向设置编辑性
	setEditableByDirection = () => {
		// 子表数据
		let allDate = this.props.cardTable.getAllData(this.tableId);
		if (!allDate) {
			return;
		}
		let isNetPay = false;
		let needNetpayChange = false;
		for (let i = 0; i < allDate.rows.length; i++) {
			let table = allDate.rows[i];

			let direction = table.values.direction.value;
			if (direction == '0') {
				//0收1付,0将付款原币金额pay置为不可编辑,1将收款原币置为不可编辑receive
				this.props.cardTable.setEditableByIndex(this.tableId, i,
					['pay', 'pk_currtype_last', 'pk_inneraccount'], false);
				// 设置网银的不可编辑性
				this.props.button.setButtonDisabled(Templatedata.payBtn, true);
			} else {
				// 付方向
				this.props.cardTable.setEditableByIndex(this.tableId, i, 'receive', false);
			}
			// 支付方式，判断是否是网银
			let paymethod = table.values.pk_balatype.value;
			// 结算状态
			let settlestatus = table.values.settlestatus && table.values.settlestatus.value;
			if (settlestatus && settlestatus == '2') {
				// 2表示支付失败，只有支付失败才可以支付变更
				needNetpayChange = true;
			}
		}
		// 是否可点击支付变更
		if (needNetpayChange) {
			this.props.button.setButtonDisabled(Templatedata.settlePayChangeBtn, false);
		} else {
			this.props.button.setButtonDisabled(Templatedata.settleChsettlePayChangeBtnangeGroup, true);
		}
	}
	/**获取多语方法 */
	getLangCode = (key) => {
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		// console.log(multiLang && multiLang.get(this.moduleId + '-' + key));
		return multiLang && multiLang.get(this.moduleId + '-' + key);
	};
	// 修改浏览器url参数方法，后面参数是key,前面参数是值，方法不可用
	setUrlKeyParam = (pop, id = 'id') => {
		// pop是字符串时，设置id属性
		// pop是对象时，设置其他属性
		if (!pop) return;
		let queryString = window.location.hash.substring(1);
		let map = new Map(queryString.split('&').map((e) => e.split('=')));
		typeof pop === 'string' && map.set(id, pop);
		typeof pop === 'object' &&
			Object.keys(pop).forEach((e) => {
				map.set(e, pop[e]);
			});
		let hashVal = [...map.entries()].map((e) => e.join('=')).join('&');
		window.location.hash = hashVal;
		//修改工作台路径
		let page = window.location.href.replace(window.location.origin, "");
		this.props.setParentIfr(page, hashVal);
	};

	// 输出确定按钮回调事件
	onOutput = () => {
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000017') });/* 国际化处理： 输出成功*/
	}
	//删除单据
	delConfirm = () => {
		const delId = this.props.getUrlParam('id');
		ajax({
			url: '/nccloud/fts/commission/paymentdelete.do',
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: (res) => {
				if (res) {
					this.props.linkTo('../list/index.html');
					let idObj = {};
					idObj.id = delId;
					idObj.status = 3;
					this.props.cardPagination.setCardPaginationId(idObj)//暴露出最新的id值
				}
			}
		});
	};

	//保存单据
	saveBill = async () => {

		//过滤表格空行
		// this.props.cardTable.filterEmptyRows(this.tableId);
		//校验金额填写等需要验证的字段
		//签字人
		let signer = this.props.form.getFormItemsValue(this.formId, ['pk_signer', 'settlestatus']);
		let pk_settlement1 = this.props.form.getFormItemsValue(this.formId, ['pk_settlement']);
		let pk_settlement = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
		let pk_ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;

		let flag = this.props.form.isCheckNow(this.formId);  //是否校验通过，必输项等

		if (flag) {
			let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId, false);
			// // 修改的表体
			// let bodys = this.props.cardTable.getChangedRows(this.tableId);
			// // 此处合并行的时候有可能修改的表体为0
			// if (bodys && bodys.length == 0) {
			// 	this.onCancel();
			// 	return;
			// }
			// if (false) {
			// 	// 不是全部修改
			// 	for (let index = 0; index < bodys.length; index++) {
			// 		let val = bodys[index];
			// 		delete val.values.dr;
			// 		//values是一个对象
			// 		for (let key in val.values) {
			// 			delete val.values[key].display;
			// 			delete val.values[key].scale;
			// 		}					
			// 	}
			// 	// 替换数据
			// 	CardData.body.table_settle_detail.rows = bodys;
			// } else {
			// 	let bodysavedata = CardData.body.table_settle_detail.rows;
			// 	bodysavedata.forEach((val, index) => {
			// 		delete val.values.dr;
			// 	})
			// }			
			// delete CardData.head.table_settle_head.rows[0].values.dr;
			// 签名，修改保存不弹CA框
			let result = await Sign({
				data: CardData,
				encryptVOClassName: 'nccloud.dto.cmp.settlement.vo.SettlementEncryptVO4NCC',
				isSign: true,
				isKey: true,
				isSave: true
			})
			if (result.isStop) {
				return;
			}
			let signdata = result.data;
			let url = Templatedata.save;//修改保存

			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let { data, success } = res;
					if (success) {
						if (data.message) {
							toast({ color: 'success', content: data.message });
						} else {
							toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000018') });/* 国际化处理： 保存成功*/
						}
						this.props.setUrlParam({ 'status': 'browse' });
						if (data.vos) {
							this.props.beforeUpdatePage();//打开开关
							//数据更新
							if (data.vos.body) {
								this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
								//差异化处理,暂时去掉,为了合并行能够点击一次执行成功
								// let body = this.props.cardTable.updateDataByRowId(this.tableId, data.vos.body[this.tableId])
								// if (body) {
								// 	res.data.vos.body = body;//差异缓存处理
								// }
							}
							//更新ts
							if (data.vos.head) {
								this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
							}
							// 有数据返回的话进行直接更新<暂时去掉加快速度>
							// this.props.cardTable.updateDataByRowId(this.tableId, data.vos.body[this.tableId]);
							this.toggleShowBydata(data.vos);
							// 设置编辑性，此处先不做处理，因为会报错
							// this.setEditableByDirection();
							// 此处调用组织多版本展示，结算需要
							this.formMultiVersionProcess();
							this.props.updatePage(this.formId, this.tableId);//关闭开关
						} else {
							// 未返回的话刷新页面
							this.refreshCard(pk_settlement, null, true);
						}
					}
				}
			});
		}
	};
	// 那数据渲染页面
	renderCardData = (data) => {
		this.props.beforeUpdatePage();//打开开关
		if (data.head) {
			this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
			//页签赋值
			let billno = data.head[this.formId].rows[0].values.billcode.value;
			let billId = data.head[this.formId].rows[0].values.pk_settlement.value;
			this.billno = billno;
			this.billId = billId;// 单据id，用于刷新卡片页，附件上传
			// 更新缓存
			updateCache(
				'pk_settlement',
				billId,
				data,
				this.formId,
				this.listDataSource,
				data.head[this.formId].rows[0].values
			);
		}
		if (data.body) {
			// this.props.cardTable.setTableData(this.tableId, { rows: [] });
			//begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
			api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.body[this.tableId] });
			//end tangleic
			this.props.cardTable.setTableData(this.tableId, data.body[this.tableId]);
		}

		this.props.setUrlParam({
			status: 'browse'
		});
		// 此处均由卡片页本页面设置按钮显隐性
		this.toggleShowBydata(null);
		// 设置编辑性，此处先不做处理，因为会报错
		// this.setEditableByDirection();
		// 此处调用组织多版本展示，结算需要
		this.formMultiVersionProcess();
		this.props.updatePage(this.formId, this.tableId);//关闭开关
	}


	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

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
						// buttonLimit: 3, 
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}



				</div>
			</div>
		);
	};
	// 网上转账弹框处理
	netPayProcess = () => {
		this.setState({
			modelType: SHOWMODEL_ZHIFU,
			modalValue: SHOWMODEL_ZHIFU,
		}, () => {
			let data = this.getCheckedData('netpay');
			this.loadBuLuInfo(data);
		});
	}
	// 加载网银补录需要的信息
	loadBuLuInfo = async (data) => {
		if (!data || JSON.stringify(data) == '{}') {
			return;
		}
		let modelType = this.state.modelType;
		let url = '';
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlepreparenet;
		} else if (modelType === SHOWMODEL_ZHIFU) {
			url = Templatedata.settlepay;
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			url = Templatedata.settlecombinpay;
			// 原nc后端给传的就是zhifu，所以这里也是传zhifu
			modelType = SHOWMODEL_ZHIFU;
			this.setState({
				// 此处只设置modalValue的值
				modalValue: SHOWMODEL_ZHIFU,
			});
		} else if (modelType === SHOWMODEL_LIULAN) {
			url = Templatedata.linknetbank;
		}
		data.needCheck = true;
		//特殊补录--工资清单要先谈ca然后进行支付
		if (this.state.tradecode && this.state.tradecode == 'DS'
			&& modelType != SHOWMODEL_BULU && modelType != SHOWMODEL_LIULAN) {
			// ca框,只弹框不签名
			let DS_result = await Sign({
				data: null,
				encryptVOClassName: null,
				isSign: false,
				isKey: true
			})
			if (DS_result.isStop) {
				return;
			}
		}
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data && data.message && data.message == 'DSOK') {
						// 表示工资转账成功
						toast({ color: 'success', content: this.getLangCode('000078') });/* 国际化处理： 工资转账成功！*/
						// this.refreshPks()
						let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(pk, null, true);
						return;
					}
					if (data) {
						if (data.hint) {
							promptBox({
								color: "warning",
								content: data.hint,/* 国际化处理： 是否确认取消？*/
								beSureBtnClick: this.reloadBuLuInfo.bind(this, { "pks": data.pks, "needCheck": data.needCheck }, true)
							});
						}
						if (data.hint) {
							return;
						}
						let onlinevos = data.onlinevos == null ? (data == null ? null : data) : data.onlinevos;
						this.md5key = data.md5key == null ? null : data.md5key;
						this.yurref = data.yurrefMap == null ? null : data.yurrefMap;
						this.setState({
							onLineData: onlinevos || []
							// modelType,//去掉设置modelType防止合并支付有问题
						}, () => {
							this.setState({
								showBuLu: true
							})
						});
					} else if (modelType === SHOWMODEL_LIULAN) {
						toast({ color: 'warning', content: this.getLangCode('000079') });/* 国际化处理： 工资转账成功！*/
					}
				}
			}
		});
	}
	// 加载网银补录需要的信息
	reloadBuLuInfo = async (data, isconfirm) => {
		if (!data || JSON.stringify(data) == '{}') {
			return;
		}
		let modelType = this.state.modelType;
		let url = '';
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlepreparenet;
		} else if (modelType === SHOWMODEL_ZHIFU) {
			url = Templatedata.settlepay;
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			url = Templatedata.settlecombinpay;
			// 原nc后端给传的就是zhifu，所以这里也是传zhifu
			modelType = SHOWMODEL_ZHIFU;
			this.setState({
				modalValue: SHOWMODEL_ZHIFU,
			});
		} else if (modelType === SHOWMODEL_LIULAN) {
			url = Templatedata.linknetbank;
		}
		data.needCheck = true;
		data.isconfirm = isconfirm;
		//特殊补录--工资清单要先谈ca然后进行支付
		if (this.state.tradecode && this.state.tradecode == 'DS'
			&& modelType != SHOWMODEL_BULU && modelType != SHOWMODEL_LIULAN) {
			// ca框,只弹框不签名
			let DS_result = await Sign({
				data: null,
				encryptVOClassName: null,
				isSign: false,
				isKey: true
			})
			if (DS_result.isStop) {
				return;
			}
		}
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data && data.message && data.message == 'DSOK') {
						// 表示工资转账成功
						toast({ color: 'success', content: this.getLangCode('000078') });/* 国际化处理： 工资转账成功！*/
						// this.refreshPks()
						let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(pk, null, true);
						return;
					}
					if (data) {
						let onlinevos = data.onlinevos == null ? (data == null ? null : data) : data.onlinevos;
						this.md5key = data.md5key == null ? null : data.md5key;
						this.yurref = data.yurrefMap == null ? null : data.yurrefMap;
						this.setState({
							onLineData: onlinevos || []
							// modelType,//去掉设置modelType防止合并支付有问题
						}, () => {
							this.setState({
								showBuLu: true
							})
						});
					} else if (modelType === SHOWMODEL_LIULAN) {
						toast({ color: 'warning', content: this.getLangCode('000079') });/* 国际化处理： 工资转账成功！*/
					}
				}
			}
		});
	}

	// 保存网银补录数据
	processRetMsg = async (retPayMsg) => {
		//let selectedData = this.props.table.getCheckedRows(this.tableId);
		let selectedData = this.props.form.getAllFormValue(this.formId);
		let pks = [];
		//let tss = [];
		if (!selectedData || selectedData.length == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000019') });/* 国际化处理： 请选择一条数据*/
			return;
		}
		//处理选择数据
		let val = selectedData.rows[0];
		let pk = val.values.pk_settlement.value;
		let ts = val.values.ts.value;
		pks.push(pk);//主键数组
		//tss.push(ts); 
		let pkMapTs = {};
		pkMapTs[pk] = ts;
		let data = {
			pktsmap: pkMapTs,
			pks: pks,
			results: retPayMsg,
			pagecode: this.pageId,
			md5key: this.md5key,//这种缓存方式舍弃2019-03-15
			yurrefMap: this.yurref,//合并支付/网上转账第二次支付使用
			needCheck: false    // 补录之后不校验ts，因为ts会更新，很显然补录更新了结算信息
		}
		let modelType = this.state.modelType;
		let needPassword = false;
		let operate = '';
		let url = '';
		// 操作之后的提示信息
		let contents = this.getLangCode('000075'); // 操作成功
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlebulusave;
			operate = this.getLangCode('000082');// '网银补录';
		} else if (modelType === SHOWMODEL_ZHIFU) {
			// 支付的先进行补录保存
			needPassword = true;
			url = Templatedata.settlepaysave;
			operate = this.getLangCode('000066'); // '网上支付';
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			needPassword = true;
			url = Templatedata.settlecombinsave;
			contents = this.getLangCode('000074');  // 合并支付
			operate = this.getLangCode('000074');  // '合并支付';
		} else if (modelType === SHOWMODEL_LIULAN) {
			// 联查网银信息
			return;
		} else {
			return;
		}
		// 签名,只弹框不签名
		// let result = await Sign({
		// 	data: null,
		// 	encryptVOClassName: null,
		// 	isSign: false,
		// 	isKey: needPassword,
		// })
		// if (result.isStop) {
		// 	return;
		// }
		//支付时前台js加签<弹框+签名>
		console.log(data.pks, 'pks');
		let payresult = await Sign({
			isSign: true,
			data: null,
			encryptVOClassName: null,
			isKey: needPassword,
			primaryId: data.pks
		});
		if (payresult.isStop) {
			return;
		}
		//支付前验签必要参数
		data['signature'] = payresult.data.signText;
		data['sign_strSrc'] = payresult.data.text;
		data['sign_sn'] = payresult.data.userjson;
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						// if (modelType === SHOWMODEL_ZHIFU) {//网上转账//网上支付
						if (data.total == data.successCount) {
							toast(
								{
									title: operate + this.getLangCode('000075'),/* 国际化处理： 操作成功*/
									color: 'success'
								}
							);
						} else {
							toast(
								{
									// duration: 'infinity',  // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
									color: 'danger',
									title: operate + this.getLangCode('000083'),  //  '失败！',/* 国际化处理： 操作失败*/
									groupOperation: true,
									TextArr: [
										this.getLangCode('000084'),
										this.getLangCode('000085'),
										this.getLangCode('000086')],/* 国际化处理： 展开,收起,关闭*/
									// content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000008'),/* 国际化处理： 请注意！存在月末检查不合格单据*/
									groupOperationMsg: data.mesage
								}
							);
						}

						// } 
						// else {
						// 	toast(
						// 		{
						// 			title: operate + this.getLangCode('000075'),/* 国际化处理： 操作成功*/
						// 			color: 'success'
						// 		}
						// 	);
						// }
						// if(modelType == PAYMODEL_COMBINEPAY){
						// 	if(data.mesage){
						// 		toast({ color: 'success', content: data.mesage });
						// 	}
						// }
						let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(pk, null, true);
					}
					this.md5key = null;
				}
			}
		});
	}

	netpayZhifuSave = (data) => {
		let url = Templatedata.settlepaysave;
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						if (data.message) {
							toast({ color: 'warning', content: data.message });
						}
						let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(pk, null, true);
					}
				}
			}
		});
	}

	getCheckedData = (flag) => {
		let selectedData = this.props.form.getAllFormValue(this.formId);
		let pks = [];
		let tss = [];
		if (!selectedData || selectedData.length == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000020') });/* 国际化处理： 请选择数据*/
			return;
		}
		//处理选择数据
		let pktsmap = {};

		let error = [];
		let getout = false;
		switch (flag) {
			case 'redhandle':
				// 红冲
				selectedData.rows.forEach((val) => {
					//此处可校验，挑选满足条件的进行操作
					// 结算失败的才可进行结算红冲操作
					// 结算状态为支付失败的单据才可以进行红冲操作
					let settlestatus = val.values.settlestatus.value;
					// 2为支付失败单据,6为部分成功的单据
					if (settlestatus == '2' || settlestatus == '6') {
						let pk = val.values.pk_settlement.value;
						let ts = val.values.ts.value;
						pks.push(pk);//主键数组
						tss.push(ts);
						pktsmap[pk] = ts;
					} else {
						error.push(val.values.billcode.value);
					}
				});
				if (pks.length == 0) {
					let content = this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000043');/* 国际化处理： 您选择的数据不可进行红冲操作！*/
					if (error.length != 0) {
						content = (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000029'))
							+ error.join(', ')
							+ (this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000053'))/* 国际化处理： 单据编号 ,不可进行红冲操作！*/
					}
					toast({ color: 'warning', content: content });
					getout = true;
				}
				break;
			case 'netpay':
				// 网上支付
				selectedData.rows.forEach((val) => {
					//此处可校验，挑选满足条件的进行操作
					let pk = val.values.pk_settlement.value;
					let ts = val.values.ts.value;
					pks.push(pk);//主键数组
					tss.push(ts);
					pktsmap[pk] = ts;
				});
				break;
			default:
				break;
		}
		if (getout) {
			return;
		}
		let data = {
			pks: pks,
			tss: tss,
			pktsmap: pktsmap
		};
		return data;
	}
	// 结算红冲,弹框的回调函数
	redHandleProcess = () => {
		let data = this.getCheckedData('redhandle');
		if (!data || JSON.stringify(data) == '{}') {
			return;
		}
		ajax({
			url: Templatedata.settleredhandle,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000021') });/* 国际化处理： 红冲成功*/
					//props.table.deleteTableRowsByIndex(table_id, index);
					let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
					this.refreshCard(pk, null, true);
				}
			}
		});

	}
	onCancel = () => {
		//恢复修改前的值
		this.props.form.cancel(this.formId);
		/**取消编辑，将表格数据恢复到编辑前的值（以最近setTableData/updateTableData为界限） */
		this.props.cardTable.resetTableData(this.tableId, null);
		// 因为会回退不到修改前的值，需要整体刷新
		// this.setUrlKeyParam('browse','status');
		this.props.setUrlParam({ 'status': 'browse' });
		let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
		this.refreshCard(pk, null, false);
	}
	backClick = () => {
		window.onbeforeunload = null;
		// this.props.linkTo('/cmp/settlementmanagement/settlement/list/index.html');
		this.props.pushTo('/list');
	}
	//模态框点击确定并从textarea取值
	beSureClick = (props, value, flag = false) => {
		if (flag) {
			// toast({ content: this.props.MutiInit.getIntl("36300CUREX") && this.props.MutiInit.getIntl("36300CUREX").get('36300CUREX-000053'), color: 'warning' });/* 国际化处理： 请填入退回理由！*/
			this.props.form.setFormItemsValue(this.formId, { backreason: { value: value } });
		}
		this.backConfirm();
	}
	//驳回单据
	backConfirm = () => {

		let pks = [];
		let pktsmap = {};
		let tss = [];
		let pk = this.props.getUrlParam('id');
		let backreason = this.props.form.getFormItemsValue(this.formId, 'backreason') .value;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		tss.push(ts);
		pks.push(pk);
        pktsmap[pk] = ts;
			ajax({
				url: Templatedata.settleback,
				data :{
					pks: pks,
					tss: tss,
					pktsmap: pktsmap,
					pageid: Templatedata.card_pageid,
					backreason
				},
				success: (res) => {		
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get("360704SM-000105") });																													  						
						if (data.vos) {
							this.props.beforeUpdatePage();//打开开关
							if (data.vos.head) {
								this.props.form.setAllFormValue({ [this.formId]: data.vos.head[this.formId] });
								//页签赋值
								let billno = data.vos.head[this.formId].rows[0].values.billcode.value;
								let billId = data.vos.head[this.formId].rows[0].values.pk_settlement.value;
								this.billno = billno;
								this.billId = billId;// 单据id，用于刷新卡片页，附件上传
								// 更新缓存
								updateCache(
									'pk_settlement',
									billId,
									res.data.vos,
									this.formId,
									this.listDataSource,
									res.data.vos.head[this.formId].rows[0].values
								);
								if (data.vos.body) {
									this.props.cardTable.setTableData(this.tableId, data.vos.body[this.tableId]);
								}
			
								this.props.setUrlParam({
									status: 'browse'
								});
								// 此处均由卡片页本页面设置按钮显隐性
								this.toggleShowBydata(null);
								// 此处调用组织多版本展示，结算需要
								this.formMultiVersionProcess();
								this.props.updatePage(this.formId, this.tableId);//关闭开关
							} 
							
							else {
								this.refreshCard(pk, null, true);//刷新页面
							}
							this.setState({ showModal: false });
	
						}
	
					}
				}
			});
		
	
		
	};
	render() {
		let { cardTable, form, button, cardPagination, editTable, ncmodal, modal } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { showUploader, target, showModal} = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
				{/* <div className="nc-bill-top-area"> */}
				 {/**创建websocket */}
				 {createCardWebSocket(this.props, {
                    headBtnAreaCode: Templatedata.card_head,
                    formAreaCode: Templatedata.card_formid,
                    billpkname: Templatedata.pkname,
					billtype: Templatedata.card_settlebilltype,
					dataSource:Templatedata.cardDataSource
                    //serverLocation: '10.16.2.231:9991'
                })}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000026'),  //标题
											billCode: this.billno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.backClick();
											}
										}
									)}
							</div>
							{/** 渲染按钮 **/}
							<div className="header-button-area">
							{this.props.button.createErrorFlag({
                                    headBtnAreaCode: Templatedata.card_head
                                })}
								{this.props.button.createButtonApp({
									area: Templatedata.card_head,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: this.listDataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [this.formId],
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: formBeforeEvent.bind(this)//编辑前事件
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							adaptionHeight: true,//表格固定行
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave:()=>{
								this.saveBill(),
								this.props.cardTable.closeModel(this.tableId);
							},
							
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: bodyBeforeEvent.bind(this), // 编辑前事件
							showCheck: true
						})}
					</div>
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={this.billId}
						target={target}
						placement={'bottom'}
						billNo={this.billno}
						onHide={() => { // 关闭功能
							this.setState({
								showUploader: false
							})
						}}
					/>
					}
				</div>
				{/** 网银补录 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={sourceModel_CMP}  //模块编码
					modelType={this.state.modalValue} //补录框类型
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}>
				</PayBuluForm>
				{this.state.showOriginal && <NCCOriginalBalance
					// 补录框显示
					showmodal={this.state.showOriginal}
					showOriginalData={this.state.showOriginalData}
					// 点击确定按钮的回调函数
					onSureClick={(retOriginalMsg) => {
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
				</NCCOriginalBalance>}
				<PrintOutput
					ref='printOutput'
					url={this.printurl}
					data={this.state.outputdata}
					callback={this.onOutput}
				>
				</PrintOutput>

				{/** 退回弹框 **/}
				{(showModal) && <Modal
					title={this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000104')}
					label={this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000104')}
					show={showModal}
					onOk={(value) => {
						//处理驳回
						if (showModal) {
							this.beSureClick.call(this, this.props, value, true);
						}
					}}
					onClose={() => {
						this.setState({ showModal: false })
					}}
				/>
				}


				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveShow}
						close={
							() => {
								this.setState({
									approveShow: false
								})
							}
						}
						billtype={this.state.approveBilltype}
						billid={this.state.approveBillid}
					/>
				</div>
				{/* 联查单据 */}
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk} //单据id
						type={this.state.showbilltracktype} //单据类型
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: Templatedata.list_moduleid,
	billinfo: {
		billtype: 'card',
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid,
		bodycode: Templatedata.card_tableid
	},
	orderOfHotKey: [Templatedata.card_formid, Templatedata.card_tableid]
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/