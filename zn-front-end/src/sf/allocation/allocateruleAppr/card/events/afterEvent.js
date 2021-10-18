/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/SFAfterEditUtil.js';
import { jsoncode, requesturl } from '../../util/const.js';
import { setCardShouderBtnUseful } from "../../util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//定义全局的pk_org的oldvalue
let oldOrgTotally = {};
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g, haveDefaultPkorg) {
	let status = props.getUrlParam('status');
	let eventData, newvalue, oldvalue, extParam;
	const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
	//-----------表头------------------
	//财务组织编辑后事件
	if (key === 'pk_org') {
		//为是否封存设置默认值N
		props.form.setFormItemsValue('form_allocaterule_01', { isenable: { display: '', value: 'N' } });
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
			// props.modal.show('changeOrg', {
			// 	title: '确认修改', // 弹框表头信息
			// 	content: '是否修改组织，这样会清空您录入的信息?', //弹框内容，可以是字符串或dom
			// 	userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
			// 	noFooter: false, //是否需要底部按钮,默认true
			// 	rightBtnName: '取消', //左侧按钮名称,默认关闭
			// 	leftBtnName: '确认', //右侧按钮名称， 默认确认
			// 	beSureBtnClick: handleOrgChangeSure.bind(this, props, moduleId, key, value, changedrows, i, eventData), //点击确定按钮
			// 	cancelBtnClick: handleOrgChangeCancel.bind(this, props, moduleId, key, value, oldvalue, eventData)
			// });
			promptBox({
				color: "warning",
				title: loadMultiLang(props,'36320AAC-000000'), // 弹框表头信息/* 国际化处理： 确认修改*/
				content: loadMultiLang(props,'36320AAC-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				beSureBtnClick: handleOrgChangeSure.bind(this, props, moduleId, key, value, changedrows, i, eventData), //点击确定按钮
				cancelBtnClick: handleOrgChangeCancel.bind(this, props, moduleId, key, value, oldvalue, eventData)

			});
		}
	}
	//币种
	if (key === 'pk_currtype') {
		eventData = props.createHeadAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		let pk_currtype =props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype') &&props.form.getFormItemsValue(jsoncode.formcode, 'pk_currtype').value
		if (pk_currtype) {
			ajax({
				url: requesturl.afterevent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps } = data;
							let { head, bodys } = card;
							//设置表头数据
							props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
							//设置表体数据
							props.cardTable.setTableData(jsoncode.ctablecode, bodys.table_allocaterule_C01);
						}
					}
				}
			});
		}
	}
	//交易类型
	if (key === 'busitype') {
		eventData = props.createHeadAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;;
		if (props.form.getFormItemsValue('form_allocaterule_01', 'busitype').display != undefined) {
			ajax({
				url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps,extParam } = data;
							let { head, bodys } = card;
							//判断交易类型是中心下拨吗，不是的话收款单位参照改为财务组织-资金管控
							if (props.form.getFormItemsValue('form_allocaterule_01', 'busitype').value != '2') {
								let meta = props.meta.getMeta();
								meta[jsoncode.ctablecode].items.find((e) => e.attrcode == 'pk_financeorg').refCode = '../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
							}
							//若有问题 弹出报错信息
							if (extParam.hasOwnProperty('warning')) {
								toast({ color: 'warning', content: extParam.warning });

							}
							//设置表体数据
							props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, 'table_allocaterule_C01', bodyItemProps, bodys[0]);
						}
					}
				}
			});
		}
	}
	//下拨银行账号
	if (key === 'pk_bankacc_p') {
		let eventData = props.createHeadAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.formId, key, value);
		newvalue = eventData.newvalue.value;
		let pk_bankacc_arr = props.cardTable.getColValue('table_allocaterule_C01', 'pk_bankacc_r');
		let pk_bankacc_p = props.form.getFormItemsValue('form_allocaterule_01', 'pk_bankacc_p');
		for (let index = 0; index < pk_bankacc_arr.length; index++) {
			let pk_bankacc_r = pk_bankacc_arr[index];
			if (pk_bankacc_p && pk_bankacc_r
				&& pk_bankacc_p.value === pk_bankacc_r.value) {
				toast({ color: 'warning', content: loadMultiLang(props,'36320AAC-000002') });/* 国际化处理： 下拨银行账号不能和单位银行账户相同，请重新选择*/
				//props.cardTable.setValByKeyAndIndex('table_allocaterule_C01', changedrows, 'pk_bankacc_r', { value: '', display: '' });
				//props.cardTable.setColValue('table_deliveryrule_C01','pk_bankacc_r',{value: '', display: ''});
				props.form.setFormItemsValue('form_allocaterule_01', { pk_bankacc_p: { display: '', value: '' } });
			}
		}
		if (pk_bankacc_p.value != undefined) {
			ajax({
				url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					if (res.success) {
						let { success, data } = res;
						if (success) {
							let { card, retExtParam, headProp, bodyItemProps } = data;
							let { head, bodys } = card;
							//设置表头数据
							props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
						}
					}
				}
			});
		}

	}

	//-----------表体------------------
	//成员单位
	if (key === 'pk_financeorg') {
		let eventData = props.createBodyAfterEventData(jsoncode.cpageid, this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		let pk_financeorg = props.cardTable.getValByKeyAndIndex(jsoncode.ctablecode, i, 'pk_financeorg');
		if (pk_financeorg.value) {
			return
		} else {
			props.cardTable.setValByKeyAndIndex('table_allocaterule_C01', i, 'pk_bankacc_r', { value: '', display: '' })
			props.cardTable.setValByKeyAndIndex('table_allocaterule_C01', i, 'bankaccname_r', { value: '', display: '' })
			props.cardTable.setValByKeyAndIndex('table_allocaterule_C01', i, 'pk_accid', { value: '', display: '' })
		}

	}
	//取整
	if (key === 'isacceptinteger') {
		let eventData = props.createBodyAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		ajax({
			url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItemProps } = data;
				let { head, bodys } = card;
				props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);
				setBodyItemProp(props, 'table_allocaterule_C01', bodyItemProps, bodys[0]);
			},
		});
	}
	//单位银行账户
	if (key === 'pk_bankacc_r') {
		let eventData = props.createBodyAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		newvalue = eventData.changedrows[0].newvalue.value;
		let pk_bankacc_r = props.cardTable.getValByKeyAndIndex('table_allocaterule_C01', i, 'pk_bankacc_r');
		let pk_bankacc_p = props.form.getFormItemsValue('form_allocaterule_01', 'pk_bankacc_p');
		//下拨银行账户不能和单位银行账户相同
		if (pk_bankacc_p && pk_bankacc_p.value && pk_bankacc_r && pk_bankacc_r.value && pk_bankacc_p.value === pk_bankacc_r.value) {
			toast({ color: 'warning', content: loadMultiLang(props,'36320AAC-000003') });/* 国际化处理： 上收银行账户不能和单位银行账户相同，请重新选择*/
			props.cardTable.setValByKeyAndIndex('table_allocaterule_C01', i, 'pk_bankacc_r', { value: '', display: '' });
			props.form.setFormItemsValue('form_allocaterule_01', { pk_bankacc_p: { display: '', value: '' } });
		}
		if (newvalue != null) {
			ajax({
				url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
				data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);

				},
			});
		}
	}
	//下拨比率
	if (key === 'allocaterate') {
		let eventData = props.createBodyAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		ajax({
			url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItemProps } = data;
				let { head, bodys } = card;
				props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);
				setBodyItemProp(props, 'table_allocaterule_C01', bodyItemProps, bodys[0]);
			},
		});
	}
	//最小下拨金额
	if (key === 'leastamount') {
		let eventData = props.createBodyAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		ajax({
			url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItemProps } = data;
				let { head, bodys } = card;
				props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);
				setBodyItemProp(props, 'table_allocaterule_C01', bodyItemProps, bodys[0]);
			},
		});
	}
	//备用金限额
	if (key === 'reservelimit') {
		let eventData = props.createBodyAfterEventData('36320AAC_C01', this.formId, [this.tableId], this.tableId, key, changedrows);
		eventData['areaname'] = this.tableId;
		ajax({
			url: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				let { card, retExtParam, headProp, bodyItemProps } = data;
				let { head, bodys } = card;
				props.cardTable.setTableData('table_allocaterule_C01', bodys.table_allocaterule_C01);
			},
		});
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
					toast({ color: 'warning', content: extParam.warning });
					//主组织出现问题 清空全部列表
					props.form.EmptyAllFormValue(jsoncode.formcode)
					props.cardTable.setTableData(jsoncode.ctablecode, { rows: [] });
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
						{
							'paytype': { display: loadMultiLang(props,'36320AAC-000004'), value: '0' },/* 国际化处理： 普通*/
							'ruletype': { display: loadMultiLang(props,'36320AAC-000005'), value: '1' }/* 国际化处理： 差额下拨*/
						},
					);
					let rownum = props.cardTable.getNumberOfRows(jsoncode.ctablecode);
				}
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