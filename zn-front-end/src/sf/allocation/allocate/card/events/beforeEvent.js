/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
//引入常量定义
import { module_id, base_url, button_limit, card_page_id, card_from_id, card_table_id, viewmod_deal, dataSource, list_page_id, SHOWMODEL_BULU, sourceModel_SF } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function beforeEvent(props, moduleId, key, value, i, record, status) {
	let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;

	if (key == "isnetpay") {
		let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p');

		if (pk_bankacc_p && pk_bankacc_p.value) {
			let isnetpaydata = {
				attrcode: 'isnetpay',
				userObj: pk_bankacc_p && pk_bankacc_p.value,
			}
			ajax({
				url: '/nccloud/sf/allocation/allocatebodybeforeevent.do',
				data: isnetpaydata,
				success: (res) => {
					if (res) {
						props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', res.data);
						return res.data;
					}
				}
			});
		}

	}
	if (key == "paytype") {
		let isnetpaydata = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'isnetpay');

		if (isnetpaydata && isnetpaydata.value) {

			props.cardTable.setEditableByIndex(card_table_id, i, 'paytype', true);

		} else {
			props.cardTable.setEditableByIndex(card_table_id, i, 'paytype', false);
		}

	}
	if (key == "issamebank") {
		let isnetpaydata = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'isnetpay');

		if (isnetpaydata && isnetpaydata.value) {

			props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', true);

		} else {
			props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', false);
		}

	}
	if (key == "issamecity") {
		let isnetpaydata = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'isnetpay');

		if (isnetpaydata && isnetpaydata.value) {

			props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', true);

		} else {
			props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', false);
		}

	}
	if (key == 'pk_accid_r') {
		let busitype = props.form.getFormItemsValue(card_from_id, 'busitype').value;
		if (busitype != '2') {
			props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid_r', false);
		}
	}
	//收款单位
	if(key=='pk_org_r') {
		let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
		//来源业务类型
		let srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
		let recmodul=props.form.getFormItemsValue(card_from_id,"recmodul");
		
		if(busitype&&busitype.value) {
			if(srcbusitype&&srcbusitype.value=='6') {
				props.cardTable.setEditableByIndex(card_table_id, i, 'pk_org_r', false);
			}else {
				if(recmodul&&recmodul.value=='FP') {
					props.cardTable.setEditableByIndex(card_table_id, i, 'pk_org_r', false);
				}else {
					return true;
				}
			}
		}else {
			toast({
				'color': 'warning',
				'content': loadMultiLang(this.props,'36320FA-000000')/* 国际化处理： 交易类型为空*/
			});
			return;
		}
		
	}
	//收款银行账户
	if(key=='pk_bankacc_r') {
		
		//来源业务类型
		let srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
		
		if(srcbusitype&&srcbusitype.value=='6') {
			props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
		}else {
			return true;
		}
		
	}

	if(key == "olcrate"){
		let pk_currency = props.form.getFormItemsValue(card_from_id,'pk_currtype');
		let pk_org = props.form.getFormItemsValue(card_from_id,'pk_org');

		let olcratedata = {
			pk_org:pk_org && pk_org.value,
			pk_currency:pk_currency && pk_currency.value,
			attrcode: 'olcrate'
		}

		ajax({
			url: '/nccloud/sf/allocation/allocatebodybeforeevent.do',
			data: olcratedata,
			success: (res) => {
				if (res) {
					props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', !res.data);
					// return res.data;
				}
			}
		});


	}

	return true;

} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/