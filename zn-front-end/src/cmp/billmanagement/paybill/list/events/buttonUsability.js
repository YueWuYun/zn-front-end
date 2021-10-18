/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { PAYBILL_CONST } from '../../cons/constant.js';

export default function  buttonUsability(props,status) {

	let selectData = props.table.getCheckedRows('table_D5');
		//PAYBILL_CONST.list_table_id);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			'delete',
			'commit',
			'uncommit',
			'BaseImageScan',
			'BaseImage',
			'BaseImageShow',
			'protopay',
			'unprotopay',
			'unassociate',
			'copy',
			'reverse',
			'billlinkquery',
			'BillLQueryVoucher',
			'printbtn',
			'moreopr',
			'printlist',
			'output',
			'file',
			'billquery',
			'linkaprv',
			'linkplanbudget',
			'dianpiao',
			'linkReceipt' ,
			'' 
			
		], true);
	};
	if(selectData.length>1){

		
		props.button.setButtonDisabled( [
			'delete',
			'commit',
			'uncommit',
			'BaseImageScan',
			'BaseImage',
			'BaseImageShow',
			'protopay',
			'unprotopay',
			'Associate',
			'unassociate',
			'copy',
			'reverse',
			'billlinkquery',
			'BillLQueryVoucher',
			'printbtn',
			'moreopr',
			'printlist',
			'output',
			'file',
			'billquery',
			'linkaprv',
			'linkplanbudget',
			'dianpiao',
			'linkReceipt',
			'billQueryGroup',
			'BaseImagegroup'
			
		], false);
		if(status){
          if(status=='0'){
			props.button.setButtonDisabled(
				[ 'uncommit' ],
				true
			);

		  }
		  if(status=='1'){
			props.button.setButtonDisabled(
				[ 'delete' ],
				true
			);

		  }
		  if(status=='2'){
			props.button.setButtonDisabled(
				[ 'delete' ],
				true
			);

		  }
    

		}


	}
	if(selectData.length==1){
	
		props.button.setButtonDisabled( [
			'delete',
			'commit',
			'uncommit',
			'BaseImageScan',
			'BaseImage',
			'BaseImageShow',
			'protopay',
			'unprotopay',
			'Associate',
			'unassociate',
			'copy',
			'reverse',
			'billlinkquery',
			'BillLQueryVoucher',
			'printbtn',
			'moreopr',
			'printlist',
			'output',
			'file',
			'billquery',
			'linkaprv',
			'linkplanbudget',
			'dianpiao',
			'linkReceipt',
			'billQueryGroup',
			'BaseImagegroup'

			
		], false);


	   let bill_status=selectData[0].data.values.bill_status.value; 
	   let is_cf= selectData[0].data.values.is_cf.value; 
	   switch (bill_status) {
		//保存
		case '-10':
		if(is_cf&&is_cf.value){
			props.button.setButtonDisabled( ['delete', 'uncommit' ], true);
		}else{
			props.button.setButtonDisabled([  'uncommit' ], true);
		}	
		break;
		//待审批
		case '-1':
		 props.button.setButtonDisabled([ 'commit'], true);
			break;
		//未确认
		case '9':
		props.button.setButtonDisabled([ 'delete' ,'uncommit','commit'], true);
			break;
		//审批通过
		case '1':
		props.button.setButtonDisabled(['commit','delete'], true);
			break;
		//签字
		case '8':
		props.button.setButtonDisabled(
				[ 'commit','delete' ],
				true
			);
			break;
	}
}
	
};

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/