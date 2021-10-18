/*tMGmngb2VppUigCVOhoMMtsyB9OebP87RuCdebeChBcxleE5mv0sBdfx83POX4Z3*/
/**
 * [外币兑换-推单生成的单据编辑性控制]
 * @param {*}  
 */
export const srcBillEdit = function () {
    let is_srcbill = this.props.form.getFormItemsValue(this.formId, 'pk_srcbill');//来源单据：推单生成
    //新需求：推单生成的外币兑换单：点击修改时业务类型，币种，金额，账户等不能编辑
    if (is_srcbill && is_srcbill.value) {
        let values = {
            'busitype': true,//业务类型
            'pk_buycurrtype': true,//买入币种
            'buyamount': true,
            'buyglcamount': true,
            'buyglcrate': true,
            'buygllcamount': true,
            'buygllcrate': true,
            'buyolcamount': true,
            'buyolcrate': true,
            'pk_buyacct': true,

            'pk_sellcurrtype': true,//卖出币种
            'sellamount': true,
            'sellglcamount': true,
            'sellglcrate': true,
            'sellgllcamount': true,
            'sellgllcrate': true,
            'sellolcamount': true,
            'sellolcrate': true,
            'pk_sellacct': true,

            'pk_chargecurrtype': true,//手续费币种
            'chargeamount': true,
            'chargeglcamount': true,
            'chargeglcrate': true,
            'chargegllcamount': true,
            'chargegllcrate': true,
            'chargeolcamount': true,
            'chargeolcrate': true,
            'pk_paychargeacct': true,

            'tradeprice': true//交易价
        }
        this.props.form.setFormItemsDisabled(this.formId, values);
    } else {
        //业务类型
        let busitype = this.props.form.getFormItemsValue(this.formId, 'busitype') && this.props.form.getFormItemsValue(this.formId, 'busitype').value;
        if(busitype){
            let values = {
                'busitype': false,//业务类型
                'pk_buycurrtype': busitype && busitype != 'BUY',//买入币种
                'buyamount': false,
                'buyglcrate': busitype && busitype != 'BUY',
                'buyolcrate': busitype && busitype != 'BUY',
                'buygllcrate': busitype && busitype != 'BUY',
                'pk_buyacct': false,
                'pk_sellcurrtype': busitype && busitype != 'SELL',//卖出币种
                'sellamount': false,
                'sellglcrate': busitype && busitype != 'SELL',
                'sellgllcrate': busitype && busitype != 'SELL',
                'sellolcrate': busitype && busitype != 'SELL',
                'pk_sellacct': false,
                'pk_chargecurrtype': false,//手续费币种
                'chargeamount': false,
                'chargeolcrate': true,
                'chargegllcrate': true,
                'chargeglcrate': true,
                'pk_paychargeacct': false,
                'tradeprice': false//交易价
            }
            this.props.form.setFormItemsDisabled(this.formId, values);
        }
    }
}

/*tMGmngb2VppUigCVOhoMMtsyB9OebP87RuCdebeChBcxleE5mv0sBdfx83POX4Z3*/