/*FDNWFGhCqsK5jzLdZq9ANnQiRS81hErlJLFY+OLMRsZSVVmQp0efFChDSJWZPdNp*/
import { ajax } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源

/**
 * [收款协同]-加载数据
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const loadQueryData = function () {
    //查询单据详情
    if (this.props.getUrlParam('status') === 'edit' ||
        this.props.getUrlParam('status') === 'browse') {
        let billstatus = this.props.getUrlParam('billstatus');//单据状态
        if(!this.props.getUrlParam('id')){
            return ;
        }
        let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId, billstatus: billstatus };
        ajax({
            url: '/nccloud/cmp/recbill/recbillquerycard.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        //页签赋值
                        let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                        let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        this.billno = billno;
                        // this.source_flag(source_flag);
                        setSourceFlag.call(this, source_flag);
                        //按钮显示控制[单据状态]
                        this.props.setUrlParam({
                            billno: res.data.head[this.formId].rows[0].values.bill_status.value
                        });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
                if (this.props.getUrlParam('status') === 'edit') {
                    //设置组织不可以编辑
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_org_v': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_fiorg': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_fiorg_v': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_pcorg_v': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_pcorg': true });
                }
                this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
            }
        });
    }
    //复制
    if (this.props.getUrlParam('status') === 'copy') {

        // /清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        this.billno = '';
        if(!this.props.getUrlParam('id')){
            return ;
        }
        let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
        ajax({
            url: '/nccloud/cmp/recbill/recbillcopy.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
                //设置组织不可以编辑
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
            }
        });
    }
    //新增
    if (this.props.getUrlParam('status') === 'add') {
        // /清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        this.billno = '';
        //清空table所有数据
        this.props.cardTable.setTableData(this.tableId, { rows: [] });
        let data = { pk: this.tableId, pageid: this.pageId };
        ajax({
            url: '/nccloud/cmp/recbill/recbilladdevent.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//组织可以进行编辑
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        //把所有form中字段不可以编辑，知道选择org之后
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        //把所有table中字段不可以编辑，知道选择org之后
                        this.props.cardTable.setStatus(this.tableId, 'browse');
                    }
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
            }
        });
    }
}

/*FDNWFGhCqsK5jzLdZq9ANnQiRS81hErlJLFY+OLMRsZSVVmQp0efFChDSJWZPdNp*/