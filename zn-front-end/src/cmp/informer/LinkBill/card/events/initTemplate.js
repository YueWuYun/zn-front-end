/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { buttonVisible } from "./buttonVisible";

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode:'36070AICLINK',//页面id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					buttonVisible(props);
					props.button.setButtons(button);
				}
			}
		}
	)
}
/**
 * 日期格式化
 * @param {*} date 
 */
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(that, props, meta) {
	return meta;
}




/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/