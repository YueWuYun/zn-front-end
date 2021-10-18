/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/
/**
 * [收款结算]-复制按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copyBtn = function () {
    /**
      * 加载模版----->根据交易类型
      */
    let copy_tradetype = this.pageId
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        copy_tradetype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value
    }
    this.props.pushTo('/card', {
        status: 'copy',
        id: this.props.getUrlParam('id'),
        pagecode: copy_tradetype,
        bill_no: this.props.form.getFormItemsValue(this.formId, 'bill_status').value//单据状态
    })
    this.refresh();
}

/*HJa/O7N0fyCqJl/L/a6SXmRlem2azSsyPt3cjCJGrt4u4FXe7eMLCmnyIwUKXmBo*/