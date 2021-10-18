/*Fmll4DBF1bi4qjMmX8JPZS7plqi5T529NdEILtTiGNx1K36Zef/OlOT6XxAbUknA*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { setSourceFlag } from '../../util/setSourceFlag.js';//设置来源
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
//缓存
let { updateCache, addCache } = cardCache;

/**
 * [收款协同]-保存提交[指派]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveSubAssginBill = function () {
    if (!this.getAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000072')   // 提示内容,非必输/* 国际化处理：请选择指派人!*/
        });
        return;
    }
    let url = '/nccloud/cmp/recbill/synsubmitassgin.do'//协同确认保存提交
    // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    //上行流量优化
    let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
    let savesubmitBtnflag = this.props.form.isCheckNow(this.formId);
    let sb_tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
    let data = {
        'billcard': CardData,
        'param': this.getAssginUsedr
    }
    if (savesubmitBtnflag && sb_tableflag) {
        ajax({
            url: url,
            data: CardData,
            success: (res) => {
                if (res.success) {
                    //关闭指派框
                    this.setState({
                        compositedisplay: false,
                    });
                    if (res.data) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000002') });/* 国际化处理： 保存提交成功*/
                        if (res.data.head) {
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
                        //增加缓存
                        let card_sub_status = this.props.getUrlParam('status');
                        if (!card_sub_status || card_sub_status == 'add' || card_sub_status == 'copy') {
                            //新增缓存
                            addCache(sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, sub_pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        }
                        this.setState({
                            compositedisplay: false
                        });
                        this.compositedata = null;
                        this.getAssginUsedr=null;
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