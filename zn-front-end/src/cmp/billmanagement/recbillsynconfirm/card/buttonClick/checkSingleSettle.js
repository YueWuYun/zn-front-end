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
            color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") &&
                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000074')
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
            color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") &&
                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000076')
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
                color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") &&
                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000075')
            });//国际化处理：资金结算单据生成的单据，收款金额不允许修改!
            return false;
        }
    } else {
        return true;
    }
}

/*4OU2cJOHzXwhlcqfNjC3Zh3YuZtrggExeSSybYDMk3Rp0NWCVx50VS+tA1XBXJjB*/