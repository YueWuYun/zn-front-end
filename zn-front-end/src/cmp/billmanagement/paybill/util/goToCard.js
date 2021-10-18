/*6t25w0Ir+d7HjFFojyGittTkduglQofWwh9FMZ6PcGLPli4IJJipD7g/i9ssClut*/

import appBase from "../base/index";
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';
const { comp, api, cons } = appBase;
/**
 * 列表API
 */

/**
 * 跳转卡片
 * @param {*} props 页面内置对象
 * @param {*} urlParam 地址栏参数
 * @param {*} getStateFunc 获取列表state中的数据
 * @param {*} callback 回调
 */
export const  go2Card = function (props, urlParam, {  callback = null, actionCode = null, permissionCode = null }) {
    //没有地址栏参数，则自动补充浏览态的地址栏参数
    if (!urlParam) {
        urlParam = {};
    }
    if (!urlParam.status) {
        urlParam['status'] = 'browse'
    }
    if(urlParam['status']=='edit'||urlParam['status']=='copy'||urlParam['status']=='browse'){
           api.comm.go2CardCheck({
            props,
            url: cons.comm.go2cardcheck,
            pk: urlParam['id'],
            ts: urlParam['ts'],
            checkTS: urlParam['ts'] ? true : false,
            fieldPK: cons.field.pk,
            actionCode,
            permissionCode,
            go2CardFunc: () => {
                //跳转
                props.pushTo(cons.card.cardPage, urlParam);
                //回调
                if (callback && (typeof callback == 'function')) {
                    callback(props);
                }
            }
        })


    }

    
    
}



/**
 * 列表API列表
 */
export default {
    go2Card
};
/*6t25w0Ir+d7HjFFojyGittTkduglQofWwh9FMZ6PcGLPli4IJJipD7g/i9ssClut*/