/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { CARD } from '../../cons/constant';
import { base, ajax } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import { afterEvent } from './index';
export default function (props, templateCallback) {
	let app_code = props.getSearchParam('c');
	props.createUIDom(
		{
			pagecode: CARD.page_id_link,//页面id
			appcode: app_code
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					// meta = modifierMeta.call(this, meta);
					props.meta.setMeta(meta);
					templateCallback.call(this, props, meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// buttonVisible.call(this, props, button);
				}
				templateCallback && templateCallback();
			}
		}
	)
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/