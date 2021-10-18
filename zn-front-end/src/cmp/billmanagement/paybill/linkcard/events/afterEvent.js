/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast } from 'nc-lightapp-front';

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	// export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	// 		console.log(props, moduleId, key,value, changedrows, i, s, g)

	if (key === 'pk_org') {
		//获取编辑后表单的值
		let eventdata = props.createHeadAfterEventData(
			'36070PBR_C02',
			'head',
			'paybilldetail_table',
			moduleId,
			key,
			value
		);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		let oldorgDis=eventdata.oldvalue.display;
	
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
			this.setState({
				oldorg: oldvalue,
				oldorgDis:oldorgDis
			});
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
				'36070PBR_C02',
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
				'36070PBR_C02',
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
				debugger;
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
		key === 'mon_account' ||
		key === 'objecttype' ||
		key === 'pk_dept' ||
		key === 'pk_supplier' ||
		key === 'pk_oppaccount' ||
		key === 'pk_account'
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

		if (key === 'pk_currtype') {
			props.cardTable.setColValue('paybilldetail_table', 'pk_currtype', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		} else if (key === 'pk_balatype') {
			props.cardTable.setColValue('paybilldetail_table', 'pk_balatype', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		} else if (key === 'pk_account') {
			props.form.setFormItemsValue(moduleId, {
				'pk_account': {
					value: i.refpk,
					display: i.refcode
				}
			});
			props.form.setFormItemsValue(moduleId, {
				'accountname': {
					value: i.refpk,
					display: i.values['accname'].value
				}
			});

			props.cardTable.setColValue('paybilldetail_table', 'pk_account', {
				display: i.refcode,
				value: currencyFormVal
			});
			props.cardTable.setColValue('paybilldetail_table', 'accountname', { value: currencyFormDly });
		} else if (key === 'note_no') {
			props.cardTable.setColValue('paybilldetail_table', 'note_no', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		} else if (key === 'objecttype') {
			props.cardTable.setColValue('paybilldetail_table', 'objecttype', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		}
		if (key === 'pk_oppaccount') {
			props.cardTable.setColValue('paybilldetail_table', 'pk_oppaccount', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		}
		if (key === 'pk_supplier') {
			props.cardTable.setColValue('paybilldetail_table', 'pk_supplier', {
				display: currencyFormDly,
				value: currencyFormVal
			});
		}
		if (moduleId === 'paybilldetail_table') {
			if (key === 'pk_account') {
				let cur_body_pk_account = props.createBodyAfterEventData(
					'36070PBR_C02',
					'head',
					'paybilldetail_table',
					moduleId,
					key,
					changedrows
				);
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', {
					value: body_acc_data.refpk,
					display: body_acc_data.refcode
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {
					value: body_acc_data.refname,
					display: body_acc_data.refname
				});
			}
		}
	}
	if (key === 'pk_currtype') {
		if (moduleId === 'head') {
			let cur_data = props.createHeadAfterEventData(
				'36070PBR_C02',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				value
			);
			let new_currtype = cur_data.newvalue.value;
			let old_currtype = cur_data.oldvalue.value;
			if (old_currtype != new_currtype) {
				ajax({
					url: '/nccloud/cmp/paybills/headcurrtypeafter.do',
					data: cur_data,
					success: (res) => {
						if (res.success) {
							if (res.data.head) {
								props.form.setFormItemsValue(moduleId, {
									local_rate: { value: res.data.head[moduleId].rows[0].values.local_rate.value }
								});
								if (null == res.data.head[moduleId].rows[0].values.local_rate.value) {
									props.form.setFormItemsDisabled(moduleId, { local_rate: false });
								}
							}
						}
					}
				});
			}
		}
		if (moduleId === 'paybilldetail_table') {
			let cur_body_data = props.createBodyAfterEventData(
				'36070PBR_C02',
				'head',
				'paybilldetail_table',
				moduleId,
				key,
				changedrows
			);
			let new_body_currtype = cur_body_data.changedrows[0].newvalue.value;
			let old_body_currtype = cur_body_data.changedrows[0].oldvalue.value;
			if (new_body_currtype != old_body_currtype) {
				ajax({
					url: '/nccloud/cmp/paybills/bodycurrtypeafter.do',
					data: cur_body_data,
					success: (res) => {
						if (res.success) {
							//给表体币种字段赋值
							if (res.data.body) {
								let currtype_table_val = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype')
									.value;
								let currtype_table_dly = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype')
									.display;
								//let pay_table_currtype = res.data.body[moduleId].changedrows[0].values.pk_currtype.value;//返回本币币种
								let pay_table_rate = res.data.body[moduleId].rows[0].values.local_rate; //返回币种汇率
								let pay_table_localmoney = res.data.body[moduleId].rows[0].values.pay_local; //返回币种汇率

								if (pay_table_rate && pay_table_rate.value) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', {
										value: pay_table_rate.value,
										display: pay_table_rate.value
									});
								}
								if (pay_table_localmoney && pay_table_localmoney.value) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
										value: pay_table_localmoney.value,
										display: pay_table_localmoney.value
									}); //给表体币种字段赋值
								}

								if (pay_table_rate.value == null) {
									//当汇率为空null的时候，可以编辑
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', {
										value: null,
										display: null
									});
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
										value: null,
										display: null
									});
									props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', true);
								}
							}
						}
					}
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
	if (key === 'pk_billtypecode') {
		alert(111);
	}

	if (key == 'pk_supplier') {
		if (moduleId === 'head') {
			let supplierData = props.createHeadAfterEventData(
				'36070PBR_C02',
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
}


/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/