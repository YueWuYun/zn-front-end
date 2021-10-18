/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: CARD__PAGECODE, //页面id
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
					orgVersionUtil.call(this, props, CARD_FORMCODE)//多版本视图显隐性
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
	// meta[CARD_FORMCODE].status = status;
	//防止复制的卡片字段错乱
	if(status==='copy'){
		meta[CARD_FORMCODE].status = 'edit';
	}else{
		meta[CARD_FORMCODE].status = status;
	}

	meta[CARD_FORMCODE].items.map((item) => {
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: APPCODE,
					TreeRefActionExt: commondata.financeOrgPermissionFilter //'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//财务组织:全加载
	meta[CARD_FORMCODE].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//参照过滤
	meta[CARD_FORMCODE2].items.map((item) => {
		
	});
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/