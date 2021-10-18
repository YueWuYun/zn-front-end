/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
    公共方法
    created by: liyaoh 2018-11-23
*/
import { ajax, toast, print, cacheTools } from 'nc-lightapp-front';

//按钮操作名称
export const OPR_NAME = {
    commit: 'TMCPUB-000023',/* 国际化处理： 提交*/
    uncommit: 'TMCPUB-000024',/* 国际化处理： 收回*/
    delete: 'TMCPUB-000016',/* 国际化处理： 删除*/
    save: 'TMCPUB-000000',/* 国际化处理： 保存*/
    saveCommit: 'TMCPUB-000054'/* 国际化处理： 保存提交*/
}

/**
 *  封装ajax方法，增加请求成功前/后回调
 * 
 * @param {*} url - 请求地址
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 * @param {*} error - 失败回调
 * @param {*} doBefore - 请求成功前阻断性回调
 * @param {*} doAfter - 请求成功后阻断性回调
 * @param {*} successBefore - 请求成功前回调
 * @param {*} successAfter - 请求成功后回调
 * @param {*} error - 失败回调
 *
 */
export function api({
    url,
    data,
    success,
    error,
    doBefore,
    doAfter,
    successBefore,
    successAfter
}) {
    ajax({
        url,
        data,
        success: res => {
            if (typeof doBefore === 'function') {
                doBefore();
            } else {
                if (res.success) {
                    successBefore && successBefore(res)
                    success && success(res);
                    if (typeof doAfter === 'function') {
                        doAfter();
                    } else {
                        successAfter && successAfter(res);
                    }
                }
            }
        },
        error
    });
}

/**
 * 打印
 *
 * @param {*} pks - 数组类型pk
 */
export function printFn(pks) {
    print(
        'pdf',
        this.API_URL.print,
        {
            appcode: this.appcode,
            nodekey: this.nodekey,
            oids: pks
        }
    );
}

/**
 * 输出
 *
 * @param {*} pks - 数组类型pk
 */
export function output(pks) {
    this.setState({
        outputData: {
            nodekey: this.nodekey,
            oids: pks,
            outputType: 'output'
        }
    }, () => {
        this.refs.printOutput.open();
    });
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function fileMgr(billId, billNo) {
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId, billNo }
    });
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/