/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, oid, table_orgs } from '../constants';
import { busiOperate } from './busiOperate';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    let pk = record.pk_informer.value;
    pks.push(pk);
    let url;
    let data = {
        pks: pks,
        ts: record.ts.value,
        pageid: pagecode
    };
    let context = {
        data: data,
        index: index
    }
    switch (key) {
        //明细
        case 'Ldetail':
            props.pushTo("/card", {
                status: 'browse',
                from: 'list',
                id: record.pk_informer.value
            });
            break;
        // 取消发布
        case 'Lcancelpublish':
            url = '/nccloud/cmp/informer/informerunpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000009'), "inner", context);/* 国际化处理： 取消发布，成功！*/
            break;
        //不生单
        case 'Lnogenerate':
            url = '/nccloud/cmp/informer/informerungenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000051'), "inner", context);/* 国际化处理： 不生单，成功！*/
            break;
        //恢复生单
        case 'Lrecgenerate':
            url = '/nccloud/cmp/informer/informerrecgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000008'), "inner", context);/* 国际化处理： 恢复生单，成功！*/
            break;
        // 生单
        case 'Lgenerate':
            let pk_org = record.pk_org.value;
            let pk_group = record.pk_group.value;
            let memo = record.memo.value;
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'vdef': { value: memo } });
            props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org } });
            props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group } });
            props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_inner' } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: index } });
            this.open_generate();
            break;
        //单位内发布
        case 'Lcompublish':
            url = '/nccloud/cmp/informer/informerpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000052'), "inner", context);/* 国际化处理： 单位内部发布，成功！*/
            break;
        //向下级发布
        case 'Lsubpublish':
            props.form.EmptyAllFormValue(formId_org);
            props.table.setAllTableData(table_orgs, { rows: [] });
            props.form.setFormStatus(formId_org, "edit");
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: index } });
            props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_inner' } });
            this.open_publish();
            break;
        //取消生成
        case 'Lcancelgenerate':
            url = '/nccloud/cmp/informer/informercancelgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000053'), "inner", context);/* 国际化处理： 取消生成，成功！*/
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/