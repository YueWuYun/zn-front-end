/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant, requesturl } from '../../config/config';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { cardCache} from 'nc-lightapp-front';


/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {

    let selectdata1 = props.table.getCheckedRows(constant.ltablecode);
    let copyid;
    let ts ;
    selectdata1.forEach((val) => {
        copyid = val.data.values.pk_cashdraw.value;
        ts = val.data.values.ts.value
    });
    //tm begin lidyu 并发交互跳转卡片检查 20200311
    go2CardCheck({
        props,
        url: requesturl.gotocardcheck,
        pk: copyid,
        ts: ts,
        checkTS: false,
        fieldPK: constant.pkname,
        actionCode : null ,
        permissionCode: null ,
        go2CardFunc: () => {
            props.pushTo(constant.cardpath, {
                pagecode: constant.cpagecode,
                status: 'browse',
                id: record.pk_cashdraw.value
            });
        }
        //tm end lidyu 并发交互跳转卡片检查 20200311
    })
    // //begin lidyu 双击进入卡片 异常交互 
    // cardCache.setDefData(cache.iserrtoast, constant.cacheDataSource, true);
    // //end
    // this.props.pushTo(constant.cardpath, {
    //     pagecode: constant.cpagecode,
    //     status: 'browse',
	// 	id: record.pk_cashdraw.value
    // });
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/