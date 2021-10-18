/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/

import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants.js';
let { pageCodeCard } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
const { Item } = NCMenu;
export default function (props, json, inlt) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeCard
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta)
					//加载模板数据
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	)
}
function modifierMeta(that, props, meta) {
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/