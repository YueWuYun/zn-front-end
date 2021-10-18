/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/
/**
 * [收款协同]-取消
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cancelConfirm = function () {
    //编辑中的取消操作
    if (this.props.getUrlParam('status') === 'edit') {
        let edit_pk = this.props.getUrlParam('id');
        let bill_no = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
        this.cancleNewPage(edit_pk, bill_no);
    }
}

/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/