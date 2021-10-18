/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import {
	LIST_PAGE_CODE,
	LIST_SEARCH_CODE,
	LIST_SEARCH_CODE2,
	LIST_TABLE_CODE,
	LINK_CARD_PAGE_CODE,
	DATASOURCE,
	CARD_PAGE_CODE,
	BILL_TYPE,
	LIST_QUICKIMPAWN,
	LIST_QUICKDISCOUNT,
	BANKINFO
} from './../../cons/constant';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util';
import { bobyButtonClick } from './bobyButtonClick';
import { excelImportconfig, cardCache } from 'nc-lightapp-front';
let { setDefData } = cardCache;

export function initTemplate(props) {
	let that = this;
	let excelimportconfig = excelImportconfig(props, 'fbm', BILL_TYPE, true, '', {
		appcode: this.appcode,
		pagecode: CARD_PAGE_CODE
	});
	props.createUIDom(
		{
			pagecode: LIST_PAGE_CODE,
			appcode: this.appcode //注册按钮的id
		},
		(data) => {
			if (data) {
				if (!data.template[LIST_TABLE_CODE]) {
					return;
				}
				let lineButton = [];
				if (data.button) {
					props.button.setButtons(data.button);
					props.button.setUploadConfig('Import', excelimportconfig);
					props.button.setPopContent(
						'InnerDelete',
						this.props.MutiInit.getIntl('36180RBR') &&
						this.props.MutiInit.getIntl('36180RBR').get('36180RBR-000030')
					); /* 国际化处理： 确定要删除吗?*/
				}
				if (data.template) {
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
					meta = modifierMeta.call(that, props, meta, lineButton);
					// modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, LIST_SEARCH_CODE, data);
				}

				if (data.context) {
					//context信息中包含小应用的一些信息，可根据此信息进行特殊处理
					let context = data.context;
					that.setState({
						curr_pk_org: context.pk_org,
						curr_orgname: context.org_Name
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta, lineButton) {
	let that = this;
	meta[LIST_SEARCH_CODE].items.map(item => {
		//财务组织用户过滤
		if (item.attrcode == "pk_org") {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam("c") || props.getUrlParam("c"),
					TreeRefActionExt:
						"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
				};
			};
		}
		//付票单位过滤
		if (item.attrcode === "paybillunit") {
			item.checkStrictly = false;
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: props.search.getSearchValByField(LIST_SEARCH_CODE, 'pk_org').value.firstvalue, //组织
					pk_group: props.search.getSearchValByField(LIST_SEARCH_CODE, 'pk_group').value.firstvalue, //集团
				};
			};
		}

		// 自定义项过滤
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = props.search.getSearchValByField(LIST_SEARCH_CODE, 'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				}
			}
		}

	});
	meta[LIST_TABLE_CODE].items = meta[LIST_TABLE_CODE].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record.pk_register && record.pk_register.value,
								pagecode: CARD_PAGE_CODE
							});
						}}
					>
						{record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		return item;
	});

	// 电票网银信息
	meta[LIST_SEARCH_CODE2].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == "pk_org") {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam("c") || props.getUrlParam("c"),
					TreeRefActionExt:
						"nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
				};
			};
		}
		// 电票签约账号
		if (item.attrcode == 'receiveaccount') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(LIST_SEARCH_CODE2, 'pk_org').value;
				return {
					isenableelecbill: 'Y',
					pk_org: data,
					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
				};
			};
		}
	});

	// 快捷贴现
	meta[LIST_QUICKDISCOUNT].items.map((item) => {
		//贴现银行账户
		if (item.attrcode == 'discount_account') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(LIST_QUICKDISCOUNT, 'pk_org').value;
				let pk_currtype = props.form.getFormItemsValue(LIST_QUICKDISCOUNT, 'pk_curr').value;
				return {
					pk_org: pk_org,
					pk_curr: pk_currtype,
					GridRefActionExt: "nccloud.web.fbm.fbm.sign.filter.SignPkcurrFilter"
				};
			}
		}
		//快捷贴现：利息计划项目, 支出项目
		if (item.attrcode == 'interestplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(LIST_QUICKDISCOUNT, 'pk_org').value;
				return {
					pk_org: pk_org,
					'inoutdirect': 1
				};
			}
		}
		//快捷贴现：贴现余额计划项目，收入项目
		if (item.attrcode == 'balanceplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(LIST_QUICKDISCOUNT, 'pk_org').value;
				return {
					pk_org: pk_org,
					'inoutdirect': 0
				};
			}
		}
		//快捷贴现：资金计划项目为支出类的计划项目，支出项目
		if (item.attrcode == 'fbmplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(LIST_QUICKDISCOUNT, 'pk_org').value;
				return {
					pk_org: pk_org,
					'inoutdirect': 1
				};
			}
		}
	});

	// 电票网银信息 -快捷质押
	meta[LIST_QUICKIMPAWN].items.map((item) => {
		// 电票签约账号
		if (item.attrcode == 'holderaccount') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(LIST_QUICKIMPAWN, 'pk_org').value;
				return {
					isenableelecbill: 'Y',
					pk_org: data,
					GridRefActionExt: 'nccloud.web.fbm.ref.filter.BankAccDefaultGridRefFilter'
				};
			};
		}
		//借款单位  客商参照需要传pk_org和pk_group
		if (item.attrcode == "debitunit") {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(LIST_QUICKIMPAWN, 'pk_org');
				let pk_group = this.props.form.getFormItemsValue(LIST_QUICKIMPAWN, "pk_group");
				return {
					pk_org: pk_org && pk_org.value,
					pk_group: pk_group && pk_group.value
				};
			};
		}
		//质押人
		if (item.attrcode === "impawnpersonid") {
			item.showHistory = true;
			item.queryCondition = () => {
				return {
					pk_org: this.props.form.getFormItemsValue(LIST_QUICKIMPAWN, "pk_org").value
				};
			};
		}

	});

	//添加操作列
	meta[LIST_TABLE_CODE].items.push({
		label:
			this.props.MutiInit.getIntl('36180RBR') &&
			this.props.MutiInit.getIntl('36180RBR').get('36180RBR-000033') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			return (
				<div>
					{// 适配云原生 改造适配
						props.button.createErrorButton({
							record: record,
							//showBack: false,  //不显示回退，默认显示
							sucessCallBack: () => {
								console.log(record.vbillstatus, 99);
								let buttonAry = [];
								let status = record.vbillstatus && record.vbillstatus.value;
								let sfflag = record.sfflag && record.sfflag.value;
								let voucher = record.voucher && record.voucher.value;
								let initflag = record.initflag && record.initflag.value;
								let onlinebankflag = record.onlinebankflag && record.onlinebankflag.value;
								let fbmbilltype = record.fbmbilltype && record.fbmbilltype.value;
								//电票指令状态
								let elcpaymentstatus = record.elcpaymentstatus && record.elcpaymentstatus.value;
								//票据状态
								let registerstatus = record.registerstatus && record.registerstatus.value;
								//作废
								let disuseflag = record.disuseflag && record.disuseflag.value;

								// 期初票不可做任何操作
								if (!initflag) {
									// 自由态
									if (status == '-1') {
										if (onlinebankflag && (fbmbilltype == BANKINFO.EBANK || fbmbilltype == BANKINFO.EBUSI)) {
											if (elcpaymentstatus == '3') {
												buttonAry = [];
											} else if (elcpaymentstatus == '2') {
												buttonAry = ['ReceiveReject'];
											} else {
												buttonAry = ['InnerCommit', 'InnerEdit', 'InnerDelete', 'ReceiveReject'];
											}
										} else {
											buttonAry = ['InnerCommit', 'InnerEdit', 'InnerDelete'];
										}
									}
									// 审批中
									if (status == '2' || status == '3') {
										// 未收票才能收回
										if (!sfflag) {
											buttonAry = ['InnerUnCommit'];
										}
									} else if (status == '1') {
										//判断是否网银
										if (onlinebankflag) {//勾选网银
											if (elcpaymentstatus == null) {
												if (registerstatus == 'register') {//票据状态为已收票才能签收
													buttonAry = ['InnerUnCommit', 'Receive'];
												} else {
													buttonAry = ['InnerUnCommit'];
												}
											} else {
												if (elcpaymentstatus == '1') {//签收成功
													if (voucher) {
														buttonAry = ['InnerVoucherCancel'];
													} else {
														buttonAry = ['InnerVoucher'];
													}
												} else if (elcpaymentstatus == '2') { //签收失败——作废按钮控制
													if (disuseflag) {
														buttonAry = ['InnerCancelDisabled'];
													} else {
														if (registerstatus == 'register') {//票据状态为已收票才能签收
															buttonAry = ['InnerDisabled', 'Receive'];
														} else {
															buttonAry = ['InnerDisabled'];
														}
													}
												}
											}
										} else {//没有勾选网银
											if (!sfflag) {//未收票
												if (registerstatus == 'register') {//票据状态为已收票才能签收
													buttonAry = ['InnerUnCommit', 'Receive'];
												} else {
													buttonAry = ['InnerUnCommit'];
												}
											} else {//已收票
												if (voucher) {
													buttonAry = ['InnerVoucherCancel'];
												} else {
													if (registerstatus == 'register') {//票据状态为已收票才能签收
														buttonAry = ['InnerVoucher', 'ReceiveCancel'];
													} else {
														buttonAry = ['InnerVoucher'];
													}
												}

											}
										}
									}
								}
								return props.button.createOprationButton(buttonAry, {
									area: 'list_inner',
									buttonLimit: 3,
									onButtonClick: (props, key) => bobyButtonClick.call(that, props, key, text, record, index)
								});
							}
						})}
				</div>
			);
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/