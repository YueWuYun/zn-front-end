/*Sul502EJsQcSTL/hEDIWsSQira7nF8J0+h5W4qW7mzeDo+T14EnGZKnghuJMLLbz*/
import { toast } from 'nc-lightapp-front';
/**
 * [到账通知认领：收款结算]-到账通知认领检查：第一保存可以修改金额，第二次修改不能修改金额
 * @param {*} value 选择票据号
 */
export const informerCheckMoney = function () {
    //表体行数
    let checkTableNum = this.props.cardTable.getNumberOfRows(this.tableId);
    //表体原币金额合计
    let totalPrimal = 0;
    for (let i = 0; i < checkTableNum; i++) {
        let isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
        if (isCheckTable && isCheckTable.value) {
            totalPrimal = parseFloat(totalPrimal) + parseFloat(isCheckTable.value);
        } else {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000000') });/* 国际化处理： 收款金额未填写！*/
            return false;
        }
    }
    return true;
    //收款金额总和判断
    //表头原币金额
    //  let form_money = this.props.form.getFormItemsValue(this.formId, 'primal_money') == null ? null : this.props.form.getFormItemsValue(this.formId, 'primal_money').value;
    // if (parseFloat(form_money) != totalPrimal) {
    //     toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && 
    //     this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000128')});//国际化处理：此单据为到账通知生成，字段金额不能修改!
    //     this.props.cardTable.resetTableData(this.tableId);//恢复编辑前值
    //     let status = this.props.getUrlParam('status');
    //     if (status == 'browse') {
    // 		this.props.cardTable.setStatus(this.tableId, 'browse');
    // 	} else {
    // 		this.props.cardTable.setStatus(this.tableId, 'edit');
    // 	}
    //     return false;
    // }
}

export const informerCheckEdit = function (newvalue, oldvalue) {
    if (this.props.form.getFormItemsValue(this.formId, 'pk_recbill') && this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        //第二次修改，不允许修改金额
        if (newvalue != oldvalue) {
            toast({
                color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000128')
            });//国际化处理：此单据为到账通知生成，字段金额不能修改!
            this.props.cardTable.resetTableData(this.tableId);//恢复编辑前值
            this.props.cardTable.setStatus(this.tableId, 'edit');
            return false;
        }
    }
    return true;
}
/*Sul502EJsQcSTL/hEDIWsSQira7nF8J0+h5W4qW7mzeDo+T14EnGZKnghuJMLLbz*/