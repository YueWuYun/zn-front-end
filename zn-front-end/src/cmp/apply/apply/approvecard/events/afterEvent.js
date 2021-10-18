/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
/**
 * 编辑后事件处理机
 * <p>
 * 1.headItemAfterEditHandler/bodyItemAfterEditHandler 分别处理表头/表体编辑后事件<br/>
 * 2.clearHeadItem/clearBodyItem 分别处理表头/表体字段清空处理逻辑<br/>
 * 3.buildHeadAfterEditReqData/buildBodyAfterEditReqData 分别构建表头/表体编辑后事件请求数据<br/>
 * 4.processHeadAfterEidtRes/processBodyAfterEditRes 分别处理表头/表体编辑后事件请求返回<br/>
 * </p>
 */
import { ajax, toast, promptBox } from 'nc-lightapp-front'; 
import { bodyBtnVisible } from "./bodyBtnVisible";
import { initTemplate } from "../events/initTemplate";
//引入配置常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, SHOW_MODE } from '../../cons/constant';
//引入公共api
import { setHeadItemProp, setBodyItemProp, validateWriteOffMny } from "../../../../pub/utils/CMPAfterEditUtil";
import { processColumnPrecision, processBodyOlcRateEditable, addNewRow } from "../../util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";


/**  
 * 编辑后事件逻辑处理
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 */
export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	const headItems = ['pk_org','applysum','pk_currtype','pk_acceptorg','pk_supplier','isputdown','pk_trantypeid','beginacceptdate','needacceptance','paytype','pk_bankacc_p','pk_bankacc_pd','pk_bankacc_r'];
	const bodyItems = ['applymny','pk_inneraccount_r'];

	//编辑字段属于表体并且变更行数据不为空，则按照表体编辑后事件处理
	if (changedrows && bodyItems.includes(key)) {
		bodyItemAfterEditHandler(props, key, value, changedrows, index, record);		
	}
	//处理表头编辑后事件
	else if (headItems.includes(key)) {
		headItemAfterEditHandler(props, key, value);
	}
	//新增默认值事件/复制事件
	else if (key == 'default' || key == 'copy' || key == 'edit') {
		defaultDataHandler(props, key, value);
	}	
}


/**
 * 处理表头字段编辑后事件
 * @param {*} props 
 * @param {*} key 
 * @param {*} value 
 */
const headItemAfterEditHandler = function (props, key, value) {
	//获取页面数据
	let eventData = props.createHeadAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.HEAD_CODE, key, value);
	//获取编辑的值
	const newvalue = JSON.parse(JSON.stringify(eventData.newvalue));
	const oldvalue = JSON.parse(JSON.stringify(eventData.oldvalue));
	//规避平台组件bug，eventData中的值还是旧值
	eventData.card.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values[key] = newvalue;
	//清空数据
	if (!newvalue || !newvalue.value) {
		clearHeadItem(props, key);
	}
	//有变更 发起请求进行编辑后事件处理
	else if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
		//处理组织编辑后事件(修改组织需要涉及到交互)
		if (key == 'pk_org') {
			//原本组织为空，则不弹框
			if (!oldvalue || !oldvalue.value) {
				//组织选中值则恢复其余字段的编辑性
				props.resMetaAfterPkorgEdit();
				//处理肩部按钮是否可用
				bodyBtnVisible(props);
				//处理组织编辑后事件
				handleOrgAfterEdit(props, eventData);
			} else {
				promptBox({
					color: "warning",
					content: loadMultiLang(props, '36070APM--000004')/* 国际化处理： 是否修改组织*/,
					beSureBtnClick: () => {
						//组织选中值则恢复其余字段的编辑性
						props.resMetaAfterPkorgEdit();
						handleOrgAfterEdit(props, eventData);
					}
				});
			}

		}else if(key == 'paytype'){
			//1:付款财务组织支付 2.委托上级组织支付 3.委托上级组织回拨支付
			let paytype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'paytype').value; 
			if(paytype && paytype==3){
				props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_bankacc_pd': false });
			}else{
				props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_bankacc_pd': true });
			}
			if(paytype && paytype==1){
				props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'isputdown': false });
			}else{
				props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'isputdown': true });
				props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'isputdown': { value: null, display: null} });				
			}
		}
		//处理其他字段编辑后事件
		else {
			let data = buildHeadAfterEditReqData(props, key, eventData);
			ajax({
				url: URL_INFO.CARD.AFTEREDIT,
				data,
				success: (res) => {
					//处理请求返回数据
					processHeadAfterEidtRes(props, res, key);
					let isputdown = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isputdown').value; 
					if(isputdown){
						props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_bankacc_pd': false });
					}
				},
				error: (e) => {
					//将修改的字段恢复修改，提示错误
					props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { key: { value: eventData.oldvalue.value || null, display: eventData.oldvalue.display || null, scale: eventData.oldvalue.scale || -1 } });
					toast({ color: 'warning', content: e.message });
				}
			});
		}
	}
}

