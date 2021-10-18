/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';

let { NCMessage } = base;

// 财务组织
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
import FundManaSystemMemberByFinancePKTreeRef from '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';

import { app_id, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,
	card_fromtail_id,card_table_id 
} from '../../cons/constant.js';
import  {changePkorgPRefer}  from './index';

export default function beforeEvent(props, moduleId, key, value, i, record, status) {
	// 来源业务类型 1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成，    
	let srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
	//form中编辑后事件
	if (moduleId === card_from_id) {
		if(srcbusitype && srcbusitype.value){
			if(srcbusitype.value == 2){
				props.form.setFormItemsDisabled(card_from_id,
					{
						'busitype': true,
						'pk_currtype': true,
						'isreversebusitype': true,
						'memo': false,
					}
				);
			}else if(srcbusitype.value == 4){
				props.form.setFormItemsDisabled(card_from_id,
					{
						'busitype': true,
						'pk_currtype': true,
						'isreversebusitype': true,
						'memo': false,
					}
				);
			}else{
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
		}
	}
	//table中编辑后事件操作表格该行i
	if (moduleId === card_table_id) {
		if(srcbusitype && srcbusitype.value){
			// 手工录入
			if(srcbusitype.value == 1){
				let pk_org_p = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_org_p');
				if (key === 'pk_org_p') {
					let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					changePkorgPRefer(props, busitype && busitype.value, this.state.pk_org_pWherePart);
				}
				// 缴款单位银行账户
				else if (key === 'pk_bankacc_p') {
					if(pk_org_p && pk_org_p.value){
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
					}else{
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
						props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p', { value: null, display: null });
						return false;
					}
				}
				// 缴款单位内部账户
				else if (key === 'pk_accid') {
					if(pk_org_p && pk_org_p.value){
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
					}else{
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
						props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_accid', { value: null, display: null });
						return false;
					}
					let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if(busitype && busitype.value != 2){
						return false;
					}else{
						return true;
					}
				}
				else if(key === 'pay_type' || key === 'issamecity' || key === 'issamebank'){
					let isnetpay = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'isnetpay');
					// !(isnetpay && isnetpay.value)
					props.cardTable.setEditableByIndex(moduleId, i, key, (isnetpay && isnetpay.value));
				}
				else if(key === 'isnetpay'){
					let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p');
					if(pk_bankacc_p && pk_bankacc_p.value){
						let isnetpaydata = {
							attrcode: key,
							userObj: pk_bankacc_p && pk_bankacc_p.value,
						}
						ajax({
							url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
							data: isnetpaydata,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', res.data);
										// return res.data;
									}
								}
							}
						});
					}
				}
			}
			// 上收申请生成
			else if(srcbusitype.value == 2){
				let editaleFileds = [],uneditaleFileds = [];
				let meta = this.props.meta.getMeta();
				let bodyMetaArr = meta[card_table_id].items;
				bodyMetaArr.forEach((val) => {
					let code = val.attrcode;
					if (code === 'remark' ||
						code === 'pk_planitem_p' ||
						code === 'pk_balatype' ||

						code === 'pk_accid' ||
						code === 'pk_bankacc_r' ||
						code === 'isnetpay'
					) {
						editaleFileds.push(code);
					}else{
						uneditaleFileds.push(code);
					}
				});
				// 设置某一列的编辑性 true为不可编辑(默认true)
				props.cardTable.setColEditableByKey(card_table_id, editaleFileds, false);
				props.cardTable.setColEditableByKey(card_table_id, uneditaleFileds, true);
				props.cardTable.setColEditableByKey(card_table_id, 
					['pk_org_p', 'pk_bankacc_p '], true);
			}
			// 上收申请生成，到账通知生成
			else if(srcbusitype.value == 4){
				let editaleFileds = [],uneditaleFileds = [];
				let meta = this.props.meta.getMeta();
				let bodyMetaArr = meta[card_table_id].items;
				bodyMetaArr.forEach((val) => {
					let code = val.attrcode;
					if (code === 'remark' ||
						code === 'pk_planitem_p' ||
						code === 'pk_balatype'
					) {
						editaleFileds.push(code);
					}else{
						uneditaleFileds.push(code);
					}
				});
				// 设置某一列的编辑性 true为不可编辑(默认true)
				props.cardTable.setColEditableByKey(card_table_id, editaleFileds, false);
				props.cardTable.setColEditableByKey(card_table_id, uneditaleFileds, true);
			}else{
				
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