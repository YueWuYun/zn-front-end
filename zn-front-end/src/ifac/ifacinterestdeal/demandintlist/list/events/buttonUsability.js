/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { list_table_id } from '../../cons/constant.js';


export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);

	let type = props.getUrlParam('type');
	if('tryinter'===type){
		props.button.setButtonVisible(['refresh'], false);
	}

	let pk_intlist;
	selectData.forEach((val)=>{
		pk_intlist = val.data.values.pk_intlist.value;
	})

	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			//'linkquery',
			'linkquerygroup',
			'print',
			'prints',
			'output',
			'amount',
			'interestobj',
			'voucher'
		], true);
	};
	if (selectData.length > 1) {
		props.button.setButtonDisabled([
			'print',
			'prints',
			'output'
		], false);
	}
	if (selectData.length == 1) {
		props.button.setButtonDisabled([
			//'linkquery',
			'linkquerygroup',
			'print',
			'prints',
			'output',
			'amount',
			'interestobj',
			'voucher'
		], false);

		if(!pk_intlist){
			props.button.setButtonDisabled([
				'voucher'
			], true);
		}
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/