/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { buttonVisible } from './buttonVisible';
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
let { getDefData } = cardCache;

export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode2,
			appcode: props.getUrlParam('c')
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);

					// orgVersionUtil.call(this, props, formcode1)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					// props.button.setButtonDisabled(buttonDisable.listdisable, true);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/