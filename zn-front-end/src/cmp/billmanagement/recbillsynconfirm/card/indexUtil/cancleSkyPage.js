/*TFVuhbSSJEZIc6So1uYir2v0gpOG9OwJ9p7POAV4Q0njgRFN0TAvq36e5pov/ebu*/
/**
 * [收款协同]-空页面
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cancleSkyPage = function () {
    this.props.form.EmptyAllFormValue(this.formId);
    this.props.cardTable.setTableData(this.tableId, { rows: [] });
    this.props.pushTo('/card', {
        status: 'browse',
        id: '',
        billno: '',
        pagecode: this.pageId
    })
    this.props.resMetaAfterPkorgEdit();
    this.toggleShow();//切换页面状态
}

/*TFVuhbSSJEZIc6So1uYir2v0gpOG9OwJ9p7POAV4Q0njgRFN0TAvq36e5pov/ebu*/