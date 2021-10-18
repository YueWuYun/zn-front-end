/*p0LZsK0dApV/SIQ0FAXluHHkN1vJS/saxzHYFov0d3K9EpQnm1WwfouEoeNhg0oV*/
/**
 * [收款协同]-确认
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const confirmBtn = function (record, index) {
    this.props.pushTo('/card', {
        status: 'edit',
        billstatus: record.bill_status.value,//单据状态
        id: record.pk_recbill.value,
    })
}

/*p0LZsK0dApV/SIQ0FAXluHHkN1vJS/saxzHYFov0d3K9EpQnm1WwfouEoeNhg0oV*/