/*j7poyo7HxQnbt42cQsbQparkFQ96Lwmuxz/8Q867ptEz21Vzd6sbWBOSLJObJIzj*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
//缓存
let {  updateCache, addCache
     } = cardCache;

/**
 * [收款结算]-红冲按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const redbillBtn = function () {
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000008') });/* 国际化处理： 操作失败，参数id无法获取!*/
        return;
    }
    let redlistTsmap = [];//ts的list类型
    let redtsmap = {
        'pk': this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    }
    redlistTsmap.push(redtsmap);
    let reddata = {
        'pk': this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value,
        'pageid': this.pageId,
        'listTsmap': redlistTsmap
    };
    let card_redhandle_status = this.props.getUrlParam('status');
    ajax({
        url: '/nccloud/cmp/recbill/recbillredhandle.do',
        data: reddata,
        success: (res) => {
            if (res && res.data) {
                if (res.data.head) {
                    let message = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000012') + res.data.head[this.formId].rows[0].values.bill_no.value;;/* 国际化处理： 红冲成功!单据编号:*/
                    toast({ color: 'success', content: message });
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                let red_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                //更新、新增缓存
                //增加缓存
                if (!card_redhandle_status || card_redhandle_status == 'add' || card_redhandle_status == 'copy') {
                    //新增缓存
                    addCache(red_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                } else {
                    //更新缓存
                    updateCache(this.pkname, red_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                }
            } else {
                // props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                // props.cardTable.setTableData(this.tableId, { rows: [] });
            }
            if (this.props.getUrlParam('status') === 'edit') {
                //设置组织不可以编辑
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
            }
        }
    });
}

/*j7poyo7HxQnbt42cQsbQparkFQ96Lwmuxz/8Q867ptEz21Vzd6sbWBOSLJObJIzj*/