/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import buttonDisable from './buttonDisable';
import * as CONSTANTS from '../constants';
let { formId, tableId, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06 } = CONSTANTS;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode,//页面id
			appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta);
					//平台默认如果区域所有字段不显示会将区域可见性设置为false 这样会导致传值出现问题 咨询王龙可手工设置成true
					meta[formId_01]['areaVisible'] = true;
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonDisable.call(that, props, 'table_detail_01');
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	//财务组织，设置多选
	meta[formId_org].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	/**
	 * 委托收款、委托付款补录信息框，参照过滤
	 */
	meta[formId_02].items.map((item) => {
		//收付款资金组织:不过滤数据权限,过滤共享中心
		if (item.attrcode == 'pk_FundOrg') {
			item.queryCondition = () => {
				return {
					isDataPowerEnable: 'N',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerFundOrgsRefBuilder'
				};
			};
		}
		//收、付款单位 "根据资金组织ID、业务属性数组查询具有资金代理委托关系业务单元ID数组 "
		if (item.attrcode == 'pk_FinanceOrg') {
			item.queryCondition = () => {
				let pk_fundorg = props.form.getFormItemsValue(formId_02, 'pk_FundOrg').value;
				return {
					pk_fundorg: pk_fundorg,
					TreeRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerFundUnitRefBuilder"
				};
			};
		}
		//内部账户过滤
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
				let pk_ownerorg = props.form.getFormItemsValue(formId_02, ['pk_FinanceOrg'])[0].value;
				return {
					pk_org: pk_org,
					pk_ownerorg: pk_ownerorg,
					GridRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerAccidRefBuilder'
				};
			};
		}
		//货币形态
		if (item.attrcode == 'pk_FundType') {
			item.queryCondition = () => {
				return {
					pk_defdoclist: '1003ZZ10000000000669'
				};
			};
		}

		//收/付款资金组织计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
		// 收/付款单位计划项目(改成根据资金组织过滤)
		if (item.attrcode == 'pk_financeplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
	});
	/**
	 * 资金上收，资金下拨弹框，参照顾虑
	 */
	meta[formId_03].items.map((item) => {
		//货币形态
		if (item.attrcode == 'pk_FundType') {
			item.queryCondition = () => {
				return {
					pk_defdoclist: '1003ZZ10000000000669'
				};
			};
		}
		//收付款单位计划项目：收/付款资金组织计划项目
		if (item.attrcode == 'pk_financeplanitem' || item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
	});
    /**
	 * 收款结算单、付款结算单：弹框参照顾虑
	 */
	meta[formId_04].items.map((item) => {
		//交易类型
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let billtype = that.state.selectedFinanceValue;
				return {
					billtype: billtype,
					GridRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerBillTypeRefBuilder"
				};
			};
		}
		//对方账户:根据客户和供应商过滤
		if (item.attrcode == 'oppacc') {
			item.queryCondition = () => {
				let busiobj = props.form.getFormItemsValue(formId_04, ['busiobjtype'])[0].value;
				let pk_cust;
				let accclass;
				if (busiobj == 0) {//客户
					pk_cust = props.form.getFormItemsValue(formId_04, ['pk_customer'])[0].value;
					accclass = 1;
				} else if (busiobj == 2) {//部门
					pk_cust = props.form.getFormItemsValue(formId_04, ['pk_supplier'])[0].value;
				} else if (busiobj == 3) {//人员
					pk_cust = props.form.getFormItemsValue(formId_04, ['pk_person'])[0].value;
				}
				return {
					pk_cust: pk_cust,
					accclass: accclass
				};
			};
		}
		//客户
		if (item.attrcode == 'pk_customer') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_group
				};
			};
		}
		//供应商
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_group
				};
			};
		}
		//散户 
		if (item.attrcode == 'pk_sanhu') {
			item.queryCondition = () => {
				let pk_customer = props.form.getFormItemsValue(formId_04, ['pk_customer'])[0].value;
				let pk_supplier = props.form.getFormItemsValue(formId_04, ['pk_supplier'])[0].value;
				let data;
				if (pk_customer) {
					data = pk_customer
				} else if (pk_supplier) {
					data = pk_supplier
				}
				return {
					customSupplier: data
				};
			};
		}
		//收付款单位计划项目：收/付款资金组织计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
		//部门
		if (item.attrcode == 'pk_department') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//人员
		if (item.attrcode == 'pk_person') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}

	});
	/**
	 * 收款单、付款单：弹框参照顾虑
	*/
	meta[formId_06].items.map((item) => {
		//交易类型
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let billtype = that.state.selectedFinanceValue;
				return {
					billtype: billtype,
					GridRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerBillTypeRefBuilder"
				};
			};
		}
		//对方账户:根据客户和供应商过滤
		if (item.attrcode == 'oppacc') {
			item.queryCondition = () => {
				let busiobj = props.form.getFormItemsValue(formId_06, ['busiobjtype'])[0].value;
				let pk_cust;
				let accclass;
				if (busiobj == 0) {//客户
					pk_cust = props.form.getFormItemsValue(formId_06, ['pk_customer'])[0].value;
					accclass = 1;
				} else if (busiobj == 2) {//部门
					pk_cust = props.form.getFormItemsValue(formId_06, ['pk_supplier'])[0].value;
				} else if (busiobj == 3) {//人员
					pk_cust = props.form.getFormItemsValue(formId_06, ['pk_person'])[0].value;
				}
				return {
					pk_cust: pk_cust,
					accclass: accclass
				};
			};
		}
		//客户
		if (item.attrcode == 'pk_customer') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_group
				};
			};
		}
		//供应商
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_group
				};
			};
		}
		//散户 
		if (item.attrcode == 'pk_sanhu') {
			item.queryCondition = () => {
				let pk_customer = props.form.getFormItemsValue(formId_06, ['pk_customer'])[0].value;
				let pk_supplier = props.form.getFormItemsValue(formId_06, ['pk_supplier'])[0].value;
				let data;
				if (pk_customer) {
					data = pk_customer
				} else if (pk_supplier) {
					data = pk_supplier
				}
				return {
					customSupplier: data
				};
			};
		}
		//收付款单位计划项目：收/付款资金组织计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
		//部门
		if (item.attrcode == 'pk_department') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//人员
		if (item.attrcode == 'pk_person') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000012'),
		className: "table-opr",
		itemtype: 'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry =
				record.generateflag.value == 'hasnogenerate'//未发布
					? []
					: record.generateflag.value == 'hasrelease'//已发布
						? ['Lcancelpublish',]
						: record.generateflag.value == 'nogenerate'//不生成
							? ["Lrecgenerate"]
							: record.generateflag.value == 'hasgenerate'//已生成
								? ['Lcancelgenerate']
								: record.generateflag.value == 'hasclaim'//已认领
									? ['Lunclaim', 'Lgenerate']
									: []
			return props.button.createOprationButton(buttonAry, {
				area: "card_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/