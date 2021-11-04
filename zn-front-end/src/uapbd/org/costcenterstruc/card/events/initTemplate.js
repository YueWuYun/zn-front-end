//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax } from 'nc-lightapp-front';
export default function (props) {
	props.createUIDom(
		{
			pagecode: '1057BAOR_card',//页面id
			appcode: '1057BAOR',
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {				
					let meta = data.template;
					modifierMeta(props,meta);
					props.meta.setMeta(meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta['head'].items.map((item, key) => {
		meta['head'].items.find((item) => item.attrcode == 'mdclassid').queryCondition = () => {
			return {
				"needwherePart": "true",
				"hasChild": "false"
			}
		};
	});
	props.meta.setMeta(meta);
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX