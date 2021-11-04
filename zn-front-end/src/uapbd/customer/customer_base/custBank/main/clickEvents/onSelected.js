//sCAakZqYpjL2/utYp70h/qhBcIZIqEWfm0e8/VApCwzcqNSEL+kZMUBilhJFJcBu
export default function (props, moduleId, record, index, status) {
    // let checkedRows = props.table.getCheckedRows(moduleId);
    // if (checkedRows.length === 0) {
    //     props.button.setButtonDisabled(['bammodalDisable', 'bammodalEdit', 'bammodalEnable'], true);
    //     return;
    // }
    let firstRows = record;
    this.setState({
        currentCustPk: firstRows.values.pk_cust.value,
        currentCustBankPk: firstRows.values.pk_custbank.value,
        currentBankaccbas: firstRows.values.pk_bankaccbas.value
    },()=>{
        //这里用display判断有点问题，但是停启用状态是根据关联项拖出来的没有value（value和display都是汉字）值只能这样了。
        props.button.setButtonDisabled(['bammodalEnable'], firstRows.values['pk_bankaccbas.enablestate'].display === '已启用' && status ? true : false);
        props.button.setButtonDisabled(['bammodalDisable'], firstRows.values['pk_bankaccbas.enablestate'].display !== '已启用' && status ? true : false);
    });
}
//sCAakZqYpjL2/utYp70h/qhBcIZIqEWfm0e8/VApCwzcqNSEL+kZMUBilhJFJcBu