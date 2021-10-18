/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/
import Sign from '../../../../tmpub/pub/util/ca';
import {constant} from '../config/config';
// 输入密钥
export default async function ca_iskey() {
    let ressigndata = await Sign({
        isSign: false,
        isKey: true,
        data: null,
        encryptVOClassName: null
        // head: 'form'
    });
    if (ressigndata.isStop) {
        return;
    }
}


/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
export const processHeadOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(constant.formcode1, {   gllcrate: flag });
   }
}
/*Fnw/+7RrVHUifmTwZcmqxdrY3lVTDPaV0QO7i2EeE9k=*/