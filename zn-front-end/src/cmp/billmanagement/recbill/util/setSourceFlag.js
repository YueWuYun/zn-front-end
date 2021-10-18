/*iz7qixbqGe6t3wrLqHEcjUZQOSo207HLfiwR0CoKz9ZktgJmXq/2KoOvpXP6s5jn*/
/**
 * [收款结算]-设置来源系统
 * @param {*} source_flag 来源系统编码
 */ 
export const setSourceFlag = function (source_flag) {
   	//处理来源系统显示值
		if (source_flag == '2') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000020'), value: source_flag } });/* 国际化处理： 现金管理*/
		} else if (source_flag == '5') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000021'), value: source_flag } });/* 国际化处理： 资金结算*/
		} else if (source_flag == '6') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000022'), value: source_flag } });/* 国际化处理： 网上银行*/
		} else if (source_flag == '8') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000023'), value: source_flag } });/* 国际化处理： 票据管理*/
		} else if (source_flag == '9') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000024'), value: source_flag } });/* 国际化处理： 协同单据*/
		} else if (source_flag == '104') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000025'), value: source_flag } });/* 国际化处理： 资产管理*/
		} else if (source_flag == '105') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000026'), value: source_flag } });/* 国际化处理： 网上报销*/
		} else if (source_flag == '0') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000027'), value: source_flag } });/* 国际化处理： 应收系统*/
		} else if (source_flag == '1') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000028'), value: source_flag } });/* 国际化处理： 应付系统*/
		} else if (source_flag == '10') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000029'), value: source_flag } });/* 国际化处理： 信贷系统*/
		} else if (source_flag == '107') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000030'), value: source_flag } });/* 国际化处理： 费用管理*/
		} else if (source_flag == '20') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000031'), value: source_flag } });/* 国际化处理： 合同*/
		} else if (source_flag == '3') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000032'), value: source_flag } });/* 国际化处理： 销售系统*/
		} else if (source_flag == '4') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000033'), value: source_flag } });/* 国际化处理： 采购系统*/
		}
}

/*iz7qixbqGe6t3wrLqHEcjUZQOSo207HLfiwR0CoKz9ZktgJmXq/2KoOvpXP6s5jn*/