/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant } from '../../config/config';
//加载小应用基础部件
import appBase from "../../base/index"
const { cons } = appBase;
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {
    let id = record.pk_transformbill.value;
    let ts = record.ts.value;
    go2CardCheck({									
        props,url:cons.url.list.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:cons.field.pk,actionCode:null,permissionCode:null,checkSaga:false,checkTS:false,go2CardFunc:()=>{											
            this.props.pushTo(constant.cardpath, {
                pagecode: constant.cpagecode,
                status: 'browse',
                id: id
            });
        }
    });	
   
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/