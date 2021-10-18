/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
import { setCardShouderBtnUseful } from "../../util/index.js";
import { card_page_id, card_table_id, base_url, card_from_id, dataSource } from '../../cons/constant.js';
import { changePkorgPRefer } from './index';
import { setPropCache, saveMultiLangRes, loadMultiLang, buildLightBodyAfterEditData } from "../../../../../tmpub/pub/util/index";
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;
//定义全局的pk_org的oldvalue
let oldOrgTotally = {};
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g, haveDefaultPkorg) {
	let eventData, newvalue, oldvalue, extParam, oldValueAndDis;
	let busitype;
	//财务组织编辑后事件
	if (key === 'pk_org') {
		eventData = props.createHeadAfterEventData('36320AA_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		oldvalue = eventData.oldvalue.value;
		oldValueAndDis = eventData.oldvalue;
		oldOrgTotally = JSON.stringify(oldValueAndDis);
		if (haveDefaultPkorg === true) {
			oldvalue = null;
		}
		let status = props.getUrlParam('status');
		let extParam = { 'uiState': status };
		//若新 旧值没有改变 则不做处理
		if (newvalue != oldvalue) {
			//有旧值时 弹出提示框
			if (oldvalue) {
				props.modal.show('changeOrg', {
					title: loadMultiLang(props, '36320AA-000000'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: loadMultiLang(props, '36320AA-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: loadMultiLang(props, '36320AA-000002'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: loadMultiLang(props, '36320AA-000003'), //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
					beSureBtnClick: handleOrgChangeSure.bind(this, props, moduleId, key, value, changedrows, i, eventData), //点击确定按钮
					cancelBtnClick: handleOrgChangeCancel.bind(this, props, moduleId, key, value, oldvalue, eventData)
				});
			} else {//新增时 无旧值,直接走资金组织的编辑后事件
				if (newvalue) {
					//组织选中值则恢复其余字段的编辑性
					props.resMetaAfterPkorgEdit();
					handleSpegatherHeadAfterEdit(props, moduleId, key, value, changedrows, i, eventData, () => {
						props.cardTable.setTableData(card_table_id, { rows: [] });
					});
				} else {
					props.form.EmptyAllFormValue(this.formId)
					props.cardTable.setTableData(this.tableId, { rows: [] });
					//设置表体肩部按钮的可用性
					setCardShouderBtnUseful(props);
				}
			}
		}
	}
	//交易类型
	if (key === 'busitype') {
		eventData = props.createHeadAfterEventData('36320AA_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		oldvalue = eventData.oldvalue.value;
		let meta = props.meta.getMeta();
		if (props.form.getFormItemsValue(this.formId, 'busitype').display != undefined) {
			ajax({
				url: '/nccloud/sf/allocateapply/headafterevent.do',
				async: false,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps, extParam } = data;
							let { head, bodys } = card;
							//设置表头数据
							props.form.setAllFormValue({ [this.formId]: head[this.formId] });
							//设置表体数据
							props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
							//如果出现编辑后事件 先清除下拨组织
							props.form.setFormItemsValue(this.formId, { pk_payorg: { display: '', value: '' } });
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, 'table_allocateapply_01', bodyItemProps, bodys[0]);
							changePkorgPRefer(props, newvalue);
							//若有问题 弹出报错信息
							if (extParam.hasOwnProperty('warning')) {
								toast({ color: 'warning', content: extParam.warning });
								props.form.setFormItemsValue(this.formId, { busitype: { display: '', value: '' } });
								// let metaArr = meta[card_from_id].items;
								//参照切换
								// metaArr.forEach((val) => {
									// let code = val.attrcode;
									// if (code == "pk_payorg") {
									// 	//当用户 有默认业务单元时 首次加载不触发编辑后事件 这里只处理交易类型切换时错误的情况
									// 	if (extParam.hasOwnProperty('warning')) {
									// 		//若出现问题 切换为财务组织
									// 		val.refcode = 'uapbd/refer/org/FinanceOrgTreeRef/index.js';
									// 	}
									// }
								// })
							}
						}
					}
				}
			});
		}
	}
	//下拨组织编辑后事件
	if (key === 'pk_payorg') {
		eventData = props.createHeadAfterEventData('36320AA_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		oldvalue = eventData.oldvalue.value;
		//判断下拨组织不能和收款单位相同
		if (props.form.getFormItemsValue(this.formId, 'pk_org').value === props.form.getFormItemsValue(this.formId, 'pk_payorg').value) {
			toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000004') });/* 国际化处理： 下拨组织不能和收款单位相同。*/
			props.form.setFormItemsValue(this.formId, { 'pk_payorg': { value: '', display: null } });
		} else {
			if (newvalue) {
				if (newvalue != oldvalue) {
					if (props.form.getFormItemsValue('form_allocateapply_03', 'busitype').display != undefined) {
						ajax({
							url: '/nccloud/sf/allocateapply/headafterevent.do',
							async: false,
							data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
							success: (res) => {
								if (res.success) {
									let { success, data } = res;
									if (success) {
										let { card, retExtParam, headProp, bodyItemProps, extParam } = data;
										let { head, bodys } = card;
										//设置表体数据（拨组织不能和收款单位相同时清空）
										props.form.setAllFormValue({ [this.formId]: head[this.formId] });
										console.log(card);
										//设置表体数据
										props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
										//给accidData缓存空间赋值 (内部账户)
										if (extParam.hasOwnProperty('pk_AccidData')) {
											let accidDefDate = extParam.pk_AccidData
											console.log(accidDefDate);
											setDefData('accidData', dataSource, accidDefDate);
										} else {
											setDefData('accidData', dataSource, null);
										}
									}
								}
							}
						});
					}
				}
			} else {
				let payrowsNum = props.cardTable.getNumberOfRows('table_allocateapply_01');
				let payforNum;
				//清空下拨组织时 置空表体内部账户
				for (payforNum = 0; payforNum < payrowsNum; payforNum++) {
					props.cardTable.setValByKeyAndIndex('table_allocateapply_01', payforNum, 'pk_accid', { value: null, display: null });
				}
			}
		}
	}
	//币种编辑后事件
	if (key === 'pk_currtype') {
		eventData = props.createHeadAfterEventData('36320AA_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		oldvalue = eventData.oldvalue.value;
		let rowsNum;
		let forNum;
		if (newvalue && newvalue != null) {
			rowsNum = props.cardTable.getNumberOfRows('table_allocateapply_01');

			if (props.form.getFormItemsValue('form_allocateapply_03', 'pk_currtype').display == 'CNY') {
				//设置人民币汇率
				ajax({
					url: '/nccloud/sf/allocateapply/headafterevent.do',
					async: false,
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							if (success) {
								let { card, retExtParam, headProp, bodyItemProps } = data;
								let { head, bodys } = card;
								//设置表体数据
								props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
								//币种为人民币时 汇率不可编辑 
								for (forNum = 0; forNum < rowsNum; forNum++) {
									props.cardTable.setEditableByIndex('table_allocateapply_01', forNum, 'applyolcrate', false);
									//收款银行账户、收款单位内部账户、下拨银行账户清空
									props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_r', { value: null, display: null });
									props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'bankaccname_r', { value: null, display: null });
									props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_accid', { value: null, display: null });
									props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_p', { value: null, display: null });
								}
							}
						}
					}
				});
			} else {
				for (forNum = 0; forNum < rowsNum; forNum++) {
					props.cardTable.setEditableByIndex('table_allocateapply_01', forNum, 'applyolcrate', true);
					props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_r', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'bankaccname_r', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_accid', { value: null, display: null });
					props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_p', { value: null, display: null });
				}
				//改变币种时 汇率随之改变
				ajax({
					url: '/nccloud/sf/allocateapply/headafterevent.do',
					async: false,
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							if (success) {
								let { card, retExtParam, headProp, bodyItemProps } = data;
								let { head, bodys } = card;
								//设置表体数据
								props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
							}
						}
					}
				});
			}
		} else {
			rowsNum = props.cardTable.getNumberOfRows('table_allocateapply_01');
			//删除币种时 清空所有汇率
			for (forNum = 0; forNum < rowsNum; forNum++) {
				props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'applyolcrate', { value: null, display: null });
				props.cardTable.setEditableByIndex('table_allocateapply_01', forNum, 'applyolcrate', true);
				//收款银行账户、收款单位内部账户、下拨银行账户清空
				props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'bankaccname_r', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_accid', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex('table_allocateapply_01', forNum, 'pk_bankacc_p', { value: null, display: null });
			}
		}
	}

	//表体
	//是否网银支付 
	if (key === 'isnetpay') {
		//		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		let eventData = buildLightBodyAfterEditData(props, '36320AA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		oldvalue = eventData.changedrows[0].oldvalue.value;
		ajax({
			url: '/nccloud/sf/allocateapply/headafterevent.do',
			async: false,
			data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItems, grid } = data;
				let { head, bodys } = grid;
				//这里仅处理付款速度的清空逻辑 编辑性控制在编辑前事件中
				//props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
				props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
				console.log(bodyItems);
				//				setBodyItemPropForLightBody(props, card_table_id, bodyItems);
				setBodyItemProp(props, card_table_id, bodyItems, bodys);
			},
		});
	}
	//申请金额(总比数与总金额 此处不处理，改为保存时 后台处理。此处仅处理汇率问题。)
	if (key === 'applyamount') {
		//为避免传入非法字符的情况进行判断是否包含数字 若无数字则置为0		
		if (changedrows[0].newvalue.value == "-") {
			props.cardTable.setValByKeyAndIndex('table_allocateapply_01', i, 'applyamount', { value: 0 });
			eventData.changedrows[0].newvalue.value = 0;
			eventData.changedrows[0].oldvalue.value = 0;
		}
		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		//let eventData = buildLightBodyAfterEditData(props, '36320AA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		console.log(eventData);
		ajax({
			url: '/nccloud/sf/allocateapply/headafterevent.do',
			async: false,//改为同步
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyProps, grid } = data;
				let { head, bodys } = card;
				props.form.setAllFormValue({ [this.formId]: head[this.formId] });
				props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
				//props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
			},
		});
	}
	//汇率,集团汇率,全局汇率
	if (key === 'applyolcrate' || key ===  "applyglcrate" || key === "applygllcrate") {
		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		//let eventData = buildLightBodyAfterEditData(props, '36320AADA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		console.log(eventData);
		ajax({
			url: '/nccloud/sf/allocateapply/headafterevent.do',
			async: false,//改为同步
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyProps, grid } = data;
				let { head, bodys } = card;
				props.form.setAllFormValue({ [this.formId]: head[this.formId] });
				props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
			},
		});
	}

	//下拨银行账户
	if (key === 'pk_bankacc_p') {
		//上缴银行账户没有开通网银，会使得编辑前事件中，网银上缴不可以编辑，而再次选择一个开通网银的账户，便不会再走编辑前事件，因为已经不可编辑了
		//在此每次重置成可编辑的,为的是让网银上缴的编辑前事件，每次都能正常进入
		props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', true);
		//let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		let eventData = buildLightBodyAfterEditData(props, '36320AA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		oldvalue = eventData.changedrows[0].oldvalue.value;
		let rowId = changedrows[0].rowid;
		if (newvalue) {
			ajax({
				url: '/nccloud/sf/allocateapply/headafterevent.do',
				async: false,
				data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItems, grid } = data;

					props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
					setBodyItemPropForLightBody(props, card_table_id, bodyItems);
					//此处提示鱼在前台处理 
					if (props.cardTable.getChangedRows(this.tableId)[0].values.pk_bankacc_r.value ===
						props.cardTable.getChangedRows(this.tableId)[0].values.pk_bankacc_p.value) {
						props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'pk_bankacc_p', { value: '', display: null });
						props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'bankname_p', { value: '', display: null });
						props.cardTable.setValByKeyAndRowId('table_allocateapply_01', rowId, 'isnetpay', { value: null, display: null });
						props.cardTable.setValByKeyAndRowId('table_allocateapply_01', rowId, 'pay_type', { value: null, display: null });
						props.cardTable.setEditableByRowId('table_allocateapply_01', rowId, 'isnetpay', false);

						toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000005') });/* 国际化处理： 收款银行账户不能和付款银行账户相同。*/
					}
				},
			});
		} else {//删除下拨银行账户时 清空网银支付、汇款速度 并将本行网银支付设为不可编辑
			props.cardTable.setValByKeyAndRowId('table_allocateapply_01', rowId, 'isnetpay', { value: null, display: null });
			props.cardTable.setValByKeyAndRowId('table_allocateapply_01', rowId, 'pay_type', { value: null, display: null });
			props.cardTable.setEditableByRowId('table_allocateapply_01', rowId, 'isnetpay', false);
		}
	}
	//收款银行账户
	if (key === 'pk_bankacc_r') {
		//		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		let eventData = buildLightBodyAfterEditData(props, '36320AA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		oldvalue = eventData.changedrows[0].oldvalue.value;
		let rowId = changedrows[0].rowid;

		if (newvalue) {
			if (props.cardTable.getChangedRows(this.tableId)[0].values.pk_bankacc_r.value ===
				props.cardTable.getChangedRows(this.tableId)[0].values.pk_bankacc_p.value) {
				toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000005') });/* 国际化处理： 收款银行账户不能和付款银行账户相同。*/
				props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'pk_bankacc_r', { value: '', display: null });
				props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'bankaccname_r', { value: '', display: null });
			} else {
				ajax({
					url: '/nccloud/sf/allocateapply/headafterevent.do',
					async: false,
					data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						let { success, data } = res;
						let { card, retExtParam, headProp, bodyItems, grid } = data;
						// let { head, bodys } = card;
						//props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
						props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
						setBodyItemPropForLightBody(props, card_table_id, bodyItems);
					},
				});
			}
		} else {
			//清除收款银行账户名
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'bankaccname_r', { value: null, display: null });
			//清除收款单位开户银行
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'bankname_r', { value: null, display: null });
			//清除 收款银行账户(冗余字段) bankacccode_r
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'bankacccode_r', { value: null, display: null });
		}
	}

	//收款客商
	if (key === 'pk_company_r') {
		//		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		let eventData = buildLightBodyAfterEditData(props, '36320AA_C01', this.formId, this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		oldvalue = eventData.changedrows[0].oldvalue.value;
		let rowId = changedrows[0].rowid;
		if (newvalue) {
			ajax({
				url: '/nccloud/sf/allocateapply/headafterevent.do',
				async: false,
				data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, grid } = data;
					//					let { head, bodys } = card;
					//					props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
					props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
				},
			});
		} else {//清除收款客商时 删去收款客商银行账户和 开户银行
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'pk_custbankacc', { value: null, display: null });
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'custbankname', { value: null, display: null });
		}
	}
	//建议下拨日期 应大于申请日期（applydate）
	if (key === 'applyallocatedate') {
		let eventData = props.createBodyAfterEventData('36320AA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		oldvalue = eventData.changedrows[0].oldvalue.value;
		let rowId = changedrows[0].rowid;
		let applydate = props.form.getAllFormValue('form_allocateapply_03').rows[0].values.applydate.value;
		//把字符串格式转化为日期类
		if (applydate.split(' ')[0] > (newvalue.split(' ')[0])) {
			toast({ color: 'warning', content: loadMultiLang(props, '36320AA-000006') });/* 国际化处理： 建议下拨日期应大于等于申请日期。*/
			props.cardTable.setValByKeyAndRowId(this.tableId, rowId, 'applyallocatedate', { value: '', display: null });
			return;
		}
	}

}

