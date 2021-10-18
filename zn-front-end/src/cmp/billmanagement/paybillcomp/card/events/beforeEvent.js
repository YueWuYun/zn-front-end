/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';
import { ObjectTypeHandle, NoteTypeHandle, RateHandle, handleTableRateEdit} from '../../util/ReferChangeEvent';
import { BodyBeforeEvent, FormBeforeEvent } from '../../util/TableRefFilter';
import { RetailHandle } from '../../util/RetailHandle';
import { PAYBILL_CONST } from '../../cons/constant.js';
export default function beforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org');
	if (moduleId == PAYBILL_CONST.card_from_id) {
		switch (key) {
			case 'objecttype': //收款财务组织
				this.cmp49Handle.call(this, props, pk_org && pk_org.value, moduleId);
				return true;
				break;
			case 'note_no': //票据号
			    let noteType = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'note_type');
				if (noteType && noteType.value) {
					ajax({
						url: '/nccloud/cmp/pub/noteTypeHandler.do',
						data: { pk: noteType.value },
						success: function(res) {
							NoteTypeHandle.call(this, props, moduleId, res.data.note_type, index);
						}
					});
				}
				return true;
				break;


			 default:
			  FormBeforeEvent.call(this,props, moduleId, key);
				return true; //默认单元格都可操作
				break;
		}
	}
	if (moduleId == PAYBILL_CONST.card_table_id) {
		switch (key) {
	
			case 'note_no': //票据号
				let noteType = record.values.note_type;
				if (noteType && noteType.value) {
					ajax({
						url: '/nccloud/cmp/pub/noteTypeHandler.do',
						data: { pk: noteType.value },
						success: function(res) {
							NoteTypeHandle.call(this, props, moduleId, res.data.note_type, index);
						}
					});
				}
				return true;
				break;

			// case 'accounttype':
			// 	RetailHandle(props, index, record);
			// 	return true;
			// 	break;
			// case 'accountopenbank':
			// 	RetailHandle(props, index, record);
			// 	return true;
			// 	break;
			// case 'accountname':
			// 	RetailHandle(props, index, record);
			// 	return true;
			// 	break;
			// case 'local_rate': //收款财务组织
			// 	RateHandle(props, moduleId, index, record);
			// 	return true;
			// 	break;
			// //增加散户
			// case 'objecttype': //收款财务组织
			// 	this.cmp49Handle.call(this, props, pk_org && pk_org.value, moduleId);
			// 	return true;
			// 	break;
			default:
			BodyBeforeEvent.call(this,props, moduleId, key, value, index, record);
			handleTableRateEdit.call(this,key,record,index);
			return true; //默认单元格都可操作
			 break;
		}
	}
	return true;
}

/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/