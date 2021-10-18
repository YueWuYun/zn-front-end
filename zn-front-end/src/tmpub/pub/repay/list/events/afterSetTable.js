/*wjQUEFhjr5KE8KAH95H4SyCJVto5MBb3lv8xvJxdusolXBLbhlCbOyD+FOqpCsuB*/
// import {
//     repay_prcpl_method_afterEvent,
//     repay_intst_method_afterEvent
// } from "./afterEvent";
// /**
//  * 渲染表格之后的事件
//  */

// export default function afterTableEvent(tableData) {
//     // 预置数据不可操作
//     tableData.grid[this.tableId].rows.forEach((item, index) => {
//         // 系统标识 、 还本方式 、 付息方式
//         let {
//             system_flag,
//             repay_prcpl_method,
//             repay_intst_method
//         } = item.values;
//         // 不是系统预制
//         if (!system_flag.value) {
//             // 当 还本方式 为 到期一次还本=5,不规则还本=6 时 相关还本相关字段不可编辑
//             if (
//                 repay_prcpl_method.value === "5" ||
//                 repay_prcpl_method.value === "6"
//             ) {
//                 // 还本方式编辑后
//                 repay_prcpl_method_afterEvent.call(
//                     this,
//                     this.tableId,
//                     null,
//                     index,
//                     repay_prcpl_method.value
//                 );
//             }
//             // 当 付息方式 为 到期一次付息=5,分期结息到期一次付息=6 时 相关付息相关字段不可编辑
//             if (
//                 repay_intst_method.value === "5" ||
//                 repay_intst_method.value === "6"
//             ) {
//                 // 付息方式编辑后
//                 repay_intst_method_afterEvent.call(
//                     this,
//                     this.tableId,
//                     null,
//                     index,
//                     repay_intst_method.value
//                 );
//             }
//         }
//     });
// }

/**
 * 渲染表格后事件
 * @param {*} data res.data
 */
export default function afterSetTable(data) {
    let prcplMethodIndex = [];
    let intstMethodIndex = [];
    let prcplMethod = data.grid[this.tableId].rows.map(
        e => e.values.repay_prcpl_method.value
    );
    let intstMethod = data.grid[this.tableId].rows.map(
        e => e.values.repay_intst_method.value
    );
    for (let i = 0; i < prcplMethod.length; i++) {
        if (prcplMethod[i] === "5") {
            prcplMethodIndex.push(i);
        }
    }
    for (let i = 0; i < intstMethod.length; i++) {
        if (intstMethod[i] === "5") {
            intstMethodIndex.push(i);
        }
    }
    if (prcplMethodIndex != []) {
        this.props.editTable.setEditableRowKeyByIndex(
            this.tableId,
            prcplMethodIndex,
            "repay_prcpl_period",
            false
        );
    }
    if (intstMethodIndex != []) {
        this.props.editTable.setEditableRowKeyByIndex(
            this.tableId,
            intstMethodIndex,
            "repay_intst_period",
            false
        );
    }
}
/*wjQUEFhjr5KE8KAH95H4SyCJVto5MBb3lv8xvJxdusolXBLbhlCbOyD+FOqpCsuB*/