/**
 * 处理表体字段编辑后事件
 * @param {*} props 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} index 
 * @param {*} record 
 */
const bodyItemAfterEditHandler = function (props, key, value, changedrows, index, record) {
	//获取页面数据
	let eventData = props.createBodyAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.BODY_CODE, key, changedrows);
	const newvalue = JSON.parse(JSON.stringify(eventData.changedrows[0].newvalue));
	const oldvalue = JSON.parse(JSON.stringify(eventData.changedrows[0].oldvalue));
	//清空数据
	if (!newvalue || !newvalue.value) {
		clearBodyItem(props, key, index);
	}
	//有变更 发起请求进行编辑后事件处理
	else if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value) {
		let data = buildBodyAfterEditReqData(props, key, eventData, index);
		ajax({
			url: URL_INFO.CARD.AFTEREDIT,
			data,
			success: (res) => {
				//处理请求返回数据
				processBodyAfterEditRes(props, res, key, index);
			},
			error: (e) => {
				//将修改的字段恢复修改，提示错误
				props.cardTable.setValByKeyAndIndex(CARD_PAGE_INFO.BODY_CODE, index, key, { value: oldvalue.value || null, display: oldvalue.display || null, scale: oldvalue.scale || -1 });
				toast({ color: 'warning', content: e.message });
			}
		});
	}
}
/**
 * 清空表头字段处理逻辑
 * @param {*} props 
 * @param {*} key 
 */
const clearHeadItem = function (props, key) {
	//清空资金组织需要交互确认
	if (key == 'pk_org') {
		promptBox({
			color: "warning",
			content: loadMultiLang(props, '36070APM--000114')/* 国际化处理： 是否修改组织*/,
			beSureBtnClick: () => {
				//清空数据
				props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
				props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
				props.initMetaByPkorg();
			}
		});
	}
	//清空付款资金组织或者收款资金组织，同步清空办理资金组织
	else if (key == 'pk_fundorg_p' || key == 'pk_fundorg_r') {
		props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'pk_transactorg': { value: null, display: null }, 'pk_transactorg_v': { value: null, display: null } });
	}
	//清空交易类型时候清空code值
	else if (key == 'pk_trantypeid') {
		props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, {
			'pk_trantypecode': { valule: null, display: null }
		});		
	}else if(key == 'isputdown'){
		props.form.setFormItemsDisabled(CARD_PAGE_INFO.HEAD_CODE, { 'pk_bankacc_pd': true });
		
	}
}

/**
 * 清空表体字段处理逻辑
 * @param {*} props 
 * @param {*} key 
 * @param {*} index 
 */
const clearBodyItem = function (props, key, index) {
	//清空财务组织时同步清空内部账户
	if (key == 'pk_financeorg_p') {
		props.cardTable.setValByKeyAndIndex(CARD_PAGE_INFO.BODY_CODE, index, 'pk_financeorg_p_v', { display: null, value: null });
		props.cardTable.setValByKeyAndIndex(CARD_PAGE_INFO.BODY_CODE, index, 'pk_inneraccount_p', { display: null, value: null });
	} else if (key == 'pk_financeorg_r') {
		props.cardTable.setValByKeyAndIndex(CARD_PAGE_INFO.BODY_CODE, index, 'pk_financeorg_r_v', { display: null, value: null });
		props.cardTable.setValByKeyAndIndex(CARD_PAGE_INFO.BODY_CODE, index, 'pk_inneraccount_r', { display: null, value: null });
	}
}

/**
 * 获取页面状态
 * @param {*} props 
 */
