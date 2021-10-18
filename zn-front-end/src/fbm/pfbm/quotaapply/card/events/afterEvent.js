/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { base, ajax, promptBox } from 'nc-lightapp-front';

import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventDataOld = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) };

	if (key === 'pk_org') {
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this, value, eventData);
		} else if (value.value !== oldValue.value) {
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36180QA") && this.props.MutiInit.getIntl("36180QA").get('36180QA-000000'),/* 国际化处理： 修改财务组织*/
				content: this.props.MutiInit.getIntl("36180QA") && this.props.MutiInit.getIntl("36180QA").get('36180QA-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
				beSureBtnClick: () => {
					changeOrg.call(this, value, eventData);
				},
				cancelBtnClick: () => {
					props.form.setFormItemsValue(this.formId, { 'pk_org': oldValue });
				}
			});
		}
	}
	else if (key === 'pk_currtype' || key === "applydate" || key === 'applymoney' || key === "olcrate" || key === "glcrate" || key === "gllcrate") { //币种 + 申请日期
		if (!value.value) {
			return;
		}
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);

			});
		}
	}
	cardEvent.creditAfterEvent.call(this, currentItem, {
		// creditBank: 'creditorg', //授信银行
		// creditCurrency: 'creditcurrency', //授信币种
		// creditOccupy: 'creditoccupy', //授信占用额度
		// creditOlcOccupy: 'oldcreditoccupy', //授信占用本币额度				
	}); //授信信息编辑后事件

}

function changeOrg(value, eventData) {
	cardEvent.changeOrg.call(this, value).then(() => {
		if (value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			}).then(() => {

			});
		}
	})
}

function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, extParam, bodyItemProps, headItemProps } = data;
	// props.form.EmptyAllFormValue(this.formId);
	// props.form.setFormItemsValue(this.formId, { 'note': { value: '', display: '' } });
	props.form.setAllFormValue({ [this.formId]: card.head[this.formId] });
	setHeadItemProp(props, this.formId, headItemProps);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/