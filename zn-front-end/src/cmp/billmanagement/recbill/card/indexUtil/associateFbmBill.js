/*j97TfpKkjZSFBDMvxRQGisDI1rm8PwKllD+CCjyliMfqoqbwr0HzOTrJDmEc7Xr1*/
import { ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源

/**
 * [收款结算]-进行票据退单
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const associateFbmBillData = function (pk_registers) {
    let sendArr = {
        'pk': pk_registers,
        'pageid': this.pageId
    }
    ajax({
        url: '/nccloud/cmp/recbill/associatefbmbill.do',
        data: sendArr,
        success: (res) => {
            let { success, data } = res;
            if (success) {    
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        //页签赋值
                        let billNo = res.data.head[this.formId].rows[0].values.bill_no.value;
                        let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        this.billno = billNo;
                        // this.source_flag(sourceFlag);
                        setSourceFlag.call(this,sourceFlag);
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                    //设置编辑性
                    this.props.cardTable.setStatus(this.tableId, 'edit');
                    this.props.form.setFormStatus(this.formId, 'edit');
                    //设置编辑性：财务组织，收款金额  票据类型 票据号 不可编辑
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'primal_money': true });//首款原币金额
                    this.props.cardTable.setColEditableByKey(this.tableId, 'primal_money', true);//不可编辑
                    this.props.cardTable.setColEditableByKey(this.tableId, 'note_no', true);//不可编辑
                    this.props.cardTable.setColEditableByKey(this.tableId, 'note_type', true);//不可编辑
                } else {
                    //清空数据
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
                this.toggleShow();
            }
        }
    });
}

/*j97TfpKkjZSFBDMvxRQGisDI1rm8PwKllD+CCjyliMfqoqbwr0HzOTrJDmEc7Xr1*/