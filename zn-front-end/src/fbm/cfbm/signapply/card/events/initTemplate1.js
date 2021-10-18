/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { CARD, link_app_code } from '../../cons/constant';
import {
	orgVersionView
} from "../../../../../tmpub/pub/util/version/index";
export default function (props, templateCallback) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: CARD.page_id_link,//页面id
			appcode: appcode //link_app_code
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
				orgVersionView(props,this.formId,"pk_acceptorg","pk_acceptorg_v");
				orgVersionView(props,this.formId,"pk_applyorg","pk_applyorg_v");
				props.form.openArea('issecurity');
				props.form.openArea('acceptor');
				templateCallback && templateCallback();
			}
		}
	)
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/