/*pMR+GI2VXYlhJzTR9DSVkRNO3raErH0w1XGGUfy6LM/fu1k+wLBFLI/0mtbIRoM2*/
import { saveCommit } from "../../../../tmpub/pub/util";
import { saveMultiLangRes,loadMultiLang } from '../../../../tmpub/pub/util';

export const paybillSaveCommit = function(props) {
    //校验表单必输字段
    let saveComBeforeData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    //移除没有金额的数据
    this.saveBeforeEvent.call(this,saveComBeforeData);
    let saveComData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    let url = '/nccloud/cmp/paybills/savecommit.do';
    if (props.getUrlParam('status') === 'add' && props.getUrlParam('src') === 'settlement') {
        url = '/nccloud/cmp/paybills/assavecommit.do'; //修改保存
    }
    if (props.getUrlParam('status') === 'edit' && props.getUrlParam('op') === 'protopay') {
        if (this.protoPayCheck(saveComData)) {
            return;
        }
    }
    let saveComflag = props.form.isCheckNow(this.formId);
    if (!props.cardTable.checkTableRequired(this.tableId)) {
        return;
    }
    if(saveComflag) {
        saveCommit(props, {
            //页面编码
            pageCode: card_page_id,
            //表头区域编码
            headCode: this.formId,
            //表体区域编码（多表体传数组，没有表体不传）
            bodyCode: this.tableId,
            //请求url
            url: url,
            //指派信息
            assign:this.state.compositedata,
            //展示指派框的逻辑
            showAssignFunc: (res) => {
                let { data } = res;
                let { workflow } = data;
                this.commitflag="savecommit";
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                };
            },
            //更新界面数据的逻辑
            updateViewFunc: (res) => {
                this.props.form.setAllFormValue({ ['head']: res.data.head['head'] });
                let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
                let sc_bill_no = res.data.head['head'].rows[0].values.bill_no.value;
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                toast({
                    color: 'success',
                    content:
                        props.MutiInit.getIntl('36070PBR') &&
                        props.MutiInit.getIntl('36070PBR').get('36070PBR-000008')
                }); /* 国际化处理： 保存提交成功*/
                this.billno = sc_bill_no;
                this.billId = sc_pk_paybill;
                updateCache(
                    PAYBILL_CONST.paybill_pkname,
                    sc_pk_paybill,
                    res.data,
                    PAYBILL_CONST.card_from_id,
                    PAYBILL_CONST.paybillCacheKey
                );
                this.props.setUrlParam({
                    status: 'browse',
                    id: sc_pk_paybill
                });
                this.toggleShow();
            }
        });
    }
}
/*pMR+GI2VXYlhJzTR9DSVkRNO3raErH0w1XGGUfy6LM/fu1k+wLBFLI/0mtbIRoM2*/