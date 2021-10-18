/*IP7nM0v+c2pNL2ysG0q2i3qQw3xa9EH9yP/qPAJNqX1TXC78BsBLpvTlDep76PU4*/
import { formId, tableId, table_orgs, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, formId_07, formId_08 } from '../constants';
import { ajax, base, toast ,viewModel} from 'nc-lightapp-front';
let { NCMessage } = base;
import {CACHE_KEY} from '../constants';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * 得到生单数据
 * @param {*} props 
 */
export function getGenerateData(props) {
    let pks = [];
    let generatetype = props.form.getFormItemsValue(formId_01, 'generatetype').value;
    let btnarea = props.form.getFormItemsValue(formId_01, 'btnarea').value;
    let temppk = props.form.getFormItemsValue(formId_01, 'pk').value;
    let recordinfo;
    let flag;
    if (generatetype == '36J7' || generatetype == '36J5') {//委托付款/委托收款-生单
        recordinfo = props.form.getAllFormValue(formId_02);
        flag = props.form.isCheckNow(formId_02);
    } else if (generatetype == '36K4' || generatetype == '36K2') {//资金下拨/委托上收-生单
        recordinfo = props.form.getAllFormValue(formId_03);
        flag = props.form.isCheckNow(formId_03);
    } else if (generatetype == 'F4' || generatetype == 'F5') {//付款结算单/收款结算单-生单
        recordinfo = props.form.getAllFormValue(formId_04);
        flag = props.form.isCheckNow(formId_04);
    } else if (generatetype == '36S4') {//划账结算单-生单
        recordinfo = props.form.getAllFormValue(formId_05);
        flag = props.form.isCheckNow(formId_05);
    } else if (generatetype == 'F2' || generatetype == 'F3') {//收款/付款-生单
        recordinfo = props.form.getAllFormValue(formId_06);
        flag = props.form.isCheckNow(formId_06);
    }
    if (!flag) {
        return;
    }
    let indexMap = new Map();
    if (btnarea == 'list_inner') {
        if (temppk) {
            let pk;
            pk = temppk;
            pks.push(pk);
        }
    } else if (btnarea == 'list_head') {
        let geneData = props.table.getCheckedRows(tableId);
        geneData.forEach((val) => {
            let pk;
            pk = val.data.values.pk_informer.value;
            pks.push(pk);
            indexMap.set(pk, val.index);
        });
    }
    let type;
    //取出缓存的组织替换单据上的
    let pk_org = getGlobalStorage('sessionStorage', CACHE_KEY.PK_ORG);
    let geneinfo = {
        type: generatetype,
        pks: pks,
        pageid: pagecode,
        indexMap: indexMap,
        pk_org:pk_org
    };
    let data = {
        geneinfo: geneinfo,
        recordinfo: recordinfo
    };
    data.pageid = pagecode;
    return data;
}
/**
 * 退款业务，红字单据数据
 */
export function getRedBillData(props, generatetype) {
    let pks = [], recordinfo, flag, geneData;
    let indexMap = new Map();
    // 红字收款单
    if (generatetype == 'F2') {
        recordinfo = props.form.getAllFormValue(formId_07);
        flag = props.form.isCheckNow(formId_07);
    }
    // 红字付款单 
    else if (generatetype == 'F3') {
        recordinfo = props.form.getAllFormValue(formId_08);
        flag = props.form.isCheckNow(formId_08);
    }
    if (!flag) {
        return;
    }
    geneData = props.table.getCheckedRows(tableId);
    geneData.forEach((val) => {
        let pk;
        pk = val.data.values.pk_informer.value;
        pks.push(pk);
        indexMap.set(pk, val.index);
    });

    let type;
    let geneinfo = {
        type: generatetype,
        pks: pks,
        pageid: pagecode,
        indexMap: indexMap
    };
    let data = {
        geneinfo: geneinfo,
        recordinfo: recordinfo
    };
    data.pageid = pagecode;
    return data;
}


/*IP7nM0v+c2pNL2ysG0q2i3qQw3xa9EH9yP/qPAJNqX1TXC78BsBLpvTlDep76PU4*/