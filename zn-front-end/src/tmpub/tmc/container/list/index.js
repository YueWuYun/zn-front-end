/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
  输出给外部使用的列表页按钮操作方法
  created by: liyaoh 2018-11-29
*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { printFn, output, fileMgr } from '../common';
import { getListData } from '../page';
import {
    listOperation,
    multiDeleteCallback, 
    singleDeleteCallback 
} from './methods';
const { getDefData } = cardCache;

/**
 * 列表新增
 *
 */
export function listAdd() {
    this.props.pushTo('/card', {
        status: 'add',
        pagecode: this.pageId
    });
}

/**
 * 列表修改
 *
 * @param {*} pk - 主键
 */
export function listEdit(pk) {
    this.props.pushTo('/card', {
        status: 'edit',
        id: pk,
        pagecode: this.pageId
    });
}

/**
 * 列表提交
 *
 * @param {*} args - ListBtnOperation的参数
 */
export function listCommit(args) {
    listOperation.call(this, {
        apiName: 'commit',
        composite: true, //提交即指派 
        ...args
    });
}

/**
 * 列表收回
 *
 * @param {*} args - ListBtnOperation的参数
 */
export function listUncommit(args) {
    listOperation.call(this, { apiName: 'uncommit', ...args });
}

/**
 * 列表删除
 *
 * @param {*} args - ListBtnOperation的参数
 */
export function listDelete(args) {
    let { isMulti, index } = args;
    listOperation.call(this, {
        apiName: 'delete',
        success: res => {
            if (isMulti) { //批量删除
                multiDeleteCallback.call(this, res.data, args);
            } else {
                if (index === undefined) {
                    console.error(this.state.json['TMCPUB-000056'])/* 国际化处理： 单个删除必须传入index参数！*/
                    return;
                }
                singleDeleteCallback.call(this, res.data, args);
            }
        },
        ...args
    });
}

/**
 * 列表刷新
 *
 */
export function listRefresh() {
    let searchCache = getDefData(this.searchCache.key, this.searchCache.dataSource);
    searchCache && getListData.call(this);
}

/**
 * 列表打印
 *
 * @param {*} pks - 主键数组
 */
export function listPrint(pks) {
    if (checkSelected.call(this)) {
        printFn.call(this, pks);
    }
}

/**
 * 列表输出
 *
 * @param {*} pks - 主键数组
 */
export function listOutput(pks) {
    if (checkSelected.call(this, true)) {
        output.call(this, pks);
    }
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号 
 */
export function listFileMgr(billId, billNo) {
    if (checkSelected.call(this, true)) {
        fileMgr.call(this, billId, billNo);
    }
}

/**
 * 是否选中数据
 * 
 * @param {*} checkOne 是否选中一条数据，默认false
 * @returns 返回是否校验成功
 */
export function checkSelected(checkOne = false) {
    let valid = true;
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (checkOne && selectDatas.length > 1) {
        toast({
            color: 'warning', content: this.state.json['TMCPUB-000057']/* 国际化处理： 请选中一行数据！*/
        });
        valid = false;
    } else if (selectDatas.length == 0) {
        toast({
            color: 'warning', content: this.state.json['TMCPUB-000058']/* 国际化处理： 请选择数据操作！*/
        });
        valid = false;
    }
    return valid;
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/