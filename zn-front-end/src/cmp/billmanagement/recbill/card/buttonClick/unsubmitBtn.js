/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
//缓存
let {updateCache, addCache } = cardCache;

/**
 * [收款结算]-收回按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unsubmitBtn = function () {
    let card_unsub_status = this.props.getUrlParam('status');
    if (!this.props.getUrlParam('id')) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000008') });/* 国际化处理： 操作失败，参数id无法获取!*/
        return;
    }
    let unsubmitBtndataArr = [];
    unsubmitBtndataArr.push(this.props.getUrlParam('id'));
    let unsubmitBtnData = {
        'pks': unsubmitBtndataArr,
        'pageid': this.pageId,
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    };
    ajax({
        url: '/nccloud/cmp/recbill/recbillunsubmit.do',
        data: unsubmitBtnData,
        success: (res) => {
            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000010') });/* 国际化处理： 收回成功*/
            if (res && res.data) {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    let unsubbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
                    this.billno = unsubbillno;
                    let un_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                    let un_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                    this.props.setUrlParam({
                        status: 'browse',
                        id: un_pk_recbill,
                        billno: un_billstatue,
                        pagecode: this.pageId
                    });
                    let unsb_source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                    // this.source_flag(unsb_source_Flag);//来源系统翻译
                    setSourceFlag.call(this,unsb_source_Flag);
                    this.toggleShow();//切换页面状态
                    //差异缓存处理:直接取前台数据
                    let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);//表单取值
                    if (!res.data.body && CardData.body) {
                        res.data.body = CardData.body;
                    }
                    //增加缓存
                    if (!card_unsub_status || card_unsub_status == 'add' || card_unsub_status == 'copy') {
                        //新增缓存
                        addCache(un_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                    } else {
                        //更新缓存
                        updateCache(this.pkname, un_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                    }
                }
            }
        }
    });
}

/*gi3ba4BiTBJEvBdDUlI7+2AnDN0CIYlY9aMUUpQa0W36aEPLW8aQ/5QtyTK3ULbg*/