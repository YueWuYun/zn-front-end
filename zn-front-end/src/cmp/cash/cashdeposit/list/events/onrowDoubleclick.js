/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant, requesturl } from '../../config/config'
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { cardCache} from 'nc-lightapp-front';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {
	//tm begin lidyu 并发交互跳转卡片检查 20200311
		let ts = record.ts.value;
		go2CardCheck({
			props,
			url: requesturl.gotocardcheck,
			pk: record.pk_cashdeposit.value,
			ts: record.ts.value,
			checkTS: false,
			fieldPK: constant.pkname,
			actionCode : null ,
			permissionCode: null ,
			go2CardFunc: () => {
                this.props.pushTo(constant.cardpath, {
                    pagecode: constant.cpagecode,
                    status: 'browse',
                    id: record.pk_cashdeposit.value
                });
			}
		})
	//tm end lidyu 并发交互跳转卡片检查 20200311
    //  //begin lidyu 双击进入卡片 异常交互 
    //  cardCache.setDefData(cache.iserrtoast, constant.cacheDataSource, true);
    //  //end
    // this.props.pushTo(constant.cardpath, {
    //     pagecode: constant.cpagecode,
    //     status: 'browse',
	// 	id: record.pk_cashdeposit.value
    // });
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/