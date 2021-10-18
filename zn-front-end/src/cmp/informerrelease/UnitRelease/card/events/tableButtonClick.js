/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId,formId_org, formId_01, formId_02, oid, table_orgs } from '../constants';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    let pk = record.pk_informerrelease.value;
    let pk_org = props.getUrlParam('pk_org');
    let displayorg = record.pk_org.display;
    let pk_group = record.pk_group.value;
    let displaygroup = record.pk_group.display;
    pks.push(pk);
    let that = this;
    switch (key) {
        // 取消发布
        case 'Lcancelpublish':
            ajax({
                url: '/nccloud/cmp/informer/cardunpublish.do',
                data: {
                    pks: pks,
                    pageid: ''
                },
                success: function () {
                    let tabledata = props.table.getAllTableData(tableId);
                    if (tabledata.rows.length > 1) {
                        that.getdata();
                        toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000006')/*"取消发布成功"*/, color: 'success' });
                    } else {
                        props.pushTo("/list", {
                            status: 'browse'
                        });
                    }
                }
            });
            break;
        // 生单
        case 'Lgenerate':
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: index } });
            props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org, dispaly: displayorg } });
            props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group, dispplay: displaygroup } });
            this.open_generate();
            break;
        //向下级发布
        case 'Lsubpublish':
        
            props.table.setAllTableData(table_orgs, { rows: []});
            props.form.EmptyAllFormValue(formId_org);
            props.form.setFormStatus(formId_org, "edit");
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            this.open_publish();

            break;
        //取消生成
        case 'Lcancelgenerate':
            let Lcancelgenerate_this = this;
            ajax({
                url: '/nccloud/cmp/informer/Lcancelgenerate.do',
                data: {
                    pks: pks,
                    ts: record.ts.value
                },
                success: function () {
                    Lcancelgenerate_this.datarefresh(props);
                    toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000007')/*"取消生成成功"*/, color: 'success' });
                }
            });
            break;
        //取消认领
        case 'Lunclaim':
            ajax({
                url: '/nccloud/cmp/informer/cardunclaim.do',
                data: {
                    pks: pks,
                    pageid: null
                },
                success: (res) => {
                    if (res.data.errormessage&&res.data.failNum>0) {
                        this.getdata();                        
                        toast({ content:  res.data.errormessage, color: 'warning' });
                    } else {
                        this.getdata();
                        toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000008')/*"取消认领成功"*/, color: 'success' });
                    }
                }
            });
            break;
        //认领
        case 'Lclaim':
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: 'claim' } });
            props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org } });
            props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group } });
            props.form.setFormStatus(formId_02, "edit");
            
            let ye = props.form.getFormItemsValue(formId, 'ye').value;
            let zjzz = props.form.getFormItemsValue(formId, 'pk_org');
            // let zjzzdis = props.form.getFormItemsValue(formId, 'pk_org.name').display;
            let memo = props.form.getFormItemsValue(formId, 'memo').value;

            props.form.setFormItemsValue(formId_02, { 'pk_accid':{} });
            props.form.setFormItemsValue(formId_02, { 'ly_money': { value: ye } });
            props.form.setFormItemsValue(formId_02, { 'pk_FundOrg': zjzz });
            props.form.setFormItemsValue(formId_02, { 'pk_FinanceOrg': { value: pk_org, display: displayorg } });
            props.form.setFormItemsValue(formId_02, { 'remark': { value: memo } });
            this.open_capital_01();
            break;
        // 再次认领
        case 'Lreclaim':
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: 'reclaim' } });
            props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org } });
            props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group } });

            props.form.setFormItemsValue(formId_02, { 'pk_accid':{}});
            let re_ye = props.form.getFormItemsValue(formId, 'ye').value;
            let re_zjzz = props.form.getFormItemsValue(formId, 'pk_org').value;
            //let re_zjzzdis = props.form.getFormItemsValue(formId, 'pk_org.name').display;
            let re_memo = props.form.getFormItemsValue(formId, 'memo').value;
            props.form.setFormItemsValue(formId_02, { 'ly_money': { value: re_ye } });
            props.form.setFormItemsValue(formId_02, { 'pk_FundOrg': { value: re_zjzz, display: displayorg } });
            props.form.setFormItemsValue(formId_02, { 'pk_FinanceOrg': { value: pk_org, display: displayorg } });
            props.form.setFormItemsValue(formId_02, { 'remark': { value: re_memo } });
            props.form.setFormStatus(formId_02, "edit");
            this.open_capital_01();
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/