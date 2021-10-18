/*XJBNhKaaPRHGGDkNt176JhXe+/1CMbIBr6yP37xawd0fS/sjcq6DBNv0BvALmxF2*/
import { toast } from 'nc-lightapp-front';
/**
 * [收款协同]-收起
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const closeBtn = function (record, index) {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.toggleRowView(this.tableId, record);
        // this.setState({
        //     tableindex: null
        // })
    } else {
        // this.setState({
        //     tableindex: null
        // })
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*XJBNhKaaPRHGGDkNt176JhXe+/1CMbIBr6yP37xawd0fS/sjcq6DBNv0BvALmxF2*/