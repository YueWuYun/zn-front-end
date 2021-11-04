//UM7fvRi3NUp/fLEfXMaYuhJS5txl//TvxAIfRAFotd5y2rYLZk35703jzTw+71Hg
export default function (props, moduleId, record, index,e ) {
    //这里用display判断有点问题，但是停启用状态是根据关联项拖出来的没有value（value和display都是汉字）值只能这样了。
    props.button.setButtonDisabled(['bammodalEnable'],
        record.values['pk_bankaccbas.enablestate'].display ==
        this.state.json['10140CUST-000047']  ? true : false );/* 国际化处理： 已启用*/
    props.button.setButtonDisabled(['bammodalDisable'],
        record.values['pk_bankaccbas.enablestate'].display !=
        this.state.json['10140CUST-000047'] ? true : false );/* 国际化处理： 已启用*/
    props.button.setButtonDisabled(['bammodalDel','bammodalEdit'],false);
    props.button.setButtonVisible(['bammodalEnable'],
        record.values['pk_bankaccbas.enablestate'].display !=
        this.state.json['10140CUST-000047']  ? true : false );/* 国际化处理： 已启用*/
    props.button.setButtonVisible(['bammodalDisable'],
        record.values['pk_bankaccbas.enablestate'].display ==
        this.state.json['10140CUST-000047'] ? true : false );/* 国际化处理： 已启用*/
    props.button.setButtonDisabled(['bammodalDel','bammodalEdit'],false);
    this.setState({
        currentCustPk:record.values.pk_cust.value,
        currentCustBankPk:record.values.pk_custbank.value,
        currentBankaccbas:record.values.pk_bankaccbas.value});
}

//UM7fvRi3NUp/fLEfXMaYuhJS5txl//TvxAIfRAFotd5y2rYLZk35703jzTw+71Hg