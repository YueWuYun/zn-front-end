/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';

export default function beforeEvent(props, moduleId, key, value, changedrows, i) {
	
	if (key === 'pk_org') {
		//获取编辑后表单的值
		let eventdata = props.createHeadAfterEventData(
			'36070PBR_C02',
			'head',
			'paybilldetail_table',
			moduleId,
			key,
			value
		);
		console.log(eventdata);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		if (oldvalue == null) {
			ajax({
				url: '/nccloud/cmp/paybills/orgchange.do',
				data: eventdata,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}

							if (res.data.body) {
								props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
			if (value.value) {
				props.resMetaAfterPkorgEdit();
			}
		}
		if (oldvalue != newvalue && oldvalue != null) {
			this.props.modal.show('addNode');
		}
	}
}


/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/