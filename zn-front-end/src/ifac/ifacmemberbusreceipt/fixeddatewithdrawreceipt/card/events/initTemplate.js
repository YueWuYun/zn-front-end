/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base, ajax,cardCache } from 'nc-lightapp-front';
import { versionControl } from "../../../../pub/util/util.js";
let { NCPopconfirm } = base;
import {pageCodeCard} from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';


export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeCard,//页面id
			appcode: props.getUrlParam('c')  //复制小应用时传输
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
					versionControl(props);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.context) {
					buttonVisible.call(this,props);
				}
				// buttonVisible.call(this,props);
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/