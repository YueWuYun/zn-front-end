/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant } from '../../config/config'
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { cardCache} from 'nc-lightapp-front';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { requesturl } from '../../config/config';

export default function onrowDoubleclick(record, index, props, e)  {

    //begin lidyu 双击进入卡片 异常交互 
    cardCache.setDefData(cache.iserrtoast, constant.cacheDataSource, true);
    //end

    //tm begin lidyu 并发交互跳转卡片检查 20200311
    let ts = record.ts.value;
    go2CardCheck({
        props,
        url: requesturl.gotocardcheck,
        pk: record.pk_accountagiotage.value,
        ts: ts,
        checkTS: false,
        fieldPK: constant.pkname,
        actionCode : null ,
        permissionCode: null ,
        go2CardFunc: () => {

           //联查场景标志
           let src = props.getUrlParam('scene');
           if(src){
            this.props.pushTo('/linkcard', {
                status: 'browse',
                id: record.pk_accountagiotage.value
            });
           }else{
            this.props.pushTo(constant.cardpath, {
                status: 'browse',
                id: record.pk_accountagiotage.value
            });
        }
     }
    })
    //tm end lidyu 并发交互跳转卡片检查 20200311 
   
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/