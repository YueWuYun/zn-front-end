/*+jms3jnVUbHyDkjgsFSBYaALXQzDCFaA9comKxq5zZ84RnbMajT5dSuMmaRHDOQI*/
import { ajax } from 'nc-lightapp-front';

/**
 * 给修改按钮用，做saga校验
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function apiSaga(params) {
    let { data, success, error } = params;
    ajax({
        url:`/nccloud/tmpub/pub/sagacheck.do`,
        data,
        success: (res) => {
            success && success(res);
        }
    });
}
/*+jms3jnVUbHyDkjgsFSBYaALXQzDCFaA9comKxq5zZ84RnbMajT5dSuMmaRHDOQI*/