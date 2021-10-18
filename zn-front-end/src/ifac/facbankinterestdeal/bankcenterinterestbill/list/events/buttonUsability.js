/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { list_table_id } from '../../cons/constant.js';


export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);

	let type = props.getUrlParam('type');

	let scene = props.getUrlParam('scene');

	if('tryinter'===type){
		props.button.setButtonVisible(['refresh'], false);
	}

	if((type&&type == 'interlist')||(scene&&(scene == 'linksce' || scene == 'fip'))){
		props.button.setButtonVisible(['refresh'],false);
	}


	let pk_intlist;
	selectData.forEach((val)=>{
		pk_intlist = val.data.values.pk_interest.value;
	})

	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			//'linkquery',
			'linkquerygroup',
			'print',
			'prints',
			'output',
			'dereceipt',
			'fixrate',
			'currrate',
			'voucher'
		], true);
	};
	if (selectData.length >= 1) {
		props.button.setButtonDisabled([
			'print',
			'prints',
			'output',
			'linkquerygroup',
			'dereceipt',
			'fixrate',
			'currrate',
			'voucher'
		], false);

		props.button.setButtonDisabled([
			//'linkquery',
			
		], true);
	}
	if (selectData.length == 1) {
		if(!pk_intlist){
			props.button.setButtonDisabled([
				'voucher'
			], true);
		}
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/