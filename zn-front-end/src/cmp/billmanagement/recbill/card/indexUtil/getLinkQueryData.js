/*MbmsQ44fu4sIQRtCQMNXT1O4y2P7VJv+/aVLZlkEGh5QwPXT4QRp+147byBGsfzk*/
import { ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
/**
 * [外币兑换]-进行联查数据展示
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getLinkQueryData = function (searchData) {
    let sendArr = {
        'pks': searchData,
        'pageid': this.pageId
    }
    ajax({
        url: '/nccloud/cmp/recbill/recbillquerysettleinfo.do',
        data: sendArr,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                
                if (res.data && res.data.billcard) {
                    if (res.data.billcard.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.billcard.head[this.formId] });
                        //页签赋值
                        let billNo = res.data.billcard.head[this.formId].rows[0].values.bill_no.value;
                        let sourceFlag = res.data.billcard.head[this.formId].rows[0].values.source_flag.value;
                       
                        this.settlepkinfo = res.data.pk_settlement
                        this.billno = billNo;
                        // this.source_flag(sourceFlag);
                        setSourceFlag.call(this,sourceFlag);
                    }
                    if (res.data.billcard.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.billcard.body[this.tableId]);
                    }
                    //设置编辑性
                    this.props.cardTable.setStatus(this.tableId, 'edit');
                    this.props.form.setFormStatus(this.formId, 'edit');
                    //设置编辑性：财务组织，收款金额
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'primal_money': true });//首款原币金额
                    this.props.cardTable.setColEditableByKey(this.tableId, 'primal_money', true);//不可编辑
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

/*MbmsQ44fu4sIQRtCQMNXT1O4y2P7VJv+/aVLZlkEGh5QwPXT4QRp+147byBGsfzk*/