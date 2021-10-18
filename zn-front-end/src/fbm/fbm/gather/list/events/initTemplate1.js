/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { LINK_LIST_PAGE_CODE } from '../../cons/constant';

export function initTemplate1(props) {
	let that = this;
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LINK_LIST_PAGE_CODE,//页面id
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(that, props, meta);
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

function modifierMeta(props, meta) {
	let that = this;
	let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
	let sence = this.props.getUrlParam("sence");
	meta["36180rbr_l01_table"].items = meta["36180rbr_l01_table"].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							if(pk_ntbparadimvo){
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_register && record.pk_register.value,
									pagecode: LINK_LIST_PAGE_CODE,
									pk_ntbparadimvo: pk_ntbparadimvo
								});
							}else{
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_register && record.pk_register.value,
									pagecode: LINK_LIST_PAGE_CODE,
									sence: sence
								});
							}
						}}
					>
						{record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		return item;
	});
	return meta;
}
/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/