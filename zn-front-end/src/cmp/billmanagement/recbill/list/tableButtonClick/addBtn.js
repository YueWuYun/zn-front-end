/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/
/**
 * [收款结算]-新增按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const addBtn = function (record,index) {
    this.props.pushTo('/card', {
        status: 'add',
        pagecode: this.state.tradeCode,
        form: 'fromlist',
        id: this.state.add_pk,//查询后赋值，单据pk
        bill_no: this.state.add_status//查询后赋值，单据状态
    })
}

/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/