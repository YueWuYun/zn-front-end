/*XNzDsAHZLkJn3EEuvqW78O2Yv7wVzqG9xlod+4BJT3V5QLtkL5E0yQGov4Q5II+i*/
import { toast } from 'nc-lightapp-front';
import { CopyHandleData } from '../events/CMPCopyUtil.js';
/**
 * [收款协同]-新增按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copylineBtn = function (record, index) {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.pasteRow(this.tableId, index);
        //复制值处理
        CopyHandleData(this.props, this.tableId, index);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*XNzDsAHZLkJn3EEuvqW78O2Yv7wVzqG9xlod+4BJT3V5QLtkL5E0yQGov4Q5II+i*/