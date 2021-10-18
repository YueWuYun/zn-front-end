/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { constant } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";

//const pageId = constant.cpagecode;
const formId = constant.formcode1;
const formId2 = constant.formcode2;
const formId3 = constant.formcode3;

export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
						if (props.getUrlParam('status') == 'add') {
							if(!hasDefaultOrg(data)){
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
							}
						}
					});
					orgVersionUtil.call(this, props, formId)//多版本视图显隐性
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
	// meta[formId].status = status;
	//防止复制的卡片字段错乱
	if(status==='copy'){
		meta[formId].status = 'edit';
	}else{
		meta[formId].status = status;
	}

	meta[formId].items.map((item) => {
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter //'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	//参照过滤
	meta[formId2].items.map((item) => {

		// 现金账户过滤
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formId, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formId, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					refnodename: commondata.refnodename, // '使用权参照',
					GridRefActionExt: commondata.cashaccountref // 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		}
		// 资金计划项目
		if(item.attrcode === 'pk_planitem'){
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formId, 'pk_org').value;
				return {
					pk_org: orgpk
				};
			};
		}
		// 银行账户过滤
		if (item.attrcode === 'pk_bankaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formId, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formId, 'pk_currency').value;
				return { pk_org: orgpk, pk_currtype: currency,
					// test:'test',
					refnodename: commondata.refnodename,
					//begin lidyu 银行账户参照过滤修改  只允许参照到活期账户
					// GridRefActionExt:  commondata.bankaccsubref // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
					GridRefActionExt:'nccloud.web.cmp.ref.CMPCashBillBankaccSubDefaultGridRefSqlBuilder'
					//end lidyu
				};
			};
		}

	});
	
	meta[formId2].items.find((e) => e.attrcode === 'pk_cashaccount').showHistory = false;
	meta[formId2].items.find((e) => e.attrcode === 'pk_bankaccount').showHistory = false;
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/