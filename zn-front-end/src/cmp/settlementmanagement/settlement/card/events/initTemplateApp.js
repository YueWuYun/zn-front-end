/*2Q9EHzn+SFzlSX6C8VH4fuwpUCU3TDkxAAWISitTUvVRwQEEIaYIOdVRPPM1hXsR*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
const pageId = Templatedata.card_approve;

export default function (props, callback) {
	props.createUIDom(
		{
			pagecode: pageId,	// 审批页面id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				callback && callback();
			}
		}
	)
}

function modifierMeta(props, meta) {
	return meta;
}

/*2Q9EHzn+SFzlSX6C8VH4fuwpUCU3TDkxAAWISitTUvVRwQEEIaYIOdVRPPM1hXsR*/