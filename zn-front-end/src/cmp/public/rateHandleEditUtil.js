/*Cs4/8n8bQn4prXrXFEv1gK/RxcToFg+IyVCv5Ec4dwKlDOjp+rhdyNK62DZD9Csp*/
import { ajax } from 'nc-lightapp-front';

/**
 * 表头-汇率编辑前事件
 */
export const handleHeadRateEdit = function (key) {
    //本币汇率+集团汇率+全局汇率
    debugger
    if (key == 'local_rate' || key == 'group_rate' || key == 'global_rate') {
        let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org') ? this.props.form.getFormItemsValue(this.formId, 'pk_org').value : null;//财务组织
        let pk_currtype = this.props.form.getFormItemsValue(this.formId, 'pk_currtype') ? this.props.form.getFormItemsValue(this.formId, 'pk_currtype').value : null;//币种
        if (pk_org && pk_currtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: {
                    pk_org: pk_org,
                    pk_currtype: pk_currtype
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.userJson) {
                            let extParam = data.userJson;
                            if (extParam) {
                                let obj = JSON.parse(extParam);
                                this.props.form.setFormItemsDisabled(this.formId, { 'local_rate': !obj.olcRateEditable });
                                this.props.form.setFormItemsDisabled(this.formId, { 'group_rate': !obj.glcRateEditable });
                                this.props.form.setFormItemsDisabled(this.formId, { 'global_rate': !obj.gllcRateEditable });
                            }
                        }
                    }
                }
            });
        }
    }

}
/**
 * 表体-汇率编辑前事件
 */
export const handleTableRateEdit = function (key, record, index) {
    //本币汇率+集团汇率+全局汇率
    debugger
    if (key == 'local_rate' || key == 'group_rate' || key == 'global_rate') {
        let pk_org = record.values.pk_org.value;//财务组织
        let pk_currtype = record.values.pk_currtype.value;//币种
        if (pk_org && pk_currtype) {
            ajax({
                url: '/nccloud/cmp/paybills/rate.do',
                data: {
                    pk_org: pk_org,
                    pk_currtype: pk_currtype
                },
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data && data.userJson) {
                            let extParam = data.userJson;
                            if (extParam) {
                                let obj = JSON.parse(extParam);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'local_rate', obj.olcRateEditable);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'group_rate', obj.glcRateEditable);
                                this.props.cardTable.setEditableByIndex(this.tableId, index, 'global_rate', obj.gllcRateEditable);
                            }
                        }
                    }
                }
            });
        }
    }

}

/*Cs4/8n8bQn4prXrXFEv1gK/RxcToFg+IyVCv5Ec4dwKlDOjp+rhdyNK62DZD9Csp*/