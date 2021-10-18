/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
/**
 * 公共依赖维护
 */
import { createPage, ajax, base, toast, high, print, output, cardCache, cacheTools, getMultiLang, createPageIcon, promptBox } from 'nc-lightapp-front';
import { saveMultiLangRes, loadMultiLang, createSimpleBillData, hasDefaultOrg, setDefOrg2Form, buildLightBodyAfterEditData, setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea, elecSignListPrint, elecSignCardPrint, addDefReferFilter, bodyRateEditOnAfterEdit, setRate2NewRow, createListWebSocket, createCardWebSocket, saveCommit, showErrBtn } from "../../../../../tmpub/pub/util";

/**
 * 公共API列表
 */
const comm = {
    createListWebSocket, createCardWebSocket,showErrBtn
};

//工具(第三方API)
const tool = {
    createPage, ajax, toast, print, output, high, cardCache, cacheTools, getMultiLang, createPageIcon, promptBox, base
}

export default {
    comm, tool
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/