/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast } from 'nc-lightapp-front';

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import { judgeCurrtype,judgeTableCurrtype,judgeTableRate,judgeFormRate } from './judgeCurrtype';
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	// export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	// 		console.log(props, moduleId, key,value, changedrows, i, s, g)

	if (key === 'pk_org') {
		//获取编辑后表单的值
		let eventdata = props.createHeadAfterEventData(
			'36070PBR_D5_card',
			'head',
			'paybilldetail_table',
			moduleId,
			key,
			value
		);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		if (oldvalue == null) {
			ajax({
				url: '/nccloud/cmp/paybills/orgchange.do',
				data: eventdata,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}

							if (res.data.body) {
								props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
			if (value.value) {
				props.resMetaAfterPkorgEdit();
			}
		}
		if (oldvalue != newvalue && oldvalue != null) {
			this.props.modal.show('addNode');
		}
	}

	if (key === 'pay_primal') {
		let local_rate = props.cardTable.getValByKeyAndIndex(moduleId, i, 'local_rate').value;
		let pay_primal = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pay_primal').value;
		if (local_rate && pay_primal) {
			let pay_local = local_rate * pay_primal;
			//付款组织本币金额赋值
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', { value: pay_local, display: pay_local });
		}
	}

	if (key === 'dbilldate') {
		//表头编辑后事件
		let data = props.createHeadAfterEventData('20521030', this.formId, this.tableId, moduleId, key, value);
		ajax({
			url: '/nccloud/reva/revebill/afteredit.do',
			data: data,
			success: (res) => {
				if (res.data && res.data.head && res.data.head.head) {
					let dealmny = res.data.head.head.rows[0].values.ndealtotalmny;
					props.form.setFormItemsValue(moduleId, { ndealtotalmny: dealmny });
				}
			}
		});
	}
	if (key == 'objecttype') {
		if (moduleId === 'head') {
			let objecttypeData = props.createHeadAfterEventData(
				'36070PBR_D5_card',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				value
			);

			let objecttype_newvalue = objecttypeData.newvalue.value;
			let objecttype_oldvalue = objecttypeData.oldvalue.value;

			if (!value.value) {
				props.form.setFormItemsValue(moduleId, { pk_account: { value: null, display: null } });
			}
			if (objecttype_newvalue != objecttype_oldvalue) {
				props.form.setFormItemsValue(moduleId, { pk_account: { value: null, display: null } });
			}
		}
		if (moduleId === 'paybilldetail_table') {
			let obj_body_data = props.createBodyAfterEventData(
				'36070PBR_D5_card',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				changedrows
			);

			let obj_body_newvalue = obj_body_data.changedrows[0].newvalue.value;
			let obj_body_oldvalue = obj_body_data.changedrows[0].oldvalue.value;

			if (!value.value) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accounttype', { value: null, display: null });
			}
			if (obj_body_newvalue != obj_body_oldvalue) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accounttype', { value: null, display: null });
			}
		}

		//  let meta = props.meta.getMeta();
		//  let item = meta['head'].items.find(e=>e.attrcode==='pk_customer')
		//  if (value.value == '0') {
		// 	 		//props.renderItem('form', 'head', 'pk_customer', null)
		// 	  item.visible=true;
		//  	}
		// 	let item = meta['head'].items.find(e=>e.attrcode==='pk_account')
		// 	//人员
		// 	if (value.value == '3') {
		// 		props.renderItem('form', 'head', 'pk_account', null)
		// 		item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js'
		// 	}
		// 	// 客户
		// 	if (value.value == '0') {
		// 		props.renderItem('form', 'head', 'pk_account', null)
		// 		item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js'
		// 	}
		// 		// 部门
		// 		if (value.value == '2') {
		// 			props.renderItem('form', 'head', 'pk_account', null)
		// 			item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js'
		// 		}
		// 			// 散户
		// 		if (value.value == '4') {
		// 				props.renderItem('form', 'head', 'pk_account', null)
		// 				item.refcode = 'uapbd/refer/pubinfo/PsnbankaccGridRef/index.js'
		// 		}
		// 			// 供应商
		// 			if (value.value == '1') {
		// 				props.renderItem('form', 'head', 'pk_account', null)
		// 				item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js'
		// 		}
		//props.meta.setMeta(meta)
	}

	if (key === 'cmaterialvid') {
		let materialsNew = value;
		if (materialsNew && materialsNew.length > 1) {
			props.editTable.setValByKeyAndRowNumber(
				moduleId,
				i + 1,
				key,
				materialsNew[0].refpk,
				materialsNew[0].refname
			);
			for (let i = 1; i < materialsNew.length; i++) {
				props.editTable.addRow(moduleId);
				let ll = props.editTable.getNumberOfRows(moduleId);
				props.editTable.setValByKeyAndRowNumber(
					moduleId,
					ll,
					key,
					materialsNew[i].refpk,
					materialsNew[i].refname
				);
			}
		}
	}

	//表体编辑后事件
	if (key == 'fconfirmpoint') {
		let data = props.createBodyAfterEventData('20521030', this.formId, this.tableId, moduleId, key, changedrows);
		ajax({
			url: '/nccloud/reva/revebill/cardafteredit.do',
			data: data,
			success: (res) => {
				if (res.data && res.data.body && res.data.body[this.tableId]) {
					let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
					props.editTable.setValByKeyAndRowNumber(moduleId, i + 1, 'npobnum', npobnum.value);
				}
			}
		});
	}

	//表头和表体联动
	if (
		key === 'pk_balatype' ||
		key === 'objecttype' ||
		key === 'pk_dept' ||
		key === 'pk_supplier' ||
		key === 'pk_oppaccount' ||
		key === 'pk_account' ||
		key === 'pk_customer' ||
		key === 'pk_busiman' ||
		key === 'bill_date' ||
		key === 'pk_dept' 
	) {
		let currencyFormVal = '';
		let currencyFormDly = '';
		let body_acc_data = value;
		//表头
		if (props.form.getFormItemsValue('head', key)) {
			currencyFormVal = props.form.getFormItemsValue('head', key).value;
			currencyFormDly = props.form.getFormItemsValue('head', key).display;
		}

		//表体
		if (moduleId === 'head') {
			if (key === 'pk_balatype') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_balatype', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_account') {
				
				if (value.value) {
					
					props.form.setFormItemsValue(moduleId, {
						pk_account: {
							value: i.refpk,
							display: i.refcode
						}
					});
					props.form.setFormItemsValue(moduleId, {
						pk_accountname: {
							value: i.refname,
							display: i.refname
						}
					});
					props.form.setFormItemsValue(moduleId, {
						accountcode: {
							value: i.refcode
						}
					});
					if( i.values&&i.values.bankdoc_name){
						// props.form.setFormItemsValue(moduleId, {
						// 	accountopenbank: {
						// 		value: i.values.bankdoc_name && i.values.bankdoc_name.value
						// 	}
						// });
						props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
							value: i.values.bankdoc_name && i.values.bankdoc_name.value
						});
					}
					if(i.values&&i.values.bankdocname){
						// props.form.setFormItemsValue(moduleId, {
						// 	accountopenbank: {
						// 		value: i.values.bankdocname && i.values.bankdocname.value
						// 	}
						// });
						props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
							value: i.values.bankdocname && i.values.bankdocname.value
						});
					};
					
					props.cardTable.setColValue('paybilldetail_table', 'accountname', { value: i.refname });
					props.cardTable.setColValue('paybilldetail_table', 'accountcode', { value: i.refcode });
					props.cardTable.setColValue('paybilldetail_table', 'pk_account', {
						display: currencyFormDly,
						value: currencyFormVal
					});
					 if(!i.refcode){
						props.form.setFormItemsValue(moduleId, {
							pk_account: {
								value: value.value,
								display: value.value
							}
						});
						props.cardTable.setColValue('paybilldetail_table', 'accountname', { value: value.value });
						props.cardTable.setColValue('paybilldetail_table', 'accountcode', { value: value.value });
						// props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
						// 	value: null
						// });
					   
					}
					
				} else {
					props.cardTable.setColValue('paybilldetail_table', 'accountname', { value: null });
					props.cardTable.setColValue('paybilldetail_table', 'accountcode', { value: null });
					props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
						value: null
					});
				}
			} else if (key === 'objecttype') {
				props.cardTable.setColValue('paybilldetail_table', 'objecttype', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_oppaccount') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_oppaccount', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_customer') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_customer', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_supplier') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_supplier', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_busiman') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_busiman', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}else if (key === 'pk_dept') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_dept', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}else if (key === 'bill_date') {
				props.cardTable.setColValue('paybilldetail_table', 'bill_date', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}
		}
		if (moduleId === 'paybilldetail_table') {
			if (key === 'pk_account') {
				let cur_body_pk_account = props.createBodyAfterEventData(
					PAYBILL_CONST.card_page_id,
					PAYBILL_CONST.card_from_id,
					PAYBILL_CONST.card_table_id,
					moduleId,
					key,
					changedrows,
					i
				);
				let new_table_account = cur_body_pk_account.changedrows[0].newvalue.value;
				let old_table_account = cur_body_pk_account.changedrows[0].oldvalue.value;
				if (new_table_account) {
					if (new_table_account != old_table_account) {
						if (body_acc_data) {
							props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', {
								value: body_acc_data.refpk,
								display: body_acc_data.refcode
							});
							props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {
								value: body_acc_data.refname,
								display: body_acc_data.refname
							});
							if(body_acc_data.values){
								if(body_acc_data.values.bankdoc_name){
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value:body_acc_data.values.bankdoc_name&&body_acc_data.values.bankdoc_name.value
									});
								};
								if(body_acc_data.values.bankdocname){
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value: body_acc_data.values.bankdocname&&body_acc_data.values.bankdocname.value
									});
								};
							}
							if(body_acc_data.refcode){
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
									   value: body_acc_data&&body_acc_data.refcode
								   });
							 } else{
								  props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
									   value: body_acc_data
								 });	
							   }
							
						
					
						}
					}
				} else {
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', {
						value: null,
						display: null
					});
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {
						value: null,
						display: null
					});
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
						value: null
					});
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
						value: null
					});
				}
			}
		}
	}
	if (key === 'bill_date') {
		let BillData = props.createHeadAfterEventData(
			PAYBILL_CONST.card_page_id,
			PAYBILL_CONST.card_from_id,
			PAYBILL_CONST.card_table_id,
			moduleId,
			key,
			value
		);
		//获取页面信息
		let billDate = props.form.getFormItemsValue(moduleId, 'bill_date');
		if (billDate) {
			ajax({
				url: '/nccloud/cmp/paybills/headcurrtypeafter.do',
				data: BillData,
				success: (res) => {
					if (res.success) {
						let {data} = res;
						if (data.CARD.head) {
							this.props.form.setAllFormValue({
								[this.formId]: data.CARD.head[this.formId]
							});
							//币种关联本币汇率字段编辑性
							judgeFormRate.call(this, data.CARD.userjson, this.formId);
						}

						if (data.CARD.body) {
							this.props.cardTable.setTableData(this.tableId, data.CARD.body[this.tableId]);
							// judgeTableRate.call(
							// 	this, data.CARD.userjson, PAYBILL_CONST.card_table_id);
						}

					}
				}
			});
		} else {
			props.form.setFormItemsDisabled(moduleId, {
				local_rate: false
			});
			props.form.setFormItemsValue(moduleId, {
				local_rate: {
					value: null
				}
			});
		}
	}
	if (key === 'pk_currtype') {
		if (moduleId === 'head') {
			let cur_data = props.createHeadAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
				moduleId,
				key,
				value
			);

			//获取页面信息

			let form_org = props.form.getFormItemsValue(moduleId, 'pk_org');
			let form_pk_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype');
			if (form_pk_currtype && form_pk_currtype.value) {
				props.form.setFormItemsDisabled(PAYBILL_CONST.card_from_id, { local_rate: false });
				ajax({
					url: '/nccloud/cmp/paybills/headcurrtypeafter.do',
					data: cur_data,
					success: (res) => {
						if (res.success) {
							let { data } = res;
							if (data.CARD.head) {
								this.props.form.setAllFormValue({ [this.formId]: data.CARD.head[this.formId] });
								//币种关联本币汇率字段编辑性
								judgeFormRate.call(this,data.CARD.userjson,this.formId);
							}
							if (data.CARD.body) {
								this.props.cardTable.setTableData(this.tableId, data.CARD.body[this.tableId]);
								// judgeTableRate.call(
								// 	this, data.CARD.userjson, PAYBILL_CONST.card_table_id);
							}
							
						}
					}
				});
			} else {
				props.form.setFormItemsDisabled(moduleId, { local_rate: false });
				props.form.setFormItemsValue(moduleId, {
					local_rate: {
						value: null
					}
				});
			}
		}
		if (moduleId === 'paybilldetail_table') {
			let table_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
			let table_currtype = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype');
			if (table_currtype && table_currtype.display && table_currtype.value) {
				let cur_body_data = buildLightBodyAfterEditData(
					props,
					PAYBILL_CONST.card_page_id,
					PAYBILL_CONST.card_from_id,
					PAYBILL_CONST.card_table_id,
					key,
					changedrows,
					i,
					true
				);
				let new_body_currtype = cur_body_data.changedrows[0].newvalue.value;
				let old_body_currtype = cur_body_data.changedrows[0].oldvalue.value;
				if (new_body_currtype != old_body_currtype) {
					props.cardTable.setEditableByIndex(PAYBILL_CONST.card_table_id, i, 'local_rate', true);
					ajax({
						url: '/nccloud/cmp/paybills/bodycurrtypeafter.do',
						data: cur_body_data,
						success: (res) => {
							if (res.success) {
								//给表体币种字段赋值
								let { data } = res;
								if (data.CARD) {
									props.cardTable.updateDataByRowId(
										PAYBILL_CONST.card_table_id,
										data.CARD[PAYBILL_CONST.card_table_id]
									);
									judgeTableRate.call(
									 	this,data.CARD.userjson,PAYBILL_CONST.card_table_id,i);
								}
							}
						}
					});
				}
			} else {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
					value: null,
					display: null
				});
			}
		}
	}
	//可以进行编辑的汇率
	if (key === 'local_rate') {
		//form中汇率编辑后事件
		if (moduleId === 'head') {
			let local_rate_value = value.value;
			props.form.setFormItemsValue(moduleId, { local_rate: { value: local_rate_value } });
		}
		//table中编辑后
		if (moduleId === 'paybilldetail_table') {
			//props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', { value: null, display: null });//给表体字段赋值
			//
			let table_local_rate = value;
			//原币金额
			let pay_table_primal = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pay_primal');
			if (pay_table_primal && pay_table_primal.value) {
				let table_local_money = (pay_table_primal.value * table_local_rate).toFixed(2);
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
					value: table_local_money,
					display: table_local_money
				}); //给表体字段赋值
			}
		}
	}
	//票据类型
	if (key === 'note_type') {
		let body_nete_data = value;
		//form中编辑后事件
		if (moduleId === 'head') {
			//表头编辑 表体赋值
			let form_nt_value = props.form.getFormItemsValue('head', key).value;
			let form_nt_display = props.form.getFormItemsValue('head', key).display;
			props.cardTable.setColValue('paybilldetail_table', 'note_type', {
				display: form_nt_display,
				value: form_nt_value
			});
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_val = value.value;
			let meta = props.meta.getMeta();
			if (note_type_val) {
				if (note_type_val != 'FBMTZ6E0000000000001' && note_type_val != 'FBMTZ6E0000000000002') {
					let item = meta['head'].items.find((e) => e.attrcode === 'note_no');
					props.renderItem('form', moduleId, 'note_no', null);
					item.itemtype = 'input';
					item.refcode = null;
				}
			}
			props.meta.setMeta(meta);
		}
		//table中编辑后事件操作表格该行i
		if (moduleId === 'paybilldetail_table') {
			let body_nt_val = value.refpk;
			let meta = props.meta.getMeta();
			if (body_nt_val) {
				if (body_nt_val != 'FBMTZ6E0000000000001' && body_nt_val != 'FBMTZ6E0000000000002') {
					let item = meta['head'].items.find((e) => e.attrcode === 'note_no');
					props.renderItem('form', moduleId, 'note_no', null);
					item.itemtype = 'input';
					item.refcode = null;
				}
			}
			props.meta.setMeta(meta);
		}
	}

	if (key == 'pk_supplier') {
		if (moduleId === 'head') {
			let supplierData = props.createHeadAfterEventData(
				'36070PBR_D5_card',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				value
			);

			let supplier_newvalue = supplierData.newvalue.value;
			let supplier_oldvalue = supplierData.oldvalue.value;
			if (moduleId === 'head') {
				if (!value.value) {
					props.form.setFormItemsValue(moduleId, { pk_account: { value: null, display: null } });
				}
				if (supplier_newvalue != supplier_oldvalue) {
					props.form.setFormItemsValue(moduleId, { pk_account: { value: null, display: null } });
				}
			}
		}
	}
	if (key === '') {
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/