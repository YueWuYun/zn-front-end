/*+4IVkrChYQbzvdNgD5JlWl/s3k7/qIMJcX9oDS9okPfvY4g9UmZROOQwm0gllshr*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, pagecode } from '../constants';
import { refresh } from './refresh';
let { NCMessage } = base;
/**
 * 具体的业务操作
 * @param {*} props 
 * @param {*} url ：ajax请求url
 * @param {*} message ：提示语
 * @param {*} source :区别操作的来源：head表头，iner表内
 * @param {*} context :当表内操作时，才会传
 */
export function busiOperate(that, props, url, opername, source, context) {
    //表头操作
    if (source == 'head') {
        const selectedData = props.table.getCheckedRows(tableId);
        if (selectedData.length == 0) {
            toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
            return;
        } else {
            let indexMap = new Map();
            let pks = [];
            selectedData.forEach((vale) => {
                let pk;
                pk = vale.data.values.pk_informer.value;
                pks.push(pk);
                indexMap.set(pk, vale.index);
            });
            let data = {
                pks: pks,
                pageid: pagecode,
            }
            ajax({
                url: url,
                data: data,
                success: (res) => {
                    refresh(props, res, indexMap, opername, source);
                }
            });
        }
    }
    //表内操作
    if (source == 'inner') {
        ajax({
            url: url,
            data: context.data,
            success: (res) => {
                refresh(props, res, null, opername, source, context.index);
            }
        });
    }

}

/*+4IVkrChYQbzvdNgD5JlWl/s3k7/qIMJcX9oDS9okPfvY4g9UmZROOQwm0gllshr*/