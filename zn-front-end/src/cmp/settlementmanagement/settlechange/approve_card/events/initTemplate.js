/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
import { constant,requesturl } from '../../config/config.js';
import { buttonVisible } from './buttonVisible';
import { orgVersionUtil } from '../../config/orgVersionUtil';
let { NCPopconfirm } = base;

let formcode1 = constant.formcode1;

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.approve_card_pagecode,
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
					buttonVisible(props);
				
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formcode1].status = status;

	//参照过滤
	meta[constant.formcode2].items.map((item) => {
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
	meta[constant.formcode3].items.map((item) => {

		// 现金账户
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(constant.formcode1, 'pk_curr').value;
				return { pk_org: orgpk, pk_currtype: currency,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		}

		// 本方账户
		if (item.attrcode === 'pk_account') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(constant.formcode1, 'pk_curr').value;
				return { pk_org: orgpk, pk_currtype: currency,
					ExtRefSqlBuilder: 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
	});

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/