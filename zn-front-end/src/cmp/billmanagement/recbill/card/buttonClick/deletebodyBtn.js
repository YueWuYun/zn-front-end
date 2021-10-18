/*iZkEV46aapNhB6mUWaDAK0hmmC4I6CV+y58gz5e+Y9WOYwxvKyQC9YQ+GcuxXPMq*/
import { toast, cardCache } from 'nc-lightapp-front';
import { checkSingleSettle } from './checkSingleSettle';
/**
 * [收款结算]-表体删除行按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deletebodyBtn = function () {
    //校验结算信息不允许修改表体行数
    if (!checkSingleSettle.call(this)) {
        return;
    }
    //财务组织
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        let currRows = this.props.cardTable.getCheckedRows(this.tableId);
        let currSelect = [];
        if (currRows && currRows.length > 0) {
            for (let item of currRows) {
                currSelect.push(item.index);
            }
        }
        if (currSelect.length == 0) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000005') });/* 国际化处理： 请选择数据，进行删除!*/
            return;
        }
        this.props.cardTable.delRowsByIndex(this.tableId, currSelect);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*iZkEV46aapNhB6mUWaDAK0hmmC4I6CV+y58gz5e+Y9WOYwxvKyQC9YQ+GcuxXPMq*/