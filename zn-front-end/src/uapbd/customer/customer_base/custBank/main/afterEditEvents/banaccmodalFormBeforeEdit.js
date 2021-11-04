//5q+BXtb8e5/Eafb2KNZQo59EKyEllPdbYUA4S/W0EwkT37NlNFp1LkvhhCrFHNFTCwMmCOuaOv3a
//73dQt/9tBQ==
export default function (props,moduleId, key, value,data) {
    let meta,item,netbankitem;
    switch (key) {
        case'accnum':
            return !!(props.form.getFormItemsValue(moduleId,'enablestate').value == '1');
        case'pk_bankdoc':
            meta = props.meta.getMeta();
            item = meta[moduleId]['items'].find(item => item.attrcode === 'pk_bankdoc');
            item.queryCondition = () => {
                return {
                    pk_banktype: props.form.getFormItemsValue(moduleId,'pk_banktype').value,
                    TreeRefActionExt:'nccloud.web.uapbd.sminfo.bankacc.extendRef.BankDocSqlBuilder'
                }
            }
            props.meta.setMeta(meta);
            return true;
        case'pk_netbankinftp':
            meta = props.meta.getMeta();
            netbankitem = meta['netbankinfo']['items'].find(item => item.attrcode === 'pk_netbankinftp');
            netbankitem.queryCondition = () => {
                return {
                    pk_banktype:  props.form.getFormItemsValue(moduleId,'pk_banktype').value,
                    GridRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.NetbankTemplateDefaultRefModelExtendRef'
                }
            }
            props.meta.setMeta(meta);
            return true;
        default:
            return true;
    }
}
//5q+BXtb8e5/Eafb2KNZQo59EKyEllPdbYUA4S/W0EwkT37NlNFp1LkvhhCrFHNFTCwMmCOuaOv3a
//73dQt/9tBQ==