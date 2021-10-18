/*6qvvy6zgYr+5uxbthr2nHLuDdqGy+TBE/HjyRAJySoLkq0+sc0jkLl4j1awScAH2*/
/**
 * [外币兑换index]-组织改变数据-->重置编辑数据-->回复新增之后的数据
 * @param {*}  
 */
export const resetEditData = function () {
    //业务类型
    this.props.form.setFormItemsValue(this.formId, { 'busitype': { value: null, display: null } });
    //结算方式 
    this.props.form.setFormItemsValue(this.formId, { 'pk_balatype': { value: null, display: null } });
    //买入币种
    this.props.form.setFormItemsValue(this.formId, { 'pk_buycurrtype': { value: null, display: null } });
    //买入金额
    this.props.form.setFormItemsValue(this.formId, { 'buyamount': { value: null, display: null } });
    //买入银行账户 
    this.props.form.setFormItemsValue(this.formId, { 'pk_buyacct': { value: null, display: null } });
    //本币汇率
    this.props.form.setFormItemsValue(this.formId, { 'buyolcrate': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'buygllcrate': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'buyglcrate ': { value: null, display: null } });
    //本币金额
    this.props.form.setFormItemsValue(this.formId, { 'buyolcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'buygllcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'buyglcamount': { value: null, display: null } });
    //交易价
    this.props.form.setFormItemsValue(this.formId, { 'tradeprice': { value: null, display: null } });

    //卖出币种
    this.props.form.setFormItemsValue(this.formId, { 'pk_sellcurrtype': { value: null, display: null } });
    //卖出金额
    this.props.form.setFormItemsValue(this.formId, { 'sellamount ': { value: null, display: null } });
    //卖出银行账户 
    this.props.form.setFormItemsValue(this.formId, { 'pk_sellacct': { value: null, display: null } });
    //本币汇率
    this.props.form.setFormItemsValue(this.formId, { 'sellolcrate': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'sellgllcrate': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'sellglcrate  ': { value: null, display: null } });
    //本币金额
    this.props.form.setFormItemsValue(this.formId, { 'sellolcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'sellgllcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'sellglcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'sellamount': { value: null, display: null } });
    //手续费币种
    // this.props.form.setFormItemsValue(this.formId, { 'pk_chargecurrtype': { value: null, display: null } });
    //手续费金额
    // this.props.form.setFormItemsValue(this.formId, { 'chargeamount ': { value: null, display: null } });
    //手续费银行账户 
    this.props.form.setFormItemsValue(this.formId, { 'pk_paychargeacct': { value: null, display: null } });
    //手续费本币汇率
    // this.props.form.setFormItemsValue(this.formId, { 'chargeolcrate': { value: null, display: null } });
    // this.props.form.setFormItemsValue(this.formId, { 'chargegllcrate': { value: null, display: null } });
    // this.props.form.setFormItemsValue(this.formId, { 'chargeglcrate  ': { value: null, display: null } });
    //手续费本币金额
    this.props.form.setFormItemsValue(this.formId, { 'chargeolcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'chargegllcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'chargeglcamount': { value: null, display: null } });
    this.props.form.setFormItemsValue(this.formId, { 'chargeamount': { value: null, display: null } });
    //汇兑损益
    this.props.form.setFormItemsValue(this.formId, { 'gainorloss': { value: null, display: null } });
    //备注
    this.props.form.setFormItemsValue(this.formId, { 'remark': { value: ' ', display: ' ' } });
    this.props.form.setFormItemsValue(this.formId, { 'summary': { value: ' ', display: ' ' } });

}

/*6qvvy6zgYr+5uxbthr2nHLuDdqGy+TBE/HjyRAJySoLkq0+sc0jkLl4j1awScAH2*/