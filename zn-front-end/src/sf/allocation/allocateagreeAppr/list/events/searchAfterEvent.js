/*VRi3nyqaeOPenSkOLNstN6f0WX6HUazKHETYQ85QLUTiWu0DZbEBxBnFzoCFIPhN*/
import { ajax } from 'nc-lightapp-front';

export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	console.log(props, moduleId, key,value, changedrows, i, s, g);

	//console.log('~~~~~',AllocateAgreeCache);


	if (key === 'pk_org_v') {
		// let val = { display: value.refname, value: value.refpk };
		// props.form.setFormItemsValue(moduleId, { pk_org: val });
		let data = {
			nbcrcode:'HO',
			pk_group:'0001A1100000000005T5',
			pk_org:value.value
		}
		// ajax({
		// 	url: '/nccloud/reva/revebill/contractfront.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if(res.success) {
		// 			let pk_org_v_value = res.data[1];
		// 			props.form.setFormItemsValue(moduleId, { vbillcode: pk_org_v_value });
		// 		}
		// 	}
		// });

	}
	if (key === 'pk_org') {
		console.log(value);
		// let val = { display: value.refname, value: value.refpk };
		// props.form.setFormItemsValue(moduleId, { pk_org: val });

		//主组织处理
		//props.resMetaAfterPkorgEdit();

	}
	if (key === 'dbilldate') {
		//表头编辑后事件
		// let data = props.createHeadAfterEventData('20521030', this.formId, this.tableId, moduleId, key, value);
		// ajax({
		// 	url: '/nccloud/reva/revebill/afteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		if (res.data && res.data.head && res.data.head.head) {
		// 			let dealmny = res.data.head.head.rows[0].values.ndealtotalmny;
		// 			props.form.setFormItemsValue(moduleId, { ndealtotalmny: dealmny });
		// 		}
		// 	}
		// });
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
		// ajax({
		// 	url: '/nccloud/reva/revebill/cardafteredit.do',
		// 	data: data,
		// 	success: (res) => {
		// 		debugger
		// 		if (res.data && res.data.body && res.data.body[this.tableId]) {
		// 			let npobnum = res.data.body[this.tableId].rows[0].values.npobnum;
		// 			props.cardTable.setValByKeyAndRowNumber(moduleId, i+1,'npobnum',npobnum.value);
		// 		}
		// 	}
		// });
	}

	
}

/*VRi3nyqaeOPenSkOLNstN6f0WX6HUazKHETYQ85QLUTiWu0DZbEBxBnFzoCFIPhN*/