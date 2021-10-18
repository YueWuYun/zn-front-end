/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { constant } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { cardCache} from 'nc-lightapp-front';
import { cache } from '../../../../../tmpub/pub/cons/constant';

//const pageId = constant.cpagecode;
const formId = constant.formcode1;
const formId2 = constant.formcode2;
const formId3 = constant.formcode3;

export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.approve_card_pagecode, //页面id
			appid: constant.appregisterpk //'0001Z61000000001PA3D' //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// buttonVisible(props,null);
				}
				//begin lidyu 双击进入卡片 异常交互 
				cardCache.setDefData(cache.iserrtoast, constant.cacheDataSource, true);
				//end
			}
		}
		
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;

	meta[constant.formcode1].items.map((item) => {
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//财务组织:全加载
	meta[constant.formcode1].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	//参照过滤
	meta[formId2].items.map((item) => {

		// 现金账户过滤
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(constant.formcode1, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					refnodename: commondata.refnodename, // '使用权参照',
					GridRefActionExt: commondata.cashaccountref // 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		}

		// 银行账户过滤
		if (item.attrcode === 'pk_bankaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(constant.formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(constant.formcode1, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					refnodename: commondata.refnodename,
					GridRefActionExt:  commondata.bank_account_ref_notinside // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

	});

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/