/*6t25w0Ir+d7HjFFojyGittTkduglQofWwh9FMZ6PcGLPli4IJJipD7g/i9ssClut*/



import { go2CardCheck } from "../../../../tmpub/pub/util";

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
        go2CardCheck({
            props,
            url: '/nccloud/cmp/bbr/gotocardcheck.do',
            pk: urlParam['id'],
            ts: urlParam['ts'],
            checkTS: urlParam['ts'] ? true : false,
            fieldPK: 'pk_ebm',
            checkSaga:false,
            actionCode,
            permissionCode,
            go2CardFunc: () => {
                //跳转
                props.pushTo('/card', urlParam);
                // //回调
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