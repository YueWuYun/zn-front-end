/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { LINK_CARD_PAGE_CODE } from '../../cons/constant';

export function initTemplate1 (props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LINK_CARD_PAGE_CODE,//页面id
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
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

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/