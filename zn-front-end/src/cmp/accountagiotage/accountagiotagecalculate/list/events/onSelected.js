/*sCAakZqYpjL2/utYp70h/rGQ+Xb1zICtnX7gCBS0RhbcLOAH34If0VRjOm9N6Ggr*/
import { constant } from '../../config/config';

export default function onSelected(props) {
	
	let selecteddata = props.editTable.getCheckedRows(constant.ltablecode);
	if(selecteddata.length > 0){
		props.editTable.setStatus(constant.ltablecode, 'edit', null);
		selecteddata.forEach((val,index)=>{
			props.editTable.setEditableRowKeyByIndex(this.tableId, val.index, 'bzName', false);
			props.editTable.setEditableRowKeyByIndex(this.tableId, val.index, 'lastCalQj', false);
			props.editTable.setEditableRowKeyByIndex(this.tableId, val.index, 'bankAccount', true);
			props.editTable.setEditableRowKeyByIndex(this.tableId, val.index, 'cashAccount', true);
		});
	} else {
		props.editTable.setStatus(constant.ltablecode, 'browse', null);
	}

	let alldata = props.editTable.getAllRows(this.tableId);
	if(alldata.length > 0){
		alldata.forEach((val,index)=>{
			if(val.selected == null || !val.selected){
				props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'bzName', false);
				props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lastCalQj', false);
				props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'bankAccount', false);
				props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'cashAccount', false);

				props.editTable.setValByKeyAndIndex(this.tableId, index, 'bankAccount', {value:'',display:'',scale:0,isEdit:false});
				props.editTable.setValByKeyAndIndex(this.tableId, index, 'cashAccount', {value:'',display:'',scale:0,isEdit:false});
			}
		});
	}
	
}

/*sCAakZqYpjL2/utYp70h/rGQ+Xb1zICtnX7gCBS0RhbcLOAH34If0VRjOm9N6Ggr*/