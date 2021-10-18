/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax,toast } from 'nc-lightapp-front';
//import { jsondata } from '../jsondata.js';
export default function afterEvent(props, moduleId, key, value, changedrows, i, record, g) {

	let tableId = 'exsign_table';
	let pageId = '36070BAES';
	let newvalue = changedrows[0].newvalue;
	let oldvalue = changedrows[0].oldvalue;
	let rowid = changedrows[0].rowid;
	if (key === 'tempassword') {
		if(!value){
			props.editTable.setValByKeyAndIndex(tableId,i,'password',{value: value, display:value});
			props.editTable.setValByKeyAndIndex(tableId,i,'tempassword',{value: '********', display:'*********'});
		}else{
			props.editTable.setValByKeyAndIndex(tableId,i,'password',{value: value, display:value});
			props.editTable.setValByKeyAndIndex(tableId,i,'tempassword',{value: '********', display:'*********'});
		}
		
	}

	if (key === 'islowmnycontrol') {
		if(!value){
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'lowmoney', false);
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'lowmnycontrolsche', false);
		}else{
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'lowmoney', true);
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'lowmnycontrolsche',true);
		}
		
	}
	if (key === 'ishighmnycontrol') {
		if(!value){
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'highmoney', false);
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'highmnycontrolsche', false);
		}else{
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'highmoney', true);
			props.editTable.setEditableRowKeyByIndex(pageId, i, 'highmnycontrolsche',true);
		}
	}
	
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/