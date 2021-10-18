/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量查询
//缓存
let { updateCache, addCache } = cardCache;

/**
 * [外币兑换]-保存新增
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveAddBill = function () {
    // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    //上行流量优化
    let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
    let flag = this.props.form.isCheckNow(this.formId);
    let sa_tableflag = this.props.cardTable.checkTableRequired(this.tableId);
    let saveAddStatus = this.props.getUrlParam('status');
    let sendurl = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存新增
    if (this.props.getUrlParam('status') === 'edit') {
        sendurl = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存提交
    }
    //关联结算信息保存方法url
    let settlement_src = this.props.getUrlParam('src');
    console.log(settlement_src, 'from_settle_to_save');
    if (settlement_src) {
        sendurl = '/nccloud/cmp/recbill/settlesave.do'//结算信息保存
        CardData = {
            'billcard': CardData,
            'pk': this.settlepkinfo//结算信息pk
        }
    }

    if (flag && sa_tableflag) {
        ajax({
            url: sendurl,
            data: CardData,
            success: (res) => {
                if (res.success) {
                    if (res.data && res.data.head) {
                        if (res.data.head[this.formId].rows[0].values.ntberrmsg && res.data.head[this.formId].rows[0].values.ntberrmsg.value) {
                            let reform_message = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                            toast({ color: 'warning', content: reform_message });/* 超额提示预警，预算提示*/
                        } else {
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000001') });/* 国际化处理： 保存成功*/
                        }
                        let saveadd_pk = res.data.head[this.formId].rows[0].values.pk_recbill.value;//单据pk
                        let saveadd_bill_status = res.data.head[this.formId].rows[0].values.bill_status.value;//单据状态
                        //根据后台返回的数据进行缓存处理<pass>
                        if (res.data.body && res.data.body[this.tableId]) {
                            let body = res.data.body;//差异缓存处理
                            body[this.tableId] = this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId])
                            if (body) {
                                res.data.body = body;//差异缓存处理
                            }
                        }
                        //增加缓存

                        if (!saveAddStatus || saveAddStatus == 'add' || saveAddStatus == 'copy') {
                            //新增缓存
                            addCache(saveadd_pk, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        } else {
                            //更新缓存
                            updateCache(this.pkname, saveadd_pk, res.data, this.formId, this.dataSource, res.data.head[this.formId].rows[0].values);
                        }
                        //新增的时候先清空数据
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                        this.props.setUrlParam({
                            status: 'add',
                            id: saveadd_pk,//缓存标识方便卡片取消的时候获取缓存
                            bill_no: saveadd_bill_status,//缓存标识方便卡片取消的时候获取缓存
                            pagecode: this.pageId
                        });
                        this.settlepkinfo = null;
                        this.refresh();
                    }
                }
            }
        });
    }
}

/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/