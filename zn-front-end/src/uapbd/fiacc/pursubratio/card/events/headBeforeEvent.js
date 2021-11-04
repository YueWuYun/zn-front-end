//SXDj+UzVnkytqCOCr56eS4AbxRMpmrXcyKgOPi8qpw9K1S/uX6VSJWtu4W3exUTP
/**
 * 表头编辑前事件,把自己不需要的部分删除
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 */
export default function(props, moduleId, key, value){
    
    let flag = true; //用来控制单元格是否可操作
    let meta = props.meta.getMeta();
    let config ={
        DataPowerOperationCode:'',
        isDataPowerEnable: 'Y',//使用权限
        AppCode: '',
        GridRefActionExt: "",
        TreeRefActionExt: "",
        itemKey:'',
        pk_org:"",
    }
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        item.isShowDisabledData = false;
        let attrcode = item.attrcode;
        if (attrcode == key) {
            switch (attrcode) {

                case 'pk_org'://财务组织过滤
                    item.queryCondition = (p) => {
                        config.AppCode = props.getSearchParam('c');
                        config.itemKey = key;
                        config.GridRefActionExt = 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder';
                        return config;
                    }
                    break;
                default:
                    item.queryCondition = (p) => {
                        config.itemKey = key;
                        config.pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
                        return config;
                    }
                    break;
            }
        }
    })

    props.meta.setMeta(meta);
    return true; //默认单元格都可操作

}
//SXDj+UzVnkytqCOCr56eS4AbxRMpmrXcyKgOPi8qpw9K1S/uX6VSJWtu4W3exUTP