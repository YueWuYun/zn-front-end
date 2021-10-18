/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
import { constant, requesturl,buttonDisable } from '../../config/config';
// import { setButtonUsability } from '../events';

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
                        let billid = data[constant.ltablecode].rows[0].values.pk_fixredeposit.value;
                        that.setState({
                            addid: billid
                        });
                        props.table.setAllTableData(constant.ltablecode, data[constant.ltablecode]);
                        
                        let selectdata = props.table.getCheckedRows(constant.ltablecode);
                        props.button.setButtonVisible(buttonDisable.allBtn, true);
                        if(selectdata.length > 0 ){
                            props.button.setButtonDisabled(buttonDisable.listdisable, false);
                        } else {
                            props.button.setButtonDisabled(buttonDisable.listdisable, true);
                        }
					} else {
						props.table.setAllTableData(constant.ltablecode, { rows: [] });
					}
				}
        }
    });
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/