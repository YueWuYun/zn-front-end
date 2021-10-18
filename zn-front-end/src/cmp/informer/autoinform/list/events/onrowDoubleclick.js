/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant } from '../../config/config';
import {URL_INFO,ITEM_INFO} from '../../cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {
    let ts = record.ts.value;
    let id = record.pk_autoinform.value;
    go2CardCheck({
		props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:true,checkTS:true,go2CardFunc:()=>{
            this.props.pushTo(constant.cardpath, {
                status: 'browse',
                id: record.pk_autoinform.value
            });
		}
	});	
   
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/