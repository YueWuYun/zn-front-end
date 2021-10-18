/*wvHh1BIozH7NG6f/u06b7XwVELcJ2cnam9YXpPtc107yVZlEBLrMNH9SIYRppgid*/
/**
 * 批量操作前处理
 * @param {*} data 传参
 */
export default function beforeBatch(data) {
    // 空格校验
    data.model.rows.map(e => {
        if (e.values.repay_intst_period.value === " " || "") {
            e.values.repay_intst_period.value = "-1";
        }
        if (e.values.repay_prcpl_period.value === " " || "") {
            e.values.repay_prcpl_period.value = "-1";
        }
    });
    return data;
}
/*wvHh1BIozH7NG6f/u06b7XwVELcJ2cnam9YXpPtc107yVZlEBLrMNH9SIYRppgid*/