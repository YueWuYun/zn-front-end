/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { list_table_id } from '../../cons/constant.js';


export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);

	let scene = props.getUrlParam("scene");

	if(scene&&(scene == 'linksce')){
		props.button.setButtonVisible(['refresh'],false);
	}

	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			'linkquerygroup',
			'print',
			'prints',
			'output',
			'dereceipt',
			'linkbill'
		], true);
	};
	if (selectData.length >= 1) {
		props.button.setButtonDisabled([
			'print',
			'prints',
			'output',
			'linkquerygroup',
			'dereceipt',
			'linkbill'
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/