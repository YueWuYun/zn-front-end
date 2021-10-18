/*bMg5o7uxnJQKx0uMiDqXEki2bq9G6Sn+gDtUi2EZiZs64w2fHvS+R1ixKkx9/Fd8*/
import { createPage, ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
/**
 * [到账通知认领收款结算单]-展开
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const editmoreBtn = function (record, index) {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.openModel(this.tableId, 'edit', record, index);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }

}

/*bMg5o7uxnJQKx0uMiDqXEki2bq9G6Sn+gDtUi2EZiZs64w2fHvS+R1ixKkx9/Fd8*/