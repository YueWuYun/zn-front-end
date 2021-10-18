/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { buttonVisible } from '../events';

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
                        props.button.setButtonDisabled( [
                            'joinquery',
                            'joinquerygroup'
                        ], false);
					} else {
						props.table.setAllTableData(constant.ltablecode, { rows: [] });
					}
				}
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/