const getStatus = function (props) {
	//获取页面状态
	let status = props.getUrlParam('status');
	//将复制状态转换为新增
	return (status == SHOW_MODE.COPY ? SHOW_MODE.ADD : status);
}
/**
 * 构建表头编辑后事件请求数据
 * @param {*} props 
 * @param {*} key 
 * @param {*} eventData 
 */
const buildHeadAfterEditReqData = function (props, key, eventData) {
	let extParam = { 'uiState': getStatus(props) };
	return { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam };
}

/**
 * 处理表头字段编辑后事件请求返回数据
 * @param {*} props 
 * @param {*} res 
 * @param {*} key 
 */
const processHeadAfterEidtRes = function (props, res, key) {
	let { card, extParam, headItemProps, columnPrecisions } = res.data;
	let { head, bodys } = card;
	//更新表单数据
	props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
	if (extParam.hasOwnProperty('isClerBody')) {
		let flag = extParam.isClerBody;
		if (flag) {
			//清空表体
			props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
		}
	} else {
		//更新表体数据
		props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
	}
	//设置组织本币列编辑性
	processBodyOlcRateEditable(props, extParam);
	//更新列精度
	processColumnPrecision(props, columnPrecisions);
	//设置表头字段属性
	setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);
}
/**
 * 构建表体编辑后事件请求数据
 * @param {*} props 
 * @param {*} key 
 * @param {*} eventData 
 * @param {*} index 
 */
const buildBodyAfterEditReqData = function (props, key, eventData, index) {
	let extParam = { 'uiState': getStatus(props) };
	if (key == 'pk_financeorg_p') {
		extParam = {
			'fundorg': 'pk_fundorg_p',
			'financeorg': 'pk_financeorg_p',
			'inneracc': 'pk_inneraccount_p'
		}
	} else if (key == 'pk_financeorg_r') {
		extParam = {
			'fundorg': 'pk_fundorg_r',
			'financeorg': 'pk_financeorg_r',
			'inneracc': 'pk_inneraccount_r'
		}
	}
	return { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam };
}
/**
 * 处理表体字段编辑后事件请求返回数据
 * @param {*} props 
 * @param {*} res 
 * @param {*} key 
 * @param {*} index 
 */
const processBodyAfterEditRes = function (props, res, key, index) {
	let { card, extParam, headItemProps } = res.data;
	let { head, bodys } = card;
	//更新表单数据
	props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
	//更新表体数据
	props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
	//设置表头字段属性
	setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);
}

/**
 * 默认值事件
 * @param {*} props 
 */
const defaultDataHandler = function (props, key, value) {
	let extParam = { 'uiState': getStatus(props) };
	let eventData = props.createHeadAfterEventData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [CARD_PAGE_INFO.BODY_CODE], CARD_PAGE_INFO.HEAD_CODE, key, value);
	ajax({
		url: URL_INFO.CARD.AFTEREDIT,
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { card, extParam, headItemProps, bodyItemProps, columnPrecisions } = res.data;
			let { head, bodys } = card;
			//更新表单数据
			props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
			//更新表体数据
			props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, bodys[CARD_PAGE_INFO.BODY_CODE]);
			if (key == 'default') {
				//新增默认值事件中默认增加一行
				addNewRow(props);
			}
			//设置组织本币列编辑性
			processBodyOlcRateEditable(props, extParam);
			//更新列精度
			processColumnPrecision(props, columnPrecisions);
			//设置表头字段属性
			setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);
		}
	});
}
/**
 * 处理组织编辑后事件
 * @param {*} props 
 * @param {*} eventData 
 */
const handleOrgAfterEdit = function (props, eventData) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	ajax({
		url: URL_INFO.CARD.AFTEREDIT,
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, columnPrecisions } = data;
				let { head } = card;
				//组织选中值则恢复其余字段的编辑性
				props.resMetaAfterPkorgEdit();
				//处理肩部按钮是否可用
				bodyBtnVisible(props);
				//更新表单数据 
				props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });				
				//表体增加空行
				addNewRow(props); 
				//设置组织本币列编辑性
				processBodyOlcRateEditable(props, extParam);
				//更新列精度
				processColumnPrecision(props, columnPrecisions);
				//设置表头字段属性
				setHeadItemProp(props, CARD_PAGE_INFO.HEAD_CODE, headItemProps);
			}
		}
	});
}



/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/