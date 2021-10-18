/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { setButtonUsability } from '../events';
export default function (props, config, pks) {

    let that = this;

    // 后台还没更新，暂不可用
    let data = {
        pks: pks,
        pageCode: constant.lpagecode
    };
    ajax({
        url: requesturl.querybyids,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let billid = data[constant.ltablecode].rows[0].values.pk_cashdeposit.value;
                    that.setState({
                        addid: billid
                    });
                    props.table.setAllTableData(constant.ltablecode, data[constant.ltablecode]);
                    setButtonUsability.call(this, this.props);
                } else {
                    props.table.setAllTableData(constant.ltablecode, { rows: [] });
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/