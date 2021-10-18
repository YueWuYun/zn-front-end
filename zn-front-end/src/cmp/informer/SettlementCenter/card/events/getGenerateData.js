/*IP7nM0v+c2pNL2ysG0q2i3qQw3xa9EH9yP/qPAJNqX1TXC78BsBLpvTlDep76PU4*/
import { formId, tableId, table_orgs, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06 } from '../constants';
import { ajax, base, toast,viewModel } from 'nc-lightapp-front';
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

    if (btnarea == 'card_inner') {
        if (temppk) {
            let pk;
            pk = temppk;
            pks.push(pk);
        }
    } else if (btnarea == 'card_head') {
        let geneData = props.table.getCheckedRows(tableId);
        geneData.forEach((val) => {
            let pk;
            pk = val.data.values.pk_informerrelease.value;
            pks.push(pk);
        });
    }
    //取出缓存的组织替换单据上的
    let pk_org = getGlobalStorage('sessionStorage', CACHE_KEY.PK_ORG);
    let type;
    let geneinfo = {
        type: generatetype,
        pks: pks,
        pk_org:pk_org
    };
    let data = {
        geneinfo: geneinfo,
        recordinfo: recordinfo
    };
    data.pageid = '36070AI_C01';
    return data;
}

/*IP7nM0v+c2pNL2ysG0q2i3qQw3xa9EH9yP/qPAJNqX1TXC78BsBLpvTlDep76PU4*/