/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';

import {
	app_id, module_id, base_url, button_limit, oid,
	list_search_id, list_table_id,
	card_page_id, card_from_id, card_fromtail_id, card_table_id,
	card_table_id_edit, card_table_id_browse, dataSource
} from '../../cons/constant.js';
import { beforeEvent } from './index';
import { changePkorgPRefer } from './index';
import { buildLightBodyAfterEditData, bodyRateEditOnAfterEdit } from "../../../../../tmpub/pub/util/index";
import { clsRowno } from "../../util/index";

let { NCMessage } = base;

export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g, isAutoSet) {
	// console.log(props, moduleId, key, value, changedrows, i, s, g)
	let table_id = card_table_id;
	let form_id = card_from_id;
	let page_id = card_page_id;

	let cardData = this.props.createMasterChildData(page_id, card_from_id, table_id);

	let that = this;
	//form中编辑后事件
	if (moduleId === form_id) {
		//组织变换编辑后事件
		if (key === 'pk_org') {
			let orgid = value.value;
			let data = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
			let newvalue = data.newvalue && data.newvalue.value;
			let oldvalue = data.oldvalue && data.oldvalue.value;
			if (orgid && Object.keys(orgid).length != 0) {
				if (newvalue) {
					// /清空表单form所有数据
					this.props.form.EmptyAllFormValue(this.formId);
					this.backvbillno = '';
					//清空table所有数据
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					if (isAutoSet) {
						oldvalue = null;
					}
					if (newvalue != oldvalue) {
						//先清空之前做的修改
						if (oldvalue) {
							cardData.head[card_from_id].rows[0].values.pk_org.value = oldvalue;
							cardData.head[card_from_id].rows[0].values.pk_org.display = data.oldvalue.display;
							//首次填写财务组织，不进行清空
							promptBox({
								color: "warning",
								/* 国际化处理： 确认修改*/
								title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000057'),
								/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
								content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000058'),
								//点击确定按钮事件
								beSureBtnClick: this.changeOrgConfirm.bind(this, data),
								//取消按钮事件回调
								cancelBtnClick: this.changeOrgCancel.bind(this, cardData),
							});
						} else {
							ajax({
								url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
								data: data,
								async: false,
								success: (res) => {
									if (res.success) {
										if (res.data) {
											//选择主组织以后，恢复其他字段的编辑性
											this.props.resMetaAfterPkorgEdit();
											// 组织可编辑
											this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
											//设置form的编辑属性
											if (res.data.billCard.head) {
												//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
												props.form.setAllFormValue({ [moduleId]: res.data.billCard.head[moduleId] });
											}
											if (res.data.refWhereInfo4NCC.wherePart) {
												this.setState({
													pk_org_pWherePart: res.data.refWhereInfo4NCC.wherePart
												});
											}
											if (res.data.refWhereInfo4NCC.error) {
												props.form.setFormItemsValue(card_from_id, { 'busitype': { value: null, display: null } });
												toast({ color: 'warning', content: res.data.refWhereInfo4NCC.error });
												return;
											}
											if (!isAutoSet) {
												this.props.cardTable.addRow(card_table_id);
												clsRowno(this.props, card_table_id);
											}
										}
									}
								}
							});
						}
					}
					props.button.setButtonDisabled([
						// 新增行
						'addline',
					], false);
					this.props.cardTable.setStatus(card_table_id, 'edit');
				}
			} else {
				if (oldvalue) {
					cardData.head[card_from_id].rows[0].values.pk_org.value = oldvalue;
					cardData.head[card_from_id].rows[0].values.pk_org.display = data.oldvalue.display;
					promptBox({
						color: "warning",
						/* 国际化处理： 确认修改*/
						title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000057'),
						/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
						content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000058'),
						//点击确定按钮事件
						//begin tm tangleic 2019318 修改清空组织逻辑
						// beSureBtnClick: this.changeOrgConfirm.bind(this, null),
						beSureBtnClick: () => {
							props.form.EmptyAllFormValue(form_id);
							props.cardTable.setTableData(table_id, { rows: [] });
							//其余字段不可编辑
							props.initMetaByPkorg();
						},
						//end tangleic

						//取消按钮事件回调
						cancelBtnClick: this.changeOrgCancel.bind(this, cardData),
					});
				}
				//begin tm tangleic 2019318 无用的逻辑，重复的初始化字段编辑行，导致bug
				//单据有主组织，新增时,将其他字段设置为不可编辑.
				// props.initMetaByPkorg();
				//end tangleic 
			}
		}
		//币种
		if (key === 'pk_currtype') {
			//表体table行数
			let rowCount = props.cardTable.getNumberOfRows(table_id);
			for (var i = 0; i < rowCount; i++) {
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_p', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_bankacc_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankname_p', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(table_id, i, 'bankname_r', { value: null, display: null });
			}
			let pk_currtypedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
			let pk_currtype_newvalue = pk_currtypedata.newvalue.value;
			let pk_currtype_oldvalue = pk_currtypedata.oldvalue.value;
			if (pk_currtype_newvalue) {
				if (pk_currtype_newvalue != pk_currtype_oldvalue) {
					ajax({
						url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
						data: pk_currtypedata,
						async: false,
						success: (res) => {
							if (res.success) {
								if (res.data) {
									debugger
									if (res.data.head) {
										//页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
										props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
									}
									if (res.data.body) {
										this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
									}

									//begin tm tangleic 20190827 后端决定汇率的编辑性以及精度
									// if (pk_currtype_newvalue == res.data.userjson) {
									// 	for (var i = 0; i < rowCount; i++) {
									// 		props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', false);
									// 	}
									// } else {
									// 	for (var i = 0; i < rowCount; i++) {
									// 		props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', true);
									// 	}
									// }
									let { userjson } = res.data;
									if (userjson) {
										let ratebaseinfo = JSON.parse(userjson);
										let { rateInfo, columnPrecisions } = ratebaseinfo;
										//更新列精度
										if (columnPrecisions && columnPrecisions.length > 0) {
											props.cardTable.setColScale(columnPrecisions)
										}
										//缓存汇率信息
										bodyRateEditOnAfterEdit({
											props,
											bodyCodes: [table_id],
											rateInfo,
											datasource: dataSource,
											olcRates: 'olcrate',
											glcRates: 'glcrate',
											gllcRates: 'gllcrate'
										});
										//end tangleic 
									}
								}
							}
						}
					});
				}
			}
		}
		// 交易类型
		if (key === 'busitype') {
			let busitype = value.value;
			if (busitype) {
				let busitypedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
				let busitype_newvalue = busitypedata.newvalue.value;
				let busitype_oldvalue = busitypedata.oldvalue.value;
				if (busitype_newvalue) {
					if (busitype_newvalue != busitype_oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
							data: busitypedata,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.error) {
											props.form.setFormItemsValue(card_from_id, { 'busitype': { value: null, display: null } });
											props.cardTable.setColEditableByKey(card_table_id, ['pk_org_p'], true);
											toast({ color: 'warning', content: res.data.error });
											return;
										} else {
											if (res.data.wherePart) {
												this.setState({
													pk_org_pWherePart: res.data.wherePart
												});
												changePkorgPRefer(props, busitype_newvalue, res.data.wherePart);
												props.cardTable.setColEditableByKey(card_table_id, ['pk_org_p'], false);
											}
										}
										// beforeEvent.call(that,that.props, table_id, "pk_org_p", null, null, null, null);
									}
								}
							}
						});
					}
					// 中心上收
					let rowCount = props.cardTable.getNumberOfRows(table_id);
					if (rowCount > 0) {
						if (busitype != 2) {
							for (var i = 0; i < rowCount; i++) {
								props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
								props.cardTable.setEditableByIndex(table_id, i, 'pk_accid', false);
							}
						} else {
							for (var i = 0; i < rowCount; i++) {
								props.cardTable.setValByKeyAndIndex(table_id, i, 'pk_accid', { value: null, display: null });
								props.cardTable.setEditableByIndex(table_id, i, 'pk_accid', true);
							}
						}
						props.cardTable.setColsValue(table_id, [{ key: 'pk_bankacc_p', data: { display: null, value: null } }]);
						props.cardTable.setColsValue(table_id, [{ key: 'bankname_p', data: { display: null, value: null } }]);
					}
					props.cardTable.setColsValue(table_id, [{ key: 'pk_org_p', data: { display: null, value: null } }]);
				}
			}
		}
		// 冲销业务
		if (key === 'isreversebusitype') {
			//表体table行数
			let rowCount = props.cardTable.getNumberOfRows(table_id);
			if (rowCount > 0) {
				for (var i = 0; i < rowCount; i++) {
					props.cardTable.setValByKeyAndIndex(table_id, i, 'isnetpay', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'pay_type', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'issamebank', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex(table_id, i, 'issamecity', { value: null, display: null });

					props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
					props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
				}

				let isreversebusitype = value.value;
				if (isreversebusitype) {
					let isreversedata = props.createHeadAfterEventData(page_id, moduleId, table_id, moduleId, key, value);
					let isreverse_newvalue = isreversedata.newvalue.value;
					let isreverse_oldvalue = isreversedata.oldvalue.value;
					if (isreverse_newvalue) {
						if (isreverse_newvalue != isreverse_oldvalue) {
							ajax({
								url: '/nccloud/sf/delivery/deliveryheadafterevent.do',
								data: isreversedata,
								async: false,
								success: (res) => {
									if (res.success) {
										if (res.data) {
											//设置form的编辑属性
											if (res.data.billCard.head) {

											}
											// 设置字段编辑性
											if (res.data.billCard.body) {
												let bodyDatas = res.data.billCard.body[card_table_id].rows;
												let bodyFileEditMap = res.data.bodyFileEditMap;
												if (bodyFileEditMap) {
													for (let index = 0; index < bodyDatas.length; index++) {
														const pk_delivery_b = bodyDatas[index].values.pk_delivery_b.value;
														let fileEditMap = bodyFileEditMap[pk_delivery_b];
														for (var key in fileEditMap) {
															//每一次循环获取的属性名
															// 获取属性值 在for in 中只能通过对象名[key]来获取 不能写obj.key
															this.props.cardTable.setEditableByIndex(card_table_id, index, key, fileEditMap[key]);
														}
													}
												}
											}
										}
									}
								}
							});
						}
					}
				} else {
					for (var i = 0; i < rowCount; i++) {
						props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
						// props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
					}
				}
			}
		}
	}
	//table中编辑后事件操作表格该行i
	if (moduleId === card_table_id || moduleId === card_table_id_edit) {
		//表体table行数
		let opatorRow = props.cardTable.getNumberOfRows(table_id);
		// 缴款单位 
		if (key === 'pk_org_p') {
			if (value) {
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pk_bankacc_p', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pk_accid', { value: null, display: null });

				let data = buildLightBodyAfterEditData(props, page_id, form_id, moduleId, key, changedrows, i, true);
				// let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				if (data) {
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											// this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);

											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
											this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
										}
									}
								}
							}
						});
					} else {
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
						this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
					}
				}
			} else {
				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 上收银行账户
		else if (key === 'pk_bankacc_r') {
			if (value && value.refpk) {
				// 缴款单位银行账户
				let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_bankacc_p');
				if (pk_bankacc_p && value.refpk === pk_bankacc_p.value) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000000') });/* 国际化处理： 不能和缴款单位账户相同*/
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pk_bankacc_r', { value: null, display: null });
					return;
				}
				let data = buildLightBodyAfterEditData(props, page_id, form_id, moduleId, key, changedrows, i, true);
				if (data) {
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
										}
										// 触发后台编辑事件后需要重新设置编辑性
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
									}
								}
							}
						});
					}
				}
			} else {
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pk_bankacc_r', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'bankacccode_r', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'bankaccname_r', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'bankname_r', { value: null, display: null });
			}
		}
		// 缴款单位银行账户
		else if (key === 'pk_bankacc_p') {
			let pk_org_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
			if (!pk_org_p) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
			if (value && value.refpk) {
				// 缴款单位银行账户
				let pk_bankacc_r = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_bankacc_r');
				if (pk_bankacc_r && value.refpk === pk_bankacc_r.value) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000002') });/* 国际化处理： 不能和上收银行账户相同*/
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pk_bankacc_p', { value: null, display: null });
					return;
				}
				let data = buildLightBodyAfterEditData(props, page_id, form_id, moduleId, key, changedrows, i, true);
				if (data) {
					let newvalue = data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											// this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
											let isnetpay = res.data.body[card_table_id].rows[0].values.isnetpay;
											if (isnetpay && isnetpay.value) {
												props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', true);
												props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
												props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
												props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
											} else {
												props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'isnetpay', { value: null, display: null });
												props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
												props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
												props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
												props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
											}
											// 触发后台编辑事件后需要重新设置编辑性
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
										}
									}
								}
							}
						});
					}
				}
				let isreversebusitype = props.form.getFormItemsValue(card_from_id, 'isreversebusitype');
				if (isreversebusitype && isreversebusitype.value) {
					props.cardTable.setEditableByIndex(table_id, i, 'isnetpay', false);
					props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
					props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'isnetpay', { value: null, display: null });
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pay_type', { value: null, display: null });
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamebank', { value: null, display: null });
					props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamecity', { value: null, display: null });
				}
			} else {
				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 缴款单位内部账户
		else if (key === 'pk_accid') {
			let pk_org_p = props.cardTable.getValByKeyAndIndex(table_id, i, 'pk_org_p');
			if (!pk_org_p) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000001') });/* 国际化处理： 请录入缴款单位*/
				return;
			}
		}
		// 是否网银上收
		else if (key === 'isnetpay') {
			props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pay_type', { value: null, display: null });
			props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamebank', { value: null, display: null });
			props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamecity', { value: null, display: null });
			if (value) {
				props.cardTable.setEditableByIndex(table_id, i, 'pay_type', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamebank', true);
				props.cardTable.setEditableByIndex(table_id, i, 'issamecity', true);
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowidi, 'pay_type', { value: '0', display: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000003') });/* 国际化处理： 普通*/
			} else {
				props.cardTable.setEditableByIndex(table_id, i, 'pay_type', false);
				props.cardTable.setEditableByIndex(table_id, i, 'issamebank', false);
				props.cardTable.setEditableByIndex(table_id, i, 'issamecity', false);
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'pay_type', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamebank', { value: null, display: null });
				props.cardTable.setValByKeyAndRowId(table_id, changedrows[0].rowid, 'issamecity', { value: null, display: null });

				// 触发后台编辑事件后需要重新设置编辑性
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
				this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
			}
		}
		// 上收金额 /汇率
		else if (key === 'amount' || key === 'olcrate') {
			if (value) {
				// let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				let data = buildLightBodyAfterEditData(props, page_id, form_id, moduleId, key, changedrows, i, true);
				if (data) {
					let newvalue = data.changedrows[0].newvalue && data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue && data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										let amount_currtype = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
										if (res.data.head
											) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
										}
										if (amount_currtype && res.data.userjson &&
											res.data.userjson == amount_currtype.value) {
											// 本币汇率 且在汇率为一时不可编辑 
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', false);
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'glcrate', false);
											// this.props.cardTable.setEditableByIndex(card_table_id, i, 'gllcrate', false);
											if(res.data.body[card_table_id].rows[0].values.olcrate.value == 1){
												this.props.cardTable.setEditableByIndex(card_table_id, i, 'olcrate', false);
											}
											if(res.data.body[card_table_id].rows[0].values.glcrate.value == 1){
												this.props.cardTable.setEditableByIndex(card_table_id, i, 'glcrate', false);
											}
											if(res.data.body[card_table_id].rows[0].values.gllcrate.value == 1){
												this.props.cardTable.setEditableByIndex(card_table_id, i, 'gllcrate', false);
											}
										} else {
											if (amount_currtype) {
												this.props.form.setFormItemsValue(this.formId,
													{
														'pk_currtype': {
															value: amount_currtype.value,
															display: amount_currtype.display
														}
													});
											}
										}
										// 触发后台编辑事件后需要重新设置编辑性
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_p', true);
										this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_accid', true);
									}
								}
							}
						});
					}
				}
			}
		}
		//集团汇率、全局汇率
		else if(key == 'glcrate' || key == 'gllcrate'){
			if (value) {
				// let data = props.createBodyAfterEventData(page_id, form_id, moduleId, moduleId, key, changedrows, i);
				let data = buildLightBodyAfterEditData(props, page_id, form_id, moduleId, key, changedrows, i, true);
				if (data) {
					let newvalue = data.changedrows[0].newvalue && data.changedrows[0].newvalue.value;
					let oldvalue = data.changedrows[0].oldvalue && data.changedrows[0].oldvalue.value;
					if (newvalue != oldvalue) {
						ajax({
							url: '/nccloud/sf/delivery/deliverybodyafterevent.do',
							data: data,
							async: false,
							success: (res) => {
								if (res.success) {
									if (res.data) {
										if (res.data.head
											) {
											this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
										}
										if (res.data.body) {
											this.props.cardTable.updateDataByRowId(card_table_id, res.data.body[card_table_id]);
										}
									}
								}
							}
						});
					}
				}
			}
		}
		// 汇款速度 同城标志 同行标志
		else if (key === 'pay_type' || key === 'issamecity' || key === 'issamebank') {
			let isnetpay = props.cardTable.getValByKeyAndIndex(moduleId, i, 'isnetpay');
			if (!(isnetpay && isnetpay.value)) {
				props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value: null, display: null });
			}
		}
	}

}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/