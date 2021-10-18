/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
//缓存
let { updateCache, addCache } = cardCache;

/**
 * [收款协同]-保存
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveBill = function () {
    if (this.props.getUrlParam('copyFlag') === 'copy') {
        this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
        this.props.form.setFormItemsValue(this.formId, { ts: null });
    }
    let flag = this.props.form.isCheckNow(this.formId);
    let tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
    if (flag && tableflag) {

        // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
        //上行流量优化
        let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
        let url = '/nccloud/cmp/recbill/recbillsynconfirm.do'//保存协同单据--->未确认变成确认状态
        ajax({
            url: url,
            data: CardData,
            success: (res) => {
                let pk_paybill = null;
                if (res.success) {
                    if (res.data) {
                        if (res.data.head) {
                            if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
                                let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                                let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                                if (ntbMessage) {
                                    toast({
                                        color: 'warning',
                                        content: ntbMessage
                                    });
                                }
                               
                                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000032') + reform_message });/* 超额提示预警，预算提示*/
                            } else {
                                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000032') });/* 国际化处理： 保存成功*/
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
                        let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                        let billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                        let billnoNo = res.data.head[this.formId].rows[0].values.bill_no.value;
                        //缓存处理
                        let firstStatus = this.props.getUrlParam('status');
                        if (!firstStatus || firstStatus == 'add' || firstStatus == 'copy') {
                            //新增缓存
                            addCache(pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, pk_recbill, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        }
                        this.props.setUrlParam({
                            status: 'browse',
                            id: pk_recbill,
                            billno: billstatue,
                            pagecode: this.pageId
                        });
                        this.toggleShow();//切换页面状态

                    }
                }
            }
        });
    }
}

/*VcOrD49QzbhDt4hEK/IMD3cCf54YNBpg/cZXO8R7/EfsMZVNthG4JJMyAjOToCrB*/