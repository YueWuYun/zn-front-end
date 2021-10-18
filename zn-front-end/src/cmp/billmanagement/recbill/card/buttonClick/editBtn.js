/*bwmF6IPMGkZoKiqugZGE2oXH++yRVUPuuTdEDGrX2ENElcdZ6U00UcgHoMuKO5B1*/
/**
 * [外币兑换]-修改按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const editBtn = function () {
    /**
        * 加载模版----->根据交易类型
        */
    let edit_tradetype = this.pageId
    if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        edit_tradetype =  this.props.form.getFormItemsValue(this.formId, 'trade_type').value
    }
    this.props.pushTo('/card', {
        status: 'edit',
        id: this.props.getUrlParam('id'),
        pagecode: edit_tradetype,
        bill_no: this.props.form.getFormItemsValue(this.formId, 'bill_status').value//单据状态
    })
    this.refresh();
}

/*bwmF6IPMGkZoKiqugZGE2oXH++yRVUPuuTdEDGrX2ENElcdZ6U00UcgHoMuKO5B1*/