/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit,oid,dataSourceList } from '../../cons/constant.js';


export default function  buttonUsability(props,status) {

	let selectData = props.table.getCheckedRows(list_table_id);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			
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
			props.button.setButtonDisabled( [
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
	}
	if(selectData.length>1){
		props.button.setButtonDisabled( [
			'Print',
			'Printgroup',
			'Output',
			'Printlist'
		], false);
		props.button.setButtonDisabled( [
			'File',
			// 'link',
			'Account',
			'RegularRate',
			'CurrentRate'
		], false);
	}

	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		// props.button.setButtonVisible([
		// 	'frozen',
		// 	'defrozen'],false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/