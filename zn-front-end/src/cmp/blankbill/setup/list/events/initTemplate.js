/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast , createOprationButton } from 'nc-lightapp-front';
import {setButtonVisible} from './initRestMoneyDate';
let { NCPopconfirm, NCIcon } = base;
import { commondata } from '../../../../public/utils/constant';
import { SHOW_MODE } from '../../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;

export default function (props,json) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: LIST_PAGECODE,//页面id
			// appcode: APPCODE//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(_this,props, meta, null, null ,json)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonVisible(props,true);
				}
			}
		}
	)
}

// function seperateDate(date){
// 	if (typeof date !=='string') return ;
// 	let result = date.split(' ') && date.split(' ')[0];
// 	return result;
// }

function modifierMeta(props, meta ,record,index,json) {
	// 查询区参照过滤
	meta[SEARCH_CODE].items = meta[SEARCH_CODE].items.map((item, key) => {
		item.isShowDisabledData = true; // “显示停用”的字段
		// item.visible = true;
		// item.col = '3';
		if (item.attrcode == PK_ORG) {
			item.queryCondition = () => {
                return {
                    funcode: APPCODE,
                    TreeRefActionExt: commondata.financeOrgPermissionFilter
                };
            };
		}
		//财务组织:全加载
		// meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;
		return item;
	})
	//财务组织:全加载
	meta[SEARCH_CODE].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	// meta[FORM_BBC_01].items = meta[FORM_BBC_01].items.map((item, key) => {
		// item.width = 210;
		// 财务组织：根据用户权限过滤
// 		if (item.attrcode == 'pk_org') {
//             item.queryCondition = () => {
//                 return {
//                     funcode: APPCODE,
//                     TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
//                 };
//             };
// 		    //财务组织:全加载
// 		}
// 	    meta[FORM_BBC_01].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
		// return item;
	// });
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/