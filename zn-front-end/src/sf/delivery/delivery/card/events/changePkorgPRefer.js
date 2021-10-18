/*HCHqz5al+e+jwfesCuGW3difc342/IPsVzRKvC8u9A75BphnJLLyDOeV5ScaFQ81*/
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

import {
	app_id, module_id, base_url, button_limit,oid,
	list_search_id, list_table_id, 
	card_page_id, card_from_id, card_fromtail_id,card_table_id,
	card_table_id_edit, card_table_id_browse
} from '../../cons/constant.js';
import  {beforeEvent}  from './index';

let { NCMessage } = base;

export default function changePkorgPRefer(props, busitype, pk_org_pWherePart) {
	let meta = props.meta.getMeta();
	let bodyMetaArr = meta[card_table_id].items;
	bodyMetaArr.forEach((val) => {
		let code = val.attrcode;
		if (code === 'pk_org_p') {
			// 中心上收
			if(busitype != 2){
				// 财务组织-资金管控
				val.refcode = 'uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef/index.js';
				val.queryCondition= () => {
					let pk_org_p_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if (pk_org_p_busitype && pk_org_p_busitype.value) {
						pk_org_p_busitype = pk_org_p_busitype.value;
					} else {
						pk_org_p_busitype = null;
					}

					let pk_org_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
					if (pk_org_p_pk_group && pk_org_p_pk_group.value) {
						pk_org_p_pk_group = pk_org_p_pk_group.value;
					} else {
						pk_org_p_pk_group = null;
					}

					// 取pk_org，用于自定义过滤
					let pk_org_p_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					if (pk_org_p_pk_org && pk_org_p_pk_org.value) {
						pk_org_p_pk_org = pk_org_p_pk_org.value;
					} else {
						pk_org_p_pk_org = null;
					}
					return {
						pk_org: pk_org_p_pk_org,
						busitype: pk_org_p_busitype,
						pk_group: pk_org_p_pk_group,
						pk_org_pWherePart: pk_org_pWherePart,
						isShowDisabledData: 'N',
						//自定义增加的过滤条件
						TreeRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DeliveryOrgRelationRefPayOrgFilter4NCC'
					};
				}
			}else{
				// 财务组织
				val.refcode = 'uapbd/refer/org/FinanceOrgTreeRef/index.js';
				val.isShowUnit = true;
				val.queryCondition= () => {
					let pk_org_p_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if (pk_org_p_busitype && pk_org_p_busitype.value) {
						pk_org_p_busitype = pk_org_p_busitype.value;
					} else {
						pk_org_p_busitype = null;
					}

					let pk_org_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
					if (pk_org_p_pk_group && pk_org_p_pk_group.value) {
						pk_org_p_pk_group = pk_org_p_pk_group.value;
					} else {
						pk_org_p_pk_group = null;
					}

					// 取pk_org，用于自定义过滤
					let pk_org_p_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					if (pk_org_p_pk_org && pk_org_p_pk_org.value) {
						pk_org_p_pk_org = pk_org_p_pk_org.value;
					} else {
						pk_org_p_pk_org = null;
					}
					return {
						pk_org: pk_org_p_pk_org,
						busitype: pk_org_p_busitype,
						// pk_group: pk_org_p_pk_group,
						pk_org_pWherePart: pk_org_pWherePart,
						isShowDisabledData: 'N',
						//自定义增加的过滤条件
						TreeRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DeliveryOrgRelationRefPayOrgFilter4NCC'
					};
				}
			}
			// 前三个参数，根据模板json填对应值，moduleId是区域id
			props.renderItem('table', card_table_id, 'pk_org_p', null) 
		}
	});
	let bodyEditMetaArr = meta[card_table_id_edit].items;
	bodyEditMetaArr.forEach((val) => {
		let code = val.attrcode;
		if (code === 'pk_org_p') {
			// 中心上收
			if(busitype != 2){
				// 财务组织-资金管控
				val.refcode = 'uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef/index.js';
				val.queryCondition= () => {
					let pk_org_p_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if (pk_org_p_busitype && pk_org_p_busitype.value) {
						pk_org_p_busitype = pk_org_p_busitype.value;
					} else {
						pk_org_p_busitype = null;
					}

					let pk_org_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
					if (pk_org_p_pk_group && pk_org_p_pk_group.value) {
						pk_org_p_pk_group = pk_org_p_pk_group.value;
					} else {
						pk_org_p_pk_group = null;
					}

					// 取pk_org，用于自定义过滤
					let pk_org_p_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					if (pk_org_p_pk_org && pk_org_p_pk_org.value) {
						pk_org_p_pk_org = pk_org_p_pk_org.value;
					} else {
						pk_org_p_pk_org = null;
					}
					return {
						pk_org: pk_org_p_pk_org,
						busitype: pk_org_p_busitype,
						pk_group: pk_org_p_pk_group,
						pk_org_pWherePart: pk_org_pWherePart,
						isShowDisabledData: 'N',
						//自定义增加的过滤条件
						TreeRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DeliveryOrgRelationRefPayOrgFilter4NCC'
					};
				}
			}else{
				// 财务组织
				val.refcode = 'uapbd/refer/org/FinanceOrgTreeRef/index.js';
				val.isShowUnit = true;
				val.queryCondition= () => {
					let pk_org_p_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if (pk_org_p_busitype && pk_org_p_busitype.value) {
						pk_org_p_busitype = pk_org_p_busitype.value;
					} else {
						pk_org_p_busitype = null;
					}

					let pk_org_p_pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
					if (pk_org_p_pk_group && pk_org_p_pk_group.value) {
						pk_org_p_pk_group = pk_org_p_pk_group.value;
					} else {
						pk_org_p_pk_group = null;
					}

					// 取pk_org，用于自定义过滤
					let pk_org_p_pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					if (pk_org_p_pk_org && pk_org_p_pk_org.value) {
						pk_org_p_pk_org = pk_org_p_pk_org.value;
					} else {
						pk_org_p_pk_org = null;
					}
					return {
						pk_org: pk_org_p_pk_org,
						busitype: pk_org_p_busitype,
						// pk_group: pk_org_p_pk_group,
						pk_org_pWherePart: pk_org_pWherePart,
						isShowDisabledData: 'N',
						//自定义增加的过滤条件
						TreeRefActionExt: 'nccloud.web.sf.delivery.delivery.filter.DeliveryOrgRelationRefPayOrgFilter4NCC'
					};
				}
			}
			// 前三个参数，根据模板json填对应值，moduleId是区域id
			props.renderItem('table', card_table_id_edit, 'pk_org_p', null) 
		}
	});
	
}

/*HCHqz5al+e+jwfesCuGW3difc342/IPsVzRKvC8u9A75BphnJLLyDOeV5ScaFQ81*/