/**
 * 取消改变组织
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} oldvalue 
 * @param {*} eventData 
 */
const handleOrgChangeCancel = function (props, moduleId, key, value, oldValueAndDis, eventData) {
	//组织选中值则恢复其余字段的编辑性
	props.resMetaAfterPkorgEdit();
	let oldOrg = JSON.parse(oldOrgTotally);
	props.form.setFormItemsValue(card_from_id, { pk_org: { value: oldOrg.value, display: oldOrg.display } });
	//	setCardShouderBtnUseful(props);
}

/**
 * 确定改变组织
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} index 
 * @param {*} eventData 
 */
export const handleOrgChangeSure = function (props, moduleId, key, value, changedrows, index, eventData) {
	//主组织选中后恢复其余字段的编辑性
	props.resMetaAfterPkorgEdit();
	let newvalue = eventData.newvalue
	if (!newvalue || !newvalue.value) {
		props.form.EmptyAllFormValue(card_from_id);
		props.cardTable.setTableData(card_table_id, { rows: [] });
		//主组织无值时将其余字段设置为不可编辑
		props.initMetaByPkorg();
		setCardShouderBtnUseful(props);
	} else {
		//资金组织变更后，需要重新走资金组织的编辑后事件，同时清除一些相关的值，先按照如下的步骤：
		//1、获取资金组织的值
		let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
		//2、清空表头数据
		props.form.EmptyAllFormValue(card_from_id);
		//3、设置资金组织的值
		props.form.setFormItemsValue(card_from_id, { 'pk_org': { value: pk_org.value, display: pk_org.display } });
		//4、重新获取页面数据
		eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
		//5、资金组织的编辑后事件
		handleSpegatherHeadAfterEdit(props, moduleId, key, value, changedrows, index, eventData, () => {
			props.cardTable.setTableData(card_table_id, { rows: [] });
		});
	}
	this.toggleShow();
}

