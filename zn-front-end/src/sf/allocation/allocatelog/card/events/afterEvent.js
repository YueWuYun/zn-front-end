/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax } from 'nc-lightapp-front';

export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	console.log(props, moduleId, key,value, changedrows, i, s, g)
	if (key === 'pk_org_v') {
		let data = {
			nbcrcode:'HO',
			pk_group:'0001A1100000000005T5',
			pk_org:value.value
		}

	}
	if (key === 'pk_org') {
		console.log(value);

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