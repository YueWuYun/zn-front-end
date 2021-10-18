/*dmbd6ptagzQfukDfr4cExBJoMuSxjg5JrtpGVa5Elj6MDxDU+Uoe54Jh3wpc/VOh*/
/**
 * 设置来源系统
 * @param {*} source_flag 来源系统编码
 * @param {*} fileName 来源系统编码字段名称
 */
export const srcSourceLanguage = function (source_flag, fileName) {
	//处理来源系统显示值
	let MutiLange = this.props.MutiInit.getIntl("36070");
	if (source_flag == '2') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000050'), value: source_flag } });/* 国际化处理： 现金管理*/
	} else if (source_flag == '5') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000051'), value: source_flag } });/* 国际化处理： 资金结算*/
	} else if (source_flag == '6') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000052'), value: source_flag } });/* 国际化处理： 网上银行*/
	} else if (source_flag == '8') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000053'), value: source_flag } });/* 国际化处理： 票据管理*/
	} else if (source_flag == '9') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000054'), value: source_flag } });/* 国际化处理： 协同单据*/
	} else if (source_flag == '104') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000055'), value: source_flag } });/* 国际化处理： 资产管理*/
	} else if (source_flag == '105') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000056'), value: source_flag } });/* 国际化处理： 网上报销*/
	} else if (source_flag == '0') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000057'), value: source_flag } });/* 国际化处理： 应收系统*/
	} else if (source_flag == '1') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000058'), value: source_flag } });/* 国际化处理： 应付系统*/
	} else if (source_flag == '10') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000059'), value: source_flag } });/* 国际化处理： 信贷系统*/
	} else if (source_flag == '107') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000060'), value: source_flag } });/* 国际化处理： 费用管理*/
	} else if (source_flag == '20') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000061'), value: source_flag } });/* 国际化处理： 合同*/
	} else if (source_flag == '3') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000062'), value: source_flag } });/* 国际化处理： 销售系统*/
	} else if (source_flag == '4') {
		this.props.form.setFormItemsValue(this.formId, { fileName: { display: MutiLange && MutiLange.get('36070-000063'), value: source_flag } });/* 国际化处理： 采购系统*/
	}
}

/*dmbd6ptagzQfukDfr4cExBJoMuSxjg5JrtpGVa5Elj6MDxDU+Uoe54Jh3wpc/VOh*/