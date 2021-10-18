/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { constant, requesturl } from '../../config/config';

export default function  buttonVisible(props,status) {
    
	let selectData = props.table.getCheckedRows(constant.ltablecode);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			'reDepositProcess',
            'unReDepositProcess',
            'reDepositProcessGroup',

            // 'joinquery',
			// 'joinquerygroup',
			'linkregularrateBtn',
            'linkDepositBillBtn',
            'linkReDepositBillBtn',
            'linkInterestBillBtn',

			'printBtn',
			'printgroup',
			'printlist'
		], true);
	};
	
	if(selectData.length==1){
		let oridepositdate =  selectData[0].data.values.oridepositdate.value;//初始存款日期
		let depositdate =  selectData[0].data.values.depositdate.value;//存入日期 
		if(oridepositdate != depositdate){// 转存过,所有按钮都可以使用
			props.button.setButtonDisabled( [
				'reDepositProcess',
				'unReDepositProcess',
				'reDepositProcessGroup',
	
				'joinquery',
				'joinquerygroup',
				'linkregularrateBtn',
				'linkDepositBillBtn',
				'linkReDepositBillBtn',
				'linkInterestBillBtn',
	
				'printBtn',
				'printgroup',
				'printlist'
			], false);
		}else{
			props.button.setButtonDisabled( [
				'reDepositProcess',
				// 'reDepositProcessGroup',
	
				'joinquery',
				'joinquerygroup',
				'linkregularrateBtn',
				'linkDepositBillBtn',
				'linkReDepositBillBtn',
				'linkInterestBillBtn',
	
				'printBtn',
				'printgroup',
				'printlist'
			], false);
			props.button.setButtonDisabled( ['unReDepositProcess'], true);
		}
	}

	if(selectData.length>1){
		props.button.setButtonDisabled( [
			'reDepositProcess',
            'unReDepositProcess',
            'reDepositProcessGroup',

            'joinquery',
			'joinquerygroup',
			'linkregularrateBtn',
            'linkDepositBillBtn',
            'linkReDepositBillBtn',
            'linkInterestBillBtn',

			'printBtn',
			'printgroup',
			'printlist'
		], false);
	}
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/