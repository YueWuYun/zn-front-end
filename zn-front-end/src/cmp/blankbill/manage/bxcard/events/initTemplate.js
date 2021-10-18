/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base} from 'nc-lightapp-front';
import {BBM_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, BX_PAGECODE, FORM_BBM_BX01, FORM_BBM_BX02, TABLE_BBM_BX01, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
// const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
export default function (props) {

	let that = this;
	props.createUIDom(
		{
			pagecode: BX_PAGECODE //页面id
		},
		(data) => {
			if (data) {
				let {button,template} = data;
				if (button) {
					props.button.setButtons(button, () => {
					});
				}
				if (template) {
					modifierMeta(that, props, template);
					props.meta.setMeta(template, () => {
						//给票据设置默认值
						// if (props.getUrlParam('status') == 'add') {	
						// 	let pk_org =props.form.getFormItemsValue('head', 'pk_org');
						// 	if (!pk_org || !pk_org.value) {
						// 		props.initMetaByPkorg();
						// 		//props.form.setFormItemsDisabled('head', { pk_org: false }); //财务组织、
						// 	}
						// } 
					});
					// this.initData.call(that);
				};
			}
		}
	);

}


function modifierMeta(props, meta) {
	// meta[FORM_BBM_BX01].status = 'edit';
	// meta[TABLE_BBM_BX01].status = 'edit';
	// meta[TABLE_BBM_BX01].items = meta[TABLE_BBM_BX01].items.map((item, key) => {
	// 	item.width = 150;
	// 	return item;
	// });
	
	// meta[TABLE_BBM_BX01].showcheck = true;
	// meta[TABLE_BBM_BX01].pagination = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/