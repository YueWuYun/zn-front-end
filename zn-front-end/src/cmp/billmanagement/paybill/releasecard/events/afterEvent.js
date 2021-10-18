/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import {
	ajax,
	toast
} from 'nc-lightapp-front';
import {
	PAYBILL_CONST
} from '../../cons/constant.js';
import {
	card_from_id,

} from '../../cons/constant.js';
import {
	buildLightBodyAfterEditData
} from '../../../../../tmpub/pub/util/index';
import { ObjectTypeHandle,NoteTypeHandle } from '../../util/ReferChangeEvent';

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	// export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	// 		console.log(props, moduleId, key,value, changedrows, i, s, g)
	if (key === 'pk_org') {
		//获取编辑后表单的值
		let eventdata = props.createHeadAfterEventData(
			PAYBILL_CONST.release_page_id,
			PAYBILL_CONST.release_from_id,
			PAYBILL_CONST.release_table_id,
			moduleId,
			key,
			value
		);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		let oldorgDis = eventdata.oldvalue.display;
		if (value.value) {
			props.resMetaAfterPkorgEdit();
			ajax({
				url: '/nccloud/cmp/pub/getpara.do',
				//参数返回类型type， int ,string,boolean
				//组织pk_org
				//参数编码paracode 
				data: {
					paracode: 'CMP49',
					pk_org: value.value,
					type: 'boolean'
				},
				success: function (res) {
					let {
						success,
						data
					} = res;
					if (res.data.CMP49) {

						let meta = props.meta.getMeta();
						let item = meta[PAYBILL_CONST.release_from_id].items.find(e => e.attrcode === 'objecttype')
						item.options = [{
								"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000000'),
								/* 国际化处理： 客户*/
								"value": "0"
							},
							{
								"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000001'),
								/* 国际化处理： 供应商*/
								"value": "1"
							},
							{
								"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000002'),
								/* 国际化处理： 部门*/
								"value": "2"
							},
							{
								"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000003'),
								/* 国际化处理： 人员*/
								"value": "3"
							},
							{
								"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000004'),
								/* 国际化处理： 散户*/
								"value": "4"
							}
						]
					}
				}
			});

		}
		if (oldvalue == null) {
			ajax({
				url: '/nccloud/cmp/paybills/orgchange.do',
				data: eventdata,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								props.form.setAllFormValue({
									[this.formId]: res.data.head[this.formId]
								});
							}

							if (res.data.body) {
								props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							props.form.setAllFormValue({
								[this.formId]: {
									rows: []
								}
							});
							props.cardTable.setTableData(this.tableId, {
								rows: []
							});
						}
					}
				}
			});
		}
		if (oldvalue != newvalue && oldvalue != null) {
			this.setState({
				oldorg: oldvalue,
				oldorgDis: oldorgDis
			});
			this.props.modal.show('addNode');
		}
	}

	if (key === 'pay_primal') {
		if (value) {
			let pk_paybill = props.form.getFormItemsValue(this.formId, 'pk_paybill');
			let mnydata = props.createBodyAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				changedrows,
				i
			);
			let oldvalue = mnydata.changedrows[0].oldvalue.value;
			if(pk_paybill&&pk_paybill.value){
				// props.form.setFormItemsValue(PAYBILL_CONST.release_from_id, {
				// 	'pay_primal': {
				// 		value: oldvalue,
				// 		diaplay:oldvalue
				// 	}
				// });	
				props.cardTable.resetTableData(PAYBILL_CONST.release_table_id);
				props.cardTable.setStatus(PAYBILL_CONST.release_table_id, 'edit');
				toast({ color: 'error', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000119') });/* 国际化处理： 票据号、银行账户、现金账户不能同时有值*/
			}else{
			let body_mny_data = buildLightBodyAfterEditData(
				props,
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				key,
				changedrows,
				i,
				true
			);
			ajax({
				url: '/nccloud/cmp/paybills/primalmny.do',
				data: body_mny_data,
				async: false,
				success: (res) => {
					if (res.success) {

						//给表体币种字段赋值
						if (res.data[PAYBILL_CONST.release_table_id]) {
							props.cardTable.updateDataByRowId(
								PAYBILL_CONST.release_table_id,
								res.data[PAYBILL_CONST.release_table_id]
							);
							let pay_table_rate = res.data[PAYBILL_CONST.release_table_id].rows[0].values.local_rate; //返回币种汇率
							if (pay_table_rate.value == null) {
								//当汇率为空null的时候，可以编辑
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', {
									value: null,
									display: null
								});
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'group_rate', {
									value: null,
									display: null
								});
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'global_rate', {
									value: null,
									display: null
								});
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
									value: null,
									display: null
								});
								props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', true);
								props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', true);
							}
						}
					}
				}
			});
			}
		} else {
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
				value: null,
				display: null
			});
			props.cardTable.resetTableData(PAYBILL_CONST.release_table_id);
			props.cardTable.setStatus(PAYBILL_CONST.release_table_id, 'edit');
		}
		
	}


	if (key == 'objecttype') {
		if (moduleId === PAYBILL_CONST.release_from_id) {
			let objecttypeData = props.createHeadAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				value
			);

			let objecttype_newvalue = objecttypeData.newvalue.value;
			let objecttype_oldvalue = objecttypeData.oldvalue.value;

			if (!value.value) {
				props.form.setFormItemsValue(moduleId, {
					pk_account: {
						value: null,
						display: null
					}
				});
			}
			let pk_suplier = props.form.getFormItemsValue(this.formId, 'pk_supplier');
			if (objecttype_newvalue != objecttype_oldvalue) {
				//form
				props.form.setFormItemsValue(moduleId, {
					pk_account: {
						value: null,
						display: null
					}
				});
				props.form.setFormItemsValue(moduleId, {
					accountopenbank: {
						value: null
					}
				});
				props.form.setFormItemsValue(moduleId, {
					pk_accountname: {
						value: null,
						display: null
					}
				});
				//table
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_account', {
					value: null,
					display: null
				});
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountname', {
					value: null,
					display: null
				});
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountopenbank', {
					value: null,
					display: null
				});

				ObjectTypeHandle(props, moduleId, objecttype_newvalue,null,PAYBILL_CONST.release_from_id,PAYBILL_CONST.release_table_id);
				if (value.value === '4' && pk_suplier && pk_suplier.value) {
					//清空form供应商
					props.form.setFormItemsValue(moduleId, {
						pk_supplier: {
							value: null,
							display: null
						}
					});

					//清空table供应商
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_supplier', {
						value: null,
						display: null
					});

					this.props.cardTable.setColEditableByKey(PAYBILL_CONST.release_table_id, 'accounttype', false);
					this.props.cardTable.setColEditableByKey(PAYBILL_CONST.release_table_id, 'accountopenbank', false);
				}
			}
		}
		if (moduleId === PAYBILL_CONST.release_table_id) {
			let obj_body_data = props.createBodyAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				changedrows,
				i
			);

			let obj_body_newvalue = obj_body_data.changedrows[0].newvalue.value;
			let obj_body_oldvalue = obj_body_data.changedrows[0].oldvalue.value;

			if (!value.value) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accounttype', {
					value: null,
					display: null
				});
			}
			if (obj_body_newvalue != obj_body_oldvalue) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accounttype', {
					value: null,
					display: null
				});
			}
			if (obj_body_newvalue === '4') {
				//清空table供应商
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_supplier', {
					value: null,
					display: null
				});
			}
		}
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
	if (key == 'mon_account') {
		if (moduleId === PAYBILL_CONST.release_from_id) {
			props.form.setFormItemsValue(PAYBILL_CONST.release_from_id, {
				mon_account: {
					value: i.refpk,
					display: i.refcode
				}
			});
			props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'mon_account', {
				display: i.refcode,
				value: i.refpk
			});
		}
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
		key === 'pk_busiman'||
		key === 'bill_date' 
	) {
		let currencyFormVal = '';
		let currencyFormDly = '';
		let body_acc_data = value;
		//表头
		if (props.form.getFormItemsValue(PAYBILL_CONST.release_from_id, key)) {
			currencyFormVal = props.form.getFormItemsValue(PAYBILL_CONST.release_from_id, key).value;
			currencyFormDly = props.form.getFormItemsValue(PAYBILL_CONST.release_from_id, key).display;
		}

		//表体
		if (moduleId === PAYBILL_CONST.release_from_id) {
			if (key === 'pk_currtype') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_currtype', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'pk_balatype') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_balatype', {
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
					if (i.values && i.values.bankdoc_name) {
						props.form.setFormItemsValue(moduleId, {
							accountopenbank: {
								value: i.values.bankdoc_name && i.values.bankdoc_name.value
							}
						});
						props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountopenbank', {
							value: i.values.bankdoc_name && i.values.bankdoc_name.value
						});
					}
					if (i.values && i.values.bankdocname) {
						props.form.setFormItemsValue(moduleId, {
							accountopenbank: {
								value: i.values.bankdocname && i.values.bankdocname.value
							}
						});
						props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountopenbank', {
							value: i.values.bankdocname && i.values.bankdocname.value
						});
					}

					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountname', { value: i.refname });
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountcode', { value: i.refcode });
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_account', {
						display: currencyFormDly,
						value: currencyFormVal
					});
					if (!i.refcode) {
						props.form.setFormItemsValue(moduleId, {
							pk_account: {
								value: value.value,
								display: value.value
							}
						});
						props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountname', { value: value.value });
						props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountcode', { value: value.value });

					}
				} else {
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountname', { value: null });
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountcode', { value: null });
					props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'accountopenbank', {
						value: null
					});
				}
			} else if (key === 'note_no') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'note_no', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'objecttype') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'objecttype', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}
			if (key === 'pk_oppaccount') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_oppaccount', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}
			if (key === 'pk_supplier') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_supplier', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}
			else if (key === 'pk_busiman') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'pk_busiman', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}else if (key === 'bill_date') {
				props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'bill_date', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			}
		}
		if (moduleId === PAYBILL_CONST.release_table_id) {
			if (key === 'pk_account') {
				let cur_body_pk_account = props.createBodyAfterEventData(
				  PAYBILL_CONST.release_page_id,
					PAYBILL_CONST.release_from_id,
					PAYBILL_CONST.release_table_id,
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
							if (body_acc_data.values) {
								if (body_acc_data.values.bankdoc_name) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value:
											body_acc_data.values.bankdoc_name && body_acc_data.values.bankdoc_name.value
									});
								}
								if (body_acc_data.values.bankdocname) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value:
											body_acc_data.values.bankdocname && body_acc_data.values.bankdocname.value
									});
								}
							}
							if (body_acc_data.refcode) {
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
									value: body_acc_data && body_acc_data.refcode
								});
							} else {
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
	if (key === 'objecttype') {
		if (moduleId === 'head') {
			if (value.value == '4') {
				props.form.setFormItemsDisabled('head', { pk_account: true }); //财务组织、
			} else {
				props.form.setFormItemsDisabled('head', { pk_account: false }); //财务组织、
			}
		}
	}
	//币种
	if (key === 'pk_currtype') {
		if (moduleId === PAYBILL_CONST.release_from_id) {
			let cur_data = props.createHeadAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				value
			);

			//获取页面信息

			let form_org = props.form.getFormItemsValue(moduleId, 'pk_org');
			let form_pk_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype');
			if (form_pk_currtype && form_pk_currtype.value) {
				props.form.setFormItemsDisabled(PAYBILL_CONST.release_from_id, { local_rate: false });
				ajax({
					url: '/nccloud/cmp/paybills/headcurrtypeafter.do',
					data: cur_data,
					success: (res) => {
						if (res.success) {
							let { data } = res;
							if (data.CARD.head) {
								this.props.form.setAllFormValue({ [this.formId]: data.CARD.head[this.formId] });
							}
							if (data.LOCAL_RATE) {
								props.form.setFormItemsDisabled(PAYBILL_CONST.release_from_id, { local_rate: false });
							} else {
								props.form.setFormItemsDisabled(PAYBILL_CONST.release_from_id, { local_rate: true });
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
		if (moduleId === PAYBILL_CONST.release_table_id) {
			let table_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
			let table_currtype = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype');
			if (table_currtype && table_currtype.display && table_currtype.value) {
				let cur_body_data = buildLightBodyAfterEditData(
					props,
					PAYBILL_CONST.release_page_id,
				   PAYBILL_CONST.release_from_id,
				   PAYBILL_CONST.release_table_id,
					key,
					changedrows,
					i,
					true
				);
				let new_body_currtype = cur_body_data.changedrows[0].newvalue.value;
				let old_body_currtype = cur_body_data.changedrows[0].oldvalue.value;
				if (new_body_currtype != old_body_currtype) {
					props.cardTable.setEditableByIndex(PAYBILL_CONST.release_table_id, i, 'local_rate', true);
					ajax({
						url: '/nccloud/cmp/paybills/bodycurrtypeafter.do',
						data: cur_body_data,
						success: (res) => {
							if (res.success) {
								//给表体币种字段赋值
								let { data } = res;
								if (data.CARD) {
									props.cardTable.updateDataByRowId(
										PAYBILL_CONST.release_table_id,
										data.CARD[PAYBILL_CONST.release_table_id]
									);
									let pay_table_rate =
										data.CARD[PAYBILL_CONST.release_table_id].rows[0].values.local_rate; //返回币种汇率

									if (data.LOCAL_RATE) {
										props.cardTable.setEditableByIndex(
											PAYBILL_CONST.release_table_id,
											i,
											'local_rate',
											true
										);
									} else {
										props.cardTable.setEditableByIndex(
											PAYBILL_CONST.release_table_id,
											i,
											'local_rate',
											false
										);
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
									}
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
		if (moduleId === PAYBILL_CONST.release_from_id) {
			let local_rate_value = value.value;
			props.form.setFormItemsValue(moduleId, {
				local_rate: {
					value: local_rate_value
				}
			});
		}
	//table中编辑后
	if (moduleId === PAYBILL_CONST.release_table_id) {
		if (value) {
			let body_rate_data = buildLightBodyAfterEditData(
				props,
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				key,
				changedrows,
				i,
				true
			);
			ajax({
				url: '/nccloud/cmp/paybills/primalmny.do',
				data: body_rate_data,
				success: (res) => {
					if (res.success) {
						//给表体币种字段赋值
						if (res.data[PAYBILL_CONST.release_table_id]) {
							props.cardTable.updateDataByRowId(
								PAYBILL_CONST.release_table_id,
								res.data[PAYBILL_CONST.release_table_id]
							);
							let pay_table_rate = res.data[PAYBILL_CONST.release_table_id].rows[0].values.local_rate; //返回币种汇率
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
	//票据类型
	if (key === 'note_type') {
		let body_nete_data = value;
		let meta = props.meta.getMeta();
		//form中编辑后事件
		if (moduleId === PAYBILL_CONST.release_from_id) {
			//表头编辑 表体赋值
			let form_nt_value = props.form.getFormItemsValue(PAYBILL_CONST.release_from_id, key).value;
			let form_nt_display = props.form.getFormItemsValue(PAYBILL_CONST.release_from_id, key).display;
			props.cardTable.setColValue(PAYBILL_CONST.release_table_id, 'note_type', {
				display: form_nt_display,
				value: form_nt_value
			});
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_val = value.value;
			if (note_type_val) {
				ajax({
					url: '/nccloud/cmp/pub/noteTypeHandler.do',
					data: { pk: form_nt_value },
					success: function(res) {
						NoteTypeHandle(props, moduleId, res.data.note_type, null,PAYBILL_CONST.release_from_id,PAYBILL_CONST.release_table_id);
					}
				});
			}
		}
		//table中编辑后事件操作表格该行i
		if (moduleId === PAYBILL_CONST.release_table_id) {
			let noteType_body_data = props.createBodyAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				changedrows,
				i
			);
			let new_body_noteType = noteType_body_data.changedrows[0].newvalue.value;
			let old_body_noteType = noteType_body_data.changedrows[0].oldvalue.value;

			if (new_body_noteType != old_body_noteType) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'note_no', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_note', {
					value: null,
					display: null
				});
			}
		}
	}
	if (key === 'accountopenbank') {
		if (moduleId === PAYBILL_CONST.release_table_id) {
			let refVal = value;
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
				value: refVal && refVal.refname,
				display: refVal && refVal.refname
			});
		}
	}

	if (key == 'pk_supplier') {
		if (moduleId === PAYBILL_CONST.release_from_id) {
			let supplierData = props.createHeadAfterEventData(
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				moduleId,
				key,
				value
			);
			let supplier_newvalue = supplierData.newvalue.value;
			let supplier_oldvalue = supplierData.oldvalue.value;

			if (!value.value) {
				props.form.setFormItemsValue(moduleId, {
					pk_account: {
						value: null,
						display: null
					}
				});
			} else {
				let objecttype = props.form.getFormItemsValue(this.formId, 'objecttype');
				let head_supplier = props.form.getFormItemsValue(this.formId, 'pk_supplier');
				if (objecttype && objecttype.value === '4' && head_supplier && head_supplier.value) {
					let num = props.cardTable.getNumberOfRows(PAYBILL_CONST.release_table_id);
					for (let index = 0; index < num; index++) {
						props.cardTable.setEditableByIndex(PAYBILL_CONST.release_table_id, index, 'accounttype', true);
						props.cardTable.setEditableByIndex(PAYBILL_CONST.release_table_id, index, 'accountopenbank', true);
						props.cardTable.setEditableByIndex(PAYBILL_CONST.release_table_id, index, 'accountname', true);
					}
				}
			}
			if (supplier_newvalue != supplier_oldvalue) {
				props.form.setFormItemsValue(moduleId, {
					pk_account: {
						value: null,
						display: null
					}
				});
			}
		}
		if (moduleId === PAYBILL_CONST.release_table_id) {
			let objectType = props.cardTable.getValByKeyAndIndex(moduleId, i, 'objecttype');
			let supplier = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_supplier');
			if (objectType && objectType.value === '4' && supplier && supplier.value) {
				props.cardTable.setEditableByIndex(moduleId, i, 'accounttype', true);
				props.cardTable.setEditableByIndex(moduleId, i, 'accountopenbank', true);
				props.cardTable.setEditableByIndex(moduleId, i, 'accountname', true);
			}
		}
	}

	if (key === 'cf_type') {
		let cf_type = props.cardTable.getValByKeyAndIndex(moduleId, i, 'cf_type');
		if (cf_type && cf_type.value) {
	
			let cf_data = buildLightBodyAfterEditData(
				props,
				PAYBILL_CONST.release_page_id,
				PAYBILL_CONST.release_from_id,
				PAYBILL_CONST.release_table_id,
				key,
				changedrows,
				i,
				true
			);
			ajax({
				url: '/nccloud/cmp/paybills/commissionAfterEvent.do',
				data: cf_data,
				success: (res) => {
					if (res.success) {
						if (res.data[PAYBILL_CONST.release_table_id]) {
							props.cardTable.updateDataByRowId(
								PAYBILL_CONST.release_table_id,
								res.data[PAYBILL_CONST.release_table_id]
							);
						}
					}
				},
				error: (res) => {
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'cf_type', {
						value:null,
						display: null
					});
					toast({
						color: 'warning',
						content:res.message
					});
					
				}
			});
		}
	}
}
/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/