/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { CARD } from '../../cons/constant';

export function initTemplate1(props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.pageCode_link,//页面id
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
				this.setUIDisplay();				
			}
		}
	)
}
/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/