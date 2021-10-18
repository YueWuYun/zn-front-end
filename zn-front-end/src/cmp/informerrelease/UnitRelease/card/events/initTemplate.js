/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import tableButtonClick from './tableButtonClick';
import * as CONSTANTS from '../constants';
let { formId, tableId, pagecode, appid, formId_org, formId_01, formId_02 } = CONSTANTS;
import { buttonVisible } from './buttonVisible';

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
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				buttonVisible(props);
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	/**
	 * 向下级发布数据过滤
	 */
	meta[formId_org].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[formId_org].items.find((e) => e.attrcode === 'pk_org').showHistory = false;
	meta[formId_org].items.map((item) => {
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
	 * 认领窗口参照过滤
	 */
	meta[formId_02].items.map((item) => {
		//收付款资金组织：不过滤数据权限
		if (item.attrcode == 'pk_FundOrg') {
			item.queryCondition = () => {
				return {
					isDataPowerEnable: 'N',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerFundOrgsRefBuilder'
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
		//收、付款单位 "根据资金组织ID、业务属性数组查询具有资金代理委托关系业务单元ID数组 "
		// if (item.attrcode == 'pk_FinanceOrg') {
		// 	item.queryCondition = () => {
		// 		let pk_fundorg = props.form.getFormItemsValue(formId_02, 'pk_FundOrg').value;
		// 		return {
		// 			pk_fundorg: pk_fundorg,
		// 			TreeRefActionExt: "nccloud.web.cmp.informer.refbuilder.InformerFundUnitRefBuilder"
		// 		};
		// 	};
		// }
		//收付款单位计划项目：收/付款资金组织计划项目
		if (item.attrcode == 'pk_fundplanitem' || item.attrcode == 'pk_financeplanitem') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId_01, ['pk_org'])[0].value;
				let pk_group = props.form.getFormItemsValue(formId_01, ['pk_group'])[0].value;
				return {
					pk_org: pk_org,
					pk_group: pk_group,
					isDisableDataShow: false,//是否显示停用数据
				};
			};
		}
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000011')/*'操作'*/,
		fixed: 'right',
		className: "table-opr",
		itemtype: 'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry =
				record.generateflag.value == 'hasnogenerate'//未发布
					? ['Lsubpublish','Lclaim']
					: record.generateflag.value == 'hasrelease'//已发布
						? ['Lsubpublish','Lclaim']
						: record.generateflag.value == 'nogenerate'//不生成
							? ["Lrecgenerate"]
							: record.generateflag.value == 'hasgenerate'//已生成
								? ['Lcancelgenerate','Lreclaim']
								: record.generateflag.value == 'hasclaim'//已认领
									? ['Lunclaim', 'Lreclaim']
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