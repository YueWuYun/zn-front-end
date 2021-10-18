/*+RA3FOaFpvSrENWZ6NQzKvxKoMifjYWd10gpBNgH09hp2SHGCC1VLCRiyzqV69C0*/
/**
 * [外币兑换]-新增按钮
 * @param {*} props  
 */
export const cardAddBtn = function () {
    let url_pk = this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value;
    let url_billstatus = '';
    if (url_pk) {
        url_billstatus = this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
    }
    this.props.pushTo('/card', {
        status: 'add',
        id: url_pk,
        bill_no: url_billstatus,
        pagecode: this.pageId
    })
    this.refresh();
}

/*+RA3FOaFpvSrENWZ6NQzKvxKoMifjYWd10gpBNgH09hp2SHGCC1VLCRiyzqV69C0*/