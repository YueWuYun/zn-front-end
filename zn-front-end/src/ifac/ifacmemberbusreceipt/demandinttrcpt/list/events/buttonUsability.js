/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, base_url, list_page_id, list_search_id, list_table_id, button_limit,oid,dataSourceList } from '../../cons/constant.js';


export default function  buttonUsability(props,status) {

	let selectData = props.table.getCheckedRows(list_table_id);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			// 'Edit',
			'Tally',
			'UnTally',
			// 'link',
			'linkgroup',
			'Linkvoucher',
			'Linkrate',
			'Print',
			'Printgroup',
			'Output',
			'Printlist',
			'ElecsigninPreview',
			'OfficialPrint'
		], true);
	};
	if(selectData.length==1){
		let tallyflag =  selectData[0].data.values.tallyflag.value;
		if(tallyflag == 1){
			props.button.setButtonDisabled( [
				'UnTally',
				'link',
				'linkgroup',
				'Linkrate',
				'Linkvoucher',
				'Print',
				'Printgroup',
				'Output',
				'Printlist',
				'ElecsigninPreview',
				'OfficialPrint'
			], false);
			props.button.setButtonDisabled( [
				'Tally',
				
			], true);
		}else{
			props.button.setButtonDisabled( [
				// 'Edit',
				'Tally',
				'link',
				'linkgroup',
				'Linkrate',
				'Print',
				'Printgroup',
				'Output',
				'Printlist',
				'ElecsigninPreview',
				'OfficialPrint'
			], false);
			props.button.setButtonDisabled( [
				'UnTally',
				'Linkvoucher',
			], true);
		}
		
	}
	if(selectData.length>1){
		props.button.setButtonDisabled( [
			// 'Edit',
			'Tally',
			'UnTally',
			'link',
			'Linkvoucher',
			'Linkrate',
			'Print',
			'Printgroup',
			'Output',
			'Printlist',
			'ElecsigninPreview',
			'OfficialPrint'
		], false);
	}

	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		props.button.setButtonVisible([
			'Tally',
			'UnTally',
			'ElecsigninPreview',
			'OfficialPrint',
			'Refresh'],false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/