/*RamVjhm1rwFoMXx5cppYbYb7BdCWz34mL3v28G1LD1M1gdznOlnR53qW37WnKlay*/
import { toast } from 'nc-lightapp-front';

/**
 * [收款协同]-删除
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deletelineBtn = function (record, index) {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.delRowsByIndex(this.tableId, index);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*RamVjhm1rwFoMXx5cppYbYb7BdCWz34mL3v28G1LD1M1gdznOlnR53qW37WnKlay*/