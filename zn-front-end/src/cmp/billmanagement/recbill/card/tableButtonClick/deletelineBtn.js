/*RamVjhm1rwFoMXx5cppYbYb7BdCWz34mL3v28G1LD1M1gdznOlnR53qW37WnKlay*/
import { toast, cardCache, print, output } from 'nc-lightapp-front';
import { checkSingleSettle } from '../buttonClick/checkSingleSettle.js';
/**
 * [收款结算]-删行按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deletelineBtn = function (record, index) {
    //校验结算信息不允许修改表体行数
    if (!checkSingleSettle.call(this)) {
        return;
    }
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.delRowsByIndex(this.tableId, index);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*RamVjhm1rwFoMXx5cppYbYb7BdCWz34mL3v28G1LD1M1gdznOlnR53qW37WnKlay*/