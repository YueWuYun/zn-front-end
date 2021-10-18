/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, oid, table_orgs } from '../constants';
let { NCMessage } = base;
import { busiOperate } from './busiOperate';
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    let pk = record.pk_informerrelease.value;
    let pk_org = record.pk_org.value;
    let displayorg = record.pk_org.display;
    let pk_group = record.pk_group.value;
    let displaygroup = record.pk_group.display;
    let remark = record.memo;//摘要
    let pk_fundplanitem = record.recpay_fundplansubj;//收/付款资金组织计划项目
    let pk_financeplanitem =record.recpay_orgplansubj;//收/付款单位计划项目
    let pk_FundType = record.pk_fundtype;//货币形态
    let balatype = record.pk_balatype;//结算方式
    pks.push(pk);
    let that = this;
    let url;
    let data = {
        pks: pks,
        pageid: pagecode
    };
    switch (key) {
        // 取消发布
        case 'Lcancelpublish':
            url = '/nccloud/cmp/informer/cardunpublish.do';
            busiOperate(that, key, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000016'), "inner", data);/* 国际化处理： 取消发布，成功*/
            break;
        // 生单
        case 'Lgenerate':
            props.form.setFormStatus(formId_01, "edit");
            props.form.setFormItemsValue(formId_01, { 'pk': { value: pk } });
            props.form.setFormItemsValue(formId_01, { 'index': { value: index } });
            props.form.setFormItemsValue(formId_01, { 'pk_org': { value: pk_org, display: displayorg } });
            props.form.setFormItemsValue(formId_01, { 'pk_group': { value: pk_group, dispplay: displaygroup } });
            props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'card_inner' } });
            //摘要
            props.form.setFormItemsValue(formId_01, { 'remark': remark });
            //收/付款资金组织计划项目
            props.form.setFormItemsValue(formId_01, { 'pk_fundplanitem': pk_fundplanitem });
            //收/付款单位计划项目
            props.form.setFormItemsValue(formId_01, { 'pk_financeplanitem': pk_financeplanitem });
            //货币形态
            props.form.setFormItemsValue(formId_01, { 'pk_FundType': pk_FundType });
            //结算方式
            props.form.setFormItemsValue(formId_01, { 'balatype': balatype });
            this.open_generate();
            break;
        //取消生单
        case 'Lcancelgenerate':
            url = '/nccloud/cmp/informer/cardcancelgenerate.do';
            busiOperate(that, key, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000011'), "inner", data);/* 国际化处理： 取消生单，成功！*/
            break;
        //取消认领
        case 'Lunclaim':
            url = '/nccloud/cmp/informer/cardunclaim.do';
            busiOperate(that, key, props, url, this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000010'), "inner", data);/* 国际化处理： 取消认领，成功！*/
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/