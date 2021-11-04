//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;

let tableId = 'formatdoccard';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: '10140LFOR_CARD',//页面id
			appcode: '10140LFOR'
		},
		function (data) {
			if (data) {
                if (data.button) {
                    let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {				
					let meta = data.template;
					props.meta.setMeta(meta);
				}
			}
		}
	)
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX