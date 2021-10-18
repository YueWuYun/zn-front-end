/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import {  toast } from 'nc-lightapp-front';
import { BatchCopy } from '../../../../public/CMPButtonUtil.js';
let table_id = Templatedata.card_tableid;
let form_id = Templatedata.card_formid;
export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);
    let org_val = props.form.getFormItemsValue(form_id, 'pk_org').value;
    let org_display = props.form.getFormItemsValue(form_id, 'pk_org').display;
    switch (key) {
        //展开
        case 'openBtn':

            if (org_val && org_display) {
                props.cardTable.toggleRowView(table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //收起
        case 'closeBtn':

            if (org_val && org_display) {
                props.cardTable.toggleRowView(table_id, record);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }
            break;
        //复制
        case 'copylineBtn':

            if (org_val && org_display) {
                props.cardTable.pasteRow(table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        //增行
        case 'addlineBtn':

            if (org_val && org_display) {
                props.cardTable.pasteRow(table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        //删行
        case 'deletelineBtn':
            if (org_val && org_display) {
                props.cardTable.delRowsByIndex(table_id, index);
            } else {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
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
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000003')/* 国际化处理： 请先填写财务组织！*/
                });
                return;
            }

            break;
        //粘贴至此
        case 'copythisBtn':
            debugger;
            let selectRows = props.cardTable.getCheckedRows(table_id);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000006')/* 国际化处理： 未选中要复制的行*/
                });
                return false;
            }
            if (index != 0 && !index) {
                index = props.cardTable.getNumberOfRows(table_id, false);
            }
            BatchCopy.call(this,this.props, table_id, index);//调用组件使用粘贴
            this.setState({ pasteflag: false }, () => { this.toggleShow() });

            break;

    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/