/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { base, ajax ,cardCache, toast, excelImportconfig } from 'nc-lightapp-front';
import {
	CARD_FORM_CODE,CARD_PAGE_CODE,CARD_TABLE_CODE,CARD_TABLE_CODE_browse,APP_CODE,
	BTN_CARD
} from "./../../cons/constant";
import bobyButtonClick from './bobyButtonClick';
import { buttonVisiable,afterEvent } from "./../events";

export function initTemplate(props,callback) {
	let that = this;
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD_PAGE_CODE,//页面id
			appcode: appcode,//注册按钮的id
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(that, props, meta)
					props.meta.setMeta(meta);	
					
					if (status === 'browse') {
						let metaFromData = meta[CARD_FORM_CODE];
						metaFromData.items.forEach((val) => {
							if(val.attrcode === 'pk_org'){
								val.visible = false;	
								val.disabled = false;
								return;
							}
							else if(val.attrcode === 'pk_org_v'){
								val.visible = true;
								val.disabled = false;
								return;
							}
						});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisiable.call(that, props);
				}
			}
		},
	)
}

function modifierMeta( props, meta) {
	let _this = this;
	//收票登记表
	meta[CARD_FORM_CODE].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org' ) {

		}
	});

	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000002'),/* 国际化处理： 操作*//* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let buttonAry = 
			    // 浏览态 展开和收回
				record.expandRowStatus ? [BTN_CARD.UNOPEN_INNER]:[BTN_CARD.OPEN_INNER];
			return props.button.createOprationButton(buttonAry, {
					area: 'card_body_inner',
					buttonLimit: 3,
					onButtonClick: (props, key) => bobyButtonClick.call(_this, props, key, text, record, index)
				});
		}
	};
	meta[CARD_TABLE_CODE].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/