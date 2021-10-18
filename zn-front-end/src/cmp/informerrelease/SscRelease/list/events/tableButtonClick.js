/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_01, formId_02, oid } from '../constants';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let that = this;
    switch (key) {
        //领用
        case 'Lclaim':
            let pk = record.pk_informerrelease.value;
            let sfbz = record.direction.value;
            let lyxt = record.src_flag.value;
            if (lyxt == "NC") {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000002'), color: 'warning' });
                return;
            }
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_inner' } });
            props.form.setFormItemsValue(formId_01, { 'sfflag': { value: sfbz } });
            props.form.setFormItemsValue(formId_01, { 'busitype': {} });
            props.form.setFormItemsValue(formId_01, { 'record': { value: record } });//点击表体“认领”时把数据打包，在认领确认时使用
            that.setState({
                showModal_finance_01: true
            });
            let direction = props.form.getFormItemsValue(formId_01, 'sfflag').value;
            ajax({
                url: '/nccloud/cmp/informer/getbusitype.do',
                data: { direction: direction },
                success: function (res) {
                    props.form.setFormItemsValue(formId_01, { 'busitype': { value: res.data.pk, display: res.data.code } });
                    props.form.setFormItemsValue(formId_01, { 'jylx': { value: res.data.code } });

                }
            });
            props.form.setFormStatus(formId_01, "edit");
            break;
        //退款
        case 'Lrefund':
            pk = record.pk_informerrelease.value;
            sfbz = record.direction.value;
            if (sfbz == 'receivemoney') {//收款通知
                sfbz = 'paymoney';
            } else {//付款通知
                sfbz = 'receivemoney';
            }
            lyxt = record.src_flag.value;
            if (lyxt == "NC") {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000002'), color: 'warning' });
                return;
            }
            props.form.setFormItemsValue(formId_02, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_02, { 'btnarea': { value: 'list_inner' } });
            props.form.setFormItemsValue(formId_02, { 'sfflag': { value: sfbz } });
            props.form.setFormItemsValue(formId_02, { 'busitype': {} });
            props.form.setFormItemsValue(formId_02, { 'record': { value: record } });//点击表体“认领”时把数据打包，在认领确认时使用
            that.setState({
                showModal_finance_02: true
            });
            direction = props.form.getFormItemsValue(formId_02, 'sfflag').value;
            ajax({
                url: '/nccloud/cmp/release/getbusitype.do',
                data: { direction: direction },
                success: function (res) {
                    props.form.setFormItemsValue(formId_02, { 'busitype': { value: res.data.pk, display: res.data.code } });
                    props.form.setFormItemsValue(formId_02, { 'jylx': { value: res.data.code } });

                }
            });
            props.form.setFormStatus(formId_02, "edit");
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/