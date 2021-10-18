/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax ,promptBox} from 'nc-lightapp-front';
import { toast } from 'nc-lightapp-front';
//引入配置常量定义
import { module_id, base_url, card_page_id, card_from_id, card_table_id,setAddDisabled } from '../../cons/constant.js';
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
							
							// props.cardTable.setTableData(card_table_id, { rows: [] });
							props.resMetaAfterPkorgEdit();
							//处理公式
							// processFormulamsg(props, res);
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
	                content: this.state.json['36140AIAC-000028'],//弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
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
	                content: this.state.json['36140AIAC-000028'],//弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
	                //点击确定按钮事件
					beSureBtnClick: beSureBtnClickConfirm.bind(this,props,status,key,value,moduleId),
					// beSureBtnClick: this.beSureOrgBtnClick,
					cancelBtnClick: this.cancelOrgBtnClick
	            })
				props.resMetaAfterPkorgEdit();
				
			}
			break;
		//计息开始日期编辑后事件
		case 'begdate':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue.value; //新值value
			newdisplay = eventData.newvalue.display; //新值display
			if(newvalue == null){
				props.form.setFormItemsDisabled(card_from_id,{'pk_ratecode':true});
				props.form.setFormItemsValue(card_from_id,
					{ 'pk_ratecode': { value:'', display:'' }}
				); 
			}else{
				props.form.setFormItemsDisabled(card_from_id,{'pk_ratecode':false});
				props.form.setFormItemsValue(card_from_id,
					{ 'pk_ratecode': { value:'', display:'' }}
				); 
				//如果有值，给生效日期进行赋值
				props.form.setFormItemsValue(card_from_id,
					{ 'effectivedate': { value:newvalue, display:newdisplay }}
				); 
			}
			break;
		//浮动利率编辑后事件
		case 'floatingpercent':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue.value; //新值value
			newdisplay = eventData.newvalue.display; //新值display
			if(newvalue > 100 || newvalue < -100){
				toast({color:"warning",content:this.state.json['36140AIAC-000065']});/* 国际化处理： 账户重复，请重新输入*/
				props.form.setFormItemsValue(card_from_id,{ 'floatingpercent': { value:null} });/* 国际化处理：浮动利率*/
			}
			break;
		//利率编码编辑后时间
		case 'pk_ratecode':
			let begdate = props.form.getFormItemsValue(card_from_id, 'begdate').value;
			if(begdate == null){
				toast({color:"warning",content:this.state.json['36140AIAC-000064']});/* 国际化处理： 账户重复，请重新输入*/
				props.form.setFormItemsValue(card_from_id,{ 'pk_ratecode': { value:null} });/* 国际化处理： 总账户*/
			}
			break;
		//币种编辑后事件
		case 'pk_currtype':
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

			if(oldvalue !== newvalue){
				props.form.setFormItemsValue(card_from_id,
					{ 'pk_account_g': { value:'', display:'' }}
				); 
				let tablerows = props.cardTable.getAllRows(card_table_id);
				let currSelect =  [];
				tablerows.forEach(val => {
					props.cardTable.setValByKeyAndRowId(card_table_id,val.rowid,'pk_accid',{value:null, display: null});
					props.cardTable.setValByKeyAndRowId(card_table_id,val.rowid,'accountname',{value:null, display: null});
					let data = 
						[{ status:'1', rowid: val.rowid, values: { 'pk_accid': { value: null, dispaly: null},'accountname': { value: null, dispaly: null} }}]
					
					props.cardTable.updateDataByRowId(card_table_id,data);
				});
				// props.cardTable.delRowByRowId(card_table_id, currSelect);
				// props.cardTable.setTableData(card_table_id, { rows: [] });
			}  
			break;
		//子表账户编码
		case 'pk_accid':
			let changerows = props.cardTable.getRowsByIndexs(card_table_id, i);
			let allrows = props.cardTable.getVisibleRows(card_table_id);
			let flag = false;
			allrows.forEach(val => {
				if(val.rowid == changerows[0].rowid){
					
				}else{
					if(val.values.pk_accid.value == value.refpk){
						toast({color:"warning",content:this.state.json['36140AIAC-000063']});/* 国际化处理： 账户重复，请重新输入*/
						flag =true;
					}
				}
				
			});
			if(flag){
				props.cardTable.setValByKeyAndIndex(moduleId, i, 'pk_accid', {display:null, value: null });
				props.cardTable.delRowsByIndex(moduleId, i);
				break;
			}
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
				props.cardTable.setStatus(card_from_id, 'edit');
				props.resMetaAfterPkorgEdit();
				props.button.setButtonDisabled(['SaveRow', 'DeleteRow'], false);
				props.form.setFormItemsDisabled(this.formId, setAddDisabled);
				//处理公式
				// processFormulamsg(props, res);
			}
		}
		
	});
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/