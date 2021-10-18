/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
/* 
 表体肩部按钮操作
 created by: liyaoh 2018-12-04
*/
import { disabledBodyButton } from '../page';
/* 
    ==================肩部按钮操作==================
*/

/**
 * 增行
 *
 */
export function addRow() {
    this.props.cardTable.addRow(this.tabCode, undefined, {}, true);
}

/**
 * 删行
 *
 */
export function deleteRow() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    let chceckedIndex = checkedRows && checkedRows.map(item => item.index);
    if (checkedRows.length > 0) {
        this.props.cardTable.delTabRowsByIndex(this.props.cardTable.getCurTabKey(), chceckedIndex);
    }
    disabledBodyButton.call(this);
}

/**
 * 复制行
 *
 * @param {*} index - 要复制的行号
 */
export function copyRow(index) {
    this.props.cardTable.pasteRow(this.tabCode, index);
}


/* 
    ==================表体行操作==================
*/


/**
 * 展开
 *
 * @param {*} record - 行数据
 */
export function toggleRowView(record) {
    this.props.cardTable.toggleRowView(this.tabCode, record);
}

/**
 * 插行
 *
 * @param {*} index - 要插入的行号
 */
export function insertRow(index) {
    this.props.cardTable.addRow(this.tabCode, index);
}

/**
 * 删行
 *
 * @param {*} index - 要删除的行号
 */
export function delRow(index) {
    this.props.cardTable.delTabRowsByIndex(this.props.cardTable.getCurTabKey(), index);
    disabledBodyButton.call(this);
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} index          行下标
 * 其中： tabs.tabId[currTableId]代表当前table的主键id的可以  
 */
export function pasteRow(index) {
    let currTableId = this.tabCode;
    let selectArr = getPasteRows.call(this);
    this.props.cardTable.insertRowsAfterIndex(currTableId, selectArr, index);
    this.props.cardTable.setValByKeyAndIndex(currTableId, index, this.tabId[currTableId], { value: null });

    this.setState(
        { isPaste: false }, () => {
            this.buttonVisible(this.props);
            this.props.cardTable.setStatus(currTableId, 'edit');
        }
    );
}

/**
 * 获取粘贴行数据
 *
 * @returns 返回粘贴行数据
 */
function getPasteRows() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    let selectRowCopy = deepClone(checkedRows);
    let selectArr = selectRowCopy.map(item => {
        item.data.selected = false;
        return item.data;
    });
    return selectArr;
}
/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/