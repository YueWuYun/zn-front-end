//NTja0HkWcUyLIMo3ZWZ4dyBgCkVLJcOC2BBxNExAsvSYP5NVHZp7/5JuzRhyIH05
export default function(props,moduleId, key, value,data){
    let meta,item,netbankitem;
    switch (key){
        //未启用状态的银行账户才能账号才能编辑
        case'accnum':
            return !!(props.form.getFormItemsValue(props.config.formId,'enablestate').value == '1');

        case'pk_bankdoc':
            if(this.state.emptyPk_bankdocflag){
                meta = props.meta.getMeta();
                item = meta[moduleId]['items'].find(item => item.attrcode === 'pk_bankdoc');
                if(item.queryCondition){
                    item.queryCondition = null;
                    props.meta.setMeta(meta);
                }
            }else{
                meta = props.meta.getMeta();
                item = meta[moduleId]['items'].find(item => item.attrcode === 'pk_bankdoc');
                item.queryCondition = () => {
                    return {
                        pk_banktype: props.form.getFormItemsValue(props.config.formId,'pk_banktype').value,
                        TreeRefActionExt:'nccloud.web.uapbd.sminfo.bankacc.extendRef.BankDocSqlBuilder'
                    }
                }
                props.meta.setMeta(meta);
            }
            return true;
        case'pk_netbankinftp':
            meta = props.meta.getMeta();
            netbankitem = meta['ebankinfo']['items'].find(item => item.attrcode === 'pk_netbankinftp');
            netbankitem.queryCondition = () => {
                return {
                    pk_banktype:  props.form.getFormItemsValue(props.config.formId,'pk_banktype').value,
                    GridRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.NetbankTemplateDefaultRefModelExtendRef'
                }
            }
            props.meta.setMeta(meta);
            return true;
        default:
            break;
    }
    return true;

}

//NTja0HkWcUyLIMo3ZWZ4dyBgCkVLJcOC2BBxNExAsvSYP5NVHZp7/5JuzRhyIH05