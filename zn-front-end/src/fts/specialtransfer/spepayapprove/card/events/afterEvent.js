/*OWmq6Ugo6jPE4W7xoi1UXvjSkPoixTw4j217e6GAgqK6av9KXTIRpH++qH14qTcK*/
import { ajax } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
//引入公共api
import { setHeadItemProp } from "../../../../pub/utils/FTSAfterEditUtil";
import { setCardShouderBtnUseful } from "../../util/spepayUtil";
//定义全局的pk_org的oldvalue
let oldOrgTotally = {};


/**
 * 编辑后事件逻辑处理
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	let status = props.getUrlParam('status');
	let eventData, newvalue, oldvalue, extParam;
	switch (key) {
		//表头资金组织
		case 'pk_org':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			oldOrgTotally = JSON.stringify(oldvalue);
			//有变更，老数据无值新数据有值，则直接走资金组织的编辑后事件
			if (!oldvalue.value && newvalue.value) {
				//组织选中值则恢复其余字段的编辑性
				props.resMetaAfterPkorgEdit();
				handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, i, eventData, () => {
					props.cardTable.setTableData(card_table_id, { rows: [] });
				});
			}
			//有变更，老数据和新数据的值不同，则进行提示
			else if (oldvalue.value && newvalue.value && newvalue.value != oldvalue.value || oldvalue.value && !newvalue || oldvalue.value && !newvalue.value) {
				props.modal.show('changeOrg', {
					title: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000000'), // 弹框表头信息/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000002'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("1880000025") && this.props.MutiInit.getIntl("1880000025").get('1880000025-000003'), //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
					beSureBtnClick: handleOrgChangeSure.bind(this, props, moduleId, key, value, changedrows, i, eventData), //点击确定按钮
					cancelBtnClick: handleOrgChangeCancel.bind(this, props, moduleId, key, value, oldvalue, eventData)
				});
			}
			break;
		//表头币种
		case 'pk_currtype':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			//清空数据
			if (!newvalue || !newvalue.value) {
				//TODO 清空逻辑
			}
			//有变更 发起请求进行编辑后事件处理
			else if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
				//TODO 对newvalue和oldvalue做判断，如果一致则不请求后端

				handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, i, eventData);
			}
			break;
		//表体办理财务组织	
		case 'pk_getfinanceorg':
			//获取页面数据
			eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
			newvalue = eventData.changedrows[0].newvalue;
			oldvalue = eventData.changedrows[0].oldvalue;
			//无办理财务组织，则清空办理财务组织以及内部账户的值
			if (!newvalue || !newvalue.value) {
				props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_getfinanceorg', { value: null, display: null });
				props.cardTable.setValByKeyAndIndex(card_table_id, i, 'pk_accid', { value: null, display: null });
			}
			//有变更 发起请求进行编辑后事件处理
			else if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
				handleSpePayBodyAfterEdit(props, moduleId, key, value, changedrows, i, eventData);
			}
			break;
		//表体内部账户
		case 'pk_accid':
			//获取页面数据
			eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
			handleSpePayBodyAfterEdit(props, moduleId, key, value, changedrows, i, eventData);
			break;
		//表体原币金额
		case 'amount':
			//获取页面数据
			eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
			handleSpePayBodyAfterEdit(props, moduleId, key, value, changedrows, i, eventData);
			break;
		//保存新增后编辑后事件
		case 'saveadd':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, value);
			handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, i, eventData);
			break;
		default:
			break;
	}
}

/**
 * 处理表体编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handleSpePayBodyAfterEdit = function (props, moduleId, key, value, changedrows, i, eventData, callback) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	ajax({
		url: base_url + 'spepaycardafteredit.do',
		data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, bodyItemProps } = data;
				let { head, bodys } = card;
				//更新表单数据
				props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
				//更新表体数据
				props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
				//设置表头字段属性
				setHeadItemProp(props, card_from_id, headItemProps);
				if (callback && (typeof callback == 'function')) {
					callback(props);
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
		props.form.EmptyAllFormValue(card_from_id);
		props.cardTable.setTableData(card_table_id, { rows: [] });
		//主组织无值时将其余字段设置为不可编辑
		props.initMetaByPkorg();
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
		handleSpePayHeadAfterEdit(props, moduleId, key, value, changedrows, index, eventData, () => {
			props.cardTable.setTableData(card_table_id, { rows: [] });
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
	props.form.setFormItemsValue(card_from_id, { pk_org: { value: oldOrg.value, display: oldOrg.display } });
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
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	ajax({
		url: base_url + 'spepaycardafteredit.do',
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, bodyItemProps } = data;
				let { head, bodys } = card;
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
			}
		}
	});
}

/*OWmq6Ugo6jPE4W7xoi1UXvjSkPoixTw4j217e6GAgqK6av9KXTIRpH++qH14qTcK*/