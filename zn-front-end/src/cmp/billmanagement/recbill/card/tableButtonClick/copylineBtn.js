/*XNzDsAHZLkJn3EEuvqW78O2Yv7wVzqG9xlod+4BJT3V5QLtkL5E0yQGov4Q5II+i*/
import { toast, cardCache, print, output } from 'nc-lightapp-front';
import { CopyHandleData } from '../events/CMPCopyUtil.js';
import { checkSingleSettle } from '../buttonClick/checkSingleSettle.js';

/**
 * [收款结算]-复制按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copylineBtn = function (record, index) {
    //校验结算信息不允许修改表体行数
    if (!checkSingleSettle.call(this)) {
        return;
    }
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.pasteRow(this.tableId, index);
        //复制值处理
        CopyHandleData(this.props, this.tableId, index);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*XNzDsAHZLkJn3EEuvqW78O2Yv7wVzqG9xlod+4BJT3V5QLtkL5E0yQGov4Q5II+i*/