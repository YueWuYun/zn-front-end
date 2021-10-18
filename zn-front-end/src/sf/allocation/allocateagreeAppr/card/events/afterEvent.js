/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax,toast } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
//引入公共api
import { setHeadItemProp } from "../../../../pub/utils/SFAfterEditUtil";

export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {

	let status = props.getUrlParam('status');
	let eventData, newvalue, extParam;
	
	// 批复金额
	if (key === 'agreeamount') {
		//获取页面数据
		eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		eventData['areaname'] = card_table_id;
		let oldvalue = eventData.changedrows[0].oldvalue;
		ajax({
			url: base_url + 'alloagreeafteredit.do',
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
					//输入批复金额 核准状态联动
					// setBodyAgreeTypeByAgreeamountProp.call(this,props, card_table_id);
				}
			},
			error: (res) => {
				props.cardTable.setValByKeyAndIndex(moduleId, index, key, oldvalue);
				toast({ color: 'warning', content: res.message });
			}
		});
	}
	// 处理意见
	if (key === 'isagree') {
		//获取页面数据
		eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		eventData['areaname'] = card_table_id;
		ajax({
			url: base_url + 'alloagreeafteredit.do',
			data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventData) },
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let { card, extParam, headItemProps, bodyItemProps } = data;
					let { head, bodys } = card;
					//bodys.allocateagree_b.rows[0].values.agreetype.value;

					let flag = setBodyAgreeTypeProp(props, card_table_id);
					if(flag){
						//更新表单数据
						props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
						//更新表体数据
						props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
						//设置表头字段属性
						setHeadItemProp(props, card_from_id, headItemProps);
						//setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
					}
				}
			}
		});
	}
	// 下拨银行账户
	if (key === 'pk_bankacc_p') {
		let pk_bankdoc = value && value.values && value.values["bd_bankdoc.pk_bankdoc"].value;
		let bankdocname = value && value.values && value.values["bd_bankdoc.name"].value;
		//获取页面数据
		eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		eventData['areaname'] = card_table_id;
		ajax({
			url: base_url + 'alloagreeafteredit.do',
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
					if(!pk_bankdoc && !bankdocname){
						props.cardTable.setValByKeyAndIndex(card_table_id, index, 'bankname_p', { value: '', display: '' });
					}else{
						props.cardTable.setValByKeyAndIndex(card_table_id, index, 'bankname_p', { value: pk_bankdoc, display: bankdocname });
					}
					let rlength = bodys && bodys.allocateagree_b && bodys.allocateagree_b.rows && bodys.allocateagree_b.rows.length;
					//设置表头字段属性
					setHeadItemProp(props, card_from_id, headItemProps);

					for(let i=0;i<rlength; i++){
						if(bodys && bodys.allocateagree_b && bodys.allocateagree_b.rows && bodys.allocateagree_b.rows[i].values && bodys.allocateagree_b.rows[i].values['isnetpay'] && bodys.allocateagree_b.rows[i].values['isnetpay'].value){
							props.cardTable.setEditableByIndex(card_table_id, [i], ['isnetpay', ''], true);//设置“汇款速度”为可编辑
						}else{
							props.cardTable.setEditableByIndex(card_table_id, [i], ['isnetpay', ''], false);//设置“汇款速度”为不可编辑
							props.cardTable.setValByKeyAndIndex(card_table_id, i, 'isnetpay', { value: '', display: '' });
							//let isnetpay  = props.cardTable.getColValue(card_table_id, 'isnetpay')[i].value;
							props.cardTable.setValByKeyAndIndex(card_table_id, i, 'paytype', { value: '', display: '' });//设置“汇款速度”为空
							props.cardTable.setEditableByIndex(card_table_id, [i], ['paytype', ''], false);//设置“汇款速度”为不可编辑
						}
					}
				}
			}
		});
	}
	// 网银支付
	if (key === 'isnetpay') {
		//获取页面数据
		eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changedrows);
		eventData['areaname'] = card_table_id;
		ajax({
			url: base_url + 'alloagreeafteredit.do',
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
					setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);	
					setBodyPayType(props,card_table_id);
				}
			}
		});
	}
}

/**
 * 选择网银支付时候设置汇款速度的编辑性
 * @param {*} props 
 * @param {*} card_table_id 
 */
function setBodyPayType(props, card_table_id){
	for (let i = 0; i < props.cardTable.getColValue(card_table_id, 'isnetpay').length; i++) {
		//设置汇款速度
		let isnetpay  = props.cardTable.getColValue(card_table_id, 'isnetpay')[i].value;
		props.cardTable.setEditableByIndex(card_table_id, [i], ['paytype', ''], isnetpay);//设置“批复金额”为不可编辑
	}	
}
/**
 * 输入批复金额时候核准状态联动
 * @param {*} props 页面内置对象
 * @param {*} card_table_id 
 */
