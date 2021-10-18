/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { buttonVisible } from './buttonVisible';
import {RowDetailButton} from '../../../../../tmpub/pub/util/RowDetailButton'; 
import { commondata } from '../../../../public/utils/constant';
import { RefFilter, FormRefFilter } from '../../util/TableRefFilter';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_FORMCODE2, CARD_TABLECODE, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, BANKCODE, LY_DEP, LY_PSN, MENOY_KIND } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;

export default function(props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: CARD__PAGECODE //页面id
		},
		function(data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(that, props);
					});
				}
				if (data.template) {
					let meta = data.template;
					 modifierMeta(that, props, meta);
					 props.meta.setMeta(meta, () => {
						//给票据设置默认值
						if (props.getUrlParam('status') == 'add') {	
							let pk_org =props.form.getFormItemsValue('head', PK_ORG);
							if (!pk_org || !pk_org.value) {
								props.initMetaByPkorg();
								//props.form.setFormItemsDisabled('head', { pk_org: false }); //财务组织、
							}
						} 
					});
					that.initData.call(that);
				};
			}
		}
	);
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[CARD_FORMCODE].status = status;
	meta[CARD_TABLECODE].status = status;
	//参照过滤
	meta[CARD_FORMCODE].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == PK_ORG) {
			item.queryCondition = () => {
				return {
					funcode: APPCODE,
					TreeRefActionExt: commondata.financeOrgPermissionFilter
				};
			};
		}
	});
	//参照过滤
	meta[CARD_FORMCODE2].items.map((item) => {
		// 银行账户过滤
		if (item.attrcode === BANKCODE) {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
				let currency = props.form.getFormItemsValue(CARD_FORMCODE, MENOY_KIND).value;
				return {
					pk_org: orgpk,
					pk_currtype: currency,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
			// 购置部门
		if (item.attrcode == LY_DEP ) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
				return {
					pk_org: pk_org,
				};
			};
		}
			// 购置人
		if (item.attrcode == LY_PSN ) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
				return {
					pk_org: pk_org,
				};
			};
		}
	});
	//form 去除缓存 历史记录
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).isMultiSelectedEnabled = false;
	//财务组织:全加载
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;
	// 去除缓存历史记录
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).showHistory = false;
	meta[CARD_FORMCODE2].items.find((e) => e.attrcode === BANKCODE).showHistory = false;
	meta[CARD_FORMCODE2].items.find((e) => e.attrcode === LY_DEP).showHistory = false;
	meta[CARD_FORMCODE2].items.find((e) => e.attrcode === LY_PSN).showHistory = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/