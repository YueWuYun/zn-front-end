/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import {
	ajax,
	toast
} from 'nc-lightapp-front';
import {
	ObjectTypeHandle,
	NoteTypeHandle,
	RateHandle,
	handleTableRateEdit
} from '../../util/ReferChangeEvent';
import {
	BodyBeforeEvent,
	FormBeforeEvent
} from '../../util/TableRefFilter';
import {
	RetailHandle,
} from '../../util/RetailHandle';
import {
	PAYBILL_CONST
} from '../../cons/constant.js';
import {
	saveMultiLangRes,
	loadMultiLang
} from '../../../../../tmpub/pub/util';
export default function beforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(PAYBILL_CONST.card_from_id, 'pk_org');
	let TradeType = this.props.form.getFormItemsValue('head', 'trade_type');

	if (moduleId == PAYBILL_CONST.card_from_id) {
		switch (key) {
			case 'objecttype': //收款财务组织
				this.cmp49Handle.call(this, props, pk_org && pk_org.value, moduleId);
				return true;
				break;
			default:
				FormBeforeEvent.call(this, props, moduleId, key);
				return true; //默认单元格都可操作
				break;
		}
	}
	if (moduleId == PAYBILL_CONST.card_table_id) {


		switch (key) {
			case 'pk_account': //收款财务组织
				let objectType = record.values.objecttype;
				if (!objectType || !objectType.value) {
					return true;
				}
				ObjectTypeHandle(props, moduleId, objectType.value, index);
				BodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
				return true;
			case 'note_no': //票据号
				let noteType = record.values.note_type;
				if (noteType && noteType.value) {
					ajax({
						url: '/nccloud/cmp/pub/noteTypeHandler.do',
						data: {
							pk: noteType.value
						},
						success: function (res) {
							NoteTypeHandle.call(this, props, moduleId, res.data, index);
						}
					});
				}
				BodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
				return true;
				break;

			case 'accounttype':
				RetailHandle(props, index, record);
				return true;
				break;
			case 'accountopenbank':
				RetailHandle(props, index, record);
				return true;
				break;
			case 'accountname':
				RetailHandle(props, index, record);
				return true;
				break;
				//增加散户
			case 'objecttype': //收款财务组织
				this.cmp49Handle.call(this, props, pk_org && pk_org.value, moduleId);
				return true;
				break;
				//增加
			case 'direct_ecds': //收款财务组织
				let noType = record.values.note_type;
				if (noType && noType.value) {
					ajax({
						url: '/nccloud/cmp/pub/noteTypeHandler.do',
						data: {
							billTypeCode: TradeType && TradeType.value,
							directEcds: true,
							pk: noType.value
						},
						success:  (res)=> {
							let noteTypeData = res.data;
							if (noteTypeData.auto) {
								toast({
									color: 'warning',
									content: loadMultiLang(props, '36070PBR-000121') /* 国际化处理： 请先填写财务组织！*/
								});

								props.cardTable.setColValue(PAYBILL_CONST.card_table_id, 'direct_ecds', {
									display: null,
									value: null
								});
							}
							//控制直连电票字段显示问题
							if (noteTypeData.etcs) {
								props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds', true);
								return true; //默认单元格都可操作
							} else {
								props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, index, 'direct_ecds', false);
								return false; //默认单元格都可操作
							}

						}
					});

				}
				break;
			default:
				BodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
				handleTableRateEdit.call(this, key, record, index);
				return true; //默认单元格都可操作
				break;
		}
	}
	return true;
}
/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/