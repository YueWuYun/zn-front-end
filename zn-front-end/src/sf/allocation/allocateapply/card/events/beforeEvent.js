/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
import { changePkorgPRefer } from './index';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default async function bodyBeforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value
	switch (key) {
		//收款客商银行账户
		case "pk_custbankacc":
			//当没有选择收款客商时 弹出提示
			if (props.cardTable.getChangedRows(this.tableId)[0].values.pk_company_r.value == "") {
				toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000007') });/* 国际化处理： 请先选择收款客商。*/
				return false;
			} else {
				props.cardTable.setEditableByIndex(card_table_id, index, 'pk_custbankacc', true);
			}
			return true;
			break;

		//下拨组织根据交易类型 切换参照
		// 		case "pk_payorg":
		// 			let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
		//			changePkorgPRefer(props, busitype && busitype.value);
		// 			return true;
		// 			break;
		//汇款速度	
		case "pay_type":
			//当勾选网银支付后 汇款速度可编辑
			let isnetpay = record.values.isnetpay.value;
			if (isnetpay) {
				props.cardTable.setEditableByIndex(card_table_id, index, 'pay_type', true);
				return true;
			} else
				return false;
			break;
		//内部账户 当不为中心下拨时 不可编辑
		case "pk_accid":
			let busitype = props.form.getFormItemsValue(card_from_id, 'busitype').value
			if (busitype == '2') {
				return true;
			} else {
				return false;
			}
			break;
		//当本币汇率为1时 不可编辑
		case "applyolcrate":
			let applyolcrate = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applyolcrate') &&
				props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applyolcrate').value;
			if (applyolcrate == 1) {
				return false;
			} else
				return true;
			break;
		//集团本币汇率	
		case "applyglcrate":
			let applyglcrate = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applyglcrate') &&
				props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applyglcrate').value;
			if (applyglcrate == 1) {
				return false;
			} else
				return true;
			break;
		//全局本币汇率	
		case "applygllcrate":
			let applygllcrate = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applygllcrate') &&
				props.cardTable.getValByKeyAndIndex(card_table_id, index, 'applygllcrate').value;
			if (applygllcrate == 1) {
				return false;
			} else
				return true;
			break;							
		//申请下拨金额 当没有输入币种时 不能编辑
		case "applyamount":
			let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype').value;
			if (pk_currtype == "") {
				toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000071') });/* 国际化处理： 请先选择币种。*/
				return false;
			} else
				return true;
			break;
		//是否网银支付
		case "isnetpay":
			let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(card_table_id, index, 'pk_bankacc_p');
			if (pk_bankacc_p && pk_bankacc_p.value) {
				let isnetpaydata = {
					attrcode: key,
					userObj: pk_bankacc_p && pk_bankacc_p.value,
				}
				return new Promise((resolve) => {
					ajax({
						url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
						data: isnetpaydata, 
						success: (res) => {
							if (res.success) {
								resolve(res.data)
								//这样修改编辑性,如果改成不可编辑的时候，便不会再出发编辑前事件了，故需要在上缴银行账户的编辑后事件中，再将其设为可编辑的
								// props.cardTable.setEditableByIndex(card_table_id, index, 'isnetpay', res.data);
								// props.cardTable.setModelEdit(card_table_id,'isnetpay', res.data);
								
							}
						}
					});
				})
				
			}
			return true;
			break;
		default:
			return true;
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/