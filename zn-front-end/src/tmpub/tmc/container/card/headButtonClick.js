/*Hita0WssSbjpM+C19QDJ0yVxsDEhXEayUaN82EjYzzloqxdvRLgLDclyTuJEr/sM*/
/* 
 表头按钮操作
 created by: liyaoh 2018-12-04
*/
import { toast, cardCache } from 'nc-lightapp-front';
import { baseOperation, saveBill, saveBefore } from './methods';
import { printFn, output, fileMgr } from '../common';
import { getCardData, setEditStatus, clearAll, initForm, setHeadItemsDisabled } from '../page';
let { getCacheById, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
/**
 * 新增
 * 
 */
export function cardAdd() {
    this.props.setUrlParam({ status: 'add' });
    // clearAll.call(this, this.props);
    initForm.call(this, 'add');
    this.buttonVisible(this.props);
    // setEditStatus.call(this, 'add');

}

/**
 * 修改
 * 
 */

export function cardEdit() {
    this.props.setUrlParam({ status: 'edit' });
    setEditStatus.call(this, 'edit', () => {
        setHeadItemsDisabled.call(this);
    });
}

/**
 * 删除
 *
 * @param {*} params
 */
export function cardDelete() {
    baseOperation.call(this, {
        apiName: 'delete',
        success: (res, pk) => {
            // 获取下一条数据的id
            let nextId = getNextId(pk, this.dataSource);
            //删除缓存
            deleteCacheById(this.primaryId, pk, this.dataSource);
            if (nextId) {
                getCardData.call(this, nextId);
            } else {// 删除的是最后一个的
                this.props.setUrlParam('');
                setEditStatus.call(this, 'browse');
                clearAll.call(this);
            }
        }
    });
}

/**
 * 保存
 *
 */
export function cardSave() {
    saveBefore.call(this, (data) => {
        saveBill.call(this, 'save', data)
            .then(id => {
                this.props.setUrlParam({
                    id,
                    status: 'browse'
                });
                setEditStatus.call(this, 'browse');
                getCardData.call(this, id);
            });
    });
}

/**
 * 保存新增
 *
 */
export function cardSaveAdd() {
    saveBefore.call(this, (data) => {
        saveBill.call(this, 'save', data)
            .then(() => {
                this.props.setUrlParam({ status: 'add' });
                clearAll.call(this, this.props);
                initForm.call(this, 'add');
                cardAdd.call(this);
            });
    });
}

/**
 * 保存提交
 *
 */
export function cardSaveCommit() {
    saveBefore.call(this, (data) => {
        saveBill.call(this, 'save', data)
            .then(id => {
                this.props.setUrlParam({
                    id,
                    status: 'browse'
                });
                setEditStatus.call(this, 'browse');
                getCardData.call(this, id, false, true, () => {
                    cardCommit.call(this);
                });
            });

    });
}

/**
 * 取消
 *
 */
export function cardCancel() {
    let id = this.props.getUrlParam('id');
    this.props.setUrlParam({ status: 'browse' });
    if (id) { //有id切换编辑态
        this.props.form.cancel(this.formId);
        this.tabCode && this.props.cardTable.resetTableData(this.tabCode);
        setEditStatus.call(this, 'browse');
    } else { //没有id查缓存中最后一条数据
        let currentLastId = getCurrentLastId(this.dataSource);
        id = currentLastId ? currentLastId : '';
        this.props.setUrlParam({ id });
    }
    getCardData.call(this, id);
}


/**
 * 提交
 *
 */
export function cardCommit(params) {
    baseOperation.call(this, {
        apiName: 'commit',
        composite: true, //提交即指派
        ...params
    });
}

/**
 * 收回
 *
 */
export function cardUncommit() {
    baseOperation.call(this, { apiName: 'uncommit' });
}

/**
 * 刷新
 *
 */
export function cardRefresh(id, isFirst, isRefresh) {
    getCardData.call(this, id, isFirst, isRefresh);
}

/**
 * 打印
 *
 * @param {*} pks - 主键数组
 */
export function cardPrint(pks) {
    printFn.call(this, pks);
}

/**
 * 输出
 *
 * @param {*} pks - 主键数组
 */
export function cardOutput(pks) {
    output.call(this, pks);
}


/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function cardFileMgr(billId, billNo) {
    fileMgr.call(this, billId, billNo);
}
/*Hita0WssSbjpM+C19QDJ0yVxsDEhXEayUaN82EjYzzloqxdvRLgLDclyTuJEr/sM*/