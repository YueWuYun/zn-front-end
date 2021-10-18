/*mgBVjmwkvoNAq04L4PpN6adEmQ1jGJw+Isxyw2DckRLiT7WANAnp/FD9dlBupBy5*/
import { ajax, toast } from 'nc-lightapp-front';
//引入常量定义
import { card_from_id, card_table_id ,base_url} from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function beforeEvent(props, moduleId, key, value, i, record, status) {
	
	if(key == "olcrate"){
		let pk_currency = props.form.getFormItemsValue(card_from_id,'pk_currtype');
		let pk_org = props.form.getFormItemsValue(card_from_id,'pk_org');

		let olcratedata = {
			pk_org:pk_org && pk_org.value,
			pk_currency:pk_currency && pk_currency.value,
			attrcode: 'olcrate'
		}

		ajax({
			url: base_url+'spepaycardbeforeedit.do',
			data: olcratedata,
			async: false,
			success: (res) => {
				if (res) {					
					props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', !res.data);
				}
			}
		});


	}

	return true;

} 

/*mgBVjmwkvoNAq04L4PpN6adEmQ1jGJw+Isxyw2DckRLiT7WANAnp/FD9dlBupBy5*/