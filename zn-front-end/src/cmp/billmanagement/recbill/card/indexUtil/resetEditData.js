/*6qvvy6zgYr+5uxbthr2nHLuDdqGy+TBE/HjyRAJySoLkq0+sc0jkLl4j1awScAH2*/
import { addbodyBtn } from "../buttonClick/addbodyBtn";
/**
 * [收款结算]-组织改变数据-->重置编辑数据-->回复新增之后的数据
 * @param {*}  
 */
export const resetEditData = function () {
    //表头信息
    //结算方式 
    this.props.form.setFormItemsValue(this.formId, { 'pk_balatype': { value: null, display: null } });
    //收款银行账户
    this.props.form.setFormItemsValue(this.formId, { 'pk_account': { value: null, display: null } });
    //现金账户
    this.props.form.setFormItemsValue(this.formId, { 'mon_account': { value: null, display: null } });
    //票据类型 
    this.props.form.setFormItemsValue(this.formId, { 'note_type': { value: null, display: null } });
    //票据号
    this.props.form.setFormItemsValue(this.formId, { 'note_no': { value: null, display: null } });
    //收款原币金额
    this.props.form.setFormItemsValue(this.formId, { 'primal_money': { value: null, display: null } });
    //交易对象类型
    this.props.form.setFormItemsValue(this.formId, { 'objecttype': { value: null, display: null } });
    //客户
    this.props.form.setFormItemsValue(this.formId, { 'pk_customer': { value: null, display: null } });
    //付款银行账户
    this.props.form.setFormItemsValue(this.formId, { 'pk_oppaccount': { value: null, display: null } });
    //业务流程
    this.props.form.setFormItemsValue(this.formId, { 'pk_busiflow': { value: null, display: null } });
    //备注
    this.props.form.setFormItemsValue(this.formId, { 'memo ': { value: ' ', display: ' ' } });
    //表体信息
    this.props.cardTable.setTableData(this.tableId, { rows: [] });//清空表体
    //新增一行表体
    addbodyBtn.call(this);
}

/*6qvvy6zgYr+5uxbthr2nHLuDdqGy+TBE/HjyRAJySoLkq0+sc0jkLl4j1awScAH2*/