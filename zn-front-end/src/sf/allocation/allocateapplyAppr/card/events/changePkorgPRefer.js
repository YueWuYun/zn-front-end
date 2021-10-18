/*HCHqz5al+e+jwfesCuGW3difc342/IPsVzRKvC8u9A75BphnJLLyDOeV5ScaFQ81*/
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

import {
	app_id, module_id, base_url, oid,
	list_search_id, list_table_id,
	card_page_id, card_from_id, card_table_id
} from '../../cons/constant.js';
import { beforeEvent } from './index';

let { NCMessage } = base;

export default function changePkorgPRefer(props, busitype, pk_org_pWherePart) {
	let meta = props.meta.getMeta();
	let bodyMetaArr = meta[card_from_id].items;

	bodyMetaArr.forEach((val) => {
		let code = val.attrcode;
		if (code === 'pk_payorg') {
			// 集团下拨
			if (busitype === '1') {
				//参照变为 财务组织-资金管控
				val.refcode = 'uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef/index.js';
				val.isShowUnit = true;
				val.queryCondition = () => {

					let pk_currtype = (props.form.getFormItemsValue(card_from_id, 'pk_currtype') || {}).value;
					let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
					let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
					return {
						"busitype": busitype,//用以区分按那种参照过滤
						"pk_org": pk_org,
						"pk_group": pk_group,
						TreeRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgForBusitypeFilter'
					};
				}
			} else if (busitype === '2') {//中心下拨
				// 财务组织
				val.refcode = 'uapbd/refer/org/FundOrgTreeRef/index.js';
				val.queryCondition = () => {
					let pk_currtype = (props.form.getFormItemsValue(card_from_id, 'pk_currtype') || {}).value;
					let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
					let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
					return {
						"busitype": busitype,//用以区分按那种参照过滤
						"pk_org": pk_org,
						"pk_group": pk_group,
						TreeRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgForBusitypeFilter'
					};
				}
			} else if (busitype === '3') {//全局下拨
				//参照变为 财务组织-资金管控
				val.refcode = 'uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef/index.js';
				val.queryCondition = () => {
					let pk_currtype = (props.form.getFormItemsValue(card_from_id, 'pk_currtype') || {}).value;
					let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
					let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
					return {
						"busitype": busitype,//用以区分按那种参照过滤
						"pk_org": pk_org,
						"pk_group": pk_group,
						TreeRefActionExt: 'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyPayOrgForBusitypeFilter'
					};
				}
			}
			// 前三个参数，根据模板json填对应值，moduleId是区域id
			props.renderItem('form', card_from_id, 'pk_payorg', null)
		}
	});

}

/*HCHqz5al+e+jwfesCuGW3difc342/IPsVzRKvC8u9A75BphnJLLyDOeV5ScaFQ81*/