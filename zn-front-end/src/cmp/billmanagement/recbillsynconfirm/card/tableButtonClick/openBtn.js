/*vCCmnJmzIvSH04ntc5e498dQrDff5uyWFf+EjZO0SNqKE5ktvsq3cMOYLXBJxJxc*/
import { toast } from 'nc-lightapp-front';


/**
 * [收款协同]-展开
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const openBtn = function (record, index) {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.toggleRowView(this.tableId, record);
        // this.setState({
        //     tableindex: index
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

/*vCCmnJmzIvSH04ntc5e498dQrDff5uyWFf+EjZO0SNqKE5ktvsq3cMOYLXBJxJxc*/