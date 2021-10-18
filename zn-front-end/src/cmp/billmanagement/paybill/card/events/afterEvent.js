/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import {
	ajax,
	toast,
	promptBox
} from 'nc-lightapp-front';

import {
	card_from_id

} from '../../cons/constant.js';
import {
	PAYBILL_CONST
} from '../../cons/constant.js';
import {
	ObjectTypeHandle,
	NoteTypeHandle
} from '../../util/ReferChangeEvent';
import {
	addline
} from '../events/addLine';
import {
	buildLightBodyAfterEditData
} from '../../../../../tmpub/pub/util/index';
import {
	judgeCurrtype,
	judgeTableCurrtype,
	judgeTableRate,
	judgeFormRate
} from './judgeCurrtype';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';



export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	// export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	// 		console.log(props, moduleId, key,value, changedrows, i, s, g)
	if (key === 'pk_org') {
		if (value.value) {
			props.resMetaAfterPkorgEdit();
			props.button.setButtonDisabled(['addline'], false);

			//this.cmp49Handle.call(this,props,value.value);
		}
		if (props.cardTable.getNumberOfRows(PAYBILL_CONST.card_table_id) <= 0) {
			props.cardTable.addRow(this.tableId);
			let dataArr = ['pk_currtype', 'pk_balatype', 'note_type', 'pk_tradetypeid', 'pk_account', 'pk_oppaccount', 'objecttype',
				'local_rate', 'group_rate', 'global_rate', 'pk_supplier', 'mon_account', 'accountname', 'pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
				'pk_accountname'
			];
			addline(this.props, dataArr, 0);
		}
		let eventdata = props.createHeadAfterEventData(
			PAYBILL_CONST.card_page_id,
			PAYBILL_CONST.card_from_id,
			PAYBILL_CONST.card_table_id,
			moduleId,
			key,
			value
		);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		let oldorgDis = eventdata.oldvalue.display;

		if (oldvalue == null || oldvalue == '') {
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
								//币种关联本币汇率字段编辑性

								judgeFormRate.call(this, res.data.userjson, this.formId);

							}
							if (res.data.body) {
								props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								props.cardTable.setStatus('paybilldetail_table', 'edit');
							}
							judgeTableRate.call(this, res.data.userjson, this.tableId, 0);
							//处理汇率编辑性

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
		if (oldvalue != newvalue && (oldvalue != '' && oldvalue != null)) {
			this.setState({
				oldorg: oldvalue,
				oldorgDis: oldorgDis
			});
			//this.props.modal.show('addNode');
			promptBox({
					color: 'warning',
					hasCloseBtn: false,
					content:loadMultiLang(this.props, '36070PBR-000042'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick //取消按钮事件回调
					//beSureBtnClickDelete.call(this, props, data);
				} // 确定按钮点击调用函数,非必
			);
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
							value: i?(i.refname?i.refname:value.value):value.value,
							display: i?(i.refname?i.refname:value.value):value.value
						}
					});
					props.form.setFormItemsValue(moduleId, {
						accountcode: {
							value: i?(i.refcode?i.refcode:value.value):value.value,
						}
					});
					props.form.setFormItemsValue(moduleId, {
						accountname: {
							value:  i?(i.refname?i.refname:value.value):value.value,
						}
					});

					if (i.values && i.values.bankdoc_name) {
						props.form.setFormItemsValue(moduleId, {
							accountopenbank: {
								value: i.values.bankdoc_name && i.values.bankdoc_name.value
							}
						});
						props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
							value: i.values.bankdoc_name && i.values.bankdoc_name.value
						});
					}
					if (i.values && i.values.bankdocname) {
						props.form.setFormItemsValue(moduleId, {
							accountopenbank: {
								value: i.values.bankdocname && i.values.bankdocname.value
							}
						});
						props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
							value: i.values.bankdocname && i.values.bankdocname.value
						});
					}

					props.cardTable.setColValue('paybilldetail_table', 'accountname', {
						value: i.refname?i.refname:i.refcode
					});
					props.cardTable.setColValue('paybilldetail_table', 'accountcode', {
						value: i.refcode
					});
					props.cardTable.setColValue('paybilldetail_table', 'pk_account', {
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
						props.cardTable.setColValue('paybilldetail_table', 'accountname', {
							value: value.value
						});
						props.cardTable.setColValue('paybilldetail_table', 'accountcode', {
							value: value.value
						});
						// props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
						// 	value: null
						// });
					}
				} else {
					props.cardTable.setColValue('paybilldetail_table', 'accountname', {
						value: null
					});
					props.cardTable.setColValue('paybilldetail_table', 'accountcode', {
						value: null
					});
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
			} else if (key === 'pk_dept') {
				props.cardTable.setColValue('paybilldetail_table', 'pk_dept', {
					display: currencyFormDly,
					value: currencyFormVal
				});
			} else if (key === 'bill_date') {
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
							if (body_acc_data.values) {
								if (body_acc_data.values.bankdoc_name) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value: body_acc_data.values.bankdoc_name && body_acc_data.values.bankdoc_name.value
									});
								}
								if (body_acc_data.values.bankdocname) {
									props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
										value: body_acc_data.values.bankdocname && body_acc_data.values.bankdocname.value
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
	if (key === 'pay_primal') {
		if (value) {
			let body_mny_data = buildLightBodyAfterEditData(
				props,
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
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
						if (res.data[PAYBILL_CONST.card_table_id]) {
							props.cardTable.updateDataByRowId(
								PAYBILL_CONST.card_table_id,
								res.data[PAYBILL_CONST.card_table_id]
							);
							let pay_table_rate = res.data[PAYBILL_CONST.card_table_id].rows[0].values.local_rate; //返回币种汇率
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
							}
						}
					}
				}
			});
		} else {
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_local', {
				value: null,
				display: null
			});
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
					props.form.setFormItemsValue(moduleId, {
						ndealtotalmny: dealmny
					});
				}
			}
		});
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
							judgeTableRate.call(
								this, data.CARD.userjson, PAYBILL_CONST.card_table_id);
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
	if (key == 'objecttype') {
		if (moduleId === 'head') {
			let objecttypeData = props.createHeadAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
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
				props.cardTable.setColValue('paybilldetail_table', 'pk_account', {
					value: null,
					display: null
				});
				props.cardTable.setColValue('paybilldetail_table', 'accountname', {
					value: null,
					display: null
				});
				props.cardTable.setColValue('paybilldetail_table', 'accountopenbank', {
					value: null,
					display: null
				});
				props.cardTable.setColValue('paybilldetail_table', 'accounttype', {
					value: null,
					display: null
				});
				props.cardTable.setColValue('paybilldetail_table', 'accountcode', {
					value: null,
					display: null
				});

				ObjectTypeHandle(props, moduleId, objecttype_newvalue);
				if (value.value === '4' && pk_suplier && pk_suplier.value) {
					//清空form供应商
					props.form.setFormItemsValue(moduleId, {
						pk_supplier: {
							value: null,
							display: null
						}
					});

					//清空table供应商
					props.cardTable.setColValue('paybilldetail_table', 'pk_supplier', {
						value: null,
						display: null
					});

					this.props.cardTable.setColEditableByKey('paybilldetail_table', 'accounttype', false);
					this.props.cardTable.setColEditableByKey('paybilldetail_table', 'accountopenbank', false);
				}
			}
		}
		if (moduleId === 'paybilldetail_table') {
			let obj_body_data = props.createBodyAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
				moduleId,
				key,
				changedrows
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
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
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
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountcode', {
					value: null,
					display: null
				});
			}
			if (obj_body_newvalue === '4') {
				//清空table供应商
				props.cardTable.setColValue('paybilldetail_table', 'pk_supplier', {
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
				if (res.data && res.data.body && res.data.body[this.tableId]) {
					let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
					props.editTable.setValByKeyAndRowNumber(moduleId, i + 1, 'npobnum', npobnum.value);
				}
			}
		});
	}
	if (key == 'mon_account') {
		if (moduleId === 'head') {
			props.form.setFormItemsValue('head', {
				mon_account: {
					value: i.refpk,
					display: i.refcode
				}
			});
			props.cardTable.setColValue('paybilldetail_table', 'mon_account', {
				display: i.refcode,
				value: i.refpk
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
			let form_pk_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype');
			if (form_pk_currtype && form_pk_currtype.value) {
				props.cardTable.setColValue(PAYBILL_CONST.card_table_id, 'pk_currtype', {
					display: form_pk_currtype.display,
					value: form_pk_currtype.value
				});
				ajax({
					url: '/nccloud/cmp/paybills/headcurrtypeafter.do',
					data: cur_data,
					success: (res) => {
						if (res.success) {
							let {
								data
							} = res;
							if (data.CARD.head) {
								this.props.form.setAllFormValue({
									[this.formId]: data.CARD.head[this.formId]
								});
								//币种关联本币汇率字段编辑性
								judgeFormRate.call(this, data.CARD.userjson, this.formId);
							}

							if (data.CARD.body) {
								this.props.cardTable.setTableData(this.tableId, data.CARD.body[this.tableId]);
								judgeTableRate.call(
									this, data.CARD.userjson, PAYBILL_CONST.card_table_id);
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
								let {
									data
								} = res;
								if (data.CARD) {
									props.cardTable.updateDataByRowId(
										PAYBILL_CONST.card_table_id,
										data.CARD[PAYBILL_CONST.card_table_id]
									);
									judgeTableRate.call(
										this, data.CARD.userjson, PAYBILL_CONST.card_table_id, i);
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
	if (key === 'local_rate' || key === 'group_rate' || key === 'global_rate') {
		//form中汇率编辑后事件
		if (moduleId === 'head') {
			let local_rate_value = value.value;
			props.form.setFormItemsValue(moduleId, {
				local_rate: {
					value: local_rate_value
				}
			});
		}
		//table中编辑后
		if (moduleId === 'paybilldetail_table') {
			if (value) {
				let body_rate_data = buildLightBodyAfterEditData(
					props,
					PAYBILL_CONST.card_page_id,
					PAYBILL_CONST.card_from_id,
					PAYBILL_CONST.card_table_id,
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
							if (res.data[PAYBILL_CONST.card_table_id]) {
								props.cardTable.updateDataByRowId(
									PAYBILL_CONST.card_table_id,
									res.data[PAYBILL_CONST.card_table_id]
								);
								let pay_table_rate = res.data[PAYBILL_CONST.card_table_id].rows[0].values.local_rate; //返回币种汇率
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
			if (note_type_val) {
				ajax({
					url: '/nccloud/cmp/pub/noteTypeHandler.do',
					data: {
						pk: form_nt_value
					},
					success: function (res) {
						NoteTypeHandle(props, moduleId, res.data, null);
					}
				});
			}
		}
		//table中编辑后事件操作表格该行i
		if (moduleId === 'paybilldetail_table') {
			let noteType_body_data = props.createBodyAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
				moduleId,
				key,
				changedrows,
				i
			);
			let new_body_noteType = noteType_body_data.changedrows[0].newvalue.value;
			let old_body_noteType = noteType_body_data.changedrows[0].oldvalue.value;

			if (new_body_noteType != old_body_noteType) {

				if (new_body_noteType) {
					ajax({
						url: '/nccloud/cmp/pub/noteTypeHandler.do',
						data: {
							pk: new_body_noteType
						},
						success: function (res) {
							NoteTypeHandle(props, moduleId, res.data, i);
						}
					});
				}

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
	if (key === 'note_no') {
		if (!value) {
			return;
		}
		if (moduleId === 'head') {
			let noteData = this.props.createMasterChildData(PAYBILL_CONST.card_page_id, this.formId, this.tableId);
			//props.createHeadAfterEventData(PAYBILL_CONST.card_page_id, this.formId, this.tableId, moduleId, key, value);
			let noteVal = props.form.getFormItemsValue('head', key).value;
			let rows = props.cardTable.getNumberOfRows(this.tableId); //表体table行数
			let checkData = noteData.body[this.tableId].rows;
			let noteFlag = true;
			let dataArr = [
				'pk_balatype',
				'note_type',
				'pk_tradetypeid',
				'pk_account',
				'objecttype',
				'local_rate',
				'group_rate',
				'global_rate',
				'pk_supplier',
				'accountname',
				'pk_customer',
				'pk_busiman'
			];

			if (rows == 0) {
				props.cardTable.addRow(this.tableId); //增加一行
				//赋值
				addline(props, dataArr, rows);
			} else {
				for (let item of checkData) {
					if (item.values.note_no && item.values.note_no.value) {
						if (item.values.note_no.value == noteVal) {
							noteFlag = false;
						}
					}
				}
			}
			if (noteFlag) {
				props.cardTable.addRow(this.tableId);
				//赋值
				addline(props, dataArr, rows);
			}
			if (i.values) {
				props.cardTable.setValByKeyAndIndex(this.tableId, rows, 'note_no', {
					value: i.refpk,
					display: i.refcode
				});
				props.cardTable.setValByKeyAndIndex(this.tableId, rows, 'pk_currtype', {
					value: i.values && i.values.pk_curr && i.values.pk_curr.value,
					display: i.values && i.values.pk_curr && i.values.pk_curr.value
				});
				props.cardTable.setValByKeyAndIndex(this.tableId, rows, 'pay_primal', {
					value: i.values.money.value,
					display: i.values.money.value
				});
				props.cardTable.setValByKeyAndIndex(this.tableId, rows, 'pk_supplier', {
					value: i.values.hidereceiveunit.value,
					display: i.values.receiveunit.value
				});
				props.cardTable.setValByKeyAndIndex(this.tableId, rows, 'pk_note', {
					value: i.refpk,
					display: i.refcode
				});
				let cardData = props.createHeadAfterEventData(
					PAYBILL_CONST.card_page_id,
					PAYBILL_CONST.card_from_id,
					PAYBILL_CONST.card_table_id,
					moduleId,
					key,
					value
				);
				ajax({
					url: '/nccloud/cmp/paybills/headnoteafter.do',
					data: cardData,
					success: (res) => {
						if (res.success) {
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
				});
			}
		}
		if (moduleId === 'paybilldetail_table') {
			let body_note_data = value;
			let note_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;

			let table_note = props.cardTable.getValByKeyAndIndex(moduleId, i, 'note_no');
			// if (body_note_data && table_note && table_note.value != '' && table_note.display != '') {
			// 	props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_currtype', {
			// 		value: body_note_data.values.pk_curr.value,
			// 		display: body_note_data.values.currname.value
			// 	});
			// 	props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_primal', {
			// 		value: body_note_data.values.money.value,
			// 		display: body_note_data.values.money.value
			// 	});
			// 	props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_supplier', {
			// 		value: body_note_data.values.hidereceiveunit.value,
			// 		display: body_note_data.values.receiveunit.value
			// 	});
			// 	props.cardTable.setValByKeyAndIndex(this.tableId, i, 'note_no', {
			// 		value: body_note_data.refpk,
			// 		display: body_note_data.refcode
			// 	});
			// 	props.cardTable.setValByKeyAndIndex(this.tableId, i, 'pk_note', {
			// 		value: body_note_data.refpk,
			// 		display: body_note_data.refcode
			// 	});
			// }
			//if (new_body_currtype != old_body_currtype) {
			if (table_note && table_note.display) {
				let note_body_data = buildLightBodyAfterEditData(
					props,
					PAYBILL_CONST.card_page_id,
					PAYBILL_CONST.card_from_id,
					PAYBILL_CONST.card_table_id,
					key,
					changedrows,
					i,
					true
				);
				let new_body_note = note_body_data.changedrows[0].newvalue.value;
				let old_body_note = note_body_data.changedrows[0].oldvalue.value;
				if (new_body_note != old_body_note) {
					ajax({
						url: '/nccloud/cmp/paybills/bodynoteafter.do',
						data: note_body_data,
						success: (res) => {
							if (res.success) {
								//给表体币种字段赋值
								if (res.data[PAYBILL_CONST.card_table_id]) {
									props.cardTable.updateDataByRowId(
										PAYBILL_CONST.card_table_id,
										res.data[PAYBILL_CONST.card_table_id]
									);
								}
							}
						}
					});
				}
			}
		}
	}
	if (key === 'accountopenbank') {
		if (moduleId === 'paybilldetail_table') {
			let refVal = value;
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountopenbank', {
				value: refVal && refVal.refname,
				display: refVal && refVal.refname
			});
		}
	}
	if (key == 'pk_supplier') {
		if (moduleId === 'head') {
			let supplierData = props.createHeadAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
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
					let num = props.cardTable.getNumberOfRows(PAYBILL_CONST.card_table_id);
					for (let index = 0; index < num; index++) {
						props.cardTable.setEditableByIndex('paybilldetail_table', index, 'accounttype', true);
						props.cardTable.setEditableByIndex('paybilldetail_table', index, 'accountopenbank', true);
						props.cardTable.setEditableByIndex('paybilldetail_table', index, 'accountname', true);
					}
					// props.cardTable.setColEditableByKey('paybilldetail_table', 'accounttype' ,true);
					// props.cardTable.setColEditableByKey('paybilldetail_table', 'accountopenbank' ,true);
					// props.cardTable.setColEditableByKey('paybilldetail_table', 'accountname' ,true);
				}
				if (
					objecttype &&
					(objecttype.value === '0' || objecttype.value === '1') &&
					head_supplier &&
					head_supplier.value
				) {
					let pk = head_supplier.value;
					ajax({
						url: '/nccloud/cmp/pub/getDefaultBankAcc.do',
						data: {
							pk
						},
						success: (res) => {
							if (res.success) {
								if (res.data) {
									props.form.setFormItemsValue(this.formId, {
										accountcode: {
											value: res.data.code,
											display: res.data.code
										}
									});
									props.form.setFormItemsValue(this.formId, {
										pk_account: {
											value: res.data.pk_bankaccsub,
											display: res.data.code
										}
									});

									props.cardTable.setColValue(this.tableId, 'pk_account', {
										value: res.data.pk_bankaccsub,
										display: res.data.code
									});

									props.cardTable.setColValue(this.tableId, 'accountcode', {
										value: res.data.code,
										display: res.data.code
									});

									props.cardTable.setColValue(this.tableId, 'accountname', {
										display: res.data.name,
										value: res.data.name
									});
								}
							}
						}
					});
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
		if (moduleId === 'paybilldetail_table') {
			let objectType = props.cardTable.getValByKeyAndIndex(moduleId, i, 'objecttype');
			let supplier = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_supplier');
			if (objectType && objectType.value === '4' && supplier && supplier.value) {
				props.cardTable.setEditableByIndex(moduleId, i, 'accounttype', true);
				props.cardTable.setEditableByIndex(moduleId, i, 'accountopenbank', true);
				props.cardTable.setEditableByIndex(moduleId, i, 'accountname', true);
			}
		}
	}
	//表体-业务组织-编辑后
	//add by zhanghjr
	if (key === 'pk_busiorg') {
		//表体编辑后--业务组织：清空表体字段(部门，业务员，客户)值
		if (moduleId === 'paybilldetail_table') {
			let pk_busiorg_data = props.createBodyAfterEventData(
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
				moduleId,
				key,
				changedrows,
				i
			);
			let new_pk_busiorg_data = pk_busiorg_data.changedrows[0].newvalue.value;
			let old_pk_busiorg_data = pk_busiorg_data.changedrows[0].oldvalue.value;
			if (new_pk_busiorg_data != old_pk_busiorg_data) {
				// props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_customer', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_dept', {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_busiman', {
					value: null,
					display: null
				});
			}

		}
	}

	if (key === 'cf_type') {
		let cf_type = props.cardTable.getValByKeyAndIndex(moduleId, i, 'cf_type');
		if (cf_type && cf_type.value) {

			let cf_data = buildLightBodyAfterEditData(
				props,
				PAYBILL_CONST.card_page_id,
				PAYBILL_CONST.card_from_id,
				PAYBILL_CONST.card_table_id,
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
						if (res.data[PAYBILL_CONST.card_table_id]) {
							props.cardTable.updateDataByRowId(
								PAYBILL_CONST.card_table_id,
								res.data[PAYBILL_CONST.card_table_id]
							);
						}
					}
				},
				error: (res) => {
					props.cardTable.setValByKeyAndIndex(moduleId, i, 'cf_type', {
						value: null,
						display: null
					});
					toast({
						color: 'warning',
						content: res.message
					});

				}
			});
		}
	}
}
/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/