/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { constant } from '../../config/config.js';
import { orgVersionUtil } from '../../config/orgVersionUtil';
import { commondata } from '../../../../public/utils/constant';
let formcode1 = constant.formcode1;
let formcode2 = constant.formcode2;
let formcode3 = constant.formcode3;
let formcode4 = constant.formcode4;

export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode, 
			appid: constant.appregisterpk 
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);

					orgVersionUtil.call(this, props, formcode1)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formcode1].status = status;

	//参照过滤
	meta[formcode2].items.map((item) => {
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		}

		if (item.attrcode === 'pk_bankaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
	});

	//参照过滤
	meta[formcode3].items.map((item) => {

		// 现金账户
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_curr').value;
				return { pk_org: orgpk, pk_currtype: currency,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		} 

		// 本方账户
		if (item.attrcode === 'pk_account') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_curr').value;
				return { pk_org: orgpk, pk_currtype: currency,
					//tm begin lidyu 添加使用权参照 进行过滤 20200420 
					refnodename: commondata.refnodename,
					//end lidyu 20200420
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

		// 部门
		if (item.attrcode === 'dept') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				return { 
					pk_org: orgpk,
					// pk_currtype: currency,
					// ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

		// 人员
		if (item.attrcode === 'person') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				// let currency = props.form.getFormItemsValue(formcode1, 'pk_curr').value;
				return { 
					pk_org: orgpk,
					// pk_currtype: currency,
					// ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
	});

	meta[formcode3].items.find((e) => e.attrcode === 'pk_cashaccount').showHistory = false;
	meta[formcode3].items.find((e) => e.attrcode === 'pk_account').showHistory = false;
	meta[formcode3].items.find((e) => e.attrcode === 'pk_bank').showHistory = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/