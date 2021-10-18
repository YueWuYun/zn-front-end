/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
/**
 * 付款申请编辑前处理
 */
import { base, ajax ,cacheTools} from 'nc-lightapp-front';  
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//引入常量定义
import { APP_INFO, CARD_PAGE_INFO, UI_CONF, SHOW_MODE, URL_INFO, PROP_EXT_OBJ } from '../../cons/constant';

/**
 * 卡片态表头字段过滤 以及 代码控制可编辑性
 * @param {*} moduleId 区域id
 * @param {*} props 当前props
 * @param {*} key 操作的键
 * @param {*} data 当前表单所有值
 */
export default  function beforeEvent(props, moduleId, key, value) {
   
    let meta = props.meta.getMeta();
    
    meta[moduleId].items.map((item) => {
        // item.isShowUnit = false;
        // item.isShowDisabledData = false;        
        var attrcode = item.attrcode;       
        if (attrcode == key) {
            switch (attrcode) {              
                case 'pk_bankacc_r'://收款银行账户
                    // let isrefund = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'isrefund');
                    let pk_supplier = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer');            
                    let accclass = 2;
                    if (pk_supplier && pk_supplier.value) {
                        item.itemType = 'refer';
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';				
                        item.refName = loadMultiLang(props, '36070APM--000130')/* 国际化处理： 客户银行账户*/;
                        pk_supplier = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer').value;
                        accclass= 1;
                        item.queryCondition = (p) => {
                            return {					
                                pk_currtype:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype').value,
                                pk_org:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org').value,
                                pk_cust:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'customer').value,
                                accclass:accclass
                            };
                        }
                    }else{
                        item.itemType = 'refer';
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index'; 
                        item.refName = loadMultiLang(props, '36070APM--000131')/* 国际化处理： 客商银行账户*/;
                        item.queryCondition = (p) => {
                            return {
                                key:'pk_bankacc_r',							
                                pk_currtype:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype').value,
                                pk_org:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org').value,
                                pk_cust:props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier').value,
                                accclass:accclass,
                                GridRefActionExt: 'nccloud.web.cmp.apply.apply.filter.PayBankaccFilter'//自定义参照过滤条件
                            };
                        }
                    }
                    break;              
            }
        }

    });
    props.meta.setMeta(meta);
    return true;
}

/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/