/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/

import { pageCodeCard, base_url, pageCodeList, tableId, dataSource, pkname } from '../../cons/constant.js';
import { listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
import { loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { requesturl } from '../../cons/requesturl.js';

export const bodyButtonClick = function (props, key, text, record, index) {
    let pkMapTs = {};
    let pk = record.pk_deposit && record.pk_deposit.value;
    let ts = record.ts && record.ts.value;
    pkMapTs[pk] = ts;

    switch (key) {
        //修改
        case 'edit_inner':
                go2CardCheck({
                    url: requesturl.check2card,
                    pk: record.pk_deposit.value,
                    ts: record.ts.value,
                    checkTS: record.ts.value ? true : false,
                    fieldPK: 'pk_deposit',
                    go2CardFunc: () =>{
                        props.pushTo('/card', {
                            pagecode: pageCodeCard,
                            status: 'edit',
                            id: pk
                        });
                    }
                })
            break;
        //删除
        case 'delete_inner':
            listSingleOperator(props, pageCodeList, tableId, base_url + 'FDSRDeleteaction.do', record, pkname, index, loadMultiLang(this.props, '36140FDSR-000036'), dataSource);/* 国际化处理： 操作成功！*/
            break;
        //表体 记账
        case 'tally_inner':
            listSingleOperator(props, pageCodeList, tableId, base_url + 'FDSRTallyaction.do', record, pkname, index, loadMultiLang(this.props, '36140FDSR-000049'), dataSource,null,{ btncode: 'Tally', pagecode: pageCodeList});/* 国际化处理： 记账成功！*/
            break;
        //表体 取消记账
        case 'untally_inner':
            listSingleOperator(props, pageCodeList, tableId, base_url + 'FDSRUntallyaction.do', record, pkname, index, loadMultiLang(this.props, '36140FDSR-000049'), dataSource,null,{ btncode: 'Untally', pagecode: pageCodeList});/* 国际化处理： 取消记账成功！*/
            break;
        default:
            break;
    }
}


/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/