/*4OU2cJOHzXwhlcqfNjC3Zh3YuZtrggExeSSybYDMk3Rp0NWCVx50VS+tA1XBXJjB*/
import { toast } from 'nc-lightapp-front';
/**
 * [收款结算]-是否独立结算信息,校验独立结算信息
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const checkSingleSettle = function () {
    //结算信息不允许修改表体行
    let isfromindependent = this.props.form.getFormItemsValue(this.formId, 'isfromindependent').value;//是否独立结算信息
    if (isfromindependent && isfromindependent == '1') {
        toast({
            color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000111')
        });//国际化处理:不允许改变独立结算信息的行数!
        return false;
    } else {
        return true;
    }
}
/**
 * [收款结算]-关联结算信息生成的单据不允许删除
 */
export const checkSingleSettleDel = function () {
    let isfromindependent = this.props.form.getFormItemsValue(this.formId, 'isfromindependent').value;//是否独立结算信息
    if (isfromindependent && isfromindependent == '1') {
        toast({
            color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000123')
        });//国际化处理:关联结算信息生成的单据不允许删除!!
        return false;
    } else {
        return true;
    }
}
/**
 * [收款结算]-资金结算单据生成的单据，收款金额不允许修改!
 */
export const checkSettleAmonut = function () {
    //结算信息不允许修改表体行
    let isfromindependent = this.props.form.getFormItemsValue(this.formId, 'isfromindependent').value;//是否独立结算信息
    if (isfromindependent && isfromindependent == '1') {
        let p_money = this.props.form.getFormItemsValue(this.formId, 'primal_money') == null ? null : this.props.form.getFormItemsValue(this.formId, 'primal_money').value;
        // 表体pk_org赋值
        let totalNum = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
        let totalPrimal = 0;
        let isCheckTable;
        for (let i = 0; i < totalNum; i++) {
            isCheckTable = this.props.cardTable.getValByKeyAndIndex(this.tableId, i, 'rec_primal');//收款原币金额
            if (isCheckTable && isCheckTable.value) {
                totalPrimal = parseFloat(totalPrimal) + parseFloat(isCheckTable.value);
            }
        }
        if (p_money != totalPrimal) {
            toast({
                color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000112')
            });//国际化处理：资金结算单据生成的单据，收款金额不允许修改!
            return false;
        }
    } else {
        return true;
    }
}
/**
 * [收款结算]-取消关联校验,单据状态必须为保存态和暂存态
 */
export const checkCancelSettle = function () {
    let isfromindependent = this.props.form.getFormItemsValue(this.formId, 'isfromindependent').value;//是否独立结算信息
    debugger
    if (isfromindependent && isfromindependent == '1') {
        let status = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
        if(status && (status=='-99' || status =='-10')){
            return true;
        }else{
            toast({
                color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000124')
            });//国际化处理:取消关联失败:单据不是保存态和暂存态，不能取消关联!
            return false;
        }
    } else {
        toast({
            color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") &&
                this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000125')
        });//国际化处理：操作失败:单据不是关联独立结算信息生成单据,不能取消关联!
        return false;
    }
}

/*4OU2cJOHzXwhlcqfNjC3Zh3YuZtrggExeSSybYDMk3Rp0NWCVx50VS+tA1XBXJjB*/