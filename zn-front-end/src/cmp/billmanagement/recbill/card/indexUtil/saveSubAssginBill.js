/*Fmll4DBF1bi4qjMmX8JPZS7plqi5T529NdEILtTiGNx1K36Zef/OlOT6XxAbUknA*/
import { ajax, toast } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
/**
 * [外币兑换]-保存提交[指派提交]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveSubAssginBill = function () {

    if (!this.getConstAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000113')   // 提示内容,非必输/* 国际化处理： 请选择指派人!*/
        });
        return;
    }
    let saveSubStatus = this.props.getUrlParam('status');
    if (saveSubStatus && saveSubStatus == 'browse') {
        saveSubStatus = 'edit';//浏览态处理成编辑态
    }
    // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    //上行流量优化
    let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
    let data = {
        'billcard': CardData,
        'param1': saveSubStatus,//保存提交前状态：保存态，新增态
        'param': this.getConstAssginUsedr
    }
    let savesubmitBtnflag = this.props.form.isCheckNow(this.formId);
    let sb_tableflag = this.props.cardTable.getCheckedRows(this.tableId);
    if (savesubmitBtnflag && sb_tableflag) {
        ajax({
            url: '/nccloud/cmp/recbill/savesubassgin.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (res.success) {
                    if (res.data) {
                        //关闭指派框
                        this.setState({
                            compositedisplay: false
                        });
                        this.compositedata = null;
                        if (res.data.head) {
                            let return_status = res.data.head[this.formId].rows[0].values.bill_status.value;
                            if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
                                let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                                if (return_status && return_status == -10) {
                                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') + reform_message });/* 保存成功，提交失败*/
                                } else {
                                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') + reform_message });/* 保存提交成功*//* 超额提示预警，预算提示*/
                                }
                            } else {
                                if (return_status && return_status == -10) {
                                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000120') });/* 保存成功，提交失败*/
                                } else {
                                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') });/* 保存提交成功*/
                                }
                            }
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            let subbillno = res.data.head[this.formId].rows[0].values.bill_no.value;
                            this.billno = subbillno;
                        }
                        //根据后台返回的数据进行缓存处理<pass>
                        if (res.data.body && res.data.body[this.tableId]) {
                            let body = res.data.body;//差异缓存处理
                            body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
                            if (body) {
                                res.data.body = body;//差异缓存处理
                            }
                        }
                        let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                        let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                        this.setState({
                            compositedisplay: false
                        });
                        this.compositedata = null;
                        this.getConstAssginUsedr=null;

                        this.props.setUrlParam({
                            status: 'browse',
                            id: sub_pk_recbill,
                            billno: sub_billstatue,
                            pagecode: this.pageId
                        });
                        let source_Flag = res.data.head[this.formId].rows[0].values.source_flag.value;
                        setSourceFlag.call(this, source_Flag);
                        this.toggleShow();//切换页面状态

                    }
                }
            }
        });
    }
}

/*Fmll4DBF1bi4qjMmX8JPZS7plqi5T529NdEILtTiGNx1K36Zef/OlOT6XxAbUknA*/