/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {

	console.log(props, moduleId, key, value, changedrows, i, s, g)

	let tablie_id = Templatedata.card_tableid;
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
	//实付币种修改，需要联动汇率
	if (key === 'pk_currtype_last') {
		let currtype = value;
		let currcode = value.refcode;  //币种code
		let currname = value.refname;  //币种名称
		let currpk = value.refpk;    //币种pk
		let currhuilv = value.values.currdigit.value;  //貌似是精度


		//此处去根据币种查询汇率
		//清除table选择的收款银行信息
		// props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', { value: null, display: null });//给表体字段赋值
		// props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_oppaccount', { value: null, display: null });//给表体字段赋值

		let table_org = props.form.getFormItemsValue(form_id, 'pk_org').value;
		let table_org_dly = props.form.getFormItemsValue(form_id, 'pk_org').display;
		let table_currtype = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype');

		if (table_currtype && table_currtype.display) {
			//请求后台获取币种和汇率
			let currtype_table_data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
			let currtype_table_newvalue = currtype_table_data.changedrows[0].newvalue.value;
			let currtype_table_oldvalue = currtype_table_data.changedrows[0].oldvalue.value;
			if (currtype_table_newvalue != currtype_table_oldvalue) {
				// 此处将pk_currtype字段更换为pk_currtype_last字段的值，因为后台取币种取的pk_currtype，
				// 而结算字表取的是pk_currtype_last
				let currtype = currtype_table_data.card.body.table_settle_detail.rows["0"].values.pk_currtype;
				let currtype_last = currtype_table_data.card.body.table_settle_detail.rows["0"].values.pk_currtype_last;
				if (currtype.value != currtype_last.value) {
					currtype_table_data.card.body.table_settle_detail.rows["0"].values.pk_currtype_last = currtype;
					currtype_table_data.card.body.table_settle_detail.rows["0"].values.pk_currtype = currtype_last;
				}
				ajax({
					url: '/nccloud/cmp/recbill/recbillcurrtypebodyafterevent.do',
					data: currtype_table_data,
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						if (res.success) {
							if (res.data) {
								if (res.data.head) {
									//页面渲染
									// props.form.setAllFormValue({ [form_id]: res.data.head[form_id] });
									//币种保持不变
									//props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: form_currtype, display: form_currtype_dly });//给表体币种字段赋值
								}
								if (res.data.body) {
									/**
									 * 本币：是该组织的本位币，如在中国就是人民币
									 * 原币：是单据选择的支付币种，
									 * 
									 * 
									 * 付款原币金额：pay；
									 * 付款组织本币金额(需要组织币种，和业务币种的汇率)：paylocal * (paylocal/pay)	
									 * 需要联动----->
									 * 实付组织本币汇率：paylocalrate_last
									 * 实付套汇汇率：changerate
									 * 子表-->
									 * 实付币种：currtype_last
									 * 实付原币金额：pay_last = pay * 汇率    
									 * 实付组织本币金额：paylocal_last = pay_last * 汇率
									 * 汇兑差额： changebalance = paylocal_last - paylocal
									 * 实付全局本币金额: globalpaylocal_last
									 */
									//付款原币金额
									let paymny = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pay').value;
									let paylocal = props.cardTable.getValByKeyAndIndex(moduleId, i, 'paylocal').value;
									let paylocalrate = Number(paylocal) / Number(paymny);
									//返回币种汇率
									let table_rate = res.data.body[moduleId].rows[i].values.local_rate;
									//计算汇率金额
									if (table_rate && table_rate.value) {
										//实付原币金额
										let actmny_last = (Number(paymny) * Number(table_rate.value)).toFixed(2);
										//汇兑差额
										//实付组织本币金额
										let paylocal_last = (Number(paymny) * Number(paylocalrate)).toFixed(2);
										let changebalancemny = paylocal_last - paymny;
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'paylocal_last', { value: paylocal_last, display: paylocal_last });
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'paylocal', { value: paymny, display: paymny });
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'paylocalrate_last', { value: table_rate.value, display: table_rate.value });
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'changerate', { value: table_rate.value, display: table_rate.value });
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'pay_last', { value: actmny_last, display: actmny_last });
										props.cardTable.setValByKeyAndIndex(moduleId, i, 'changebalance', { value: changebalancemny, display: changebalancemny });
									}


									//所选币种
									// let or_table_val = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype').value;
									// let or_table_dly = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype').display;

									// //props.cardTable.setTableData(moduleId, res.data.body[moduleId]);
									// //返回本币币种
									// let re_table_currtype = res.data.body[moduleId].rows[i].values.pk_currtype.value;
									// //返回币种汇率
									// //let re_table_rate = res.data.body[moduleId].rows[i].values.local_rate;
									// //返回的原币金额，不需要
									// let re_table_localmoney = res.data.body[moduleId].rows[i].values.rec_local;

									// //给表体币种字段赋值
									// if (re_table_rate && re_table_rate.value) {
									// 	props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', { value: re_table_rate.value, display: re_table_rate.value });
									// }
									// //给表体币种字段赋值
									// if (re_table_localmoney && re_table_localmoney.value) {
									// 	props.cardTable.setValByKeyAndIndex(moduleId, i, 'rec_local', { value: re_table_localmoney.value, display: re_table_localmoney.value });
									// }

									// if (or_table_val == re_table_currtype) {
									// 	//1.组织当前币种为组织本币时，组织本币汇率恒等于1,且不可编辑
									// 	props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', false);
									// } else {
									// 	//2,交易币种和本币不一致，后台返回币种，并且可以编辑
									// 	props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', true);
									// }

								}
							} else {
								// props.form.setAllFormValue({ [moduleId]: { rows: [] } });
								// props.cardTable.setTableData(tablie_id, { rows: [] });
							}
						}
					}
				});
			}
		}
	}
	//组织变换编辑后事件
	if (key === 'pk_org') {
		let orgid = value.value;
		let ll = props.cardTable.getNumberOfRows(tablie_id);//表体table行数
		let form_org_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype').value;
		let form_org_currtype_dly = props.form.getFormItemsValue(moduleId, 'pk_currtype').display;
		if (!form_org_currtype_dly) {
			form_org_currtype = null;
		}
		if (Object.keys(orgid).length != 0) {

			props.cardTable.setValByKeyAndIndex(tablie_id, 0, key, { value: orgid, display: orgid });//给表体字段赋值
			//请求后台获取币种和汇率

			let data = props.createHeadAfterEventData(page_id, moduleId, tablie_id, moduleId, key, value);
			let newvalue = data.newvalue.value;
			let oldvalue = data.oldvalue.value;
			if (newvalue != oldvalue) {
				ajax({
					url: '/nccloud/cmp/recbill/recbillorgafterevent.do',
					data: data,
					async: false,//1909新增:编辑后事件改为同步ajax请求
					success: (res) => {
						if (res.success) {
							if (res.data) {
								if (res.data.head) {
									let currtype = res.data.head[moduleId].rows[0].values.pk_currtype.value;
									let currtypedly = res.data.head[moduleId].rows[0].values.pk_currtype.display;
									//页面渲染
									props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });

									if (!form_org_currtype_dly) {
										//没选币种-填写上和本币相同的币种
										props.form.setFormItemsValue(moduleId, { 'pk_currtype': { display: currtypedly, value: currtype } });
										props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'pk_currtype', { value: currtype, display: currtypedly });//给表体字段赋值
										props.form.setFormItemsDisabled(moduleId, { 'local_rate': true });
									} else {
										//选择了币种-不错变化
										props.form.setFormItemsValue(moduleId, { 'pk_currtype': { display: form_org_currtype_dly, value: form_org_currtype } });
										props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'pk_currtype', { value: form_org_currtype, display: form_org_currtype_dly });//给表体字段赋值
									}
								}
								if (res.data.body) {
									props.cardTable.setTableData(tablie_id, res.data.body[tablie_id]);

								}
							}

						}
					}
				});
			}

		}

	}

	//币种
	if (key === 'pk_currtype') {
		// let a = props.CacheTools.clear();//清除缓存【不好用】
		//form中编辑后事件

		if (moduleId === form_id) {

			//清除form选择的收款银行信息
			props.form.setFormItemsValue(moduleId, { 'pk_account': { display: null, value: null } });//交易汇率
			//选择的org和币种
			let form_org = props.form.getFormItemsValue(moduleId, 'pk_org').value;
			let form_org_dly = props.form.getFormItemsValue(moduleId, 'pk_org').display;
			let form_pk_currtype = props.form.getFormItemsValue(moduleId, 'pk_currtype').value;
			let form_pk_currtype_dly = props.form.getFormItemsValue(moduleId, 'pk_currtype').display;

			// if (!form_org_dly) {
			// 	toast({ color: 'warning', content: '组织未选择' });
			// }
			if (form_pk_currtype_dly) {

				//请求后台获取币种和汇率
				let currtype_data = props.createHeadAfterEventData('36070RBM_C01', moduleId, tablie_id, moduleId, key, value);
				let currtype_newvalue = currtype_data.newvalue.value;
				let currtype_oldvalue = currtype_data.oldvalue.value;
				if (currtype_newvalue != currtype_oldvalue) {
					ajax({
						url: '/nccloud/cmp/recbill/recbillcurrtypeafterevent.do',
						data: currtype_data,
						async: false,//1909新增:编辑后事件改为同步ajax请求
						success: (res) => {
							if (res.success) {
								if (res.data) {
									if (res.data.head) {
										//页面渲染[不能用这用方式，不然没法控制form的显隐性]
										// props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
										//币种保持不变
										props.form.setFormItemsValue(moduleId, { 'pk_currtype': { display: form_pk_currtype_dly, value: form_pk_currtype } });

										//返回的是组织对应的本币币种而非选择交易币种
										let re_form_currtype = res.data.head[moduleId].rows[0].values.pk_currtype.value;//后台返回币种
										let re_form_currtypedly = res.data.head[moduleId].rows[0].values.pk_currtype.display;//后台返回币种display

										let re_form_rate = res.data.head[moduleId].rows[0].values.local_rate.value;//返回的币种汇率
										let re_form_loacmoney = res.data.head[moduleId].rows[0].values.local_money.value;//返回的原币金额
										//赋值form
										if (re_form_rate) {
											props.form.setFormItemsValue(moduleId, { 'local_rate': { display: re_form_rate, value: re_form_rate } });
											props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'local_rate', { value: re_form_rate, display: re_form_rate });//给表体字段赋值
										}
										if (re_form_loacmoney) {
											props.form.setFormItemsValue(moduleId, { 'local_money': { display: re_form_loacmoney, value: re_form_loacmoney } });
											props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'rec_local', { value: re_form_loacmoney, display: re_form_loacmoney });//给表体字段赋值
										}



										if (re_form_currtype == form_pk_currtype) {
											//如果填写的币种和组织本币一致
											//1.组织当前币种为组织本币时，组织本币汇率恒等于1,且不可编辑
											props.form.setFormItemsDisabled(moduleId, { 'local_rate': true });
											props.cardTable.setEditableByIndex(tablie_id, 0, 'local_rate', false);


										} else {
											//交易币种和本币不一致，后台返回币种，并且可以编辑
											props.form.setFormItemsDisabled(moduleId, { 'local_rate': false });//汇率可以编辑
											props.cardTable.setEditableByIndex(tablie_id, 0, 'local_rate', true);

										}


									}
									if (res.data.body) {

										// props.cardTable.setTableData(tablie_id, res.data.body[tablie_id]);//不能用这中方式，影响table的显隐性
										props.cardTable.setValByKeyAndIndex(tablie_id, 0, key, { value: form_pk_currtype, display: form_pk_currtype_dly }, {});//给表体币种字段赋值
									}
								} else {
									// props.form.setAllFormValue({ [moduleId]: { rows: [] } });
									// props.cardTable.setTableData(tablie_id, { rows: [] });

								}

							}
						}
					});
				}


			}

		}
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			//清除table选择的收款银行信息
			props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_account', { value: null, display: null });//给表体字段赋值

			let table_org = props.form.getFormItemsValue(form_id, 'pk_org').value;
			let table_org_dly = props.form.getFormItemsValue(form_id, 'pk_org').display;
			let table_currtype = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype');

			// if (!table_org_dly) {
			// 	toast({ color: 'warning', content: '组织未选择' });
			// }
			if (table_currtype && table_currtype.display) {
				//请求后台获取币种和汇率
				let currtype_table_data = props.createBodyAfterEventData('36070RBM_C01', form_id, moduleId, moduleId, key, changedrows);
				let currtype_table_newvalue = currtype_table_data.changedrows[0].newvalue.value;
				let currtype_table_oldvalue = currtype_table_data.changedrows[0].oldvalue.value;
				if (currtype_table_newvalue != currtype_table_oldvalue) {
					ajax({
						url: '/nccloud/cmp/recbill/recbillcurrtypebodyafterevent.do',
						data: currtype_table_data,
						async: false,//1909新增:编辑后事件改为同步ajax请求
						success: (res) => {
							if (res.success) {
								if (res.data) {
									if (res.data.head) {
										//页面渲染
										// props.form.setAllFormValue({ [form_id]: res.data.head[form_id] });
										//币种保持不变
										//props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: form_currtype, display: form_currtype_dly });//给表体币种字段赋值
									}
									if (res.data.body) {
										//所选币种
										let or_table_val = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype').value;
										let or_table_dly = props.cardTable.getValByKeyAndIndex(moduleId, i, 'pk_currtype').display;

										//props.cardTable.setTableData(moduleId, res.data.body[moduleId]);
										let re_table_currtype = res.data.body[moduleId].rows[0].values.pk_currtype.value;//返回本币币种
										let re_table_rate = res.data.body[moduleId].rows[0].values.local_rate;//返回币种汇率
										let re_table_localmoney = res.data.body[moduleId].rows[0].values.rec_local;//返回币种汇率

										if (re_table_rate && re_table_rate.value) {
											props.cardTable.setValByKeyAndIndex(moduleId, i, 'local_rate', { value: re_table_rate.value, display: re_table_rate.value });//给表体币种字段赋值
										}
										if (re_table_localmoney && re_table_localmoney.value) {
											props.cardTable.setValByKeyAndIndex(moduleId, i, 'rec_local', { value: re_table_localmoney.value, display: re_table_localmoney.value });//给表体币种字段赋值
										}

										if (or_table_val == re_table_currtype) {
											//1.组织当前币种为组织本币时，组织本币汇率恒等于1,且不可编辑
											props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', false);
										} else {
											//2,交易币种和本币不一致，后台返回币种，并且可以编辑
											props.cardTable.setEditableByIndex(moduleId, i, 'local_rate', true);
										}

									}
								} else {
									// props.form.setAllFormValue({ [moduleId]: { rows: [] } });
									// props.cardTable.setTableData(tablie_id, { rows: [] });

								}

							}
						}
					});
				}

			}

		}

	}

	//收款原币金额,仅限table中操作不涉及form
	//录入原币金额后，应自动计算单价price /数量rec_count/pay_count
	//price = rec_primal/rec_count
	if (key === 'rec_primal') {
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

	//可以进行编辑的汇率
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
	//票据类型
	if (key === 'note_type') {
		//form中编辑后事件
		if (moduleId === form_id) {
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_val = value.value;
			let meta = props.meta.getMeta();
			if (note_type_val) {
				if (note_type_val === 'FBMTZ6E0000000000001' || note_type_val === 'FBMTZ6E0000000000002') {
					//票据大类为银行汇票或商业汇票时

				} else {
					//修改meta中字段的类型
					//修改meta中字段的类型:参照
					let metaArr = meta.mainform_recbill_01.items;
					metaArr.forEach((val) => {
						let code = val.attrcode;
						if (code === 'note_no') {
							val.itemtype = 'input';
							val.refcode = null;
						}
					});

					props.meta.setMeta(meta);
					props.renderItem('form', moduleId, 'note_no', null)
				}
			}




		}
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			//类型的票据大类为银行汇票或商业汇票时，票据号应该是参照型，
			//所选票据类型的票据大类为支票或其他时，票据号应该是备注型，可以手工录入。
			let note_type_tabl_val = value.refpk;
			let meta = props.meta.getMeta();
			if (note_type_tabl_val) {
				if (note_type_tabl_val === 'FBMTZ6E0000000000001' || note_type_tabl_val === 'FBMTZ6E0000000000002') {
					//票据大类为银行汇票或商业汇票时
					//修改meta中字段的类型
					//修改meta中字段的类型:参照
					// props.cardTable.setEditableByIndex(moduleId, 0, 'memo', false);

				} else {
					//修改meta中字段的类型
					//修改meta中字段的类型:参照
					let table_metaArr = meta.table_recbill_01.items;
					table_metaArr.forEach((val) => {
						let table_code = val.attrcode;
						if (table_code === 'note_no') {
							val.itemtype = 'input';
							val.refcode = null;
						}
					});

					props.meta.setMeta(meta);
					props.renderItem('table', moduleId, 'note_no', null);//重新加载区域json
				}
			}


		}

	}
	//交易对象类型【目前暂时不用动态增减字段】
	if (key === 'objecttype') {
		//根据交易对象类型的属性,选择调用客户或供应商的服务获取详细信息【参照修改】
		//动态修改客户参照--晓东

		// if (moduleId === form_id) {
		// 	let meta = props.meta.getMeta();
		// 	let form_metaArr = meta.mainform_recbill_01.items;
		// 	let obje_value = value.value;
		// 	if (obje_value == '0') {
		// 		//客户
		// 		props.form.setFormItemsValue(moduleId, { 'pk_supplier': { display: null, value: null } });//交易汇率
		// 		form_metaArr.forEach((val) => {
		// 			let form_code = val.attrcode;
		// 			if (form_code === 'pk_supplier') {
		// 				val.visible = false;
		// 			}
		// 		});
		// 	} else if (obje_value == "1") {
		// 		//供应商
		// 		props.form.setFormItemsValue(moduleId, { 'pk_customer': { display: null, value: null } });//交易汇率
		// 		form_metaArr.forEach((val) => {
		// 			let form_code = val.attrcode;
		// 			if (form_code === 'pk_supplier') {
		// 				val.visible = true;
		// 			}
		// 		});
		// 	}
		// 	props.meta.setMeta(meta);
		// 	props.renderItem('form', moduleId, 'pk_supplier', null);//重新加载区域json
		// }
		// if (moduleId === tablie_id) {
		// 	let talbe_meta = props.meta.getMeta();
		// 	let table_metaArr = talbe_meta.table_recbill_01.items;
		// 	let table_val = value;
		// 	if (table_val == '0') {
		// 		props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_supplier', { value: null, display: null });//给表体字段赋值
		// 		table_metaArr.forEach((val) => {
		// 			let table_code = val.attrcode;
		// 			if (table_code === 'pk_supplier') {
		// 				val.visible = false;
		// 			}
		// 		});
		// 	}
		// 	if (table_val == "1") {
		// 		props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_customer', { value: null, display: null });//给表体字段赋值
		// 		table_metaArr.forEach((val) => {
		// 			let table_code = val.attrcode;
		// 			if (table_code === 'pk_supplier') {
		// 				val.visible = true;
		// 			}
		// 		});
		// 	}
		// 	props.meta.setMeta(talbe_meta);
		// 	props.renderItem('table', moduleId, 'pk_supplier', null);//重新加载区域json
		// }

	}
	//票据号
	if (key === 'note_no') {
		//1 票据号是参照时，如果票据参照币种不为空，把票据参照币种赋值给单据的币种,设置票据金额
		//待完善
		//form中编辑后事件
		if (moduleId === form_id) {
			let form_note_no = value.value;
			if (form_note_no) {
				// 空白票据号
				props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'blanknote_no', { value: form_note_no, display: form_note_no });//给表体字段赋值
				// props.form.setFormItemsValue(moduleId, { 'blanknote_no': { display: form_note_no, value: form_note_no } });//汇率
			} else {
				props.cardTable.setValByKeyAndIndex(tablie_id, 0, 'blanknote_no', { value: null, display: null });//给表体字段赋值
			}
		}
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			let table_note_no = value;
			let ref_note_no = value.refpk;
			if (!table_note_no && ref_note_no) {
				table_note_no = ref_note_no;
			}
			if (table_note_no) {
				// 空白票据号
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'blanknote_no', { value: table_note_no, display: table_note_no });//给表体字段赋值
			} else {
				props.cardTable.setValByKeyAndIndex(tablie_id, i, 'blanknote_no', { value: null, display: null });//给表体字段赋值
			}
		}
	}
	//结算方式
	if (key === 'pk_balatype') {
		//根据表体结算方式设置资金类型
		//form中编辑后事件
		// let pk_bala_value = props.form.getFormItemsValue('mainform_recbill_01','pk_balatype').value;
		// let data = props.createHeadAfterEventData('36070RBM_C01', 'mainform_recbill_01', 'table_recbill_01',
		// moduleId, key, value);
		// ajax({
		// 	url: '/nccloud/cmp/recbill/recbillcurrtypechangeevent.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if (res.success) {
		// 			if (res.data) {
		// 				toast({ color: 'warning', content: 'ok' });
		// 			}

		// 		}
		// 	}
		// });

	}
	//付款银行账号
	if (key === 'pk_oppaccount') {
		//1、散户的时候将对方银行账户写入对方银行账户编码中;2、非散户的时候，银行账户币种回写到表体
		//table中编辑后事件
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			let table_pk_oppaccount = value.refpk;
			let table_objtype = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'objecttype');//对象交易类型

			let pk_currtype_from_account;
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
	if (key === 'pk_account') {
		//1、直接回显币种
		//table中编辑后事件
		//table中编辑后事件操作表格该行i
		if (moduleId === tablie_id) {
			let table_pk_account = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'pk_account').value;
			let table_pk_account_dly = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'pk_account').display;

			let table_obj_type = props.cardTable.getValByKeyAndIndex(tablie_id, i, 'objecttype');//对象交易类型

			let pk_currtype_table_account;
			if (table_obj_type && table_obj_type.value) {
				table_obj_type = table_obj_type.value;
				let pk_curr_type = value.values.pk_currtype;
				if (pk_curr_type && pk_curr_type.value) {
					//此刻币种没有翻译如果返回display就好了
					props.cardTable.setValByKeyAndIndex(tablie_id, i, 'pk_currtype', { value: pk_curr_type.value, display: pk_curr_type.value });//给表体字段赋值
				}

			}
		}

	}
	//表头和表体联动
	if (key === 'pk_currtype' || key === 'pk_balatype' || key === 'pk_account' || key === 'rec_primal' || key === 'note_type' ||
		key === 'note_no' || key === 'mon_account' || key === 'local_rate' || key === 'rec_local' || key === 'objecttype' ||
		key === 'pk_customer' || key === 'pk_supplier') {

		if (moduleId === form_id) {
			//表头联动表体第一行
			if (props.form.getFormItemsValue(moduleId, key)) {
				let currencyFormVal = props.form.getFormItemsValue(moduleId, key).value;
				let currencyFormDly = props.form.getFormItemsValue(moduleId, key).display;
				if (currencyFormVal && currencyFormDly) {
					let ll = props.cardTable.getNumberOfRows(tablie_id);//表体table行数
					props.cardTable.setValByKeyAndIndex(tablie_id, 0, key, { value: currencyFormVal, display: currencyFormDly });//给表体字段赋值
				}
			}
		}

		//表体修改联动表头修改
		// if (props.cardTable.getValByKeyAndIndex(tablie_id, 0, key)) {
		// 	let currencyTableVal = props.cardTable.getValByKeyAndIndex(tablie_id, 0, key).value;
		// 	let currencyTableDly = props.cardTable.getValByKeyAndIndex(tablie_id, 0, key).display;
		// 	let val = { display: currencyTableDly, value: currencyTableVal };
		// 	if(key === 'pk_currtype'){
		// 		props.form.setFormItemsValue(form_id,{ 'pk_currtype': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'pk_balatype'){
		// 		props.form.setFormItemsValue(form_id,{ 'pk_balatype': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'pk_account'){
		// 		props.form.setFormItemsValue(form_id,{ 'pk_account': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'rec_primal'){
		// 		props.form.setFormItemsValue(form_id,{ 'rec_primal': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'note_type'){
		// 		props.form.setFormItemsValue(form_id,{ 'note_type': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'note_no'){
		// 		props.form.setFormItemsValue(form_id,{ 'note_no': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'local_rate'){
		// 		props.form.setFormItemsValue(form_id,{ 'local_rate': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'rec_local'){
		// 		props.form.setFormItemsValue(form_id,{ 'rec_local': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'objecttype'){
		// 		props.form.setFormItemsValue(form_id,{ 'objecttype': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'pk_customer'){
		// 		props.form.setFormItemsValue(form_id,{ 'pk_customer': { display: currencyTableDly, value: currencyTableVal } });
		// 	}else
		// 	if(key === 'mon_account'){
		// 		props.form.setFormItemsValue(form_id,{ 'mon_account': { display: currencyTableDly, value: currencyTableVal } });
		// 	}	
		// }


	}



	if (key === 'pk_org_v') {

		let data = {
			nbcrcode: 'HO',
			pk_group: '0001A1100000000005T5',
			pk_org: value.value
		}
		// ajax({
		// 	url: '/nccloud/reva/revebill/contractfront.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if(res.success) {
		// 			let pk_org_v_value = res.data[1];
		// 			props.form.setFormItemsValue(moduleId, { vbillcode: pk_org_v_value });
		// 		}
		// 	}
		// });

	}

	if (key === 'dbilldate') {
		//表头编辑后事件
		// let data = props.createHeadAfterEventData('20521030', this.formId, this.tableId, moduleId, key, value);
		// ajax({
		// 	url: '/nccloud/reva/revebill/afteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if (res.data && res.data.head && res.data.head.head) {
		// 			let dealmny = res.data.head.head.rows[0].values.ndealtotalmny;
		// 			props.form.setFormItemsValue(moduleId, { ndealtotalmny: dealmny });
		// 		}
		// 	}
		// });
	}

	if (key === 'cmaterialvid') {
		let materialsNew = value;
		console.log(materialsNew)
		if (materialsNew && materialsNew.length > 1) {
			props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: materialsNew[0].refpk, display: materialsNew[0].refname });
			for (let i = 1; i < materialsNew.length; i++) {
				props.cardTable.addRow(moduleId);
				let ll = props.cardTable.getNumberOfRows(moduleId);
				props.cardTable.setValByKeyAndIndex(moduleId, ll - 1, key, { value: materialsNew[i].refpk, display: materialsNew[i].refname });
			}
		}
	}


	//表体编辑后事件
	if (key == 'fconfirmpoint') {
		let data = props.createBodyAfterEventData('20521030', this.formId, this.tableId, moduleId, key, changedrows);
		// ajax({
		// 	url: '/nccloud/reva/revebill/cardafteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		debugger
		// 		if (res.data && res.data.body && res.data.body[this.tableId]) {
		// 			let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
		// 			props.cardTable.setValByKeyAndRowNumber(moduleId, i+1,'npobnum',npobnum.value);
		// 		}
		// 	}
		// });
	}


}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/