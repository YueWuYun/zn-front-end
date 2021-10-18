/*iz7qixbqGe6t3wrLqHEcjUZQOSo207HLfiwR0CoKz9ZktgJmXq/2KoOvpXP6s5jn*/
import { createPage, ajax, base, high, toast, cardCache, print, output } from 'nc-lightapp-front';

/**
 * [收款结算]-设置来源系统
 * @param {*} source_flag 来源系统编码
 */ 
export const setSourceFlag = function (source_flag) {
  
		if (source_flag == '2') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000087')), value: source_flag } });/* 国际化处理： 现金管理*/
		} else if (source_flag == '5') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000088')), value: source_flag } });/* 国际化处理： 资金结算*/
		} else if (source_flag == '6') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000089')), value: source_flag } });/* 国际化处理： 网上银行*/
		} else if (source_flag == '8') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000090')), value: source_flag } });/* 国际化处理： 票据管理*/
		} else if (source_flag == '9') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000091')), value: source_flag } });/* 国际化处理： 协同单据*/
		} else if (source_flag == '104') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000092')), value: source_flag } });/* 国际化处理： 资产管理*/
		} else if (source_flag == '105') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000093')), value: source_flag } });/* 国际化处理： 网上报销*/
		} else if (source_flag == '0') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000094')), value: source_flag } });/* 国际化处理： 应收系统*/
		} else if (source_flag == '1') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000095')), value: source_flag } });/* 国际化处理： 应付系统*/
		} else if (source_flag == '10') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000096')), value: source_flag } });/* 国际化处理： 信贷系统*/
		} else if (source_flag == '107') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000097')), value: source_flag } });/* 国际化处理： 费用管理*/
		} else if (source_flag == '20') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000098')), value: source_flag } });/* 国际化处理： 合同*/
		} else if (source_flag == '3') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000099')), value: source_flag } });/* 国际化处理： 销售系统*/
		} else if (source_flag == '4') {
			this.props.form.setFormItemsValue(this.formId, { 'source_flag': { display: (this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000100')), value: source_flag } });/* 国际化处理： 采购系统*/
		}
}

/*iz7qixbqGe6t3wrLqHEcjUZQOSo207HLfiwR0CoKz9ZktgJmXq/2KoOvpXP6s5jn*/