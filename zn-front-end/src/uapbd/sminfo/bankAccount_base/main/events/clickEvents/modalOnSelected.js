//TKIvkh59UKFgYAuGanKUaqq8XCx0gtRMXdLfKxWpp2CekZsVhMv7itOnAIrCmiNm
/**
 * 银行账户使用权列表行选中事件
 * @param props
 * @param moduleId
 * @param record
 * @param index
 * @param status
 */
export  default function(props, moduleId, record, index, status){
    //如果选中行是停用，则停用按钮置灰，启用一样
    if(status){
        props.button.setButtonDisabled(['modalEnable','mbtnEnable'],record.values.enablestate.value ===true);
        props.button.setButtonDisabled('mbtnDisable',record.values.enablestate.value===false);

    }else{
        props.button.setButtonDisabled(['modalEnable','mbtnEnable','mbtnDisable'],true);
    }

}

//TKIvkh59UKFgYAuGanKUaqq8XCx0gtRMXdLfKxWpp2CekZsVhMv7itOnAIrCmiNm