/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
import {ajax} from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { setButtonUsability } from '../events';

export default function(props, config, pks) {
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
                        // let billid = data[constant.ltablecode].rows[0].values.pk_debitcontract_icdmc.value;
                        // that.setState({
                        //     addid: billid
                        // });
                        props.table.setAllTableData(constant.ltablecode, data[constant.ltablecode]);
                        setButtonUsability.call(this, this.props);
					} else {
						props.table.setAllTableData(constant.ltablecode, { rows: [] });
					}
				}
        }
    });
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/