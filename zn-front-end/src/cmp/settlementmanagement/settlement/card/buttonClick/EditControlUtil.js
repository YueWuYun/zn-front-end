/*o0Z4B/3i7n89qxFHdCKaax+QLjxhDbFVea0ogssJqfPb8dUFtR2EqGm70hkpyscj*/
/**
 * [结算]-直联电票编辑性控制
 * @param {*} isEcds 是否电票票据大类  
 * @param {*} index 索引  
 */
export const DirectEcdsEdit = function (isEcds,index) {
    console.log('direct_ecds:', isEcds);
    console.log('index:', index);
    debugger
    if (isEcds) {
        //直联电票可以编辑
        this.props.cardTable.setEditableByIndex(this.tableId, index, 'direct_ecds', true);
    } else {
        //直联电票不可以编辑
        this.props.cardTable.setEditableByIndex(this.tableId, index, 'direct_ecds', false);
        this.props.cardTable.setValByKeyAndIndex(this.tableId, index, 'direct_ecds', { value: null, display: null });
    }
}
/*o0Z4B/3i7n89qxFHdCKaax+QLjxhDbFVea0ogssJqfPb8dUFtR2EqGm70hkpyscj*/