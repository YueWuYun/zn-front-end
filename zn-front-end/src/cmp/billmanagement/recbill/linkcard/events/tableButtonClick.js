/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.card_tableid;
let form_id = Templatedata.card_formid;

export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);
    let org_val = props.form.getFormItemsValue(form_id, 'pk_org').value;
    let org_display = props.form.getFormItemsValue(form_id, 'pk_org').display;
    switch (key) {
        //展开
        case 'openBtn':
            this.props.cardTable.toggleRowView(this.tableId, record);
            break;
        //收起
        case 'closeBtn':
            this.props.cardTable.toggleRowView(this.tableId, record);
            break;
        case 'copylineBtn':
            if (org_val && org_display) {
                props.cardTable.pasteRow(this.tableId, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        case 'addlineBtn':

            if (org_val && org_display) {
                props.cardTable.pasteRow(table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        case 'deletelineBtn':
            if (org_val && org_display) {
                props.cardTable.delRowsByIndex(table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        //编辑展开
        case 'editmoreBtn':
            if (org_val && org_display) {
                props.cardTable.openModel(table_id, 'edit', record, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;

    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/