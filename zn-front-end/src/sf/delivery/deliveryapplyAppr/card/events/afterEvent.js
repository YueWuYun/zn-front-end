/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { setCardShouderBtnUseful } from "../../util/index";
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
import { changePkorgPRefer } from './index';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//定义全局的pk_org的oldvalue
let oldOrgTotally = {};
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g, haveDefaultPkorg) {
	let status = props.getUrlParam('status');
	let eventData, newvalue, oldvalue, extParam;
	const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') &&
		props.form.getFormItemsValue(this.formId, 'pk_org').value;
	//-----------表头------------------
	//财务组织编辑后事件
	if (key === 'pk_org') {
		//获取页面数据
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], jsoncode.formcode, key, value);
		//获取编辑的值
		newvalue = eventData.newvalue;
		oldvalue = eventData.oldvalue;
		oldOrgTotally = JSON.stringify(oldvalue);
		//若是配置了业务单元，新增的时候，oldvalue也会有默认值，需要在这里统一清空一下。initTemplate中有对应
		if (haveDefaultPkorg === true) {
			oldvalue.value = null;
		}
		//新增时，老数据无值新数据有值，则直接走资金组织的编辑后事件
		if (!oldvalue.value && newvalue.value) {
			//组织选中值则恢复其余字段的编辑性
			props.resMetaAfterPkorgEdit();
			handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, i, eventData, () => {
				props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });
			});
		}
		//有变更，老数据和新数据的值不同，则进行提示
		else if (oldvalue.value && newvalue.value && newvalue.value != oldvalue.value || oldvalue.value && !newvalue || oldvalue.value && !newvalue.value) {
			promptBox({
				color: "warning",
				title: loadMultiLang(props,'36320DA-000000'), // 弹框表头信息/* 国际化处理： 确认修改*/
				content: loadMultiLang(props,'36320DA-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				beSureBtnClick: handleOrgChangeSure.bind(this, props, moduleId, key, value, changedrows, i, eventData), //点击确定按钮
				cancelBtnClick: handleOrgChangeCancel.bind(this, props, moduleId, key, value, oldvalue, eventData)

			});
		}
	}
	//交易类型
	if (key === 'busitype') {
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		if (props.form.getFormItemsValue(jsoncode.formcode, 'busitype').display != undefined) {
			ajax({
				url: requesturl.afterevent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps, extParam } = data;
							let { head, bodys } = card;
							//设置表体数据
							props.cardTable.setTableData('table_deliveryapply_C01', bodys.table_deliveryapply_C01);
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, 'table_deliveryapply_C01', bodyItemProps, bodys[0]);
							changePkorgPRefer(props, newvalue);
							//若有问题 弹出报错信息
							if (extParam.hasOwnProperty('warning')) {
								toast({ color: 'warning', content: extParam.warning });
								props.form.setFormItemsValue('form_deliveryapply_01', { busitype: { display: '', value: '' } });
							}
						}
					}
				},
				error: res => {
					toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000002') });/* 国际化处理： 不存在此种交易类型的上级财务组织*/
					props.form.setFormItemsValue('form_deliveryapply_01', { busitype: { display: '', value: '' } });
				}
			});
		}
	}
	//币种
	if (key === 'pk_currtype') {
		debugger
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		let pk_currtype =props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype') &&props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype').value
		if (pk_currtype) {
			ajax({
				url: requesturl.afterevent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps } = data;
							let { head, bodys } = card;
							//设置表体数据
							props.cardTable.setTableData('table_deliveryapply_C01', bodys.table_deliveryapply_C01);
						}
					}
				}
			});
		}
	}
	//冲销业务
	if (key === 'isreversebustype') {
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		if (pk_org) {
			if (props.form.getFormItemsValue(jsoncode.formcode, 'isreversebustype').display != undefined) {
				ajax({
					url: requesturl.afterevent,
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						console.log(res);
						if (res.success) {
							let { success, data } = res;
							if (success) {
								let { card, retExtParam, headProp, bodyItemProps } = data;
								let { head, bodys } = card;
								//设置表体数据
								props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
								//设置pk_accid（收款单位内部账户）编辑性
								setBodyItemProp(props, jsoncode.ctablecode, bodyItemProps, bodys[0]);
							}
						}
					}
				});
			}
		} else {
			toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000003') });/* 国际化处理： 请先选择财务组织*/
			props.form.setFormItemsValue(this.formId, { 'isreversebustype': { value: '', display: null } });
		}

	}
	//上收组织编辑后事件
	if (key === 'pk_gatherorg') {
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		//判断下拨组织不能和收款单位相同
		if (props.form.getFormItemsValue(this.formId, 'pk_org').value === props.form.getFormItemsValue(this.formId, 'pk_gatherorg').value) {
			toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000004') });/* 国际化处理： 上收组织不能和缴款单位相同，请重新选择*/
			props.form.setFormItemsValue(this.formId, { 'pk_gatherorg': { value: '', display: null } });
		} else {

			if (props.form.getFormItemsValue(jsoncode.formcode, 'busitype').display != undefined) {
				ajax({
					url: requesturl.afterevent,
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						if (res.success) {
							let { success, data } = res;
							if (success) {
								let { card, retExtParam, headProp, bodyItemProps } = data;
								let { head, bodys } = card;
								//设置表体数据（拨组织不能和收款单位相同时清空）
								props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
								//设置表体数据
								props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
							}
						}
					}
				});
			}

		}
	}
	//-----------表体------------------
	//是否网银支付
	if (key === 'isnetpay') {
		let eventData = props.createBodyAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		ajax({
			url: requesturl.afterevent,
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItemProps } = data;
				let { head, bodys } = card;
				props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
				setBodyItemProp(props, jsoncode.ctablecode, bodyItemProps, bodys[0]);
			},
		});
	}
	//申请金额
	if (key === 'amount') {
		let eventData = props.createBodyAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		let pk_currtype =props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype') &&props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype').value
		if(!pk_currtype){
			toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000069') });/* 国际化处理： 请先选择币种*/
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'amount', { value: '', display: '' });
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'olcrate', { value: '', display: '' });
		}else{
			if (newvalue != null) {
				ajax({
					url: requesturl.afterevent,
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						let { success, data } = res;
						let { card, retExtParam, headProp, bodyItemProps } = data;
						let { head, bodys } = card;
						setBodyItemProp(props, jsoncode.ctablecode, bodyItemProps, bodys[0]);
						//let rowID = props.cardTable.getAllRows('table_deliveryapply_C01')[0].rowid;
						// props.cardTable.setEditableByRowId('table_deliveryapply_C01',rowID,'olcrate',false);
						//props.cardTable.setEditableByIndex('table_deliveryapply_C01',0,'olcrate',false);
						props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
						props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
					},
				});
			}
		}
	}
	debugger
	//上缴银行账户
	if (key === 'pk_bankacc_p') {
		let eventData = props.createBodyAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		console.log(eventData);
		let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_p');
		let pk_bankacc_r = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_r');
		if (pk_bankacc_p.value) {
			//判断上缴银行账户不能和上收银行账户相同
			if (pk_bankacc_p && pk_bankacc_r
				&& pk_bankacc_p.value === pk_bankacc_r.value) {
				toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000005') });/* 国际化处理： 上缴银行账户不能和上收银行账户相同，请重新选择*/
				props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_p', { value: '', display: '' });
				props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_r', { value: '', display: '' });
			}
			ajax({
				url: requesturl.afterevent,
				data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps } = data;
					let { head, bodys } = card;
					props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
					setBodyItemProp(props, 'table_deliveryapply_C01', bodyItemProps, bodys[0]);
				},
			});
		} else {
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'bankname_p', { value: '', display: '' });
		}

	}
	//上收银行账户
	if (key === 'pk_bankacc_r') {
	
		let eventData = props.createBodyAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		let pk_bankacc_p = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_p');
		let pk_bankacc_r = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_r')
		if(!pk_bankacc_p.value){
			toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000006') });/* 国际化处理： 请先选择上缴银行账户*/
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_r', { value: '', display: '' });
		}
		//判断上缴银行账户不能和上收银行账户相同
		if (pk_bankacc_p.value && pk_bankacc_r.value) {
			if (pk_bankacc_p && pk_bankacc_r
				&& pk_bankacc_p.value === pk_bankacc_r.value) {
				toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000005') });/* 国际化处理： 上缴银行账户不能和上收银行账户相同，请重新选择*/
				props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_p', { value: '', display: '' });
				props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_bankacc_r', { value: '', display: '' });
			}
			if (newvalue != null) {
				ajax({
					url: requesturl.afterevent,
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
					success: (res) => {
						console.log(res);
						let { success, data } = res;
						let { card, retExtParam, headProp, bodyItemProps } = data;
						let { head, bodys } = card;
						props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_deliveryapply_C01);
						//					setBodyItemProp(props, 'table_deliveryapply_C01', bodyItemProps, bodys[0]);
					},
				});
			}
		} else {
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'bankaccname_r', { value: '', display: '' });
			props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, i, 'bankname_r', { value: '', display: '' })
		}
	}
	//结算方式（加载项相关，暂不处理，前台先写完了，后台无对应）
	// if (key === 'pk_balatype') {
	// 	let eventData = props.createBodyAfterEventData('36320DA_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
	// 	eventData['areaname'] = this.tableId;
	// 	ajax({
	// 		url: '/nccloud/sf/deliveryapply/deliveryapplyafterevent.do',
	// 		data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
	// 		success: (res) => {
	// 			console.log(res);
	// 			let { success, data } = res;
	// 			let { card, retExtParam, headProp, bodyItemProps } = data;
	// 			let { head, bodys } = card;
	// 			props.cardTable.setTableData('table_deliveryapply_C01', bodys.table_deliveryapply_C01);
	// 			setBodyItemProp(props, 'table_deliveryapply_C01', bodyItemProps, bodys[0]);
	// 		},
	// 	});
	// }
}

