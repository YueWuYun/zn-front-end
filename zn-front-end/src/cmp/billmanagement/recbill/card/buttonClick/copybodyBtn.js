/*5TJi9BS8/DOgTZreZ83mvWX449PKqnUHlLu4d8Ca3vqt1wsIt9GUO1v46uvNM0Qe*/
import { toast } from 'nc-lightapp-front';
import { checkSingleSettle } from './checkSingleSettle';


/**
 * [收款结算]-表体复制按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copybodyBtn = function () {
    //校验结算信息不允许修改表体行数
    if (!checkSingleSettle.call(this)) {
        return;
    }
    //财务组织
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (!org_val && !org_display) {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
    if (org_val && org_display) {
        let currRows3 = this.props.cardTable.getCheckedRows(this.tableId);
        if (currRows3 && currRows3.length > 0) {
            this.setState({ pasteflag: true }, () => {
                this.toggleShow();
            });
        } else {
            toast({
                'color': 'warning',
                'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000006')/* 国际化处理： 请选择复制数据！*/
            });
            return;
        }
    }
}

/*5TJi9BS8/DOgTZreZ83mvWX449PKqnUHlLu4d8Ca3vqt1wsIt9GUO1v46uvNM0Qe*/