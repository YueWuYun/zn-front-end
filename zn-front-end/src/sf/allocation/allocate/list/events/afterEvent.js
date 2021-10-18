/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, toast } from 'nc-lightapp-front';
import { module_id, base_url, card_page_id, card_from_id, card_table_id, list_search_id } from '../../cons/constant.js';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function afterEvent(key, value) {
	console.log(key, value)
	let meta = this.props.meta.getMeta();
	//表体编辑后事件
	//收款单位
	if (key == 'allocate_b.pk_org_r') {
		if (value) {
			meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_r').isShowUnit = false;
			this.props.meta.setMeta(meta);
		}
	}
	//下拨组织
	if (key == 'pk_org') {
		if (value) {
			meta[list_search_id].items.find((e) => e.attrcode == 'allocate_b.pk_bankacc_p').isShowUnit = false;
			this.props.meta.setMeta(meta);
		}
	}



}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/