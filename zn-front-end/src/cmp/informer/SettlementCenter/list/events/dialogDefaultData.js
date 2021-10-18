/*MYw/zWx2s9oh4QNrCE3E/w5bDmUF6hLukqZFzdiyQEkWGB66GeezEscUqZ6jt1of*/
import { formId, tableId, table_orgs, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, formId_07, formId_08 } from '../constants';
import { ajax, base, toast } from 'nc-lightapp-front';
let { NCMessage } = base;
/**
 * 收款单，付款单
 * 收款结算单，付款结算单，补录信息框设置默认值
 * @param {*} props 
 */
export function dialogDefaultData(props) {
    let seleteddata = props.table.getCheckedRows(tableId);
    let billtype = props.form.getFormItemsValue(formId_01, 'generatetype').value;
    let pk_informer;
    if (seleteddata.length == 0) {
        pk_informer = props.form.getFormItemsValue(formId_01, 'pk').value;
    } else {
        pk_informer = seleteddata[0].data.values.pk_informer.value;
    }
    let pks = [];
    pks.push(pk_informer);
    let data = {
        pks: pks,
        billtype: billtype
    }
    let formData = props.form.getAllFormValue(formId_01);
    ajax({
        url: '/nccloud/cmp/informer/listdialogdefaultvalue.do',
        data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                let meta = props.meta.getMeta();
                if (billtype == 'F4' || billtype == 'F5') {//收付款结算单
                    let item = meta['form_finance_01'].items.find(e => e.attrcode === 'oppacc');
                    props.form.setAllFormValue({ ['form_finance_01']: res.data['form_finance_01'] });
                    //交易类型对象
                    let busiobj = res.data['form_finance_01'].rows[0].values.busiobjtype.value;
                    if (busiobj == '1') {//供应商
                        props.form.setFormItemsDisabled('form_finance_01', { 'pk_customer': true });
                        props.form.setFormItemsDisabled('form_finance_01', { 'pk_supplier': false });
                        props.renderItem('form', 'form_finance_01', 'oppacc', null);
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
                    } else if (busiobj == '0') {
                        props.form.setFormItemsDisabled('form_finance_01', { 'pk_supplier': true });
                        props.form.setFormItemsDisabled('form_finance_01', { 'pk_customer': false });
                        props.renderItem('form', 'form_finance_01', 'oppacc', null);
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
                    }
                } else if (billtype == '36S4') {//划账结算单
                    props.form.setAllFormValue({ [formId_05]: res.data[formId_05] });
                } else if (billtype == 'F2' || billtype == 'F3') {//收付款单
                    let item = meta[formId_06].items.find(e => e.attrcode === 'oppacc');
                    props.form.EmptyAllFormValue(formId_06);
                    props.form.setAllFormValue({ [formId_06]: res.data[formId_06] });
                    //交易类型对象
                    let busiobj = res.data[formId_06].rows[0].values.busiobjtype.value;
                    if (busiobj == '1') {//供应商
                        props.form.setFormItemsDisabled(formId_06, { 'pk_customer': true });
                        props.form.setFormItemsDisabled(formId_06, { 'pk_supplier': false });
                        props.renderItem('form', formId_06, 'oppacc', null);
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
                    } else if (busiobj == '0') {
                        props.form.setFormItemsDisabled(formId_06, { 'pk_supplier': true });
                        props.form.setFormItemsDisabled(formId_06, { 'pk_customer': false });
                        props.renderItem('form', formId_06, 'oppacc', null);
                        item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
                    }
                }
                props.meta.setMeta(meta);
                props.form.setAllFormValue({ 'form_generate_01': formData });
            }
        }
    });
}

/**
 * 红字收款单，红字付款单,补录信息框设置默认值
 * @param {*} props 
 */
export function dialogRedBilldefaultData(props, billtype) {
    let seleteddata = props.table.getCheckedRows(tableId);
    let pk_informer = seleteddata[0].data.values.pk_informer.value;
    let pks = [];
    pks.push(pk_informer);
    let data = {
        pks: pks,
        billtype: billtype
    }
    ajax({
        url: '/nccloud/cmp/informer/listdialogdefaultvalue.do',
        data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                // 红字收款单
                if (billtype == 'F2') {
                    props.form.EmptyAllFormValue(formId_07);
                    props.form.setAllFormValue({ [formId_07]: res.data[formId_06] });
                }
                //红字付款单 
                else {
                    props.form.EmptyAllFormValue(formId_08);
                    props.form.setAllFormValue({ [formId_08]: res.data[formId_06] });
                }
            }
        }
    });
}

/**
 * 日期格式化
 * @param {*} date 
 */
function seperateDate(date) {
    if (typeof date !== 'string') return;
    let result = date.split(' ') && date.split(' ')[0];
    return result;
}

/*MYw/zWx2s9oh4QNrCE3E/w5bDmUF6hLukqZFzdiyQEkWGB66GeezEscUqZ6jt1of*/