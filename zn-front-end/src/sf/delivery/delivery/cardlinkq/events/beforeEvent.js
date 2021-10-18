/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';

let { NCMessage } = base;

import { app_id, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,link_card_page_id,
	card_fromtail_id,card_table_id } from '../../cons/constant.js';

export default function beforeEvent(props, moduleId, key, value, i, record, status) {
	let table_id = card_table_id;
	let form_id = card_from_id;
	let page_id = link_card_page_id;

	//form中编辑后事件
	if (moduleId === form_id) {
		//组织变换编辑后事件
		if (key === 'pk_org') {
		}
		//币种
		if (key === 'pk_currtype') {
		}
		// 交易类型
		if (key === 'busitype') {
		}
		// 冲销业务
		if (key === 'isreversebusitype') {
		}
	}
	//table中编辑后事件操作表格该行i
	if (moduleId === table_id) {
		//表体table行数
		let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
		// 缴款单位银行账户
		if (key === 'pk_bankacc_p') {
			if(pk_bankacc_p && pk_bankacc_p.value){

			}else{
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
				return false;
			}
		}
		// 缴款单位内部账户
		if (key === 'pk_accid') {
			if(pk_bankacc_p && pk_bankacc_p.value){

			}else{
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
				return false;
			}
		}
	}
	// true编辑态，为false浏览态
	if (this.props.getUrlParam('status') === 'browse') {
		return false;
	}else{
		return true;
	}

}

/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/