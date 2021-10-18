/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax } from 'nc-lightapp-front';
import { module_id, base_url, card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';

export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	console.log(props, moduleId, key,value, changedrows, i, s, g)
	let status =props.getUrlParam("status");
	let eventData, newvalue, extParam,oldvalue;
	
	if (key === 'pk_org') {
		//获取页面数据
		let eventdata = props.createHeadAfterEventData('36320FA_C01', this.formId, [this.tableId], this.formId, key, value);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = eventdata.newvalue.value;
		oldvalue = eventdata.oldvalue.value;
		if(newvalue!=oldvalue){//值未发生改变，直接跳出
			if(props.form.getFormItemsValue(this.formId,'pk_org').display != undefined){
				console.log(eventdata);
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					async: false,
					data:{ 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventdata),extParam },
					success: (res) => {
						if(res.success) {
							let { data } = res;
							let { card,extParam, retExtParam, headProp, bodyProps } = data;
							let { head, body } = card;
							let t = { [this.formId] : head[this.formId]};
							props.form.setAllFormValue(t);
							if (extParam.hasOwnProperty('isClerBody')) {
								let flag = extParam.isClerBody;
								if (flag) {
									//清空表体
									props.cardTable.setTableData(card_table_id, { rows: [] });
								}
							}
						}
					}
				});
			}

			//主组织处理
			props.resMetaAfterPkorgEdit();
		}

	}
	if(key==='pk_bankacc_p') {
		let eventdata =props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id,key,changedrows);
		//获取编辑的值
		// newvalue = eventdata.newvalue.value;
		// oldvalue = eventdata.oldvalue.value;
		// if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(eventdata);
			if(props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p').value != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					async: false,
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventdata) },
					success: (res) => {
						if(res.success) {
							let { card, retExtParam, headProp, bodyProps } = data;
							let { head, bodys } = card;
							props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
						}
					}
				});
			}
		// }
		
	}
	if(key=='pk_bankacc_r') {
		let data =props.createBodyAfterEventData('36320FA_C01',this.formId,this.tableId,moduleId,key,value);
		//获取编辑的值
		newvalue = data.newvalue.value;
		oldvalue = data.oldvalue.value;
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.form.getFormItemsValue('table_allocate_01','pk_bankacc_p').display != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: data,
					async: false,
					success: (res) => {
						if(res.success) {
							props.cardTable.setAllTableValue(data);
						}
					}
				});
			}
		}
		
	}
	if(key=='isnetpay') {
		let data =props.createBodyAfterEventData('36320FA_C01',this.formId,this.tableId,moduleId,key,value);
		//获取编辑的值
		newvalue = data.newvalue.value;
		oldvalue = data.oldvalue.value;
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.form.getFormItemsValue('table_allocate_01','isnetpay').display != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: data,
					async: false,
					success: (res) => {
						if(res.success) {
							props.cardTable.setAllTableValue(data);
						}
					}
				});
			
			}
		}
		
		
	}

	if(key=='busitype') {
		let data =props.createBodyAfterEventData('36320FA_C01',this.formId,this.tableId,moduleId,key,value);
		//获取编辑的值
		newvalue = data.newvalue.value;
		oldvalue = data.oldvalue.value;
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.form.getFormItemsValue('form_allocate_01','busitype').display != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: data,
					async: false,
					success: (res) => {
						if(res.success) {
							props.cardTable.setAllTableValue(data);
						}
					}
				});
				if(props.form.getFormItemsValue('form_allocate_01','busitype')=='2') {
					props.form.setFormItemsDisabled('table_allocate_01',{'name':'pk_accid_r','sex':'true'})
				}else {
					props.form.setFormItemsDisabled('table_allocate_01',{'name':'pk_accid_r','sex':'false'})
				}
			}
		}
		
	}
	if(key=='pk_org_r') {
		let data =props.createBodyAfterEventData('36320FA_C01',this.formId,this.tableId,moduleId,key,value);
		//获取编辑的值
		newvalue = data.newvalue.value;
		oldvalue = data.oldvalue.value;
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.form.getFormItemsValue('table_allocate_01','pk_org_r').display != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: data,
					async: false,
					success: (res) => {
						if(res.success) {
							props.cardTable.setAllTableValue(data);
						}
					}
				});
			}
		}
		
	}
	if(key=='isreversebustype') {
		let data =props.createBodyAfterEventData('36320FA_C01',this.formId,this.tableId,moduleId,key,value);
		//获取编辑的值
		newvalue = data.newvalue.value;
		oldvalue = data.oldvalue.value;
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.form.getFormItemsValue('form_allocate_01','isreversebustype').display != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: data,
					async: false,
					success: (res) => {
						if(res.success) {
							props.cardTable.setAllTableValue(data);
						}
					}
				});
			}
		}
		
	}
	if (key === 'cmaterialvid') {
		let materialsNew = value;
		console.log(materialsNew)
		if(materialsNew && materialsNew.length>1){
			props.cardTable.setValByKeyAndIndex(moduleId,i,key,{value:materialsNew[0].refpk,display:materialsNew[0].refname});
			for(let i=1;i<materialsNew.length;i++){
				props.cardTable.addRow(moduleId);
				let ll = props.cardTable.getNumberOfRows(moduleId);
				props.cardTable.setValByKeyAndIndex(moduleId, ll-1,key,{value:materialsNew[i].refpk,display:materialsNew[i].refname});
			}
		}
	}
	//表体编辑后事件
    if(key == 'fconfirmpoint'){
		let data = props.createBodyAfterEventData('20521030', this.formId, this.tableId, moduleId, key, changedrows);
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/