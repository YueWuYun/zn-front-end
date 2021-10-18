/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
const formId = Templatedata.card_formid;
const pageId = Templatedata.card_pageid;
const appid = Templatedata.card_appid;
const buyform = Templatedata.buyform;
const sellform = Templatedata.sellform;
const chargeform = Templatedata.chargeform;
const printcard_funcode = Templatedata.printcard_funcode;
const appcode = Templatedata.app_code;
const saga_gtxid = Templatedata.saga_gtxid;
const pkname = Templatedata.pkname;


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode,//小应用code
			appid: appid//注册按钮的id
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(that, props, meta);
					props.meta.setMeta(meta, () => {
						orgVersionView(props, formId)//多版本视图显隐性
					});
					//默认组织赋值
					let context = data.context;
					if (context.pk_org) {
						that.setState({
							curr_pk_org: context.pk_org,
							curr_orgname: context.org_Name,
							curr_pk_org_v: context.pk_org_v,
							curr_orgname_v: context.org_v_Name,
							org_value: context.pk_org,
							org_display: context.org_Name
						});
					}
					if (status === 'add') {
						props.form.setFormItemsVisible(formId, { 'pk_org_v': false });
						props.form.setFormItemsDisabled(formId, { 'pk_org': false });
						if (context.pk_org) {
							// let pk_org = {
							// 	value: context.pk_org,
							// 	display: context.org_Name
							// };
							//编辑后pk_org
							// afterEvent.call(that, props, formId, "pk_org", pk_org, null,null);
							props.resMetaAfterPkorgEdit();
						} else {
							//单据没有主组织，新增时,将其他字段设置为不可编辑.
							props.initMetaByPkorg();
						}
					}
					if (status === 'browse') {
						props.form.setFormStatus(formId, 'browse');

					} else {
						props.form.setFormStatus(formId, 'edit');
					}
				}
				that.refresh();//加载数据,第一次加载数据使用
				buttonVisable.call(this, props);//控制按钮显隐性	
			}
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	//防止复制的卡片字段错乱
	if (status === 'browse') {
		meta[formId].status = status;
	} else {
		meta[formId].status = 'edit';
	}
	//参照过滤《分组后只能指定form过滤》
	//买入信息:买入账户过滤
	meta[buyform].items.map((item) => {
		//买入账户
		if (item.attrcode == 'pk_buyacct') {
			item.queryCondition = () => {
				let org_Val = props.form.getFormItemsValue(formId, 'pk_org');
				if (org_Val && org_Val.value) {
					org_Val = org_Val.value;
				} else {
					org_Val = null;
				}
				let buycurr_Val = props.form.getFormItemsValue(formId, 'pk_buycurrtype');//币种过滤暂不支持
				if (buycurr_Val && buycurr_Val.value) {
					buycurr_Val = buycurr_Val.value;
				} else {
					buycurr_Val = null;
				}
				let bill_date = props.form.getFormItemsValue(formId, 'billdate').value;//单据日期，业务日期
				return {
					pk_org: org_Val,
					bill_date: bill_date,
					pk_currtype: buycurr_Val,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件 
				};
			};
		}
	});

	meta[sellform].items.map((item) => {
		//卖出账户
		if (item.attrcode == 'pk_sellacct') {
			item.queryCondition = () => {
				let org_sell_Val = props.form.getFormItemsValue(formId, 'pk_org');
				if (org_sell_Val && org_sell_Val.value) {
					org_sell_Val = org_sell_Val.value;
				} else {
					org_sell_Val = null;
				}
				let sellcurr_Val = props.form.getFormItemsValue(formId, 'pk_sellcurrtype');
				if (sellcurr_Val && sellcurr_Val.value) {
					sellcurr_Val = sellcurr_Val.value;
				} else {
					sellcurr_Val = null;
				}
				let bill_date = props.form.getFormItemsValue(formId, 'billdate').value;//单据日期，业务日期
				return {
					pk_org: org_sell_Val,
					bill_date: bill_date,
					pk_currtype: sellcurr_Val,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
	});

	meta[chargeform].items.map((item) => {
		//手续费账户
		if (item.attrcode == 'pk_paychargeacct') {
			item.queryCondition = () => {
				let org_charge_Val = props.form.getFormItemsValue(formId, 'pk_org');
				if (org_charge_Val && org_charge_Val.value) {
					org_charge_Val = org_charge_Val.value;
				} else {
					org_charge_Val = null;
				}
				let chargecurr_Val = props.form.getFormItemsValue(formId, 'pk_chargecurrtype');
				if (chargecurr_Val && chargecurr_Val.value) {
					chargecurr_Val = chargecurr_Val.value;
				} else {
					chargecurr_Val = null;
				}
				let bill_date = props.form.getFormItemsValue(formId, 'billdate').value;//单据日期，业务日期
				return {
					pk_org: org_charge_Val,
					bill_date: bill_date,
					pk_currtype: chargecurr_Val,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

	});
	//买入币种
	meta[buyform].items.map((item) => {
		// 币种根据：卖出币种过滤
		if (item.attrcode == 'pk_buycurrtype') {
			item.queryCondition = () => {
				//卖出币种
				let sellCode = props.form.getFormItemsValue(formId, 'pk_sellcurrtype');
				if (sellCode && sellCode.value) {
					sellCode = sellCode.value;
				} else {
					sellCode = null;
				}
				//业务类型
				let busitype = props.form.getFormItemsValue(formId, 'busitype');
				if (busitype && busitype.value) {
					busitype = busitype.value;
				} else {
					busitype = null;
				}
				return {
					codePk: sellCode,
					busitype: busitype,
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCurexchangeCurrtypeGridRefSqlBuilder'
				};
			};
		}
	});
	//卖出币种
	meta[sellform].items.map((item) => {
		// 币种根据：买入币种过滤
		if (item.attrcode == 'pk_sellcurrtype') {
			item.queryCondition = () => {
				//买入币种
				let buyCode = props.form.getFormItemsValue(formId, 'pk_buycurrtype');
				if (buyCode && buyCode.value) {
					buyCode = buyCode.value;
				} else {
					buyCode = null;
				}
				//业务类型
				let busitype = props.form.getFormItemsValue(formId, 'busitype');
				if (busitype && busitype.value) {
					busitype = busitype.value;
				} else {
					busitype = null;
				}
				return {
					codePk: buyCode,
					busitype: busitype,
					pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCurexchangeCurrtypeGridRefSqlBuilder'
				};
			};
		}
	});
	meta[formId].items.map((item) => {
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: printcard_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//设置参照refer-<前台自定义-目前取消这种方式>
	// props.renderItem('form', formId, 'pk_buycurrtype', refer('pk_buycurrtype'));
	// props.renderItem('form', formId, 'pk_sellcurrtype', refer('pk_sellcurrtype'));
	// props.renderItem('form', formId, 'pk_org', refer('pk_org'));
	// props.renderItem('form', formId, 'pk_buyacct', refer('pk_buyacct'));
	// props.renderItem('form', formId, 'pk_sellacct', refer('pk_sellacct'));
	// props.renderItem('form', formId, 'pk_chargecurrtype', refer('pk_chargecurrtype'));
	// props.renderItem('form', formId, 'pk_paychargeacct', refer('pk_paychargeacct'));
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/