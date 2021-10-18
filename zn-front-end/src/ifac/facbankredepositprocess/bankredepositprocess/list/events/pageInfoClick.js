/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import buttonVisible from '../events';

export default function (props, config, pks) {
    let that = this;
    let data = {
        pks: pks,
        pageCode: constant.lpagecode
    };
    ajax({
        url: requesturl.querybypks,
        data: data,
        success: (res) => {
            let { success, data } = res;
				if (success) {
					if (data) {
                        let billid = data[constant.ltablecode].rows[0].values.pk_depositreceipt.value;
                        that.setState({
                            addid: billid
                        });
                        props.table.setAllTableData(constant.ltablecode, data[constant.ltablecode]);
                        
                        let selectData = props.table.getCheckedRows(constant.ltablecode);
                        if(selectData.length==0){
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
                            ], true);
                        };
                        if(selectData.length>=1){
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
					} else {
						props.table.setAllTableData(constant.ltablecode, { rows: [] });
					}
				}
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/