/*8FB+tG6ULD/AINTYxnBtmlkk3+Dq1nvNi5ugR9eONzkWI6kS8P5sb1mlammn8l1+*/
/**
 * 贷款管理卡片公共事件函数
 * @author：zhangyangz
 */
import {
    ajax,
    toast,
    cacheTools,
    cardCache,
    deepClone
} from "nc-lightapp-front";

let {
    setDefData,
    getDefData,
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById
} = cardCache;
import {
    moduleId,
    btnLimit,
    card,
    list,
    tabs,
    baseReqUrl,
    javaUrl,
    printData,
    billtype,
    appCode
} from "../financepay/cons/constant.js";
import { afterEvent } from "../financepay/card/events";
const formId = card.headCode;
const pageId = card.pageCode;

/**
 * 根据固定利率设置利率和调整方案的编辑性
 */
export function setEditByFixrate(props, moduleId, key, value, oldvalue,i) {
    if(value) {
        props.form.setFormItemsValue(formId, {
            floatscale: { display: null, value: null },
            floatpoint: { display: null, value: null },
            advancefloatscale: { display: null, value: null },
            advancefloatpoint: { display: null, value: null },
            adjratemethod:{ display: null, value: null},
            effecttype:{display:null,value:null},
            adjbegdate:{display:null,value:null},
            adjperiodunit:{display:null,value:null},
            lastadjdate:{display:null,value:null},
            extfloatscale:{display:null,value:null},
            extfloatpoint:{display:null,value:null}
        });
    }
    if(!value||!value.value) {
        value=props.form.getFormItemsValue(formId, 'fixrate');
    }
    if (value.value) {
        props.form.setItemsVisible(formId,{'extfloatscale':false,'extfloatpoint':false});
        props.form.setFormItemsRequired(formId, {
            pk_rate: false
        });
        props.form.setFormItemsDisabled(formId, {
            floatscale: true,
            floatpoint: true,
            advancefloatscale: true,
            advancefloatpoint: true,
            adjratemethod:true,
            effecttype:true,
            adjbegdate:true,
            adjperiodunit:true,
            lastadjdate:true,
            extfloatscale:true,
            extfloatpoint:true
        });
    } else {
        props.form.setItemsVisible(formId,{'extfloatscale':true,'extfloatpoint':true});
        props.form.setFormItemsRequired(formId, {
            pk_rate: true
        });
        props.form.setFormItemsDisabled(formId, {
            floatscale: false,
            floatpoint: false,
            advancefloatscale: false,
            advancefloatpoint: false,
            adjratemethod:false,
            effecttype:false,
            adjbegdate:false,
            adjperiodunit:false,
            lastadjdate:false,
            extfloatscale:false,
            extfloatpoint:false
        });
    }
}

/**
 * 根据利率档案设置利率的编辑性
 */
export function setEditByRate(finance_rate_type,props, moduleId, key, value, oldvalue,i) {
    let fixrate=props.form.getFormItemsValue(formId, 'fixrate');
    let debittoloan = props.form.getFormItemsValue(formId, "debittoloan"); 
    if(!(debittoloan&&debittoloan.value)){
    if(!fixrate.value) {
        if(value) {
            props.form.setFormItemsValue(formId, {
                floatscale: { display: null, value: null },
                floatpoint: { display: null, value: null },
                advancefloatscale: { display: null, value: null },
                advancefloatpoint: { display: null, value: null },
                adjratemethod:{ display: null, value: null},
                effecttype:{display:null,value:null},
                adjbegdate:{display:null,value:null},
                adjperiodunit:{display:null,value:null},
                lastadjdate:{display:null,value:null},
                extfloatscale:{display:null,value:null},
                extfloatpoint:{display:null,value:null}
            });
        }
        if(!value||!value.value) {
            value=props.form.getFormItemsValue(formId, 'pk_rate');
        }
        if(!finance_rate_type) {
            finance_rate_type=value.values&&value.values.finance_rate_type &&
                    value.values.finance_rate_type.value;
        }
        if (value.value) {
            if (finance_rate_type=="1") {
                // 基准利率
                props.form.setFormItemsValue(formId, {
                    floatpoint: { display: null, value: null },
                    advancefloatpoint: { display: null, value: null }
                });
                props.form.setFormItemsDisabled(formId, {
                    floatscale: false,
                    advancefloatscale: false,
                    floatpoint: true,
                    advancefloatpoint: true
                });
            } else if (finance_rate_type== "2") {
                // libor利率
                props.form.setFormItemsValue(formId, {
                    floatscale: { display: null, value: null },
                    advancefloatscale: { display: null, value: null }
                });
                props.form.setFormItemsDisabled(formId, {
                    floatscale: true,
                    advancefloatscale: true,
                    floatpoint: false,
                    advancefloatpoint: false
                });
            } else {
                // 其余利率
                props.form.setFormItemsValue(formId, {
                    floatpoint: { display: null, value: null },
                    advancefloatpoint: { display: null, value: null },
                    floatscale: { display: null, value: null },
                    advancefloatscale: { display: null, value: null }
                });
                props.form.setFormItemsDisabled(formId, {
                    floatpoint: true,
                    advancefloatpoint: true,
                    floatscale: true,
                    advancefloatscale: true
                });
            }
        }
    }
}
}

/**
 * 根据币种设置汇率编辑性
 */
export function setEditByPk_currtype(props,pageId,formId,moduleId,tabCode,key,value) {
    let meta = props.meta.getMeta();
    let tabRelation = meta.gridrelation[tabCode].tabRelation;
    let eventData = props.createHeadAfterEventData(
        pageId,
        formId,
        tabRelation,
        moduleId,
        key,
        value
    );
    ajax({
        url: '/nccloud/icdmc/financepay/financepayafteredit.do',
        async: false,
        data:eventData,
        success: res => {
            //设置表头汇率字段编辑性
            let {userjson}=res.data;
            if(userjson) {
                let uiedit=JSON.parse(userjson);
                if(uiedit['olcrate']=='false') {
                    props.form.setFormItemsDisabled(formId, {
                        olcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(formId, {
                        olcrate: false
                    });
                }
                if(uiedit['glcrate']=='false') {
                    props.form.setFormItemsDisabled(formId, {
                        glcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(formId, {
                        glcrate: false
                    });
                }
                if(uiedit['gllcrate']=='false') {
                    props.form.setFormItemsDisabled(formId, {
                        gllcrate: true
                    });
                }else {
                    props.form.setFormItemsDisabled(formId, {
                        gllcrate: false
                    });
                }
            }
        }
    });
}

/**
 * 根据币种设置汇率编辑性
 */
export function setEditByPrepayinterest(props,pageId,formId,prepayinterest) {
    // 先付息
    if (prepayinterest&&prepayinterest.value) {
        props.form.setFormItemsDisabled(formId, {
            fixrate: true,
            accountinter:true
        });
    } else {
        props.form.setFormItemsDisabled(formId, {
            fixrate: false,
            accountinter:false
        });
    }
}







/*8FB+tG6ULD/AINTYxnBtmlkk3+Dq1nvNi5ugR9eONzkWI6kS8P5sb1mlammn8l1+*/