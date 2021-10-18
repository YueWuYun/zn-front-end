/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { buttonVisible } from './buttonVisible';
import {RowDetailButton} from '../../../../../tmpub/pub/util/RowDetailButton'; 
import { RefFilter, FormRefFilter } from '../../util/TableRefFilter';
import { orgVersionUtil } from '../../util/orgVersionUtil'
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
import { commondata } from '../../../../public/utils/constant';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, FORM_BBP_02} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG,GZ_DEPT,GZ_PERSON,PK_BANK } = BILL_FIELD
const { BBP_CACHEKEY } = BBP_CONST

export default function(props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: CARD__PAGECODE, //页面id
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
				}
				if (data.template) {
					let meta = data.template;
					 modifierMeta.call(this, props, meta);
					 props.meta.setMeta(meta, () => {
						//给票据设置默认值
						if (props.getUrlParam('status') == 'add') {	
							if(!hasDefaultOrg(data)){
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
							}
							let pk_org =props.form.getFormItemsValue(CARD_FORMCODE, 'pk_org');
							if (!pk_org || !pk_org.value) {
								props.initMetaByPkorg();
							}
						} 
					});
					orgVersionUtil.call(this, props, CARD_FORMCODE)//多版本视图显隐性
					this.initData.call(this);
				};
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[CARD_FORMCODE].status = status;
	meta[CARD_TABLECODE].status = status;
	//form 去除缓存 历史记录
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).isMultiSelectedEnabled = false;
	//财务组织:全加载
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === PK_ORG).showHistory = false;
	//参照过滤
	meta[CARD_FORMCODE].items.map((item) => {
		// 财务组织：根据用户权限过滤
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
	meta[FORM_BBP_02].items.map((item) => {
		// 银行账户过滤
		if (item.attrcode === 'pk_bank') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
				let currency = props.form.getFormItemsValue(CARD_FORMCODE, 'gz_bz').value;
				return { pk_org: orgpk, pk_currtype: currency,
					test:'test',
					refnodename: commondata.refnodename,
					GridRefActionExt:  commondata.bankaccsubref // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
		// 票据类型
		if (item.attrcode === 'pk_notetype') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(CARD_FORMCODE, PK_ORG).value;
				let currency = props.form.getFormItemsValue(CARD_FORMCODE, 'gz_bz').value;
				return { pk_org: orgpk, pk_currtype: currency,
					test:'test',
					// refnodename: commondata.refnodename,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPNoteTypeRefSqlBuilder' // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
	});
	// 去除历史记录缓存
	// 购置部门
	meta[FORM_BBP_02].items.find((e) => e.attrcode === GZ_DEPT).showHistory = false;
	// 购置人
	meta[FORM_BBP_02].items.find((e) => e.attrcode === GZ_PERSON).showHistory = false;
	// 银行账户
	meta[FORM_BBP_02].items.find((e) => e.attrcode === PK_BANK).showHistory = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/