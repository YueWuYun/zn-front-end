/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { toast } from 'nc-lightapp-front';

/**
 * 表体编辑后事件
 * @param {*} props         页面内置对象
 * @param {*} moduleId      表体区域
 * @param {*} key           表头字段
 * @param {*} value         新值
 * @param {*} changedrows   旧值
 * @param {*} index         行序号
 * @param {*} record        行数据
 */
export function afterEvent(props, moduleId, key, value, changedrows, index, record) {
    let { setValByKeyAndIndex, setEditableRowKeyByIndex, getValByKeyAndIndex } = this.props.editTable;
    if(key==='repay_prcpl_method') {
        if(value == '5') {
            // value给空格过校验，保存的时候value赋-1，查询的时候-1改成空格
            setValByKeyAndIndex(this.tableId, index, 'repay_prcpl_period',{display:' ', value:' '});
            setEditableRowKeyByIndex(this.tableId, index, 'repay_prcpl_period', false);
        } else {
            setValByKeyAndIndex(this.tableId, index, 'repay_prcpl_period', {value: getValByKeyAndIndex(this.tableId, index, 'repay_prcpl_period')});
            setEditableRowKeyByIndex(this.tableId, index, 'repay_prcpl_period', true);
        }
    }
    if(key==='repay_intst_method') {
        if(value == '5') {
            // value给空格过校验，保存的时候value赋-1，查询的时候-1改成空格
            setValByKeyAndIndex(this.tableId, index, 'repay_intst_period', {display:' ',value:' '});
            setEditableRowKeyByIndex(this.tableId, index, 'repay_intst_period', false);
        } else {
            setValByKeyAndIndex(this.tableId, index, 'repay_intst_period', {value: getValByKeyAndIndex(this.tableId, index, 'repay_prcpl_period')});
            setEditableRowKeyByIndex(this.tableId, index, 'repay_intst_period', true);
        }
    }
}

/**
 * 查询后渲染列表前的操作
 * @param {*} grid   data.grid
 */
export function afterSearch(grid) {
    grid[this.tableId].rows.map(e => {
        if ( e.values.repay_prcpl_period.value === '-1' ) {
            e.values.repay_prcpl_period.value = ' ';
        }
        if ( e.values.repay_intst_period.value === '-1' ) {
            e.values.repay_intst_period.value = ' ';
        }
    });
    return grid;
}

/**
 * 保存前对传参进行处理
 * @param {*} sendData 传参
 */
export function beforeSave(sendData) {
    let isFlag = true;
    // 周期负数校验
    sendData.model.rows.map(e => {
        if ( Number(e.values.repay_intst_period.value) < 0 ) {
            toast({ color: 'warning', content: '付息周期不能为负数！' });
            isFlag = false;
        }
        if ( Number(e.values.repay_prcpl_period.value) < 0 ) {
            toast({ color: 'warning', content: '还款周期不能为负数！' });
            isFlag = false;
        }
    } );
    // 前台解决空格校验
    sendData.model.rows.map(e => {
        if ( e.values.repay_intst_method.value === '5' ) {
            e.values.repay_intst_period.value = '-1';
        }
        if ( e.values.repay_prcpl_method.value === '5' ) {
            e.values.repay_prcpl_period.value = '-1';
        }
    } );
    return isFlag ? sendData : 'no';
}

/**
 * 操作列按钮操作前处理
 * @param {*} sendData 传参
 */
export function beforeOpr(sendData) {
    let { repay_intst_period } = sendData.model.rows[0].values;
    let { repay_prcpl_period } = sendData.model.rows[0].values;
    repay_intst_period.value = String(repay_intst_period.value === ' ' ? -1 : repay_intst_period.value);
    repay_prcpl_period.value = String(repay_prcpl_period.value === ' ' ? -1 : repay_prcpl_period.value);
    return sendData;
}

/**
 * 渲染表格后事件
 * @param {*} data res.data
 */
export function afterSetTable(data) {
    let prcplMethodIndex = [];
    let intstMethodIndex = [];
    let prcplMethod = data.grid[this.tableId].rows.map(e => e.values.repay_prcpl_method.value);
    let intstMethod = data.grid[this.tableId].rows.map(e => e.values.repay_intst_method.value);
    for ( let i=0;i<prcplMethod.length;i++ ) {
        if( prcplMethod[i] === '5' ) {
            prcplMethodIndex.push(i);
        }
    }
    for ( let i=0;i<intstMethod.length;i++ ) {
        if( intstMethod[i] === '5' ) {
            intstMethodIndex.push(i);
        }
    }
    if( prcplMethodIndex != [] ) {
        this.props.editTable.setEditableRowKeyByIndex(this.tableId, prcplMethodIndex, 'repay_prcpl_period', false);
    }
    if( intstMethodIndex != [] ) {
        this.props.editTable.setEditableRowKeyByIndex(this.tableId, intstMethodIndex, 'repay_intst_period', false);
    }
}

/**
 * 查询区编辑后事件
 * @param {*} field 字段名
 * @param {*} val   值
 */
export function searchAfterEvent(field, val) {

}
/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/