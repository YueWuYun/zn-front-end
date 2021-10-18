/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { jsoncode,requesturl } from '../../util/const.js';
export default function (props, config, pks) {
    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        pks: pks,
        pageid: jsoncode.pagecode,
    };
    ajax({
        url: requesturl.querypage,
        data: data,
        success: function (res) {
            props.table.setAllTableData(jsoncode.tablecode, res.data[jsoncode.tablecode]);
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/