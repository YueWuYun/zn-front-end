/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { constant, requesturl } from '../../config/config';

export default function  buttonVisible(props,status) {
    
	let selectData = props.table.getCheckedRows(constant.ltablecode);
	if(selectData.length==0){
		props.button.setButtonDisabled( [
			'tally',
            'unTally',
            
            // 'joinquery',
			// 'joinquerygroup',
			'linkvoucherBtn',
            'linkregularrateBtn',
            'linkreceiptBtn',
            'linkInterestBillBtn',

			'printBtn',
            'printgroup',
            'outputBtn',
            'officialPrint',
            'elecsigninPreview',
			'printlist'
		], true);
	};
	if(selectData.length==1){
		let billstatus =  selectData[0].data.values.billstatus.value;//N=未记账，Y=已记账
		if(billstatus == 'Y'){
			props.button.setButtonDisabled( [
                'unTally',
                'joinquery',
                'joinquerygroup',
                'linkvoucherBtn',
                'linkregularrateBtn',
                'linkreceiptBtn',
                'linkInterestBillBtn',
    
                'printBtn',
                'printgroup',
                'outputBtn',
                'officialPrint',
                'elecsigninPreview',
                'printlist'
			], false);
			props.button.setButtonDisabled( [
				'tally'
			], true);
		}else{
			props.button.setButtonDisabled( [
                'tally',
                'joinquery',
                'joinquerygroup',
                'linkregularrateBtn',
                'linkreceiptBtn',
                'linkInterestBillBtn',
                'printBtn',
                'printgroup',
                'outputBtn',
                'officialPrint',
                'elecsigninPreview',
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
            'tally',
            'unTally',
            'joinquery',
            'joinquerygroup',
            'linkvoucherBtn',
            'linkregularrateBtn',
            'linkreceiptBtn',
            'linkInterestBillBtn',

            'printBtn',
            'printgroup',
            'outputBtn',
            'officialPrint',
            'elecsigninPreview',
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