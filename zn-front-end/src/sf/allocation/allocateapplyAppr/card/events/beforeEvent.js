/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { ajax, toast } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id } from '../../cons/constant.js';
import  {changePkorgPRefer}  from './index';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
export default function bodyBeforeEvent(props, moduleId, key, value, index, record) {
	let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value
	switch (key) {
		//收款客商银行账户
		case "pk_custbankacc":
			//当没有选择收款客商时 弹出提示
			if (props.cardTable.getChangedRows(this.tableId)[0].values.pk_company_r.value == "") {
				toast({ color: 'warning', content: loadMultiLang(props,'36320AAA-000007') });/* 国际化处理： 请先选择收款客商。*/
				return false;
			}
			return true;
			break;

		//下拨组织根据交易类型 切换参照
// 		case "pk_payorg":
// 			let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
//			changePkorgPRefer(props, busitype && busitype.value);
// 			return true;
// 			break;

		default:
			return true
			break;
	}
} 

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/