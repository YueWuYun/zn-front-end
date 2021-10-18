/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/
import {viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * [收款结算]-新增按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const addBtn = function () {
    /**
     * 加载模版----->如果选择了交易类型，根据交易类型
     *        ----->如果没有选择则跟据原始数据
     */
    let add_tradetype = this.pageId;//默认模版[]
    let tradetype = getGlobalStorage('sessionStorage', 'sessionTP');//按钮选择的交易类型
    if (tradetype && tradetype.length > 0) {
        add_tradetype = tradetype;
    }
    let url_pk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let url_billstatus = '';
    if (url_pk) {
        url_billstatus = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
    }
    this.props.pushTo('/card', {
        status: 'add',
        id: url_pk,
        bill_no: url_billstatus,//单据状态
        pagecode: add_tradetype
    })
    this.refresh();
}

/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/