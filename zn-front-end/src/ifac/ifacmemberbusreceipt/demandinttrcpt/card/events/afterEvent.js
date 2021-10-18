/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax ,promptBox} from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
import { clearCardItemValue } from '../../util/util.js';
import { setHeadItemProp } from "../../util/util";
import { requesturl } from '../../cons/requesturl';
import {processFormulamsg} from '../../util/util.js';
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
	let eventData, newvalue, extParam, newdisplay, oldvalue, olddisplay;
	let that = this;
	switch (key) {
		// 组织
		case 'pk_org':
			
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue.value; //新值value
			newdisplay = eventData.newvalue.display; //新值display
			if(eventData.oldvalue){
				oldvalue = eventData.oldvalue.value; //旧值value
				olddisplay = eventData.oldvalue.display; //旧值display
			}else{
				oldvalue = null;
				olddisplay = null;
			}
			//旧的值是空的，新的值不是空的
			if (!oldvalue && newvalue) {
				props.cardTable.addRow(this.tableId);
				extParam = { 'uiState': status };
				ajax({
					url: requesturl.edithander,
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head } = card;
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							//设置表头字段属性
							setHeadItemProp(props, card_from_id, headItemProps);	
							
							props.cardTable.setTableData(card_table_id, { rows: [] });
							props.resMetaAfterPkorgEdit();
							//处理公式
							processFormulamsg(props, res);
							this.props.button.setButtonDisabled(['SaveRow', 'DeleteRow','InsertRow'], false);
						}
					}
				});
			}
			//旧的值不是空的，新的值是空的
			if(oldvalue && !newvalue){
				this.setState({
					oldorg: oldvalue,
					oldorgDis:olddisplay
				});		
				promptBox({
	                color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
	                content: this.state.json['36050OA-000028'],//弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
	                beSureBtnClick: this.beSureOrgBtnClick,
					cancelBtnClick: this.cancelOrgBtnClick
	            })
			}
			//旧的值不是空的，新的值不是空的
			if(oldvalue && newvalue && oldvalue != newvalue){
				this.setState({
					oldorg: oldvalue,
					oldorgDis:olddisplay
				});

				promptBox({
	                color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
	                content: this.state.json['36050OA-000028'],//弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
	                //点击确定按钮事件
					beSureBtnClick: beSureBtnClickConfirm.bind(this,props,status,key,value,moduleId),
					// beSureBtnClick: this.beSureOrgBtnClick,
					cancelBtnClick: this.cancelOrgBtnClick
	            })
				props.resMetaAfterPkorgEdit();
				
			}
			break;
		
		
		case 'pk_accid':
			let changerows = props.cardTable.getRowsByIndexs(card_table_id, i);
			
			//获取页面数据
			eventData = props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id, key, changerows);
			if(value.refpk){
				//获取编辑的值
				extParam = { 'uiState': status };
				ajax({
					url: requesturl.edithander,
					data: { 'eventPosition': 'body' , 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { bodys } = card;
							props.cardTable.setValByKeyAndIndex(moduleId, i, 'accountname', {display:bodys[card_table_id].rows[0].values.accountname.value, value: bodys[card_table_id].rows[0].values.accountname.value });
							props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_accid', {display:bodys[card_table_id].rows[0].values.pk_accid.display, value: bodys[card_table_id].rows[0].values.pk_accid.value });
							props.cardTable.updateDataByIndexs(card_table_id, [{index: i, data:res.data.card.bodys[card_table_id].rows[0]}]);
							//处理公式
							processFormulamsg(props, res);
						}
					}
				});
			}
			break;
		default:
			break;
	}
}


//确认按钮
const beSureBtnClickConfirm = function(props,status,key,value,moduleId) {
	let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
	let pk_org_dis = this.props.form.getFormItemsValue(card_from_id, 'pk_org').display;
	props.form.EmptyAllFormValue(card_from_id);
	this.props.form.setFormItemsValue(card_from_id,
		{ 'memo': { value:'', display:'' },
		'pk_org': { value:pk_org, display:pk_org_dis }}
	); 
	//删掉老行
	let tableRows = props.cardTable.getVisibleRows(card_table_id);
	let rowindexlist = []
	for(var rindex = 0;rindex<tableRows.length;rindex++){
		rowindexlist[rindex] = rindex
	}
	props.cardTable.delRowsByIndex(card_table_id,rowindexlist);
	
	props.cardTable.setTableData(card_table_id, { rows: [] });
	//新增新行
	props.cardTable.addRow(card_table_id);
	let eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);

	let extParam = { 'uiState': status };
	ajax({
		url: requesturl.edithander,
		data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
		async: false,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { card, extParam, headItemProps, bodyItemProps } = data;
				let { head } = card;
				props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
				//设置表头字段属性
				setHeadItemProp(props, card_from_id, headItemProps);	
				props.cardTable.setTableData(card_table_id, res.data.card.bodys[card_table_id]);
				props.form.setFormItemsValue(moduleId,{ 'isdefault': { value:false} });/* 国际化处理： 总账户*/
				props.form.setFormItemsValue(moduleId,{ 'isgroupaccount': { value:false} });
				props.form.setFormItemsValue(moduleId,{ 'isaccounting': { value:false} });
				props.cardTable.setStatus(card_from_id, 'edit');
				props.resMetaAfterPkorgEdit();
				props.form.setFormItemsDisabled(moduleId,{'account_no':false});
				//处理公式
				processFormulamsg(props, res);
			}
		}
		
	});
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/