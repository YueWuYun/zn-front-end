/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit,oid,dataSourceList } from '../../cons/constant.js';


export default function  buttonUsability(props,status) {

	let selectData = props.table.getCheckedRows(list_table_id);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			'Delete',
			'Copy',
			'Linkrate',
			'Print',
			'Printgroup',
			'Output'
		], true);
	};
	if(selectData.length>0){
		props.button.setButtonDisabled( [
			'basegroup',
			'Add',
			'Delete',
			'Copy',
			'Linkrate',
			'Print',
			'Printgroup',
			'Output'
		], false);
		


	}
	
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/