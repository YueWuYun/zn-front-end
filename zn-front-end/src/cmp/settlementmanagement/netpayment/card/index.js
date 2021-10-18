/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang, promptBox } from 'nc-lightapp-front';
let { NCScrollElement, NCAffix, NCDiv } = base;
const { NCUploader, PrintOutput } = high;
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU, PAYMODEL_COMBINEPAY } from '../../../public/utils/constant';
import Sign from '../../../../tmpub/pub/util/ca';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js';
import { saveMultiLangRes ,createCardWebSocket , showErrBtn } from '../../../../tmpub/pub/util';
import appBase from '../../base'
const { cons, api } = appBase;
let { getCacheById, updateCache } = cardCache;
const saga_gtxid = Templatedata.saga_gtxid;
const pkname = Templatedata.pkname;
/**
 * 网上付款
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.card_pageid;
		this.pagecode = Templatedata.card_pagecode;
		this.listDataSource = Templatedata.listDataSource;
		this.printurl = Templatedata.settleprint;
		this.md5key = null;//合并支付使用key
		this.yurref = null;//合并支付第二次使用到银行参考号
		this.state = {
			billno: '', // 单据编号
			showUploader: false,	//控制附件弹出框
			target: null,			//控制弹出位置
			billId: '',				// 单据id，用于刷新卡片页，附件上传
			showBuLu: false,         //设置显示补录模态框显隐性
			onLineData: [],
			modelType: SHOWMODEL_BULU,//操作类型，本结算业务用的
			modalValue: SHOWMODEL_BULU, //补录框类型，传给网银补录框的
			// 是否展示期初余额联查框，true:展示，false:不展示
			showOriginal: false,
			// 联查余额取数据，将需要联查的数据赋值给我
			showOriginalData: [],
			showNCbackBtn: true,  // 返回按钮显隐性,
			showbilltrack: false,	//联查单据
			showbilltrackpk: '',	//联查单据pk
			showbilltracktype: '',	//联查单据类型
			openflag: 'true',	// 展开
			outputdata: {},		// 输出
			tradecode: null,//工资清单支付特殊标识
		};
		// initTemplate.call(this, props);
	}
	componentDidMount() {
		let pk = this.props.getUrlParam('id');
		if (pk) {
			this.refreshCard(pk);
		} else {
			// 上未查询出数据，是否需要提示

		}
	}
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		// getMultiLang({ moduleId: [Templatedata.list_moduleid,'36070'], domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.list_moduleid, '36070']
			},
			callback
		});
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
		let that = this;
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data.vos) {
					this.setFormAndTableData(res.data.vos);
					// 更新缓存
					let billId = res.data.vos.head[this.formId].rows[0].values.pk_settlement.value;
					updateCache('pk_settlement', billId, res.data.vos, this.formId, this.listDataSource);
				} else {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000067') });/* 国际化处理：未查询到单据,请重试！*/
					this.props.button.setButtonVisible(Templatedata.allBtn, false);
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
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

			this.setState({
				billno: billno,
				billId: billId
			});
		}
		if (data.body) {
			//begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
			api.cardSynCheckFlag(this.props, { tableCode: this.tableId, bodyData: data.body[this.tableId] });
			//end tangleic
			this.props.cardTable.setTableData(this.tableId, data.body[this.tableId]);
		}
		// 此处均由卡片页本页面设置按钮显隐性
		this.toggleShowBydata(data);
		// 此方法在测试环境总是报错，平台问题，没时间问，暂时注释
		// this.setEditableByDirection();
		// 此处调用组织多版本展示，网银不需要
		// this.formMultiVersionProcess();
	}
	// 组织多版本数据
	formMultiVersionProcess = () => {
		orgVersionView(this.props, this.formId);
	}
	// 根据卡片页数据设置显隐性，参数data是整个数据
	toggleShowBydata = (data) => {
		// 设置表头数据
		let record = data.head[this.formId].rows[0].values;
		let billstatus = -1;
		// 这个是业务单据状态，里面有保存和审批通过状态，展示在列表页的业务单据状态
		let busistatus = record.busistatus.value;
		// 结算状态
		let settlestatus = record.settlestatus.value;
		// 签字人
		let pk_signer = record.pk_signer.value;
		// 业务单据审批状态,有可能不存在
		let aduitstatus = record.aduitstatus.value;
		// 结算人
		let pk_executor = record.pk_executor.value;
		// 交易类型，'DS'为工资结算单据，只展示网上支付
		let pk_tradetype = record.pk_tradetype.value;
		// 结算状态，为5是已结算
		let settleflag = settlestatus == '5' ? true : false;
		// 未结算状态
		let unsettle = settlestatus == '0' ? true : false;
		if (unsettle) {
			// 未结算
			// todo 需要判断是否是工资清单的单据等
			if (busistatus == '8') {
				// 8是签字态，只有未结算且签字态的让点击网上转账
				if (pk_tradetype && 'DS' == pk_tradetype) {
					// 工资单据且未结算只有网上支付按钮
					billstatus = 2
				} else {
					billstatus = 1;
				}
			} else {
				billstatus = 0;
			}
		} else if (settlestatus == '1') {
			// 支付中
			billstatus = 4;
		} else if (settlestatus == '2') {
			// 支付失败
			billstatus = 5;
		} else if (settlestatus == '6') {
			// 部分成功
			billstatus = 6;
		}
		this.toggleShow();// 卡片中标题栏返回按钮控制
		this.toggleShowButtons(billstatus);

	}
	// 根据浏览器连接获取状态等数据进行按钮显隐性控制，此方法废弃
	toggleShow = () => {
		let status = this.props.getUrlParam('status');

		if (status == 'browse') {
			//设置卡片头部状态
			if (this.state.billno != null) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.billno  //修改单据号---非必传
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
				billCode: this.state.billno  //修改单据号---非必传
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
	toggleShowButtons = (billstatu) => {
		// console.log("buttons", this.props.button.getButtons());
		// 当前页面状态，编辑态还是浏览态
		//let status = this.props.getUrlParam('status');
		let status = this.props.getUrlParam('status');
		if (!status || status == 'edit') {
			status = 'browse';
		}
		let billstatus = billstatu;
		// 设置编辑性 ,不管是编辑还是浏览都进行设置页面状态
		this.props.cardTable.setStatus(this.tableId, status);
		this.props.form.setFormStatus(this.formId, status);
		//设置看片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);

		//不需要设置所有的都不可见，因为就没多少
		// this.props.button.setButtonVisible(Templatedata.allBtn, false);
		// 将支付组的所有按钮设置不可见
		this.props.button.setButtonVisible(Templatedata.payBtn, false);
		//浏览态状态过滤	
		if (!billstatus && billstatus !== 0) {
			// 保存态，需要将支付组按钮隐藏
			this.props.button.setButtonVisible(Templatedata.payGroup, false);
			this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, false);
		} else if ((billstatus === 1)) {
			// 签字态，可以点击支付
			// this.props.button.setButtonVisible(Templatedata.payGroup, true);
			// 红冲隐藏
			this.props.button.setButtonVisible(Templatedata.payBtn, true);
			this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
			this.props.button.setButtonVisible(Templatedata.updatePayStatus, false);
			this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, false);

		} else if (billstatus == 2) {
			// 工资结算单据,且未支付的，只展示支付按钮,联查都没有
			this.props.button.setButtonVisible(Templatedata.netpayBtn, true);
			this.props.button.setButtonVisible(Templatedata.linkGroup, false);
		}
		else if (billstatus === 0) {
			// 待签字态，保存态，不可以点击支付，联查支付确认单也没有
			this.props.button.setButtonVisible(Templatedata.payGroup, false);
			this.props.button.setButtonVisible(Templatedata.linkPayAffirmBtn, false);
		} else if (billstatus === 4) {
			// 支付中
			// this.props.button.setButtonVisible(Templatedata.payGroup, true);
			this.props.button.setButtonVisible(Templatedata.updatePayStatus, true);

		} else if (billstatus === 5) {
			// 支付失败
			this.props.button.setButtonVisible(Templatedata.payBtn, true);
			this.props.button.setButtonVisible(Templatedata.preparenetBtn, false);
			this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
		} else if (billstatus === 6) {
			// 部分成功
			this.props.button.setButtonVisible(Templatedata.payBtn, true);
			this.props.button.setButtonVisible(Templatedata.updatePayStatus, false);
			this.props.button.setButtonVisible(Templatedata.preparenetBtn, false);
			//新增---->释放支付变更按钮
			this.props.button.setButtonVisible(Templatedata.settleChangeGroup, false);
		}
		this.newAddDsButtonVisable();
		//begin lidyu 重试按钮显示情况
		showErrBtn(this.props, { headBtnCode: 'card_head', headAreaCode: Templatedata.card_formid,fieldPK:Templatedata.pkname, datasource:Templatedata.cardDataSource });
		//end
	
	};
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
				this.props.button.setButtonVisible(Templatedata.settleChangeGroup, false);//单据状态非签字-禁用支付变更
			}
			//新增----->生效状态
			let isbusieffect = this.props.form.getFormItemsValue(this.formId, 'isbusieffect') &&
				this.props.form.getFormItemsValue(this.formId, 'isbusieffect').value;
			if (isbusieffect) {
				this.props.button.setButtonVisible(Templatedata.settleChangeGroup, false);//生效后-禁用支付变更
			} else {
				this.props.button.setButtonVisible(Templatedata.settleChangeGroup, true);//非生效-启用支付变更
			}
			//新增--->工资清单-签字未结算可以--网上付款
			let appstatus = this.props.form.getFormItemsValue(this.formId, 'busistatus') &&
				this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
			if (appstatus && appstatus == 8) {
				//签字状态
				let settle_stat = this.props.form.getFormItemsValue(this.formId, 'settlestatus') &&
					this.props.form.getFormItemsValue(this.formId, 'settlestatus').value;
				if (settle_stat && settle_stat == 0) {
					//未结算的签字单据可以
					this.props.button.setButtonVisible(Templatedata.payGroup, true);
					this.props.button.setButtonVisible(Templatedata.payBtn, true);
					this.props.button.setButtonVisible(Templatedata.updatePayStatus, false);
					this.props.button.setButtonVisible(Templatedata.preparenetBtn, false);
					this.props.button.setButtonVisible(Templatedata.redHandleBtn, false);
					this.props.button.setButtonVisible(Templatedata.settleChangeGroup, false);
					this.props.button.setButtonVisible(Templatedata.combinpayBtn, false);
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
	// 输出的确定事件
	onOutput = () => {
		toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000009') });/* 国际化处理： 输出来了*/
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
	saveBill = () => {

		//过滤表格空行
		// this.props.cardTable.filterEmptyRows(this.tableId);
		//校验金额填写等需要验证的字段
		//签字人
		let signer = this.props.form.getFormItemsValue(this.formId, ['pk_signer', 'settlestatus']);
		let pk_settlement1 = this.props.form.getFormItemsValue(this.formId, ['pk_settlement']);
		let pk_settlement = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;

		let flag = this.props.form.isCheckNow(this.formId);  //是否校验通过，必输项等
		if (flag) {

			let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//let dr = CardData.head.table_settle_head.rows[0].values.dr.value;
			//CardData.head.table_settle_head.rows[0].values.dr.value = parseInt(dr);
			let bodysavedata = CardData.body.table_settle_detail.rows;
			delete CardData.head.table_settle_head.rows[0].values.dr;
			bodysavedata.forEach((val, index) => {
				delete val.values.dr;
			})
			// 签名
			// CardData = Sign({
			// 	data: CardData,
			// 	encryptVOClassName: 'nccloud.web.cmp.settlementmanagement.common.SettlementNccEncryptVO',
			// 	isSign: true,
			// 	isKey: true,
			// })

			let url = Templatedata.save;//修改保存

			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					if (res.success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000010') });/* 国际化处理： 保存成功*/
						this.props.setUrlParam({ 'status': 'browse' });
						this.refreshCard(pk_settlement);
					}
				}
			});
		}
	};

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

					{/*	{buttons.map((v) => {
						if (v.btncode == 'addline') {
							return createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							});
						}
					})}
					{buttons.map((v) => {
						if (v.btncode == 'delline') {
							return createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							});
						}
					})}
					{buttons.map((v) => {
						if (v.btncode == 'copyline') {
							return createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							});
						}
					})} */}


				</div>
			</div>
		);
	};
	// 加载网银补录需要的信息
	loadBuLuInfo = async (data) => {
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
		} else if (modelType === SHOWMODEL_LIULAN) {
			url = Templatedata.linknetbank;
			// 原nc后端给传的就是zhifu，所以这里也是传zhifu
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
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000068') });/* 国际化处理： 工资转账成功！*/
						// this.refreshPks()
						let re_pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(re_pk, null, false);
						return;
					}
					if (data) {
						if (data.hint) {
							toast({ color: 'danger', content: data.hint });
							return;
						}
						let onlinevos = data.onlinevos == null ? (data == null ? null : data) : data.onlinevos;
						this.md5key = data.md5key == null ? null : data.md5key;
						this.yurref = data.yurrefMap == null ? null : data.yurrefMap;
						this.setState({
							onLineData: onlinevos || []
							// modelType//去掉设置modelType防止合并支付有问题
						}, () => {
							this.setState({
								showBuLu: true
							})
						});
					} else if (modelType === SHOWMODEL_LIULAN) {
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000068') });/* 国际化处理： 工资转账成功！*/
					}

				}
			}
		});
	}
	// 网上转账弹框处理
	netPayProcess = () => {
		this.setState({
			modelType: SHOWMODEL_ZHIFU,
			modalValue: SHOWMODEL_ZHIFU
		}, () => {
			//   let data = this.getCheckedData('netpay');
			let data = this.state.paydata;
			if (!data) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000012') });/* 国际化处理： 请选择数据*/
				return;
			}
			this.loadBuLuInfo(data);
		});
	}
	// 保存网银补录数据
	processRetMsg = async (retPayMsg) => {
		// let selectedData = this.props.cardTable.getCheckedRows(this.tableId);
		// let selectedData = this.props.form.getAllFormValue(this.formId); 
		// let pks = [];
		// //let tss = [];
		// if (!selectedData || selectedData.length == 0) {
		// 	toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000011') });/* 国际化处理： 请选择一条数据*/
		// 	return;
		// }
		// //处理选择数据
		// let val = selectedData.rows[0];
		// let pk = val.values.pk_settlement.value;
		// let ts = val.values.ts.value;
		// pks.push(pk);//主键数组
		// //tss.push(ts); 
		// let pkMapTs = {};
		// pkMapTs[pk] = ts;
		// let data = {
		// 	pktsmap:pkMapTs,
		// 	pks:pks,
		// 	results: retPayMsg,
		// 	pagecode: this.pageId
		// }

		let data = this.state.paydata;
		if (!data) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000011') });/* 国际化处理： 请选择一条数据*/
			return;
		}
		data['results'] = retPayMsg;
		data['pagecode'] = this.pageId;
		data['md5key'] = this.md5key;
		data['yurrefMap'] = this.yurref;//合并支付/网上转账第二次支付使用
		let modelType = this.state.modelType;
		let url = '';
		let operate = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000008');//'操作'
		// 是否弹框输入密码
		let needPassword = false;
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlebulusave;
			operate = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000076');//'网银补录';
		} else if (modelType === SHOWMODEL_ZHIFU) {
			// 支付的先进行补录保存
			url = Templatedata.settlepaysave;
			needPassword = true;
			operate = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000078');//'网上支付';
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			needPassword = true;
			url = Templatedata.settlecombinsave;
			operate = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000079');//'合并支付';
		} else if (modelType === SHOWMODEL_LIULAN) {
			// 联查网银信息
			return;
		} else {
			return;
		}
		//支付时前台js加签<弹框+签名>
		// console.log(data.pks, 'pks');
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
		data['needCheck'] = false;    // 补录之后不校验ts，因为ts会更新，很显然补录更新了结算信息
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
						if (modelType === SHOWMODEL_ZHIFU) {//网上转账//网上支付
							if (data.total == data.successCount) {
								toast(
									{
										title: operate + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000063'),/* 国际化处理： 操作成功*/
										color: 'success'
									}
								);
							} else {
								toast(
									{
										duration: 'infinity',  // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
										color: 'danger',
										title: operate + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000080'),/* 国际化处理： 操作失败*/
										groupOperation: true,
										TextArr: [
											this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000072'),
											this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000073'),
											this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000081')
										],/* 国际化处理： 展开,收起,关闭*/
										// content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000008'),/* 国际化处理： 请注意！存在月末检查不合格单据*/
										groupOperationMsg: data.mesage
									}
								);
							}

						} else {
							toast(
								{
									title: operate + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000063') ,/* 国际化处理： 操作成功*/
									color: 'success'
								}
							);
						}
						// if (data.message) {
						// 	toast({ color: 'success', content:data.message  });
						// }else{
						// 	toast({ color: 'success', content:'操作成功'  });
						// }
						let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
						this.refreshCard(pk);
					}
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
						this.refreshCard(pk, null, false);
					}
				}
			}
		});
	}
	getCheckedData = () => {
		let selectedData = this.props.form.getAllFormValue(this.formId);
		
		let pks = [];
		let tss = [];
		if (!selectedData || selectedData.length == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000012') });/* 国际化处理： 请选择数据*/
			return;
		}
		//处理选择数据
		let pktsmap = {};
		selectedData.rows.forEach((val) => {
			
			//此处可校验，挑选满足条件的进行操作
			let pk = val.values.pk_settlement.value;

			let ts = val.values.ts.value;
			pks.push(pk);//主键数组
			tss.push(ts);
			pktsmap[pk] = ts;
		});
		let data = {
			pks: pks,
			tss: tss,
			pktsmap: pktsmap
		};
		return data;
	}
	// 结算红冲,弹框的回调函数
	redHandleProcess = () => {
		let data = this.getCheckedData();
		ajax({
			url: Templatedata.settleredhandle,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000013') });/* 国际化处理： 红冲成功*/
					let pk = this.props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
					this.refreshCard(pk);
				}
			}
		});
	}
	backClick = () => {
		// this.props.linkTo('/cmp/settlementmanagement/settlement/list/index.html');
		this.props.pushTo('/list');
	}

	render() {
		let { cardTable, form, modal, cardPagination, ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
				 {/**创建websocket */}
				 {createCardWebSocket(this.props, {
                    headBtnAreaCode: Templatedata.card_head,
                    formAreaCode: Templatedata.card_formid,
                    billpkname: Templatedata.pkname,
                    billtype: Templatedata.card_settlebilltype,
                    //serverLocation: '10.16.2.231:9991'
                })}
					{/*此处注释掉删除掉楼层信息**/}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000020'),  //标题
											billCode: this.state.billno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.backClick();
											}
										}
									)}

							</div>
							<div className="header-button-area">
							{this.props.button.createErrorFlag({
                                    headBtnAreaCode: 'card_head'
                                })}
								{this.props.button.createButtonApp({
									area: Templatedata.card_head,
									// buttonLimit: 10,
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
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [jsondata.form1],
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCScrollElement>
				</div>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							adaptionHeight: true,//表格固定行
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true
						})}
					</div>
				</NCScrollElement>
				<div>
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						target={target}
						placement={'bottom'}
						billNo={billno}
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
				<PrintOutput
					ref='printOutput'
					url={this.printurl}
					data={this.state.outputdata}
					callback={this.onOutput}
				>
				</PrintOutput>
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
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/