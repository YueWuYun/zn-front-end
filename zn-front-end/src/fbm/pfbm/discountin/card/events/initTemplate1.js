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
				if (data.context) {
					let context = data.context;
					if (props.getUrlParam('status') === 'add') {
						//设置默认组织
						let { pk_org, org_Name, pk_org_v, org_v_Name } = context;
						if (pk_org) {
							props.form.setFormItemsValue(this.formId, {
								'pk_org': { value: pk_org, display: org_Name },
								'pk_org_v': { value: pk_org_v, display: org_v_Name }
							});
							// afterEvent.call(this, props, this.formId, 'pk_org', { display: org_Name, value: pk_org },{ value: null});
						}
					}
				}
			}
		}
	)
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/