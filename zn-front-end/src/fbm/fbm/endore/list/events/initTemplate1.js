/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
import { LIST, CARD } from '../../cons/constant';

export function initTemplate1(props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LIST.pageCode_link,//页面id
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, data.template);
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
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
	meta[LIST.tableCode].items = meta[LIST.tableCode].items.map((item, key) => {
		if (item.attrcode === 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							if (props.getUrlParam('scene') === 'linksce' || props.getUrlParam('scene') === 'fip' || this.props.getUrlParam('pk_ntbparadimvo')) {
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_endore && record.pk_endore.value,
									pagecode: CARD.pageCode_link,
									scene: 'linksce'
								});
							} else {
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_endore && record.pk_endore.value,
									pagecode: CARD.pageCode
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