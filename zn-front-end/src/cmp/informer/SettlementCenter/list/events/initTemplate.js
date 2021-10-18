/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import buttonDisable from './buttonDisable';
import * as CONSTANTS from '../constants';
let { tableId, searchId, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_06, formId_07, formId_08, oid } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
const { Item } = NCMenu;

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
					meta = modifierMeta(that, props, meta)
					//平台默认如果区域所有字段不显示会将区域可见性设置为false 这样会导致传值出现问题 咨询王龙可手工设置成true
					meta[formId_01]['areaVisible'] = true;
					props.meta.setMeta(meta);
					setDefaultOrg(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonDisable.call(that, props, 'table');
				}
			}
		}
	)
}

function setDefaultOrg(props) {
	ajax({
		url: '/nccloud/cmp/informer/defaultorg.do',
		data: { ssc: 'false' },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.search.setSearchValByField('search', 'pk_org', { value: data.value, display: data.display });
				} else {
					props.search.setSearchValByField('search', 'pk_org', { value: null });
				}
			}
		}
	});
}
/**
 * 日期格式化
 * @param {*} date 
 */
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}
function modifierMeta(that, props, meta) {

	//显示查询区域字段
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '4';
		item.isShowDisabledData = true;
		return item;
	})
	//银行账户子户，设置多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_acc_sub').isMultiSelectedEnabled = true;
	//财务组织，设置多选
	meta[formId_org].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	meta[formId_org].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//是否显示历史数据
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_acc_sub').showHistory = true;


	/**
	 * 向下级发布，财务组织过滤
	 */
	meta[formId_org].items.map((item) => {
		//财务组织过滤,用户有权限的组织
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: '36070AI',
					isSSCOrg: 'N',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerSSCOrgRefBuilder'
				};
			};
		}
	});
	/**
	 * 查询区域参照过滤
	 */
	meta[searchId].items.map((item) => {
		//财务组织过滤,用户有权限的组织
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: '36070AI',
					isSSCOrg: 'N',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerSSCOrgRefBuilder'
				};
			};
		}
		//银行账户子户过滤，根据组织过滤
		if (item.attrcode == 'pk_acc_sub') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue;
				return {
					pk_org: pk_org,
					refnodename: props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000049'),/* 国际化处理： 使用权参照*/
					isDisableDataShow: 'N',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccSubDefaultBuilder'
				};
			};
		}
	});
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
		//收/付款资金组织计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId_02, ['pk_FundOrg'])[0].value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
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
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
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
					let pk_psndoc = props.form.getFormItemsValue(formId_04, ['pk_person'])[0].value;
					return {
						pk_psndoc: pk_psndoc
					};
				} else if (busiobj == 1) {//供应商
					pk_cust = props.form.getFormItemsValue(formId_04, ['pk_supplier'])[0].value;
					accclass = 2;
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//供应商
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//人员
		if (item.attrcode == 'pk_person') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//托收协议
		if (item.attrcode == 'consignagreement') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
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
					accclass = 2;
				} else if (busiobj == 1) {//供应商
					pk_cust = props.form.getFormItemsValue(formId_06, ['pk_supplier'])[0].value;
					accclass = 2;
				}
				else if (busiobj == 2) {//部门
					let supplier = props.form.getFormItemsValue(formId_06, ['pk_supplier'])[0].value;
					let cust = props.form.getFormItemsValue(formId_06, ['pk_customer'])[0].value;
					if (supplier != undefined) {
						pk_cust = supplier;
					} else if (cust != null) {
						pk_cust = cust;
					}
					accclass = 2;
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//供应商
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
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
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//人员
		if (item.attrcode == 'pk_person') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
	});


	/**
    * 红字收款单：弹框参照过滤
    */
	meta[formId_07].items.map((item) => {
		//交易类型
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let billtype = 'F2';
				return {
					billtype: billtype,
					GridRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerBillTypeRefBuilder"
				};
			};
		}
		//客户
		if (item.attrcode == 'pk_customer') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//对方账户:根据客户过滤
		if (item.attrcode == 'oppacc') {
			item.queryCondition = () => {
				let pk_cust = props.form.getFormItemsValue(formId_07, ['pk_customer'])[0].value;;
				let accclass = 2;
				return {
					pk_cust: pk_cust,
					accclass: accclass
				};
			};
		}
		//计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
	});

	/**
	 * 红字付款单：弹框参照过滤
	 */
	meta[formId_08].items.map((item) => {
		//交易类型
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let billtype = 'F3';
				return {
					billtype: billtype,
					GridRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerBillTypeRefBuilder"
				};
			};
		}
		//供应商
		if (item.attrcode == 'pk_supplier') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		//对方账户:根据供应商过滤
		if (item.attrcode == 'oppacc') {
			item.queryCondition = () => {
				let pk_cust = props.form.getFormItemsValue(formId_08, ['pk_supplier'])[0].value;;
				let accclass = 2;
				return {
					pk_cust: pk_cust,
					accclass: accclass
				};
			};
		}
		//计划项目
		if (item.attrcode == 'pk_fundplanitem') {
			item.queryCondition = () => {
				let pk_org = props.table.getAllTableData("table").rows[0].values.pk_org.value;
				let pk_group = props.table.getAllTableData("table").rows[0].values.pk_group.value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
	});

	meta[tableId].pagination = true;

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000012'),/* 国际化处理： 操作*/
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {
			let usemoney = record.usemoney.value;
			let hasDetail = false;
			let buttonAry =
				record.generateflag.value == 'hasnogenerate'//未发布
					? ["Lgenerate", "Lnogenerate", 'Lcompublish', 'Lsubpublish']
					: record.generateflag.value == 'hasrelease'//已发布
						? ["Ldetail", "Lcancelpublish"]
						: record.generateflag.value == 'nogenerate'//不生成
							? ["Lrecgenerate"]
							: record.generateflag.value == 'hasgenerate'//已生成
								? ['Ldetail', 'Lcancelgenerate']
								: []
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}



/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/