/**
 * 处理表头编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handleSpegatherHeadAfterEdit = function (props, moduleId, key, value, changedrows, i, eventData, callback) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	ajax({
		url: base_url + 'headafterevent.do',
		async: false,
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, bodyItemProps } = data;
				let { head, bodys } = card;
				//若有问题 弹出报错信息
				if (extParam.hasOwnProperty('warning')) {
					toast({ color: 'warning', content: extParam.warning });
					//主组织出现问题 清空全部列表
					props.form.EmptyAllFormValue(card_from_id)
					props.cardTable.setTableData(card_table_id, { rows: [] });
					//设置字段不可编辑
					props.form.setFormItemsDisabled(card_from_id, 
						{ 'memo': true, 'busitype': true, 'pk_currtype': true, 'pk_payorg':true });					
				} else {
					//设置字段可编辑
					props.form.setFormItemsDisabled(card_from_id, 
						{ 'memo': false, 'busitype': false, 'pk_currtype': false, 'pk_payorg':false });						
					//更新表单数据
					props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
					//更新表体数据
					props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
					//设置表体肩部按钮的可用性
					setCardShouderBtnUseful(props);
					//设置表头字段属性
					setHeadItemProp(props, card_from_id, headItemProps);
					if (callback && (typeof callback == 'function')) {
						callback(props);
					}
					//资金组织编辑后事件表体默认增加一行
					if (key == 'pk_org') {
						let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
						//添加pk_group用于后台精度处理
						let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group').value;
						//获取当前table行数
						let rownum_addline = props.cardTable.getNumberOfRows(card_table_id);
						//保存时需要校验一些数值 在table为null时无法赋值 故在此处复制
						//pk_org 为后台处理数据精度时需要
						props.cardTable.addRow(
							card_table_id,
							rownum_addline,
							{
								'pk_org': { value: pk_org },
								'pk_financeorg_r': { value: pk_org },
								'pk_group': { value: pk_group }
							},
							true);
						if (props.form.getFormItemsValue(card_from_id, 'busitype').value === '2') {//中心下拨 给内部账户赋值
							//先从缓存中取值
							let accidData = getDefData('accidData', dataSource);
							if (accidData != null) {
								props.cardTable.setValByKeyAndIndex('table_allocateapply_01', rownum_addline, 'pk_accid',
									{ value: accidData.split(',')[0], display: accidData.split(',')[1] });
							}
						}
						//设置主组织可编辑 此处由平台修复
						//props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
					}
					if (extParam.hasOwnProperty('busitypeWarning')) {
						toast({ color: 'warning', content: extParam.busitypeWarning });
						if(extParam.busitypeWarning == loadMultiLang(props, '36320AA-000077')){
							//此时说明是触发了主组织切换编辑后事件中，交易类型的编辑后逻辑
							//只提示 不做其他处理
						}else{
							props.form.EmptyAllFormValue(card_from_id);
							props.cardTable.setTableData(card_table_id, { rows: [] });
							//主组织无值时将其余字段设置为不可编辑
							props.initMetaByPkorg();
						}
						//设置表体肩部按钮的可用性
						setCardShouderBtnUseful(props);
					}
					//首次加载时 需要根据下拨类型变换下拨组织
					changePkorgPRefer(props, props.form.getFormItemsValue(card_from_id, 'busitype').value);
				}
			}
		}
	});
}

/**
 * 设置表体字段属性
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 区域编码(table_code)
 * @param {*} bodyItemProps 表体页面属性
 */
export function setBodyItemPropForLightBody(props, bodyCode, bodyItems) {
	if (!bodyItems[card_table_id]) {
		return;
	}
	let flag = '';
	//设置相关编辑性
	for (let i = 0; i < bodyItems[card_table_id].length; i++) {

		if (bodyItems[card_table_id][i].editable === 'true') {
			flag = true;
		} else {
			flag = false;
		}
		// 设定每行的可编辑行 setEditableByRowId,目前方法不好使 等待平台张横修复  xuhrc 2018-7-30
		props.cardTable.setEditableByRowId(card_table_id,
			bodyItems[card_table_id][i].rowID,
			bodyItems[card_table_id][i].itemName,
			flag);
	}
}
/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/