function setBodyAgreeTypeByAgreeamountProp(props, card_table_id) {
	for (let i = 0; i < props.cardTable.getColValue(card_table_id, 'applyamount').length; i++) {
		let applyamount = parseFloat(props.cardTable.getColValue(card_table_id, 'applyamount')[i].value);//申请金额
		let agreeamount = parseFloat(props.cardTable.getColValue(card_table_id, 'agreeamount')[i].value);//批复金额
		//parseFloat(s)
		if(agreeamount > applyamount){//批复金额>申请金额
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '1', display: '全部核准' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeamount', { value: applyamount, display: applyamount });//批复金额为申请金额
		}else if(agreeamount == applyamount){
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '1', display: '全部核准' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeolcamount', { value: agreeamount, display: agreeamount });//批复本币金额为0
		}else if(agreeamount>0 && agreeamount < applyamount){
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '2', display: '部分核准' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeolcamount', { value: agreeamount, display: agreeamount });//批复本币金额为0
		}else if(agreeamount == 0){
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '3', display: '未核准通过' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeolcamount', { value: agreeamount, display: agreeamount });//批复本币金额为0
		}else if(agreeamount < 0){
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '3', display: '未核准通过'});
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeamount', { value: '0', display: '0' });//批复金额为0
		}
	}
}

/**
 * 设置表体批复金额和批复本币金额字段属性
 * @param {*} props 页面内置对象
 * @param {*} card_table_id 
 */
function setBodyAgreeTypeProp(props, card_table_id) {
	for (let i = 0; i < props.cardTable.getColValue(card_table_id, 'isagree').length; i++) {
		let isagree = props.cardTable.getColValue(card_table_id, 'isagree')[i].value;
		let agreeamount = props.cardTable.getColValue(card_table_id, 'agreeamount')[i].value;
		let applyamount = props.cardTable.getColValue(card_table_id, 'applyamount')[i].value;
		if (isagree == '0') {//不同意
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '3', display: '未核准通过' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeamount', { value: '0', display: '0' });//批复金额为0
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeolcamount', { value: '0', display: '0' });//批复本币金额为0
			props.cardTable.setEditableByIndex(card_table_id, [i], ['agreeamount', ''], false);//设置“批复金额”为不可编辑
			props.cardTable.setEditableByIndex(card_table_id, [i], ['agreeolcamount', ''], false);//设置“批复本币金额”为不可编辑	
		} else if (isagree == '1') {//同意
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreetype', { value: '1', display: '全部核准' });
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeamount', { value: applyamount, display: applyamount });//批复金额为0
			props.cardTable.setValByKeyAndIndex(card_table_id, i, 'agreeolcamount', { value: applyamount, display: applyamount });//批复本币金额为0
			props.cardTable.setEditableByIndex(card_table_id, [i], ['agreeamount', ''], true);//设置“批复金额”为可编辑
			props.cardTable.setEditableByIndex(card_table_id, [i], ['agreeolcamount', ''], true);//设置“批复本币金额”为可编辑
		} 
		return true;
	}

}

/**
 * 设置表体字段属性
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 区域编码(table_code)
 * @param {*} bodyItemProps 表体页面属性
 * @param {*} body table对象 单表为table[0]
 */
function setBodyItemProp(props, bodyCode, bodyItemProps, body) {
	let flag = '';
	let tableItemProps = bodyItemProps.allocateagree_b;
	let tableValue = body
	if (bodyItemProps.length == 0) {
		return;
	}

	for (let i = 0; i < bodyItemProps.allocateagree_b.length; i++) {
		if (tableItemProps[i].eidtable === 'true') {
			flag = true;
		} else {
			flag = false;
		}
		//let id= tableItemProps[i].rowID;
		let itemn = tableItemProps[i].itemName;

		//设定每行的可编辑行
		props.cardTable.setValByKeyAndIndex(card_table_id, i, itemn, { value: null, display: null });//将值设置为空
		props.cardTable.setEditableByIndex(card_table_id, [i], [itemn, ''], flag);//设置“回款速度”为不可编辑
		// props.cardTable.setEditableByRowId(card_table_id,
		// 	tableItemProps[i].rowID,
		// 	['paytype','name'],
		// 	flag);
		//props.cardTable.setEditableByRowId(card_table_id,0,'pk_bankacc_p',false);
		//props.cardTable.hideColByKey(card_table_id,'paytype');
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/