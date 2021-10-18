/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import { formRateEditinfo, tableRateEditinfo } from "./judgeCurrtype.js";
import { NoteTypeHandle, ObjectTypeHandle } from "../../util/ReferChangeEvent.js";
import { checkNoteno } from "./checkNoteno.js";//选择票据号是否增加表体行
import { buildLightBodyAfterEditData } from "../../../../../tmpub/pub/util/index";//tmpub封装编辑后事件，只传递表体编辑行
import { informerCheckEdit } from "./informerCheck.js";
/**
 * //组织变换编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} s 
 * @param {*} g 
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {

	console.log('action:...', 'cardaftereevent')

	let tablie_id = this.tableId;
	let form_id = this.formId;
	let page_id = this.pageId;
	//到账通知特殊校验
	if (key === 'rec_primal' || key === 'local_rate' || key === 'group_rate' || key === 'global_rate') {
		let check_data = buildLightBodyAfterEditData(
			props,
			this.pageId,
			this.formId,
			this.tableId,
			key,
			changedrows,
			i,
			true
		);
		let check_data_newvalue = check_data.changedrows[0].newvalue.value;
		let check_data_oldvlaue = check_data.changedrows[0].oldvalue.value;
		if (!informerCheckEdit.call(this, check_data_newvalue, check_data_oldvlaue)) {
			return;
		}
	}
	//币种
	if (key === 'pk_currtype') {
		//form中编辑后事件
		if (moduleId === form_id) {

			let currtype_data = props.createHeadAfterEventData(this.pageId, moduleId, this.tableId, moduleId, key, value);
			let currtype_newvalue = currtype_data.newvalue.value;
			let currtype_oldvalue = currtype_data.oldvalue.value;
			let data = {
				key: key,
				areaCode: 'head',
				cardhead: currtype_data
			}
			if ((currtype_newvalue != currtype_oldvalue) && currtype_newvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						if (res.success) {
							if (res.data) {
								if (res.data.head) {
									props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								}
								//币种关联本币汇率字段编辑性
								formRateEditinfo.call(this, res.data.userjson);
							}
						}
					}
				});
			}

		}
		//table中编辑后事件[操作表格该行i]
		if (moduleId === tablie_id) {
			let currtype_table_data = buildLightBodyAfterEditData(
				props,
				this.pageId,
				this.formId,
				this.tableId,
				key,
				changedrows,
				i,
				true
			);
			let currtype_table_newvalue = currtype_table_data.changedrows[0].newvalue.value;
			let currtype_table_oldvalue = currtype_table_data.changedrows[0].oldvalue.value;
			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'body',
				cardbody: currtype_table_data
			}

			if ((currtype_table_newvalue != currtype_table_oldvalue) && currtype_table_newvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								//轻量化直接返回编辑后的当前行数据update即可
								props.cardTable.updateDataByRowId(this.tableId, res.data[this.tableId]);
								//币种关联本币汇率字段编辑性
								tableRateEditinfo.call(this, res.data.userjson, i);
							} else {
								//清空数据
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}
	}
	//收款原币金额
	else if (key === 'rec_primal') {
		//表体中原币金额编辑后
		if (moduleId === tablie_id) {
			// let rec_primal_table_data = props.createBodyAfterEventData(this.pageId, this.formId, moduleId, moduleId, key, changedrows, i);
			//轻量化改造表体编辑后事件
			let rec_primal_table_data = buildLightBodyAfterEditData(
				props,
				this.pageId,
				this.formId,
				this.tableId,
				key,
				changedrows,
				i,
				true
			);
			let rec_primal_table_newvalue = rec_primal_table_data.changedrows[0].newvalue.value;
			let rec_primal_table_oldvalue = rec_primal_table_data.changedrows[0].oldvalue.value;

			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'body',
				cardbody: rec_primal_table_data
			}
			if ((rec_primal_table_newvalue != rec_primal_table_oldvalue) && rec_primal_table_newvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								//表体编辑后事件改造
								//轻量化直接返回编辑后的当前行数据update即可
								props.cardTable.updateDataByRowId(this.tableId, res.data[this.tableId]);
							} else {
								//清空数据
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}
	}
	//可以进行编辑的汇率
	else if (key === 'local_rate' || key === 'group_rate' || key === 'global_rate') {
		//form中汇率编辑后事件
		if (moduleId === form_id) {
			let local_rate_data = props.createHeadAfterEventData(this.pageId, moduleId, this.tableId, moduleId, key, value);
			let local_rate_newvalue = local_rate_data.newvalue.value;
			let local_rate_oldvalue = local_rate_data.oldvalue.value;
			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'head',
				cardhead: local_rate_data
			}
			if (local_rate_newvalue != local_rate_oldvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					async: false,//1909新增:编辑后事件改为同步ajax请求
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
								//清空数据
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}
		//table中编辑后
		if (moduleId === tablie_id) {
			// let local_rate_table_data = props.createBodyAfterEventData(this.pageId, this.formId, moduleId, moduleId, key, changedrows, i);
			//轻量化改造表体编辑后事件
			let local_rate_table_data = buildLightBodyAfterEditData(
				props,
				this.pageId,
				this.formId,
				this.tableId,
				key,
				changedrows,
				i,
				true
			);
			let local_rate_table_newvalue = local_rate_table_data.changedrows[0].newvalue.value;
			let local_rate_table_oldvalue = local_rate_table_data.changedrows[0].oldvalue.value;
			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'body',
				cardbody: local_rate_table_data
			}
			if (local_rate_table_newvalue != local_rate_table_oldvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								//轻量化直接返回编辑后的当前行数据update即可
								props.cardTable.updateDataByRowId(this.tableId, res.data[this.tableId]);
								// if (res.data.head) {
								// 	props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								// }
								// if (res.data.body) {
								// 	props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								// }
							} else {
								//清空数据
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}

	}
	//票据类型
	else if (key === 'note_type') {
		//form中编辑后事件
		if (moduleId === form_id) {
			//1-动态修改票据号字段信息
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_val = value.value;
			if (note_type_val) {
				ajax({
					url: '/nccloud/cmp/pub/noteTypeHandler.do',
					data: { pk: note_type_val },
					success: (res) => {
						NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
					}
				});
			}
		}
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			//1-动态修改票据号字段信息
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_tabl_val = value.refpk;
			if (note_type_tabl_val) {
				ajax({
					url: '/nccloud/cmp/pub/noteTypeHandler.do',
					data: { pk: note_type_tabl_val },
					success: (res) => {
						NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
					}
				});
				//清除相应行的票据号的值
				props.cardTable.setValByKeyAndIndex(this.tableId, i, 'note_no', { value: null, display: null });
			}
		}
	}
	//交易对象类型
	else if (key === 'objecttype') {
		//修改对象角色，自动清空付款银行账号和客户档案信息
		if (moduleId == form_id) {

			let objecttypedata = props.createHeadAfterEventData(page_id, moduleId, tablie_id, moduleId, key, value);
			let objecttype_newvalue = objecttypedata.newvalue.value;
			let objecttype_newdisplay = objecttypedata.newvalue.display;
			let objecttype_oldvalue = objecttypedata.oldvalue.value;
			if (!objecttype_newvalue) {
				//清空下拉框
				objecttype_newvalue = null;
				objecttype_newdisplay = null;
			}
			if (objecttype_newvalue != objecttype_oldvalue) {
				//清空付款银行账号和客户档案
				props.form.setFormItemsValue(moduleId, { 'pk_oppaccount': { display: null, value: null } });//付款银行
				props.form.setFormItemsValue(moduleId, { 'pk_customer': { display: null, value: null } });//客户
				props.form.setFormItemsValue(moduleId, { 'customername': { display: null, value: null } });//客户名称
				props.form.setFormItemsValue(moduleId, { 'pk_supplier': { display: null, value: null } });//供应商
				props.form.setFormItemsValue(moduleId, { 'suppliername': { display: null, value: null } });//供应商名称
				let total_Num = props.cardTable.getNumberOfRows(tablie_id);//表体table行数
				for (let n = 0; n < total_Num; n++) {
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'pk_oppaccount', { value: null, display: null });//给表体币种字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'oppaccountopenbank', { value: null, display: null });//给表体付款银行名称字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'oppaccountcode', { value: null, display: null });//给表体付款银行账户编码字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'objecttype', { value: objecttype_newvalue, display: objecttype_newdisplay });//给表体币种字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'pk_customer', { value: null, display: null });//给表体币种字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'customername', { value: null, display: null });//给表体币种字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'pk_supplier', { value: null, display: null });//给表体币种字段赋值
					props.cardTable.setValByKeyAndIndex(tablie_id, n, 'suppliername', { value: null, display: null });//给表体币种字段赋值
				}
				//1-动态修改付款银行账号
				ObjectTypeHandle.call(this, props, moduleId, objecttype_newvalue);
			}
		}

		if (moduleId == tablie_id) {

			let objecttype_table_data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
			let objecttype_table_newvalue = objecttype_table_data.changedrows[0].newvalue.value;
			let objecttype_table_display = objecttype_table_data.changedrows[0].newvalue.display;
			if (!objecttype_table_display) {
				objecttype_table_display = objecttype_table_newvalue;
			}
			let objecttype_table_oldvalue = objecttype_table_data.changedrows[0].oldvalue.value;
			if (!objecttype_table_newvalue) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'objecttype', { value: null, display: null });//给表体币种字段赋值
			} else {
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'objecttype', { value: objecttype_table_newvalue, display: objecttype_table_display });//给表体币种字段赋值
			}
			if (objecttype_table_newvalue != objecttype_table_oldvalue) {

				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_oppaccount', { value: null, display: null });//给表体币种字段赋值
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'oppaccountopenbank', { value: null, display: null });//给表体币种字段赋值
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'oppaccountcode', { value: null, display: null });//给表体币种字段赋值
				//暂时先去掉清空操作
				// props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_customer', { value: null, display: null });//给表体币种字段赋值
				// props.cardTable.setValByKeyAndIndex(moduleId, i, 'customername', { value: null, display: null });//给表体币种字段赋值
				// props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_supplier', { value: null, display: null });//给表体币种字段赋值
				// props.cardTable.setValByKeyAndIndex(moduleId, i, 'suppliername', { value: null, display: null });//给表体币种字段赋值
				//1-动态修改付款银行账号
				ObjectTypeHandle.call(this, props, moduleId, objecttype_table_newvalue);
			}

		}

	}
	//票据号
	else if (key === 'note_no') {
		//表头编辑后：表体没有行数自动增行，赋值，如果有行数，第一行赋值即可
		if (moduleId === form_id) {
			let cardTable_rows = props.cardTable.getNumberOfRows(this.tableId);//表体table行数
			let head_noteno_data = props.createHeadAfterEventData(this.pageId, moduleId, this.tableId, moduleId, key, value);
			let head_noteno_newvalue = head_noteno_data.newvalue.value;
			let head_noteno_oldvalue = head_noteno_data.oldvalue.value;
			if (cardTable_rows == 0 && head_noteno_newvalue) {//表体无相同票据号数据
				checkNoteno.call(this, head_noteno_newvalue);
			} else if (head_noteno_newvalue) {//表体有相同票据号数据
				checkNoteno.call(this, head_noteno_newvalue);
			} else {
				return;
			}
			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'head',
				cardhead: head_noteno_data
			}
			if (head_noteno_newvalue != head_noteno_oldvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								if (res.data.head) {
									props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								}
								if (res.data.body) {
									props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
							}
						}
					}
				});

			}
		}
		//表体编辑后
		if (moduleId == tablie_id) {
			// let noteno_table_data = props.createBodyAfterEventData(this.pageId, this.formId, moduleId, moduleId, key, changedrows, i);
			//轻量化改造表体编辑后事件
			let noteno_table_data = buildLightBodyAfterEditData(
				props,
				this.pageId,
				this.formId,
				this.tableId,
				key,
				changedrows,
				i,
				true
			);
			let noteno_table_newvalue = noteno_table_data.changedrows[0].newvalue.value;
			let noteno_table_oldvalue = noteno_table_data.changedrows[0].oldvalue.value;
			let data = {
				key: key,
				pageid: this.pageId,
				areaCode: 'body',
				cardbody: noteno_table_data
			}
			if (noteno_table_newvalue != noteno_table_oldvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								//轻量化直接返回编辑后的当前行数据update即可
								props.cardTable.updateDataByRowId(this.tableId, res.data[this.tableId]);
								// if (res.data.head) {
								// 	props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								// }
								// if (res.data.body) {
								// 	props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								// }
							} else {
								//清空数据
								props.form.EmptyAllFormValue(this.formId);
								props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}
	}
	//客户
	else if (key === 'pk_customer') {
		//表头[客户选择然后自动填写付款银行账号]
		if (moduleId === form_id) {
			let pk_customer = props.createHeadAfterEventData(page_id, moduleId, tablie_id, moduleId, key, value);
			let pk_customer_newvalue = pk_customer.newvalue.value;
			let pk_customer_oldvalue = pk_customer.oldvalue.value;
			if (pk_customer_newvalue && (pk_customer_newvalue != pk_customer_oldvalue)) {
				let data = {
					pk: pk_customer_newvalue,
				}
				ajax({
					url: '/nccloud/cmp/pub/getDefaultBankAcc.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								props.form.setFormItemsValue(moduleId, { 'pk_oppaccount': { display: res.data.code, value: res.data.pk_bankaccsub } });//付款银行账号
								props.cardTable.setColValue(tablie_id, 'pk_oppaccount', { value: res.data.pk_bankaccsub, display: res.data.code });
							}
						}
					}
				});
			}
		} else {//表体
			let pk_customer = props.createBodyAfterEventData(this.pageId, this.formId, moduleId, moduleId, key, changedrows, i);
			let pk_customer_newvalue = pk_customer.changedrows[0].newvalue.value;
			let pk_customer_oldvalue = pk_customer.changedrows[0].oldvalue.value;
			if (pk_customer_newvalue && (pk_customer_newvalue != pk_customer_oldvalue)) {
				let data = {
					pk: pk_customer_newvalue,
				}
				ajax({
					url: '/nccloud/cmp/pub/getDefaultBankAcc.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_oppaccount', { value: res.data.pk_bankaccsub, display: res.data.code });//给表体币种字段赋值
							}
						}
					}
				});
			}
		}
	}
	//供应商
	else if (key === 'pk_supplier') {
		//表头
		if (moduleId === form_id) {
			let pk_supplier = props.createHeadAfterEventData(page_id, moduleId, tablie_id, moduleId, key, value);
			let pk_supplier_newvalue = pk_supplier.newvalue.value;
			let pk_supplier_oldvalue = pk_supplier.oldvalue.value;
			if (pk_supplier_newvalue && (pk_supplier_newvalue != pk_supplier_oldvalue)) {
				let data = {
					pk: pk_supplier_newvalue,
				}
				ajax({
					url: '/nccloud/cmp/pub/getDefaultBankAcc.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								props.form.setFormItemsValue(moduleId, { 'pk_oppaccount': { display: res.data.code, value: res.data.pk_bankaccsub } });//付款银行账号
								props.cardTable.setColValue(tablie_id, 'pk_oppaccount', { value: res.data.pk_bankaccsub, display: res.data.code });
							}
						}
					}
				});
			}
		} else {//表体
			let pk_supplier = props.createBodyAfterEventData(this.pageId, this.formId, moduleId, moduleId, key, changedrows, i);
			let pk_supplier_newvalue = pk_supplier.changedrows[0].newvalue.value;
			let pk_supplier_oldvalue = pk_supplier.changedrows[0].oldvalue.value;
			if (pk_supplier_newvalue && (pk_supplier_newvalue != pk_supplier_oldvalue)) {
				let data = {
					pk: pk_supplier_newvalue,
				}
				ajax({
					url: '/nccloud/cmp/pub/getDefaultBankAcc.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_oppaccount', { value: res.data.pk_bankaccsub, display: res.data.code });//给表体币种字段赋值
							}
						}
					}
				});
			}
		}
	}
	//结算方式
	else if (key === 'pk_balatype') {

	}
	//付款银行账号
	else if (key === 'pk_oppaccount') {
		if (moduleId === tablie_id) {
			let table_pk_oppaccount = value.refpk;
			let table_objtype = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'objecttype');//对象交易类型
			if (table_objtype) {
				table_objtype = table_objtype.value;
				if (table_objtype == '4') {
					//散户:对方银行账户编码
					props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountcode', { value: table_pk_oppaccount, display: table_pk_oppaccount });//给表体字段赋值
				} else {
					//非散户
					//分别给相应字段赋值，根据银行账号返回json数据进行赋值
					// 如果修改付款账号信息，删除了收款账号的话，应当删除其他信息
					// props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountname', { value: null, display: null });//给表体字段赋值
					// props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountcode', { value: null, display: null });//给表体字段赋值
					// props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountopenbank', { value: null, display: null });//给表体字段赋值
					// pk_currtype_from_account=pk_currtype
				}
			} else {
				// 如果修改付款账号信息，删除了收款账号的话，应当删除其他信息
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountname', { value: null, display: null });//给表体字段赋值
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountcode', { value: null, display: null });//给表体字段赋值
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountopenbank', { value: null, display: null });//给表体字段赋值
			}
		}

	}
	//收款银行账号
	else if (key === 'pk_account') {

	}
	//表头和表体联动:增加pk_org给表体数据，保证保存和升级权限校验过去。
	if (key === 'pk_balatype' || key === 'pk_account' || key === 'rec_primal' ||
		key === 'note_no' || key === 'mon_account' || key === 'objecttype' ||
		key === 'pk_customer' || key === 'pk_supplier' || key === 'pk_org' || key === 'pk_pcorg' ||
		key === 'pk_busiman' || key === 'pk_dept' || key === 'pk_group' || key === 'creator' ||
		key === 'creationtime' || key === 'bill_date'
		|| key === 'pk_oppaccount') {

		if (moduleId === form_id) {
			//表头联动表体第一行
			if (props.form.getFormItemsValue(moduleId, key)) {
				let currencyFormVal = props.form.getFormItemsValue(moduleId, key).value;
				let currencyFormDly = props.form.getFormItemsValue(moduleId, key).display;
				if (currencyFormVal && currencyFormDly) {
					props.cardTable.setColValue(tablie_id, key, { value: currencyFormVal, display: currencyFormDly });
				} else if (currencyFormVal && !currencyFormDly) {
					props.cardTable.setColValue(tablie_id, key, { value: currencyFormVal, display: currencyFormVal });
				} else {
					props.cardTable.setColValue(tablie_id, key, { value: null, display: null });
				}
			}
		}
	}


}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/