/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/
import { list_table_id } from '../../cons/constant.js';


export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);

	let scene = props.getUrlParam("scene");

	let type = props.getUrlParam('type');
	if('tryinter'===type){
		props.button.setButtonVisible(['refresh'], false);
	}

	if((type&&type == 'interlist')||(scene&&(scene == 'linksce' || scene == 'fip'))){
		props.button.setButtonVisible(['refresh'],false);
		props.button.setButtonVisible(['writewithho'],false);
	}

	let pk_intlist;
	let offsetstate;
	selectData.forEach((val)=>{
		pk_intlist = val.data.values.pk_interest.value;
		offsetstate = val.data.values.offsetstate.value;
	})

	if (selectData.length == 0) {
		props.button.setButtonDisabled([
			//'linkquery',
			'writewithho',
			'unwritewithho',
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
			'writewithho',
			'unwritewithho',
			'linkquerygroup',
			'dereceipt',
			'fixrate',
			'currrate',
			'voucher'
		], false);
	}
	if (selectData.length == 1) {

		if(!pk_intlist){
			props.button.setButtonDisabled([
				'voucher'
			], true);
		}
		if(offsetstate&&offsetstate==0){
			props.button.setButtonDisabled([
				'writewithho'
			], false);
			props.button.setButtonDisabled([
				'unwritewithho'
			], true);
		}else if(offsetstate&&offsetstate==1){
			props.button.setButtonDisabled([
				'unwritewithho'
			], false);
			props.button.setButtonDisabled([
				'writewithho',
			], true);
		}else{
			props.button.setButtonDisabled([
				'writewithho','unwritewithho'
			], true);
		}
	}
};

/*+82KJqjMRCIvmhqpjXmmkPqJUgtQe+x55f7pTnExiteL9onyIcH7Auja12LoUXeP*/