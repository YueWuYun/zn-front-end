/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit,oid,dataSourceList } from '../../cons/constant.js';


export default function  buttonUsability(props,status) {

	let selectData = props.table.getCheckedRows(list_table_id);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			'frozen',
			'defrozen',
			'File',
			// 'link',
			'linkgroup',
			'Account',
			'RegularRate',
			'CurrentRate',
			'Print',
			'Printgroup',
			'Output',
			'Printlist'
		], true);
	};
	if(selectData.length==1){
		let billstate =  selectData[0].data.values.billstate.value;
		if(billstate == 1){
			props.button.setButtonDisabled( [
				'frozen',
				'File',
				// 'link',
				'linkgroup',
				'Account',
				'RegularRate',
				'CurrentRate',
				'Print',
				'Printgroup',
				'Output',
				'Printlist'
			], false);
			props.button.setButtonDisabled( [
				'defrozen',
				
			], true);
		}else if(billstate == 2){
			props.button.setButtonDisabled( [
				'defrozen',
				'File',
				// 'link',
				'linkgroup',
				'Account',
				'RegularRate',
				'CurrentRate',
				'Print',
				'Printgroup',
				'Output',
				'Printlist'
			], false);
			props.button.setButtonDisabled( [
				'frozen',
				
			], true);
		}else{
			props.button.setButtonDisabled( [
				// 'link',
				'File',
				'linkgroup',
				'Account',
				'RegularRate',
				'CurrentRate',
				'Print',
				'Printgroup',
				'Output',
				'Printlist'
			], false);
			props.button.setButtonDisabled( [
				'defrozen',
				'frozen'
			], true);
		}
		
	}
	if(selectData.length>1){
		props.button.setButtonDisabled( [
			// 'Edit',
			'frozen',
			'defrozen',
			'File',
			// 'link',
			'Account',
			'RegularRate',
			'CurrentRate',
			'Print',
			'Printgroup',
			'Output',
			'Printlist'
		], false);
	}

	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		props.button.setButtonVisible([
			'frozen',
			'defrozen'],false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/