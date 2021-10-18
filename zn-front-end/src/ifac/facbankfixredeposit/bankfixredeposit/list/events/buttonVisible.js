/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { constant, requesturl } from '../../config/config';

export default function  buttonVisible(props) {
    
	let selectData = props.table.getCheckedRows(constant.ltablecode);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			// 'Edit',
			'tally',
			'unTally',
			// 'joinquery',
			// 'joinquerygroup',
			'linkvoucherBtn',
            'linkregularrateBtn',
            'linkreceiptBtn',
			'printBtn',
			'printgroup',
			'outputBtn',
			'printlist'
		], true);
	};
	if(selectData.length==1){
		let billstate =  selectData[0].data.values.billstate.value;
		if(billstate == 1){
			props.button.setButtonDisabled( [
				'unTally',
				'joinquery',
				'joinquerygroup',
				'linkregularrateBtn',
                'linkvoucherBtn',
                'linkreceiptBtn',
				'printBtn',
				'printgroup',
				'outputBtn',
				'printlist'
			], false);
			props.button.setButtonDisabled( [
				'tally'
			], true);
		}else{
			props.button.setButtonDisabled( [
				// 'Edit',
				'tally',
				'joinquery',
				'joinquerygroup',
                'linkregularrateBtn',
                'linkreceiptBtn',
				'printBtn',
				'printgroup',
				'outputBtn',
				'printlist'
			], false);
			props.button.setButtonDisabled( [
				'unTally',
				'linkvoucherBtn',
			], true);
		}
		
	}
	if(selectData.length>1){
		props.button.setButtonDisabled( [
			// 'Edit',
			'tally',
			'unTally',
			'joinquery',
			'linkvoucherBtn',
            'linkregularrateBtn',
            'linkreceiptBtn',
			'printBtn',
			'printgroup',
			'outputBtn',
			'printlist'
		], false);
	}

	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		props.button.setButtonVisible([
			'tally',
			'unTally',
			'refreshBtn'],false);
	}
}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/