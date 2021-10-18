/*0wHgXR87SJrehrsfzPsqctXE04HdOH8SDwl9dEBzNUmSl3wW1f8taN7gBpe0bguW*/
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
import { afterEvent } from "../repayintst/card/events";
const formId = card.headCode;
const pageId = card.pageCode;


/**
 * 根据币种设置汇率编辑性
 */
export function setRepayIntstEditByPk_currtype(props,pageId,formId,moduleId,key,value) {
    let meta = props.meta.getMeta();
    let tabRelation = null;
    let eventData = props.createHeadAfterEventData(
        meta.code,
        formId,
        "",
        moduleId,
        key,
        value
    );
    ajax({
        url: '/nccloud/icdmc/repayintst/cardeditafter.do',
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



/*0wHgXR87SJrehrsfzPsqctXE04HdOH8SDwl9dEBzNUmSl3wW1f8taN7gBpe0bguW*/