/**
* 设置表体字段属性
* @param {*} props 页面内置对象
* @param {*} bodyCode 区域编码
* @param {*} bodyItemProps 表体页面属性
*/
function setBodyItemProplocal(props, bodyCode, bodyItemProps, body) {
	let flag = '';
	let tableItemProps = bodyItemProps.table_deliveryapply_C01;
	let tableValue = body
	if (!bodyItemProps || bodyItemProps.length == 0) {
		return;
	}
	for (let i = 0; i < bodyItemProps.table_deliveryapply_C01.length; i++) {
		if (tableItemProps[i].eidtable === 'true') {
			flag = true;
		} else {
			flag = false;
		}
		//设定每行的可编辑行
		props.cardTable.setEditableByRowId('table_deliveryapply_C01',
			tableItemProps[i].rowID,
			tableItemProps[i].itemName,
			flag);
	}
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
const handleSpePayHeadAfterEdit = function (props, moduleId, key, value, changedrows, i, eventData, callback) {
	let extParam = { 'uiState': status };
	ajax({
		url: requesturl.afterevent,
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, bodyItemProps } = data;
				let { head, bodys } = card;
				//若有问题 弹出报错信息
				if (extParam.hasOwnProperty('warning')) {
					debugger
					toast({ color: 'warning', content: extParam.warning });
					if (extParam.warning == loadMultiLang(props,'36320DA-000002')) {//此时说明是触发了主组织切换编辑后事件中，交易类型的编辑后逻辑/* 国际化处理： 不存在此种交易类型的上级财务组织*/
						props.form.setFormItemsValue('form_deliveryapply_01', { pk_org: { display: '', value: '' } });
						//主组织无值时将其余字段设置为不可编辑
		                props.initMetaByPkorg();
						//主组织出现问题 清空全部列表
						props.form.EmptyAllFormValue(jsoncode.formcode)
						props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });

					} else {
						//主组织出现问题 清空全部列表
						props.form.EmptyAllFormValue(jsoncode.formcode)
						props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });
					}
					return
				}
				//更新表单数据
				props.form.setAllFormValue({ [jsoncode.formcode]: head[jsoncode.formcode] });
				//更新表体数据
				props.cardTable.setTableData(jsoncode.ctablecode, bodys[jsoncode.ctablecode]);
				//设置表体肩部按钮的可用性
				setCardShouderBtnUseful(props);
				if (callback && (typeof callback == 'function')) {
					callback(props);
				}
				//资金组织编辑后事件表体默认增加一行
				if (key == 'pk_org') {
					props.cardTable.addRow(
						jsoncode.ctablecode,
						0,
						{ //表体付款单位内部账户，必须是表体财务组织在上收组织开立的内部账户
							//所以表体需要表头的财务组织进行判断，这是nc的后端逻辑
							'pk_org': {
								value: props.form.getFormItemsValue(jsoncode.formcode, 'pk_org') &&
									props.form.getFormItemsValue(jsoncode.formcode, 'pk_org').value
							},
							'recordstatus': { display: loadMultiLang(props,'36320DA-000007'), value: '1' }/* 国际化处理： 正常*/
						},
						false);
					let rownum = props.cardTable.getNumberOfRows(jsoncode.ctablecode);
				}
				//首次加载时 需要根据下拨类型变换下拨组织
				changePkorgPRefer(props, props.form.getFormItemsValue(jsoncode.formcode, 'busitype').value);
			}
		}
	});
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
		props.form.EmptyAllFormValue(jsoncode.formcode);
		props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });
		//主组织无值时将其余字段设置为不可编辑
		props.initMetaByPkorg();
	} else {
		//资金组织变更后，需要重新走资金组织的编辑后事件，同时清除一些相关的值，先按照如下的步骤：
		//1、获取资金组织的值
		let pk_org = props.form.getFormItemsValue(jsoncode.formcode, 'pk_org');
		//2、清空表头数据
		props.form.EmptyAllFormValue(jsoncode.formcode);
		//3、设置资金组织的值
		props.form.setFormItemsValue(jsoncode.formcode, { 'pk_org': { value: pk_org.value, display: pk_org.display } });
		//4、重新获取页面数据
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], jsoncode.formcode, key, value);
		//5、资金组织的编辑后事件
		handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, index, eventData, () => {
			props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });
		});
	}
	this.toggleShow();
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
const handleOrgChangeCancel = function (props, moduleId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	props.resMetaAfterPkorgEdit();
	let oldOrg = JSON.parse(oldOrgTotally);
	props.form.setFormItemsValue(jsoncode.formcode, { 'pk_org': { value: oldOrg.value, display: oldOrg.display } });
}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/