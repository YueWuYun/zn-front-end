/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { NoteTypeHandle } from "../../util/ReferChangeEvent.js";
import { DirectEcdsEdit } from "../buttonClick/EditControlUtil.js";
import { buildLightBodyAfterEditData } from "../../../../../tmpub/pub/util/index";
import { afterTableEvent } from './afterTableEvent.js';
/**
 * [结算]-编辑后事件
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

	//console.log(props, moduleId, key, value, changedrows, i, s, g)
	//2004-zhanghjr-begin:表体字段modifyflag字段赋值
	afterTableEvent.call(this,props, moduleId, key, value, changedrows, i, s, g);
	//2004-zhanghjr-end

	let tablie_id = Templatedata.card_tableid;
	let table_edit = Templatedata.card_tableid_edit;
	let form_id = Templatedata.card_formid;
	let page_id = Templatedata.card_pageid;
	//收款原币金额编辑后事件
	if (key === 'receive') {
		//table中编辑后事件
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			let table_pk_oppaccount = value.refpk;
			//实付组织本币汇率
			let zuzhibenbihuilv = props.cardTable.getValByKeyAndIndex(moduleId, i, 'paylocalrate_last');
			//let zuzhibenbihuilv2 = changedrows'paylocalrate_last';

			//实付套汇汇率
			let taohuihuilv = props.cardTable.getValByKeyAndIndex(moduleId, i, 'changerate');

			//子表-->实付原币金额：pay_last     实付本币金额：paylocal_last
			//汇率：
			//主表-->原币金额：primal
			//联动赋值
			props.cardTable.setValByKeyAndIndex(tablie_id, i, 'oppaccountcode', { value: table_pk_oppaccount, display: table_pk_oppaccount });//给表体字段赋值
			// 联动赋值：收款本币金额=收款原币金额*本币汇率
			let money_value = value;
			let money_rate = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'localrate');// 本币汇率
			if (money_value && money_rate && money_rate.value) {
				money_rate = money_rate.value;
				let money_local_money = (money_value * money_rate).toFixed(2);//保留2位小数
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'receivelocal', { value: money_local_money, display: money_local_money });//给收款本币金额字段赋值
			}
		}
	}
	//付款原币金额编辑后事件
	if (key === 'pay') {
		//table中编辑后事件
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			//let table_pk_oppaccount = value.refpk;
			//实付组织本币汇率
			let zuzhibenbihuilv = props.cardTable.getValByKeyAndIndex(moduleId, i, ['paylocalrate_last']);
			let currtype_table_data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
			let benbihuilv = currtype_table_data.card.body.table_settle_detail.rows["0"].values.paylocalrate_last;

			//实付套汇汇率
			let taohuihuilv = props.cardTable.getValByKeyAndIndex(moduleId, i, 'changerate');
			//子表-->实付原币金额：pay_last     实付本币金额：paylocal_last
			//汇率：
			//主表-->原币金额：primal
			let paylast = Number(value);
			let paymny = value;
			let pay_last = (Number(value) / Number(benbihuilv.value)).toFixed(2);
			//联动赋值
			/**
			 * 付款原币金额：pay；
			 * 付款组织本币金额：paylocal = pay
			 * 需要联动----->
			 * 组织本币汇率：paylocalrate_last
			 * 实付套汇汇率：changerate
			 * 子表-->
			 * 实付原币金额：pay_last = pay/汇率    
			 * 实付本币金额：paylocal_last = pay
			 * 汇兑差额：0
			 */
			props.cardTable.setValByKeyAndIndex(tablie_id, i, 'pay_last', { value: pay_last, display: pay_last });//给表体字段赋值			
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'paylocal_last', { value: paymny, display: paymny });
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'paylocal', { value: paymny, display: paymny });

		}
	}
	//1909支持网：实付币种修改，需要联动汇率--保持和nc一致
	const eventKey = [
		"pk_currtype_last",//实付币种
		"pay_last"//实付原币金额
	];if (eventKey.includes(key)) {
		//table中编辑后事件[操作表格该行i]
		if (moduleId === tablie_id || moduleId === table_edit) {
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
			if ((currtype_table_newvalue != currtype_table_oldvalue)) {
				ajax({
					url: '/nccloud/cmp/settlement/afterevent.do',
					data: data,
					success: (res) => {
						if (res.success) {
							if (res.data) {
								//轻量化直接返回编辑后的当前行数据update即可
								props.cardTable.updateDataByRowId(this.tableId, res.data[this.tableId]);
								//币种关联本币汇率字段编辑性
								// tableRateEditinfo.call(this, res.data.userjson, i);
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
	if (key === 'rec_primal') {
		//收款原币金额,仅限table中操作不涉及form
		//录入原币金额后，应自动计算单价price /数量rec_count/pay_count
		//price = rec_primal/rec_count
		let money_value = value;
		let money_currtype = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'pk_currtype');
		let money_rate = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'local_rate');
		if (money_currtype && money_currtype.value && money_value && money_rate && money_rate.value) {
			money_currtype = money_currtype.value;
			money_rate = money_rate.value;
			let money_local_money = (money_value * money_rate).toFixed(2);//保留2位小数
			props.cardTable.setValByKeyAndIndex(tablie_id, i, 'rec_local', { value: money_local_money, display: money_local_money });//给表体字段赋值
		}

		//第一行数据赋值给form
		// let money_rec_primal = props.cardTable.getValByKeyAndIndex(tablie_id, 0, 'rec_primal');
		// let money_rec_local = props.cardTable.getValByKeyAndIndex(tablie_id, 0, 'rec_local');
		// if (money_rec_primal && money_rec_primal.value && money_rec_local && money_rec_local.value) {
		// 	props.form.setFormItemsValue(form_id, { 'primal_money': { display: money_rec_primal.value, value: money_rec_primal.value } });//原币金额
		// 	props.form.setFormItemsValue(form_id, { 'local_money': { display: money_rec_local.value, value: money_rec_local.value } });//本币金额
		// }

	}
	//本币汇率
	if (key === 'local_rate') {

		//form中汇率编辑后事件
		if (moduleId === form_id) {
			let local_rate_value = value.value;
			let primal_money_form = props.form.getFormItemsValue(moduleId, 'primal_money').value;
			let primal_money_form_dly = props.form.getFormItemsValue(moduleId, 'primal_money').display;
			if (primal_money_form && local_rate_value && primal_money_form_dly) {
				let local_money_form = (primal_money_form * local_rate_value).toFixed(2);
				if (local_money_form) {
					//form中赋值
					props.form.setFormItemsValue(moduleId, { 'local_money': { display: local_money_form, value: local_money_form } });//原币金额
				}
			}
			let money_rec_primal = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'rec_primal');
			if (money_rec_primal && money_rec_primal.value) {
				let local_money_form = (money_rec_primal.value * local_rate_value).toFixed(2);
				props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'rec_local', { value: local_money_form, display: local_money_form });//给表体字段赋值
			}

		}
		//table中编辑后
		if (moduleId === tablie_id) {
			//
			let local_rate_value_table = value;
			//原币金额
			let table_rec_primal = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'rec_primal');
			if (table_rec_primal && table_rec_primal.value) {
				let local_money_table = (table_rec_primal.value * local_rate_value_table).toFixed(2);
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'rec_local', { value: local_money_table, display: local_money_table });//给表体字段赋值
			}
		}

	}
	//付款银行账号
	if (key === 'pk_oppaccount') {
		//1、散户的时候将对方银行账户写入对方银行账户编码中;2、非散户的时候，银行账户币种回写到表体
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
	//本方银行账号(本方账户)
	if (key === 'pk_account') {
		//1、自定给accountnum  本方银行账号  
		if (moduleId === tablie_id) {
			let direction = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'direction');
			//cmp_zhanghjr_begin:任意方向的都可以修改本方账号
			if (direction && direction.value) {
				let table_pk_account = value.refcode;//账号code
				console.log('本方账号=', table_pk_account);
				let values = value.values;
				if (values) {
					let accnum = values['bd_bankaccsub.accnum'] && values['bd_bankaccsub.accnum'].value;
					console.log('本方账号accnum=', accnum);
					if (accnum) {
						props.cardTable.setValByKeyAndIndex(tablie_id, i, 'accountnum', { value: accnum, display: accnum });//给表体字段赋值
					} else {
						props.cardTable.setValByKeyAndIndex(tablie_id, i, 'accountnum', { value: null, display: null });//给表体字段赋值
					}
				}
			}
			//cmp_zhanghjr_end
		}
	}
	//票据类型[暂时去掉影像其他功能]
	if (key === 'pk_notetype') {
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
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
						DirectEcdsEdit.call(this, res.data.e_note,i);//直联电票编辑性控制
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
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						NoteTypeHandle.call(this, props, moduleId, res.data.note_type);
						DirectEcdsEdit.call(this, res.data.e_note,i);//直联电票编辑性控制
					}
				});
			}
		}
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/