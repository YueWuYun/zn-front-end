/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { list_table_id } from '../../cons/constant.js';


export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);
	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			'calculate',
			'uncalculate',
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			'preaccruedgroup',
			'trycalculate',
			//'linkquery',
			'linkquerygroup',
			'print',
			'output',
			'amount',
			'interestobj',
			'rate',
			'interlist'
		], true);
	};
	if (selectData.length > 1) {
		props.button.setButtonDisabled([
			'calculate',
			'uncalculate',
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			
			'preaccruedgroup',
			'print',
			'output'
		], false);

		props.button.setButtonDisabled([
			//'linkquery',
			'linkquerygroup',
			'amount',
			'interestobj',
			'rate',
			'trycalculate',
			'interlist'
		], true);
	}
	if (selectData.length == 1) {
		props.button.setButtonDisabled([
			'calculate',
			'uncalculate',
			'calculategroup',
			'preaccrued',
			'unpreaccrued',
			'preaccruedgroup',
			'trycalculate',
			//'linkquery',
			'linkquerygroup',
			
			'print',
			'output',
			'amount',
			'interestobj',
			'rate',
			'interlist'
		], false);
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/