/*U41ajtHAnBXc4J9azvHa6RZyolzC+9Y5wKpM5LyMD2tcMm6RPXDUoCv9hBzWXz0k*/
/**
 * 付款申请编辑前处理
 */
import { base, ajax ,cacheTools} from 'nc-lightapp-front';  
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//引入常量定义
import { APP_INFO, CARD_PAGE_INFO, UI_CONF, SHOW_MODE, URL_INFO, PROP_EXT_OBJ } from '../../cons/constant';
//客商
import CustBankAccGridRef from '../../../../../uapbd/refer/pub/CustBankAccGridRef';
/**
 * 卡片态表体字段过滤 以及 代码控制可编辑性
 * @param {*} moduleId 区域id
 * @param {*} props 当前props
 * @param {*} key 操作的键
 * @param {*} data 当前表单所有值
 */
export default  function bodyBeforeEvent(props, moduleId, key, value, index, record) {
   
    let meta = props.meta.getMeta();
    
    meta[CARD_PAGE_INFO.BODY_CODE].items.map((item) => {
        // item.isShowUnit = false;
        // item.isShowDisabledData = false;        
        var attrcode = item.attrcode;       
        if (attrcode == key) {
            if(attrcode == 'pk_bankacc_r'){
                // let isrefund = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isrefund');
                let pk_supplier = props.cardTable.getValByKeyAndIndex(moduleId, index, 'customer');   
                let accclass = 2;
                if (pk_supplier && pk_supplier.value) {
                    item.itemType = 'refer';
                    item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';				
                    item.refName = loadMultiLang(props, '36070APM--000130')/* 国际化处理： 客户银行账户*/;                  
                    pk_supplier = props.cardTable.getValByKeyAndIndex(moduleId, index, 'customer');                       
                    accclass= 1;
                }else{
                    item.itemType = 'refer';
                    item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index'; 
                    item.refName = loadMultiLang(props, '36070APM--000131')/* 国际化处理： 客商银行账户*/;
                }
            }
            else if (attrcode.startsWith('vdef')){
                props.cardTable.setQueryCondition(CARD_PAGE_INFO.BODY_CODE, {
                    [key]: () => {
                        return {
                            pk_org: (props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg') || {}).value
                        };
                    }
                });
            }
        }

        

    });
    meta[CARD_PAGE_INFO.BODY_EDIT_CODE].items.map((item) => {
        // item.isShowUnit = false;
        // item.isShowDisabledData = false;        
        var attrcode = item.attrcode;       
        if (attrcode == key) {
            switch (attrcode) {              
                case 'pk_bankacc_r'://收款银行账户
                // let isrefund = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isrefund');
                let pk_supplier = props.cardTable.getValByKeyAndIndex(moduleId, index, 'customer');   
                let accclass = 2;
                if (pk_supplier && pk_supplier.value) {
                    item.itemType = 'refer';
                    item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';				
                    item.refName = loadMultiLang(props, '36070APM--000130')/* 国际化处理： 客户银行账户*/;                  
                    pk_supplier = props.cardTable.getValByKeyAndIndex(moduleId, index, 'customer');                       
                    accclass= 1;
                }else{
                    item.itemType = 'refer';
                    item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index'; 
                    item.refName = loadMultiLang(props, '36070APM--000131')/* 国际化处理： 客商银行账户*/;
                }
           
                break;              
            }
        }
    });
    props.meta.setMeta(meta);
    props.renderItem("table", moduleId, 'checkno', null);    
    return true;
}

/*U41ajtHAnBXc4J9azvHa6RZyolzC+9Y5wKpM5LyMD2tcMm6RPXDUoCv9hBzWXz0k*/