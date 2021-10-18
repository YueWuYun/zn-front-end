/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/
import { ajax, toast } from 'nc-lightapp-front';
import { createSimpleBillData } from '../../../../../tmpub/pub/util/index.js';//上行流量优化
/**
 * [收款协同]-保存新增
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveAddBill = function () {
    //上行流量优化
    let CardData = createSimpleBillData(this.props, this.pageId, this.formId, this.tableId);
    // let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    let sendurl = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存新增
    if (this.props.getUrlParam('status') === 'edit') {
        sendurl = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存提交
    }
    let checkTableNm = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
    let isCheckTable;
    let totalPrimal = 0;//表体中收款原币金额总数
    for (let i = 0; i < checkTableNm; i++) {
        isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
        if (isCheckTable && isCheckTable.value) {
            totalPrimal = parseFloat(totalPrimal) + parseFloat(isCheckTable.value);
            if (Math.abs(isCheckTable.value) != isCheckTable.value) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000073') });//'填写原币金额不能为负数!'
                return;
            }
        } else {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000000') });/* 国际化处理： 收款金额未填写！*/
            return;
        }
    }
    let flag = this.props.form.isCheckNow(this.formId);
    let saveadd_tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
    if (flag && saveadd_tableflag) {
        ajax({
            url: sendurl,
            data: CardData,
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000001') });/* 国际化处理： 保存成功*/
                        this.props.pushTo('/card', {
                            status: 'add'
                        })
                        this.refresh();
                    }
                }

            }
        });
    }
}

/*GPMlJVmN04MG3BhjopLQSijsYOefeyU5f6RnPaCsCSm3HnSxY6DC3d7+MPhNAlAf*/