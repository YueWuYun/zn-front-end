/*mgBVjmwkvoNAq04L4PpN6aTM1JS073VMevkaTq+1O/6ZELU0NUSLH3K7cj9W3o1r*/
import { createPage, ajax, base, toast  } from 'nc-lightapp-front';

let { NCMessage } = base;

// 财务组织
import FinanceOrgTreeRef from '../../../../../uapbd/refer/org/FinanceOrgTreeRef';
import FundManaSystemMemberByFinancePKTreeRef from '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';

import { app_id, module_id, base_url, list_search_id,
	list_table_id, button_limit, 
	oid,card_page_id,card_from_id,
	card_fromtail_id,card_table_id,
	card_table_id_edit, card_table_id_browse 
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
				if(key === 'isreversebusitype'){
					return false;
				}
			}else if(srcbusitype.value == 4){
				props.form.setFormItemsDisabled(card_from_id,
					{
						'busitype': true,
						'pk_currtype': true,
						'isreversebusitype': true,
						'memo': false,
					}
				);
				if(key === 'isreversebusitype'){
					return false;
				}
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
	if (moduleId === card_table_id || moduleId === card_table_id_edit) {
		if(srcbusitype && srcbusitype.value){
			// 手工录入
			if(srcbusitype.value == 1){
				let pk_org_p = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_org_p');
				if (key === 'pk_org_p') {
					let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if(busitype && busitype.value){
						changePkorgPRefer(props, busitype && busitype.value, this.state.pk_org_pWherePart);
						return true;
					}else{
						/* 国际化处理： 请先录入交易类型！*/
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
						 && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000098') });
						return false;
					}
				}
				// 缴款单位银行账户
				else if (key === 'pk_bankacc_p') {
					if(pk_org_p && pk_org_p.value){
						this.props.cardTable.setEditableByIndex(moduleId, i, 'pk_bankacc_p', true);
					}else{
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
						props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_bankacc_p', { value: null, display: null });
						return false;
					}
				}
				// 缴款单位内部账户
				else if (key === 'pk_accid') {
					if(pk_org_p && pk_org_p.value){
						this.props.cardTable.setEditableByIndex(moduleId, i, 'pk_accid', true);
					}else{
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000004') });/* 国际化处理： 请先录入缴款单位！*/
						props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_accid', { value: null, display: null });
						return false;
					}
					let busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
					if(busitype && busitype.value != 2){
						return false;
					}else{
						return true;
					}
				}
				// 汇款速度 同城标志 同行标志
				else if(key === 'pay_type' || key === 'issamecity' || key === 'issamebank'){
					let isnetpay = props.cardTable.getValByKeyAndIndex(moduleId, i, 'isnetpay');
					// !(isnetpay && isnetpay.value)
					props.cardTable.setEditableByIndex(moduleId, i, key, (isnetpay && isnetpay.value));
				}
				// 网银上收
				else if(key === 'isnetpay'){
					let isreversebusitype = props.form.getFormItemsValue(card_from_id, 'isreversebusitype');
					if(isreversebusitype && isreversebusitype.value){
						props.cardTable.setEditableByIndex(moduleId, i, 'isnetpay', true);
					}else{
						let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_bankacc_p');
						if(pk_bankacc_p && pk_bankacc_p.value){
							let isnetpaydata = {
								attrcode: key,
								userObj: pk_bankacc_p && pk_bankacc_p.value,
							}
							ajax({
								url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
								data: isnetpaydata,
								async: false,
								success: (res) => {
									if (res.success) {
										// true为可编辑
										props.cardTable.setEditableByIndex(moduleId, i, 'isnetpay', res.data);
										// return res.data;
									}
								}
							});
						}
					}
				}
				// 金额
				else if (key === 'amount') {
					let pk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
					if(pk_currtype && pk_currtype.value){
						
					}else{
						/* 国际化处理： 请先选择币种！*/
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
						 && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000116') });
						return false;
					}
				}
				// 本币汇率
				else if (key === 'olcrate') {
					let olcratepk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					let olcratepk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
					if(olcratepk_org && olcratepk_org.value){
						let olcratdata = {
							attrcode: key,
							userObj: olcratepk_org && olcratepk_org.value,
							userObj1: olcratepk_currtype && olcratepk_currtype.value,
						}
						ajax({
							url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
							data: olcratdata,
							async: false,
							success: (res) => {
								if (res.success) {
									props.cardTable.setEditableByIndex(moduleId, i, 'olcrate', !res.data);
									// return !res.data;
								}
							}
						});
					}
				}
			}
			// 上收申请生成
			else if(srcbusitype.value == 2){
				let editaleFileds = [],uneditaleFileds = [];
				let isnetpay = props.cardTable.getValByKeyAndIndex(moduleId, i, 'isnetpay');
				if (key === 'olcrate') {
					let olcratepk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
					let olcratepk_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
					if(olcratepk_org && olcratepk_org.value){
						let olcratdata = {
							attrcode: key,
							userObj: olcratepk_org && olcratepk_org.value,
							userObj1: olcratepk_currtype && olcratepk_currtype.value,
						}
						ajax({
							url: '/nccloud/sf/delivery/deliverybodybeforeevent.do',
							data: olcratdata,
							async: false,
							success: (res) => {
								if (res.success) {
									props.cardTable.setEditableByIndex(moduleId, i, 'olcrate', !res.data);
								}
							}
						});
					}
				}else if(key === 'pay_type' || key === 'issamecity' || key === 'issamebank'){
					props.cardTable.setEditableByIndex(moduleId, i, key, (isnetpay && isnetpay.value));
				}else{
					let meta = this.props.meta.getMeta();
					let bodyMetaArr = meta[moduleId].items;
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
							// if(isnetpay && isnetpay.value){
							// 	editaleFileds.push(code);
							// }else{
							// 	uneditaleFileds.push(code);
							// 	editaleFileds.pop(code);
							// }
						}else{
							uneditaleFileds.push(code);
						}
					});
					if(editaleFileds.includes(key)){
						return true;
					}else{
						return false;
					}
				}
			}
			// 到账通知生成
			else if(srcbusitype.value == 4){
				let editaleFileds = [],uneditaleFileds = [];
				let meta = this.props.meta.getMeta();
				let bodyMetaArr = meta[moduleId].items;
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
				// props.cardTable.setColEditableByKey(moduleId, uneditaleFileds, true);
				// props.cardTable.setColEditableByKey(moduleId, editaleFileds, false);
				if(editaleFileds.includes(key)){
					return true;
				}else{
					return false;
				}
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